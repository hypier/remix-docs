---
title: "本地 TLS"
---

# 本地 TLS

<docs-warning>本指南目前仅在使用 [Classic Remix Compiler][classic-remix-compiler] 时相关。</docs-warning>

在本地使用 HTTP 更简单，但如果你确实需要在本地使用 HTTPS，以下是实现方法。

<docs-warning>

`remix-serve` 不支持本地 HTTPS，因为它旨在作为一个最小化的服务器来帮助你启动。
`remix-serve` 是一个简单的 Express 封装，因此如果你想在本地使用 HTTPS，可以直接使用 Express。

如果你在没有 `-c` 标志的情况下运行 `remix dev`，则隐式地使用 `remix-serve` 作为你的应用服务器。

</docs-warning>

## 使用本地 TLS 运行应用服务器

第一步是让您的应用服务器在不运行 `remix dev` 的情况下运行本地 TLS。这将为您在下一部分中使用本地 TLS 设置 `remix dev` 打下成功的基础。

👉 安装 [`mkcert`][mkcert]

👉 创建一个本地证书颁发机构：

```shellscript nonumber
mkcert -install
```

👉 告诉 Node 使用我们的本地 CA：

```shellscript nonumber
export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
```

👉 创建一个 TLS 密钥和证书：

```shellscript nonumber
mkcert -key-file key.pem -cert-file cert.pem localhost
```

<docs-info>

如果您使用自定义主机名，可以在生成 TLS 密钥和证书时将 `localhost` 更改为其他名称。

</docs-info>

👉 使用 `key.pem` 和 `cert.pem` 使您的应用服务器在本地支持 HTTPS。

您如何做到这一点将取决于您使用的应用服务器。例如，以下是如何在 Express 服务器中使用 HTTPS：

```ts filename=server.ts
import fs from "node:fs";
import https from "node:https";
import path from "node:path";

import express from "express";

const BUILD_DIR = path.resolve(__dirname, "build");
const build = require(BUILD_DIR);

const app = express();

// ... 设置您的 express 应用的代码在这里 ...

const server = https.createServer(
  {
    key: fs.readFileSync("path/to/key.pem"),
    cert: fs.readFileSync("path/to/cert.pem"),
  },
  app
);

const port = 3000;
server.listen(port, () => {
  // ... 服务器运行后执行的代码在这里 ...
});
```

👉 使用本地 TLS 运行您的应用服务器

例如，使用上面的 Express 服务器，您可以这样运行它：

```shellscript nonumber
remix build
node ./server.js
```

## 使用本地 TLS 运行 `remix dev`

确保您可以在没有 `remix dev` 的情况下运行您的应用程序！如果您还没有这样做，请查看上一节。

👉 为 `remix dev` 启用 TLS

通过配置：

```js filename=remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  dev: {
    tlsKey: "key.pem", // 相对于当前工作目录
    tlsCert: "cert.pem", // 相对于当前工作目录
  },
};
```

或通过标志：

```shellscript nonumber
remix dev --tls-key=key.pem --tls-cert=cert.pem -c "node ./server.js"
```

您的应用现在应该正在使用本地 TLS 运行！

[mkcert]: https://github.com/FiloSottile/mkcert#installation
[classic-remix-compiler]: ./vite#classic-remix-compiler-vs-remix-vite