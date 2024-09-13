---
title: useFetchers
toc: false
---

# `useFetchers`

返回一个所有正在进行的 fetchers 的数组。这对于应用中没有创建 fetchers 但希望使用其提交以参与乐观 UI 的组件非常有用。

```tsx
import { useFetchers } from "@remix-run/react";

function SomeComponent() {
  const fetchers = useFetchers();
  fetchers[0].formData; // FormData
  fetchers[0].state; // 等等。
  // ...
}
```

fetchers 不包含 [`fetcher.Form`][fetcher_form]、[`fetcher.submit`][fetcher_submit] 或 [`fetcher.load`][fetcher_load]，仅包含状态，如 [`fetcher.formData`][fetcher_form_data]、[`fetcher.state`][fetcher_state] 等等。

## 其他资源

**讨论**

- [表单与提取器][form_vs_fetcher]
- [待处理，乐观UI][pending_optimistic_ui]

**API**

- [`useFetcher`][use_fetcher]
- [`v3_fetcherPersist`][fetcherpersist]

[fetcher_form]: ./use-fetcher#fetcherform
[fetcher_submit]: ./use-fetcher#fetchersubmitformdata-options
[fetcher_load]: ./use-fetcher#fetcherloadhref
[fetcher_form_data]: ./use-fetcher#fetcherformdata
[fetcher_state]: ./use-fetcher#fetcherstate
[form_vs_fetcher]: ../discussion/form-vs-fetcher
[pending_optimistic_ui]: ../discussion/pending-ui
[use_fetcher]: ./use-fetcher
[fetcherpersist]: ../file-conventions/remix-config#future