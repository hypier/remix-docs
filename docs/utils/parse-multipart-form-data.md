---
title: unstable_parseMultipartFormData
---

# `unstable_parseMultipartFormData`

允许您处理应用程序的多部分表单（文件上传）。

了解[浏览器文件 API][the-browser-file-api]将有助于您了解如何使用此 API。

它用于替代 `request.formData()`。

```diff
- const formData = await request.formData();
+ const formData = await unstable_parseMultipartFormData(request, uploadHandler);
```

例如：

```tsx lines=[4-7,12,25]
export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler // <-- 我们将在下文深入探讨
  );

  // 文件字段返回的值是我们的 uploadHandler 返回的内容。
  // 假设我们正在将头像上传到 s3，
  // 所以我们的 uploadHandler 返回 URL。
  const avatarUrl = formData.get("avatar");

  // 在我们的数据库中更新当前登录用户的头像
  await updateUserAvatar(request, avatarUrl);

  // 成功！重定向到账户页面
  return redirect("/account");
};

export default function AvatarUploadRoute() {
  return (
    <Form method="post" encType="multipart/form-data">
      <label htmlFor="avatar-input">头像</label>
      <input id="avatar-input" type="file" name="avatar" />
      <button>上传</button>
    </Form>
  );
}
```

要读取上传文件的内容，可以使用它从[Blob API][the-blob-api]继承的某些方法。例如，`.text()` 异步返回文件的文本内容，而 `.arrayBuffer()` 返回二进制内容。

### `uploadHandler`

`uploadHandler` 是整个过程的关键。它负责处理从客户端流式传输的 multipart/form-data 部分。您可以将其保存到磁盘、存储在内存中，或充当代理将其发送到其他地方（例如文件存储提供商）。

Remix 提供了两个工具来为您创建 `uploadHandler`：

- `unstable_createFileUploadHandler`
- `unstable_createMemoryUploadHandler`

这些是处理相对简单用例的全功能工具。建议不要将除非常小的文件以外的任何内容加载到内存中。将文件保存到磁盘是许多用例的合理解决方案。但如果您想将文件上传到文件托管提供商，则需要自己编写代码。

[the-browser-file-api]: https://developer.mozilla.org/en-US/docs/Web/API/File  
[the-blob-api]: https://developer.mozilla.org/en-US/docs/Web/API/Blob