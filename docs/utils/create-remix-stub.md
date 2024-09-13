---
title: createRemixStub
---

# `createRemixStub`

此工具允许您通过设置模拟的路由集来单元测试依赖于 Remix hooks/components 的组件：

```tsx
import { createRemixStub } from "@remix-run/testing";

test("renders loader data", async () => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      meta() {
        /* ... */
      },
      links() {
        /* ... */
      },
      Component: MyComponent,
      ErrorBoundary: MyErrorBoundary,
      action() {
        /* ... */
      },
      loader() {
        /* ... */
      },
    },
  ]);

  render(<RemixStub />);

  // 断言初始渲染
  await waitFor(() => screen.findByText("..."));

  // 点击按钮并断言 UI 变化
  user.click(screen.getByText("button text"));
  await waitFor(() => screen.findByText("..."));
});
```

如果您的 [`loader`][loader] 依赖于 `getLoadContext` 方法，您可以通过 `createRemixStub` 的第二个参数提供一个模拟的上下文：

```tsx
const RemixStub = createRemixStub(
  [
    {
      path: "/",
      Component: MyComponent,
      loader({ context }) {
        return json({ message: context.key });
      },
    },
  ],
  { key: "value" }
);
```

`<RemixStub>` 组件本身接受类似于 React Router 的属性，如果您需要控制初始 URL、历史堆栈、hydration 数据或未来标志：

```tsx
// 测试在 "/2" 渲染的应用，具有 2 个之前的历史堆栈条目
render(
  <RemixStub
    initialEntries={["/", "/1", "/2"]}
    initialIndex={2}
  />
);

// 测试在根路由上渲染的应用，使用初始 loader 数据。当使用
// 这个时，最好在路由定义中为您的路由提供唯一的 ID
render(
  <RemixStub
    hydrationData={{
      loaderData: { root: { message: "hello" } },
    }}
  />
);

// 测试在启用给定未来标志的情况下渲染的应用
render(<RemixStub future={{ v3_coolFeature: true }} />);
```

[loader]: ../route/loader