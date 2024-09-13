---
title: 教程 (30分钟)
position: 2
---

# Remix 教程

我们将构建一个小而功能丰富的应用，让您可以跟踪您的联系人。这里没有数据库或其他“生产就绪”的东西，因此我们可以专注于 Remix。如果您跟着做，我们预计大约需要 30 分钟，否则这只是快速阅读。

<img class="tutorial" src="https://remix.run/docs-images/contacts/01.webp" />

👉 **每当您看到这个标志时，意味着您需要在应用中执行某些操作！**

其余内容仅供您参考和深入理解。让我们开始吧。

## 设置

👉 **生成基本模板**

```shellscript nonumber
npx create-remix@latest --template remix-run/remix/templates/remix-tutorial
```

这使用了一个相当简单的模板，但包含了我们的 css 和数据模型，因此我们可以专注于 Remix。如果您想了解更多， [快速入门][quickstart] 可以让您熟悉 Remix 项目的基本设置。

👉 **启动应用程序**

```shellscript nonumber
# 进入应用程序目录
cd {wherever you put the app}

# 如果还没有安装依赖，请安装
npm install

# 启动服务器
npm run dev
```

您应该能够打开 [http://localhost:5173][http-localhost-5173] 并看到一个未样式化的屏幕，类似于这样：

<img class="tutorial" src="https://remix.run/docs-images/contacts/03.webp" />

## 根路由

注意文件 `app/root.tsx`。这就是我们所称的“根路由”。它是用户界面中第一个渲染的组件，因此通常包含页面的全局布局。

<details>

<summary>点击这里查看根组件代码</summary>

```tsx filename=app/root.tsx
import {
  Form,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export default function App() {
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
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                aria-label="Search contacts"
                id="q"
                name="q"
                placeholder="Search"
                type="search"
              />
              <div
                aria-hidden
                hidden={true}
                id="search-spinner"
              />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            <ul>
              <li>
                <a href={`/contacts/1`}>Your Name</a>
              </li>
              <li>
                <a href={`/contacts/2`}>Your Friend</a>
              </li>
            </ul>
          </nav>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

</details>

## 使用 `links` 添加样式表

虽然有多种方法可以为您的 Remix 应用添加样式，但我们将使用一个已经编写好的普通样式表，以便将重点放在 Remix 上。

您可以直接将 CSS 文件导入到 JavaScript 模块中。Vite 将对资产进行指纹处理，将其保存到构建的客户端目录中，并为您的模块提供可公开访问的 href。

👉 **导入应用样式**

```tsx filename=app/root.tsx lines=[1,4,6-8]
import type { LinksFunction } from "@remix-run/node";
// existing imports

import appStylesHref from "./app.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];
```

每个路由都可以导出一个 [`links`][links] 函数。它们将被收集并渲染到我们在 `app/root.tsx` 中渲染的 `<Links />` 组件中。

现在应用的样子应该是这样的。拥有一个既能设计又能编写 CSS 的设计师真是太好了，是吧？（谢谢你，[Jim][jim] 🙏）。

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/04.webp" />

## 联系人路由 UI

如果您点击侧边栏中的某个项目，您将看到默认的 404 页面。让我们创建一个匹配 URL `/contacts/1` 的路由。

👉 **创建 `app/routes` 目录和联系人路由模块**

```shellscript nonumber
mkdir app/routes
touch app/routes/contacts.\$contactId.tsx
```

在 Remix [路由文件约定][routes-file-conventions]中，`.` 会在 URL 中创建一个 `/`，而 `$` 使一个段变为动态。我们刚刚创建了一个将匹配如下 URL 的路由：

- `/contacts/123`
- `/contacts/abc`

👉 **添加联系人组件 UI**

这只是一些元素，随意复制/粘贴。

```tsx filename=app/routes/contacts.$contactId.tsx
import { Form } from "@remix-run/react";
import type { FunctionComponent } from "react";

import type { ContactRecord } from "../data";

export default function Contact() {
  const contact = {
    first: "Your",
    last: "Name",
    avatar: "https://placekitten.com/200/200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: true,
  };

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <a
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const favorite = contact.favorite;

  return (
    <Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
};
```

现在，如果我们点击其中一个链接或访问 `/contacts/1`，我们得到的 ... 没有新内容？

<img class="tutorial" loading="lazy" alt="contact route with blank main content" src="https://remix.run/docs-images/contacts/05.webp" />

## 嵌套路由和插座

由于 Remix 构建在 React Router 之上，它支持嵌套路由。为了使子路由在父布局中渲染，我们需要在父组件中渲染一个 [`Outlet`][outlet-component]。让我们来修复它，打开 `app/root.tsx` 并在里面渲染一个插座。

👉 **渲染一个 [`<Outlet />`][outlet-component]**

```tsx filename=app/root.tsx lines=[6,19-21]
// existing imports
import {
  Form,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

// existing imports & code

export default function App() {
  return (
    <html lang="en">
      {/* other elements */}
      <body>
        <div id="sidebar">{/* other elements */}</div>
        <div id="detail">
          <Outlet />
        </div>
        {/* other elements */}
      </body>
    </html>
  );
}
```

现在子路由应该通过插座渲染了。

<img class="tutorial" loading="lazy" alt="contact route with the main content" src="https://remix.run/docs-images/contacts/06.webp" />

## 客户端路由

您可能注意到了，也可能没有，但当我们点击侧边栏中的链接时，浏览器正在对下一个 URL 进行完整的文档请求，而不是客户端路由。

客户端路由允许我们的应用在不从服务器请求另一个文档的情况下更新 URL。相反，应用可以立即渲染新的 UI。让我们通过 [`<Link>`][link-component] 来实现这一点。

👉 **将侧边栏的 `<a href>` 改为 `<Link to>`**

```tsx filename=app/root.tsx lines=[4,24,27]
// existing imports
import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

// existing imports & exports

export default function App() {
  return (
    <html lang="en">
      {/* other elements */}
      <body>
        <div id="sidebar">
          {/* other elements */}
          <nav>
            <ul>
              <li>
                <Link to={`/contacts/1`}>Your Name</Link>
              </li>
              <li>
                <Link to={`/contacts/2`}>Your Friend</Link>
              </li>
            </ul>
          </nav>
        </div>
        {/* other elements */}
      </body>
    </html>
  );
}
```

您可以在浏览器开发者工具中打开网络选项卡，以查看它不再请求文档。

## 加载数据

URL 段、布局和数据往往是紧密结合在一起的（可能是三重结合？）。我们在这个应用中已经看到了这一点：

| URL 段              | 组件        | 数据               |
| ------------------- | ----------- | ------------------ |
| /                   | `<Root>`    | 联系人列表         |
| contacts/:contactId | `<Contact>` | 单个联系人         |

由于这种自然的耦合，Remix 有数据约定，可以轻松地将数据加载到你的路由组件中。

我们将使用两个 API 来加载数据，[`loader`][loader] 和 [`useLoaderData`][use-loader-data]。首先，我们将在根路由中创建并导出一个 `loader` 函数，然后渲染数据。

👉 **从 `app/root.tsx` 导出一个 `loader` 函数并渲染数据**

<docs-info>以下代码中存在类型错误，我们将在下一节中修复它</docs-info>

```tsx filename=app/root.tsx lines=[2,11,15,19-22,25,34-57]
// existing imports
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

// existing imports
import { getContacts } from "./data";

// existing exports

export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};

export default function App() {
  const { contacts } = useLoaderData();

  return (
    <html lang="en">
      {/* other elements */}
      <body>
        <div id="sidebar">
          {/* other elements */}
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>无名称</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>没有联系人</i>
              </p>
            )}
          </nav>
        </div>
        {/* other elements */}
      </body>
    </html>
  );
}
```

就是这样！Remix 现在将自动保持这些数据与您的 UI 同步。侧边栏现在应该看起来像这样：

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/07.webp" />

## 类型推断

您可能注意到 TypeScript 在 map 内部对 `contact` 类型发出警告。我们可以添加一个快速注释，以通过 `typeof loader` 获取关于我们数据的类型推断：

```tsx filename=app/root.tsx lines=[4]
// existing imports & exports

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();

  // existing code
}
```

## 加载器中的 URL 参数

👉 **点击侧边栏中的一个链接**

我们应该再次看到我们旧的静态联系页面，唯一的不同是：URL 现在有一个真实的记录 ID。

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/08.webp" />

还记得 `app/routes/contacts.$contactId.tsx` 文件名中的 `$contactId` 部分吗？这些动态段将匹配 URL 中该位置的动态（变化）值。我们称这些 URL 中的值为“URL 参数”，简称“参数”。

这些 [`params`][params] 通过与动态段匹配的键传递给加载器。例如，我们的段名为 `$contactId`，因此值将作为 `params.contactId` 传递。

这些参数通常用于通过 ID 查找记录。让我们试试看。

👉 **在联系页面添加 `loader` 函数，并使用 `useLoaderData` 访问数据**

<docs-info>以下代码存在类型错误，我们将在下一节中修复它们</docs-info>

```tsx filename=app/routes/contacts.$contactId.tsx lines=[1-2,5,7-10,13]
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
// existing imports

import { getContact } from "../data";

export const loader = async ({ params }) => {
  const contact = await getContact(params.contactId);
  return json({ contact });
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();

  // existing code
}

// existing code
```

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/10.webp" />

## 验证参数并抛出响应

TypeScript 对我们非常不满，让我们让它高兴起来，看看这迫使我们考虑什么：

```tsx filename=app/routes/contacts.$contactId.tsx lines=[1,3,7-10]
import type { LoaderFunctionArgs } from "@remix-run/node";
// existing imports
import invariant from "tiny-invariant";

// existing imports

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  return json({ contact });
};

// existing code
```

第一个问题是，我们可能在文件名和代码之间搞错了参数的名称（也许你更改了文件名！）。Invariant 是一个方便的函数，用于在你预期代码可能出现问题时抛出带有自定义消息的错误。

接下来，`useLoaderData<typeof loader>()` 现在知道我们得到了一个联系人或者 `null`（也许没有该 ID 的联系人）。这个潜在的 `null` 对我们的组件代码来说是麻烦的，TypeScript 错误仍然在飞来飞去。

我们可以在组件代码中考虑联系人未找到的可能性，但更合适的做法是发送一个正确的 404。我们可以在加载器中做到这一点，一次性解决所有问题。

```tsx filename=app/routes/contacts.$contactId.tsx lines=[8-10]
// existing imports

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

// existing code
```

现在，如果用户未找到，代码执行将停止，Remix 将渲染错误路径。Remix 中的组件可以只专注于正常路径 😁

## 数据变更

我们稍后会创建我们的第一个联系人，但首先让我们谈谈HTML。

Remix模拟HTML表单导航作为数据变更的基本操作，这曾是JavaScript寒武纪大爆发之前唯一的方法。不要被其简单性所迷惑！Remix中的表单为您提供了客户端渲染应用程序的用户体验能力，同时保留了“旧学校”网页模型的简单性。

虽然对一些网页开发者来说不太熟悉，但HTML `form` 实际上会在浏览器中引起导航，就像点击链接一样。唯一的区别在于请求：链接只能更改URL，而 `form` 还可以更改请求方法（`GET`与`POST`）和请求体（`POST`表单数据）。

在没有客户端路由的情况下，浏览器会自动序列化 `form` 的数据，并将其作为请求体发送到服务器以进行 `POST`，并以 [`URLSearchParams`][url-search-params] 的形式发送到服务器以进行 `GET`。Remix 也做同样的事情，只是它不是将请求发送到服务器，而是使用客户端路由将其发送到路由的 [`action`][action] 函数。

我们可以通过点击应用中的“新建”按钮来测试这一点。

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/09.webp" />

Remix发送了一个405，因为服务器上没有代码来处理此表单导航。

## 创建联系人

我们将通过在根路由中导出一个 `action` 函数来创建新的联系人。当用户点击“新建”按钮时，表单将 `POST` 到根路由的 action。

👉 **从 `app/root.tsx` 导出一个 `action` 函数**

```tsx filename=app/root.tsx lines=[3,5-8]
// existing imports

import { createEmptyContact, getContacts } from "./data";

export const action = async () => {
  const contact = await createEmptyContact();
  return json({ contact });
};

// existing code
```

就这样！继续点击“新建”按钮，你应该会看到一个新记录出现在列表中 🥳

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/11.webp" />

`createEmptyContact` 方法仅仅是创建一个没有名称或数据的空联系人。但它确实会创建一个记录，保证！

> 🧐 等一下……侧边栏是如何更新的？我们在哪里调用了 `action` 函数？哪里是重新获取数据的代码？`useState`、`onSubmit` 和 `useEffect` 又在哪里？！

这就是“老派网页”编程模型的体现。 [`<Form>`][form-component] 阻止浏览器将请求发送到服务器，而是将其发送到你的路由的 `action` 函数，并使用 [`fetch`][fetch]。

在网页语义中，`POST` 通常意味着一些数据正在改变。根据约定，Remix 将此作为提示，在 `action` 完成后自动重新验证页面上的数据。

事实上，由于这一切都只是 HTML 和 HTTP，你可以禁用 JavaScript，整个过程仍然可以正常工作。浏览器将序列化表单并发出文档请求，而不是让 Remix 序列化表单并向你的服务器发出 [`fetch`][fetch] 请求。最终，无论哪种方式，用户界面都是一样的。

不过我们会保留 JavaScript，因为我们要提供比旋转的 favicon 和静态文档更好的用户体验。

## 更新数据

让我们添加一种填写新记录信息的方法。

与创建数据一样，您可以使用 [`<Form>`][form-component] 更新数据。让我们在 `app/routes/contacts.$contactId_.edit.tsx` 创建一个新路由。

👉 **创建编辑组件**

```shellscript nonumber
touch app/routes/contacts.\$contactId_.edit.tsx
```

注意 `$contactId_` 中奇怪的 `_`。默认情况下，路由会自动嵌套在具有相同前缀名称的路由中。添加一个尾随的 `_` 告诉路由**不**嵌套在 `app/routes/contacts.$contactId.tsx` 中。有关更多信息，请参阅 [Route File Naming][routes-file-conventions] 指南。

👉 **添加编辑页面 UI**

没有我们没见过的内容，请随意复制/粘贴：

```tsx filename=app/routes/contacts.$contactId_.edit.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact } from "../data";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.contactId, "缺少 contactId 参数");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("未找到", { status: 404 });
  }
  return json({ contact });
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <Form key={contact.id} id="contact-form" method="post">
      <p>
        <span>姓名</span>
        <input
          defaultValue={contact.first}
          aria-label="名"
          name="first"
          type="text"
          placeholder="名"
        />
        <input
          aria-label="姓"
          defaultValue={contact.last}
          name="last"
          placeholder="姓"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>头像 URL</span>
        <input
          aria-label="头像 URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>备注</span>
        <textarea
          defaultValue={contact.notes}
          name="notes"
          rows={6}
        />
      </label>
      <p>
        <button type="submit">保存</button>
        <button type="button">取消</button>
      </p>
    </Form>
  );
}
```

现在点击您的新记录，然后点击“编辑”按钮。我们应该看到新路由。

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/12.webp" />

## 使用 `FormData` 更新联系人

我们刚创建的编辑路由已经渲染了一个 `form`。我们需要做的就是添加 `action` 函数。Remix 将序列化 `form`，使用 [`fetch`][fetch] 进行 `POST`，并自动重新验证所有数据。

👉 **向编辑路由添加 `action` 函数**

```tsx filename=app/routes/contacts.$contactId_.edit.tsx lines=[2,5,8,10-19]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
// existing imports

import { getContact, updateContact } from "../data";

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};

// existing code
```

填写表单，点击保存，你应该会看到类似这样的内容！<small>(除了更容易看，也许没那么复杂。)</small>

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/13.webp" />

## Mutation Discussion

> 😑 它有效，但我不知道这里发生了什么...

让我们深入一点...

打开 `contacts.$contactId_.edit.tsx` 并查看 `form` 元素。注意它们每个都有一个名称：

```tsx filename=app/routes/contacts.$contactId_.edit.tsx lines=[4]
<input
  defaultValue={contact.first}
  aria-label="First name"
  name="first"
  type="text"
  placeholder="First"
/>
```

在没有 JavaScript 的情况下，当表单被提交时，浏览器会创建 [`FormData`][form-data] 并将其设置为请求的主体，然后发送到服务器。如前所述，Remix 防止了这种情况，并通过 [`fetch`][fetch] 将请求发送到您的 `action` 函数，同时包括 [`FormData`][form-data]。

`form` 中的每个字段都可以通过 `formData.get(name)` 访问。例如，给定上面的输入字段，您可以这样访问名字和姓氏：

```tsx filename=app/routes/contacts.$contactId_.edit.tsx lines=[6,7] nocopy
export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const firstName = formData.get("first");
  const lastName = formData.get("last");
  // ...
};
```

由于我们有一些表单字段，我们使用 [`Object.fromEntries`][object-from-entries] 将它们收集到一个对象中，这正是我们的 `updateContact` 函数所需要的。

```tsx filename=app/routes/contacts.$contactId_.edit.tsx nocopy
const updates = Object.fromEntries(formData);
updates.first; // "Some"
updates.last; // "Name"
```

除了 `action` 函数，我们讨论的这些 API 都不是由 Remix 提供的：[`request`][request]、[`request.formData`][request-form-data]、[`Object.fromEntries`][object-from-entries] 都是由网络平台提供的。

在我们完成 `action` 后，请注意最后的 [`redirect`][redirect]：

```tsx filename=app/routes/contacts.$contactId_.edit.tsx lines=[9]
export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};
```

`action` 和 `loader` 函数都可以 [返回一个 `Response`][returning-response-instances]（这很合理，因为它们接收了一个 [`Request`][request]！）。[`redirect`][redirect] 助手只是使返回一个 [`Response`][response] 更容易，该响应告诉应用程序更改位置。

在没有客户端路由的情况下，如果服务器在 `POST` 请求后重定向，新页面将获取最新数据并进行渲染。正如我们之前所学，Remix 模拟了这种模型，并在 `action` 调用后自动重新验证页面上的数据。这就是为什么当我们保存表单时，侧边栏会自动更新。没有客户端路由的额外重新验证代码在这里不存在，因此在 Remix 中也不需要存在！

最后一件事。在没有 JavaScript 的情况下，[`redirect`][redirect] 将是一个普通的重定向。然而，使用 JavaScript 时，它是一个客户端重定向，因此用户不会丢失客户端状态，例如滚动位置或组件状态。

## 将新记录重定向到编辑页面

现在我们知道如何进行重定向，让我们更新创建新联系人的操作，以重定向到编辑页面：

👉 **重定向到新记录的编辑页面**

```tsx filename=app/root.tsx lines=[2,7]
// existing imports
import { json, redirect } from "@remix-run/node";
// existing imports

export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

// existing code
```

现在当我们点击“新建”时，我们应该会进入编辑页面：

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/14.webp" />

## 活动链接样式

现在我们有了一堆记录，但在侧边栏中不清楚我们正在查看哪一条。我们可以使用 [`NavLink`][nav-link] 来解决这个问题。

👉 **在侧边栏中将 `<Link>` 替换为 `<NavLink>`**

```tsx filename=app/root.tsx lines=[6,27-36,38]
// existing imports
import {
  Form,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

// existing imports and exports

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      {/* existing elements */}
      <body>
        <div id="sidebar">
          {/* existing elements */}
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id}>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : ""
                  }
                  to={`contacts/${contact.id}`}
                >
                  {/* existing elements */}
                </NavLink>
              </li>
            ))}
          </ul>
          {/* existing elements */}
        </div>
        {/* existing elements */}
      </body>
    </html>
  );
}
```

请注意，我们向 `className` 传递了一个函数。当用户处于与 `<NavLink to>` 匹配的 URL 时，`isActive` 将为 true。当它 _即将_ 变为活动状态（数据仍在加载中）时，`isPending` 将为 true。这使我们能够轻松指示用户的位置，并在点击链接但数据需要加载时提供即时反馈。

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/15.webp"/>

## 全局待处理 UI

当用户在应用程序中浏览时，Remix 会在加载下一个页面的数据时_保留旧页面_。您可能会注意到，在列表之间单击时，应用程序感觉有点无响应。让我们为用户提供一些反馈，以便应用程序不会感觉无响应。

Remix 在后台管理所有状态，并揭示您构建动态 Web 应用程序所需的部分。在这种情况下，我们将使用 [`useNavigation`][use-navigation] 钩子。

👉 **使用 `useNavigation` 添加全局待处理 UI**

```tsx filename=app/root.tsx lines=[11,18,26-28]
// existing imports
import {
  Form,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

// existing imports & exports

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <html lang="en">
      {/* existing elements */}
      <body>
        {/* existing elements */}
        <div
          className={
            navigation.state === "loading" ? "loading" : ""
          }
          id="detail"
        >
          <Outlet />
        </div>
        {/* existing elements */}
      </body>
    </html>
  );
}
```

[`useNavigation`][use-navigation] 返回当前导航状态：它可以是 `"idle"`、`"loading"` 或 `"submitting"` 之一。

在我们的案例中，如果我们不是空闲状态，则会将 `"loading"` 类添加到应用程序的主要部分。然后 CSS 在短暂延迟后添加了一个漂亮的淡入效果（以避免快速加载时的闪烁）。不过，您可以做任何您想做的事情，比如在顶部显示旋转器或加载条。

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/16.webp" />

## 删除记录

如果我们查看联系人路由中的代码，我们可以发现删除按钮看起来像这样：

```tsx filename=app/routes/contact.$contactId.tsx lines=[2]
<Form
  action="destroy"
  method="post"
  onSubmit={(event) => {
    const response = confirm(
      "请确认您要删除此记录。"
    );
    if (!response) {
      event.preventDefault();
    }
  }}
>
  <button type="submit">删除</button>
</Form>
```

注意 `action` 指向 `"destroy"`。与 `<Link to>` 类似，`<Form action>` 可以接受一个_相对_值。由于表单是在 `contacts.$contactId.tsx` 中渲染的，因此相对操作 `destroy` 将在点击时将表单提交到 `contacts.$contactId.destroy`。

此时您应该知道使删除按钮正常工作的所有必要信息。在继续之前，您可能想尝试一下？您需要：

1. 一个新的路由
2. 该路由的 `action`
3. 来自 `app/data.ts` 的 `deleteContact`
4. 重定向到某处

👉 **创建 "destroy" 路由模块**

```shellscript nonumber
touch app/routes/contacts.\$contactId.destroy.tsx
```

👉 **添加 destroy 操作**

```tsx filename=app/routes/contacts.$contactId.destroy.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteContact } from "../data";

export const action = async ({
  params,
}: ActionFunctionArgs) => {
  invariant(params.contactId, "缺少 contactId 参数");
  await deleteContact(params.contactId);
  return redirect("/");
};
```

好的，导航到一条记录并点击 "删除" 按钮。它有效！

> 😅 我仍然困惑为什么这一切都能正常工作

当用户点击提交按钮时：

1. `<Form>` 阻止了默认的浏览器行为，即向服务器发送新的文档 `POST` 请求，而是通过创建一个带有客户端路由的 `POST` 请求来模拟浏览器，并使用 [`fetch`][fetch]
2. `<Form action="destroy">` 匹配了 `"contacts.$contactId.destroy"` 的新路由并发送了请求
3. 在 `action` 重定向后，Remix 调用页面上所有的 `loader` 以获取最新的值（这就是 "重新验证"）。`useLoaderData` 返回新值并导致组件更新！

添加一个 `Form`，添加一个 `action`，Remix 会处理其余的。

## 索引路由

当我们加载应用时，您会注意到列表右侧有一个大空白页面。

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/17.webp" />

当一个路由有子路由，并且您处于父路由的路径时，`<Outlet>` 没有内容可渲染，因为没有子路由匹配。您可以将索引路由视为填充该空间的默认子路由。

👉 **为根路由创建一个索引路由**

```shellscript nonumber
touch app/routes/_index.tsx
```

👉 **填充索引组件的元素**

随意复制/粘贴，这里没有特别的内容。

```tsx filename=app/routes/_index.tsx
export default function Index() {
  return (
    <p id="index-page">
      This is a demo for Remix.
      <br />
      Check out{" "}
      <a href="https://remix.run">the docs at remix.run</a>.
    </p>
  );
}
```

路由名称 `_index` 是特殊的。它告诉 Remix 在用户处于父路由的确切路径时匹配并渲染此路由，因此在 `<Outlet />` 中没有其他子路由可渲染。

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/18.webp" />

瞧！没有更多的空白空间。通常在索引路由中放置仪表板、统计信息、动态信息等。它们也可以参与数据加载。

## 取消按钮

在编辑页面，我们有一个取消按钮，但目前它没有任何功能。我们希望它能执行与浏览器的返回按钮相同的操作。

我们需要在按钮上添加一个点击处理程序，以及 [`useNavigate`][use-navigate]。

👉 **使用 `useNavigate` 添加取消按钮的点击处理程序**

```tsx filename=app/routes/contacts.$contactId_.edit.tsx lines=[5,11,18]
// existing imports
import {
  Form,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
// existing imports & exports

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form key={contact.id} id="contact-form" method="post">
      {/* existing elements */}
      <p>
        <button type="submit">保存</button>
        <button onClick={() => navigate(-1)} type="button">
          取消
        </button>
      </p>
    </Form>
  );
}
```

现在，当用户点击“取消”时，他们将返回浏览器历史记录中的一个条目。

> 🧐 为什么按钮上没有 `event.preventDefault()`？

`<button type="button">` 虽然看似多余，但这是HTML防止按钮提交其表单的方式。

还有两个功能要实现。我们快到了最后阶段！

## `URLSearchParams` 和 `GET` 提交

到目前为止，我们的所有交互式 UI 都是链接，改变 URL 或者 `form`，将数据发送到 `action` 函数。搜索字段很有趣，因为它是两者的混合：它是一个 `form`，但它只改变 URL，而不改变数据。

让我们看看提交搜索表单时会发生什么：

👉 **在搜索字段中输入一个名字并按下回车键**

请注意，浏览器的 URL 现在包含了你的查询，形式为 [`URLSearchParams`][url-search-params]：

```
http://localhost:5173/?q=ryan
```

由于它不是 `<Form method="post">`，Remix 通过将 [`FormData`][form-data] 序列化为 [`URLSearchParams`][url-search-params]，而不是请求体，来模拟浏览器。

`loader` 函数可以访问来自 `request` 的搜索参数。让我们利用它来过滤列表：

👉 **如果有 `URLSearchParams`，则过滤列表**

```tsx filename=app/root.tsx lines=[3,8-13]
import type {
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";

// existing imports & exports

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts });
};

// existing code
```

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/19.webp" />

因为这是一个 `GET`，而不是 `POST`，Remix _不_ 调用 `action` 函数。提交一个 `GET` `form` 与点击链接是一样的：只有 URL 发生了变化。

这也意味着这是一次正常的页面导航。你可以点击后退按钮回到之前的位置。

## 同步 URL 与表单状态

这里有几个用户体验问题，我们可以快速解决。

1. 如果在搜索后点击返回，表单字段仍然保留您输入的值，即使列表不再被过滤。
2. 如果在搜索后刷新页面，表单字段不再有值，即使列表被过滤。

换句话说，URL 和我们的输入状态不同步。

让我们先解决（2），并从 URL 中获取值作为输入的默认值。

👉 **从您的 `loader` 返回 `q`，将其设置为输入的默认值**

```tsx filename=app/root.tsx lines=[9,13,26]
// existing imports & exports

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <html lang="en">
      {/* existing elements */}
      <body>
        <div id="sidebar">
          {/* existing elements */}
          <div>
            <Form id="search-form" role="search">
              <input
                aria-label="搜索联系人"
                defaultValue={q || ""}
                id="q"
                name="q"
                placeholder="搜索"
                type="search"
              />
              {/* existing elements */}
            </Form>
            {/* existing elements */}
          </div>
          {/* existing elements */}
        </div>
        {/* existing elements */}
      </body>
    </html>
  );
}
```

现在，如果您在搜索后刷新页面，输入字段将显示查询。

现在解决问题（1），点击后退按钮并更新输入。我们可以从 React 中引入 `useEffect` 直接操作 DOM 中的输入值。

👉 **将输入值与 `URLSearchParams` 同步**

```tsx filename=app/root.tsx lines=[2,10-15]
// existing imports
import { useEffect } from "react";

// existing imports & exports

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  // existing code
}
```

> 🤔 难道不应该使用受控组件和 React 状态吗？

您当然可以将其作为受控组件来实现。您将有更多的同步点，但这取决于您。

<details>

<summary>展开以查看它会是什么样子</summary>

```tsx filename=app/root.tsx lines=[2,9-10,12-16,30-33,36-37]
// existing imports
import { useEffect, useState } from "react";

// existing imports & exports

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  // 现在需要将查询保存在状态中
  const [query, setQuery] = useState(q || "");

  // 我们仍然有一个 `useEffect` 来同步查询
  // 在点击后退/前进按钮时更新组件状态
  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  return (
    <html lang="en">
      {/* existing elements */}
      <body>
        <div id="sidebar">
          {/* existing elements */}
          <div>
            <Form id="search-form" role="search">
              <input
                aria-label="搜索联系人"
                id="q"
                name="q"
                // 将用户输入同步到组件状态
                onChange={(event) =>
                  setQuery(event.currentTarget.value)
                }
                placeholder="搜索"
                type="search"
                // 从 `defaultValue` 切换到 `value`
                value={query}
              />
              {/* existing elements */}
            </Form>
            {/* existing elements */}
          </div>
          {/* existing elements */}
        </div>
        {/* existing elements */}
      </body>
    </html>
  );
}
```

</details>

好了，您现在应该能够点击后退/前进/刷新按钮，并且输入的值应该与 URL 和结果保持同步。

## 提交 `Form` 的 `onChange`

我们在这里需要做出一个产品决策。有时候你希望用户提交 `form` 以过滤一些结果，而其他时候你希望在用户输入时进行过滤。我们已经实现了前者，现在让我们看看后者的情况。

我们已经见过 `useNavigate`，这次我们将使用它的兄弟 [`useSubmit`][use-submit]。

```tsx filename=app/root.tsx lines=[12,19,32-34]
// existing imports
import {
  Form,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
// existing imports & exports

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();

  // existing code

  return (
    <html lang="en">
      {/* existing elements */}
      <body>
        <div id="sidebar">
          {/* existing elements */}
          <div>
            <Form
              id="search-form"
              onChange={(event) =>
                submit(event.currentTarget)
              }
              role="search"
            >
              {/* existing elements */}
            </Form>
            {/* existing elements */}
          </div>
          {/* existing elements */}
        </div>
        {/* existing elements */}
      </body>
    </html>
  );
}
```

现在，当你输入时，`form` 会自动提交！

请注意 [`submit`][use-submit] 的参数。`submit` 函数会序列化并提交你传递给它的任何表单。我们传入的是 `event.currentTarget`。`currentTarget` 是事件附加到的 DOM 节点（即 `form`）。

## 添加搜索加载指示器

在生产应用中，搜索通常会在一个过大而无法一次性发送并在客户端过滤的数据库中查找记录。这就是为什么这个演示会有一些伪造的网络延迟。

没有任何加载指示器时，搜索感觉有些迟缓。即使我们能让数据库更快，用户的网络延迟始终是我们无法控制的障碍。

为了提供更好的用户体验，让我们为搜索添加一些即时的用户界面反馈。我们将再次使用 [`useNavigation`][use-navigation]。

👉 **添加一个变量以知道我们是否正在搜索**

```tsx filename=app/root.tsx lines=[7-11]
// existing imports & exports

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  // existing code
}
```

当没有任何操作时，`navigation.location` 将是 `undefined`，但当用户导航时，它将被填充为数据加载时的下一个位置。然后我们通过 `location.search` 检查他们是否在搜索。

👉 **使用新的 `searching` 状态为搜索表单元素添加类**

```tsx filename=app/root.tsx lines=[22,31]
// existing imports & exports

export default function App() {
  // existing code

  return (
    <html lang="en">
      {/* existing elements */}
      <body>
        <div id="sidebar">
          {/* existing elements */}
          <div>
            <Form
              id="search-form"
              onChange={(event) =>
                submit(event.currentTarget)
              }
              role="search"
            >
              <input
                aria-label="Search contacts"
                className={searching ? "loading" : ""}
                defaultValue={q || ""}
                id="q"
                name="q"
                placeholder="Search"
                type="search"
              />
              <div
                aria-hidden
                hidden={!searching}
                id="search-spinner"
              />
            </Form>
            {/* existing elements */}
          </div>
          {/* existing elements */}
        </div>
        {/* existing elements */}
      </body>
    </html>
  );
}
```

额外加分，避免在搜索时淡出主屏幕：

```tsx filename=app/root.tsx lines=[13]
// existing imports & exports

export default function App() {
  // existing code

  return (
    <html lang="en">
      {/* existing elements */}
      <body>
        {/* existing elements */}
        <div
          className={
            navigation.state === "loading" && !searching
              ? "loading"
              : ""
          }
          id="detail"
        >
          <Outlet />
        </div>
        {/* existing elements */}
      </body>
    </html>
  );
}
```

现在你应该在搜索输入框的左侧有一个漂亮的加载指示器。

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/20.webp" />

## 管理历史栈

由于每次按键都会提交表单，输入字符“alex”然后用退格键删除它们会导致历史栈变得非常庞大 😂。我们绝对不想要这个：

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/21.webp" />

我们可以通过_替换_历史栈中的当前条目来避免这种情况，而不是将其推入历史栈。

👉 **在 `submit` 中使用 `replace`**

```tsx filename=app/root.tsx lines=[16-19]
// existing imports & exports

export default function App() {
  // existing code

  return (
    <html lang="en">
      {/* existing elements */}
      <body>
        <div id="sidebar">
          {/* existing elements */}
          <div>
            <Form
              id="search-form"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
              role="search"
            >
              {/* existing elements */}
            </Form>
            {/* existing elements */}
          </div>
          {/* existing elements */}
        </div>
        {/* existing elements */}
      </body>
    </html>
  );
}
```

在快速检查这是否是第一次搜索后，我们决定进行替换。现在第一次搜索将添加一个新条目，但之后的每次按键将替换当前条目。用户只需点击一次返回，而不是点击7次来移除搜索。

## `Form` 无需导航

到目前为止，我们的所有表单都更改了 URL。虽然这些用户流程很常见，但同样常见的是希望提交表单 _而不_ 引起导航。

对于这些情况，我们有 [`useFetcher`][use-fetcher]。它允许我们与 `action` 和 `loader` 通信，而不引起导航。

联系页面上的 ★ 按钮对此很有意义。我们并不是在创建或删除新记录，也不想更改页面。我们只是想更改我们正在查看的页面上的数据。

👉 **将 `<Favorite>` 表单更改为 fetcher 表单**

```tsx filename=app/routes/contacts.$contactId.tsx lines=[4,14,18,30]
// existing imports
import {
  Form,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
// existing imports & exports

// existing code

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const fetcher = useFetcher();
  const favorite = contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={
          favorite
            ? "从收藏中移除"
            : "添加到收藏"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};
```

这个表单将不再引起导航，而只是向 `action` 发起请求。说到这一点……在我们创建 `action` 之前，这不会工作。

👉 **创建 `action`**

```tsx filename=app/routes/contacts.$contactId.tsx lines=[2,7,10-19]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
// existing imports

import { getContact, updateContact } from "../data";
// existing imports

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  invariant(params.contactId, "缺少 contactId 参数");
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
};

// existing code
```

好了，我们准备点击用户姓名旁边的星星了！

<img class="tutorial" loading="lazy" src="https://remix.run/docs-images/contacts/22.webp" />

看看这个，两个星星都会自动更新。我们的新 `<fetcher.Form method="post">` 几乎和我们一直使用的 `<Form>` 一样：它调用 action，然后所有数据都会自动重新验证——即使是你的错误也会以相同的方式被捕获。

不过有一个关键的区别，它不是导航，因此 URL 不会更改，历史记录栈也不会受到影响。

## 乐观用户界面

你可能注意到，在我们点击上一个部分的收藏按钮时，应用程序感觉有些无响应。我们再次添加了一些网络延迟，因为在真实世界中你会遇到这种情况。

为了给用户一些反馈，我们可以使用 [`fetcher.state`][fetcher-state] 将星星置于加载状态（这与之前的 `navigation.state` 很相似），但这次我们可以做得更好。我们可以使用一种称为“乐观用户界面”的策略。

fetcher 知道被提交到 `action` 的 [`FormData`][form-data]，因此它在 `fetcher.formData` 中可用。我们将利用这一点立即更新星星的状态，即使网络尚未完成。如果更新最终失败，用户界面将恢复为真实数据。

👉 **从 `fetcher.formData` 读取乐观值**

```tsx filename=app/routes/contacts.$contactId.tsx lines=[7-9]
// existing code

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={
          favorite
            ? "从收藏中移除"
            : "添加到收藏"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};
```

现在，星星在你点击时会 _立即_ 更改为新状态。

---

就这些！感谢你尝试 Remix。我们希望这个教程能为你构建出色的用户体验奠定坚实的基础。你可以做很多事情，所以一定要查看所有的 API 😀