---
title: 禁用 JavaScript
toc: false
---

# 禁用 JavaScript

您是否曾经查看您网站上的某个页面并想：“为什么我们要加载这么多 JavaScript？这个页面上除了链接什么都没有！”这对于一个 JavaScript 框架来说似乎有点奇怪，但您可以轻松地通过布尔值关闭 JavaScript，而您的数据加载、链接，甚至表单仍然可以正常工作。

以下是我们喜欢的做法：

打开您想要包含 JavaScript 的每个路由模块并添加一个“handle”。这是一种让您为父路由提供路由的任何元信息的方式（正如您稍后将看到的）。

```tsx
export const handle = { hydrate: true };
```

现在打开 `root.tsx`，引入 `useMatches` 并添加以下内容：

```tsx filename=app/root.tsx lines=[6,10,13-15,27]
import {
  Meta,
  Links,
  Scripts,
  Outlet,
  useMatches,
} from "@remix-run/react";

export default function App() {
  const matches = useMatches();

  // 如果至少一个路由想要 hydrate，这将返回 true
  const includeScripts = matches.some(
    (match) => match.handle?.hydrate
  );

  // 然后使用标志来渲染脚本或不渲染
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        {/* 包含脚本，或者不包含！ */}
        {includeScripts ? <Scripts /> : null}
      </body>
    </html>
  );
}
```

您的所有数据加载在服务器渲染时仍然可以正常工作，所有的 `<Link>` 渲染正常的 `<a>` 元素，因此它们将继续工作。

在任何页面的任何时候，您都可以在普通 HTML 和完整的客户端过渡之间切换。

如果您需要一点点交互性，可以使用 `<script dangerouslySetInnerHTML>`。

```tsx
return (
  <>
    <select id="qty">
      <option>1</option>
      <option>2</option>
      <option value="contact">
        联系销售以获取更多信息
      </option>
    </select>

    <script
      dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('qty').onchange = (event) => {
              if (event.target.value === "contact") {
                window.location.assign("/contact")
              }
            }
          });
        `,
      }}
    />
  </>
);
```