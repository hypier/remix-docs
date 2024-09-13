---
title: unstable_useViewTransitionState
toc: false
---

# `unstable_useViewTransitionState`

此钩子在指定位置有一个活动的 [View Transition][view-transitions] 时返回 `true`。这可以用于对元素应用更细致的样式，以进一步自定义视图过渡。这要求通过 [`Link`][link-component-view-transition]（或 [`Form`][form-component-view-transition]、[`NavLink`][nav-link-component-view-transition]、`navigate` 或 `submit` 调用）为给定导航启用视图过渡。

考虑在列表中单击图像，以便在目标页面展开为主图像：

```jsx
function NavImage({ src, alt, id }) {
  const to = `/images/${idx}`;
  const vt = unstable_useViewTransitionState(href);
  return (
    <Link to={to} unstable_viewTransition>
      <img
        src={src}
        alt={alt}
        style={{
          viewTransitionName: vt ? "image-expand" : "",
        }}
      />
    </Link>
  );
}
```

[view-transitions]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
[link-component-view-transition]: ../components/link#unstable_viewtransition
[form-component-view-transition]: ../components/form#unstable_viewtransition
[nav-link-component-view-transition]: ../components/nav-link#unstable_viewtransition