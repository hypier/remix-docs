---
title: useMatches
toc: false
---

# `useMatches`

返回页面上当前的路由匹配。这对于使用当前路由创建布局抽象非常有用。

```tsx
function SomeComponent() {
  const matches = useMatches();

  // ...
}
```

`matches` 的形状如下：

```ts
[
  { id, pathname, data, params, handle }, // 根路由
  { id, pathname, data, params, handle }, // 布局路由
  { id, pathname, data, params, handle }, // 子路由
  // 等等。
];
```

## 其他资源

- [面包屑导航指南][breadcrumbs-guide]

[breadcrumbs-guide]: ../guides/breadcrumbs