---
title: "@remix-run/node"
---

# `@remix-run/node`

该包包含 Node.js 的工具和补丁。

## Polyfills

由于 Remix 依赖于一些在 Node.js 中尚未原生且稳定可用的浏览器 API，例如 `fetch`，因此在使用 Jest 等工具运行时，您可能会发现单元测试在没有这些全局变量的情况下失败。

您的测试框架应该提供一个钩子或位置来填充全局变量/模拟 API；在这里，您可以添加以下行以安装 Remix 依赖的全局变量：

```ts
import { installGlobals } from "@remix-run/node";

// This installs globals such as "fetch", "Response", "Request" and "Headers".
installGlobals();
```

<docs-info>
  请记住，我们会在您的实际应用中自动为您安装这些，因此您只需在测试环境中执行此操作。
</docs-info>

## 版本支持

Remix 官方支持任何时间点的 **Active** 和 **Maintenance** [Node LTS 版本][node-releases]。对已达到生命周期结束的 Node 版本的支持将在 Remix 小版本发布中取消。

[node-releases]: https://nodejs.org/en/about/previous-releases