---
title: 客户数据
---

# 客户端数据

Remix 在 [`v2.4.0`][2.4.0] 中引入了对“客户端数据”的支持 ([RFC][rfc])，允许您通过路由中的 [`clientLoader`][clientloader]/[`clientAction`][clientaction] 导出选择在浏览器中运行路由加载器/操作。

这些新的导出功能有点像锋利的刀具，不建议作为您的 _主要_ 数据加载/提交机制 - 而是为您提供一个杠杆，以便处理以下一些高级用例：

- **跳过跳转：** 直接从浏览器查询数据 API，仅使用加载器进行 SSR
- **全栈状态：** 用客户端数据增强服务器数据，以获取完整的加载器数据集
- **选择其一：** 有时使用服务器加载器，有时使用客户端加载器，但在一个路由上不同时使用两者
- **客户端缓存：** 在客户端缓存服务器加载器数据，避免一些服务器调用
- **迁移：** 使您从 React Router -> Remix SPA -> Remix SSR 的迁移变得更加轻松（当 Remix 支持 [SPA 模式][rfc-spa] 时）

请谨慎使用这些新的导出功能！如果不小心 - 则很容易使您的 UI不同步。Remix 开箱即用非常努力确保这种情况不会发生 - 但一旦您控制了自己的客户端缓存，并可能阻止 Remix 执行其正常的服务器 `fetch` 调用 - 那么 Remix 就无法保证您的 UI 保持同步。

## 跳过 Remix 服务器

在使用 Remix 的 [BFF][bff] 架构时，跳过 Remix 服务器并直接访问后端 API 可能是有利的。这假设您能够相应地处理身份验证，并且不受 CORS 问题的影响。您可以按如下方式跳过 Remix BFF 跳转：

1. 在文档加载时从服务器 `loader` 加载数据
2. 在所有后续加载中从 `clientLoader` 加载数据

在这种情况下，Remix _不会_ 在水合时调用 `clientLoader`，并且只会在后续导航时调用它。

```tsx lines=[8,15]
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const data = await fetchApiFromServer({ request }); // (1)
  return json(data);
}

export async function clientLoader({
  request,
}: ClientLoaderFunctionArgs) {
  const data = await fetchApiFromClient({ request }); // (2)
  return data;
}
```

## 全栈状态

有时，您可能希望利用“全栈状态”，其中一些数据来自服务器，一些数据来自浏览器（即 `IndexedDB` 或其他浏览器 SDK）——但在您拥有完整的数据集之前，无法渲染组件。您可以按如下方式结合这两个数据源：

1. 在文档加载时从服务器 `loader` 加载部分数据
2. 导出一个 [`HydrateFallback`][hydratefallback] 组件以在 SSR 期间渲染，因为我们还没有完整的数据集
3. 设置 `clientLoader.hydrate = true`，这指示 Remix 在初始文档水合过程中调用 clientLoader
4. 在 `clientLoader` 中将服务器数据与客户端数据结合

```tsx lines=[8-10,23-24,27,30]
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const partialData = await getPartialDataFromDb({
    request,
  }); // (1)
  return json(partialData);
}

export async function clientLoader({
  request,
  serverLoader,
}: ClientLoaderFunctionArgs) {
  const [serverData, clientData] = await Promise.all([
    serverLoader(),
    getClientData(request),
  ]);
  return {
    ...serverData, // (4)
    ...clientData, // (4)
  };
}
clientLoader.hydrate = true; // (3)

export function HydrateFallback() {
  return <p>Skeleton rendered during SSR</p>; // (2)
}

export default function Component() {
  // This will always be the combined set of server + client data
  const data = useLoaderData();
  return <>...</>;
}
```

## 一个或另一个

您可能希望在应用程序中混合使用数据加载策略，使得某些路由仅在服务器上加载数据，而某些路由仅在客户端加载数据。您可以按路由选择如下：

1. 当您想使用服务器数据时，导出一个 `loader`
2. 当您想使用客户端数据时，导出 `clientLoader` 和 `HydrateFallback`

仅依赖于服务器加载器的路由如下所示：

```tsx filename=app/routes/server-data-route.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const data = await getServerData(request);
  return json(data);
}

export default function Component() {
  const data = useLoaderData(); // (1) - server data
  return <>...</>;
}
```

仅依赖于客户端加载器的路由如下所示。

```tsx filename=app/routes/client-data-route.tsx
import type { ClientLoaderFunctionArgs } from "@remix-run/react";

export async function clientLoader({
  request,
}: ClientLoaderFunctionArgs) {
  const clientData = await getClientData(request);
  return clientData;
}
// 注意：您不必显式设置此项 - 如果没有 `loader`，则隐含为 true
clientLoader.hydrate = true;

// (2)
export function HydrateFallback() {
  return <p>在服务器端渲染期间渲染的骨架</p>;
}

export default function Component() {
  const data = useLoaderData(); // (2) - client data
  return <>...</>;
}
```

## 客户端缓存

您可以利用客户端缓存（内存、本地存储等）来绕过某些对服务器的调用，如下所示：

1. 在文档加载时从服务器加载数据 `loader`
2. 设置 `clientLoader.hydrate = true` 以预热缓存
3. 通过 `clientLoader` 从缓存加载后续导航
4. 在您的 `clientAction` 中使缓存失效

请注意，由于我们没有导出 `HydrateFallback` 组件，我们将对路由组件进行 SSR，然后在水合时运行 `clientLoader`，因此您的 `loader` 和 `clientLoader` 在初始加载时返回相同的数据以避免水合错误是很重要的。

```tsx lines=[14,36,42,49,56]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import type {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const data = await getDataFromDb({ request }); // (1)
  return json(data);
}

export async function action({
  request,
}: ActionFunctionArgs) {
  await saveDataToDb({ request });
  return json({ ok: true });
}

let isInitialRequest = true;

export async function clientLoader({
  request,
  serverLoader,
}: ClientLoaderFunctionArgs) {
  const cacheKey = generateKey(request);

  if (isInitialRequest) {
    isInitialRequest = false;
    const serverData = await serverLoader();
    cache.set(cacheKey, serverData); // (2)
    return serverData;
  }

  const cachedData = await cache.get(cacheKey);
  if (cachedData) {
    return cachedData; // (3)
  }

  const serverData = await serverLoader();
  cache.set(cacheKey, serverData);
  return serverData;
}
clientLoader.hydrate = true; // (2)

export async function clientAction({
  request,
  serverAction,
}: ClientActionFunctionArgs) {
  const cacheKey = generateKey(request);
  cache.delete(cacheKey); // (4)
  const serverData = await serverAction();
  return serverData;
}
```

## 迁移

我们预计在 [SPA 模式][rfc-spa] 正式发布后会撰写一份单独的迁移指南，但目前我们预计过程将类似于：

1. 通过迁移到 `createBrowserRouter`/`RouterProvider` 在您的 React Router SPA 中引入数据模式
2. 将您的 SPA 迁移到 Vite，以更好地为 Remix 迁移做准备
3. 通过使用 Vite 插件（尚未提供）逐步迁移到基于文件的路由定义
4. 将您的 React Router SPA 迁移到 Remix SPA 模式，在该模式下，所有当前基于文件的 `loader` 函数都作为 `clientLoader` 使用
5. 选择退出 Remix SPA 模式（并进入 Remix SSR 模式），并查找/替换您的 `loader` 函数为 `clientLoader`
   - 您现在正在运行一个 SSR 应用，但所有的数据加载仍然通过 `clientLoader` 在客户端进行
6. 逐步开始将 `clientLoader -> loader` 迁移，以开始将数据加载转移到服务器

[rfc]: https://github.com/remix-run/remix/discussions/7634  
[2.4.0]: https://github.com/remix-run/remix/blob/main/CHANGELOG.md#v240  
[clientloader]: ../route/client-loader  
[clientaction]: ../route/client-action  
[hydratefallback]: ../route/hydrate-fallback  
[rfc-spa]: https://github.com/remix-run/remix/discussions/7638  
[bff]: ../guides/bff