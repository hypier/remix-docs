---
title: 渐进增强
position: 7
---

# 渐进增强

> 渐进增强是一种网页设计策略，强调首先关注网页内容，使每个人都能访问网页的基本内容和功能，而拥有额外浏览器功能或更快互联网连接的用户则会获得增强版本。

<cite>- [维基百科][wikipedia]</cite>

这个词由 Steven Champeon 和 Nick Finck 于 2003 年提出，出现在不同浏览器间 CSS 和 JavaScript 支持差异较大的时期，许多用户实际上是在禁用 JavaScript 的情况下浏览网页。

今天，我们很幸运能够为一个更加一致的网络开发，其中大多数用户都启用了 JavaScript。

然而，我们仍然相信在 Remix 中渐进增强的核心原则。这导致了快速且具有弹性的应用程序，具有简单的开发工作流程。

**性能**：虽然很容易认为只有 5% 的用户有慢速连接，但现实是 100% 的用户在 5% 的时间内都有慢速连接。

**弹性**：每个人在 JavaScript 加载之前都是禁用的。

**简单性**：使用 Remix 以渐进增强的方式构建应用程序实际上比构建传统的单页应用程序更简单。

## 性能

从服务器发送 HTML 使您的应用程序能够比典型的单页面应用程序 (SPA) 执行更多并行操作，从而加快初始加载体验和后续导航速度。

典型的 SPA 发送一个空文档，并且仅在 JavaScript 加载完成后才开始工作。

```
HTML        |---|
JavaScript      |---------|
Data                      |---------------|
                            page rendered 👆
```

Remix 应用程序可以在请求到达服务器的瞬间开始工作，并流式传输响应，以便浏览器可以开始并行下载 JavaScript、其他资源和数据。

```
               👇 first byte
HTML        |---|-----------|
JavaScript      |---------|
Data        |---------------|
              page rendered 👆
```

## 弹性与可访问性

虽然用户在浏览网页时可能并不会禁用 JavaScript，但在 JavaScript 加载完成之前，所有人都是禁用 JavaScript 的。当你开始服务器渲染你的 UI 时，你需要考虑在 JavaScript 加载之前，用户尝试与应用程序交互时会发生什么。

Remix 通过在 HTML 之上构建其抽象来拥抱渐进增强。这意味着你可以以一种无需 JavaScript 的方式构建应用程序，然后再添加 JavaScript 以增强体验。

最简单的情况是 `<Link to="/account">`。这些会渲染一个 `<a href="/account">` 标签，该标签在没有 JavaScript 的情况下也能工作。当 JavaScript 加载时，Remix 会拦截点击事件，并使用客户端路由处理导航。这让你对用户体验有更多的控制，而不仅仅是在浏览器标签中旋转图标——但无论如何，它都能正常工作。

现在考虑一个简单的添加到购物车按钮。

```tsx
export function AddToCart({ id }) {
  return (
    <Form method="post" action="/add-to-cart">
      <input type="hidden" name="id" value={id} />
      <button type="submit">Add To Cart</button>
    </Form>
  );
}
```

无论 JavaScript 是否已加载，这个按钮都会将产品添加到购物车。

当 JavaScript 加载时，Remix 会拦截表单提交并在客户端处理。这允许你添加自己的待处理 UI 或其他客户端行为。

## 简单性

当你开始依赖网页的基本功能，如 HTML 和 URL 时，你会发现你对客户端状态和状态管理的依赖大大减少。

考虑之前的按钮，代码没有根本性的变化，我们可以添加一些客户端行为：

```tsx lines=[1,4,7,10-12,14]
import { useFetcher } from "@remix-run/react";

export function AddToCart({ id }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action="/add-to-cart">
      <input name="id" value={id} />
      <button type="submit">
        {fetcher.state === "submitting"
          ? "正在添加..."
          : "加入购物车"}
      </button>
    </fetcher.Form>
  );
}
```

这个功能在 JavaScript 加载时依然以相同的方式工作，但一旦 JavaScript 加载：

- `useFetcher` 不再像 `<Form>` 那样导致导航，因此用户可以留在同一页面继续购物
- 应用代码决定待处理的 UI，而不是在浏览器中旋转图标

这不是以两种不同的方式构建它——一次用于 JavaScript，一次不使用——而是以迭代的方式构建。先从功能的最简单版本开始并发布，然后迭代以增强用户体验。

用户不仅会获得逐步增强的体验，应用开发者也可以在不改变功能基本设计的情况下“逐步增强” UI。

另一个逐步增强带来简单性的例子是 URL。当你从 URL 开始时，你不需要担心客户端状态管理。你可以将 URL 作为 UI 的真实来源。

```tsx
export function SearchBox() {
  return (
    <Form method="get" action="/search">
      <input type="search" name="query" />
      <SearchIcon />
    </Form>
  );
}
```

这个组件不需要任何状态管理。它只是渲染一个提交到 `/search` 的表单。当 JavaScript 加载时，Remix 会拦截表单提交并在客户端处理。这允许你添加自己的待处理 UI 或其他客户端行为。下面是下一个迭代：

```tsx lines=[1,4-6,11]
import { useNavigation } from "@remix-run/react";

export function SearchBox() {
  const navigation = useNavigation();
  const isSearching =
    navigation.location.pathname === "/search";

  return (
    <Form method="get" action="/search">
      <input type="search" name="query" />
      {isSearching ? <Spinner /> : <SearchIcon />}
    </Form>
  );
}
```

架构没有根本性的变化，只是对用户和代码的逐步增强。

另见：[状态管理][state_management]

[wikipedia]: https://en.wikipedia.org/wiki/Progressive_enhancement
[state_management]: ./state-management