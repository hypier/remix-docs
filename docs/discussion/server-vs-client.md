---
title: 服务器与客户端代码执行
order: 5
---

# 服务器与客户端代码执行

Remix 在服务器和浏览器中运行您的应用程序。然而，并不是所有代码都会在这两个地方运行。

在构建步骤中，编译器会创建服务器构建和客户端构建。服务器构建将所有内容打包成一个单一模块（或者在使用 [server bundles][server-bundles] 时打包成多个模块），而客户端构建则将您的应用拆分成多个包，以优化浏览器中的加载。它还会从包中移除服务器代码。

以下路由导出及其使用的依赖项会从客户端构建中移除：

- [`action`][action]
- [`headers`][headers]
- [`loader`][loader]

考虑上一节中的这个路由模块：

```tsx filename=routes/settings.tsx
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "@remix-run/node"; // 或者 cloudflare/deno
import { json } from "@remix-run/node"; // 或者 cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import { getUser, updateUser } from "../user";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const user = await getUser(request);
  return json({
    displayName: user.displayName,
    email: user.email,
  });
}

export default function Component() {
  const user = useLoaderData<typeof loader>();
  return (
    <Form action="/account">
      <h1>Settings for {user.displayName}</h1>

      <input
        name="displayName"
        defaultValue={user.displayName}
      />
      <input name="email" defaultValue={user.email} />

      <button type="submit">Save</button>
    </Form>
  );
}

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const user = await getUser(request);

  await updateUser(user.id, {
    email: formData.get("email"),
    displayName: formData.get("displayName"),
  });

  return json({ ok: true });
}
```

服务器构建将在最终包中包含整个模块。然而，客户端构建将移除 `action`、`headers` 和 `loader` 以及依赖项，结果如下：

```tsx filename=routes/settings.tsx
import { useLoaderData } from "@remix-run/react";

export default function Component() {
  const user = useLoaderData();
  return (
    <Form action="/account">
      <h1>Settings for {user.displayName}</h1>

      <input
        name="displayName"
        defaultValue={user.displayName}
      />
      <input name="email" defaultValue={user.email} />

      <button type="submit">Save</button>
    </Form>
  );
}
```

## 拆分客户端和服务器代码

开箱即用，Vite 不支持在同一模块中混合服务器专用代码和客户端安全代码。Remix 能够为路由做出例外，因为我们知道哪些导出是服务器专用的，并可以将它们从客户端中移除。

在 Remix 中，有几种方法可以隔离服务器专用代码。最简单的方法是使用 [`.server`][file_convention_server] 和 [`.client`][file_convention_client] 模块。

#### `.server` 模块

虽然不是严格必要的，[`.server` 模块][file_convention_server] 是明确标记整个模块为服务器专用的好方法。如果 `.server` 文件或 `.server` 目录中的任何代码意外出现在客户端模块图中，构建将失败。

```txt
app
├── .server 👈 将该目录中的所有文件标记为服务器专用
│   ├── auth.ts
│   └── db.ts
├── cms.server.ts 👈 将该文件标记为服务器专用
├── root.tsx
└── routes
    └── _index.tsx
```

`.server` 模块必须位于您的 Remix 应用目录内。

<docs-warning>`.server` 目录仅在使用 [Remix Vite][remix-vite] 时受支持。[Classic Remix Compiler][classic-remix-compiler] 仅支持 `.server` 文件。</docs-warning>

#### `.client` 模块

您可能依赖于客户端库，这些库在服务器上甚至不安全地打包——也许它通过简单导入尝试访问 [`window`][window_global]。

您可以通过将 `*.client.ts` 附加到文件名或将其嵌套在 `.client` 目录中来从服务器构建中移除这些模块的内容。

<docs-warning>`.client` 目录仅在使用 [Remix Vite][remix-vite] 时受支持。[Classic Remix Compiler][classic-remix-compiler] 仅支持 `.client` 文件。</docs-warning>

#### vite-env-only

如果您想在同一模块中混合服务器专用代码和客户端安全代码，可以使用 <nobr>[vite-env-only][vite-env-only]</nobr>。此 Vite 插件允许您明确标记任何表达式为服务器专用，以便在客户端中替换为 `undefined`。

例如，一旦您将插件添加到您的 [Vite 配置][vite-config] 中，您可以用 `serverOnly$` 包裹任何服务器专用的导出：

```tsx
import { serverOnly$ } from "vite-env-only";

import { db } from "~/.server/db";

export const getPosts = serverOnly$(async () => {
  return db.posts.findMany();
});

export const PostPreview = ({ title, description }) => {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
};
```

这个示例将被编译成以下客户端代码：

```tsx
export const getPosts = undefined;

export const PostPreview = ({ title, description }) => {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
};
```

[action]: ../route/action
[headers]: ../route/headers
[loader]: ../route/loader
[file_convention_client]: ../file-conventions/-client
[file_convention_server]: ../file-conventions/-server
[window_global]: https://developer.mozilla.org/en-US/docs/Web/API/Window/window
[server-bundles]: ../guides/server-bundles
[vite-config]: ../file-conventions/vite-config
[vite-env-only]: https://github.com/pcattori/vite-env-only
[classic-remix-compiler]: ../guides/vite#classic-remix-compiler-vs-remix-vite
[remix-vite]: ../guides/vite