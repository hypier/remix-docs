---
title: ".server 模块"
toc: false
---

# `.server` 模块

虽然不是绝对必要，但 `.server` 模块是明确标记整个模块为服务器专用的好方法。如果 `.server` 文件或 `.server` 目录中的任何代码意外地出现在客户端模块图中，构建将失败。

```txt
app
├── .server 👈 将此目录中的所有文件标记为服务器专用
│   ├── auth.ts
│   └── db.ts
├── cms.server.ts 👈 将此文件标记为服务器专用
├── root.tsx
└── routes
    └── _index.tsx
```

`.server` 模块必须位于您的 Remix 应用目录内。

有关更多信息，请参阅侧边栏中的路由模块部分。

<docs-warning>仅在使用 [Remix Vite][remix-vite] 时支持 `.server` 目录。[Classic Remix Compiler][classic-remix-compiler] 仅支持 `.server` 文件。</docs-warning>

<docs-warning>在使用 [Classic Remix Compiler][classic-remix-compiler] 时，`.server` 模块会被替换为空模块，并不会导致编译错误。请注意，这可能会导致运行时错误。</docs-warning>

[classic-remix-compiler]: ../guides/vite#classic-remix-compiler-vs-remix-vite
[remix-vite]: ../guides/vite