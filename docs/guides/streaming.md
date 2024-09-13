---
title: 流媒体
description: 何时、为何以及如何使用 React 18 和 Remix 的延迟 API 进行流媒体。
---

# 流媒体

流媒体使您能够通过在内容可用时立即交付内容来增强用户体验，而不是等待页面的全部内容准备好。

确保您的托管服务提供商支持流媒体，并不是所有提供商都支持。如果您的响应似乎没有流式传输，这可能是原因所在。

## 步骤

流式数据有三个步骤：

1. **项目设置：** 我们需要确保我们的客户端和服务器入口点已设置为支持流式传输
2. **组件设置：** 我们需要确保我们的组件能够渲染流式数据
3. **延迟加载数据：** 最后，我们可以在加载器中延迟数据

## 1. 项目设置

**从一开始就准备好：** 使用起始模板创建的 Remix 应用程序已预配置为支持流式传输。

**需要手动设置吗？** 如果您的项目是从头开始或使用旧模板创建的，请验证 `entry.server.tsx` 和 `entry.client.tsx` 是否支持流式传输。如果您没有看到这些文件，则表示您正在使用默认设置，并且支持流式传输。如果您创建了自己的条目，以下是供您参考的模板默认值：

- [entry.client.tsx][entry_client_tsx]
- entry.server.tsx：
  - [cloudflare][entry_server_cloudflare_tsx]
  - [deno][entry_server_deno_tsx]
  - [node][entry_server_node_tsx]

## 2. 组件设置

一个没有流式传输的路由模块可能看起来像这样：

```tsx
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  const [product, reviews] = await Promise.all([
    db.getProduct(params.productId),
    db.getReviews(params.productId),
  ]);

  return json({ product, reviews });
}

export default function Product() {
  const { product, reviews } =
    useLoaderData<typeof loader>();
  return (
    <>
      <ProductPage data={product} />
      <ProductReviews data={reviews} />
    </>
  );
}
```

为了渲染流式数据，您需要使用 React 的 [`<Suspense>`][suspense_component] 和 Remix 的 [`<Await>`][await_component]。这有点样板代码，但很简单：

```tsx lines=[3-4,20-24]
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import { ReviewsSkeleton } from "./reviews-skeleton";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  // existing code
}

export default function Product() {
  const { product, reviews } =
    useLoaderData<typeof loader>();
  return (
    <>
      <ProductPage data={product} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Await resolve={reviews}>
          {(reviews) => <ProductReviews data={reviews} />}
        </Await>
      </Suspense>
    </>
  );
}
```

这段代码即使在我们开始延迟数据之前也会继续工作。首先编写组件代码是个好主意。如果遇到问题，更容易追踪问题所在。

## 3. 在加载器中延迟数据

现在我们的项目和路由组件已经设置好流数据，我们可以开始在加载器中延迟数据。我们将使用 Remix 的 [`defer`][defer] 工具来实现这一点。

请注意 async promise 代码的变化。

```tsx lines=[2,11-19]
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { defer } from "@remix-run/node"; // or cloudflare/deno
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import { ReviewsSkeleton } from "./reviews-skeleton";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  // 👇 注意这个 promise 没有被等待
  const reviewsPromise = db.getReviews(params.productId);
  // 👇 但是这个是被等待的
  const product = await db.getProduct(params.productId);

  return defer({
    product,
    reviews: reviewsPromise,
  });
}

export default function Product() {
  const { product, reviews } =
    useLoaderData<typeof loader>();
  // existing code
}
```

我们没有等待 reviews promise，而是将其传递给 `defer`。这告诉 Remix 将该 promise 流式传输到浏览器。

就这样！您现在应该正在将数据流式传输到浏览器。

## 避免低效的流式处理

在等待其他任何承诺之前，重要的是要为延迟数据提前发起承诺，否则您将无法充分利用流式处理。请注意与以下低效代码示例的区别：

```tsx bad
export async function loader({
  params,
}: LoaderFunctionArgs) {
  const product = await db.getProduct(params.productId);
  // 👇 这不会在 `product` 完成之前开始加载
  const reviewsPromise = db.getReviews(params.productId);

  return defer({
    product,
    reviews: reviewsPromise,
  });
}
```

## 处理服务器超时

在使用 `defer` 进行流式传输时，您可以通过 `<RemixServer abortDelay>` 属性告诉 Remix 在超时之前等待延迟数据解析的时间（默认为 5 秒），该属性在您的 `entry.server.tsx` 文件中。如果您当前没有 `entry.server.tsx` 文件，可以通过 `npx remix reveal entry.server` 来暴露它。您还可以使用此值通过 `setTimeout` 来中止 React 的 `renderToPipeableStream` 方法。

```tsx filename=entry.server.tsx lines=[1,9,16]
const ABORT_DELAY = 5_000;

// ...

const { pipe, abort } = renderToPipeableStream(
  <RemixServer
    context={remixContext}
    url={request.url}
    abortDelay={ABORT_DELAY}
  />
  // ...
);

// ...

setTimeout(abort, ABORT_DELAY);
```

## 使用内容安全策略进行流媒体传输

流媒体通过在DOM中插入脚本标签来工作，随着延迟的承诺被解析。如果您的页面包含用于脚本的[内容安全策略][csp]，您需要通过在`Content-Security-Policy`头中包含`script-src 'self' 'unsafe-inline'`来削弱安全策略，或者为所有脚本标签添加nonce。

如果您使用nonce，它需要在三个地方包含：

- 在`Content-Security-Policy`头中，如下所示：`Content-Security-Policy: script-src 'nonce-secretnoncevalue'`
- 在`<Scripts />`、`<ScrollRestoration />`和`<LiveReload />`组件中，如下所示：`<Scripts nonce="secretnoncevalue" />`
- 在`entry.server.ts`中调用`renderToPipeableStream`的地方，如下所示：

```tsx filename=entry.server.tsx
const { pipe, abort } = renderToPipeableStream(
  <RemixServer
    context={remixContext}
    url={request.url}
    abortDelay={ABORT_DELAY}
  />,
  {
    nonce: "secretnoncevalue",
    /* ...remaining fields */
  }
);
```

这将确保nonce值包含在任何延迟的脚本标签中。

[entry_client_tsx]: https://github.com/remix-run/remix/blob/dev/packages/remix-dev/config/defaults/entry.client.tsx
[entry_server_cloudflare_tsx]: https://github.com/remix-run/remix/blob/dev/packages/remix-dev/config/defaults/entry.server.cloudflare.tsx
[entry_server_deno_tsx]: https://github.com/remix-run/remix/blob/dev/packages/remix-dev/config/defaults/entry.server.deno.tsx
[entry_server_node_tsx]: https://github.com/remix-run/remix/blob/dev/packages/remix-dev/config/defaults/entry.server.node.tsx
[suspense_component]: https://react.dev/reference/react/Suspense
[await_component]: ../components/await
[defer]: ../utils/defer
[csp]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src