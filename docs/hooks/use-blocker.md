---
title: useBlocker
---

# `useBlocker`

`useBlocker` 钩子允许您阻止用户离开当前页面，并向他们展示自定义 UI，以便确认导航。

<docs-info>
这仅适用于您 React Router 应用程序中的客户端导航，并不会阻止文档请求。要防止文档导航，您需要添加自己的 <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event" target="_blank">`beforeunload`</a> 事件处理程序。
</docs-info>

<docs-warning>
阻止用户导航有点反模式，因此请仔细考虑此钩子的任何使用，并尽量少用。在防止用户离开未填写完整表单的典型用例中，您可以考虑将未保存的状态持久化到 `sessionStorage` 中，并在他们返回时自动重新填充，而不是阻止他们离开。
</docs-warning>

```tsx
function ImportantForm() {
  const [value, setValue] = React.useState("");

  // Block navigating elsewhere when data has been entered into the input
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      value !== "" &&
      currentLocation.pathname !== nextLocation.pathname
  );

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

      {blocker.state === "blocked" ? (
        <div>
          <p>Are you sure you want to leave?</p>
          <button onClick={() => blocker.proceed()}>
            Proceed
          </button>
          <button onClick={() => blocker.reset()}>
            Cancel
          </button>
        </div>
      ) : null}
    </Form>
  );
}
```

有关更完整的示例，请参阅存储库中的 [example][example]。

## 属性

### `state`

阻塞器的当前状态

- `unblocked` - 阻塞器处于空闲状态，未阻止任何导航
- `blocked` - 阻塞器已阻止一次导航
- `proceeding` - 阻塞器正在从被阻止的导航中继续进行

### `location`

当处于 `blocked` 状态时，这表示我们阻止导航的地点。当处于 `proceeding` 状态时，这是在 `blocker.proceed()` 调用后正在导航的地点。

## 方法

### `proceed()`

当处于 `blocked` 状态时，您可以调用 `blocker.proceed()` 以继续到被阻塞的位置。

### `reset()`

当处于 `blocked` 状态时，您可以调用 `blocker.reset()` 将阻止器返回到 `unblocked` 状态，并将用户保留在当前位置。

[example]: https://github.com/remix-run/react-router/tree/main/examples/navigation-blocking