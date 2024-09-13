---
title: 应该重新验证
---

# `shouldRevalidate`

此函数允许应用程序优化在操作后和客户端导航时哪些路由的数据应该重新加载。

```tsx
import type { ShouldRevalidateFunction } from "@remix-run/react";

export const shouldRevalidate: ShouldRevalidateFunction = ({
  actionResult,
  currentParams,
  currentUrl,
  defaultShouldRevalidate,
  formAction,
  formData,
  formEncType,
  formMethod,
  nextParams,
  nextUrl,
}) => {
  return true;
};
```

<docs-warning>此功能是<i>额外的</i>优化。一般来说，Remix 的设计已经优化了需要调用的加载器及其时机。当您使用此功能时，您的 UI 可能会与服务器不同步。请谨慎使用！</docs-warning>

在客户端过渡期间，Remix 将优化已经在渲染的路由的重新加载，例如不重新加载未更改的布局路由。在其他情况下，比如表单提交或搜索参数更改，Remix 不知道哪些路由需要重新加载，因此它会安全地重新加载所有路由。这确保您的 UI 始终与服务器上的状态保持同步。

此函数允许应用程序通过在 Remix 即将重新加载路由时返回 `false` 来进一步优化。如果您在路由模块上定义此函数，Remix 将在每次导航和每次操作调用后的重新验证中遵循您的函数。同样，如果您做错了，这可能会导致您的 UI 与服务器不同步，因此请小心。

`fetcher.load` 调用也会重新验证，但由于它们加载特定的 URL，因此无需担心路由参数或 URL 搜索参数的重新验证。`fetcher.load` 默认仅在操作提交后和通过 [`useRevalidator`][userevalidator] 的显式重新验证请求后进行重新验证。

## `actionResult`

当提交导致重新验证时，这将是操作的结果——无论是操作数据还是操作失败时的错误。通常会在操作结果中包含一些信息，以指示 `shouldRevalidate` 是否需要重新验证。

```tsx
export async function action() {
  await saveSomeStuff();
  return { ok: true };
}

export function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate,
}) {
  if (actionResult?.ok) {
    return false;
  }
  return defaultShouldRevalidate;
}
```

## `defaultShouldRevalidate`

默认情况下，Remix 并不会每次都调用所有的 loader。它可以通过默认设置进行可靠的优化。例如，只有参数发生变化的 loader 才会被调用。考虑从以下 URL 导航到下面的 URL：

- `/projects/123/tasks/abc`
- `/projects/123/tasks/def`

Remix 只会调用 `tasks/def` 的 loader，因为 `projects/123` 的参数没有变化。

在完成了返回 `false` 的特定优化后，始终返回 `defaultShouldRevalidate` 是最安全的，否则你的 UI 可能会与服务器上的数据不同步。

```tsx
export function shouldRevalidate({
  defaultShouldRevalidate,
}) {
  if (whateverConditionsYouCareAbout) {
    return false;
  }

  return defaultShouldRevalidate;
}
```

这更危险，但 YOLO：

```tsx
export function shouldRevalidate() {
  return whateverConditionsYouCareAbout;
}
```

## `currentParams`

这些是来自 URL 的 [URL params][url-params]，可以与 `nextParams` 进行比较，以决定是否需要重新加载。也许您只使用参数的部分内容进行数据加载，如果参数的多余部分发生了变化，则不需要重新验证。

例如，考虑一个带有 ID 和人类友好标题的事件 slug：

- `/events/blink-182-united-center-saint-paul--ae3f9`
- `/events/blink-182-little-caesars-arena-detroit--e87ad`

```tsx filename=app/routes/events.$slug.tsx
export async function loader({
  params,
}: LoaderFunctionArgs) {
  const id = params.slug.split("--")[1];
  return loadEvent(id);
}

export function shouldRevalidate({
  currentParams,
  nextParams,
  defaultShouldRevalidate,
}) {
  const currentId = currentParams.slug.split("--")[1];
  const nextId = nextParams.slug.split("--")[1];
  if (currentId === nextId) {
    return false;
  }

  return defaultShouldRevalidate;
}
```

## `currentUrl`

这是导航开始时的 URL。

## `nextParams`

在导航的情况下，这些是用户请求的下一个位置的 [URL 参数][url-params]。某些重新验证并不是导航，因此它将与 `currentParams` 相同。

## `nextUrl`

在导航的情况下，这是用户请求的 URL。一些重新验证并不是导航，因此它将与 `currentUrl` 完全相同。

## `formMethod`

触发重新验证的表单提交使用的方法（可能是 `"GET"` 或 `"POST"`）。

## `formAction`

触发重新验证的表单动作（`<Form action="/somewhere">`）。

## `formData`

触发重新验证的表单提交的数据。

## 用例

### 永不重新加载根

根加载器返回的数据显示通常不会改变，例如要发送到客户端应用的环境变量。在这些情况下，您不需要再次调用根加载器。对于这种情况，您可以简单地 `return false`。

```tsx lines=[10]
export const loader = async () => {
  return json({
    ENV: {
      CLOUDINARY_ACCT: process.env.CLOUDINARY_ACCT,
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    },
  });
};

export const shouldRevalidate = () => false;
```

有了这个设置，Remix 将不再因任何原因向您的根加载器发出请求，无论是表单提交后，还是搜索参数更改后，等等。

### 忽略搜索参数

另一个常见的情况是，当你有嵌套路由，并且子组件有一个功能使用 URL 中的搜索参数，例如搜索页面或一些你希望保留在搜索参数中的状态的选项卡。

考虑这些路由：

```
├── $projectId.tsx
└── $projectId.activity.tsx
```

假设用户界面看起来像这样：

```
+------------------------------+
|    项目: 设计改版            |
+------------------------------+
|  任务 | 合作 | >活动        |
+------------------------------+
|  搜索: _____________       |
|                              |
|  - Ryan 添加了一张图片      |
|                              |
|  - Michael 评论了          |
|                              |
+------------------------------+
```

`$projectId.activity.tsx` 的加载器可以使用搜索参数来过滤列表，因此访问像 `/projects/design-revamp/activity?search=image` 的 URL 可以过滤结果列表。也许看起来像这样：

```tsx filename=app/routes/$projectId.activity.tsx lines=[11]
export async function loader({
  params,
  request,
}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  return json(
    await exampleDb.activity.findAll({
      where: {
        projectId: params.projectId,
        name: {
          contains: url.searchParams.get("search"),
        },
      },
    })
  );
}
```

这对于活动路由来说很好，但 Remix 并不知道父加载器 `$projectId.tsx` _也_ 是否关心搜索参数。这就是为什么 Remix 采取最安全的做法，当搜索参数改变时重新加载页面上的所有路由。

在这个用户界面中，这对用户、你的服务器和你的数据库来说都是浪费带宽，因为 `$projectId.tsx` 并不使用搜索参数。考虑到我们 `$projectId.tsx` 的加载器看起来像这样：

```tsx filename=app/routes/$projectId.tsx
export async function loader({
  params,
}: LoaderFunctionArgs) {
  const data = await fakedb.findProject(params.projectId);
  return json(data);
}
```

有很多方法可以做到这一点，应用中的其余代码也很重要，但理想情况下，你不应该考虑你试图优化的用户界面（搜索参数的变化），而是查看你的加载器关心的值。在我们的例子中，它只关心 projectId，因此我们可以检查两件事：

- 参数是否保持不变？
- 是不是 `GET` 而不是变更？

如果参数没有改变，并且我们没有进行 `POST`，那么我们知道我们的加载器将返回与上次相同的数据，因此当子路由更改搜索参数时，我们可以选择不进行重新验证。

```tsx filename=app/routes/$projectId.tsx
export function shouldRevalidate({
  currentParams,
  nextParams,
  formMethod,
  defaultShouldRevalidate,
}) {
  if (
    formMethod === "GET" &&
    currentParams.projectId === nextParams.projectId
  ) {
    return false;
  }

  return defaultShouldRevalidate;
}
```

[url-params]: ../file-conventions/routes#dynamic-segments
[userevalidator]: ../hooks/use-revalidator