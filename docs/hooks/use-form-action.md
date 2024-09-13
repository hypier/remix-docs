---
title: useFormAction
---

# `useFormAction`

解析组件层次结构中最接近的路由的 URL，而不是应用程序的当前 URL。

这在内部由 [`<Form>`][form_component] 使用，以解析到最接近的路由的操作，但也可以通用使用。

```tsx
import { useFormAction } from "@remix-run/react";

function SomeComponent() {
  // 最近的路由 URL
  const action = useFormAction();

  // 最近的路由 URL + "destroy"
  const destroyAction = useFormAction("destroy");
}
```

## 签名

```
useFormAction(action, options)
```

### `action`

可选。要附加到最近的路由 URL 的操作。

### `options`

唯一的选项是 `{ relative: "route" | "path"}`。

- **route** 默认 - 相对于路由层次，而不是 URL
- **path** - 使操作相对于 URL 路径，因此 `..` 将删除一个 URL 段。

[form_component]: ../components/form