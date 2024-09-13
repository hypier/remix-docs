---
title: 常规 CSS
---

# 常规 CSS

Remix 帮助您通过常规 CSS 和嵌套路由扩展应用程序，并使用 [`links`][links]。

CSS 维护问题可能由于几种原因出现在 web 应用程序中。了解以下内容可能会变得困难：

- 如何以及何时加载 CSS，因此通常在每个页面上都会加载所有 CSS
- 您使用的类名和选择器是否意外地影响了应用程序中的其他 UI
- 随着 CSS 源代码的增长，某些规则是否已经不再使用

Remix 通过基于路由的样式表解决了这些问题。每个嵌套路由都可以将其自己的样式表添加到页面中，Remix 会自动预取、加载和卸载它们。当关注的范围仅限于活动路由时，这些问题的风险显著降低。冲突的唯一可能性来自父路由的样式（即便如此，您也可能会看到冲突，因为父路由也在渲染）。

<docs-warning>如果您使用的是 [Classic Remix Compiler][classic-remix-compiler] 而不是 [Remix Vite][remix-vite]，则应从 CSS 导入路径的末尾删除 `?url`。</docs-warning>

### 路由样式

每个路由可以向页面添加样式链接，例如：

```tsx filename=app/routes/dashboard.tsx
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

import styles from "~/styles/dashboard.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];
```

```tsx filename=app/routes/dashboard.accounts.tsx
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

import styles from "~/styles/accounts.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];
```

```tsx filename=app/routes/dashboard.sales.tsx
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

import styles from "~/styles/sales.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];
```

考虑到这些路由，以下表格显示了在特定 URL 下将应用哪些 CSS：

| URL                 | 样式表                      |
| ------------------- | --------------------------- |
| /dashboard          | dashboard.css               |
| /dashboard/accounts | dashboard.css<br/>accounts.css |
| /dashboard/sales    | dashboard.css<br/>sales.css   |

这虽然是一个细微的功能，但在使用普通样式表为您的应用程序进行样式设置时，它消除了很多困难。

### 共享组件样式

大型和小型网站通常都有一组在应用程序其他部分使用的共享组件：按钮、表单元素、布局等。在 Remix 中使用普通样式表时，我们推荐两种方法。

#### 共享样式表

第一种方法非常简单。将它们全部放在一个 `shared.css` 文件中，并包含在 `app/root.tsx` 中。这使得组件本身能够轻松共享 CSS 代码（并且您的编辑器可以为像 [custom properties][custom-properties] 这样的内容提供智能感知），而且每个组件在 JavaScript 中已经需要一个唯一的模块名称，因此您可以将样式作用域限定到唯一的类名或数据属性：

```css filename=app/styles/shared.css
/* scope with class names */
.PrimaryButton {
  /* ... */
}

.TileGrid {
  /* ... */
}

/* or scope with data attributes to avoid concatenating
   className props, but it's really up to you */
[data-primary-button] {
  /* ... */
}

[data-tile-grid] {
  /* ... */
}
```

虽然这个文件可能会变得很大，但它将在一个 URL 下被所有路由共享。

这也使得路由可以轻松调整组件的样式，而无需向该组件的 API 添加官方的新变体。您知道它不会影响 `/accounts` 路由之外的任何组件。

```css filename=app/styles/accounts.css
.PrimaryButton {
  background: blue;
}
```

#### 公开样式

第二种方法是为每个组件编写单独的 css 文件，然后将样式“公开”到使用它们的路由。

也许您在 `app/components/button/index.tsx` 中有一个 `<Button>`，其样式在 `app/components/button/styles.css` 中，以及一个扩展它的 `<PrimaryButton>`。

请注意，这些不是路由，但它们像路由一样导出 `links` 函数。我们将利用这一点将它们的样式公开到使用它们的路由。

```css filename=app/components/button/styles.css
[data-button] {
  border: solid 1px;
  background: white;
  color: #454545;
}
```

```tsx filename=app/components/button/index.tsx lines=[1,3,5-7]
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

import styles from "./styles.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export const Button = React.forwardRef(
  ({ children, ...props }, ref) => {
    return <button {...props} ref={ref} data-button />;
  }
);
Button.displayName = "Button";
```

然后是扩展它的 `<PrimaryButton>`：

```css filename=app/components/primary-button/styles.css
[data-primary-button] {
  background: blue;
  color: white;
}
```

```tsx filename=app/components/primary-button/index.tsx lines=[3,8,15]
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

import { Button, links as buttonLinks } from "../button";

import styles from "./styles.css?url";

export const links: LinksFunction = () => [
  ...buttonLinks(),
  { rel: "stylesheet", href: styles },
];

export const PrimaryButton = React.forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <Button {...props} ref={ref} data-primary-button />
    );
  }
);
PrimaryButton.displayName = "PrimaryButton";
```

请注意，主按钮的 `links` 包含基础按钮的链接。这样，使用 `<PrimaryButton>` 的消费者不需要知道它的依赖项（就像 JavaScript 导入一样）。

因为这些按钮不是路由，因此与 URL 段不相关，Remix 不知道何时预取、加载或卸载样式。我们需要将链接“公开”到使用组件的路由。

考虑到 `app/routes/_index.tsx` 使用主按钮组件：

```tsx filename=app/routes/_index.tsx lines=[3-6,10]
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

import {
  PrimaryButton,
  links as primaryButtonLinks,
} from "~/components/primary-button";
import styles from "~/styles/index.css?url";

export const links: LinksFunction = () => [
  ...primaryButtonLinks(),
  { rel: "stylesheet", href: styles },
];
```

现在 Remix 可以预取、加载和卸载 `button.css`、`primary-button.css` 和路由的 `index.css` 的样式。

对此的初步反应是路由必须了解比您希望它们更多的内容。请记住，每个组件必须已经被导入，因此这并不是引入新的依赖项，只是一些获取资产的样板代码。例如，考虑一个产品类别页面，如下所示：

```tsx filename=app/routes/$category.tsx lines=[3-7]
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

import { AddFavoriteButton } from "~/components/add-favorite-button";
import { ProductDetails } from "~/components/product-details";
import { ProductTile } from "~/components/product-tile";
import { TileGrid } from "~/components/tile-grid";
import styles from "~/styles/$category.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export default function Category() {
  const products = useLoaderData<typeof loader>();
  return (
    <TileGrid>
      {products.map((product) => (
        <ProductTile key={product.id}>
          <ProductDetails product={product} />
          <AddFavoriteButton id={product.id} />
        </ProductTile>
      ))}
    </TileGrid>
  );
}
```

组件导入已经存在，我们只需公开资产：

```tsx filename=app/routes/$category.tsx
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

import {
  AddFavoriteButton,
  links as addFavoriteLinks,
} from "~/components/add-favorite-button";
import {
  ProductDetails,
  links as productDetailsLinks,
} from "~/components/product-details";
import {
  ProductTile,
  links as productTileLinks,
} from "~/components/product-tile";
import {
  TileGrid,
  links as tileGridLinks,
} from "~/components/tile-grid";
import styles from "~/styles/$category.css?url";

export const links: LinksFunction = () => {
  return [
    ...tileGridLinks(),
    ...productTileLinks(),
    ...productDetailsLinks(),
    ...addFavoriteLinks(),
    { rel: "stylesheet", href: styles },
  ];
};

// ...
```

虽然这有点样板代码，但它带来了很多好处：

- 您可以控制网络标签，CSS 依赖关系在代码中清晰可见
- 样式与组件共同定位
- 只有当前页面使用的 CSS 会被加载
- 当您的组件未被路由使用时，它们的 CSS 会从页面卸载
- Remix 会预取下一个页面的 CSS，使用 [`<Link prefetch>`][link]
- 当一个组件的样式发生变化时，其他组件的浏览器和 CDN 缓存不会破坏，因为它们都有自己的 URL。
- 当一个组件的 JavaScript 发生变化但样式没有变化时，样式的缓存不会被破坏

#### 资源预加载

由于这些只是 `<link>` 标签，您可以做的不仅仅是样式表链接，例如为元素的 SVG 图标背景添加资源预加载：

```css filename=app/components/copy-to-clipboard.css
[data-copy-to-clipboard] {
  background: url("/icons/clipboard.svg");
}
```

```tsx filename=app/components/copy-to-clipboard.tsx lines=[6-11]
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

import styles from "./styles.css?url";

export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: "/icons/clipboard.svg",
    as: "image",
    type: "image/svg+xml",
  },
  { rel: "stylesheet", href: styles },
];

export const CopyToClipboard = React.forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <Button {...props} ref={ref} data-copy-to-clipboard />
    );
  }
);
CopyToClipboard.displayName = "CopyToClipboard";
```

这不仅会使资产在网络标签中具有高优先级，而且当您使用 [`<Link prefetch>`][link] 链接到页面时，Remix 会将该 `preload` 转换为 `prefetch`，因此 SVG 背景会与下一个路由的数据、模块、样式表和任何其他预加载内容并行预取。

### 链接媒体查询

使用普通样式表和 `<link>` 标签还可以减少用户浏览器在绘制屏幕时需要处理的 CSS 数量。链接标签支持 `media`，因此您可以执行以下操作：

```tsx lines=[10,15,20]
export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: mainStyles,
    },
    {
      rel: "stylesheet",
      href: largeStyles,
      media: "(min-width: 1024px)",
    },
    {
      rel: "stylesheet",
      href: xlStyles,
      media: "(min-width: 1280px)",
    },
    {
      rel: "stylesheet",
      href: darkStyles,
      media: "(prefers-color-scheme: dark)",
    },
  ];
};
```

[links]: ../route/links  
[custom-properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/--*  
[link]: ../components/link  
[classic-remix-compiler]: ../guides/vite#classic-remix-compiler-vs-remix-vite  
[remix-vite]: ../guides/vite