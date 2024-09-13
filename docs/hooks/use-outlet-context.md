---
title: useOutletContext
---

# `useOutletContext`

在[React Context][react-context]之上的便利 API，返回最近的父级 [`<Outlet context={val} />`][outlet-context] 组件的上下文值。

```tsx
import { useOutletContext } from "@remix-run/react";

function Child() {
  const myValue = useOutletContext();
  // ...
}
```

## 其他资源

- [`<Outlet context>`][outlet-context]

[react-context]: https://react.dev/learn/passing-data-deeply-with-context
[outlet-context]: ../components/outlet#context