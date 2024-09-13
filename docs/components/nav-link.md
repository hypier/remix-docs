---
title: 导航链接
---

# `<NavLink>`

将 [`<Link>`][link-component] 包装起来，并添加用于样式化活动和待处理状态的附加属性。

```tsx
import { NavLink } from "@remix-run/react";

<NavLink
  to="/messages"
  className={({ isActive, isPending }) =>
    isPending ? "pending" : isActive ? "active" : ""
  }
>
  Messages
</NavLink>;
```

## 自动属性

### `.active`

当 `<NavLink>` 组件处于活动状态时，会添加 `active` 类，因此您可以使用 CSS 来样式化它。

```tsx
<NavLink to="/messages" />
```

```css
a.active {
  color: red;
}
```

### `aria-current`

当 `NavLink` 处于活动状态时，它将自动应用 `<a aria-current="page">` 到底层锚标签。请参见 MDN 上的 [`aria-current`][aria-current]。

### `.pending`

当 `<NavLink>` 组件在导航过程中处于待处理状态时，会添加一个 `pending` 类，因此您可以使用 CSS 来样式化它。

```tsx
<NavLink to="/messages" />
```

```css
a.pending {
  color: red;
}
```

### `.transitioning`

当 [`<NavLink unstable_viewTransition>`][view-transition-prop] 组件在导航过程中进行过渡时，会添加一个 `transitioning` 类，因此您可以使用 CSS 对其进行样式设置。

```tsx
<NavLink to="/messages" unstable_viewTransition />
```

```css
a.transitioning {
  view-transition-name: my-transition;
}
```

## 道具

### `className` 回调

调用活动和待处理状态，以允许自定义应用的类名。

```tsx
<NavLink
  to="/messages"
  className={({ isActive, isPending }) =>
    isPending ? "pending" : isActive ? "active" : ""
  }
>
  Messages
</NavLink>
```

### `style` 回调

回调活跃状态和待处理状态，以便自定义应用的样式。

```tsx
<NavLink
  to="/messages"
  style={({ isActive, isPending }) => {
    return {
      fontWeight: isActive ? "bold" : "",
      color: isPending ? "red" : "black",
    };
  }}
>
  Messages
</NavLink>
```

### `children` 回调

使用活动和待定状态回调，以允许自定义 `<NavLink>` 的内容。

```tsx
<NavLink to="/tasks">
  {({ isActive, isPending }) => (
    <span className={isActive ? "active" : ""}>Tasks</span>
  )}
</NavLink>
```

### `end`

`end` 属性改变了 `active` 和 `pending` 状态的匹配逻辑，仅匹配 `NavLinks` 的 `to` 路径的“末尾”。如果 URL 长于 `to`，则不再被视为活动状态。

| 链接                           | URL          | isActive |
| ----------------------------- | ------------ | -------- |
| `<NavLink to="/tasks" />`     | `/tasks`     | true     |
| `<NavLink to="/tasks" />`     | `/tasks/123` | true     |
| `<NavLink to="/tasks" end />` | `/tasks`     | true     |
| `<NavLink to="/tasks" end />` | `/tasks/123` | false    |

`<NavLink to="/">` 是一个特殊情况，因为 _每个_ URL 都匹配 `/`。为了避免默认情况下匹配每个路由，它有效地忽略了 `end` 属性，仅在你处于根路由时匹配。

### `caseSensitive`

添加 `caseSensitive` 属性会改变匹配逻辑，使其区分大小写。

| 链接                                         | URL           | isActive |
| -------------------------------------------- | ------------- | -------- |
| `<NavLink to="/SpOnGe-bOB" />`               | `/sponge-bob` | true     |
| `<NavLink to="/SpOnGe-bOB" caseSensitive />` | `/sponge-bob` | false    |

## `unstable_viewTransition`

`unstable_viewTransition` 属性通过将最终状态更新包装在 [`document.startViewTransition()`][document-start-view-transition] 中，为此导航启用 [视图过渡][view-transitions]。默认情况下，在过渡期间，将向 [`<a>` 元素][a-element] 添加一个 [`transitioning` 类][transitioning-class]，您可以使用该类自定义视图过渡。

```css
a.transitioning p {
  view-transition-name: "image-title";
}

a.transitioning img {
  view-transition-name: "image-expand";
}
```

```tsx
<NavLink to={to} unstable_viewTransition>
  <p>图像编号 {idx}</p>
  <img src={src} alt={`Img ${idx}`} />
</NavLink>
```

您还可以使用 [`className`][class-name-prop]/[`style`][style-prop] 属性或传递给 [`children`][children-prop] 的渲染属性，进一步根据 `isTransitioning` 值进行自定义。

```tsx
<NavLink to={to} unstable_viewTransition>
  {({ isTransitioning }) => (
    <>
      <p
        style={{
          viewTransitionName: isTransitioning
            ? "image-title"
            : "",
        }}
      >
        图像编号 {idx}
      </p>
      <img
        src={src}
        alt={`Img ${idx}`}
        style={{
          viewTransitionName: isTransitioning
            ? "image-expand"
            : "",
        }}
      />
    </>
  )}
</NavLink>
```

<docs-warning>
请注意，此 API 被标记为不稳定，可能会在没有主要版本发布的情况下发生重大更改。
</docs-warning>

### `<Link>` 属性

[`<Link>`][link-component] 的所有其他属性均受支持。

[link-component]: ./link  
[aria-current]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current  
[view-transition-prop]: #unstableviewtransition  
[view-transitions]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API  
[document-start-view-transition]: https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition  
[transitioning-class]: #transitioning  
[a-element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a  
[class-name-prop]: #classname-callback  
[style-prop]: #style-callback  
[children-prop]: #children-callback