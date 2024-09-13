---
title: 不稳定数据
toc: false
---

# `unstable_data`

这是一个与 [Single Fetch][single-fetch] 一起使用的工具，用于返回原始数据以及状态代码或自定义响应头。这样可以避免将数据序列化为 `Response` 实例以提供自定义状态/头信息。这通常是对使用 [`json`][json] 或 [`defer`][defer] 的 `loader`/`action` 函数的替代。

```tsx
import { unstable_data as data } from "@remix-run/node"; // 或 cloudflare/deno

export const loader = async () => {
  return data(
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

如果您不需要返回自定义状态/头信息，则_不应_使用此函数 - 在这种情况下，只需直接返回数据：

```tsx
export const loader = async () => {
  // ❌ 错误
  return data({ not: "coffee" });

  // ✅ 正确
  return { not: "coffee" };
};
```

[single-fetch]: ../guides/single-fetch  
[json]: ./json  
[defer]: ./defer