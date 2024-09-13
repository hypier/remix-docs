---
title: useResolvedPath
---

# `useResolvedPath`

解析给定 `to` 值的 `pathname`，并将其与当前位置信息的 pathname 进行比较，返回一个 `Path` 对象。

```tsx
import { useResolvedPath } from "@remix-run/react";

function SomeComponent() {
  const path = useResolvedPath("../some/where");
  path.pathname;
  path.search;
  path.hash;
  // ...
}
```

这在从相对值构建链接时非常有用，并在内部用于 [`<NavLink>`][nav-link-component]。

## Splat Paths

React Router 的 `useResolvedPath` 钩子的原始逻辑在处理通配符路径时表现不同，这在事后看来是错误的/存在缺陷的行为。有关更详细的解释，请参阅 [React Router Docs][rr-use-resolved-path-splat]，这被确定为一个“破坏性错误修复”，并在 React Router 中通过未来标志进行了修复，并通过 [`v3_relativeSplatPath`][remix-config-future] 未来标志在 Remix 中暴露。这将在 Remix v3 中成为默认行为，因此建议您在方便时更新您的应用程序，以更好地为最终的 v3 升级做好准备。

需要注意的是，这为 Remix 中所有相对路由奠定了基础，因此这也适用于以下相对路径代码流：

- `<Link to>`
- `useNavigate()`
- `useHref()`
- `<Form action>`
- `useSubmit()`
- 从加载器和操作返回的相对路径 `redirect` 响应

### 没有标志的行为

当此标志未启用时，默认行为是在解析 splat 路径中的相对路径时，忽略路径的 splat 部分。因此，在 `routes/dashboard.$.tsx` 文件中，`useResolvedPath(".")` 将解析为 `/dashboard`，即使当前 URL 为 `/dashboard/teams`。

### 带标志的行为

当您启用标志时，这个“错误”被修复，以便路径解析在所有路由类型中保持一致，并且 `useResolvedPath(".")` 始终解析为上下文路由的当前路径名。这包括任何动态参数或通配符参数值，因此在 `routes/dashboard.$.tsx` 文件中，当当前 URL 为 `/dashboard/teams` 时，`useResolvedPath(".")` 将解析为 `/dashboard/teams`。

## 其他资源

- [`resolvePath`][rr-resolve-path]

[nav-link-component]: ../components/nav-link
[rr-resolve-path]: https://reactrouter.com/utils/resolve-path
[rr-use-resolved-path-splat]: https://reactrouter.com/hooks/use-resolved-path#splat-paths
[remix-config-future]: https://remix.run/docs/en/main/file-conventions/remix-config#future