---
title: 部署
toc: false
---

# 部署

Remix 维护了一些 [starter templates][starter-templates]，以帮助您从一开始就将应用部署到各种服务器。您应该能够在几分钟内初始化您的应用并使其上线。

运行 `npx create-remix@latest` 并带上 `--template` 标志，可以让您提供这些模板之一的 URL，例如：

```sh
npx create-remix@latest --template remix-run/remix/templates/express
```

每个目标都有独特的文件结构、配置文件、需要运行的 CLI 命令、需要设置的服务器环境变量等。因此，阅读 README.md 以部署应用非常重要。它包含了您需要采取的所有步骤，以便在几分钟内让您的应用上线。

<docs-info>初始化应用后，请确保阅读 README.md</docs-info>

此外，Remix 不会对您的基础设施进行抽象，因此模板不会隐藏有关您要部署的位置的任何信息（您可能希望拥有 Remix 应用之外的其他功能！）。您可以根据需要调整配置。Remix 运行在您的服务器上，但它不是您的服务器。

简而言之：如果您想要部署您的应用，请阅读手册 😋

[starter-templates]: https://github.com/remix-run/remix/tree/main/templates