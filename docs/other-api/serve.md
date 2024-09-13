---
title: "@remix-run/serve"
order: 3
---

# Remix 应用服务器

Remix 旨在让您拥有自己的服务器，但如果您不想设置一个，可以使用 Remix 应用服务器。它是一个生产就绪但基本的 Node.js 服务器，使用 Express 构建。如果您发现想要自定义它，可以使用 `@remix-run/express` 适配器。

## `HOST` 环境变量

您可以通过 `process.env.HOST` 配置您的 Express 应用程序的主机名，该值将在启动服务器时传递给内部 [`app.listen`][express-listen] 方法。

```shellscript nonumber
HOST=127.0.0.1 npx remix-serve build/index.js
```

```shellscript nonumber
remix-serve <server-build-path>
# 例如：
remix-serve build/index.js
```

## `PORT` 环境变量

您可以通过环境变量更改服务器的端口。

```shellscript nonumber
PORT=4000 npx remix-serve build/index.js
```

## 开发环境

根据 `process.env.NODE_ENV`，服务器将在开发模式或生产模式下启动。

`server-build-path` 需要指向 `remix.config.js` 中定义的 `serverBuildPath`。

由于只有构建产物（`build/`，`public/build/`）需要部署到生产环境，因此 `remix.config.js` 在生产环境中不一定可用，因此你需要通过此选项告知 Remix 你的服务器构建位置。

在开发模式下，`remix-serve` 将通过清除每个请求的 `require` 缓存来确保运行最新的代码。这对你的代码可能有一些影响，你需要了解：

- 模块作用域中的任何值将被“重置”

  ```tsx lines=[1-3]
  // 由于模块缓存被清除，这将在每个请求中重置
  const cache = new Map();

  export async function loader({
    params,
  }: LoaderFunctionArgs) {
    if (cache.has(params.foo)) {
      return json(cache.get(params.foo));
    }

    const record = await fakeDb.stuff.find(params.foo);
    cache.set(params.foo, record);
    return json(record);
  }
  ```

  如果你需要在开发中保留缓存的解决方法，可以在你的服务器中设置一个 [singleton][singleton]。

- 任何 **模块副作用** 将保持不变！这可能会导致问题，但应该尽量避免。

  ```tsx lines=[3-6]
  import { json } from "@remix-run/node"; // 或 cloudflare/deno

  // 这将在模块被导入时开始运行
  setInterval(() => {
    console.log(Date.now());
  }, 1000);

  export async function loader() {
    // ...
  }
  ```

  如果你需要以具有这些类型的模块副作用的方式编写代码，你应该设置自己的 [@remix-run/express][remix-run-express] 服务器，并在开发中使用 pm2-dev 或 nodemon 等工具在文件更改时重启服务器。

在生产环境中不会发生这种情况。服务器启动后就结束了。

[remix-run-express]: ./adapter#createrequesthandler  
[singleton]: ../guides/manual-mode#keeping-in-memory-server-state-across-rebuilds  
[express-listen]: https://expressjs.com/en/api.html#app.listen