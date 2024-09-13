---
title: 全栈数据流
position: 4
---

# 全栈数据流

Remix 的主要特点之一是它能够自动保持您的用户界面与持久化服务器状态同步。这一过程分为三个步骤：

1. 路由加载器为用户界面提供数据
2. 表单将数据发布到路由操作，以更新持久化状态
3. 页面上的加载器数据会自动重新验证

<img class="tutorial rounded-xl" src="/blog-images/posts/remix-data-flow/loader-action-component.png" />

## 路由模块导出

我们来考虑一个用户账户编辑路由。该路由模块有三个导出，我们将填充并讨论它们：

```tsx filename=routes/account.tsx
export async function loader() {
  // provides data to the component
}

export default function Component() {
  // renders the UI
}

export async function action() {
  // updates persistent data
}
```

## 路由加载器

路由文件可以导出一个 [`loader`][loader] 函数，该函数为路由组件提供数据。当用户导航到匹配的路由时，数据首先被加载，然后页面被渲染。

```tsx filename=routes/account.tsx lines=[1-2,4-12]
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const user = await getUser(request);
  return json({
    displayName: user.displayName,
    email: user.email,
  });
}

export default function Component() {
  // ...
}

export async function action() {
  // ...
}
```

## 路由组件

路由文件的默认导出是渲染的组件。它使用 [`useLoaderData`][use_loader_data] 读取加载器数据：

```tsx lines=[3,15-30]
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, Form } from "@remix-run/react";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const user = await getUser(request);
  return json({
    displayName: user.displayName,
    email: user.email,
  });
}

export default function Component() {
  const user = useLoaderData<typeof loader>();
  return (
    <Form method="post" action="/account">
      <h1>Settings for {user.displayName}</h1>

      <input
        name="displayName"
        defaultValue={user.displayName}
      />
      <input name="email" defaultValue={user.email} />

      <button type="submit">Save</button>
    </Form>
  );
}

export async function action() {
  // ...
}
```

## 路由动作

最后，当表单提交时，将调用与表单的 action 属性匹配的路由动作。在这个例子中，它是相同的路由。表单字段中的值将可通过标准 [`request.formData()`][request_form_data] API 获取。请注意，输入框上的 `name` 属性与 [`formData.get(fieldName)`][form_data_get] 获取器相关联。

```tsx lines=[2,35-47]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, Form } from "@remix-run/react";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const user = await getUser(request);
  return json({
    displayName: user.displayName,
    email: user.email,
  });
}

export default function Component() {
  const user = useLoaderData<typeof loader>();
  return (
    <Form method="post" action="/account">
      <h1>Settings for {user.displayName}</h1>

      <input
        name="displayName"
        defaultValue={user.displayName}
      />
      <input name="email" defaultValue={user.email} />

      <button type="submit">Save</button>
    </Form>
  );
}

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const user = await getUser(request);

  await updateUser(user.id, {
    email: formData.get("email"),
    displayName: formData.get("displayName"),
  });

  return json({ ok: true });
}
```

## 提交和重新验证

当用户提交表单时：

1. Remix通过 `fetch` 将表单数据发送到路由操作，挂起状态可以通过 `useNavigation` 和 `useFetcher` 等钩子获得。
2. 操作完成后，加载器会重新验证以获取新的服务器状态。
3. `useLoaderData` 返回来自服务器的更新值，挂起状态回到闲置状态。

通过这种方式，用户界面与服务器状态保持同步，而无需为该同步编写任何代码。

除了HTML表单元素之外，还有多种提交表单的方式（例如响应拖放或onChange事件）。关于表单验证、错误处理、挂起状态等还有很多内容可以讨论。我们稍后会涉及到所有这些内容，但这就是Remix中数据流的要点。

## 在 JavaScript 加载之前

当你从服务器发送 HTML 时，最好在 JavaScript 加载之前就能正常工作。Remix 中典型的数据流会自动做到这一点。流程是相同的，但浏览器会做一些工作。

当用户在 JavaScript 加载之前提交表单时：

1. 浏览器将表单提交到 action（而不是 `fetch`），并激活浏览器的待处理状态（旋转的 favicon）
2. 在 action 完成后，调用 loaders
3. Remix 渲染页面并将 HTML 发送到浏览器

[loader]: ../route/loader  
[use_loader_data]: ../hooks/use-loader-data  
[request_form_data]: https://developer.mozilla.org/en-US/docs/Web/API/Request/formData  
[form_data_get]: https://developer.mozilla.org/en-US/docs/Web/API/FormData/get