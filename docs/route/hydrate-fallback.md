---
title: HydrateFallback
---

# `HydrateFallback`

`HydrateFallback` 组件是您通知 Remix 在 _clientLoader_ 在水合后运行之前不想渲染路由组件的一种方式。当导出时，Remix 将在 SSR 中渲染后备内容，而不是默认的路由组件，并将在 _clientLoader_ 完成后在客户端渲染路由组件。

最常见的用例是仅限客户端的路由（例如浏览器中的画布游戏）和用客户端数据增强服务器数据（例如保存的用户偏好）。

```tsx filename=routes/client-only-route.tsx
export async function clientLoader() {
  const data = await loadSavedGameOrPrepareNewGame();
  return data;
}
// 注意 clientLoader.hydrate 在没有服务器加载器的情况下是隐含的

export function HydrateFallback() {
  return <p>加载游戏中...</p>;
}

export default function Component() {
  const data = useLoaderData<typeof clientLoader>();
  return <Game data={data} />;
}
```

```tsx filename=routes/augmenting-server-data.tsx
export async function loader() {
  const data = getServerData();
  return json(data);
}

export async function clientLoader({
  request,
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) {
  const [serverData, preferences] = await Promise.all([
    serverLoader(),
    getUserPreferences(),
  ]);
  return {
    ...serverData,
    preferences,
  };
}
clientLoader.hydrate = true;

export function HydrateFallback() {
  return <p>加载用户偏好中...</p>;
}

export default function Component() {
  const data = useLoaderData<typeof clientLoader>();
  if (data.preferences.display === "list") {
    return <ListView items={data.items} />;
  } else {
    return <GridView items={data.items} />;
  }
}
```

关于 `HydrateFallback` 的行为，有几个值得注意的细节：

- 它仅在初始文档请求和水合时相关，而不会在任何后续的客户端导航中渲染
- 当您在给定路由上设置 [`clientLoader.hydrate=true`][hydrate-true] 时，它才相关
- 如果您确实有一个没有服务器 `loader` 的 `clientLoader`，这也很相关，因为这意味着 `clientLoader.hydrate=true`，因为否则从 `useLoaderData` 返回的根本没有加载器数据
  - 即使您在这种情况下不指定 `HydrateFallback`，Remix 也不会渲染您的路由组件，并会向上冒泡到任何祖先的 `HydrateFallback` 组件
  - 这是为了确保 `useLoaderData` 保持“快乐路径”
  - 如果没有服务器 `loader`，在任何渲染的路由组件中，`useLoaderData` 将返回 `undefined`
- 您不能在 `HydrateFallback` 中渲染 `<Outlet/>`，因为子路由无法保证正确操作，因为它们的祖先加载器数据可能尚不可用，如果它们在水合时运行 `clientLoader` 函数（即，使用案例如 `useRouteLoaderData()` 或 `useMatches()`）

另请参阅：

- [clientLoader][clientloader]

[hydrate-true]: ./client-loader#clientloaderhydrate
[clientloader]: ./client-loader