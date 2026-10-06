import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {walkable,syncInterior} from '../../src/data/locations.js';
import {PLOTS} from '../../src/data/crops.js';
import {newState} from '../../src/systems/state.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4173/';
const out=process.env.QA_OUTPUT||'docs/verification/farming-information';await mkdir(out,{recursive:true});
const ctx=await browser.newContext({viewport:{width:1280,height:720},hasTouch:true}),page=await ctx.newPage(),errors=[],warnings=[];
page.on('response',r=>{if(r.status()>=400)console.log('HTTP '+r.status()+' '+r.url());});
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='warning')warnings.push(m.text());if(m.type()==='error')errors.push(m.text());});
const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
async function click(id){const b=(await snap()).controls.find(c=>c.id===id);assert.ok(b&&!b.disabled,id);await page.mouse.click(b.x+b.w/2,b.y+b.h/2);await page.waitForTimeout(80);}
async function key(k){await page.keyboard.press(k,{delay:40});await page.waitForTimeout(360);}
async function hold(k,ms){await page.keyboard.down(k);await page.waitForTimeout(ms);await page.keyboard.up(k);await page.waitForTimeout(40);const s=await snap();assert.ok(walkable(s.state.area,s.state.position.x,s.state.position.y),'runtime stays in valid collision space');}
async function move(x,y){for(const [axis,target,neg,pos]of [['x',x,'ArrowLeft','ArrowRight'],['y',y,'ArrowUp','ArrowDown']])for(let n=0;n<5;n++){const d=target-(await snap()).state.position[axis];if(Math.abs(d)<5)break;await hold(d<0?neg:pos,Math.max(20,Math.abs(d)/((await snap()).state.area==='interior'?130:260)*1000));}const p=(await snap()).state.position;assert.ok(Math.hypot(p.x-x,p.y-y)<12,`move ${JSON.stringify(p)} -> ${x},${y}`);}
async function navigate(x,y){
 const s=await snap(),area=s.state.area,p=s.state.position;let start=[Math.round(p.x/16)*16,Math.round(p.y/16)*16];
 if(!walkable(area,...start,16)){const nearby=[];for(let yy=-2;yy<=2;yy++)for(let xx=-2;xx<=2;xx++){const v=[start[0]+xx*16,start[1]+yy*16];if(walkable(area,...v,16))nearby.push(v);}nearby.sort((a,b)=>Math.hypot(a[0]-p.x,a[1]-p.y)-Math.hypot(b[0]-p.x,b[1]-p.y));start=nearby[0];}
 await move(...start);const q=[start],from=new Map([[start.join(','),null]]);let goal;
 for(let i=0;i<q.length;i++){const v=q[i];if(Math.hypot(v[0]-x,v[1]-y)<12){goal=v;break;}for(const [dx,dy]of [[16,0],[-16,0],[0,16],[0,-16]]){const n=[v[0]+dx,v[1]+dy],k=n.join(',');if(!from.has(k)&&walkable(area,...n,16)&&walkable(area,v[0]+dx/2,v[1]+dy/2,16)){from.set(k,v);q.push(n);}}}
 assert.ok(goal,`route ${area} ${x},${y}`);const route=[];for(let v=goal;v;v=from.get(v.join(',')))route.push(v);route.reverse();
 for(let i=1;i<route.length;i++){const before=route[i-1],v=route[i],next=route[i+1];if(!next||v[0]-before[0]!==next[0]-v[0]||v[1]-before[1]!==next[1]-v[1])await move(...v);}
 await move(x,y);
}
const shot=name=>page.screenshot({path:`${out}/${name}.png`});const use=()=>key('e');
async function reloadContinue(){const day=(await snap()).state.day;await key('Escape');await click('Save');const saved=(await snap()).state;await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day '+day);const loaded=(await snap()).state;for(const k of ['version','character','area','money','inventory','plots','starterSeedsClaimed','hasVisitedFarm','health','energy'])assert.deepEqual(loaded[k],saved[k],k);}

async function fixture(area,position,extra={}){syncInterior(page.viewportSize().width,page.viewportSize().height);const s=newState();s.area=area;s.position=position;Object.assign(s,extra);await page.goto(base+'?qa');await page.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day 1');await page.waitForTimeout(200);}

await page.goto(base+'?qa');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('New Game');await click('Play as Girl');
await navigate(544,548);await use();assert.equal((await snap()).state.inventory.seed,3);assert.equal((await snap()).farmGuide.objective,true);assert.equal((await snap()).farmGuide.expanded,true);assert.equal((await snap()).farmGuide.waypoint.target.y,1136);await shot('starter-objective');
async function toField(){
 let s=await snap();if(s.state.area==='interior'){await navigate(s.room.exit.x,s.room.exit.y);await use();}
 if((await snap()).state.area==='home'){await navigate(480,1088);await hold('ArrowDown',200);await page.waitForTimeout(350);}
 assert.equal((await snap()).state.area,'farm');assert.equal((await snap()).state.hasVisitedFarm,true);assert.equal((await snap()).farmGuide.waypoint,null);assert.equal((await snap()).farmGuide.objective,false);await navigate(PLOTS[0].x,PLOTS[0].y);
}
async function toBed(){
 if((await snap()).state.area==='farm'){await navigate(320,64);await hold('ArrowUp',200);await page.waitForTimeout(350);}
 await navigate(480,492);await use();assert.equal((await snap()).state.area,'interior');const s=await snap();syncInterior(page.viewportSize().width,page.viewportSize().height);await navigate(s.room.bed.x,s.room.bed.y);await use();
}
if(!process.env.SKIP_LOOP){
await toField();for(let i=0;i<PLOTS.length;i++){await navigate(PLOTS[i].x,PLOTS[i].y);assert.equal((await snap()).context.index,i);}
await navigate(PLOTS[0].x,PLOTS[0].y);await key('1');await use();assert.equal((await snap()).state.plots[0].crop,'tomato');assert.equal((await snap()).cropInfo.stage,1);assert.equal((await snap()).cropInfo.condition,'Newly planted');await shot('seed');await key('2');await use();assert.equal((await snap()).state.plots[0].morning,true);assert.equal((await snap()).cropInfo.care[0].label,'Watered');await shot('sprout');
for(let day=1;day<=3;day++){
 if(day>1){await toField();await key('2');await use();}
 await toBed();await click('Rest until evening');await toField();await key('2');await use();assert.equal((await snap()).state.plots[0].evening,true);assert.equal((await snap()).cropInfo.condition,'Fully watered today');assert.equal((await snap()).cropInfo.remaining,4-day);await shot('growing-'+day);await toBed();await click('Sleep / next day');assert.equal((await snap()).state.plots[0].growth,day);await reloadContinue();console.log('Growing night '+day+' / save passed');
}
await toField();await key('3');assert.equal((await snap()).cropInfo.timer,'Ready to harvest');await shot('ripe');await use();assert.equal((await snap()).state.inventory.tomato,2);assert.equal((await snap()).state.plots[0].crop,null);assert.equal((await snap()).cropInfo,null);await reloadContinue();
assert.equal((await snap()).state.expansionUnlocked,false);await navigate(304,712);assert.equal((await snap()).context.type,'field');await use();assert.equal((await snap()).menu,'dialog');await click('Not now');await shot('expansion-field');await navigate(448,736);await key('1');assert.notEqual((await snap()).context?.type,'plot');const seeds=(await snap()).state.inventory.seed;await use();assert.equal((await snap()).state.inventory.seed,seeds);if((await snap()).menu)await click('Not now');
console.log('Full crop loop, all sixteen targets and locked expansion passed');
}
const shedResults=[];
for(const[name,x,y,key]of [['front',896,772,'ArrowUp'],['back',896,670,'ArrowDown'],['left',832,720,'ArrowRight'],['right',960,720,'ArrowLeft'],['upper-left',860,670,'ArrowDown'],['upper-right',932,670,'ArrowDown'],['lower-left',852,764,'ArrowUp'],['lower-right',940,764,'ArrowUp']]){
 await fixture('farm',{x,y});await hold(key,350);const p=(await snap()).state.position;await hold(key,220);const q=(await snap()).state.position;assert.ok(Math.hypot(q.x-p.x,q.y-p.y)<4,name);await shot('shed-'+name);shedResults.push({name,position:q});
}
await fixture('home',{x:896,y:672});await hold('ArrowDown',400);assert.ok((await snap()).state.position.y>750);await shot('open-road-gate');await fixture('home',{x:784,y:680});await hold('ArrowDown',350); // open ground beside closed fence
await fixture('home',{x:1000,y:680});await hold('ArrowDown',350);assert.ok((await snap()).state.position.y<=716);await fixture('home',{x:448,y:616});assert.equal((await snap()).context.type,'hint');await use();assert.equal((await snap()).state.area,'home');assert.equal((await snap()).menu,null);await shot('farm-sign');
const viewportResults=[];
for(const[width,height]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844]]){
 await page.setViewportSize({width,height});syncInterior(width,height);const {ROOM}=await import('../../src/data/interior.js');
 await fixture('interior',{...ROOM.spawn});let s=await snap();assert.equal(s.camera.zoom,2);assert.equal(s.player.height,64);await shot('interior-'+width+'x'+height);
 await navigate(s.room.bed.x,s.room.bed.y);assert.equal((await snap()).context.type,'bed');await use();await click('Not yet');s=await snap();await navigate(s.room.exit.x,s.room.exit.y);await shot('indoor-door-'+width+'x'+height);await use();assert.equal((await snap()).state.area,'home');
 const crops=newState().plots;crops[0]={...crops[0],crop:'tomato',growth:1,morning:true};await fixture('farm',{x:376,y:248},{plots:crops});await shot('farm-'+width+'x'+height);assert.ok((await snap()).cropInfo,'crop panel at '+width);const ci=(await snap()).cropInfo;assert.ok(ci.x>=0&&ci.y>=0&&ci.x+ci.w<=width&&ci.y+ci.h<=height);s=await snap();for(const c of s.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=width&&c.y+c.h<=height,c.id);viewportResults.push({width,height,room:{width:ROOM.width,height:ROOM.height},zoom:2,playerPixels:64});
}
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);const result={result:'PASS',cropLoop:process.env.SKIP_LOOP?'SKIPPED (focused geometry/layout run)':'plant, two daily windows, three nights, harvest, save/reload',targetablePlots:process.env.SKIP_LOOP?null:16,expansionLocked:process.env.SKIP_LOOP?null:true,shedResults,roadGate:true,sign:true,viewportResults,errors,warnings};await writeFile(`${out}/results.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result));await ctx.close();await browser.close();
