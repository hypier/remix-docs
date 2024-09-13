---
title: 表单重新提交
---

# 表单重新提交

当您在 Remix 中使用 `<Form method="post">` 而不是使用原生 HTML 的 `<form method="post">` 时，Remix 不会遵循浏览器在点击后退、前进或刷新等导航事件中重新提交表单的默认行为。

## 浏览器的默认行为

在标准浏览器环境中，表单提交是导航事件。这意味着当用户点击后退按钮时，浏览器通常会重新提交表单。例如：

1. 用户访问 `/buy`
2. 提交表单到 `/checkout`
3. 导航到 `/order/123`

浏览器历史记录栈看起来像这样：

```
GET /buy > POST /checkout > *GET /order/123
```

如果用户点击后退按钮，历史记录变为：

```
GET /buy - *POST /checkout < GET /order/123
```

在这种情况下，浏览器会重新提交表单数据，这可能导致诸如重复扣费等问题。

## 从 `action` 重定向

避免此问题的常见做法是在 POST 请求后发出重定向。这将从浏览器的历史记录中移除 POST 操作。历史堆栈将如下所示：

```
GET /buy > POST /checkout, Redirect > GET /order/123
```

使用这种方法，点击后退按钮不会重新提交表单：

```
GET /buy - *GET /order/123
```

## 需要考虑的特定场景

虽然在 Remix 中意外的重新提交通常不会发生，但仍然存在一些特定场景可能会出现这种情况。

- 您使用了 `<form>` 而不是 `<Form>`
- 您使用了 `<Form reloadDocument>`
- 您没有渲染 `<Scripts/>`
- 用户禁用了 JavaScript
- 在提交表单时 JavaScript 尚未加载

建议从操作中实现重定向，以避免意外的重新提交。

## 附加资源

**指南**

- [表单验证][form_validation]

**API**

- [`<Form>`][form]
- [`useActionData`][use_action_data]
- [`redirect`][redirect]

[form_validation]: ../guides/form-validation
[form]: ../components/form
[use_action_data]: ../hooks/use-action-data
[redirect]: ../utils/redirect