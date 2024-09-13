---
title: useBeforeUnload
toc: false
---

# `useBeforeUnload`

这个 hook 只是围绕 [`window.beforeunload`][window_before_unload] 的一个辅助工具。

当用户点击尚未访问过的页面链接时，Remix 会加载该页面的代码分割模块。如果您在用户会话中间进行部署，而您或您的主机从服务器中删除了旧文件（很多人都会这样 😭），那么 Remix 对这些模块的请求将会失败。Remix 会通过自动重新加载浏览器到新 URL 来恢复。这应该会从服务器开始加载您应用程序的最新版本。大多数情况下，这样处理效果很好，用户甚至不会意识到发生了什么。

在这种情况下，您可能需要在页面上保存重要的应用程序状态（例如，保存到浏览器的本地存储中），因为自动页面重新加载会丢失您所拥有的任何状态。

无论是否使用 Remix，这都是一个好习惯。用户可以更改 URL，意外关闭浏览器窗口等。

```tsx lines=[1,7-11]
import { useBeforeUnload } from "@remix-run/react";

function SomeForm() {
  const [state, setState] = React.useState(null);

  // save it off before the automatic page reload
  useBeforeUnload(
    React.useCallback(() => {
      localStorage.stuff = state;
    }, [state])
  );

  // read it in when they return
  React.useEffect(() => {
    if (state === null && localStorage.stuff != null) {
      setState(localStorage.stuff);
    }
  }, [state]);

  return <>{/*... */}</>;
}
```

[window_before_unload]: https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event