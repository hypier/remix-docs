---
title: useLocation
---

# `useLocation`

返回当前的位置信息对象。

```tsx
import { useLocation } from "@remix-run/react";

function SomeComponent() {
  const location = useLocation();
  // ...
}
```

## 属性

### `location.hash`

当前 URL 的哈希值。

### `location.key`

此位置的唯一键。

### `location.pathname`

当前 URL 的路径。

### `location.search`

当前 URL 的查询字符串。

### `location.state`

由 [`<Link state>`][link_component_state] 或 [`navigate`][navigate] 创建的地点状态值。

[link_component_state]: ../components/link#state
[navigate]: ./use-navigate