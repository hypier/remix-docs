---
title: useSubmit
---

# `useSubmit`

`<Form>` 的命令式版本，让你，程序员，可以代替用户提交表单。

```tsx
import { useSubmit } from "@remix-run/react";

function SomeComponent() {
  const submit = useSubmit();
  return (
    <Form
      onChange={(event) => {
        submit(event.currentTarget);
      }}
    />
  );
}
```

## 签名

```tsx
submit(targetOrData, options);
```

### `targetOrData`

可以是以下任意一种：

**[`HTMLFormElement`][html-form-element] 实例**

```tsx
<Form
  onSubmit={(event) => {
    submit(event.currentTarget);
  }}
/>
```

**[`FormData`][form-data] 实例**

```tsx
const formData = new FormData();
formData.append("myKey", "myValue");
submit(formData, { method: "post" });
```

**将被序列化为 `FormData` 的普通对象**

```tsx
submit({ myKey: "myValue" }, { method: "post" });
```

**将被序列化为 JSON 的普通对象**

```tsx
submit(
  { myKey: "myValue" },
  { method: "post", encType: "application/json" }
);
```

### `options`

提交的选项，与 [`<Form>`][form-component] 属性相同。所有选项都是可选的。

- **action**: 提交的 href。默认是当前路由路径。
- **method**: 使用的 HTTP 方法，如 POST，默认是 GET。
- **encType**: 表单提交使用的编码类型：`application/x-www-form-urlencoded`、`multipart/form-data`、`application/json` 或 `text/plain`。默认是 `application/x-www-form-urlencoded`。
- **navigate**: 指定为 `false` 以使用 fetcher 提交，而不是进行导航。
- **fetcherKey**: 使用 fetcher 提交时的 fetcher 键，需通过 `navigate: false`。
- **preventScrollReset**: 防止在提交数据时滚动位置重置到窗口顶部。默认是 `false`。
- **replace**: 替换历史堆栈中的当前条目，而不是推送新条目。默认是 `false`。
- **relative**: 定义相对路由解析行为。可以是 `"route"`（相对于路由层次）或 `"path"`（相对于 URL）。
- **unstable_flushSync**: 将此导航的初始状态更新包装在 [`ReactDOM.flushSync`][flush-sync] 调用中，而不是默认的 [`React.startTransition`][start-transition]。
- **unstable_viewTransition**: 通过将最终状态更新包装在 `document.startViewTransition()` 中，为此导航启用 [视图过渡][view-transitions]。
  - 如果您需要为此视图过渡应用特定样式，您还需要利用 [`unstable_useViewTransitionState()`][use-view-transition-state]。

```tsx
submit(data, {
  action: "",
  method: "post",
  encType: "application/x-www-form-urlencoded",
  preventScrollReset: false,
  replace: false,
  relative: "route",
});
```

<docs-info>有关 `useResolvedPath` 文档中 `future.v3_relativeSplatPath` 未来标志在 splat 路由内相对 `useSubmit()` 行为的说明，请参见 [Splat Paths][relativesplatpath] 部分。</docs-info>

## 其他资源

**讨论**

- [表单与获取器][form-vs-fetcher]

**相关 API**

- [`<Form>`][form-component]
- [`fetcher.submit`][fetcher-submit]

[form-component]: ../components/form
[html-form-element]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement
[form-data]: https://developer.mozilla.org/en-US/docs/Web/API/FormData
[form-vs-fetcher]: ../discussion/form-vs-fetcher
[fetcher-submit]: ../hooks/use-fetcher#fetchersubmitformdata-options
[flush-sync]: https://react.dev/reference/react-dom/flushSync
[start-transition]: https://react.dev/reference/react/startTransition
[view-transitions]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
[use-view-transition-state]: ../hooks//use-view-transition-state
[relativesplatpath]: ./use-resolved-path#splat-paths