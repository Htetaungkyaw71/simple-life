import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const out='docs/verification/ground-clumps-v3';await mkdir(out,{recursive:true});
const page=await browser.newPage({viewport:{width:1460,height:1062}}),errors=[],warnings=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('console',message=>{if(message.type()==='error')errors.push(message.text());if(message.type()==='warning')warnings.push(message.text());});
await page.goto(process.env.GAME_URL||'http://127.0.0.1:43864/?qa&fixture=homeOutdoor');
await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
const controls=await page.evaluate(()=>window.__simpleLife.snapshot().controls);
const launch=controls.find(item=>String(item.id).toLowerCase().includes('continue')&&!item.disabled)||controls.find(item=>String(item.id).toLowerCase()==='play');
assert.ok(launch);await page.mouse.click(launch.x+launch.w/2,launch.y+launch.h/2);
await page.waitForTimeout(150);
for(const id of ['Play as Boy','intro-skip']){
 const next=(await page.evaluate(()=>window.__simpleLife.snapshot().controls)).find(item=>item.id===id);
 if(next){await page.mouse.click(next.x+next.w/2,next.y+next.h/2);await page.waitForTimeout(150);}
}
await page.waitForFunction(()=>window.__simpleLife?.snapshot()?.state?.area==='home',{timeout:5000});
await page.waitForTimeout(800);
const state=await page.evaluate(()=>window.__simpleLife.snapshot());
assert.equal(state.state.position.x,1100);assert.equal(state.state.position.y,850);
assert.equal(state.camera.zoom,1.5);
await page.screenshot({path:`${out}/home-clumps-normal-zoom.png`});
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);
const report={result:'PASS',viewport:[1460,1062],area:'home',position:state.state.position,camera:state.camera,clumpRuntimeScale:1,fixtureNearestClumps:[[1046,862],[1169,837]],errors,warnings};
await writeFile(`${out}/browser-check.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));await browser.close();
