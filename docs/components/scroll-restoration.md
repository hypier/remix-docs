---
title: 滚动恢复
---

# `<ScrollRestoration>`

该组件将在 [`loader`][loader] 完成后模拟浏览器在位置变化时的滚动恢复。这确保了滚动位置在正确的时间恢复到正确的位置，即使跨域也能如此。

您应该仅在 [`<Scripts/>`][scripts_component] 组件之前渲染一个这样的组件。

```tsx lines=[3,11]
import {
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export default function Root() {
  return (
    <html>
      <body>
        {/* ... */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

## 道具

### `getKey`

可选。定义用于恢复滚动位置的键。

```tsx
<ScrollRestoration
  getKey={(location, matches) => {
    // default behavior
    return location.key;
  }}
/>
```

<details>

<summary>讨论</summary>

使用 `location.key` 模拟浏览器的默认行为。用户可以在堆栈中多次导航到相同的 URL，每个条目都有自己的滚动位置以供恢复。

某些应用程序可能希望覆盖此行为，并根据其他内容恢复位置。考虑一个有四个主要页面的社交应用：

- "/home"
- "/messages"
- "/notifications"
- "/search"

如果用户从 "/home" 开始，向下滚动一点，点击导航菜单中的 "messages"，然后在导航菜单中点击 "home"（而不是后退按钮！），历史堆栈中将有三个条目：

```
1. /home
2. /messages
3. /home
```

默认情况下，React Router（和浏览器）将为 `1` 和 `3` 存储两个不同的滚动位置，即使它们具有相同的 URL。这意味着，当用户从 `2` → `3` 导航时，滚动位置会回到顶部，而不是恢复到 `1` 的位置。

一个明智的产品决策是无论用户如何到达，都保持用户在主页上的滚动位置（无论是后退按钮还是新的链接点击）。为此，您需要使用 `location.pathname` 作为键。

```tsx
<ScrollRestoration
  getKey={(location, matches) => {
    return location.pathname;
  }}
/>
```

或者您可能只想对某些路径使用路径名，并对其他所有内容使用正常行为：

```tsx
<ScrollRestoration
  getKey={(location, matches) => {
    const paths = ["/home", "/notifications"];
    return paths.includes(location.pathname)
      ? // home 和 notifications 根据路径名恢复
        location.pathname
      : // 其他所有内容根据位置像浏览器一样
        location.key;
  }}
/>
```

</details>

### `nonce`

`<ScrollRestoration>` 渲染一个内联 [`<script>`][script_element] 以防止滚动闪烁。`nonce` 属性将被传递到脚本标签，以允许使用 CSP nonce。

```tsx
<ScrollRestoration nonce={cspNonce} />
```

## 防止滚动重置

在导航到新位置时，滚动位置会重置到页面顶部。您可以通过链接和表单防止“滚动到顶部”的行为：

```tsx
<Link preventScrollReset={true} />;
<Form preventScrollReset={true} />;
```

另请参阅：[`<Form preventScrollReset>`][form_prevent_scroll_reset]，[`<Link preventScrollReset>`][link_prevent_scroll_reset]

[loader]: ../route/loader
[scripts_component]: ./scripts
[script_element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
[form_prevent_scroll_reset]: ../components/form#preventscrollreset
[link_prevent_scroll_reset]: ../components/link#preventscrollreset