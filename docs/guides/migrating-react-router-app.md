---
title: 从 React Router 迁移
description: 将您的 React Router 应用迁移到 Remix 可以一次性完成或分阶段进行。本指南将引导您通过迭代的方法快速运行您的应用。
---

<docs-info>如果您想要一个简短的版本以及一个概述简化迁移的代码库，请查看我们的 <a href="https://github.com/kentcdodds/incremental-react-router-to-remix-upgrade-path">示例 React Router 到 Remix 的代码库</a>。</docs-info>

# 将您的 React Router 应用迁移到 Remix

<docs-warning>本指南目前假设您正在使用 [Classic Remix Compiler][classic-remix-compiler] 而不是 [Remix Vite][remix-vite]。</docs-warning>

全球数百万个部署的 React 应用程序都由 [React Router][react-router] 提供支持。您可能已经发布了其中的一些！由于 Remix 是建立在 React Router 之上的，我们努力使迁移成为一个可以逐步进行的简单过程，以避免大规模重构。

如果您还没有使用 React Router，我们认为有几个令人信服的理由让您重新考虑！历史管理、动态路径匹配、嵌套路由等等。请查看 [React Router 文档][react-router-docs]，了解我们所提供的所有内容。

## 确保您的应用使用 React Router v6

如果您正在使用旧版本的 React Router，第一步是升级到 v6。查看 [从 v5 到 v6 的迁移指南][migration-guide-from-v5-to-v6] 和我们的 [向后兼容包][backwards-compatibility-package]，以快速和迭代地将您的应用升级到 v6。

## 安装 Remix

首先，您需要一些我们的包来构建 Remix。请按照以下说明操作，从项目的根目录运行所有命令。

```shell
npm install @remix-run/react @remix-run/node @remix-run/serve
npm install -D @remix-run/dev
```

## 创建服务器和浏览器入口点

大多数 React Router 应用主要在浏览器中运行。服务器的唯一任务是发送一个静态的 HTML 页面，而 React Router 在客户端管理基于路由的视图。这些应用通常有一个浏览器入口文件，例如根 `index.js`，其内容大致如下：

```tsx filename=index.tsx
import { render } from "react-dom";

import App from "./App";

render(<App />, document.getElementById("app"));
```

服务器渲染的 React 应用稍有不同。浏览器脚本并不是在渲染您的应用，而是在“水合”由服务器提供的 DOM。水合是将 DOM 中的元素映射到它们的 React 组件对应物，并设置事件监听器，使您的应用具有交互性的过程。

让我们开始创建两个新文件：

- `app/entry.server.tsx`（或 `entry.server.jsx`）
- `app/entry.client.tsx`（或 `entry.client.jsx`）

<docs-info>根据约定，您在 Remix 中的所有应用代码将位于 `app` 目录中。如果您现有的应用使用了同名目录，请将其重命名为 `src` 或 `old-app` 之类的名称，以便在迁移到 Remix 时进行区分。</docs-info>

```tsx filename=app/entry.server.tsx
import { PassThrough } from "node:stream";

import type {
  AppLoadContext,
  EntryContext,
} from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext
) {
  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
}

function handleBotRequest(
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
        onAllReady() {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(
              createReadableStreamFromReadable(body),
              {
                headers: responseHeaders,
                status: responseStatusCode,
              }
            )
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

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
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(
              createReadableStreamFromReadable(body),
              {
                headers: responseHeaders,
                status: responseStatusCode,
              }
            )
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          console.error(error);
          responseStatusCode = 500;
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
```

您的客户端入口点将如下所示：

```tsx filename=app/entry.client.tsx
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
```

## 创建 `root` 路由

我们提到过 Remix 是建立在 React Router 之上的。您的应用可能会使用 JSX `Route` 组件来渲染一个定义了路由的 `BrowserRouter`。在 Remix 中我们不需要这样做，但稍后会详细说明。目前，我们需要提供 Remix 应用正常运行所需的最低级别路由。

根路由（或者如果您是 Wes Bos，可以称为“根根”）负责提供应用程序的结构。它的默认导出是一个组件，该组件渲染每个其他路由加载和依赖的完整 HTML 树。可以把它看作是您应用的框架或外壳。

在客户端渲染的应用中，您将有一个包含用于挂载 React 应用的 DOM 节点的索引 HTML 文件。根路由将渲染与该文件结构相对应的标记。

在您的 `app` 目录中创建一个名为 `root.tsx`（或 `root.jsx`）的新文件。该文件的内容可能会有所不同，但假设您的 `index.html` 看起来像这样：

```html filename=index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="My beautiful React app"
    />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>My React App</title>
  </head>
  <body>
    <noscript
      >You need to enable JavaScript to run this
      app.</noscript
    >
    <div id="root"></div>
  </body>
</html>
```

在您的 `root.tsx` 中，导出一个与其结构相对应的组件：

```tsx filename=app/root.tsx
import { Outlet } from "@remix-run/react";

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="My beautiful React app"
        />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>My React App</title>
      </head>
      <body>
        <div id="root">
          <Outlet />
        </div>
      </body>
    </html>
  );
}
```

请注意以下几点：

- 我们去掉了 `noscript` 标签。我们现在是服务器渲染，这意味着禁用 JavaScript 的用户仍然能够看到我们的应用（随着时间的推移，随着您进行 [一些改进渐进增强的调整][a-few-tweaks-to-improve-progressive-enhancement]，您应用的大部分功能应该仍然可以正常工作）。
- 在根元素内部，我们渲染了来自 `@remix-run/react` 的 `Outlet` 组件。这是您通常在 React Router 应用中用于渲染匹配路由的相同组件；在这里它也起到相同的功能，但已针对 Remix 的路由进行了调整。

<docs-warning><strong>重要：</strong> 创建根路由后，请确保从您的 `public` 目录中删除 `index.html`。保留该文件可能会导致您的服务器在访问 `/` 路由时发送该 HTML，而不是您的 Remix 应用。</docs-warning>

## 适配您现有的应用代码

首先，将您现有的 React 代码的根目录移动到您的 `app` 目录中。因此，如果您的根应用代码位于项目根目录中的 `src` 目录中，则现在应该在 `app/src` 中。

我们还建议重命名此目录，以清楚表明这是您的旧代码，以便最终在迁移其所有内容后可以删除它。此方法的优点在于，您不必一次性完成所有工作，您的应用仍然可以照常运行。在我们的演示项目中，我们将此目录命名为 `old-app`。

最后，在您的根 `App` 组件中（即原本会挂载到 `root` 元素上的组件），从 React Router 中移除 `<BrowserRouter>`。Remix 会为您处理这一点，而无需直接渲染提供程序。

## 创建索引和通配符路由

Remix 需要根路由以外的路由来知道在 `<Outlet />` 中渲染什么。幸运的是，您已经在应用中渲染了 `<Route>` 组件，Remix 可以在您迁移到使用我们的 [路由约定][routing-conventions] 时使用这些组件。

首先，在 `app` 目录中创建一个名为 `routes` 的新目录。在该目录中，创建两个文件，分别命名为 `_index.tsx` 和 `$.tsx`。`$.tsx` 被称为 [**通配符或 "splat" 路由**][a-catch-all-route]，它将有助于让您的旧应用处理尚未迁移到 `routes` 目录中的路由。

在您的 `_index.tsx` 和 `$.tsx` 文件中，我们需要做的就是导出我们旧的根 `App` 的代码：

```tsx filename=app/routes/_index.tsx
export { default } from "~/old-app/app";
```

```tsx filename=app/routes/$.tsx
export { default } from "~/old-app/app";
```

## 用 Remix 替换打包工具

Remix 提供了自己的打包工具和 CLI 工具，用于开发和构建您的应用程序。您的应用程序可能使用了类似 Create React App 的工具进行启动，或者您可能使用 Webpack 设置了自定义构建。

在您的 `package.json` 文件中，更新您的脚本以使用 `remix` 命令，而不是当前的构建和开发脚本。

```json filename=package.json
{
  "scripts": {
    "build": "remix build",
    "dev": "remix dev",
    "start": "remix-serve build/index.js",
    "typecheck": "tsc"
  }
}
```

哇！您的应用程序现在是服务器渲染的，构建时间从 90 秒减少到 0.5 秒 ⚡

## 创建你的路由

随着时间的推移，你会想将由 React Router 的 `<Route>` 组件渲染的路由迁移到它们自己的路由文件中。我们 [路由约定][routing-conventions] 中概述的文件名和目录结构将指导这一迁移。

你路由文件中的默认导出是渲染在 `<Outlet />` 中的组件。因此，如果你的 `App` 中有一个路由看起来像这样：

```tsx filename=app/old-app/app.tsx
function About() {
  return (
    <main>
      <h1>About us</h1>
      <PageContent />
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
```

你的路由文件应该看起来像这样：

```tsx filename=app/routes/about.tsx
export default function About() {
  return (
    <main>
      <h1>About us</h1>
      <PageContent />
    </main>
  );
}
```

一旦你创建了这个文件，你可以从你的 `App` 中删除 `<Route>` 组件。在你所有的路由都迁移后，你可以删除 `<Routes>`，最终删除 `old-app` 中的所有代码。

## 注意事项和后续步骤

在这一点上，您_可能_可以说您完成了初始迁移。恭喜！然而，Remix 的处理方式与典型的 React 应用程序略有不同。如果不是这样，我们为什么要费心最初构建它呢？😅

### 不安全的浏览器引用

将客户端渲染的代码库迁移到服务器渲染的代码库时，一个常见的问题是代码中可能存在对在服务器上运行的浏览器 API 的引用。一个常见的例子是在初始化状态中的值时：

```tsx
function Count() {
  const [count, setCount] = React.useState(
    () => localStorage.getItem("count") || 0
  );

  React.useEffect(() => {
    localStorage.setItem("count", count);
  }, [count]);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

在这个例子中，`localStorage` 被用作全局存储，以在页面重新加载时持久化一些数据。我们在 `useEffect` 中使用当前的 `count` 值更新 `localStorage`，这是完全安全的，因为 `useEffect` 仅在浏览器中调用！然而，基于 `localStorage` 初始化状态是个问题，因为这个回调在服务器和浏览器中都会执行。

你的解决方案可能是检查 `window` 对象，仅在浏览器中运行回调。然而，这可能导致另一个问题，那就是令人头痛的 [hydration mismatch][hydration-mismatch]。React 依赖于服务器渲染的标记与客户端 hydration 期间渲染的标记完全相同。这确保了 `react-dom` 知道如何将 DOM 元素与其对应的 React 组件匹配，以便它可以附加事件监听器并在状态变化时执行更新。因此，如果本地存储给出的值与我们在服务器上初始化的值不同，我们将面临一个新的问题。

#### 仅客户端组件

这里的一个潜在解决方案是使用不同的缓存机制，可以在服务器上使用，并通过从路由的 [loader data][loader-data] 传递的 props 传递给组件。但如果你的应用程序不需要在服务器上渲染组件，一个更简单的解决方案可能是跳过在服务器上的渲染，等到 hydration 完成后再在浏览器中渲染它。

```tsx
// 我们可以安全地在内存状态中跟踪 hydration
// 因为它只在 `SomeComponent` 的版本实例
// 被 hydration 后更新一次。从那里开始，
// 浏览器接管路由变化的渲染职责，
// 我们不再需要担心 hydration 不匹配，
// 直到页面重新加载并且 `isHydrating` 被重置为 true。
let isHydrating = true;

function SomeComponent() {
  const [isHydrated, setIsHydrated] = React.useState(
    !isHydrating
  );

  React.useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  if (isHydrated) {
    return <Count />;
  } else {
    return <SomeFallbackComponent />;
  }
}
```

为了简化这个解决方案，我们建议使用 [`remix-utils`][remix-utils] 社区包中的 [`ClientOnly` 组件][client-only-component]。它的用法示例可以在 [`examples` repository][examples-repository] 中找到。

### `React.lazy` 和 `React.Suspense`

如果您使用 [`React.lazy`][react-lazy] 和 [`React.Suspense`][react-suspense] 进行懒加载组件，可能会遇到一些问题，这取决于您使用的 React 版本。在 React 18 之前，这在服务器上是无法工作的，因为 `React.Suspense` 最初被实现为仅限浏览器的功能。

如果您使用的是 React 17，您有几个选项：

- 升级到 React 18
- 使用上面概述的 [仅限客户端的方法][client-only-approach]
- 使用其他懒加载解决方案，例如 [Loadable Components][loadable-components]
- 完全移除 `React.lazy` 和 `React.Suspense`

请记住，Remix 会自动处理它管理的所有路由的代码分割，因此当您将内容移入 `routes` 目录时，您几乎不需要手动使用 `React.lazy`。

### 配置

进一步的配置是可选的，但以下内容可能有助于优化您的开发工作流程。

#### `remix.config.js`

每个 Remix 应用程序都接受项目根目录中的 `remix.config.js` 文件。虽然其设置是可选的，但我们建议您包含其中一些以提高清晰度。有关所有可用选项的更多信息，请参见 [配置文档][docs-on-configuration]。

```js filename=remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: "app",
  ignoredRouteFiles: ["**/*.css"],
  assetsBuildDirectory: "public/build",
};
```

#### `jsconfig.json` 或 `tsconfig.json`

如果您使用 TypeScript，您可能已经在项目中有一个 `tsconfig.json` 文件。`jsconfig.json` 是可选的，但为许多编辑器提供了有用的上下文。这是我们建议在语言配置中包含的最小设置。


```json filename=jsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["./app/*"]
    }
  }
}
```

```json filename=tsconfig.json
{
  "include": ["remix.env.d.ts", "**/*.ts", "**/*.tsx"],
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "isolatedModules": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "resolveJsonModule": true,
    "moduleResolution": "Bundler",
    "baseUrl": ".",
    "noEmit": true,
    "paths": {
      "~/*": ["./app/*"]
    }
  }
}
```

如果您使用 TypeScript，您还需要在项目根目录中创建 `remix.env.d.ts` 文件，并添加适当的全局类型引用。

```ts filename=remix.env.d.ts
/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />
```

### 关于非标准导入的说明

此时，您_可能_可以在不进行任何更改的情况下运行您的应用程序。如果您使用的是 Create React App 或高度配置的打包工具，您可能会使用 `import` 来包含非 JavaScript 模块，例如样式表和图像。

Remix 不支持大多数非标准导入，我们认为这是有充分理由的。以下是您在 Remix 中遇到的一些差异的非详尽列表，以及在迁移时如何重构。

#### 资产导入

许多打包工具使用插件来允许导入各种资产，如图像和字体。这些资产通常作为表示文件路径的字符串进入您的组件。

```tsx
import logo from "./logo.png";

export function Logo() {
  return <img src={logo} alt="My logo" />;
}
```

在 Remix 中，这基本上以相同的方式工作。对于通过 `<link>` 元素加载的资产（如字体），您通常会在路由模块中导入这些，并在 `links` 函数返回的对象中包含文件名。[有关路由 `links` 的更多信息，请参见我们的文档。][see-our-docs-on-route-links-for-more-information]

#### SVG 导入

Create React App 和其他一些构建工具允许您将 SVG 文件导入为 React 组件。这是 SVG 文件的常见用例，但在 Remix 中默认不支持。

```tsx bad nocopy
// 这在 Remix 中将无法工作！
import MyLogo from "./logo.svg";

export function Logo() {
  return <MyLogo />;
}
```

如果您想将 SVG 文件用作 React 组件，您需要先创建组件并直接导入它们。[React SVGR][react-svgr] 是一个很好的工具集，可以帮助您从 [命令行][command-line] 或在 [在线演示][online-playground] 中生成这些组件，如果您更喜欢复制和粘贴。

```svg filename=icon.svg
<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" />
</svg>
```

```tsx filename=icon.tsx good
export default function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
      />
    </svg>
  );
}
```

#### CSS 导入

Create React App 和许多其他构建工具支持以多种方式在您的组件中导入 CSS。Remix 支持导入常规 CSS 文件以及下面描述的几种流行的 CSS 打包解决方案。

### 路由 `links` 导出

在 Remix 中，常规样式表可以从路由组件文件中加载。导入它们并不会对你的样式做任何神奇的处理，而是返回一个可以根据需要加载样式表的 URL。你可以直接在组件中渲染样式表，或者使用我们的 [`links` 导出][see-our-docs-on-route-links-for-more-information]。

让我们将应用的样式表和其他一些资源移动到根路由的 `links` 函数中：

```tsx filename=app/root.tsx lines=[2,5,7-16,32]
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno
import { Links } from "@remix-run/react";

import App from "./app";
import stylesheetUrl from "./styles.css";

export const links: LinksFunction = () => {
  // `links` 返回一个对象数组，其
  // 属性映射到 `<link />` 组件的 props
  return [
    { rel: "icon", href: "/favicon.ico" },
    { rel: "apple-touch-icon", href: "/logo192.png" },
    { rel: "manifest", href: "/manifest.json" },
    { rel: "stylesheet", href: stylesheetUrl },
  ];
};

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <Links />
        <title>React App</title>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

你会注意到在第 32 行，我们渲染了一个 `<Links />` 组件，取代了我们所有单独的 `<link />` 组件。如果我们只在根路由中使用链接，这并没有什么影响，但所有子路由也可以导出自己的链接，这些链接也会在这里渲染。`links` 函数还可以返回一个 [`PageLinkDescriptor` 对象][page-link-descriptor-object]，允许你预取用户可能导航到的页面的资源。

如果你当前在现有的路由组件中客户端注入 `<link />` 标签，无论是直接还是通过像 [`react-helmet`][react-helmet] 这样的抽象，你可以停止这样做，而是使用 `links` 导出。你可以删除很多代码，并可能减少一两个依赖项！

### CSS 打包

Remix 内置支持 [CSS Modules][css-modules]、[Vanilla Extract][vanilla-extract] 和 [CSS 副作用导入][css-side-effect-imports]。为了使用这些功能，您需要在应用程序中设置 CSS 打包。

首先，要访问生成的 CSS 包，请安装 `@remix-run/css-bundle` 包。

```sh
npm install @remix-run/css-bundle
```

然后，导入 `cssBundleHref` 并将其添加到链接描述符中——最有可能在 `root.tsx` 中，以便它适用于整个应用程序。

```tsx filename=root.tsx lines=[2,6-8]
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

export const links: LinksFunction = () => {
  return [
    ...(cssBundleHref
      ? [{ rel: "stylesheet", href: cssBundleHref }]
      : []),
    // ...
  ];
};
```

[有关更多信息，请参阅我们的 CSS 打包文档。][css-bundling]

<docs-info>

**注意：** Remix 当前不直接支持 Sass/Less 处理，但您仍然可以将其作为单独的进程运行，以生成可以导入到您的 Remix 应用程序中的 CSS 文件。

</docs-info>

### 在 `<head>` 中渲染组件

正如 `<link>` 在你的路由组件中被渲染并最终在你的根 `<Links />` 组件中渲染，你的应用可能会使用一些注入技巧在文档的 `<head>` 中渲染额外的组件。通常这样做是为了更改文档的 `<title>` 或 `<meta>` 标签。

与 `links` 类似，每个路由也可以导出一个 `meta` 函数，该函数返回负责为该路由渲染 `<meta>` 标签的值（以及一些与元数据相关的其他标签，如 `<title>`、`<link rel="canonical">` 和 `<script type="application/ld+json">`）。

`meta` 的行为与 `links` 略有不同。**每个叶子路由负责渲染自己的标签**，而不是合并路由层次中的其他 `meta` 函数的值。这是因为：

- 你通常希望对元数据有更细粒度的控制，以实现最佳的 SEO
- 在某些遵循 [Open Graph 协议][open-graph-protocol] 的标签情况下，一些标签的顺序会影响爬虫和社交媒体网站对它们的解释，而 Remix 假设复杂元数据的合并方式是不可预测的
- 一些标签允许多个值，而其他标签则不允许，Remix 不应该假设你希望如何处理所有这些情况

### 更新导入

Remix 重新导出了您从 `react-router-dom` 获取的所有内容，我们建议您更新导入，从 `@remix-run/react` 获取这些模块。在许多情况下，这些组件被包装了额外的功能和特性，专门针对 Remix 进行了优化。

**之前：**

```tsx bad nocopy
import { Link, Outlet } from "react-router-dom";
```

**之后：**

```tsx good
import { Link, Outlet } from "@remix-run/react";
```

## 最后的思考

虽然我们尽力提供了一个全面的迁移指南，但重要的是要注意，我们从头开始构建 Remix 时遵循了一些与许多当前构建的 React 应用显著不同的关键原则。虽然您的应用在这一点上可能可以运行，但随着您深入我们的文档并探索我们的 API，我们认为您将能够大幅减少代码的复杂性，并改善应用的最终用户体验。可能需要一些时间才能达到这一点，但您可以一步一步地完成这个任务。

那么，去吧，_重塑您的应用_。我们相信您会喜欢在这个过程中构建的内容！💿

### 深入阅读

- [Remix 哲学][remix-philosophy]
- [Remix 技术解释][remix-technical-explanation]
- [Remix 中的数据加载][data-loading-in-remix]
- [Remix 中的路由][routing-in-remix]
- [Remix 中的样式][styling-in-remix]
- [常见问题][frequently-asked-questions]
- [常见“陷阱”][common-gotchas]

[react-router]: https://reactrouter.com
[react-router-docs]: https://reactrouter.com/start/concepts
[migration-guide-from-v5-to-v6]: https://reactrouter.com/en/6.22.3/upgrading/v5
[backwards-compatibility-package]: https://www.npmjs.com/package/react-router-dom-v5-compat
[a-few-tweaks-to-improve-progressive-enhancement]: ../pages/philosophy#progressive-enhancement
[routing-conventions]: ./routing
[a-catch-all-route]: ../file-conventions/routes#splat-routes
[hydration-mismatch]: https://reactjs.org/docs/react-dom.html#hydrate
[loader-data]: ../route/loader
[client-only-component]: https://github.com/sergiodxa/remix-utils/blob/main/src/react/client-only.tsx
[remix-utils]: https://www.npmjs.com/package/remix-utils
[examples-repository]: https://github.com/remix-run/examples/blob/main/client-only-components/app/routes/_index.tsx
[react-lazy]: https://reactjs.org/docs/code-splitting.html#reactlazy
[react-suspense]: https://reactjs.org/docs/react-api.html#reactsuspense
[client-only-approach]: #client-only-components
[loadable-components]: https://loadable-components.com/docs/loadable-vs-react-lazy
[docs-on-configuration]: ../file-conventions/remix-config
[see-our-docs-on-route-links-for-more-information]: ../route/links
[react-svgr]: https://react-svgr.com
[command-line]: https://react-svgr.com/docs/cli
[online-playground]: https://react-svgr.com/playground
[page-link-descriptor-object]: ../route/links#pagelinkdescriptor
[react-helmet]: https://www.npmjs.com/package/react-helmet
[remix-philosophy]: ../pages/philosophy
[remix-technical-explanation]: ../pages/technical-explanation
[data-loading-in-remix]: ./data-loading
[routing-in-remix]: ./routing
[styling-in-remix]: ./styling
[frequently-asked-questions]: ../pages/faq
[common-gotchas]: ../pages/gotchas
[css-modules]: ./styling#css-modules
[vanilla-extract]: ./styling#vanilla-extract
[css-side-effect-imports]: ./styling#css-side-effect-imports
[css-bundling]: ./styling#css-bundling
[open-graph-protocol]: https://ogp.me
[classic-remix-compiler]: ./vite#classic-remix-compiler-vs-remix-vite
[remix-vite]: ./vite