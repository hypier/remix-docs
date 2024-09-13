---
title: CSS 打包
---

# CSS 打包

<docs-warning>此文档仅在使用 [Classic Remix Compiler][classic-remix-compiler] 时相关。如果您使用的是 [Remix Vite][remix-vite]，请参考 [Vite 的 CSS 文档][vite-css]。</docs-warning>

Remix 中的一些 CSS 特性将样式打包成一个单独的文件，您需要手动加载到应用程序中，包括：

- [CSS 副作用导入][css-side-effect-imports]
- [CSS 模块][css-modules]
- [Vanilla Extract][vanilla-extract]

请注意，任何 [常规样式表导入][regular-stylesheet-imports] 将保持为单独的文件。

## 使用方法

Remix 不会自动将 CSS 包插入到页面中，以便您可以控制页面上的链接标签。

要获取 CSS 包，首先安装 `@remix-run/css-bundle` 包。

```shellscript nonumber
npm install @remix-run/css-bundle
```

然后，导入 `cssBundleHref` 并将其添加到链接描述符中——最有可能是在 `app/root.tsx` 中，以便它适用于整个应用程序。

```tsx filename=app/root.tsx
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node"; // 或 cloudflare/deno

export const links: LinksFunction = () => [
  ...(cssBundleHref
    ? [{ rel: "stylesheet", href: cssBundleHref }]
    : []),
  // ...
];
```

在页面中插入此链接标签后，您现在可以开始使用 Remix 内置的各种 CSS 打包功能。

## 限制

避免使用 `export *`，因为存在一个与 [esbuild 的 CSS 树摇晃][esbuild-css-tree-shaking-issue] 相关的问题。

[esbuild-css-tree-shaking-issue]: https://github.com/evanw/esbuild/issues/1370
[css-side-effect-imports]: ./css-imports
[css-modules]: ./css-modules
[vanilla-extract]: ./vanilla-extract
[regular-stylesheet-imports]: ./css
[classic-remix-compiler]: ../guides/vite#classic-remix-compiler-vs-remix-vite
[remix-vite]: ../guides/vite
[vite-css]: https://vitejs.dev/guide/features#css