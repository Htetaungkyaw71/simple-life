import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {walkable} from '../../src/data/locations.js';
import {PLOTS} from '../../src/data/crops.js';
import {newState} from '../../src/systems/state.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4173/';
const out='docs/verification/foundation-repair';await mkdir(out,{recursive:true});
const ctx=await browser.newContext({viewport:{width:1280,height:720},hasTouch:true}),page=await ctx.newPage(),errors=[],warnings=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='warning')warnings.push(m.text());});
const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
async function click(id){const b=(await snap()).controls.find(c=>c.id===id);assert.ok(b&&!b.disabled,id);await page.mouse.click(b.x+b.w/2,b.y+b.h/2);await page.waitForTimeout(80);}
async function key(k){await page.keyboard.press(k,{delay:40});await page.waitForTimeout(360);}
async function hold(k,ms){await page.keyboard.down(k);await page.waitForTimeout(ms);await page.keyboard.up(k);await page.waitForTimeout(40);const s=await snap();assert.ok(walkable(s.state.area,s.state.position.x,s.state.position.y),'runtime stays in valid collision space');}
async function move(x,y){for(const [axis,target,neg,pos]of [['x',x,'ArrowLeft','ArrowRight'],['y',y,'ArrowUp','ArrowDown']])for(let n=0;n<5;n++){const d=target-(await snap()).state.position[axis];if(Math.abs(d)<5)break;await hold(d<0?neg:pos,Math.max(20,Math.abs(d)/260*1000));}const p=(await snap()).state.position;assert.ok(Math.hypot(p.x-x,p.y-y)<12,`move ${JSON.stringify(p)} -> ${x},${y}`);}
async function navigate(x,y){
 const s=await snap(),area=s.state.area,p=s.state.position;let start=[Math.round(p.x/16)*16,Math.round(p.y/16)*16];
 if(!walkable(area,...start,16)){const nearby=[];for(let yy=-2;yy<=2;yy++)for(let xx=-2;xx<=2;xx++){const v=[start[0]+xx*16,start[1]+yy*16];if(walkable(area,...v,16))nearby.push(v);}nearby.sort((a,b)=>Math.hypot(a[0]-p.x,a[1]-p.y)-Math.hypot(b[0]-p.x,b[1]-p.y));start=nearby[0];}
 await move(...start);const q=[start],from=new Map([[start.join(','),null]]);let goal;
 for(let i=0;i<q.length;i++){const v=q[i];if(Math.hypot(v[0]-x,v[1]-y)<10){goal=v;break;}for(const [dx,dy]of [[16,0],[-16,0],[0,16],[0,-16]]){const n=[v[0]+dx,v[1]+dy],k=n.join(',');if(!from.has(k)&&walkable(area,...n,16)&&walkable(area,v[0]+dx/2,v[1]+dy/2,16)){from.set(k,v);q.push(n);}}}
 assert.ok(goal,`route ${area} ${x},${y}`);const route=[];for(let v=goal;v;v=from.get(v.join(',')))route.push(v);route.reverse();
 for(let i=1;i<route.length;i++){const before=route[i-1],v=route[i],next=route[i+1];if(!next||v[0]-before[0]!==next[0]-v[0]||v[1]-before[1]!==next[1]-v[1])await move(...v);}
 await move(x,y);
}
const shot=name=>page.screenshot({path:`${out}/${name}.png`});const use=()=>key('e');
async function reloadContinue(){const day=(await snap()).state.day;await key('Escape');await click('Save');const saved=(await snap()).state;await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day '+day);const loaded=(await snap()).state;for(const k of ['version','character','area','money','inventory','plots','starterSeedsClaimed','health','energy'])assert.deepEqual(loaded[k],saved[k],k);}

async function fixture(area,position){const s=newState();s.area=area;s.position=position;await page.goto(base+'?qa');await page.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day 1');await page.waitForTimeout(200);}
const sides=[];
for(const [name,x,y,key]of [['left',380,400,'ArrowRight'],['right',584,400,'ArrowLeft'],['top',480,288,'ArrowDown'],['bottom',480,480,'ArrowUp'],['northwest',430,344,'ArrowRight'],['northeast',548,336,'ArrowLeft'],['southwest',424,480,'ArrowUp'],['southeast',536,480,'ArrowUp']]){
 await fixture('home',{x,y});await hold(key,500);const before=(await snap()).state.position;await hold(key,250);const after=(await snap()).state.position;assert.ok(Math.hypot(before.x-after.x,before.y-after.y)<4,name);if(!(await snap()).context?.to){await use();assert.equal((await snap()).state.area,'home');}await shot('house-'+name);sides.push({name,position:after});
}
await fixture('home',{x:480,y:492});assert.equal((await snap()).context.to,'interior');await use();assert.equal((await snap()).state.area,'interior');await navigate(672,700);await use();assert.equal((await snap()).state.area,'home');assert.ok((await snap()).state.position.y>=500);await reloadContinue();await shot('safe-house-exit');
console.log('House sides, corners, door, exit and save passed');
await fixture('home',{x:880,y:640});assert.notEqual((await snap()).context?.to,'farm');await use();assert.equal((await snap()).state.area,'home');
await fixture('home',{x:480,y:1000});await hold('ArrowDown',300);assert.equal((await snap()).state.area,'home');await shot('south-path');await hold('ArrowDown',300);await page.waitForTimeout(400);assert.equal((await snap()).state.area,'farm');assert.equal((await snap()).player.direction,'down');await shot('farm-north-arrival');await page.waitForTimeout(750);await hold('ArrowUp',650);await page.waitForTimeout(400);assert.equal((await snap()).state.area,'home');assert.equal((await snap()).player.direction,'up');await page.waitForTimeout(900);assert.equal((await snap()).state.area,'home');
console.log('Both edge transitions and no bounce passed');
const sizes=[];
for(const[width,height]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844]]){
 await page.setViewportSize({width,height});
 for(const[target,x,y]of [['entrance',672,608],['bed',320,320],['exit',672,700]]){
  await fixture('interior',{x,y});const s=await snap();assert.equal(s.camera.zoom,1);const px=x-s.camera.x,py=y-s.camera.y;assert.ok(px>24&&px<width-24&&py>64&&py<height-20,`${width} ${target} visible`);
  for(const c of s.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=width&&c.y+c.h<=height,c.id);
  if(s.prompt){const q=s.prompt;assert.ok(!(px+24>q.x&&px-24<q.x+q.w&&py>q.y&&py-60<q.y+q.h),`${width} ${target} prompt overlap`);assert.equal(q.h,28);}
  await shot(`interior-${target}-${width}x${height}`);
  if(target==='bed'){await use();assert.ok((await snap()).menu);await click('Sleep / next day');assert.equal((await snap()).state.day,2);}
  if(target==='exit'){await use();assert.equal((await snap()).state.area,'home');}
 }
 sizes.push([width,height]);
}
console.log('All five interior viewports and bed/exit passed');
await page.setViewportSize({width:1280,height:720});await fixture('interior',{x:672,y:608});
for(const [x,y]of [[96,672],[96,160],[1216,352],[1216,672],[672,700]])await navigate(x,y);
// Real movement against every solid furniture footprint from an adjacent free point.
const {ROOM_SOLIDS}=await import('../../src/data/interior.js');
for(const[x,y,w,h]of ROOM_SOLIDS.slice(5)){
 const candidates=[{x:x+w/2,y:y+h+24,key:'ArrowUp'},{x:x-24,y:y+h/2,key:'ArrowRight'},{x:x+w+24,y:y+h/2,key:'ArrowLeft'}];const p=candidates.find(p=>walkable('interior',p.x,p.y));if(!p)continue;await fixture('interior',p);await hold(p.key,250);const a=(await snap()).state.position;await hold(p.key,180);assert.ok(Math.hypot(a.x-(await snap()).state.position.x,a.y-(await snap()).state.position.y)<4);
}
await fixture('interior',{x:96,y:352});await hold('ArrowLeft',350);assert.ok((await snap()).state.position.x>=76);
await fixture('interior',{x:672,y:700});await hold('ArrowDown',350);assert.ok((await snap()).state.position.y<=736);
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);const result={result:'PASS',sides,edgeTravel:true,doorAndSave:true,furnitureAndWalls:true,viewports:sizes,errors,warnings};await writeFile(`${out}/results.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result));await ctx.close();await browser.close();
