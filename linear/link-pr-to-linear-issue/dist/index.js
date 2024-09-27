"use strict";var x=Object.create;var $=Object.defineProperty;var R=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var B=Object.getPrototypeOf,E=Object.prototype.hasOwnProperty;var P=(e,t,s,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of T(t))!E.call(e,n)&&n!==s&&$(e,n,{get:()=>t[n],enumerable:!(o=R(t,n))||o.enumerable});return e};var A=(e,t,s)=>(s=e!=null?x(B(e)):{},P(t||!e||!e.__esModule?$(s,"default",{value:e,enumerable:!0}):s,e));var N=A(require("@actions/github")),a=A(require("@actions/core")),_=require("@linear/sdk");function U(e){let{prBody:t,owner:s,repo:o,prNo:n}=e,p=`https://github.com/${s}/${o}/pull/${n}`,l=`https://github.com/${s}/${o}/issues/%s`,m=/(close(?:s|d)?|fix(?:es|ed)?|resolve(?:s|d)?)\s#(\d+)/gi,u=h=>l.replace("%s",h[2]),d=[...t.matchAll(m)].map(u),g=/(relate(?:s|d)\sto|part\sof)\s+#(\d+)/gi,f=[...t.matchAll(g)].map(u);return{closingIssues:d,relatedIssues:f,prUrl:p}}async function L(e){let{pullNumber:t,owner:s,repo:o,octokit:n,linearClient:p}=e,{data:{body:l}}=await n.rest.pulls.get({owner:s,repo:o,pull_number:t}),{closingIssues:m,relatedIssues:u,prUrl:d}=U({...e,prNo:t,prBody:l}),g=m.concat(u),f=g.concat([d]),{nodes:h}=await p.issues({filter:{attachments:{url:{in:f}}}}),b=[],y=[],k=[];for(let r of h){let{nodes:c}=await r.attachments({filter:{url:{in:f}}});if(c.some(i=>m.includes(i.url))){b.push(r.identifier);continue}if(c.some(i=>u.includes(i.url))){y.push(r.identifier);continue}let I=c.every(i=>!g.includes(i.url))&&c.find(i=>i.url===d);I&&k.push(I.id)}let w=b.sort().join(", "),C=y.sort().join(", ");if(!l?.includes(w)||!l.includes(C)){let r=`<!-- LINEAR: closes ${w} -->`,c=`<!-- LINEAR: relates to ${C} -->`,I=`${r}
${c}
${l}`;await n.rest.pulls.update({owner:s,repo:o,pull_number:t,body:I})}for(let r of k)await p.deleteAttachment(r)}var O=a.getInput("repository"),j=a.getInput("pull_number"),v=a.getInput("linear_api_key"),K=a.getInput("github_token"),D=N.getOctokit(K),q=new _.LinearClient({apiKey:v}),z=parseInt(j,10),[F,G]=O.split("/");L({pullNumber:z,owner:F,repo:G,octokit:D,linearClient:q});
