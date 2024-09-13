---
title: 未找到处理
---

# 未找到 (404) 处理

当文档在 web 服务器上未找到时，它应该发送一个 [404 状态码][404-status-code]。这向机器表明文档不存在：搜索引擎不会对其进行索引，CDN 不会缓存它，等等。如今大多数单页应用（SPA）无论页面是否存在都只返回 200，但对你来说，这种情况从今天开始就要改变了！

Remix 网站应该发送 404 的主要情况有两个：

- URL 不匹配应用中的任何路由
- 你的加载器没有找到任何数据

第一种情况已经由 Remix 处理，你不需要自己抛出响应。它知道你的路由，因此知道是否没有匹配（_考虑使用 [Splat Route][splat-route] 来处理这种情况_）。第二种情况由你决定，但其实非常简单。

## 如何发送404

一旦你知道用户正在寻找的内容不存在，你应该 _抛出一个响应_。

```tsx filename=app/routes/page.$slug.tsx
export async function loader({
  params,
}: LoaderFunctionArgs) {
  const page = await db.page.findOne({
    where: { slug: params.slug },
  });

  if (!page) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return json(page);
}
```

Remix 将捕获该响应并将你的应用程序发送到 [Error Boundary][error-boundary] 路径。实际上，这与 Remix 的自动 [错误处理][errors] 完全相同，但你将收到一个包含响应 `status`、`statusText` 和提取的 `data` 的对象，而不是从 `useRouteError()` 接收到一个 `Error`。

抛出响应的好处在于你的加载器中的代码会 _停止执行_。你的其余代码不必处理页面是否被定义的可能性（这对 TypeScript 特别有用）。

抛出响应还确保如果加载器不成功，你的路由组件不会渲染。你的路由组件只需考虑“正常路径”。它们不需要处理待处理状态、错误状态，或在我们这里的未找到状态。

## 根错误边界

您可能已经在应用程序的根部有一个。这将处理所有在嵌套路由中未处理的抛出响应。以下是一个示例：

```tsx
export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
            ? error.message
            : "Unknown Error"}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}
```

[error-boundary]: ../route/error-boundary  
[errors]: ./errors  
[404-status-code]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404  
[splat-route]: ../file-conventions/routes#splat-routes