"use strict";(self.webpackChunkremix_docs=self.webpackChunkremix_docs||[]).push([[2182],{7997:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>o,contentTitle:()=>i,default:()=>h,frontMatter:()=>c,metadata:()=>d,toc:()=>l});var s=r(4848),t=r(8453);const c={title:"\u7f13\u5b58\u63a7\u5236",hidden:!0},i="\u7f13\u5b58\u63a7\u5236",d={id:"guides/cache-control",title:"\u7f13\u5b58\u63a7\u5236",description:"\u5728\u8def\u7531\u6a21\u5757\u4e2d",source:"@site/docs/guides/cache-control.md",sourceDirName:"guides",slug:"/guides/cache-control",permalink:"/docs/guides/cache-control",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/guides/cache-control.md",tags:[],version:"current",frontMatter:{title:"\u7f13\u5b58\u63a7\u5236",hidden:!0},sidebar:"tutorialSidebar",previous:{title:"\u6d4f\u89c8\u5668\u652f\u6301",permalink:"/docs/guides/browser-support"},next:{title:"\u5ba2\u6237\u6570\u636e",permalink:"/docs/guides/client-data"}},o={},l=[{value:"\u5728\u8def\u7531\u6a21\u5757\u4e2d",id:"\u5728\u8def\u7531\u6a21\u5757\u4e2d",level:2},{value:"\u5728\u52a0\u8f7d\u5668\u4e2d",id:"\u5728\u52a0\u8f7d\u5668\u4e2d",level:2}];function a(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"\u7f13\u5b58\u63a7\u5236",children:"\u7f13\u5b58\u63a7\u5236"})}),"\n",(0,s.jsx)(n.h2,{id:"\u5728\u8def\u7531\u6a21\u5757\u4e2d",children:"\u5728\u8def\u7531\u6a21\u5757\u4e2d"}),"\n",(0,s.jsxs)(n.p,{children:["\u6bcf\u4e2a\u8def\u7531\u4e5f\u53ef\u4ee5\u5b9a\u4e49\u5176 http \u5934\u90e8\u3002\u8fd9\u5728 http \u7f13\u5b58\u4e2d\u975e\u5e38\u91cd\u8981\u3002Remix \u4e0d\u4f9d\u8d56\u4e8e\u5c06\u60a8\u7684\u7f51\u7ad9\u6784\u5efa\u4e3a\u9759\u6001\u6587\u4ef6\u5e76\u4e0a\u4f20\u5230 CDN \u6765\u63d0\u9ad8\u6027\u80fd\uff0c\u800c\u662f\u4f9d\u8d56\u4e8e\u7f13\u5b58\u5934\u3002\u65e0\u8bba\u54ea\u79cd\u65b9\u6cd5\uff0c\u6700\u7ec8\u7ed3\u679c\u90fd\u662f\u76f8\u540c\u7684\uff1a\u5728 CDN \u4e0a\u7684\u9759\u6001\u6587\u6863\u3002",(0,s.jsx)(n.a,{href:"https://youtu.be/bfLFHp7Sbkg",children:"\u67e5\u770b\u6b64\u89c6\u9891\u4ee5\u83b7\u53d6\u66f4\u591a\u4fe1\u606f"}),"\u3002"]}),"\n",(0,s.jsxs)(n.p,{children:["\u901a\u5e38\uff0c\u7f13\u5b58\u5934\u7684\u96be\u70b9\u5728\u4e8e\u914d\u7f6e\u5b83\u4eec\u3002\u5728 Remix \u4e2d\uff0c\u6211\u4eec\u8ba9\u8fd9\u53d8\u5f97\u7b80\u5355\u3002\u53ea\u9700\u4ece\u60a8\u7684\u8def\u7531\u4e2d\u5bfc\u51fa\u4e00\u4e2a ",(0,s.jsx)(n.code,{children:"headers"})," \u51fd\u6570\u3002"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'export function headers() {\n  return {\n    "Cache-Control": "public, max-age=300, s-maxage=3600",\n  };\n}\n\nexport function meta() {\n  /* ... */\n}\n\nexport default function Gists() {\n  /* ... */\n}\n'})}),"\n",(0,s.jsx)(n.p,{children:"max-age \u544a\u8bc9\u7528\u6237\u7684\u6d4f\u89c8\u5668\u5c06\u5176\u7f13\u5b58 300 \u79d2\u6216 5 \u5206\u949f\u3002\u8fd9\u610f\u5473\u7740\u5982\u679c\u4ed6\u4eec\u5728 5 \u5206\u949f\u5185\u70b9\u51fb\u8fd4\u56de\u6216\u518d\u6b21\u70b9\u51fb\u540c\u4e00\u9875\u9762\u7684\u94fe\u63a5\uff0c\u6d4f\u89c8\u5668\u5c06\u4e0d\u4f1a\u8bf7\u6c42\u8be5\u9875\u9762\uff0c\u800c\u662f\u4f7f\u7528\u7f13\u5b58\u3002"}),"\n",(0,s.jsx)(n.p,{children:"s-maxage \u544a\u8bc9 CDN \u5c06\u5176\u7f13\u5b58\u4e00\u4e2a\u5c0f\u65f6\u3002\u4ee5\u4e0b\u662f\u7b2c\u4e00\u4e2a\u4eba\u8bbf\u95ee\u6211\u4eec\u7f51\u7ad9\u65f6\u7684\u60c5\u51b5\uff1a"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"\u8bf7\u6c42\u53d1\u9001\u5230\u7f51\u7ad9\uff0c\u5b9e\u9645\u4e0a\u662f CDN"}),"\n",(0,s.jsx)(n.li,{children:"CDN \u6ca1\u6709\u7f13\u5b58\u6587\u6863\uff0c\u56e0\u6b64\u5411\u6211\u4eec\u7684\u670d\u52a1\u5668\uff08\u201c\u6e90\u670d\u52a1\u5668\u201d\uff09\u53d1\u51fa\u8bf7\u6c42\u3002"}),"\n",(0,s.jsx)(n.li,{children:"\u6211\u4eec\u7684\u670d\u52a1\u5668\u6784\u5efa\u9875\u9762\u5e76\u5c06\u5176\u53d1\u9001\u5230 CDN"}),"\n",(0,s.jsx)(n.li,{children:"CDN \u7f13\u5b58\u5b83\u5e76\u5c06\u5176\u53d1\u9001\u7ed9\u8bbf\u5ba2\u3002"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"\u73b0\u5728\uff0c\u5f53\u4e0b\u4e00\u4e2a\u4eba\u8bbf\u95ee\u6211\u4eec\u7684\u9875\u9762\u65f6\uff0c\u60c5\u51b5\u5982\u4e0b\uff1a"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"\u8bf7\u6c42\u53d1\u9001\u5230 CDN"}),"\n",(0,s.jsx)(n.li,{children:"CDN \u5df2\u7ecf\u7f13\u5b58\u4e86\u6587\u6863\uff0c\u5e76\u7acb\u5373\u53d1\u9001\uff0c\u800c\u65e0\u9700\u63a5\u89e6\u6211\u4eec\u7684\u6e90\u670d\u52a1\u5668\uff01"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["\u6211\u4eec\u8fd8\u6709\u5f88\u591a\u5173\u4e8e\u7f13\u5b58\u7684\u5185\u5bb9\u5728 ",(0,s.jsx)(n.a,{href:"../guides/caching",children:"CDN \u7f13\u5b58"})," \u6307\u5357\u4e2d\uff0c\u786e\u4fdd\u6709\u65f6\u95f4\u9605\u8bfb\u4e00\u4e0b\u3002"]}),"\n",(0,s.jsx)(n.h2,{id:"\u5728\u52a0\u8f7d\u5668\u4e2d",children:"\u5728\u52a0\u8f7d\u5668\u4e2d"}),"\n",(0,s.jsx)(n.p,{children:"\u6211\u4eec\u770b\u5230\u6211\u4eec\u7684\u8def\u7531\u53ef\u4ee5\u5b9a\u4e49\u5b83\u4eec\u7684\u7f13\u5b58\u63a7\u5236\uff0c\u90a3\u4e48\u8fd9\u5bf9\u52a0\u8f7d\u5668\u6765\u8bf4\u6709\u4ec0\u4e48\u91cd\u8981\u6027\u5462\uff1f\u8fd9\u6709\u4e24\u4e2a\u539f\u56e0\uff1a"}),"\n",(0,s.jsx)(n.p,{children:"\u9996\u5148\uff0c\u60a8\u7684\u6570\u636e\u901a\u5e38\u6bd4\u60a8\u7684\u8def\u7531\u66f4\u6e05\u695a\u7f13\u5b58\u63a7\u5236\u5e94\u8be5\u662f\u4ec0\u4e48\uff0c\u56e0\u4e3a\u6570\u636e\u6bd4\u6807\u8bb0\u66f4\u9891\u7e41\u5730\u53d8\u5316\u3002\u56e0\u6b64\uff0c\u52a0\u8f7d\u5668\u7684\u5934\u90e8\u4f1a\u4f20\u9012\u7ed9\u8def\u7531\u7684\u5934\u90e8\u51fd\u6570\u3002"}),"\n",(0,s.jsxs)(n.p,{children:["\u6253\u5f00 ",(0,s.jsx)(n.code,{children:"app/routes/gists.ts"})," \u5e76\u50cf\u4e0b\u9762\u8fd9\u6837\u66f4\u65b0\u60a8\u7684\u5934\u90e8\u51fd\u6570\uff1a"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-tsx",children:'export function headers({\n  loaderHeaders,\n}: {\n  loaderHeaders: Headers;\n}) {\n  return {\n    "Cache-Control": loaderHeaders.get("Cache-Control"),\n  };\n}\n'})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"loaderHeaders"})," \u5bf9\u8c61\u662f ",(0,s.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Headers",children:"Web Fetch API Headers \u6784\u9020\u51fd\u6570"})," \u7684\u4e00\u4e2a\u5b9e\u4f8b\u3002"]}),"\n",(0,s.jsx)(n.p,{children:"\u73b0\u5728\uff0c\u5f53\u6d4f\u89c8\u5668\u6216 CDN \u60f3\u8981\u7f13\u5b58\u6211\u4eec\u7684\u9875\u9762\u65f6\uff0c\u5b83\u4f1a\u4ece\u6211\u4eec\u7684\u6570\u636e\u6e90\u83b7\u53d6\u5934\u90e8\uff0c\u8fd9\u901a\u5e38\u662f\u60a8\u60f3\u8981\u7684\u3002\u6ce8\u610f\uff0c\u5728\u6211\u4eec\u7684\u4f8b\u5b50\u4e2d\uff0c\u6211\u4eec\u5b9e\u9645\u4e0a\u53ea\u662f\u4f7f\u7528\u4e86 GitHub \u5728\u6211\u4eec\u8bf7\u6c42\u7684\u54cd\u5e94\u4e2d\u53d1\u9001\u7684\u5934\u90e8\uff01"}),"\n",(0,s.jsxs)(n.p,{children:["\u7b2c\u4e8c\u4e2a\u539f\u56e0\u662f Remix \u5728\u5ba2\u6237\u7aef\u8f6c\u6362\u65f6\u901a\u8fc7 ",(0,s.jsx)(n.code,{children:"fetch"})," \u8c03\u7528\u60a8\u7684\u52a0\u8f7d\u5668\u3002\u901a\u8fc7\u5728\u8fd9\u91cc\u8fd4\u56de\u826f\u597d\u7684\u7f13\u5b58\u5934\uff0c\u5f53\u7528\u6237\u70b9\u51fb\u540e\u9000/\u524d\u8fdb\u6216\u591a\u6b21\u8bbf\u95ee\u540c\u4e00\u9875\u9762\u65f6\uff0c\u6d4f\u89c8\u5668\u5b9e\u9645\u4e0a\u4e0d\u4f1a\u518d\u6b21\u8bf7\u6c42\u6570\u636e\uff0c\u800c\u662f\u4f1a\u4f7f\u7528\u7f13\u5b58\u7248\u672c\u3002\u8fd9\u6781\u5927\u5730\u63d0\u9ad8\u4e86\u7f51\u7ad9\u7684\u6027\u80fd\uff0c\u5373\u4f7f\u5bf9\u4e8e\u90a3\u4e9b\u60a8\u65e0\u6cd5\u5728 CDN \u4e0a\u7f13\u5b58\u7684\u9875\u9762\u4e5f\u662f\u5982\u6b64\u3002\u8bb8\u591a React \u5e94\u7528\u7a0b\u5e8f\u4f9d\u8d56\u4e8e JavaScript \u7f13\u5b58\uff0c\u4f46\u6d4f\u89c8\u5668\u7f13\u5b58\u5df2\u7ecf\u5de5\u4f5c\u5f97\u5f88\u597d\u4e86\uff01"]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>i,x:()=>d});var s=r(6540);const t={},c=s.createContext(t);function i(e){const n=s.useContext(c);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),s.createElement(c.Provider,{value:n},e.children)}}}]);