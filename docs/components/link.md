---
title: 链接
---

# `<Link>`

一个 `<a href>` 包装器，用于启用客户端路由的导航。

```tsx
import { Link } from "@remix-run/react";

<Link to="/dashboard">Dashboard</Link>;
```

<docs-info>有关在斑点路由中相对 `<Link to>` 行为的 `future.v3_relativeSplatPath` 未来标志的行为说明，请参阅 `useResolvedPath` 文档中的 [Splat Paths][relativesplatpath] 部分</docs-info>

## 属性

### `to: string`

最基本的用法是接受一个 href 字符串：

```tsx
<Link to="/some/path" />
```

### `to: Partial<Path>`

您还可以传递一个 `Partial<Path>` 值：

```tsx
<Link
  to={{
    pathname: "/some/path",
    search: "?query=string",
    hash: "#hash",
  }}
/>
```

### `discover`

定义在使用 [`future.unstable_lazyRouteDiscovery`][lazy-route-discovery] 时的路由发现行为。

```tsx
<>
  <Link /> {/* 默认使用 "render" */}
  <Link discover="none" />
</>
```

- **render** - 默认，在链接渲染时发现路由
- **none** - 不主动发现，仅在点击链接时发现

### `prefetch`

定义链接的数据和模块预取行为。

```tsx
<>
  <Link /> {/* 默认为 "none" */}
  <Link prefetch="none" />
  <Link prefetch="intent" />
  <Link prefetch="render" />
  <Link prefetch="viewport" />
</>
```

- **none** - 默认，不进行预取
- **intent** - 当用户悬停或聚焦链接时进行预取
- **render** - 当链接渲染时进行预取
- **viewport** - 当链接在视口内时进行预取，非常适合移动设备

预取是通过 HTML `<link rel="prefetch">` 标签完成的。它们在链接后插入。

```tsx
<nav>
  <a href="..." />
  <a href="..." />
  <link rel="prefetch" /> {/* 可能会有条件地渲染 */}
</nav>
```

因此，如果您使用 `nav :last-child`，您需要使用 `nav :last-of-type`，以便样式不会有条件地失效于您的最后一个链接（以及其他类似选择器）。

### `preventScrollReset`

如果您正在使用 [`<ScrollRestoration>`][scroll-restoration-component]，这可以让您在点击链接时防止滚动位置被重置到窗口顶部。

```tsx
<Link to="?tab=one" preventScrollReset />
```

这并不会阻止用户使用后退/前进按钮返回时滚动位置的恢复，它只是防止在用户点击链接时的重置。

<details>

<summary>讨论</summary>

您可能希望这种行为的一个例子是一个操作 URL 查询参数的标签列表，这些标签不在页面顶部。您不希望滚动位置跳到顶部，因为这可能会使切换的内容滚出视口！

```text
      ┌─────────────────────────┐
      │                         ├──┐
      │                         │  │
      │                         │  │ 已滚动
      │                         │  │ 超出视图
      │                         │  │
      │                         │ ◄┘
    ┌─┴─────────────────────────┴─┐
    │                             ├─┐
    │                             │ │ 视口
    │   ┌─────────────────────┐   │ │
    │   │  tab   tab   tab    │   │ │
    │   ├─────────────────────┤   │ │
    │   │                     │   │ │
    │   │                     │   │ │
    │   │ 内容                │   │ │
    │   │                     │   │ │
    │   │                     │   │ │
    │   └─────────────────────┘   │ │
    │                             │◄┘
    └─────────────────────────────┘

```

</details>

### `relative`

定义链接的相对路径行为。

```tsx
<Link to=".." />; // default: "route"
<Link relative="route" />;
<Link relative="path" />;
```

- **route** - 默认，相对于路由层次结构，因此 `..` 将删除当前路由模式的所有 URL 段
- **path** - 相对于路径，因此 `..` 将删除一个 URL 段

### `reloadDocument`

单击链接时将使用文档导航，而不是客户端路由，浏览器将正常处理过渡（就像它是一个 `<a href>` 一样）。

```tsx
<Link to="/logout" reloadDocument />
```

### `replace`

`replace` 属性将替换历史堆栈中的当前条目，而不是将新的条目推入其中。

```tsx
<Link replace />
```

```
# 历史堆栈如下
A -> B

# 正常链接点击会推入一个新条目
A -> B -> C

# 但使用 `replace` 时，B 被 C 替换
A -> C
```

### `state`

将持久的客户端路由状态添加到下一个位置。

```tsx
<Link to="/somewhere/else" state={{ some: "value" }} />
```

可以从 `location` 访问位置状态。

```tsx
function SomeComp() {
  const location = useLocation();
  location.state; // { some: "value" }
}
```

该状态在服务器上不可访问，因为它是基于 [`history.state`][history-state] 实现的。

## `unstable_viewTransition`

`unstable_viewTransition` 属性通过将最终状态更新包装在 [`document.startViewTransition()`][document-start-view-transition] 中，为此导航启用 [视图过渡][view-transitions]：

```jsx
<Link to={to} unstable_viewTransition>
  Click me
</Link>
```

如果您需要为此视图过渡应用特定样式，您还需要利用 [`unstable_useViewTransitionState()`][use-view-transition-state]：

```jsx
function ImageLink(to) {
  const isTransitioning =
    unstable_useViewTransitionState(to);
  return (
    <Link to={to} unstable_viewTransition>
      <p
        style={{
          viewTransitionName: isTransitioning
            ? "image-title"
            : "",
        }}
      >
        图片编号 {idx}
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
    </Link>
  );
}
```

<docs-warning>
请注意，此 API 被标记为不稳定，可能会在没有重大版本发布的情况下发生破坏性更改。
</docs-warning>

[scroll-restoration-component]: ./scroll-restoration
[history-state]: https://developer.mozilla.org/en-US/docs/Web/API/History/state
[view-transitions]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
[document-start-view-transition]: https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition
[use-view-transition-state]: ../hooks/use-view-transition-state
[relativesplatpath]: ../hooks/use-resolved-path#splat-paths
[lazy-route-discovery]: ../guides/lazy-route-discovery