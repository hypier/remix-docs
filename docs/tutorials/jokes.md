---
title: 应用教程（长）
position: 4
hidden: true
---

# 笑话应用教程

<docs-warning>本教程目前假设您使用的是[Classic Remix Compiler][classic-remix-compiler]而不是[Remix Vite][remix-vite]。</docs-warning>

想学习Remix吗？您来对地方了。让我们来构建[Remix Jokes][remix-jokes]！

<docs-info><a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=hsIWJpuxNj0">在这个直播中与Kent一起完成本教程</a></docs-info>

<a href="https://remix-jokes.lol"><img src="https://remix-jokes.lol/social.png" style="aspect-ratio: 300 / 157; width: 100%"/></a>

本教程是全面了解Remix中可用主要API的方式。到最后，您将拥有一个完整的应用程序，可以展示给您的妈妈、伴侣或狗，我相信他们会和您一样对Remix感到兴奋（虽然我不做任何保证）。

我们将专注于Remix。这意味着我们将跳过一些与我们希望您学习的Remix核心理念无关的内容。例如，我们会向您展示如何在页面上获取CSS样式表，但我们不会让您自己编写样式。因此，我们会给您一些可以复制/粘贴的内容。不过，如果您更喜欢自己写，那也是完全可以的（只是会花费您更多时间）。所以我们会把它放在小的`<details>`元素中，您需要点击以展开，以免破坏任何内容，如果您更喜欢自己编码的话。

<details>

<summary>点击我</summary>

在教程中有几个地方我们将代码放在这些`<details>`元素后面。这是为了让您选择想要进行多少复制/粘贴，而不会被我们破坏。我们不建议您在与Remix无关的概念上挣扎，比如猜测使用什么类名。完成教程的主要内容后，随时可以参考这些部分来检查您的工作。或者如果您想快速浏览，也可以在进行时直接复制/粘贴内容。我们不会对您进行评判！

</details>

在整个教程中，我们将链接到各种文档（包括Remix文档以及关于[MDN][mdn]的网页文档）（如果您还没有使用MDN，您会发现自己在使用Remix时会使用它很多，并且在此过程中提高您的网页技能）。如果您遇到困难，请确保查看您可能跳过的任何文档链接。本教程的部分目标是让您熟悉Remix和网页API文档，因此如果文档中有解释的内容，您将链接到那些文档，而不是在这里重新解释。

本教程将使用TypeScript。随意跟随并跳过/删除TypeScript部分。我们发现使用TypeScript时Remix会变得更好，特别是因为我们还将使用[Prisma][prisma]从SQLite数据库访问我们的数据模型。

<docs-info>💿 你好，我是Remix Disc的Rachel。每当您需要实际执行某些操作时，我会出现。</docs-info>

<docs-warning>在您探索的过程中，请随意，但如果您偏离教程太多（例如在到达该步骤之前尝试部署），您可能会发现它的工作方式与您预期的不同，因为您错过了一些重要内容。</docs-warning>

<docs-error>我们不会在浏览器中添加JavaScript，直到教程接近尾声。这是为了向您展示当JavaScript加载时间过长（或根本无法加载）时，您的应用程序将如何正常工作。因此，在我们实际将JavaScript添加到页面之前，您将无法使用`useState`等内容，直到我们到达该步骤。</docs-error>

## 大纲

以下是我们将在本教程中涵盖的主题：

- 生成一个新的 Remix 项目
- 常规文件
- 路由（包括嵌套路由 ✨）
- 样式
- 数据库交互（通过 `sqlite` 和 `prisma`）
- 变更
- 验证
- 身份验证
- 错误处理：包括意外错误（开发者犯的错误）和预期错误（最终用户犯的错误）
- 使用 Meta 标签进行 SEO
- JavaScript...
- 资源路由
- 部署

您可以在导航栏中找到教程各个部分的链接（移动设备在页面顶部，桌面设备在右侧）。

## 前提条件

您可以在 [CodeSandbox][code-sandbox]（一个很棒的在线编辑器）上或在自己电脑上跟随本教程。如果您选择 CodeSandbox 的方法，那么您只需要良好的互联网连接和现代浏览器。如果您选择本地运行，那么您需要安装一些东西：

- [Node.js][node-js] 版本 (>=18.0.0)
- [npm][npm] 7 或更高版本
- 一个代码编辑器（[VSCode][vs-code] 是一个不错的选择）

如果您想在最后的部署步骤中一起操作，您还需要一个 [Fly.io][fly-io] 的账户。

我们还将在您的系统命令行/终端界面中执行命令。因此，您需要熟悉这一点。

假设您对 React 和 TypeScript/JavaScript 有一些经验。如果您想复习一下自己的知识，可以查看这些资源：

- [JavaScript to know for React][java-script-to-know-for-react]
- [The Beginner's Guide to React][the-beginner-s-guide-to-react]

对 [HTTP API][the-http-api] 有良好的理解也是有帮助的，但不是绝对必要的。

这样，我想我们可以开始了！

## 生成一个新的 Remix 项目

<docs-info>

如果您打算使用 CodeSandbox，可以使用 [基本示例][the-basic-example] 来开始。

</docs-info>

💿 打开您的终端并运行以下命令：

```shellscript nonumber
npx create-remix@latest
```

<docs-info>

这可能会询问您是否要安装 `create-remix@latest`。输入 `y`。它只会在第一次运行设置脚本时安装。

</docs-info>

一旦设置脚本运行完毕，它会询问您几个问题。我们将应用命名为 "remix-jokes"，选择初始化一个 Git 仓库并让它为我们运行安装：

```
Where should we create your new project?
remix-jokes

Initialize a new git repository?
Yes

Install dependencies with npm?
Yes
```

Remix 可以部署在越来越多的 JavaScript 环境中。“Remix App Server”是一个基于 [Express][express] 的全功能 [Node.js][node-js] 服务器。它是最简单的选项，满足大多数人的需求，因此我们在本教程中选择这个。未来可以随意尝试其他选项！

一旦 `npm install` 完成，我们将切换到 `remix-jokes` 目录：

💿 运行此命令

```shellscript nonumber
cd remix-jokes
```

现在您在 `remix-jokes` 目录中。从现在开始，您运行的所有其他命令都将在该目录中进行。

💿 很好，现在在您喜欢的编辑器中打开它，让我们稍微探索一下项目结构。

## 探索项目结构

这是树形结构。希望你看到的结构与此类似：

```
remix-jokes
├── README.md
├── app
│   ├── entry.client.tsx
│   ├── entry.server.tsx
│   ├── root.tsx
│   └── routes
│       └── _index.tsx
├── package-lock.json
├── package.json
├── public
│   └── favicon.ico
├── remix.config.js
├── remix.env.d.ts
└── tsconfig.json
```

让我们简要讨论一下这些文件：

- `app/` - 这是你所有 Remix 应用代码的地方
- `app/entry.client.tsx` - 这是当应用在浏览器中加载时运行的第一段 JavaScript。我们使用这个文件来 [hydrate][hydrate] 我们的 React 组件。
- `app/entry.server.tsx` - 这是当请求到达你的服务器时运行的第一段 JavaScript。Remix 处理加载所有必要的数据，而你负责发送响应。我们将使用这个文件将我们的 React 应用渲染为字符串/流，并将其作为响应发送给客户端。
- `app/root.tsx` - 这是我们放置应用程序根组件的地方。你在这里渲染 `<html>` 元素。
- `app/routes/` - 这是你所有“路由模块”的位置。Remix 使用该目录中的文件根据文件名创建应用程序的 URL 路由。
- `public/` - 这是你的静态资源所在的位置（图片/字体/等）。
- `remix.config.js` - Remix 在这个文件中有一些配置选项可以设置。

💿 现在让我们运行构建：

```shellscript nonumber
npm run build
```

这应该会输出类似于以下内容：

```
Building Remix app in production mode...
Built in 132ms
```

现在你应该还有一个 `.cache/` 目录（这是 Remix 内部使用的东西），一个 `build/` 目录，以及一个 `public/build` 目录。`build/` 目录是我们的服务器端代码。`public/build/` 存放我们所有的客户端代码。这三个目录在你的 `.gitignore` 文件中列出，因此你不会将生成的文件提交到源代码管理中。

💿 现在让我们运行构建好的应用：

```shellscript nonumber
npm start
```

这将启动服务器并输出：

```
Remix App Server started at http://localhost:3000
```

打开该 URL，你应该会看到一个指向一些文档的最小页面。

💿 现在停止服务器并删除该目录：

- `app/routes`

我们将把这个简化到最基本的结构，并逐步引入内容。

💿 用以下内容替换 `app/root.tsx` 的内容：

```tsx filename=app/root.tsx
import { LiveReload } from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>Remix: So great, it's funny!</title>
      </head>
      <body>
        Hello world
        <LiveReload />
      </body>
    </html>
  );
}
```

<docs-info>

`<LiveReload />` 组件在开发过程中非常有用，它会在我们进行更改时自动刷新浏览器。由于我们的构建服务器非常快，重新加载通常会在你注意到之前就发生 ⚡

</docs-info>

你的 `app/` 目录现在应该看起来像这样：

```
app
├── entry.client.tsx
├── entry.server.tsx
└── root.tsx
```

💿 设置完成后，使用以下命令启动开发服务器：

```shellscript nonumber
npm run dev
```

打开 [http://localhost:3000][http-localhost-3000]，应用程序应该会向世界问好：

![Bare bones hello world app][bare-bones-hello-world-app]

很好，现在我们准备开始逐步添加内容。

## 路由

我们首先要做的是设置我们的路由结构。以下是我们的应用将要拥有的所有路由：

```
/
/jokes
/jokes/:jokeId
/jokes/new
/login
```

您可以通过 [`remix.config.js`][remix-config-js] 以编程方式创建路由，但创建路由的更常见方法是通过文件系统。这被称为“基于文件的路由”。

我们放在 `app/routes` 目录中的每个文件称为路由模块，通过遵循 [路由文件名约定][the-route-filename-convention]，我们可以创建所需的路由 URL 结构。Remix 在底层使用 [React Router][react_router] 来处理这些路由。

💿 让我们从索引路由 (`/`) 开始。为此，在 `app/routes/_index.tsx` 创建一个文件，并从该路由模块中 `export default` 一个组件。现在，您可以让它只显示“Hello Index Route”或类似内容。

<details>

<summary>app/routes/_index.tsx</summary>

```tsx filename=app/routes/_index.tsx
export default function IndexRoute() {
  return <div>Hello Index Route</div>;
}
```

</details>

React Router 支持“嵌套路由”，这意味着我们的路由中有父子关系。`app/routes/_index.tsx` 是 `app/root.tsx` 路由的子路由。在嵌套路由中，父路由负责布局其子路由。

💿 更新 `app/root.tsx` 以定位子路由。您将使用来自 `@remix-run/react` 的 `<Outlet />` 组件来实现这一点：

<details>

<summary>app/root.tsx</summary>

```tsx filename=app/root.tsx lines=[1,15]
import { LiveReload, Outlet } from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>Remix: So great, it's funny!</title>
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
```

</details>

<docs-info>记得使用 `npm run dev` 运行开发服务器</docs-info>

这将监视您的文件系统以进行更改，重建站点，并且由于 `<LiveReload />` 组件，您的浏览器将刷新。

💿 继续打开网站，您应该会看到来自索引路由的问候。

![来自索引路由的问候][a-greeting-from-the-index-route]

太好了！接下来我们来处理 `/jokes` 路由。

💿 在 `app/routes/jokes.tsx` 创建一个新路由（请记住，这将是一个父路由，因此您需要再次使用 `<Outlet />`）。

<details>

<summary>app/routes/jokes.tsx</summary>

```tsx filename=app/routes/jokes.tsx
import { Outlet } from "@remix-run/react";

export default function JokesRoute() {
  return (
    <div>
      <h1>J🤪KES</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

</details>

当您访问 [`/jokes`][jokes] 时，您应该会看到该组件。现在，在那个 `<Outlet />` 中，我们想要渲染一些随机笑话作为“索引路由”。

💿 在 `app/routes/jokes._index.tsx` 创建一个路由。

<details>

<summary>app/routes/jokes._index.tsx</summary>

```tsx filename=app/routes/jokes._index.tsx
export default function JokesIndexRoute() {
  return (
    <div>
      <p>这是一个随机笑话：</p>
      <p>
        我在想为什么飞盘越来越大，
        然后我明白了。
      </p>
    </div>
  );
}
```

</details>

现在如果您刷新 [`/jokes`][jokes]，您将获得 `app/routes/jokes.tsx` 和 `app/routes/jokes._index.tsx` 的内容。我的效果如下：

![笑话页面上的随机笑话：“我在想为什么飞盘越来越大，然后我明白了”][a-random-joke-on-the-jokes-page-i-was-wondering-why-the-frisbee-was-getting-bigger-then-it-hit-me]

请注意，每个路由模块只关注其 URL 的一部分。很不错吧！？嵌套路由非常不错，我们才刚刚开始。让我们继续。

💿 接下来，我们来处理 `/jokes/new` 路由。我敢打赌您能想出如何做到这一点 😄。请记住，我们将在此页面上允许用户创建笑话，因此您需要渲染一个包含 `name` 和 `content` 字段的 `form`。

<details>

<summary>app/routes/jokes.new.tsx</summary>

```tsx filename=app/routes/jokes.new.tsx
export default function NewJokeRoute() {
  return (
    <div>
      <p>添加您自己的搞笑笑话</p>
      <form method="post">
        <div>
          <label>
            名称： <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            内容： <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            添加
          </button>
        </div>
      </form>
    </div>
  );
}
```

</details>

太好了，现在访问 [`/jokes/new`][jokes-new] 应该会显示您的表单：

![新的笑话表单][a-new-joke-form]

### 参数化路由

很快我们将添加一个数据库，用于通过 ID 存储我们的笑话，所以让我们添加一个更独特的路由，一个参数化路由：

`/jokes/$jokeId`

这里的参数 `$jokeId` 可以是任何内容，我们可以在数据库中查找 URL 的这一部分以显示正确的笑话。要创建一个参数化路由，我们在文件名中使用 `$` 字符。([在这里阅读有关该约定的更多信息][the-route-filename-convention]).

💿 在 `app/routes/jokes.$jokeId.tsx` 创建一个新路由。现在不必太担心它显示什么（我们还没有设置数据库！）：

<details>

<summary>app/routes/jokes.$jokeId.tsx</summary>

```tsx filename=app/routes/jokes.$jokeId.tsx
export default function JokeRoute() {
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>
        Why don't you find hippopotamuses hiding in trees?
        They're really good at it.
      </p>
    </div>
  );
}
```

</details>

很好，现在访问 [`/jokes/anything-you-want`][jokes-anything-you-want] 应该会显示你刚刚创建的内容（以及父路由）：

![A new joke form][a-new-joke-form-2]

太好了！我们的主要路由都设置好了！

## 样式

从网页样式的开始，到在页面上获取 CSS，我们一直使用 `<link rel="stylesheet" href="/path-to-file.css" />`。这也是你为 Remix 应用程序设置样式的方式，但 Remix 使这比随处乱丢 `link` 标签简单得多。Remix 将其嵌套路由支持的强大功能引入 CSS，并允许你将 `link` 标签与路由关联。当路由处于活动状态时，`link` 标签会出现在页面上，CSS 也会应用。当路由不处于活动状态（用户导航离开）时，`link` 标签会被移除，CSS 将不再应用。

你可以通过在路由模块中导出一个 [`links`][links] 函数来实现这一点。让我们来为主页添加样式。你可以将 CSS 文件放在 `app` 目录中的任何位置。我们将其放在 `app/styles/` 中。

我们将首先为主页（索引路由 `/`）添加样式。

💿 创建 `app/styles/index.css` 并将以下 CSS 放入其中：

```css
body {
  color: hsl(0, 0%, 100%);
  background-image: radial-gradient(
    circle,
    rgba(152, 11, 238, 1) 0%,
    rgba(118, 15, 181, 1) 35%,
    rgba(58, 13, 85, 1) 100%
  );
}
```

💿 现在更新 `app/routes/_index.tsx` 以导入该 CSS 文件。然后添加一个 `links` 导出（如 [文档][links] 中所述）以将该链接添加到页面。

<details>

<summary>app/routes/_index.tsx</summary>

```tsx filename=app/routes/_index.tsx lines=[1,3,5-7]
import type { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export default function IndexRoute() {
  return <div>Hello Index Route</div>;
}
```

</details>

现在如果你访问 [`/`][http-localhost-3000]，你可能会有些失望。我们美丽的样式没有应用！你可能会记得在 `app/root.tsx` 中，我们负责渲染我们应用的 _一切_。从 `<html>` 到 `</html>`。这意味着如果某些内容没有显示在其中，它根本不会显示！

因此，我们需要某种方式从所有活动路由获取 `link` 导出，并为所有这些添加 `<link />` 标签。幸运的是，Remix 为我们提供了一个便利的 [`<Links />`][links-component] 组件，使这变得简单。

💿 继续在 `<head>` 中将 Remix `<Links />` 组件添加到 `app/root.tsx`。

<details>

<summary>app/root.tsx</summary>

```tsx filename=app/root.tsx lines=[2,17]
import {
  Links,
  LiveReload,
  Outlet,
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
        <title>Remix: So great, it's funny!</title>
        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
```

</details>

太好了，现在再次检查 [`/`][http-localhost-3000]，它应该看起来很好并且有样式：

![带有紫色渐变背景和白色文本的主页，上面写着“Hello Index Route”][the-homepage-with-a-purple-gradient-background-and-white-text-with-the-words-hello-index-route]

太棒了！但我想强调一些重要而令人兴奋的事情。你知道我们写的 CSS 是如何样式化 `body` 元素的吗？你期望在 [`/jokes`][jokes] 路由上发生什么？去看看吧。

![没有背景渐变的笑话页面][the-jokes-page-with-no-background-gradient]

🤯 这是什么？为什么 CSS 规则没有应用？`body` 被移除了吗？不。如果你打开开发工具的元素选项卡，你会注意到链接标签根本不存在！

<docs-info>

这意味着你在编写 CSS 时不必担心意外的 CSS 冲突。你可以随意编写，只要检查每个路由，你的文件被链接的地方，你就会知道你没有影响其他页面！🔥

这也意味着你的 CSS 文件可以长期缓存，并且你的 CSS 自然会进行代码分割。性能真是太棒了 ⚡

</docs-info>

这就是本教程中样式的全部内容。剩下的就是编写 CSS，如果你愿意，可以随意进行，或者简单地复制下面的样式。

<details>

<summary>💿 复制到 `app/styles/global.css`</summary>

```css filename=app/styles/global.css
@font-face {
  font-family: "baloo";
  src: url("/fonts/baloo/baloo.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

:root {
  --hs-links: 48 100%;
  --color-foreground: hsl(0, 0%, 100%);
  --color-background: hsl(278, 73%, 19%);
  --color-links: hsl(var(--hs-links) 50%);
  --color-links-hover: hsl(var(--hs-links) 45%);
  --color-border: hsl(277, 85%, 38%);
  --color-invalid: hsl(356, 100%, 71%);
  --gradient-background: radial-gradient(
    circle,
    rgba(152, 11, 238, 1) 0%,
    rgba(118, 15, 181, 1) 35%,
    rgba(58, 13, 85, 1) 100%
  );
  --font-body: -apple-system, "Segoe UI", Helvetica Neue, Helvetica,
    Roboto, Arial, sans-serif, system-ui, "Apple Color Emoji",
    "Segoe UI Emoji";
  --font-display: baloo, var(--font-body);
}

html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

:-moz-focusring {
  outline: auto;
}

:focus {
  outline: var(--color-links) solid 2px;
  outline-offset: 2px;
}

html,
body {
  padding: 0;
  margin: 0;
  color: var(--color-foreground);
  background-color: var(--color-background);
}

[data-light] {
  --color-invalid: hsl(356, 70%, 39%);
  color: var(--color-background);
  background-color: var(--color-foreground);
}

body {
  font-family: var(--font-body);
  line-height: 1.5;
  background-repeat: no-repeat;
  min-height: 100vh;
  min-height: calc(100vh - env(safe-area-inset-bottom));
}

a {
  color: var(--color-links);
  text-decoration: none;
}

a:hover {
  color: var(--color-links-hover);
  text-decoration: underline;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  background-color: var(--color-border);
  margin-top: 2rem;
  margin-bottom: 2rem;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-display);
  margin: 0;
}

h1 {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

h2 {
  font-size: 1.5rem;
  line-height: 2rem;
}

h3 {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

h4 {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

h5,
h6 {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.container {
  --gutter: 16px;
  width: 1024px;
  max-width: calc(100% - var(--gutter) * 2);
  margin-right: auto;
  margin-left: auto;
}

/* buttons */

.button {
  --shadow-color: hsl(var(--hs-links) 30%);
  --shadow-size: 3px;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-links);
  color: var(--color-background);
  font-family: var(--font-display);
  font-weight: bold;
  line-height: 1;
  font-size: 1.125rem;
  margin: 0;
  padding: 0.625em 1em;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 var(--shadow-size) 0 0 var(--shadow-color);
  outline-offset: 2px;
  transform: translateY(0);
  transition: background-color 50ms ease-out, box-shadow
      50ms ease-out,
    transform 100ms cubic-bezier(0.3, 0.6, 0.8, 1.25);
}

.button:hover {
  --raise: 1px;
  color: var(--color-background);
  text-decoration: none;
  box-shadow: 0 calc(var(--shadow-size) + var(--raise)) 0 0 var(
      --shadow-color
    );
  transform: translateY(calc(var(--raise) * -1));
}

.button:active {
  --press: 1px;
  box-shadow: 0 calc(var(--shadow-size) - var(--press)) 0 0 var(
      --shadow-color
    );
  transform: translateY(var(--press));
  background-color: var(--color-links-hover);
}

.button[disabled],
.button[aria-disabled="true"] {
  transform: translateY(0);
  pointer-events: none;
  opacity: 0.7;
}

.button:focus:not(:focus-visible) {
  outline: none;
}

/* forms */

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

fieldset {
  margin: 0;
  padding: 0;
  border: 0;
}

legend {
  display: block;
  max-width: 100%;
  margin-bottom: 0.5rem;
  color: inherit;
  white-space: normal;
}

[type="text"],
[type="password"],
[type="date"],
[type="datetime"],
[type="datetime-local"],
[type="month"],
[type="week"],
[type="email"],
[type="number"],
[type="search"],
[type="tel"],
[type="time"],
[type="url"],
[type="color"],
textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: block;
  display: flex;
  align-items: center;
  width: 100%;
  height: 2.5rem;
  margin: 0;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: hsl(0 0% 100% / 10%);
  background-blend-mode: luminosity;
  box-shadow: none;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.5;
  color: var(--color-foreground);
  transition: box-shadow 200ms, border-color 50ms ease-out,
    background-color 50ms ease-out, color 50ms ease-out;
}

[data-light] [type="text"],
[data-light] [type="password"],
[data-light] [type="date"],
[data-light] [type="datetime"],
[data-light] [type="datetime-local"],
[data-light] [type="month"],
[data-light] [type="week"],
[data-light] [type="email"],
[data-light] [type="number"],
[data-light] [type="search"],
[data-light] [type="tel"],
[data-light] [type="time"],
[data-light] [type="url"],
[data-light] [type="color"],
[data-light] textarea {
  color: var(--color-background);
  background-color: hsl(0 0% 0% / 10%);
}

[type="text"][aria-invalid="true"],
[type="password"][aria-invalid="true"],
[type="date"][aria-invalid="true"],
[type="datetime"][aria-invalid="true"],
[type="datetime-local"][aria-invalid="true"],
[type="month"][aria-invalid="true"],
[type="week"][aria-invalid="true"],
[type="email"][aria-invalid="true"],
[type="number"][aria-invalid="true"],
[type="search"][aria-invalid="true"],
[type="tel"][aria-invalid="true"],
[type="time"][aria-invalid="true"],
[type="url"][aria-invalid="true"],
[type="color"][aria-invalid="true"],
textarea[aria-invalid="true"] {
  border-color: var(--color-invalid);
}

textarea {
  display: block;
  min-height: 50px;
  max-width: 100%;
}

textarea[rows] {
  height: auto;
}

input:disabled,
input[readonly],
textarea:disabled,
textarea[readonly] {
  opacity: 0.7;
  cursor: not-allowed;
}

[type="file"],
[type="checkbox"],
[type="radio"] {
  margin: 0;
}

[type="file"] {
  width: 100%;
}

label {
  margin: 0;
}

[type="checkbox"] + label,
[type="radio"] + label {
  margin-left: 0.5rem;
}

label > [type="checkbox"],
label > [type="radio"] {
  margin-right: 0.5rem;
}

::placeholder {
  color: hsl(0 0% 100% / 65%);
}

.form-validation-error {
  margin: 0;
  margin-top: 0.25em;
  color: var(--color-invalid);
  font-size: 0.8rem;
}

.error-container {
  background-color: hsla(356, 77%, 59%, 0.747);
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
}
```

</details>

<details>

<summary>💿 将此复制到 `app/styles/global-large.css`</summary>

```css filename=app/styles/global-large.css
h1 {
  font-size: 3.75rem;
  line-height: 1;
}

h2 {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

h3 {
  font-size: 1.5rem;
  line-height: 2rem;
}

h4 {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

h5 {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
```

</details>

<details>

<summary>💿 将此复制到 `app/styles/global-medium.css`</summary>

```css filename=app/styles/global-medium.css
h1 {
  font-size: 3rem;
  line-height: 1;
}

h2 {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

h3 {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

h4 {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

h5,
h6 {
  font-size: 1rem;
  line-height: 1.5rem;
}

.container {
  --gutter: 40px;
}
```

</details>

<details>

<summary>💿 将此复制到 `app/styles/index.css`</summary>

```css filename=app/styles/index.css
/*
 * 当用户访问此页面时，此样式将应用，当他们离开时，它
 * 将被卸载，因此不必太担心页面之间的样式冲突！
 */

body {
  background-image: var(--gradient-background);
}

.container {
  min-height: inherit;
}

.container,
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

h1 {
  margin: 0;
  text-shadow: 0 3px 0 rgba(0, 0, 0, 0.75);
  text-align: center;
  line-height: 0.5;
}

h1 span {
  display: block;
  font-size: 4.5rem;
  line-height: 1;
  text-transform: uppercase;
  text-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.5), 0 5px 0
      rgba(0, 0, 0, 0.75);
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1rem;
  font-family: var(--font-display);
  font-size: 1.125rem;
  line-height: 1;
}

nav ul a:hover {
  text-decoration-style: wavy;
  text-decoration-thickness: 1px;
}

@media print, (min-width: 640px) {
  h1 span {
    font-size: 6rem;
  }

  nav ul {
    font-size: 1.25rem;
    gap: 1.5rem;
  }
}

@media screen and (min-width: 1024px) {
  h1 span {
    font-size: 8rem;
  }
}
```

</details>

<details>

<summary>💿 将此复制到 `app/styles/jokes.css`</summary>

```css filename=app/styles/jokes.css
.jokes-layout {
  display: flex;
  flex-direction: column;
  min-height: inherit;
}

.jokes-header {
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.jokes-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.jokes-header .home-link {
  font-family: var(--font-display);
  font-size: 3rem;
}

.jokes-header .home-link a {
  color: var(--color-foreground);
}

.jokes-header .home-link a:hover {
  text-decoration: none;
}

.jokes-header .logo-medium {
  display: none;
}

.jokes-header a:hover {
  text-decoration-style: wavy;
  text-decoration-thickness: 1px;
}

.jokes-header .user-info {
  display: flex;
  gap: 1rem;
  align-items: center;
  white-space: nowrap;
}

.jokes-main {
  padding-top: 2rem;
  padding-bottom: 2rem;
  flex: 1 1 100%;
}

.jokes-main .container {
  display: flex;
  gap: 1rem;
}

.jokes-list {
  max-width: 12rem;
}

.jokes-outlet {
  flex: 1;
}

.jokes-footer {
  padding-top: 2rem;
  padding-bottom: 1rem;
  border-top: 1px solid var(--color-border);
}

@media print, (min-width: 640px) {
  .jokes-header .logo {
    display: none;
  }

  .jokes-header .logo-medium {
    display: block;
  }

  .jokes-main {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
}

@media (max-width: 639px) {
  .jokes-main .container {
    flex-direction: column;
  }
}
```

</details>

💿 另外，下载 <a href="/jokes-tutorial/baloo/baloo.woff" data-noprefetch target="_blank">该字体</a> 和 <a href="/jokes-tutorial/baloo/License.txt" data-noprefetch target="_blank">其许可证</a> 并将其放在 `public/fonts/baloo` 中。

💿 在您下载资源时，您还可以下载 <a href="/jokes-tutorial/social.png" data-noprefetch target="_blank">社交图片</a> 并将其放在 `public/social.png`。您稍后会需要它。

💿 将 `links` 导出添加到 `app/root.tsx` 和 `app/routes/jokes.tsx` 以引入一些 CSS，使页面看起来美观（注意：每个文件都有自己的 CSS 文件）。您可以查看 CSS，并为您的 JSX 元素添加一些结构，使其看起来更具吸引力。我也将添加一些链接。

<docs-info>`app/root.tsx` 将是链接到 `global` CSS 文件的文件。您认为“global”这个名称对于根路由的样式来说有什么意义？</docs-info>

`global-large.css` 和 `global-medium.css` 文件用于基于媒体查询的 CSS。

<docs-info>您知道 `<link />` 标签可以使用媒体查询吗？[查看 MDN 页面关于 `<link />`][check-out-the-mdn-page-for-link]。</docs-info>

<details>

<summary>app/root.tsx</summary>

```tsx filename=app/root.tsx lines=[1,8-10,12-24]
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Outlet,
} from "@remix-run/react";

import globalLargeStylesUrl from "~/styles/global-large.css";
import globalMediumStylesUrl from "~/styles/global-medium.css";
import globalStylesUrl from "~/styles/global.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  {
    rel: "stylesheet",
    href: globalMediumStylesUrl,
    media: "print, (min-width: 640px)",
  },
  {
    rel: "stylesheet",
    href: globalLargeStylesUrl,
    media: "screen and (min-width: 1024px)",
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>Remix: So great, it's funny!</title>
        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
```

</details>

<details>

<summary>app/routes/jokes.tsx</summary>

```tsx filename=app/routes/jokes.tsx lines=[1,4,6-8]
import type { LinksFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";

import stylesUrl from "~/styles/jokes.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export default function JokesRoute() {
  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="Remix Jokes"
              aria-label="Remix Jokes"
            >
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">获取一个随机笑话</Link>
            <p>这里还有一些笑话可以查看：</p>
            <ul>
              <li>
                <Link to="some-joke-id">河马</Link>
              </li>
            </ul>
            <Link to="new" className="button">
              添加你自己的
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
```

</details>

💿 让我们从主页添加一个指向笑话的链接，并遵循 CSS 中的一些类名，使主页看起来美观。

<details>

<summary>app/routes/_index.tsx</summary>

```tsx filename=app/routes/_index.tsx lines=[2,11-26]
import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export default function IndexRoute() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>笑话！</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">阅读笑话</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
```

</details>

在我们完成教程的其余部分时，您可能希望检查这些 CSS 文件中的类名，以便充分利用这些 CSS。

关于 CSS 的一个快速说明。许多人可能习惯于使用运行时库来处理 CSS（如 [Styled-Components][styled-components]）。虽然您可以在 Remix 中使用这些，但我们希望鼓励您考虑更传统的 CSS 处理方法。导致这些样式解决方案出现的许多问题在 Remix 中并不是问题，因此您通常可以采用更简单的样式处理方法。

话虽如此，许多 Remix 用户对 [Tailwind CSS][tailwind] 感到非常满意，我们推荐这种方法。基本上，如果它可以给您一个 URL（或一个可以导入以获取 URL 的 CSS 文件），那么通常是一个好方法，因为 Remix 可以利用浏览器平台进行缓存和加载/卸载。

## 数据库

大多数现实世界的应用程序都需要某种形式的数据持久性。在我们的案例中，我们想将笑话保存到数据库中，以便人们可以享受我们的幽默，甚至提交他们自己的笑话（即将在身份验证部分推出！）。

您可以使用任何您喜欢的持久性解决方案与 Remix；[Firebase][firebase]、[Supabase][supabase]、[Airtable][airtable]、[Hasura][hasura]、[Google Spreadsheets][google-spreadsheets]、[Cloudflare Workers KV][cloudflare-workers-kv]、[Fauna][fauna]、自定义的 [PostgreSQL][postgre-sql]，甚至是您后端团队的 REST/GraphQL API。认真地说。随您所愿。

### 设置 Prisma

<docs-info>Prisma 团队构建了一个 [VSCode 扩展][a-vs-code-extension]，在处理 Prisma schema 时可能会非常有帮助。</docs-info>

在本教程中，我们将使用自己的 [SQLite][sq-lite] 数据库。基本上，它是一个存储在您计算机文件中的数据库，功能出乎意料地强大，最重要的是，它得到了我们最喜欢的数据库 ORM [Prisma][prisma] 的支持！如果您不确定使用哪个数据库，这是一个很好的起点。

我们需要两个包来开始：

- `prisma` 用于在开发过程中与我们的数据库和 schema 交互。
- `@prisma/client` 用于在运行时对我们的数据库进行查询。

💿 安装 Prisma 包：

```shellscript nonumber
npm install --save-dev prisma
npm install @prisma/client
```

💿 现在我们可以使用 SQLite 初始化 Prisma：

```shellscript nonumber
npx prisma init --datasource-provider sqlite
```

这将给我们以下输出：

```
✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

warn You already have a .gitignore file. Don't forget to add `.env` in it to not commit any private information.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Run prisma db pull to turn your database schema into a Prisma schema.
3. Run prisma generate to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started
```

现在我们已经初始化了 Prisma，可以开始建模我们的应用数据。因为这不是一个 Prisma 教程，我将直接给你这个，你可以从 [他们的文档][their-docs] 中了解更多关于 Prisma schema 的信息：

```prisma filename=prisma/schema.prisma lines=[13-19]
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Joke {
  id         String   @id @default(uuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  name       String
  content    String
}
```

💿 有了这些，运行以下命令：

```shellscript nonumber
npx prisma db push
```

此命令将给您以下输出：

```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

🚀  Your database is now in sync with your Prisma schema. Done in 39ms

✔ Generated Prisma Client (4.12.0 | library) to ./node_modules/@prisma/client in 26ms
```

此命令做了几件事情。一方面，它在 `prisma/dev.db` 中创建了我们的数据库文件。然后，它将所有必要的更改推送到我们的数据库，以匹配我们提供的 schema。最后，它生成了 Prisma 的 TypeScript 类型，因此在使用其 API 与数据库交互时，我们将获得出色的自动补全和类型检查。

💿 让我们将 `prisma/dev.db` 添加到我们的 `.gitignore` 中，以免意外提交到我们的代码库。如 Prisma 输出中所提到的，我们不想提交我们的秘密，因此您的 `.env` 文件已经自动添加到 `.gitignore` 中！

```text filename=.gitignore lines=[8]
node_modules

/.cache
/build
/public/build
.env

/prisma/dev.db
```

<docs-warning>如果您的数据库出现问题，您可以随时删除 `prisma/dev.db` 文件并再次运行 `npx prisma db push`。</docs-warning>

接下来，我们将编写一个小文件，用于用测试数据“填充”我们的数据库。同样，这并不是特定于 remix 的内容，所以我将直接给你这个（别担心，我们很快会回到 remix）：

💿 将此内容复制到一个名为 `prisma/seed.ts` 的新文件中：

```ts filename=prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getJokes().map((joke) => {
      return db.joke.create({ data: joke });
    })
  );
}

seed();

function getJokes() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Road worker",
      content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
    },
    {
      name: "Frisbee",
      content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
    },
    {
      name: "Trees",
      content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
    },
    {
      name: "Skeletons",
      content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
    },
    {
      name: "Hippos",
      content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
    },
    {
      name: "Dinner",
      content: `What did one plate say to the other plate? Dinner is on me!`,
    },
    {
      name: "Elevator",
      content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
    },
  ];
}
```

如果您愿意，可以随意添加自己的笑话。

现在我们只需运行这个文件。我们用 TypeScript 编写它以获得类型安全（随着我们的应用和数据模型复杂性的增加，这将变得更加有用）。所以我们需要一种方法来运行它。

💿 安装 `ts-node` 和 `tsconfig-paths` 作为开发依赖：

```shellscript nonumber
npm install --save-dev ts-node tsconfig-paths
```

💿 现在我们可以使用以下命令运行我们的 `seed.ts` 文件：

```shellscript nonumber
npx ts-node --require tsconfig-paths/register prisma/seed.ts
```

现在我们的数据库中已经有了这些笑话。没开玩笑！

但我不想每次重置数据库时都记得运行这个脚本。幸运的是，我们不必这样做！

💿 将以下内容添加到您的 `package.json` 中：

```json filename=package.json nocopy
{
  "prisma": {
    "seed": "ts-node --require tsconfig-paths/register prisma/seed.ts"
  }
}
```

现在，每当我们重置数据库时，Prisma 也会调用我们的填充文件。

### 连接到数据库

好的，我们需要做的最后一件事是连接到我们应用中的数据库。我们在 `prisma/seed.ts` 文件的顶部完成这一操作：

```ts nocopy
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
```

这样做是没问题的，但问题在于，在开发过程中，我们不想每次对服务器端进行更改时都关闭并完全重启服务器。因此，`@remix-run/serve` 实际上会重建我们的代码并全新加载。问题是每次我们进行代码更改时，都会创建一个新的数据库连接，最终会用尽连接！这是数据库访问应用中非常常见的问题，Prisma对此有一个警告：

> 警告：10个Prisma客户端已经在运行

因此，我们需要做一些额外的工作来避免这个开发时的问题。

请注意，这并不是仅限于Remix的问题。每当您有“实时重载”服务器代码时，您都需要断开并重新连接到数据库（这可能会很慢），或者使用 [`global` 单例解决方法][global-singleton-workaround]。

💿 将此复制到两个新文件中，命名为 `app/utils/singleton.server.ts` 和 `app/utils/db.server.ts`

```ts filename=app/utils/singleton.server.ts
export const singleton = <Value>(
  name: string,
  valueFactory: () => Value
): Value => {
  const g = global as any;
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory();
  return g.__singletons[name];
};
```

```ts filename=app/utils/db.server.ts
import { PrismaClient } from "@prisma/client";

import { singleton } from "./singleton.server";

// 硬编码一个唯一键，以便在此模块重新导入时查找客户端
export const db = singleton(
  "prisma",
  () => new PrismaClient()
);
```

我将把对这段代码的分析留给读者，因为这与Remix没有直接关系。

我想指出的一件事是文件命名约定。文件名中的 `.server` 部分告知Remix这段代码绝不应出现在浏览器中。这是可选的，因为Remix在确保服务器代码不出现在客户端方面做得很好。但有时一些仅限服务器的依赖项很难进行树摇，因此在文件名中添加 `.server` 是对编译器的提示，以便在为浏览器打包时不必担心此模块或其导入。`.server` 充当编译器的一种边界。

### 从数据库读取数据到 Remix loader

好吧，准备好继续编写 Remix 代码了吗？我也是！

我们的目标是在 `/jokes` 路由上放置一个笑话列表，以便人们可以选择笑话链接。在 Remix 中，每个路由模块负责获取自己的数据。因此，如果我们想在 `/jokes` 路由上获取数据，我们将更新 `app/routes/jokes.tsx` 文件。

要在 Remix 路由模块中 _加载_ 数据，您需要使用一个 [`loader`][loader]。这只是一个您导出的 `async` 函数，它返回一个响应，并通过 [`useLoaderData`][use-loader-data] 钩子在组件中访问。以下是一个快速示例：

```tsx nocopy
// this is just an example. No need to copy/paste this 😄
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async () => {
  return json({
    sandwiches: await db.sandwich.findMany(),
  });
};

export default function Sandwiches() {
  const data = useLoaderData<typeof loader>();
  return (
    <ul>
      {data.sandwiches.map((sandwich) => (
        <li key={sandwich.id}>{sandwich.name}</li>
      ))}
    </ul>
  );
}
```

这给了你一个关于该怎么做的好主意吗？如果没有，您可以查看我在下面的 `<details>` 中的解决方案 😄

<docs-info>

Remix 和您从启动模板中获得的 `tsconfig.json` 被配置为允许通过 `~` 从 `app/` 目录导入，如上所示，因此您不需要到处都是 `../../`。

</docs-info>

💿 更新 `app/routes/jokes.tsx` 路由模块以从我们的数据库加载笑话并呈现笑话链接列表。

<details>

<summary>app/routes/jokes.tsx</summary>

```tsx filename=app/routes/jokes.tsx lines=[2,6,10,16-20,23,47-51]
import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
} from "@remix-run/react";

import stylesUrl from "~/styles/jokes.css";
import { db } from "~/utils/db.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async () => {
  return json({
    jokeListItems: await db.joke.findMany(),
  });
};

export default function JokesRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="Remix Jokes"
              aria-label="Remix Jokes"
            >
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">获取一个随机笑话</Link>
            <p>这里还有更多笑话供您查看：</p>
            <ul>
              {data.jokeListItems.map(({ id, name }) => (
                <li key={id}>
                  <Link to={id}>{name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              添加您自己的
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
```

</details>

现在我们有了这个：

![List of links to jokes][list-of-links-to-jokes]

### 数据过度获取

我想在我的解决方案中指出一些具体的内容。这是我的加载器：

```tsx lines=[3-7]
export const loader = async () => {
  return json({
    jokeListItems: await db.joke.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
      take: 5,
    }),
  });
};
```

请注意，我这个页面所需的仅仅是笑话的 `id` 和 `name`。我不需要获取 `content`。我还限制了总共 5 个项目，并按创建日期排序，以便获取最新的笑话。因此，通过 `prisma`，我可以将查询改为正好满足我的需求，避免向客户端发送过多的数据！这使我的应用程序对用户来说更快、更响应。

为了让事情变得更酷，你不一定需要 Prisma 或直接的数据库访问来做到这一点。你有一个 GraphQL 后端在使用？太好了，在你的加载器中使用你常规的 GraphQL 内容。这样做甚至比在客户端更好，因为你不需要担心将一个 [庞大的 GraphQL 客户端][huge-graphql-client] 发送到客户端。将其保留在服务器上，并过滤出你想要的内容。

哦，你只是有 REST 端点？那也没问题！你可以轻松地在加载器中过滤掉多余的数据。因为这一切都发生在服务器上，你可以轻松节省用户的下载大小，而不必说服你的后端工程师更改他们整个 API。很不错！

过滤掉你不渲染的数据不仅仅是为了减少传输的数据量，你还应该过滤掉任何你不希望暴露给客户端的敏感数据。

<docs-error>
无论你从加载器返回什么，都将暴露给客户端，即使组件没有渲染它。对待你的加载器要像对待公共 API 端点一样小心。
</docs-error>

### 网络类型安全

在我们的代码中，我们使用了 `useLoaderData` 的类型泛型并传递了我们的 `loader`，这样我们可以获得良好的自动补全，但这并没有真正为我们提供类型安全，因为 `loader` 和 `useLoaderData` 正在完全不同的环境中运行。Remix 确保我们获得服务器发送的内容，但谁真的知道呢？也许在一次愤怒中，你的同事将服务器设置为自动删除与狗相关的引用（他们更喜欢猫）。

因此，要真正确保你的数据是正确的，你应该在从 `useLoaderData` 返回的 `data` 上使用 [assertion functions][assertion-functions]。这超出了本教程的范围，但我们推荐 [zod][zod]，它可以在这方面提供帮助。

### 完成数据库查询

在我们进入 `/jokes/:jokeId` 路由之前，这里有一个快速示例，展示如何在加载器中访问参数（如 `:jokeId`）。

```tsx nocopy
export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  console.log(params); // <-- {jokeId: "123"}
};
```

接下来是如何从 Prisma 获取笑话：

```tsx nocopy
const joke = await db.joke.findUnique({
  where: { id: jokeId },
});
```

<docs-warning>请记住，当我们引用 URL 路由时，它是 `/jokes/:jokeId`，而当我们谈论文件系统时，它是 `/app/routes/jokes.$jokeId.tsx`。</docs-warning>

💿 太好了！现在你知道了继续并连接 `/jokes/:jokeId` 路由在 `app/routes/jokes.$jokeId.tsx` 中所需的一切。

<details>

<summary>app/routes/jokes.$jokeId.tsx</summary>

```tsx filename=app/routes/jokes.$jokeId.tsx lines=[1-3,5,7-17,20,25-26]
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Error("Joke not found");
  }
  return json({ joke });
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>这是你的搞笑笑话：</p>
      <p>{data.joke.content}</p>
      <Link to=".">"{data.joke.name}" 永久链接</Link>
    </div>
  );
}
```

</details>

这样你就可以访问 [`/jokes`][jokes] 并点击链接获取笑话：

![Jokes page showing a unique joke][jokes-page-showing-a-unique-joke]

我们将在下一节处理中，处理有人尝试访问数据库中不存在的笑话的情况。

接下来，让我们处理 `app/routes/jokes._index.tsx` 中的 `/jokes` 索引路由，以显示一个随机笑话。

以下是如何从 Prisma 获取随机笑话：

```tsx
const count = await db.joke.count();
const randomRowNumber = Math.floor(Math.random() * count);
const [randomJoke] = await db.joke.findMany({
  skip: randomRowNumber,
  take: 1,
});
```

💿 你应该能够从那里让加载器正常工作。

<details>

<summary>app/routes/jokes._index.tsx</summary>

```tsx filename=app/routes/jokes._index.tsx lines=[1-2,4,6-14,17,22-25]
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    skip: randomRowNumber,
    take: 1,
  });
  return json({ randomJoke });
};

export default function JokesIndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>这是一个随机笑话：</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>
        "{data.randomJoke.name}" 永久链接
      </Link>
    </div>
  );
}
```

</details>

这样你的 [`/jokes`][jokes] 路由应该显示笑话的链接列表以及一个随机笑话：

![Jokes page showing a random joke][jokes-page-showing-a-random-joke]

## 变更

我们有了一个 `/jokes/new` 路由，但这个表单还没有任何功能。让我们来实现它吧！作为提醒，目前代码应该是这样的（`method="post"` 非常重要，确保你的代码中包含它）：

```tsx filename=app/routes/jokes.new.tsx
export default function NewJokeRoute() {
  return (
    <div>
      <p>添加你自己的搞笑笑话</p>
      <form method="post">
        <div>
          <label>
            名称: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            内容: <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            添加
          </button>
        </div>
      </form>
    </div>
  );
}
```

没什么特别的。只是一个表单。如果我告诉你，只需向路由模块导出一个函数，就可以使这个表单工作，你会觉得怎么样？确实可以！这就是 [`action`][action] 函数的导出！先了解一下这个吧。

这里是你需要的 Prisma 代码：

```tsx
const joke = await db.joke.create({
  data: { name, content },
});
```

💿 在 `app/routes/jokes.new.tsx` 中创建一个 `action`。

<details>

<summary>app/routes/jokes.new.tsx</summary>

```tsx filename=app/routes/jokes.new.tsx lines=[1-2,4,6-25]
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { db } from "~/utils/db.server";

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const content = form.get("content");
  const name = form.get("name");
  // 我们做这个类型检查是为了更加确保，并让 TypeScript 愉快
  // 接下来我们将探索验证！
  if (
    typeof content !== "string" ||
    typeof name !== "string"
  ) {
    throw new Error("表单未正确提交。");
  }

  const fields = { content, name };

  const joke = await db.joke.create({ data: fields });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  return (
    <div>
      <p>添加你自己的搞笑笑话</p>
      <form method="post">
        <div>
          <label>
            名称: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            内容: <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            添加
          </button>
        </div>
      </form>
    </div>
  );
}
```

</details>

如果你已经完成了这些，你应该能够创建新的笑话并被重定向到新笑话的页面。

<docs-info>

`redirect` 工具是 Remix 中一个简单的工具，用于创建一个具有正确头部/状态码的 [`Response`][response] 对象，以重定向用户。

</docs-info>

![创建新笑话表单填写完毕][create-new-joke-form-filled-out]

![新创建的笑话显示][newly-created-joke-displayed]

太棒了！这多酷啊？没有 `useEffect` 或 `useAnything` 钩子。只有一个表单和一个处理提交的异步函数。真不错。如果你想的话，你当然可以做所有那些事情，但为什么要呢？这真的很好。

你还会注意到，当我们被重定向到笑话的新页面时，它就在那儿！但我们根本不需要考虑更新缓存。Remix 自动处理缓存失效。你无需考虑这一点。_这_ 太酷了 😎

我们为什么不添加一些验证呢？我们当然可以采用典型的 React 验证方法。将 `useState` 与 `onChange` 处理程序连接起来。有时候，这样可以在用户输入时获得实时验证。但即使你做了所有这些工作，你仍然会想在服务器上进行验证。

在我让你进行这个之前，还有一件事你需要知道关于路由模块 `action` 函数。返回值应与 `loader` 函数相同：一个 `Response`，或者（作为便利）一个可序列化的 JavaScript 对象。通常，当操作成功时，你希望重定向，以避免在某些网站上可能看到的令人烦恼的“确认重新提交”对话框。

<!-- TODO: 添加一页关于为什么 `redirect` 对成功操作更好的原因，并在这里链接。 -->

但是如果有错误，你可以返回一个带有错误消息的对象，然后组件可以从 [`useActionData`][use-action-data] 中获取这些值并显示给用户。

💿 继续验证 `name` 和 `content` 字段的长度。我认为名称至少应该有 3 个字符，内容至少应该有 10 个字符。进行服务器端验证。

<details>

<summary>app/routes/jokes.new.tsx</summary>

```tsx filename=app/routes/jokes.new.tsx lines=[3,6,8-12,14-18,30-34,37-40,42-48,55,65,68-75,78-86,92,94-101,104-112,115-122]
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return "这个笑话太短了";
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return "这个笑话的名称太短了";
  }
}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const content = form.get("content");
  const name = form.get("name");
  if (
    typeof content !== "string" ||
    typeof name !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "表单未正确提交。",
    });
  }

  const fieldErrors = {
    content: validateJokeContent(content),
    name: validateJokeName(name),
  };
  const fields = { content, name };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const joke = await db.joke.create({ data: fields });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <p>添加你自己的搞笑笑话</p>
      <form method="post">
        <div>
          <label>
            名称:{" "}
            <input
              defaultValue={actionData?.fields?.name}
              name="name"
              type="text"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.name
              )}
              aria-errormessage={
                actionData?.fieldErrors?.name
                  ? "name-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p
              className="form-validation-error"
              id="name-error"
              role="alert"
            >
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            内容:{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.content
              )}
              aria-errormessage={
                actionData?.fieldErrors?.content
                  ? "content-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              id="content-error"
              role="alert"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p
              className="form-validation-error"
              role="alert"
            >
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            添加
          </button>
        </div>
      </form>
    </div>
  );
}
```

</details>

<details>

<summary>app/utils/request.server.ts</summary>

```ts filename=app/utils/request.server.ts
import { json } from "@remix-run/node";

/**
 * 这个帮助函数帮助我们返回准确的 HTTP 状态，
 * 400 Bad Request，给客户端。
 */
export const badRequest = <T>(data: T) =>
  json<T>(data, { status: 400 });
```

</details>

太好了！你现在应该有一个在服务器上验证字段并在客户端显示这些错误的表单：

![带有验证错误的新笑话表单][new-joke-form-with-validation-errors]

为什么不稍微看看我的代码示例？我想向你展示一些我做这件事的方式。

首先，我希望你注意到我将 `typeof action` 传递给 `useActionData` 泛型函数。这样，`actionData` 的类型将被正确推断，我们将获得一些类型安全。请记住，如果操作尚未被调用，`useActionData` 可能返回 `undefined`，所以我们在这里有一些防御性编程。

你可能还会注意到我也返回了字段。这是为了确保在 JavaScript 因某种原因未能加载的情况下，表单可以使用服务器中的值重新渲染。这就是 `defaultValue` 的用意所在。

`badRequest` 辅助函数将自动推断传入数据的类型，同时仍然返回准确的 HTTP 状态 [`400 Bad Request`][400-bad-request] 给客户端。如果我们只是使用 `json()` 而不指定状态，那将导致 `200 OK` 响应，这是不合适的，因为表单提交时出现了错误。

我还想强调的是，所有这些都是如此简洁明了。你根本不需要考虑状态。你的操作获取一些数据，处理它并返回一个值。组件消费操作数据并根据该值进行渲染。这里没有状态管理，没有考虑竞争条件。什么都没有。

哦，如果你确实想要进行客户端验证（在用户输入时），你可以简单地调用 `validateJokeContent` 和 `validateJokeName` 函数，这些函数正在被该操作使用。你实际上可以无缝地在客户端和服务器之间共享代码！这可真酷！

## 认证

这是我们一直在等待的时刻！我们将为我们的应用程序添加认证。我们想要添加认证的原因是为了将笑话与创建它们的用户关联起来。

在这一部分，了解[HTTP cookies][http-cookies]在网络上的工作原理是很重要的。

我们将从头开始手动实现自己的认证。别担心，我保证这并没有听起来那么可怕。

### 准备数据库

<docs-warning>请记住，如果您的数据库出现问题，您可以随时删除 `prisma/dev.db` 文件并再次运行 `npx prisma db push`。记得也要使用 `npm run dev` 重新启动您的开发服务器。</docs-warning>

让我们首先展示一下我们更新后的 `prisma/schema.prisma` 文件。

💿 请更新您的 `prisma/schema.prisma` 文件，使其如下所示：

```prisma filename=prisma/schema.prisma lines=[13-20,24-25]
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  username     String   @unique
  passwordHash String
  jokes        Joke[]
}

model Joke {
  id         String   @id @default(uuid())
  jokesterId String
  jokester   User     @relation(fields: [jokesterId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  name       String
  content    String
}
```

更新完成后，让我们重置数据库以匹配此模式：

💿 运行以下命令：

```shellscript nonumber
npx prisma db push
```

它会提示您重置数据库，按 "y" 确认。

这样您将得到以下输出：

```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"


⚠️ We found changes that cannot be executed:

  • Added the required column `jokesterId` to the `Joke` table without a default value. There are 9 rows in this table, it is not possible to execute this step.


✔ To apply this change we need to reset the database, do you want to continue? All data will be lost. … yes
The SQLite database "dev.db" from "file:./dev.db" was successfully reset.

🚀  Your database is now in sync with your Prisma schema. Done in 1.56s

✔ Generated Prisma Client (4.12.0 | library) to ./node_modules/@prisma/client in 34ms
```

由于这个更改，我们将在项目中开始遇到一些 TypeScript 错误，因为您不能再创建没有 `jokesterId` 值的 `joke`。

💿 让我们开始修复我们的 `prisma/seed.ts` 文件。

```ts filename=prisma/seed.ts lines=[5-12,15-16]
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const kody = await db.user.create({
    data: {
      username: "kody",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });
  await Promise.all(
    getJokes().map((joke) => {
      const data = { jokesterId: kody.id, ...joke };
      return db.joke.create({ data });
    })
  );
}

seed();

function getJokes() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Road worker",
      content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
    },
    {
      name: "Frisbee",
      content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
    },
    {
      name: "Trees",
      content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
    },
    {
      name: "Skeletons",
      content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
    },
    {
      name: "Hippos",
      content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
    },
    {
      name: "Dinner",
      content: `What did one plate say to the other plate? Dinner is on me!`,
    },
    {
      name: "Elevator",
      content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
    },
  ];
}
```

💿 太好了，现在再次运行种子：

```shellscript nonumber
npx prisma db seed
```

输出如下：

```
Environment variables loaded from .env
Running seed command `ts-node --require tsconfig-paths/register prisma/seed.ts` ...

🌱  The seed command has been executed.
```

太好了！我们的数据库现在已经准备好了。

### 认证流程概述

我们的认证将采用传统的用户名/密码方式。我们将使用 [`bcryptjs`][bcryptjs] 来对密码进行哈希处理，以确保没有人能够合理地通过暴力破解进入账户。

💿 现在就安装它，以免我们忘记：

```shellscript nonumber
npm install bcryptjs
```

💿 `bcryptjs` 库在 DefinitelyTyped 中有 TypeScript 定义，所以我们也来安装这些：

```shellscript nonumber
npm install --save-dev @types/bcryptjs
```

让我给你一个流程图：

![Excalidraw 认证图][excalidraw-authentication-diagram]

以下是流程的文字描述：

- 在 `/login` 路由上。
- 用户提交登录表单。
- 表单数据进行验证。
  - 如果表单数据无效，返回带有错误的表单。
- 登录类型为 "register"
  - 检查用户名是否可用
    - 如果用户名不可用，返回带有错误的表单。
  - 哈希处理密码
  - 创建新用户
- 登录类型为 "login"
  - 检查用户是否存在
    - 如果用户不存在，返回带有错误的表单。
  - 检查密码哈希是否匹配
    - 如果密码哈希不匹配，返回带有错误的表单。
- 创建新会话
- 使用 `Set-Cookie` 头重定向到 `/jokes` 路由。

### 构建登录表单

好了，足够的高层次讨论了。让我们开始编写一些 Remix 代码吧！

我们将创建一个登录页面，我为您准备了一些 CSS 供您在该页面上使用：

<details>

<summary>💿 将此 CSS 复制到 `app/styles/login.css`</summary>

```css
/*
 * 当用户访问此页面时，此样式将应用，当他们离开时，它
 * 将被卸载，因此不必太担心页面之间的样式冲突！
 */

body {
  background-image: var(--gradient-background);
}

.container {
  min-height: inherit;
}

.container,
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content {
  padding: 1rem;
  background-color: hsl(0, 0%, 100%);
  border-radius: 5px;
  box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.5);
  width: 400px;
  max-width: 100%;
}

@media print, (min-width: 640px) {
  .content {
    padding: 2rem;
    border-radius: 8px;
  }
}

h1 {
  margin-top: 0;
}

fieldset {
  display: flex;
  justify-content: center;
}

fieldset > :not(:last-child) {
  margin-right: 2rem;
}

.links ul {
  margin-top: 1rem;
  padding: 0;
  list-style: none;
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.links a:hover {
  text-decoration-style: wavy;
  text-decoration-thickness: 1px;
}
```

</details>

💿 通过添加 `app/routes/login.tsx` 文件来创建 `/login` 路由。

<details>

<summary>app/routes/login.tsx</summary>

```tsx filename=app/routes/login.tsx
import type { LinksFunction } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";

import stylesUrl from "~/styles/login.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export default function Login() {
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>登录</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? undefined
            }
          />
          <fieldset>
            <legend className="sr-only">
              登录或注册？
            </legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked
              />{" "}
              登录
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
              />{" "}
              注册
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">用户名</label>
            <input
              type="text"
              id="username-input"
              name="username"
            />
          </div>
          <div>
            <label htmlFor="password-input">密码</label>
            <input
              id="password-input"
              name="password"
              type="password"
            />
          </div>
          <button type="submit" className="button">
            提交
          </button>
        </form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/jokes">笑话</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
```

</details>

这应该看起来像这样：

![带有登录/注册单选按钮和用户名/密码字段及提交按钮的登录表单][a-login-form-with-a-login-register-radio-button-and-username-password-fields-and-a-submit-button]

请注意，在我的解决方案中，我使用 `useSearchParams` 来获取 `redirectTo` 查询参数并将其放入隐藏输入中。这样我们的 `action` 就可以知道将用户重定向到哪里。这在我们稍后将用户重定向到登录页面时会很有用。

很好，现在我们已经让 UI 看起来不错了，让我们添加一些逻辑。这将与我们在 `/jokes/new` 路由中所做的非常相似。尽可能多地填写（验证等），我们将只为我们尚未实现的逻辑部分（例如 _实际_ 注册/登录）留下注释。

💿 在 `app/routes/login.tsx` 中使用 `action` 实现验证

<details>

<summary>app/routes/login.tsx</summary>

```tsx filename=app/routes/login.tsx lines=[2,7,12-13,19-23,25-29,31-37,39-112,115,138-141,150-153,164-172,174-182,190-198,200-208,210-219]
import type {
  ActionFunctionArgs,
  LinksFunction,
} from "@remix-run/node";
import {
  Link,
  useActionData,
  useSearchParams,
} from "@remix-run/react";

import stylesUrl from "~/styles/login.css";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

function validateUsername(username: string) {
  if (username.length < 3) {
    return "用户名必须至少为 3 个字符";
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    return "密码必须至少为 6 个字符";
  }
}

function validateUrl(url: string) {
  const urls = ["/jokes", "/", "https://remix.run"];
  if (urls.includes(url)) {
    return url;
  }
  return "/jokes";
}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const password = form.get("password");
  const username = form.get("username");
  const redirectTo = validateUrl(
    (form.get("redirectTo") as string) || "/jokes"
  );
  if (
    typeof loginType !== "string" ||
    typeof password !== "string" ||
    typeof username !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "表单未正确提交。",
    });
  }

  const fields = { loginType, password, username };
  const fieldErrors = {
    password: validatePassword(password),
    username: validateUsername(username),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  switch (loginType) {
    case "login": {
      // 登录以获取用户
      // 如果没有用户，返回字段和表单错误
      // 如果有用户，创建他们的会话并重定向到 /jokes
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "未实现",
      });
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { username },
      });
      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `用户名为 ${username} 的用户已存在`,
        });
      }
      // 创建用户
      // 创建他们的会话并重定向到 /jokes
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "未实现",
      });
    }
    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "登录类型无效",
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>登录</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? undefined
            }
          />
          <fieldset>
            <legend className="sr-only">
              登录或注册？
            </legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              登录
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={
                  actionData?.fields?.loginType ===
                  "register"
                }
              />{" "}
              注册
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">用户名</label>
            <input
              type="text"
              id="username-input"
              name="username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.username
              )}
              aria-errormessage={
                actionData?.fieldErrors?.username
                  ? "username-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">密码</label>
            <input
              id="password-input"
              name="password"
              type="password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.password
              )}
              aria-errormessage={
                actionData?.fieldErrors?.password
                  ? "password-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p
                className="form-validation-error"
                role="alert"
              >
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            提交
          </button>
        </form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/jokes">笑话</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
```

</details>

完成后，您的表单应该看起来像这样：

![带错误的登录表单][login-form-with-errors]

太好了！现在是时候处理一些更重要的内容了。让我们从 `login` 的部分开始。我们将一个用户名为 `kody` 的用户添加进系统，密码（经过哈希处理）为 `twixrox`。因此，我们需要实现足够的逻辑，以便能够以该用户身份登录。我们将把这个逻辑放在一个名为 `app/utils/session.server.ts` 的单独文件中。

在该文件中，我们需要以下内容来开始：

- 导出一个名为 `login` 的函数，接受 `username` 和 `password`
- 使用 Prisma 查询具有该 `username` 的用户
- 如果没有用户，则返回 `null`
- 使用 `bcrypt.compare` 将给定的 `password` 与用户的 `passwordHash` 进行比较
- 如果密码不匹配，则返回 `null`
- 如果密码匹配，则返回该用户

💿 创建一个名为 `app/utils/session.server.ts` 的文件，并实现上述要求。

<details>

<summary>app/utils/session.server.ts</summary>

```ts filename=app/utils/session.server.ts
import bcrypt from "bcryptjs";

import { db } from "./db.server";

type LoginForm = {
  password: string;
  username: string;
};

export async function login({
  password,
  username,
}: LoginForm) {
  const user = await db.user.findUnique({
    where: { username },
  });
  if (!user) {
    return null;
  }

  const isCorrectPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );
  if (!isCorrectPassword) {
    return null;
  }

  return { id: user.id, username };
}
```

</details>

太好了，有了这一点，我们现在可以更新 `app/routes/login.tsx` 来使用它：

<details>

<summary>app/routes/login.tsx</summary>

```tsx filename=app/routes/login.tsx lines=[6,16-25] nocopy
// ...

import stylesUrl from "~/styles/login.css";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { login } from "~/utils/session.server";

// ...

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  // ...
  switch (loginType) {
    case "login": {
      const user = await login({ username, password });
      console.log({ user });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError:
            "用户名/密码组合不正确",
        });
      }
      // 如果有用户，创建他们的会话并重定向到 /jokes
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "未实现",
      });
    }
    // ...
  }
};

export default function Login() {
  // ...
}
```

</details>

为了检查我们的工作，我在 `app/routes/login.tsx` 中的 `login` 调用后添加了一个 `console.log`。

<docs-info>请记住，`actions` 和 `loaders` 在服务器上运行，因此您在其中放置的 `console.log` 调用在浏览器控制台中是看不到的。它们会出现在您运行服务器的终端窗口中。</docs-info>

💿 有了这一点，尝试使用用户名 `kody` 和密码 `twixrox` 登录，并检查终端输出。以下是我得到的结果：

```
{
  user: {
    id: '1dc45f54-4061-4d9e-8a6d-28d6df6a8d7f',
    username: 'kody'
  }
}
```

<docs-warning>如果您遇到问题，请运行 `npx prisma studio` 在浏览器中查看数据库。可能您没有任何数据，因为您忘记运行 `npx prisma db seed`（就像我在写这个的时候所做的😅）。</docs-warning>

太棒了！我们得到了用户！现在我们需要将该用户的 ID 放入会话中。我们将在 `app/utils/session.server.ts` 中完成此操作。Remix 有一个内置的抽象来帮助我们管理多种类型的会话存储机制（[这里是文档][here-are-the-docs]）。我们将使用 [`createCookieSessionStorage`][create-cookie-session-storage]，因为它是最简单的，并且扩展性很好。

💿 在 `app/utils/session.server.ts` 中编写一个 `createUserSession` 函数，该函数接受用户 ID 和重定向的路由。它应该执行以下操作：

- 创建一个新会话（通过 cookie 存储的 `getSession` 函数）
- 在会话中设置 `userId` 字段
- 重定向到给定的路由，设置 `Set-Cookie` 头（通过 cookie 存储的 `commitSession` 函数）

注意：如果您需要帮助，关于整个基本流程的小示例可以在 [会话文档][here-are-the-docs] 中找到。一旦您有了它，您将希望在 `app/routes/login.tsx` 中使用它来设置会话并重定向到 `/jokes` 路由。

<details>

<summary>app/utils/session.server.ts</summary>

```ts filename=app/utils/session.server.ts lines=[1-4,35-38,40-53,55-66]
import {
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";
import bcrypt from "bcryptjs";

import { db } from "./db.server";

type LoginForm = {
  username: string;
  password: string;
};

export async function login({
  username,
  password,
}: LoginForm) {
  const user = await db.user.findUnique({
    where: { username },
  });
  if (!user) {
    return null;
  }
  const isCorrectPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );
  if (!isCorrectPassword) {
    return null;
  }

  return { id: user.id, username };
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET 必须设置");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // 通常您希望将其设置为 `secure: true`
    // 但在 Safari 的 localhost 上无法正常工作
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(
  userId: string,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
```

</details>

<details>

<summary>app/routes/login.tsx</summary>

```tsx filename=app/routes/login.tsx lines=[7,29] nocopy
// ...

import stylesUrl from "~/styles/login.css";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import {
  createUserSession,
  login,
} from "~/utils/session.server";

// ...

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  // ...

  switch (loginType) {
    case "login": {
      const user = await login({ username, password });

      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `用户名/密码组合不正确`,
        });
      }
      return createUserSession(user.id, redirectTo);
    }

    // ...
  }
};

// ...
```

</details>

我想快速提一下我使用的 `SESSION_SECRET` 环境变量。`secrets` 选项的值不是您希望放在代码中的内容，因为坏人可能会利用它来进行恶意活动。因此，我们将从环境中读取该值。这意味着您需要在 `.env` 文件中设置环境变量。顺便说一下，Prisma 会自动为我们加载该文件，因此我们只需确保在生产环境中设置该值即可。

💿 更新 `.env` 文件，添加 `SESSION_SECRET`（可以使用您喜欢的任何值）。

完成后，打开您的 [网络选项卡][network-tab]，访问 [`/login`][login]，输入 `kody` 和 `twixrox`，并检查网络选项卡中的响应头。应该看起来像这样：

![DevTools 网络选项卡显示 POST 响应中的 "Set-Cookie" 头][dev-tools-network-tab-showing-a-set-cookie-header-on-the-post-response]

如果您检查 [应用程序选项卡][application-tab] 的 Cookies 部分，您也应该在那里设置了 Cookie。

![DevTools 应用程序选项卡显示 ][dev-tools-application-tab-showing]

现在，浏览器向我们的服务器发出的每个请求都将包含该 Cookie（我们不需要在客户端做任何事情，[这就是 Cookie 的工作原理][http-cookies]）：

![请求头显示 Cookie][request-headers-showing-the-cookie]

因此，我们现在可以通过读取该头部来检查用户是否经过身份验证，以获取我们设置的 `userId`。为了测试这一点，让我们通过将 `jokesterId` 字段添加到 `db.joke.create` 调用中来修复 `/jokes/new` 路由。

<docs-info>请记得查看 [文档][here-are-the-docs]，了解如何从请求中获取会话</docs-info>

💿 更新 `app/utils/session.server.ts` 以从会话中获取 `userId`。在我的解决方案中，我创建了三个函数：`getUserSession(request: Request)`、`getUserId(request: Request)` 和 `requireUserId(request: Request, redirectTo: string)`。

<details>

<summary>app/utils/session.server.ts</summary>

```ts filename=app/utils/session.server.ts lines=[55-57,59-66,68-81]
import {
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";
import bcrypt from "bcryptjs";

import { db } from "./db.server";

type LoginForm = {
  username: string;
  password: string;
};

export async function login({
  username,
  password,
}: LoginForm) {
  const user = await db.user.findUnique({
    where: { username },
  });
  if (!user) {
    return null;
  }
  const isCorrectPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );
  if (!isCorrectPassword) {
    return null;
  }

  return { id: user.id, username };
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET 必须设置");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // 通常您希望将其设置为 `secure: true`
    // 但在 Safari 的 localhost 上无法正常工作
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function createUserSession(
  userId: string,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
```

</details>

<docs-info>你注意到我的例子中我们正在 `throw` 一个 `Response` 吗？</docs-info>

在我的例子中，我创建了一个 `requireUserId`，它会抛出一个 `redirect`。请记住，`redirect` 是一个返回 [`Response`][response] 对象的工具函数。Remix 会捕获这个抛出的响应并将其发送回客户端。这是一种在这样的抽象中“提前退出”的好方法，这样使用我们 `requireUserId` 函数的用户可以假设返回值总是会给我们 `userId`，而不需要担心如果没有 `userId` 会发生什么，因为响应是被抛出的，这会停止他们的代码执行！

我们将在后面的错误处理部分详细讨论这一点。

你可能还会注意到我们的解决方案利用了之前提到的 `login` 路由的 `redirectTo` 功能。

💿 现在更新 `app/routes/jokes.new.tsx`，使用该函数获取 `userId` 并将其传递给 `db.joke.create` 调用。

<details>

<summary>app/routes/jokes.new.tsx</summary>

```tsx filename=app/routes/jokes.new.tsx lines=[7,24,53]
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { requireUserId } from "~/utils/session.server";

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return "这个笑话太短了";
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return "这个笑话的名称太短了";
  }
}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const content = form.get("content");
  const name = form.get("name");
  if (
    typeof content !== "string" ||
    typeof name !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "表单未正确提交。",
    });
  }

  const fieldErrors = {
    content: validateJokeContent(content),
    name: validateJokeName(name),
  };
  const fields = { content, name };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <p>添加你自己的搞笑笑话</p>
      <form method="post">
        <div>
          <label>
            名称：{" "}
            <input
              defaultValue={actionData?.fields?.name}
              name="name"
              type="text"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.name
              )}
              aria-errormessage={
                actionData?.fieldErrors?.name
                  ? "name-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p
              className="form-validation-error"
              id="name-error"
              role="alert"
            >
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            内容：{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.content
              )}
              aria-errormessage={
                actionData?.fieldErrors?.content
                  ? "content-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              id="content-error"
              role="alert"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p
              className="form-validation-error"
              role="alert"
            >
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            添加
          </button>
        </div>
      </form>
    </div>
  );
}
```

</details>

太好了！现在如果用户尝试创建一个新的笑话，他们将被重定向到登录页面，因为创建新笑话需要 `userId`。

### 构建登出操作

我们可能应该让用户能够看到他们已登录，并提供一个登出的方式，对吧？是的，我认为应该这样。让我们实现这个功能。

💿 更新 `app/utils/session.server.ts`，添加一个 `getUser` 函数，从 Prisma 获取用户信息，以及一个 `logout` 函数，使用 [`destroySession`][destroy-session] 来登出用户。

<details>

<summary>app/utils/session.server.ts</summary>

```ts filename=app/utils/session.server.ts lines=[84-100,102-109]
import {
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";
import bcrypt from "bcryptjs";

import { db } from "./db.server";

type LoginForm = {
  password: string;
  username: string;
};

export async function login({
  password,
  username,
}: LoginForm) {
  const user = await db.user.findUnique({
    where: { username },
  });
  if (!user) {
    return null;
  }

  const isCorrectPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );
  if (!isCorrectPassword) {
    return null;
  }

  return { id: user.id, username };
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  const user = await db.user.findUnique({
    select: { id: true, username: true },
    where: { id: userId },
  });

  if (!user) {
    throw await logout(request);
  }

  return user;
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function createUserSession(
  userId: string,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
```

</details>

💿 很好，现在我们要更新 `app/routes/jokes.tsx` 路由，以便在用户未登录时显示登录链接。如果他们已登录，则显示他们的用户名和登出表单。我还将稍微清理一下 UI，以匹配我们已有的类名，所以在准备好时可以自由复制/粘贴示例。

<details>

<summary>app/routes/jokes.tsx</summary>

```tsx filename=app/routes/jokes.tsx lines=[3,14,20-22,28,30,50-61]
import type {
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
} from "@remix-run/react";

import stylesUrl from "~/styles/jokes.css";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const jokeListItems = await db.joke.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
    take: 5,
  });
  const user = await getUser(request);

  return json({ jokeListItems, user });
};

export default function JokesRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="Remix Jokes"
              aria-label="Remix Jokes"
            >
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>这里有几个笑话供您查看：</p>
            <ul>
              {data.jokeListItems.map(({ id, name }) => (
                <li key={id}>
                  <Link to={id}>{name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              添加自己的笑话
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
```

</details>

<details>

<summary>app/routes/logout.tsx</summary>

```tsx filename=app/routes/logout.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "~/utils/session.server";

export const action = async ({
  request,
}: ActionFunctionArgs) => logout(request);

export const loader = async () => redirect("/");
```

</details>

希望在加载器中获取用户并在组件中渲染他们是相当简单的。在继续之前，我想指出我版本代码的其他部分中的一些内容。

首先，新的 `logout` 路由只是为了方便我们登出。我们使用操作（而不是加载器）的原因是我们想通过使用 POST 请求而不是 GET 请求来避免 [CSRF][csrf] 问题。这就是为什么登出按钮是一个表单而不是链接。此外，Remix 只有在我们执行 `action` 时才会重新调用我们的加载器，因此如果我们使用 `loader`，缓存将不会失效。`loader` 只是为了防止有人以某种方式进入该页面，我们将把他们重定向回主页。

```tsx
<Link to="new" className="button">
  添加自己的笑话
</Link>
```

请注意，`to` 属性设置为 "new" 而没有任何 `/`。这就是嵌套路由的好处。您不必构造整个 URL。它可以是相对的。这对于 `<Link to=".">获取随机笑话</Link>` 链接也是一样，这将有效地告诉 Remix 重新加载当前路由的数据。

太好了，现在我们的应用看起来是这样的：

![笑话页面设计得很好][jokes-page-nice-and-designed]

![新笑话表单设计][new-joke-form-designed]

### 用户注册

我想现在是时候添加用户注册支持了！你和我一样忘了吗？😅 好吧，在继续之前让我们先添加这一部分。

幸运的是，我们所需要做的就是更新 `app/utils/session.server.ts`，添加一个与我们的 `login` 函数非常相似的 `register` 函数。不同之处在于，我们需要使用 `bcrypt.hash` 来对密码进行哈希处理，然后再将其存储在数据库中。接着更新我们的 `app/routes/login.tsx` 路由中的 `register` 案例以处理注册。

💿 更新 `app/utils/session.server.ts` 和 `app/routes/login.tsx` 以处理用户注册。

<details>

<summary>app/utils/session.server.ts</summary>

```tsx filename=app/utils/session.server.ts lines=[14-23]
import {
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";
import bcrypt from "bcryptjs";

import { db } from "./db.server";

type LoginForm = {
  password: string;
  username: string;
};

export async function register({
  password,
  username,
}: LoginForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { passwordHash, username },
  });
  return { id: user.id, username };
}

export async function login({
  password,
  username,
}: LoginForm) {
  const user = await db.user.findUnique({
    where: { username },
  });
  if (!user) {
    return null;
  }

  const isCorrectPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );
  if (!isCorrectPassword) {
    return null;
  }

  return { id: user.id, username };
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  const user = await db.user.findUnique({
    select: { id: true, username: true },
    where: { id: userId },
  });

  if (!user) {
    throw await logout(request);
  }

  return user;
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function createUserSession(
  userId: string,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
```

</details>

<details>

<summary>app/routes/login.tsx</summary>

```tsx filename=app/routes/login.tsx lines=[17,104-112]
import type {
  ActionFunctionArgs,
  LinksFunction,
} from "@remix-run/node";
import {
  Link,
  useActionData,
  useSearchParams,
} from "@remix-run/react";

import stylesUrl from "~/styles/login.css";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import {
  createUserSession,
  login,
  register,
} from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

function validateUsername(username: string) {
  if (username.length < 3) {
    return "用户名必须至少为 3 个字符长";
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    return "密码必须至少为 6 个字符长";
  }
}

function validateUrl(url: string) {
  const urls = ["/jokes", "/", "https://remix.run"];
  if (urls.includes(url)) {
    return url;
  }
  return "/jokes";
}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const password = form.get("password");
  const username = form.get("username");
  const redirectTo = validateUrl(
    (form.get("redirectTo") as string) || "/jokes"
  );
  if (
    typeof loginType !== "string" ||
    typeof password !== "string" ||
    typeof username !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "表单未正确提交。",
    });
  }

  const fields = { loginType, password, username };
  const fieldErrors = {
    password: validatePassword(password),
    username: validateUsername(username),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  switch (loginType) {
    case "login": {
      const user = await login({ username, password });
      console.log({ user });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError:
            "用户名/密码组合不正确",
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { username },
      });
      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `用户名 ${username} 已经存在`,
        });
      }
      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError:
            "创建新用户时发生错误。",
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "登录类型无效",
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>登录</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? undefined
            }
          />
          <fieldset>
            <legend className="sr-only">
              登录或注册？
            </legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              登录
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={
                  actionData?.fields?.loginType ===
                  "register"
                }
              />{" "}
              注册
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">用户名</label>
            <input
              type="text"
              id="username-input"
              name="username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.username
              )}
              aria-errormessage={
                actionData?.fieldErrors?.username
                  ? "username-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">密码</label>
            <input
              id="password-input"
              name="password"
              type="password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.password
              )}
              aria-errormessage={
                actionData?.fieldErrors?.password
                  ? "password-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p
                className="form-validation-error"
                role="alert"
              >
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            提交
          </button>
        </form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">主页</Link>
          </li>
          <li>
            <Link to="/jokes">笑话</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
```

</details>

呼，完成了。现在用户可以注册新账户了！

## 意外错误

抱歉，但在某些时候你无法避免错误。服务器崩溃，同事使用 `// @ts-ignore`，等等。因此，我们需要接受意外错误的可能性并处理它们。

幸运的是，Remix 的错误处理非常出色。你可能使用过 React 的 [错误边界特性][error-boundary-feature]。在 Remix 中，你的路由模块可以导出一个 [`ErrorBoundary` 组件][error-boundary-component]，它会被使用。但更酷的是，它也在服务器上工作！不仅如此，它还会处理 `loader` 和 `action` 中的错误！哇！那么让我们开始吧！

就像 `useLoaderData` 钩子从 `loader` 获取数据，`useActionData` 钩子从 `action` 获取数据一样，`ErrorBoundary` 从 `useRouteError` 钩子获取抛出的实例。

我们将在应用中添加四个 `ErrorBoundary`。在 `app/routes/jokes.*` 中的每个子路由中添加一个，以防在读取或处理笑话时出现错误，并在 `app/root.tsx` 中添加一个，以处理其他所有内容的错误。

<docs-info> `app/root.tsx` 的 `ErrorBoundary` 有点复杂 </docs-info>

请记住，`app/root.tsx` 模块负责渲染我们的 `<html>` 元素。当渲染 `ErrorBoundary` 时，它会替代默认导出进行渲染。这意味着 `app/root.tsx` 模块应该渲染 `<html>` 元素以及 `<Link />` 元素等。

💿 在每个文件中添加一个简单的 `ErrorBoundary`。

<details>

<summary>app/root.tsx</summary>

```tsx filename=app/root.tsx lines=[6,8,28-49,51-57,59-74]
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Outlet,
  useRouteError,
} from "@remix-run/react";
import type { PropsWithChildren } from "react";

import globalLargeStylesUrl from "~/styles/global-large.css";
import globalMediumStylesUrl from "~/styles/global-medium.css";
import globalStylesUrl from "~/styles/global.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  {
    rel: "stylesheet",
    href: globalMediumStylesUrl,
    media: "print, (min-width: 640px)",
  },
  {
    rel: "stylesheet",
    href: globalLargeStylesUrl,
    media: "screen and (min-width: 1024px)",
  },
];

function Document({
  children,
  title = "Remix: So great, it's funny!",
}: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const errorMessage =
    error instanceof Error
      ? error.message
      : "未知错误";
  return (
    <Document title="糟糕！">
      <div className="error-container">
        <h1>应用错误</h1>
        <pre>{errorMessage}</pre>
      </div>
    </Document>
  );
}
```

</details>

<details>

<summary>app/routes/jokes.$jokeId.tsx</summary>

```tsx filename=app/routes/jokes.$jokeId.tsx lines=[6,11-19] nocopy
// ...

import {
  Link,
  useLoaderData,
  useParams,
} from "@remix-run/react";

// ...

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="error-container">
      加载 ID 为 "${jokeId}" 的笑话时出错。
      抱歉。
    </div>
  );
}
```

</details>

<details>

<summary>app/routes/jokes.new.tsx</summary>

```tsx filename=app/routes/jokes.new.tsx nocopy
// ...

export function ErrorBoundary() {
  return (
    <div className="error-container">
      发生了意外错误。对此感到抱歉。
    </div>
  );
}
```

</details>

<details>

<summary>app/routes/jokes._index.tsx</summary>

```tsx filename=app/routes/jokes._index.tsx nocopy
// ...

export function ErrorBoundary() {
  return (
    <div className="error-container">
      我搞砸了。
    </div>
  );
}
```

</details>

好的，设置好这些后，让我们检查一下当发生错误时会发生什么。请在每个路由的默认组件、loader 或 action 中添加以下内容。

```ts
throw new Error("测试错误边界");
```

这是我得到的结果：

![应用错误][app-error]

![笑话页面错误][joke-page-error]

![笑话索引页面错误][joke-index-page-error]

![新笑话页面错误][new-joke-page-error]

我喜欢这一点，因为在子路由的情况下，应用中唯一不可用的部分是实际崩溃的部分。应用的其余部分完全可以交互。这对用户体验又是一个加分项！

## 预期错误

有时候用户会做一些我们可以预见的事情。我并不是在谈论验证，而是像用户是否经过身份验证（状态 `401`）或是否有权限（状态 `403`）去做他们想做的事情。或者他们可能在寻找一些不存在的东西（状态 `404`）。

可以将意外错误视为 500 级错误（[服务器错误][server-errors]），而将预期错误视为 400 级错误（[客户端错误][client-errors]）。

为了检查客户端错误响应，Remix 提供了 [`isRouteErrorResponse`][is-route-error-response] 辅助函数。如果您的服务器代码检测到问题，它将抛出一个 [`Response`][response] 对象。Remix 然后捕获该抛出的 `Response` 并渲染您的 `ErrorBoundary`。由于您可以抛出任何内容，`isRouteErrorResponse` 辅助函数是一种检查抛出的实例是否为 `Response` 对象的方法。

最后一点，这不是用于表单验证等的。我们之前已经通过 `useActionData` 讨论过这个。这仅适用于用户做了一些事情，导致我们无法合理渲染默认组件的情况，因此我们想渲染其他内容。

<docs-info>`ErrorBoundary` 允许我们的默认导出表示“快乐路径”，而不必担心错误。如果渲染了默认组件，那么我们可以假设一切都很好。</docs-info>

在理解了这一点后，我们将向以下路由添加 `isRouteErrorResponse` 检查：

- `app/root.tsx` - 作为最后的后备。
- `app/routes/jokes.$jokeId.tsx` - 当用户尝试访问不存在的笑话时（404）。
- `app/routes/jokes.new.tsx` - 当用户尝试在未经过身份验证的情况下访问此页面时（401）。现在，如果他们尝试在未经过身份验证的情况下提交，将被重定向到登录页面。花时间写笑话却被重定向是非常烦人的。与其毫无解释地重定向他们，我们可以渲染一条消息，说明他们需要先进行身份验证。
- `app/routes/jokes._index.tsx` - 如果数据库中没有笑话，则随机笑话为 404-未找到。（通过删除 `prisma/dev.db` 并运行 `npx prisma db push` 来模拟此操作。不要忘记在之后运行 `npx prisma db seed` 以恢复种子数据。）

💿 让我们将这些 `isRouteErrorResponse` 检查添加到路由中。

<details>

<summary>app/root.tsx</summary>

```tsx filename=app/root.tsx lines=[3,63-75]
import type { LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Outlet,
  useRouteError,
} from "@remix-run/react";
import type { PropsWithChildren } from "react";

import globalLargeStylesUrl from "~/styles/global-large.css";
import globalMediumStylesUrl from "~/styles/global-medium.css";
import globalStylesUrl from "~/styles/global.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  {
    rel: "stylesheet",
    href: globalMediumStylesUrl,
    media: "print, (min-width: 640px)",
  },
  {
    rel: "stylesheet",
    href: globalLargeStylesUrl,
    media: "screen and (min-width: 1024px)",
  },
];

function Document({
  children,
  title = "Remix: So great, it's funny!",
}: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Document
        title={`${error.status} ${error.statusText}`}
      >
        <div className="error-container">
          <h1>
            {error.status} {error.statusText}
          </h1>
        </div>
      </Document>
    );
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : "未知错误";
  return (
    <Document title="哎呀！">
      <div className="error-container">
        <h1>应用错误</h1>
        <pre>{errorMessage}</pre>
      </div>
    </Document>
  );
}
```

</details>

<details>

<summary>app/routes/jokes.$jokeId.tsx</summary>

```tsx filename=app/routes/jokes.$jokeId.tsx lines=[4,8,20-22,41,43-49]
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("这是什么笑话！未找到。", {
      status: 404,
    });
  }
  return json({ joke });
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>这是你的搞笑笑话：</p>
      <p>{data.joke.content}</p>
      <Link to=".">"{data.joke.name}" 永久链接</Link>
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">
        嗯？"{jokeId}" 到底是什么？
      </div>
    );
  }

  return (
    <div className="error-container">
      加载 ID 为 "${jokeId}" 的笑话时出错。
      抱歉。
    </div>
  );
}
```

</details>

<details>

<summary>app/routes/jokes._index.tsx</summary>

```tsx filename=app/routes/jokes._index.tsx lines=[3,6,18-22,41,43-50]
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    skip: randomRowNumber,
    take: 1,
  });
  if (!randomJoke) {
    throw new Response("没有找到随机笑话", {
      status: 404,
    });
  }
  return json({ randomJoke });
};

export default function JokesIndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>这是一个随机笑话：</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>
        "{data.randomJoke.name}" 永久链接
      </Link>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">
        <p>没有笑话可以显示。</p>
        <Link to="new">添加你自己的</Link>
      </div>
    );
  }

  return (
    <div className="error-container">
      我犯了个错误。
    </div>
  );
}
```

</details>

<details>

<summary>app/routes/jokes.new.tsx</summary>

```tsx filename=app/routes/jokes.new.tsx lines=[3,5,7,10,16,20-30,162,164-171]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useActionData,
  useRouteError,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import {
  getUserId,
  requireUserId,
} from "~/utils/session.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("未经授权", { status: 401 });
  }
  return json({});
};

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return "这个笑话太短了";
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return "这个笑话的名字太短了";
  }
}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const content = form.get("content");
  const name = form.get("name");
  if (
    typeof content !== "string" ||
    typeof name !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "表单未正确提交。",
    });
  }

  const fieldErrors = {
    content: validateJokeContent(content),
    name: validateJokeName(name),
  };
  const fields = { content, name };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <p>添加你自己的搞笑笑话</p>
      <form method="post">
        <div>
          <label>
            名称：{" "}
            <input
              defaultValue={actionData?.fields?.name}
              name="name"
              type="text"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.name
              )}
              aria-errormessage={
                actionData?.fieldErrors?.name
                  ? "name-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p
              className="form-validation-error"
              id="name-error"
              role="alert"
            >
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            内容：{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.content
              )}
              aria-errormessage={
                actionData?.fieldErrors?.content
                  ? "content-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              id="content-error"
              role="alert"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p
              className="form-validation-error"
              role="alert"
            >
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            添加
          </button>
        </div>
      </form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 401) {
    return (
      <div className="error-container">
        <p>您必须先登录才能创建笑话。</p>
        <Link to="/login">登录</Link>
      </div>
    );
  }

  return (
    <div className="error-container">
      出现意外错误。对此表示歉意。
    </div>
  );
}
```

</details>

这是我得到的结果：

![App 400 Bad Request][app-400-bad-request]

![A 404 on the joke page][a-404-on-the-joke-page]

![A 404 on the random joke page][a-404-on-the-random-joke-page]

![A 401 on the new joke page][a-401-on-the-new-joke-page]

太棒了！我们准备好处理错误了，这并没有让我们的快乐路径变得复杂！ 🎉

哦，你不觉得这都是上下文相关的吗？所以应用的其余部分继续正常运行。用户体验又得一分 💪

你知道吗，在我们添加 `ErrorBoundary` 的同时，为什么不稍微改进一下 `app/routes/jokes.$jokeId.tsx` 路由，让用户可以删除他们拥有的笑话呢。如果他们没有拥有，我们可以在 `ErrorBoundary` 中给他们一个403错误。

需要记住的一点是，`delete` 的 HTML 表单只支持 `method="get"` 和 `method="post"`。它们不支持 `method="delete"`。因此，为了确保我们的表单在有和没有 JavaScript 的情况下都能正常工作，最好做以下操作：

```tsx
<form method="post">
  <button name="intent" type="submit" value="delete">
    Delete
  </button>
</form>
```

然后 `action` 可以根据 `request.formData().get('intent')` 来判断意图是否为删除。

💿 为 `app/routes/jokes.$jokeId.tsx` 路由添加删除功能。

<details>

<summary>app/routes/jokes.$jokeId.tsx</summary>

```tsx filename=app/routes/jokes.$jokeId.tsx lines=[2,5,7,11,15,31-59,69-78,88-101]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("这个笑话！未找到。", {
      status: 404,
    });
  }
  return json({ joke });
};

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  if (form.get("intent") !== "delete") {
    throw new Response(
      `意图 ${form.get("intent")} 不被支持`,
      { status: 400 }
    );
  }
  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("无法删除不存在的内容", {
      status: 404,
    });
  }
  if (joke.jokesterId !== userId) {
    throw new Response(
      "嘘，试得不错。但那不是你的笑话",
      { status: 403 }
    );
  }
  await db.joke.delete({ where: { id: params.jokeId } });
  return redirect("/jokes");
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>这是你的搞笑笑话：</p>
      <p>{data.joke.content}</p>
      <Link to=".">"{data.joke.name}" 永久链接</Link>
      <form method="post">
        <button
          className="button"
          name="intent"
          type="submit"
          value="delete"
        >
          删除
        </button>
      </form>
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return (
        <div className="error-container">
          你尝试做的事情是不被允许的。
        </div>
      );
    }
    if (error.status === 403) {
      return (
        <div className="error-container">
          对不起，但 "{jokeId}" 不是你的笑话。
        </div>
      );
    }
    if (error.status === 404) {
      return (
        <div className="error-container">
          嗯？"{jokeId}" 是什么鬼？
        </div>
      );
    }
  }

  return (
    <div className="error-container">
      加载 id 为 "${jokeId}" 的笑话时出错。
      对不起。
    </div>
  );
}
```

</details>

现在如果用户尝试删除不属于他们的笑话，就会得到适当的错误消息，也许我们可以简单地隐藏删除按钮，如果用户不拥有这个笑话的话。

<details>

<summary>app/routes/jokes.$jokeId.tsx</summary>

```tsx filename=app/routes/jokes.$jokeId.tsx lines=[16,22,24,34,77,88]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import {
  getUserId,
  requireUserId,
} from "~/utils/session.server";

export const loader = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("这个笑话！未找到。", {
      status: 404,
    });
  }
  return json({
    isOwner: userId === joke.jokesterId,
    joke,
  });
};

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  if (form.get("intent") !== "delete") {
    throw new Response(
      `意图 ${form.get("intent")} 不被支持`,
      { status: 400 }
    );
  }
  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("无法删除不存在的内容", {
      status: 404,
    });
  }
  if (joke.jokesterId !== userId) {
    throw new Response(
      "嘘，试得不错。但那不是你的笑话",
      { status: 403 }
    );
  }
  await db.joke.delete({ where: { id: params.jokeId } });
  return redirect("/jokes");
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>这是你的搞笑笑话：</p>
      <p>{data.joke.content}</p>
      <Link to=".">"{data.joke.name}" 永久链接</Link>
      {data.isOwner ? (
        <form method="post">
          <button
            className="button"
            name="intent"
            type="submit"
            value="delete"
          >
            删除
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return (
        <div className="error-container">
          你尝试做的事情是不被允许的。
        </div>
      );
    }
    if (error.status === 403) {
      return (
        <div className="error-container">
          对不起，但 "{jokeId}" 不是你的笑话。
        </div>
      );
    }
    if (error.status === 404) {
      return (
        <div className="error-container">
          嗯？"{jokeId}" 是什么鬼？
        </div>
      );
    }
  }

  return (
    <div className="error-container">
      加载 id 为 "${jokeId}" 的笑话时出错。
      对不起。
    </div>
  );
}
```

</details>

## SEO与Meta标签

Meta标签对于SEO和社交媒体非常有用。棘手的部分在于，通常访问所需数据的代码部分在请求/使用数据的组件中。

这就是Remix提供[`meta`][meta]导出的原因。为什么不来给以下路由添加一些有用的meta标签呢：

- `app/routes/login.tsx`
- `app/routes/jokes.$jokeId.tsx` - （这个你可以在标题中引用笑话的名称，这很有趣）

但在你开始之前，请记住，我们负责从`<html>`到`</html>`的所有渲染，这意味着我们需要确保这些`meta`标签在`<html>`的`<head>`中渲染。这就是Remix给我们提供[`Meta`组件][meta-component]的原因。

💿 将`Meta`组件添加到`app/root.tsx`，并将`meta`导出添加到上述提到的路由中。`Meta`组件需要放在现有的`<title>`标签之上，以便在提供时能够覆盖它。

<details>

<summary>app/root.tsx</summary>

```tsx filename=app/root.tsx lines=[3,9,33-42,46,56-69]
import type {
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  useRouteError,
} from "@remix-run/react";
import type { PropsWithChildren } from "react";

import globalLargeStylesUrl from "~/styles/global-large.css";
import globalMediumStylesUrl from "~/styles/global-medium.css";
import globalStylesUrl from "~/styles/global.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  {
    rel: "stylesheet",
    href: globalMediumStylesUrl,
    media: "print, (min-width: 640px)",
  },
  {
    rel: "stylesheet",
    href: globalLargeStylesUrl,
    media: "screen and (min-width: 1024px)",
  },
];

export const meta: MetaFunction = () => {
  const description =
    "学习Remix，同时享受乐趣！";

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title: "Remix: 太棒了，真有趣！" },
  ];
};

function Document({
  children,
  title,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta name="keywords" content="Remix,jokes" />
        <meta
          name="twitter:image"
          content="https://remix-jokes.lol/social.png"
        />
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta name="twitter:creator" content="@remix_run" />
        <meta name="twitter:site" content="@remix_run" />
        <meta name="twitter:title" content="Remix Jokes" />
        <Meta />
        {title ? <title>{title}</title> : null}
        <Links />
      </head>
      <body>
        {children}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Document
        title={`${error.status} ${error.statusText}`}
      >
        <div className="error-container">
          <h1>
            {error.status} {error.statusText}
          </h1>
        </div>
      </Document>
    );
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : "未知错误";
  return (
    <Document title="哎呀！">
      <div className="error-container">
        <h1>应用错误</h1>
        <pre>{errorMessage}</pre>
      </div>
    </Document>
  );
}
```

</details>

<details>

<summary>app/routes/login.tsx</summary>

```tsx filename=app/routes/login.tsx lines=[4,25-34]
import type {
  ActionFunctionArgs,
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Link,
  useActionData,
  useSearchParams,
} from "@remix-run/react";

import stylesUrl from "~/styles/login.css";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import {
  createUserSession,
  login,
  register,
} from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: MetaFunction = () => {
  const description =
    "登录以提交您自己的笑话到Remix Jokes！";

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title: "Remix Jokes | 登录" },
  ];
};

function validateUsername(username: string) {
  if (username.length < 3) {
    return "用户名必须至少为3个字符";
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    return "密码必须至少为6个字符";
  }
}

function validateUrl(url: string) {
  const urls = ["/jokes", "/", "https://remix.run"];
  if (urls.includes(url)) {
    return url;
  }
  return "/jokes";
}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const password = form.get("password");
  const username = form.get("username");
  const redirectTo = validateUrl(
    (form.get("redirectTo") as string) || "/jokes"
  );
  if (
    typeof loginType !== "string" ||
    typeof password !== "string" ||
    typeof username !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "表单未正确提交。",
    });
  }

  const fields = { loginType, password, username };
  const fieldErrors = {
    password: validatePassword(password),
    username: validateUsername(username),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  switch (loginType) {
    case "login": {
      const user = await login({ username, password });
      console.log({ user });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError:
            "用户名/密码组合不正确",
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { username },
      });
      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `用户名为 ${username} 的用户已存在`,
        });
      }
      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError:
            "创建新用户时出现问题。",
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "登录类型无效",
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>登录</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? undefined
            }
          />
          <fieldset>
            <legend className="sr-only">
              登录或注册？
            </legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              登录
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={
                  actionData?.fields?.loginType ===
                  "register"
                }
              />{" "}
              注册
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">用户名</label>
            <input
              type="text"
              id="username-input"
              name="username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.username
              )}
              aria-errormessage={
                actionData?.fieldErrors?.username
                  ? "username-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">密码</label>
            <input
              id="password-input"
              name="password"
              type="password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.password
              )}
              aria-errormessage={
                actionData?.fieldErrors?.password
                  ? "password-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p
                className="form-validation-error"
                role="alert"
              >
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            提交
          </button>
        </form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/jokes">笑话</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
```

</details>

<details>

<summary>app/routes/jokes.$jokeId.tsx</summary>

```tsx filename=app/routes/jokes.$jokeId.tsx lines=[4,21-36]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import {
  getUserId,
  requireUserId,
} from "~/utils/session.server";

export const meta: MetaFunction<typeof loader> = ({
  data,
}) => {
  const { description, title } = data
    ? {
        description: `享受 "${data.joke.name}" 笑话以及更多内容`,
        title: `"${data.joke.name}" 笑话`,
      }
    : { description: "未找到笑话", title: "没有笑话" };

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ];
};

export const loader = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("什么笑话！未找到。", {
      status: 404,
    });
  }
  return json({
    isOwner: userId === joke.jokesterId,
    joke,
  });
};

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  if (form.get("intent") !== "delete") {
    throw new Response(
      `意图 ${form.get("intent")} 不被支持`,
      { status: 400 }
    );
  }
  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("无法删除不存在的内容", {
      status: 404,
    });
  }
  if (joke.jokesterId !== userId) {
    throw new Response(
      "嘘，好的尝试。那不是你的笑话",
      { status: 403 }
    );
  }
  await db.joke.delete({ where: { id: params.jokeId } });
  return redirect("/jokes");
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>这是你的搞笑笑话：</p>
      <p>{data.joke.content}</p>
      <Link to=".">"{data.joke.name}" 永久链接</Link>
      {data.isOwner ? (
        <form method="post">
          <button
            className="button"
            name="intent"
            type="submit"
            value="delete"
          >
            删除
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return (
        <div className="error-container">
          你正在尝试的操作是不允许的。
        </div>
      );
    }
    if (error.status === 403) {
      return (
        <div className="error-container">
          抱歉，"{jokeId}" 不是你的笑话。
        </div>
      );
    }
    if (error.status === 404) {
      return (
        <div className="error-container">
          嗯？"{jokeId}" 是什么？
        </div>
      );
    }
  }

  return (
    <div className="error-container">
      加载 ID 为 "${jokeId}" 的笑话时出错。
      抱歉。
    </div>
  );
}
```

</details>

太好了！现在搜索引擎和社交媒体平台会更喜欢我们的网站。

## 资源路由

有时我们希望我们的路由渲染一些其他的内容，而不是 HTML 文档。例如，也许你有一个端点，用于生成博客文章的社交图片，或者产品的图片，或者报告的 CSV 数据，或者 RSS 源，或者网站地图，或者你可能想为你的移动应用程序实现 API 路由，或者其他任何东西。

这就是 [资源路由][resource-routes] 的用途。我认为拥有一个包含我们所有笑话的 RSS 源会很酷。我觉得它应该位于 URL `/jokes.rss`。为了使其工作，你需要转义 `.`，因为该字符在 Remix 路由文件名中具有特殊含义。了解更多关于 [转义特殊字符的信息][escaping-special-characters-here]。

<docs-info>信不信由你，你实际上已经创建了其中一个。查看你的注销路由！不需要 UI，因为它只是用来处理变更并重定向迷失的灵魂。</docs-info>

对于这个，你可能至少想看看示例，除非你想去阅读 RSS 规范 😅。

💿 创建一个 `/jokes.rss` 路由。

<details>

<summary>app/routes/jokes[.]rss.tsx</summary>

```tsx filename=app/routes/jokes[.]rss.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";

import { db } from "~/utils/db.server";

function escapeCdata(s: string) {
  return s.replace(/\]\]>/g, "]]]]><![CDATA[>");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const jokes = await db.joke.findMany({
    include: { jokester: { select: { username: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const host =
    request.headers.get("X-Forwarded-Host") ??
    request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost")
    ? "http"
    : "https";
  const domain = `${protocol}://${host}`;
  const jokesUrl = `${domain}/jokes`;

  const rssString = `
    <rss xmlns:blogChannel="${jokesUrl}" version="2.0">
      <channel>
        <title>Remix Jokes</title>
        <link>${jokesUrl}</link>
        <description>一些有趣的笑话</description>
        <language>zh-cn</language>
        <generator>Kody the Koala</generator>
        <ttl>40</ttl>
        ${jokes
          .map((joke) =>
            `
            <item>
              <title><![CDATA[${escapeCdata(
                joke.name
              )}]]></title>
              <description><![CDATA[一个叫做 ${escapeHtml(
                joke.name
              )} 的有趣笑话]]></description>
              <author><![CDATA[${escapeCdata(
                joke.jokester.username
              )}]]></author>
              <pubDate>${joke.createdAt.toUTCString()}</pubDate>
              <link>${jokesUrl}/${joke.id}</link>
              <guid>${jokesUrl}/${joke.id}</guid>
            </item>
          `.trim()
          )
          .join("\n")}
      </channel>
    </rss>
  `.trim();

  return new Response(rssString, {
    headers: {
      "Cache-Control": `public, max-age=${
        60 * 10
      }, s-maxage=${60 * 60 * 24}`,
      "Content-Type": "application/xml",
      "Content-Length": String(
        Buffer.byteLength(rssString)
      ),
    },
  });
};
```

</details>

![XML 文档的 RSS 源][xml-document-for-rss-feed]

太好了！你可以用这个 API 做任何你能想象的事情。如果你想的话，甚至可以为你应用的原生版本制作一个 JSON API。这里有很多功能。

💿 随意在 `app/routes/_index.tsx` 和 `app/routes/jokes.tsx` 页面上添加该 RSS 源的链接。请注意，如果你使用 `<Link />`，你需要使用 `reloadDocument` 属性，因为你不能进行客户端过渡到一个技术上不属于 React 应用程序的 URL。

<details>

<summary>app/routes/_index.tsx</summary>

```tsx filename=app/routes/_index.tsx lines=[22-26]
import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export default function IndexRoute() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>笑话!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">阅读笑话</Link>
            </li>
            <li>
              <Link reloadDocument to="/jokes.rss">
                RSS
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
```

</details>

<details>

<summary>app/routes/jokes.tsx</summary>

```tsx filename=app/routes/jokes.tsx lines=[85-91]
import type {
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
} from "@remix-run/react";

import stylesUrl from "~/styles/jokes.css";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const jokeListItems = await db.joke.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
    take: 5,
  });
  const user = await getUser(request);

  return json({ jokeListItems, user });
};

export default function JokesRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="Remix Jokes"
              aria-label="Remix Jokes"
            >
              <span className="logo">🤪</span>
              <span className="logo-medium">笑😂话</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`嗨 ${data.user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  注销
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">登录</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">获取一个随机笑话</Link>
            <p>这里有更多笑话可以查看：</p>
            <ul>
              {data.jokeListItems.map(({ id, name }) => (
                <li key={id}>
                  <Link to={id}>{name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              添加你自己的
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
      <footer className="jokes-footer">
        <div className="container">
          <Link reloadDocument to="/jokes.rss">
            RSS
          </Link>
        </div>
      </footer>
    </div>
  );
}
```

</details>

## JavaScript...

也许我们应该在我们的 JavaScript 应用中实际包含 JavaScript。 😂

说真的，打开你的网络标签，导航到我们的应用。

![网络标签显示没有加载 JavaScript][network-tab-indicating-no-java-script-is-loaded]

你注意到我们的应用在此之前没有加载任何 JavaScript 吗？ 😆 这实际上是相当重要的。我们的整个应用可以在页面上完全不使用 JavaScript 的情况下运行。这是因为 Remix 为我们充分利用了平台。

我们的应用能在没有 JavaScript 的情况下运行有什么重要性？是因为我们担心那 0.002% 的用户禁用了 JS 吗？其实不是。因为并不是每个人都在以超快的连接使用你的应用，有时 JavaScript 需要一些时间加载，或者根本无法加载。在没有 JavaScript 的情况下让你的应用正常运行意味着当这种情况发生时，你的应用 _仍然可以正常工作_，即使在 JavaScript 完成加载之前。

又一个用户体验的加分点！

在页面上包含 JavaScript 是有原因的。例如，一些常见的 UI 体验在没有 JavaScript 的情况下无法访问（特别是当你到处都有全页面重新加载时，焦点管理并不好）。而且当我们在页面上有 JavaScript 时，我们可以通过乐观 UI（即将推出）来提供更好的用户体验。但我们认为展示在网络连接不佳的情况下，使用 Remix 可以做到的事情是很酷的。 💪

好的，现在让我们在这个页面上加载 JavaScript 😆

💿 使用 Remix 的 [`<Scripts />` 组件][scripts-component] 在 `app/root.tsx` 中加载所有 JavaScript 文件。

<details>

<summary>app/root.tsx</summary>

```tsx filename=app/root.tsx lines=[11,75]
import type {
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
} from "@remix-run/react";
import type { PropsWithChildren } from "react";

import globalLargeStylesUrl from "~/styles/global-large.css";
import globalMediumStylesUrl from "~/styles/global-medium.css";
import globalStylesUrl from "~/styles/global.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  {
    rel: "stylesheet",
    href: globalMediumStylesUrl,
    media: "print, (min-width: 640px)",
  },
  {
    rel: "stylesheet",
    href: globalLargeStylesUrl,
    media: "screen and (min-width: 1024px)",
  },
];

export const meta: MetaFunction = () => {
  const description =
    "学习 Remix，同时享受乐趣！";

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title: "Remix: 太棒了，真有趣！" },
  ];
};

function Document({
  children,
  title,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta name="keywords" content="Remix,jokes" />
        <meta
          name="twitter:image"
          content="https://remix-jokes.lol/social.png"
        />
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta name="twitter:creator" content="@remix_run" />
        <meta name="twitter:site" content="@remix_run" />
        <meta name="twitter:title" content="Remix Jokes" />
        <Meta />
        {title ? <title>{title}</title> : null}
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Document
        title={`${error.status} ${error.statusText}`}
      >
        <div className="error-container">
          <h1>
            {error.status} {error.statusText}
          </h1>
        </div>
      </Document>
    );
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : "未知错误";
  return (
    <Document title="哎呀！">
      <div className="error-container">
        <h1>应用错误</h1>
        <pre>{errorMessage}</pre>
      </div>
    </Document>
  );
}
```

</details>

![网络标签显示 JavaScript 已加载][network-tab-showing-java-script-loaded]

💿 现在我们可以做的另一件事是，你可以在所有的 `ErrorBoundary` 组件中使用 `console.error(error);`，这样你就能在浏览器的控制台中记录服务器端错误。 🤯

<details>

<summary>app/root.tsx</summary>

```tsx filename=app/root.tsx lines=[92]
import type {
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
} from "@remix-run/react";
import type { PropsWithChildren } from "react";

import globalLargeStylesUrl from "~/styles/global-large.css";
import globalMediumStylesUrl from "~/styles/global-medium.css";
import globalStylesUrl from "~/styles/global.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  {
    rel: "stylesheet",
    href: globalMediumStylesUrl,
    media: "print, (min-width: 640px)",
  },
  {
    rel: "stylesheet",
    href: globalLargeStylesUrl,
    media: "screen and (min-width: 1024px)",
  },
];

export const meta: MetaFunction = () => {
  const description =
    "学习 Remix，同时享受乐趣！";

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title: "Remix: 太棒了，真有趣！" },
  ];
};

function Document({
  children,
  title,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta name="keywords" content="Remix,jokes" />
        <meta
          name="twitter:image"
          content="https://remix-jokes.lol/social.png"
        />
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta name="twitter:creator" content="@remix_run" />
        <meta name="twitter:site" content="@remix_run" />
        <meta name="twitter:title" content="Remix Jokes" />
        <Meta />
        {title ? <title>{title}</title> : null}
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <Document
        title={`${error.status} ${error.statusText}`}
      >
        <div className="error-container">
          <h1>
            {error.status} {error.statusText}
          </h1>
        </div>
      </Document>
    );
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : "未知错误";
  return (
    <Document title="哎呀！">
      <div className="error-container">
        <h1>应用错误</h1>
        <pre>{errorMessage}</pre>
      </div>
    </Document>
  );
}
```

</details>

<details>

<summary>app/routes/jokes.$jokeId.tsx</summary>

```tsx filename=app/routes/jokes.$jokeId.tsx lines=[114]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import {
  getUserId,
  requireUserId,
} from "~/utils/session.server";

export const meta: MetaFunction<typeof loader> = ({
  data,
}) => {
  const { description, title } = data
    ? {
        description: `享受 "${data.joke.name}" 笑话和更多内容`,
        title: `"${data.joke.name}" 笑话`,
      }
    : { description: "未找到笑话", title: "没有笑话" };

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ];
};

export const loader = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("真是个笑话！未找到。", {
      status: 404,
    });
  }
  return json({
    isOwner: userId === joke.jokesterId,
    joke,
  });
};

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  if (form.get("intent") !== "delete") {
    throw new Response(
      `意图 ${form.get("intent")} 不被支持`,
      { status: 400 }
    );
  }
  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("无法删除不存在的内容", {
      status: 404,
    });
  }
  if (joke.jokesterId !== userId) {
    throw new Response(
      "嘘，别想了。这不是你的笑话",
      { status: 403 }
    );
  }
  await db.joke.delete({ where: { id: params.jokeId } });
  return redirect("/jokes");
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>这是你的搞笑笑话：</p>
      <p>{data.joke.content}</p>
      <Link to=".">"{data.joke.name}" 永久链接</Link>
      {data.isOwner ? (
        <form method="post">
          <button
            className="button"
            name="intent"
            type="submit"
            value="delete"
          >
            删除
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return (
        <div className="error-container">
          你尝试做的事情是不允许的。
        </div>
      );
    }
    if (error.status === 403) {
      return (
        <div className="error-container">
          抱歉，但 "{jokeId}" 不是你的笑话。
        </div>
      );
    }
    if (error.status === 404) {
      return (
        <div className="error-container">
          嗯？"{jokeId}" 是什么鬼？
        </div>
      );
    }
  }

  return (
    <div className="error-container">
      加载 id 为 "${jokeId}" 的笑话时发生错误。
      抱歉。
    </div>
  );
}
```

</details>

<details>

<summary>app/routes/jokes._index.tsx</summary>

```tsx filename=app/routes/jokes._index.tsx lines=[42]
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    skip: randomRowNumber,
    take: 1,
  });
  if (!randomJoke) {
    throw new Response("未找到随机笑话", {
      status: 404,
    });
  }
  return json({ randomJoke });
};

export default function JokesIndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>这是一个随机笑话：</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>
        "{data.randomJoke.name}" 永久链接
      </Link>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">
        <p>没有可显示的笑话。</p>
        <Link to="new">添加你自己的笑话</Link>
      </div>
    );
  }

  return (
    <div className="error-container">
      我犯了一个错误。
    </div>
  );
}
```

</details>

<details>

<summary>app/routes/jokes.new.tsx</summary>

```tsx filename=app/routes/jokes.new.tsx lines=[159]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useActionData,
  useRouteError,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import {
  getUserId,
  requireUserId,
} from "~/utils/session.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("未授权", { status: 401 });
  }
  return json({});
};

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return "这个笑话太短了";
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return "这个笑话的名字太短了";
  }
}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const content = form.get("content");
  const name = form.get("name");
  if (
    typeof content !== "string" ||
    typeof name !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "表单未正确提交。",
    });
  }

  const fieldErrors = {
    content: validateJokeContent(content),
    name: validateJokeName(name),
  };
  const fields = { content, name };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <p>添加你自己的搞笑笑话</p>
      <form method="post">
        <div>
          <label>
            名字：{" "}
            <input
              defaultValue={actionData?.fields?.name}
              name="name"
              type="text"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.name
              )}
              aria-errormessage={
                actionData?.fieldErrors?.name
                  ? "name-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p
              className="form-validation-error"
              id="name-error"
              role="alert"
            >
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            内容：{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.content
              )}
              aria-errormessage={
                actionData?.fieldErrors?.content
                  ? "content-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              id="content-error"
              role="alert"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p
              className="form-validation-error"
              role="alert"
            >
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            添加
          </button>
        </div>
      </form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error) && error.status === 401) {
    return (
      <div className="error-container">
        <p>你必须登录才能创建笑话。</p>
        <Link to="/login">登录</Link>
      </div>
    );
  }

  return (
    <div className="error-container">
      发生了意外错误。对此我们深感抱歉。
    </div>
  );
}
```

</details>

![Browser console showing the log of a server-side error][browser-console-showing-the-log-of-a-server-side-error]

### 表单

Remix 有其自己的 [`<Form />`][form-component] 组件。当 JavaScript 尚未加载时，它的工作方式与常规表单相同，但当 JavaScript 启用时，它会“渐进增强”，改为发出 `fetch` 请求，因此我们不需要进行完整页面重载。

💿 找到所有 `<form />` 元素并将其更改为 Remix 的 `<Form />` 组件。

<details>

<summary>app/routes/login.tsx</summary>

```tsx filename=app/routes/login.tsx lines=[7,145,247]
import type {
  ActionFunctionArgs,
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useSearchParams,
} from "@remix-run/react";

import stylesUrl from "~/styles/login.css";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import {
  createUserSession,
  login,
  register,
} from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: MetaFunction = () => {
  const description =
    "登录以提交您自己的笑话到 Remix Jokes！";

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title: "Remix Jokes | 登录" },
  ];
};

function validateUsername(username: string) {
  if (username.length < 3) {
    return "用户名必须至少 3 个字符长";
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    return "密码必须至少 6 个字符长";
  }
}

function validateUrl(url: string) {
  const urls = ["/jokes", "/", "https://remix.run"];
  if (urls.includes(url)) {
    return url;
  }
  return "/jokes";
}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const password = form.get("password");
  const username = form.get("username");
  const redirectTo = validateUrl(
    (form.get("redirectTo") as string) || "/jokes"
  );
  if (
    typeof loginType !== "string" ||
    typeof password !== "string" ||
    typeof username !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "表单未正确提交。",
    });
  }

  const fields = { loginType, password, username };
  const fieldErrors = {
    password: validatePassword(password),
    username: validateUsername(username),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  switch (loginType) {
    case "login": {
      const user = await login({ username, password });
      console.log({ user });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError:
            "用户名/密码组合不正确",
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { username },
      });
      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `用户名为 ${username} 的用户已存在`,
        });
      }
      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError:
            "创建新用户时发生错误。",
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "登录类型无效",
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>登录</h1>
        <Form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? undefined
            }
          />
          <fieldset>
            <legend className="sr-only">
              登录或注册？
            </legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              登录
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={
                  actionData?.fields?.loginType ===
                  "register"
                }
              />{" "}
              注册
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">用户名</label>
            <input
              type="text"
              id="username-input"
              name="username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.username
              )}
              aria-errormessage={
                actionData?.fieldErrors?.username
                  ? "username-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">密码</label>
            <input
              id="password-input"
              name="password"
              type="password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.password
              )}
              aria-errormessage={
                actionData?.fieldErrors?.password
                  ? "password-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p
                className="form-validation-error"
                role="alert"
              >
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            提交
          </button>
        </Form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/jokes">笑话</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
```

</details>

<details>

<summary>app/routes/jokes.tsx</summary>

```tsx filename=app/routes/jokes.tsx lines=[7,54,58]
import type {
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
} from "@remix-run/react";

import stylesUrl from "~/styles/jokes.css";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const jokeListItems = await db.joke.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
    take: 5,
  });
  const user = await getUser(request);

  return json({ jokeListItems, user });
};

export default function JokesRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="Remix Jokes"
              aria-label="Remix Jokes"
            >
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`嗨 ${data.user.username}`}</span>
              <Form action="/logout" method="post">
                <button type="submit" className="button">
                  登出
                </button>
              </Form>
            </div>
          ) : (
            <Link to="/login">登录</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">获取一个随机笑话</Link>
            <p>这里有更多笑话供您查看：</p>
            <ul>
              {data.jokeListItems.map(({ id, name }) => (
                <li key={id}>
                  <Link to={id}>{name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              添加您自己的
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
      <footer className="jokes-footer">
        <div className="container">
          <Link reloadDocument to="/jokes.rss">
            RSS
          </Link>
        </div>
      </footer>
    </div>
  );
}
```

</details>

<details>

<summary>app/routes/jokes.$jokeId.tsx</summary>

```tsx filename=app/routes/jokes.$jokeId.tsx lines=[8,97,106]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import {
  getUserId,
  requireUserId,
} from "~/utils/session.server";

export const meta: MetaFunction<typeof loader> = ({
  data,
}) => {
  const { description, title } = data
    ? {
        description: `享受这个名为 "${data.joke.name}" 的笑话以及更多内容`,
        title: `"${data.joke.name}" 笑话`,
      }
    : { description: "未找到笑话", title: "没有笑话" };

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ];
};

export const loader = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("真是个笑话！未找到。", {
      status: 404,
    });
  }
  return json({
    isOwner: userId === joke.jokesterId,
    joke,
  });
};

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  if (form.get("intent") !== "delete") {
    throw new Response(
      `意图 ${form.get("intent")} 不被支持`,
      { status: 400 }
    );
  }
  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("无法删除不存在的内容", {
      status: 404,
    });
  }
  if (joke.jokesterId !== userId) {
    throw new Response(
      "哎呀，真不错的尝试。这不是你的笑话",
      { status: 403 }
    );
  }
  await db.joke.delete({ where: { id: params.jokeId } });
  return redirect("/jokes");
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>这是你的搞笑笑话：</p>
      <p>{data.joke.content}</p>
      <Link to=".">"{data.joke.name}" 永久链接</Link>
      {data.isOwner ? (
        <Form method="post">
          <button
            className="button"
            name="intent"
            type="submit"
            value="delete"
          >
            删除
          </button>
        </Form>
      ) : null}
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return (
        <div className="error-container">
          你尝试做的事情是不允许的。
        </div>
      );
    }
    if (error.status === 403) {
      return (
        <div className="error-container">
          抱歉，"{jokeId}" 不是你的笑话。
        </div>
      );
    }
    if (error.status === 404) {
      return (
        <div className="error-container">
          嗯？"{jokeId}" 是什么？
        </div>
      );
    }
  }

  return (
    <div className="error-container">
      加载 ID 为 "${jokeId}" 的笑话时出错。
      抱歉。
    </div>
  );
}
```

```tsx filename=app/routes/jokes.new.tsx lines=[7,86,153]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useActionData,
  useRouteError,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import {
  getUserId,
  requireUserId,
} from "~/utils/session.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("未经授权", { status: 401 });
  }
  return json({});
};

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return "这个笑话太短了";
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return "这个笑话的名称太短了";
  }
}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const content = form.get("content");
  const name = form.get("name");
  if (
    typeof content !== "string" ||
    typeof name !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "表单未正确提交。",
    });
  }

  const fieldErrors = {
    content: validateJokeContent(content),
    name: validateJokeName(name),
  };
  const fields = { content, name };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <p>添加你自己的搞笑笑话</p>
      <Form method="post">
        <div>
          <label>
            名称：{" "}
            <input
              defaultValue={actionData?.fields?.name}
              name="name"
              type="text"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.name
              )}
              aria-errormessage={
                actionData?.fieldErrors?.name
                  ? "name-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p
              className="form-validation-error"
              id="name-error"
              role="alert"
            >
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            内容：{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.content
              )}
              aria-errormessage={
                actionData?.fieldErrors?.content
                  ? "content-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              id="content-error"
              role="alert"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p
              className="form-validation-error"
              role="alert"
            >
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            添加
          </button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error) && error.status === 401) {
    return (
      <div className="error-container">
        <p>你必须登录才能创建笑话。</p>
        <Link to="/login">登录</Link>
      </div>
    );
  }

  return (
    <div className="error-container">
      出现意外错误。对此感到抱歉。
    </div>
  );
}
```

### 预取

如果用户聚焦或鼠标悬停在链接上，他们很可能想要访问该链接。因此，我们可以预取他们即将访问的页面。要为特定链接启用此功能，只需这样做：

```
<Link prefetch="intent" to="somewhere/neat">Somewhere Neat</Link>
```

💿 在 `app/routes/jokes.tsx` 中的笑话链接列表中添加 `prefetch="intent"`。
</details>
<details>

<summary>app/routes/jokes.tsx</summary>

```tsx filename=app/routes/jokes.tsx lines=[73]
import type {
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
} from "@remix-run/react";

import stylesUrl from "~/styles/jokes.css";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const jokeListItems = await db.joke.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
    take: 5,
  });
  const user = await getUser(request);

  return json({ jokeListItems, user });
};

export default function JokesRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="Remix Jokes"
              aria-label="Remix Jokes"
            >
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <Form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </Form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">获取一个随机笑话</Link>
            <p>这里还有一些笑话可以查看：</p>
            <ul>
              {data.jokeListItems.map(({ id, name }) => (
                <li key={id}>
                  <Link prefetch="intent" to={id}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              添加你自己的
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
      <footer className="jokes-footer">
        <div className="container">
          <Link reloadDocument to="/jokes.rss">
            RSS
          </Link>
        </div>
      </footer>
    </div>
  );
}
```

</details>

## 乐观 UI

现在我们在页面上使用了 JavaScript，我们可以利用 _渐进增强_ 并通过为我们的应用添加一些 _乐观 UI_ 来使我们的网站 _更好_。

尽管我们的应用相当快速（尤其是在本地 😅），但一些用户可能与我们的应用连接不佳。这意味着他们将提交他们的笑话，但在看到任何内容之前，他们需要等待一段时间。我们可以在某个地方添加一个加载旋转器，但乐观地对请求的成功进行预期并渲染用户将看到的内容会提供更好的用户体验。

我们有一份相当深入的 [乐观 UI 指南][guide-on-optimistic-ui]，可以去看看。

💿 将乐观 UI 添加到 `app/routes/jokes.new.tsx` 路由中。

注意，你可能想在 `app/components/` 中创建一个名为 `joke.tsx` 的新文件，以便在 `app/routes/jokes.$jokeId.tsx` 和 `app/routes/jokes.new.tsx` 中重用该 UI。

<details>

<summary>app/components/joke.tsx</summary>

```tsx filename=app/components/joke.tsx lines=[5,9,16-18,22]
import type { Joke } from "@prisma/client";
import { Form, Link } from "@remix-run/react";

export function JokeDisplay({
  canDelete = true,
  isOwner,
  joke,
}: {
  canDelete?: boolean;
  isOwner: boolean;
  joke: Pick<Joke, "content" | "name">;
}) {
  return (
    <div>
      <p>这是你的搞笑笑话：</p>
      <p>{joke.content}</p>
      <Link to=".">"{joke.name}" 的永久链接</Link>
      {isOwner ? (
        <Form method="post">
          <button
            className="button"
            disabled={!canDelete}
            name="intent"
            type="submit"
            value="delete"
          >
            删除
          </button>
        </Form>
      ) : null}
    </div>
  );
}
```

</details>

<details>

<summary>app/routes/jokes.$jokeId.tsx</summary>

```tsx filename=app/routes/jokes.$jokeId.tsx lines=[14,91]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";

import { JokeDisplay } from "~/components/joke";
import { db } from "~/utils/db.server";
import {
  getUserId,
  requireUserId,
} from "~/utils/session.server";

export const meta: MetaFunction<typeof loader> = ({
  data,
}) => {
  const { description, title } = data
    ? {
        description: `享受 "${data.joke.name}" 笑话以及更多内容`,
        title: `"${data.joke.name}" 笑话`,
      }
    : { description: "未找到笑话", title: "没有笑话" };

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ];
};

export const loader = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("什么笑话！未找到。", {
      status: 404,
    });
  }
  return json({
    isOwner: userId === joke.jokesterId,
    joke,
  });
};

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  if (form.get("intent") !== "delete") {
    throw new Response(
      `意图 ${form.get("intent")} 不被支持`,
      { status: 400 }
    );
  }
  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("无法删除不存在的内容", {
      status: 404,
    });
  }
  if (joke.jokesterId !== userId) {
    throw new Response(
      "嘘，试得不错。但那不是你的笑话",
      { status: 403 }
    );
  }
  await db.joke.delete({ where: { id: params.jokeId } });
  return redirect("/jokes");
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <JokeDisplay isOwner={data.isOwner} joke={data.joke} />
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return (
        <div className="error-container">
          你所尝试的操作是不允许的。
        </div>
      );
    }
    if (error.status === 403) {
      return (
        <div className="error-container">
          对不起，"{jokeId}" 不是你的笑话。
        </div>
      );
    }
    if (error.status === 404) {
      return (
        <div className="error-container">
          嗯？"{jokeId}" 到底是什么？
        </div>
      );
    }
  }

  return (
    <div className="error-container">
      加载 ID 为 "${jokeId}" 的笑话时出错。
      对不起。
    </div>
  );
}
```

</details>

<details>

<summary>app/routes/jokes.new.tsx</summary>

```tsx filename=app/routes/jokes.new.tsx lines=[11,15,84,86-103]
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useActionData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";

import { JokeDisplay } from "~/components/joke";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import {
  getUserId,
  requireUserId,
} from "~/utils/session.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("未经授权", { status: 401 });
  }
  return json({});
};

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return "这个笑话太短了";
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return "这个笑话的名称太短了";
  }
}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const content = form.get("content");
  const name = form.get("name");
  if (
    typeof content !== "string" ||
    typeof name !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "表单未正确提交。",
    });
  }

  const fieldErrors = {
    content: validateJokeContent(content),
    name: validateJokeName(name),
  };
  const fields = { content, name };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  if (navigation.formData) {
    const content = navigation.formData.get("content");
    const name = navigation.formData.get("name");
    if (
      typeof content === "string" &&
      typeof name === "string" &&
      !validateJokeContent(content) &&
      !validateJokeName(name)
    ) {
      return (
        <JokeDisplay
          canDelete={false}
          isOwner={true}
          joke={{ name, content }}
        />
      );
    }
  }

  return (
    <div>
      <p>添加你自己的搞笑笑话</p>
      <Form method="post">
        <div>
          <label>
            名称：{" "}
            <input
              defaultValue={actionData?.fields?.name}
              name="name"
              type="text"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.name
              )}
              aria-errormessage={
                actionData?.fieldErrors?.name
                  ? "name-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p
              className="form-validation-error"
              id="name-error"
              role="alert"
            >
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            内容：{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.content
              )}
              aria-errormessage={
                actionData?.fieldErrors?.content
                  ? "content-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              id="content-error"
              role="alert"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p
              className="form-validation-error"
              role="alert"
            >
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            添加
          </button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error) && error.status === 401) {
    return (
      <div className="error-container">
        <p>你必须登录才能创建笑话。</p>
        <Link to="/login">登录</Link>
      </div>
    );
  }

  return (
    <div className="error-container">
      出现意外错误。对此我们感到抱歉。
    </div>
  );
}
```

</details>

我喜欢我的例子的一点是，它可以使用与服务器使用的 _完全相同_ 的验证函数！因此，如果他们提交的内容将失败服务器端验证，我们甚至不需要渲染乐观 UI，因为我们知道它会失败。

也就是说，这种声明式乐观 UI 方法非常棒，因为我们不必担心错误恢复。如果请求失败，我们的组件将重新渲染，它将不再是提交，一切将像之前一样正常工作。太好了！

以下是该体验的演示： 

<video src="/jokes-tutorial/img/optimistic-ui.mp4" controls muted loop autoplay></video>

## 部署

我对我们在这里创建的用户体验感到非常满意。那么让我们开始部署吧！使用 Remix，您有很多部署选项。当您在本教程开始时运行 `npx create-remix@latest` 时，会给您几个选项。由于我们构建的教程依赖于 Node.js (`prisma`)，我们将部署到我们最喜欢的托管提供商之一：[Fly.io][fly-io]。

💿 在继续之前，您需要 [安装 fly][install-fly] 并 [注册一个帐户][sign-up-for-an-account]。

<docs-info>Fly.io 在创建帐户时会询问您的信用卡号码（请参见 [他们的博客文章][their-blog-article] 了解原因），但有免费的套餐可以满足作为简单侧项目托管的此应用的需求。</docs-info>

💿 完成后，从您的项目目录中运行以下命令：

```shellscript nonumber
fly launch
```

Fly 的团队非常友好，提供了很棒的设置体验。他们会检测到您的 Remix 项目，并问您几个问题以帮助您开始。以下是我的输出/选择：

```
Creating app in /Users/kentcdodds/Desktop/remix-jokes
Scanning source code
Detected a Remix app
? Choose an app name (leave blank to generate one): remix-jokes
automatically selected personal organization: Kent C. Dodds
Some regions require a paid plan (fra, maa).
See https://fly.io/plans to set up a plan.

? Choose a region for deployment: Dallas, Texas (US) (dfw)
Created app 'remix-jokes' in organization 'personal'
Admin URL: https://fly.io/apps/remix-jokes
Hostname: remix-jokes.fly.dev
Created a 1GB volume vol_18l524yj27947zmp in the dfw region
Wrote config file fly.toml

This launch configuration uses SQLite on a single, dedicated volume. It will not scale beyond a single VM. Look into 'fly postgres' for a more robust production database.

? Would you like to deploy now? No
Your app is ready! Deploy with `flyctl deploy`
```

您需要选择一个不同的应用名称，因为我已经使用了 `remix-jokes`（抱歉 🙃）。

它还允许您选择一个区域，我建议选择一个离您较近的区域。如果您决定将来在 Fly 上部署一个真实的应用，您可能会选择将 Fly 扩展到多个区域。

Fly 还检测到该项目正在使用 SQLite 和 Prisma，并为我们创建了一个持久性卷。

我们现在不想部署，因为我们需要设置一个环境变量！所以选择“否”。

Fly 为我们生成了一些文件：

- `fly.toml` - Fly 特定配置
- `Dockerfile` - 该应用的 Remix 特定 Dockerfile
- `.dockerignore` - 它只会忽略 `node_modules`，因为我们将在构建镜像时运行安装。

💿 现在通过运行以下命令设置 `SESSION_SECRET` 环境变量：

```shellscript nonumber
fly secrets set SESSION_SECRET=your-secret-here
```

`your-secret-here` 可以是您想要的任何内容。它只是一个用于签署会话 cookie 的字符串。如果您愿意，可以使用密码生成器。

我们还需要做的另一件事是准备 Prisma 以首次设置我们的数据库。现在我们对我们的模式感到满意，可以创建我们的第一次迁移。

💿 运行以下命令：

```shellscript nonumber
npx prisma migrate dev
```

这将在 `migrations` 目录中创建一个迁移文件。当它尝试运行种子文件时，您可能会收到错误。您可以安全地忽略它。它会询问您希望将迁移命名为什么：

```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

✔ Enter a name for the new migration: … init
```

💿 我将我的命名为“init”。然后您将获得其余的输出：

```
Applying migration `20211121111251_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20211121111251_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (4.12.0 | library) to ./node_modules/@prisma/client in 52ms


Running seed command `ts-node --require tsconfig-paths/register prisma/seed.ts` ...

🌱  The seed command has been executed.
```

💿 如果您在运行种子时确实遇到了错误，您现在可以手动运行它：

```shellscript nonumber
npx prisma db seed
```

完成后，您就准备好部署了。

💿 运行以下命令：

```shellscript nonumber
fly deploy
```

这将构建 Docker 镜像并在您选择的区域将其部署到 Fly。可能需要一点时间。在等待期间，您可以想想某个您很久没联系的人，给他们发个消息，告诉他们您为什么欣赏他们。

太好了！我们完成了，您让某人的一天变得更美好！成功！

您的应用现在可以在 `https://<your-app-name>.fly.dev` 上访问！您也可以在您的 Fly 帐户在线找到该 URL：[fly.io/apps][fly-io-apps]。

每次您进行更改时，只需再次运行 `fly deploy` 进行重新部署。

## 结论

呼！我们到此为止。如果你能完成整个过程，我真的很佩服你（[分享你的成功][tweet-your-success]）！Remix 有很多内容，而我们只是让你入门。祝你在接下来的 Remix 旅程中好运！