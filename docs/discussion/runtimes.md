---
title: 运行时、适配器、模板和部署
order: 2
---

# 运行时、适配器、模板和部署

部署一个 Remix 应用程序有四个层次：

1. 一个 JavaScript 运行时，如 Node.js
2. 一个 JavaScript 网络服务器，如 Express.js
3. 一个服务器适配器，如 `@remix-run/express`
4. 一个网络主机或平台

根据您的网络主机，您可能会有更少的层次。例如，部署到 Cloudflare Pages 会同时处理 2、3 和 4。将 Remix 部署在 Express 应用程序中将会有全部四个层次，而使用 "Remix App Server" 则将 2 和 3 结合在一起！

您可以自己将所有这些连接起来，或者从 Remix 模板开始。

让我们谈谈每个部分的功能。

## JavaScript 运行时

Remix 可以部署到任何 JavaScript 运行时，如 Node.js、Shopify Oxygen、Cloudflare Workers/Pages、Fastly Compute、Deno、Bun 等。

每个运行时对 Remix 构建的标准 Web API 的支持程度不同，因此需要 Remix 运行时包来填补运行时缺失的特性。这些 polyfill 包括像 Request、Response、crypto 等 Web 标准 API。这使得您可以在服务器和浏览器中使用相同的 API。

以下运行时包可用：

- [`@remix-run/cloudflare-pages`][remix_run_cloudflare_pages]
- [`@remix-run/cloudflare-workers`][remix_run_cloudflare_workers]
- [`@remix-run/deno`][remix_run_deno]
- [`@remix-run/node`][remix_run_node]

您在应用中交互的大多数 API 并不是直接从这些包中导入的，因此您的代码在运行时之间相当可移植。然而，您可能会偶尔从这些包中导入某些特定功能，这些功能不是标准的 Web API。

例如，您可能希望将 cookies 存储在文件系统中，或在 Cloudflare KV 存储中。这些是运行时特有的功能，其他运行时并不共享：

```tsx
// store sessions in cloudflare KV storage
import { createWorkersKVSessionStorage } from "@remix-run/cloudflare";

// store sessions on the file system in node
import { createFileSessionStorage } from "@remix-run/node";
```

但是，如果您将会话存储在 cookie 本身中，这在所有运行时中都是支持的：

```tsx
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno
```

## 适配器

Remix 不是一个 HTTP 服务器，而是一个现有 HTTP 服务器中的处理程序。适配器允许 Remix 处理程序在 HTTP 服务器中运行。一些 JavaScript 运行时，尤其是 Node.js，有多种方式来创建 HTTP 服务器。例如，在 Node.js 中，你可以使用 Express.js、fastify 或原生 `http.createServer`。

这些服务器各自有自己的请求/响应 API。适配器的工作是将传入的请求转换为 Web Fetch 请求，运行 Remix 处理程序，然后将 Web Fetch 响应适配回主机服务器的响应 API。

以下是一些伪代码，说明了流程。

```tsx
// import the app build created by `remix build`
import build from "./build/index.js";

// an express http server
const app = express();

// and here your Remix app is "just a request handler"
app.all("*", createRequestHandler({ build }));

// This is pseudo code, but illustrates what adapters do:
export function createRequestHandler({ build }) {
  // creates a Fetch API request handler from the server build
  const handleRequest = createRemixRequestHandler(build);

  // returns an express.js specific handler for the express server
  return async (req, res) => {
    // adapts the express.req to a Fetch API request
    const request = createRemixRequest(req);

    // calls the app handler and receives a Fetch API response
    const response = await handleRequest(request);

    // adapts the Fetch API response to the express.res
    sendRemixResponse(res, response);
  };
}
```

### Remix App Server

为了方便，Remix App Server 是一个基本的 express 服务器，适用于新项目、实验或没有对服务器（如 Express）有特定需求的项目，并且部署在 Node.js 环境中。

见 [`@remix-run/serve`][serve]

## 模板

Remix 旨在提供极大的灵活性，同时具备足够的意见以将 UI 连接到后端，但它不对您使用的数据库、如何缓存数据或您的应用程序的部署位置和方式提出意见。

Remix 模板是应用开发的起点，包含了所有这些额外的意见，由社区创建。

您可以在 Remix CLI 中使用 `--template` 标志来使用指向 GitHub 上某个仓库的模板：

```
npx create-remix@latest --template <org>/<repo>
```

您可以在 [模板指南][templates_guide] 中阅读更多关于模板的信息。

一旦您选择了一个模板或 [从头开始设置应用][quickstart]，您就准备好开始构建您的应用了！

[templates]: https://remix.guide/templates
[serve]: ../other-api/serve
[quickstart]: ../start/quickstart
[templates_guide]: ../guides/templates
[remix_run_cloudflare_pages]: https://npm.im/@remix-run/cloudflare-pages
[remix_run_cloudflare_workers]: https://npm.im/@remix-run/cloudflare-workers
[remix_run_deno]: https://npm.im/@remix-run/deno
[remix_run_node]: https://npm.im/@remix-run/node