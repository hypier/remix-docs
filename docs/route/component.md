---
title: 组件
---

# 路由组件

路由模块的默认导出定义了在路由匹配时将渲染的组件。

```tsx filename=app/routes/my-route.tsx
export default function MyRouteComponent() {
  return (
    <div>
      <h1>Look ma!</h1>
      <p>I'm still using React after like 8 years.</p>
    </div>
  );
}
```