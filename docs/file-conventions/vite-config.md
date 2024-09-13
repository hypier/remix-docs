---
title: vite.config.ts
---

# vite.config.ts

<docs-warning>如果您的项目仍在使用 [Classic Remix Compiler][classic-remix-compiler]，请参考 [remix.config.js documentation][remix-config]。</docs-warning>

Remix 使用 [Vite] 来编译您的应用程序。您需要提供一个包含 Remix Vite 插件的 Vite 配置文件。以下是您需要的最低配置：

```ts filename=vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [remix()],
});
```

<docs-info>Vite 支持使用 `.js` 文件作为您的配置，但我们建议使用 TypeScript 来帮助确保您的配置有效。</docs-info>

## Remix Vite 插件配置

```js filename=vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      basename: "/",
      buildDirectory: "build",
      future: {
        /* 任何启用的未来标志 */
      },
      ignoredRouteFiles: ["**/*.css"],
      routes(defineRoutes) {
        return defineRoutes((route) => {
          route("/somewhere/cool/*", "catchall.tsx");
        });
      },
      serverBuildFile: "index.js",
    }),
  ],
});
```

#### appDirectory

相对于项目根目录的 `app` 目录路径。默认为
`"app"`。

#### future

`future` 配置允许您通过 [Future Flags][future-flags] 选择未来的重大更改。

#### ignoredRouteFiles

这是一个通过 [minimatch][minimatch] 匹配的文件数组，Remix 在读取您的 `app/routes` 目录时将匹配这些文件。如果文件匹配，它将被忽略，而不是被视为路由模块。这对于忽略您希望共存的 CSS/测试文件非常有用。

#### routes

一个用于定义自定义路由的函数，除了已经使用 `app/routes` 中的文件系统约定定义的路由。两组路由将被合并。

```ts filename=vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      routes: async (defineRoutes) => {
        // 如果您需要进行异步工作，请在调用 `defineRoutes` 之前完成，我们使用
        // `route` 内部的调用栈来设置嵌套。

        return defineRoutes((route) => {
          // 这常用于通配路由。
          // - 第一个参数是要匹配的 React Router 路径
          // - 第二个是路由处理程序的相对文件名
          route("/some/path/*", "catchall.tsx");

          // 如果您想嵌套路由，请使用可选的回调参数
          route("some/:path", "some/route/file.js", () => {
            // - path 相对于父路径
            // - 文件名仍然相对于应用程序目录
            route("relative/path", "some/other/file");
          });
        });
      },
    }),
  ],
});
```

#### serverModuleFormat

服务器构建的输出格式，可以是 `"cjs"` 或 `"esm"`。默认为 `"esm"`。

#### buildDirectory

相对于项目根目录的构建目录路径。默认为
`"build"`。

#### basename

路由路径的可选基本名称，通过 [React Router "basename" 选项][rr-basename] 传递。请注意，这与您的 _资产_ 路径不同。您可以通过 [Vite "base" 选项][vite-base] 配置您的资产的 [base public path][vite-public-base-path]。

#### buildEnd

在完整的 Remix 构建完成后调用的函数。

#### manifest

是否将 `.remix/manifest.json` 文件写入构建目录。默认为 `false`。

#### presets

一个 [presets] 数组，以便于与其他工具和托管提供商的集成。

#### serverBuildFile

在服务器构建目录中生成的服务器文件的名称。默认为 `"index.js"`。

#### serverBundles

一个用于将可寻址路由分配给 [server bundles][server-bundles] 的函数。

您可能还想启用 `manifest` 选项，因为当启用服务器包时，它包含路由与服务器包之间的映射。

[classic-remix-compiler]: ../guides/vite#classic-remix-compiler-vs-remix-vite
[remix-config]: ./remix-config
[vite]: https://vitejs.dev
[future-flags]: ../start/future-flags
[minimatch]: https://npm.im/minimatch
[presets]: ../guides/presets
[server-bundles]: ../guides/server-bundles
[rr-basename]: https://reactrouter.com/routers/create-browser-router#basename
[vite-public-base-path]: https://vitejs.dev/config/shared-options.html#base
[vite-base]: https://vitejs.dev/config/shared-options.html#base