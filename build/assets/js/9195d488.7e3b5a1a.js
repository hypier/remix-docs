"use strict";(self.webpackChunkremix_docs=self.webpackChunkremix_docs||[]).push([[9287],{988:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>i,contentTitle:()=>s,default:()=>h,frontMatter:()=>l,metadata:()=>c,toc:()=>a});var r=t(4848),d=t(8453);const l={title:"unstable_createFileUploadHandler",toc:!1},s="unstable_createFileUploadHandler",c={id:"utils/unstable-create-file-upload-handler",title:"unstable_createFileUploadHandler",description:"\u4e00\u4e2a Node.js \u4e0a\u4f20\u5904\u7406\u7a0b\u5e8f\uff0c\u5c06\u5e26\u6709\u6587\u4ef6\u540d\u7684\u90e8\u5206\u5199\u5165\u78c1\u76d8\u4ee5\u907f\u514d\u5360\u7528\u5185\u5b58\uff0c\u672a\u5e26\u6587\u4ef6\u540d\u7684\u90e8\u5206\u5c06\u4e0d\u4f1a\u88ab\u89e3\u6790\u3002\u5e94\u4e0e\u53e6\u4e00\u4e2a\u4e0a\u4f20\u5904\u7406\u7a0b\u5e8f\u7ec4\u5408\u4f7f\u7528\u3002",source:"@site/docs/utils/unstable-create-file-upload-handler.md",sourceDirName:"utils",slug:"/utils/unstable-create-file-upload-handler",permalink:"/docs/utils/unstable-create-file-upload-handler",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/utils/unstable-create-file-upload-handler.md",tags:[],version:"current",frontMatter:{title:"unstable_createFileUploadHandler",toc:!1},sidebar:"tutorialSidebar",previous:{title:"\u4f1a\u8bdd",permalink:"/docs/utils/sessions"},next:{title:"unstable_createMemoryUploadHandler",permalink:"/docs/utils/unstable-create-memory-upload-handler"}},i={},a=[];function o(e){const n={code:"code",h1:"h1",header:"header",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,d.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"unstable_createfileuploadhandler",children:(0,r.jsx)(n.code,{children:"unstable_createFileUploadHandler"})})}),"\n",(0,r.jsx)(n.p,{children:"\u4e00\u4e2a Node.js \u4e0a\u4f20\u5904\u7406\u7a0b\u5e8f\uff0c\u5c06\u5e26\u6709\u6587\u4ef6\u540d\u7684\u90e8\u5206\u5199\u5165\u78c1\u76d8\u4ee5\u907f\u514d\u5360\u7528\u5185\u5b58\uff0c\u672a\u5e26\u6587\u4ef6\u540d\u7684\u90e8\u5206\u5c06\u4e0d\u4f1a\u88ab\u89e3\u6790\u3002\u5e94\u4e0e\u53e6\u4e00\u4e2a\u4e0a\u4f20\u5904\u7406\u7a0b\u5e8f\u7ec4\u5408\u4f7f\u7528\u3002"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u793a\u4f8b\uff1a"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:'export const action = async ({\n  request,\n}: ActionFunctionArgs) => {\n  const uploadHandler = unstable_composeUploadHandlers(\n    unstable_createFileUploadHandler({\n      maxPartSize: 5_000_000,\n      file: ({ filename }) => filename,\n    }),\n    // \u5c06\u5176\u4ed6\u6240\u6709\u5185\u5bb9\u89e3\u6790\u5230\u5185\u5b58\u4e2d\n    unstable_createMemoryUploadHandler()\n  );\n  const formData = await unstable_parseMultipartFormData(\n    request,\n    uploadHandler\n  );\n\n  const file = formData.get("avatar");\n\n  // file \u662f\u4e00\u4e2a\u5b9e\u73b0\u4e86 "File" API \u7684 "NodeOnDiskFile"\n  // ... \u7b49\u7b49\n};\n'})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u9009\u9879\uff1a"})}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{children:"\u5c5e\u6027"}),(0,r.jsx)(n.th,{children:"\u7c7b\u578b"}),(0,r.jsx)(n.th,{children:"\u9ed8\u8ba4\u503c"}),(0,r.jsx)(n.th,{children:"\u63cf\u8ff0"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"avoidFileConflicts"}),(0,r.jsx)(n.td,{children:"boolean"}),(0,r.jsx)(n.td,{children:"true"}),(0,r.jsx)(n.td,{children:"\u901a\u8fc7\u5728\u6587\u4ef6\u540d\u672b\u5c3e\u9644\u52a0\u65f6\u95f4\u6233\u6765\u907f\u514d\u6587\u4ef6\u51b2\u7a81\uff0c\u5982\u679c\u8be5\u6587\u4ef6\u540d\u5728\u78c1\u76d8\u4e0a\u5df2\u7ecf\u5b58\u5728"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"directory"}),(0,r.jsx)(n.td,{children:"string | Function"}),(0,r.jsx)(n.td,{children:"os.tmpdir()"}),(0,r.jsx)(n.td,{children:"\u4e0a\u4f20\u6587\u4ef6\u7684\u5199\u5165\u76ee\u5f55\u3002"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"file"}),(0,r.jsx)(n.td,{children:"Function"}),(0,r.jsxs)(n.td,{children:["() => ",(0,r.jsx)(n.code,{children:"upload_${random}.${ext}"})]}),(0,r.jsx)(n.td,{children:"\u76ee\u5f55\u4e2d\u6587\u4ef6\u7684\u540d\u79f0\u3002\u53ef\u4ee5\u662f\u76f8\u5bf9\u8def\u5f84\uff0c\u5982\u679c\u76ee\u5f55\u7ed3\u6784\u4e0d\u5b58\u5728\uff0c\u5c06\u4f1a\u88ab\u521b\u5efa\u3002"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"maxPartSize"}),(0,r.jsx)(n.td,{children:"number"}),(0,r.jsx)(n.td,{children:"3000000"}),(0,r.jsx)(n.td,{children:"\u5141\u8bb8\u7684\u6700\u5927\u4e0a\u4f20\u5927\u5c0f\uff08\u4ee5\u5b57\u8282\u4e3a\u5355\u4f4d\uff09\u3002\u5982\u679c\u8d85\u51fa\u8be5\u5927\u5c0f\uff0c\u5c06\u629b\u51fa MaxPartSizeExceededError\u3002"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"filter"}),(0,r.jsx)(n.td,{children:"Function"}),(0,r.jsx)(n.td,{children:"OPTIONAL"}),(0,r.jsxs)(n.td,{children:["\u60a8\u53ef\u4ee5\u7f16\u5199\u7684\u51fd\u6570\uff0c\u4ee5\u6839\u636e\u6587\u4ef6\u540d\u3001\u5185\u5bb9\u7c7b\u578b\u6216\u5b57\u6bb5\u540d\u9632\u6b62\u6587\u4ef6\u4e0a\u4f20\u88ab\u4fdd\u5b58\u3002\u8fd4\u56de ",(0,r.jsx)(n.code,{children:"false"})," \u5219\u8be5\u6587\u4ef6\u5c06\u88ab\u5ffd\u7565\u3002"]})]})]})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"file"})," \u548c ",(0,r.jsx)(n.code,{children:"directory"})," \u7684\u51fd\u6570 API \u662f\u76f8\u540c\u7684\u3002\u5b83\u4eec\u63a5\u53d7\u4e00\u4e2a ",(0,r.jsx)(n.code,{children:"object"})," \u5e76\u8fd4\u56de\u4e00\u4e2a ",(0,r.jsx)(n.code,{children:"string"}),"\u3002\u63a5\u53d7\u7684\u5bf9\u8c61\u5305\u542b ",(0,r.jsx)(n.code,{children:"filename"}),"\u3001",(0,r.jsx)(n.code,{children:"name"})," \u548c ",(0,r.jsx)(n.code,{children:"contentType"}),"\uff08\u5747\u4e3a\u5b57\u7b26\u4e32\uff09\u3002\u8fd4\u56de\u7684 ",(0,r.jsx)(n.code,{children:"string"})," \u662f\u8def\u5f84\u3002"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"filter"})," \u51fd\u6570\u63a5\u53d7\u4e00\u4e2a ",(0,r.jsx)(n.code,{children:"object"})," \u5e76\u8fd4\u56de\u4e00\u4e2a ",(0,r.jsx)(n.code,{children:"boolean"}),"\uff08\u6216\u4e00\u4e2a\u89e3\u6790\u4e3a ",(0,r.jsx)(n.code,{children:"boolean"})," \u7684 promise\uff09\u3002\u63a5\u53d7\u7684\u5bf9\u8c61\u5305\u542b ",(0,r.jsx)(n.code,{children:"filename"}),"\u3001",(0,r.jsx)(n.code,{children:"name"})," \u548c ",(0,r.jsx)(n.code,{children:"contentType"}),"\uff08\u5747\u4e3a\u5b57\u7b26\u4e32\uff09\u3002\u8fd4\u56de\u7684 ",(0,r.jsx)(n.code,{children:"boolean"})," \u5982\u679c\u60a8\u5e0c\u671b\u5904\u7406\u8be5\u6587\u4ef6\u6d41\uff0c\u5219\u4e3a ",(0,r.jsx)(n.code,{children:"true"}),"\u3002"]})]})}function h(e={}){const{wrapper:n}={...(0,d.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(o,{...e})}):o(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>c});var r=t(6540);const d={},l=r.createContext(d);function s(e){const n=r.useContext(l);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:s(e.components),r.createElement(l.Provider,{value:n},e.children)}}}]);