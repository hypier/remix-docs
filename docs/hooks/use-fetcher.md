---
title: useFetcher
---

# `useFetcher`

用于在不进行导航的情况下与服务器交互的钩子。

```tsx
import { useFetcher } from "@remix-run/react";

export function SomeComponent() {
  const fetcher = useFetcher();
  // ...
}
```

## 选项

### `key`

默认情况下，`useFetcher` 会生成一个唯一的 fetcher，作用于该组件（但是，在请求进行中，它可能会在 [`useFetchers()`][use_fetchers] 中被查找）。如果您想用自己的键来标识一个 fetcher，以便可以从应用程序的其他地方访问它，可以使用 `key` 选项：

```tsx lines=[2,8]
function AddToBagButton() {
  const fetcher = useFetcher({ key: "add-to-bag" });
  return <fetcher.Form method="post">...</fetcher.Form>;
}

// 然后，在头部...
function CartCount({ count }) {
  const fetcher = useFetcher({ key: "add-to-bag" });
  const inFlightCount = Number(
    fetcher.formData?.get("quantity") || 0
  );
  const optimisticCount = count + inFlightCount;
  return (
    <>
      <BagIcon />
      <span>{optimisticCount}</span>
    </>
  );
}
```

## 组件

### `fetcher.Form`

就像 [`<Form>`][form_component]，但它不会导致导航。

```tsx
function SomeComponent() {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" action="/some/route">
      <input type="text" />
    </fetcher.Form>
  );
}
```

## 方法

### `fetcher.submit(formData, options)`

将表单数据提交到一个路由。虽然多个嵌套路由可以匹配一个 URL，但只有叶子路由会被调用。

`formData` 可以是多种类型：

- [`FormData`][form_data] - 一个 `FormData` 实例。
- [`HTMLFormElement`][html_form_element] - 一个 [`<form>`][form_element] DOM 元素。
- `Object` - 一个键/值对的对象，默认会被转换为 `FormData` 实例。您可以传递一个更复杂的对象，并通过指定 `encType: "application/json"` 将其序列化为 JSON。有关更多详细信息，请参见 [`useSubmit`][use-submit]。

如果方法是 `GET`，则会调用路由 [`loader`][loader]，并将 `formData` 序列化为 URL 作为 [`URLSearchParams`][url_search_params]。如果是 `DELETE`、`PATCH`、`POST` 或 `PUT`，则会调用路由 [`action`][action]，并将 `formData` 作为请求体。

```tsx
// Submit a FormData instance (GET request)
const formData = new FormData();
fetcher.submit(formData);

// Submit the HTML form element
fetcher.submit(event.currentTarget.form, {
  method: "POST",
});

// Submit key/value JSON as a FormData instance
fetcher.submit(
  { serialized: "values" },
  { method: "POST" }
);

// Submit raw JSON
fetcher.submit(
  {
    deeply: {
      nested: {
        json: "values",
      },
    },
  },
  {
    method: "POST",
    encType: "application/json",
  }
);
```

`fetcher.submit` 是对 `fetcher` 实例的 [`useSubmit`][use-submit] 调用的封装，因此它也接受与 `useSubmit` 相同的选项。

### `fetcher.load(href, options)`

从路由加载器加载数据。虽然多个嵌套路由可以匹配一个 URL，但只有叶子路由会被调用。

```ts
fetcher.load("/some/route");
fetcher.load("/some/route?foo=bar");
```

`fetcher.load` 在执行操作提交和通过 [`useRevalidator`][userevalidator] 进行显式重新验证请求后，默认会重新验证。由于 `fetcher.load` 加载特定的 URL，因此在路由参数或 URL 查询参数更改时不会重新验证。您可以使用 [`shouldRevalidate`][shouldrevalidate] 来优化应重新加载哪些数据。

#### `options.unstable_flushSync`

`unstable_flushSync` 选项告诉 React Router DOM 将此 `fetcher.load` 的初始状态更新包装在 [`ReactDOM.flushSync`][flush-sync] 调用中，而不是默认的 [`React.startTransition`][start-transition]。这允许您在更新被刷新到 DOM 后立即执行同步 DOM 操作。

<docs-warning>`ReactDOM.flushSync` 会降低 React 的优化效果，并可能影响您应用的性能。</docs-warning>

## 属性

### `fetcher.state`

您可以通过 `fetcher.state` 知道 fetcher 的状态。它将是以下之一：

- **idle** - 没有正在获取的内容。
- **submitting** - 表单已提交。如果方法是 `GET`，则正在调用路由 `loader`。如果是 `DELETE`、`PATCH`、`POST` 或 `PUT`，则正在调用路由 `action`。
- **loading** - 在 `action` 提交后，路由的加载器正在重新加载。

### `fetcher.data`

从您的 `action` 或 `loader` 返回的响应数据存储在这里。一旦数据被设置，它会在 fetcher 上持久化，即使在重新加载和重新提交时（例如在已经读取数据后再次调用 `fetcher.load()`）。

### `fetcher.formData`

提交到服务器的 `FormData` 实例存储在这里。这对于乐观的用户界面非常有用。

### `fetcher.formAction`

提交的 URL。

### `fetcher.formMethod`

提交的表单方法。

## 额外资源

**讨论**

- [表单与提取器][form_vs_fetcher]
- [网络并发管理][network_concurrency_management]

**视频**

- [使用 useFetcher 的并发变更][concurrent_mutations_with_use_fetcher]
- [乐观 UI][optimistic_ui]

[form_component]: ../components/form
[form_data]: https://developer.mozilla.org/en-US/docs/Web/API/FormData
[html_form_element]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement
[form_element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
[loader]: ../route/loader
[url_search_params]: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
[action]: ../route/action
[form_vs_fetcher]: ../discussion/form-vs-fetcher
[network_concurrency_management]: ../discussion/concurrency
[concurrent_mutations_with_use_fetcher]: https://www.youtube.com/watch?v=vTzNpiOk668&list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6
[optimistic_ui]: https://www.youtube.com/watch?v=EdB_nj01C80&list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6
[use_fetchers]: ./use-fetchers
[flush-sync]: https://react.dev/reference/react-dom/flushSync
[start-transition]: https://react.dev/reference/react/startTransition
[use-submit]: ./use-submit
[userevalidator]: ./use-revalidator
[shouldrevalidate]: ../route/should-revalidate#shouldrevalidate