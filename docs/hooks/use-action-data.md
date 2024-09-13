---
title: useActionData
toc: false
---

# `useActionData`

返回最近路由 [action][action] 的序列化数据，如果没有则返回 `undefined`。此钩子仅返回上下文中路由的操作数据 - 它无法访问其他父路由或子路由的数据。

```tsx lines=[10,14]
import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { Form, useActionData } from "@remix-run/react";

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();
  const name = body.get("visitorsName");
  return json({ message: `Hello, ${name}` });
}

export default function Invoices() {
  const data = useActionData<typeof action>();
  return (
    <Form method="post">
      <input type="text" name="visitorsName" />
      {data ? data.message : "Waiting..."}
    </Form>
  );
}
```

## 额外资源

**指南**

- [表单验证][form_validation]

**相关 API**

- [`action`][action]
- [`useNavigation`][use_navigation]

**讨论**

- [全栈数据流][fullstack_data_flow]

[form_validation]: ../guides/form-validation
[action]: ../route/action
[use_navigation]: ../hooks/use-navigation
[fullstack_data_flow]: ../discussion/data-flow