---
title: 错误边界
---

# `ErrorBoundary`

Remix `ErrorBoundary` 组件的工作方式与普通的 React [错误边界][error-boundaries] 相同，但具有一些额外的功能。当您的路由组件发生错误时，`ErrorBoundary` 将会被渲染到其位置，嵌套在任何父路由内部。`ErrorBoundary` 组件在路由的 `loader` 或 `action` 函数发生错误时也会被渲染，因此该路由的所有错误都可以在一个地方处理。

最常见的用例通常是：

- 您可能故意抛出 4xx `Response` 来触发错误 UI
  - 在用户输入错误时抛出 400
  - 在未经授权访问时抛出 401
  - 当无法找到请求的数据时抛出 404
- 如果 React 在渲染过程中遇到运行时错误，可能会无意中抛出 `Error`

要获取抛出的对象，您可以使用 [`useRouteError`][use-route-error] 钩子。当抛出 `Response` 时，它会自动解包为一个带有 `state`/`statusText`/`data` 字段的 `ErrorResponse` 实例，因此您无需在组件中处理 `await response.json()`。要区分抛出的 `Response` 和抛出的 `Error`，您可以使用 [`isRouteErrorResponse`][is-route-error-response] 工具。

```tsx
import {
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
```

[error-boundaries]: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
[use-route-error]: ../hooks/use-route-error
[is-route-error-response]: ../utils/is-route-error-response