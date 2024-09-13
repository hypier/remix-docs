---
title: 未来标志
order: 5
---

# 未来标志

以下未来标志是稳定的，可以采用。要了解有关未来标志的更多信息，请参阅 [Development Strategy][development-strategy]

## 更新到最新的 v2.x

首先更新到最新的 v2.x 次要版本，以获取最新的未来标志。

👉 **更新到最新的 v2**

```shellscript nonumber
npm install @remix-run/{dev,react,node,etc.}@2
```

## Vite 插件

**背景**

Remix 不再使用其自己的封闭编译器（现在称为“经典编译器”），而是使用 [Vite][vite]。Vite 是一个强大、高效且可扩展的 JavaScript 项目开发环境。有关性能、故障排除等更多信息，请查看 [Vite 文档][vite-docs]。

虽然这不是一个未来标志，但新功能和一些功能标志仅在 Vite 插件中可用，经典编译器将在 Remix 的下一个版本中被移除。

👉 **安装 Vite**

```shellscript nonumber
npm install -D vite
```

**更新你的代码**

👉 **在 Remix 应用的根目录中，将 `remix.config.js` 替换为 `vite.config.ts`**

```ts filename=vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [remix()],
});
```

支持的 [Remix 配置选项][supported-remix-config-options] 子集应直接传递给插件：

```ts filename=vite.config.ts lines=[3-5]
export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
    }),
  ],
});
```

👉 **移除 `<LiveReload/>`，保留 `<Scripts />`**

```diff
  import {
-   LiveReload,
    Outlet,
    Scripts,
  }

  export default function App() {
    return (
      <html>
        <head>
        </head>
        <body>
          <Outlet />
-         <LiveReload />
          <Scripts />
        </body>
      </html>
    )
  }
```

👉 **更新 `tsconfig.json`**

更新 `tsconfig.json` 中的 `types` 字段，并确保 `skipLibCheck`、`module` 和 `moduleResolution` 都正确设置。

```json filename=tsconfig.json lines=[3-6]
{
  "compilerOptions": {
    "types": ["@remix-run/node", "vite/client"],
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler"
  }
}
```

👉 **更新/移除 `remix.env.d.ts`**

移除 `remix.env.d.ts` 中的以下类型声明：

```diff filename=remix.env.d.ts
- /// <reference types="@remix-run/dev" />
- /// <reference types="@remix-run/node" />
```

如果 `remix.env.d.ts` 现在为空，则删除它。

```shellscript nonumber
rm remix.env.d.ts
```

**配置路径别名**

Vite 默认不提供任何路径别名。如果你依赖于此功能，例如将 `~` 定义为 `app` 目录的别名，你可以安装 [vite-tsconfig-paths][vite-tsconfig-paths] 插件，以便在 Vite 中自动解析来自 `tsconfig.json` 的路径别名，匹配 Remix 编译器的行为：

👉 **安装 `vite-tsconfig-paths`**

```shellscript nonumber
npm install -D vite-tsconfig-paths
```

👉 **将 `vite-tsconfig-paths` 添加到你的 Vite 配置中**

```ts filename=vite.config.ts lines=[3,6]
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
});
```

**移除 `@remix-run/css-bundle`**

Vite 内置支持 CSS 副作用导入、PostCSS 和 CSS 模块，以及其他 CSS 打包功能。Remix Vite 插件会自动将打包的 CSS 附加到相关路由。

在使用 Vite 时，<nobr>[`@remix-run/css-bundle`][css-bundling]</nobr> 包是多余的，因为它的 `cssBundleHref` 导出将始终为 `undefined`。

👉 **卸载 `@remix-run/css-bundle`**

```shellscript nonumber
npm uninstall @remix-run/css-bundle
```

👉 **移除对 `cssBundleHref` 的引用**

```diff filename=app/root.tsx
- import { cssBundleHref } from "@remix-run/css-bundle";
  import type { LinksFunction } from "@remix-run/node"; // 或 cloudflare/deno

  export const links: LinksFunction = () => [
-   ...(cssBundleHref
-     ? [{ rel: "stylesheet", href: cssBundleHref }]
-     : []),
    // ...
  ];
```

**修正 `links` 中引用的 CSS 导入**

如果你在 [links 函数中引用 CSS][regular-css]，你需要更新相应的 CSS 导入，以使用 [Vite 的显式 `?url` 导入语法。][vite-url-imports]

👉 **在 `links` 中使用 CSS 导入时添加 `?url`**

```diff
-import styles from "~/styles/dashboard.css";
+import styles from "~/styles/dashboard.css?url";

export const links = () => {
  return [
    { rel: "stylesheet", href: styles }
  ];
}
```

**迁移 Tailwind CSS 或 Vanilla Extract**

如果你正在使用 Tailwind CSS 或 Vanilla Extract，请参阅 [完整迁移指南][migrate-css-frameworks]。

**从 Remix 应用服务器迁移**

👉 **更新你的 `dev`、`build` 和 `start` 脚本**

```json filename=package.json lines=[3-5]
{
  "scripts": {
    "dev": "remix vite:dev",
    "build": "remix vite:build",
    "start": "remix-serve ./build/server/index.js"
  }
}
```

👉 **在你的 Vite 配置中安装全局 Node polyfills**

```diff filename=vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
+import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";

+installGlobals();

export default defineConfig({
  plugins: [remix()],
});
```

👉 **配置你的 Vite 开发服务器端口（可选）**

```js filename=vite.config.ts lines=[2-4]
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [remix()],
});
```

**迁移自定义服务器**

如果你正在迁移自定义服务器或 Cloudflare 函数，请参阅 [完整迁移指南][migrate-a-custom-server]。

**迁移 MDX 路由**

如果你正在使用 [MDX][mdx]，你应该使用官方的 [MDX Rollup 插件][mdx-rollup-plugin]。请参阅 [完整迁移指南][migrate-mdx] 以获取逐步指导。

## v3_fetcherPersist

**背景**

fetcher 的生命周期现在基于它返回到空闲状态的时间，而不是它的拥有组件卸载的时间：[查看 RFC][fetcherpersist-rfc] 以获取更多信息。

👉 **启用标志**

```ts
remix({
  future: {
    v3_fetcherPersist: true,
  },
});
```

**更新您的代码**

这不太可能影响您的应用程序。您可能需要检查任何 `useFetchers` 的使用情况，因为它们可能比以前持久更长。根据您的操作，您可能会渲染比以前更长的内容。

## v3_relativeSplatPath

**背景**

更改多段 splat 路径的相对路径匹配和链接，例如 `dashboard/*`（与仅 `*` 相比）。有关更多信息，请查看 [CHANGELOG][relativesplatpath-changelog]。

👉 **启用标志**

```ts
remix({
  future: {
    v3_relativeSplatPath: true,
  },
});
```

**更新您的代码**

如果您有任何路径 + splat 的路由，例如 `dashboard.$.tsx` 或 `route("dashboard/*")`，并且在其下有相对链接，如 `<Link to="relative">` 或 `<Link to="../relative">`，您需要更新您的代码。

👉 **将路由拆分为两个**

对于任何 splat 路由，将其拆分为一个布局路由和一个带有 splat 的子路由：

```diff

└── routes
    ├── _index.tsx
+   ├── dashboard.tsx
    └── dashboard.$.tsx

// 或
routes(defineRoutes) {
  return defineRoutes((route) => {
    route("/", "home/route.tsx", { index: true });
-    route("dashboard/*", "dashboard/route.tsx")
+    route("dashboard", "dashboard/layout.tsx", () => {
+      route("*", "dashboard/route.tsx");
    });
  });
},
```

👉 **更新相对链接**

更新该路由树中任何带有相对链接的 `<Link>` 元素，以包含额外的 `..` 相对段，以继续链接到相同位置：

```diff
// dashboard.$.tsx 或 dashboard/route.tsx
function Dashboard() {
  return (
    <div>
      <h2>仪表板</h2>
      <nav>
-        <Link to="">仪表板主页</Link>
-        <Link to="team">团队</Link>
-        <Link to="projects">项目</Link>
+        <Link to="../">仪表板主页</Link>
+        <Link to="../team">团队</Link>
+        <Link to="../projects">项目</Link>
      </nav>
    </div>
  );
}
```

## v3_throwAbortReason

**背景**

当服务器端请求被中止时，例如当用户在加载器完成之前离开页面，Remix 将抛出 `request.signal.reason`，而不是像 `new Error("query() call aborted...")` 这样的错误。

👉 **启用标志**

```ts
remix({
  future: {
    v3_throwAbortReason: true,
  },
});
```

**更新您的代码**

您可能不需要调整任何代码，除非您在 `handleError` 中有自定义逻辑，用于匹配先前的错误消息以区分其他错误。

## unstable_singleFetch

选择 [Single Fetch][single-fetch] 行为（详细信息将在标志稳定后扩展）。

## unstable_lazyRouteDiscovery

选择 [Lazy Route Discovery][lazy-route-discovery] 行为（详细信息将在标志稳定后扩展）。

## unstable_optimizeDeps

在开发过程中选择自动 [dependency optimization][dependency-optimization]。

[development-strategy]: ../guides/api-development-strategy  
[fetcherpersist-rfc]: https://github.com/remix-run/remix/discussions/7698  
[relativesplatpath-changelog]: https://github.com/remix-run/remix/blob/main/CHANGELOG.md#futurev3_relativesplatpath  
[single-fetch]: ../guides/single-fetch  
[lazy-route-discovery]: ../guides/lazy-route-discovery  
[vite]: https://vitejs.dev  
[vite-docs]: ../guides/vite  
[supported-remix-config-options]: ../file-conventions/vite-config  
[migrate-css-frameworks]: ../guides/vite#enable-tailwind-via-postcss  
[migrate-a-custom-server]: ../guides/vite#migrating-a-custom-server  
[migrate-mdx]: ../guides/vite#add-mdx-plugin  
[vite-tsconfig-paths]: https://github.com/aleclarson/vite-tsconfig-paths  
[css-bundling]: ../styling/bundling  
[regular-css]: ../styling/css  
[vite-url-imports]: https://vitejs.dev/guide/assets.html#explicit-url-imports  
[mdx]: https://mdxjs.com  
[mdx-rollup-plugin]: https://mdxjs.com/packages/rollup  
[dependency-optimization]: ../guides/dependency-optimization