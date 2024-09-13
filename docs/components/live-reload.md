---
title: LiveReload
toc: false
---

# `<LiveReload />`

该组件将您的应用程序连接到 Remix 资产服务器，并在开发时文件更改时自动重新加载页面。在生产环境中，它渲染 `null`，因此您可以安全地在根路由中始终渲染它。

```tsx filename=app/root.tsx lines=[8]
import { LiveReload } from "@remix-run/react";

export default function Root() {
  return (
    <html>
      <head />
      <body>
        <LiveReload />
      </body>
    </html>
  );
}
```

## 道具

### `origin`

为 Live Reload 协议指定自定义源。提供的 url 应使用 `http` 协议，内部将升级为 `ws` 协议。这在 Remix 开发服务器前使用反向代理时很有用。默认值为 `REMIX_DEV_ORIGIN` 环境变量，或者仅在未设置 `REMIX_DEV_ORIGIN` 时为 `window.location.origin`。

### `port`

指定 Live Reload 协议的自定义端口。默认值是从 `REMIX_DEV_ORIGIN` 环境变量派生的端口，或者仅在未设置 `REMIX_DEV_ORIGIN` 时为 `8002`。

### `timeoutMs`

`timeoutMs` 属性允许为实时重载协议指定自定义超时时间，单位为毫秒。这是在 Web Socket 连接丢失后尝试重新连接之前的延迟。默认值为 `1000`。