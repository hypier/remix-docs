---
title: "@remix-run/testing"
---

# `@remix-run/testing`

此包包含用于辅助单元测试您的 Remix 应用程序部分的工具。这是通过模拟编译器输出的 Remix 路由模块/资产清单，并通过 [createMemoryRouter][create-memory-router] 生成内存中的 React Router 应用程序来实现的。

一般来说，这用于测试依赖于 Remix hooks/components 的组件/hooks，而您无法干净地模拟这些 hooks/components（[`useLoaderData`][use-loader-data]、[`useFetcher`][use-fetcher] 等）。虽然它也可以用于更高级的测试，例如点击链接和导航到页面，但这些更适合通过 [Cypress][cypress] 或 [Playwright][playwright] 等进行端到端测试。

## 用法

要使用 [`createRemixStub`][create-remix-stub]，请使用类似于 React Router 的路由对象定义您的路由，在这些对象中您可以指定 `path`、`Component`、`loader` 等。这些基本上模拟了您 Remix 应用中路由文件的嵌套和导出：

```tsx
import { createRemixStub } from "@remix-run/testing";

const RemixStub = createRemixStub([
  {
    path: "/",
    Component: MyComponent,
    loader() {
      return json({ message: "hello" });
    },
  },
]);
```

然后您可以渲染 `<RemixStub />` 组件并进行断言：

```tsx
render(<RemixStub />);
await screen.findByText("Some rendered text");
```

## 示例

这是一个完整的工作示例，使用 [`jest`][jest] 和 [React Testing Library][rtl] 进行测试：

```tsx
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createRemixStub } from "@remix-run/testing";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

test("renders loader data", async () => {
  // ⚠️ 这通常是您从应用程序代码中导入的组件
  function MyComponent() {
    const data = useLoaderData() as { message: string };
    return <p>消息: {data.message}</p>;
  }

  const RemixStub = createRemixStub([
    {
      path: "/",
      Component: MyComponent,
      loader() {
        return json({ message: "hello" });
      },
    },
  ]);

  render(<RemixStub />);

  await waitFor(() => screen.findByText("消息: hello"));
});
```

[create-memory-router]: https://reactrouter.com/en/main/routers/create-memory-router
[use-loader-data]: ../hooks/use-loader-data
[use-fetcher]: ../hooks/use-fetcher
[cypress]: https://www.cypress.io
[playwright]: https://playwright.dev
[create-remix-stub]: ../utils/create-remix-stub
[jest]: https://jestjs.io
[rtl]: https://testing-library.com/docs/react-testing-library/intro