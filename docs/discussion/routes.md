---
title: 路由配置
order: 3
---

# 路由配置

Remix 路由系统中的一个基础概念是使用嵌套路由，这种方法源于 Ember.js。通过嵌套路由，URL 的各个部分与数据依赖关系和 UI 的组件层次结构相结合。像 `/sales/invoices/102000` 这样的 URL 不仅在应用程序中揭示了清晰的路径，还划分了不同组件之间的关系和依赖。

## 模块化设计

嵌套路由通过将 URL 分段提供了清晰性。每个段落直接与特定的数据需求和组件相关联。例如，在 URL `/sales/invoices/102000` 中，每个段落 - `sales`、`invoices` 和 `102000` - 都可以与特定的数据点和 UI 部分关联，使其在代码库中易于管理。

嵌套路由的一个特点是，在嵌套路由树中，多个路由可以匹配单个 URL。这种细粒度确保每个路由主要集中于其特定的 URL 段和相关的 UI 切片。这种方法倡导模块化和关注点分离的原则，确保每个路由专注于其核心职责。

<iframe src="/_docs/routing" class="w-full aspect-[1/1] rounded-lg overflow-hidden pb-4"></iframe>

## 并行加载

在某些 web 应用程序中，数据和资源的顺序加载有时会导致用户体验显得异常缓慢。即使数据依赖关系并不相互依赖，它们也可能因为与渲染层次结构的耦合而顺序加载，从而形成不理想的请求链。

Remix 利用其嵌套路由系统来优化加载时间。当一个 URL 匹配多个路由时，Remix 将并行加载所有匹配路由所需的数据和资源。通过这样做，Remix 有效地避免了传统的请求链顺序陷阱。

这一策略，加上现代浏览器高效处理多个并发请求的能力，使 Remix 在提供高度响应和快速的 web 应用程序方面处于领先地位。这不仅仅是让数据获取变快；更重要的是以有序的方式获取数据，以便为最终用户提供最佳体验。

## 常规路由配置

Remix 引入了一个关键的约定，以帮助简化路由过程：`app/routes` 文件夹。当开发者在此文件夹中引入一个文件时，Remix 自然将其理解为一个路由。这个约定简化了定义路由、将其与 URL 关联以及渲染相关组件的过程。

以下是一个使用路由文件夹约定的示例目录：

```text
app/
├── routes/
│   ├── _index.tsx
│   ├── about.tsx
│   ├── concerts._index.tsx
│   ├── concerts.$city.tsx
│   ├── concerts.trending.tsx
│   └── concerts.tsx
└── root.tsx
```

所有以 `app/routes/concerts.` 开头的路由将是 `app/routes/concerts.tsx` 的子路由。

| URL                        | 匹配的路由                       | 布局                     |
| -------------------------- | -------------------------------- | ------------------------ |
| `/`                        | `app/routes/_index.tsx`         | `app/root.tsx`          |
| `/about`                   | `app/routes/about.tsx`          | `app/root.tsx`          |
| `/concerts`                | `app/routes/concerts._index.tsx`| `app/routes/concerts.tsx`|
| `/concerts/trending`       | `app/routes/concerts.trending.tsx`| `app/routes/concerts.tsx`|
| `/concerts/salt-lake-city` | `app/routes/concerts.$city.tsx` | `app/routes/concerts.tsx`|

## 常规路由文件夹

对于需要附加模块或资源的路由，可以在 `app/routes` 目录下使用一个包含 `route.tsx` 文件的文件夹。这种方法：

- **模块共存**：将与特定路由相关的所有元素聚集在一起，确保逻辑、样式和组件紧密结合。
- **简化导入**：将相关模块放在一个地方，管理导入变得简单，从而增强代码的可维护性。
- **促进自动代码组织**：使用 `route.tsx` 设置自然地促进了良好的代码结构，这在应用程序扩展时尤为有利。

上述相同的路由可以改为如下组织：

```text
app/
├── routes/
│   ├── _index/
│   │   ├── signup-form.tsx
│   │   └── route.tsx
│   ├── about/
│   │   ├── header.tsx
│   │   └── route.tsx
│   ├── concerts/
│   │   ├── favorites-cookie.ts
│   │   └── route.tsx
│   ├── concerts.$city/
│   │   └── route.tsx
│   ├── concerts._index/
│   │   ├── featured.tsx
│   │   └── route.tsx
│   └── concerts.trending/
│       ├── card.tsx
│       ├── route.tsx
│       └── sponsored.tsx
└── root.tsx
```

您可以在 [路由文件约定][route-file-conventions] 参考中阅读有关文件名和其他特征的具体模式。

只有直接位于 `app/routes` 之下的文件夹会被注册为路由。深层嵌套的文件夹会被忽略。位于 `app/routes/about/header/route.tsx` 的文件不会创建路由。

```text bad lines=[4]
app/
├── routes/
│   └── about/
│       ├── header/
│       │   └── route.tsx
│       └── route.tsx
└── root.tsx
```

## 手动路由配置

虽然 `app/routes` 文件夹为开发者提供了便利的约定，但 Remix 理解到 [一刀切并不适用][routes-disclaimer]。有时，提供的约定可能与特定项目需求或开发者的偏好不一致。在这种情况下，Remix 允许通过 [`vite.config.ts`][vite-routes] 进行手动路由配置。这种灵活性确保开发者可以以适合其项目的方式构建应用程序。

<docs-warning>如果您尚未迁移到 [Vite][remix-vite] 并仍在使用 [Classic Remix Compiler][classic-remix-compiler]，您可以在 [`remix.config.js`][remix-config] 文件中手动配置路由。</docs-warning>

一种常见的应用结构方式是按顶层功能文件夹组织。考虑到与特定主题（如音乐会）相关的路由可能共享多个模块，将它们组织在一个文件夹下是合理的：

```text
app/
├── about/
│   └── route.tsx
├── concerts/
│   ├── card.tsx
│   ├── city.tsx
│   ├── favorites-cookie.ts
│   ├── home.tsx
│   ├── layout.tsx
│   ├── sponsored.tsx
│   └── trending.tsx
├── home/
│   ├── header.tsx
│   └── route.tsx
└── root.tsx
```

要将此结构配置为与之前示例相同的 URL，您可以在 `vite.config.ts` 中使用 `routes` 函数：

```ts filename=vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      routes(defineRoutes) {
        return defineRoutes((route) => {
          route("/", "home/route.tsx", { index: true });
          route("about", "about/route.tsx");
          route("concerts", "concerts/layout.tsx", () => {
            route("", "concerts/home.tsx", { index: true });
            route("trending", "concerts/trending.tsx");
            route(":city", "concerts/city.tsx");
          });
        });
      },
    }),
  ],
});
```

Remix 的路由配置方法将约定与灵活性相结合。您可以使用 `app/routes` 文件夹以简单、组织良好的方式设置路由。如果您希望获得更多控制，或者不喜欢文件名，或者有独特需求，可以使用 `vite.config.ts`。预计许多应用程序将放弃路由文件夹约定，转而使用 `vite.config.ts`。

[route-file-conventions]: ../file-conventions/routes
[remix-config]: ../file-conventions/remix-config
[classic-remix-compiler]: ../guides/vite#classic-remix-compiler-vs-remix-vite
[remix-vite]: ../guides/vite
[vite-routes]: ../file-conventions/vite-config#routes
[routes-disclaimer]: ../file-conventions/routes#disclaimer