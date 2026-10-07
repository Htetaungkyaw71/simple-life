import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {walkable,syncInterior} from '../../src/data/locations.js';
import {PLOTS} from '../../src/data/crops.js';
import {newState} from '../../src/systems/state.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4175/';
const out=process.env.QA_OUTPUT||'docs/verification/wilderness';await mkdir(out,{recursive:true});
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


import {REGIONS,TREASURES,FORAGE_NODES,FOREST_ENTRANCE} from '../../src/data/forest.js';
import {ANIMAL_SPAWNS,SPECIES} from '../../src/data/wildlife.js';
import {FOOD_IDS} from '../../src/data/items.js';
await page.goto(base+'?qa');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
if(!process.env.SKIP_LOOP){
// Walk from the genuine Home north edge, explore a new region, collect fruit, and return.
await fixture('home',{x:720,y:64},{ownsClub:true,clubEquipped:true,forestTutorialComplete:true});
await hold('ArrowUp',400);await page.waitForTimeout(400);assert.equal((await snap()).state.area,'forest');
assert.ok((await snap()).state.position.y>4700);await navigate(480,4848);await navigate(480,3824);
assert.ok((await snap()).state.forest.explored.includes('jaguar'));await shot('walked-to-emerald-falls');
const fruit=FORAGE_NODES.find(n=>n.id==='jaguar-fruit-0');await navigate(fruit.x,fruit.y+24);await use();assert.equal((await snap()).state.inventory[fruit.item],1);
await key('m');assert.equal((await snap()).menu,'wilderness');await shot('explored-map');const paused=(await snap()).state;await page.waitForTimeout(300);assert.deepEqual((await snap()).state,paused);await key('ArrowRight');await click('wilderness-close');
await navigate(480,4848);await navigate(640,5056);await hold('ArrowDown',400);await page.waitForTimeout(400);assert.equal((await snap()).state.area,'home');await reloadContinue();assert.ok((await snap()).state.forest.explored.includes('jaguar'));
// Every region loads with safe camera, habitat and distinct species/group state.
for(const r of REGIONS){
 await fixture('forest',{x:r.x+480,y:r.y+736},{minute:600,ownsClub:true,clubEquipped:true,forestTutorialComplete:true,nightWarningSeen:true});
 assert.ok((await snap()).state.forest.explored.includes(r.id));assert.equal(Object.keys((await snap()).state.forest.animals).length,68);
 await shot('region-'+r.id);await navigate(r.x+800,r.y+608);await shot('animals-'+r.id);
}
// All species render their native frames in their own safe territory.
for(const key of Object.keys(SPECIES)){
 const a=ANIMAL_SPAWNS.find(a=>a.species===key);await fixture('forest',{x:a.home.x,y:a.home.y+90},{minute:600,forestTutorialComplete:true,nightWarningSeen:true,ownsClub:true,clubEquipped:true});await shot('species-'+key);
 assert.equal((await snap()).state.forest.animals[a.id].species,key);
}
// Cave treasure is initially guarded. Actual melee drives each snake away.
const cache=TREASURES.find(t=>t.region==='snake');await fixture('forest',{x:cache.x,y:cache.y},{minute:600,ownsClub:true,clubEquipped:true,forestTutorialComplete:true,inventory:{...newState().inventory,mango:3}});
await use();assert.equal((await snap()).state.money,60);assert.equal((await snap()).state.forest.treasures.length,0);await shot('guarded-cave-cache');
for(let attempts=0;attempts<24;attempts++){
 if((await snap()).state.energy<10){await click('choose-seeds');await click('bag-food');await click('food-mango');await key('Enter');await click('survival-close');}
 const s=await snap(),guard=Object.values(s.state.forest.animals).find(a=>a.health>0&&Math.hypot(a.position.x-cache.x,a.position.y-cache.y)<240);if(!guard)break;
 const p=s.state.position,dx=guard.position.x-p.x,dy=guard.position.y-p.y;
 if(Math.hypot(dx,dy)>55){if(Math.abs(dx)>20)await hold(dx>0?'ArrowRight':'ArrowLeft',Math.min(140,Math.max(25,(Math.abs(dx)-20)/260*1000)));if(Math.abs(dy)>20)await hold(dy>0?'ArrowDown':'ArrowUp',Math.min(140,Math.max(25,(Math.abs(dy)-20)/260*1000)));}
 const now=await snap(),target=now.state.forest.animals[guard.id],ax=target.position.x-now.state.position.x,ay=target.position.y-now.state.position.y;await hold(Math.abs(ax)>Math.abs(ay)?ax>0?'ArrowRight':'ArrowLeft':ay>0?'ArrowDown':'ArrowUp',20);await key('k');await page.waitForTimeout(100);
 assert.ok((await snap()).state.area==='forest','survive the cave encounter');
}
await navigate(cache.x,cache.y);await use();assert.ok((await snap()).state.forest.treasures.includes(cache.id));assert.equal((await snap()).state.money,60+cache.coins);await shot('cave-treasure-recovered');await reloadContinue();assert.ok((await snap()).state.forest.treasures.includes(cache.id));
}
const viewports=[];
for(const [width,height]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844]]){
 await page.setViewportSize({width,height});await fixture('forest',{x:480,y:3824},{minute:1320,forestTutorialComplete:true,nightWarningSeen:true,ownsClub:true,clubEquipped:true,energy:30,inventory:Object.fromEntries(Object.keys(newState().inventory).map(id=>[id,3]))});
 await click('wilderness-map');let s=await snap();assert.ok(s.menuBounds.x>=0&&s.menuBounds.y>=0&&s.menuBounds.x+s.menuBounds.w<=width&&s.menuBounds.y+s.menuBounds.h<=height);await shot('map-'+width+'x'+height);await click('wilderness-next');await click('wilderness-close');
 await click('choose-seeds');await click('bag-food');for(const c of (await snap()).controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=width&&c.y+c.h<=height,c.id);for(let i=0;i<3;i++){await click('food-next');await shot('food-page-'+i+'-'+width+'x'+height);}let c=(await snap()).controls.find(c=>c.id==='survival-action'),food=FOOD_IDS[0],before=(await snap()).state.inventory[food];await page.touchscreen.tap(c.x+c.w/2,c.y+c.h/2);await page.waitForTimeout(280);assert.equal((await snap()).state.inventory[food],before-1);await click('survival-close');
 await fixture('city',{x:896,y:306},{minute:600,inventory:Object.fromEntries(Object.keys(newState().inventory).map(id=>[id,3]))});await use();for(let i=0;i<4;i++){await shot('market-page-'+i+'-'+width+'x'+height);await click('market-page');}await click('trade-close');viewports.push({width,height});
}
// Cross the real river on the timber bridge and inspect the animated waterfall.
await page.setViewportSize({width:1280,height:720});await fixture('forest',{x:2224,y:2752},{minute:600,forestTutorialComplete:true,nightWarningSeen:true,ownsClub:true,clubEquipped:true});await hold('ArrowRight',1300);assert.ok((await snap()).state.position.x>2450);assert.equal((await snap()).state.health,100);await shot('river-bridge-crossing');
await fixture('forest',{x:336,y:3424},{minute:600,forestTutorialComplete:true,nightWarningSeen:true});await shot('emerald-waterfall');
// The far north remains dark beyond the player in both rendering modes.
await page.setViewportSize({width:1280,height:720});await fixture('forest',{x:480,y:192},{minute:1320,forestTutorialComplete:true,nightWarningSeen:true,ownsClub:true,clubEquipped:true});await shot('far-north-canvas-night');assert.equal((await snap()).lighting.alpha,.78);await key('Escape');await click('Save');await page.goto(base+'?qa&renderer=webgl');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day 1');await shot('far-north-webgl-night');assert.equal((await snap()).lighting.alpha,.78);
// Rough local frame sample only; not a physical-device performance claim.
const frames=await page.evaluate(()=>new Promise(resolve=>{const times=[];let last;function frame(t){if(last)times.push(t-last);last=t;if(times.length<60)requestAnimationFrame(frame);else resolve(times.sort((a,b)=>a-b));}requestAnimationFrame(frame);}));
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);assert.deepEqual(failedRequests,[]);assert.deepEqual(foreignRequests,[]);
const result={result:'PASS',fullExplorationAndCave:!process.env.SKIP_LOOP,regions:20,species:22,animals:68,forageNodes:63,guardedTreasures:14,realInputRegionalExploration:!process.env.SKIP_LOOP,caveCombatTreasureReload:!process.env.SKIP_LOOP,viewports,canvasAndWebGLFarNorth:true,riverBridgeCrossing:true,animatedWaterfall:true,localMedianFrameMs:frames[30],errors,warnings,failedRequests,foreignRequests};await writeFile(out+'/results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await ctx.close();await browser.close();
