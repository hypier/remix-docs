---
title: unstable_createFileUploadHandler
toc: false
---

# `unstable_createFileUploadHandler`

一个 Node.js 上传处理程序，将带有文件名的部分写入磁盘以避免占用内存，未带文件名的部分将不会被解析。应与另一个上传处理程序组合使用。

**示例：**

```tsx
export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: ({ filename }) => filename,
    }),
    // 将其他所有内容解析到内存中
    unstable_createMemoryUploadHandler()
  );
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const file = formData.get("avatar");

  // file 是一个实现了 "File" API 的 "NodeOnDiskFile"
  // ... 等等
};
```

**选项：**

| 属性               | 类型               | 默认值                           | 描述                                                                                                                                                          |
| ------------------ | ------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| avoidFileConflicts | boolean            | true                            | 通过在文件名末尾附加时间戳来避免文件冲突，如果该文件名在磁盘上已经存在                                                                                     |
| directory          | string \| Function | os.tmpdir()                     | 上传文件的写入目录。                                                                                                                                          |
| file               | Function           | () => `upload_${random}.${ext}` | 目录中文件的名称。可以是相对路径，如果目录结构不存在，将会被创建。                                                                                            |
| maxPartSize        | number             | 3000000                         | 允许的最大上传大小（以字节为单位）。如果超出该大小，将抛出 MaxPartSizeExceededError。                                                                         |
| filter             | Function           | OPTIONAL                        | 您可以编写的函数，以根据文件名、内容类型或字段名防止文件上传被保存。返回 `false` 则该文件将被忽略。                                                        |

`file` 和 `directory` 的函数 API 是相同的。它们接受一个 `object` 并返回一个 `string`。接受的对象包含 `filename`、`name` 和 `contentType`（均为字符串）。返回的 `string` 是路径。

`filter` 函数接受一个 `object` 并返回一个 `boolean`（或一个解析为 `boolean` 的 promise）。接受的对象包含 `filename`、`name` 和 `contentType`（均为字符串）。返回的 `boolean` 如果您希望处理该文件流，则为 `true`。