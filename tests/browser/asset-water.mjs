import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {walkable,syncInterior} from '../../src/data/locations.js';
import {PLOTS} from '../../src/data/crops.js';
import {newState} from '../../src/systems/state.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4175/';
const out=process.env.QA_OUTPUT||'docs/verification/asset-water';await mkdir(out,{recursive:true});
const ctx=await browser.newContext({viewport:{width:1280,height:720},hasTouch:true}),page=await ctx.newPage(),errors=[],warnings=[],failedRequests=[],foreignRequests=[];
page.on('response',r=>{if(r.status()>=400)failedRequests.push({status:r.status(),url:r.url()});});
page.on('request',r=>{if(!r.url().startsWith(new URL(base).origin)&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))foreignRequests.push(r.url());});
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='warning')warnings.push(m.text());if(m.type()==='error')errors.push(m.text());});
const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
async function click(id){
 if(id==='crop-next'){const s=await snap(),ids=['tomato','strawberry','carrot','corn'];id='crop-'+ids[(ids.indexOf(s.trade.crop)+1)%4];}
 const b=(await snap()).controls.find(c=>c.id===id);assert.ok(b&&!b.disabled,id);await page.mouse.click(b.x+b.w/2,b.y+b.h/2);await page.waitForTimeout(280);
 if(['trade-1','trade-5','trade-max','trade-all'].includes(id))await click('trade-confirm');
}
async function key(k){await page.keyboard.press(k,{delay:40});await page.waitForTimeout(360);}
async function hold(k,ms){await page.keyboard.down(k);await page.waitForTimeout(ms);await page.keyboard.up(k);await page.waitForTimeout(40);const s=await snap();assert.ok(walkable(s.state.area,s.state.position.x,s.state.position.y),'runtime stays in valid collision space');}
async function move(x,y){for(const [axis,target,neg,pos]of [['x',x,'ArrowLeft','ArrowRight'],['y',y,'ArrowUp','ArrowDown']])for(let n=0;n<12;n++){const d=target-(await snap()).state.position[axis];if(Math.abs(d)<3)break;await hold(d<0?neg:pos,Math.max(20,Math.abs(d)/((await snap()).state.area==='interior'?130:260)*1000));}const p=(await snap()).state.position;assert.ok(Math.hypot(p.x-x,p.y-y)<12,`move ${JSON.stringify(p)} -> ${x},${y}`);}
async function navigate(x,y){
 const s=await snap(),area=s.state.area,p=s.state.position,safe=(x,y)=>walkable(area,x,y,16)&&walkable(area,x,y+6,16);let start=[Math.round(p.x/16)*16,Math.round(p.y/16)*16];
 if(!safe(...start)){const nearby=[];for(let yy=-2;yy<=2;yy++)for(let xx=-2;xx<=2;xx++){const v=[start[0]+xx*16,start[1]+yy*16];if(safe(...v))nearby.push(v);}nearby.sort((a,b)=>Math.hypot(a[0]-p.x,a[1]-p.y)-Math.hypot(b[0]-p.x,b[1]-p.y));start=nearby[0];}
 await move(...start);const q=[start],from=new Map([[start.join(','),null]]);let goal;
 for(let i=0;i<q.length;i++){const v=q[i];if(Math.hypot(v[0]-x,v[1]-y)<12){goal=v;break;}for(const [dx,dy]of [[16,0],[-16,0],[0,16],[0,-16]]){const n=[v[0]+dx,v[1]+dy],k=n.join(',');if(!from.has(k)&&safe(...n)&&safe(v[0]+dx/2,v[1]+dy/2)){from.set(k,v);q.push(n);}}}
 assert.ok(goal,`route ${area} ${x},${y}`);const route=[];for(let v=goal;v;v=from.get(v.join(',')))route.push(v);route.reverse();
 for(let i=1;i<route.length;i++){const before=route[i-1],v=route[i],next=route[i+1];if(!next||v[0]-before[0]!==next[0]-v[0]||v[1]-before[1]!==next[1]-v[1])await move(...v);}
 await move(x,y);
}
const shot=name=>page.screenshot({path:`${out}/${name}.png`});const use=()=>key('e');
async function reloadContinue(){const day=(await snap()).state.day;await key('Escape');await click('Save');const saved=(await snap()).state;await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day '+day);const loaded=(await snap()).state;for(const k of ['version','character','area','money','inventory','plots','starterSeedsClaimed','hasVisitedFarm','health'])assert.deepEqual(loaded[k],saved[k],k);const elapsed=(loaded.day-saved.day)*1440+loaded.minute-Math.floor(saved.minute);assert.equal(loaded.energy,Math.max(0,saved.energy-Math.floor((saved.fatigueMinutes+elapsed)/30)));assert.ok(Math.abs(loaded.fatigueMinutes-(saved.fatigueMinutes+elapsed)%30)<.0001);}

async function fixture(area,position,extra={}){syncInterior(page.viewportSize().width,page.viewportSize().height);const s=newState();s.area=area;s.position=position;Object.assign(s,extra);await page.goto(base+'?qa');await page.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day '+s.day);await page.waitForTimeout(200);}



import {waterAt} from '../../src/data/water.js';
import {MAPS} from '../../src/data/mapLayouts.js';
await page.goto(base+'?qa');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
// Real input crosses a river away from every bridge, saves in the water and exits.
await fixture('forest',{x:2240,y:1900},{minute:600,forestTutorialComplete:true,nightWarningSeen:true});
await move(2370,1900);let s=await snap();assert.ok(waterAt(MAPS.forest,s.state.position),JSON.stringify({p:s.state.position,menu:s.menu,water:s.water,paused:s.paused}));assert.equal(s.water.wading,true);await shot('river-wading');
const wetPosition={...s.state.position};await reloadContinue();s=await snap();assert.ok(Math.hypot(s.state.position.x-wetPosition.x,s.state.position.y-wetPosition.y)<1);assert.equal(s.water.wading,true);
await move(2540,1900);s=await snap();assert.ok(s.state.position.x>2500,JSON.stringify(s.state.position));assert.equal(s.water.wading,false);assert.equal(s.state.health,100);await shot('river-crossed');
// The old Home and Farm pond surfaces now admit actual keyboard movement too.
for(const [area,p]of [['home',{x:1520,y:704}],['farm',{x:1856,y:624}]]){
 await fixture(area,p,{minute:600});await move(p.x,p.y+80);assert.equal((await snap()).water.wading,true);await shot(area+'-pond-wading');await move(p.x,p.y+300);assert.equal((await snap()).water.wading,false);
}
// Cross the waterfall's centre from upstream into its foam pool.
await fixture('forest',{x:160,y:3260},{minute:600,forestTutorialComplete:true,nightWarningSeen:true});await move(160,3340);assert.equal((await snap()).water.wading,true);await shot('waterfall-wading');await move(160,3490);assert.ok((await snap()).state.position.y>3424);await shot('waterfall-pool');
await fixture('forest',{x:2320,y:270},{minute:600,forestTutorialComplete:true,nightWarningSeen:true});await shot('river-waterfall');
// New boar directional animation renders through a real hit and flee.
const fixtureState=newState();fixtureState.forest.boar.health=1;
await fixture('forest',{x:936,y:4512},{minute:600,forest:fixtureState.forest,ownsClub:true,clubEquipped:true,forestTutorialComplete:true,nightWarningSeen:true});
assert.ok((await snap()).wildlife.find(a=>a.id==='boar-original').frame.startsWith('cp-boar-'));await shot('animated-boar');await hold('ArrowUp',80);await key('k');assert.equal((await snap()).state.forest.boar.health,0);assert.equal((await snap()).state.inventory.wildHide,1);await shot('boar-fled');await reloadContinue();assert.equal((await snap()).state.forest.boar.health,0);
for(const [name,p]of [['deer-hare',{x:480,y:4780}],['fox',{x:1760,y:3784}],['grouse',{x:4320,y:2792}],['ruins',{x:2720,y:3450}],['flora',{x:310,y:4000}]]){
 await fixture('forest',p,{minute:600,forestTutorialComplete:true,nightWarningSeen:true});await shot(name);if(['deer-hare','fox','grouse'].includes(name))assert.ok((await snap()).woodland.some(a=>a.visible));
}
// A stationary woodland animal uses idle rather than cycling walking feet.
await fixture('forest',{x:650,y:4800},{minute:600,forestTutorialComplete:true,nightWarningSeen:true});assert.ok((await snap()).woodland.some(a=>a.visible&&a.frame.includes('-idle-')));await shot('woodland-idle');
// Both renderers and seven screen sizes keep water and canvas UI usable.
const viewports=[];
for(const [width,height]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844],[360,640],[640,360]]){
 await page.setViewportSize({width,height});await fixture('forest',{x:2370,y:1900},{minute:1320,forestTutorialComplete:true,nightWarningSeen:true});assert.equal((await snap()).water.wading,true);await shot('night-water-'+width+'x'+height);
 for(const c of (await snap()).controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=width&&c.y+c.h<=height,c.id);
 const c=(await snap()).controls.find(c=>c.id==='move-right'),x=(await snap()).state.position.x;const touch=await ctx.newCDPSession(page);await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:c.x+c.w/2,y:c.y+c.h/2}]});await page.waitForTimeout(250);await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(80);assert.ok((await snap()).state.position.x>x+10);await touch.detach();
 await key('Escape');await click('Return to title');await click('Credits');const firstBounds=(await snap()).menuBounds;assert.ok(firstBounds.x>=0&&firstBounds.y>=0&&firstBounds.x+firstBounds.w<=width&&firstBounds.y+firstBounds.h<=height);await shot('credits-'+width+'x'+height);await click('Wildlife & ruins');await shot('craftpix-credits-'+width+'x'+height);const b=(await snap()).menuBounds;assert.ok(b.x>=0&&b.y>=0&&b.x+b.w<=width&&b.y+b.h<=height);viewports.push([width,height]);
}
await page.setViewportSize({width:1280,height:720});await fixture('forest',{x:2370,y:1900},{minute:1320,forestTutorialComplete:true,nightWarningSeen:true});await key('Escape');await click('Save');await page.goto(base+'?qa&renderer=webgl');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day 1');assert.equal((await snap()).water.wading,true);await shot('webgl-night-water');
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);assert.deepEqual(failedRequests,[]);assert.deepEqual(foreignRequests,[]);
const result={result:'PASS',riverCrossingWithoutBridge:true,waterfallTraversal:true,homeFarmPonds:true,wetSaveContinue:true,nativeBoarCombatAndSave:true,woodlandSpecies:['deer','hare','fox','grouse'],ruinsAndPlants:true,viewports,canvasAndWebGL:true,errors,warnings,failedRequests,foreignRequests};await writeFile(out+'/results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await ctx.close();await browser.close();
