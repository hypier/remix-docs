---
title: 介绍，技术说明
order: 1
---

# 介绍，技术说明

基于 [React Router][react_router]，Remix 有四个方面：

1. 编译器
2. 服务器端 HTTP 处理程序
3. 服务器框架
4. 浏览器框架

## 编译器

Remix 的一切都始于编译器：`remix vite:build`。使用 [Vite]，这会创建以下内容：

1. 一个服务器 HTTP 处理程序，通常在 `build/server/index.js`（可配置），它将所有路由和模块汇集在一起，以便能够在服务器上渲染并处理任何其他服务器端请求的资源。
2. 一个浏览器构建，通常在 `build/client/*`。这包括按路由自动代码分割、指纹资产导入（如 CSS 和图像）等。任何在浏览器中运行应用程序所需的内容。
3. 一个资产清单。客户端和服务器都使用此清单来了解整个依赖关系图。这对于在初始服务器渲染时预加载资源以及为客户端过渡预取资源非常有用。这就是 Remix 能够消除当今网络应用程序中常见的渲染+获取瀑布流的方式。

有了这些构建产物，应用程序可以部署到任何运行 JavaScript 的托管服务。

## HTTP 处理程序和适配器

虽然 Remix 在服务器上运行，但它实际上并不是一个服务器。它只是一个交给实际 JavaScript 服务器的处理程序。

它是基于 [Web Fetch API][fetch] 构建的，而不是 Node.js。这使得 Remix 可以在任何 Node.js 服务器上运行，如 [Vercel][vercel]、[Netlify][netlify]、[Architect][arc] 等，以及非 Node.js 环境，如 [Cloudflare Workers][cf] 和 [Deno Deploy][deno]。

这就是 Remix 在 express 应用中运行时的样子：

```ts lines=[2,6-9]
const remix = require("@remix-run/express");
const express = require("express");

const app = express();

app.all(
  "*",
  remix.createRequestHandler({
    build: require("./build/server"),
  })
);
```

Express（或 Node.js）是实际的服务器，Remix 只是该服务器上的一个处理程序。`"@remix-run/express"` 包被称为适配器。Remix 处理程序是与服务器无关的。适配器通过在请求进入时将服务器的请求/响应 API 转换为 Fetch API，然后将来自 Remix 的 Fetch 响应适配为服务器的响应 API，使它们在特定服务器上工作。以下是适配器所做的伪代码：

```ts
export function createRequestHandler({ build }) {
  // creates a Fetch API request handler from the server build
  const handleRequest = createRemixRequestHandler(build);

  // returns an express.js specific handler for the express server
  return async (req, res) => {
    // adapts the express.req to a Fetch API request
    const request = createRemixRequest(req);

    // calls the app handler and receives a Fetch API response
    const response = await handleRequest(request);

    // adapts the Fetch API response to the express.res
    sendRemixResponse(res, response);
  };
}
```

真正的适配器比这多做了一些，但这就是要点。这不仅使您能够在任何地方部署 Remix，还允许您在现有的 JavaScript 服务器中逐步采用它，因为您可以在 Remix 之前处理服务器的路由。

此外，如果 Remix 还没有适配器供您的服务器使用，您可以查看其中一个适配器的源代码并构建自己的适配器。

## 服务器框架

如果你熟悉像 Rails 和 Laravel 这样的服务器端 MVC Web 框架，Remix 就是视图和控制器，但模型由你来决定。JavaScript 生态系统中有很多优秀的数据库、ORM、邮件发送工具等可以填补这个空白。Remix 还提供了关于 Fetch API 的 cookie 和会话管理的辅助工具。

Remix 路由模块承担了视图和控制器的双重职责，而不是将它们分开。

大多数服务器端框架都是“以模型为中心”的。控制器管理一个模型的 _多个 URL_。

Remix 是 _以 UI 为中心_ 的。路由可以处理整个 URL 或仅处理 URL 的一部分。当路由仅映射到一个片段时，嵌套的 URL 片段就成为 UI 中的嵌套布局。通过这种方式，每个布局（视图）都可以作为自己的控制器，然后 Remix 将聚合数据和组件以构建完整的 UI。

通常情况下，Remix 路由模块可以在同一个文件中同时包含 UI 和与模型的交互，这带来了非常好的开发者体验和生产力。

路由模块有三个主要导出：`loader`、`action` 和 `default`（组件）。

```tsx
// Loaders only run on the server and provide data
// to your component on GET requests
export async function loader() {
  return json(await db.projects.findAll());
}

// The default export is the component that will be
// rendered when a route matches the URL. This runs
// both on the server and the client
export default function Projects() {
  const projects = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      {projects.map((project) => (
        <Link key={project.slug} to={project.slug}>
          {project.title}
        </Link>
      ))}

      <Form method="post">
        <input name="title" />
        <button type="submit">Create New Project</button>
      </Form>
      {actionData?.errors ? (
        <ErrorMessages errors={actionData.errors} />
      ) : null}

      {/* outlets render the nested child routes
          that match the URL deeper than this route,
          allowing each layout to co-locate the UI and
          controller code in the same file */}
      <Outlet />
    </div>
  );
}

// Actions only run on the server and handle POST
// PUT, PATCH, and DELETE. They can also provide data
// to the component
export async function action({
  request,
}: ActionFunctionArgs) {
  const form = await request.formData();
  const errors = validate(form);
  if (errors) {
    return json({ errors });
  }
  await createProject({ title: form.get("title") });
  return json({ ok: true });
}
```

实际上，你可以仅将 Remix 用作服务器端框架，而根本不使用任何浏览器 JavaScript。使用 `loader` 进行数据加载、使用 `action` 进行变更和 HTML 表单，以及在 URL 渲染的组件的路由约定，可以提供许多 Web 项目的核心功能集。

通过这种方式，**Remix 可以缩减**。你应用中的每个页面都不需要在浏览器中加载大量 JavaScript，并且并非每个用户交互都需要比浏览器的默认行为更多的花样。在 Remix 中，你可以先以简单的方式构建，然后在不改变基本模型的情况下扩展。此外，应用的大部分功能在 JavaScript 加载到浏览器之前就已经可以工作，这使得 Remix 应用在设计上对网络状况不佳具有抗干扰能力。

如果你不熟悉传统的后端 Web 框架，可以将 Remix 路由视为已经是自己 API 路由的 React 组件，并且已经知道如何在服务器上加载和提交数据。

## 浏览器框架

一旦 Remix 将文档发送到浏览器，它就会用浏览器构建的 JavaScript 模块“水合”页面。这就是我们常常讨论 Remix “模拟浏览器”的地方。

当用户点击链接时，Remix 不会为整个文档和所有资产进行往返服务器请求，而是简单地获取下一页的数据并更新 UI。

此外，当用户提交 `<Form>` 以更新数据时，浏览器运行时将会向服务器发起请求，而不是进行常规的 HTML 文档请求，并自动重新验证页面上的所有数据并使用 React 更新它。

与进行完整文档请求相比，这种方式具有许多性能优势：

1. 资产不需要重新下载（或从缓存中提取）
2. 资产不需要再次被浏览器解析
3. 获取的数据远小于整个文档（有时小几个数量级）
4. 因为 Remix 增强了 HTML API（`<a>` 和 `<form>`），所以您的应用在 JavaScript 加载之前就能正常工作

Remix 还内置了一些针对客户端导航的优化。它知道在两个 URL 之间哪些布局会保持不变，因此只会获取正在更改的那些数据。完整文档请求将要求在服务器上获取所有数据，这会浪费后端资源并减慢应用的速度。

这种方法还具有用户体验的好处，比如不重置侧边导航的滚动位置，并允许您将焦点移动到比文档顶部更合适的地方。

当用户即将点击链接时，Remix 还可以预取页面的所有资源。浏览器框架了解编译器的资产清单。它可以匹配链接的 URL，读取清单，然后预取下一页的所有数据、JavaScript 模块，甚至 CSS 资源。这就是为什么 Remix 应用在网络缓慢时仍然感觉快速的原因。

然后，Remix 提供客户端 API，因此您可以在不改变 HTML 和浏览器基本模型的情况下创建丰富的用户体验。

以我们之前的路由模块为例，这里有一些小而有用的用户体验改进，您只能在浏览器中使用 JavaScript 实现：

1. 在表单提交时禁用按钮
2. 当服务器端表单验证失败时聚焦输入框
3. 动画显示错误信息

```tsx lines=[4-6,8-12,23-26,30-32] nocopy
export default function Projects() {
  const projects = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { state } = useNavigation();
  const busy = state === "submitting";
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (actionData.errors) {
      inputRef.current.focus();
    }
  }, [actionData]);

  return (
    <div>
      {projects.map((project) => (
        <Link key={project.slug} to={project.slug}>
          {project.title}
        </Link>
      ))}

      <Form method="post">
        <input ref={inputRef} name="title" />
        <button type="submit" disabled={busy}>
          {busy ? "Creating..." : "Create New Project"}
        </button>
      </Form>

      {actionData?.errors ? (
        <FadeIn>
          <ErrorMessages errors={actionData.errors} />
        </FadeIn>
      ) : null}

      <Outlet />
    </div>
  );
}
```

这个代码示例最有趣的地方在于它是**仅增量的**。整个交互在根本上仍然是相同的，甚至在 JavaScript 加载之前也能正常工作，唯一的区别是用户反馈将由浏览器提供（旋转的 favicon 等），而不是应用程序（`useNavigation().state`）。

由于 Remix 深入后端的控制器级别，它可以无缝地做到这一点。

虽然它并没有像 Rails 和 Laravel 等服务器端框架那样深入堆栈，但它确实在堆栈中更高的层面上深入浏览器，使后端到前端的过渡变得无缝。

例如，在一个后端重的 Web 框架中构建一个普通的 HTML 表单和服务器端处理程序与在 Remix 中一样简单。但是，一旦您想要进入具有动画验证消息、焦点管理和待处理 UI 的体验，就需要对代码进行根本性的更改。通常，人们会构建一个 API 路由，然后引入一小部分客户端 JavaScript 将二者连接起来。使用 Remix，您只需在现有的“服务器端视图”周围添加一些代码，而不改变其基本工作方式。浏览器运行时接管服务器通信，以提供超出默认浏览器行为的增强用户体验。

我们借用了一个旧术语，称之为 Remix 中的渐进增强。从一个普通的 HTML 表单开始（Remix 向下扩展），然后在您有时间和雄心时将 UI 扩展。 

[vite]: https://vitejs.dev
[cf]: https://workers.cloudflare.com/
[deno]: https://deno.com/deploy/docs
[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[vercel]: https://vercel.com
[netlify]: https://netlify.com
[arc]: https://arc.codes
[react_router]: https://reactrouter.com