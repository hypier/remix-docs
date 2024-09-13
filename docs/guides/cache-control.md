---
title: 缓存控制
hidden: true
---

# 缓存控制

## 在路由模块中

每个路由也可以定义其 http 头部。这在 http 缓存中非常重要。Remix 不依赖于将您的网站构建为静态文件并上传到 CDN 来提高性能，而是依赖于缓存头。无论哪种方法，最终结果都是相同的：在 CDN 上的静态文档。[查看此视频以获取更多信息][check-out-this-video-for-more-information-on-that]。

通常，缓存头的难点在于配置它们。在 Remix 中，我们让这变得简单。只需从您的路由中导出一个 `headers` 函数。

```tsx
export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta() {
  /* ... */
}

export default function Gists() {
  /* ... */
}
```

max-age 告诉用户的浏览器将其缓存 300 秒或 5 分钟。这意味着如果他们在 5 分钟内点击返回或再次点击同一页面的链接，浏览器将不会请求该页面，而是使用缓存。

s-maxage 告诉 CDN 将其缓存一个小时。以下是第一个人访问我们网站时的情况：

1. 请求发送到网站，实际上是 CDN
2. CDN 没有缓存文档，因此向我们的服务器（“源服务器”）发出请求。
3. 我们的服务器构建页面并将其发送到 CDN
4. CDN 缓存它并将其发送给访客。

现在，当下一个人访问我们的页面时，情况如下：

1. 请求发送到 CDN
2. CDN 已经缓存了文档，并立即发送，而无需接触我们的源服务器！

我们还有很多关于缓存的内容在 [CDN 缓存][cdn-caching] 指南中，确保有时间阅读一下。

## 在加载器中

我们看到我们的路由可以定义它们的缓存控制，那么这对加载器来说有什么重要性呢？这有两个原因：

首先，您的数据通常比您的路由更清楚缓存控制应该是什么，因为数据比标记更频繁地变化。因此，加载器的头部会传递给路由的头部函数。

打开 `app/routes/gists.ts` 并像下面这样更新您的头部函数：

```tsx
export function headers({
  loaderHeaders,
}: {
  loaderHeaders: Headers;
}) {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control"),
  };
}
```

`loaderHeaders` 对象是 [Web Fetch API Headers 构造函数][web-fetch-api-headers-constructor] 的一个实例。

现在，当浏览器或 CDN 想要缓存我们的页面时，它会从我们的数据源获取头部，这通常是您想要的。注意，在我们的例子中，我们实际上只是使用了 GitHub 在我们请求的响应中发送的头部！

第二个原因是 Remix 在客户端转换时通过 `fetch` 调用您的加载器。通过在这里返回良好的缓存头，当用户点击后退/前进或多次访问同一页面时，浏览器实际上不会再次请求数据，而是会使用缓存版本。这极大地提高了网站的性能，即使对于那些您无法在 CDN 上缓存的页面也是如此。许多 React 应用程序依赖于 JavaScript 缓存，但浏览器缓存已经工作得很好了！

[check-out-this-video-for-more-information-on-that]: https://youtu.be/bfLFHp7Sbkg
[cdn-caching]: ../guides/caching
[web-fetch-api-headers-constructor]: https://developer.mozilla.org/en-US/docs/Web/API/Headers