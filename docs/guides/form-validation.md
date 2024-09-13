---
title: 表单验证
---

# 表单验证

本指南将引导您在 Remix 中实现一个简单注册表单的表单验证。在这里，我们重点关注捕捉基本要素，以帮助您理解 Remix 中表单验证的基本元素，包括 [`action`][action]、操作数据和渲染错误。

## 第一步：设置注册表单

我们将开始使用 Remix 的 [`Form`][form_component] 组件创建一个基本的注册表单。

```tsx filename=app/routes/signup.tsx
import { Form } from "@remix-run/react";

export default function Signup() {
  return (
    <Form method="post">
      <p>
        <input type="email" name="email" />
      </p>

      <p>
        <input type="password" name="password" />
      </p>

      <button type="submit">Sign Up</button>
    </Form>
  );
}
```

## 第2步：定义操作

在这一步中，我们将在与 `Signup` 组件相同的文件中定义一个服务器 `action`。请注意，这里旨在提供所涉及机制的广泛概述，而不是深入探讨表单验证规则或错误对象结构。我们将对电子邮件和密码进行基本检查，以演示核心概念。

```tsx filename=app/routes/signup.tsx
import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { Form } from "@remix-run/react";

export default function Signup() {
  // omitted for brevity
}

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const errors = {};

  if (!email.includes("@")) {
    errors.email = "Invalid email address";
  }

  if (password.length < 12) {
    errors.password =
      "Password should be at least 12 characters";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  // Redirect to dashboard if validation is successful
  return redirect("/dashboard");
}
```

如果发现任何验证错误，它们将从 `action` 返回给客户端。这是我们向 UI 发出信号的方式，表明需要进行更正，否则用户将被重定向到仪表板。

## 第 3 步：显示验证错误

最后，我们将修改 `Signup` 组件以显示验证错误（如果有的话）。我们将使用 [`useActionData`][use_action_data] 来访问和显示这些错误。

```tsx filename=app/routes/signup.tsx lines=[3,6,12-14,19-21]
import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { Form, useActionData } from "@remix-run/react";

export default function Signup() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <p>
        <input type="email" name="email" />
        {actionData?.errors?.email ? (
          <em>{actionData?.errors.email}</em>
        ) : null}
      </p>

      <p>
        <input type="password" name="password" />
        {actionData?.errors?.password ? (
          <em>{actionData?.errors.password}</em>
        ) : null}
      </p>

      <button type="submit">Sign Up</button>
    </Form>
  );
}

export async function action({
  request,
}: ActionFunctionArgs) {
  // omitted for brevity
}
```

## 结论

就这样！您已经成功在 Remix 中设置了基本的表单验证流程。这种方法的优点在于，错误会根据 `action` 数据自动显示，并且每次用户重新提交表单时都会更新。这减少了您需要编写的样板代码量，使您的开发过程更加高效。

[action]: ../route/action  
[form_component]: ../components/form  
[use_action_data]: ../hooks/use-action-data