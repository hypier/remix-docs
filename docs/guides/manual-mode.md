---
title: 手动开发服务器
---

# 手动模式

<docs-warning>本指南仅在使用 [Classic Remix Compiler][classic-remix-compiler] 时相关。</docs-warning>

默认情况下，`remix dev` 像自动驾驶一样运行。
它通过在检测到应用代码中的文件更改时自动重启应用服务器，使您的应用服务器保持最新的代码更改。
这是一种简单的方法，不会干扰您的工作，我们认为这对大多数应用来说都能很好地工作。

但是，如果应用服务器的重启速度让您感到缓慢，您可以掌控局面，将 `remix dev` 像手动驾驶一样操作：

```shellscript nonumber
remix dev --manual -c "node ./server.js"
```

这意味着您需要学习如何使用离合器换挡。
这也意味着在您适应的过程中可能会熄火。
学习需要一些时间，而且您需要维护更多的代码。

> 权力越大，责任越大。

我们认为，除非您在默认的自动模式中感到一些痛苦，否则不值得这样做。
但如果您确实有这种感觉，Remix 会为您提供支持。

## `remix dev` 的思维模型

在开始拖曳赛车之前，了解 Remix 的底层工作原理是很有帮助的。
特别重要的是要理解 `remix dev` 启动的是 _不是一个，而是两个进程_：Remix 编译器和你的应用服务器。

查看我们的视频 ["新开发流程的思维模型 🧠"][mental_model] 以获取更多细节。

<docs-info>

之前，我们将 Remix 编译器称为“新开发服务器”或“v2 开发服务器”。
从技术上讲，`remix dev` 是 Remix 编译器的一个薄层，它 _确实_ 包含一个小型服务器，具有一个单一的端点 (`/ping`) 用于协调热更新。
但是将 `remix dev` 视为“开发服务器”是不合适的，并错误地暗示它在开发中取代了你的应用服务器。
`remix dev` 并不是在替代你的应用服务器，而是与 Remix 编译器 _并行_ 运行你的应用服务器，因此你可以享受两全其美的好处：

- 由 Remix 编译器管理的热更新
- 在开发中在你的应用服务器上运行的真实生产代码路径

</docs-info>

## `remix-serve`

Remix 应用服务器 (`remix-serve`) 开箱即用地支持手动模式：

```sh
remix dev --manual
```

<docs-info>

如果您在没有 `-c` 标志的情况下运行 `remix dev`，那么您隐式地使用 `remix-serve` 作为您的应用服务器。

</docs-info>

无需学习手动驾驶，因为 `remix-serve` 内置了运动模式，可以在较高转速下更积极地自动换挡。
好吧，我觉得我们在扩展这个汽车隐喻。😅

换句话说，`remix-serve` 知道如何重新导入服务器代码更改，而无需重新启动自身。
但如果您使用 `-c` 来运行自己的应用服务器，请继续阅读。

## 学习驾驶手动挡

当您使用 `--manual` 开启手动模式时，您需要承担一些新责任：

1. 检测服务器代码更改是否可用
2. 在保持应用服务器运行的同时重新导入代码更改
3. 在这些更改被接收后，向 Remix 编译器发送“准备好”的消息

重新导入代码更改被证明是棘手的，因为 JS 导入是缓存的。

```js
import fs from "node:fs";

const original = await import("./build/index.js");
fs.writeFileSync("./build/index.js", someCode);
const changed = await import("./build/index.js");
//    ^^^^^^^ this will return the original module from the import cache without the code changes
```

当您想要重新导入带有代码更改的模块时，您需要某种方法来清除导入缓存。
此外，CommonJS (`require`) 和 ESM (`import`) 之间的模块导入方式不同，这使事情变得更加复杂。

<docs-warning>

如果您使用 `tsx` 或 `ts-node` 来运行您的 `server.ts`，这些工具可能会将您的 ESM Typescript 代码转译为 CJS Javascript 代码。
在这种情况下，您需要在 `server.ts` 中使用 CJS 缓存清除，即使您服务器代码的其余部分使用的是 `import`。

这里重要的是您的服务器代码是如何 _执行_ 的，而不是它是如何 _编写_ 的。

</docs-warning>

### 1.a CJS: `require` 缓存失效

CommonJS 使用 `require` 进行导入，这使您可以直接访问 `require` 缓存。  
这让您在重新构建时，仅针对服务器代码失效缓存。

例如，以下是如何使 Remix 服务器构建的 `require` 缓存失效：

```js
const path = require("node:path");

/** @typedef {import('@remix-run/node').ServerBuild} ServerBuild */

const BUILD_PATH = path.resolve("./build/index.js");
const VERSION_PATH = path.resolve("./build/version.txt");
const initialBuild = reimportServer();

/**
 * @returns {ServerBuild}
 */
function reimportServer() {
  // 1. 手动从 require 缓存中移除服务器构建
  Object.keys(require.cache).forEach((key) => {
    if (key.startsWith(BUILD_PATH)) {
      delete require.cache[key];
    }
  });

  // 2. 重新导入服务器构建
  return require(BUILD_PATH);
}
```

<docs-info>

`require` 缓存键是 _绝对路径_，因此请确保将您的服务器构建路径解析为绝对路径！

</docs-info>

### 1.b ESM: `import` 缓存失效

与 CJS 不同，ESM 不提供对导入缓存的直接访问。
为了解决这个问题，您可以使用时间戳查询参数来强制 ESM 将导入视为新模块。

```js
import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";

/** @typedef {import('@remix-run/node').ServerBuild} ServerBuild */

const BUILD_PATH = path.resolve("./build/index.js");
const VERSION_PATH = path.resolve("./build/version.txt");
const initialBuild = await reimportServer();

/**
 * @returns {Promise<ServerBuild>}
 */
async function reimportServer() {
  const stat = fs.statSync(BUILD_PATH);

  // convert build path to URL for Windows compatibility with dynamic `import`
  const BUILD_URL = url.pathToFileURL(BUILD_PATH).href;

  // use a timestamp query parameter to bust the import cache
  return import(BUILD_URL + "?t=" + stat.mtimeMs);
}
```

<docs-warning>

在 ESM 中，没有办法从 `import` 缓存中删除条目。
虽然我们的时间戳解决方案有效，但这意味着 `import` 缓存会随着时间的推移而增长，这最终可能导致内存溢出错误。

如果发生这种情况，您可以重新启动 `remix dev` 以从新的导入缓存开始。
未来，Remix 可能会预打包您的依赖项，以保持导入缓存的大小。

</docs-warning>

### 2. 检测服务器代码更改

现在您已经有了一个方法来清除 CJS 或 ESM 的导入缓存，是时候通过动态更新应用服务器中的服务器构建来利用它了。
要检测服务器代码何时更改，您可以使用像 [chokidar][chokidar] 这样的文件监视器：

```js
import chokidar from "chokidar";

async function handleServerUpdate() {
  build = await reimportServer();
}

chokidar
  .watch(VERSION_PATH, { ignoreInitial: true })
  .on("add", handleServerUpdate)
  .on("change", handleServerUpdate);
```

### 3. 发送“准备好”消息

现在是仔细检查您的应用服务器在初始启动时是否向 Remix 编译器发送“准备好”消息的好时机：

```js filename=server.js lines=[5-7]
const port = 3000;
app.listen(port, async () => {
  console.log(`Express server listening on port ${port}`);

  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(initialBuild);
  }
});
```

在手动模式下，您还需要在重新导入服务器构建时发送“准备好”消息：

```js lines=[4-5]
async function handleServerUpdate() {
  // 1. re-import the server build
  build = await reimportServer();
  // 2. tell Remix that this app server is now up-to-date and ready
  broadcastDevReady(build);
}
```

### 4. 开发者模式请求处理器

最后一步是将所有这些封装在一个开发模式请求处理器中：

```js
/**
 * @param {ServerBuild} initialBuild
 */
function createDevRequestHandler(initialBuild) {
  let build = initialBuild;
  async function handleServerUpdate() {
    // 1. 重新导入服务器构建
    build = await reimportServer();
    // 2. 告诉 Remix 这个应用服务器现在是最新的并且已准备好
    broadcastDevReady(build);
  }

  chokidar
    .watch(VERSION_PATH, { ignoreInitial: true })
    .on("add", handleServerUpdate)
    .on("change", handleServerUpdate);

  // 包装请求处理器以确保每个请求都使用最新构建重新创建
  return async (req, res, next) => {
    try {
      return createRequestHandler({
        build,
        mode: "development",
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
```

太棒了！
现在让我们在开发模式下插入新的手动传输：

```js filename=server.js
app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? createDevRequestHandler(initialBuild)
    : createRequestHandler({ build: initialBuild })
);
```

有关完整的应用服务器代码示例，请查看我们的 [templates][templates] 或 [community examples][community_examples]。

## 在重建过程中保持内存服务器状态

当服务器代码重新导入时，任何服务器端的内存状态都会丢失。
这包括数据库连接、缓存、内存数据结构等内容。

以下是一个实用工具，可以记住您希望在重建过程中保留的任何内存值：

```ts filename=app/utils/singleton.server.ts
// Borrowed & modified from https://github.com/jenseng/abuse-the-platform/blob/main/app/utils/singleton.ts
// Thanks @jenseng!

export const singleton = <Value>(
  name: string,
  valueFactory: () => Value
): Value => {
  const g = global as any;
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory();
  return g.__singletons[name];
};
```

例如，要在重建过程中重用 Prisma 客户端：

```ts filename=app/db.server.ts
import { PrismaClient } from "@prisma/client";

import { singleton } from "~/utils/singleton.server";

// hard-code a unique key so we can look up the client when this module gets re-imported
export const db = singleton(
  "prisma",
  () => new PrismaClient()
);
```

如果您更喜欢使用，还有一个方便的 [`remember` utility][remember] 可以帮助您。

[mental_model]: https://www.youtube.com/watch?v=zTrjaUt9hLo
[chokidar]: https://github.com/paulmillr/chokidar
[templates]: https://github.com/remix-run/remix/blob/main/templates
[community_examples]: https://github.com/xHomu/remix-v2-server
[remember]: https://npm.im/@epic-web/remember
[classic-remix-compiler]: ./vite#classic-remix-compiler-vs-remix-vite