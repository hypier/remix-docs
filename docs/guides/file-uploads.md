---
title: 文件上传
---

<docs-warning>此文档正在进行中：它是从文件上传的API文档中提取的，因此有些不太相关。我们打算将其重写为文件上传的一般指南。</docs-warning>

大多数情况下，您可能希望将文件代理到文件主机。

**示例：**

```tsx
import type {
  ActionFunctionArgs,
  UploadHandler,
} from "@remix-run/node"; // or cloudflare/deno
import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node"; // or cloudflare/deno
import { writeAsyncIterableToWritable } from "@remix-run/node"; // `writeAsyncIterableToWritable` is a Node-only utility
import type {
  UploadApiOptions,
  UploadApiResponse,
  UploadStream,
} from "cloudinary";
import cloudinary from "cloudinary";

async function uploadImageToCloudinary(
  data: AsyncIterable<Uint8Array>
) {
  const uploadPromise = new Promise<UploadApiResponse>(
    async (resolve, reject) => {
      const uploadStream =
        cloudinary.v2.uploader.upload_stream(
          {
            folder: "remix",
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        );
      await writeAsyncIterableToWritable(
        data,
        uploadStream
      );
    }
  );

  return uploadPromise;
}

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const userId = getUserId(request);

  const uploadHandler = unstable_composeUploadHandlers(
    // our custom upload handler
    async ({ name, contentType, data, filename }) => {
      if (name !== "img") {
        return undefined;
      }
      const uploadedImage = await uploadImageToCloudinary(
        data
      );
      return uploadedImage.secure_url;
    },
    // fallback to memory for everything else
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const imageUrl = formData.get("avatar");

  // because our uploadHandler returns a string, that's what the imageUrl will be.
  // ... etc
};
```

`UploadHandler`函数接受有关文件的多个参数：

| 属性        | 类型                      | 描述                                                                       |
| ----------- | ------------------------- | -------------------------------------------------------------------------- |
| name        | string                    | 字段名称（来自您的HTML表单字段的“name”值）                               |
| data        | AsyncIterable | 文件字节的可迭代对象                                                       |
| filename    | string                    | 用户选择上传的文件名称（如`rickroll.mp4`）                               |
| contentType | string                    | 文件的内容类型（如`videomp4`）                                           |

您的任务是对`data`执行所需的操作，并返回一个有效的 \[`FormData`]\[form-data] 值： \[`File`]\[the-browser-file-api]、`string`或`undefined`以跳过将其添加到结果FormData中。

### 上传处理程序组合

我们有内置的 `unstable_createFileUploadHandler` 和 `unstable_createMemoryUploadHandler`，并且我们也期待未来会开发更多上传处理程序工具。如果您有一个需要使用不同上传处理程序的表单，您可以与自定义处理程序组合它们，以下是一个理论示例：

```ts filename=file-upload-handler.server.ts
import type { UploadHandler } from "@remix-run/node"; // or cloudflare/deno
import { unstable_createFileUploadHandler } from "@remix-run/node"; // or cloudflare/deno
import { createCloudinaryUploadHandler } from "some-handy-remix-util";

export const standardFileUploadHandler =
  unstable_createFileUploadHandler({
    directory: "public/calendar-events",
  });

export const cloudinaryUploadHandler =
  createCloudinaryUploadHandler({
    folder: "/my-site/avatars",
  });

export const fileUploadHandler: UploadHandler = (args) => {
  if (args.name === "calendarEvent") {
    return standardFileUploadHandler(args);
  } else if (args.name === "eventBanner") {
    return cloudinaryUploadHandler(args);
  }
  return undefined;
};
```