---
title: 数据加载
description: Remix 的主要功能之一是简化与服务器的交互，以便将数据加载到组件中。本文档将帮助您充分利用 Remix 中的数据加载功能。
---

# 数据加载

Remix 的主要功能之一是简化与服务器的交互，以便将数据加载到组件中。当您遵循这些约定时，Remix 可以自动：

- 在服务器上渲染您的页面
- 在 JavaScript 加载失败时对网络状况具有弹性
- 在用户与您的网站交互时进行优化，仅加载页面变化部分的数据，以提高速度
- 在过渡时并行获取数据、JavaScript 模块、CSS 和其他资源，避免导致 UI 不流畅的渲染+获取瀑布流
- 通过在 [actions][action] 之后重新验证，确保 UI 中的数据与服务器上的数据保持同步
- 在后退/前进点击时实现出色的滚动恢复（甚至跨域）
- 使用 [error boundaries][error-boundary] 处理服务器端错误
- 为“未找到”和“未经授权”提供良好的用户体验，使用 [error boundaries][error-boundary]
- 帮助您保持 UI 的快乐路径

## 基础

每个路由模块可以导出一个组件和一个 [`loader`][loader]。`useLoaderData` [useloaderdata] 将为您的组件提供加载器的数据：

```tsx filename=app/routes/products.tsx lines=[1-2,4-9,12]
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  return json([
    { id: "1", name: "Pants" },
    { id: "2", name: "Jacket" },
  ]);
};

export default function Products() {
  const products = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

该组件在服务器和浏览器上渲染。加载器 _仅在服务器上运行_。这意味着我们硬编码的产品数组不会包含在浏览器包中，因此可以安全地将 API 和 SDK 用于数据库、支付处理、内容管理系统等仅限服务器的用途。

如果您的服务器端模块最终出现在客户端包中，请参考我们的 [服务器与客户端代码执行][server-vs-client-code] 指南。

## 路由参数

当您使用 `$` 命名文件，如 `app/routes/users.$userId.tsx` 和 `app/routes/users.$userId.projects.$projectId.tsx` 时，动态段（以 `$` 开头的部分）将从 URL 中解析并作为 `params` 对象传递给您的加载器。

```tsx filename=app/routes/users.$userId.projects.$projectId.tsx
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  console.log(params.userId);
  console.log(params.projectId);
};
```

给定以下 URL，params 将解析如下：

| URL                             | `params.userId` | `params.projectId` |
| ------------------------------- | --------------- | ------------------ |
| `/users/123/projects/abc`       | `"123"`         | `"abc"`            |
| `/users/aec34g/projects/22cba9` | `"aec34g"`      | `"22cba9"`         |

这些参数在查找数据时最为有用：

```tsx filename=app/routes/users.$userId.projects.$projectId.tsx lines=[10-11]
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  return json(
    await fakeDb.project.findMany({
      where: {
        userId: params.userId,
        projectId: params.projectId,
      },
    })
  );
};
```

### 参数类型安全

因为这些参数来自 URL 而不是你的源代码，所以你无法确定它们是否会被定义。这就是参数键的类型是 `string | undefined` 的原因。在使用它们之前进行验证是一个好习惯，特别是在 TypeScript 中以获得类型安全。使用 `invariant` 可以很方便地做到这一点。

```tsx filename=app/routes/users.$userId.projects.$projectId.tsx lines=[2,7-8]
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import invariant from "tiny-invariant";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.userId, "Expected params.userId");
  invariant(params.projectId, "Expected params.projectId");

  params.projectId; // <-- TypeScript now knows this is a string
};
```

虽然你可能对使用 `invariant` 抛出这样的错误感到不安，但请记住，在 Remix 中，你知道用户最终会进入 [错误边界][error-boundary]，在这里他们可以从问题中恢复，而不是出现破损的 UI。

## 外部 API

Remix 在您的服务器上为 `fetch` API 提供了 polyfill，因此从现有的 JSON API 获取数据非常简单。您可以在加载器（服务器端）中进行数据获取，而不必自己管理状态、错误、竞争条件等，让 Remix 处理其余的部分。

```tsx filename=app/routes/gists.tsx lines=[5]
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const res = await fetch("https://api.github.com/gists");
  return json(await res.json());
}

export default function GistsRoute() {
  const gists = useLoaderData<typeof loader>();
  return (
    <ul>
      {gists.map((gist) => (
        <li key={gist.id}>
          <a href={gist.html_url}>{gist.id}</a>
        </li>
      ))}
    </ul>
  );
}
```

当您已经有一个 API 可供使用，并且不需要或不关心在 Remix 应用中直接连接到数据源时，这非常好。

## 数据库

由于 Remix 在您的服务器上运行，您可以直接在路由模块中连接到数据库。例如，您可以使用 [Prisma][prisma] 连接到 Postgres 数据库。

```tsx filename=app/db.server.ts
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
export { db };
```

然后您的路由可以导入它并进行查询：

```tsx filename=app/routes/products.$categoryId.tsx
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import { db } from "~/db.server";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  return json(
    await db.product.findMany({
      where: {
        categoryId: params.categoryId,
      },
    })
  );
};

export default function ProductCategory() {
  const products = useLoaderData<typeof loader>();
  return (
    <div>
      <p>{products.length} 产品</p>
      {/* ... */}
    </div>
  );
}
```

如果您使用 TypeScript，您可以使用类型推断在调用 `useLoaderData` 时使用 Prisma Client 生成的类型。这在编写使用加载数据的代码时提供了更好的类型安全性和智能感知。

```tsx filename=app/routes/products.$productId.tsx
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import { db } from "~/db.server";

async function getLoaderData(productId: string) {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
      imgSrc: true,
    },
  });

  return product;
}

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  return json(await getLoaderData(params.productId));
};

export default function Product() {
  const product = useLoaderData<typeof loader>();
  return (
    <div>
      <p>产品 {product.id}</p>
      {/* ... */}
    </div>
  );
}
```

## Cloudflare KV

如果您选择了 Cloudflare Pages 或 Workers 作为您的环境，[Cloudflare Key Value][cloudflare-kv] 存储允许您将数据持久化到边缘，就像静态资源一样。

对于 Pages，要开始本地开发，您需要在 package.json 任务中添加一个 `--kv` 参数，并指定您的命名空间名称，示例如下：

```
"dev:wrangler": "cross-env NODE_ENV=development wrangler pages dev ./public --kv PRODUCTS_KV"
```

对于 Cloudflare Workers 环境，您需要[进行一些其他配置][cloudflare-kv-setup]。

这使您能够在加载器上下文中使用 `PRODUCTS_KV`（KV 存储会通过 Cloudflare Pages 适配器自动添加到加载器上下文中）：

```tsx
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({
  context,
  params,
}: LoaderFunctionArgs) => {
  return json(
    await context.PRODUCTS_KV.get(
      `product-${params.productId}`,
      { type: "json" }
    )
  );
};

export default function Product() {
  const product = useLoaderData<typeof loader>();
  return (
    <div>
      <p>Product</p>
      {product.name}
    </div>
  );
}
```

## 未找到

在加载数据时，记录“未找到”是很常见的。一旦你知道无法按预期渲染组件，`throw` 一个响应，Remix 将停止在当前加载器中执行代码，并切换到最近的 [错误边界][error-boundary]。

```tsx lines=[10-13]
export const loader = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const product = await db.product.findOne({
    where: { id: params.productId },
  });

  if (!product) {
    // we know we can't render the component
    // so throw immediately to stop executing code
    // and show the not found page
    throw new Response("Not Found", { status: 404 });
  }

  const cart = await getCart(request);
  return json({
    product,
    inCart: cart.includes(product.id),
  });
};
```

## URL 搜索参数

URL 搜索参数是 URL 中 `?` 后面的部分。它的其他名称包括“查询字符串”、“搜索字符串”或“位置搜索”。您可以通过从 `request.url` 创建一个 URL 来访问这些值：

```tsx filename=app/routes/products.tsx lines=[7-8]
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const term = url.searchParams.get("term");
  return json(await fakeProductSearch(term));
};
```

这里涉及到几种网络平台类型：

- [`request`][request] 对象具有 `url` 属性
- [URL 构造函数][url] 解析 URL 字符串为对象
- `url.searchParams` 是 [URLSearchParams][url-search-params] 的一个实例，它是位置搜索字符串的解析版本，使得读取和操作搜索字符串变得简单

给定以下 URL，搜索参数将被解析如下：

| URL                             | `url.searchParams.get("term")` |
| ------------------------------- | ------------------------------ |
| `/products?term=stretchy+pants` | `"stretchy pants"`             |
| `/products?term=`               | `""`                           |
| `/products`                     | `null`                         |

### 数据重载

当多个嵌套路由正在渲染并且搜索参数发生变化时，所有路由都会被重新加载（而不仅仅是新的或已更改的路由）。这是因为搜索参数是一个跨切面的问题，可能会影响任何加载器。如果您希望在这种情况下防止某些路由重新加载，请使用 [shouldRevalidate][should-revalidate]。

### 组件中的搜索参数

有时您需要从组件中读取和更改搜索参数，而不是从加载器和操作中进行。这取决于您的用例，有几种方法可以实现这一点。

**设置搜索参数**

设置搜索参数最常见的方法可能是让用户通过表单来控制它们：

```tsx filename=app/routes/products.shoes.tsx lines=[8,9,16,17]
export default function ProductFilters() {
  return (
    <Form method="get">
      <label htmlFor="nike">Nike</label>
      <input
        type="checkbox"
        id="nike"
        name="brand"
        value="nike"
      />

      <label htmlFor="adidas">Adidas</label>
      <input
        type="checkbox"
        id="adidas"
        name="brand"
        value="adidas"
      />

      <button type="submit">更新</button>
    </Form>
  );
}
```

如果用户只选择了一个：

- [x] Nike
- [ ] Adidas

那么 URL 将是 `/products/shoes?brand=nike`

如果用户选择了两个：

- [x] Nike
- [x] Adidas

那么 URL 将是：`/products/shoes?brand=nike&brand=adidas`

请注意，`brand` 在 URL 搜索字符串中重复，因为两个复选框的名称都是 `"brand"`。在您的加载器中，您可以通过 [`searchParams.getAll`][search-params-getall] 访问所有这些值。

```tsx lines=[8]
import type { LoaderFunctionArgs } from "@remix-run/node"; // 或 cloudflare/deno
import { json } from "@remix-run/node"; // 或 cloudflare/deno

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const brands = url.searchParams.getAll("brand");
  return json(await getProducts({ brands }));
}
```

**链接到搜索参数**

作为开发者，您可以通过链接到包含搜索字符串的 URL 来控制搜索参数。该链接将用链接中的内容替换 URL 中的当前搜索字符串（如果存在）：

```tsx
<Link to="?brand=nike">Nike（仅限）</Link>
```

**在组件中读取搜索参数**

除了在加载器中读取搜索参数外，您通常还需要在组件中访问它们：

```tsx lines=[1,4-5,15,24]
import { useSearchParams } from "@remix-run/react";

export default function ProductFilters() {
  const [searchParams] = useSearchParams();
  const brands = searchParams.getAll("brand");

  return (
    <Form method="get">
      <label htmlFor="nike">Nike</label>
      <input
        type="checkbox"
        id="nike"
        name="brand"
        value="nike"
        defaultChecked={brands.includes("nike")}
      />

      <label htmlFor="adidas">Adidas</label>
      <input
        type="checkbox"
        id="adidas"
        name="brand"
        value="adidas"
        defaultChecked={brands.includes("adidas")}
      />

      <button type="submit">更新</button>
    </Form>
  );
}
```

您可能希望在任何字段更改时自动提交表单，为此可以使用 [`useSubmit`][use-submit]：

```tsx lines=[2,7,14]
import {
  useSubmit,
  useSearchParams,
} from "@remix-run/react";

export default function ProductFilters() {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const brands = searchParams.getAll("brand");

  return (
    <Form
      method="get"
      onChange={(e) => submit(e.currentTarget)}
    >
      {/* ... */}
    </Form>
  );
}
```

**以命令式方式设置搜索参数**

虽然不常见，但您也可以在任何时间出于任何原因以命令式方式设置搜索参数。这里的用例很少，以至于我们甚至无法想到一个好的例子，但这是一个愚蠢的示例：

```tsx
import { useSearchParams } from "@remix-run/react";

export default function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const id = setInterval(() => {
      setSearchParams({ now: Date.now() });
    }, 1000);
    return () => clearInterval(id);
  }, [setSearchParams]);

  // ...
}
```

### 搜索参数与受控输入

通常情况下，您希望将某些输入（如复选框）与 URL 中的搜索参数保持同步。这在 React 的受控组件概念中可能会有点棘手。

只有在搜索参数可以通过两种方式设置，并且我们希望输入与搜索参数保持同步时，这才是必要的。例如，`<input type="checkbox">` 和 `Link` 都可以在此组件中更改品牌：

```tsx bad lines=[11-18]
import { useSearchParams } from "@remix-run/react";

export default function ProductFilters() {
  const [searchParams] = useSearchParams();
  const brands = searchParams.getAll("brand");

  return (
    <Form method="get">
      <p>
        <label htmlFor="nike">Nike</label>
        <input
          type="checkbox"
          id="nike"
          name="brand"
          value="nike"
          defaultChecked={brands.includes("nike")}
        />
        <Link to="?brand=nike">(only)</Link>
      </p>

      <button type="submit">更新</button>
    </Form>
  );
}
```

如果用户点击复选框并提交表单，URL 会更新，复选框状态也会改变。但是如果用户仅点击链接，_只有 URL 会更新，而复选框不会_。这不是我们想要的。您可能熟悉 React 的受控组件，并考虑将其切换为 `checked` 而不是 `defaultChecked`：

```tsx bad lines=[6]
<input
  type="checkbox"
  id="adidas"
  name="brand"
  value="adidas"
  checked={brands.includes("adidas")}
/>
```

现在我们遇到了相反的问题：点击链接会更新 URL 和复选框状态，但 _复选框不再工作_，因为 React 阻止状态改变，直到控制它的 URL 改变——而且它永远不会改变，因为我们不能更改复选框并重新提交表单。

React 希望您通过某种状态来控制它，但我们希望用户在提交表单之前控制它，然后在 URL 更改时希望它被 URL 控制。所以我们处于这种“半受控”的状态。

您有两个选择，您选择的内容取决于您想要的用户体验。

**第一个选择**：最简单的方法是当用户点击复选框时自动提交表单：

```tsx lines=[2,7,20]
import {
  useSubmit,
  useSearchParams,
} from "@remix-run/react";

export default function ProductFilters() {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const brands = searchParams.getAll("brand");

  return (
    <Form method="get">
      <p>
        <label htmlFor="nike">Nike</label>
        <input
          type="checkbox"
          id="nike"
          name="brand"
          value="nike"
          onChange={(e) => submit(e.currentTarget.form)}
          checked={brands.includes("nike")}
        />
        <Link to="?brand=nike">(only)</Link>
      </p>

      {/* ... */}
    </Form>
  );
}
```

（如果您还在表单 `onChange` 上自动提交，请确保 `e.stopPropagation()`，以便事件不会冒泡到表单，否则您会在每次点击复选框时获得双重提交。）

**第二个选择**：如果您希望输入是“半受控”的，即复选框反映 URL 状态，但用户在提交表单并更改 URL 之前也可以切换它，您需要连接一些状态。这有点工作，但很简单：

- 从搜索参数初始化一些状态
- 当用户点击复选框时更新状态，以便复选框变为“已选中”
- 当搜索参数更改时（用户提交了表单或点击了链接）更新状态，以反映 URL 搜索参数中的内容

```tsx lines=[11-14,16-20,31-35]
import {
  useSubmit,
  useSearchParams,
} from "@remix-run/react";

export default function ProductFilters() {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const brands = searchParams.getAll("brand");

  const [nikeChecked, setNikeChecked] = React.useState(
    // 从 URL 初始化
    brands.includes("nike")
  );

  // 当参数更改时更新状态
  // （表单提交或链接点击）
  React.useEffect(() => {
    setNikeChecked(brands.includes("nike"));
  }, [brands, searchParams]);

  return (
    <Form method="get">
      <p>
        <label htmlFor="nike">Nike</label>
        <input
          type="checkbox"
          id="nike"
          name="brand"
          value="nike"
          onChange={(e) => {
            // 更新复选框状态而不提交表单
            setNikeChecked(true);
          }}
          checked={nikeChecked}
        />
        <Link to="?brand=nike">(only)</Link>
      </p>

      {/* ... */}
    </Form>
  );
}
```

您可能想为复选框制作一个抽象：

```tsx
<div>
  <SearchCheckbox name="brand" value="nike" />
  <SearchCheckbox name="brand" value="reebok" />
  <SearchCheckbox name="brand" value="adidas" />
</div>;

function SearchCheckbox({ name, value }) {
  const [searchParams] = useSearchParams();
  const paramsIncludeValue = searchParams
    .getAll(name)
    .includes(value);
  const [checked, setChecked] = React.useState(
    paramsIncludeValue
  );

  React.useEffect(() => {
    setChecked(paramsIncludeValue);
  }, [paramsIncludeValue]);

  return (
    <input
      type="checkbox"
      name={name}
      value={value}
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
}
```

**选项 3**：我们说过只有两个选项，但如果您对 React 非常熟悉，可能会诱使您选择第三个不当选项。您可能想要通过 `key` 属性的技巧来删除输入并重新挂载它。虽然很聪明，但这会导致可访问性问题，因为用户在点击后会失去焦点，因为 React 会在文档中删除节点。

<docs-error>不要这样做，这会导致可访问性问题</docs-error>

```tsx bad lines=[6,7]
<input
  type="checkbox"
  id="adidas"
  name="brand"
  value="adidas"
  key={"adidas" + brands.includes("adidas")}
  defaultChecked={brands.includes("adidas")}
/>
```

## Remix 优化

Remix 通过仅加载在导航时发生变化的页面部分的数据来优化用户体验。例如，考虑一下您当前在这些文档中使用的用户界面。侧边栏的导航栏位于一个父路由中，该路由获取了所有文档的动态生成菜单，而子路由获取了您现在正在阅读的文档。如果您点击侧边栏中的链接，Remix 知道父路由将保持在页面上——但子路由的数据将会改变，因为文档的 URL 参数将会改变。基于这一点，Remix _不会重新获取父路由的数据_。

如果没有 Remix，下一个问题是“我如何重新加载所有数据？”这也是 Remix 的内置功能。每当调用一个 [action][action] 时（用户提交了一个表单，或者您，程序员，从 `useSubmit` 调用了 `submit`），Remix 将自动重新加载页面上的所有路由，以捕捉可能发生的任何更改。

您无需担心缓存过期或在用户与您的应用交互时避免过度获取数据，这一切都是自动的。

Remix 将重新加载您所有路由的三种情况：

- 在一个 action 之后（表单，`useSubmit`，[`fetcher.submit`][fetcher-submit]）
- 如果 URL 搜索参数发生变化（任何加载器都可以使用它们）
- 用户点击链接到他们已经在的确切相同的 URL（这也会替换历史堆栈中的当前条目）

所有这些行为都模拟了浏览器的默认行为。在这些情况下，Remix 对您的代码了解不够，无法优化数据加载，但您可以使用 [shouldRevalidate][should-revalidate] 自行优化。

## 数据库

得益于 Remix 的数据约定和嵌套路由，您通常会发现不需要使用像 React Query、SWR、Apollo、Relay、`urql` 等客户端数据库。如果您使用像 redux 这样的全局状态管理库，主要用于与服务器上的数据交互，您也不太可能需要这些库。

当然，Remix 并不阻止您使用它们（除非它们需要捆绑器集成）。您可以随意使用任何您喜欢的 React 数据库，并在您认为它们能比 Remix API 更好地服务于您的 UI 的地方使用它们。在某些情况下，您可以使用 Remix 进行初始服务器渲染，然后切换到您最喜欢的库进行后续交互。

话虽如此，如果您引入了外部数据库并绕过了 Remix 自身的数据约定，Remix 将无法自动

- 服务器渲染您的页面
- 在 JavaScript 无法加载时对网络条件保持韧性
- 在用户与您的网站交互时进行优化，通过仅加载页面变化部分的数据来提高速度
- 在过渡时并行获取数据、JavaScript 模块、CSS 和其他资产，避免导致卡顿 UI 的渲染+获取瀑布流
- 通过在操作后重新验证，确保 UI 中的数据与服务器上的数据保持同步
- 在前进/后退点击时实现出色的滚动恢复（甚至跨域）
- 使用 [error boundaries][error-boundary] 处理服务器端错误
- 使用 [error boundaries][error-boundary] 为“未找到”和“未授权”提供良好的用户体验
- 帮助您保持 UI 的愉快路径。

相反，您需要做额外的工作来提供良好的用户体验。

Remix 旨在满足您可以设计的任何用户体验。虽然您 _不需要_ 外部数据库，但您可能仍然 _想要_ 一个，这没问题！

随着您学习 Remix，您会发现您从以客户端状态思考转变为以 URL 思考，并且在此过程中会获得许多免费功能。

## 注意事项

加载器仅在服务器上调用，通过浏览器的 `fetch`，因此您的数据会使用 `JSON.stringify` 序列化并在传输到组件之前通过网络发送。这意味着您的数据需要是可序列化的。例如：

<docs-error>这将不起作用！</docs-error>

```tsx bad nocopy lines=[3-6]
export async function loader() {
  return {
    date: new Date(),
    someMethod() {
      return "hello!";
    },
  };
}

export default function RouteComp() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  // '{"date":"2021-11-27T23:54:26.384Z"}'
}
```

并非所有内容都会被传递！加载器是用于 _数据_ 的，而数据需要是可序列化的。

一些数据库（如 [FaunaDB][fauna]）返回带有方法的对象，您需要小心序列化这些对象，然后再从加载器中返回。通常这不是问题，但了解您的数据正在通过网络传输是很重要的。

此外，Remix 会为您调用加载器，无论如何您都不应该尝试直接调用加载器：

<docs-error>这将不起作用</docs-error>

```tsx bad nocopy
export const loader = async () => {
  return json(await fakeDb.products.findMany());
};

export default function RouteComp() {
  const data = loader();
  // ...
}
```

[action]: ../route/action  
[cloudflare-kv-setup]: https://developers.cloudflare.com/workers/cli-wrangler/commands#kv  
[cloudflare-kv]: https://developers.cloudflare.com/workers/learning/how-kv-works  
[error-boundary]: ../route/error-boundary  
[fauna]: https://fauna.com  
[fetcher-submit]: ../hooks/use-fetcher#fetchersubmit  
[loader]: ../route/loader  
[prisma]: https://prisma.io  
[request]: https://developer.mozilla.org/en-US/docs/Web/API/Request  
[search-params-getall]: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/getAll  
[should-revalidate]: ../route/should-revalidate  
[url-search-params]: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams  
[url]: https://developer.mozilla.org/en-US/docs/Web/API/URL  
[use-submit]: ../hooks/use-submit  
[useloaderdata]: ../hooks/use-loader-data  
[server-vs-client-code]: ../discussion/server-vs-client