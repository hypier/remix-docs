---
title: 表单与提取器
---

# 表单与获取器

在 Remix 中开发提供了一套丰富的工具，这些工具有时在功能上会重叠，从而给新手带来一些模糊感。在 Remix 中有效开发的关键在于理解每个工具的细微差别和适当的使用场景。本文件旨在阐明何时以及为何使用特定的 API。

## APIs 重点

- [`<Form>`][form_component]
- [`useActionData`][use_action_data]
- [`useFetcher`][use_fetcher]
- [`useNavigation`][use_navigation]

理解这些 API 之间的区别和交集对于高效和有效的 Remix 开发至关重要。

### URL 考虑事项

选择这些工具时的主要标准是您是否希望 URL 发生变化：

- **希望 URL 变化**：在页面之间导航或过渡时，或者在执行某些操作后，例如创建或删除记录。这确保用户的浏览器历史准确反映他们在您的应用程序中的旅程。

  - **预期行为**：在许多情况下，当用户点击后退按钮时，他们应该返回到上一页。有时历史条目可能会被替换，但 URL 的变化仍然很重要。

- **不希望 URL 变化**：对于那些不会显著改变当前视图的上下文或主要内容的操作。这可能包括更新单个字段或轻微的数据操作，这些操作不需要新的 URL 或页面重新加载。这也适用于使用取数器加载数据的情况，例如弹出框、组合框等。

### 特定使用案例

#### 当 URL 应该改变时

这些操作通常反映了用户上下文或状态的重大变化：

- **创建新记录**：在创建新记录后，通常会将用户重定向到专门用于该新记录的页面，以便他们可以查看或进一步修改。

- **删除记录**：如果用户在专门的记录页面上并决定删除该记录，逻辑上的下一步是将他们重定向到一个通用页面，例如所有记录的列表。

对于这些情况，开发人员应考虑结合使用 [`<Form>`][form_component]、[`useActionData`][use_action_data] 和 [`useNavigation`][use_navigation]。这些工具可以协调处理表单提交、调用特定操作、检索与操作相关的数据以及管理导航。

#### 当 URL 不应该改变时

这些操作通常更为微妙，不需要用户切换上下文：

- **更新单个字段**：也许用户想要更改列表中某个项目的名称或更新记录的特定属性。这种操作较小，不需要新的页面或 URL。

- **从列表中删除记录**：在列表视图中，如果用户删除一个项目，他们很可能希望保持在列表视图中，该项目不再出现在列表中。

- **在列表视图中创建记录**：当向列表添加新项目时，用户通常希望保持在该上下文中，看到他们的新项目添加到列表中，而无需完全页面转换。

- **为弹出框或组合框加载数据**：在为弹出框或组合框加载数据时，用户的上下文保持不变。数据在后台加载，并显示在一个小的、自包含的用户界面元素中。

对于这些操作，[`useFetcher`][use_fetcher] 是首选 API。它功能多样，结合了其他四个 API 的功能，非常适合 URL 应保持不变的任务。

## API 比较

如您所见，这两组 API 有很多相似之处：

| Navigation/URL API      | Fetcher API          |
| ----------------------- | -------------------- |
| `<Form>`                | `<fetcher.Form>`     |
| `useActionData()`       | `fetcher.data`       |
| `navigation.state`      | `fetcher.state`      |
| `navigation.formAction` | `fetcher.formAction` |
| `navigation.formData`   | `fetcher.formData`   |

## 示例

### 创建新记录

```tsx filename=app/routes/recipes/new.tsx lines=[18,22-23,28]
import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { redirect } from "@remix-run/node"; // or cloudflare/deno
import {
  Form,
  useActionData,
  useNavigation,
} from "@remix-run/react";

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const errors = await validateRecipeFormData(formData);
  if (errors) {
    return json({ errors });
  }
  const recipe = await db.recipes.create(formData);
  return redirect(`/recipes/${recipe.id}`);
}

export function NewRecipe() {
  const { errors } = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting =
    navigation.formAction === "/recipes/new";

  return (
    <Form method="post">
      <label>
        标题: <input name="title" />
        {errors?.title ? <span>{errors.title}</span> : null}
      </label>
      <label>
        食材: <textarea name="ingredients" />
        {errors?.ingredients ? (
          <span>{errors.ingredients}</span>
        ) : null}
      </label>
      <label>
        步骤: <textarea name="directions" />
        {errors?.directions ? (
          <span>{errors.directions}</span>
        ) : null}
      </label>
      <button type="submit">
        {isSubmitting ? "保存中..." : "创建食谱"}
      </button>
    </Form>
  );
}
```

该示例利用了 [`<Form>`][form_component]、[`useActionData`][use_action_data] 和 [`useNavigation`][use_navigation] 来促进直观的记录创建过程。

使用 `<Form>` 确保了直接且逻辑清晰的导航。在创建记录后，用户将自然而然地被引导到新食谱的唯一 URL，强化了他们操作的结果。

`useActionData` 在服务器和客户端之间架起了桥梁，提供了关于提交问题的即时反馈。这种快速响应使用户能够毫不妨碍地纠正任何错误。

最后，`useNavigation` 动态反映了表单的提交状态。这种微妙的 UI 变化，比如切换按钮的标签，向用户保证他们的操作正在处理中。

这些 API 结合在一起，提供了结构化导航和反馈的平衡融合。

### 更新记录

现在考虑我们正在查看一个包含每个项目删除按钮的食谱列表。当用户点击删除按钮时，我们希望从数据库中删除该食谱，并在不离开列表的情况下将其从列表中移除。

首先考虑基本的路由设置，以便在页面上获取食谱列表：

```tsx filename=app/routes/recipes/_index.tsx
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  return json({
    recipes: await db.recipes.findAll({ limit: 30 }),
  });
}

export default function Recipes() {
  const { recipes } = useLoaderData<typeof loader>();
  return (
    <ul>
      {recipes.map((recipe) => (
        <RecipeListItem key={recipe.id} recipe={recipe} />
      ))}
    </ul>
  );
}
```

现在我们将查看删除食谱的操作和渲染列表中每个食谱的组件。

```tsx filename=app/routes/recipes/_index.tsx lines=[7,13,19]
export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = formData.get("id");
  await db.recipes.delete(id);
  return json({ ok: true });
}

const RecipeListItem: FunctionComponent<{
  recipe: Recipe;
}> = ({ recipe }) => {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  return (
    <li>
      <h2>{recipe.title}</h2>
      <fetcher.Form method="post">
        <button disabled={isDeleting} type="submit">
          {isDeleting ? "正在删除..." : "删除"}
        </button>
      </fetcher.Form>
    </li>
  );
};
```

在这种情况下使用 [`useFetcher`][use_fetcher] 完美地工作。我们希望在本地进行更新，而不是离开或刷新整个页面。当用户删除一个食谱时，调用的操作和 fetcher 管理相应的状态转换。

这里的关键优势在于上下文的维护。当删除完成时，用户仍然停留在列表上。fetcher 的状态管理能力被利用来提供实时反馈：它在 `"正在删除..."` 和 `"删除"` 之间切换，清晰地指示正在进行的过程。

此外，每个 fetcher 拥有管理其自身状态的自主权，使得对单个列表项的操作变得独立，确保对一个项目的操作不会影响其他项目（尽管页面数据的重新验证是一个共同关注的问题，详见 [网络并发管理][network_concurrency_management]）。

总之，`useFetcher` 提供了一种无缝的机制，用于不需要更改 URL 或导航的操作，通过提供实时反馈和上下文保持来增强用户体验。

### 将文章标记为已读

想象一下，您希望在当前用户在页面上停留一段时间并滚动到底部后，标记一篇文章已被阅读。您可以创建一个看起来像这样的钩子：

```tsx
function useMarkAsRead({ articleId, userId }) {
  const marker = useFetcher();

  useSpentSomeTimeHereAndScrolledToTheBottom(() => {
    marker.submit(
      { userId },
      {
        action: `/article/${articleId}/mark-as-read`,
        method: "post",
      }
    );
  });
}
```

### 用户头像详情弹窗

每当您显示用户头像时，可以添加一个悬停效果，从加载器中获取数据并在弹窗中显示。

```tsx filename=app/routes/users.$id.details.tsx
export async function loader({
  params,
}: LoaderFunctionArgs) {
  return json(
    await fakeDb.user.find({ where: { id: params.id } })
  );
}

function UserAvatar({ partialUser }) {
  const userDetails = useFetcher<typeof loader>();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (
      showDetails &&
      userDetails.state === "idle" &&
      !userDetails.data
    ) {
      userDetails.load(`/users/${user.id}/details`);
    }
  }, [showDetails, userDetails]);

  return (
    <div
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <img src={partialUser.profileImageUrl} />
      {showDetails ? (
        userDetails.state === "idle" && userDetails.data ? (
          <UserPopup user={userDetails.data} />
        ) : (
          <UserPopupLoading />
        )
      ) : null}
    </div>
  );
}
```

## 结论

Remix 提供了一系列工具以满足不同的开发需求。虽然某些功能可能看起来有重叠，但每个工具都是针对特定场景精心设计的。通过理解 `<Form>`、`useActionData`、`useFetcher` 和 `useNavigation` 的复杂性和理想应用，开发者可以创建更直观、响应迅速且用户友好的 web 应用程序。

[form_component]: ../components/form  
[use_action_data]: ../hooks/use-action-data  
[use_fetcher]: ../hooks/use-fetcher  
[use_navigation]: ../hooks/use-navigation  
[network_concurrency_management]: ./concurrency