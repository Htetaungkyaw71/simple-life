import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {newState,emptyPlot} from '../../src/systems/state.js';
import {syncInterior,walkable} from '../../src/data/locations.js';
import {cropVisual} from '../../src/systems/watering.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4173/';
const ctx=await browser.newContext({viewport:{width:1280,height:720},hasTouch:true}),page=await ctx.newPage(),errors=[],warnings=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='warning')warnings.push(m.text());if(m.type()==='error')errors.push(m.text());});
const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot()),out=process.env.QA_OUTPUT||'docs/verification/farming-presentation';
async function click(id){const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);await page.mouse.click(c.x+c.w/2,c.y+c.h/2);await page.waitForTimeout(100);}
async function load(s){await page.goto(base+'?qa');await page.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day '+s.day);await page.waitForTimeout(150);}
async function saveReload(){await page.keyboard.press('Escape');await click('Save');const saved=(await snap()).state;await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day '+saved.day);const restored=(await snap()).state;for(const k of ['money','inventory','plots','starterSeedsClaimed','expansionUnlocked'])assert.deepEqual(restored[k],saved[k],k);}
const crop=(extra={})=>({...emptyPlot(),crop:'tomato',...extra});
const fixture=(extra={})=>Object.assign(newState('girl'),{area:'farm',position:{x:376,y:248},selected:'water'},extra);
let s=fixture({minute:719.8});s.plots[0]=crop();await load(s);await page.waitForTimeout(600);let state=(await snap()).state;assert.equal(state.plots[0].missedWindows,1);assert.equal(cropVisual(state.plots[0],state),'wilted');await saveReload();assert.equal((await snap()).state.plots[0].missedWindows,1);await page.screenshot({path:out+'/wilted.png'});
s=fixture({minute:960});s.plots[0]=crop({missedWindows:1,dryDays:1,lastEvaluatedWindow:0});await load(s);await page.keyboard.press('e');state=(await snap()).state;assert.equal(state.plots[0].missedWindows,0);assert.equal(state.plots[0].evening,true);await saveReload();
s=fixture({minute:1319.8});s.plots[0]=crop({missedWindows:1,dryDays:1,lastEvaluatedWindow:0});await load(s);await page.waitForTimeout(600);state=(await snap()).state;assert.equal(cropVisual(state.plots[0],state),'dead');await saveReload();await page.screenshot({path:out+'/dead.png'});await page.keyboard.press('e');assert.equal((await snap()).state.plots[0].crop,null);
s=fixture({version:2,money:245,day:7,minute:1020,inventory:{seed:6,tomato:9},starterSeedsClaimed:true});delete s.expansionUnlocked;s.plots[3]={crop:'tomato',growth:2,morning:true,evening:false,dryDays:1};await load(s);state=(await snap()).state;assert.equal(state.version,5);assert.equal(state.money,245);assert.deepEqual(state.inventory,s.inventory);assert.equal(state.plots[3].growth,2);assert.equal(state.plots[3].missedWindows,1);assert.equal(state.expansionUnlocked,false);await saveReload();
s=fixture({position:{x:932,y:736}});await load(s);state=(await snap()).state;assert.ok(walkable('farm',state.position.x,state.position.y));assert.ok(Math.hypot(state.position.x-932,state.position.y-736)<96);await saveReload();
const cdp=await ctx.newCDPSession(page);
async function touch(id,ms=60){const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c,id);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:c.x+c.w/2,y:c.y+c.h/2}]});await page.waitForTimeout(ms);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(150);}
const touchSizes=[];
for(const [width,height]of [[844,390],[390,844]]){
 await page.setViewportSize({width,height});syncInterior(width,height);await load(fixture({selected:'seed',inventory:{seed:2,tomato:0}}));await touch('use');assert.equal((await snap()).state.plots[0].crop,'tomato');await touch('tool-water');await touch('use');assert.equal((await snap()).state.plots[0].morning,true);const x=(await snap()).state.position.x;await touch('move-right',130);assert.ok((await snap()).state.position.x>x+12);await saveReload();await page.screenshot({path:out+'/touch-farm-'+width+'x'+height+'.png'});touchSizes.push([width,height]);
}
await page.setViewportSize({width:1280,height:720});syncInterior(1280,720);
const indoorResults=[];
for(const [name,x,y,key]of [['bed',112,136,'ArrowLeft'],['kitchen',480,144,'ArrowUp'],['table',400,220,'ArrowRight'],['shelf',128,240,'ArrowLeft'],['wall',312,68,'ArrowUp']]){
 await load(Object.assign(newState(),{area:'interior',position:{x,y}}));await page.keyboard.down(key);await page.waitForTimeout(400);const before=(await snap()).state.position;await page.waitForTimeout(250);await page.keyboard.up(key);const after=(await snap()).state.position;assert.ok(Math.hypot(before.x-after.x,before.y-after.y)<2,name);assert.ok(walkable('interior',after.x,after.y));indoorResults.push(name);
}
s=fixture({position:{x:448,y:360},minute:600});const variants=[{}, {morning:true},{growth:1,morning:true},{growth:2,morning:true},{growth:3},{growth:1},{missedWindows:1,dryDays:1},{missedWindows:2,dryDays:2}];variants.forEach((p,i)=>s.plots[i]=crop(p));await load(s);await page.screenshot({path:out+'/all-crop-states.png'});const visuals=(await snap()).state.plots.slice(0,8).map(p=>cropVisual(p,{minute:600}));assert.equal(new Set(visuals).size,8);
await load(Object.assign(newState(),{position:{x:448,y:616}}));await page.screenshot({path:out+'/farm-sign-final.png'});
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);const result={result:'PASS',wiltOnce:true,recover:true,twoMissesDead:true,clearDead:true,saveReload:true,legacyV2:true,unsafeShedSave:true,indoorResults,touchSizes,visuals,errors,warnings};await writeFile(out+'/care-touch-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await ctx.close();await browser.close();
