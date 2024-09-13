---
title: clientLoader
---

# `clientLoader`

除了（或替代）您的 [`loader`][loader]，您可以定义一个将在客户端执行的 `clientLoader` 函数。

每个路由可以定义一个 `clientLoader` 函数，在渲染时为该路由提供数据：

```tsx
export const clientLoader = async ({
  request,
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  // call the server loader
  const serverData = await serverLoader();
  // And/or fetch data on the client
  const data = getDataFromClient();
  // Return the data to expose through useLoaderData()
  return data;
};
```

此函数仅在客户端运行，并可以以几种方式使用：

- 作为全客户端路由的服务器 `loader` 的替代
- 通过在变更时使缓存失效，配合使用 `clientLoader` 缓存
  - 维护客户端缓存以跳过对服务器的调用
  - 跳过 Remix [BFF][bff] 跳转，直接从客户端访问您的 API
- 进一步增强从服务器加载的数据
  - 即，从 `localStorage` 加载用户特定的偏好设置
- 促进从 React Router 的迁移

## 水合行为

默认情况下，`clientLoader` **不会** 在初始 SSR 文档请求期间为您的 Remix 应用程序的路由执行。这是主要（且更简单）的用例，其中 `clientLoader` 不会改变服务器 `loader` 数据的结构，仅仅是在后续客户端导航中的一种优化（从缓存读取或直接访问 API）。

```tsx
export async function loader() {
  // During SSR, we talk to the DB directly
  const data = getServerDataFromDb();
  return json(data);
}

export async function clientLoader() {
  // During client-side navigations, we hit our exposed API endpoints directly
  const data = await fetchDataFromApi();
  return data;
}

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return <>...</>;
}
```

### `clientLoader.hydrate`

如果您需要在初始文档请求时运行 `clientLoader` 进行水合，可以通过设置 `clientLoader.hydrate=true` 来选择加入。这将告诉 Remix 需要在水合时运行 `clientLoader`。如果没有 `HydrateFallback`，您的路由组件将使用服务器的 `loader` 数据进行 SSR，然后 `clientLoader` 将运行，并且返回的数据将在水合的路由组件中就地更新。

<docs-info>如果一个路由导出了 `clientLoader` 而没有导出服务器 `loader`，则 `clientLoader.hydrate` 会自动被视为 `true`，因为没有服务器数据可供 SSR。因此，我们始终需要在渲染路由组件之前，在水合时运行 `clientLoader`。</docs-info>

### HydrateFallback

如果您需要在服务器端渲染（SSR）期间避免渲染默认路由组件，因为您有数据必须来自 `clientLoader`，您可以从路由中导出一个 [`HydrateFallback`][hydratefallback] 组件，该组件将在 SSR 期间渲染，只有在 `clientLoader` 在水合时运行后，您的路由组件才会被渲染。

## 参数

### `params`

此函数接收与 [`loader`][loader] 相同的 [`params`][loader-params] 参数。

### `request`

此函数接收与 [`loader`][loader] 相同的 [`request`][loader-request] 参数。

### `serverLoader`

`serverLoader` 是一个异步函数，用于从该路由的服务器 `loader` 获取数据。在客户端导航时，这将向 Remix 服务器 `loader` 发起一个 [fetch][fetch] 调用。如果您选择在水合时运行您的 `clientLoader`，那么此函数将返回已在服务器上加载的数据（通过 `Promise.resolve`）。

另请参见：

- [Client Data Guide][client-data-guide]
- [HydrateFallback][hydratefallback]
- [clientAction][clientaction]

[loader]: ./loader
[loader-params]: ./loader#params
[loader-request]: ./loader#request
[clientaction]: ./client-action
[hydratefallback]: ./hydrate-fallback
[bff]: ../guides/bff
[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[client-data-guide]: ../guides/client-data