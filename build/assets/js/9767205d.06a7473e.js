"use strict";(self.webpackChunkremix_docs=self.webpackChunkremix_docs||[]).push([[4199],{8178:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>i,metadata:()=>o,toc:()=>d});var r=s(4848),t=s(8453);const i={title:"useSubmit"},c="useSubmit",o={id:"hooks/use-submit",title:"useSubmit",description:"`` \u7684\u547d\u4ee4\u5f0f\u7248\u672c\uff0c\u8ba9\u4f60\uff0c\u7a0b\u5e8f\u5458\uff0c\u53ef\u4ee5\u4ee3\u66ff\u7528\u6237\u63d0\u4ea4\u8868\u5355\u3002",source:"@site/docs/hooks/use-submit.md",sourceDirName:"hooks",slug:"/hooks/use-submit",permalink:"/docs/hooks/use-submit",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/hooks/use-submit.md",tags:[],version:"current",frontMatter:{title:"useSubmit"},sidebar:"tutorialSidebar",previous:{title:"useSearchParams",permalink:"/docs/hooks/use-search-params"},next:{title:"unstable_useViewTransitionState",permalink:"/docs/hooks/use-view-transition-state"}},l={},d=[{value:"\u7b7e\u540d",id:"\u7b7e\u540d",level:2},{value:"<code>targetOrData</code>",id:"targetordata",level:3},{value:"<code>options</code>",id:"options",level:3},{value:"\u5176\u4ed6\u8d44\u6e90",id:"\u5176\u4ed6\u8d44\u6e90",level:2}];function a(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"usesubmit",children:(0,r.jsx)(n.code,{children:"useSubmit"})})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"<Form>"})," \u7684\u547d\u4ee4\u5f0f\u7248\u672c\uff0c\u8ba9\u4f60\uff0c\u7a0b\u5e8f\u5458\uff0c\u53ef\u4ee5\u4ee3\u66ff\u7528\u6237\u63d0\u4ea4\u8868\u5355\u3002"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:'import { useSubmit } from "@remix-run/react";\n\nfunction SomeComponent() {\n  const submit = useSubmit();\n  return (\n    <Form\n      onChange={(event) => {\n        submit(event.currentTarget);\n      }}\n    />\n  );\n}\n'})}),"\n",(0,r.jsx)(n.h2,{id:"\u7b7e\u540d",children:"\u7b7e\u540d"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:"submit(targetOrData, options);\n"})}),"\n",(0,r.jsx)(n.h3,{id:"targetordata",children:(0,r.jsx)(n.code,{children:"targetOrData"})}),"\n",(0,r.jsx)(n.p,{children:"\u53ef\u4ee5\u662f\u4ee5\u4e0b\u4efb\u610f\u4e00\u79cd\uff1a"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsxs)(n.strong,{children:[(0,r.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement",children:(0,r.jsx)(n.code,{children:"HTMLFormElement"})})," \u5b9e\u4f8b"]})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:"<Form\n  onSubmit={(event) => {\n    submit(event.currentTarget);\n  }}\n/>\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsxs)(n.strong,{children:[(0,r.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/FormData",children:(0,r.jsx)(n.code,{children:"FormData"})})," \u5b9e\u4f8b"]})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:'const formData = new FormData();\nformData.append("myKey", "myValue");\nsubmit(formData, { method: "post" });\n'})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsxs)(n.strong,{children:["\u5c06\u88ab\u5e8f\u5217\u5316\u4e3a ",(0,r.jsx)(n.code,{children:"FormData"})," \u7684\u666e\u901a\u5bf9\u8c61"]})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:'submit({ myKey: "myValue" }, { method: "post" });\n'})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u5c06\u88ab\u5e8f\u5217\u5316\u4e3a JSON \u7684\u666e\u901a\u5bf9\u8c61"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:'submit(\n  { myKey: "myValue" },\n  { method: "post", encType: "application/json" }\n);\n'})}),"\n",(0,r.jsx)(n.h3,{id:"options",children:(0,r.jsx)(n.code,{children:"options"})}),"\n",(0,r.jsxs)(n.p,{children:["\u63d0\u4ea4\u7684\u9009\u9879\uff0c\u4e0e ",(0,r.jsx)(n.a,{href:"../components/form",children:(0,r.jsx)(n.code,{children:"<Form>"})})," \u5c5e\u6027\u76f8\u540c\u3002\u6240\u6709\u9009\u9879\u90fd\u662f\u53ef\u9009\u7684\u3002"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"action"}),": \u63d0\u4ea4\u7684 href\u3002\u9ed8\u8ba4\u662f\u5f53\u524d\u8def\u7531\u8def\u5f84\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"method"}),": \u4f7f\u7528\u7684 HTTP \u65b9\u6cd5\uff0c\u5982 POST\uff0c\u9ed8\u8ba4\u662f GET\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"encType"}),": \u8868\u5355\u63d0\u4ea4\u4f7f\u7528\u7684\u7f16\u7801\u7c7b\u578b\uff1a",(0,r.jsx)(n.code,{children:"application/x-www-form-urlencoded"}),"\u3001",(0,r.jsx)(n.code,{children:"multipart/form-data"}),"\u3001",(0,r.jsx)(n.code,{children:"application/json"})," \u6216 ",(0,r.jsx)(n.code,{children:"text/plain"}),"\u3002\u9ed8\u8ba4\u662f ",(0,r.jsx)(n.code,{children:"application/x-www-form-urlencoded"}),"\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"navigate"}),": \u6307\u5b9a\u4e3a ",(0,r.jsx)(n.code,{children:"false"})," \u4ee5\u4f7f\u7528 fetcher \u63d0\u4ea4\uff0c\u800c\u4e0d\u662f\u8fdb\u884c\u5bfc\u822a\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"fetcherKey"}),": \u4f7f\u7528 fetcher \u63d0\u4ea4\u65f6\u7684 fetcher \u952e\uff0c\u9700\u901a\u8fc7 ",(0,r.jsx)(n.code,{children:"navigate: false"}),"\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"preventScrollReset"}),": \u9632\u6b62\u5728\u63d0\u4ea4\u6570\u636e\u65f6\u6eda\u52a8\u4f4d\u7f6e\u91cd\u7f6e\u5230\u7a97\u53e3\u9876\u90e8\u3002\u9ed8\u8ba4\u662f ",(0,r.jsx)(n.code,{children:"false"}),"\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"replace"}),": \u66ff\u6362\u5386\u53f2\u5806\u6808\u4e2d\u7684\u5f53\u524d\u6761\u76ee\uff0c\u800c\u4e0d\u662f\u63a8\u9001\u65b0\u6761\u76ee\u3002\u9ed8\u8ba4\u662f ",(0,r.jsx)(n.code,{children:"false"}),"\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"relative"}),": \u5b9a\u4e49\u76f8\u5bf9\u8def\u7531\u89e3\u6790\u884c\u4e3a\u3002\u53ef\u4ee5\u662f ",(0,r.jsx)(n.code,{children:'"route"'}),"\uff08\u76f8\u5bf9\u4e8e\u8def\u7531\u5c42\u6b21\uff09\u6216 ",(0,r.jsx)(n.code,{children:'"path"'}),"\uff08\u76f8\u5bf9\u4e8e URL\uff09\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"unstable_flushSync"}),": \u5c06\u6b64\u5bfc\u822a\u7684\u521d\u59cb\u72b6\u6001\u66f4\u65b0\u5305\u88c5\u5728 ",(0,r.jsx)(n.a,{href:"https://react.dev/reference/react-dom/flushSync",children:(0,r.jsx)(n.code,{children:"ReactDOM.flushSync"})})," \u8c03\u7528\u4e2d\uff0c\u800c\u4e0d\u662f\u9ed8\u8ba4\u7684 ",(0,r.jsx)(n.a,{href:"https://react.dev/reference/react/startTransition",children:(0,r.jsx)(n.code,{children:"React.startTransition"})}),"\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"unstable_viewTransition"}),": \u901a\u8fc7\u5c06\u6700\u7ec8\u72b6\u6001\u66f4\u65b0\u5305\u88c5\u5728 ",(0,r.jsx)(n.code,{children:"document.startViewTransition()"})," \u4e2d\uff0c\u4e3a\u6b64\u5bfc\u822a\u542f\u7528 ",(0,r.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API",children:"\u89c6\u56fe\u8fc7\u6e21"}),"\u3002","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\u5982\u679c\u60a8\u9700\u8981\u4e3a\u6b64\u89c6\u56fe\u8fc7\u6e21\u5e94\u7528\u7279\u5b9a\u6837\u5f0f\uff0c\u60a8\u8fd8\u9700\u8981\u5229\u7528 ",(0,r.jsx)(n.a,{href:"../hooks//use-view-transition-state",children:(0,r.jsx)(n.code,{children:"unstable_useViewTransitionState()"})}),"\u3002"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:'submit(data, {\n  action: "",\n  method: "post",\n  encType: "application/x-www-form-urlencoded",\n  preventScrollReset: false,\n  replace: false,\n  relative: "route",\n});\n'})}),"\n",(0,r.jsxs)("docs-info",{children:["\u6709\u5173 ",(0,r.jsx)(n.code,{children:"useResolvedPath"})," \u6587\u6863\u4e2d ",(0,r.jsx)(n.code,{children:"future.v3_relativeSplatPath"})," \u672a\u6765\u6807\u5fd7\u5728 splat \u8def\u7531\u5185\u76f8\u5bf9 ",(0,r.jsx)(n.code,{children:"useSubmit()"})," \u884c\u4e3a\u7684\u8bf4\u660e\uff0c\u8bf7\u53c2\u89c1 ",(0,r.jsx)(n.a,{href:"./use-resolved-path#splat-paths",children:"Splat Paths"})," \u90e8\u5206\u3002"]}),"\n",(0,r.jsx)(n.h2,{id:"\u5176\u4ed6\u8d44\u6e90",children:"\u5176\u4ed6\u8d44\u6e90"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u8ba8\u8bba"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"../discussion/form-vs-fetcher",children:"\u8868\u5355\u4e0e\u83b7\u53d6\u5668"})}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u76f8\u5173 API"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"../components/form",children:(0,r.jsx)(n.code,{children:"<Form>"})})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"../hooks/use-fetcher#fetchersubmitformdata-options",children:(0,r.jsx)(n.code,{children:"fetcher.submit"})})}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>c,x:()=>o});var r=s(6540);const t={},i=r.createContext(t);function c(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:c(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);