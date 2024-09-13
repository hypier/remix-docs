---
title: useRevalidator
new: true
---

# `useRevalidator`

在正常数据变更之外的原因下重新验证页面上的数据，例如窗口聚焦或定时轮询。

```tsx
import { useRevalidator } from "@remix-run/react";

function WindowFocusRevalidator() {
  const revalidator = useRevalidator();

  useFakeWindowFocus(() => {
    revalidator.revalidate();
  });

  return (
    <div hidden={revalidator.state === "idle"}>
      正在重新验证...
    </div>
  );
}
```

当调用操作时，Remix 已经会自动重新验证页面上的数据。如果您发现自己在响应用户交互时使用此功能进行正常的 CRUD 操作，那么您可能没有充分利用其他 API，例如 [`<Form>`][form-component]、[`useSubmit`][use-submit] 或 [`useFetcher`][use-fetcher]，这些操作是自动完成的。

## 属性

### `revalidator.state`

重新验证的状态。可以是 `"idle"` 或 `"loading"`。

### `revalidator.revalidate()`

启动重新验证。

```tsx
function useLivePageData() {
  const revalidator = useRevalidator();
  const interval = useInterval(5000);

  useEffect(() => {
    if (revalidator.state === "idle") {
      revalidator.revalidate();
    }
  }, [interval, revalidator]);
}
```

## 注意事项

虽然您可以同时渲染多个 `useRevalidator` 的实例，但其底层是一个单例。这意味着当调用一个 `revalidator.revalidate()` 时，所有实例都会一起进入 `"loading"` 状态（或者说，它们都会更新以报告单例状态）。

当调用 `revalidate()` 时，如果由于其他原因已经在进行重新验证，则会自动处理竞争条件。

如果在重新验证进行中发生导航，重新验证将被取消，并将从所有加载器请求下一页的新数据。

[form-component]: ../components/form  
[use-fetcher]: ./use-fetcher  
[use-submit]: ./use-submit