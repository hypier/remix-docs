---
title: remix.config.js
hidden: true
---

# remix.config.js

<docs-warning>`remix.config.js` 仅在使用 [Classic Remix Compiler][classic-remix-compiler] 时相关。当使用 [Remix Vite][remix-vite] 时，此文件不应出现在您的项目中。相反，Remix 配置应提供给 [Vite config][vite-config] 中的 Remix 插件。</docs-warning>

此文件有一些构建和开发配置选项，但实际上并不在您的服务器上运行。

```js filename=remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  future: {
    /* any enabled future flags */
  },
  ignoredRouteFiles: ["**/*.css"],
  publicPath: "/build/",
  routes(defineRoutes) {
    return defineRoutes((route) => {
      route("/somewhere/cool/*", "catchall.tsx");
    });
  },
  serverBuildPath: "build/index.js",
};
```

## appDirectory

`app`目录的路径，相对于remix.config.js。默认为`"app"`。

```js filename=remix.config.js
// default
exports.appDirectory = "./app";

// custom
exports.appDirectory = "./elsewhere";
```

## assetsBuildDirectory

相对于 remix.config.js 的浏览器构建路径。默认为 "public/build"。应部署到静态托管。

## browserNodeBuiltinsPolyfill

要在浏览器构建中包含的 Node.js polyfills。polyfills 由 [JSPM][jspm] 提供，并通过 [esbuild-plugins-node-modules-polyfill] 配置。

```js filename=remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  browserNodeBuiltinsPolyfill: {
    modules: {
      buffer: true, // 提供 JSPM polyfill
      fs: "empty", // 提供一个空的 polyfill
    },
    globals: {
      Buffer: true,
    },
  },
};
```

使用此选项并针对非 Node.js 服务器平台时，您可能还想通过 [`serverNodeBuiltinsPolyfill`][server-node-builtins-polyfill] 为服务器配置 Node.js polyfills。

## cacheDirectory

Remix 在开发中可以用于缓存内容的目录路径，相对于 `remix.config.js`。默认值为 `".cache"`。

## 未来

`future` 配置允许您通过 [Future Flags][future-flags] 选择未来的重大更改。有关所有可用 Future Flags 的列表，请参见 [当前 Future Flags][current-future-flags] 部分。

## ignoredRouteFiles

这是一个 globs 数组（通过 [minimatch][minimatch]），Remix 在读取您的 `app/routes` 目录时将匹配这些文件。如果文件匹配，它将被忽略，而不是被视为路由模块。这对于忽略您希望与之共存的 CSS/测试文件非常有用。

## publicPath

浏览器构建的 URL 前缀，后面带有斜杠。默认为 `"/build/"`。这是浏览器用于查找资源的路径。

```js filename=remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  publicPath: "/assets/",
};
```

如果您希望从一个单独的域名提供静态资源，您也可以指定绝对路径：

```js filename=remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  publicPath: "https://static.example.com/assets/",
};
```

## postcss

如果存在 PostCSS 配置文件，则是否使用 [PostCSS][postcss] 处理 CSS。默认为 `true`。

```js filename=remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  postcss: false,
};
```

## 路由

一个用于定义自定义路由的函数，除了那些已经使用 `app/routes` 中的文件系统约定定义的路由。两组路由将被合并。

```js filename=remix.config.js
exports.routes = async (defineRoutes) => {
  // 如果你需要进行异步工作，请在调用 `defineRoutes` 之前完成，我们使用
  // `route` 内部的调用栈来设置嵌套。

  return defineRoutes((route) => {
    // 这通常用于捕获所有路由。
    // - 第一个参数是要匹配的 React Router 路径
    // - 第二个是路由处理程序的相对文件名
    route("/some/path/*", "catchall.tsx");

    // 如果你想嵌套路由，请使用可选的回调参数
    route("some/:path", "some/route/file.js", () => {
      // - 路径相对于父路径
      // - 文件名仍然相对于应用目录
      route("relative/path", "some/other/file");
    });
  });
};
```

## server

一个服务器入口点，相对于根目录，成为您服务器的主模块。如果指定，Remix 将与您的应用程序一起编译此文件为一个单独的文件，以便部署到您的服务器。此文件可以使用 `.js` 或 `.ts` 文件扩展名。

## serverBuildPath

服务器构建文件的路径，相对于 `remix.config.js`。该文件应以 `.js` 扩展名结尾，并应部署到您的服务器。默认为 `"build/index.js"`。

## serverConditions

在 `package.json` 中解析服务器依赖项的 `exports` 字段时使用的条件顺序。

## serverDependenciesToBundle

一组正则表达式模式，用于确定模块是否被转译并包含在服务器包中。这在使用仅支持 ESM 的包进行 CJS 构建时，或者在使用具有 [CSS 副作用导入][css_side_effect_imports] 的包时非常有用。

例如，`unified` 生态系统完全是 ESM-only。假设我们还在使用一个同样是 ESM-only 的 `@sindresorhus/slugify`。以下是如何在 CJS 应用中使用这些包，而无需使用动态导入：

```js filename=remix.config.js lines=[8-13]
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildPath: "build/index.js",
  ignoredRouteFiles: ["**/*.css"],
  serverDependenciesToBundle: [
    /^rehype.*/,
    /^remark.*/,
    /^unified.*/,
    "@sindresorhus/slugify",
  ],
};
```

如果您想打包所有服务器依赖项，可以将 `serverDependenciesToBundle` 设置为 `"all"`。

## serverMainFields

在解析服务器依赖项时使用的主字段顺序。当 `serverModuleFormat` 设置为 `"cjs"` 时，默认为 `["main", "module"]`。当 `serverModuleFormat` 设置为 `"esm"` 时，默认为 `["module", "main"]`。

## serverMinify

是否在生产环境中对服务器构建进行压缩。默认值为 `false`。

## serverModuleFormat

服务器构建的输出格式，可以是 `"cjs"` 或 `"esm"`。
默认为 `"esm"`。

## serverNodeBuiltinsPolyfill

在目标非 Node.js 服务器平台时，包含在服务器构建中的 Node.js polyfills。polyfills 由 [JSPM][jspm] 提供，并通过 [esbuild-plugins-node-modules-polyfill] 配置。

```js filename=remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverNodeBuiltinsPolyfill: {
    modules: {
      buffer: true, // Provide a JSPM polyfill
      fs: "empty", // Provide an empty polyfill
    },
    globals: {
      Buffer: true,
    },
  },
};
```

使用此选项时，您可能还希望通过 [`browserNodeBuiltinsPolyfill`][browser-node-builtins-polyfill] 为浏览器配置 Node.js polyfills。

## serverPlatform

服务器构建所针对的平台，可以是 `"neutral"` 或 `"node"`。默认为 `"node"`。

## tailwind

如果安装了 `tailwindcss`，则在 CSS 文件中是否支持 [Tailwind 函数和指令][tailwind_functions_and_directives]。默认为 `true`。

```js filename=remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  tailwind: false,
};
```

## watchPaths

一个数组、字符串或异步函数，用于定义在运行 [remix dev][remix_dev] 时要监视的自定义目录，相对于项目根目录。这些目录是 [`appDirectory`][app_directory] 之外的。

```js filename=remix.config.js
exports.watchPaths = async () => {
  return ["./some/path/*"];
};

// also valid
exports.watchPaths = ["./some/path/*"];
```

## 文件命名约定

Remix 使用的一些约定是您应该了解的。

<docs-info>[Dilum Sanjaya][dilum_sanjaya] 制作了 [一个很棒的可视化][an_awesome_visualization]，展示了文件系统中的路由如何映射到您应用中的 URL，这可能帮助您理解这些约定。</docs-info>

[minimatch]: https://npm.im/minimatch
[dilum_sanjaya]: https://twitter.com/DilumSanjaya
[an_awesome_visualization]: https://interactive-remix-routing-v2.netlify.app
[remix_dev]: ../other-api/dev#remix-dev
[app_directory]: #appdirectory
[css_side_effect_imports]: ../styling/css-imports
[postcss]: https://postcss.org
[tailwind_functions_and_directives]: https://tailwindcss.com/docs/functions-and-directives
[jspm]: https://github.com/jspm/jspm-core
[esbuild-plugins-node-modules-polyfill]: https://npm.im/esbuild-plugins-node-modules-polyfill
[browser-node-builtins-polyfill]: #browsernodebuiltinspolyfill
[server-node-builtins-polyfill]: #servernodebuiltinspolyfill
[future-flags]: ../start/future-flags
[current-future-flags]: ../start/future-flags#current-future-flags
[classic-remix-compiler]: ../guides/vite#classic-remix-compiler-vs-remix-vite
[remix-vite]: ../guides/vite
[vite-config]: ./vite-config