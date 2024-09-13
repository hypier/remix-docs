---
title: MDX
description: Remix 使将 MDX 集成到您的项目中变得轻而易举，内置路由和“导入”支持。
---

# MDX

<docs-warning>本文件仅在使用[Classic Remix Compiler][classic-remix-compiler]时相关。希望使用MDX的Vite用户应使用[MDX Rollup (and Vite) plugin][mdx-plugin]。</docs-warning>

虽然我们认为数据和展示的强分离很重要，但我们理解像[MDX][mdx]（带嵌入JSX组件的Markdown）这样的混合格式已成为开发者流行且强大的创作格式。

<docs-info>与本文档演示的在构建时编译内容相比，通常在运行时通过类似<a href="https://github.com/kentcdodds/mdx-bundler">mdx-bundler</a>的方式进行编译会提供更好的用户体验和开发体验。不过，如果您更倾向于在构建时进行此编译，请继续阅读。</docs-info>

Remix内置了在构建时使用MDX的两种方式：

- 您可以将`.mdx`文件用作您的路由模块之一
- 您可以将`.mdx`文件`import`到您的路由模块之一（在`app/routes`中）

## 路由

在 Remix 中开始使用 MDX 的最简单方法是创建一个路由模块。就像 `app/routes` 目录中的 `.tsx`、`.js` 和 `.jsx` 文件一样，`.mdx`（和 `.md`）文件也将参与自动文件系统路由。

MDX 路由允许您定义元数据和头部，就像它们是基于代码的路由一样：

```md
---
meta:
  - title: My First Post
  - name: description
    content: Isn't this awesome?
headers:
  Cache-Control: no-cache
---

# Hello Content!
```

上述文档中 `---` 之间的行称为“前置数据”。您可以将它们视为文档的元数据，格式为 [YAML][yaml]。

您可以通过全局 `attributes` 变量在您的 MDX 中引用前置数据字段：

```mdx
---
componentData:
  label: Hello, World!
---

import SomeComponent from "~/components/some-component";

# Hello MDX!

<SomeComponent {...attributes.componentData} />
```

### 示例

通过创建 `app/routes/posts.first-post.mdx` 我们可以开始撰写博客文章：

```mdx
---
meta:
  - title: My First Post
  - name: description
    content: Isn't this just awesome?
---

# 示例 Markdown 文章

You can reference your frontmatter data through "attributes". The title of this post is {attributes.meta.title}!
```

### 高级示例

您甚至可以在您的 mdx 文件中导出此模块中的所有其他内容，就像在常规路由模块中一样，例如 `loader`、`action` 和 `handle`：

```mdx
---
meta:
  - title: My First Post
  - name: description
    content: Isn't this awesome?

headers:
  Cache-Control: no-cache

handle:
  someData: abc
---

import styles from "./first-post.css";

export const links = () => [
  { rel: "stylesheet", href: styles },
];

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  return json({ mamboNumber: 5 });
};

export function ComponentUsingData() {
  const { mamboNumber } = useLoaderData<typeof loader>();
  return <div id="loader">Mambo Number: {mamboNumber}</div>;
}

# 这是一些 markdown！

<ComponentUsingData />
```

## 模块

除了路由级别的 MDX 文件之外，您还可以像常规 JavaScript 模块一样在任何地方导入这些文件。

当您 `import` 一个 `.mdx` 文件时，模块的导出包括：

- **default**: 可供使用的 React 组件
- **attributes**: 作为对象的前置数据
- **filename**: 源文件的基本名称（例如 "first-post.mdx"）

```tsx
import Component, {
  attributes,
  filename,
} from "./first-post.mdx";
```

## 示例博客用法

以下示例演示了如何使用 MDX 构建一个简单的博客，包括每个帖子的单独页面和一个显示所有帖子的索引页面。

```tsx filename=app/routes/_index.tsx
import { json } from "@remix-run/node"; // 或 cloudflare/deno
import { Link, useLoaderData } from "@remix-run/react";

// 从 app/routes/posts 目录导入所有帖子。由于这些是
// 常规路由模块，它们都可以在 /posts/a 等路径下单独查看。
import * as postA from "./posts/a.mdx";
import * as postB from "./posts/b.md";
import * as postC from "./posts/c.md";

function postFromModule(mod) {
  return {
    slug: mod.filename.replace(/\.mdx?$/, ""),
    ...mod.attributes.meta,
  };
}

export async function loader() {
  // 返回每个帖子的元数据以便在索引页面上显示。
  // 在这里引用帖子而不是在下面的 Index 组件中
  // 可以避免将实际的帖子本身打包到索引页面的包中。
  return json([
    postFromModule(postA),
    postFromModule(postB),
    postFromModule(postC),
  ]);
}

export default function Index() {
  const posts = useLoaderData<typeof loader>();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link to={post.slug}>{post.title}</Link>
          {post.description ? (
            <p>{post.description}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
```

显然，这并不是一个适合拥有数千篇帖子的博客的可扩展解决方案。现实来说，写作是困难的，因此如果你的博客开始出现内容过多的问题，那是一个很棒的问题。如果你达到了 100 篇帖子（恭喜！），我们建议你重新考虑你的策略，将你的帖子转化为存储在数据库中的数据，这样你就不必每次修复错别字时都重建和重新部署你的博客。你甚至可以继续使用 MDX 和 [MDX Bundler][mdx-bundler]。

## 高级配置

如果您希望配置自己的 remark 插件，可以通过 `remix.config.js` 的 `mdx` 导出进行配置：

```js filename=remix.config.js
const {
  remarkMdxFrontmatter,
} = require("remark-mdx-frontmatter");

// can be an sync / async function or an object
exports.mdx = async (filename) => {
  const [rehypeHighlight, remarkToc] = await Promise.all([
    import("rehype-highlight").then((mod) => mod.default),
    import("remark-toc").then((mod) => mod.default),
  ]);

  return {
    remarkPlugins: [remarkToc],
    rehypePlugins: [rehypeHighlight],
  };
};
```

[mdx-plugin]: https://mdxjs.com/packages/rollup  
[mdx]: https://mdxjs.com  
[yaml]: https://yaml.org  
[mdx-bundler]: https://github.com/kentcdodds/mdx-bundler  
[classic-remix-compiler]: ./vite#classic-remix-compiler-vs-remix-vite