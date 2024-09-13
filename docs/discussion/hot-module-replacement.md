---
title: 热模块替换
---

# 热模块替换

热模块替换是一种在不需要重新加载页面的情况下更新应用程序模块的技术。
这提供了很好的开发体验，Remix 默认支持它。

值得注意的是，HMR 尽力在更新过程中保持浏览器状态。
如果你在模态窗口中有表单，并且填写了所有字段，传统的实时重新加载会强制刷新页面。
这样你就会丢失表单中的所有数据。
每次你进行更改时，都必须重新打开模态窗口并再次填写表单。 😭

但使用 HMR，所有状态在更新过程中都会被保留。 ✨

## React Fast Refresh

React 已经通过其 [virtual DOM][virtual-dom] 机制来响应用户交互（例如点击按钮）更新 DOM。
如果 React 也能在代码更改时处理 DOM 更新，那该多好啊？

这正是 [React Fast Refresh][react-refresh] 的核心内容！
当然，React 是关于组件的，而不是一般的 JavaScript 代码，因此 RFR 本身仅处理导出的 React 组件的热更新。

但是，React Fast Refresh 确实有一些限制，你应该了解这些。

### 类组件状态

React Fast Refresh 不会保留类组件的状态。  
这包括内部返回类的高阶组件：

```tsx
export class ComponentA extends Component {} // ❌

export const ComponentB = HOC(ComponentC); // ❌ 如果 HOC 返回一个类组件，将无法工作

export function ComponentD() {} // ✅
export const ComponentE = () => {}; // ✅
export default function ComponentF() {} // ✅
```

### 命名函数组件

函数组件必须命名，而不是匿名的，以便 React Fast Refresh 跟踪更改：

```tsx
export default () => {}; // ❌
export default function () {} // ❌

const ComponentA = () => {};
export default ComponentA; // ✅

export default function ComponentB() {} // ✅
```

### 支持的导出

React Fast Refresh 只能处理组件导出。虽然 Remix 为您管理特殊的路由导出，如 [`action`][action]、[`headers`][headers]、[`links`][links]、[`loader`][loader] 和 [`meta`][meta]，但任何用户定义的导出都会导致完全重新加载：

```tsx
// These exports are handled by the Remix Vite plugin
// to be HMR-compatible
export const meta = { title: "Home" }; // ✅
export const links = [
  { rel: "stylesheet", href: "style.css" },
]; // ✅

// These exports are removed by the Remix Vite plugin
// so they never affect HMR
export const headers = { "Cache-Control": "max-age=3600" }; // ✅
export const loader = async () => {}; // ✅
export const action = async () => {}; // ✅

// This is not a Remix export, nor a component export,
// so it will cause a full reload for this route
export const myValue = "some value"; // ❌

export default function Route() {} // ✅
```

👆 路由可能不应该以那样的方式导出随机值。如果您想在多个路由之间重用值，请将它们放在自己的非路由模块中：

```ts filename=my-custom-value.ts
export const myValue = "some value";
```

### 更改钩子

当组件中添加或移除钩子时，React Fast Refresh 无法跟踪更改，这会导致仅为了下一次渲染而进行完全重载。在钩子更新之后，更改应该会再次导致热更新。例如，如果您将 [`useLoaderData`][use-loader-data] 添加到组件中，您可能会在该渲染中丢失该组件的本地状态。

此外，如果您正在解构钩子的返回值，如果解构的键被移除或重命名，React Fast Refresh 将无法保留该组件的状态。
例如：

```tsx
export const loader = async () => {
  return json({ stuff: "some things" });
};

export default function Component() {
  const { stuff } = useLoaderData<typeof loader>();
  return (
    <div>
      <input />
      <p>{stuff}</p>
    </div>
  );
}
```

如果您将键 `stuff` 更改为 `things`：

```diff
  export const loader = async () => {
-   return json({ stuff: "some things" })
+   return json({ things: "some things" })
  }

  export default Component() {
-   const { stuff } = useLoaderData<typeof loader>()
+   const { things } = useLoaderData<typeof loader>()
    return (
      <div>
        <input />
-       <p>{stuff}</p>
+       <p>{things}</p>
      </div>
    )
  }
```

那么 React Fast Refresh 将无法保留状态 `<input />` ❌。

作为解决方法，您可以避免解构，而是直接使用钩子的返回值：

```tsx
export const loader = async () => {
  return json({ stuff: "some things" });
};

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <input />
      <p>{data.stuff}</p>
    </div>
  );
}
```

现在如果您将键 `stuff` 更改为 `things`：

```diff
  export const loader = async () => {
-   return json({ stuff: "some things" })
+   return json({ things: "some things" })
  }

  export default Component() {
    const data = useLoaderData<typeof loader>()
    return (
      <div>
        <input />
-       <p>{data.stuff}</p>
+       <p>{data.things}</p>
      </div>
    )
  }
```

那么 React Fast Refresh 将保留 `<input />` 的状态，尽管如果状态元素（例如 `<input />`）是更改元素的同级，则您可能需要使用组件键，如下一节所述。

### 组件键

在某些情况下，React 无法区分正在更改的现有组件和正在添加的新组件。[React 需要 `key`s][react-keys] 来消除这些情况的歧义，并在修改兄弟元素时跟踪更改。

[virtual-dom]: https://reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom
[react-refresh]: https://github.com/facebook/react/tree/main/packages/react-refresh
[action]: ../route/action
[headers]: ../route/headers
[links]: ../route/links
[loader]: ../route/loader
[meta]: ../route/meta
[use-loader-data]: ../hooks/use-loader-data
[react-keys]: https://react.dev/learn/rendering-lists#why-does-react-need-keys