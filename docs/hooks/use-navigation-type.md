---
title: useNavigationType
---

# `useNavigationType`

返回用户到达当前位置时使用的导航类型。

```tsx
import { useNavigationType } from "@remix-run/react";

function SomeComponent() {
  const navigationType = useNavigationType();
  // ...
}
```

## 返回值

- **PUSH**: 用户通过历史堆栈的推送操作来到当前页面：点击链接或提交表单等。
- **REPLACE**: 用户通过历史堆栈的替换操作来到当前页面：点击带有 `<Link replace>` 的链接，提交带有 `<Form replace>` 的表单或调用 `navigate(to, { replace: true })` 等。
- **POP**: 用户通过历史堆栈的弹出操作来到当前页面：点击后退或前进按钮，调用 `navigate(-1)` 或 `navigate(1)` 等。

## 附加资源

- [`<Link replace>`][link-replace]
- [`<Form replace>`][form-replace]
- [`navigate` 选项][navigate-options]

[link-replace]: ../components/link#replace
[form-replace]: ../components/form#replace
[navigate-options]: ../hooks/use-navigate#options