---
title: 资产导入
toc: false
---

# 资源 URL 导入

`app` 文件夹中的任何文件都可以导入到您的模块中。Remix 将会：

1. 将文件复制到您的浏览器构建目录
2. 为文件生成指纹以实现长期缓存
3. 返回公共 URL 供您的模块在渲染时使用

这通常用于样式表，但也可以用于任何具有 [定义加载器][remix-loaders] 的文件类型。

```tsx
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

import banner from "./images/banner.jpg";
import styles from "./styles/app.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export default function Page() {
  return (
    <div>
      <h1>Some Page</h1>
      <img src={banner} />
    </div>
  );
}
```

[remix-loaders]: https://github.com/remix-run/remix/blob/main/packages/remix-dev/compiler/utils/loaders.ts