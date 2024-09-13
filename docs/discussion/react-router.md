---
title: React Router
position: 6
---

# React Router

虽然 Remix 作为一个多页面应用程序工作，但当 JavaScript 加载时，它使用客户端路由提供完整的单页面应用程序用户体验，带来所有的速度和网络效率。

Remix 构建在 [React Router][react_router] 之上，并由同一团队维护。这意味着您可以在 Remix 应用中使用 React Router 的所有功能。

这也意味着 Remix 的 90% 实际上只是 React Router：一个非常古老、非常稳定的库，可能是 React 生态系统中最大的依赖项。Remix 仅在其后添加了一个服务器。

## 导入组件和钩子

Remix 重新导出了所有来自 React Router DOM 的组件和钩子，因此您无需自己安装 React Router。

🚫 不要这样做：

```tsx bad
import { useLocation } from "react-router-dom";
```

✅ 这样做：

```tsx good
import { useLocation } from "@remix-run/react";
```

## 扩展行为

一些组件和钩子已扩展以支持 Remix 的服务器渲染和数据获取功能。例如，`Link` 可以在 Remix 中预取数据和资源，而 React Router 版本则无法做到。

🚫 不要这样做：

```tsx bad
import { Link } from "react-router-dom";

// 这不会有什么效果
<Link prefetch="intent" />;
```

✅ 这样做：

```tsx good
import { Link } from "@remix-run/react";

// 这将预取数据和资源
<Link prefetch="intent" />;
```

[react_router]: https://reactrouter.com