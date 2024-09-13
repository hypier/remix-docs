---
title: API 路由
---

# API 路由

您可能习惯于构建不在服务器上运行的 React 应用，或者至少大部分代码不在服务器上运行，因此它由一组 API 路由支持。在 Remix 中，您的大多数路由既是您的 UI 也是您的 API，因此 Remix 在浏览器中知道如何与服务器上的自身进行通信。

一般来说，您根本不需要“API 路由”的概念。但我们知道您会对这个术语感兴趣，所以我们在这里！

## 路由是它们自己的 API

考虑这个路由：

```tsx filename=app/routes/teams.tsx
export async function loader() {
  return json(await getTeams());
}

export default function Teams() {
  return (
    <TeamsView teams={useLoaderData<typeof loader>()} />
  );
}
```

每当用户点击链接 `<Link to="/teams" />` 时，Remix 在浏览器中将向服务器发起请求，以从 `loader` 获取数据并渲染路由。将数据加载到组件中的整个任务已经得到处理。您不需要为路由组件的数据需求设置 API 路由，它们已经是它们自己的 API。

## 在导航之外调用加载器

然而，有时您希望从加载器获取数据，但并不是因为用户正在访问该路由，而是当前页面出于某种原因需要该路由的数据。一个非常明确的例子是一个 `<Combobox>` 组件，它查询数据库中的记录并向用户建议。

您可以在这种情况下使用 `useFetcher`。再一次，由于 Remix 在浏览器中知道服务器上的 Remix，您无需做太多工作即可获取数据。Remix 的错误处理机制会启动，竞争条件、中断和获取取消也会为您处理。

例如，您可以有一个路由来处理搜索：

```tsx filename=app/routes/city-search.tsx
export async function loader({
  request,
}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  return json(
    await searchCities(url.searchParams.get("q"))
  );
}
```

然后使用 `useFetcher` 以及 Reach UI 的组合框输入：

```tsx lines=[2,11,14,19,21,23]
function CitySearchCombobox() {
  const cities = useFetcher();

  return (
    <cities.Form method="get" action="/city-search">
      <Combobox aria-label="Cities">
        <div>
          <ComboboxInput
            name="q"
            onChange={(event) =>
              cities.submit(event.target.form)
            }
          />
          {cities.state === "submitting" ? (
            <Spinner />
          ) : null}
        </div>

        {cities.data ? (
          <ComboboxPopover className="shadow-popup">
            {cities.data.error ? (
              <p>加载城市失败 :(</p>
            ) : cities.data.length ? (
              <ComboboxList>
                {cities.data.map((city) => (
                  <ComboboxOption
                    key={city.id}
                    value={city.name}
                  />
                ))}
              </ComboboxList>
            ) : (
              <span>未找到结果</span>
            )}
          </ComboboxPopover>
        ) : null}
      </Combobox>
    </cities.Form>
  );
}
```

## 资源路由

在其他情况下，您可能需要应用程序的一部分路由，但这些路由并不是应用程序用户界面的一部分。也许您想要一个加载器，将报告呈现为 PDF：

```tsx
export async function loader({
  params,
}: LoaderFunctionArgs) {
  const report = await getReport(params.id);
  const pdf = await generateReportPDF(report);
  return new Response(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
```

如果一个路由没有被 Remix UI 调用（例如 `<Link>` 或 `useFetcher`），并且没有导出默认组件，那么它就是一个通用资源路由。如果使用 `GET` 调用，将返回加载器的响应。如果使用 `POST`、`PUT`、`PATCH` 或 `DELETE` 调用，将返回操作的响应。

这里有一些用例供您思考。

- 为移动应用程序提供 JSON API，重用与 Remix UI 的服务器端代码
- 动态生成 PDF
- 动态生成博客文章或其他页面的社交图片
- 其他服务的 Webhook

您可以在 [资源路由][resource-routes] 文档中阅读更多内容。

[resource-routes]: ./resource-routes