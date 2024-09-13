---
title: useParams
---

# `useParams`

返回一个包含当前 URL 中由路由匹配的动态参数的键/值对对象。子路由会继承其父路由的所有参数。

```tsx
import { useParams } from "@remix-run/react";

function SomeComponent() {
  const params = useParams();
  // ...
}
```

假设路由 `routes/posts/$postId.tsx` 被 `/posts/123` 匹配，那么 `params.postId` 将是 `"123"`。对于 [splat routes][splat-routes] 的参数可以通过 `params["*"]` 获取。

[splat-routes]: ../file-conventions/routes#splat-routes