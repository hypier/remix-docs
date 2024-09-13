---
title: 博客教程（短）
order: 3
hidden: true
---

# 博客教程

在这个快速入门中，我们将简洁明了，快速上手代码。如果你想在15分钟内了解Remix的全部内容，这就是了。

<docs-info>与Kent一起完成这个教程，参见<a target="_blank" rel="noopener noreferrer" href="https://rmx.as/egghead-course">这个免费的Egghead.io课程</a></docs-info>

本教程使用TypeScript。Remix确实可以在没有TypeScript的情况下使用。我们在编写TypeScript时感到最有效率，但如果你更喜欢跳过TypeScript语法，可以随意用JavaScript编写代码。

<docs-info>💿 嘿，我是Remix光盘的Derrick 👋 每当你应该_做_某事时，你会看到我</docs-info>

## 前提条件

点击此按钮以创建一个 [Gitpod][gitpod] 工作区，项目已设置并准备在 VS Code 或 JetBrains 中运行，可以直接在浏览器或桌面上进行。

[![Gitpod Ready-to-Code][gitpod-ready-to-code]][gitpod-ready-to-code-image]

如果您想在自己的计算机上本地跟随本教程，您需要安装以下内容：

- [Node.js][node-js] 版本 (>=18.0.0)
- [npm][npm] 7 或更高版本
- 一个代码编辑器（[VSCode][vs-code] 是一个不错的选择）

## 创建项目

<docs-warning>确保您运行的是 Node v18 或更高版本</docs-warning>

💿 初始化一个新的 Remix 项目。我们将其命名为“blog-tutorial”，但您可以根据自己的需要选择其他名称。

```shellscript nonumber
npx create-remix@latest --template remix-run/indie-stack blog-tutorial
```

```
使用 npm 安装依赖项？
是
```

您可以在 [the stacks docs][the-stacks-docs] 中了解更多关于可用堆栈的信息。

我们使用 [the Indie stack][the-indie-stack]，这是一个可以部署到 [fly.io][fly-io] 的完整应用程序。这包括开发工具以及生产就绪的身份验证和持久性。如果您对所使用的工具不熟悉，请不要担心，我们会在过程中为您讲解。

<docs-info>请注意，您也可以通过运行 `npx create-remix@latest` 而不带 `--template` 标志来从“仅基础”开始。这样生成的项目会更加简约。然而，教程中的某些部分对您来说会有所不同，您将需要手动配置部署。</docs-info>

💿 现在，打开您首选的编辑器中的生成项目，并检查 `README.md` 文件中的说明。请随意阅读。我们将在教程后面讨论部署部分。

💿 让我们启动开发服务器：

```shellscript nonumber
npm run dev
```

💿 打开 [http://localhost:3000][http-localhost-3000]，应用程序应该正在运行。

如果您愿意，可以花一点时间浏览一下 UI。请随意创建一个帐户并创建/删除一些笔记，以了解开箱即用的 UI 中提供了哪些功能。

## 你的第一个路由

我们将创建一个新的路由，以在 "/posts" URL 上渲染。在此之前，让我们链接到它。

💿 在 `app/routes/_index.tsx` 中添加一个指向帖子（posts）的链接

请复制/粘贴以下内容：

```tsx filename=app/routes/_index.tsx
<div className="mx-auto mt-16 max-w-7xl text-center">
  <Link
    to="/posts"
    className="text-xl text-blue-600 underline"
  >
    博客文章
  </Link>
</div>
```

你可以将其放置在任何你喜欢的地方。我将其放在所有技术图标的上方：

<!-- TODO: 一旦网站可以正常部署，更新为使用我们自托管的此图像版本 -->

<!-- ![Screenshot of the app showing the blog post link](/blog-tutorial/blog-post-link.png) -->

![Screenshot of the app showing the blog post link][screenshot-of-the-app-showing-the-blog-post-link]

<docs-info>你可能注意到我们使用了 <a href="https://tailwindcss.com">Tailwind CSS</a> 类。</docs-info>

Remix Indie 堆栈已预配置 [Tailwind CSS][tailwind] 支持。如果你不想使用 Tailwind CSS，可以将其移除并使用其他样式。了解更多关于 Remix 的样式选项，请参见 [样式指南][the-styling-guide]。

在浏览器中，点击链接。你应该会看到一个 404 页面，因为我们还没有创建这个路由。现在让我们创建这个路由：

💿 在 `app/routes/posts._index.tsx` 中创建一个新文件

```shellscript nonumber
touch app/routes/posts._index.tsx
```

<docs-info>每当你看到终端命令来创建文件或文件夹时，你当然可以以任何你喜欢的方式进行，但使用 `touch` 只是为了让我们明确你应该创建哪些文件。</docs-info>

我们本可以将其命名为 `posts.tsx`，但我们很快会有另一个路由，将它们放在一起会更好。索引路由将在父路径下渲染（就像 web 服务器上的 `index.html` 一样）。

现在，如果你导航到 `/posts` 路由，你会收到一个错误，表示没有办法处理该请求。这是因为我们还没有在该路由中做任何事情！让我们添加一个组件并将其作为默认导出：

💿 创建帖子组件

```tsx filename=app/routes/posts._index.tsx
export default function Posts() {
  return (
    <main>
      <h1>帖子</h1>
    </main>
  );
}
```

你可能需要刷新浏览器以查看我们新的、基础的帖子路由。

## 加载数据

数据加载是 Remix 内置的功能。

如果你的网页开发背景主要是在过去几年，你可能习惯在这里创建两样东西：一个 API 路由来提供数据和一个前端组件来消费数据。在 Remix 中，前端组件也是它自己的 API 路由，并且它已经知道如何从浏览器与服务器进行通信。也就是说，你不需要去获取它。

如果你的背景稍微早于此，使用的是像 Rails 这样的 MVC 网络框架，那么你可以将 Remix 路由视为使用 React 进行模板化的后端视图，但它们知道如何在浏览器中无缝地水合，以增加一些风格，而不是编写分离的 jQuery 代码来美化用户交互。这是渐进增强的充分实现。此外，你的路由也是它们自己的控制器。

那么我们开始吧，给我们的组件提供一些数据。

💿 使帖子路由 `loader`

```tsx filename=app/routes/posts._index.tsx lines=[1-2,4-17,20-21]
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  return json({
    posts: [
      {
        slug: "my-first-post",
        title: "My First Post",
      },
      {
        slug: "90s-mixtape",
        title: "A Mixtape I Made Just For You",
      },
    ],
  });
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Posts</h1>
    </main>
  );
}
```

`loader` 函数是其组件的后端 "API"，并且通过 `useLoaderData` 已经为你连接好了。在 Remix 路由中，客户端和服务器之间的界限是多么模糊。如果你同时打开服务器和浏览器控制台，你会注意到它们都记录了我们的帖子数据。这是因为 Remix 在服务器上渲染以发送完整的 HTML 文档，就像传统的网络框架，但它也在客户端进行了水合，并在那里记录了数据。

<docs-error>
无论你从 loader 返回什么，都将暴露给客户端，即使组件没有渲染它。像对待公共 API 端点一样小心对待你的 loaders。
</docs-error>

💿 渲染我们帖子的链接

```tsx filename=app/routes/posts._index.tsx lines=[2,10-21] nocopy
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

// ...
export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.slug}
              className="text-blue-600 underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

嘿，这真不错。即使在网络请求中，我们也获得了相当高的类型安全性，因为所有内容都在同一个文件中定义。除非网络在 Remix 获取数据时崩溃，否则你在这个组件及其 API 中都拥有类型安全性（记住，组件已经是它自己的 API 路由）。

## 一点重构

一个好的实践是创建一个处理特定问题的模块。在我们的案例中，它将处理读取和写入帖子。现在让我们设置这个模块，并添加一个 `getPosts` 导出。

💿 创建 `app/models/post.server.ts`

```shellscript nonumber
touch app/models/post.server.ts
```

我们主要将从我们的路由中复制/粘贴内容：

```tsx filename=app/models/post.server.ts
type Post = {
  slug: string;
  title: string;
};

export async function getPosts(): Promise<Array<Post>> {
  return [
    {
      slug: "my-first-post",
      title: "My First Post",
    },
    {
      slug: "90s-mixtape",
      title: "A Mixtape I Made Just For You",
    },
  ];
}
```

请注意，我们将 `getPosts` 函数设为 `async`，因为尽管它目前没有执行任何异步操作，但很快就会有！

💿 更新帖子路由以使用我们的新帖子模块：

```tsx filename=app/routes/posts._index.tsx lines=[4,6-8] nocopy
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/models/post.server";

export const loader = async () => {
  return json({ posts: await getPosts() });
};

// ...
```

## 从数据源提取数据

使用 Indie Stack，我们已经设置并配置了一个 SQLite 数据库，因此让我们更新我们的数据库模式以处理 SQLite。我们使用 [Prisma][prisma] 与数据库进行交互，因此我们将更新该模式，Prisma 将为我们处理数据库的更新，以匹配模式（以及生成和运行迁移所需的 SQL 命令）。

<docs-info>在使用 Remix 时，您不必使用 Prisma。Remix 与您当前使用的任何现有数据库或数据持久性服务都能很好地配合。</docs-info>

如果您以前从未使用过 Prisma，请不用担心，我们会引导您完成。

💿 首先，我们需要更新我们的 Prisma 模式：

```prisma filename=prisma/schema.prisma nocopy
// 将此内容添加到文件底部：

model Post {
  slug     String @id
  title    String
  markdown String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

💿 让我们为我们的模式更改生成一个迁移文件，如果您部署应用程序而不仅仅是在本地以开发模式运行，这将是必需的。这也将更新我们的本地数据库和 TypeScript 定义以匹配模式更改。我们将把迁移命名为“create post model”。

```shellscript nonumber
npx prisma migrate dev --name "create post model"
```

💿 让我们用几篇文章来填充我们的数据库。打开 `prisma/seed.ts` 并在种子功能的末尾添加以下内容（在 `console.log` 之前）：

```ts filename=prisma/seed.ts
const posts = [
  {
    slug: "my-first-post",
    title: "My First Post",
    markdown: `
# 这是我的第一篇文章

这不是很棒吗？
    `.trim(),
  },
  {
    slug: "90s-mixtape",
    title: "我为你制作的混音带",
    markdown: `
# 90年代混音带

- 我希望 (Skee-Lo)
- 这就是我们做的方式 (Montell Jordan)
- Everlong (Foo Fighters)
- Ms. Jackson (Outkast)
- Interstate Love Song (Stone Temple Pilots)
- 用他的歌温柔地杀死我 (Fugees, Ms. Lauryn Hill)
- 只是朋友 (Biz Markie)
- 售卖世界的人 (Nirvana)
- 半魅生活 (Third Eye Blind)
- ...Baby One More Time (Britney Spears)
- 更好的男人 (Pearl Jam)
- 这一切都回到我身边 (Céline Dion)
- 这个吻 (Faith Hill)
- 飞走 (Lenny Kravits)
- 疤痕组织 (Red Hot Chili Peppers)
- 圣塔莫尼卡 (Everclear)
- 来吧，骑上它 (Quad City DJ's)
    `.trim(),
  },
];

for (const post of posts) {
  await prisma.post.upsert({
    where: { slug: post.slug },
    update: post,
    create: post,
  });
}
```

<docs-info>请注意，我们使用 `upsert`，这样您可以反复运行种子脚本，而不会每次添加多个相同文章的版本。</docs-info>

很好，让我们通过种子脚本将这些文章放入数据库：

```
npx prisma db seed
```

💿 现在更新 `app/models/post.server.ts` 文件以从 SQLite 数据库读取数据：

```ts filename=app/models/post.server.ts
import { prisma } from "~/db.server";

export async function getPosts() {
  return prisma.post.findMany();
}
```

<docs-success>请注意，我们能够去掉返回类型，但所有内容仍然是完全类型化的。Prisma 的 TypeScript 功能是其最大的优势之一。减少手动输入，但仍然类型安全！</docs-success>

<docs-info>`~/db.server` 导入的是 `app/db.server.ts` 文件。`~` 是一个巧妙的别名，指向 `app` 目录，因此您不必担心在移动文件时需要包含多少个 `../../`。</docs-info>

您应该能够访问 `http://localhost:3000/posts`，文章仍然应该在那里，但现在它们来自 SQLite！

## 动态路由参数

现在让我们创建一个路由来实际查看帖子。我们希望这些 URL 可以正常工作：

```
/posts/my-first-post
/posts/90s-mixtape
```

我们可以在 URL 中使用“动态段”，而不是为每一个帖子创建一个路由。Remix 会解析并传递给我们，以便我们可以动态查找帖子。

💿 在 `app/routes/posts.$slug.tsx` 创建一个动态路由

```shellscript nonumber
touch app/routes/posts.\$slug.tsx
```

```tsx filename=app/routes/posts.$slug.tsx
export default function PostSlug() {
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        Some Post
      </h1>
    </main>
  );
}
```

您可以点击您的帖子之一，应该会看到新页面。

💿 添加一个加载器以访问参数

```tsx filename=app/routes/posts.$slug.tsx lines=[1-3,5-9,12,16]
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  return json({ slug: params.slug });
};

export default function PostSlug() {
  const { slug } = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        Some Post: {slug}
      </h1>
    </main>
  );
}
```

文件名中附加的 `$` 部分会成为传入加载器的 `params` 对象上的命名键。这就是我们查找博客帖子的方式。

现在，让我们通过其 slug 从数据库中实际获取帖子内容。

💿 向我们的帖子模块添加 `getPost` 函数

```tsx filename=app/models/post.server.ts lines=[7-9]
import { prisma } from "~/db.server";

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}
```

💿 在路由中使用新的 `getPost` 函数

```tsx filename=app/routes/posts.$slug.tsx lines=[5,10-11,15,19]
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getPost } from "~/models/post.server";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const post = await getPost(params.slug);
  return json({ post });
};

export default function PostSlug() {
  const { post } = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        {post.title}
      </h1>
    </main>
  );
}
```

看看这个！我们现在从数据源中获取帖子，而不是将所有内容都包含在浏览器中的 JavaScript。

让我们让 TypeScript 对我们的代码满意：

```tsx filename=app/routes/posts.$slug.tsx lines=[4,11,14]
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPost } from "~/models/post.server";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.slug, "params.slug is required");

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  return json({ post });
};

export default function PostSlug() {
  const { post } = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        {post.title}
      </h1>
    </main>
  );
}
```

关于 `invariant` 的快速说明。由于 `params` 来自 URL，我们不能完全确定 `params.slug` 会被定义——也许您将文件名更改为 `posts.$postId.ts`！验证这些内容是一个好习惯，并且它也让 TypeScript 满意。

我们还有一个不变的条件用于帖子。我们稍后会更好地处理 `404` 情况。继续前进！

现在让我们解析并渲染 markdown 到页面。市场上有很多 Markdown 解析器，我们将使用 `marked`，因为它非常容易使用。

💿 将 markdown 解析为 HTML

```shellscript nonumber
npm add marked@^4.3.0
# 另外，如果使用 typescript
npm add @types/marked@^4.3.1 -D
```

现在 `marked` 已经安装，我们需要重启服务器。所以停止开发服务器并使用 `npm run dev` 重新启动。

```tsx filename=app/routes/posts.$slug.tsx lines=[4,17-18,22,28]
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import invariant from "tiny-invariant";

import { getPost } from "~/models/post.server";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.slug, "params.slug is required");

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  const html = marked(post.markdown);
  return json({ html, post });
};

export default function PostSlug() {
  const { html, post } = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        {post.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
```

太棒了，您做到了。您有一个博客。看看吧！接下来，我们将使创建新博客帖子变得更容易 📝

## 嵌套路由

现在，我们的博客文章只是通过填充数据库而来。这并不是一个真正的解决方案，所以我们需要一种方法在数据库中创建新的博客文章。我们将为此使用动作。

让我们为应用程序创建一个新的“管理员”部分。

💿 首先，让我们在帖子索引路由上添加一个指向管理员部分的链接：

```tsx filename=app/routes/posts._index.tsx
// ...
<Link to="admin" className="text-red-600 underline">
  Admin
</Link>
// ...
```

可以将其放置在组件中的任何位置。我将其放在了 `<h1>` 下面。

<docs-info>你注意到 `to` 属性只是 "admin"，它链接到了 `/posts/admin` 吗？使用 Remix，你可以获得相对链接。</docs-info>

💿 在 `app/routes/posts.admin.tsx` 创建一个管理员路由：

```shellscript nonumber
touch app/routes/posts.admin.tsx
```

```tsx filename=app/routes/posts.admin.tsx
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/models/post.server";

export const loader = async () => {
  return json({ posts: await getPosts() });
};

export default function PostAdmin() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">
        Blog Admin
      </h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={post.slug}
                  className="text-blue-600 underline"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          ...
        </main>
      </div>
    </div>
  );
}
```

你应该能认出我们在里面做的几件事情与我们迄今为止所做的相似。这样，你应该有一个看起来不错的页面，左侧是帖子，右侧是占位符。现在，如果你点击管理员链接，它将带你到 [http://localhost:3000/posts/admin][http-localhost-3000-posts-admin]。

### 索引路由

让我们用一个管理员的索引路由填充那个占位符。请耐心等待，我们在这里引入“嵌套路由”，您的路由文件嵌套将变为 UI 组件嵌套。

💿 为 `posts.admin.tsx` 的子路由创建一个索引路由

```shellscript nonumber
touch app/routes/posts.admin._index.tsx
```

```tsx filename=app/routes/posts.admin._index.tsx
import { Link } from "@remix-run/react";

export default function AdminIndex() {
  return (
    <p>
      <Link to="new" className="text-blue-600 underline">
        创建新帖子
      </Link>
    </p>
  );
}
```

如果您刷新页面，您还看不到它。每个以 `app/routes/posts.admin.` 开头的路由现在可以在其 URL 匹配时渲染到 `app/routes/posts.admin.tsx` 中。您可以控制子路由渲染到 `posts.admin.tsx` 布局的哪个部分。

💿 在管理页面添加一个插槽

```tsx filename=app/routes/posts.admin.tsx lines=[4,37]
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
} from "@remix-run/react";

import { getPosts } from "~/models/post.server";

export const loader = async () => {
  return json({ posts: await getPosts() });
};

export default function PostAdmin() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">
        博客管理
      </h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={post.slug}
                  className="text-blue-600 underline"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

请稍等片刻，索引路由一开始可能会让人困惑。只需知道，当 URL 匹配父路由的路径时，索引将渲染到 `Outlet` 中。

也许这会有所帮助，让我们添加 `/posts/admin/new` 路由，看看当我们点击链接时会发生什么。

💿 创建 `app/routes/posts.admin.new.tsx` 文件

```shellscript nonumber
touch app/routes/posts.admin.new.tsx
```

```tsx filename=app/routes/posts.admin.new.tsx
export default function NewPost() {
  return <h2>新帖子</h2>;
}
```

现在从索引路由点击链接，看看 `<Outlet/>` 如何自动将索引路由替换为“新”路由！

## 操作

现在我们要认真起来了。让我们在新的“新”路由中构建一个创建新帖子的表单。

💿 在新路由中添加表单

```tsx filename=app/routes/posts.admin.new.tsx
import { Form } from "@remix-run/react";

const inputClassName =
  "w-full rounded border border-gray-500 px-2 py-1 text-lg";

export default function NewPost() {
  return (
    <Form method="post">
      <p>
        <label>
          帖子标题：{" "}
          <input
            type="text"
            name="title"
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label>
          帖子别名：{" "}
          <input
            type="text"
            name="slug"
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown: </label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          创建帖子
        </button>
      </p>
    </Form>
  );
}
```

如果你像我们一样喜欢HTML，你应该感到非常兴奋。如果你一直在使用 `<form onSubmit>` 和 `<button onClick>`，那么HTML将会让你大开眼界。

对于这样的功能，你所需要的就是一个表单来获取用户数据，以及一个后端操作来处理它。在Remix中，你也只需这样做。

让我们先在 `post.ts` 模块中创建保存帖子的基本代码。

💿 在 `app/models/post.server.ts` 中的任何地方添加 `createPost`

```tsx filename=app/models/post.server.ts nocopy
// ...
export async function createPost(post) {
  return prisma.post.create({ data: post });
}
```

💿 从新帖子路由的操作中调用 `createPost`

```tsx filename=app/routes/posts.admin.new.tsx lines=[1-2,5,7-19] nocopy
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { createPost } from "~/models/post.server";

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  await createPost({ title, slug, markdown });

  return redirect("/posts/admin");
};

// ...
```

就这样。Remix（和浏览器）会处理其余的。点击提交按钮，看看列出我们帖子的小工具是否会自动更新。

在HTML中，输入的 `name` 属性会通过网络传输，并在请求的 `formData` 中以相同的名称可用。哦，别忘了，`request` 和 `formData` 对象都是直接来自网络规范的。所以如果你想了解更多关于它们的信息，请访问MDN！

- [`Request`][mdn-request]
- [`Request.formData`][mdn-request-form-data].

TypeScript又发疯了，让我们添加一些类型。

💿 将类型添加到 `app/models/post.server.ts`

```tsx filename=app/models/post.server.ts lines=[2,7]
// ...
import type { Post } from "@prisma/client";

// ...

export async function createPost(
  post: Pick<Post, "slug" | "title" | "markdown">
) {
  return prisma.post.create({ data: post });
}
```

无论你是否使用TypeScript，当用户没有提供某些字段的值时，我们都会遇到问题（而且TS仍然对调用 `createPost` 感到不满）。

让我们在创建帖子之前添加一些验证。

💿 验证表单数据是否包含我们需要的内容，如果没有则返回错误

```tsx filename=app/routes/posts.admin.new.tsx lines=[2,16-26]
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { createPost } from "~/models/post.server";

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors = {
    title: title ? null : "标题是必填项",
    slug: slug ? null : "别名是必填项",
    markdown: markdown ? null : "Markdown是必填项",
  };
  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
  );
  if (hasErrors) {
    return json(errors);
  }

  await createPost({ title, slug, markdown });

  return redirect("/posts/admin");
};

// ...
```

注意这次我们没有返回重定向，而是返回了错误。这些错误可以通过 `useActionData` 在组件中访问。它就像 `useLoaderData`，但数据来自于表单POST后的操作。

💿 将验证消息添加到UI

```tsx filename=app/routes/posts.admin.new.tsx lines=[3,11,18-20,27-29,36-40]
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

// ...

const inputClassName =
  "w-full rounded border border-gray-500 px-2 py-1 text-lg";

export default function NewPost() {
  const errors = useActionData<typeof action>();

  return (
    <Form method="post">
      <p>
        <label>
          帖子标题：{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          帖子别名：{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input type="text" name="slug" className={inputClassName} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:{" "}
          {errors?.markdown ? (
            <em className="text-red-600">
              {errors.markdown}
            </em>
          ) : null}
        </label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          创建帖子
        </button>
      </p>
    </Form>
  );
}
```

TypeScript仍然不满意，因为有人可能会用非字符串值调用我们的API，所以让我们添加一些不变式来让它满意。

```tsx filename=app/routes/posts.admin.new.tsx nocopy
//...
import invariant from "tiny-invariant";
// ..

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  // ...
  invariant(
    typeof title === "string",
    "标题必须是字符串"
  );
  invariant(
    typeof slug === "string",
    "别名必须是字符串"
  );
  invariant(
    typeof markdown === "string",
    "Markdown必须是字符串"
  );

  await createPost({ title, slug, markdown });

  return redirect("/posts/admin");
};
```

## 渐进增强

为了获得一些真正的乐趣，[在开发工具中禁用 JavaScript][disable-java-script] 并试试看。因为 Remix 是建立在 HTTP 和 HTML 基础之上的，这一切在浏览器中没有 JavaScript 也能正常工作 🤯 但这不是重点。它的酷之处在于这意味着我们的 UI 对网络问题具有韧性。不过我们确实 _喜欢_ 在浏览器中使用 JavaScript，并且有很多酷炫的事情可以在有 JavaScript 的情况下做，所以在继续之前一定要重新启用 JavaScript，因为我们接下来需要它来 _渐进增强_ 用户体验。

让我们放慢速度，为我们的表单添加一些“待处理 UI”。

💿 用假延迟放慢我们的操作

```tsx filename=app/routes/posts.admin.new.tsx lines=[5-6]
// ...
export const action = async ({
  request,
}: ActionFunctionArgs) => {
  // TODO: remove me
  await new Promise((res) => setTimeout(res, 1000));

  // ...
};
//...
```

💿 用 `useNavigation` 添加一些待处理 UI

```tsx filename=app/routes/posts.admin.new.tsx lines=[6,14-17,26,28]
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigation,
} from "@remix-run/react";

// ..

export default function NewPost() {
  const errors = useActionData<typeof action>();

  const navigation = useNavigation();
  const isCreating = Boolean(
    navigation.state === "submitting"
  );

  return (
    <Form method="post">
      {/* ... */}
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isCreating}
        >
          {isCreating ? "正在创建..." : "创建帖子"}
        </button>
      </p>
    </Form>
  );
}
```

好了！你刚刚实现了启用 JavaScript 的渐进增强！ 🥳 通过我们所做的，体验比浏览器单独能做到的要好。很多应用使用 JavaScript 来 _启用_ 体验（而且只有少数确实需要 JavaScript 才能工作），但我们有一个可用的体验作为基础，只是使用 JavaScript 来 _增强_ 它。

## 作业

今天就到这里！如果你想深入了解，这里有一些作业可以实现：

**更新/删除帖子：** 为你的帖子创建一个 `posts.admin.$slug.tsx` 页面。这应该打开一个编辑页面，允许你更新帖子或甚至删除它。侧边栏中已经有链接，但它们返回404！创建一个新路由来读取帖子，并将它们放入字段中。你所需的所有代码已经在 `app/routes/posts.$slug.tsx` 和 `app/routes/posts.admin.new.tsx` 中。你只需将它们组合在一起即可。

**乐观UI：** 你知道当你喜欢一条推文时，心形图标会立即变红，而如果推文被删除，它会恢复为空吗？这就是乐观UI：假设请求会成功，并渲染用户在成功时会看到的内容。所以你的作业是，当你点击“创建”时，它会在左侧导航中渲染帖子，并渲染“创建新帖子”链接（或者如果你添加了更新/删除，也要为这些做）。你会发现这比你想象的要简单，即使你需要一些时间才能到达那里（如果你过去实现过这个模式，你会发现Remix使这变得更容易）。从[待处理UI指南][the-pending-ui-guide]中了解更多。

**仅限认证用户：** 你可以做的另一个很酷的作业是让只有认证用户才能创建帖子。感谢Indie Stack，你已经设置好了认证。提示：如果你想让自己成为唯一可以创建帖子的用户，只需在你的加载器和操作中检查用户的电子邮件，如果不是你的，就将他们重定向到[某个地方][somewhere] 😈

**自定义应用：** 如果你对Tailwind CSS满意，可以继续使用它，否则请查看[样式指南][the-styling-guide]以了解其他选项。删除 `Notes` 模型和路由等。无论你想做什么，让这个东西成为你的。

**部署应用：** 查看你项目的README。它有你可以遵循的说明，以便将你的应用部署到Fly.io。然后你就可以开始博客写作了！

我们希望你喜欢Remix！💿 👋

[gitpod]: https://gitpod.io
[gitpod-ready-to-code-image]: https://gitpod.io/#https://github.com/remix-run/indie-stack
[gitpod-ready-to-code]: https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod
[node-js]: https://nodejs.org
[npm]: https://www.npmjs.com
[vs-code]: https://code.visualstudio.com
[the-stacks-docs]: ../guides/templates#stacks
[the-indie-stack]: https://github.com/remix-run/indie-stack
[fly-io]: https://fly.io
[http-localhost-3000]: http://localhost:3000
[screenshot-of-the-app-showing-the-blog-post-link]: https://user-images.githubusercontent.com/1500684/160208939-34fe20ed-3146-4f4b-a68a-d82284339c47.png
[tailwind]: https://tailwindcss.com
[the-styling-guide]: ../styling/tailwind
[prisma]: https://prisma.io
[http-localhost-3000-posts-admin]: http://localhost:3000/posts/admin
[mdn-request]: https://developer.mozilla.org/en-US/docs/Web/API/Request
[mdn-request-form-data]: https://developer.mozilla.org/en-US/docs/Web/API/Request/formData
[disable-java-script]: https://developer.chrome.com/docs/devtools/javascript/disable
[the-pending-ui-guide]: ../discussion/pending-ui
[somewhere]: https://www.youtube.com/watch?v=dQw4w9WgXcQ