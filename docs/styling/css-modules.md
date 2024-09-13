---
title: CSS 模块
---

# CSS Modules

<docs-warning>此文档仅在使用[Classic Remix Compiler][classic-remix-compiler]时相关。如果您使用的是[Remix Vite][remix-vite]，则[Vite内置了对CSS模块的支持][vite-css-modules]。</docs-warning>

要使用内置的CSS模块支持，首先确保您在应用程序中设置了[CSS打包][css-bundling]。

然后，您可以通过`.module.css`文件名约定选择使用[CSS模块][css-modules]。例如：

```css filename=app/components/button/styles.module.css
.root {
  border: solid 1px;
  background: white;
  color: #454545;
}
```

```tsx filename=app/components/button/index.js lines=[1,9]
import styles from "./styles.module.css";

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

[css-bundling]: ./bundling
[css-modules]: https://github.com/css-modules/css-modules
[classic-remix-compiler]: ../guides/vite#classic-remix-compiler-vs-remix-vite
[remix-vite]: ../guides/vite
[vite-css-modules]: https://vitejs.dev/guide/features#css-modules