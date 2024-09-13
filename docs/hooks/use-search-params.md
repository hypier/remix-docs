---
title: useSearchParams
---

# `useSearchParams`

返回当前 URL 的 [`searchParams`][search-params] 元组和一个更新它们的函数。设置搜索参数会导致导航。

```tsx
import { useSearchParams } from "@remix-run/react";

export function SomeComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  // ...
}
```

## 签名

<!-- eslint-disable -->

```tsx
const [searchParams, setSearchParams] = useSearchParams();
```

### `searchParams`

返回的第一个值是一个 Web [URLSearchParams][url-search-params] 对象。

### `setSearchParams(params, navigateOptions)`

第二个返回值是一个函数，用于设置新的搜索参数，并在调用时导致导航。您可以传递一个可选的第二个参数与 [navigate options][navigateoptions] 一起配置导航。

```tsx
<button
  onClick={() => {
    const params = new URLSearchParams();
    params.set("someKey", "someValue");
    setSearchParams(params, {
      preventScrollReset: true,
    });
  }}
/>
```

### `setSearchParams((prevParams) => newParams, navigateOptions)`

设置函数还支持一个函数用于设置新的搜索参数。

```tsx
<button
  onClick={() => {
    setSearchParams((prev) => {
      prev.set("someKey", "someValue");
      return prev;
    });
  }}
/>
```

[search-params]: https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams
[url-search-params]: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
[navigateoptions]: ./use-navigate#options