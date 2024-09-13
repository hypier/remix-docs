---
title: redirectDocument
toc: false
---

# `redirectDocument`

这是一个小包装器，围绕 [`redirect`][redirect]，它将触发文档级重定向到新位置，而不是客户端导航。

当您有一个 Remix 应用与同一域上的非 Remix 应用并存时，这在从 Remix 应用重定向到非 Remix 应用时最为有用：

```tsx lines=[1,7]
import { redirectDocument } from "@remix-run/node"; // 或 cloudflare/deno

export const action = async () => {
  const userSession = await getUserSessionOrWhatever();

  if (!userSession) {
    // 假设 `/login` 是一个单独的非 Remix 应用
    return redirectDocument("/login");
  }

  return json({ ok: true });
};
```

就像 [`redirect`][redirect] 一样，它接受状态码或 `ResponseInit` 作为第二个参数：

```ts
redirectDocument(path, 301);
redirectDocument(path, 303);
```

```ts
redirectDocument(path, {
  headers: {
    "Set-Cookie": await commitSession(session),
  },
});
```

[redirect]: ./redirect