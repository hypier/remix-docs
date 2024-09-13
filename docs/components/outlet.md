---
title: 插座
---

# `<Outlet>`

渲染父路由的匹配子路由。

```tsx
import { Outlet } from "@remix-run/react";

export default function SomeParent() {
  return (
    <div>
      <h1>Parent Content</h1>

      <Outlet />
    </div>
  );
}
```

## 属性

### `context`

为插槽下方的元素树提供上下文值。当父路由需要向子路由提供值时使用。

```tsx
<Outlet context={myContextValue} />
```

另见: [`useOutletContext`][use-outlet-context]

[use-outlet-context]: ../hooks/use-outlet-context