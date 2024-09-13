"use strict";(self.webpackChunkremix_docs=self.webpackChunkremix_docs||[]).push([[3447],{8937:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>h,frontMatter:()=>i,metadata:()=>o,toc:()=>l});var t=s(4848),r=s(8453);const i={title:"useNavigate"},a="useNavigate",o={id:"hooks/use-navigate",title:"useNavigate",description:"useNavigate \u94a9\u5b50\u8fd4\u56de\u4e00\u4e2a\u51fd\u6570\uff0c\u5141\u8bb8\u60a8\u6839\u636e\u7528\u6237\u4ea4\u4e92\u6216\u6548\u679c\u5728\u6d4f\u89c8\u5668\u4e2d\u4ee5\u7f16\u7a0b\u65b9\u5f0f\u5bfc\u822a\u3002",source:"@site/docs/hooks/use-navigate.md",sourceDirName:"hooks",slug:"/hooks/use-navigate",permalink:"/docs/hooks/use-navigate",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/hooks/use-navigate.md",tags:[],version:"current",frontMatter:{title:"useNavigate"},sidebar:"tutorialSidebar",previous:{title:"useMatches",permalink:"/docs/hooks/use-matches"},next:{title:"useNavigationType",permalink:"/docs/hooks/use-navigation-type"}},c={},l=[{value:"\u53c2\u6570",id:"\u53c2\u6570",level:2},{value:"<code>to: string</code>",id:"to-string",level:3},{value:"<code>to: Partial&lt;Path&gt;</code>",id:"to-partialpath",level:3},{value:"<code>to: Number</code>",id:"to-number",level:3},{value:"<code>options</code>",id:"options",level:3}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"usenavigate",children:(0,t.jsx)(n.code,{children:"useNavigate"})})}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"useNavigate"})," \u94a9\u5b50\u8fd4\u56de\u4e00\u4e2a\u51fd\u6570\uff0c\u5141\u8bb8\u60a8\u6839\u636e\u7528\u6237\u4ea4\u4e92\u6216\u6548\u679c\u5728\u6d4f\u89c8\u5668\u4e2d\u4ee5\u7f16\u7a0b\u65b9\u5f0f\u5bfc\u822a\u3002"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",children:'import { useNavigate } from "@remix-run/react";\n\nfunction SomeComponent() {\n  const navigate = useNavigate();\n  return (\n    <button\n      onClick={() => {\n        navigate(-1);\n      }}\n    />\n  );\n}\n'})}),"\n",(0,t.jsxs)(n.p,{children:["\u5728 ",(0,t.jsx)(n.a,{href:"../route/action",children:(0,t.jsx)(n.code,{children:"action"})})," \u548c ",(0,t.jsx)(n.a,{href:"../route/loader",children:(0,t.jsx)(n.code,{children:"loader"})})," \u4e2d\uff0c\u4f7f\u7528 ",(0,t.jsx)(n.a,{href:"../utils/redirect",children:(0,t.jsx)(n.code,{children:"redirect"})})," \u901a\u5e38\u6bd4\u8fd9\u4e2a\u94a9\u5b50\u66f4\u597d\uff0c\u4f46\u5b83\u4ecd\u7136\u6709\u5176\u4f7f\u7528\u573a\u666f\u3002"]}),"\n",(0,t.jsx)(n.h2,{id:"\u53c2\u6570",children:"\u53c2\u6570"}),"\n",(0,t.jsx)(n.h3,{id:"to-string",children:(0,t.jsx)(n.code,{children:"to: string"})}),"\n",(0,t.jsx)(n.p,{children:"\u6700\u57fa\u672c\u7684\u7528\u6cd5\u662f\u4f7f\u7528 href \u5b57\u7b26\u4e32\uff1a"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",children:'navigate("/some/path");\n'})}),"\n",(0,t.jsx)(n.p,{children:"\u8def\u5f84\u53ef\u4ee5\u662f\u76f8\u5bf9\u7684\uff1a"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",children:'navigate("..");\nnavigate("../other/path");\n'})}),"\n",(0,t.jsxs)("docs-info",{children:["\u8bf7\u53c2\u9605 ",(0,t.jsx)(n.code,{children:"useResolvedPath"})," \u6587\u6863\u4e2d\u5173\u4e8e ",(0,t.jsx)(n.code,{children:"future.v3_relativeSplatPath"})," \u672a\u6765\u6807\u5fd7\u5728\u6591\u70b9\u8def\u7531\u4e2d\u5bf9\u76f8\u5bf9 ",(0,t.jsx)(n.code,{children:"useNavigate()"})," \u884c\u4e3a\u7684\u8bf4\u660e\uff0c\u89c1",(0,t.jsx)(n.a,{href:"./use-resolved-path#splat-paths",children:"Splat Paths"}),"\u90e8\u5206"]}),"\n",(0,t.jsx)(n.h3,{id:"to-partialpath",children:(0,t.jsx)(n.code,{children:"to: Partial<Path>"})}),"\n",(0,t.jsxs)(n.p,{children:["\u60a8\u8fd8\u53ef\u4ee5\u4f20\u9012\u4e00\u4e2a ",(0,t.jsx)(n.code,{children:"Partial<Path>"})," \u503c\uff1a"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",children:'navigate({\n  pathname: "/some/path",\n  search: "?query=string",\n  hash: "#hash",\n});\n'})}),"\n",(0,t.jsx)(n.h3,{id:"to-number",children:(0,t.jsx)(n.code,{children:"to: Number"})}),"\n",(0,t.jsx)(n.p,{children:"\u4f20\u5165\u4e00\u4e2a\u6570\u5b57\u5c06\u544a\u8bc9\u6d4f\u89c8\u5668\u5728\u5386\u53f2\u8bb0\u5f55\u6808\u4e2d\u5411\u524d\u6216\u5411\u540e\u79fb\u52a8\uff1a"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",children:"navigate(-1); // go back\nnavigate(1); // go forward\nnavigate(-2); // go back two\n"})}),"\n",(0,t.jsx)(n.p,{children:"\u8bf7\u6ce8\u610f\uff0c\u8fd9\u53ef\u80fd\u4f1a\u4f7f\u60a8\u79bb\u5f00\u5e94\u7528\u7a0b\u5e8f\uff0c\u56e0\u4e3a\u6d4f\u89c8\u5668\u7684\u5386\u53f2\u8bb0\u5f55\u6808\u5e76\u4e0d\u5c40\u9650\u4e8e\u60a8\u7684\u5e94\u7528\u7a0b\u5e8f\u3002"}),"\n",(0,t.jsx)(n.h3,{id:"options",children:(0,t.jsx)(n.code,{children:"options"})}),"\n",(0,t.jsx)(n.p,{children:"\u7b2c\u4e8c\u4e2a\u53c2\u6570\u662f\u4e00\u4e2a\u9009\u9879\u5bf9\u8c61\uff1a"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",children:'navigate(".", {\n  replace: true,\n  relative: "path",\n  state: { some: "state" },\n});\n'})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"replace"}),": boolean - \u66ff\u6362\u5386\u53f2\u5806\u6808\u4e2d\u7684\u5f53\u524d\u6761\u76ee\uff0c\u800c\u4e0d\u662f\u63a8\u9001\u4e00\u4e2a\u65b0\u7684\u6761\u76ee"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"relative"}),": ",(0,t.jsx)(n.code,{children:'"route" | "path"'})," - \u5b9a\u4e49\u94fe\u63a5\u7684\u76f8\u5bf9\u8def\u5f84\u884c\u4e3a","\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:'"route"'})," \u5c06\u4f7f\u7528\u8def\u7531\u5c42\u7ea7\uff0c\u56e0\u6b64 ",(0,t.jsx)(n.code,{children:'".."'})," \u5c06\u79fb\u9664\u5f53\u524d\u8def\u7531\u6a21\u5f0f\u7684\u6240\u6709 URL \u6bb5\uff0c\u800c ",(0,t.jsx)(n.code,{children:'"path"'})," \u5c06\u4f7f\u7528 URL \u8def\u5f84\uff0c\u56e0\u6b64 ",(0,t.jsx)(n.code,{children:'".."'})," \u5c06\u79fb\u9664\u4e00\u4e2a URL \u6bb5"]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"state"}),": any - \u5c06\u6301\u4e45\u7684\u5ba2\u6237\u7aef\u8def\u7531\u72b6\u6001\u6dfb\u52a0\u5230\u4e0b\u4e00\u4e2a\u4f4d\u7f6e"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"preventScrollReset"}),": boolean - \u5982\u679c\u60a8\u4f7f\u7528 ",(0,t.jsx)(n.a,{href:"../components/scroll-restoration#preventing-scroll-reset",children:(0,t.jsx)(n.code,{children:"<ScrollRestoration>"})}),"\uff0c\u5728\u5bfc\u822a\u65f6\u9632\u6b62\u6eda\u52a8\u4f4d\u7f6e\u91cd\u7f6e\u5230\u7a97\u53e3\u9876\u90e8"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"unstable_flushSync"}),": boolean - \u5c06\u6b64\u5bfc\u822a\u7684\u521d\u59cb\u72b6\u6001\u66f4\u65b0\u5305\u88c5\u5728 ",(0,t.jsx)(n.a,{href:"https://react.dev/reference/react-dom/flushSync",children:(0,t.jsx)(n.code,{children:"ReactDOM.flushSync"})})," \u8c03\u7528\u4e2d\uff0c\u800c\u4e0d\u662f\u9ed8\u8ba4\u7684 ",(0,t.jsx)(n.a,{href:"https://react.dev/reference/react/startTransition",children:(0,t.jsx)(n.code,{children:"React.startTransition"})})]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"unstable_viewTransition"}),": boolean - \u901a\u8fc7\u5c06\u6700\u7ec8\u72b6\u6001\u66f4\u65b0\u5305\u88c5\u5728 ",(0,t.jsx)(n.code,{children:"document.startViewTransition()"})," \u4e2d\uff0c\u4e3a\u6b64\u5bfc\u822a\u542f\u7528 ",(0,t.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API",children:"View Transition"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\u5982\u679c\u60a8\u9700\u8981\u4e3a\u6b64\u89c6\u56fe\u8fc7\u6e21\u5e94\u7528\u7279\u5b9a\u6837\u5f0f\uff0c\u60a8\u8fd8\u9700\u8981\u5229\u7528 ",(0,t.jsx)(n.a,{href:"../hooks//use-view-transition-state",children:(0,t.jsx)(n.code,{children:"unstable_useViewTransitionState()"})})]}),"\n"]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>a,x:()=>o});var t=s(6540);const r={},i=t.createContext(r);function a(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),t.createElement(i.Provider,{value:n},e.children)}}}]);