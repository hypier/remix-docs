---
title: 注意事项
---

# 注意事项

在服务器和浏览器中使用 React 渲染应用程序时，有一些固有的问题。此外，在构建 Remix 的过程中，我们一直专注于生产结果和可扩展性。有一些开发者体验和生态系统兼容性的问题尚未解决。

本文档旨在帮助您克服这些障碍。

## `typeof window` 检查

因为相同的 JavaScript 代码可以在浏览器和服务器中运行，有时你需要有一部分代码仅在某个上下文中运行：

```ts bad
if (typeof window === "undefined") {
  // running in a server environment
} else {
  // running in a browser environment
}
```

这在 Node.js 环境中工作良好，然而，Deno 实际上支持 `window`！所以如果你真的想检查是否在浏览器中运行，最好检查 `document`：

```ts good
if (typeof document === "undefined") {
  // running in a server environment
} else {
  // running in a browser environment
}
```

这将在所有 JS 环境中有效（Node.js、Deno、Workers 等）。

## 浏览器扩展注入代码

您可能会在浏览器中遇到以下警告：

```
Warning: Did not expect server HTML to contain a <script> in <html>.
```

这是来自 React 的水合警告，最有可能是由于您的某个浏览器扩展将脚本注入到服务器渲染的 HTML 中，从而导致生成的 HTML 之间存在差异。

在隐身模式下查看页面，警告应该会消失。

## 在 `loader` 中写入会话

通常情况下，您应该只在操作中写入会话，但在某些情况下，在加载器中写入会话是有意义的（匿名用户、导航跟踪等）。

虽然多个加载器可以从同一个会话中 _读取_ 数据，但在加载器中 _写入_ 会话可能会导致问题。

Remix 加载器是并行运行的，有时会在单独的请求中运行（客户端过渡为每个加载器调用 [`fetch`][fetch]）。如果一个加载器正在写入会话，而另一个加载器试图从中读取数据，您将遇到错误和/或非确定性行为。

此外，会话是基于来自浏览器请求的 cookie 构建的。在提交会话后，它会通过 [`Set-Cookie`][set_cookie_header] 头发送到浏览器，然后在下一个请求中通过 [`Cookie`][cookie_header] 头返回到服务器。无论并行加载器如何，您都不能使用 `Set-Cookie` 写入 cookie，然后尝试从原始请求的 `Cookie` 中读取它并期望得到更新的值。它需要先往返浏览器，然后再从下一个请求中获取。

如果您需要在加载器中写入会话，请确保该加载器不与任何其他加载器共享该会话。

## 客户端包中的服务器代码

<docs-warning>本节仅在您使用[Classic Remix Compiler][classic-remix-compiler]时相关。</docs-warning>

您可能会在浏览器中遇到这个奇怪的错误。这几乎总是意味着服务器代码进入了浏览器包。

```
TypeError: Cannot read properties of undefined (reading 'root')
```

例如，您无法直接在路由模块中导入`fs-extra`：

```tsx bad filename=app/routes/_index.tsx lines=[2] nocopy
import { json } from "@remix-run/node"; // or cloudflare/deno
import fs from "fs-extra";

export async function loader() {
  return json(await fs.pathExists("../some/path"));
}

export default function SomeRoute() {
  // ...
}
```

要解决此问题，请将导入移到一个名为`*.server.ts`或`*.server.js`的不同模块中，并从那里导入。在我们的示例中，我们在`utils/fs-extra.server.ts`中创建一个新文件：

```ts filename=app/utils/fs-extra.server.ts
export { default } from "fs-extra";
```

然后将我们在路由中的导入更改为新的“包装”模块：

```tsx filename=app/routes/_index.tsx lines=[3]
import { json } from "@remix-run/node"; // or cloudflare/deno

import fs from "~/utils/fs-extra.server";

export async function loader() {
  return json(await fs.pathExists("../some/path"));
}

export default function SomeRoute() {
  // ...
}
```

更好的是，向项目提交PR，将`"sideEffects": false`添加到他们的`package.json`中，以便树摇优化的打包工具知道它们可以安全地从浏览器包中移除代码。

同样，如果您在路由模块的顶层作用域调用依赖于仅服务器代码的函数，您可能会遇到相同的错误。

例如，[Remix上传处理程序，如`unstable_createFileUploadHandler`和`unstable_createMemoryUploadHandler`][parse_multipart_form_data_upload_handler]在底层使用Node全局变量，应该仅在服务器上调用。您可以在`*.server.ts`或`*.server.js`文件中调用这些函数，或者将它们移动到路由的`action`或`loader`函数中。

因此，不要这样做：

```tsx bad filename=app/routes/some-route.tsx lines=[3-6]
import { unstable_createFileUploadHandler } from "@remix-run/node"; // or cloudflare/deno

const uploadHandler = unstable_createFileUploadHandler({
  maxPartSize: 5_000_000,
  file: ({ filename }) => filename,
});

export async function action() {
  // use `uploadHandler` here ...
}
```

您应该这样做：

```tsx filename=app/routes/some-route.tsx good lines=[4-7]
import { unstable_createFileUploadHandler } from "@remix-run/node"; // or cloudflare/deno

export async function action() {
  const uploadHandler = unstable_createFileUploadHandler({
    maxPartSize: 5_000_000,
    file: ({ filename }) => filename,
  });

  // use `uploadHandler` here ...
}
```

> 为什么会发生这种情况？

Remix使用“树摇优化”从浏览器包中移除服务器代码。路由模块的`action`、`headers`和`loader`导出中的任何内容都将被移除。这是一种很好的方法，但在生态系统兼容性上存在问题。

当您导入第三方模块时，Remix会检查该包的`package.json`中的`"sideEffects": false`。如果配置了这一点，Remix就知道可以安全地从客户端包中移除代码。如果没有，它们的导入将保留，因为代码可能依赖于模块的副作用（例如设置全局的polyfills等）。

## 导入 ESM 包

<docs-warning>本节仅在您使用 [Classic Remix Compiler][classic-remix-compiler] 时相关。</docs-warning>

您可能会尝试将仅支持 ESM 的包导入到您的应用中，并在服务器渲染时看到类似这样的错误：

```
Error [ERR_REQUIRE_ESM]: require() of ES Module /app/node_modules/dot-prop/index.js from /app/project/build/index.js not supported.
Instead change the require of /app/project/node_modules/dot-prop/index.js in /app/project/build/index.js to a dynamic import() which is available in all CommonJS modules.
```

要解决此问题，请将 ESM 包添加到 [`serverDependenciesToBundle`][server_dependencies_to_bundle] 选项中，在您的 [`remix.config.js`][remix_config] 文件中。

在我们的例子中，我们使用的是 `dot-prop` 包，因此我们可以这样做：

```js filename=remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverDependenciesToBundle: ["dot-prop"],
  // ...
};
```

> 为什么会发生这种情况？

Remix 将您的服务器构建编译为 CJS，并且不打包您的节点模块。CJS 模块无法导入 ESM 模块。

将包添加到 `serverDependenciesToBundle` 告诉 Remix 将 ESM 模块直接打包到服务器构建中，而不是在运行时要求它。

> ESM 不是未来吗？

是的！我们的计划是允许您在服务器上将应用编译为 ESM。然而，这将带来反向问题，即无法导入某些与 ESM 不兼容的 CommonJS 模块！因此，即使我们到达那一步，我们可能仍然需要这个配置。

您可能会问，为什么我们不直接为服务器打包所有内容。我们可以这样做，但这将减慢构建速度，并使生产堆栈跟踪全部指向您整个应用的单个文件。我们不想这样做。我们知道最终可以在不做这种权衡的情况下平滑解决这个问题。

随着主要部署平台现在支持 ESM 服务器端，我们相信未来比过去更光明。我们仍在为 ESM 服务器构建提供良好的开发体验而努力，我们当前的方法依赖于一些在 ESM 中无法做到的事情。我们会做到的。

## CSS 包被错误地树摇

<docs-warning>此部分仅在您使用 [Classic Remix Compiler][classic-remix-compiler] 时相关。</docs-warning>

在使用 [CSS bundling features][css_bundling] 结合 `export *` 时（例如，当使用像 `components/index.ts` 这样的索引文件从所有子目录重新导出时），您可能会发现重新导出的模块中的样式在构建输出中缺失。

这是由于 [esbuild 的 CSS 树摇问题][esbuild_css_tree_shaking_issue]。作为解决方法，您应该使用命名重新导出。

```diff
- export * from "./Button";
+ export { Button } from "./Button";
```

请注意，即使这个问题不存在，我们仍然建议使用命名重新导出！虽然这可能会引入更多的样板代码，但您可以明确控制模块的公共接口，而不是无意中暴露所有内容。

[esbuild]: https://esbuild.github.io
[parse_multipart_form_data_upload_handler]: ../utils/parse-multipart-form-data#uploadhandler
[server_dependencies_to_bundle]: ../file-conventions/remix-config#serverdependenciestobundle
[remix_config]: ../file-conventions/remix-config
[css_bundling]: ../styling/bundling
[esbuild_css_tree_shaking_issue]: https://github.com/evanw/esbuild/issues/1370
[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/fetch
[set_cookie_header]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
[cookie_header]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
[classic-remix-compiler]: ./vite#classic-remix-compiler-vs-remix-vite