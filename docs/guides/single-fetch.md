---
title: 单次获取
---

# 单次获取

<docs-warning>这是一个不稳定的 API，将会持续变化，请勿在生产环境中使用</docs-warning>

单次获取是一种新的数据加载策略和流格式。当您启用单次获取时，Remix 将在客户端过渡时向您的服务器发出一次 HTTP 调用，而不是并行发出多个 HTTP 调用（每个加载器一个）。此外，单次获取还允许您从 `loader` 和 `action` 发送裸对象，例如 `Date`、`Error`、`Promise`、`RegExp` 等。

## 概述

Remix 引入了对“单次获取”（[RFC][rfc]）的支持，该功能在 [`v2.9.0`][2.9.0] 中通过 [`future.unstable_singleFetch`][future-flags] 标志启用，允许您选择此行为。单次获取将在 [React Router v7][merging-remix-and-rr] 中成为默认设置。

启用单次获取旨在减少前期工作量，然后允许您随着时间的推移逐步采用所有重大更改。您可以通过应用所需的最小更改来 [启用单次获取][start]，然后使用 [迁移指南][migration-guide] 在您的应用程序中进行增量更改，以确保顺利且不破坏性的升级到 [React Router v7][merging-remix-and-rr]。

请还查看 [重大更改][breaking-changes]，以便了解一些基础行为的变化，特别是在序列化和状态/头部行为方面。

## 启用单次获取

**1. 启用未来标志**

```ts filename=vite.config.ts lines=[6]
export default defineConfig({
  plugins: [
    remix({
      future: {
        // ...
        unstable_singleFetch: true,
      },
    }),
    // ...
  ],
});
```

**2. 不推荐使用的 `fetch` polyfill**

单次获取需要使用 [`undici`][undici] 作为你的 `fetch` polyfill，或者在 Node 20+ 中使用内置的 `fetch`，因为它依赖于在 `@remix-run/web-fetch` polyfill 中没有的可用 API。有关更多详细信息，请参阅下面 2.9.0 版本说明中的 [Undici][undici-polyfill] 部分。

- 如果你使用 Node 20+，请移除对 `installGlobals()` 的任何调用，并使用 Node 的内置 `fetch`（这与 `undici` 是相同的）。

- 如果你正在管理自己的服务器并调用 `installGlobals()`，你需要调用 `installGlobals({ nativeFetch: true })` 来使用 `undici`。

  ```diff
  - installGlobals();
  + installGlobals({ nativeFetch: true });
  ```

- 如果你使用 `remix-serve`，在启用单次获取时，它将自动使用 `undici`。

- 如果你在 Remix 项目中使用 miniflare/cloudflare worker，请确保你的 [兼容性标志][compatibility-flag] 设置为 `2023-03-01` 或更高版本。

**3. 调整 `headers` 实现（如有必要）**

启用单次获取后，即使需要运行多个加载器，客户端导航时也只会发出一个请求。为了处理合并被调用处理程序的头部，现在 [`headers`][headers] 导出也将适用于 `loader`/`action` 数据请求。在许多情况下，你已经在文档请求中实现的逻辑应该足够满足你的新单次获取数据请求。

**4. 向 `<RemixServer>` 添加 `nonce`（如果你使用 CSP）**

`<RemixServer>` 组件渲染处理客户端流数据的内联脚本。如果你对脚本有 [内容安全策略][csp] 和 [nonce-sources][csp-nonce]，可以使用 `<RemixServer nonce>` 将 nonce 传递给这些 `<script>` 标签。

**5. 替换 `renderToString`（如果你正在使用它）**

对于大多数 Remix 应用，使用 `renderToString` 的可能性不大，但如果你在 `entry.server.tsx` 中选择使用它，请继续阅读，否则你可以跳过此步骤。

为了在文档和数据请求之间保持一致，`turbo-stream` 也被用作在初始文档请求中发送数据的格式。这意味着一旦选择单次获取，你的应用将不再使用 [`renderToString`][rendertostring]，而必须在 [`entry.server.tsx`][entry-server] 中使用 React 流式渲染器 API，如 [`renderToPipeableStream`][rendertopipeablestream] 或 [`renderToReadableStream`][rendertoreadablestream]。

这并不意味着你必须流式传输 HTTP 响应，你仍然可以通过利用 `renderToPipeableStream` 中的 `onAllReady` 选项，或在 `renderToReadableStream` 中使用 `allReady` promise 一次性发送完整文档。

在客户端，这也意味着你需要将客户端的 [`hydrateRoot`][hydrateroot] 调用包装在 [`startTransition`][starttransition] 调用中，因为流式数据将被包裹在 `Suspense` 边界中。

## 重大变更

引入了几个与单次获取（Single Fetch）相关的重大变更 - 其中一些在启用标志时需要您提前处理，而另一些可以在启用标志后逐步处理。您需要确保在更新到下一个主要版本之前，已处理所有这些变更。

**需要提前解决的变更：**

- **不再支持的 `fetch` polyfill**：旧的 `installGlobals()` polyfill 不适用于单次获取，您必须使用原生 Node 20 `fetch` API，或者在自定义服务器中调用 `installGlobals({ nativeFetch: true })` 以获取 [基于 undici 的 polyfill][undici-polyfill]
- **`headers` 导出应用于数据请求**：[`headers`][headers] 函数现在将同时应用于文档和数据请求

**需要注意的变更，您可能需要逐步处理：**

- **[新的流式数据格式][streaming-format]**：单次获取在底层使用新的流式格式，通过 [`turbo-stream`][turbo-stream]，这意味着我们可以流式传输比 JSON 更复杂的数据
- **不再自动序列化**：从 `loader` 和 `action` 函数返回的裸对象不再自动转换为 JSON `Response`，并按原样序列化通过网络传输
- **类型推断的更新**：为了获得最准确的类型推断，您应该做两件事：
  - 将 `@remix-run/react/future/single-fetch.d.ts` 添加到您的 `tsconfig.json` 的 `compilerOptions.types` 数组的末尾
  - 开始在您的路由中使用 `unstable_defineLoader`/`unstable_defineAction`
    - 这可以逐步完成 - 您当前状态下的类型推断应该是 _大部分_ 准确的
- [**默认的重新验证行为在 GET 导航中更改为选择退出**][revalidation]：正常导航的默认重新验证行为从选择加入更改为选择退出，您的服务器加载器将默认重新运行
- [**选择加入的 `action` 重新验证**][action-revalidation]：在 `action` `4xx`/`5xx` `Response` 之后的重新验证现在为选择加入，而不是选择退出

## 添加单次获取的新路由

启用单次获取后，您可以开始编写利用更强大流式格式的路由。

<docs-info>为了获得正确的类型推断，您首先需要将 `@remix-run/react/future/single-fetch.d.ts` 添加到 `tsconfig.json` 的 `compilerOptions.types` 数组的末尾。您可以在 [类型推断部分][type-inference-section] 中阅读更多相关内容。</docs-info>

使用单次获取，您可以从加载器返回以下数据类型：`BigInt`、`Date`、`Error`、`Map`、`Promise`、`RegExp`、`Set`、`Symbol` 和 `URL`。

```tsx
// routes/blog.$slug.tsx
import { unstable_defineLoader as defineLoader } from "@remix-run/node";

export const loader = defineLoader(async ({ params }) => {
  const { slug } = params;

  const comments = fetchComments(slug);
  const blogData = await fetchBlogData(slug);

  return {
    content: blogData.content, // <- string
    published: blogData.date, // <- Date
    comments, // <- Promise
  };
});

export default function BlogPost() {
  const blogData = useLoaderData<typeof loader>();
  //    ^? { content: string, published: Date, comments: Promise }

  return (
    <>
      <Header published={blogData.date} />
      <BlogContent content={blogData.content} />
      <Suspense fallback={<CommentsSkeleton />}>
        <Await resolve={blogData.comments}>
          {(comments) => (
            <BlogComments comments={comments} />
          )}
        </Await>
      </Suspense>
    </>
  );
}
```

## 使用单次提取迁移路由

如果您当前从加载器中返回 `Response` 实例（即 `json`/`defer`），那么您不需要对应用程序代码进行许多更改即可利用单次提取。

然而，为了更好地准备您未来升级到 [React Router v7][merging-remix-and-rr]，我们建议您开始逐条路由地进行以下更改，因为这是验证更新标题和数据类型不会破坏任何内容的最简单方法。

### 类型推断

在没有 Single Fetch 的情况下，任何从 `loader` 或 `action` 返回的普通 Javascript 对象会自动序列化为 JSON 响应（就像你通过 `json` 返回它一样）。类型推断假设情况是这样的，并将裸对象返回推断为 JSON 序列化的对象。

在使用 Single Fetch 时，裸对象将直接流式传输，因此一旦选择使用 Single Fetch，内置的类型推断就不再准确。例如，它们会假设 `Date` 在客户端会被序列化为字符串 😕。

#### 启用 Single Fetch 类型

要切换到 Single Fetch 类型，你应该 [augment][augment] Remix 的 `Future` 接口，设置 `unstable_singleFetch: true`。
你可以在任何被 `tsconfig.json` > `include` 覆盖的文件中执行此操作。
我们建议你在 `vite.config.ts` 中执行此操作，以便与 Remix 插件中的 `future.unstable_singleFetch` 未来标志保持在一起：

```ts
declare module "@remix-run/server-runtime" {
  interface Future {
    unstable_singleFetch: true;
  }
}
```

现在 `useLoaderData`、`useActionData` 和任何使用 `typeof loader` 泛型的其他工具都应该使用 Single Fetch 类型：

```ts
import { useLoaderData } from "@remix-run/react";

export function loader() {
  return {
    planet: "world",
    date: new Date(),
  };
}

export default function Component() {
  const data = useLoaderData<typeof loader>();
  //    ^? { planet: string, date: Date }
}
```

#### 函数和类实例

一般来说，函数无法可靠地通过网络发送，因此它们会被序列化为 `undefined`：

```ts
import { useLoaderData } from "@remix-run/react";

export function loader() {
  return {
    planet: "world",
    date: new Date(),
    notSoRandom: () => 7,
  };
}

export default function Component() {
  const data = useLoaderData<typeof loader>();
  //    ^? { planet: string, date: Date, notSoRandom: undefined }
}
```

方法也不可序列化，因此类实例会被简化为仅包含其可序列化属性：

```ts
import { useLoaderData } from "@remix-run/react";

class Dog {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  bark() {
    console.log("woof");
  }
}

export function loader() {
  return {
    planet: "world",
    date: new Date(),
    spot: new Dog("Spot", 3),
  };
}

export default function Component() {
  const data = useLoaderData<typeof loader>();
  //    ^? { planet: string, date: Date, spot: { name: string, age: number, bark: undefined } }
}
```

#### `clientLoader` 和 `clientAction`

<docs-warning>确保为 `clientLoader` 参数和 `clientAction` 参数包含类型，因为这就是我们的类型检测客户端数据函数的方式。</docs-warning>

来自客户端加载器和操作的数据从不被序列化，因此这些数据的类型得以保留：

```ts
import {
  useLoaderData,
  type ClientLoaderFunctionArgs,
} from "@remix-run/react";

class Dog {
  /* ... */
}

// 确保为参数注释类型！👇
export function clientLoader(_: ClientLoaderFunctionArgs) {
  return {
    planet: "world",
    date: new Date(),
    notSoRandom: () => 7,
    spot: new Dog("Spot", 3),
  };
}

export default function Component() {
  const data = useLoaderData<typeof clientLoader>();
  //    ^? { planet: string, date: Date, notSoRandom: () => number, spot: Dog }
}
```

### Headers

[`headers`][headers] 函数现在在启用单次获取时用于文档和数据请求。您应该使用该函数来合并并行执行的加载器返回的任何头信息，或返回任何给定的 `actionHeaders`。

### 返回的响应

使用单次获取后，您不再需要返回 `Response` 实例，可以直接通过裸对象返回数据。因此，在使用单次获取时，`json`/`defer` 工具应视为过时。这些工具将在 v2 期间保留，因此您不需要立即将其移除。它们可能会在下一个主要版本中被移除，因此我们建议您在此期间逐步将其移除。

对于 v2，您仍然可以继续返回正常的 `Response` 实例，它们的 `status`/`headers` 将以与文档请求相同的方式生效（通过 `headers()` 函数合并头部）。

随着时间的推移，您应该开始从加载器和操作中消除返回的响应。

- 如果您的 `loader`/`action` 返回 `json`/`defer` 而未设置任何 `status`/`headers`，则可以直接删除对 `json`/`defer` 的调用并直接返回数据
- 如果您的 `loader`/`action` 通过 `json`/`defer` 返回自定义的 `status`/`headers`，则应将其切换为使用新的 [`unstable_data()`][data-utility] 工具。

### 客户端加载器

如果您的应用程序有使用 [`clientLoader`][client-loader] 函数的路由，重要的是要注意单次获取的行为会略有变化。因为 `clientLoader` 旨在为您提供一种选择不调用服务器 `loader` 函数的方法——在单次获取调用中执行该服务器加载器是不正确的。但我们会并行运行所有加载器，我们不想在知道哪些 `clientLoader` 实际上请求服务器数据之前就 _等待_ 进行调用。

例如，考虑以下 `/a/b/c` 路由：

```ts
// routes/a.tsx
export function loader() {
  return { data: "A" };
}

// routes/a.b.tsx
export function loader() {
  return { data: "B" };
}

// routes/a.b.c.tsx
export function loader() {
  return { data: "C" };
}

export function clientLoader({ serverLoader }) {
  await doSomeStuff();
  const data = await serverLoader();
  return { data };
}
```

如果用户从 `/ -> /a/b/c` 导航，那么我们需要为 `a` 和 `b` 运行服务器加载器，并为 `c` 运行 `clientLoader`——这可能最终（或可能不会）调用它自己的服务器 `loader`。当我们想要获取 `a`/`b` 的 `loader` 时，我们无法决定在单次获取调用中包含 `c` 服务器 `loader`，也无法在 `c` 实际进行 `serverLoader` 调用（或返回）之前延迟而不引入瀑布效应。

因此，当您导出一个 `clientLoader` 时，该路由选择退出单次获取，并且当您调用 `serverLoader` 时，它将进行一次单独的获取，仅获取其路由服务器 `loader`。所有未导出 `clientLoader` 的路由将通过单个 HTTP 请求进行获取。

因此，在上述路由设置中，从 `/ -> /a/b/c` 的导航将导致对路由 `a` 和 `b` 进行一次单独的单次获取调用：

```
GET /a/b/c.data?_routes=routes/a,routes/b
```

然后当 `c` 调用 `serverLoader` 时，它将仅为 `c` 服务器 `loader` 发出自己的请求：

```
GET /a/b/c.data?_routes=routes/c
```

### 资源路由

由于 Single Fetch 使用的新 [streaming format][streaming-format]，从 `loader` 和 `action` 函数返回的原始 JavaScript 对象不再通过 `json()` 工具自动转换为 `Response` 实例。相反，在导航数据加载中，它们与其他加载器数据结合，并在 `turbo-stream` 响应中流式传输。

这对 [resource routes][resource-routes] 提出了一个有趣的难题，因为它们的独特之处在于它们旨在单独访问——而不总是通过 Remix API。它们也可以通过任何其他 HTTP 客户端（`fetch`、`cURL` 等）进行访问。

如果资源路由旨在被内部 Remix API 消费，我们 _希望_ 能够利用 `turbo-stream` 编码来解锁流式传输更复杂结构的能力，例如 `Date` 和 `Promise` 实例。然而，当从外部访问时，我们可能更倾向于返回更易于消费的 JSON 结构。因此，如果在 v2 中返回原始对象，其行为略显模糊——它应该通过 `turbo-stream` 还是 `json()` 进行序列化？

为了方便向后兼容并促进 Single Fetch 未来标志的采用，Remix v2 将根据是从 Remix API 访问还是外部访问来处理此问题。在未来，如果您不希望原始对象被流式传输以供外部消费，Remix 将要求您返回自己的 [JSON response][returning-response]。

启用 Single Fetch 的 Remix v2 行为如下：

- 当从 Remix API 访问，例如 `useFetcher` 时，原始 JavaScript 对象将作为 `turbo-stream` 响应返回，类似于正常的加载器和操作（这是因为 `useFetcher` 会将 `.data` 后缀附加到请求上）

- 当从外部工具访问，例如 `fetch` 或 `cURL` 时，我们将继续在 v2 中进行此自动转换为 `json()` 以保持向后兼容性：

  - 当遇到这种情况时，Remix 将记录一个弃用警告
  - 您可以在方便时更新受影响的资源路由处理程序以返回 `Response` 对象
  - 解决这些弃用警告将更好地为您准备即将到来的 Remix v3 升级

  ```tsx filename=app/routes/resource.tsx bad
  export function loader() {
    return {
      message: "My externally-accessed resource route",
    };
  }
  ```

  ```tsx filename=app/routes/resource.tsx good
  export function loader() {
    return Response.json({
      message: "My externally-accessed resource route",
    });
  }
  ```

注意：不建议对需要返回特定 `Response` 实例的外部访问资源路由使用 `defineLoader`/`defineAction`。在这些情况下，最好坚持使用 `loader`/`LoaderFunctionArgs`。

## 其他细节

### 流数据格式

之前，Remix 使用 `JSON.stringify` 将你的 loader/action 数据序列化并传输，并需要实现自定义流格式以支持 `defer` 响应。

使用 Single Fetch 后，Remix 现在在底层使用 [`turbo-stream`][turbo-stream]，它提供了对流的原生支持，并允许你自动序列化/反序列化比 JSON 更复杂的数据。以下数据类型可以通过 `turbo-stream` 直接流式传输：`BigInt`、`Date`、`Error`、`Map`、`Promise`、`RegExp`、`Set`、`Symbol` 和 `URL`。只要在客户端具有全局可用的构造函数，`Error` 的子类型也被支持（例如 `SyntaxError`、`TypeError` 等）。

启用 Single Fetch 后，这可能需要或不需要对你的代码进行任何即时更改：

- ✅ 从 `loader`/`action` 函数返回的 `json` 响应仍然会通过 `JSON.stringify` 进行序列化，因此如果你返回一个 `Date`，你将从 `useLoaderData`/`useActionData` 收到一个 `string`
- ⚠️ 如果你返回一个 `defer` 实例或一个裸对象，它现在将通过 `turbo-stream` 进行序列化，因此如果你返回一个 `Date`，你将从 `useLoaderData`/`useActionData` 收到一个 `Date`
  - 如果你希望保持当前行为（不包括流式 `defer` 响应），你可以将任何现有的裸对象返回包裹在 `json` 中

这也意味着你不再需要使用 `defer` 工具将 `Promise` 实例通过网络发送！你可以在裸对象中的任何位置包含一个 `Promise`，并在 `useLoaderData().whatever` 中获取它。你还可以根据需要嵌套 `Promise`，但要注意潜在的用户体验影响。

一旦采用 Single Fetch，建议你逐步减少在应用程序中使用 `json`/`defer`，以便返回原始对象。

### 流媒体超时

之前，Remix 在默认的 [`entry.server.tsx`][entry-server] 文件中内置了一个 `ABORT_TIMEOUT` 的概念，该概念会终止 React 渲染器，但并没有特别处理任何待处理的延迟承诺的清理。

现在 Remix 在内部进行流媒体处理，我们可以取消 `turbo-stream` 处理并自动拒绝任何待处理的承诺，并将这些错误流式传输到客户端。默认情况下，这发生在 4950ms 之后——这个值被选择为略低于大多数 entry.server.tsx 文件中的当前 5000ms `ABORT_DELAY`——因为我们需要取消承诺并让拒绝在终止 React 相关的内容之前通过 React 渲染器流式传输。

您可以通过从 `entry.server.tsx` 导出一个 `streamTimeout` 数值来控制这一点，Remix 将使用该值作为拒绝 `loader`/`action` 中任何未完成的 Promise 的毫秒数。建议将此值与您中止 React 渲染器的超时解耦——您应该始终将 React 超时设置为更高的值，以便有时间从您的 `streamTimeout` 中流式传输基础拒绝。

```tsx filename=app/entry.server.tsx lines=[1-2,32-33]
// Reject all pending promises from handler functions after 5 seconds
export const streamTimeout = 5000;

// ...

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onShellReady() {
          /* ... */
        },
        onShellError(error: unknown) {
          /* ... */
        },
        onError(error: unknown) {
          /* ... */
        },
      }
    );

    // Automatically timeout the react renderer after 10 seconds
    setTimeout(abort, 10000);
  });
}
```

### 重新验证

#### 正常导航行为

除了更简单的心理模型和文档与数据请求的对齐，单次获取（Single Fetch）还有另一个好处，即更简单（也希望更好）的缓存行为。通常，单次获取将比以前的多次获取行为发出更少的 HTTP 请求，并且希望更频繁地缓存这些结果。

为了减少缓存碎片，单次获取改变了 GET 导航的默认重新验证行为。之前，Remix 不会重新运行重用的祖先路由的加载器，除非您通过 `shouldRevalidate` 选择加入。现在，在简单情况下，Remix _将_ 默认重新运行这些请求，适用于像 `GET /a/b/c.data` 这样的单次获取请求。如果您没有任何 `shouldRevalidate` 或 `clientLoader` 函数，这将是您应用的行为。

在任何活动路由中添加 `shouldRevalidate` 或 `clientLoader` 将触发细粒度的单次获取调用，其中包括一个 `_routes` 参数，指定要运行的路由子集。

如果 `clientLoader` 在内部调用 `serverLoader()`，将会为该特定路由触发一个单独的 HTTP 调用，类似于旧的行为。

例如，如果您在 `/a/b` 并导航到 `/a/b/c`：

- 当不存在 `shouldRevalidate` 或 `clientLoader` 函数时： `GET /a/b/c.data`
- 如果所有路由都有加载器，但 `routes/a` 通过 `shouldRevalidate` 选择退出：
  - `GET /a/b/c.data?_routes=root,routes/b,routes/c`
- 如果所有路由都有加载器，但 `routes/b` 有一个 `clientLoader`：
  - `GET /a/b/c.data?_routes=root,routes/a,routes/c`
  - 然后如果 B 的 `clientLoader` 调用 `serverLoader()`：
    - `GET /a/b/c.data?_routes=routes/b`

如果这种新行为对您的应用不理想，您应该能够通过在所需场景中向父路由添加返回 `false` 的 `shouldRevalidate` 来选择回到不重新验证的旧行为。

另一个选择是利用服务器端缓存来处理昂贵的父加载器计算。

#### 提交重新验证行为

之前，Remix 在 _任何_ 操作提交后总是会重新验证所有活动加载器，而不管操作的结果如何。您可以通过 [`shouldRevalidate`][should-revalidate] 按路由选择退出重新验证。

使用单次获取，如果一个 `action` 返回或抛出一个状态码为 `4xx/5xx` 的 `Response`，Remix 默认 _不重新验证_ 加载器。如果一个 `action` 返回或抛出任何不是 4xx/5xx 的响应，则重新验证行为保持不变。这里的理由是，在大多数情况下，如果您返回一个 `4xx`/`5xx` 的响应，您实际上并没有改变任何数据，因此没有必要重新加载数据。

如果您 _希望_ 在 4xx/5xx 操作响应后继续重新验证一个或多个加载器，可以通过从您的 [`shouldRevalidate`][should-revalidate] 函数返回 `true` 按路由选择加入重新验证。还有一个新的 `actionStatus` 参数被传递给该函数，如果您需要根据操作状态代码进行决策，可以使用它。

重新验证通过单次获取 HTTP 调用中的 `?_routes` 查询字符串参数进行处理，这限制了被调用的加载器。这意味着当您进行细粒度重新验证时，您将根据请求的路由进行缓存枚举——但所有信息都在 URL 中，因此您不需要任何特殊的 CDN 配置（与通过自定义头部进行此操作需要您的 CDN 尊重 `Vary` 头部不同）。

[future-flags]: ../file-conventions/remix-config#future
[should-revalidate]: ../route/should-revalidate
[entry-server]: ../file-conventions/entry.server
[client-loader]: ../route/client-loader
[2.9.0]: https://github.com/remix-run/remix/blob/main/CHANGELOG.md#v290
[rfc]: https://github.com/remix-run/remix/discussions/7640
[turbo-stream]: https://github.com/jacob-ebey/turbo-stream
[rendertopipeablestream]: https://react.dev/reference/react-dom/server/renderToPipeableStream
[rendertoreadablestream]: https://react.dev/reference/react-dom/server/renderToReadableStream
[rendertostring]: https://react.dev/reference/react-dom/server/renderToString
[hydrateroot]: https://react.dev/reference/react-dom/client/hydrateRoot
[starttransition]: https://react.dev/reference/react/startTransition
[headers]: ../route/headers
[resource-routes]: ../guides/resource-routes
[returning-response]: ../route/loader.md#returning-response-instances
[streaming-format]: #streaming-data-format
[undici-polyfill]: https://github.com/remix-run/remix/blob/main/CHANGELOG.md#undici
[undici]: https://github.com/nodejs/undici
[csp]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src
[csp-nonce]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#sources
[merging-remix-and-rr]: https://remix.run/blog/merging-remix-and-react-router
[migration-guide]: #migrating-a-route-with-single-fetch
[breaking-changes]: #breaking-changes
[revalidation]: #normal-navigation-behavior
[action-revalidation]: #submission-revalidation-behavior
[start]: #enabling-single-fetch
[type-inference-section]: #type-inference
[compatibility-flag]: https://developers.cloudflare.com/workers/configuration/compatibility-dates
[data-utility]: ../utils/data
[augment]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation