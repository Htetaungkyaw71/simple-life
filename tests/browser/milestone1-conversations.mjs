import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.GAME_URL||'http://127.0.0.1:4200/',out=process.env.QA_OUT||'/tmp/simple-life-milestone1-conversations';await mkdir(out,{recursive:true});
const errors=[],warnings=[],failed=[],foreign=[];
const watch=page=>{page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url());});page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))foreign.push(r.url());});};
const snap=page=>page.evaluate(()=>window.__simpleLife.snapshot());
async function click(page,id){const c=(await snap(page)).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);await page.mouse.click(c.x+c.w/2,c.y+c.h/2);await page.waitForTimeout(180);}
async function fixture(page,state){await page.goto(base+'?qa');await page.evaluate(s=>{localStorage.setItem('simple-life.save.v1',JSON.stringify(s));localStorage.setItem('simple-life.language.v1','en');},state);await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length,null,{timeout:60000});for(let i=0;i<3;i++){const s=await snap(page);if(s.state&&s.menu===null)return;if(s.controls.some(c=>c.id==='Continue'))await click(page,'Continue');await page.waitForTimeout(1000);}throw Error('fixture did not enter play: '+JSON.stringify(await snap(page)));}
const prepared=(position,extra={})=>{const s=newState();Object.assign(s,{area:'city',position,minute:600,hasVisitedCity:true},extra);s.story.intro='seen';s.story.tutorial={started:true,moved:true,invited:true,complete:true};return s;};
async function use(page){await page.keyboard.press('e');await page.waitForTimeout(200);}
function fits(s,w,h){assert.equal(s.menu,'conversation');assert.ok(s.menuBounds.y>0);assert.ok(s.menuBounds.x>=0&&s.menuBounds.y>=0&&s.menuBounds.x+s.menuBounds.w<=w&&s.menuBounds.y+s.menuBounds.h<=h);for(const c of s.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=w&&c.y+c.h<=h,c.id);}

try{
 const ctx=await browser.newContext({viewport:{width:1280,height:720}}),page=await ctx.newPage();watch(page);
 await fixture(page,prepared({x:674,y:690}));await use(page);let s=await snap(page);fits(s,1280,720);assert.ok(s.texts.some(t=>t.source?.startsWith('You’re the farmer from the old house')),JSON.stringify(s.texts));await page.screenshot({path:out+'/01-teo-opening.png'});
 await click(page,'teo-grandfather');await click(page,'continue');await click(page,'teo-ask-silas');await click(page,'conversation-close');s=await snap(page);assert.ok(s.state.story.conversations.includes('clue:teo-lantern'));assert.ok(s.texts.some(t=>t.text.includes('Speak to Silas')));const afterTeo=structuredClone(s.state);
 afterTeo.position={x:948,y:690};await fixture(page,afterTeo);await use(page);s=await snap(page);assert.ok(s.texts.some(t=>t.source?.startsWith('Teo noticed the east-road lamp')));await page.screenshot({path:out+'/02-silas-clue.png'});await click(page,'silas-clue-question');await click(page,'conversation-close');s=await snap(page);assert.ok(s.state.story.conversations.includes('clue:silas-lamp'));assert.ok(!s.texts.some(t=>t.text.includes('Speak to Silas')));
 await fixture(page,prepared({x:432,y:350}));await use(page);s=await snap(page);fits(s,1280,720);assert.ok(s.texts.some(t=>t.source?.startsWith('Seeds are small promises')));await click(page,'clara-a');await click(page,'conversation-service');assert.equal((await snap(page)).menu,'trade');assert.equal((await snap(page)).trade.type,'seed');await page.screenshot({path:out+'/03-clara-service.png'});await ctx.close();
 for(const [width,height,name]of [[844,390,'short-landscape'],[390,844,'portrait']]){const c=await browser.newContext({viewport:{width,height}}),p=await c.newPage();watch(p);await fixture(p,prepared({x:674,y:690}));await use(p);fits(await snap(p),width,height);await p.screenshot({path:`${out}/04-${name}.png`});await c.close();}
 assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);assert.deepEqual(failed,[]);assert.deepEqual(foreign,[]);
 const result={result:'PASS',flows:['Teo exact clue and durable flag','Silas clue resolution','Clara conversation to seed shop','desktop / short landscape / portrait layout'],errors,warnings,failed,foreign};await writeFile(out+'/results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser.close();}
