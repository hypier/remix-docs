---
title: Vite
---

# Vite

[Vite][vite] 是一个强大、高性能且可扩展的 JavaScript 项目的开发环境。为了改善和扩展 Remix 的打包能力，我们现在支持 Vite 作为替代编译器。在未来，Vite 将成为 Remix 的默认编译器。

## Classic Remix Compiler vs. Remix Vite

现有的 Remix 编译器，通过 `remix build` 和 `remix dev` CLI 命令访问，并通过 `remix.config.js` 配置，现在被称为“Classic Remix Compiler”。

Remix Vite 插件以及 `remix vite:build` 和 `remix vite:dev` CLI 命令统称为“Remix Vite”。

今后，文档将假设使用 Remix Vite，除非另有说明。

## 开始使用

我们有几个不同的基于 Vite 的模板来帮助您入门。

```shellscript nonumber
# Minimal server:
npx create-remix@latest

# Express:
npx create-remix@latest --template remix-run/remix/templates/express

# Cloudflare:
npx create-remix@latest --template remix-run/remix/templates/cloudflare

# Cloudflare Workers:
npx create-remix@latest --template remix-run/remix/templates/cloudflare-workers
```

这些模板包含一个 `vite.config.ts` 文件，您可以在其中配置 Remix Vite 插件。

## 配置

Remix Vite 插件通过项目根目录下的 `vite.config.ts` 文件进行配置。有关更多信息，请参阅我们的 [Vite 配置文档][vite-config]。

## Cloudflare

要开始使用 Cloudflare，您可以使用 [`cloudflare`][template-cloudflare] 模板：

```shellscript nonumber
npx create-remix@latest --template remix-run/remix/templates/cloudflare
```

有两种方法可以在本地运行您的 Cloudflare 应用：

```shellscript nonumber
# Vite
remix vite:dev

# Wrangler
remix vite:build # 在运行 wrangler 之前构建应用
wrangler pages dev ./build/client
```

虽然 Vite 提供了更好的开发体验，但 Wrangler 通过在 [Cloudflare 的 `workerd` 运行时][cloudflare-workerd] 中运行您的服务器代码，提供了更接近 Cloudflare 环境的仿真。

#### Cloudflare 代理

要在 Vite 中模拟 Cloudflare 环境，Wrangler 提供了 [Node 代理到本地 `workerd` 绑定][wrangler-getplatformproxy]。
Remix 的 Cloudflare 代理插件为您设置这些代理：

```ts filename=vite.config.ts lines=[3,8]
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [remixCloudflareDevProxy(), remix()],
});
```

然后，代理可以在您的 `loader` 或 `action` 函数中的 `context.cloudflare` 中使用：

```ts
export const loader = ({ context }: LoaderFunctionArgs) => {
  const { env, cf, ctx } = context.cloudflare;
  // ... 更多加载代码在这里...
};
```

查看 [Cloudflare 的 `getPlatformProxy` 文档][wrangler-getplatformproxy-return] 以获取有关每个代理的更多信息。

#### 绑定

要为 Cloudflare 资源配置绑定：

- 对于使用 Vite 或 Wrangler 的本地开发，请使用 [wrangler.toml][wrangler-toml-bindings]
- 对于部署，请使用 [Cloudflare 控制面板][cloudflare-pages-bindings]

每当您更改 `wrangler.toml` 文件时，您需要运行 `wrangler types` 以重新生成绑定。

然后，您可以通过 `context.cloudflare.env` 访问您的绑定。
例如，绑定为 `MY_KV` 的 [KV 命名空间][cloudflare-kv]：

```ts filename=app/routes/_index.tsx
export async function loader({
  context,
}: LoaderFunctionArgs) {
  const { MY_KV } = context.cloudflare.env;
  const value = await MY_KV.get("my-key");
  return json({ value });
}
```

#### 增强加载上下文

如果您想向加载上下文添加其他属性，
您应该从共享模块导出 `getLoadContext` 函数，以便 **Vite、Wrangler 和 Cloudflare Pages 中的加载上下文都以相同的方式增强**：

```ts filename=load-context.ts lines=[1,4-9,20-33]
import { type AppLoadContext } from "@remix-run/cloudflare";
import { type PlatformProxy } from "wrangler";

// 使用 `wrangler.toml` 配置绑定时，
// `wrangler types` 将为这些绑定生成类型
// 到全局的 `Env` 接口中。
// 需要这个空接口，以便类型检查通过
// 即使没有 `wrangler.toml` 存在。
interface Env {}

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    extra: string; // 增强
  }
}

type GetLoadContext = (args: {
  request: Request;
  context: { cloudflare: Cloudflare }; // 增强之前的加载上下文
}) => AppLoadContext;

// 兼容 Vite、Wrangler 和 Cloudflare Pages 的共享实现
export const getLoadContext: GetLoadContext = ({
  context,
}) => {
  return {
    ...context,
    extra: "stuff",
  };
};
```

<docs-warning>您必须将 `getLoadContext` 传递给 **Cloudflare 代理插件和 `functions/[[path]].ts` 中的请求处理程序**，否则您将在运行应用时获得不一致的加载上下文增强。</docs-warning>

首先，将 `getLoadContext` 传递给 Vite 配置中的 Cloudflare 代理插件，以在运行 Vite 时增强加载上下文：

```ts filename=vite.config.ts lines=[8,12]
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { getLoadContext } from "./load-context";

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy({ getLoadContext }),
    remix(),
  ],
});
```

接下来，将 `getLoadContext` 传递给 `functions/[[path]].ts` 文件中的请求处理程序，以在运行 Wrangler 或部署到 Cloudflare Pages 时增强加载上下文：

```ts filename=functions/[[path]].ts lines=[5,9]
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

// @ts-ignore - 服务器构建文件由 `remix vite:build` 生成
import * as build from "../build/server";
import { getLoadContext } from "../load-context";

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext,
});
```

## 分离客户端和服务器端代码

Vite 对客户端和服务器端代码的混合使用处理方式与 Classic Remix 编译器不同。有关更多信息，请参阅我们关于 [分离客户端和服务器端代码][splitting-up-client-and-server-code] 的文档。

## 新构建输出路径

Vite 管理 `public` 目录的方式与现有的 Remix 编译器有显著差异。Vite 会将 `public` 目录中的文件复制到客户端构建目录，而 Remix 编译器则保持 `public` 目录不变，并使用一个子目录（`public/build`）作为客户端构建目录。

为了使默认的 Remix 项目结构与 Vite 的工作方式保持一致，构建输出路径已被更改。现在有一个单一的 `buildDirectory` 选项，默认值为 `"build"`，取代了单独的 `assetsBuildDirectory` 和 `serverBuildDirectory` 选项。这意味着，默认情况下，服务器现在编译到 `build/server`，客户端现在编译到 `build/client`。

这也意味着以下配置默认值已被更改：

- [publicPath][public-path] 被 [Vite 的 "base" 选项][vite-base] 取代，默认值为 `"/"` 而不是 `"/build/"`。
- [serverBuildPath][server-build-path] 被 `serverBuildFile` 取代，默认值为 `"index.js"`。该文件将写入您配置的 `buildDirectory` 中的服务器目录。

Remix 迁移到 Vite 的原因之一是为了在采用 Remix 时减少学习成本。这意味着，对于您希望使用的任何额外打包功能，您应该参考 [Vite 文档][vite] 和 [Vite 插件社区][vite-plugins]，而不是 Remix 文档。

Vite 有许多 [功能][vite-features] 和 [插件][vite-plugins]，这些功能和插件并未内置于现有的 Remix 编译器中。使用任何此类功能将使现有的 Remix 编译器无法编译您的应用，因此只有在您打算从此独占使用 Vite 时才使用它们。

```
# Example code block
console.log("Hello, world!");
```

## 迁移

#### 设置 Vite

👉 **将 Vite 安装为开发依赖**

```shellscript nonumber
npm install -D vite
```

Remix 现在只是一个 Vite 插件，因此您需要将其连接到 Vite。

👉 **将根目录下的 `remix.config.js` 替换为 `vite.config.ts`**

```ts filename=vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [remix()],
});
```

[支持的 Remix 配置选项][vite-config] 的子集应直接传递给插件：

```ts filename=vite.config.ts lines=[3-5]
export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
    }),
  ],
});
```

#### HMR & HDR

Vite 为开发特性提供了强大的客户端运行时，如 HMR，使 `<LiveReload />` 组件变得多余。在开发中使用 Remix Vite 插件时，`<Scripts />` 组件将自动包含 Vite 的客户端运行时和其他仅限开发的脚本。

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

#### TypeScript 集成

Vite 处理各种文件类型的导入，有时与现有的 Remix 编译器有所不同，因此我们从 `vite/client` 引用 Vite 的类型，而不是过时的 `@remix-run/dev` 的类型。

由于 `vite/client` 提供的模块类型与 `@remix-run/dev` 隐式包含的模块类型不兼容，因此您还需要在 TypeScript 配置中启用 `skipLibCheck` 标志。未来，Remix 在 Vite 插件成为默认编译器后将不再需要此标志。

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

移除 `remix.env.d.ts` 中的以下类型声明

```diff filename=remix.env.d.ts
- /// <reference types="@remix-run/dev" />
- /// <reference types="@remix-run/node" />
```

如果 `remix.env.d.ts` 现在为空，请删除它

```shellscript nonumber
rm remix.env.d.ts
```

#### 从 Remix 应用服务器迁移

如果您在开发中使用 `remix-serve`（或不带 `-c` 标志的 `remix dev`），则需要切换到新的最小开发服务器。
它与 Remix Vite 插件内置，并将在您运行 `remix vite:dev` 时接管。

Remix Vite 插件不会安装任何 [全局 Node polyfills][global-node-polyfills]，因此如果您依赖 `remix-serve` 提供它们，您需要自己安装。最简单的方法是在 Vite 配置的顶部调用 `installGlobals`。

Vite 开发服务器的默认端口与 `remix-serve` 不同，因此如果您希望保持相同的端口，需要通过 Vite 的 `server.port` 选项进行配置。

您还需要更新新的构建输出路径，服务器的路径是 `build/server`，客户端资产的路径是 `build/client`。

👉 **更新您的 `dev`、`build` 和 `start` 脚本**

```json filename=package.json lines=[3-5]
{
  "scripts": {
    "dev": "remix vite:dev",
    "build": "remix vite:build",
    "start": "remix-serve ./build/server/index.js"
  }
}
```

👉 **在 Vite 配置中安装全局 Node polyfills**

```diff filename=vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
+import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";

+installGlobals();

export default defineConfig({
  plugins: [remix()],
});
```

👉 **配置您的 Vite 开发服务器端口（可选）**

```js filename=vite.config.ts lines=[2-4]
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [remix()],
});
```

#### 迁移自定义服务器

如果您在开发中使用自定义服务器，则需要编辑您的自定义服务器以使用 Vite 的 `connect` 中间件。
这将在开发期间将资产请求和初始渲染请求委托给 Vite，让您即使在使用自定义服务器时也能受益于 Vite 的卓越开发体验。

然后您可以在开发期间加载名为 `"virtual:remix/server-build"` 的虚拟模块，以创建基于 Vite 的请求处理器。

您还需要更新服务器代码以引用新的构建输出路径，服务器构建的路径是 `build/server`，客户端资产的路径是 `build/client`。

例如，如果您使用的是 Express，您可以这样做。

👉 **更新您的 `server.mjs` 文件**

```ts filename=server.mjs lines=[7-14,18-21,29,36-41]
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import express from "express";

installGlobals();

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const app = express();

// 处理资产请求
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    "/assets",
    express.static("build/client/assets", {
      immutable: true,
      maxAge: "1y",
    })
  );
}
app.use(express.static("build/client", { maxAge: "1h" }));

// 处理 SSR 请求
app.all(
  "*",
  createRequestHandler({
    build: viteDevServer
      ? () =>
          viteDevServer.ssrLoadModule(
            "virtual:remix/server-build"
          )
      : await import("./build/server/index.js"),
  })
);

const port = 3000;
app.listen(port, () =>
  console.log("http://localhost:" + port)
);
```

👉 **更新您的 `build`、`dev` 和 `start` 脚本**

```json filename=package.json lines=[3-5]
{
  "scripts": {
    "dev": "node ./server.mjs",
    "build": "remix vite:build",
    "start": "cross-env NODE_ENV=production node ./server.mjs"
  }
}
```

如果您愿意，您也可以用 TypeScript 编写自定义服务器。
然后您可以使用 [`tsx`][tsx] 或 [`tsm`][tsm] 等工具来运行您的自定义服务器：

```shellscript nonumber
tsx ./server.ts
node --loader tsm ./server.ts
```

只需记住，如果这样做，初始服务器启动可能会有明显的延迟。

#### 迁移 Cloudflare 函数

<docs-warning>

Remix Vite 插件仅正式支持 [Cloudflare Pages][cloudflare-pages]，该平台专为全栈应用程序设计，而不是 [Cloudflare Workers Sites][cloudflare-workers-sites]。如果您当前使用的是 Cloudflare Workers Sites，请参考 [Cloudflare Pages 迁移指南][cloudflare-pages-migration-guide]。

</docs-warning>

👉 在 `remix` 插件之前添加 `cloudflareDevProxyVitePlugin` 以正确覆盖 vite 开发服务器的中间件！

```ts filename=vite.config.ts lines=[3,9]
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin,
} from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [cloudflareDevProxyVitePlugin(), remix()],
});
```

您的 Cloudflare 应用可能正在设置 [Remix 配置 `server` 字段][remix-config-server] 以生成一个捕获所有请求的 Cloudflare 函数。
使用 Vite，这种间接性不再必要。
相反，您可以直接为 Cloudflare 编写一个捕获所有请求的路由，就像您为 Express 或任何其他自定义服务器所做的那样。

👉 **为 Remix 创建一个捕获所有请求的路由**

```ts filename=functions/[[page]].ts
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

// @ts-ignore - 服务器构建文件由 `remix vite:build` 生成
import * as build from "../build/server";

export const onRequest = createPagesFunctionHandler({
  build,
});
```

👉 **通过 `context.cloudflare.env` 而不是 `context.env` 访问绑定和环境变量**

虽然您在开发中主要使用 Vite，但您也可以使用 Wrangler 来预览和部署您的应用。

要了解更多信息，请参见本文档的 [_Cloudflare_][cloudflare-vite] 部分。

👉 **更新您的 `package.json` 脚本**

```json filename=package.json lines=[3-6]
{
  "scripts": {
    "dev": "remix vite:dev",
    "build": "remix vite:build",
    "preview": "wrangler pages dev ./build/client",
    "deploy": "wrangler pages deploy ./build/client"
  }
}
```

#### 迁移对构建输出路径的引用

使用现有 Remix 编译器的默认选项时，服务器编译到 `build`，客户端编译到 `public/build`。由于 Vite 通常与其 `public` 目录的工作方式与现有 Remix 编译器不同，这些输出路径已更改。

👉 **更新对构建输出路径的引用**

- 服务器现在默认编译到 `build/server`。
- 客户端现在默认编译到 `build/client`。

例如，要更新来自 [Blues Stack][blues-stack] 的 Dockerfile：

```diff filename=Dockerfile
-COPY --from=build /myapp/build /myapp/build
-COPY --from=build /myapp/public /myapp/public
+COPY --from=build /myapp/build/server /myapp/build/server
+COPY --from=build /myapp/build/client /myapp/build/client
```

#### 配置路径别名

Remix 编译器利用 `tsconfig.json` 中的 `paths` 选项来解析路径别名。这在 Remix 社区中常用于将 `~` 定义为 `app` 目录的别名。

Vite 默认不提供任何路径别名。如果您依赖此功能，可以安装 [vite-tsconfig-paths][vite-tsconfig-paths] 插件，以自动解析 Vite 中 `tsconfig.json` 中的路径别名，从而匹配 Remix 编译器的行为：

👉 **安装 `vite-tsconfig-paths`**

```shellscript nonumber
npm install -D vite-tsconfig-paths
```

👉 **将 `vite-tsconfig-paths` 添加到您的 Vite 配置中**

```ts filename=vite.config.ts lines=[3,6]
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
});
```

#### 移除 `@remix-run/css-bundle`

Vite 内置支持 CSS 副作用导入、PostCSS 和 CSS Modules，以及其他 CSS 打包功能。Remix Vite 插件会自动将打包的 CSS 附加到相关路由。

使用 Vite 时，<nobr>[`@remix-run/css-bundle`][css-bundling]</nobr> 包是多余的，因为它的 `cssBundleHref` 导出将始终为 `undefined`。

👉 **卸载 `@remix-run/css-bundle`**

```shellscript nonumber
npm uninstall @remix-run/css-bundle
```

👉 **移除对 `cssBundleHref` 的引用**

```diff filename=app/root.tsx
- import { cssBundleHref } from "@remix-run/css-bundle";
  import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

  export const links: LinksFunction = () => [
-   ...(cssBundleHref
-     ? [{ rel: "stylesheet", href: cssBundleHref }]
-     : []),
    // ...
  ];
```

如果某个路由的 `links` 函数仅用于连接 `cssBundleHref`，您可以完全移除它。

```diff filename=app/root.tsx
- import { cssBundleHref } from "@remix-run/css-bundle";
- import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

- export const links: LinksFunction = () => [
-   ...(cssBundleHref
-     ? [{ rel: "stylesheet", href: cssBundleHref }]
-     : []),
- ];
```

#### 修复在 `links` 中引用的 CSS 导入

<docs-info>这对于其他形式的 [CSS 打包][css-bundling] 并不是必需的，例如 CSS Modules、CSS 副作用导入、Vanilla Extract 等。</docs-info>

如果您在 `links` 函数中[引用 CSS][regular-css]，您需要更新相应的 CSS 导入以使用 [Vite 的显式 `?url` 导入语法。][vite-url-imports]

👉 **在 `links` 中使用的 CSS 导入中添加 `?url`**

<docs-warning>`.css?url` 导入需要 Vite v5.1 或更高版本</docs-warning>

```diff
-import styles from "~/styles/dashboard.css";
+import styles from "~/styles/dashboard.css?url";

export const links = () => {
  return [
    { rel: "stylesheet", href: styles }
  ];
}
```

#### 通过 PostCSS 启用 Tailwind

如果您的项目使用 [Tailwind CSS][tailwind]，您首先需要确保您有一个 [PostCSS][postcss] 配置文件，该文件将被 Vite 自动识别。
这是因为 Remix 编译器在启用 Remix 的 `tailwind` 选项时不需要 PostCSS 配置文件。

👉 **如果缺少 PostCSS 配置，请添加，包括 `tailwindcss` 插件**

```js filename=postcss.config.mjs
export default {
  plugins: {
    tailwindcss: {},
  },
};
```

如果您的项目已经有一个 PostCSS 配置文件，如果 `tailwindcss` 插件尚未存在，您需要添加它。
这是因为 Remix 编译器在启用 Remix 的 [`tailwind` 配置选项][tailwind-config-option] 时会自动包含此插件。

👉 **如果缺少，请将 `tailwindcss` 插件添加到您的 PostCSS 配置中**

```js filename=postcss.config.mjs lines=[3]
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

👉 **迁移 Tailwind CSS 导入**

如果您在 `links` 函数中[引用 Tailwind CSS 文件][regular-css]，您需要[迁移 Tailwind CSS 导入语句。][fix-up-css-imports-referenced-in-links]

#### 添加 Vanilla Extract 插件

如果您使用 [Vanilla Extract][vanilla-extract]，您需要设置 Vite 插件。

👉 **安装官方 [Vanilla Extract for Vite 插件][vanilla-extract-vite-plugin]**

```shellscript nonumber
npm install -D @vanilla-extract/vite-plugin
```

👉 **将 Vanilla Extract 插件添加到您的 Vite 配置中**

```ts filename=vite.config.ts lines=[2,6]
import { vitePlugin as remix } from "@remix-run/dev";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [remix(), vanillaExtractPlugin()],
});
```

#### 添加 MDX 插件

如果您使用 [MDX][mdx]，由于 Vite 的插件 API 是 [Rollup][rollup] 插件 API 的扩展，因此您应该使用官方 [MDX Rollup 插件][mdx-rollup-plugin]：

👉 **安装 MDX Rollup 插件**

```shellscript nonumber
npm install -D @mdx-js/rollup
```

<docs-info>

Remix 插件期望处理 JavaScript 或 TypeScript 文件，因此来自其他语言（如 MDX）的任何转译必须首先完成。
在这种情况下，这意味着在 Remix 插件 _之前_ 放置 MDX 插件。

</docs-info>

👉 **将 MDX Rollup 插件添加到您的 Vite 配置中**

```ts filename=vite.config.ts lines=[1,6]
import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [mdx(), remix()],
});
```

##### 添加 MDX 前置内容支持

Remix 编译器允许您在 MDX 中定义 [前置内容][mdx-frontmatter]。如果您使用此功能，您可以使用 [remark-mdx-frontmatter] 在 Vite 中实现此功能。

👉 **安装所需的 [Remark][remark] 前置内容插件**

```shellscript nonumber
npm install -D remark-frontmatter remark-mdx-frontmatter
```

👉 **将 Remark 前置内容插件传递给 MDX Rollup 插件**

```ts filename=vite.config.ts lines=[3-4,9-14]
import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
      ],
    }),
    remix(),
  ],
});
```

在 Remix 编译器中，前置内容导出被命名为 `attributes`。这与前置内容插件的默认导出名称 `frontmatter` 不同。尽管可以配置前置内容导出名称，但我们建议更新您的应用代码以使用默认导出名称。

👉 **在 MDX 文件中将 MDX `attributes` 导出重命名为 `frontmatter`**

```diff filename=app/posts/first-post.mdx
  ---
  title: Hello, World!
  ---

- # {attributes.title}
+ # {frontmatter.title}
```

👉 **将 MDX `attributes` 导出重命名为 `frontmatter` 用于消费者**

```diff filename=app/routes/posts/first-post.tsx
  import Component, {
-   attributes,
+   frontmatter,
  } from "./posts/first-post.mdx";
```

###### 为 MDX 文件定义类型

👉 **将 `*.mdx` 文件的类型添加到 `env.d.ts`**

```ts filename=env.d.ts lines=[4-8]
/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

declare module "*.mdx" {
  let MDXComponent: (props: any) => JSX.Element;
  export const frontmatter: any;
  export default MDXComponent;
}
```

###### 将 MDX 前置内容映射到路由导出

Remix 编译器允许您在前置内容中定义 `headers`、`meta` 和 `handle` 路由导出。此 Remix 特定功能显然不被 `remark-mdx-frontmatter` 插件支持。如果您使用此功能，您应该手动将前置内容映射到路由导出：

👉 **为 MDX 路由映射前置内容到路由导出**

```mdx lines=[10-11]
---
meta:
  - title: My First Post
  - name: description
    content: Isn't this awesome?
headers:
  Cache-Control: no-cache
---

export const meta = frontmatter.meta;
export const headers = frontmatter.headers;

# Hello World
```

请注意，由于您正在显式映射 MDX 路由导出，您现在可以自由使用您喜欢的任何前置内容结构。

```mdx
---
title: My First Post
description: Isn't this awesome?
---

export const meta = () => {
  return [
    { title: frontmatter.title },
    {
      name: "description",
      content: frontmatter.description,
    },
  ];
};

# Hello World
```

###### 更新 MDX 文件名用法

Remix 编译器还提供了所有 MDX 文件的 `filename` 导出。这主要旨在启用链接到 MDX 路由集合。如果您使用此功能，您可以通过 [glob 导入][glob-imports] 在 Vite 中实现，这为您提供了一种方便的数据结构，将文件名映射到模块。这使得维护 MDX 文件列表变得更加容易，因为您不再需要手动导入每个文件。

例如，导入 `posts` 目录中的所有 MDX 文件：

```ts
const posts = import.meta.glob("./posts/*.mdx");
```

这相当于手动编写：

```ts
const posts = {
  "./posts/a.mdx": () => import("./posts/a.mdx"),
  "./posts/b.mdx": () => import("./posts/b.mdx"),
  "./posts/c.mdx": () => import("./posts/c.mdx"),
  // etc.
};
```

如果您更喜欢，您还可以急切地导入所有 MDX 文件：

```ts
const posts = import.meta.glob("./posts/*.mdx", {
  eager: true,
});
```

## 调试

您可以使用 [`NODE_OPTIONS` 环境变量][node-options] 来启动调试会话：

```shellscript nonumber
NODE_OPTIONS="--inspect-brk" npm run dev
```

然后您可以从浏览器中附加调试器。
例如，在 Chrome 中，您可以打开 `chrome://inspect` 或点击开发工具中的 NodeJS 图标来附加调试器。

#### vite-plugin-inspect

[`vite-plugin-inspect`][vite-plugin-inspect] 显示每个 Vite 插件如何转换您的代码以及每个插件所需的时间。

## 性能

Remix 包含一个 `--profile` 标志用于性能分析。

```shellscript nonumber
remix vite:build --profile
```

当使用 `--profile` 运行时，将生成一个 `.cpuprofile` 文件，可以分享或上传到 speedscope.app 进行分析。

您还可以通过在开发服务器运行时按 `p + enter` 来启动新的分析会话或停止当前会话。如果您需要分析开发服务器启动时间，您也可以使用 `--profile` 标志在启动时初始化分析会话：

```shellscript nonumber
remix vite:dev --profile
```

请记住，您可以随时查看 [Vite 性能文档][vite-perf] 获取更多技巧！

#### 包分析

要可视化和分析您的包，您可以使用 [rollup-plugin-visualizer][rollup-plugin-visualizer] 插件：

```ts filename=vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    remix(),
    // `emitFile` 是必要的，因为 Remix 构建了多个包！
    visualizer({ emitFile: true }),
  ],
});
```

然后当您运行 `remix vite:build` 时，它将在每个包中生成一个 `stats.html` 文件：

```
build
├── client
│   ├── assets/
│   ├── favicon.ico
│   └── stats.html 👈
└── server
    ├── index.js
    └── stats.html 👈
```

在浏览器中打开 `stats.html` 以分析您的包。

## 故障排除

请查看[调试][debugging]和[性能][performance]部分以获取一般故障排除提示。
此外，可以通过查看[GitHub上与remix vite插件相关的已知问题][issues-vite]来检查是否还有其他人遇到类似的问题。

#### HMR

如果您期待热更新但却得到完整页面重载，
请查看我们的[关于热模块替换的讨论][hmr]，以了解React Fast Refresh的限制及常见问题的解决方法。

#### ESM / CJS

Vite支持ESM和CJS依赖项，但有时您可能仍会遇到ESM / CJS互操作性的问题。
通常，这是因为某个依赖项未正确配置以支持ESM。
我们不怪他们，因为[正确支持ESM和CJS真的很棘手][modernizing-packages-to-esm]。

要查看修复示例错误的步骤，请查看[🎥 如何修复CJS/ESM错误][how-fix-cjs-esm]。

要诊断您的某个依赖项是否配置错误，请检查[publint][publint]或[_类型是否错误_][arethetypeswrong]。
此外，您可以使用[vite-plugin-cjs-interop插件][vite-plugin-cjs-interop]来解决外部CJS依赖项的`default`导出问题。

最后，您还可以明确配置要打包到您的服务器中的依赖项，
使用[Vite的`ssr.noExternal`选项][ssr-no-external]以模拟Remix编译器的[`serverDependenciesToBundle`][server-dependencies-to-bundle]与Remix Vite插件。

#### 开发期间浏览器中的服务器代码错误

如果您在开发期间看到浏览器控制台中指向服务器代码的错误，您可能需要[明确隔离仅服务器代码][explicitly-isolate-server-only-code]。
例如，如果您看到如下内容：

```shellscript
Uncaught ReferenceError: process is not defined
```

那么您需要追踪哪个模块引入了像`process`这样的仅服务器全局的依赖项，并将代码隔离到[单独的`.server`模块或使用`vite-env-only`][explicitly-isolate-server-only-code]中。
由于Vite在生产中使用Rollup对您的代码进行树摇，因此这些错误仅在开发中出现。

#### 与其他基于Vite的工具（例如Vitest、Storybook）一起使用插件

Remix Vite插件仅用于您的应用程序的开发服务器和生产构建。
虽然还有其他基于Vite的工具，比如Vitest和Storybook，它们使用Vite配置文件，但Remix Vite插件并未设计为与这些工具一起使用。
我们目前建议在与其他基于Vite的工具一起使用时排除该插件。

对于Vitest：

```ts filename=vite.config.ts lines=[5]
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite";

export default defineConfig({
  plugins: [!process.env.VITEST && remix()],
  test: {
    environment: "happy-dom",
    // 此外，这用于在vitest期间加载“.env.test”
    env: loadEnv("test", process.cwd(), ""),
  },
});
```

对于Storybook：

```ts filename=vite.config.ts lines=[7]
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

const isStorybook = process.argv[1]?.includes("storybook");

export default defineConfig({
  plugins: [!isStorybook && remix()],
});
```

或者，您可以为每个工具使用单独的Vite配置文件。
例如，要使用专门针对Remix的Vite配置：

```shellscript nonumber
remix vite:dev --config vite.config.remix.ts
```

在不提供Remix Vite插件的情况下，您的设置可能还需要提供[Vite Plugin React][vite-plugin-react]。例如，在使用Vitest时：

```ts filename=vite.config.ts lines=[2,6]
import { vitePlugin as remix } from "@remix-run/dev";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig({
  plugins: [!process.env.VITEST ? remix() : react()],
  test: {
    environment: "happy-dom",
    // 此外，这用于在vitest期间加载“.env.test”
    env: loadEnv("test", process.cwd(), ""),
  },
});
```

#### 当文档重新挂载时样式在开发中消失

当React用于渲染整个文档（如Remix所做的）时，当元素动态注入到`head`元素中时，您可能会遇到问题。如果文档被重新挂载，现有的`head`元素将被移除并替换为一个全新的元素，从而移除Vite在开发期间注入的任何`style`元素。

这是一个已知的React问题，在他们的[金丝雀发布渠道][react-canaries]中已修复。如果您了解相关风险，可以将您的应用固定到特定的[React版本][react-versions]，然后使用[包覆盖][package-overrides]确保这是您项目中使用的唯一React版本。例如：

```json filename=package.json
{
  "dependencies": {
    "react": "18.3.0-canary-...",
    "react-dom": "18.3.0-canary-..."
  },
  "overrides": {
    "react": "18.3.0-canary-...",
    "react-dom": "18.3.0-canary-..."
  }
}
```

<docs-info>作为参考，Next.js在内部为您处理React版本控制，因此这种方法比您预期的更广泛使用，尽管这并不是Remix默认提供的内容。</docs-info>

值得强调的是，Vite注入的样式问题仅在开发中发生。**生产构建不会有此问题**，因为生成的是静态CSS文件。

在Remix中，当在您的[根路由的默认组件导出][route-component]和其[ErrorBoundary][error-boundary]和/或[HydrateFallback][hydrate-fallback]导出之间切换时，这个问题可能会出现，因为这会导致一个新的文档级组件被挂载。

由于水合错误也可能导致这个问题，因为它会导致React从头开始重新渲染整个页面。水合错误可能由您的应用代码引起，但也可能由操纵文档的浏览器扩展引起。

这与Vite相关，因为在开发期间，Vite将CSS导入转换为JS文件，这些文件将其样式作为副作用注入到文档中。Vite这样做是为了支持静态CSS文件的懒加载和HMR。

例如，假设您的应用有以下CSS文件：

<!-- prettier-ignore -->
```css filename=app/styles.css
* { margin: 0 }
```

在开发期间，当作为副作用导入时，这个CSS文件将被转换为以下JavaScript代码：

<!-- prettier-ignore-start -->

<!-- eslint-skip -->

```js
import {createHotContext as __vite__createHotContext} from "/@vite/client";
import.meta.hot = __vite__createHotContext("/app/styles.css");
import {updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle} from "/@vite/client";
const __vite__id = "/path/to/app/styles.css";
const __vite__css = "*{margin:0}"
__vite__updateStyle(__vite__id, __vite__css);
import.meta.hot.accept();
import.meta.hot.prune(()=>__vite__removeStyle(__vite__id));
```

<!-- prettier-ignore-end -->

此转换不适用于生产代码，这就是为什么此样式问题仅影响开发。

#### 开发中的Wrangler错误

使用Cloudflare Pages时，您可能会遇到来自`wrangler pages dev`的以下错误：

```txt nonumber
ERROR: Your worker called response.clone(), but did not read the body of both clones.
This is wasteful, as it forces the system to buffer the entire response body
in memory, rather than streaming it through. This may cause your worker to be
unexpectedly terminated for going over the memory limit. If you only meant to
copy the response headers and metadata (e.g. in order to be able to modify
them), use `new Response(response.body, response)` instead.
```

这是[Wrangler的已知问题][cloudflare-request-clone-errors]。

## 致谢

Vite 是一个令人惊叹的项目，我们对 Vite 团队的工作表示感谢。
特别感谢 [Matias Capeletto, Arnaud Barré, 和 Bjorn Lu 来自 Vite 团队][vite-team] 的指导。

Remix 社区迅速探索了 Vite 的支持，我们对他们的贡献表示感谢：

- [讨论：考虑使用 Vite][consider-using-vite]
- [remix-kit][remix-kit]
- [remix-vite][remix-vite]
- [vite-plugin-remix][vite-plugin-remix]

最后，我们受到其他框架实现 Vite 支持的启发：

- [Astro][astro]
- [SolidStart][solidstart]
- [SvelteKit][sveltekit]

[vite]: https://vitejs.dev
[template-cloudflare]: https://github.com/remix-run/remix/tree/main/templates/cloudflare
[public-path]: ../file-conventions/remix-config#publicpath
[server-build-path]: ../file-conventions/remix-config#serverbuildpath
[vite-config]: ../file-conventions/vite-config
[vite-plugins]: https://vitejs.dev/plugins
[vite-features]: https://vitejs.dev/guide/features
[tsx]: https://github.com/esbuild-kit/tsx
[tsm]: https://github.com/lukeed/tsm
[vite-tsconfig-paths]: https://github.com/aleclarson/vite-tsconfig-paths
[css-bundling]: ../styling/bundling
[regular-css]: ../styling/css
[vite-url-imports]: https://vitejs.dev/guide/assets.html#explicit-url-imports
[tailwind]: https://tailwindcss.com
[postcss]: https://postcss.org
[tailwind-config-option]: ../file-conventions/remix-config#tailwind
[vanilla-extract]: https://vanilla-extract.style
[vanilla-extract-vite-plugin]: https://vanilla-extract.style/documentation/integrations/vite
[mdx]: https://mdxjs.com
[rollup]: https://rollupjs.org
[mdx-rollup-plugin]: https://mdxjs.com/packages/rollup
[mdx-frontmatter]: https://mdxjs.com/guides/frontmatter
[remark-mdx-frontmatter]: https://github.com/remcohaszing/remark-mdx-frontmatter
[remark]: https://remark.js.org
[glob-imports]: https://vitejs.dev/guide/features.html#glob-import
[issues-vite]: https://github.com/remix-run/remix/labels/vite
[hmr]: ../discussion/hot-module-replacement
[vite-team]: https://vitejs.dev/team
[consider-using-vite]: https://github.com/remix-run/remix/discussions/2427
[remix-kit]: https://github.com/jrestall/remix-kit
[remix-vite]: https://github.com/sudomf/remix-vite
[vite-plugin-remix]: https://github.com/yracnet/vite-plugin-remix
[astro]: https://astro.build/
[solidstart]: https://start.solidjs.com/getting-started/what-is-solidstart
[sveltekit]: https://kit.svelte.dev/
[modernizing-packages-to-esm]: https://blog.isquaredsoftware.com/2023/08/esm-modernization-lessons/
[arethetypeswrong]: https://arethetypeswrong.github.io/
[publint]: https://publint.dev/
[vite-plugin-cjs-interop]: https://github.com/cyco130/vite-plugin-cjs-interop
[ssr-no-external]: https://vitejs.dev/config/ssr-options.html#ssr-noexternal
[server-dependencies-to-bundle]: https://remix.run/docs/en/main/file-conventions/remix-config#serverdependenciestobundle
[blues-stack]: https://github.com/remix-run/blues-stack
[global-node-polyfills]: ../other-api/node#polyfills
[vite-plugin-inspect]: https://github.com/antfu/vite-plugin-inspect
[vite-perf]: https://vitejs.dev/guide/performance.html
[node-options]: https://nodejs.org/api/cli.html#node_optionsoptions
[rollup-plugin-visualizer]: https://github.com/btd/rollup-plugin-visualizer
[debugging]: #debugging
[performance]: #performance
[explicitly-isolate-server-only-code]: #splitting-up-client-and-server-code
[route-component]: ../route/component
[error-boundary]: ../route/error-boundary
[hydrate-fallback]: ../route/hydrate-fallback
[react-canaries]: https://react.dev/blog/2023/05/03/react-canaries
[react-versions]: https://www.npmjs.com/package/react?activeTab=versions
[package-overrides]: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides
[wrangler-toml-bindings]: https://developers.cloudflare.com/workers/wrangler/configuration/#bindings
[cloudflare-pages]: https://pages.cloudflare.com
[cloudflare-workers-sites]: https://developers.cloudflare.com/workers/configuration/sites
[cloudflare-pages-migration-guide]: https://developers.cloudflare.com/pages/migrations/migrating-from-workers
[cloudflare-request-clone-errors]: https://github.com/cloudflare/workers-sdk/issues/3259
[cloudflare-pages-bindings]: https://developers.cloudflare.com/pages/functions/bindings/
[cloudflare-kv]: https://developers.cloudflare.com/pages/functions/bindings/#kv-namespaces
[cloudflare-workerd]: https://blog.cloudflare.com/workerd-open-source-workers-runtime
[wrangler-getplatformproxy]: https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
[wrangler-getplatformproxy-return]: https://developers.cloudflare.com/workers/wrangler/api/#return-type-1
[remix-config-server]: https://remix.run/docs/en/main/file-conventions/remix-config#server
[cloudflare-vite]: #cloudflare
[vite-base]: https://vitejs.dev/config/shared-options.html#base
[how-fix-cjs-esm]: https://www.youtube.com/watch?v=jmNuEEtwkD4
[fix-up-css-imports-referenced-in-links]: #fix-up-css-imports-referenced-in-links
[vite-plugin-react]: https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react
[splitting-up-client-and-server-code]: ../discussion/server-vs-client