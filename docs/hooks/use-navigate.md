---
title: useNavigate
---

# `useNavigate`

`useNavigate` 钩子返回一个函数，允许您根据用户交互或效果在浏览器中以编程方式导航。

```tsx
import { useNavigate } from "@remix-run/react";

function SomeComponent() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate(-1);
      }}
    />
  );
}
```

在 [`action`][action] 和 [`loader`][loader] 中，使用 [`redirect`][redirect] 通常比这个钩子更好，但它仍然有其使用场景。

## 参数

### `to: string`

最基本的用法是使用 href 字符串：

```tsx
navigate("/some/path");
```

路径可以是相对的：

```tsx
navigate("..");
navigate("../other/path");
```

<docs-info>请参阅 `useResolvedPath` 文档中关于 `future.v3_relativeSplatPath` 未来标志在斑点路由中对相对 `useNavigate()` 行为的说明，见[Splat Paths][relativesplatpath]部分</docs-info>

### `to: Partial<Path>`

您还可以传递一个 `Partial<Path>` 值：

```tsx
navigate({
  pathname: "/some/path",
  search: "?query=string",
  hash: "#hash",
});
```

### `to: Number`

传入一个数字将告诉浏览器在历史记录栈中向前或向后移动：

```tsx
navigate(-1); // go back
navigate(1); // go forward
navigate(-2); // go back two
```

请注意，这可能会使您离开应用程序，因为浏览器的历史记录栈并不局限于您的应用程序。

### `options`

第二个参数是一个选项对象：

```tsx
navigate(".", {
  replace: true,
  relative: "path",
  state: { some: "state" },
});
```

- **replace**: boolean - 替换历史堆栈中的当前条目，而不是推送一个新的条目
- **relative**: `"route" | "path"` - 定义链接的相对路径行为
  - `"route"` 将使用路由层级，因此 `".."` 将移除当前路由模式的所有 URL 段，而 `"path"` 将使用 URL 路径，因此 `".."` 将移除一个 URL 段
- **state**: any - 将持久的客户端路由状态添加到下一个位置
- **preventScrollReset**: boolean - 如果您使用 [`<ScrollRestoration>`][scroll-restoration]，在导航时防止滚动位置重置到窗口顶部
- **unstable_flushSync**: boolean - 将此导航的初始状态更新包装在 [`ReactDOM.flushSync`][flush-sync] 调用中，而不是默认的 [`React.startTransition`][start-transition]
- **unstable_viewTransition**: boolean - 通过将最终状态更新包装在 `document.startViewTransition()` 中，为此导航启用 [View Transition][view-transitions]
  - 如果您需要为此视图过渡应用特定样式，您还需要利用 [`unstable_useViewTransitionState()`][use-view-transition-state]

[redirect]: ../utils/redirect
[flush-sync]: https://react.dev/reference/react-dom/flushSync
[start-transition]: https://react.dev/reference/react/startTransition
[view-transitions]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
[use-view-transition-state]: ../hooks//use-view-transition-state
[action]: ../route/action
[loader]: ../route/loader
[relativesplatpath]: ./use-resolved-path#splat-paths
[scroll-restoration]: ../components/scroll-restoration#preventing-scroll-reset