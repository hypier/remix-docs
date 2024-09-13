---
title: 链接
---

# `links`

links 函数定义了用户访问某个路由时要添加到页面的 [`<link>` 元素][link-element]。

```tsx
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "/favicon.png",
      type: "image/png",
    },
    {
      rel: "stylesheet",
      href: "https://example.com/some/styles.css",
    },
    { page: "/users/123" },
    {
      rel: "preload",
      href: "/images/banner.jpg",
      as: "image",
    },
  ];
};
```

您可以返回两种类型的链接描述符：

#### `HtmlLinkDescriptor`

这是一个普通的 `<link {...props} />` 元素的对象表示。 [查看 MDN 文档中的链接 API][link-element]。

路由的 `links` 导出应返回一个 `HtmlLinkDescriptor` 对象的数组。

示例：

```tsx
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

import stylesHref from "../styles/something.css";

export const links: LinksFunction = () => {
  return [
    // 添加一个 favicon
    {
      rel: "icon",
      href: "/favicon.png",
      type: "image/png",
    },

    // 添加一个外部样式表
    {
      rel: "stylesheet",
      href: "https://example.com/some/styles.css",
      crossOrigin: "anonymous",
    },

    // 添加一个本地样式表，remix 将为生产缓存生成文件名指纹
    { rel: "stylesheet", href: stylesHref },

    // 预取用户可能会看到的图像到浏览器缓存中
    // 例如，他们可能会点击一个按钮在摘要/详细信息元素中显示
    {
      rel: "prefetch",
      as: "image",
      href: "/img/bunny.jpg",
    },

    // 只有在他们使用更大屏幕时才预取
    {
      rel: "prefetch",
      as: "image",
      href: "/img/bunny.jpg",
      media: "(min-width: 1000px)",
    },
  ];
};
```

#### `PageLinkDescriptor`

这些描述符允许您预取用户可能会导航到的页面的资源。虽然这个 API 很有用，但您可能会更喜欢使用 `<Link prefetch="render">`。但如果您愿意，您也可以通过这个 API 获得相同的行为。

```tsx
export const links: LinksFunction = () => {
  return [{ page: "/posts/public" }];
};
```

这将在用户导航到该页面之前，将 JavaScript 模块、加载器数据和样式表（在下一个路由的 `links` 导出中定义）加载到浏览器缓存中。

<docs-warning>请小心使用此功能。您不想为用户可能永远不会访问的页面下载 10MB 的 JavaScript 和数据。</docs-warning>

[link-element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link