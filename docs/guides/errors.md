---
title: 错误处理
---

# 错误处理

Remix 在 web 应用程序的错误处理上树立了新的标准，你会喜欢的。Remix 会自动捕获你代码中的大多数错误，无论是在服务器上还是在浏览器中，并渲染出错误发生位置最近的 [`ErrorBoundary`][error-boundary]。如果你熟悉 React 的 [`componentDidCatch`][component-did-catch] 和 [`getDerivedStateFromError`][get-derived-state-from-error] 类组件钩子，这就像那样，但对服务器上的错误进行了额外的处理。

Remix 会自动捕获错误，并为以下情况渲染最近的错误边界：

- 在浏览器中渲染时
- 在服务器上渲染时
- 在初始服务器渲染文档请求中的 `loader` 中
- 在初始服务器渲染文档请求中的 `action` 中
- 在浏览器中的客户端过渡期间的 `loader` 中（Remix 将错误序列化并通过网络发送到浏览器）
- 在浏览器中的客户端过渡期间的 `action` 中

## 根错误边界

默认情况下，Remix 内置了一个默认的 `ErrorBoundary`，但我们希望您能为自己的全局错误边界添加一些品牌元素。您可以通过从 `app/root.tsx` 导出您自己的 [`ErrorBoundary`][error-boundary] 来实现。每当抛出未捕获的错误时，您的用户将看到这个。

```tsx
export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <Scripts />
      </body>
    </html>
  );
}
```

您需要确保仍然渲染 [`Links`][links-component]、[`Meta`][meta-component] 和 [`Scripts`][scripts-component] 组件，因为当根错误边界被渲染时，整个文档将会挂载和卸载。

## 嵌套错误边界

层级中的每个路由都是一个潜在的错误边界。如果嵌套路由导出了错误边界，那么在其下方的任何错误都将被捕获并在此处渲染。这意味着父路由中的其余周围 UI _会正常渲染_，这样用户就可以点击另一个链接，而不会丢失他们可能拥有的任何客户端状态。

例如，考虑这些路由：

```text
app/
├── routes/
│   ├── sales.tsx
│   ├── sales.invoices.tsx
│   └── sales.invoices.$invoiceId.tsx
└── root.tsx
```

如果 `app/routes/sales.invoices.$invoiceId.tsx` 导出了一个 [`ErrorBoundary`][error-boundary]，并且在其组件、[`action`][action] 或 [`loader`][loader] 中抛出了错误，应用的其余部分将正常渲染，只有页面的发票部分会渲染错误。

![错误在嵌套路由中，父路由的导航正常渲染][error-in-a-nested-route-where-the-parent-route-s-navigation-renders-normally]

如果一个路由没有错误边界，则错误会“冒泡”到最近的错误边界，一直到根，因此您不必在每个路由中添加错误边界——仅在您想为 UI 添加额外触感时才需要。

## 错误清理

在生产模式下，服务器上发生的任何错误都会自动清理，以防泄露任何敏感的服务器信息（例如堆栈跟踪）给客户端。这意味着你从 [`useRouteError`][use-route-error] 接收到的 `Error` 实例将具有通用消息而没有堆栈跟踪：

```tsx
export async function loader() {
  if (badConditionIsTrue()) {
    throw new Error("Oh no! Something went wrong!");
  }
}

export function ErrorBoundary() {
  const error = useRouteError();
  // 当 NODE_ENV=production 时：
  // error.message = "意外的服务器错误"
  // error.stack = undefined
}
```

如果你需要记录这些错误或将其报告给第三方服务，例如 [BugSnag][bugsnag] 或 [Sentry][sentry]，你可以通过在你的 [`app/entry.server.js`][entry-server] 中导出一个 [`handleError`][handle-error] 来实现。由于它也是在服务器上运行，因此该方法接收未清理的错误版本。

如果你想触发错误边界并在浏览器中显示特定消息或数据，你可以从 `action`/`loader` 抛出一个包含该数据的 `Response`：

```tsx
export async function loader() {
  if (badConditionIsTrue()) {
    throw new Response("Oh no! Something went wrong!", {
      status: 500,
    });
  }
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    // error.status = 500
    // error.data = "Oh no! Something went wrong!"
  }
}
```

[component-did-catch]: https://react.dev/reference/react/Component#componentdidcatch  
[get-derived-state-from-error]: https://react.dev/reference/react/Component#static-getderivedstatefromerror  
[error-boundary]: ../route/error-boundary  
[links-component]: ../components/links  
[meta-component]: ../components/meta  
[scripts-component]: ../components/scripts  
[error-in-a-nested-route-where-the-parent-route-s-navigation-renders-normally]: /docs-images/error-boundary.png  
[action]: ../route/action  
[loader]: ../route/loader  
[use-route-error]: ../hooks/use-route-error  
[bugsnag]: https://www.bugsnag.com/  
[sentry]: https://sentry.io/  
[handle-error]: ../file-conventions/entry.server#handleerror  
[entry-server]: ../file-conventions/entry.server