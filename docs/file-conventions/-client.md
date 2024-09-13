---
title: ".client 模块"
toc: false
---

# `.client` 模块

虽然不常见，但您可能会有一个文件或依赖项在浏览器中使用模块副作用。您可以在文件名中使用 `*.client.ts` 或将文件嵌套在 `.client` 目录中，以强制它们不包含在服务器包中。

```ts filename=feature-check.client.ts
// this would break the server
export const supportsVibrationAPI =
  "vibrate" in window.navigator;
```

请注意，从此模块导出的值在服务器上将全部为 `undefined`，因此唯一可以使用它们的地方是在 [`useEffect`][use_effect] 和用户事件（如点击处理程序）中。

```ts
import { supportsVibrationAPI } from "./feature-check.client.ts";

console.log(supportsVibrationAPI);
// server: undefined
// client: true | false
```

<docs-warning>`.client` 目录仅在使用 [Remix Vite][remix-vite] 时受支持。[Classic Remix Compiler][classic-remix-compiler] 仅支持 `.client` 文件。</docs-warning>

有关更多信息，请参阅侧边栏中的路由模块部分。

[use_effect]: https://react.dev/reference/react/useEffect
[classic-remix-compiler]: ../guides/vite#classic-remix-compiler-vs-remix-vite
[remix-vite]: ../guides/vite