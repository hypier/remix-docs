---
title: 替换
toc: false
---

# `replace`

这是一个围绕 [`redirect`][redirect] 的小封装，它将使用 `history.replaceState` 而不是 `history.pushState` 触发客户端重定向到新位置。

如果 JavaScript 尚未加载，这将表现为标准的文档级重定向，并会在历史记录堆栈中添加一个新条目。

与 [`redirect`][redirect] 一样，它接受状态码或 `ResponseInit` 作为第二个参数：

```ts
replace(path, 301);
replace(path, 303);
```

```ts
replace(path, {
  headers: {
    "Set-Cookie": await commitSession(session),
  },
});
```

[redirect]: ./redirect