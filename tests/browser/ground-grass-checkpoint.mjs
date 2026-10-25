import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({
 headless:true,
 executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const out='docs/verification/ground-grass-review-v1';await mkdir(out,{recursive:true});
const page=await browser.newPage({viewport:{width:1460,height:1062}}),errors=[],warnings=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('console',message=>{if(message.type()==='error')errors.push(message.text());if(message.type()==='warning')warnings.push(message.text());});
await page.goto(process.env.GAME_URL||'http://127.0.0.1:43864/?qa&fixture=homeOutdoor');
await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
const controls=await page.evaluate(()=>window.__simpleLife.snapshot().controls);
const control=controls.find(item=>String(item.id).toLowerCase().includes('continue')&&!item.disabled)||controls.find(item=>String(item.id).toLowerCase()==='play');
assert.ok(control,`fixture launch control: ${controls.map(item=>item.id).join(', ')}`);
await page.screenshot({path:`${out}/title-debug.png`});
console.log('CONTINUE',JSON.stringify(control));
await page.mouse.click(control.x+control.w/2,control.y+control.h/2);
await page.waitForTimeout(150);
for(const id of ['Play as Boy','intro-skip']){
 const next=(await page.evaluate(()=>window.__simpleLife.snapshot().controls)).find(item=>item.id===id);
 if(next){await page.mouse.click(next.x+next.w/2,next.y+next.h/2);await page.waitForTimeout(150);}
}
await page.waitForTimeout(1200);
console.log('AFTER',JSON.stringify(await page.evaluate(()=>({state:window.__simpleLife?.snapshot()?.state,controls:window.__simpleLife?.snapshot()?.controls?.map(item=>item.id)}))));
await page.waitForFunction(()=>window.__simpleLife?.snapshot()?.state?.area==='home',{timeout:5000});
await page.waitForTimeout(250);
const state=await page.evaluate(()=>window.__simpleLife.snapshot());
assert.equal(state.state.position.x,1100);assert.equal(state.state.position.y,850);
await page.screenshot({path:`${out}/home-integrated-1460x1062.png`});
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);
const report={result:'PASS',viewport:[1460,1062],area:'home',position:state.state.position,camera:state.camera,errors,warnings};
await writeFile(`${out}/browser-check.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
await browser.close();
