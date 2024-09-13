---
title: json
toc: false
---

# `json`

这是创建 `application/json` 响应的快捷方式。它假定您使用的是 `utf-8` 编码。

```tsx lines=[1,5]
import { json } from "@remix-run/node"; // or cloudflare/deno

export const loader = async () => {
  // So you can write this:
  return json({ any: "thing" });

  // Instead of this:
  return new Response(JSON.stringify({ any: "thing" }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
```

您还可以传递状态码和头部信息：

```tsx lines=[4-9]
export const loader = async () => {
  return json(
    { not: "coffee" },
    {
      status: 418,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
};
```