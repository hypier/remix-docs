---
title: 贡献
description: 感谢您为 Remix 贡献！在您提交拉取请求之前，这里是您需要了解的所有信息。
---

# 为 Remix 贡献

我们的目标是让 Remix 的开发保持稳定、持续和开放。没有我们优秀的用户社区，我们无法实现这一目标！

本文档将帮助您了解我们的开发流程以及如何设置您的环境。

**为了确保您的工作有更好的被接受的机会，请在贡献任何内容之前阅读此文档！**

## 贡献者许可协议

所有提交 Pull Request 的贡献者需要签署贡献者许可协议（CLA），该协议明确将贡献的所有权转让给我们。

当您开始一个 Pull Request 时，remix-cla-bot 会提示您查看 CLA 并通过将您的姓名添加到 [contributors.yml][contributors_yaml] 来签署它。

[阅读 CLA][cla]

## 角色

本文档提到具有以下角色的贡献者：

- **管理员**：具有管理员权限的GitHub组织团队，他们设置并管理路线图。
- **合作者**：具有写入权限的GitHub组织团队。他们管理问题、PR、讨论等。
- **贡献者**：就是你！ 

---

## 开发过程

### 功能开发

如果您有新功能的想法，请不要提交 Pull Request，而是按照以下流程操作：

1. 贡献者在 [GitHub Discussions][proposals] 中添加 **提案**。
2. Remix **管理员团队** 在 **路线图规划** 会议中接受提案。
   - 当管理员从提案中创建 **问题** 并将其添加到 [**路线图**][roadmap] 时，提案被接受。
3. 管理员为问题分配 **负责人**。
   - 负责人负责交付该功能，包括所有关于 API、行为和实现的决策。
   - 负责人与其他贡献者组织更大问题的工作。
   - 负责人可以是 Remix 团队内部或外部的贡献者。
4. 负责人从提案中创建 **RFC**，开发可以开始。
5. 强烈鼓励配对，特别是在开始时。

### Bug-Fix Pull Requests

如果您认为发现了一个错误，我们非常希望您能提交一个修复该错误的 PR！请遵循以下指南：

1. 贡献者在 Pull Request 中添加一个失败的测试以及修复
   - 理想情况下，第一个提交是一个失败的测试，随后是修复该测试的代码更改。
   - 这不是严格要求的，但非常受欢迎！
2. 管理员将作为路线图规划的一部分审查开放的 bugfix PR。
   - 简单的 bugfix 将立即合并。
   - 其他的将被添加到路线图中，并分配一个负责人来审查工作并完成它。

没有测试用例的 bug fix PR 可能会立即关闭（某些事情很难测试，我们会在这里使用判断）。

### Bug Report Issues

如果您认为发现了一个错误，但没有时间发送 PR，请遵循以下指南：

1. 在 Stackblitz、Replit、CodeSandbox 等地方创建一个问题的最小重现，以便我们可以访问并观察该错误：

   - [https://remix.new][https_remix_new] 使这变得非常简单

2. 如果这不可能（与某些托管设置有关等），请创建一个 GitHub 仓库，并在 README 中提供清晰的说明，以便我们可以运行并观察该错误。

3. 打开一个问题并链接到重现。

没有重现的错误报告将立即关闭，并要求提供重现。

### 路线图规划会议

您可以随时在我们的直播规划会议中查看 Remix 的开发进展：

- Remix 管理团队将每周召开会议，向社区报告进展，并将提案和已验证的错误添加到路线图中。
  - 添加提案到路线图需要 Remix 管理团队的一致同意。
  - 提案不会被“拒绝”，只有“接受”到路线图中。
  - 贡献者可以继续对提案进行投票和评论，如果提案获得新的活动，它将被提升到未来的审查中。
  - Remix 管理团队可以因任何原因锁定提案。
- 会议将在 [Remix YouTube 频道][youtube] 上进行直播。
  - 在会议进行时，欢迎大家加入 [Discord][discord] `#roadmap-livestream-chat`。
  - 邀请 Remix 合作伙伴参加。

### 问题跟踪

如果一个路线图问题预计会很大（涉及多个任务、作者、PR等），管理员团队将创建一个临时项目板。

- 原始问题将保留在路线图项目中以查看整体进度。
- 子任务将在临时项目中进行跟踪。
- 工作完成后，临时项目将被归档。
- 负责人负责将问题填充到子项目中，并将工作拆分成可交付的工作块。
- 鼓励使用构建/功能标志，而不是长期运行的分支。

### RFCs

- 所有计划中的问题必须在问题从 _Planned_ 转移到 _In Progress_ 之前，在官方 RFC 讨论类别中发布 RFC。
- 一些提案可能已经是足够的 RFC，可以直接移动到官方 RFC 讨论类别。
- 一旦 RFC 发布，开发可以开始，但所有者应考虑社区的反馈，在必要时调整他们的方向。

### 对于所有者的支持

- 所有者将被添加到 [Discord][discord] 的 `#collaborators` 私人频道，以获得架构和实施方面的帮助。该频道为私人频道，以帮助减少噪音，以便管理员不会错过消息，所有者可以得到解锁。所有者还可以在任何频道或任何地方讨论这些问题！
- 管理员将积极与所有者合作，以确保他们的问题和项目是有序的（正确的状态、相关问题的链接等）、有文档记录，并持续推进。
- 如果进展停滞，问题的所有者可能会被重新分配。

### 每周路线图审查

每周，Remix团队和任何外部**所有者**都会被邀请审查路线图

- 识别阻碍因素
- 在团队和社区中寻找配对机会

### 合作伙伴的角色

为了保持仓库的整洁和有序，合作伙伴将采取以下行动：

### 问题标签

- 没有复现的错误报告将立即关闭，并要求提供复现。
- 应该作为提案的问题将被转换为提案。
- 问题将被转换为**问答讨论**。
- 具有有效复现的问题将被标记为**已验证的错误**，并由管理员在路线图规划会议中添加到路线图中。

### Pull Requests Tab

- 未经过 **Development Process** 的功能将立即关闭，并要求改为开启讨论。
- 没有测试用例的 Bug 修复 PR 可能会立即关闭，并要求提供测试。（有些事情很难测试，协作者会在这里使用酌情权。）

---

## 开发环境设置

在您能够为代码库做出贡献之前，您需要先派生（fork）该仓库。根据您所做的贡献类型，这个过程会有所不同：

以下步骤将帮助您设置以便为该仓库贡献更改：

1. 派生该仓库（点击[此页面][fork]右上角的 <kbd>Fork</kbd> 按钮）。

2. 将您的派生仓库克隆到本地。

   ```shellscript nonumber
   # 在终端中，切换到您希望克隆到的父目录，然后
   git clone https://github.com/<your_github_username>/remix.git
   cd remix

   # 如果您要进行*任何*代码更改，请确保检出 dev 分支
   git checkout dev
   ```

3. 通过运行 `pnpm` 安装依赖。如果您使用 `npm` 安装，将会生成不必要的 `package-lock.json` 文件。

4. 通过运行 `npx playwright install` 安装 Playwright，以便能够正确运行测试，或[使用 Visual Studio Code 插件][vscode_playwright]。

5. 通过运行 `pnpm test` 验证您是否已为本地开发完成所有设置。

### 分支

**重要：** 在 GitHub 中创建 PR 时，请确保将基础设置为正确的分支。

- **`dev`** 用于代码更改。
- **`main`** 用于文档和一些模板的更改。

您可以在 GitHub 中创建 PR 时，通过“比较更改”标题下的下拉菜单设置基础：

<img src="https://raw.githubusercontent.com/remix-run/react-router/main/static/base-branch.png" alt="" width="460" height="350" />

### 测试

我们在这个项目中使用 `jest` 和 `playwright` 的组合进行测试。我们在集成文件夹中有一套集成测试，包有自己的 jest 配置，这些配置在项目根目录的主要 jest 配置中被引用。

集成测试和主要测试可以使用 `npm-run-all` 并行运行，以使测试尽可能快速和高效。要独立运行这两组测试，您需要运行各自的脚本：

- `pnpm test:primary`
- `pnpm test:integration`

我们还支持项目、文件和测试过滤的监视插件。要进行过滤，您可以使用 `--testNamePattern`、`--testPathPattern` 和 `--selectProjects` 的组合。例如：

```shellscript nonumber
pnpm test:primary --selectProjects react --testPathPattern transition --testNamePattern "initial values"
```

我们也为这些提供了监视模式插件。因此，您可以运行 `pnpm test:primary --watch` 并按 `w` 查看可用的监视命令。

或者，您可以通过 `cd` 进入该项目并运行 `pnpm jest`，以完全独立地运行该项目，这将加载该项目的 jest 配置。

## 开发工作流程

### 包

Remix 使用单一代码库来托管多个包的代码。这些包位于 `packages` 目录中。

我们使用 [pnpm workspaces][pnpm_workspaces] 来管理依赖项的安装和运行各种脚本。要安装所有内容，请从仓库根目录运行 `pnpm install`。

### 构建

从根目录运行 `pnpm build` 将执行构建。您可以使用 `pnpm watch` 在监视模式下运行构建。

### Playground

在开发应用功能时，能够与真实应用互动通常非常有用。因此，您可以将应用放置在 `playground` 目录中，构建过程将自动将所有输出复制到 `playground` 目录中所有应用的 `node_modules` 中。它甚至会为您触发一个实时重载事件！

要生成一个新的 playground，只需运行：

```shellscript nonumber
pnpm playground:new <?name>
```

其中 playground 的名称是可选的，默认为 `playground-${Date.now()}`。然后，您可以 `cd` 进入为您生成的目录并运行 `npm run dev`。在另一个终端窗口中运行 `pnpm watch`，您就可以开始使用实时重载魔法 🧙‍♂️ 开发您喜欢的任何 Remix 功能。

从 `pnpm playground:new` 生成的 playground 是基于 `scripts/playground/template` 中的模板。如果您想更改模板中的任何内容，可以在 `scripts/playground/template.local` 中创建一个自定义模板，该文件会被 `.gitignored`，因此您可以根据自己的需要进行自定义。

### 测试

在运行测试之前，您需要先进行构建。在构建完成后，从根目录运行 `pnpm test` 将会运行 **每个** 包的测试。如果您想为特定包运行测试，请使用 `pnpm test:primary --selectProjects <display-name>`：

```shellscript nonumber
# 测试所有包
pnpm test

# 仅测试 @remix-run/express
pnpm test:primary --selectProjects express
```

## 仓库分支

该仓库为不同目的维护了独立的分支。它们看起来像这样：

```
- main   > the most recent release and current docs
- dev    > code under active development between stable releases
```

可能还有其他分支用于各种功能和实验，但所有的关键工作都发生在这些分支上。

## 夜间发布是如何工作的？

夜间发布将按计划工作流运行来自 `main` 分支的操作文件，这将始终使用默认分支的最新提交，标志为[此夜间操作文件的评论][nightly_action_comment]，然而它们在设置过程中检出 `dev` 分支，因为我们希望我们的夜间发布从那里切出。从那里，我们检查 git SHA 是否相同，只有在某些内容发生变化时才会切出新的夜间版本。

## 端到端测试

对于每次 Remix 的发布（稳定版、实验版、夜间版和预发布），我们将对 Remix 应用程序在每个官方适配器上进行完整的端到端测试，从 `create-remix` 到将它们部署到生产环境。我们通过利用默认的 [templates][templates] 和 Fly、Arc 的 CLI 来实现这一点。然后，我们将运行一些简单的 Cypress 断言，以确保开发和已部署应用程序的正常运行。

[proposals]: https://github.com/remix-run/remix/discussions/categories/proposals  
[roadmap]: https://github.com/orgs/remix-run/projects/5  
[youtube]: https://www.youtube.com/@Remix-Run/streams  
[discord]: https://rmx.as/discord  
[contributors_yaml]: https://github.com/remix-run/remix/blob/main/contributors.yml  
[cla]: https://github.com/remix-run/remix/blob/main/CLA.md  
[fork]: https://github.com/remix-run/remix  
[pnpm_workspaces]: https://pnpm.io/workspaces  
[vscode_playwright]: https://playwright.dev/docs/intro#using-the-vs-code-extension  
[nightly_action_comment]: https://github.com/remix-run/remix/blob/main/.github/workflows/nightly.yml#L8-L12  
[templates]: ./templates  
[https_remix_new]: https://remix.new