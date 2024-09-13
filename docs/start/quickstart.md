---
title: 快速入门 (5分钟)
order: 1
---

# 快速开始

本指南将帮助您尽快熟悉运行 Remix 应用所需的基本设置。虽然有许多具有不同运行时、部署目标和数据库的启动模板，但我们将从头开始创建一个简单的项目。

当您准备认真对待您的 Remix 项目时，您可以考虑从社区模板开始。这些模板包括 TypeScript 设置、数据库、测试工具、身份验证等。您可以在 [Remix 资源][templates] 页面找到社区模板的列表。

## 安装

如果您更喜欢初始化一个包含全部功能的 Remix 项目，可以使用 [`create-remix` CLI][create-remix]：

```shellscript nonumber
npx create-remix@latest
```

然而，本指南将解释 CLI 所做的所有操作以设置您的项目，您可以按照这些步骤而不是使用 CLI。如果您刚开始使用 Remix，我们建议您遵循本指南，以了解构成 Remix 应用的所有不同部分。

```shellscript nonumber
mkdir my-remix-app
cd my-remix-app
npm init -y

# 安装运行时依赖
npm i @remix-run/node @remix-run/react @remix-run/serve isbot@4 react react-dom

# 安装开发依赖
npm i -D @remix-run/dev vite
```

## Vite 配置

```shellscript nonumber
touch vite.config.js
```

由于 Remix 使用 [Vite]，您需要提供一个带有 Remix Vite 插件的 [Vite 配置][vite-config]。以下是您需要的基本配置：

```js filename=vite.config.js
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [remix()],
});
```

## 根路由

```shellscript nonumber
mkdir app
touch app/root.jsx
```

`app/root.jsx` 是我们所称的“根路由”。它是整个应用的根布局。以下是任何项目所需的基本元素：

```jsx filename=app/root.jsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
} from "@remix-run/react";

export default function App() {
  return (
    <html>
      <head>
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Hello world!</h1>
        <Outlet />

        <Scripts />
      </body>
    </html>
  );
}
```

## 构建和运行

首先为生产环境构建应用程序：

```shellscript nonumber
npx remix vite:build
```

现在你应该能看到一个 `build` 文件夹，其中包含一个 `server` 文件夹（你的应用程序的服务器版本）和一个 `client` 文件夹（浏览器版本），里面有一些构建产物。（这一切都是 [可配置的][vite_config]。）

👉 **使用 `remix-serve` 运行应用程序**

首先，你需要在 `package.json` 中将类型指定为模块，以便 `remix-serve` 能够运行你的应用程序。

```jsonc filename=package.json lines=[2] nocopy
{
  "type": "module"
  // ...
}
```

现在你可以使用 `remix-serve` 运行你的应用程序：

```shellscript nonumber
# 注意短横线！
npx remix-serve build/server/index.js
```

你应该能够打开 [http://localhost:3000][http-localhost-3000] 并看到 "hello world" 页面。

除了 `node_modules` 中大量的代码，我们的 Remix 应用程序实际上只有一个文件：

```
├── app/
│   └── root.jsx
└── package.json
└── vite.config.js
```

## 自带服务器

`remix vite:build` 创建的 `build/server` 目录只是一个模块，您可以在像 Express、Cloudflare Workers、Netlify、Vercel、Fastly、AWS、Deno、Azure、Fastify、Firebase 等任何地方的服务器中运行它。

如果您不想自己设置服务器，可以使用 `remix-serve`。这是一个由 Remix 团队维护的简单基于 Express 的服务器。然而，Remix 是专门设计用于在 _任何_ JavaScript 环境中运行的，以便您拥有自己的技术栈。预计许多—如果不是大多数—生产应用程序将拥有自己的服务器。您可以在 [Runtimes, Adapters, and Stacks][runtimes] 中阅读更多相关内容。

为了好玩，我们停止使用 `remix-serve`，而使用 Express。

👉 **安装 Express、Remix Express 适配器和 [cross-env] 以在生产模式下运行**

```shellscript nonumber
npm i express @remix-run/express cross-env

# 不再使用这个
npm uninstall @remix-run/serve
```

👉 **创建一个 Express 服务器**

```shellscript nonumber
touch server.js
```

```js filename=server.js
import { createRequestHandler } from "@remix-run/express";
import express from "express";

// 注意 `remix vite:build` 的结果是“只是一个模块”
import * as build from "./build/server/index.js";

const app = express();
app.use(express.static("build/client"));

// 您的应用程序“只是一个请求处理器”
app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
  console.log("App listening on http://localhost:3000");
});
```

👉 **使用 express 运行您的应用**

```shellscript nonumber
node server.js
```

现在您拥有自己的服务器，可以使用服务器提供的任何工具调试应用。例如，您可以使用 [Node.js inspect flag][inspect] 在 Chrome 开发者工具中检查您的应用：

```shellscript nonumber
node --inspect server.js
```

## 开发工作流程

您可以使用 [Vite 中间件模式][vite-middleware] 在开发中运行 Remix，而不是一直停止、重建和启动您的服务器。这使您能够通过 React Refresh（热模块替换）和 Remix 热数据重新验证，立即反馈应用程序的更改。

首先，为方便起见，在 `package.json` 中添加 `dev` 和 `start` 命令，以分别在开发和生产模式下运行您的服务器：

👉 **在 `package.json` 中添加 "scripts" 条目**

```jsonc filename=package.json lines=[2-4] nocopy
{
  "scripts": {
    "dev": "node ./server.js",
    "start": "cross-env NODE_ENV=production node ./server.js"
  }
  // ...
}
```

👉 **将 Vite 开发中间件添加到您的服务器**

如果 `process.env.NODE_ENV` 设置为 `"production"`，则不会应用 Vite 中间件，在这种情况下，您仍然将运行常规构建输出，如之前所做的那样。

```js filename=server.js lines=[4-11,14-18,20-25]
import { createRequestHandler } from "@remix-run/express";
import express from "express";

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? null
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const app = express();
app.use(
  viteDevServer
    ? viteDevServer.middlewares
    : express.static("build/client")
);

const build = viteDevServer
  ? () =>
      viteDevServer.ssrLoadModule(
        "virtual:remix/server-build"
      )
  : await import("./build/server/index.js");

app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
  console.log("App listening on http://localhost:3000");
});
```

👉 **启动开发服务器**

```shellscript nonumber
npm run dev
```

现在您可以立即反馈地进行应用程序开发。试试看，修改 `root.jsx` 中的文本并观察！

## 控制服务器和浏览器入口

Remix 使用了一些默认的魔法文件，大多数应用不需要修改，但如果您想自定义 Remix 的服务器和浏览器入口，可以运行 `remix reveal`，它们将被导出到您的项目中。

```shellscript nonumber
npx remix reveal
```

```
Entry file entry.client created at app/entry.client.tsx.
Entry file entry.server created at app/entry.server.tsx.
```

## 摘要

恭喜你，可以将 Remix 添加到你的简历上！总结一下，我们学到了：

- Remix 将你的应用编译成两部分：
  - 你添加到自己 JavaScript 服务器的请求处理程序
  - 为浏览器准备的一堆静态资源，存放在你的公共目录中
- 你可以使用适配器带上自己的服务器，部署到任何地方
- 你可以设置一个内置 HMR 的开发工作流

总的来说，Remix 有点“开箱即用”。几分钟的样板代码，但现在你拥有了自己的技术栈。

接下来是什么？

- [教程][tutorial]

[create-remix]: ../other-api/create-remix
[runtimes]: ../discussion/runtimes
[inspect]: https://nodejs.org/en/docs/guides/debugging-getting-started/
[tutorial]: ./tutorial
[vite_config]: ../file-conventions/vite-config
[templates]: /resources?category=templates
[http-localhost-3000]: http://localhost:3000
[es-modules]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[vite]: https://vitejs.dev
[vite-config]: https://vitejs.dev/config
[vite-middleware]: https://vitejs.dev/guide/ssr#setting-up-the-dev-server
[cross-env]: https://www.npmjs.com/package/cross-env