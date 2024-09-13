---
title: 会话
---

# 会话

会话是网站的重要组成部分，它允许服务器识别来自同一用户的请求，特别是在进行服务器端表单验证或页面上没有 JavaScript 时。会话是许多允许用户“登录”的网站的基本构建块，包括社交、电子商务、商业和教育网站。

在 Remix 中，会话是按路由管理的（而不是像 express 中间件那样）在您的 `loader` 和 `action` 方法中使用“会话存储”对象（实现 `SessionStorage` 接口）。会话存储理解如何解析和生成 cookies，以及如何在数据库或文件系统中存储会话数据。

Remix 提供了几种预构建的会话存储选项以应对常见场景，并且有一种选项可以让您创建自己的存储：

- `createCookieSessionStorage`
- `createMemorySessionStorage`
- `createFileSessionStorage` (node)
- `createWorkersKVSessionStorage` (Cloudflare Workers)
- `createArcTableSessionStorage` (architect, Amazon DynamoDB)
- 使用 `createSessionStorage` 创建自定义存储

## 使用会话

这是一个 cookie 会话存储的示例：

```ts filename=app/sessions.ts
// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      // a Cookie from `createCookie` or the CookieOptions to create one
      cookie: {
        name: "__session",

        // all of these are optional
        domain: "remix.run",
        // Expires can also be set (although maxAge overrides it when used in combination).
        // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
        //
        // expires: new Date(Date.now() + 60_000),
        httpOnly: true,
        maxAge: 60,
        path: "/",
        sameSite: "lax",
        secrets: ["s3cret1"],
        secure: true,
      },
    }
  );

export { getSession, commitSession, destroySession };
```

我们建议在 `app/sessions.ts` 中设置会话存储对象，以便所有需要访问会话数据的路由可以从同一位置导入（另见我们的 [Route Module Constraints][constraints]）。

会话存储对象的输入/输出是 HTTP cookies。`getSession()` 从传入请求的 `Cookie` 头中检索当前会话，而 `commitSession()`/`destroySession()` 为传出的响应提供 `Set-Cookie` 头。

您将在 `loader` 和 `action` 函数中使用方法来访问会话。

登录表单可能看起来像这样：

```tsx filename=app/routes/login.tsx lines=[8,13-15,17,22,26,34-36,47,52,57,62]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node"; // or cloudflare/deno
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import { getSession, commitSession } from "../sessions";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (session.has("userId")) {
    // 如果已经登录，则重定向到主页。
    return redirect("/");
  }

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function action({
  request,
}: ActionFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  const userId = await validateCredentials(
    username,
    password
  );

  if (userId == null) {
    session.flash("error", "无效的用户名/密码");

    // 带着错误重定向回登录页面。
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("userId", userId);

  // 登录成功，重定向到主页。
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <div>
      {error ? <div className="error">{error}</div> : null}
      <form method="POST">
        <div>
          <p>请登录</p>
        </div>
        <label>
          用户名: <input type="text" name="username" />
        </label>
        <label>
          密码:{" "}
          <input type="password" name="password" />
        </label>
      </form>
    </div>
  );
}
```

然后，注销表单可能看起来像这样：

```tsx
import { getSession, destroySession } from "../sessions";

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function LogoutRoute() {
  return (
    <>
      <p>您确定要注销吗？</p>
      <Form method="post">
        <button>注销</button>
      </Form>
      <Link to="/">没关系</Link>
    </>
  );
}
```

<docs-warning>重要的是，您应该在 `action` 中注销（或执行任何变更），而不是在 `loader` 中。否则，您将使用户面临 [跨站请求伪造][csrf] 攻击的风险。此外，Remix 仅在调用 `actions` 时重新调用 `loaders`。</docs-warning>

## 会话注意事项

由于嵌套路由，多个加载器可以被调用以构建单个页面。当使用 `session.flash()` 或 `session.unset()` 时，您需要确保请求中的其他加载器不会想要读取这些内容，否则您将遇到竞争条件。通常，如果您使用闪存，您会希望有一个单一的加载器来读取它，如果另一个加载器想要一个闪存消息，请为该加载器使用不同的键。

## `createSession`

TODO:

## `isSession`

如果对象是 Remix 会话，则返回 `true`。

```ts
import { isSession } from "@remix-run/node"; // or cloudflare/deno

const sessionData = { foo: "bar" };
const session = createSession(sessionData, "remix-session");
console.log(isSession(session));
// true
```

## `createSessionStorage`

Remix 使得在需要时将会话存储在您自己的数据库中变得简单。`createSessionStorage()` API 需要一个 `cookie`（有关创建 cookie 的选项，请参见 [cookies][cookies]）以及一组用于管理会话数据的创建、读取、更新和删除（CRUD）方法。该 cookie 用于持久化会话 ID。

- `createData` 将在没有会话 ID 存在于 cookie 中时从 `commitSession` 被调用
- `readData` 将在 cookie 中存在会话 ID 时从 `getSession` 被调用
- `updateData` 将在 cookie 中已经存在会话 ID 时从 `commitSession` 被调用
- `deleteData` 从 `destroySession` 被调用

以下示例展示了如何使用通用数据库客户端执行此操作：

```ts
import { createSessionStorage } from "@remix-run/node"; // 或 cloudflare/deno

function createDatabaseSessionStorage({
  cookie,
  host,
  port,
}) {
  // 配置您的数据库客户端...
  const db = createDatabaseClient(host, port);

  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      // `expires` 是一个 Date，在此之后数据应被视为无效。
      // 您可以使用它以某种方式使数据无效或
      // 自动从数据库中清除此记录。
      const id = await db.insert(data);
      return id;
    },
    async readData(id) {
      return (await db.select(id)) || null;
    },
    async updateData(id, data, expires) {
      await db.update(id, data);
    },
    async deleteData(id) {
      await db.delete(id);
    },
  });
}
```

然后您可以像这样使用它：

```ts
const { getSession, commitSession, destroySession } =
  createDatabaseSessionStorage({
    host: "localhost",
    port: 1234,
    cookie: {
      name: "__session",
      sameSite: "lax",
    },
  });
```

`createData` 和 `updateData` 的 `expires` 参数是 cookie 自身过期并且不再有效的相同 `Date`。您可以使用此信息自动从数据库中清除会话记录以节省空间，或者确保您不会为旧的、过期的 cookie 返回任何数据。

## `createCookieSessionStorage`

对于纯粹基于 cookie 的会话（会话数据本身存储在浏览器的会话 cookie 中，参见 [cookies][cookies]），您可以使用 `createCookieSessionStorage()`。

cookie 会话存储的主要优点是您不需要任何额外的后端服务或数据库来使用它。在某些负载均衡场景中，它也可能是有益的。然而，基于 cookie 的会话可能无法超过浏览器允许的最大 cookie 长度（通常为 4kb）。

缺点是您几乎每个加载器和操作都必须 `commitSession`。如果您的加载器或操作对会话有任何更改，必须提交它。这意味着如果您在一个操作中使用 `session.flash`，然后在另一个操作中使用 `session.get`，您必须提交它以使该闪存消息消失。使用其他会话存储策略时，您只需在创建时提交（浏览器 cookie 不需要更改，因为它不存储会话数据，只是找到它的键）。

```ts
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the same CookieOptions to create one
    cookie: {
      name: "__session",
      secrets: ["r3m1xr0ck5"],
      sameSite: "lax",
    },
  });
```

请注意，其他会话实现会在 cookie 中存储一个唯一的会话 ID，并使用该 ID 在真实来源中查找会话（内存、文件系统、数据库等）。在 cookie 会话中，cookie _就是_ 真实来源，因此没有开箱即用的唯一 ID。如果您需要在 cookie 会话中跟踪唯一 ID，您需要通过 `session.set()` 自行添加 ID 值。

## `createMemorySessionStorage`

此存储将所有 cookie 信息保存在服务器的内存中。

<docs-error>这仅应在开发中使用。在生产中使用其他方法。</docs-error>

```ts filename=app/sessions.ts
import {
  createCookie,
  createMemorySessionStorage,
} from "@remix-run/node"; // or cloudflare/deno

// In this example the Cookie is created separately.
const sessionCookie = createCookie("__session", {
  secrets: ["r3m1xr0ck5"],
  sameSite: true,
});

const { getSession, commitSession, destroySession } =
  createMemorySessionStorage({
    cookie: sessionCookie,
  });

export { getSession, commitSession, destroySession };
```

## `createFileSessionStorage` (node)

对于文件支持的会话，使用 `createFileSessionStorage()`。文件会话存储需要一个文件系统，但在大多数运行 express 的云服务提供商上，这通常是可以轻松获得的，可能需要一些额外的配置。

文件支持的会话的优点在于，只有会话 ID 存储在 cookie 中，而其余数据存储在磁盘上的常规文件中，适合于超过 4kb 数据的会话。

<docs-info>如果您正在部署到无服务器函数，请确保您可以访问持久化文件系统。通常在没有额外配置的情况下，它们是没有的。</docs-info>

```ts filename=app/sessions.ts
import {
  createCookie,
  createFileSessionStorage,
} from "@remix-run/node"; // or cloudflare/deno

// In this example the Cookie is created separately.
const sessionCookie = createCookie("__session", {
  secrets: ["r3m1xr0ck5"],
  sameSite: true,
});

const { getSession, commitSession, destroySession } =
  createFileSessionStorage({
    // The root directory where you want to store the files.
    // Make sure it's writable!
    dir: "/app/sessions",
    cookie: sessionCookie,
  });

export { getSession, commitSession, destroySession };
```

## `createWorkersKVSessionStorage` (Cloudflare Workers)

对于 [Cloudflare Workers KV][cloudflare-kv] 支持的会话，使用 `createWorkersKVSessionStorage()`。

KV 支持的会话的优点在于，只有会话 ID 存储在 cookie 中，而其余数据存储在一个全球复制、低延迟的数据存储中，具有异常高的读取量和低延迟。

```ts filename=app/sessions.server.ts
import {
  createCookie,
  createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";

// In this example the Cookie is created separately.
const sessionCookie = createCookie("__session", {
  secrets: ["r3m1xr0ck5"],
  sameSite: true,
});

const { getSession, commitSession, destroySession } =
  createWorkersKVSessionStorage({
    // The KV Namespace where you want to store sessions
    kv: YOUR_NAMESPACE,
    cookie: sessionCookie,
  });

export { getSession, commitSession, destroySession };
```

## `createArcTableSessionStorage` (architect, Amazon DynamoDB)

对于基于 [Amazon DynamoDB][amazon-dynamo-db] 的会话，请使用 `createArcTableSessionStorage()`。

DynamoDB 支持的会话的优点在于，只有会话 ID 存储在 cookie 中，而其余数据则存储在一个全球复制、低延迟的数据存储中，具有极高的读取量和低延迟。

```
# app.arc
sessions
  _idx *String
  _ttl TTL
```

```ts filename=app/sessions.server.ts
import {
  createCookie,
  createArcTableSessionStorage,
} from "@remix-run/architect";

// In this example the Cookie is created separately.
const sessionCookie = createCookie("__session", {
  secrets: ["r3m1xr0ck5"],
  maxAge: 3600,
  sameSite: true,
});

const { getSession, commitSession, destroySession } =
  createArcTableSessionStorage({
    // The name of the table (should match app.arc)
    table: "sessions",
    // The name of the key used to store the session ID (should match app.arc)
    idx: "_idx",
    // The name of the key used to store the expiration time (should match app.arc)
    ttl: "_ttl",
    cookie: sessionCookie,
  });

export { getSession, commitSession, destroySession };
```

## 会话 API

在使用 `getSession` 获取会话后，返回的会话对象具有一些方法和属性：

```tsx
export async function action({
  request,
}: ActionFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  session.get("foo");
  session.has("bar");
  // etc.
}
```

### `session.has(key)`

如果会话中存在具有给定 `name` 的变量，则返回 `true`。

```ts
session.has("userId");
```

### `session.set(key, value)`

设置会话值以供后续请求使用：

```ts
session.set("userId", "1234");
```

### `session.flash(key, value)`

设置一个会在第一次读取时被清除的会话值。之后，它将消失。最适合用于“闪存消息”和服务器端表单验证消息：

```tsx
import { commitSession, getSession } from "../sessions";

export async function action({
  params,
  request,
}: ActionFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  const deletedProject = await archiveProject(
    params.projectId
  );

  session.flash(
    "globalMessage",
    `Project ${deletedProject.name} successfully archived`
  );

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
```

现在我们可以在加载器中读取消息。

<docs-info>每次读取 `flash` 时都必须提交会话。这与您可能习惯的不同，您习惯的某种中间件会自动为您设置 cookie 头。</docs-info>

```tsx
import { json } from "@remix-run/node"; // or cloudflare/deno
import {
  Meta,
  Links,
  Scripts,
  Outlet,
} from "@remix-run/react";

import { getSession, commitSession } from "./sessions";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  const message = session.get("globalMessage") || null;

  return json(
    { message },
    {
      headers: {
        // only necessary with cookieSessionStorage
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function App() {
  const { message } = useLoaderData<typeof loader>();

  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {message ? (
          <div className="flash">{message}</div>
        ) : null}
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
```

### `session.get()`

从之前的请求中访问会话值：

```ts
session.get("name");
```

### `session.unset()`

从会话中移除一个值。

```ts
session.unset("name");
```

<docs-info>使用 cookieSessionStorage 时，每当你 `unset` 时必须提交会话</docs-info>

```tsx
export async function loader({
  request,
}: LoaderFunctionArgs) {
  // ...

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
```

[cookies]: ./cookies
[constraints]: ../guides/constraints
[csrf]: https://developer.mozilla.org/en-US/docs/Glossary/CSRF
[cloudflare-kv]: https://developers.cloudflare.com/workers/learning/how-kv-works
[amazon-dynamo-db]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide