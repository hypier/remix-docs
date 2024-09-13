---
title: 依赖优化
---

<docs-info>此功能仅影响开发环境。它不会影响生产构建。</docs-info>

# 依赖优化

Remix 在开发中引入了自动依赖优化，背后是 `future.unstable_optimizeDeps` [未来标志][future-flags]。这允许您选择这种行为，这将在 Remix 的下一个主要版本中成为默认设置 - 也就是 React Router v7 ([1][rr-v7], [2][rr-v7-2])。

在开发中，Vite 旨在 [预打包依赖][prebundle-dependencies]，以便能够高效地按需提供这些依赖。要实现这一点，Vite 需要知道从哪里开始爬取您应用的模块图以查找依赖。

之前，Remix 并没有告知 Vite 从路由模块或客户端入口开始依赖检测。这意味着在开发过程中，当您在应用中导航时，Vite 会遇到新的依赖，导致出现 `504 Outdated Dependency` 错误。因此，开发体验有时会显得不流畅，因为这些错误可能导致 HMR 中断或链接导航被中止。导航也可能感觉迟缓，因为交互式处理依赖有时可能比较慢。

有关更多信息，请参见 [Vite 的依赖优化选项][vite-s-dep-optimization-options]。

## 故障排除

### `无法解析包的入口`

```txt
✘ [ERROR] Failed to resolve entry for package "<package>". The package may have incorrect main/module/exports specified in its package.json. [plugin vite:dep-pre-bundle]
```

这通常是由于依赖项配置错误引起的。
您可以使用 [publint][publint] 检查有问题的包是否配置错误。
要解决此问题，您需要使用 `npm why` 或 `pnpm why` 来确定需要添加到 `optimizeDeps.exclude` 的直接依赖项。

例如，假设您的应用程序遇到了这个错误：

```txt
✘ [ERROR] Failed to resolve entry for package "jimp". The package may have incorrect main/module/exports specified in its package.json. [plugin vite:dep-pre-bundle]
```

果然，`publint` 报告 [`jimp` 包配置错误][jimp-package-is-misconfigured]。
然后，您确定 `jimp` 是由您的 `svg2img` 直接依赖项引入的间接依赖项：

```sh
❯ npm why jimp
jimp@0.16.13
node_modules/jimp
  jimp@"^0.16.1" from svg2img@1.0.0-beta.2
  node_modules/svg2img
    svg2img@"^1.0.0-beta.2" from the root project
```

最后，您将 `svg2img` 添加到 `optimizeDeps.exclude` 中，这应该能解决问题：

```ts filename=vite.config.ts
export default defineConfig({
  optimizeDeps: {
    exclude: ["svg2img"],
  },
});
```

[future-flags]: ../guides/api-development-strategy
[rr-v7]: https://remix.run/blog/merging-remix-and-react-router
[rr-v7-2]: https://remix.run/blog/incremental-path-to-react-19
[prebundle-dependencies]: https://vitejs.dev/guide/dep-pre-bundling.html
[vite-s-dep-optimization-options]: https://vitejs.dev/config/dep-optimization-options#dep-optimization-options
[publint]: https://publint.dev
[jimp-package-is-misconfigured]: https://publint.dev/jimp@0.22.12