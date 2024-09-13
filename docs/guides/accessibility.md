---
title: 可访问性
---

# 可访问性

Remix 应用中的可访问性与网络上的可访问性非常相似。使用适当的语义标记并遵循 [Web Content Accessibility Guidelines (WCAG)][wcag] 将使您大部分时间都能达到目标。

在可能的情况下，Remix 将某些可访问性实践设为默认，并提供 API 以帮助实现无法默认的部分。我们正在积极探索和开发新的 API，以使这在未来变得更加容易。

## 链接

[`<Link>` 组件][link] 渲染一个标准的锚标签，这意味着您可以免费获得浏览器提供的可访问性行为！

Remix 还提供了 [`<NavLink/>`][navlink]，其行为与 `<Link>` 相同，但当链接指向当前页面时，它还为辅助技术提供了上下文。这对于构建导航菜单或面包屑导航非常有用。

## 路由

如果您在应用中渲染 [`<Scripts>`][scripts]，需要考虑一些重要事项，以使客户端路由对用户更易于访问。

在传统的多页面网站中，我们不需要过多考虑路由变化。您的应用渲染一个锚标签，浏览器处理其余部分。如果您的用户禁用 JavaScript，您的 Remix 应用应该默认以这种方式工作！

当 Remix 中的客户端脚本加载时，React Router 接管路由并阻止浏览器的默认行为。Remix 对路由变化时的 UI 没有任何假设。因此，您需要考虑一些重要的功能，包括：

- **焦点管理：** 路由变化时，哪个元素获得焦点？这对键盘用户很重要，并且对使用屏幕阅读器的用户也很有帮助。
- **实时区域公告：** 屏幕阅读器用户在路由变化时也会受益于公告。您可能还想在某些过渡状态下通知他们，这取决于变化的性质以及预计加载所需的时间。

在2019年，[Marcy Sutton 领导并发布了用户研究的发现][marcy-sutton-led-and-published-findings-from-user-research]，帮助开发者构建可访问的客户端路由体验。我们鼓励您详细阅读该文章。我们正在积极调查和测试内部解决方案以及新 API，以简化此过程。

[link]: ../components/link  
[navlink]: ../components/nav-link  
[scripts]: ../components/scripts  
[wcag]: https://www.w3.org/WAI/standards-guidelines/wcag/  
[marcy-sutton-led-and-published-findings-from-user-research]: https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing