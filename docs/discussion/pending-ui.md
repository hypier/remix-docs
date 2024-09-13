---
title: 待处理 UI
position: 8
---

# 待处理和乐观用户界面

优秀的网页用户体验与平庸体验之间的差异在于开发者如何实现网络感知的用户界面反馈，通过在网络密集型操作期间提供视觉提示。待处理用户界面主要有三种类型：忙碌指示器、乐观用户界面和骨架占位符。本文档提供了根据特定场景选择和实施适当反馈机制的指导方针。

## 待处理的 UI 反馈机制

**忙碌指示器**：忙碌指示器在服务器处理操作时向用户显示视觉提示。当应用程序无法预测操作的结果并且必须等待服务器的响应才能更新 UI 时，使用此反馈机制。

**乐观 UI**：乐观 UI 通过在收到服务器响应之前立即用预期状态更新 UI 来增强感知速度和响应性。当应用程序能够根据上下文和用户输入预测操作的结果时，使用此方法，从而允许对操作做出即时响应。

**骨架占位符**：骨架占位符在 UI 初始加载时使用，为用户提供一个视觉占位符，勾勒出即将到来的内容的结构。此反馈机制特别有用，可以尽快渲染出一些有用的内容。

## 反馈选择的指导原则

使用乐观UI：

- **下一个状态的可预测性**：应用程序可以根据用户的操作准确预测UI的下一个状态。
- **错误处理**：有健壮的错误处理机制来应对过程中可能发生的错误。
- **URL稳定性**：该操作不会导致URL的变化，确保用户保持在同一页面内。

使用忙碌指示器：

- **下一个状态的不确定性**：该操作的结果无法可靠预测，需要等待服务器的响应。
- **URL变化**：该操作导致URL的变化，表示导航到新页面或新部分。
- **错误边界**：错误处理方法主要依赖于错误边界来管理异常和意外行为。
- **副作用**：该操作触发副作用，涉及关键过程，例如发送电子邮件、处理支付等。

使用骨架回退：

- **初始加载**：UI正在加载中，为用户提供即将到来的内容结构的视觉指示。
- **关键数据**：该数据对页面的初始渲染并不关键，允许在数据加载时显示骨架回退。
- **应用程序般的体验**：该应用程序设计成类似独立应用的行为，允许立即过渡到回退状态。

## 示例

### 页面导航

**忙碌指示器**：您可以使用 [`useNavigation`][use_navigation] 指示用户正在导航到新页面：

```tsx
import { useNavigation } from "@remix-run/react";

function PendingNavigation() {
  const navigation = useNavigation();
  return navigation.state === "loading" ? (
    <div className="spinner" />
  ) : null;
}
```

### 待处理链接

**忙碌指示器**：您可以在导航链接上指示用户正在导航到它，使用 [`<NavLink className>`][nav_link_component_classname] 回调。

```tsx lines=[10-12]
import { NavLink } from "@remix-run/react";

export function ProjectList({ projects }) {
  return (
    <nav>
      {projects.map((project) => (
        <NavLink
          key={project.id}
          to={project.id}
          className={({ isPending }) =>
            isPending ? "pending" : null
          }
        >
          {project.name}
        </NavLink>
      ))}
    </nav>
  );
}
```

或者通过检查参数在旁边添加一个旋转器：

```tsx lines=[1,4,10-12]
import { useParams } from "@remix-run/react";

export function ProjectList({ projects }) {
  const params = useParams();
  return (
    <nav>
      {projects.map((project) => (
        <NavLink key={project.id} to={project.id}>
          {project.name}
          {params.projectId === project.id ? (
            <Spinner />
          ) : null}
        </NavLink>
      ))}
    </nav>
  );
}
```

虽然链接上的本地化指示器很好，但它们并不完整。触发导航的方式还有很多：表单提交、浏览器中的前进和后退按钮点击、操作重定向，以及命令式的 `navigate(path)` 调用，因此您通常希望有一个全局指示器来捕捉所有内容。

### 记录创建

**忙碌指示器**：通常最好等待记录创建完成，而不是使用乐观用户界面，因为在完成之前，ID和其他字段是未知的。还要注意，此操作会从该操作重定向到新记录。

```tsx filename=app/routes/create-project.tsx lines=[2,13,21-22,26,35]
import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { useNavigation } from "@remix-run/react";

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const project = await createRecord({
    name: formData.get("name"),
    owner: formData.get("owner"),
  });
  return redirect(`/projects/${project.id}`);
}

export default function CreateProject() {
  const navigation = useNavigation();

  // important to check you're submitting to the action
  // for the pending UI, not just any action
  const isSubmitting =
    navigation.formAction === "/create-project";

  return (
    <Form method="post" action="/create-project">
      <fieldset disabled={isSubmitting}>
        <label>
          Name: <input type="text" name="projectName" />
        </label>
        <label>
          Owner: <UserSelect />
        </label>
        <button type="submit">Create</button>
      </fieldset>
      {isSubmitting ? <BusyIndicator /> : null}
    </Form>
  );
}
```

您可以使用 [`useFetcher`][use_fetcher] 做同样的事情，如果您不更改URL（也许是将记录添加到列表中）

```tsx lines=[5]
import { useFetcher } from "@remix-run/react";

function CreateProject() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <fetcher.Form method="post" action="/create-project">
      {/* ... */}
    </fetcher.Form>
  );
}
```

### 记录更新

**乐观 UI**：当 UI 仅仅更新记录中的一个字段时，乐观 UI 是一个很好的选择。在 web 应用中，许多用户交互（如果不是大多数的话）往往是更新，因此这是一个常见的模式。

```tsx lines=[6-8,19,22]
import { useFetcher } from "@remix-run/react";

function ProjectListItem({ project }) {
  const fetcher = useFetcher();

  const starred = fetcher.formData
    ? // use optimistic value if submitting
      fetcher.formData.get("starred") === "1"
    : // fall back to the database state
      project.starred;

  return (
    <>
      <div>{project.name}</div>
      <fetcher.Form method="post">
        <button
          type="submit"
          name="starred"
          // use optimistic value to allow interruptions
          value={starred ? "0" : "1"}
        >
          {/* 👇 display optimistic value */}
          {starred ? "★" : "☆"}
        </button>
      </fetcher.Form>
    </>
  );
}
```

## 延迟数据加载

**骨架占位符**：当数据被延迟加载时，您可以使用 [`<Suspense>`][suspense_component] 添加占位符。这允许用户界面在等待数据加载时渲染，从而加快应用程序的感知和实际性能。

```tsx lines=[11-14,24-28]
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { defer } from "@remix-run/node"; // or cloudflare/deno
import { Await } from "@remix-run/react";
import { Suspense } from "react";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  const reviewsPromise = getReviews(params.productId);
  const product = await getProduct(params.productId);
  return defer({
    product: product,
    reviews: reviewsPromise,
  });
}

export default function ProductRoute() {
  const { product, reviews } =
    useLoaderData<typeof loader>();
  return (
    <>
      <ProductPage product={product} />

      <Suspense fallback={<ReviewsSkeleton />}>
        <Await resolve={reviews}>
          {(reviews) => <Reviews reviews={reviews} />}
        </Await>
      </Suspense>
    </>
  );
}
```

在创建骨架占位符时，请考虑以下原则：

- **一致的尺寸**：确保骨架占位符与实际内容的尺寸相匹配。这可以防止突发的布局偏移，提供更平滑和视觉上更一致的加载体验。在网页性能方面，这种权衡最小化了 [累积布局偏移][cumulative_layout_shift] (CLS)，以改善 [首次内容绘制][first_contentful_paint] (FCP)。通过在占位符中使用准确的尺寸，可以最小化这种权衡。
- **关键数据**：避免对重要信息（页面的主要内容）使用占位符。这对 SEO 和元标签尤其重要。如果延迟显示关键数据，就无法提供准确的元标签，搜索引擎将无法正确索引您的页面。
- **应用程序般的感觉**：对于没有 SEO 问题的 web 应用程序 UI，广泛使用骨架占位符可能是有益的。这创建了一个类似于独立应用程序行为的界面。当用户点击链接时，他们会立即过渡到骨架占位符。
- **链接预取**：使用 [`<Link prefetch="intent">`][link-component-prefetch] 可以常常完全跳过占位符。当用户悬停或聚焦于链接时，此方法会预加载所需的数据，允许网络在用户点击之前快速获取内容。这通常会导致立即导航到下一页。

## 结论

通过忙碌指示器、乐观 UI 和骨架回退创建网络感知 UI 显著改善了用户体验，通过在需要网络交互的操作期间显示视觉提示。掌握这一点是构建用户信任的应用程序的最佳方式。

[use_navigation]: ../hooks/use-navigation  
[nav_link_component_classname]: ../components/nav-link#classname-callback  
[use_fetcher]: ../hooks/use-fetcher  
[suspense_component]: https://react.dev/reference/react/Suspense  
[cumulative_layout_shift]: https://web.dev/cls  
[first_contentful_paint]: https://web.dev/fcp  
[link-component-prefetch]: ../components/link#prefetch