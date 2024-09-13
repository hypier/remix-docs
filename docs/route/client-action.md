---
title: 客户端操作
---

# `clientAction`

除了（或替代）你的 [`action`][action]，你可以定义一个将在客户端执行的 `clientAction` 函数。

每个路由都可以定义一个处理变更的 `clientAction` 函数：

```tsx
export const clientAction = async ({
  request,
  params,
  serverAction,
}: ClientActionFunctionArgs) => {
  invalidateClientSideCache();
  const data = await serverAction();
  return data;
};
```

这个函数只在客户端运行，可以通过几种方式使用：

- 对于全客户端路由，替代服务器 `action`
- 通过在变更时使 `clientLoader` 缓存失效来与 `clientLoader` 缓存一起使用
- 促进从 React Router 的迁移

## 参数

### `params`

该函数接收与[`action`][action]相同的[`params`][action-params]参数。

### `request`

此函数接收与[`action`][action]相同的[`request`][action-request]参数。

### `serverAction`

`serverAction` 是一个异步函数，用于对该路由的服务器 `action` 进行 [fetch][fetch] 调用。

另请参见：

- [Client Data Guide][client-data-guide]
- [clientLoader][clientloader]

[action]: ./action
[action-params]: ./loader#params
[action-request]: ./loader#request
[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[client-data-guide]: ../guides/client-data
[clientloader]: ./client-loader