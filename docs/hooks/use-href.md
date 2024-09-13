---
title: useHref
---

# `useHref`

根据当前的位置解析完整的 URL，以用作 [`href`][anchor_element_href_attribute] 到 [`link`][anchor_element]。如果提供了相对路径，它将解析为完整的 URL。

```tsx
import { useHref } from "@remix-run/react";

function SomeComponent() {
  const href = useHref("some/where");

  return <a href={href}>Link</a>;
}
```

## 签名

```
useHref(to, options)
```

### `to`

可选。要附加到解析后的 URL 的路径。

<docs-info>有关 `useResolvedPath` 文档中 `future.v3_relativeSplatPath` 未来标志在 splat 路由中对相对 `useHref()` 行为的影响，请参见 [Splat Paths][relativesplatpath] 部分</docs-info>

### `options`

唯一的选项是 `{ relative: "route" | "path"}`，它定义了解析相对 URL 时的行为。

- **route** 默认 - 相对于路由层次，而不是 URL
- **path** - 使操作相对于 URL 路径，因此 `..` 将移除一个 URL 段。

[anchor_element_href_attribute]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#href  
[anchor_element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link  
[relativesplatpath]: ./use-resolved-path#splat-paths