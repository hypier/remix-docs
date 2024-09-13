---
title: 重定向
toc: false
---

# `redirect`

这是发送 30x 响应的快捷方式。

```tsx lines=[1,7]
import { redirect } from "@remix-run/node"; // or cloudflare/deno

export const action = async () => {
  const userSession = await getUserSessionOrWhatever();

  if (!userSession) {
    return redirect("/login");
  }

  return json({ ok: true });
};
```

默认情况下，它发送 302，但您可以将其更改为您想要的任何重定向状态码：

```ts
redirect(path, 301);
redirect(path, 303);
```

您还可以发送 `ResponseInit` 来设置头部，例如提交会话。

```ts
redirect(path, {
  headers: {
    "Set-Cookie": await commitSession(session),
  },
});

redirect(path, {
  status: 302,
  headers: {
    "Set-Cookie": await commitSession(session),
  },
});
```

当然，如果您更愿意自己构建，也可以在没有此助手的情况下进行重定向：

```ts
// this is a shortcut...
return redirect("/else/where", 303);

// ...for this
return new Response(null, {
  status: 303,
  headers: {
    Location: "/else/where",
  },
});
```

您还可以抛出重定向以突破调用栈并立即重定向：

```ts
if (!session) {
  throw redirect("/login", 302);
}
```