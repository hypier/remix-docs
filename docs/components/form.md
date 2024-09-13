---
title: 表单
---

# `<Form>`

一个渐进增强的 HTML [`<form>`][form_element]，通过 `fetch` 提交数据到操作，激活 `useNavigation` 中的待处理状态，从而实现超越基本 HTML 表单的高级用户界面。在表单的操作完成后，页面上的所有数据会自动从服务器重新验证，以保持 UI 与数据同步。

由于它使用 HTML 表单 API，服务器渲染的页面在 JavaScript 加载之前在基本层面上是互动的。浏览器管理提交和待处理状态（如旋转的 favicon），而不是 Remix 来管理提交。在 JavaScript 加载后，Remix 接管，启用 Web 应用程序用户体验。

表单最适合用于那些也应该更改 URL 或以其他方式向浏览器历史记录堆栈添加条目的提交。对于不应操纵浏览器历史记录堆栈的表单，请使用 [`<fetcher.Form>`][fetcher_form]。

```tsx
import { Form } from "@remix-run/react";

function NewEvent() {
  return (
    <Form action="/events" method="post">
      <input name="title" type="text" />
      <input name="description" type="text" />
    </Form>
  );
}
```

## 道具

### `action`

提交表单数据的 URL。

如果为 `undefined`，则默认为上下文中的最近路由。如果父路由渲染了一个 `<Form>` 但 URL 匹配更深层的子路由，表单将提交到父路由。同样，子路由中的表单将提交到子路由。这与原生的 [`<form>`][form_element] 不同，后者始终指向完整的 URL。

<docs-info>请参阅 `useResolvedPath` 文档中关于 `future.v3_relativeSplatPath` 未来标志在 Splat 路由中相对 `<Form action>` 行为的说明，见 [Splat Paths][relativesplatpath] 部分</docs-info>

### `method`

这决定了要使用的 [HTTP verb][http_verb]：`DELETE`、`GET`、`PATCH`、`POST` 和 `PUT`。默认值是 `GET`。

```tsx
<Form method="post" />
```

原生 [`<form>`][form_element] 仅支持 `GET` 和 `POST`，因此如果您希望支持 [渐进增强][progressive_enhancement]，应避免使用其他动词。

### `encType`

用于表单提交的编码类型。

```tsx
<Form encType="multipart/form-data" />
```

默认值为 `application/x-www-form-urlencoded`，文件上传时使用 `multipart/form-data`。

### `navigate`

您可以通过指定 `<Form navigate={false}>` 来告诉表单跳过导航并在内部使用 [fetcher][use_fetcher]。这实际上是 `useFetcher()` + `<fetcher.Form>` 的简写，您不关心结果数据，只想启动提交并通过 [`useFetchers()`][use_fetchers] 访问待处理状态。

```tsx
<Form method="post" navigate={false} />
```

### `fetcherKey`

在使用非导航的 `Form` 时，您还可以选择指定自己的 fetcher `key`。

```tsx
<Form method="post" navigate={false} fetcherKey="my-key" />
```

### `preventScrollReset`

如果您正在使用 [`<ScrollRestoration>`][scroll_restoration_component]，这可以让您在表单提交时防止滚动位置重置到窗口顶部。

```tsx
<Form preventScrollReset />
```

### `replace`

替换历史堆栈中的当前条目，而不是推送新的条目。

```tsx
<Form replace />
```

### `reloadDocument`

如果为 true，它将通过浏览器提交表单，而不是客户端路由。这与原生的 `<form>` 相同。

```tsx
<Form reloadDocument />
```

这比 [`<form>`][form_element] 更推荐。当省略 `action` 属性时，`<Form>` 和 `<form>` 有时会根据当前 URL 调用不同的操作，因为 `<form>` 使用当前 URL 作为默认值，而 `<Form>` 使用渲染表单的路由的 URL。

### `unstable_viewTransition`

`unstable_viewTransition` 属性通过将最终状态更新包装在 [`document.startViewTransition()`][document-start-view-transition] 中，为此导航启用 [View Transition][view-transitions]。如果您需要为此视图过渡应用特定样式，还需要利用 [`unstable_useViewTransitionState()`][use-view-transition-state]。

<docs-warning>
请注意，此 API 被标记为不稳定，可能会在没有重大版本发布的情况下发生破坏性更改。
</docs-warning>

## 备注

### `?index`

因为索引路由和它们的父路由共享相同的 URL，所以使用 `?index` 参数来区分它们。

```tsx
<Form action="/accounts?index" method="post" />
```

| action url        | route action                     |
| ----------------- | -------------------------------- |
| `/accounts?index` | `app/routes/accounts._index.tsx` |
| `/accounts`       | `app/routes/accounts.tsx`        |

另见：

- [`?index` 查询参数][index_query_param]

## 其他资源

**视频：**

- [使用 Form + action 的数据变更][data_mutations_with_form_action]
- [多个表单和单个按钮变更][multiple_forms_and_single_button_mutations]
- [表单提交后清除输入][clearing_inputs_after_form_submissions]

**相关讨论：**

- [全栈数据流][fullstack_data_flow]
- [待处理 UI][pending_ui]
- [表单与 Fetcher][form_vs_fetcher]

**相关 API：**

- [`useActionData`][use_action_data]
- [`useNavigation`][use_navigation]
- [`useSubmit`][use_submit]

[use_navigation]: ../hooks/use-navigation
[scroll_restoration_component]: ./scroll-restoration
[index_query_param]: ../guides/index-query-param
[http_verb]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
[form_element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
[use_action_data]: ../hooks/use-action-data
[use_submit]: ../hooks/use-submit
[data_mutations_with_form_action]: https://www.youtube.com/watch?v=Iv25HAHaFDs&list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6
[multiple_forms_and_single_button_mutations]: https://www.youtube.com/watch?v=w2i-9cYxSdc&list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6
[clearing_inputs_after_form_submissions]: https://www.youtube.com/watch?v=bMLej7bg5Zo&list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6
[fullstack_data_flow]: ../discussion/data-flow
[pending_ui]: ../discussion/pending-ui
[form_vs_fetcher]: ../discussion/form-vs-fetcher
[use_fetcher]: ../hooks/use-fetcher
[use_fetchers]: ../hooks/use-fetchers
[fetcher_form]: ../hooks/use-fetcher#fetcherform
[progressive_enhancement]: ../discussion/progressive-enhancement
[view-transitions]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
[document-start-view-transition]: https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition
[use-view-transition-state]: ../hooks/use-view-transition-state
[relativesplatpath]: ../hooks/use-resolved-path#splat-paths