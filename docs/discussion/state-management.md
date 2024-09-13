---
title: 状态管理
order: 9
---

# 状态管理

在 React 中，状态管理通常涉及在客户端维护服务器数据的同步缓存。然而，在 Remix 中，由于其固有的数据同步处理方式，大多数传统的缓存解决方案变得多余。

## 理解 React 中的状态管理

在典型的 React 环境中，当我们提到“状态管理”时，我们主要讨论的是如何将服务器状态与客户端同步。一个更恰当的术语可能是“缓存管理”，因为服务器是真实来源，而客户端状态主要作为缓存功能。

在 React 中流行的缓存解决方案包括：

- **Redux:** 一个用于 JavaScript 应用程序的可预测状态容器。
- **React Query:** 用于在 React 中获取、缓存和更新异步数据的钩子。
- **Apollo:** 一个与 GraphQL 集成的全面状态管理库。

在某些情况下，使用这些库可能是合理的。然而，随着 Remix 独特的以服务器为中心的方法，它们的实用性变得不那么明显。事实上，大多数 Remix 应用程序完全放弃了它们。

## Remix 如何简化状态管理

正如在 [Fullstack Data Flow][fullstack_data_flow] 中讨论的，Remix 通过加载器、操作和表单等机制，利用自动重新验证无缝连接后端和前端。这使得开发者能够直接在组件中使用服务器状态，而无需管理缓存、网络通信或数据重新验证，从而使大多数客户端缓存变得多余。

以下是使用典型 React 状态模式在 Remix 中可能是一种反模式的原因：

1. **与网络相关的状态：** 如果您的 React 状态正在管理与网络相关的任何内容——例如来自加载器的数据、待处理的表单提交或导航状态——那么您很可能正在管理 Remix 已经管理的状态：

   - **[`useNavigation`][use_navigation]**：此 Hook 让您访问 `navigation.state`、`navigation.formData`、`navigation.location` 等。
   - **[`useFetcher`][use_fetcher]**：此 Hook 便于与 `fetcher.state`、`fetcher.formData`、`fetcher.data` 等进行交互。
   - **[`useLoaderData`][use_loader_data]**：访问路由的数据。
   - **[`useActionData`][use_action_data]**：访问最新操作的数据。

2. **在 Remix 中存储数据：** 开发者可能会倾向于存储在 React 状态中的许多数据在 Remix 中有更自然的归宿，例如：

   - **URL 查询参数：** URL 中持有状态的参数。
   - **Cookies：** 存储在用户设备上的小数据片段。
   - **服务器会话：** 服务器管理的用户会话。
   - **服务器缓存：** 服务器端的缓存数据以便于快速检索。

3. **性能考虑：** 有时，客户端状态被用来避免重复的数据获取。使用 Remix，您可以在 `loader` 中使用 [`Cache-Control`][cache_control_header] 头，允许您利用浏览器的本地缓存。然而，这种方法有其局限性，应谨慎使用。通常，优化后端查询或实现服务器缓存更具优势。这是因为这些更改使所有用户受益，并消除了对单独浏览器缓存的需求。

作为转向 Remix 的开发者，认识并接受其固有的高效性至关重要，而不是应用传统的 React 模式。Remix 提供了一种简化的状态管理解决方案，导致更少的代码、新鲜的数据和没有状态同步错误。

## 示例

### 网络相关状态

有关使用 Remix 的内部状态来管理网络相关状态的示例，请参阅 [Pending UI][pending_ui]。

### URL 搜索参数

考虑一个用户界面，让用户在列表视图和详细视图之间进行自定义。你的本能可能是使用 React 状态：

```tsx bad lines=[2,6,9]
export function List() {
  const [view, setView] = React.useState("list");
  return (
    <div>
      <div>
        <button onClick={() => setView("list")}>
          View as List
        </button>
        <button onClick={() => setView("details")}>
          View with Details
        </button>
      </div>
      {view === "list" ? <ListView /> : <DetailView />}
    </div>
  );
}
```

现在考虑当用户更改视图时，URL 也要更新。注意状态同步：

```tsx bad lines=[10,19,27]
import {
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

export function List() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [view, setView] = React.useState(
    searchParams.get("view") || "list"
  );

  return (
    <div>
      <div>
        <button
          onClick={() => {
            setView("list");
            navigate(`?view=list`);
          }}
        >
          View as List
        </button>
        <button
          onClick={() => {
            setView("details");
            navigate(`?view=details`);
          }}
        >
          View with Details
        </button>
      </div>
      {view === "list" ? <ListView /> : <DetailView />}
    </div>
  );
}
```

与其同步状态，你可以简单地通过无聊的旧 HTML 表单直接读取和设置 URL 中的状态。

```tsx good lines=[5,9-16]
import { Form, useSearchParams } from "@remix-run/react";

export function List() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "list";

  return (
    <div>
      <Form>
        <button name="view" value="list">
          View as List
        </button>
        <button name="view" value="details">
          View with Details
        </button>
      </Form>
      {view === "list" ? <ListView /> : <DetailView />}
    </div>
  );
}
```

### 持久化 UI 状态

考虑一个可以切换侧边栏可见性的 UI。我们有三种方法来处理状态：

1. React 状态
2. 浏览器本地存储
3. Cookies

在本讨论中，我们将分解与每种方法相关的权衡。

#### React 状态

React 状态提供了一个简单的临时状态存储解决方案。

**优点**：

- **简单**：易于实现和理解。
- **封装**：状态仅限于组件。

**缺点**：

- **瞬态**：在页面刷新、稍后返回页面或卸载和重新挂载组件时不会保留。

**实现**：

```tsx
function Sidebar({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "Close" : "Open"}
      </button>
      <aside hidden={!isOpen}>{children}</aside>
    </div>
  );
}
```

#### 本地存储

为了在组件生命周期之外持久化状态，浏览器本地存储是一个更好的选择。

**优点**：

- **持久性**：在页面刷新和组件挂载/卸载之间保持状态。
- **封装**：状态仅限于组件。

**缺点**：

- **需要同步**：React 组件必须与本地存储同步以初始化和保存当前状态。
- **服务器渲染限制**：[`window`][window_global] 和 [`localStorage`][local_storage_global] 对象在服务器端渲染期间不可访问，因此状态必须在浏览器中通过效果初始化。
- **UI 闪烁**：在初始页面加载时，本地存储中的状态可能与服务器渲染的内容不匹配，JavaScript 加载时 UI 会闪烁。

**实现**：

```tsx
function Sidebar({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);

  // 初始同步
  useLayoutEffect(() => {
    const isOpen = window.localStorage.getItem("sidebar");
    setIsOpen(isOpen);
  }, []);

  // 改变时同步
  useEffect(() => {
    window.localStorage.setItem("sidebar", isOpen);
  }, [isOpen]);

  return (
    <div>
      <button onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "Close" : "Open"}
      </button>
      <aside hidden={!isOpen}>{children}</aside>
    </div>
  );
}
```

在这种方法中，状态必须在效果中初始化。这对于避免服务器端渲染期间的复杂性至关重要。直接从 `localStorage` 初始化 React 状态会导致错误，因为在服务器渲染期间 `window.localStorage` 是不可用的。此外，即使它是可访问的，它也不会反映用户的浏览器本地存储。

```tsx bad lines=[4]
function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(
    // error: window is not defined
    window.localStorage.getItem("sidebar")
  );

  // ...
}
```

通过在效果中初始化状态，服务器渲染的状态与存储在本地存储中的状态之间可能会出现不匹配。这种差异会导致页面渲染后短暂的 UI 闪烁，应予以避免。

#### Cookies

Cookies 为此用例提供了全面的解决方案。然而，这种方法在使状态在组件内可访问之前引入了额外的初始设置。

**优点**：

- **服务器渲染**：状态在服务器上可用于渲染，甚至用于服务器操作。
- **单一真相来源**：消除了状态同步的麻烦。
- **持久性**：在页面加载和组件挂载/卸载之间保持状态。如果您切换到数据库支持的会话，状态甚至可以跨设备持久化。
- **渐进增强**：即使在 JavaScript 加载之前也能正常工作。

**缺点**：

- **样板代码**：由于网络原因，需要更多代码。
- **暴露**：状态并未封装到单个组件中，应用程序的其他部分必须了解 cookie。

**实现**：

首先，我们需要创建一个 cookie 对象：

```tsx
import { createCookie } from "@remix-run/node";
export const prefs = createCookie("prefs");
```

接下来，我们设置服务器操作和加载器以读取和写入 cookie：

```tsx
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node"; // 或 cloudflare/deno
import { json } from "@remix-run/node"; // 或 cloudflare/deno

import { prefs } from "./prefs-cookie";

// 从 cookie 中读取状态
export async function loader({
  request,
}: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await prefs.parse(cookieHeader)) || {};
  return json({ sidebarIsOpen: cookie.sidebarIsOpen });
}

// 将状态写入 cookie
export async function action({
  request,
}: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await prefs.parse(cookieHeader)) || {};
  const formData = await request.formData();

  const isOpen = formData.get("sidebar") === "open";
  cookie.sidebarIsOpen = isOpen;

  return json(isOpen, {
    headers: {
      "Set-Cookie": await prefs.serialize(cookie),
    },
  });
}
```

服务器代码设置完成后，我们可以在 UI 中使用 cookie 状态：

```tsx
function Sidebar({ children }) {
  const fetcher = useFetcher();
  let { sidebarIsOpen } = useLoaderData<typeof loader>();

  // 使用乐观 UI 立即更改 UI 状态
  if (fetcher.formData?.has("sidebar")) {
    sidebarIsOpen =
      fetcher.formData.get("sidebar") === "open";
  }

  return (
    <div>
      <fetcher.Form method="post">
        <button
          name="sidebar"
          value={sidebarIsOpen ? "closed" : "open"}
        >
          {sidebarIsOpen ? "Close" : "Open"}
        </button>
      </fetcher.Form>
      <aside hidden={!sidebarIsOpen}>{children}</aside>
    </div>
  );
}
```

虽然这无疑需要更多代码，涉及到更多的应用程序以处理网络请求和响应，但用户体验得到了极大改善。此外，状态来自单一真相来源，无需任何状态同步。

总之，讨论的每种方法都提供了一组独特的优点和挑战：

- **React 状态**：提供简单但瞬态的状态管理。
- **本地存储**：提供持久性，但需要同步并可能出现 UI 闪烁。
- **Cookies**：提供强大、持久的状态管理，但增加了样板代码。

这些方法都没有错，但如果您希望在访问之间持久化状态，Cookies 提供了最佳的用户体验。

### 表单验证和操作数据

客户端验证可以增强用户体验，但通过更多地依赖服务器端处理并让其处理复杂性，也可以实现类似的增强。

以下示例说明了管理网络状态、协调来自服务器的状态以及在客户端和服务器端重复实现验证的固有复杂性。这只是为了说明，因此请原谅您发现的任何明显错误或问题。

```tsx bad lines=[2,14,30,41,66]
export function Signup() {
  // 多个 React 状态声明
  const [isSubmitting, setIsSubmitting] =
    React.useState(false);

  const [userName, setUserName] = React.useState("");
  const [userNameError, setUserNameError] =
    React.useState(null);

  const [password, setPassword] = React.useState(null);
  const [passwordError, setPasswordError] =
    React.useState("");

  // 在客户端复制服务器端逻辑
  function validateForm() {
    setUserNameError(null);
    setPasswordError(null);
    const errors = validateSignupForm(userName, password);
    if (errors) {
      if (errors.userName) {
        setUserNameError(errors.userName);
      }
      if (errors.password) {
        setPasswordError(errors.password);
      }
    }
    return Boolean(errors);
  }

  // 手动处理网络交互
  async function handleSubmit() {
    if (validateForm()) {
      setSubmitting(true);
      const res = await postJSON("/api/signup", {
        userName,
        password,
      });
      const json = await res.json();
      setIsSubmitting(false);

      // 服务器状态同步到客户端
      if (json.errors) {
        if (json.errors.userName) {
          setUserNameError(json.errors.userName);
        }
        if (json.errors.password) {
          setPasswordError(json.errors.password);
        }
      }
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <p>
        <input
          type="text"
          name="username"
          value={userName}
          onChange={() => {
            // 为 fetch 同步表单状态
            setUserName(event.target.value);
          }}
        />
        {userNameError ? <i>{userNameError}</i> : null}
      </p>

      <p>
        <input
          type="password"
          name="password"
          onChange={(event) => {
            // 为 fetch 同步表单状态
            setPassword(event.target.value);
          }}
        />
        {passwordError ? <i>{passwordError}</i> : null}
      </p>

      <button disabled={isSubmitting} type="submit">
        注册
      </button>

      {isSubmitting ? <BusyIndicator /> : null}
    </form>
  );
}
```

后端端点 `/api/signup` 也执行验证并发送错误反馈。请注意，某些基本验证，例如检测重复用户名，只能通过客户端无法访问的信息在服务器端完成。

```tsx bad
export async function signupHandler(request: Request) {
  const errors = await validateSignupRequest(request);
  if (errors) {
    return json({ ok: false, errors: errors });
  }
  await signupUser(request);
  return json({ ok: true, errors: null });
}
```

现在，让我们将其与基于 Remix 的实现进行对比。操作保持一致，但由于直接利用服务器状态通过 [`useActionData`][use_action_data]，组件大大简化，并利用 Remix 自然管理的网络状态。

```tsx filename=app/routes/signup.tsx good lines=[23-25]
import type { ActionFunctionArgs } from "@remix-run/node"; // 或 cloudflare/deno
import { json } from "@remix-run/node"; // 或 cloudflare/deno
import {
  useActionData,
  useNavigation,
} from "@remix-run/react";

export async function action({
  request,
}: ActionFunctionArgs) {
  const errors = await validateSignupRequest(request);
  if (errors) {
    return json({ ok: false, errors: errors });
  }
  await signupUser(request);
  return json({ ok: true, errors: null });
}

export function Signup() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const userNameError = actionData?.errors?.userName;
  const passwordError = actionData?.errors?.password;
  const isSubmitting = navigation.formAction === "/signup";

  return (
    <Form method="post">
      <p>
        <input type="text" name="username" />
        {userNameError ? <i>{userNameError}</i> : null}
      </p>

      <p>
        <input type="password" name="password" />
        {passwordError ? <i>{passwordError}</i> : null}
      </p>

      <button disabled={isSubmitting} type="submit">
        注册
      </button>

      {isSubmitting ? <BusyIndicator /> : null}
    </Form>
  );
}
```

我们之前示例中的广泛状态管理被精简为仅三行代码。我们消除了对 React 状态、变化事件监听器、提交处理程序和状态管理库的需求，以进行此类网络交互。

通过 `useActionData` 可以直接访问服务器状态，通过 `useNavigation`（或 `useFetcher`）可以访问网络状态。

作为额外的惊喜，这个表单在 JavaScript 加载之前就可以正常工作。Remix 不再管理网络操作，而是默认的浏览器行为介入。

如果您发现自己陷入管理和同步网络操作的状态，Remix 可能提供了更优雅的解决方案。

[fullstack_data_flow]: ./data-flow
[use_navigation]: ../hooks/use-navigation
[use_fetcher]: ../hooks/use-fetcher
[use_loader_data]: ../hooks/use-loader-data
[use_action_data]: ../hooks/use-action-data
[cache_control_header]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
[pending_ui]: ./pending-ui
[window_global]: https://developer.mozilla.org/en-US/docs/Web/API/Window/window
[local_storage_global]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage