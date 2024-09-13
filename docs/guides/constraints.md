---
title: 模块约束
---

# 模块约束

为了让 Remix 在服务器和浏览器环境中运行您的应用程序，您的应用程序模块和第三方依赖项需要注意 **模块副作用**。

- **仅限服务器的代码** - Remix 会删除仅限服务器的代码，但如果您有使用仅限服务器代码的模块副作用，它就无法删除。
- **仅限浏览器的代码** - Remix 在服务器上渲染，因此您的模块不能有模块副作用或调用仅限浏览器 API 的首次渲染逻辑。

## 服务器代码修剪

Remix 编译器会自动从浏览器包中移除服务器代码。我们的策略实际上非常简单，但需要您遵循一些规则。

1. 它在您的路由模块前创建一个“代理”模块
2. 代理模块仅导入浏览器特定的导出

考虑一个导出 `loader`、`meta` 和一个组件的路由模块：

```tsx
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import { prisma } from "../db";
import PostsView from "../PostsView";

export async function loader() {
  return json(await prisma.post.findMany());
}

export function meta() {
  return [{ title: "Posts" }];
}

export default function Posts() {
  const posts = useLoaderData<typeof loader>();
  return <PostsView posts={posts} />;
}
```

服务器需要这个文件中的所有内容，但浏览器只需要组件和 `meta`。实际上，如果它在浏览器包中包含 `prisma` 模块，将完全无法工作！那个东西充满了仅限于节点的 API！

为了从浏览器包中移除服务器代码，Remix 编译器在您的路由前创建一个代理模块，并打包那个模块。这个路由的代理看起来像这样：

```tsx
export { meta, default } from "./routes/posts.tsx";
```

编译器现在将分析 `app/routes/posts.tsx` 中的代码，并仅保留 `meta` 和组件内部的代码。结果类似于这样：

```tsx
import { useLoaderData } from "@remix-run/react";

import PostsView from "../PostsView";

export function meta() {
  return [{ title: "Posts" }];
}

export default function Posts() {
  const posts = useLoaderData<typeof loader>();
  return <PostsView posts={posts} />;
}
```

相当不错！现在可以安全地打包到浏览器中了。那么问题是什么呢？

### 模块副作用

如果你对副作用不太熟悉，你并不孤单！我们将帮助你现在识别它们。

简单来说，**副作用**是指任何可能_做某事_的代码。**模块副作用**是指任何可能_在模块加载时做某事_的代码。

<docs-info>模块副作用是通过简单导入模块而执行的代码</docs-info>

回顾之前的代码，我们看到编译器可以删除未使用的导出及其导入。但是如果我们添加这一行看似无害的代码，你的应用程序将会崩溃！

```tsx bad lines=[7]
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import { prisma } from "../db";
import PostsView from "../PostsView";

console.log(prisma);

export async function loader() {
  return json(await prisma.post.findMany());
}

export function meta() {
  return [{ title: "Posts" }];
}

export default function Posts() {
  const posts = useLoaderData<typeof loader>();
  return <PostsView posts={posts} />;
}
```

那行 `console.log` _做了一些事情_。模块被导入后立即在控制台中记录。编译器不会删除它，因为它必须在模块被导入时运行。它将打包成如下内容：

```tsx bad lines=[3,6]
import { useLoaderData } from "@remix-run/react";

import { prisma } from "../db"; //😬
import PostsView from "../PostsView";

console.log(prisma); //🥶

export function meta() {
  return [{ title: "Posts" }];
}

export default function Posts() {
  const posts = useLoaderData<typeof loader>();
  return <PostsView posts={posts} />;
}
```

加载器消失了，但 prisma 依赖仍然存在！如果我们记录一些无害的内容，比如 `console.log("hello!")`，那就没问题。但是我们记录了 `prisma` 模块，所以浏览器会对此感到棘手。

要解决此问题，只需将代码_移入加载器_以消除副作用。

```tsx lines=[8]
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import { prisma } from "../db";
import PostsView from "../PostsView";

export async function loader() {
  console.log(prisma);
  return json(await prisma.post.findMany());
}

export function meta() {
  return [{ title: "Posts" }];
}

export default function Posts() {
  const posts = useLoaderData<typeof loader>();
  return <PostsView posts={posts} />;
}
```

这不再是模块副作用（在模块导入时运行），而是加载器的副作用（在调用加载器时运行）。编译器现在将删除加载器_和 prisma 导入_，因为它在模块的其他地方未被使用。

有时，构建可能会在仅应在服务器上运行的代码中遇到树摇问题。如果发生这种情况，你可以使用在文件类型之前添加扩展名 `.server` 的约定，例如 `db.server.ts`。将 `.server` 添加到文件名是给编译器的一个提示，让它在为浏览器打包时不必担心该模块或其导入。

### 高阶函数

一些 Remix 新手尝试用“高阶函数”来抽象他们的加载器。类似于这样：

```ts bad filename=app/http.ts
import { redirect } from "@remix-run/node"; // or cloudflare/deno

export function removeTrailingSlash(loader) {
  return function (arg) {
    const { request } = arg;
    const url = new URL(request.url);
    if (
      url.pathname !== "/" &&
      url.pathname.endsWith("/")
    ) {
      return redirect(request.url.slice(0, -1), {
        status: 308,
      });
    }
    return loader(arg);
  };
}
```

然后尝试像这样使用它：

```ts bad filename=app/root.ts
import { json } from "@remix-run/node"; // or cloudflare/deno

import { removeTrailingSlash } from "~/http";

export const loader = removeTrailingSlash(({ request }) => {
  return json({ some: "data" });
});
```

你可能现在可以看到这是一个模块副作用，因此编译器无法剔除 `removeTrailingSlash` 代码。

这种抽象类型的引入是为了尝试提前返回响应。由于你可以在 `loader` 中抛出一个响应，我们可以简化这一过程，并同时消除模块副作用，以便服务器代码能够被剔除：

```ts filename=app/http.ts
import { redirect } from "@remix-run/node"; // or cloudflare/deno

export function removeTrailingSlash(url) {
  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    throw redirect(request.url.slice(0, -1), {
      status: 308,
    });
  }
}
```

然后像这样使用它：

```tsx filename=app/root.tsx
import { json } from "@remix-run/node"; // or cloudflare/deno

import { removeTrailingSlash } from "~/http";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  removeTrailingSlash(request.url);
  return json({ some: "data" });
};
```

当你有很多这样的代码时，它的可读性也更好：

```tsx
// 这个
export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  return removeTrailingSlash(request.url, () => {
    return withSession(request, (session) => {
      return requireUser(session, (user) => {
        return json(user);
      });
    });
  });
};
```

```tsx
// 对比这个
export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  removeTrailingSlash(request.url);
  const session = await getSession(request);
  const user = await requireUser(session);
  return json(user);
};
```

如果你想进行一些课外阅读，可以在网上搜索“push vs. pull API”。抛出响应的能力将模型从“推送”改变为“拉取”。这与人们更喜欢 async/await 而不是回调，以及更喜欢 React hooks 而不是高阶组件和渲染属性的原因相同。

## 仅在浏览器中运行的服务器代码

与浏览器包不同，Remix 不会尝试从服务器包中移除 _仅在浏览器中运行的代码_，因为路由模块需要每个导出都能在服务器上渲染。这意味着你需要注意那些只应在浏览器中执行的代码。

<docs-error>这会导致你的应用程序崩溃：</docs-error>

```ts bad lines=3
import { loadStripe } from "@stripe/stripe-js";

const stripe = await loadStripe(window.ENV.stripe);

export async function redirectToStripeCheckout(
  sessionId: string
) {
  return stripe.redirectToCheckout({ sessionId });
}
```

<docs-info>你需要避免任何仅在浏览器中运行的模块副作用，例如访问 window 或在模块范围内初始化 API。</docs-info>

### 初始化浏览器专用 API

最常见的场景是在导入模块时初始化第三方 API。处理此问题有几种简单的方法。

#### 文档保护

这确保只有在存在 `document` 时库才会被初始化，这意味着您处于浏览器环境中。我们推荐使用 `document` 而不是 `window`，因为像 Deno 这样的服务器运行时有一个全局的 `window` 可用。

```ts lines=[3]
import firebase from "firebase/app";

if (typeof document !== "undefined") {
  firebase.initializeApp(document.ENV.firebase);
}

export { firebase };
```

#### 延迟初始化

该策略将初始化推迟到库实际使用时：

```ts lines=[4]
import { loadStripe } from "@stripe/stripe-js";

export async function redirectToStripeCheckout(
  sessionId: string
) {
  const stripe = await loadStripe(window.ENV.stripe);
  return stripe.redirectToCheckout({ sessionId });
}
```

您可能希望通过将库存储在模块范围的变量中来避免多次初始化库。

```ts
import { loadStripe } from "@stripe/stripe-js";

let _stripe;
async function getStripe() {
  if (!_stripe) {
    _stripe = await loadStripe(window.ENV.stripe);
  }
  return _stripe;
}

export async function redirectToStripeCheckout(
  sessionId: string
) {
  const stripe = await getStripe();
  return stripe.redirectToCheckout({ sessionId });
}
```

<docs-info>虽然这些策略都没有将浏览器模块从服务器包中移除，但这没关系，因为 API 仅在事件处理程序和效果内部被调用，这些不是模块副作用。</docs-info>

### 仅使用浏览器 API 渲染

另一个常见的情况是代码在渲染时调用仅限浏览器的 API。在 React 中进行服务器渲染时（不仅仅是 Remix），必须避免这种情况，因为这些 API 在服务器上不存在。

<docs-error>这会破坏您的应用，因为服务器会尝试使用本地存储</docs-error>

```ts bad lines=2
function useLocalStorage(key: string) {
  const [state, setState] = useState(
    localStorage.getItem(key)
  );

  const setWithLocalStorage = (nextState) => {
    setState(nextState);
  };

  return [state, setWithLocalStorage];
}
```

您可以通过将代码移动到 `useEffect` 中来修复此问题，该代码仅在浏览器中运行。

```tsx lines=[2,4-6]
function useLocalStorage(key: string) {
  const [state, setState] = useState(null);

  useEffect(() => {
    setState(localStorage.getItem(key));
  }, [key]);

  const setWithLocalStorage = (nextState) => {
    setState(nextState);
  };

  return [state, setWithLocalStorage];
}
```

现在在初始渲染时不会访问 `localStorage`，这在服务器上是可行的。在浏览器中，该状态将在水合后立即填充。希望这不会导致大的内容布局偏移！如果是这样，您可以将该状态移入数据库或 cookie，以便在服务器端访问。

### `useLayoutEffect`

如果你使用这个 hook，React 会警告你在服务器上使用它。

这个 hook 在设置状态时非常有用，例如：

- 元素弹出时的位置（比如菜单按钮）
- 响应用户交互的滚动位置

关键是要在浏览器绘制的同时执行效果，这样你就不会看到弹出窗口在 `0,0` 位置出现，然后再弹跳到正确的位置。布局效果允许绘制和效果同时发生，以避免这种闪烁。

它**不适合**用于设置渲染在元素内部的状态。只要确保你没有在元素中使用 `useLayoutEffect` 设置的状态，你就可以忽略 React 的警告。

如果你知道自己正确地调用了 `useLayoutEffect`，并且只是想消除警告，库中一个流行的解决方案是创建你自己的 hook，它不在服务器上调用任何东西。`useLayoutEffect` 反正只在浏览器中运行，所以这样做应该可以解决问题。**请谨慎使用，因为这个警告是有充分理由的！**

```ts
import * as React from "react";

const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

const useLayoutEffect = canUseDOM
  ? React.useLayoutEffect
  : () => {};
```

### 第三方模块副作用

一些第三方库有其自身的模块副作用，这些副作用与 React 服务器渲染不兼容。通常它们试图访问 `window` 进行特性检测。

这些库与 React 的服务器渲染不兼容，因此与 Remix 也不兼容。幸运的是，React 生态系统中很少有第三方库这样做。

我们建议寻找替代方案。但如果找不到，我们建议使用 [patch-package][patch-package] 在您的应用中进行修复。

[patch-package]: https://www.npmjs.com/package/patch-package