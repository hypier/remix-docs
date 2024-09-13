---
title: 链接
toc: false
---

# `<Links />`

`<Links/>` 组件渲染由您的路由模块 [`links`][links] 导出创建的所有 [`<link>`][link_element] 标签。您应该将其渲染在 HTML 的 [`<head>`][head_element] 中，通常在 `app/root.tsx` 文件中。

```tsx filename=app/root.tsx lines=[7]
import { Links } from "@remix-run/react";

export default function Root() {
  return (
    <html>
      <head>
        <Links />
      </head>
      <body></body>
    </html>
  );
}
```

[link_element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link
[head_element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head
[links]: ../route/links