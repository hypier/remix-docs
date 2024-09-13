---
title: Tailwind
---

# Tailwind

<docs-warning>此文档仅在使用 [Classic Remix Compiler][classic-remix-compiler] 时相关。如果您使用的是 [Remix Vite][remix-vite]，可以通过 [Vite 的内置 PostCSS 支持][vite-postcss] 集成 Tailwind。</docs-warning>

在社区中，最流行的为 Remix 应用程序添加样式的方法可能是使用 [Tailwind CSS][tailwind]。

如果项目根目录中存在 `tailwind.config.js`，Remix 会自动支持 Tailwind。您可以在 [Remix Config][remix_config] 中禁用它。

Tailwind 具有内联样式共存的优点，有助于提高开发人员的舒适度，并能够生成供 Remix 导入的 CSS 文件。即使对于大型应用程序，生成的 CSS 文件通常也能保持在合理的大小范围内。将该文件加载到 `app/root.tsx` 的链接中即可。

如果您没有任何 CSS 偏好，这是一种很好的方法。

要使用 Tailwind，首先将其安装为开发依赖：

```shellscript nonumber
npm install -D tailwindcss
```

然后初始化一个配置文件：

```shellscript nonumber
npx tailwindcss init --ts
```

现在我们可以告诉它从哪些文件生成类：

```ts filename=tailwind.config.ts lines=[4]
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

然后在您的 CSS 中包含 `@tailwind` 指令。例如，您可以在应用程序的根目录创建一个 `tailwind.css` 文件：

```css filename=app/tailwind.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

然后将 `tailwind.css` 添加到根路由的 `links` 函数中：

```tsx filename=app/root.tsx
import type { LinksFunction } from "@remix-run/node"; // 或 cloudflare/deno

// ...

import styles from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];
```

有了这个设置，您还可以在 CSS 中的任何地方使用 [Tailwind 的函数和指令][tailwind-functions-and-directives]。请注意，如果您之前从未使用过 Tailwind，它会警告您在源文件中未检测到任何实用类。

默认情况下，Tailwind 不为旧版浏览器编译 CSS，因此如果您希望使用基于 PostCSS 的工具如 [Autoprefixer][autoprefixer] 实现这一点，您需要利用 Remix 的 [内置 PostCSS 支持][built-in-post-css-support]。在同时使用 PostCSS 和 Tailwind 时，如果缺少 Tailwind 插件，它将自动包含，但如果您愿意，也可以选择手动在 PostCSS 配置中包含 Tailwind 插件。

如果您使用 VS Code，建议安装 [Tailwind IntelliSense 扩展][tailwind-intelli-sense-extension] 以获得最佳的开发体验。

## 避免使用 Tailwind 的 `@import` 语法

建议您避免使用 Tailwind 的 `@import` 语法（例如 `@import 'tailwindcss/base'`），而使用 Tailwind 指令（例如 `@tailwind base`）。

Tailwind 用内联 CSS 替换其导入语句，但这可能导致样式和导入语句交错。这与所有导入语句必须位于文件开头的限制相冲突。

另外，您可以使用 [PostCSS][built-in-post-css-support] 和 [postcss-import] 插件，在将导入传递给 esbuild 之前处理导入。

[tailwind]: https://tailwindcss.com
[remix_config]: ../file-conventions/remix-config#tailwind
[tailwind-functions-and-directives]: https://tailwindcss.com/docs/functions-and-directives
[autoprefixer]: https://github.com/postcss/autoprefixer
[built-in-post-css-support]: ./postcss
[tailwind-intelli-sense-extension]: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
[postcss-import]: https://github.com/postcss/postcss-import
[classic-remix-compiler]: ../guides/vite#classic-remix-compiler-vs-remix-vite
[remix-vite]: ../guides/vite
[vite-postcss]: https://vitejs.dev/guide/features#postcss