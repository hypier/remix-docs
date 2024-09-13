---
title: useAsyncValue
new: true
---

# `useAsyncValue`

返回来自最近的 [`<Await>`][await_component] 祖先组件的已解析数据。

```tsx
function SomeDescendant() {
  const value = useAsyncValue();
  // ...
}
```

```tsx
<Await resolve={somePromise}>
  <SomeDescendant />
</Await>
```

## 其他资源

**指南**

- [流式传输][streaming_guide]

**API**

- [`<Await/>`][await_component]
- [`useAsyncError`][use_async_error]

[await_component]: ../components/await  
[streaming_guide]: ../guides/streaming  
[use_async_error]: ../hooks/use-async-error