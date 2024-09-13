---
title: 性能
---

# 性能

<docs-warning>本文件为草稿，我们将很快添加更多实用信息，但我们希望尽早传达我们的思路。</docs-warning>

与其规定一个具有所有限制的精确架构，像 SSG 一样，Remix 的设计旨在鼓励您利用分布式计算的性能特征。

发送给用户的最快内容当然是位于离用户较近的 CDN 上的静态文档。直到最近，服务器几乎只在世界的一个地区运行，这导致其他地方的响应速度较慢。这或许是 SSG 获得如此高人气的原因之一，它允许开发者将数据“缓存”到 HTML 文档中，然后分发到全球。它也带来了很多权衡：构建时间、构建复杂性、翻译的重复网站、无法用于认证用户体验、无法用于非常大且动态的数据源（例如我们的项目 [unpkg.com][unpkg-com]！）等。

## 边缘计算

（不，不是那个U2的家伙。）

今天，分布式计算“在边缘”上有很多令人兴奋的事情正在发生。“在边缘”上进行计算通常意味着在靠近用户的服务器上运行代码，而不仅仅是在一个地方（例如美国东海岸）。我们不仅看到这种情况越来越多，分布式数据库也在向边缘迁移。我们对这一切的期待已经有一段时间了，这就是Remix设计成现在这样的原因。

随着分布式服务器和数据库在边缘运行，现在可以以与静态文件相当的速度提供动态内容。**你可以让你的服务器变得快速，但你无法改变用户的网络**。剩下要做的就是将代码从浏览器包中移出，放到服务器上，减少通过网络传输的字节数，并提供无与伦比的网页性能。这就是Remix的设计目标。

## 这个网站 + Fly.io

这个网站的首字节时间非常出色。对于世界上大多数人来说，响应时间在100毫秒以内。我们可以在文档中修复一个错字，并在一两分钟内，网站在全球范围内更新，无需重建、重新部署，也无需HTTP缓存。

我们通过分布式系统实现了这一点。应用程序在[Fly][fly]的多个区域运行，因此离您很近。每个实例都有自己的SQLite数据库。当应用程序启动时，它从GitHub上的Remix源代码库中获取tarball，将markdown文档处理成HTML，然后将其插入SQLite数据库。

所涉及的代码实际上与Gatsby网站在构建时在`gatsby-node.js`或Next.js中的`getStaticProps`所做的非常相似。这个想法是将慢的部分（从GitHub获取文档、处理markdown）进行缓存（SSG将其缓存为HTML，而这个网站在服务器上将其缓存为SQLite）。

当用户请求一个页面时，应用程序查询其本地SQLite数据库并发送该页面。我们的服务器在几毫秒内完成这些请求。这个架构最有趣的地方在于，我们不需要为了新鲜度而牺牲速度。当我们在GitHub上编辑文档时，GitHub动作会调用最近的应用实例上的webhook，然后将该请求重放到全球的所有其他实例。然后，它们都从GitHub拉取新的tarball，并像启动时一样同步数据库中的文档。文档在一两分钟内在全球范围内更新。

但这只是我们想要探索的一种方法。

## Cloudflare Workers

[Remix Cloudflare Workers Demo][remix-cloudflare-workers-demo]

Cloudflare 一直在推动边缘计算的边界，而 Remix 则完全能够利用这一点。您可以看到我们的演示响应时间与提供静态文件相同，但它展示的功能绝对不是静态的！

Cloudflare 不仅将应用程序运行在离用户很近的地方，他们还有像 [KV][kv] 和 [Durable Objects][durable-objects] 这样的持久存储系统，使得在不将数据与部署和定制增量构建后端耦合的情况下，仍能实现 SSG 级别的速度。

我们还有其他类似的平台，计划很快支持。

## 包分析

<docs-warning>此文档仅在使用 [Classic Remix Compiler][classic-remix-compiler] 时相关</docs-warning>

Remix 输出元文件到服务器构建目录（默认是 `build/`），以便您可以分析您的包大小和组成。

- `metafile.css.json` : CSS 包的元文件
- `metafile.js.json` : 浏览器 JS 包的元文件
- `metafile.server.json` : 服务器 JS 包的元文件

Remix 使用 esbuild 的元文件格式，因此您可以直接将这些文件上传到 [https://esbuild.github.io/analyze/][https-esbuild-github-io-analyze] 以可视化您的包。

## 其他技术

以下是一些可以帮助加速您的服务器的其他技术：

- [FaunaDB][fauna-db] - 一个分布式数据库，运行在离您的用户较近的位置
- [LRU Cache][lru-cache] - 一个内存缓存，当满时会自动清理出更多空间
- [Redis][redis] - 一个经过验证的服务器端缓存

[unpkg-com]: https://unpkg.com
[fly]: https://fly.io
[remix-cloudflare-workers-demo]: https://remix-cloudflare-demo.jacob-ebey.workers.dev
[kv]: https://developers.cloudflare.com/workers/learning/how-kv-works
[durable-objects]: https://blog.cloudflare.com/introducing-workers-durable-objects
[fauna-db]: https://fauna.com
[lru-cache]: https://www.npmjs.com/package/lru-cache
[redis]: https://www.npmjs.com/package/redis
[https-esbuild-github-io-analyze]: https://esbuild.github.io/analyze
[classic-remix-compiler]: ./vite#classic-remix-compiler-vs-remix-vite