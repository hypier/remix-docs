---
title: useLoaderData
---

# `useLoaderData`

返回来自最近的路由 [`loader`][loader] 的序列化数据。

```tsx lines=[2,9]
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json(await fakeDb.invoices.findAll());
}

export default function Invoices() {
  const invoices = useLoaderData<typeof loader>();
  // ...
}
```

## 额外资源

**讨论**

- [全栈数据流][fullstack_data_flow]
- [状态管理][state_management]

**API**

- [`loader`][loader]
- [`useFetcher`][use_fetcher]

[loader]: ../route/loader
[fullstack_data_flow]: ../discussion/data-flow
[state_management]: ../discussion/state-management
[use_fetcher]: ./use-fetcher