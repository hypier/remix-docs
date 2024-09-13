---
title: defer
toc: false
---

# `defer`

要开始使用流数据，请查看 [Streaming Guide][streaming_guide]。

这是创建流/延迟响应的快捷方式。它假设您使用的是 `utf-8` 编码。从开发者的角度来看，它的行为与 [`json()`][json] 完全相同，但能够将 Promise 传输到您的 UI 组件。

```tsx lines=[1,7-10]
import { defer } from "@remix-run/node"; // or cloudflare/deno

export const loader = async () => {
  const aStillRunningPromise = loadSlowDataAsync();

  // So you can write this without awaiting the promise:
  return defer({
    critical: "data",
    slowPromise: aStillRunningPromise,
  });
};
```

您还可以传递状态码和头信息：

```tsx lines=[9-14]
export const loader = async () => {
  const aStillRunningPromise = loadSlowDataAsync();

  return defer(
    {
      critical: "data",
      slowPromise: aStillRunningPromise,
    },
    {
      status: 418,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
};
```

[streaming_guide]: ../guides/streaming  
[json]: ./json