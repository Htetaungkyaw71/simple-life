import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState,emptyPlot} from '../../src/systems/state.js';
import {syncInterior} from '../../src/data/locations.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4174/';
const ctx=await browser.newContext({viewport:{width:1280,height:720},hasTouch:true}),page=await ctx.newPage();
const errors=[],warnings=[],out='docs/verification/farming-information';await mkdir(out,{recursive:true});
page.on('response',r=>{if(r.status()>=400)console.log('HTTP '+r.status()+' '+r.url());});
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='warning')warnings.push(m.text());if(m.type()==='error')errors.push(m.text());});
const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
async function click(id){const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c,id);await page.mouse.click(c.x+c.w/2,c.y+c.h/2);await page.waitForTimeout(120);}
async function load(extra={},crop){syncInterior(page.viewportSize().width,page.viewportSize().height);const s=Object.assign(newState(),extra);if(crop)s.plots[0]={...emptyPlot(),crop:'tomato',...crop};await page.goto(base+'?qa');await page.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day '+s.day);return snap();}
const shot=name=>page.screenshot({path:`${out}/${name}.png`});
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const results=[];
for(const [width,height]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844]]){
 await page.setViewportSize({width,height});
 for(const [name,crop,extra]of [['growing',{growth:1,morning:true},{}],['paused',{growth:1,missedWindows:1,lastEvaluatedWindow:0},{minute:960}],['ready',{growth:3},{}],['dead',{missedWindows:2},{}]]){
  const v=await load({area:'farm',position:{x:376,y:248},...extra},crop),panel=v.cropInfo;assert.ok(panel,'visible '+width+name);
  const screen=p=>({x:(p.x-v.camera.x)*v.camera.zoom,y:(p.y-v.camera.y)*v.camera.zoom});const p=screen(v.state.position),tile=screen({x:376,y:248});
  assert.ok(!overlap(panel,{x:p.x-28,y:p.y-68,w:56,h:76}),'farmer clear');assert.ok(!overlap(panel,{x:tile.x-50,y:tile.y-48,w:100,h:94}),'crop clear');
  assert.ok(panel.x>=0&&panel.y>=0&&panel.x+panel.w<=width&&panel.y+panel.h<=height,'within viewport');
  for(const c of v.controls)assert.ok(!overlap(panel,c),'control clear '+c.id);
  if(v.prompt)assert.ok(!overlap(panel,v.prompt),'context clear');
  await shot(`crop-${name}-${width}x${height}`);
 }
 const guide=await load({starterSeedsClaimed:true,position:{x:480,y:548}});assert.ok(guide.farmGuide.objective);assert.ok(guide.farmGuide.waypoint);await shot('guide-'+width+'x'+height);
 for(const x of [320,640]){await load({starterSeedsClaimed:true,position:{x,y:548}});const w=(await snap()).farmGuide.waypoint;if(w)assert.ok(w.x>=0&&w.x<=width&&w.y>=0&&w.y<=height);}
 await load({position:{x:480,y:640},hasVisitedFarm:true});assert.equal((await snap()).farmGuide.waypoint,null);await shot('permanent-sign-'+width+'x'+height);
 results.push({width,height,states:['growing','paused','ready','dead'],cropAndPlayerClear:true,controlsClear:true,guide:true});
}
// Touch farming uses the same targeted cell; no hover and no debug mutation.
const cdp=await ctx.newCDPSession(page);
async function touch(id,ms=60){const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c,id);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:c.x+c.w/2,y:c.y+c.h/2}]});await page.waitForTimeout(ms);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(130);}
for(const [width,height]of [[844,390],[390,844]]){
 await page.setViewportSize({width,height});await load({area:'farm',position:{x:376,y:248},inventory:{seed:2,tomato:0}});assert.equal((await snap()).cropInfo,null);
 await touch('use');assert.equal((await snap()).cropInfo.stage,1);await touch('tool-water');await touch('use');assert.equal((await snap()).cropInfo.care[0].label,'Watered');
 const x=(await snap()).state.position.x;await touch('move-right',150);assert.ok((await snap()).state.position.x>x+15);await shot('touch-'+width+'x'+height);
 await page.keyboard.press('Escape');await click('Save');const saved=(await snap()).state;await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day '+saved.day);assert.deepEqual((await snap()).state.plots,saved.plots);
}
// Window expiry, recovery and dead/clear feedback in the real simulation.
await page.setViewportSize({width:1280,height:720});await load({area:'farm',position:{x:376,y:248},minute:719.8},{growth:1});await page.waitForTimeout(600);assert.equal((await snap()).cropInfo.paused,true);
await load({area:'farm',position:{x:376,y:248},minute:960,selected:'water'},{growth:1,missedWindows:1,dryDays:1,lastEvaluatedWindow:0});await page.keyboard.press('e');await page.waitForTimeout(120);assert.equal((await snap()).cropInfo.condition,'Recovering');await shot('recovering');
await load({area:'farm',position:{x:376,y:248},minute:1319.8},{growth:1,missedWindows:1,lastEvaluatedWindow:0});await page.waitForTimeout(600);assert.equal((await snap()).cropInfo.dead,true);await page.keyboard.press('e');await page.waitForTimeout(120);assert.equal((await snap()).cropInfo,null);
// Complete/new save migration and a genuinely fresh game.
await load({version:3,hasVisitedFarm:undefined,inventory:{seed:0,tomato:2}});assert.equal((await snap()).state.hasVisitedFarm,true);assert.equal((await snap()).farmGuide.objective,false);
await page.keyboard.press('Escape');await click('Return to title');await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('New Game');await click('Start fresh');await click('Play as Boy');assert.equal((await snap()).state.hasVisitedFarm,false);assert.ok((await snap()).farmGuide.waypoint);
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);await writeFile(out+'/layout-results.json',JSON.stringify({result:'PASS',results,touch:true,expiry:true,recovery:true,deathClear:true,migration:true,newGame:true,errors,warnings},null,2));console.log('Layout, care, touch, migration PASS');await ctx.close();await browser.close();
