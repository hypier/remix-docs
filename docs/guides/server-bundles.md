---
title: 服务器捆绑包
---

# 服务器捆绑包

<docs-warning>这是一个为托管提供商集成设计的高级功能。当将您的应用程序编译为多个服务器捆绑包时，需要在您的应用程序前面有一个自定义路由层，将请求定向到正确的捆绑包。</docs-warning>

Remix 通常将您的服务器代码构建为一个捆绑包，暴露一个单一的请求处理函数。然而，有些场景中，您可能希望将路由树拆分为多个服务器捆绑包，这些捆绑包为一部分路由暴露请求处理函数。为了提供这种灵活性，[Remix Vite 插件][remix-vite] 支持一个 `serverBundles` 选项，这是一个用于将路由分配到不同服务器捆绑包的函数。

提供的 `serverBundles` 函数会为树中的每个路由调用（除了不可寻址的路由，例如无路径布局路由），并返回您希望将其分配给的服务器捆绑包 ID。这些捆绑包 ID 将用作您服务器构建目录中的目录名称。

对于每个路由，此函数会传递一个包含到达该路由的路由数组，包括该路由，称为路由 `branch`。这使您能够为路由树的不同部分创建服务器捆绑包。例如，您可以使用它来创建一个包含特定布局路由内所有路由的单独服务器捆绑包：

```ts filename=vite.config.ts lines=[7-15]
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      serverBundles: ({ branch }) => {
        const isAuthenticatedRoute = branch.some((route) =>
          route.id.split("/").includes("_authenticated")
        );

        return isAuthenticatedRoute
          ? "authenticated"
          : "unauthenticated";
      },
    }),
  ],
});
```

`branch` 数组中的每个 `route` 包含以下属性：

- `id` — 此路由的唯一 ID，命名方式与其 `file` 相似，但相对于应用程序目录且不带扩展名，例如 `app/routes/gists.$username.tsx` 的 `id` 为 `routes/gists.$username`。
- `path` — 此路由用于匹配 URL 路径名的路径。
- `file` — 此路由的入口点的绝对路径。
- `index` — 此路由是否为索引路由。

## 构建清单

当构建完成后，Remix 将调用 Vite 插件的 `buildEnd` 钩子，并传递一个 `buildManifest` 对象。如果您需要检查构建清单以确定如何将请求路由到正确的服务器包，这将非常有用。

```ts filename=vite.config.ts lines=[8-10]
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      // ...
      buildEnd: async ({ buildManifest }) => {
        // ...
      },
    }),
  ],
});
```

使用服务器包时，构建清单包含以下属性：

- `serverBundles` — 一个将包 ID 映射到包的 `id` 和 `file` 的对象。
- `routeIdToServerBundleId` — 一个将路由 ID 映射到其服务器包 ID 的对象。
- `routes` — 一个路由清单，将路由 ID 映射到路由元数据。这可以用于在您的 Remix 请求处理程序前驱动自定义路由层。

或者，您可以在 Vite 插件上启用 `manifest` 选项，将此构建清单对象写入磁盘，路径为 `.remix/manifest.json`，位于您的构建目录中。

[remix-vite]: ./vite
[pathless-layout-route]: ../file-conventions/routes#nested-layouts-without-nested-urls