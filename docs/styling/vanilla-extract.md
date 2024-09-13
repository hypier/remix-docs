---
title: 香草提取物
---

# 香草提取物

<docs-warning>此文档仅在使用 [Classic Remix Compiler][classic-remix-compiler] 时相关。如果您使用 [Remix Vite][remix-vite]，可以通过 [Vanilla Extract Vite plugin][vanilla-extract-vite] 集成香草提取物。</docs-warning>

[Vanilla Extract][vanilla-extract] 是一个零运行时的 CSS-in-TypeScript（或 JavaScript）库，允许您将 TypeScript 用作 CSS 预处理器。样式写在单独的 `*.css.ts`（或 `*.css.js`）文件中，所有代码在构建过程中执行，而不是在用户的浏览器中执行。如果您希望将 CSS 包的大小保持在最低限度，Vanilla Extract 还提供了一个官方库 [Sprinkles][sprinkles]，允许您定义一组自定义的实用类和一个类型安全的函数，以便在运行时访问它们。

要使用内置的 Vanilla Extract 支持，请首先确保您已在应用程序中设置了 [CSS bundling][css-bundling]。

然后，将 Vanilla Extract 的核心样式包作为开发依赖项安装。

```shellscript nonumber
npm install -D @vanilla-extract/css
```

然后，您可以通过 `.css.ts`/`.css.js` 文件名约定选择使用 Vanilla Extract。例如：

```ts filename=app/components/button/styles.css.ts
import { style } from "@vanilla-extract/css";

export const root = style({
  border: "solid 1px",
  background: "white",
  color: "#454545",
});
```

```tsx filename=app/components/button/index.js lines=[1,9]
import * as styles from "./styles.css"; // 注意这里省略了 `.ts`

export const Button = React.forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={styles.root}
      />
    );
  }
);
Button.displayName = "Button";
```

[vanilla-extract]: https://vanilla-extract.style
[sprinkles]: https://vanilla-extract.style/documentation/packages/sprinkles
[css-bundling]: ./bundling
[classic-remix-compiler]: ../guides/vite#classic-remix-compiler-vs-remix-vite
[remix-vite]: ../guides/vite
[vanilla-extract-vite]: https://vanilla-extract.style/documentation/integrations/vite