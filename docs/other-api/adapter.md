---
title: "@remix-run/{适配器}"
position: 3
---

# 服务器适配器

## 官方适配器

习惯用语 Remix 应用程序通常可以在任何地方部署，因为 Remix 将服务器的请求/响应适配到 [Web Fetch API][web-fetch-api]。它通过适配器来实现这一点。我们维护了一些适配器：

- `@remix-run/architect`
- `@remix-run/cloudflare-pages`
- `@remix-run/cloudflare-workers`
- `@remix-run/express`

这些适配器被导入到您的服务器入口中，而不在您的 Remix 应用程序内部使用。

如果您使用 `npx create-remix@latest` 初始化了应用程序，并且使用了内置的 Remix 应用服务器以外的其他内容，您会注意到一个导入并使用这些适配器之一的 `server/index.js` 文件。

<docs-info>如果您使用的是内置的 Remix 应用服务器，则无需与此 API 交互</docs-info>

每个适配器都有相同的 API。未来我们可能会有特定于您部署平台的辅助工具。

## 社区适配器

- [`@fastly/remix-server-adapter`][fastly-remix-server-adapter] - 用于 [Fastly Compute][fastly-compute]。
- [`@mcansh/remix-fastify`][remix-fastify] - 用于 [Fastify][fastify]。
- [`@mcansh/remix-raw-http`][remix-raw-http] - 用于传统的裸机 Node 服务器。
- [`@netlify/remix-adapter`][netlify-remix-adapter] - 用于 [Netlify][netlify]。
- [`@netlify/remix-edge-adapter`][netlify-remix-edge-adapter] - 用于 [Netlify][netlify] Edge。
- [`@vercel/remix`][vercel-remix] - 用于 [Vercel][vercel]。
- [`remix-google-cloud-functions`][remix-google-cloud-functions] - 用于 [Google Cloud][google-cloud-functions] 和 [Firebase][firebase-functions] 函数。
- [`partymix`][partymix] - 用于 [PartyKit][partykit]。
- [`@scandinavianairlines/remix-azure-functions`][remix-azure-functions]: 用于 [Azure Functions][azure-functions] 和 [Azure Static Web Apps][azure-static-web-apps]。

## 创建适配器

### `createRequestHandler`

为您的服务器创建一个请求处理程序，以服务应用程序。这是您的 Remix 应用程序的最终入口点。

```ts
const {
  createRequestHandler,
} = require("@remix-run/{adapter}");
createRequestHandler({ build, getLoadContext });
```

这是一个完整的与 express 的示例：

```ts lines=[1-3,11-22]
const {
  createRequestHandler,
} = require("@remix-run/express");
const express = require("express");

const app = express();

// 需要处理所有请求方法 (GET, POST 等)
app.all(
  "*",
  createRequestHandler({
    // `remix build` 和 `remix dev` 将文件输出到构建目录，您需要
    // 将该构建传递给请求处理程序
    build: require("./build"),

    // 在这里返回您希望在加载器和操作中作为 `context` 可用的任何内容。
    // 这是您可以在 Remix 和您的服务器之间架起桥梁的地方
    getLoadContext(req, res) {
      return {};
    },
  })
);
```

这是一个与 Architect (AWS) 的示例：

```ts
const {
  createRequestHandler,
} = require("@remix-run/architect");
exports.handler = createRequestHandler({
  build: require("./build"),
});
```

这是一个与简化的 Cloudflare Workers API 的示例：

```ts
import { createEventHandler } from "@remix-run/cloudflare-workers";

import * as build from "../build";

addEventListener("fetch", createEventHandler({ build }));
```

这是一个与低级 Cloudflare Workers API 的示例：

```ts
import {
  createRequestHandler,
  handleAsset,
} from "@remix-run/cloudflare-workers";

import * as build from "../build";

const handleRequest = createRequestHandler({ build });

const handleEvent = async (event: FetchEvent) => {
  let response = await handleAsset(event, build);

  if (!response) {
    response = await handleRequest(event);
  }

  return response;
};

addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e: any) {
    if (process.env.NODE_ENV === "development") {
      event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        })
      );
    }

    event.respondWith(
      new Response("内部错误", { status: 500 })
    );
  }
});
```

[web-fetch-api]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[fastly-remix-server-adapter]: https://github.com/fastly/remix-compute-js/tree/main/packages/remix-server-adapter
[fastly-compute]: https://developer.fastly.com/learning/compute/
[remix-google-cloud-functions]: https://github.com/penx/remix-google-cloud-functions
[google-cloud-functions]: https://cloud.google.com/functions
[firebase-functions]: https://firebase.google.com/docs/functions
[remix-fastify]: https://github.com/mcansh/remix-fastify
[fastify]: https://www.fastify.io
[remix-raw-http]: https://github.com/mcansh/remix-node-http-server
[netlify-remix-adapter]: https://github.com/netlify/remix-compute/tree/main/packages/remix-adapter
[netlify-remix-edge-adapter]: https://github.com/netlify/remix-compute/tree/main/packages/remix-edge-adapter
[netlify]: https://netlify.com
[vercel-remix]: https://github.com/vercel/remix/blob/main/packages/vercel-remix
[vercel]: https://vercel.com
[partykit]: https://partykit.io
[partymix]: https://github.com/partykit/partykit/tree/main/packages/partymix
[remix-azure-functions]: https://github.com/scandinavianairlines/remix-azure-functions
[azure-functions]: https://azure.microsoft.com/en-us/products/functions/
[azure-static-web-apps]: https://azure.microsoft.com/en-us/products/app-service/static