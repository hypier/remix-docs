---
title: 前端的后端
toc: false
---

# 后端为前端

虽然 Remix 可以作为你的全栈应用程序，但它也非常适合“后端为前端”（BFF）架构。

BFF 策略使用一个 Web 服务器，其任务是为前端 Web 应用提供服务并将其连接到所需的服务：你的数据库、邮件发送服务、作业队列、现有的后端 API（REST、GraphQL）等。你的 UI 不直接从浏览器连接到这些服务，而是连接到 BFF，BFF 再连接到你的服务。

成熟的应用程序已经在 Ruby、Elixir、PHP 等语言中拥有大量的后端应用代码，没有理由为了获得 Remix 的好处而将所有代码迁移到服务器端 JavaScript 运行时。相反，你可以将 Remix 应用作为前端的后端。

因为 Remix 为 Web Fetch API 提供了 polyfill，你可以直接在加载器和操作中使用 `fetch` 访问你的后端。

```tsx lines=[11,17,21]
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import escapeHtml from "escape-html";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const apiUrl = "http://api.example.com/some-data.json";
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  const data = await res.json();

  const prunedData = data.map((record) => {
    return {
      id: record.id,
      title: record.title,
      formattedBody: escapeHtml(record.content),
    };
  });
  return json(prunedData);
}
```

这种方法相较于直接从浏览器获取数据有几个好处。上面突出显示的行展示了你可以：

1. 简化第三方集成，并将令牌和密钥保留在客户端包之外。
2. 精简数据，从而减少网络传输的字节数，显著加快应用速度。
3. 将大量代码从浏览器包移动到服务器，例如 `escapeHtml`，这会加快应用速度。此外，将代码移动到服务器通常使代码更易于维护，因为服务器端代码不必担心异步操作的 UI 状态。

再次强调，Remix 可以作为你的唯一服务器，通过服务器端 JavaScript API 直接与数据库和其他服务进行交互，但它也可以完美地作为前端的后端。继续保留你现有的 API 服务器用于应用逻辑，让 Remix 将 UI 连接到它。