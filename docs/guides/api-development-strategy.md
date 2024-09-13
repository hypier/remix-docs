---
title: 发展战略
---

# 渐进式功能采用与未来标志

在我们的软件开发方法中，我们旨在实现以下主要版本的目标：

1. **增量功能采用：** 开发人员可以灵活地选择并逐个集成新功能和更改，随着它们在当前主要版本中变得可用。这与传统的将所有更改打包到单个新主要版本的方法有所不同。
2. **无缝版本升级：** 通过提前选择性地纳入新功能，开发人员可以顺利过渡到新的主要版本，而无需修改现有应用程序代码。

## 不稳定的 API 和未来标志

我们通过一个未来标志引入当前版本的新功能，该标志类似于 `unstable_someFeature`。您可以在 Remix Vite 插件的 `future` 选项中指定这些标志，位于您的 [`vite.config.ts`][vite-config-future] 文件中：

```ts filename=vite.config.ts lines=[7-9]
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      future: {
        unstable_someFeature: true,
      },
    }),
  ],
});
```

<docs-info>如果您还未使用 Vite，可以通过 [`remix.config.js` `future`][remix-config-future] 选项提供未来标志</docs-info>

- 一旦不稳定的功能达到稳定状态，我们将移除特殊前缀，并在下一个小版本中包含该功能。此时，API 的结构在后续的小版本中保持一致。

- 这种方法使我们能够与早期采用者共同完善 API，在不影响所有用户的情况下，在不稳定阶段进行必要的更改。稳定版本因此能够在没有中断的情况下受益于这些改进。

- 如果您正在使用标记为 `unstable_*` 的功能，务必查看每个小版本的发布说明。这是因为这些功能的行为或结构可能会发生变化。在此阶段您的反馈对于在最终发布之前改进功能至关重要！

## 使用未来标志管理重大更改

当我们引入重大更改时，我们是在当前主要版本的上下文中进行的，并将其隐藏在未来标志后面。例如，如果我们处于 `v2`，则一个重大更改可能会放在名为 `v3_somethingDifferent` 的未来标志下。

```ts filename=vite.config.ts lines=[7-9]
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_someFeature: true,
      },
    }),
  ],
});
```

- 现有的 `v2` 行为和新的 `v3_somethingDifferent` 行为同时共存。
- 应用程序可以逐步采用更改，一次一步，而不必在下一个主要版本中一次性调整大量更改。
- 如果所有的 `v3_*` 未来标志都被启用，过渡到 `v3` 理想情况下不应需要对您的代码库进行任何更改。
- 一些带来重大更改的未来标志最初以 `unstable_*` 标志开始。这些可能会在小版本发布期间进行修改。一旦它们成为 `v3_*` 未来标志，相应的 API 就会被确定，并且不会再更改。

## 摘要

我们的开发策略专注于逐步采用新特性和无缝版本升级，以便于主要版本的发布。这使开发者能够选择性地集成新特性，避免在版本过渡期间进行大量代码调整。通过引入 `unstable_*` 标志，我们与早期采用者共同完善 API，同时确保稳定版本受益于这些增强功能。通过使用 `v3_*` 标志仔细管理破坏性更改，我们提供了逐步采用更改的灵活性，促进了主要版本之间的平滑过渡。尽管这增加了开发 Remix 框架的复杂性，但这种以开发者为中心的方法大大简化了使用 Remix 的应用程序开发，最终提高了软件质量和（希望！）开发者的满意度。

[vite-config-future]: ../file-conventions/vite-config#future
[remix-config-future]: ../file-conventions/remix-config#future