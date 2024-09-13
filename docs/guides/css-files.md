---
title: CSS 文件
---

# CSS 文件

在 Remix 中管理 CSS 文件主要有两种方式：

- [CSS 打包][css-bundling]
- [CSS URL 导入][css-url-imports]

本指南涵盖了每种方法的优缺点，并根据您项目的具体需求提供了一些建议。

## CSS 打包

CSS 打包是 React 社区中管理 CSS 文件的最常见方法。在这种模型中，样式被视为模块副作用，并根据打包器的决定打包到一个或多个 CSS 文件中。它使用起来更简单，所需的样板代码更少，并且赋予打包器更多优化输出的能力。

例如，假设你有一个基本的 `Button` 组件，并附加了一些样式：

```css filename=components/Button.css
.Button__root {
  background: blue;
  color: white;
}
```

```jsx filename=components/Button.jsx
import "./Button.css";

export function Button(props) {
  return <button {...props} className="Button__root" />;
}
```

要使用这个组件，你可以简单地导入它并在路由文件中使用：

```jsx filename=routes/hello.jsx
import { Button } from "../components/Button";

export default function HelloRoute() {
  return <Button>Hello!</Button>;
}
```

在使用这个组件时，你不必担心管理单独的 CSS 文件。CSS 被视为组件的私有实现细节。这在许多组件库和设计系统中是一种常见模式，并且扩展性很好。

#### 某些 CSS 解决方案需要 CSS 打包

管理 CSS 文件的某些方法需要使用打包的 CSS。

例如，[CSS Modules][css-modules] 是基于 CSS 被打包的假设构建的。即使你明确地将 CSS 文件的类名作为 JavaScript 对象导入，样式本身仍然被视为副作用，并自动打包到输出中。你无法访问 CSS 文件的底层 URL。

另一个常见的使用场景是，当你使用一个第三方组件库，该库将 CSS 文件作为副作用导入，并依赖你的打包器为你处理这些文件，例如 [React Spectrum][react-spectrum]。

#### 开发和生产中的 CSS 顺序可能不同

当与 Vite 的按需编译方法结合时，CSS 打包带来了显著的权衡。

使用前面提到的 `Button.css` 示例，这个 CSS 文件将在开发过程中转换为以下 JavaScript 代码：

<!-- prettier-ignore-start -->

<!-- eslint-skip -->

```js
import {createHotContext as __vite__createHotContext} from "/@vite/client";
import.meta.hot = __vite__createHotContext("/app/components/Button.css");
import {updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle} from "/@vite/client";
const __vite__id = "/path/to/app/components/Button.css";
const __vite__css = ".Button__root{background:blue;color:white;}"
__vite__updateStyle(__vite__id, __vite__css);
import.meta.hot.accept();
import.meta.hot.prune(()=>__vite__removeStyle(__vite__id));
```

<!-- prettier-ignore-end -->

值得强调的是，这种转换仅在开发中发生。**生产构建不会是这样的**，因为会生成静态 CSS 文件。

Vite 这样做是为了在导入时延迟编译 CSS，然后在开发过程中进行热重载。只要这个文件被导入，CSS 文件的内容就作为副作用注入到页面中。

这种方法的缺点是这些样式与路由生命周期没有绑定。这意味着在导航离开路由时，样式不会被卸载，导致在应用中导航时文档中旧样式的积累。这可能导致开发和生产中的 CSS 规则顺序不同。

为了减轻这个问题，编写 CSS 时使其对文件顺序的变化具有韧性是有帮助的。例如，你可以使用 [CSS Modules][css-modules] 确保 CSS 文件的作用域限于导入它们的文件。你还应该尽量限制针对单个元素的 CSS 文件数量，因为这些文件的顺序并不保证。

#### 打包的 CSS 在开发中可能会消失

Vite 在开发中对 CSS 打包的另一个显著权衡是，React 可能会无意中从文档中移除样式。

当 React 用于渲染整个文档（如 Remix 所做）时，当元素动态注入到 `head` 元素中时，可能会出现问题。如果文档被重新挂载，现有的 `head` 元素将被移除并替换为一个全新的元素，从而移除 Vite 在开发过程中注入的任何 `style` 元素。

在 Remix 中，由于水合错误，这个问题可能会发生，因为它导致 React 从头重新渲染整个页面。水合错误可能由你的应用代码引起，但也可能由操纵文档的浏览器扩展引起。

这是一个已知的 React 问题，在他们的 [canary release channel][react-canaries] 中已修复。如果你理解相关风险，可以将你的应用固定在特定的 [React 版本][react-versions]，然后使用 [package overrides][package-overrides] 确保这是你项目中使用的唯一版本。例如：

```json filename=package.json
{
  "dependencies": {
    "react": "18.3.0-canary-...",
    "react-dom": "18.3.0-canary-..."
  },
  "overrides": {
    "react": "18.3.0-canary-...",
    "react-dom": "18.3.0-canary-..."
  }
}
```

<docs-info>作为参考，Next.js 在内部如何处理 React 版本控制，因此这种方法的使用比你想象的更广泛，即使这不是 Remix 默认提供的功能。</docs-info>

同样，值得强调的是，这个与 Vite 注入样式相关的问题仅发生在开发中。**生产构建不会有这个问题**，因为会生成静态 CSS 文件。

## CSS URL 导入

管理 CSS 文件的另一种主要方式是使用 [Vite 的显式 URL 导入][vite-url-imports]。

Vite 允许你在 CSS 文件导入中附加 `?url` 来获取文件的 URL（例如 `import href from "./styles.css?url"`）。然后可以通过路由模块的 [links 导出][links-export] 将此 URL 传递给 Remix。这将 CSS 文件与 Remix 的路由生命周期绑定在一起，确保在应用程序中导航时样式被注入和移除。

例如，使用之前相同的 `Button` 组件示例，你可以在组件旁边导出一个 `links` 数组，以便消费者可以访问其样式。

```jsx filename=components/Button.jsx lines=[1,3-5]
import buttonCssUrl from "./Button.css?url";

export const links = [
  { rel: "stylesheet", href: buttonCssUrl },
];

export function Button(props) {
  return <button {...props} className="Button__root" />;
}
```

在导入此组件时，消费者现在还需要导入此 `links` 数组并将其附加到路由的 `links` 导出中：

```jsx filename=routes/hello.jsx lines=[3,6]
import {
  Button,
  links as buttonLinks,
} from "../components/Button";

export const links = () => [...buttonLinks];

export default function HelloRoute() {
  return <Button>Hello!</Button>;
}
```

这种方法在规则排序方面更加可预测，因为它让你对每个文件有更细粒度的控制，并在开发和生产之间提供一致的行为。与开发期间的打包 CSS 相比，当样式不再需要时，它们会从文档中移除。如果页面的 `head` 元素被重新挂载，你的路由定义的任何 `link` 标签也会被重新挂载，因为它们是 React 生命周期的一部分。

这种方法的缺点是可能会导致大量的样板代码。

如果你有许多可重用组件，每个组件都有自己的 CSS 文件，你需要手动将所有 `links` 提升到你的路由组件，这可能需要通过多个组件层级传递 CSS URL。这也可能容易出错，因为很容易忘记导入组件的 `links` 数组。

尽管有其优点，你可能会发现与 CSS 打包相比，这种方式过于繁琐，或者你可能认为额外的样板代码是值得的。在这方面没有对错之分。

## 结论

在管理 Remix 应用程序中的 CSS 文件时，最终还是个人偏好，但这里有一个好的经验法则：

- 如果你的项目只有少量 CSS 文件（例如使用 Tailwind 时，可能只有一个 CSS 文件），你应该使用 CSS URL 导入。增加的样板代码很少，你的开发环境将更接近生产环境。
- 如果你的项目有大量与较小可重用组件相关的 CSS 文件，你可能会发现 CSS 打包减少的样板代码更加符合人体工程学。只需注意权衡，并以一种能抵御文件顺序变化的方式编写 CSS。
- 如果你在开发过程中遇到样式消失的问题，你应该考虑使用 [React canary release][react-canaries]，以便 React 在重新挂载页面时不会移除现有的 `head` 元素。

[css-modules]: https://vitejs.dev/guide/features#css-modules  
[react-spectrum]: https://react-spectrum.adobe.com  
[react-canaries]: https://react.dev/blog/2023/05/03/react-canaries  
[react-versions]: https://www.npmjs.com/package/react?activeTab=versions  
[package-overrides]: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides  
[vite-url-imports]: https://vitejs.dev/guide/assets#explicit-url-imports  
[links-export]: ../route/links  
[css-bundling]: #css-bundling  
[css-url-imports]: #css-url-imports