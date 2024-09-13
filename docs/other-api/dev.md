---
title: "@remix-run/dev CLI"
position: 2
new: true
---

# Remix CLI

Remix CLI 来自 `@remix-run/dev` 包。它还包括编译器。确保它在你的 `package.json` 的 `devDependencies` 中，这样就不会被部署到你的服务器上。

要获取可用命令和标志的完整列表，请运行：

```shellscript nonumber
npx @remix-run/dev -h
```

## `remix vite:build`

为生产构建您的应用程序，使用 [Remix Vite][remix-vite]。此命令将 `process.env.NODE_ENV` 设置为 `production`，并对输出进行压缩以便部署。

```shellscript nonumber
remix vite:build
```

| 标志                   | 描述                                                  | 类型                                                 | 默认值      |
| --------------------- | ------------------------------------------------------- | --------------------------------------------------- | ----------- |
| `--assetsInlineLimit` | 静态资源的 base64 内联阈值（以字节为单位）             | `number`                                            | `4096`      |
| `--clearScreen`       | 允许/禁用日志记录时清屏                               | `boolean`                                           |             |
| `--config`, `-c`      | 使用指定的配置文件                                   | `string`                                            |             |
| `--emptyOutDir`       | 强制在根目录之外清空 outDir                           | `boolean`                                           |             |
| `--logLevel`, `-l`    | 使用指定的日志级别                                   | `"info" \| "warn" \| "error" \| "silent" \| string` |             |
| `--minify`            | 启用/禁用压缩，或指定要使用的压缩工具                 | `boolean \| "terser" \| "esbuild"`                  | `"esbuild"` |
| `--mode`, `-m`        | 设置环境模式                                          | `string`                                            |             |
| `--profile`           | 启动内置的 Node.js 检查器                              |                                                     |             |
| `--sourcemapClient`   | 为客户端构建输出源地图                               | `boolean \| "inline" \| "hidden"`                   | `false`     |
| `--sourcemapServer`   | 为服务器构建输出源地图                               | `boolean \| "inline" \| "hidden"`                   | `false`     |

## `remix vite:dev`

以开发模式运行您的应用程序，使用 [Remix Vite][remix-vite]。

```shellscript nonumber
remix vite:dev
```

| 标志                | 描述                                                | 类型                                                 | 默认值  |
| ------------------ | --------------------------------------------------- | --------------------------------------------------- | ------- |
| `--clearScreen`    | 允许/禁用在日志记录时清屏                          | `boolean`                                           |         |
| `--config`, `-c`   | 使用指定的配置文件                                  | `string`                                            |         |
| `--cors`           | 启用 CORS                                          | `boolean`                                           |         |
| `--force`          | 强制优化器忽略缓存并重新打包                        | `boolean`                                           |         |
| `--host`           | 指定主机名                                        | `string`                                            |         |
| `--logLevel`, `-l` | 使用指定的日志级别                                  | `"info" \| "warn" \| "error" \| "silent" \| string` |         |
| `--mode`, `-m`     | 设置环境模式                                        | `string`                                            |         |
| `--open`           | 启动时打开浏览器                                    | `boolean \| string`                                 |         |
| `--port`           | 指定端口                                          | `number`                                            |         |
| `--profile`        | 启动内置的 Node.js 检查器                          |                                                     |         |
| `--strictPort`     | 如果指定的端口已被使用则退出                        | `boolean`                                           |         |

## 经典 Remix 编译器命令

<docs-warning>此文档仅在使用 [经典 Remix 编译器][classic-remix-compiler] 时相关。</docs-warning>

### `remix build`

为生产环境构建您的应用程序，使用 [Classic Remix Compiler][classic-remix-compiler]。此命令将 `process.env.NODE_ENV` 设置为 `production`，并压缩输出以便于部署。

```shellscript nonumber
remix build
```

#### 选项

| 选项                                   | 标志          | 配置 | 默认值 |
| -------------------------------------- | ------------- | ---- | ------ |
| 为生产构建生成源映射                 | `--sourcemap` | N/A  | `false` |

## `remix dev`

在监视模式下运行 [Classic Remix Compiler][classic-remix-compiler] 并启动您的应用服务器。

Remix 编译器将会：

1. 将 `NODE_ENV` 设置为 `development`
2. 监视您的应用代码更改并触发重建
3. 每当重建成功时重启您的应用服务器
4. 通过 Live Reload 和 HMR + Hot Data Revalidation 将代码更新发送到浏览器

🎥 有关 HMR 和 HDR 在 Remix 中的介绍和深入探讨，请查看我们的视频：

- [HMR 和 Hot Data Revalidation 🔥][hmr_and_hdr]
- [新开发流程的思维模型 🧠][mental_model]
- [将您的项目迁移到 v2 开发流程 🚚][migrating]

<docs-info>

什么是 "Hot Data Revalidation"？

与 HMR 类似，HDR 是一种在不需要刷新页面的情况下热更新您的应用的方法。
这样您可以在应用中应用编辑时保持应用状态。
HMR 处理客户端代码更新，例如当您更改应用中的组件、标记或样式时。
同样，HDR 处理服务器端代码更新。

这意味着每当您更改当前页面上的 [`loader`][loader]（或任何您的 `loader` 依赖的代码）时，Remix 将重新从您更改的 loader 中获取数据。
这样您的应用始终与最新的代码更改保持同步，无论是客户端还是服务器端。

要了解更多关于 HMR 和 HDR 如何协同工作的信息，请查看 [Pedro 在 Remix Conf 2023 的演讲][legendary_dx]。

</docs-info>

#### 使用自定义应用服务器

如果您使用模板开始， hopefully 它已经与 `remix dev` 开箱即用集成。
如果没有，您可以按照以下步骤将您的项目与 `remix dev` 集成：

1. 在 `package.json` 中替换您的开发脚本，并使用 `-c` 指定您的应用服务器命令：

   ```json filename=package.json
   {
     "scripts": {
       "dev": "remix dev -c \"node ./server.js\""
     }
   }
   ```

2. 确保在您的应用服务器启动并运行时调用 `broadcastDevReady`：

   ```ts filename=server.ts lines=[12,25-27]
   import path from "node:path";

   import { broadcastDevReady } from "@remix-run/node";
   import express from "express";

   const BUILD_DIR = path.resolve(__dirname, "build");
   const build = require(BUILD_DIR);

   const app = express();

   // ... 设置您的 express 应用的代码在这里 ...

   app.all("*", createRequestHandler({ build }));

   const port = 3000;
   app.listen(port, () => {
     console.log(`👉 http://localhost:${port}`);

     if (process.env.NODE_ENV === "development") {
       broadcastDevReady(build);
     }
   });
   ```

   <docs-info>

   对于 CloudFlare，请使用 `logDevReady` 而不是 `broadcastDevReady`。

   为什么？`broadcastDevReady` 使用 [`fetch`][fetch] 向 Remix 编译器发送准备就绪消息，
   但 CloudFlare 不支持在请求处理外进行异步 I/O，如 `fetch`。

   </docs-info>

#### 选项

选项优先级顺序为：1. 标志，2. 配置，3. 默认值。

| 选项            | 标志               | 配置      | 默认值                           | 描述                                                  |
| --------------- | ------------------ | --------- | --------------------------------- | ------------------------------------------------------ |
| 命令            | `-c` / `--command` | `command` | `remix-serve <server build path>` | 用于运行您的应用服务器的命令                          |
| 手动            | `--manual`         | `manual`  | `false`                           | 请参阅 [手动模式指南][manual_mode]                    |
| 端口            | `--port`           | `port`    | 动态选择的开放端口                | Remix 编译器用于热更新的内部端口                      |
| TLS 密钥       | `--tls-key`        | `tlsKey`  | N/A                               | 用于配置本地 HTTPS 的 TLS 密钥                        |
| TLS 证书       | `--tls-cert`       | `tlsCert` | N/A                               | 用于配置本地 HTTPS 的 TLS 证书                        |

例如：

```js filename=remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  dev: {
    // ...您想要设置的其他选项在这里...
    manual: true,
    tlsKey: "./key.pem",
    tlsCert: "./cert.pem",
  },
};
```

#### 设置自定义端口

`remix dev --port` 选项设置用于热更新的内部端口。
**它不会影响您的应用运行的端口。**

要设置您的应用服务器端口，请按照您通常在生产中设置的方式进行设置。
例如，您可能在 `server.js` 文件中硬编码了它。

如果您使用 `remix-serve` 作为您的应用服务器，您可以使用其 `--port` 标志来设置应用服务器端口：

```shellscript nonumber
remix dev -c "remix-serve --port 8000 ./build/index.js"
```

相比之下，`remix dev --port` 选项是一个逃生阀，供需要精细控制网络端口的用户使用。
大多数用户不需要使用 `remix dev --port`。

#### 手动模式

默认情况下，`remix dev` 会在每次重建时重启您的应用服务器。
如果您希望在重建期间保持应用服务器运行而不重启，请查看我们的 [手动模式指南][manual_mode]。

您可以通过比较 `remix dev` 报告的时间来查看应用服务器重启是否是您项目的瓶颈：

- `rebuilt (Xms)` 👉 Remix 编译器花费了 `X` 毫秒重建您的应用
- `app server ready (Yms)` 👉 Remix 重启了您的应用服务器，并且花费了 `Y` 毫秒以新代码更改启动

#### 从其他包中获取更改

如果您使用的是单体仓库，您可能希望 Remix 在您的应用代码更改时执行热更新，而不仅仅是在您更改任何应用依赖的代码时。

例如，您可能有一个 UI 库包（`packages/ui`），它在您的 Remix 应用中使用（`packages/app`）。
要获取 `packages/ui` 中的更改，您可以配置 [watchPaths][watch_paths] 以包含您的包。

#### 如何设置 MSW

要在开发中使用 [Mock Service Worker][msw]，您需要：

1. 将 MSW 作为您的应用服务器的一部分运行
2. 配置 MSW 不要模拟内部 "dev ready" 消息到 Remix 编译器

确保您在 `-c` 标志内设置您的 mocks，以便 `REMIX_DEV_ORIGIN` 环境变量对您的 mocks 可用。
例如，您可以使用 `NODE_OPTIONS` 在运行 `remix-serve` 时设置 Node 的 `--require` 标志：

```json filename=package.json
{
  "scripts": {
    "dev": "remix dev -c \"npm run dev:app\"",
    "dev:app": "cross-env NODE_OPTIONS=\"--require ./mocks\" remix-serve ./build"
  }
}
```

如果您使用 ESM 作为默认模块系统，您需要设置 `--import` 标志而不是 `--require`：

```json filename=package.json
{
  "scripts": {
    "dev": "remix dev -c \"npm run dev:app\"",
    "dev:app": "cross-env NODE_OPTIONS=\"--import ./mocks/index.js\" remix-serve ./build/index.js"
  }
}
```

接下来，您可以使用 `REMIX_DEV_ORIGIN` 让 MSW 在 `/ping` 上转发内部 "dev ready" 消息：

```ts
import { http, passthrough } from "msw";

const REMIX_DEV_PING = new URL(
  process.env.REMIX_DEV_ORIGIN
);
REMIX_DEV_PING.pathname = "/ping";

export const server = setupServer(
  http.post(REMIX_DEV_PING.href, () => passthrough())
  // ... 其他请求处理程序在这里 ...
);
```

#### 如何与反向代理集成

假设您有应用服务器和 Remix 编译器都在同一台机器上运行：

- 应用服务器 👉 `http://localhost:1234`
- Remix 编译器 👉 `http://localhost:5678`

然后，您在应用服务器前设置一个反向代理：

- 反向代理 👉 `https://myhost`

但支持热更新的内部 HTTP 和 WebSocket 连接仍然会尝试访问 Remix 编译器的未代理源：

- 热更新 👉 `http://localhost:5678` / `ws://localhost:5678` ❌

要使内部连接指向反向代理，您可以使用 `REMIX_DEV_ORIGIN` 环境变量：

```shellscript nonumber
REMIX_DEV_ORIGIN=https://myhost remix dev
```

现在，热更新将正确发送到代理：

- 热更新 👉 `https://myhost` / `wss://myhost` ✅

#### 性能调优和调试

##### 路径导入

当前，当 Remix 重建您的应用时，编译器必须处理您的应用代码及其任何依赖项。
编译器会从应用中摇树去除未使用的代码，以便您不会将任何未使用的代码发送到浏览器，并且保持您的服务器尽可能精简。
但编译器仍然需要 _爬行_ 所有代码以了解要保留什么以及要摇树去除什么。

简而言之，这意味着您导入和导出的方式可能对重建应用所需的时间产生重大影响。
例如，如果您使用像 Material UI 或 AntD 这样的库，您可以通过使用 [路径导入][path_imports] 来加快构建速度：

```diff
- import { Button, TextField } from '@mui/material';
+ import Button from '@mui/material/Button';
+ import TextField from '@mui/material/TextField';
```

未来，Remix 可能会在开发中预打包依赖项，以避免这个问题。
但今天，您可以通过使用路径导入来帮助编译器。

##### 调试包

根据您的应用和依赖项，您可能正在处理比应用所需的更多代码。
请查看我们的 [包分析指南][bundle_analysis] 以获取更多详细信息。

#### 故障排除

##### HMR

如果您期待热更新但得到完整页面重新加载，
请查看我们的 [关于热模块替换的讨论][hmr]，以了解有关 React Fast Refresh 的限制和常见问题的解决方法。

##### HDR：每次代码更改触发 HDR

热数据重新验证通过尝试捆绑每个 loader 并指纹每个内容来检测 loader 更改。
它依赖于摇树去除来确定您的更改是否影响每个 loader。

为了确保摇树去除可以可靠地检测到 loader 的更改，请确保声明您的应用包是无副作用的：

```json filename=package.json
{
  "sideEffects": false
}
```

##### HDR：当 loader 数据被移除时无害的控制台错误

当您删除加载器或移除该加载器返回的一些数据时，您的应用应该能够正确地热更新。
但您可能会在浏览器中注意到控制台错误的日志。

React 严格模式和 React Suspense 在应用热更新时可能会导致多次渲染。
其中大多数渲染是正确的，包括您可见的最终渲染。
但中间渲染有时可能会使用旧的 React 组件与新的加载器数据，这就是那些错误的来源。

我们正在继续调查潜在的竞争条件，以查看是否可以平滑处理。
与此同时，如果这些控制台错误让您感到困扰，您可以在它们出现时刷新页面。

##### HDR：性能

当 Remix 编译器构建（和重建）您的应用时，您可能会注意到轻微的减速，因为编译器需要爬取每个加载器的依赖项。
这样 Remix 就可以在重建时检测到加载器的变化。

虽然初始构建的减速本质上是 HDR 的成本，但我们计划优化重建，以便 HDR 重建时没有可感知的减速。

[hmr_and_hdr]: https://www.youtube.com/watch?v=2c2OeqOX72s  
[mental_model]: https://www.youtube.com/watch?v=zTrjaUt9hLo  
[migrating]: https://www.youtube.com/watch?v=6jTL8GGbIuc  
[legendary_dx]: https://www.youtube.com/watch?v=79M4vYZi-po  
[loader]: ../route/loader  
[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API  
[watch_paths]: ../file-conventions/remix-config#watchpaths  
[react_keys]: https://react.dev/learn/rendering-lists#why-does-react-need-keys  
[use_loader_data]: ../hooks/use-loader-data  
[react_refresh]: https://github.com/facebook/react/tree/main/packages/react-refresh  
[msw]: https://mswjs.io  
[path_imports]: https://mui.com/material-ui/guides/minimizing-bundle-size/#option-one-use-path-imports  
[bundle_analysis]: ../guides/performance  
[manual_mode]: ../guides/manual-mode  
[hmr]: ../discussion/hot-module-replacement  
[remix-vite]: ../guides/vite  
[classic-remix-compiler]: ../guides/vite#classic-remix-compiler-vs-remix-vite