---
title: 常见问题
description: 关于 Remix 的常见问题
---

# 常见问题解答

## 如何让父路由加载器验证用户并保护所有子路由？

你不能 😅。在客户端过渡期间，为了让你的应用尽可能快速，Remix 会 _并行_ 调用所有加载器，使用单独的请求。每一个加载器都需要进行自己的身份验证检查。

这可能与您在使用 Remix 之前的做法没有什么不同，只是现在可能更明显。除了 Remix，当你对你的“API 路由”进行多次请求时，每个端点都需要验证用户会话。换句话说，Remix 路由加载器就是它们自己的“API 路由”，必须这样对待。

我们建议你创建一个验证用户会话的函数，可以添加到任何需要的路由中。

```ts filename=app/session.ts lines=[9-22]
import {
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node"; // or cloudflare/deno

// somewhere you've got a session storage
const { getSession } = createCookieSessionStorage();

export async function requireUserSession(request) {
  // get the session
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);

  // validate the session, `userId` is just an example, use whatever value you
  // put in the session when the user authenticated
  if (!session.has("userId")) {
    // if there is no user session, redirect to login
    throw redirect("/login");
  }

  return session;
}
```

现在在任何需要用户会话的加载器或动作中，你都可以调用这个函数。

```tsx filename=app/routes/projects.tsx lines=[5]
export async function loader({
  request,
}: LoaderFunctionArgs) {
  // if the user isn't authenticated, this will redirect to login
  const session = await requireUserSession(request);

  // otherwise the code continues to execute
  const projects = await fakeDb.projects.scan({
    userId: session.get("userId"),
  });
  return json(projects);
}
```

即使你不需要会话信息，这个函数仍然会保护路由：

```tsx
export async function loader({
  request,
}: LoaderFunctionArgs) {
  await requireUserSession(request);
  // continue
}
```

## 如何在一个路由中处理多个表单？

[在 YouTube 上观看][watch_on_youtube]

在 HTML 中，表单可以通过 action 属性发布到任何 URL，应用程序将导航到该 URL：

```tsx
<Form action="/some/where" />
```

在 Remix 中，action 默认设置为表单呈现的路由，这使得将 UI 和处理它的服务器代码放在一起变得简单。开发者常常想知道在这种情况下如何处理多个操作。你有两个选择：

1. 发送一个表单字段来确定你想执行的操作
2. 发布到不同的路由并重定向回原始路由

我们发现选项 (1) 是最简单的，因为你不必处理会话以将验证错误返回到 UI。

HTML 按钮可以发送一个值，因此这是实现此功能的最简单方法：

```tsx filename=app/routes/projects.$id.tsx lines=[5-6,35,41]
export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  switch (intent) {
    case "update": {
      // 执行更新
      return updateProjectName(formData.get("name"));
    }
    case "delete": {
      // 执行删除
      return deleteStuff(formData);
    }
    default: {
      throw new Error("意外的操作");
    }
  }
}

export default function Projects() {
  const project = useLoaderData<typeof loader>();
  return (
    <>
      <h2>更新项目</h2>
      <Form method="post">
        <label>
          项目名称:{" "}
          <input
            type="text"
            name="name"
            defaultValue={project.name}
          />
        </label>
        <button type="submit" name="intent" value="update">
          更新
        </button>
      </Form>

      <Form method="post">
        <button type="submit" name="intent" value="delete">
          删除
        </button>
      </Form>
    </>
  );
}
```

<docs-warning>较旧的浏览器版本可能会破坏此功能，因为它们可能不支持 [SubmitEvent: submitter 属性][submitevent-submitter] 或 [FormData() 构造函数 submitter 参数][formdata-submitter]。请务必检查这些功能的浏览器兼容性。如果你需要进行 polyfill，请参考 [Event Submitter Polyfill][polyfill-event-submitter] 和 [FormData Submitter Polyfill][polyfill-formdata-submitter]。有关更多详细信息，请参见相关问题 [remix-run/remix#9704][remix-submitter-issue]。</docs-warning>

## 如何在表单中使用结构化数据？

如果您习惯于使用 `application/json` 的内容类型进行获取，您可能会想知道表单如何适应这一点。[`FormData`][form_data] 与 JSON 有些不同。

- 它不能包含嵌套数据，仅为“键值对”。
- 它 _可以_ 在一个键上有多个条目，这与 JSON 不同。

如果您想发送结构化数据以简单地提交数组，可以在多个输入中使用相同的键：

```tsx
<Form method="post">
  <p>选择此视频的类别：</p>
  <label>
    <input type="checkbox" name="category" value="comedy" />{" "}
    喜剧
  </label>
  <label>
    <input type="checkbox" name="category" value="music" />{" "}
    音乐
  </label>
  <label>
    <input type="checkbox" name="category" value="howto" />{" "}
    教程
  </label>
</Form>
```

每个复选框的名称为：“category”。由于 `FormData` 可以在同一个键上有多个值，因此您不需要 JSON。通过 `formData.getAll()` 访问复选框的值。

```tsx
export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const categories = formData.getAll("category");
  // ["comedy", "music"]
}
```

使用相同的输入名称和 `formData.getAll()` 可以满足大多数提交结构化数据的需求。

如果您仍然想提交嵌套结构，可以使用非标准的表单字段命名约定和 npm 中的 [`query-string`][query_string] 包：

```tsx
<>
  // 数组使用 []
  <input name="category[]" value="comedy" />
  <input name="category[]" value="comedy" />
  // 嵌套结构 parentKey[childKey]
  <input name="user[name]" value="Ryan" />
</>
```

然后在您的 action 中：

```tsx
import queryString from "query-string";

// 在您的 action 中：
export async function action({
  request,
}: ActionFunctionArgs) {
  // 使用 `request.text()`，而不是 `request.formData` 来获取表单数据作为 URL
  // 编码的表单查询字符串
  const formQueryString = await request.text();

  // 将其解析为对象
  const obj = queryString.parse(formQueryString);
}
```

有些人甚至将他们的 JSON 放入隐藏字段中。请注意，这种方法在渐进增强中无法使用。如果这对您的应用不重要，这是一种发送结构化数据的简单方法。

```tsx
<input
  type="hidden"
  name="json"
  value={JSON.stringify(obj)}
/>
```

然后在 action 中解析它：

```tsx
export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const obj = JSON.parse(formData.get("json"));
}
```

再次强调，`formData.getAll()` 通常是您所需的全部，我们鼓励您尝试一下！

[form_data]: https://developer.mozilla.org/en-US/docs/Web/API/FormData
[query_string]: https://npm.im/query-string
[ramda]: https://npm.im/ramda
[watch_on_youtube]: https://www.youtube.com/watch?v=w2i-9cYxSdc&ab_channel=Remix
[submitevent-submitter]: https://developer.mozilla.org/en-US/docs/Web/API/SubmitEvent/submitter
[formdata-submitter]: https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData#submitter
[polyfill-event-submitter]: https://github.com/idea2app/event-submitter-polyfill
[polyfill-formdata-submitter]: https://github.com/jenseng/formdata-submitter-polyfill
[remix-submitter-issue]: https://github.com/remix-run/remix/issues/9704