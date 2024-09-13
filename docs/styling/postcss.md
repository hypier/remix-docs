---
title: PostCSS
---

# PostCSS

<docs-warning>此文档仅在使用 [Classic Remix Compiler][classic-remix-compiler] 时相关。如果您使用的是 [Remix Vite][remix-vite]，则 [PostCSS 的支持已内置于 Vite][vite-postcss]。</docs-warning>

[PostCSS][postcss] 是一个流行的工具，拥有丰富的插件生态系统，通常用于为旧版浏览器添加前缀、转译未来的 CSS 语法、内联图像、检查样式等。当检测到 PostCSS 配置时，Remix 将自动在项目中的所有 CSS 上运行 PostCSS。

例如，要使用 [Autoprefixer][autoprefixer]，首先安装 PostCSS 插件。

```shellscript nonumber
npm install -D autoprefixer
```

然后在 Remix 根目录中添加一个引用该插件的 PostCSS 配置文件。

```js filename=postcss.config.cjs
module.exports = {
  plugins: {
    autoprefixer: {},
  },
};
```

如果您使用 [Vanilla Extract][vanilla-extract]，由于它已经充当 CSS 预处理器，您可能希望应用与其他样式不同的一组 PostCSS 插件。为此，您可以从 PostCSS 配置文件中导出一个函数，该函数接受一个上下文对象，让您知道 Remix 何时正在处理 Vanilla Extract 文件。

```js filename=postcss.config.cjs
module.exports = (ctx) => {
  return ctx.remix?.vanillaExtract
    ? {
        // Vanilla Extract 样式的 PostCSS 插件...
      }
    : {
        // 其他样式的 PostCSS 插件...
      };
};
```

<docs-info>通过在 `remix.config.js` 中将 `postcss` 选项设置为 `false`，可以禁用内置的 PostCSS 支持。</docs-info>

## CSS 预处理器

您可以使用像 LESS 和 SASS 这样的 CSS 预处理器。这样做需要运行额外的构建过程，将这些文件转换为 CSS 文件。这可以通过预处理器提供的命令行工具或任何等效工具来完成。

一旦通过预处理器转换为 CSS，生成的 CSS 文件可以通过 [Route Module `links` export][route-module-links] 函数导入到您的组件中，或者在使用 [CSS bundling][css-bundling] 时通过 [side effect imports][css-side-effect-imports] 包含，就像 Remix 中的任何其他 CSS 文件一样。

为了简化使用 CSS 预处理器的开发，您可以在 `package.json` 中添加 npm 脚本，从您的 SASS 或 LESS 文件生成 CSS 文件。这些脚本可以与您为开发 Remix 应用程序运行的任何其他 npm 脚本并行运行。

使用 SASS 的示例。

1. 首先，您需要安装您的预处理器用于生成 CSS 文件的工具。

   ```shellscript nonumber
   npm add -D sass
   ```

2. 在 `package.json` 的 `scripts` 部分添加一个 npm 脚本，使用已安装的工具生成 CSS 文件。

   ```jsonc filename=package.json
   {
     // ...
     "scripts": {
       // ...
       "sass": "sass --watch app/:app/"
     }
     // ...
   }
   ```

   上面的示例假设 SASS 文件将存储在 `app` 文件夹中的某个地方。

   上面包含的 `--watch` 标志将使 `sass` 作为一个活动进程持续运行，监听对 SASS 文件的更改或任何新 SASS 文件的添加。当源文件发生更改时，`sass` 将自动重新生成 CSS 文件。生成的 CSS 文件将存储在与其源文件相同的位置。

3. 运行 npm 脚本。

   ```shellscript nonumber
   npm run sass
   ```

   这将启动 `sass` 进程。任何新的 SASS 文件或对现有 SASS 文件的更改都将被运行中的进程检测到。

   您可能想使用类似 `concurrently` 的工具，以避免需要两个终端标签来生成 CSS 文件并同时运行 `remix dev`。

   ```shellscript nonumber
   npm add -D concurrently
   ```

   ```json filename=package.json
   {
     "scripts": {
       "dev": "concurrently \"npm run sass\" \"remix dev\""
     }
   }
   ```

   运行 `npm run dev` 将在一个终端窗口中并行运行指定的命令。

[postcss]: https://postcss.org
[autoprefixer]: https://github.com/postcss/autoprefixer
[vanilla-extract]: ./vanilla-extract
[route-module-links]: ../route/links
[css-side-effect-imports]: ./css-imports
[css-bundling]: ./bundling
[postcss-preset-env]: https://preset-env.cssdb.org
[esbuild-css-tree-shaking-issue]: https://github.com/evanw/esbuild/issues/1370
[classic-remix-compiler]: ../guides/vite#classic-remix-compiler-vs-remix-vite
[remix-vite]: ../guides/vite
[vite-postcss]: https://vitejs.dev/guide/features#postcss