---
title: 懒惰路由发现
---

# 懒惰路由发现（又称“战争迷雾”）

<docs-warning>这是一个不稳定的API，未来会继续变化，请勿在生产环境中使用</docs-warning>

Remix引入了对懒惰路由发现（又称“战争迷雾”）的支持（[RFC][rfc]），该功能在[`v2.10.0`][2.10.0]中通过`future.unstable_lazyRouteDiscovery` [Future Flag][future-flags]提供。这允许您选择使用此行为，该行为将在Remix的下一个主要版本中成为默认设置——即React Router v7（[1][rr-v7]，[2][rr-v7-2]）。有关此功能的更多信息，请查看[博客文章][blog-post]。

## 当前行为

目前，Remix 在初始加载时将完整的路由清单加载到一个 JS 文件中（即 `/assets/manifest-[hash].js`）。该清单不包含路由模块的实现，而是它们的 URL 路径和元信息（路由 JS/CSS 导入，是否在服务器上有 `loader`/`action` 等）。提前拥有这个完整的清单使得 Remix 能够在 Link 点击时进行同步的客户端路由匹配，并立即启动路由模块和数据的加载。对于小型到中型应用程序，提前加载完整的清单通常不会造成问题，因为它具有很高的缓存性，并且经过 gzip 压缩后效果很好。然而，在规模较大时，我们发现该清单可能会变得足够大，从而影响某些性能指标。

## 新行为

当您启用“战争迷雾”时，Remix 将不再在初始加载时发送完整的路由清单。相反，您的 SSR 渲染将仅包括初始清单中的 SSR 路由，额外的路由将在用户浏览应用程序时加载。随着时间的推移，清单将增长，以包括用户导航到的应用程序部分。

请注意，这**不是**一种“隐藏”您应用程序 URL 的方法。它并不会在初始时将所有 URL 发送到清单中，但在用户浏览时用于获取新路由的清单端点仍然可以暴露您定义的所有应用程序路由——尽管这只是稍微被掩盖了一些。

### 急切路由发现

与这种懒惰路由发现方式一样，总是存在权衡。它改善了初始应用加载时间——但 Remix 不再能够在链接点击时执行同步路由匹配，这可能会导致瀑布效应。

在当前架构中（不使用 `<Link prefetch>`），点击链接的过程大致如下：

```
click /a
        |-- load route module -->
        |-- load route data -->
                                 | render /a
```

在战争迷雾架构中，点击链接可能会引入瀑布效应：

```
click /a
        |-- discover route -->
                              |-- load route module -->
                              |-- load route data -->
                                                       | render /a
```

众所周知，Remix 讨厌瀑布效应，因此战争迷雾功能实现了一种优化，以避免在大多数情况下出现它。默认情况下，页面上渲染的所有 [`<Link>`][link] 和 [`<NavLink>`][navlink] 组件将被批量处理并通过请求主动“发现”。该请求将在服务器上匹配所有当前链接路径，并返回所有所需的路由清单条目。在大多数情况下，该请求应该在用户点击任何链接之前完成（因为用户通常不会在前几百毫秒内点击链接），并且清单将在点击任何链接之前进行修补。然后，当点击链接时，Remix 能够像战争迷雾行为不存在一样进行同步客户端匹配。

如果您希望在每个链接的基础上选择退出这种急切路由发现，可以通过 [`discover="none"`][link-discover] 属性来实现（默认值为 `discover="render"`）。

### 显著变化

- 当此功能启用时，`window.__remixManifest.routes` 中的路由清单将在初始 SSR 时仅包含最少所需的路由，用户在浏览时将动态添加路由
- Remix 处理程序现在有一个新的内部 `/__manifest` 端点，通过该端点将获取清单补丁
  - 您需要确保您的部署架构将任何 `/__manifest` 请求路由到 Remix 处理程序
  - 如果您有任何 CDN/边缘缓存层，`/__manifest` 路由接受 2 个查询字符串参数，您可能需要将其包含在缓存键中：`version` 和 `p`
  - ⚠️ 这被视为内部实现细节，不打算由应用代码请求

[rfc]: https://github.com/remix-run/react-router/discussions/11113
[future-flags]: ../guides/api-development-strategy
[2.10.0]: https://github.com/remix-run/remix/blob/main/CHANGELOG.md#v2100
[link]: ../components/link
[navlink]: ../components/nav-link
[link-discover]: ../components/link#discover
[rr-v7]: https://remix.run/blog/merging-remix-and-react-router
[rr-v7-2]: https://remix.run/blog/incremental-path-to-react-19
[blog-post]: https://remix.run/blog/fog-of-war