---
title: TypeScript
toc: false
---

# TypeScript

Remix 无缝支持 JavaScript 和 TypeScript。如果您将文件命名为 `.ts` 或 `.tsx` 扩展名，它将视为 TypeScript（`.tsx` 是用于包含 [with JSX][with-jsx] 的 TypeScript 文件）。但这并不是必需的。如果您不想使用 TypeScript，可以将所有文件写为 `.js` 文件。

Remix CLI 不会执行任何类型检查。相反，您需要自己使用 TypeScript 的 `tsc` CLI。一个常见的解决方案是在您的 package.json 中添加一个 `typecheck` 脚本：

```json filename=package.json lines=[10]
{
  "name": "remix-app",
  "private": true,
  "sideEffects": false,
  "scripts": {
    "build": "remix vite:build",
    "dev": "remix vite:dev",
    "lint": "eslint --ignore-path .gitignore .",
    "start": "remix-serve ./build/index.js",
    "typecheck": "tsc"
  },
  "dependencies": {
    "@remix-run/node": "latest",
    "@remix-run/react": "latest",
    "@remix-run/serve": "latest",
    "isbot": "^4.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@remix-run/dev": "latest",
    "@types/react": "^18.2.20",
    "@types/react-dom": "^18.2.7",
    "eslint": "^8.23.1",
    "typescript": "^5.1.6",
    "vite": "^5.1.4"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

然后，您可以将该脚本作为持续集成的一部分与测试一起运行。

Remix 还内置了 TypeScript 类型定义。例如，启动模板会创建一个 `tsconfig.json` 文件，其中包含 Remix 和 Vite 所需的类型：

```json filename=tsconfig.json lines=[12]
{
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/.server/**/*.ts",
    "**/.server/**/*.tsx",
    "**/.client/**/*.ts",
    "**/.client/**/*.tsx"
  ],
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "types": ["@remix-run/node", "vite/client"],
    "isolatedModules": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "target": "ES2022",
    "strict": true,
    "allowJs": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["./app/*"]
    },

    // Vite 负责构建所有内容，而不是 tsc。
    "noEmit": true
  }
}
```

<docs-info>请注意，`types` 数组中引用的类型将取决于您运行应用程序的环境。例如，在 Cloudflare 中可用的全局变量是不同的。</docs-info>

[with-jsx]: https://www.typescriptlang.org/docs/handbook/jsx.html