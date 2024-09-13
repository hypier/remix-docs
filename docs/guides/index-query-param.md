---
title: 索引查询参数
toc: false
---

# 索引查询参数

在提交表单时，您可能会发现应用程序的 URL 中出现一个奇怪的 `?index`。

由于嵌套路由，您的路由层次结构中的多个路由可以匹配该 URL。与导航不同，在导航中，所有匹配的路由 [`loader`][loader] 都会被调用以构建 UI，而在提交 [`form`][form_element] 时 _仅调用一个 action_。

由于索引路由与其父路由共享相同的 URL，`?index` 参数可以让您区分两者。

例如，考虑以下表单：

```tsx
<Form method="post" action="/projects" />;
<Form method="post" action="/projects?index" />;
```

`?index` 参数将提交到索引路由，而没有索引参数的 [`action`][form_component_action] 将提交到父路由。

当在没有 [`action`][action] 的索引路由中渲染 [`<Form>`][form_component] 时，`?index` 参数将自动附加，以便表单提交到索引路由。以下表单在提交时将提交到 `/projects?index`，因为它是在项目索引路由的上下文中渲染的：

```tsx filename=app/routes/projects._index.tsx
function ProjectsIndex() {
  return <Form method="post" />;
}
```

如果您将代码移动到 `ProjectsLayout` 路由，它将提交到 `/projects`。

这适用于 `<Form>` 及其所有相关组件：

```tsx
function Component() {
  const submit = useSubmit();
  submit({}, { action: "/projects" });
  submit({}, { action: "/projects?index" });
}
```

```tsx
function Component() {
  const fetcher = useFetcher();
  fetcher.submit({}, { action: "/projects" });
  fetcher.submit({}, { action: "/projects?index" });
  <fetcher.Form action="/projects" />;
  <fetcher.Form action="/projects?index" />;
  <fetcher.Form />; // 默认提交到上下文中的路由
}
```

[loader]: ../route/loader  
[form_element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form  
[form_component_action]: ../components/form#action  
[form_component]: ../components/form  
[action]: ../route/action