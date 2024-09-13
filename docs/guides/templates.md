---
title: 模板
description: 快速开始使用 Remix 的最佳方式
---

# 模板和堆栈

使用 [`create-remix`][create_remix] 生成新项目时，您可以选择一个模板或堆栈，以快速启动和运行。模板是让您快速启动的最小起点。“堆栈”是更完整且更接近生产就绪架构的模板（可能包括测试、数据库、CI 和部署配置等方面）。

## 模板

如果您运行 `create-remix` 而不提供 `--template` 选项，您将获得一个使用 [Remix App Server][remix_app_server] 的基本模板。

```shellscript nonumber
npx create-remix@latest
```

如果您不想使用 TypeScript，您可以安装更简单的 Javascript 模板：

```shellscript nonumber
npx create-remix@latest --template remix-run/remix/templates/remix-javascript
```

如果您只是想第一次尝试 Remix，这是一个很好的起点。您可以随时自己扩展这个起点或稍后迁移到更高级的模板。

### 官方模板

如果您希望对服务器有更多控制，或者希望部署到非节点运行时，例如 [Arc][arc]、[Cloudflare][cloudflare] 或 [Deno][deno]，您可以尝试从 Remix 仓库中使用我们的 [官方模板][official_templates]：

```shellscript nonumber
npx create-remix@latest --template remix-run/remix/templates/cloudflare
npx create-remix@latest --template remix-run/remix/templates/cloudflare-workers
npx create-remix@latest --template remix-run/remix/templates/express
npx create-remix@latest --template remix-run/remix/templates/remix
npx create-remix@latest --template remix-run/remix/templates/remix-javascript

## SPA 模式
npx create-remix@latest --template remix-run/remix/templates/spa

## 经典 Remix 编译器
npx create-remix@latest --template remix-run/remix/templates/classic-remix-compiler/arc
npx create-remix@latest --template remix-run/remix/templates/classic-remix-compiler/cloudflare-pages
npx create-remix@latest --template remix-run/remix/templates/classic-remix-compiler/cloudflare-workers
npx create-remix@latest --template remix-run/remix/templates/classic-remix-compiler/deno
npx create-remix@latest --template remix-run/remix/templates/classic-remix-compiler/express
npx create-remix@latest --template remix-run/remix/templates/classic-remix-compiler/fly
npx create-remix@latest --template remix-run/remix/templates/classic-remix-compiler/remix
npx create-remix@latest --template remix-run/remix/templates/classic-remix-compiler/remix-javascript
```

### 第三方模板

一些托管提供商维护自己的 Remix 模板。有关更多信息，请参阅下面列出的官方集成指南。

- [Netlify][netlify_template_docs]
- [Vercel][vercel_template_docs]

### 示例

我们还提供了一个[社区驱动的示例库][examples]，每个示例展示了不同的 Remix 特性、模式、工具、托管服务提供商等。您可以以类似的方式使用这些示例来安装工作示例：

```shellscript nonumber
npx create-remix@latest --template remix-run/examples/basic
```

## Stacks

当一个模板接近于生产就绪的应用程序时，甚至提供有关 CI/CD 管道、数据库和托管平台的建议，Remix 社区称这些模板为“栈”。

提供了几个官方栈，但您也可以自己创建（请参阅下文）。

[阅读功能公告博客文章][feature_announcement_blog_post] 和 [在 YouTube 上观看 Remix Stacks 视频][remix_stacks_videos_on_youtube]。

### 官方技术栈

官方技术栈已经准备好您在生产应用中所需的常见功能，包括：

- 数据库
- 自动部署管道
- 身份验证
- 测试
- 代码检查/格式化/TypeScript

您所需要做的就是开始构建您想要用 Remix 创建的任何令人惊叹的网络体验。一切都已完全设置好。以下是官方技术栈：

- [The Blues Stack][blues_stack]: 部署到边缘（分布式），配备长时间运行的 Node.js 服务器和 PostgreSQL 数据库。旨在支持大型和快速的生产级应用，服务数百万用户。
- [The Indie Stack][indie_stack]: 部署到一个长时间运行的 Node.js 服务器，配备持久化的 SQLite 数据库。这个栈非常适合您控制的动态数据网站（博客、营销、内容网站）。它也是一个完美的、低复杂度的启动选项，适用于 MVP、原型和概念验证，后续可以轻松升级到 Blues stack。
- [The Grunge Stack][grunge_stack]: 部署到运行 Node.js 的无服务器函数，使用 DynamoDB 进行持久化。旨在为希望在 AWS 基础设施上部署生产级应用的用户服务数百万用户。

您可以通过在运行 `create-remix` 时提供 `--template` 选项来使用这些技术栈，例如：

```shellscript nonumber
npx create-remix@latest --template remix-run/blues-stack
```

是的，这些名称来源于音乐流派。🤘 摇滚吧。

### 社区栈

您可以在 GitHub 上[浏览社区栈列表][remix_stack_topic]。

社区栈可以通过在运行 `create-remix` 时将 GitHub 用户名/仓库组合传递给 `--template` 选项来使用，例如：

```shellscript nonumber
npx create-remix@latest --template :username/:repo
```

<docs-success>如果您想与社区分享您的栈，请务必使用 [remix-stack][remix_stack_topic] 主题进行标记，以便其他人可以找到它——是的，我们确实建议您以音乐子流派命名自己的栈（不是“摇滚”，而是“独立”！）。</docs-success>

## 其他信息

### 私有模板

如果您的模板在一个私有 GitHub 仓库中，您可以通过 `--token` 选项传递一个 GitHub 令牌：

```shellscript nonumber
npx create-remix@latest --template your-private/repo --token yourtoken
```

[令牌只需要 `repo` 访问权限][repo_access_token]。

### 本地模板

您可以为 `--template` 选项提供一个本地目录或磁盘上的 tarball，例如：

```shellscript nonumber
npx create-remix@latest --template /my/remix-stack
npx create-remix@latest --template /my/remix-stack.tar.gz
npx create-remix@latest --template /my/remix-stack.tgz
npx create-remix@latest --template file:///Users/michael/my-remix-stack.tar.gz
```

### 自定义模板提示

#### 依赖版本

如果您在 package.json 中将任何依赖项设置为 `*`，Remix CLI 将其更改为已安装 Remix 版本的 semver caret：

```diff
-   "remix": "*",
+   "remix": "^2.0.0",
```

这使您无需定期将模板更新到该特定包的最新版本。当然，如果您希望手动管理该包的版本，则不需要使用 `*`。

#### 自定义初始化

如果模板的根目录中有 `remix.init/index.js` 文件，则该文件将在项目生成和依赖项安装后执行。这为您提供了在模板初始化过程中执行任何操作的机会。例如，在蓝色栈中，`app` 属性必须全局唯一，因此我们使用 `remix.init/index.js` 文件将其更改为为项目创建的目录名称加上几个随机字符。

您甚至可以使用 `remix.init/index.js` 向开发者询问更多问题以进行额外配置（使用类似 [inquirer][inquirer] 的工具）。有时，您需要安装依赖项才能做到这一点，但这些依赖项仅在初始化期间有用。在这种情况下，您还可以创建一个 `remix.init/package.json` 文件并添加依赖项，Remix CLI 会在运行您的脚本之前安装这些依赖项。

在初始化脚本运行后，`remix.init` 文件夹会被删除，因此您无需担心它会使最终代码库变得杂乱。

<docs-warning>请注意，消费者可以选择不运行 `remix.init` 脚本。要手动执行此操作，他们需要运行 `remix init`。</docs-warning>

[create_remix]: ../other-api/create-remix
[remix_app_server]: ../other-api/serve
[repo_access_token]: https://github.com/settings/tokens/new?description=Remix%20Private%20Stack%20Access&scopes=repo
[inquirer]: https://npm.im/inquirer
[feature_announcement_blog_post]: /blog/remix-stacks
[remix_stacks_videos_on_youtube]: https://www.youtube.com/playlist?list=PLXoynULbYuEC8-gJCqyXo94RufAvSA6R3
[blues_stack]: https://github.com/remix-run/blues-stack
[indie_stack]: https://github.com/remix-run/indie-stack
[grunge_stack]: https://github.com/remix-run/grunge-stack
[remix_stack_topic]: https://github.com/topics/remix-stack
[official_templates]: https://github.com/remix-run/remix/tree/main/templates
[examples]: https://github.com/remix-run/examples
[vercel_template_docs]: https://vercel.com/docs/frameworks/remix
[netlify_template_docs]: https://docs.netlify.com/integrations/frameworks/remix
[arc]: https://arc.codes/docs/en/get-started/quickstart
[deno]: https://deno.com
[cloudflare]: https://www.cloudflare.com