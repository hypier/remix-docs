---
title: 行动
---

# `action`

<docs-success>观看<a href="https://www.youtube.com/playlist?list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6">📼 Remix Singles</a>：<a href="https://www.youtube.com/watch?v=Iv25HAHaFDs&list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6">数据变更与表单 + action</a>和<a href="https://www.youtube.com/watch?v=w2i-9cYxSdc&list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6">多个表单和单按钮变更</a></docs-success>

`action` 路由是一个仅在服务器上运行的函数，用于处理数据变更和其他操作。如果对你的路由发出非 `GET` 请求（`DELETE`、`PATCH`、`POST` 或 `PUT`），则在调用 [`loader`][loader] 之前会调用 action。

`action` 的 API 与 `loader` 相同，唯一的区别在于它们的调用时机。这使你能够将数据集的所有内容集中在一个路由模块中：读取的数据、渲染数据的组件和写入数据的操作：

```tsx
import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { Form } from "@remix-run/react";

import { TodoList } from "~/components/TodoList";
import { fakeCreateTodo, fakeGetTodos } from "~/utils/db";

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();
  const todo = await fakeCreateTodo({
    title: body.get("title"),
  });
  return redirect(`/todos/${todo.id}`);
}

export async function loader() {
  return json(await fakeGetTodos());
}

export default function Todos() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <TodoList todos={data} />
      <Form method="post">
        <input type="text" name="title" />
        <button type="submit">创建 Todo</button>
      </Form>
    </div>
  );
}
```

当对一个 URL 发出 `POST` 请求时，你的路由层次结构中的多个路由将匹配该 URL。与对 loaders 发出的 `GET` 请求不同，在这种情况下，_仅调用一个 action_。

<docs-info>被调用的路由将是最深层的匹配路由，除非最深层的匹配路由是“索引路由”。在这种情况下，它将向索引的父路由发送请求（因为它们共享相同的 URL，父路由优先）。</docs-info>

如果你想向索引路由发送请求，请在 action 中使用 `?index`：`<Form action="/accounts?index" method="post" />`

| action url        | route action                     |
| ----------------- | -------------------------------- |
| `/accounts?index` | `app/routes/accounts._index.tsx` |
| `/accounts`       | `app/routes/accounts.tsx`        |

还要注意，没有 action 属性的表单 (`<Form method="post">`) 将自动向其渲染的同一路由发送请求，因此使用 `?index` 参数来区分父路由和索引路由仅在你从索引路由以外的地方向索引路由发送请求时才有用。如果你从索引路由向其自身发送请求，或者从父路由向其自身发送请求，则根本不需要定义 `<Form action>`，只需省略它：`<Form method="post">`。

另见：

- [`<Form>`][form-component]
- [`<Form action>`][form-component-action]
- [`?index` 查询参数][index-query-param]

[loader]: ./loader
[form-component]: ../components/form
[form-component-action]: ../components/form#action
[index-query-param]: ../guides/index-query-param