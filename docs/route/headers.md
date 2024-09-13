---
title: 标题
---

# `headers`

每个路由可以定义自己的 HTTP 头部。一个常见的头部是 [`Cache-Control` header][cache-control-header]，它指示浏览器和 CDN 缓存页面可以被缓存的位置和时间。

```tsx
import type { HeadersFunction } from "@remix-run/node"; // or cloudflare/deno

export const headers: HeadersFunction = ({
  actionHeaders,
  errorHeaders,
  loaderHeaders,
  parentHeaders,
}) => ({
  "X-Stretchy-Pants": "its for fun",
  "Cache-Control": "max-age=300, s-maxage=3600",
});
```

通常情况下，您的数据比路由模块更能指示缓存的持续时间（数据往往比标记更动态），因此 [`action`][action] 和 [`loader`][loader] 的头部也会传递给 `headers()`：

```tsx
import type { HeadersFunction } from "@remix-run/node"; // or cloudflare/deno

export const headers: HeadersFunction = ({
  loaderHeaders,
}) => ({
  "Cache-Control": loaderHeaders.get("Cache-Control"),
});
```

注意：`actionHeaders` 和 `loaderHeaders` 是 [Web Fetch API `Headers`][headers] 类的一个实例。

如果 `action` 或 `loader` 抛出了一个 [`Response`][response]，并且我们正在渲染一个边界，任何来自抛出的 `Response` 的头部将在 `errorHeaders` 中可用。这使您可以访问来自在父错误边界中抛出的子加载器的头部。

## 嵌套路由

由于 Remix 具有嵌套路由，当嵌套路由匹配时，会有一个头部的竞争需要解决。默认行为是 Remix 仅利用它在可渲染匹配中找到的最深层的 `headers` 函数返回的结果（如果存在错误，则包括边界路由）。

```
├── users.tsx
├── users.$userId.tsx
└── users.$userId.profile.tsx
```

如果我们查看 `/users/123/profile`，那么三个路由正在渲染：

```tsx
<Users>
  <UserId>
    <Profile />
  </UserId>
</Users>
```

如果用户正在查看 `/users/123/profile`，并且 `users.$userId.profile.tsx` 没有导出 `headers` 函数，那么 Remix 将使用 `users.$userId.tsx` 的 `headers` 函数的返回值。如果该文件没有导出一个，那么它将使用 `users.tsx` 中的结果，依此类推。

如果所有三个都定义了 `headers`，最深的模块将胜出，在这种情况下是 `users.$userId.profile.tsx`。但是，如果你的 `users.$userId.profile.tsx` 的 `loader` 抛出并冒泡到 `users.userId.tsx` 的边界中 - 那么将使用 `users.userId.tsx` 的 `headers` 函数，因为它是叶子渲染路由。

我们不希望你的响应中出现意外的头部，因此如果你愿意，合并它们是你的工作。Remix 将 `parentHeaders` 传递给你的 `headers` 函数。因此，`users.tsx` 的头部被传递给 `users.$userId.tsx`，然后 `users.$userId.tsx` 的 `headers` 被传递给 `users.$userId.profile.tsx` 的 `headers`。

这就是说，Remix 给了你一把非常大的枪，你需要小心不要从子路由模块发送比父路由更激进的 `Cache-Control`。以下是一些代码，用于在这些情况下选择最不激进的缓存策略：

```tsx
import type { HeadersFunction } from "@remix-run/node"; // or cloudflare/deno
import parseCacheControl from "parse-cache-control";

export const headers: HeadersFunction = ({
  loaderHeaders,
  parentHeaders,
}) => {
  const loaderCache = parseCacheControl(
    loaderHeaders.get("Cache-Control")
  );
  const parentCache = parseCacheControl(
    parentHeaders.get("Cache-Control")
  );

  // 选择父级和加载器之间最保守的策略，否则
  // 我们将对其中一个过于激进。
  const maxAge = Math.min(
    loaderCache["max-age"],
    parentCache["max-age"]
  );

  return {
    "Cache-Control": `max-age=${maxAge}`,
  };
};
```

总之，你可以通过_不在父路由中定义头部_，而只在叶子路由中定义头部，来避免整个问题。每个可以直接访问的布局可能都有一个“索引路由”。如果你只在叶子路由上定义头部，而不是在父路由上定义头部，你将永远不必担心合并头部。

请注意，你还可以在你的 [`entry.server.tsx`][entry-server] 文件中添加头部，以用于应该是全局的内容，例如：

```tsx filename=app/entry.server.tsx lines=[20]
import type {
  AppLoadContext,
  EntryContext,
} from "@remix-run/node"; // or cloudflare/deno
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set("X-Powered-By", "Hugs");

  return new Response("<!DOCTYPE html>" + markup, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
```

请记住，执行此操作将适用于_所有_文档请求，但不适用于 `data` 请求（例如，客户端过渡）。对于这些，请使用 [`handleDataRequest`][handle-data-request]。

[cache-control-header]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
[action]: ./action
[loader]: ./loader
[headers]: https://developer.mozilla.org/en-US/docs/Web/API/Headers
[response]: https://developer.mozilla.org/en-US/docs/Web/API/Response
[entry-server]: ../file-conventions/entry.server
[handle-data-request]: ../file-conventions/entry.server#handledatarequest