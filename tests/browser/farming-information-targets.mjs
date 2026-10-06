import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {newState,emptyPlot} from '../../src/systems/state.js';
import {PLOTS} from '../../src/data/crops.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const b=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4174/';const ctx=await b.newContext({hasTouch:true}),p=await ctx.newPage(),errors=[];
p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.text());});
const snap=()=>p.evaluate(()=>window.__simpleLife.snapshot());
async function click(id){const c=(await snap()).controls.find(v=>v.id===id);await p.mouse.click(c.x+c.w/2,c.y+c.h/2);await p.waitForTimeout(130);}
async function load(s){await p.goto(base+'?qa');await p.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await p.reload();await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day 1');}
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const result=[];
for(const [width,height]of [[844,390],[390,844]]){
 await p.setViewportSize({width,height});
 for(const [index,pos]of PLOTS.entries()){
  const s=Object.assign(newState(),{area:'farm',position:{x:pos.x,y:pos.y},hasVisitedFarm:true});s.plots=s.plots.map(()=>({...emptyPlot(),crop:'tomato',growth:1}));await load(s);
  const v=await snap(),ci=v.cropInfo;assert.ok(ci,'panel '+width+' tile '+index);assert.equal(ci.index,index);
  const px=(pos.x-v.camera.x)*v.camera.zoom,py=(pos.y-v.camera.y)*v.camera.zoom;
  assert.ok(!overlap(ci,{x:px-50,y:py-68,w:100,h:114}),`target/player ${width} tile ${index}`);
  for(const c of v.controls)assert.ok(!overlap(ci,c),c.id);if(v.prompt)assert.ok(!overlap(ci,v.prompt),'prompt');
 }
 result.push({width,height,inspectedCells:16,cropAndPlayerClear:true});
}
await p.setViewportSize({width:1280,height:720});let s=newState();s.starterSeedsClaimed=true;s.position={x:480,y:548};await load(s);assert.equal((await snap()).farmGuide.expanded,true);
await p.waitForTimeout(7200);assert.equal((await snap()).farmGuide.expanded,false);assert.equal((await snap()).farmGuide.objective,true);await p.screenshot({path:'docs/verification/farming-information/objective-minimized.png'});
s.position={x:480,y:1088};await load(s);assert.equal((await snap()).farmGuide.waypoint,null);
await p.keyboard.down('ArrowUp');await p.waitForTimeout(300);await p.keyboard.up('ArrowUp');await p.keyboard.press('Escape');await click('Return to title');assert.equal((await snap()).state,null);assert.equal((await snap()).menu,'title');
assert.deepEqual(errors,[]);await writeFile('docs/verification/farming-information/targets-results.json',JSON.stringify({result:'PASS',resultBySize:result,objectiveMinimized:true,exitVisibleHidesWaypoint:true,pauseTitle:true,errors},null,2));console.log('All mobile targets, minimization and pause/title PASS');await ctx.close();await b.close();
