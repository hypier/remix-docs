---
title: 预设
---

# 预设

[Remix Vite 插件][remix-vite] 支持 `presets` 选项，以便与其他工具和托管提供商的集成更加简便。

预设只能做两件事：

- 代表您配置 Remix Vite 插件。
- 验证解析的配置。

每个预设返回的配置按照定义的顺序合并。任何直接传递给 Remix Vite 插件的配置将最后合并。这意味着用户配置将始终优先于任何预设。

## 创建预设

预设符合以下 `Preset` 类型：

```ts
type Preset = {
  name: string;

  remixConfig?: (args: {
    remixUserConfig: VitePluginConfig;
  }) => RemixConfigPreset | Promise<RemixConfigPreset>;

  remixConfigResolved?: (args: {
    remixConfig: ResolvedVitePluginConfig;
  }) => void | Promise<void>;
};
```

### 定义预设配置

作为一个基本示例，让我们创建一个配置 [server bundles function][server-bundles] 的预设：

```ts filename=my-cool-preset.ts
import type { Preset } from "@remix-run/dev";

export function myCoolPreset(): Preset {
  return {
    name: "my-cool-preset",
    remixConfig: () => ({
      serverBundles: ({ branch }) => {
        const isAuthenticatedRoute = branch.some((route) =>
          route.id.split("/").includes("_authenticated")
        );

        return isAuthenticatedRoute
          ? "authenticated"
          : "unauthenticated";
      },
    }),
  };
}
```

### 验证配置

重要的是要记住，其他预设和用户配置仍然可以覆盖从您的预设返回的值。

在我们的示例预设中，`serverBundles` 函数可能会被不同的、冲突的实现覆盖。如果我们想验证最终解析的配置是否包含我们预设的 `serverBundles` 函数，可以使用 `remixConfigResolved` 钩子来实现：

```ts filename=my-cool-preset.ts lines=[22-26]
import type {
  Preset,
  ServerBundlesFunction,
} from "@remix-run/dev";

const serverBundles: ServerBundlesFunction = ({
  branch,
}) => {
  const isAuthenticatedRoute = branch.some((route) =>
    route.id.split("/").includes("_authenticated")
  );

  return isAuthenticatedRoute
    ? "authenticated"
    : "unauthenticated";
};

export function myCoolPreset(): Preset {
  return {
    name: "my-cool-preset",
    remixConfig: () => ({ serverBundles }),
    remixConfigResolved: ({ remixConfig }) => {
      if (remixConfig.serverBundles !== serverBundles) {
        throw new Error("`serverBundles` was overridden!");
      }
    },
  };
}
```

`remixConfigResolved` 钩子应仅在合并或覆盖您的预设配置会导致错误的情况下使用。

## 使用预设

预设旨在发布到 npm 并在您的 Vite 配置中使用。

```ts filename=vite.config.ts lines=[3,8]
import { vitePlugin as remix } from "@remix-run/dev";
import { myCoolPreset } from "remix-preset-cool";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      presets: [myCoolPreset()],
    }),
  ],
});
```

[remix-vite]: ./vite  
[server-bundles]: ./server-bundles