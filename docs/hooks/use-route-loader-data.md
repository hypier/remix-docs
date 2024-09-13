---
title: useRouteLoaderData
toc: false
---

# `useRouteLoaderData`

根据 ID 返回给定路由的加载器数据。

```tsx
import { useRouteLoaderData } from "@remix-run/react";

function SomeComponent() {
  const { user } = useRouteLoaderData("root");
}
```

Remix 会自动创建路由 ID。它们只是相对于应用程序文件夹的路由文件路径，不包括扩展名。

| 路由文件名                | 路由 ID             |
| -------------------------- | -------------------- |
| `app/root.tsx`             | `"root"`             |
| `app/routes/teams.tsx`     | `"routes/teams"`     |
| `app/routes/teams.$id.tsx` | `"routes/teams.$id"` |