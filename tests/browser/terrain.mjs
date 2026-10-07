import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {REGIONS,FOREST_MAP} from '../../src/data/forest.js';
import {waterAt} from '../../src/data/water.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4175/',out=process.env.QA_OUTPUT||'docs/verification/terrain/materials';
await mkdir(out,{recursive:true});
const ctx=await browser.newContext({viewport:{width:1280,height:720}}),page=await ctx.newPage(),errors=[],warnings=[],failedRequests=[],foreignRequests=[],captures=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});
page.on('response',r=>{if(r.status()>=400)failedRequests.push(r.url());});page.on('request',r=>{if(!r.url().startsWith(new URL(base).origin)&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))foreignRequests.push(r.url());});
const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
async function capture(name,area,position,renderer='canvas',minute=600){
 const url=base+'?qa&renderer='+renderer,s=newState('girl');Object.assign(s,{area,position,minute,forestTutorialComplete:true,nightWarningSeen:true,hasVisitedFarm:true});
 // Title first prevents an earlier running save from overwriting the fixture.
 await page.goto(url);await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await page.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);
 const start=Date.now();await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);const b=(await snap()).controls.find(c=>c.id==='Continue / Day 1');assert.ok(b);await page.mouse.click(b.x+b.w/2,b.y+b.h/2);await page.waitForFunction(()=>window.__simpleLife.snapshot().menu===null);await page.waitForTimeout(250);
 const readyMs=Date.now()-start,a=await snap();assert.equal(a.state.area,area);assert.equal(a.state.version,9);assert.equal(a.player.height,64);assert.equal(await page.locator('canvas').count(),1);assert.ok(readyMs<10000,'local ready target');
 for(const c of a.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=page.viewportSize().width&&c.y+c.h<=page.viewportSize().height,c.id);
 if(area==='forest')assert.equal(a.water.wading,waterAt(FOREST_MAP,a.state.position));
 await page.screenshot({path:out+'/'+name+'.png'});captures.push({name,area,renderer,minute,position:a.state.position,viewport:page.viewportSize(),readyMs});return a;
}
for(const [name,area,p]of [['home','home',{x:960,y:800}],['farm','farm',{x:320,y:620}],['city','city',{x:640,y:480}],['homewood','forest',{x:640,y:4848}],['waterfall','forest',{x:160,y:3340}]])await capture(name,area,p);
const seen=new Set();for(const r of REGIONS){if(seen.has(r.biome))continue;seen.add(r.biome);await capture('habitat-'+r.biome,'forest',{x:r.x+640,y:r.y+800});}
for(const renderer of ['canvas','webgl'])for(const minute of [600,1320])await capture('river-'+renderer+'-'+minute,'forest',{x:2370,y:1900},renderer,minute);
// A paused river keeps its simulation clock, feet and reflection crop stable.
await capture('river-before-pause','forest',{x:2370,y:1900});await page.keyboard.press('Escape');await page.waitForTimeout(250);const frozen=await snap();assert.equal(frozen.paused,true);const clip={x:596,y:550,width:90,height:56},before=await page.screenshot({clip});await page.waitForTimeout(750);const after=await page.screenshot({clip});assert.deepEqual(after,before,'water reflections stop while paused');assert.equal((await snap()).state.minute,frozen.state.minute);
await page.keyboard.press('Escape');await page.waitForTimeout(100);assert.equal((await snap()).paused,false);let changes=0;const resumed=await page.screenshot({clip});for(let n=0;n<4;n++){await page.waitForTimeout(260);if(!(await page.screenshot({clip})).equals(resumed))changes++;}assert.ok(changes,'reflections resume after unpausing');
for(const [name,p]of [['portrait-ground',{x:640,y:4848}],['portrait-river',{x:2370,y:1900}]]){await page.setViewportSize({width:360,height:640});await capture(name,'forest',p);}
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);assert.deepEqual(failedRequests,[]);assert.deepEqual(foreignRequests,[]);
await writeFile(out+'/results.json',JSON.stringify({passed:true,biomes:[...seen],captures,pausedRiverPixelsStable:true,reflectionAnimationResumes:true,userLiveSaveUntouched:true,errors,warnings,failedRequests,foreignRequests},null,2));await ctx.close();await browser.close();console.log('PASS native terrain / nine habitat palettes / day-night Canvas-WebGL river / pause / portrait');
