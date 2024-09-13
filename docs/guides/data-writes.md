---
title: 数据写入
---

# 数据写入

在 Remix 中，数据写入（有些人称之为变更）是建立在两个基本的 web API 之上的：`<form>` 和 HTTP。然后，我们使用渐进增强来启用乐观 UI、加载指示器和验证反馈——但编程模型仍然是基于 HTML 表单的。

当用户提交表单时，Remix 将会：

1. 调用表单的 action
2. 重新加载页面上所有路由的所有数据

很多时候，人们会在 React 中使用全局状态管理库，如 redux、数据库，如 apollo，以及 fetch 封装库，如 React Query，以帮助管理将服务器状态引入组件并在用户更改时保持 UI 同步。Remix 的基于 HTML 的 API 替代了这些工具的大多数使用场景。使用标准 HTML API 时，Remix 知道如何加载数据以及在数据更改后如何重新验证它。

有几种方法可以调用 action 并使路由重新验证：

- [`<Form>`][form]
- [`useSubmit()`][use-submit]
- [`useFetcher()`][use-fetcher]

本指南仅涵盖 `<Form>`。我们建议您在阅读完本指南后查看其他两个的文档，以了解如何使用它们。本指南的大部分内容适用于 `useSubmit`，但 `useFetcher` 稍有不同。

## 普通 HTML 表单

在与我们公司 <a href="https://reacttraining.com">React Training</a> 举办了多年的工作坊后，我们发现许多新手网页开发者（虽然这并不是他们的错）实际上并不知道 `<form>` 是如何工作的！

由于 Remix `<Form>` 的工作方式与 `<form>` 完全相同（并且有一些额外的功能用于乐观 UI 等），我们将复习一下普通的 HTML 表单，这样你可以同时学习 HTML 和 Remix。

### HTML 表单 HTTP 动词

原生表单支持两种 HTTP 动词：`GET` 和 `POST`。Remix 使用这些动词来理解您的意图。如果是 GET，Remix 将确定页面中哪些部分正在变化，仅获取变化布局的数据，并对未变化的布局使用缓存数据。当是 POST 时，Remix 将重新加载所有数据，以确保捕获服务器的更新。我们来看看这两种情况。

### HTML 表单 GET

`GET` 只是一个普通的导航，其中表单数据通过 URL 查询参数传递。您可以将其用于正常导航，就像 `<a>` 一样，只不过用户通过表单提供查询参数中的数据。除了搜索页面外，它与 `<form>` 的结合使用相对较少。

考虑以下表单：

```html
<form method="get" action="/search">
  <label>搜索 <input name="term" type="text" /></label>
  <button type="submit">搜索</button>
</form>
```

当用户填写并点击提交时，浏览器会自动将表单值序列化为 URL 查询参数字符串，并导航到表单的 `action`，并附加查询字符串。假设用户输入了 "remix"。浏览器将导航到 `/search?term=remix`。如果我们将输入更改为 `<input name="q"/>`，那么表单将导航到 `/search?q=remix`。

这与我们创建的链接具有相同的行为：

```html
<a href="/search?term=remix">搜索 "remix"</a>
```

唯一的不同在于 **用户** 提供了信息。

如果您有更多字段，浏览器将添加它们：

```html
<form method="get" action="/search">
  <fieldset>
    <legend>品牌</legend>
    <label>
      <input name="brand" value="nike" type="checkbox" />
      Nike
    </label>
    <label>
      <input name="brand" value="reebok" type="checkbox" />
      Reebok
    </label>
    <label>
      <input name="color" value="white" type="checkbox" />
      白色
    </label>
    <label>
      <input name="color" value="black" type="checkbox" />
      黑色
    </label>
    <button type="submit">搜索</button>
  </fieldset>
</form>
```

根据用户点击的复选框，浏览器将导航到如下 URL：

```
/search?brand=nike&color=black
/search?brand=nike&brand=reebok&color=white
```

### HTML 表单 POST

当您想要在网站上创建、删除或更新数据时，表单提交是最佳选择。我们不仅仅指用户个人资料编辑页面这样的大表单。即使是“喜欢”按钮也可以通过表单来处理。

让我们考虑一个“新项目”表单。

```html
<form method="post" action="/projects">
  <label><input name="name" type="text" /></label>
  <label><textarea name="description"></textarea></label>
  <button type="submit">创建</button>
</form>
```

当用户提交此表单时，浏览器会将字段序列化为请求“主体”（而不是 URL 查询参数），并将其“POST”到服务器。这仍然是正常的导航，就像用户点击了一个链接。不同之处在于：用户提供了服务器所需的数据，浏览器将请求以“POST”而不是“GET”的方式发送。

数据可供服务器的请求处理程序使用，因此您可以创建记录。之后，您返回一个响应。在这种情况下，您可能会重定向到新创建的项目。一个 remix 操作可能看起来像这样：

```tsx filename=app/routes/projects.tsx
export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();
  const project = await createProject(body);
  return redirect(`/projects/${project.id}`);
}
```

浏览器从 `/projects/new` 开始，然后将表单数据以请求的方式提交到 `/projects`，接着服务器将浏览器重定向到 `/projects/123`。在这一切发生的同时，浏览器进入正常的“加载”状态：地址进度条填满，网站图标变成旋转的图标，等等。这实际上提供了一个不错的用户体验。

如果您是网络开发的新手，您可能从未以这种方式使用过表单。很多人一直都是这样做的：

```html
<form onSubmit={(event) => { event.preventDefault(); // 祝好运！ }} />
```

如果您是这样的人，当您看到只需使用浏览器（和 Remix）内置功能时，变更是多么简单，您一定会感到高兴！

## Remix Mutation, Start to Finish

我们将从头到尾构建一个 mutation，包含：

1. 可选的 JavaScript
2. 验证
3. 错误处理
4. 渐进增强的加载指示器
5. 渐进增强的错误显示

你可以像使用 HTML 表单一样使用 Remix 的 `<Form>` 组件进行数据变更。不同之处在于，现在你可以访问待处理表单状态，以构建更好的用户体验：比如上下文加载指示器和“乐观 UI”。

无论你使用 `<form>` 还是 `<Form>`，你编写的代码都是完全相同的。你可以从 `<form>` 开始，然后将其升级为 `<Form>`，而无需更改任何内容。之后，添加特殊的加载指示器和乐观 UI。然而，如果你觉得不太有把握，或者时间紧迫，只需使用 `<form>`，让浏览器处理用户反馈！Remix 的 `<Form>` 是对 mutation 的“渐进增强”的实现。

### 构建表单

让我们从之前的项目表单开始，但使其可用：

假设你有一个路由 `app/routes/projects.new.tsx`，其中包含以下表单：

```tsx filename=app/routes/projects.new.tsx
export default function NewProject() {
  return (
    <form method="post" action="/projects/new">
      <p>
        <label>
          Name: <input name="name" type="text" />
        </label>
      </p>
      <p>
        <label>
          Description:
          <br />
          <textarea name="description" />
        </label>
      </p>
      <p>
        <button type="submit">Create</button>
      </p>
    </form>
  );
}
```

现在添加路由动作。任何“post”的表单提交将调用你的数据“action”。任何“get”提交（`<Form method="get">`）将由你的“loader”处理。

```tsx lines=[1,5-11]
import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { redirect } from "@remix-run/node"; // or cloudflare/deno

// 注意“action”导出名称，这将处理我们的表单 POST
export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const project = await createProject(formData);
  return redirect(`/projects/${project.id}`);
};

export default function NewProject() {
  // ... 和之前一样
}
```

就这样！假设 `createProject` 做了我们想要的事情，这就是你需要做的。请注意，无论你过去构建了什么样的单页面应用，你始终需要一个服务器端的动作和一个表单来获取用户数据。与 Remix 的不同之处在于 **这就是你所需要的全部**（这也是过去网页的样子）。

当然，我们开始复杂化事情，以试图创造比默认浏览器行为更好的用户体验。继续前进，我们会到达那里，但我们不需要更改任何已经编写的代码来获得核心功能。

### 表单验证

同时进行客户端和服务器端的表单验证是很常见的。不幸的是，只有进行客户端验证的情况也很常见，这会导致数据出现各种问题，我们现在没有时间深入讨论。关键是，如果你只在一个地方进行验证，那就选择在服务器上进行。在使用 Remix 时，你会发现这是你唯一关心的地方（发送到浏览器的内容越少越好！）。

我们知道，你想要漂亮的验证错误动画之类的东西。我们会讨论这个。但现在我们只是构建一个基本的 HTML 表单和用户流程。我们先保持简单，然后再让它变得华丽。

在我们的 action 中，也许我们有一个 API 返回这样的验证错误。

```tsx
const [errors, project] = await createProject(formData);
```

如果有验证错误，我们希望返回表单并显示它们。

```tsx lines=[1,7,9-12]
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const [errors, project] = await createProject(formData);

  if (errors) {
    const values = Object.fromEntries(formData);
    return json({ errors, values });
  }

  return redirect(`/projects/${project.id}`);
};
```

就像 `useLoaderData` 返回 `loader` 的值一样，`useActionData` 将返回来自 action 的数据。只有在导航是表单提交时，它才会存在，因此你总是需要检查是否得到了它。

```tsx lines=[3,12,22,27-31,39,44-48]
import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { useActionData } from "@remix-run/react";

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  // ...
};

export default function NewProject() {
  const actionData = useActionData<typeof action>();

  return (
    <form method="post" action="/projects/new">
      <p>
        <label>
          名称:{" "}
          <input
            name="name"
            type="text"
            defaultValue={actionData?.values.name}
          />
        </label>
      </p>

      {actionData?.errors.name ? (
        <p style={{ color: "red" }}>
          {actionData.errors.name}
        </p>
      ) : null}

      <p>
        <label>
          描述:
          <br />
          <textarea
            name="description"
            defaultValue={actionData?.values.description}
          />
        </label>
      </p>

      {actionData?.errors.description ? (
        <p style={{ color: "red" }}>
          {actionData.errors.description}
        </p>
      ) : null}

      <p>
        <button type="submit">创建</button>
      </p>
    </form>
  );
}
```

注意我们如何为所有输入添加 `defaultValue`。记住，这只是普通的 HTML `<form>`，所以只是正常的浏览器/服务器交互。我们从服务器获取值，这样用户就不必重新输入他们之前输入的内容。

你可以原样发布这段代码。浏览器会为你处理待处理的 UI 和中断。祝你周末愉快，周一再让它变得华丽。

### 将 `<form>` 升级为 `<Form>` 并添加待处理 UI

让我们使用渐进增强使这个用户体验变得更加精致。通过将其从 `<form>` 更改为 `<Form>`，Remix 将模拟浏览器行为并使用 `fetch`。这也将使您能够访问待处理的表单数据，以便构建待处理 UI。

```tsx lines=[2,11]
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { useActionData, Form } from "@remix-run/react";

// ...

export default function NewProject() {
  const actionData = useActionData<typeof action>();

  return (
    // 注意大写的 "F" <Form> 现在
    <Form method="post">{/* ... */}</Form>
  );
}
```

<docs-error>等一下！如果您只是将表单更改为 Form，您将使用户体验变得稍微糟糕一些！</docs-error>

如果您没有时间或动力完成这里的其余工作，请使用 `<Form reloadDocument>`。这允许浏览器继续处理待处理 UI 状态（标签页的 favicon 中的加载动画，地址栏中的进度条等）。如果您只是使用 `<Form>` 而没有实现待处理 UI，当用户提交表单时，他们将不知道发生了什么。

<docs-info>我们建议始终使用大写的 F Form，如果您希望让浏览器处理待处理 UI，请使用 <code>\<Form reloadDocument></code> 属性。</docs-info>

现在让我们添加一些待处理 UI，以便用户在提交时知道发生了什么。这里有一个名为 `useNavigation` 的钩子。当有待处理的表单提交时，Remix 将为您提供表单的序列化版本作为 <a href="https://developer.mozilla.org/en-US/docs/Web/API/FormData">`FormData`</a> 对象。您最感兴趣的是 <a href="https://developer.mozilla.org/en-US/docs/Web/API/FormData/get">`formData.get()`</a> 方法。

```tsx lines=[5,13,19,65-67]
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import {
  useActionData,
  Form,
  useNavigation,
} from "@remix-run/react";

// ...

export default function NewProject() {
  // 当表单在服务器上被处理时，这将返回不同的
  // 导航状态，以帮助我们构建待处理和乐观的 UI。
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <fieldset
        disabled={navigation.state === "submitting"}
      >
        <p>
          <label>
            名称：{" "}
            <input
              name="name"
              type="text"
              defaultValue={
                actionData
                  ? actionData.values.name
                  : undefined
              }
            />
          </label>
        </p>

        {actionData && actionData.errors.name ? (
          <p style={{ color: "red" }}>
            {actionData.errors.name}
          </p>
        ) : null}

        <p>
          <label>
            描述：
            <br />
            <textarea
              name="description"
              defaultValue={
                actionData
                  ? actionData.values.description
                  : undefined
              }
            />
          </label>
        </p>

        {actionData && actionData.errors.description ? (
          <p style={{ color: "red" }}>
            {actionData.errors.description}
          </p>
        ) : null}

        <p>
          <button type="submit">
            {navigation.state === "submitting"
              ? "正在创建..."
              : "创建"}
          </button>
        </p>
      </fieldset>
    </Form>
  );
}
```

非常不错！现在当用户点击“创建”时，输入框会被禁用，提交按钮的文本会改变。由于现在只发生一次网络请求而不是完全重新加载页面（这可能涉及更多的网络请求，从浏览器缓存读取资产，解析 JavaScript，解析 CSS 等），整个操作也应该更快。

我们在这个页面上没有对 `navigation` 做太多，但它包含了关于提交的所有信息（`navigation.formMethod`，`navigation.formAction`，`navigation.formEncType`），以及所有在服务器上处理的值在 `navigation.formData` 中。

### 在验证错误中动画效果

现在我们使用 JavaScript 提交此页面，因此我们的验证错误可以通过动画效果呈现，因为页面是有状态的。首先，我们将制作一个华丽的组件，该组件可以动画化高度和不透明度：

```tsx
function ValidationMessage({ error, isSubmitting }) {
  const [show, setShow] = useState(!!error);

  useEffect(() => {
    const id = setTimeout(() => {
      const hasError = !!error;
      setShow(hasError && !isSubmitting);
    });
    return () => clearTimeout(id);
  }, [error, isSubmitting]);

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        height: show ? "1em" : 0,
        color: "red",
        transition: "all 300ms ease-in-out",
      }}
    >
      {error}
    </div>
  );
}
```

现在我们可以将旧的错误消息包裹在这个新的华丽组件中，甚至可以将有错误的字段的边框变为红色：

```tsx lines=[21-24,31-34,44-48,53-56]
export default function NewProject() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <fieldset
        disabled={navigation.state === "submitting"}
      >
        <p>
          <label>
            名称:{" "}
            <input
              name="name"
              type="text"
              defaultValue={
                actionData
                  ? actionData.values.name
                  : undefined
              }
              style={{
                borderColor: actionData?.errors.name
                  ? "red"
                  : "",
              }}
            />
          </label>
        </p>

        {actionData?.errors.name ? (
          <ValidationMessage
            isSubmitting={navigation.state === "submitting"}
            error={actionData?.errors?.name}
          />
        ) : null}

        <p>
          <label>
            描述:
            <br />
            <textarea
              name="description"
              defaultValue={actionData?.values.description}
              style={{
                borderColor: actionData?.errors.description
                  ? "red"
                  : "",
              }}
            />
          </label>
        </p>

        <ValidationMessage
          isSubmitting={navigation.state === "submitting"}
          error={actionData?.errors.description}
        />

        <p>
          <button type="submit">
            {navigation.state === "submitting"
              ? "正在创建..."
              : "创建"}
          </button>
        </p>
      </fieldset>
    </Form>
  );
}
```

太棒了！华丽的用户界面，无需更改与服务器通信的任何内容。它还对阻止 JavaScript 加载的网络条件具有弹性。

### 回顾

- 首先，我们构建了一个没有考虑 JavaScript 的项目表单。一个简单的表单，提交到服务器端的操作。欢迎来到 1998 年。

- 一旦这项工作完成，我们使用 JavaScript 通过将 `<form>` 更改为 `<Form>` 来提交表单，但我们不需要做其他任何事情！

- 现在有了一个有状态的页面和 React，我们通过简单地请求 Remix 获取导航状态，添加了加载指示器和验证错误的动画。

从您的组件的角度来看，发生的事情只是 `useNavigation` 钩子在表单提交时导致了状态更新，然后在数据返回时又进行了另一次状态更新。当然，在 Remix 内部发生了更多事情，但就您的组件而言，就是这样。仅仅是几个状态更新。这使得装饰任何用户流程变得非常简单。

## 另见

- [表单][form]
- [使用导航][use-navigation]
- [操作][actions]
- [加载器][loaders]
- [`useSubmit()`][use-submit]
- [`useFetcher()`][use-fetcher]

[form]: ../components/form
[use-submit]: ../hooks/use-submit
[use-fetcher]: ../hooks/use-fetcher
[use-navigation]: ../hooks/use-navigation
[actions]: ../route/action
[loaders]: ../route/loader