---
title: 浏览器支持
---

# 浏览器支持

Remix 仅在支持 [ES Modules][esm-browsers] 的浏览器中运行。

通常，当团队询问这个问题时，他们会关注 IE11 的支持。请注意，[微软自己已经停止支持这个浏览器][msie] 用于他们的 web 应用程序，您也许是时候考虑这一点了。

然而，得益于对 [渐进增强][pe] 的一流支持，Remix 应用可以支持早至 Netscape 1.0 的浏览器！这是因为 Remix 建立在 web 的基础之上：HTML、HTTP 和浏览器行为。通过遵循 Remix 约定，您的应用可以在 IE11 上达到基本水平，同时仍然为现代浏览器提供高度互动的 SPA 体验。这并不需要您付出太多努力。

它是如何工作的。Remix 的 `<Scripts/>` 组件渲染模块脚本标签如下：

```html
<script type="module" src="..." />
```

旧版浏览器会忽略它，因为它们不理解 `type`，因此不会加载 JavaScript。链接、加载器、表单和操作仍然可以工作，因为它们建立在 HTML、HTTP 和浏览器行为的基础之上。现代浏览器将加载这些脚本，提供增强的 SPA 行为，带来更快的过渡和您应用代码的增强用户体验。

## Remix 是否实现了 CSRF 保护？

Remix cookies 默认配置为 `SameSite=Lax`，这是一种平台内置的 CSRF 保护。如果您需要支持不支持 `SameSite=Lax` 的旧版浏览器（如 IE11 或更早版本），您需要自己实现 CSRF 保护或使用实现该功能的库。

[pe]: https://en.wikipedia.org/wiki/Progressive_enhancement  
[esm-browsers]: https://caniuse.com/es6-module  
[msie]: https://techcommunity.microsoft.com/t5/microsoft-365-blog/microsoft-365-apps-say-farewell-to-internet-explorer-11-and/ba-p/1591666