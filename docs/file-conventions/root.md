---
title: 根
toc: false
---

# 根路由

“根”路由 (`app/root.tsx`) 是您 Remix 应用程序中唯一的 _必需_ 路由，因为它是您 `routes/` 目录中所有路由的父路由，并负责渲染根 `<html>` 文档。

除此之外，它大致与其他路由相同，并支持所有标准路由导出：

- [`headers`][headers]
- [`meta`][meta]
- [`links`][links]
- [`loader`][loader]
- [`clientLoader`][clientloader]
- [`action`][action]
- [`clientAction`][clientaction]
- [`default`][component]
- [`ErrorBoundary`][errorboundary]
- [`HydrateFallback`][hydratefallback]
- [`handle`][handle]
- [`shouldRevalidate`][shouldrevalidate]

由于根路由管理您的文档，因此它是渲染 Remix 提供的一些“文档级”组件的合适位置。这些组件仅在根路由中使用一次，它们包含了 Remix 为了使您的页面正确渲染而想出的或构建的所有内容。

```tsx filename=app/root.tsx
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import globalStylesheetUrl from "./global-styles.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: globalStylesheetUrl }];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        {/* All `meta` exports on all routes will render here */}
        <Meta />

        {/* All `link` exports on all routes will render here */}
        <Links />
      </head>
      <body>
        {/* Child routes render here */}
        <Outlet />

        {/* Manages scroll position for client-side transitions */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}
        <ScrollRestoration />

        {/* Script tags go here */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}
        <Scripts />

        {/* Sets up automatic reload when you change code */}
        {/* and only does anything during development */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}
        <LiveReload />
      </body>
    </html>
  );
}
```

## 布局导出

由于根路由管理所有路由的文档，它还支持一个额外的可选 `Layout` 导出。您可以在这个 [RFC][layout-rfc] 中阅读详细信息，但布局路由有两个目的：

- 避免在根组件、`HydrateFallback` 和 `ErrorBoundary` 中重复文档/"应用外壳"。
- 避免在切换根组件/`HydrateFallback`/`ErrorBoundary` 时，React 重新挂载应用外壳元素，这可能导致 FOUC，因为 React 会从 `<Links>` 组件中移除并重新添加 `<link rel="stylesheet">` 标签。

```tsx filename=app/root.tsx lines=[10-31]
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export function Layout({ children }) {
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
        {/* children will be the root Component, ErrorBoundary, or HydrateFallback */}
        {children}
        <Scripts />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  }

  return (
    <>
      <h1>Error!</h1>
      <p>{error?.message ?? "Unknown error"}</p>
    </>
  );
}
```

**关于 `Layout` 组件中的 `useLoaderData` 的说明**

`useLoaderData` 不允许在 `ErrorBoundary` 组件中使用，因为它是为正常路径路由渲染而设计的，其类型定义内置假设 `loader` 成功运行并返回了某些内容。这个假设在 `ErrorBoundary` 中不成立，因为可能是 `loader` 抛出了错误并触发了边界！为了在 `ErrorBoundary` 中访问加载器数据，您可以使用 `useRouteLoaderData`，它考虑到加载器数据可能为 `undefined`。

因为您的 `Layout` 组件在成功和错误流程中都被使用，所以同样的限制适用。如果您需要根据请求是否成功在 `Layout` 中分叉逻辑，可以使用 `useRouteLoaderData("root")` 和 `useRouteError()`。

<docs-warn>因为您的 `<Layout>` 组件用于渲染 `ErrorBoundary`，您应该非常小心，以确保您可以在不遇到任何渲染错误的情况下渲染 `ErrorBoundary`。如果您的 `Layout` 在尝试渲染边界时抛出另一个错误，那么它将无法使用，您的 UI 将退回到非常基本的内置默认 `ErrorBoundary`。</docs-warn>

```tsx filename="app/root.tsx" lines=[6-7,19-29,32-34]
export function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = useRouteLoaderData("root");
  const error = useRouteError();

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
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --themeVar: ${
                  data?.themeVar || defaultThemeVar
                }
              }
            `,
          }}
        />
      </head>
      <body>
        {data ? (
          <Analytics token={data.analyticsToken} />
        ) : null}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

另请参阅：

- [`<Meta>`][meta-component]
- [`<Links>`][links-component]
- [`<Outlet>`][outlet-component]
- [`<ScrollRestoration>`][scrollrestoration-component]
- [`<Scripts>`][scripts-component]
- [`<LiveReload>`][livereload-component]

[headers]: ../route/headers
[meta]: ../route/meta
[links]: ../route/links
[loader]: ../route/loader
[clientloader]: ../route/client-loader
[action]: ../route/action
[clientaction]: ../route/client-action
[component]: ../route/component
[errorboundary]: ../route/error-boundary
[hydratefallback]: ../route/hydrate-fallback
[handle]: ../route/handle
[shouldrevalidate]: ../route/should-revalidate
[layout-rfc]: https://github.com/remix-run/remix/discussions/8702
[scripts-component]: ../components/scripts
[links-component]: ../components/links
[meta-component]: ../components/meta
[livereload-component]: ../components/live-reload
[scrollrestoration-component]: ../components/scroll-restoration
[outlet-component]: ../components/outlet