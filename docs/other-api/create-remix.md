---
title: "create-remix (CLI)"
---

# `create-remix`

`create-remix` CLI 将创建一个新的 Remix 项目。在不传递参数的情况下，此命令将启动一个交互式 CLI，以配置新项目并在给定目录中设置它。

```sh
npx create-remix@latest
```

可选地，您可以将所需的目录路径作为参数传递：

```sh
npx create-remix@latest <projectDir>
```

默认应用程序是一个使用内置 [Remix App Server][remix-app-server] 的 TypeScript 应用。如果您希望基于不同的设置创建应用程序，可以使用 [`--template`][template-flag-hash-link] 标志：

```sh
npx create-remix@latest --template <templateUrl>
```

要获取可用命令和标志的完整列表，请运行：

```sh
npx create-remix@latest --help
```

### 包管理器

`create-remix` 也可以通过各种包管理器调用，允许您选择使用 npm、Yarn、pnpm 或 Bun 来管理安装过程。

```sh
npm create remix@latest <projectDir>
# or
yarn create remix <projectDir>
# or
pnpm create remix <projectDir>
# or
bunx create-remix <projectDir>
```

### `create-remix --template`

有关可用模板的更全面指南，请参见我们的 [templates page.][templates]

有效的模板可以是：

- GitHub 仓库简写 — `:username/:repo` 或 `:username/:repo/:directory`
- GitHub 仓库（或其中的目录）的 URL — `https://github.com/:username/:repo` 或 `https://github.com/:username/:repo/tree/:branch/:directory`
  - 使用此格式时，分支名称（`:branch`）不能包含 `/`，因为 `create-remix` 无法区分分支名称和目录路径
- 远程 tarball 的 URL — `https://example.com/remix-template.tar.gz`
- 本地文件路径到文件目录 — `./path/to/remix-template`
- 本地文件路径到 tarball — `./path/to/remix-template.tar.gz`

```sh
npx create-remix@latest ./my-app --template remix-run/grunge-stack
npx create-remix@latest ./my-app --template remix-run/remix/templates/remix
npx create-remix@latest ./my-app --template remix-run/examples/basic
npx create-remix@latest ./my-app --template :username/:repo
npx create-remix@latest ./my-app --template :username/:repo/:directory
npx create-remix@latest ./my-app --template https://github.com/:username/:repo
npx create-remix@latest ./my-app --template https://github.com/:username/:repo/tree/:branch
npx create-remix@latest ./my-app --template https://github.com/:username/:repo/tree/:branch/:directory
npx create-remix@latest ./my-app --template https://github.com/:username/:repo/archive/refs/tags/:tag.tar.gz
npx create-remix@latest ./my-app --template https://github.com/:username/:repo/releases/latest/download/:tag.tar.gz
npx create-remix@latest ./my-app --template https://example.com/remix-template.tar.gz
npx create-remix@latest ./my-app --template ./path/to/remix-template
npx create-remix@latest ./my-app --template ./path/to/remix-template.tar.gz
```

<aside aria-label="私有 GitHub 仓库模板">
<docs-info>

要从私有 GitHub 仓库中的模板创建新项目，请使用 `--token` 标志传递具有该仓库访问权限的个人访问令牌。

</docs-info>
</aside>

### `create-remix --overwrite`

如果 `create-remix` 检测到模板与您正在创建应用的目录之间存在文件冲突，它将提示您确认是否可以用模板版本覆盖这些文件。您可以使用 `--overwrite` CLI 标志跳过此提示。

[templates]: ../guides/templates  
[remix-app-server]: ./serve  
[template-flag-hash-link]: #create-remix---template