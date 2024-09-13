"use strict";(self.webpackChunkremix_docs=self.webpackChunkremix_docs||[]).push([[4429],{113:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>i,contentTitle:()=>s,default:()=>h,frontMatter:()=>c,metadata:()=>d,toc:()=>a});var o=t(4848),r=t(8453);const c={title:"\u884c\u52a8"},s="action",d={id:"route/action",title:"\u884c\u52a8",description:"\u89c2\u770b\ud83d\udcfc Remix Singles\uff1a\u6570\u636e\u53d8\u66f4\u4e0e\u8868\u5355 + action\u548c\u591a\u4e2a\u8868\u5355\u548c\u5355\u6309\u94ae\u53d8\u66f4",source:"@site/docs/route/action.md",sourceDirName:"route",slug:"/route/action",permalink:"/docs/route/action",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/route/action.md",tags:[],version:"current",frontMatter:{title:"\u884c\u52a8"},sidebar:"tutorialSidebar",previous:{title:"\u8def\u7531\u6a21\u5757",permalink:"/docs/category/\u8def\u7531\u6a21\u5757"},next:{title:"\u5ba2\u6237\u7aef\u64cd\u4f5c",permalink:"/docs/route/client-action"}},i={},a=[];function l(e){const n={a:"a",code:"code",em:"em",h1:"h1",header:"header",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.header,{children:(0,o.jsx)(n.h1,{id:"action",children:(0,o.jsx)(n.code,{children:"action"})})}),"\n",(0,o.jsxs)("docs-success",{children:["\u89c2\u770b",(0,o.jsx)("a",{href:"https://www.youtube.com/playlist?list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6",children:"\ud83d\udcfc Remix Singles"}),"\uff1a",(0,o.jsx)("a",{href:"https://www.youtube.com/watch?v=Iv25HAHaFDs&list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6",children:"\u6570\u636e\u53d8\u66f4\u4e0e\u8868\u5355 + action"}),"\u548c",(0,o.jsx)("a",{href:"https://www.youtube.com/watch?v=w2i-9cYxSdc&list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6",children:"\u591a\u4e2a\u8868\u5355\u548c\u5355\u6309\u94ae\u53d8\u66f4"})]}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"action"})," \u8def\u7531\u662f\u4e00\u4e2a\u4ec5\u5728\u670d\u52a1\u5668\u4e0a\u8fd0\u884c\u7684\u51fd\u6570\uff0c\u7528\u4e8e\u5904\u7406\u6570\u636e\u53d8\u66f4\u548c\u5176\u4ed6\u64cd\u4f5c\u3002\u5982\u679c\u5bf9\u4f60\u7684\u8def\u7531\u53d1\u51fa\u975e ",(0,o.jsx)(n.code,{children:"GET"})," \u8bf7\u6c42\uff08",(0,o.jsx)(n.code,{children:"DELETE"}),"\u3001",(0,o.jsx)(n.code,{children:"PATCH"}),"\u3001",(0,o.jsx)(n.code,{children:"POST"})," \u6216 ",(0,o.jsx)(n.code,{children:"PUT"}),"\uff09\uff0c\u5219\u5728\u8c03\u7528 ",(0,o.jsx)(n.a,{href:"./loader",children:(0,o.jsx)(n.code,{children:"loader"})})," \u4e4b\u524d\u4f1a\u8c03\u7528 action\u3002"]}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.code,{children:"action"})," \u7684 API \u4e0e ",(0,o.jsx)(n.code,{children:"loader"})," \u76f8\u540c\uff0c\u552f\u4e00\u7684\u533a\u522b\u5728\u4e8e\u5b83\u4eec\u7684\u8c03\u7528\u65f6\u673a\u3002\u8fd9\u4f7f\u4f60\u80fd\u591f\u5c06\u6570\u636e\u96c6\u7684\u6240\u6709\u5185\u5bb9\u96c6\u4e2d\u5728\u4e00\u4e2a\u8def\u7531\u6a21\u5757\u4e2d\uff1a\u8bfb\u53d6\u7684\u6570\u636e\u3001\u6e32\u67d3\u6570\u636e\u7684\u7ec4\u4ef6\u548c\u5199\u5165\u6570\u636e\u7684\u64cd\u4f5c\uff1a"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",children:'import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno\nimport { json, redirect } from "@remix-run/node"; // or cloudflare/deno\nimport { Form } from "@remix-run/react";\n\nimport { TodoList } from "~/components/TodoList";\nimport { fakeCreateTodo, fakeGetTodos } from "~/utils/db";\n\nexport async function action({\n  request,\n}: ActionFunctionArgs) {\n  const body = await request.formData();\n  const todo = await fakeCreateTodo({\n    title: body.get("title"),\n  });\n  return redirect(`/todos/${todo.id}`);\n}\n\nexport async function loader() {\n  return json(await fakeGetTodos());\n}\n\nexport default function Todos() {\n  const data = useLoaderData<typeof loader>();\n  return (\n    <div>\n      <TodoList todos={data} />\n      <Form method="post">\n        <input type="text" name="title" />\n        <button type="submit">\u521b\u5efa Todo</button>\n      </Form>\n    </div>\n  );\n}\n'})}),"\n",(0,o.jsxs)(n.p,{children:["\u5f53\u5bf9\u4e00\u4e2a URL \u53d1\u51fa ",(0,o.jsx)(n.code,{children:"POST"})," \u8bf7\u6c42\u65f6\uff0c\u4f60\u7684\u8def\u7531\u5c42\u6b21\u7ed3\u6784\u4e2d\u7684\u591a\u4e2a\u8def\u7531\u5c06\u5339\u914d\u8be5 URL\u3002\u4e0e\u5bf9 loaders \u53d1\u51fa\u7684 ",(0,o.jsx)(n.code,{children:"GET"})," \u8bf7\u6c42\u4e0d\u540c\uff0c\u5728\u8fd9\u79cd\u60c5\u51b5\u4e0b\uff0c",(0,o.jsx)(n.em,{children:"\u4ec5\u8c03\u7528\u4e00\u4e2a action"}),"\u3002"]}),"\n",(0,o.jsx)("docs-info",{children:"\u88ab\u8c03\u7528\u7684\u8def\u7531\u5c06\u662f\u6700\u6df1\u5c42\u7684\u5339\u914d\u8def\u7531\uff0c\u9664\u975e\u6700\u6df1\u5c42\u7684\u5339\u914d\u8def\u7531\u662f\u201c\u7d22\u5f15\u8def\u7531\u201d\u3002\u5728\u8fd9\u79cd\u60c5\u51b5\u4e0b\uff0c\u5b83\u5c06\u5411\u7d22\u5f15\u7684\u7236\u8def\u7531\u53d1\u9001\u8bf7\u6c42\uff08\u56e0\u4e3a\u5b83\u4eec\u5171\u4eab\u76f8\u540c\u7684 URL\uff0c\u7236\u8def\u7531\u4f18\u5148\uff09\u3002"}),"\n",(0,o.jsxs)(n.p,{children:["\u5982\u679c\u4f60\u60f3\u5411\u7d22\u5f15\u8def\u7531\u53d1\u9001\u8bf7\u6c42\uff0c\u8bf7\u5728 action \u4e2d\u4f7f\u7528 ",(0,o.jsx)(n.code,{children:"?index"}),"\uff1a",(0,o.jsx)(n.code,{children:'<Form action="/accounts?index" method="post" />'})]}),"\n",(0,o.jsxs)(n.table,{children:[(0,o.jsx)(n.thead,{children:(0,o.jsxs)(n.tr,{children:[(0,o.jsx)(n.th,{children:"action url"}),(0,o.jsx)(n.th,{children:"route action"})]})}),(0,o.jsxs)(n.tbody,{children:[(0,o.jsxs)(n.tr,{children:[(0,o.jsx)(n.td,{children:(0,o.jsx)(n.code,{children:"/accounts?index"})}),(0,o.jsx)(n.td,{children:(0,o.jsx)(n.code,{children:"app/routes/accounts._index.tsx"})})]}),(0,o.jsxs)(n.tr,{children:[(0,o.jsx)(n.td,{children:(0,o.jsx)(n.code,{children:"/accounts"})}),(0,o.jsx)(n.td,{children:(0,o.jsx)(n.code,{children:"app/routes/accounts.tsx"})})]})]})]}),"\n",(0,o.jsxs)(n.p,{children:["\u8fd8\u8981\u6ce8\u610f\uff0c\u6ca1\u6709 action \u5c5e\u6027\u7684\u8868\u5355 (",(0,o.jsx)(n.code,{children:'<Form method="post">'}),") \u5c06\u81ea\u52a8\u5411\u5176\u6e32\u67d3\u7684\u540c\u4e00\u8def\u7531\u53d1\u9001\u8bf7\u6c42\uff0c\u56e0\u6b64\u4f7f\u7528 ",(0,o.jsx)(n.code,{children:"?index"})," \u53c2\u6570\u6765\u533a\u5206\u7236\u8def\u7531\u548c\u7d22\u5f15\u8def\u7531\u4ec5\u5728\u4f60\u4ece\u7d22\u5f15\u8def\u7531\u4ee5\u5916\u7684\u5730\u65b9\u5411\u7d22\u5f15\u8def\u7531\u53d1\u9001\u8bf7\u6c42\u65f6\u624d\u6709\u7528\u3002\u5982\u679c\u4f60\u4ece\u7d22\u5f15\u8def\u7531\u5411\u5176\u81ea\u8eab\u53d1\u9001\u8bf7\u6c42\uff0c\u6216\u8005\u4ece\u7236\u8def\u7531\u5411\u5176\u81ea\u8eab\u53d1\u9001\u8bf7\u6c42\uff0c\u5219\u6839\u672c\u4e0d\u9700\u8981\u5b9a\u4e49 ",(0,o.jsx)(n.code,{children:"<Form action>"}),"\uff0c\u53ea\u9700\u7701\u7565\u5b83\uff1a",(0,o.jsx)(n.code,{children:'<Form method="post">'}),"\u3002"]}),"\n",(0,o.jsx)(n.p,{children:"\u53e6\u89c1\uff1a"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.a,{href:"../components/form",children:(0,o.jsx)(n.code,{children:"<Form>"})})}),"\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.a,{href:"../components/form#action",children:(0,o.jsx)(n.code,{children:"<Form action>"})})}),"\n",(0,o.jsx)(n.li,{children:(0,o.jsxs)(n.a,{href:"../guides/index-query-param",children:[(0,o.jsx)(n.code,{children:"?index"})," \u67e5\u8be2\u53c2\u6570"]})}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(l,{...e})}):l(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>d});var o=t(6540);const r={},c=o.createContext(r);function s(e){const n=o.useContext(c);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),o.createElement(c.Provider,{value:n},e.children)}}}]);