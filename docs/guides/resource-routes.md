---
title: 资源路由
---

# 资源路由

资源路由不是您应用程序 UI 的一部分，但仍然是您应用程序的一部分。它们可以发送任何类型的响应。

在 Remix 中，大多数路由是 UI 路由，或者说是实际渲染组件的路由。但路由并不总是必须渲染组件。有一些情况，您希望将路由用作您网站的通用端点。以下是一些示例：

- 为移动应用提供 JSON API，重用带有 Remix UI 的服务器端代码
- 动态生成 PDF
- 动态生成博客文章或其他页面的社交图片
- 用于其他服务（如 Stripe 或 GitHub）的 Webhook
- 动态渲染用户首选主题的自定义属性的 CSS 文件

## 创建资源路由

如果一个路由不导出默认组件，它可以被用作资源路由。如果使用 `GET` 调用，则返回加载器的响应，并且不会调用任何父路由加载器（因为那些是 UI 所需的，但这不是 UI）。如果使用 `POST` 调用，则调用操作的响应。

例如，考虑一个渲染报告的 UI 路由，注意链接：

```tsx filename=app/routes/reports.$id.tsx lines=[12-14]
export async function loader({
  params,
}: LoaderFunctionArgs) {
  return json(await getReport(params.id));
}

export default function Report() {
  const report = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>{report.name}</h1>
      <Link to="pdf" reloadDocument>
        View as PDF
      </Link>
      {/* ... */}
    </div>
  );
}
```

它链接到页面的 PDF 版本。为了使其正常工作，我们可以在下面创建一个资源路由。注意它没有组件：这使它成为一个资源路由。

```tsx filename=app/routes/reports.$id.pdf.tsx
export async function loader({
  params,
}: LoaderFunctionArgs) {
  const report = await getReport(params.id);
  const pdf = await generateReportPDF(report);
  return new Response(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
```

当用户从 UI 路由点击链接时，他们将导航到 PDF。

## 链接到资源路由

<docs-error>在任何链接到资源路由时，务必使用 <code>reloadDocument</code></docs-error>

链接到资源路由时需要注意一个细微的细节。您需要使用 `<Link reloadDocument>` 或普通的 `<a href>` 进行链接。如果您使用普通的 `<Link to="pdf">` 而不带 `reloadDocument` 进行链接，那么资源路由将被视为 UI 路由。Remix 将尝试使用 `fetch` 获取数据并渲染组件。不要太担心，如果您犯了这个错误，会收到有用的错误信息。

## URL 转义

您可能希望为您的资源路由添加文件扩展名。这很棘手，因为 Remix 的路由文件命名约定之一是 `.` 会变成 `/`，这样您可以在不嵌套 UI 的情况下嵌套 URL。

要在路由路径中添加 `.`，请使用 `[]` 转义字符。我们的 PDF 路由文件名将像这样更改：

```sh
# original
# /reports/123/pdf
app/routes/reports.$id.pdf.ts

# with a file extension
# /reports/123.pdf
app/routes/reports.$id[.pdf].ts

# or like this, the resulting URL is the same
app/routes/reports.$id[.]pdf.ts
```

## 处理不同的请求方法

要处理 `GET` 请求，请导出一个加载器函数：

```tsx
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  // 处理 "GET" 请求

  return json({ success: true }, 200);
};
```

要处理 `POST`、`PUT`、`PATCH` 或 `DELETE` 请求，请导出一个操作函数：

```tsx
import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  switch (request.method) {
    case "POST": {
      /* 处理 "POST" */
    }
    case "PUT": {
      /* 处理 "PUT" */
    }
    case "PATCH": {
      /* 处理 "PATCH" */
    }
    case "DELETE": {
      /* 处理 "DELETE" */
    }
  }
};
```

## Webhooks

资源路由可用于处理 webhooks。例如，您可以创建一个 webhook，当新的提交被推送到代码库时，从 GitHub 接收通知：

```tsx
import crypto from "node:crypto";

import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  const payload = await request.json();

  /* Validate the webhook */
  const signature = request.headers.get(
    "X-Hub-Signature-256"
  );
  const generatedSignature = `sha256=${crypto
    .createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest("hex")}`;
  if (signature !== generatedSignature) {
    return json({ message: "Signature mismatch" }, 401);
  }

  /* process the webhook (e.g. enqueue a background job) */

  return json({ success: true }, 200);
};
```