---
title: entry.client
toc: false
---

# entry.client

默认情况下，Remix 会为您处理客户端的应用程序水合。如果您想自定义此行为，可以运行 `npx remix reveal` 来生成一个 `app/entry.client.tsx`（或 `.jsx`），该文件将优先使用。此文件是浏览器的入口点，负责水合由您的 [server entry module][server_entry_module] 生成的标记，您也可以在此初始化任何其他客户端代码。

通常，此模块使用 `ReactDOM.hydrateRoot` 来水合已在您的 [server entry module][server_entry_module] 上生成的标记。

以下是一个基本示例：

```tsx filename=app/entry.client.tsx
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
```

这是在浏览器中运行的第一段代码。您可以初始化客户端库，添加仅客户端的提供者等。

[server_entry_module]: ./entry.server