---
title: 等待
---

# `<Await>`

要开始流式数据处理，请查看[流式指南][streaming_guide]。

`<Await>`组件负责解析从[`useLoaderData`][use_loader_data]访问的延迟加载器承诺。

```tsx
import { Await } from "@remix-run/react";

<Suspense fallback={<div>Loading...</div>}>
  <Await resolve={somePromise}>
    {(resolvedValue) => <p>{resolvedValue}</p>}
  </Await>
</Suspense>;
```

## 道具

### `resolve`

resolve 属性接受一个来自 [`useLoaderData`][use_loader_data] 的 promise，当数据流入时进行解析。

```tsx
<Await resolve={somePromise} />
```

当 promise 尚未解析时，将呈现父级 suspense 边界的备用内容。

```tsx
<Suspense fallback={<div>Loading...</div>}>
  <Await resolve={somePromise} />
</Suspense>
```

当 promise 被解析时，将呈现 `children`。

### `children`

`children` 可以是一个渲染回调或一个 React 元素。

```tsx
<Await resolve={somePromise}>
  {(resolvedValue) => <p>{resolvedValue}</p>}
</Await>
```

如果 `children` 属性是一个 React 元素，解析后的值将可以通过 [`useAsyncValue`][use_async_value] 在子树中访问。

```tsx
<Await resolve={somePromise}>
  <SomeChild />
</Await>
```

```tsx
import { useAsyncValue } from "@remix-run/react";

function SomeChild() {
  const value = useAsyncValue();
  return <p>{value}</p>;
}
```

### `errorElement`

`errorElement` 属性可用于在 Promise 拒绝时渲染错误边界。

```tsx
<Await errorElement={<div>Oops!</div>} />
```

可以在子树中使用 [`useAsyncError`][use_async_error] 访问错误

```tsx
<Await errorElement={<SomeChild />} />
```

```tsx
import { useAsyncError } from "@remix-run/react";

function SomeChild() {
  const error = useAsyncError();
  return <p>{error.message}</p>;
}
```

[streaming_guide]: ../guides/streaming
[use_loader_data]: ../hooks/use-loader-data
[use_async_value]: ../hooks/use-async-value
[use_async_error]: ../hooks/use-async-error