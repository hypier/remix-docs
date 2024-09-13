"use strict";(self.webpackChunkremix_docs=self.webpackChunkremix_docs||[]).push([[799],{5606:(e,n,c)=>{c.r(n),c.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>a,frontMatter:()=>d,metadata:()=>o,toc:()=>t});var r=c(4848),s=c(8453);const d={title:"\u8868\u5355"},i="<Form>",o={id:"components/form",title:"\u8868\u5355",description:"\u4e00\u4e2a\u6e10\u8fdb\u589e\u5f3a\u7684 HTML `\uff0c\u901a\u8fc7 fetch \u63d0\u4ea4\u6570\u636e\u5230\u64cd\u4f5c\uff0c\u6fc0\u6d3b useNavigation` \u4e2d\u7684\u5f85\u5904\u7406\u72b6\u6001\uff0c\u4ece\u800c\u5b9e\u73b0\u8d85\u8d8a\u57fa\u672c HTML \u8868\u5355\u7684\u9ad8\u7ea7\u7528\u6237\u754c\u9762\u3002\u5728\u8868\u5355\u7684\u64cd\u4f5c\u5b8c\u6210\u540e\uff0c\u9875\u9762\u4e0a\u7684\u6240\u6709\u6570\u636e\u4f1a\u81ea\u52a8\u4ece\u670d\u52a1\u5668\u91cd\u65b0\u9a8c\u8bc1\uff0c\u4ee5\u4fdd\u6301 UI \u4e0e\u6570\u636e\u540c\u6b65\u3002",source:"@site/docs/components/form.md",sourceDirName:"components",slug:"/components/form",permalink:"/docs/components/form",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/components/form.md",tags:[],version:"current",frontMatter:{title:"\u8868\u5355"},sidebar:"tutorialSidebar",previous:{title:"\u7b49\u5f85",permalink:"/docs/components/await"},next:{title:"\u94fe\u63a5",permalink:"/docs/components/link"}},l={},t=[{value:"\u9053\u5177",id:"\u9053\u5177",level:2},{value:"<code>action</code>",id:"action",level:3},{value:"<code>method</code>",id:"method",level:3},{value:"<code>encType</code>",id:"enctype",level:3},{value:"<code>navigate</code>",id:"navigate",level:3},{value:"<code>fetcherKey</code>",id:"fetcherkey",level:3},{value:"<code>preventScrollReset</code>",id:"preventscrollreset",level:3},{value:"<code>replace</code>",id:"replace",level:3},{value:"<code>reloadDocument</code>",id:"reloaddocument",level:3},{value:"<code>unstable_viewTransition</code>",id:"unstable_viewtransition",level:3},{value:"\u5907\u6ce8",id:"\u5907\u6ce8",level:2},{value:"<code>?index</code>",id:"index",level:3},{value:"\u5176\u4ed6\u8d44\u6e90",id:"\u5176\u4ed6\u8d44\u6e90",level:2}];function h(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"form",children:(0,r.jsx)(n.code,{children:"<Form>"})})}),"\n",(0,r.jsxs)(n.p,{children:["\u4e00\u4e2a\u6e10\u8fdb\u589e\u5f3a\u7684 HTML ",(0,r.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form",children:(0,r.jsx)(n.code,{children:"<form>"})}),"\uff0c\u901a\u8fc7 ",(0,r.jsx)(n.code,{children:"fetch"})," \u63d0\u4ea4\u6570\u636e\u5230\u64cd\u4f5c\uff0c\u6fc0\u6d3b ",(0,r.jsx)(n.code,{children:"useNavigation"})," \u4e2d\u7684\u5f85\u5904\u7406\u72b6\u6001\uff0c\u4ece\u800c\u5b9e\u73b0\u8d85\u8d8a\u57fa\u672c HTML \u8868\u5355\u7684\u9ad8\u7ea7\u7528\u6237\u754c\u9762\u3002\u5728\u8868\u5355\u7684\u64cd\u4f5c\u5b8c\u6210\u540e\uff0c\u9875\u9762\u4e0a\u7684\u6240\u6709\u6570\u636e\u4f1a\u81ea\u52a8\u4ece\u670d\u52a1\u5668\u91cd\u65b0\u9a8c\u8bc1\uff0c\u4ee5\u4fdd\u6301 UI \u4e0e\u6570\u636e\u540c\u6b65\u3002"]}),"\n",(0,r.jsx)(n.p,{children:"\u7531\u4e8e\u5b83\u4f7f\u7528 HTML \u8868\u5355 API\uff0c\u670d\u52a1\u5668\u6e32\u67d3\u7684\u9875\u9762\u5728 JavaScript \u52a0\u8f7d\u4e4b\u524d\u5728\u57fa\u672c\u5c42\u9762\u4e0a\u662f\u4e92\u52a8\u7684\u3002\u6d4f\u89c8\u5668\u7ba1\u7406\u63d0\u4ea4\u548c\u5f85\u5904\u7406\u72b6\u6001\uff08\u5982\u65cb\u8f6c\u7684 favicon\uff09\uff0c\u800c\u4e0d\u662f Remix \u6765\u7ba1\u7406\u63d0\u4ea4\u3002\u5728 JavaScript \u52a0\u8f7d\u540e\uff0cRemix \u63a5\u7ba1\uff0c\u542f\u7528 Web \u5e94\u7528\u7a0b\u5e8f\u7528\u6237\u4f53\u9a8c\u3002"}),"\n",(0,r.jsxs)(n.p,{children:["\u8868\u5355\u6700\u9002\u5408\u7528\u4e8e\u90a3\u4e9b\u4e5f\u5e94\u8be5\u66f4\u6539 URL \u6216\u4ee5\u5176\u4ed6\u65b9\u5f0f\u5411\u6d4f\u89c8\u5668\u5386\u53f2\u8bb0\u5f55\u5806\u6808\u6dfb\u52a0\u6761\u76ee\u7684\u63d0\u4ea4\u3002\u5bf9\u4e8e\u4e0d\u5e94\u64cd\u7eb5\u6d4f\u89c8\u5668\u5386\u53f2\u8bb0\u5f55\u5806\u6808\u7684\u8868\u5355\uff0c\u8bf7\u4f7f\u7528 ",(0,r.jsx)(n.a,{href:"../hooks/use-fetcher#fetcherform",children:(0,r.jsx)(n.code,{children:"<fetcher.Form>"})}),"\u3002"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:'import { Form } from "@remix-run/react";\n\nfunction NewEvent() {\n  return (\n    <Form action="/events" method="post">\n      <input name="title" type="text" />\n      <input name="description" type="text" />\n    </Form>\n  );\n}\n'})}),"\n",(0,r.jsx)(n.h2,{id:"\u9053\u5177",children:"\u9053\u5177"}),"\n",(0,r.jsx)(n.h3,{id:"action",children:(0,r.jsx)(n.code,{children:"action"})}),"\n",(0,r.jsx)(n.p,{children:"\u63d0\u4ea4\u8868\u5355\u6570\u636e\u7684 URL\u3002"}),"\n",(0,r.jsxs)(n.p,{children:["\u5982\u679c\u4e3a ",(0,r.jsx)(n.code,{children:"undefined"}),"\uff0c\u5219\u9ed8\u8ba4\u4e3a\u4e0a\u4e0b\u6587\u4e2d\u7684\u6700\u8fd1\u8def\u7531\u3002\u5982\u679c\u7236\u8def\u7531\u6e32\u67d3\u4e86\u4e00\u4e2a ",(0,r.jsx)(n.code,{children:"<Form>"})," \u4f46 URL \u5339\u914d\u66f4\u6df1\u5c42\u7684\u5b50\u8def\u7531\uff0c\u8868\u5355\u5c06\u63d0\u4ea4\u5230\u7236\u8def\u7531\u3002\u540c\u6837\uff0c\u5b50\u8def\u7531\u4e2d\u7684\u8868\u5355\u5c06\u63d0\u4ea4\u5230\u5b50\u8def\u7531\u3002\u8fd9\u4e0e\u539f\u751f\u7684 ",(0,r.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form",children:(0,r.jsx)(n.code,{children:"<form>"})})," \u4e0d\u540c\uff0c\u540e\u8005\u59cb\u7ec8\u6307\u5411\u5b8c\u6574\u7684 URL\u3002"]}),"\n",(0,r.jsxs)("docs-info",{children:["\u8bf7\u53c2\u9605 ",(0,r.jsx)(n.code,{children:"useResolvedPath"})," \u6587\u6863\u4e2d\u5173\u4e8e ",(0,r.jsx)(n.code,{children:"future.v3_relativeSplatPath"})," \u672a\u6765\u6807\u5fd7\u5728 Splat \u8def\u7531\u4e2d\u76f8\u5bf9 ",(0,r.jsx)(n.code,{children:"<Form action>"})," \u884c\u4e3a\u7684\u8bf4\u660e\uff0c\u89c1 ",(0,r.jsx)(n.a,{href:"../hooks/use-resolved-path#splat-paths",children:"Splat Paths"})," \u90e8\u5206"]}),"\n",(0,r.jsx)(n.h3,{id:"method",children:(0,r.jsx)(n.code,{children:"method"})}),"\n",(0,r.jsxs)(n.p,{children:["\u8fd9\u51b3\u5b9a\u4e86\u8981\u4f7f\u7528\u7684 ",(0,r.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods",children:"HTTP verb"}),"\uff1a",(0,r.jsx)(n.code,{children:"DELETE"}),"\u3001",(0,r.jsx)(n.code,{children:"GET"}),"\u3001",(0,r.jsx)(n.code,{children:"PATCH"}),"\u3001",(0,r.jsx)(n.code,{children:"POST"})," \u548c ",(0,r.jsx)(n.code,{children:"PUT"}),"\u3002\u9ed8\u8ba4\u503c\u662f ",(0,r.jsx)(n.code,{children:"GET"}),"\u3002"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:'<Form method="post" />\n'})}),"\n",(0,r.jsxs)(n.p,{children:["\u539f\u751f ",(0,r.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form",children:(0,r.jsx)(n.code,{children:"<form>"})})," \u4ec5\u652f\u6301 ",(0,r.jsx)(n.code,{children:"GET"})," \u548c ",(0,r.jsx)(n.code,{children:"POST"}),"\uff0c\u56e0\u6b64\u5982\u679c\u60a8\u5e0c\u671b\u652f\u6301 ",(0,r.jsx)(n.a,{href:"../discussion/progressive-enhancement",children:"\u6e10\u8fdb\u589e\u5f3a"}),"\uff0c\u5e94\u907f\u514d\u4f7f\u7528\u5176\u4ed6\u52a8\u8bcd\u3002"]}),"\n",(0,r.jsx)(n.h3,{id:"enctype",children:(0,r.jsx)(n.code,{children:"encType"})}),"\n",(0,r.jsx)(n.p,{children:"\u7528\u4e8e\u8868\u5355\u63d0\u4ea4\u7684\u7f16\u7801\u7c7b\u578b\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:'<Form encType="multipart/form-data" />\n'})}),"\n",(0,r.jsxs)(n.p,{children:["\u9ed8\u8ba4\u503c\u4e3a ",(0,r.jsx)(n.code,{children:"application/x-www-form-urlencoded"}),"\uff0c\u6587\u4ef6\u4e0a\u4f20\u65f6\u4f7f\u7528 ",(0,r.jsx)(n.code,{children:"multipart/form-data"}),"\u3002"]}),"\n",(0,r.jsx)(n.h3,{id:"navigate",children:(0,r.jsx)(n.code,{children:"navigate"})}),"\n",(0,r.jsxs)(n.p,{children:["\u60a8\u53ef\u4ee5\u901a\u8fc7\u6307\u5b9a ",(0,r.jsx)(n.code,{children:"<Form navigate={false}>"})," \u6765\u544a\u8bc9\u8868\u5355\u8df3\u8fc7\u5bfc\u822a\u5e76\u5728\u5185\u90e8\u4f7f\u7528 ",(0,r.jsx)(n.a,{href:"../hooks/use-fetcher",children:"fetcher"}),"\u3002\u8fd9\u5b9e\u9645\u4e0a\u662f ",(0,r.jsx)(n.code,{children:"useFetcher()"})," + ",(0,r.jsx)(n.code,{children:"<fetcher.Form>"})," \u7684\u7b80\u5199\uff0c\u60a8\u4e0d\u5173\u5fc3\u7ed3\u679c\u6570\u636e\uff0c\u53ea\u60f3\u542f\u52a8\u63d0\u4ea4\u5e76\u901a\u8fc7 ",(0,r.jsx)(n.a,{href:"../hooks/use-fetchers",children:(0,r.jsx)(n.code,{children:"useFetchers()"})})," \u8bbf\u95ee\u5f85\u5904\u7406\u72b6\u6001\u3002"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:'<Form method="post" navigate={false} />\n'})}),"\n",(0,r.jsx)(n.h3,{id:"fetcherkey",children:(0,r.jsx)(n.code,{children:"fetcherKey"})}),"\n",(0,r.jsxs)(n.p,{children:["\u5728\u4f7f\u7528\u975e\u5bfc\u822a\u7684 ",(0,r.jsx)(n.code,{children:"Form"})," \u65f6\uff0c\u60a8\u8fd8\u53ef\u4ee5\u9009\u62e9\u6307\u5b9a\u81ea\u5df1\u7684 fetcher ",(0,r.jsx)(n.code,{children:"key"}),"\u3002"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:'<Form method="post" navigate={false} fetcherKey="my-key" />\n'})}),"\n",(0,r.jsx)(n.h3,{id:"preventscrollreset",children:(0,r.jsx)(n.code,{children:"preventScrollReset"})}),"\n",(0,r.jsxs)(n.p,{children:["\u5982\u679c\u60a8\u6b63\u5728\u4f7f\u7528 ",(0,r.jsx)(n.a,{href:"./scroll-restoration",children:(0,r.jsx)(n.code,{children:"<ScrollRestoration>"})}),"\uff0c\u8fd9\u53ef\u4ee5\u8ba9\u60a8\u5728\u8868\u5355\u63d0\u4ea4\u65f6\u9632\u6b62\u6eda\u52a8\u4f4d\u7f6e\u91cd\u7f6e\u5230\u7a97\u53e3\u9876\u90e8\u3002"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:"<Form preventScrollReset />\n"})}),"\n",(0,r.jsx)(n.h3,{id:"replace",children:(0,r.jsx)(n.code,{children:"replace"})}),"\n",(0,r.jsx)(n.p,{children:"\u66ff\u6362\u5386\u53f2\u5806\u6808\u4e2d\u7684\u5f53\u524d\u6761\u76ee\uff0c\u800c\u4e0d\u662f\u63a8\u9001\u65b0\u7684\u6761\u76ee\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:"<Form replace />\n"})}),"\n",(0,r.jsx)(n.h3,{id:"reloaddocument",children:(0,r.jsx)(n.code,{children:"reloadDocument"})}),"\n",(0,r.jsxs)(n.p,{children:["\u5982\u679c\u4e3a true\uff0c\u5b83\u5c06\u901a\u8fc7\u6d4f\u89c8\u5668\u63d0\u4ea4\u8868\u5355\uff0c\u800c\u4e0d\u662f\u5ba2\u6237\u7aef\u8def\u7531\u3002\u8fd9\u4e0e\u539f\u751f\u7684 ",(0,r.jsx)(n.code,{children:"<form>"})," \u76f8\u540c\u3002"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:"<Form reloadDocument />\n"})}),"\n",(0,r.jsxs)(n.p,{children:["\u8fd9\u6bd4 ",(0,r.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form",children:(0,r.jsx)(n.code,{children:"<form>"})})," \u66f4\u63a8\u8350\u3002\u5f53\u7701\u7565 ",(0,r.jsx)(n.code,{children:"action"})," \u5c5e\u6027\u65f6\uff0c",(0,r.jsx)(n.code,{children:"<Form>"})," \u548c ",(0,r.jsx)(n.code,{children:"<form>"})," \u6709\u65f6\u4f1a\u6839\u636e\u5f53\u524d URL \u8c03\u7528\u4e0d\u540c\u7684\u64cd\u4f5c\uff0c\u56e0\u4e3a ",(0,r.jsx)(n.code,{children:"<form>"})," \u4f7f\u7528\u5f53\u524d URL \u4f5c\u4e3a\u9ed8\u8ba4\u503c\uff0c\u800c ",(0,r.jsx)(n.code,{children:"<Form>"})," \u4f7f\u7528\u6e32\u67d3\u8868\u5355\u7684\u8def\u7531\u7684 URL\u3002"]}),"\n",(0,r.jsx)(n.h3,{id:"unstable_viewtransition",children:(0,r.jsx)(n.code,{children:"unstable_viewTransition"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"unstable_viewTransition"})," \u5c5e\u6027\u901a\u8fc7\u5c06\u6700\u7ec8\u72b6\u6001\u66f4\u65b0\u5305\u88c5\u5728 ",(0,r.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition",children:(0,r.jsx)(n.code,{children:"document.startViewTransition()"})})," \u4e2d\uff0c\u4e3a\u6b64\u5bfc\u822a\u542f\u7528 ",(0,r.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API",children:"View Transition"}),"\u3002\u5982\u679c\u60a8\u9700\u8981\u4e3a\u6b64\u89c6\u56fe\u8fc7\u6e21\u5e94\u7528\u7279\u5b9a\u6837\u5f0f\uff0c\u8fd8\u9700\u8981\u5229\u7528 ",(0,r.jsx)(n.a,{href:"../hooks/use-view-transition-state",children:(0,r.jsx)(n.code,{children:"unstable_useViewTransitionState()"})}),"\u3002"]}),"\n",(0,r.jsx)("docs-warning",{children:(0,r.jsx)(n.p,{children:"\u8bf7\u6ce8\u610f\uff0c\u6b64 API \u88ab\u6807\u8bb0\u4e3a\u4e0d\u7a33\u5b9a\uff0c\u53ef\u80fd\u4f1a\u5728\u6ca1\u6709\u91cd\u5927\u7248\u672c\u53d1\u5e03\u7684\u60c5\u51b5\u4e0b\u53d1\u751f\u7834\u574f\u6027\u66f4\u6539\u3002"})}),"\n",(0,r.jsx)(n.h2,{id:"\u5907\u6ce8",children:"\u5907\u6ce8"}),"\n",(0,r.jsx)(n.h3,{id:"index",children:(0,r.jsx)(n.code,{children:"?index"})}),"\n",(0,r.jsxs)(n.p,{children:["\u56e0\u4e3a\u7d22\u5f15\u8def\u7531\u548c\u5b83\u4eec\u7684\u7236\u8def\u7531\u5171\u4eab\u76f8\u540c\u7684 URL\uff0c\u6240\u4ee5\u4f7f\u7528 ",(0,r.jsx)(n.code,{children:"?index"})," \u53c2\u6570\u6765\u533a\u5206\u5b83\u4eec\u3002"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:'<Form action="/accounts?index" method="post" />\n'})}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{children:"action url"}),(0,r.jsx)(n.th,{children:"route action"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"/accounts?index"})}),(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"app/routes/accounts._index.tsx"})})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"/accounts"})}),(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"app/routes/accounts.tsx"})})]})]})]}),"\n",(0,r.jsx)(n.p,{children:"\u53e6\u89c1\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsxs)(n.a,{href:"../guides/index-query-param",children:[(0,r.jsx)(n.code,{children:"?index"})," \u67e5\u8be2\u53c2\u6570"]})}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"\u5176\u4ed6\u8d44\u6e90",children:"\u5176\u4ed6\u8d44\u6e90"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u89c6\u9891\uff1a"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://www.youtube.com/watch?v=Iv25HAHaFDs&list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6",children:"\u4f7f\u7528 Form + action \u7684\u6570\u636e\u53d8\u66f4"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://www.youtube.com/watch?v=w2i-9cYxSdc&list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6",children:"\u591a\u4e2a\u8868\u5355\u548c\u5355\u4e2a\u6309\u94ae\u53d8\u66f4"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"https://www.youtube.com/watch?v=bMLej7bg5Zo&list=PLXoynULbYuEDG2wBFSZ66b85EIspy3fy6",children:"\u8868\u5355\u63d0\u4ea4\u540e\u6e05\u9664\u8f93\u5165"})}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u76f8\u5173\u8ba8\u8bba\uff1a"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"../discussion/data-flow",children:"\u5168\u6808\u6570\u636e\u6d41"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"../discussion/pending-ui",children:"\u5f85\u5904\u7406 UI"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"../discussion/form-vs-fetcher",children:"\u8868\u5355\u4e0e Fetcher"})}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u76f8\u5173 API\uff1a"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"../hooks/use-action-data",children:(0,r.jsx)(n.code,{children:"useActionData"})})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"../hooks/use-navigation",children:(0,r.jsx)(n.code,{children:"useNavigation"})})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"../hooks/use-submit",children:(0,r.jsx)(n.code,{children:"useSubmit"})})}),"\n"]})]})}function a(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}},8453:(e,n,c)=>{c.d(n,{R:()=>i,x:()=>o});var r=c(6540);const s={},d=r.createContext(s);function i(e){const n=r.useContext(d);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),r.createElement(d.Provider,{value:n},e.children)}}}]);