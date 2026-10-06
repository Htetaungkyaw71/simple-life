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

await page.setViewportSize({width:390,height:844});await fixture('home',{x:480,y:1080});await page.waitForTimeout(750);
const cdp=await ctx.newCDPSession(page);
async function touch(id,ms=80){const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c,id);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:c.x+c.w/2,y:c.y+c.h/2}]});await page.waitForTimeout(ms);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(350);}
await touch('move-down',500);let s=await snap();assert.equal(s.state.area,'farm');assert.equal(s.player.direction,'down');assert.equal(s.state.position.y,64);await page.waitForTimeout(750);await touch('move-up',500);s=await snap();assert.equal(s.state.area,'home');assert.equal(s.player.direction,'up');assert.equal(s.state.position.y,1088);await page.waitForTimeout(800);assert.equal((await snap()).state.area,'home');await shot('touch-edge-return');
await fixture('interior',{x:672,y:700});assert.ok((await snap()).prompt);await touch('use');assert.equal((await snap()).state.area,'home');assert.equal((await snap()).state.position.y,528);assert.equal((await snap()).prompt,null);await shot('touch-house-exit');
await fixture('home',{x:480,y:400});s=await snap();assert.ok(walkable('home',s.state.position.x,s.state.position.y));assert.ok(Math.hypot(s.state.position.x-480,s.state.position.y-400)<96);await reloadContinue();
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);const result={result:'PASS',touchEdgeRoundTrip:true,spawnTwoTilesInside:true,touchDoor:true,promptHiddenOutOfRange:true,unsafeSaveRepair:true,errors,warnings};await writeFile(`${out}/final-touch-results.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result));await ctx.close();await browser.close();
