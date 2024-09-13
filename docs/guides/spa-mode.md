---
title: SPA模式
---

# SPA 模式

从一开始，Remix 的观点始终是您拥有自己的服务器架构。这就是为什么 Remix 建立在 [Web Fetch API][fetch] 之上，并且可以通过内置或社区提供的适配器在任何现代 [runtime][runtimes] 上运行。虽然我们相信拥有服务器为 _大多数_ 应用程序提供了最佳的用户体验/性能/SEO 等，但不可否认的是，现实世界中确实存在许多有效的单页应用程序用例：

- 您不想管理服务器，更愿意通过静态文件在 Github Pages 或其他 CDN 上部署您的应用
- 您不想运行 Node.js 服务器
- 您想要将 [React Router 应用迁移][migrate-rr] 到 Remix
- 您正在开发一种特殊类型的嵌入式应用，无法进行服务器渲染
- “您的老板根本不关心 SPA 架构的用户体验上限，也不会给您的开发团队时间/能力来重新架构” [- Kent C. Dodds][kent-tweet]

这就是为什么我们在 [2.5.0][2.5.0] ([RFC][rfc]) 中添加了对 **SPA 模式** 的支持，该模式在 [Client Data][client-data] API 的基础上进行了大量构建。

<docs-info>SPA 模式要求您的应用使用 Vite 和 [Remix Vite 插件][remix-vite]</docs-info>

## 什么是 SPA 模式？

SPA 模式基本上就是如果你使用 `createBrowserRouter`/`RouterProvider` 自己搭建的 [React Router + Vite][rr-setup] 配置，但还附带一些额外的 Remix 功能：

- 基于文件的路由（或通过 [`routes()`][routes-config] 的配置路由）
- 通过 [`route.lazy`][route-lazy] 自动进行基于路由的代码分割
- `<Link prefetch>` 支持，提前预取路由模块
- 通过 Remix [`<Meta>`][meta]/[`<Links>`][links] API 进行 `<head>` 管理

SPA 模式告诉 Remix，你不打算在运行时运行 Remix 服务器，并且希望在构建时生成一个静态的 `index.html` 文件，并且你将仅使用 [Client Data][client-data] API 进行数据加载和变更。

`index.html` 是从你的 `root.tsx` 路由中的 `HydrateFallback` 组件生成的。生成 `index.html` 的初始 "渲染" 不会包含任何比根更深的路由。这确保了 `index.html` 文件可以为 `/` 之外的路径（即 `/about`）提供服务/水合，如果你配置你的 CDN/服务器来这样做。

## 使用方法

您可以通过仓库中的 SPA 模板快速入门：

```shellscript
npx create-remix@latest --template remix-run/remix/templates/spa
```

或者，您可以通过在 Remix+Vite 应用中将 `ssr: false` 设置在 Remix Vite 插件配置中手动选择 SPA 模式：

```js
// vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      ssr: false,
    }),
  ],
});
```

### 开发

在 SPA 模式下，您可以像开发传统的 Remix SSR 应用一样进行开发，实际上您需要使用正在运行的 Remix 开发服务器来启用 HMR/HDR：

```sh
npx remix vite:dev
```

### 生产

当您以 SPA 模式构建应用时，Remix 会调用 `/` 路由的服务器处理程序，并将渲染的 HTML 保存到 `index.html` 文件中，连同您的客户端资源（默认路径为 `build/client/index.html`）。

```sh
npx remix vite:build
```

#### 预览

您可以使用 [vite preview][vite-preview] 在本地预览生产构建：

```shellscript
npx vite preview
```

<docs-warning>`vite preview` 不适合用作生产服务器</docs-warning>

#### 部署

要部署，您可以从任何您选择的 HTTP 服务器提供您的应用。服务器应配置为从单个根 `/index.html` 文件提供多个路径（通常称为“SPA 回退”）。如果服务器不直接支持此功能，可能需要其他步骤。

作为一个简单的示例，您可以使用 [sirv-cli][sirv-cli]：

```shellscript
npx sirv-cli build/client/ --single
```

或者，如果您通过 `express` 服务器提供服务（尽管在那种情况下您可能想考虑直接以 SSR 模式运行 Remix 😉）：

```js
app.use("/assets", express.static("build/client/assets"));
app.get("*", (req, res, next) =>
  res.sendFile(
    path.join(process.cwd(), "build/client/index.html"),
    next
  )
);
```

## 仅为 div 进行水合，而不是整个文档

如果您不想水合整个 HTML `document`，可以选择使用 SPA 模式，仅水合文档的子部分，例如 `<div id="app">`，只需进行一些小修改。

**1. 添加 `index.html` 文件**

由于 Remix 不会渲染 HTML 文档，您需要在 Remix 之外提供该 HTML。最简单的方法是保持一个 `app/index.html` 文档，其中包含一个占位符，您可以在构建时用 Remix 渲染的 HTML 替换它，以生成最终的 `index.html`。

```html filename=app/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My Cool App!</title>
  </head>
  <body>
    <div id="app"><!-- Remix SPA --></div>
  </body>
</html>
```

`<!-- Remix SPA -->` HTML 注释是我们将用 Remix HTML 替换的部分。

<docs-info>由于空格在 DOM/VDOM 树中是有意义的 - 因此重要的是不要在它和周围的 `div` 周围包含任何空格，否则您将遇到 React 水合问题</docs-info>

**2. 更新 `root.tsx`**

更新您的根路由，以仅渲染 `<div id="app">` 的内容：

```tsx filename=app/root.tsx
export function HydrateFallback() {
  return (
    <>
      <p>加载中...</p>
      <Scripts />
    </>
  );
}

export default function Component() {
  return (
    <>
      <Outlet />
      <Scripts />
    </>
  );
}
```

**3. 更新 `entry.server.tsx`**

在您的 `app/entry.server.tsx` 文件中，您需要将 Remix 渲染的 HTML 插入到静态的 `app/index.html` 文件占位符中。您还需要停止像默认的 `entry.server.tsx` 文件那样预先添加 `<!DOCTYPE html>` 声明，因为它应该在您的 `app/index.html` 文件中。

```tsx filename=app/entry.server.tsx
import fs from "node:fs";
import path from "node:path";

import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const shellHtml = fs
    .readFileSync(
      path.join(process.cwd(), "app/index.html")
    )
    .toString();

  const appHtml = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  const html = shellHtml.replace(
    "<!-- Remix SPA -->",
    appHtml
  );

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
    status: responseStatusCode,
  });
}
```

<docs-info>如果您当前没有 `app/entry.server.tsx` 文件，您可能需要运行 `npx remix reveal`</docs-info>

**4. 更新 `entry.client.tsx`**

更新 `app/entry.client.tsx` 以水合 `<div id="app">`，而不是文档：

```tsx filename=app/entry.client.tsx
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document.querySelector("#app"),
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
```

<docs-info>如果您当前没有 `app/entry.client.tsx` 文件，您可能需要运行 `npx remix reveal`</docs-info>

## 注意事项/警告

- SPA 模式仅在使用 Vite 和 [Remix Vite 插件][remix-vite] 时有效

- 你不能使用服务器 API，例如 `headers`、`loader` 和 `action` -- 如果你导出它们，构建将抛出错误

- 在 SPA 模式下，你只能从 `root.tsx` 导出一个 `HydrateFallback` -- 如果你从其他路由导出一个，将抛出构建错误。

- 由于没有正在运行的服务器，你不能在 `clientLoader`/`clientAction` 方法中调用 `serverLoader`/`serverAction` -- 如果调用，将抛出运行时错误

### 服务器构建

重要的是要注意，Remix SPA 模式通过在构建期间对根路由进行“预渲染”来生成您的 `index.html` 文件。

- 这意味着在创建 SPA 时，您仍然需要进行“服务器构建”和“服务器渲染”步骤，因此您需要小心使用引用仅限客户端的依赖项，例如 `document`、`window`、`localStorage` 等。
- 一般来说，解决这些问题的方法是从 `entry.client.tsx` 导入任何仅限浏览器的库，以便它们不会出现在服务器构建中。
- 否则，您通常可以通过使用 [`React.lazy`][react-lazy] 或 `remix-utils` 中的 [`<ClientOnly>`][client-only] 组件来解决这些问题。

### CJS/ESM 依赖问题

如果您在应用程序依赖项中遇到 ESM/CJS 问题，您可能需要调整 Vite [ssr.noExternal][vite-ssr-noexternal] 选项，以将某些依赖项包含在您的服务器包中：

```ts filename=vite.config.ts lines=[12-15]
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      ssr: false,
    }),
    tsconfigPaths(),
  ],
  ssr: {
    // 将 `problematic-dependency` 打包到服务器构建中
    noExternal: ["problematic-dependency"],
  },
  // ...
});
```

这些问题通常是由于某些依赖项的发布代码对 CJS/ESM 配置不正确造成的。通过将特定依赖项包含在 `ssr.noExternal` 中，Vite 将把该依赖项打包到服务器构建中，从而有助于避免在运行服务器时出现运行时导入问题。

如果您的用例正好相反，并且您特别想将依赖项保持在包外，您可以使用相反的 [`ssr.external`][vite-ssr-external] 选项。

## 从 React Router 迁移

我们也期望 SPA 模式能够帮助用户将现有的 React Router 应用迁移到 Remix 应用（无论是否为 SPA）。

迁移的第一步是让您当前的 React Router 应用在 `vite` 上运行，以便您可以使用所需的插件来处理非 JS 代码（即 CSS、SVG 等）。

**如果您当前使用的是 `BrowserRouter`**

一旦您使用了 vite，您应该能够按照 [本指南][migrating-rr] 的步骤将 `BrowserRouter` 应用放入一个通用的 Remix 路由中。

**如果您当前使用的是 `RouterProvider`**

如果您当前使用的是 `RouterProvider`，那么最佳的做法是将您的路由移动到单独的文件中，并通过 `route.lazy` 加载它们：

- 根据 Remix 文件约定为这些文件命名，以便更容易迁移到 Remix（SPA）
- 将您的路由组件导出为命名的 `Component` 导出（用于 RR），同时也导出一个 `default` 导出（供 Remix 最终使用）

一旦您将所有路由放在自己的文件中，您可以：

- 将这些文件移动到 Remix 的 `app/` 目录
- 启用 SPA 模式
- 将所有 `loader`/`action` 函数重命名为 `clientLoader`/`clientAction`
- 用一个导出 `default` 组件和 `HydrateFallback` 的 `app/root.tsx` 路由替换您的 React Router `index.html` 文件

[rfc]: https://github.com/remix-run/remix/discussions/7638
[client-data]: ../guides/client-data
[2.5.0]: https://github.com/remix-run/remix/blob/main/CHANGELOG.md#v250
[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[runtimes]: ../discussion/runtimes
[kent-tweet]: https://twitter.com/kentcdodds/status/1743030378334708017
[rr-setup]: https://reactrouter.com/en/main/start/tutorial#setup
[routes-config]: ../file-conventions/remix-config#routes
[route-lazy]: https://reactrouter.com/en/main/route/lazy
[meta]: ../components/meta
[links]: ../components/links
[migrating-rr]: https://remix.run/docs/en/main/guides/migrating-react-router-app
[remix-vite]: ./vite
[migrate-rr]: #migrating-from-react-router
[react-lazy]: https://react.dev/reference/react/lazy
[client-only]: https://github.com/sergiodxa/remix-utils?tab=readme-ov-file#clientonly
[vite-preview]: https://vitejs.dev/guide/cli#vite-preview
[sirv-cli]: https://www.npmjs.com/package/sirv-cli
[vite-ssr-noexternal]: https://vitejs.dev/config/ssr-options#ssr-noexternal
[vite-ssr-external]: https://vitejs.dev/config/ssr-options#ssr-external