---
title: unstable_usePrompt
---

# `unstable_usePrompt`

`unstable_usePrompt` 钩子允许您在离开当前页面之前通过 [`window.confirm`][window-confirm] 提示用户确认。

<docs-info>
这仅适用于您 React Router 应用程序中的客户端导航，并不会阻止文档请求。要防止文档导航，您需要添加自己的 <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event" target="_blank">`beforeunload`</a> 事件处理程序。
</docs-info>

<docs-warning>
阻止用户导航有点反模式，因此请仔细考虑此钩子的任何使用，并谨慎使用。在防止用户离开未填写完整的表单的典型用例中，您可以考虑将未保存的状态持久化到 `sessionStorage`，并在他们返回时自动重新填写，而不是阻止他们离开。
</docs-warning>

<docs-warning>
我们不打算从此钩子中移除 `unstable_` 前缀，因为在提示打开时，不同浏览器的行为是非确定性的，因此 React Router 无法保证在所有场景下的正确行为。为了避免这种非确定性，我们建议使用 `useBlocker`，它也让您控制确认用户体验。
</docs-warning>

```tsx
function ImportantForm() {
  const [value, setValue] = React.useState("");

  // Block navigating elsewhere when data has been entered into the input
  unstable_usePrompt({
    message: "Are you sure?",
    when: ({ currentLocation, nextLocation }) =>
      value !== "" &&
      currentLocation.pathname !== nextLocation.pathname,
  });

  return (
    <Form method="post">
      <label>
        Enter some important data:
        <input
          name="data"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <button type="submit">Save</button>
    </Form>
  );
}
```

[window-confirm]: https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm