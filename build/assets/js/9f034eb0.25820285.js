"use strict";(self.webpackChunkremix_docs=self.webpackChunkremix_docs||[]).push([[5014],{5154:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>o,metadata:()=>c,toc:()=>a});var s=t(4848),r=t(8453);const o={title:"\u8d44\u4ea7\u5bfc\u5165",toc:!1},i="\u8d44\u6e90 URL \u5bfc\u5165",c={id:"file-conventions/asset-imports",title:"\u8d44\u4ea7\u5bfc\u5165",description:"app \u6587\u4ef6\u5939\u4e2d\u7684\u4efb\u4f55\u6587\u4ef6\u90fd\u53ef\u4ee5\u5bfc\u5165\u5230\u60a8\u7684\u6a21\u5757\u4e2d\u3002Remix \u5c06\u4f1a\uff1a",source:"@site/docs/file-conventions/asset-imports.md",sourceDirName:"file-conventions",slug:"/file-conventions/asset-imports",permalink:"/docs/file-conventions/asset-imports",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/file-conventions/asset-imports.md",tags:[],version:"current",frontMatter:{title:"\u8d44\u4ea7\u5bfc\u5165",toc:!1},sidebar:"tutorialSidebar",previous:{title:".server \u6a21\u5757",permalink:"/docs/file-conventions/-server"},next:{title:"entry.client",permalink:"/docs/file-conventions/entry.client"}},l={},a=[];function d(e){const n={a:"a",code:"code",h1:"h1",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"\u8d44\u6e90-url-\u5bfc\u5165",children:"\u8d44\u6e90 URL \u5bfc\u5165"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"app"})," \u6587\u4ef6\u5939\u4e2d\u7684\u4efb\u4f55\u6587\u4ef6\u90fd\u53ef\u4ee5\u5bfc\u5165\u5230\u60a8\u7684\u6a21\u5757\u4e2d\u3002Remix \u5c06\u4f1a\uff1a"]}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"\u5c06\u6587\u4ef6\u590d\u5236\u5230\u60a8\u7684\u6d4f\u89c8\u5668\u6784\u5efa\u76ee\u5f55"}),"\n",(0,s.jsx)(n.li,{children:"\u4e3a\u6587\u4ef6\u751f\u6210\u6307\u7eb9\u4ee5\u5b9e\u73b0\u957f\u671f\u7f13\u5b58"}),"\n",(0,s.jsx)(n.li,{children:"\u8fd4\u56de\u516c\u5171 URL \u4f9b\u60a8\u7684\u6a21\u5757\u5728\u6e32\u67d3\u65f6\u4f7f\u7528"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["\u8fd9\u901a\u5e38\u7528\u4e8e\u6837\u5f0f\u8868\uff0c\u4f46\u4e5f\u53ef\u4ee5\u7528\u4e8e\u4efb\u4f55\u5177\u6709 ",(0,s.jsx)(n.a,{href:"https://github.com/remix-run/remix/blob/main/packages/remix-dev/compiler/utils/loaders.ts",children:"\u5b9a\u4e49\u52a0\u8f7d\u5668"})," \u7684\u6587\u4ef6\u7c7b\u578b\u3002"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno\n\nimport banner from "./images/banner.jpg";\nimport styles from "./styles/app.css";\n\nexport const links: LinksFunction = () => [\n  { rel: "stylesheet", href: styles },\n];\n\nexport default function Page() {\n  return (\n    <div>\n      <h1>Some Page</h1>\n      <img src={banner} />\n    </div>\n  );\n}\n'})})]})}function p(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>c});var s=t(6540);const r={},o=s.createContext(r);function i(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);