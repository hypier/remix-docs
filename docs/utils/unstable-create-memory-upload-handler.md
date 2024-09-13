---
title: unstable_createMemoryUploadHandler
toc: false
---

# `unstable_createMemoryUploadHandler`

**示例：**

```tsx
export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 500_000,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const file = formData.get("avatar");

  // file 是一个为 node 提供的 "File" (https://mdn.io/File) polyfill
  // ... 等等
};
```

**选项：** 唯一支持的选项是 `maxPartSize` 和 `filter`，它们的工作方式与上述的 `unstable_createFileUploadHandler` 相同。此 API 不建议用于大规模应用，但对于简单用例和作为其他处理程序的后备是一个方便的工具。