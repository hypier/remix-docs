---
title: 路由文件命名
---

# 路由文件命名

虽然您可以通过 [“routes” 插件选项][routes_config] 配置路由，但大多数路由是通过这种文件系统约定创建的。添加一个文件，获取一个路由。

请注意，您可以使用 `.js`、`.jsx`、`.ts` 或 `.tsx` 文件扩展名。为了避免重复，我们将在示例中使用 `.tsx`。

<docs-info>Dilum Sanjaya 制作了一个 [很棒的可视化][an_awesome_visualization]，展示了文件系统中的路由如何映射到您应用中的 URL，这可能有助于您理解这些约定。</docs-info>

## 免责声明

在我们深入探讨 Remix 约定之前，我们想指出基于文件的路由是一个 **极其** 主观的概念。有些人喜欢“扁平”路由的想法，有些人讨厌它，更愿意将路由嵌套在文件夹中。有些人简单地讨厌基于文件的路由，更愿意通过 JSON 配置路由。有些人则希望像在他们的 React Router 单页应用中那样，通过 JSX 配置路由。

关键是，我们对此非常清楚，从一开始，Remix 就始终提供了一种一流的方式让你选择退出，通过 [`routes`][routes_config]/[`ignoredRouteFiles`][ignoredroutefiles_config] 和 [手动配置路由][manual-route-configuration]。但是，必须有 _某种_ 默认设置，以便人们能够快速轻松地启动 - 我们认为下面的扁平路由约定文档是一个相当不错的默认设置，适合小型到中型应用程序。

对于拥有数百或数千个路由的大型应用程序，无论你使用什么约定，都会 _始终_ 有点混乱 - 其想法是通过 `routes` 配置，你可以构建 _完全_ 适合你应用程序/团队的约定。对于 Remix 来说，拥有一个让所有人都满意的默认约定几乎是不可能的。我们宁愿给你一个相对简单的默认设置，然后让社区构建你可以选择的各种约定。

因此，在我们深入讨论 Remix 默认约定的细节之前，这里有一些社区替代方案，如果你决定我们的默认设置不符合你的口味，可以查看一下。

- [`remix-flat-routes`][flat_routes] - Remix 默认设置基本上是这个包的简化版本。作者继续对这个包进行迭代和演进，因此如果你通常喜欢“扁平路由”的想法，但想要更多的功能（包括文件和文件夹的混合方法），一定要看看这个。
- [`remix-custom-routes`][custom_routes] - 如果你想要更多的自定义，这个包允许你定义哪些类型的文件应被视为路由。这让你可以超越简单的扁平/嵌套概念，做一些例如 _“任何扩展名为 `.route.tsx` 的文件都是路由”_ 的事情。
- [`remix-json-routes`][json_routes] - 如果你只想通过配置文件指定你的路由，这就是你的选择 - 只需向 Remix 提供一个包含你路由的 JSON 对象，完全跳过扁平/嵌套概念。里面甚至还有一个 JSX 选项。

## 根路由

```text lines=[3]
app/
├── routes/
└── root.tsx
```

`app/root.tsx` 文件是您的根布局，或称为“根路由”（非常抱歉那些发音相同的朋友们！）。它的工作方式与其他所有路由相同，因此您可以导出一个 [`loader`][loader]、[`action`][action] 等。

根路由通常看起来像这样。它作为整个应用程序的根布局，所有其他路由将渲染在 [`<Outlet />`][outlet_component] 内部。

```tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export default function Root() {
  return (
    <html lang="en">
      <head>
        <Links />
        <Meta />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

## 基本路由

`app/routes` 目录中的任何 JavaScript 或 TypeScript 文件都将成为您应用程序中的路由。文件名映射到路由的 URL 路径名，除了 `_index.tsx`，它是 [index route][index_route] 的 [root route][root_route]。

```text lines=[3-4]
app/
├── routes/
│   ├── _index.tsx
│   └── about.tsx
└── root.tsx
```

| URL      | 匹配的路由               |
| -------- | ----------------------- |
| `/`      | `app/routes/_index.tsx` |
| `/about` | `app/routes/about.tsx`  |

请注意，这些路由将会在 `app/root.tsx` 的出口中渲染，因为 [nested routing][nested_routing]。

## 点分隔符

在路由文件名中添加 `.` 将在 URL 中创建一个 `/`。

```text lines=[5-7]
 app/
├── routes/
│   ├── _index.tsx
│   ├── about.tsx
│   ├── concerts.trending.tsx
│   ├── concerts.salt-lake-city.tsx
│   └── concerts.san-diego.tsx
└── root.tsx
```

| URL                        | 匹配的路由                            |
| -------------------------- | -------------------------------------- |
| `/`                        | `app/routes/_index.tsx`               |
| `/about`                   | `app/routes/about.tsx`                |
| `/concerts/trending`       | `app/routes/concerts.trending.tsx`    |
| `/concerts/salt-lake-city` | `app/routes/concerts.salt-lake-city.tsx` |
| `/concerts/san-diego`      | `app/routes/concerts.san-diego.tsx`   |

点分隔符还会创建嵌套，更多信息请参见 [嵌套部分][nested_routes]。

## 动态段

通常你的 URLs 不是静态的，而是数据驱动的。动态段允许你匹配 URL 的某些部分，并在代码中使用该值。你可以使用 `$` 前缀来创建它们。

```text lines=[5]
 app/
├── routes/
│   ├── _index.tsx
│   ├── about.tsx
│   ├── concerts.$city.tsx
│   └── concerts.trending.tsx
└── root.tsx
```

| URL                        | 匹配的路由                      |
| -------------------------- | ---------------------------------- |
| `/`                        | `app/routes/_index.tsx`            |
| `/about`                   | `app/routes/about.tsx`             |
| `/concerts/trending`       | `app/routes/concerts.trending.tsx` |
| `/concerts/salt-lake-city` | `app/routes/concerts.$city.tsx`    |
| `/concerts/san-diego`      | `app/routes/concerts.$city.tsx`    |

Remix 将从 URL 中解析值并将其传递给各种 API。我们称这些值为“URL 参数”。访问 URL 参数最有用的地方是在 [loaders][loader] 和 [actions][action] 中。

```tsx
export async function loader({
  params,
}: LoaderFunctionArgs) {
  return fakeDb.getAllConcertsForCity(params.city);
}
```

你会注意到 `params` 对象上的属性名称直接映射到文件的名称：`$city.tsx` 变成 `params.city`。

路由可以有多个动态段，比如 `concerts.$city.$date`，这两个参数都可以通过名称在 params 对象上访问：

```tsx
export async function loader({
  params,
}: LoaderFunctionArgs) {
  return fake.db.getConcerts({
    date: params.date,
    city: params.city,
  });
}
```

有关更多信息，请参阅 [路由指南][routing_guide]。

## 嵌套路由

嵌套路由的基本思想是将 URL 的各个部分与组件层次结构和数据结合起来。您可以在 [路由指南][nested_routing] 中阅读更多相关内容。

您可以使用 [点分隔符][dot_delimiters] 创建嵌套路由。如果 `.` 前面的文件名与另一个路由文件名匹配，它将自动成为匹配父路由的子路由。考虑以下路由：

```text lines=[5-8]
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

所有以 `app/routes/concerts.` 开头的路由将是 `app/routes/concerts.tsx` 的子路由，并在父路由的 [outlet_component][outlet_component] 中渲染。

| URL                        | 匹配的路由                      | 布局                    |
| -------------------------- | ---------------------------------- | ------------------------- |
| `/`                        | `app/routes/_index.tsx`            | `app/root.tsx`            |
| `/about`                   | `app/routes/about.tsx`             | `app/root.tsx`            |
| `/concerts`                | `app/routes/concerts._index.tsx`   | `app/routes/concerts.tsx` |
| `/concerts/trending`       | `app/routes/concerts.trending.tsx` | `app/routes/concerts.tsx` |
| `/concerts/salt-lake-city` | `app/routes/concerts.$city.tsx`    | `app/routes/concerts.tsx` |

请注意，当您添加嵌套路由时，通常希望添加一个索引路由，以便在用户直接访问父 URL 时，某些内容可以在父路由的 outlet 中渲染。

例如，如果 URL 是 `/concerts/salt-lake-city`，那么 UI 层次结构将如下所示：

```tsx
<Root>
  <Concerts>
    <City />
  </Concerts>
</Root>
```

## 无布局嵌套的嵌套 URL

有时您希望 URL 嵌套，但又不希望自动布局嵌套。您可以通过在父级段末尾添加下划线来选择不进行嵌套：

```text lines=[8]
 app/
├── routes/
│   ├── _index.tsx
│   ├── about.tsx
│   ├── concerts.$city.tsx
│   ├── concerts.trending.tsx
│   ├── concerts.tsx
│   └── concerts_.mine.tsx
└── root.tsx
```

| URL                        | 匹配的路由                      | 布局                    |
| -------------------------- | -------------------------------- | ----------------------- |
| `/`                        | `app/routes/_index.tsx`            | `app/root.tsx`            |
| `/about`                   | `app/routes/about.tsx`             | `app/root.tsx`            |
| `/concerts/mine`           | `app/routes/concerts_.mine.tsx`    | `app/root.tsx`            |
| `/concerts/trending`       | `app/routes/concerts.trending.tsx` | `app/routes/concerts.tsx` |
| `/concerts/salt-lake-city` | `app/routes/concerts.$city.tsx`    | `app/routes/concerts.tsx` |

请注意，`/concerts/mine` 不再与 `app/routes/concerts.tsx` 嵌套，而是与 `app/root.tsx` 嵌套。`trailing_` 下划线创建了一个路径段，但并未创建布局嵌套。

可以将 `trailing_` 下划线视为您父母签名末尾的长部分，将您从遗嘱中排除，移除随后的段落以避免布局嵌套。

## 无路径的嵌套布局

我们称这些为 <a name="pathless-routes"><b>无路径路由</b></a>

有时你想与一组路由共享一个布局，而不在 URL 中添加任何路径段。一个常见的例子是一组身份验证路由，它们的页眉/页脚与公共页面或已登录应用体验不同。你可以通过 `_leading` 下划线来实现这一点。

```text lines=[3-5]
 app/
├── routes/
│   ├── _auth.login.tsx
│   ├── _auth.register.tsx
│   ├── _auth.tsx
│   ├── _index.tsx
│   ├── concerts.$city.tsx
│   └── concerts.tsx
└── root.tsx
```

| URL                        | 匹配的路由                   | 布局                    |
| -------------------------- | ----------------------------- | ----------------------- |
| `/`                        | `app/routes/_index.tsx`       | `app/root.tsx`          |
| `/login`                   | `app/routes/_auth.login.tsx`  | `app/routes/_auth.tsx`  |
| `/register`                | `app/routes/_auth.register.tsx` | `app/routes/_auth.tsx`  |
| `/concerts`                | `app/routes/concerts.tsx`     | `app/root.tsx`          |
| `/concerts/salt-lake-city` | `app/routes/concerts.$city.tsx` | `app/routes/concerts.tsx` |

把 `_leading` 下划线想象成一条覆盖在文件名上的毯子，隐藏了 URL 中的文件名。

## 可选段

将路由段用括号包裹会使该段变为可选。

```text lines=[3-5]
 app/
├── routes/
│   ├── ($lang)._index.tsx
│   ├── ($lang).$productId.tsx
│   └── ($lang).categories.tsx
└── root.tsx
```

| URL                        | 匹配的路由                       |
| -------------------------- | ----------------------------------- |
| `/`                        | `app/routes/($lang)._index.tsx`     |
| `/categories`              | `app/routes/($lang).categories.tsx` |
| `/en/categories`           | `app/routes/($lang).categories.tsx` |
| `/fr/categories`           | `app/routes/($lang).categories.tsx` |
| `/american-flag-speedo`    | `app/routes/($lang)._index.tsx`     |
| `/en/american-flag-speedo` | `app/routes/($lang).$productId.tsx` |
| `/fr/american-flag-speedo` | `app/routes/($lang).$productId.tsx` |

你可能会想知道为什么 `/american-flag-speedo` 匹配 `($lang)._index.tsx` 路由而不是 `($lang).$productId.tsx`。这是因为当你有一个可选的动态参数段后面跟着另一个动态参数时，Remix 无法可靠地判断像 `/american-flag-speedo` 这样的单段 URL 是否应该匹配 `/:lang` `/:productId`。可选段会优先匹配，因此它会匹配 `/:lang`。如果你有这种设置，建议在 `($lang)._index.tsx` loader 中查看 `params.lang`，并在 `params.lang` 不是有效语言代码时重定向到 `/:lang/american-flag-speedo` 以获取当前/默认语言。

## Splat Routes

虽然 [dynamic segments][dynamic_segments] 匹配单个路径段（URL 中两个 `/` 之间的部分），但 splat route 会匹配 URL 的其余部分，包括斜杠。

```text lines=[4,6]
 app/
├── routes/
│   ├── _index.tsx
│   ├── $.tsx
│   ├── about.tsx
│   └── files.$.tsx
└── root.tsx
```

| URL                                          | Matched Route            |
| -------------------------------------------- | ------------------------ |
| `/`                                          | `app/routes/_index.tsx`  |
| `/about`                                     | `app/routes/about.tsx`   |
| `/beef/and/cheese`                           | `app/routes/$.tsx`       |
| `/files`                                     | `app/routes/files.$.tsx` |
| `/files/talks/remix-conf_old.pdf`            | `app/routes/files.$.tsx` |
| `/files/talks/remix-conf_final.pdf`          | `app/routes/files.$.tsx` |
| `/files/talks/remix-conf-FINAL-MAY_2022.pdf` | `app/routes/files.$.tsx` |

类似于动态路由参数，您可以通过 splat route 的 `params` 使用 `"*"` 键访问匹配路径的值。

```tsx filename=app/routes/files.$.tsx
export async function loader({
  params,
}: LoaderFunctionArgs) {
  const filePath = params["*"];
  return fake.getFileInfo(filePath);
}
```

## 转义特殊字符

如果您希望 Remix 用于这些路由约定的特殊字符实际上成为 URL 的一部分，可以使用 `[]` 字符转义这些约定。

| 文件名                               | URL                 |
| ----------------------------------- | ------------------- |
| `app/routes/sitemap[.]xml.tsx`      | `/sitemap.xml`      |
| `app/routes/[sitemap.xml].tsx`      | `/sitemap.xml`      |
| `app/routes/weird-url.[_index].tsx` | `/weird-url/_index` |
| `app/routes/dolla-bills-[$].tsx`    | `/dolla-bills-$`    |
| `app/routes/[[so-weird]].tsx`       | `/[so-weird]`       |

## 组织文件夹

路由也可以是包含 `route.tsx` 文件的文件夹，该文件定义了路由模块。文件夹中的其他文件不会成为路由。这使您可以将代码组织得更接近使用它们的路由，而不是在其他文件夹中重复特性名称。

<docs-info>文件夹内的文件对路由路径没有意义，路由路径完全由文件夹名称定义</docs-info>

考虑这些路由：

```text
 app/
├── routes/
│   ├── _landing._index.tsx
│   ├── _landing.about.tsx
│   ├── _landing.tsx
│   ├── app._index.tsx
│   ├── app.projects.tsx
│   ├── app.tsx
│   └── app_.projects.$id.roadmap.tsx
└── root.tsx
```

其中一些或全部可以是包含其自身 `route` 模块的文件夹。

```text
app/
├── routes/
│   ├── _landing._index/
│   │   ├── route.tsx
│   │   └── scroll-experience.tsx
│   ├── _landing.about/
│   │   ├── employee-profile-card.tsx
│   │   ├── get-employee-data.server.ts
│   │   ├── route.tsx
│   │   └── team-photo.jpg
│   ├── _landing/
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   └── route.tsx
│   ├── app._index/
│   │   ├── route.tsx
│   │   └── stats.tsx
│   ├── app.projects/
│   │   ├── get-projects.server.ts
│   │   ├── project-buttons.tsx
│   │   ├── project-card.tsx
│   │   └── route.tsx
│   ├── app/
│   │   ├── footer.tsx
│   │   ├── primary-nav.tsx
│   │   └── route.tsx
│   ├── app_.projects.$id.roadmap/
│   │   ├── chart.tsx
│   │   ├── route.tsx
│   │   └── update-timeline.server.ts
│   └── contact-us.tsx
└── root.tsx
```

请注意，当您将路由模块转换为文件夹时，路由模块变成 `folder/route.tsx`，文件夹中的所有其他模块都不会成为路由。例如：

```
# 这些是相同的路由：
app/routes/app.tsx
app/routes/app/route.tsx

# 这些也是
app/routes/app._index.tsx
app/routes/app._index/route.tsx
```

## 扩展

我们对扩展的总体建议是将每个路由作为一个文件夹，并将仅由该路由使用的模块放入该文件夹中，然后将共享模块放在路由文件夹之外的其他地方。这有几个好处：

- 容易识别共享模块，因此在更改它们时要谨慎
- 方便组织和重构特定路由的模块，而不会造成“文件组织疲劳”并混乱应用程序的其他部分

[loader]: ../route/loader  
[action]: ../route/action  
[outlet_component]: ../components/outlet  
[routing_guide]: ../discussion/routes  
[root_route]: #root-route  
[index_route]: ../discussion/routes#index-routes  
[nested_routing]: ../discussion/routes#what-is-nested-routing  
[nested_routes]: #nested-routes  
[routes_config]: ./vite-config#routes  
[ignoredroutefiles_config]: ./vite-config#ignoredroutefiles  
[dot_delimiters]: #dot-delimiters  
[dynamic_segments]: #dynamic-segments  
[an_awesome_visualization]: https://interactive-remix-routing-v2.netlify.app/  
[flat_routes]: https://github.com/kiliman/remix-flat-routes  
[custom_routes]: https://github.com/jacobparis-insiders/remix-custom-routes  
[json_routes]: https://github.com/brophdawg11/remix-json-routes  
[manual-route-configuration]: ../discussion/routes#manual-route-configuration