---
title: 网络并发管理
---

# 网络并发管理

在构建 web 应用程序时，管理网络请求可能是一项艰巨的任务。确保数据最新和处理同时请求的挑战常常导致应用程序中出现复杂的逻辑，以应对中断和竞争条件。Remix 通过自动化网络管理，简化了这一过程，镜像并扩展了 web 浏览器的直观行为。

为了帮助理解 Remix 的工作原理，请记住来自 [Fullstack Data Flow][fullstack_data_flow] 的内容，在 `form` 提交后，Remix 会从加载器中获取最新数据。这被称为重新验证。

## 与浏览器行为的自然对齐

Remix 对网络并发的处理深受浏览器在处理文档时的默认行为的启发：

- **浏览器链接导航**：当您在浏览器中点击一个链接，然后在页面过渡完成之前点击另一个链接时，浏览器优先处理最近的 `action`。它会取消最初的请求，仅专注于最新点击的链接。

  - **Remix 的方法**：Remix 以相同的方式管理客户端导航。当在 Remix 应用程序中点击链接时，它会为与目标 URL 关联的每个加载器发起获取请求。如果另一个导航中断了初始导航，Remix 会取消先前的获取请求，确保只有最新的请求继续进行。

- **浏览器表单提交**：如果您在浏览器中发起表单提交，然后快速再次提交另一个表单，浏览器会忽略第一次提交，仅处理最新的提交。

  - **Remix 的方法**：Remix 在处理表单时模仿这种行为。如果提交了一个表单，在第一次提交完成之前发生了另一个提交，Remix 会取消原始的获取请求。然后它会等待最新的提交完成，再次触发页面重新验证。

## 并发提交和重新验证

虽然标准浏览器在导航和表单提交时每次仅限于一个请求，但 Remix 提升了这一行为。与导航不同，使用 [`useFetcher`][use_fetcher] 时可以同时进行多个请求。

Remix 旨在高效处理多个表单提交到服务器 `action` 以及并发重新验证请求。它确保一旦有新数据可用，状态会及时更新。然而，Remix 也通过避免在其他 `action` 引入竞争条件时提交过时数据来防止潜在的陷阱。

例如，如果有三个表单提交正在进行中，而其中一个完成，Remix 会立即用该数据更新 UI，而不必等待其他两个，以确保 UI 保持响应和动态。当剩余的提交完成时，Remix 继续更新 UI，确保显示最新的数据。

为了帮助理解一些可视化，下面是图表中使用的符号的说明：

- `|`: 提交开始
- ✓: 操作完成，数据重新验证开始
- ✅: 重新验证的数据被提交到 UI
- ❌: 请求被取消

```text
submission 1: |----✓-----✅
submission 2:    |-----✓-----✅
submission 3:             |-----✓-----✅
```

然而，如果后续提交的重新验证在较早的提交之前完成，Remix 将丢弃较早的数据，确保 UI 中仅反映最新的信息。

```text
submission 1: |----✓---------❌
submission 2:    |-----✓-----✅
submission 3:             |-----✓-----✅
```

由于提交（2）的重新验证开始得较晚，但比提交（1）先完成，提交（1）的请求被取消，只有提交（2）的数据被提交到 UI。因为它是后请求的，所以更有可能包含来自（1）和（2）的更新值。

## 潜在的陈旧数据

用户不太可能遇到这种情况，但在不一致的基础设施下，用户在非常少见的条件下仍然有可能看到陈旧数据。尽管 Remix 会取消对陈旧数据的请求，但这些请求仍然会到达服务器。在浏览器中取消请求只是释放了该请求的浏览器资源，它无法“赶上”并阻止请求到达服务器。在极少数情况下，取消的请求可能会在中断的 `action` 的重新验证完成后更改数据。请考虑以下图示：

```text
     👇 interruption with new submission
|----❌----------------------✓
       |-------✓-----✅
                             👆
                  initial request reaches the server
                  after the interrupting submission
                  has completed revalidation
```

用户现在看到的数据与服务器上的数据不同。请注意，这个问题既非常罕见，也存在于默认的浏览器行为中。初始请求在提交和第二次重新验证之后到达服务器的可能性在任何网络和服务器基础设施上都是意外的。如果这是您基础设施中的一个问题，您可以在表单提交中发送时间戳，并编写服务器逻辑以忽略陈旧的提交。

## 示例

在像组合框这样的UI组件中，每次按键都可能触发网络请求。管理如此快速、连续的请求可能会很棘手，特别是在确保显示的结果与最新查询匹配时。然而，使用Remix，这一挑战会自动处理，确保用户看到正确的结果，而开发者无需过度管理网络。

```tsx filename=app/routes/city-search.tsx
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const cities = await searchCities(searchParams.get("q"));
  return json(cities);
}

export function CitySearchCombobox() {
  const fetcher = useFetcher<typeof loader>();

  return (
    <fetcher.Form action="/city-search">
      <Combobox aria-label="Cities">
        <ComboboxInput
          name="q"
          onChange={(event) =>
            // submit the form onChange to get the list of cities
            fetcher.submit(event.target.form)
          }
        />

        {/* render with the loader's data */}
        {fetcher.data ? (
          <ComboboxPopover className="shadow-popup">
            {fetcher.data.length > 0 ? (
              <ComboboxList>
                {fetcher.data.map((city) => (
                  <ComboboxOption
                    key={city.id}
                    value={city.name}
                  />
                ))}
              </ComboboxList>
            ) : (
              <span>没有找到结果</span>
            )}
          </ComboboxPopover>
        ) : null}
      </Combobox>
    </fetcher.Form>
  );
}
```

应用程序需要知道的只是如何查询数据以及如何渲染它，Remix处理网络。

## 结论

Remix 为开发者提供了一种直观的基于浏览器的网络请求管理方式。通过模拟浏览器行为并在必要时进行增强，它简化了并发、重新验证和潜在竞争条件的复杂性。无论您是在构建一个简单的网页还是一个复杂的 web 应用程序，Remix 确保您的用户交互流畅、可靠，并始终保持最新。

[fullstack_data_flow]: ./data-flow  
[use_fetcher]: ../hooks/use-fetcher