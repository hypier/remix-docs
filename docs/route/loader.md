---
title: 加载器
---

# `loader`

<docs-success>观看 <a href="https://www.youtube.com/playlist?list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6">📼 Remix 单曲</a>: <a href="https://www.youtube.com/watch?v=NXqEP_PsPNc&list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6">将数据加载到组件中</a></docs-success>

每个路由可以定义一个 `loader` 函数，在渲染时为该路由提供数据。

```tsx
import { json } from "@remix-run/node"; // or cloudflare/deno

export const loader = async () => {
  return json({ ok: true });
};
```

此函数仅在服务器上运行。在初始服务器渲染时，它将为 HTML 文档提供数据。在浏览器中的导航时，Remix 将通过 [`fetch`][fetch] 从浏览器调用该函数。

这意味着您可以直接与数据库进行通信，使用仅限服务器的 API 密钥等。任何不用于渲染 UI 的代码将从浏览器包中移除。

以数据库 ORM [Prisma][prisma] 为例：

```tsx lines=[3,5-7]
import { useLoaderData } from "@remix-run/react";

import { prisma } from "../db";

export async function loader() {
  return json(await prisma.user.findMany());
}

export default function Users() {
  const data = useLoaderData<typeof loader>();
  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

由于 `prisma` 仅在 `loader` 中使用，因此它将被编译器从浏览器包中移除，如高亮行所示。

<docs-error>
请注意，从您的 `loader` 返回的任何内容都将暴露给客户端，即使组件没有渲染它。请像对待公共 API 端点一样小心对待您的 `loader`。
</docs-error>

## 类型安全

您可以通过 `useLoaderData<typeof loader>` 在网络上获得 `loader` 和组件的类型安全。

```tsx lines=[9]
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({ name: "Ryan", date: new Date() });
}

export default function SomeRoute() {
  const data = useLoaderData<typeof loader>();
}
```

- `data.name` 将知道它是一个字符串
- `data.date` 也将知道它是一个字符串，即使我们传递了一个日期对象给 [`json`][json]。当为客户端过渡获取数据时，值通过 [`JSON.stringify`][json-stringify] 在网络上被序列化，并且类型对此是知晓的

## `params`

路由参数由路由文件名定义。如果某个段以 `$` 开头，比如 `$invoiceId`，那么该段的 URL 值将被传递给你的 `loader`。

```tsx filename=app/routes/invoices.$invoiceId.tsx nocopy
// if the user visits /invoices/123
export async function loader({
  params,
}: LoaderFunctionArgs) {
  params.invoiceId; // "123"
}
```

参数主要用于通过 ID 查找记录：

```tsx filename=app/routes/invoices.$invoiceId.tsx
// if the user visits /invoices/123
export async function loader({
  params,
}: LoaderFunctionArgs) {
  const invoice = await fakeDb.getInvoice(params.invoiceId);
  if (!invoice) throw new Response("", { status: 404 });
  return json(invoice);
}
```

## `request`

这是一个 [Fetch Request][request] 实例。您可以阅读 MDN 文档以查看其所有属性。

在 `loader` 中最常见的用例是读取 [headers][request-headers]（如 cookies）和 URL [`URLSearchParams`][url-search-params]：

```tsx
export async function loader({
  request,
}: LoaderFunctionArgs) {
  // read a cookie
  const cookie = request.headers.get("Cookie");

  // parse the search params for `?q=`
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
}
```

## `context`

这是传递给您的服务器适配器的 `getLoadContext()` 函数的上下文。它是适配器的请求/响应 API 与您的 Remix 应用之间的桥梁。

<docs-info>这个 API 是一个逃生舱，通常不需要使用它</docs-info>

以 express 适配器为例：

```ts filename=server.ts
const {
  createRequestHandler,
} = require("@remix-run/express");

app.all(
  "*",
  createRequestHandler({
    getLoadContext(req, res) {
      // 这将成为加载器上下文
      return { expressUser: req.user };
    },
  })
);
```

然后您的 `loader` 可以访问它。

```tsx filename=app/routes/some-route.tsx
export async function loader({
  context,
}: LoaderFunctionArgs) {
  const { expressUser } = context;
  // ...
}
```

## 返回响应实例

您需要从 `loader` 返回一个 [Fetch Response][response]。

```tsx
export async function loader() {
  const users = await db.users.findMany();
  const body = JSON.stringify(users);
  return new Response(body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

使用 [`json` helper][json] 可以简化这个过程，因此您不必自己构造它们，但这两个示例实际上是一样的！

```tsx
import { json } from "@remix-run/node"; // 或 cloudflare/deno

export const loader = async () => {
  const users = await fakeDb.users.findMany();
  return json(users);
};
```

您可以看到 `json` 只是做了一点工作，使您的 `loader` 更加简洁。您还可以使用 `json` helper 向响应添加头部或状态码：

```tsx
import { json } from "@remix-run/node"; // 或 cloudflare/deno

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const project = await fakeDb.project.findOne({
    where: { id: params.id },
  });

  if (!project) {
    return json("项目未找到", { status: 404 });
  }

  return json(project);
};
```

另请参见：

- [`headers`][headers]
- [MDN Response 文档][response]

## 在加载器中抛出响应

除了返回响应之外，您还可以在 `loader` 中抛出 `Response` 对象。这使您能够突破调用栈并执行以下两项操作之一：

- 重定向到另一个 URL
- 通过 `ErrorBoundary` 显示带有上下文数据的替代 UI

以下是一个完整的示例，展示了如何创建抛出响应的实用函数，以停止加载器中的代码执行并显示替代 UI。

```ts filename=app/db.ts
import { json } from "@remix-run/node"; // or cloudflare/deno

export function getInvoice(id) {
  const invoice = db.invoice.find({ where: { id } });
  if (invoice === null) {
    throw json("未找到", { status: 404 });
  }
  return invoice;
}
```

```ts filename=app/http.ts
import { redirect } from "@remix-run/node"; // or cloudflare/deno

import { getSession } from "./session";

export async function requireUserSession(request) {
  const session = await getSession(
    request.headers.get("cookie")
  );
  if (!session) {
    // 您可以抛出我们的助手函数，如 `redirect` 和 `json`，因为它们
    // 返回 `Response` 对象。`redirect` 响应将重定向到
    // 另一个 URL，而其他响应将触发在 `ErrorBoundary` 中渲染的 UI。
    throw redirect("/login", 302);
  }
  return session.get("user");
}
```

```tsx filename=app/routes/invoice.$invoiceId.tsx
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { getInvoice } from "~/db";
import { requireUserSession } from "~/http";

export const loader = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const user = await requireUserSession(request);
  const invoice = getInvoice(params.invoiceId);

  if (!invoice.userIds.includes(user.id)) {
    throw json(
      { invoiceOwnerEmail: invoice.owner.email },
      { status: 401 }
    );
  }

  return json(invoice);
};

export default function InvoiceRoute() {
  const invoice = useLoaderData<typeof loader>();
  return <InvoiceView invoice={invoice} />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 401:
        return (
          <div>
            <p>您没有访问此发票的权限。</p>
            <p>
              联系 {error.data.invoiceOwnerEmail} 获取
              访问权限
            </p>
          </div>
        );
      case 404:
        return <div>发票未找到！</div>;
    }

    return (
      <div>
        出现问题： {error.status}{" "}
        {error.statusText}
      </div>
    );
  }

  return (
    <div>
      出现问题：{" "}
      {error?.message || "未知错误"}
    </div>
  );
}
```

[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[prisma]: https://www.prisma.io
[json]: ../utils/json
[json-stringify]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[request]: https://developer.mozilla.org/en-US/docs/Web/API/Request
[request-headers]: https://developer.mozilla.org/en-US/docs/Web/API/Response/headers
[url-search-params]: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
[response]: https://developer.mozilla.org/en-US/docs/Web/API/Response
[headers]: ../route/headers