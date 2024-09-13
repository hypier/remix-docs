---
title: useNavigation
---

# `useNavigation`

此钩子提供有关待处理页面导航的信息。

```js
import { useNavigation } from "@remix-run/react";

function SomeComponent() {
  const navigation = useNavigation();
  // ...
}
```

## 属性

### `navigation.formAction`

提交的表单的操作（如果有的话）。

```tsx
// set from either one of these
<Form action="/some/where" />;
submit(formData, { action: "/some/where" });
```

### `navigation.formMethod`

提交的表单方法（如果有的话）。

```tsx
// set from either one of these
<Form method="get" />;
submit(formData, { method: "get" });
```

### `navigation.formData`

任何从 [`<Form>`][form-component] 或 [`useSubmit`][use-submit] 开始的 `DELETE`、`PATCH`、`POST` 或 `PUT` 导航都会附带您表单的提交数据。这主要用于构建带有 `submission.formData` [`FormData`][form-data] 对象的“乐观 UI”。

例如：

```tsx
// 这个表单有 `email` 字段
<Form method="post" action="/signup">
  <input name="email" />
</Form>;

// 因此，在导航待处理时，导航将会在 `navigation.formData` 中包含字段的值。
navigation.formData.get("email");
```

在 `GET` 表单提交的情况下，`formData` 将为空，数据将在 `navigation.location.search` 中反映。

### `navigation.location`

这告诉你下一个位置将会是什么。

### `navigation.state`

- **idle** - 没有待处理的导航。
- **submitting** - 正在调用路由操作，因为表单提交使用了 POST、PUT、PATCH 或 DELETE。
- **loading** - 正在调用下一个路由的加载器以渲染下一个页面。

正常导航和 GET 表单提交会经历这些状态：

```
idle → loading → idle
```

使用 POST、PUT、PATCH 或 DELETE 的表单提交会经历这些状态：

```
idle → submitting → loading → idle
```

[form-component]: ../components/form  
[use-submit]: ./use-submit  
[form-data]: https://developer.mozilla.org/en-US/docs/Web/API/FormData