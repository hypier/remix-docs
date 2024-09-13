---
title: useRouteError
new: true
---

# `useRouteError`

访问在[`action`][action]、[`loader`][loader]或渲染过程中抛出的错误，以便在[`ErrorBoundary`][error-boundary]中使用。

```jsx filename=routes/some-route.tsx
export function ErrorBoundary() {
  const error = useRouteError();
  return <div>{error.message}</div>;
}
```

## 其他资源

**指南**

- [错误处理指南][error-handling-guide]

**API 参考**

- [`ErrorBoundary`][error-boundary]

[action]: ../route/action
[loader]: ../route/loader
[error-boundary]: ../route/error-boundary
[error-handling-guide]: ../guides/errors