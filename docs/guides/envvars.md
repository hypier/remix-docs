---
title: 环境变量
---

# 环境变量

Remix 在环境变量方面没有直接的操作（除了在本地开发期间），但我们发现了一些有用的模式，在本指南中将与您分享。

环境变量是存储在服务器上的值，您的应用程序可以使用这些值。您可能熟悉普遍使用的 `NODE_ENV`。您的部署服务器可能会自动将其设置为 "production"。

<docs-warning>运行 `remix build` 时，如果 `process.env.NODE_ENV` 的值对应有效模式："production"、"development" 或 "test"，则会使用该值进行编译。如果 `process.env.NODE_ENV` 的值无效，则默认使用 "production"。</docs-warning>

以下是一些您可能在实际应用中遇到的环境变量示例：

- `DATABASE_URL`: Postgres 数据库的 URL
- `STRIPE_PRIVATE_KEY`: 结账工作流在服务器上使用的密钥
- `STRIPE_PUBLIC_KEY`: 结账工作流在浏览器上使用的密钥

如果您在过去几年主要使用 JS 框架进行 Web 开发，您可能会将这些视为构建时使用的东西。虽然它们对于打包代码很有用，但传统上这些是 "构建参数"，而不是环境变量。环境变量在服务器的运行时最为有用。例如，您可以更改环境变量，以在不重新构建或甚至不重新部署的情况下更改应用程序的行为。

## 服务器环境变量

### 本地开发

如果您使用 `remix dev` 服务器在本地运行项目，它内置支持 [dotenv][dotenv]。

首先，在项目根目录下创建一个 `.env` 文件：

```sh
touch .env
```

<docs-error>请勿将您的 <code>.env</code> 文件提交到 git，因为它包含机密信息！</docs-error>

编辑您的 `.env` 文件。

```
SOME_SECRET=super-secret
```

然后，当运行 `remix dev` 时，您将能够在加载器/操作中访问这些值：

```tsx
export async function loader() {
  console.log(process.env.SOME_SECRET);
}
```

如果您使用 `@remix-run/cloudflare-pages` 适配器，环境变量的工作方式会有所不同。由于 Cloudflare Pages 由 Functions 提供支持，您需要在 [`.dev.vars`][dev-vars] 文件中定义本地环境变量。它的语法与上面提到的 `.env` 示例文件相同。

然后，它们将在您的 `loader`/`action` 函数中通过 Remix 的 `context.env` 可用：

```tsx
export const loader = async ({
  context,
}: LoaderFunctionArgs) => {
  console.log(context.env.SOME_SECRET);
};
```

请注意，`.env` 文件仅用于开发。您不应在生产环境中使用它们，因此 Remix 在运行 `remix serve` 时不会加载它们。您需要遵循主机的指南，通过下面的链接将机密信息添加到您的生产服务器中。

### 生产

部署到生产环境时，环境变量将由您的主机处理，例如：

- [Netlify][netlify]
- [Fly.io][fly-io]
- [Cloudflare Pages][cloudflare-pages]
- [Cloudflare Workers][cloudflare-workers]
- [Vercel][vercel]
- [Architect][architect]

## 浏览器环境变量

一些人问 Remix 是否可以让他们将环境变量放入浏览器包中。这在构建重型框架中是一种常见策略。然而，这种方法存在一些问题：

1. 这并不是真正的环境变量。您必须在构建时知道要部署到哪个服务器。
2. 您无法在不重新构建和重新部署的情况下更改值。
3. 很容易意外地将机密泄露到公开可访问的文件中！

相反，我们建议将所有环境变量保留在服务器上（包括所有服务器机密以及您的浏览器中的 JavaScript 需要的内容），并通过 `window.ENV` 将它们暴露给您的浏览器代码。由于您始终有服务器，因此不需要在您的包中包含此信息，您的服务器可以在加载器中提供客户端环境变量。

1. **从根加载器返回 `ENV` 给客户端** - 在您的加载器内部，您可以访问服务器的环境变量。加载器仅在服务器上运行，并且永远不会打包到您的客户端 JavaScript 中。

   ```tsx lines=[3-6]
   export async function loader() {
     return json({
       ENV: {
         STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
         FAUNA_DB_URL: process.env.FAUNA_DB_URL,
       },
     });
   }

   export function Root() {
     return (
       <html lang="en">
         <head>
           <Meta />
           <Links />
         </head>
         <body>
           <Outlet />
           <Scripts />
         </body>
       </html>
     );
   }
   ```

2. **将 `ENV` 放在 window 上** - 这就是我们将值从服务器传递到客户端的方式。确保在 `<Scripts/>` 之前放置此内容。

   ```tsx lines=[10,19-25]
   export async function loader() {
     return json({
       ENV: {
         STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
       },
     });
   }

   export function Root() {
     const data = useLoaderData<typeof loader>();
     return (
       <html lang="en">
         <head>
           <Meta />
           <Links />
         </head>
         <body>
           <Outlet />
           <script
             dangerouslySetInnerHTML={{
               __html: `window.ENV = ${JSON.stringify(
                 data.ENV
               )}`,
             }}
           />
           <Scripts />
         </body>
       </html>
     );
   }
   ```

3. **访问这些值**

   ```tsx lines=[6-8]
   import { loadStripe } from "@stripe/stripe-js";

   export async function redirectToStripeCheckout(
     sessionId
   ) {
     const stripe = await loadStripe(
       window.ENV.STRIPE_PUBLIC_KEY
     );
     return stripe.redirectToCheckout({ sessionId });
   }
   ```

[dotenv]: https://www.npmjs.com/package/dotenv  
[netlify]: https://docs.netlify.com/configure-builds/environment-variables  
[fly-io]: https://fly.io/docs/reference/secrets  
[cloudflare-pages]: https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables  
[cloudflare-workers]: https://developers.cloudflare.com/workers/platform/environment-variables  
[vercel]: https://vercel.com/docs/environment-variables  
[architect]: https://arc.codes/docs/en/reference/cli/env  
[dev-vars]: https://developers.cloudflare.com/pages/functions/bindings/#interact-with-your-environment-variables-locally