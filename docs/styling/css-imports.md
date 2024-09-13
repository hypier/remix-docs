---
title: CSS 导入
---

# CSS 副作用导入

<docs-warning>当使用 [Remix Vite][remix-vite] 时，此文档不再相关。CSS 副作用导入在 Vite 中开箱即用。</docs-warning>

一些 NPM 包使用普通 CSS 文件的副作用导入（例如 `import "./styles.css"`）来声明 JavaScript 文件的 CSS 依赖。如果您想使用这些包，请首先确保您在应用中设置了 [CSS 打包][css-bundling]。

例如，一个模块的源代码可能如下所示：

```tsx
import "./menu-button.css";

export function MenuButton() {
  return <button data-menu-button>{/* ... */}</button>;
}
```

由于 JavaScript 运行时不支持以这种方式导入 CSS，您需要将任何相关包添加到 `remix.config.js` 文件中的 [`serverDependenciesToBundle`][server-dependencies-to-bundle] 选项中。这确保在服务器上运行代码之前，任何 CSS 导入都被编译出您的代码。例如，要使用 React Spectrum：

```js filename=remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverDependenciesToBundle: [
    /^@adobe\/react-spectrum/,
    /^@react-spectrum/,
    /^@spectrum-icons/,
  ],
  // ...
};
```

[css-bundling]: ./bundling
[server-dependencies-to-bundle]: ../file-conventions/remix-config#serverdependenciestobundle
[remix-vite]: ../guides/vite