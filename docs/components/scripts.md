---
title: 脚本
toc: false
---

# `<Scripts />`

该组件渲染您应用程序的客户端运行时。您应该将其渲染在您的 HTML 的 [`<body>`][body-element] 中，通常在 [`app/root.tsx`][root] 中。

```tsx filename=app/root.tsx lines=[8]
import { Scripts } from "@remix-run/react";

export default function Root() {
  return (
    <html>
      <head />
      <body>
        <Scripts />
      </body>
    </html>
  );
}
```

如果您不渲染 `<Scripts/>` 组件，您的应用程序仍然会像传统的无 JavaScript 的网页应用程序一样工作，仅依赖于 HTML 和浏览器行为。

## Props

`<Scripts>` 组件可以将某些属性传递给底层的 `<script>` 标签，例如：

- `<Scripts crossOrigin>` 用于将您的静态资产托管在与您的应用不同的服务器上。
- `<Scripts nonce>` 支持为您的 `<script>` 标签提供 [内容安全策略][csp] 的 [nonce-sources][csp-nonce]。

您不能传递诸如 `async`/`defer`/`src`/`type`/`noModule` 等属性，因为它们是由 Remix 内部管理的。

[body-element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body
[csp]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src
[csp-nonce]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#sources
[root]: ../file-conventions/root