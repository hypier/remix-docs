---
title: 预取页面链接
toc: false
---

# `<PrefetchPageLinks />`

此组件启用对页面所有资产的预获取，以实现对该页面的即时导航。它通过为给定页面的所有资产（数据、模块、css）渲染 `<link rel="prefetch">` 和 `<link rel="modulepreload"/>` 标签来实现这一点。

`<Link rel="prefetch">` 在内部使用此功能，但您可以将其渲染以出于任何其他原因预获取页面。

```tsx
<PrefetchPageLinks page="/absolute/path/to/your-path" />
```

**注意：** 您需要使用绝对路径。