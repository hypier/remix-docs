---
title: 元数据
---

# `meta`

`meta` 导出允许您为应用程序中的每个路由添加元数据 HTML 标签。这些标签对于搜索引擎优化（SEO）和浏览器指令以确定某些行为非常重要。社交媒体网站也可以使用它们来显示您应用程序的丰富预览。

`meta` 函数应返回一个 `MetaDescriptor` 对象的数组。这些对象与 HTML 标签一一对应。因此，这个 meta 函数：

```tsx
export const meta: MetaFunction = () => {
  return [
    { title: "Very cool app | Remix" },
    {
      property: "og:title",
      content: "Very cool app",
    },
    {
      name: "description",
      content: "This app is the best",
    },
  ];
};
```

生成以下 HTML：

```html
<title>Very cool app | Remix</title>
<meta property="og:title" content="Very cool app" />;
<meta name="description" content="This app is the best" />
```

默认情况下，元描述符将在大多数情况下渲染一个 [`<meta>` 标签][meta-element]。两个例外是：

- `{ title }` 渲染一个 `<title>` 标签
- `{ "script:ld+json" }` 渲染一个 `<script type="application/ld+json">` 标签，其值应为可序列化对象，该对象被字符串化并注入到标签中。

```tsx
export const meta: MetaFunction = () => {
  return [
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Remix",
        url: "https://remix.run",
      },
    },
  ];
};
```

元描述符还可以通过将 `tagName` 属性设置为 `"link"` 来渲染一个 [`<link>` 标签][link-element]。这对于与 SEO 相关的 `<link>` 标签，如 `canonical` URL 非常有用。对于样式表和图标等资产链接，您应该使用 [`links` 导出][links]。

```tsx
export const meta: MetaFunction = () => {
  return [
    {
      tagName: "link",
      rel: "canonical",
      href: "https://remix.run",
    },
  ];
};
```

## `meta` 函数参数

### `location`

这是当前路由的 `Location` 对象。这对于在特定路径或查询参数下生成路由标签非常有用。

```tsx
export const meta: MetaFunction = ({ location }) => {
  const searchQuery = new URLSearchParams(
    location.search
  ).get("q");
  return [{ title: `Search results for "${searchQuery}"` }];
};
```

### `matches`

这是当前路由匹配的数组。您可以访问许多内容，特别是来自父级匹配和数据的元信息。

`matches` 的接口类似于 [`useMatches`][use-matches] 的返回值，但每个匹配将包含其 `meta` 函数的输出。这对于 [在路由层次结构中合并元数据][merging-metadata-across-the-route-hierarchy] 非常有用。

### `data`

这是来自您路由的 [`loader`][loader] 的数据。

```tsx
export async function loader({
  params,
}: LoaderFunctionArgs) {
  return json({
    task: await getTask(params.projectId, params.taskId),
  });
}

export const meta: MetaFunction<typeof loader> = ({
  data,
}) => {
  return [{ title: data.task.name }];
};
```

### `params`

路由的 URL 参数。请参阅 [Routing Guide 中的动态段][url-params]。

### `error`

抛出的错误会触发错误边界，并将被传递给 `meta` 函数。这对于生成错误页面的元数据很有用。

```tsx
export const meta: MetaFunction = ({ error }) => {
  return [{ title: error ? "oops!" : "Actual title" }];
};
```

## 从父路由加载器访问数据

除了当前路由的数据外，您通常还希望访问路由层次结构中更高层的路由数据。您可以通过其路由 ID 在 [`matches`][matches] 中查找。

```tsx filename=app/routes/project.$pid.tasks.$tid.tsx
import type { loader as projectDetailsLoader } from "./project.$pid";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  return json({ task: await getTask(params.tid) });
}

export const meta: MetaFunction<
  typeof loader,
  { "routes/project.$pid": typeof projectDetailsLoader }
> = ({ data, matches }) => {
  const project = matches.find(
    (match) => match.id === "routes/project.$pid"
  ).data.project;
  const task = data.task;
  return [{ title: `${project.name}: ${task.name}` }];
};
```

## `meta` 和嵌套路由的注意事项

由于多个嵌套路由同时渲染，因此需要进行一些合并以确定最终渲染的 meta 标签。Remix 让你对这种合并拥有完全的控制，因为没有明显的默认值。

Remix 将采用最后一个匹配的具有 meta 导出的路由并使用它。这使你能够覆盖诸如 `title` 之类的内容，移除父路由添加的 `og:image`，或者保留父路由的所有内容并为子路由添加新的 meta。

当你刚开始接触时，这可能会变得相当棘手。

考虑一个路由，如 `/projects/123`，可能有三个匹配的路由：`app/root.tsx`、`app/routes/projects.tsx` 和 `app/routes/projects.$id.tsx`。这三个路由都可能导出 meta 描述符。

```tsx bad filename=app/root.tsx
export const meta: MetaFunction = () => {
  return [
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1",
    },
    { title: "New Remix App" },
  ];
};
```

```tsx bad filename=app/routes/projects.tsx
export const meta: MetaFunction = () => {
  return [{ title: "Projects" }];
};
```

```tsx bad filename=app/routes/projects.$id.tsx
export const meta: MetaFunction<typeof loader> = ({
  data,
}) => {
  return [{ title: data.project.name }];
};
```

使用这段代码，我们将在 `/projects` 和 `/projects/123` 失去 `viewport` meta 标签，因为只使用最后一个 meta，并且代码没有与父路由合并。

### 全局 `meta`

几乎每个应用都有全局 meta，比如 `viewport` 和 `charSet`。我们建议在 [root route][root-route] 中使用普通的 [`<meta>` 标签][meta-element]，而不是 `meta` 导出，这样您就不必处理合并的问题：

```tsx filename=app/root.tsx lines=[12-16]
import {
  Links,
  Meta,
  Outlet,
  Scripts,
} from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
```

### 避免在父路由中使用 `meta`

您也可以通过简单地不从父路由导出要覆盖的 `meta` 来避免合并问题。与其在父路由上定义 `meta`，不如使用 [index route][index-route]。这样，您可以避免像标题这样的复杂合并逻辑。否则，您需要找到父级标题描述符并用子级标题替换它。通过使用索引路由，简单地不需要覆盖要容易得多。

### 与父级 `meta` 合并

通常，您只需将 `meta` 添加到父级已经定义的内容中。您可以使用扩展运算符和 [`matches`][matches] 参数将父级 `meta` 合并：

```tsx
export const meta: MetaFunction = ({ matches }) => {
  const parentMeta = matches.flatMap(
    (match) => match.meta ?? []
  );
  return [...parentMeta, { title: "Projects" }];
};
```

请注意，这 _不会_ 覆盖像 `title` 这样的内容。这只是添加。如果继承的路由 meta 包含 `title` 标签，您可以使用 [`Array.prototype.filter`][array-filter] 进行覆盖：

```tsx
export const meta: MetaFunction = ({ matches }) => {
  const parentMeta = matches
    .flatMap((match) => match.meta ?? [])
    .filter((meta) => !("title" in meta));
  return [...parentMeta, { title: "Projects" }];
};
```

### `meta` 合并助手

如果您无法避免与全局 meta 或索引路由的合并问题，我们创建了一个助手，您可以将其放入您的应用中，以便轻松覆盖和附加到父级 meta。

- [查看 `merge-meta.ts` 的 Gist][merge-meta]

[meta-element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
[link-element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link
[links]: ./links
[use-matches]: ../hooks/use-matches
[merging-metadata-across-the-route-hierarchy]: #merging-with-parent-meta
[loader]: ./loader
[url-params]: ../file-conventions/routes#dynamic-segments
[matches]: #matches
[root-route]: ../file-conventions/root
[index-route]: ../discussion/routes#index-routes
[array-filter]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
[merge-meta]: https://gist.github.com/ryanflorence/ec1849c6d690cfbffcb408ecd633e069