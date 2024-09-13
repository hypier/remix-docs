"use strict";(self.webpackChunkremix_docs=self.webpackChunkremix_docs||[]).push([[2401],{3792:(r,e,n)=>{n.r(e),n.d(e,{assets:()=>i,contentTitle:()=>c,default:()=>l,frontMatter:()=>t,metadata:()=>d,toc:()=>a});var o=n(4848),s=n(8453);const t={title:"\u9519\u8bef\u8fb9\u754c"},c="ErrorBoundary",d={id:"route/error-boundary",title:"\u9519\u8bef\u8fb9\u754c",description:"Remix ErrorBoundary \u7ec4\u4ef6\u7684\u5de5\u4f5c\u65b9\u5f0f\u4e0e\u666e\u901a\u7684 React \u9519\u8bef\u8fb9\u754c \u76f8\u540c\uff0c\u4f46\u5177\u6709\u4e00\u4e9b\u989d\u5916\u7684\u529f\u80fd\u3002\u5f53\u60a8\u7684\u8def\u7531\u7ec4\u4ef6\u53d1\u751f\u9519\u8bef\u65f6\uff0cErrorBoundary \u5c06\u4f1a\u88ab\u6e32\u67d3\u5230\u5176\u4f4d\u7f6e\uff0c\u5d4c\u5957\u5728\u4efb\u4f55\u7236\u8def\u7531\u5185\u90e8\u3002ErrorBoundary \u7ec4\u4ef6\u5728\u8def\u7531\u7684 loader \u6216 action \u51fd\u6570\u53d1\u751f\u9519\u8bef\u65f6\u4e5f\u4f1a\u88ab\u6e32\u67d3\uff0c\u56e0\u6b64\u8be5\u8def\u7531\u7684\u6240\u6709\u9519\u8bef\u90fd\u53ef\u4ee5\u5728\u4e00\u4e2a\u5730\u65b9\u5904\u7406\u3002",source:"@site/docs/route/error-boundary.md",sourceDirName:"route",slug:"/route/error-boundary",permalink:"/docs/route/error-boundary",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/route/error-boundary.md",tags:[],version:"current",frontMatter:{title:"\u9519\u8bef\u8fb9\u754c"},sidebar:"tutorialSidebar",previous:{title:"\u7ec4\u4ef6",permalink:"/docs/route/component"},next:{title:"\u5904\u7406",permalink:"/docs/route/handle"}},i={},a=[];function u(r){const e={a:"a",code:"code",h1:"h1",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...r.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(e.header,{children:(0,o.jsx)(e.h1,{id:"errorboundary",children:(0,o.jsx)(e.code,{children:"ErrorBoundary"})})}),"\n",(0,o.jsxs)(e.p,{children:["Remix ",(0,o.jsx)(e.code,{children:"ErrorBoundary"})," \u7ec4\u4ef6\u7684\u5de5\u4f5c\u65b9\u5f0f\u4e0e\u666e\u901a\u7684 React ",(0,o.jsx)(e.a,{href:"https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary",children:"\u9519\u8bef\u8fb9\u754c"})," \u76f8\u540c\uff0c\u4f46\u5177\u6709\u4e00\u4e9b\u989d\u5916\u7684\u529f\u80fd\u3002\u5f53\u60a8\u7684\u8def\u7531\u7ec4\u4ef6\u53d1\u751f\u9519\u8bef\u65f6\uff0c",(0,o.jsx)(e.code,{children:"ErrorBoundary"})," \u5c06\u4f1a\u88ab\u6e32\u67d3\u5230\u5176\u4f4d\u7f6e\uff0c\u5d4c\u5957\u5728\u4efb\u4f55\u7236\u8def\u7531\u5185\u90e8\u3002",(0,o.jsx)(e.code,{children:"ErrorBoundary"})," \u7ec4\u4ef6\u5728\u8def\u7531\u7684 ",(0,o.jsx)(e.code,{children:"loader"})," \u6216 ",(0,o.jsx)(e.code,{children:"action"})," \u51fd\u6570\u53d1\u751f\u9519\u8bef\u65f6\u4e5f\u4f1a\u88ab\u6e32\u67d3\uff0c\u56e0\u6b64\u8be5\u8def\u7531\u7684\u6240\u6709\u9519\u8bef\u90fd\u53ef\u4ee5\u5728\u4e00\u4e2a\u5730\u65b9\u5904\u7406\u3002"]}),"\n",(0,o.jsx)(e.p,{children:"\u6700\u5e38\u89c1\u7684\u7528\u4f8b\u901a\u5e38\u662f\uff1a"}),"\n",(0,o.jsxs)(e.ul,{children:["\n",(0,o.jsxs)(e.li,{children:["\u60a8\u53ef\u80fd\u6545\u610f\u629b\u51fa 4xx ",(0,o.jsx)(e.code,{children:"Response"})," \u6765\u89e6\u53d1\u9519\u8bef UI","\n",(0,o.jsxs)(e.ul,{children:["\n",(0,o.jsx)(e.li,{children:"\u5728\u7528\u6237\u8f93\u5165\u9519\u8bef\u65f6\u629b\u51fa 400"}),"\n",(0,o.jsx)(e.li,{children:"\u5728\u672a\u7ecf\u6388\u6743\u8bbf\u95ee\u65f6\u629b\u51fa 401"}),"\n",(0,o.jsx)(e.li,{children:"\u5f53\u65e0\u6cd5\u627e\u5230\u8bf7\u6c42\u7684\u6570\u636e\u65f6\u629b\u51fa 404"}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(e.li,{children:["\u5982\u679c React \u5728\u6e32\u67d3\u8fc7\u7a0b\u4e2d\u9047\u5230\u8fd0\u884c\u65f6\u9519\u8bef\uff0c\u53ef\u80fd\u4f1a\u65e0\u610f\u4e2d\u629b\u51fa ",(0,o.jsx)(e.code,{children:"Error"})]}),"\n"]}),"\n",(0,o.jsxs)(e.p,{children:["\u8981\u83b7\u53d6\u629b\u51fa\u7684\u5bf9\u8c61\uff0c\u60a8\u53ef\u4ee5\u4f7f\u7528 ",(0,o.jsx)(e.a,{href:"../hooks/use-route-error",children:(0,o.jsx)(e.code,{children:"useRouteError"})})," \u94a9\u5b50\u3002\u5f53\u629b\u51fa ",(0,o.jsx)(e.code,{children:"Response"})," \u65f6\uff0c\u5b83\u4f1a\u81ea\u52a8\u89e3\u5305\u4e3a\u4e00\u4e2a\u5e26\u6709 ",(0,o.jsx)(e.code,{children:"state"}),"/",(0,o.jsx)(e.code,{children:"statusText"}),"/",(0,o.jsx)(e.code,{children:"data"})," \u5b57\u6bb5\u7684 ",(0,o.jsx)(e.code,{children:"ErrorResponse"})," \u5b9e\u4f8b\uff0c\u56e0\u6b64\u60a8\u65e0\u9700\u5728\u7ec4\u4ef6\u4e2d\u5904\u7406 ",(0,o.jsx)(e.code,{children:"await response.json()"}),"\u3002\u8981\u533a\u5206\u629b\u51fa\u7684 ",(0,o.jsx)(e.code,{children:"Response"})," \u548c\u629b\u51fa\u7684 ",(0,o.jsx)(e.code,{children:"Error"}),"\uff0c\u60a8\u53ef\u4ee5\u4f7f\u7528 ",(0,o.jsx)(e.a,{href:"../utils/is-route-error-response",children:(0,o.jsx)(e.code,{children:"isRouteErrorResponse"})})," \u5de5\u5177\u3002"]}),"\n",(0,o.jsx)(e.pre,{children:(0,o.jsx)(e.code,{className:"language-tsx",children:'import {\n  isRouteErrorResponse,\n  useRouteError,\n} from "@remix-run/react";\n\nexport function ErrorBoundary() {\n  const error = useRouteError();\n\n  if (isRouteErrorResponse(error)) {\n    return (\n      <div>\n        <h1>\n          {error.status} {error.statusText}\n        </h1>\n        <p>{error.data}</p>\n      </div>\n    );\n  } else if (error instanceof Error) {\n    return (\n      <div>\n        <h1>Error</h1>\n        <p>{error.message}</p>\n        <p>The stack trace is:</p>\n        <pre>{error.stack}</pre>\n      </div>\n    );\n  } else {\n    return <h1>Unknown Error</h1>;\n  }\n}\n'})})]})}function l(r={}){const{wrapper:e}={...(0,s.R)(),...r.components};return e?(0,o.jsx)(e,{...r,children:(0,o.jsx)(u,{...r})}):u(r)}},8453:(r,e,n)=>{n.d(e,{R:()=>c,x:()=>d});var o=n(6540);const s={},t=o.createContext(s);function c(r){const e=o.useContext(t);return o.useMemo((function(){return"function"==typeof r?r(e):{...e,...r}}),[e,r])}function d(r){let e;return e=r.disableParentContext?"function"==typeof r.components?r.components(s):r.components||s:c(r.components),o.createElement(t.Provider,{value:e},r.children)}}}]);