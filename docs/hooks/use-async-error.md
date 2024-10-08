---
title: useAsyncError
new: true
---

# `useAsyncError`

返回最近的 [`<Await>`][await_component] 组件的拒绝值。

```tsx lines[4,12]
import { Await, useAsyncError } from "@remix-run/react";

function ErrorElement() {
  const error = useAsyncError();
  return (
    <p>Uh Oh, something went wrong! {error.message}</p>
  );
}

<Await
  resolve={promiseThatRejects}
  errorElement={<ErrorElement />}
/>;
```

## 其他资源

**指南**

- [流式传输][streaming_guide]

**API**

- [`<Await/>`][await_component]
- [`useAsyncValue()`][use_async_value]

[await_component]: ../components/await
[streaming_guide]: ../guides/streaming
[use_async_value]: ../hooks/use-async-value