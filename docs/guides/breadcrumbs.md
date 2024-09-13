---
title: 面包屑导航指南
---

# 面包屑导航指南

在 Remix 中，您可以根据路由层次结构轻松构建动态面包屑导航。本指南将通过使用 [`useMatches`][use-matches] 和 [`handle`][handle] 功能来引导您完成这个过程。

## 理解基础知识

Remix 提供了对所有路由匹配和相关数据的访问，位于 React 元素树的顶部。这使得像 [`<Meta />`][meta-component]、[`<Links />`][links-component] 和 [`<Scripts />`][scripts-component] 这样的组件能够从嵌套路由中获取值并在文档的顶部呈现它们。

您可以使用类似的策略，结合 `useMatches` 和 `handle` 函数。虽然我们专注于面包屑，但这里展示的原则适用于多种场景。

## 定义路由的面包屑导航

首先，在路由的 `handle` 中添加一个 `breadcrumb` 属性。该属性并不是 Remix 特有的 – 你可以随意命名。对于我们的示例，我们将其命名为 `breadcrumb`。

```tsx filename=app/routes/parent.tsx
export const handle = {
  breadcrumb: () => <Link to="/parent">Some Route</Link>,
};
```

同样，你可以为子路由定义面包屑导航：

```tsx filename=app/routes/parent.child.tsx
export const handle = {
  breadcrumb: () => (
    <Link to="/parent/child">Child Route</Link>
  ),
};
```

## 在根路由中聚合面包屑

现在，在您的根路由中使用 `useMatches` 将所有内容结合在一起：

```tsx filename=app/root.tsx lines=[5,9,19-28]
import {
  Links,
  Scripts,
  useLoaderData,
  useMatches,
} from "@remix-run/react";

export default function Root() {
  const matches = useMatches();

  return (
    <html lang="en">
      <head>
        <Links />
      </head>
      <body>
        <header>
          <ol>
            {matches
              .filter(
                (match) =>
                  match.handle && match.handle.breadcrumb
              )
              .map((match, index) => (
                <li key={index}>
                  {match.handle.breadcrumb(match)}
                </li>
              ))}
          </ol>
        </header>
        <Outlet />
      </body>
    </html>
  );
}
```

请注意，我们将 `match` 对象传递给面包屑，这使我们能够利用 `match.data` 来增强基于路由数据的面包屑内容。这个例子没有使用它，但您可能希望使用加载器数据中的值来生成面包屑。

使用 `useMatches` 和 `handle` 提供了一种强大的方式，让路由能够在其实际渲染点之上更高的元素树中参与渲染过程。

## 其他资源

- [`useMatches`][use-matches]
- [`handle`][handle]

[use-matches]: ../hooks/use-matches
[handle]: ../route/handle
[meta-component]: ../components/meta
[links-component]: ../components/links
[scripts-component]: ../components/scripts