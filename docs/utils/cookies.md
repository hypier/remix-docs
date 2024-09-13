---
title: Cookies
---

# Cookies

一个[cookie][cookie]是服务器在HTTP响应中发送给用户的小块信息，用户的浏览器会在后续请求中将其发送回去。这种技术是许多互动网站的基本构建块，它增加了状态，使您能够构建身份验证（参见[sessions][sessions]）、购物车、用户偏好以及许多其他需要记住“登录”用户的功能。

Remix的`Cookie`接口提供了一个逻辑上可重用的cookie元数据容器。

## 使用 cookies

虽然您可以手动创建这些 cookies，但更常见的是使用 [session storage][sessions]。

在 Remix 中，您通常会在 `loader` 和/或 `action` 函数中处理 cookies，因为这些是您需要读取和写入数据的地方。

假设您在电子商务网站上有一个横幅，提示用户查看您当前正在促销的商品。横幅横跨您主页的顶部，并在一侧包含一个按钮，允许用户关闭横幅，这样他们至少在接下来的一周内不会再看到它。

首先，创建一个 cookie：

```ts filename=app/cookies.server.ts
import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const userPrefs = createCookie("user-prefs", {
  maxAge: 604_800, // one week
});
```

然后，您可以 `import` 该 cookie 并在您的 `loader` 和/或 `action` 中使用它。在这种情况下，`loader` 仅检查用户偏好的值，以便您可以在组件中使用它来决定是否渲染横幅。当按钮被点击时，`<form>` 调用服务器上的 `action` 并在没有横幅的情况下重新加载页面。

**注意：** 我们建议（目前）您在 `*.server.ts` 文件中创建应用所需的所有 cookies，并将它们 `import` 到您的路由模块中。这允许 Remix 编译器正确地将这些导入从不需要的浏览器构建中剔除。我们希望最终能消除这一限制。

```tsx filename=app/routes/_index.tsx lines=[12,17-19,26-28,37]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node"; // or cloudflare/deno
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import {
  useLoaderData,
  Link,
  Form,
} from "@remix-run/react";

import { userPrefs } from "~/cookies.server";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie =
    (await userPrefs.parse(cookieHeader)) || {};
  return json({ showBanner: cookie.showBanner });
}

export async function action({
  request,
}: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie =
    (await userPrefs.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();

  if (bodyParams.get("bannerVisibility") === "hidden") {
    cookie.showBanner = false;
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
}

export default function Home() {
  const { showBanner } = useLoaderData<typeof loader>();

  return (
    <div>
      {showBanner ? (
        <div>
          <Link to="/sale">不要错过我们的促销！</Link>
          <Form method="post">
            <input
              type="hidden"
              name="bannerVisibility"
              value="hidden"
            />
            <button type="submit">隐藏</button>
          </Form>
        </div>
      ) : null}
      <h1>欢迎！</h1>
    </div>
  );
}
```

## Cookie 属性

Cookies 具有 [多个属性][cookie-attrs]，用于控制它们的过期时间、访问方式和发送位置。这些属性可以在 `createCookie(name, options)` 中指定，也可以在生成 `Set-Cookie` 头时通过 `serialize()` 指定。

```ts
const cookie = createCookie("user-prefs", {
  // These are defaults for this cookie.
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: true,
  expires: new Date(Date.now() + 60_000),
  maxAge: 60,
});

// You can either use the defaults:
cookie.serialize(userPrefs);

// Or override individual ones as needed:
cookie.serialize(userPrefs, { sameSite: "strict" });
```

请阅读 [更多关于这些属性的信息][cookie-attrs] 以更好地理解它们的作用。

## 签名 Cookie

可以对 Cookie 进行签名，以便在接收时自动验证其内容。由于伪造 HTTP 头相对容易，因此对于任何您不希望他人伪造的信息（如身份验证信息），这都是一个好主意（请参见 [sessions][sessions]）。

要签名一个 Cookie，在首次创建 Cookie 时提供一个或多个 `secrets`：

```ts
const cookie = createCookie("user-prefs", {
  secrets: ["s3cret1"],
});
```

具有一个或多个 `secrets` 的 Cookie 将以确保 Cookie 完整性的方式进行存储和验证。

通过将新秘密添加到 `secrets` 数组的前面，可以轮换秘密。使用旧秘密签名的 Cookie 仍然可以在 `cookie.parse()` 中成功解码，并且最新的秘密（数组中的第一个）将始终用于签署在 `cookie.serialize()` 中创建的传出 Cookie。

```ts filename=app/cookies.server.ts
export const cookie = createCookie("user-prefs", {
  secrets: ["n3wsecr3t", "olds3cret"],
});
```

```tsx filename=app/routes/route.tsx
import { cookie } from "~/cookies.server";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const oldCookie = request.headers.get("Cookie");
  // oldCookie 可能是用 "olds3cret" 签名的，但仍然可以正常解析
  const value = await cookie.parse(oldCookie);

  new Response("...", {
    headers: {
      // Set-Cookie 是用 "n3wsecr3t" 签名的
      "Set-Cookie": await cookie.serialize(value),
    },
  });
}
```

## `createCookie`

创建一个逻辑容器，用于从服务器管理浏览器 cookie。

```ts
import { createCookie } from "@remix-run/node"; // or cloudflare/deno

const cookie = createCookie("cookie-name", {
  // all of these are optional defaults that can be overridden at runtime
  expires: new Date(Date.now() + 60_000),
  httpOnly: true,
  maxAge: 60,
  path: "/",
  sameSite: "lax",
  secrets: ["s3cret1"],
  secure: true,
});
```

要了解每个属性的更多信息，请参阅 [MDN Set-Cookie docs][cookie-attrs]。

## `isCookie`

如果一个对象是 Remix cookie 容器，则返回 `true`。

```ts
import { isCookie } from "@remix-run/node"; // or cloudflare/deno
const cookie = createCookie("user-prefs");
console.log(isCookie(cookie));
// true
```

## Cookie API

从 `createCookie` 返回一个 cookie 容器，它具有一些属性和方法。

```ts
const cookie = createCookie(name);
cookie.name;
cookie.parse();
// etc.
```

### `cookie.name`

cookie的名称，用于`Cookie`和`Set-Cookie` HTTP头。

### `cookie.parse()`

提取并返回给定 `Cookie` 头中的这个 cookie 的值。

```ts
const value = await cookie.parse(
  request.headers.get("Cookie")
);
```

### `cookie.serialize()`

序列化一个值，并将其与该 cookie 的选项结合，以创建一个适合用于发出的 `Response` 的 `Set-Cookie` 头。

```ts
new Response("...", {
  headers: {
    "Set-Cookie": await cookie.serialize({
      showBanner: true,
    }),
  },
});
```

### `cookie.isSigned`

如果 cookie 使用了任何 `secrets`，则为 `true`，否则为 `false`。

```ts
let cookie = createCookie("user-prefs");
console.log(cookie.isSigned); // false

cookie = createCookie("user-prefs", {
  secrets: ["soopersekrit"],
});
console.log(cookie.isSigned); // true
```

### `cookie.expires`

此cookie的过期`Date`。请注意，如果一个cookie同时具有`maxAge`和`expires`，则此值将是当前时间加上`maxAge`值的日期，因为`Max-Age`优先于`Expires`。

```ts
const cookie = createCookie("user-prefs", {
  expires: new Date("2021-01-01"),
});

console.log(cookie.expires); // "2020-01-01T00:00:00.000Z"
```

[sessions]: ./sessions
[cookie]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
[cookie-attrs]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes