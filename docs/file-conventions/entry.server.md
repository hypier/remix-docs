---
title: entry.server
toc: false
---

# entry.server

默认情况下，Remix 将为您处理 HTTP 响应的生成。如果您想自定义此行为，可以运行 `npx remix reveal` 生成一个 `app/entry.server.tsx`（或 `.jsx`），该文件将优先使用。该模块的 `default` 导出是一个函数，允许您创建响应，包括 HTTP 状态、头部和 HTML，使您可以完全控制标记的生成和发送到客户端的方式。

该模块应使用 `<RemixServer>` 元素渲染当前页面的标记，并传入当前请求的 `context` 和 `url`。一旦 JavaScript 在浏览器中加载，这些标记将（可选地）被重新水合，使用 [browser entry module][browser-entry-module]。

## `handleDataRequest`

您可以导出一个可选的 `handleDataRequest` 函数，这将允许您修改数据请求的响应。这些请求不会渲染 HTML，而是在客户端水合完成后将加载器和操作数据返回给浏览器。

```tsx
export function handleDataRequest(
  response: Response,
  {
    request,
    params,
    context,
  }: LoaderFunctionArgs | ActionFunctionArgs
) {
  response.headers.set("X-Custom-Header", "value");
  return response;
}
```

## `handleError`

默认情况下，Remix 会将遇到的服务器端错误记录到控制台。如果您希望更好地控制日志记录，或希望将这些错误报告到外部服务，则可以导出一个可选的 `handleError` 函数，这将使您获得控制权（并将禁用内置的错误日志记录）。

```tsx
export function handleError(
  error: unknown,
  {
    request,
    params,
    context,
  }: LoaderFunctionArgs | ActionFunctionArgs
) {
  if (!request.signal.aborted) {
    sendErrorToErrorReportingService(error);
    console.error(formatErrorForJsonLogging(error));
  }
}
```

_请注意，通常情况下，您要避免在请求被中止时记录日志，因为 Remix 的取消和竞争条件处理可能会导致许多请求被中止。_

### 流式渲染错误

当您通过 [`renderToPipeableStream`][rendertopipeablestream] 或 [`renderToReadableStream`][rendertoreadablestream] 流式传输您的 HTML 响应时，您自己的 `handleError` 实现仅会处理在初始 shell 渲染期间遇到的错误。如果在后续的流式渲染中遇到渲染错误，您需要手动处理这些错误，因为到那时 Remix 服务器已经发送了响应。

- 对于 `renderToPipeableStream`，您可以在 `onError` 回调函数中处理这些错误。您需要在 `onShellReady` 中切换一个布尔值，以便知道错误是 shell 渲染错误（可以忽略）还是异步渲染错误（必须处理）。
  - 有关示例，请参见 Node 的默认 [`entry.server.tsx`][node-streaming-entry-server]。
- 对于 `renderToReadableStream`，您可以在 `onError` 回调函数中处理这些错误。
  - 有关示例，请参见 Cloudflare 的默认 [`entry.server.tsx`][cloudflare-streaming-entry-server]。

### 抛出响应

请注意，这并不处理来自您的 `loader`/`action` 函数的抛出 `Response` 实例。此处理程序的目的是查找代码中的错误，这些错误导致意外的抛出错误。如果您在 `loader`/`action` 中检测到某种情况并抛出 401/404 等 `Response`，那么这是您代码处理的预期流程。如果您还希望记录或将这些发送到外部服务，则应在抛出响应时进行处理。

[browser-entry-module]: ./entry.client  
[rendertopipeablestream]: https://react.dev/reference/react-dom/server/renderToPipeableStream  
[rendertoreadablestream]: https://react.dev/reference/react-dom/server/renderToReadableStream  
[node-streaming-entry-server]: https://github.com/remix-run/remix/blob/main/packages/remix-dev/config/defaults/entry.server.node.tsx  
[cloudflare-streaming-entry-server]: https://github.com/remix-run/remix/blob/main/packages/remix-dev/config/defaults/entry.server.cloudflare.tsx