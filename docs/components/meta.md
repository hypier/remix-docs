---
title: 元数据
toc: false
---

# `<Meta />`

该组件渲染由您的路由模块 [`meta`][meta] 导出创建的所有 [`<meta>`][meta_element] 标签。您应该将其渲染在 HTML 的 [`<head>`][head_element] 中，通常在 `app/root.tsx` 中。

```tsx filename=app/root.tsx lines=[7]
import { Meta } from "@remix-run/react";

export default function Root() {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body></body>
    </html>
  );
}
```

[meta_element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
[head_element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head
[meta]: ../route/meta