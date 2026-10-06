import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const b=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE||undefined,headless:true}),results=[];
for(const url of [process.env.DEV_URL||'http://127.0.0.1:5175/',process.env.GAME_URL||'http://127.0.0.1:4174/']){
 const ctx=await b.newContext(),p=await ctx.newPage(),errors=[],warnings=[],requests=[];
 p.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});p.on('console',m=>{if(m.type()==='error')errors.push(m.text()+' '+m.location().url);if(m.type()==='warning')warnings.push(m.text());});p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>requests.push(r.url()));
 await p.goto(url+'?qa');await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await p.waitForTimeout(600);assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);assert.ok(requests.every(r=>r.startsWith(url)||r.startsWith('data:')||(r.startsWith('blob:')&&new URL(r).origin===new URL(url).origin)));results.push({url,result:'PASS',localOnly:true,errors,warnings});await ctx.close();
}
await writeFile('docs/verification/farming-information/fresh-origin-resources.json',JSON.stringify({result:'PASS',results},null,2));console.log('Fresh dev/production origins: no missing resources, errors, warnings or remote requests');await b.close();
