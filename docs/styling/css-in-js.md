---
title: CSS 在 JS 中
---

# CSS in JS 库

您可以使用 CSS-in-JS 库，如 Styled Components 和 Emotion。其中一些库在服务器渲染期间需要进行 "双重渲染" 以从组件树中提取样式。

由于每个库的集成方式不同，请查看我们的 [examples repo][examples] 以了解如何使用一些最流行的 CSS-in-JS 库。如果您有一个运作良好的库尚未被覆盖，请 [贡献一个示例][examples]！

<docs-warning>
大多数 CSS-in-JS 方法不建议在 Remix 中使用，因为它们要求您的应用程序完全渲染后才能知道样式是什么。这是一个性能问题，并且阻止了像 defer 这样的流式功能。
</docs-warning>

[examples]: https://github.com/remix-run/examples