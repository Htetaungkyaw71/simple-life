import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {walkable} from '../../src/data/locations.js';
import {PLOTS} from '../../src/data/crops.js';
import {newState} from '../../src/systems/state.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4173/';
const out='docs/verification/stabilization';await mkdir(out,{recursive:true});
const ctx=await browser.newContext({viewport:{width:1280,height:720},hasTouch:true}),page=await ctx.newPage(),errors=[],warnings=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='warning')warnings.push(m.text());});
const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
async function click(id){const b=(await snap()).controls.find(c=>c.id===id);assert.ok(b&&!b.disabled,id);await page.mouse.click(b.x+b.w/2,b.y+b.h/2);await page.waitForTimeout(80);}
async function key(k){await page.keyboard.press(k,{delay:40});await page.waitForTimeout(80);}
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
await page.goto(base+'?qa&collisions');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('New Game');await click('Play as Boy');
assert.equal((await snap()).collisionDebug,base.includes('5174'),'collision debug DEV-only');
await navigate(544,548);await use();assert.equal((await snap()).state.inventory.seed,3);await use();assert.equal((await snap()).state.inventory.seed,3);await shot('starter-crate');
const sides=[];
for(const [name,x,y,k,axis,limit,relation]of [
 ['left',384,400,'ArrowRight','x',400,'max'],['right',584,400,'ArrowLeft','x',560,'min'],['behind',480,288,'ArrowDown','y',308,'max'],['front-left',424,480,'ArrowUp','y',444,'min'],['front-right',536,480,'ArrowUp','y',444,'min'],
]){await navigate(x,y);await hold(k,350);const p=(await snap()).state.position;assert.ok(relation==='max'?p[axis]<=limit+.1:p[axis]>=limit-.1,name);sides.push({name,position:p});await use();assert.equal((await snap()).state.area,'home');}
await navigate(440,448);await use();assert.equal((await snap()).state.area,'home','window is not an entrance');await navigate(480,450);assert.equal((await snap()).context.label,'Enter house');await shot('house-porch');await use();assert.equal((await snap()).state.area,'interior');await shot('home-interior');await use();assert.equal((await snap()).state.area,'home');assert.ok(walkable('home',...(Object.values((await snap()).state.position))));await reloadContinue();assert.equal((await snap()).state.starterSeedsClaimed,true);
console.log('House sides, porch, door and starter persistence passed');
async function toField(){const s=await snap();if(s.state.area==='interior'){await navigate(480,464);await use();}if((await snap()).state.area==='home'){await navigate(880,640);await use();}assert.equal((await snap()).state.area,'farm');await navigate(PLOTS[0].x,PLOTS[0].y);}
async function toBed(){if((await snap()).state.area==='farm'){await navigate(180,270);await use();}await navigate(480,450);await use();assert.equal((await snap()).state.area,'interior');await navigate(315,300);await use();}
await toField();await key('1');assert.equal((await snap()).context.label,'Plant seed');await use();assert.equal((await snap()).state.plots[0].crop,'tomato');assert.equal((await snap()).state.inventory.seed,2);await shot('active-field');
await navigate(1856,640);await key('2');assert.equal((await snap()).context.label,'Refill watering can');await hold('ArrowDown',300);assert.ok((await snap()).state.position.y<=648,'north shore blocks water accurately');await use();await shot('pond-refill');
for(const [x,y]of [[1648,608],[2064,608],[2064,928],[1648,928],[1648,608]])await navigate(x,y);
await navigate(865,275);assert.equal((await snap()).context.type,'dialog');await use();assert.equal((await snap()).state.area,'farm');await click('See you around');
await toField();await key('2');await use();assert.equal((await snap()).state.plots[0].morning,true);await toBed();await click('Rest until evening');await toField();await key('2');await use();assert.equal((await snap()).state.plots[0].evening,true);await toBed();await click('Sleep / next day');assert.equal((await snap()).state.plots[0].growth,1);await reloadContinue();assert.equal((await snap()).state.plots[0].growth,1);
await navigate(480,464);await use();await navigate(544,548);await use();assert.equal((await snap()).state.inventory.seed,2,'starter does not duplicate after crop/save/reload');
for(let n=2;n<=3;n++){await toField();await key('2');await use();await toBed();await click('Rest until evening');await toField();await key('2');await use();await toBed();await click('Sleep / next day');assert.equal((await snap()).state.plots[0].growth,n);console.log('Growth day '+n+' passed');}
await toField();await key('3');assert.equal((await snap()).context.label,'Harvest');await shot('mature-crop');await use();assert.equal((await snap()).state.inventory.tomato,2);assert.equal((await snap()).state.plots[0].crop,null);await reloadContinue();
// Real touch movement and interaction; unchanged viewport/camera style.
const viewportResults=[];
await navigate(720,560);
for(const [width,height]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844]]){await page.setViewportSize({width,height});await page.waitForTimeout(160);const s=await snap();for(const c of s.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=width&&c.y+c.h<=height,c.id);const size=await page.evaluate(()=>[document.querySelector('canvas').clientWidth,document.querySelector('canvas').clientHeight,document.documentElement.scrollWidth,document.documentElement.scrollHeight]);assert.deepEqual(size,[width,height,width,height]);await shot('farm-'+width+'x'+height);viewportResults.push([width,height]);}
const cdp=await ctx.newCDPSession(page),control=(await snap()).controls.find(c=>c.id==='move-right'),before=(await snap()).state.position.x;
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:control.x+control.w/2,y:control.y+control.h/2}]});await page.waitForTimeout(180);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok((await snap()).state.position.x>before+15);await click('tool-water');assert.equal((await snap()).state.selected,'water');
await key('Escape');await click('Return to title');await click('New Game');await click('Start fresh');await click('Play as Girl');assert.equal((await snap()).state.starterSeedsClaimed,false);
await page.setViewportSize({width:1280,height:720});await navigate(1280,608);
const animationFrames={};for(const [k,dir,row]of [['ArrowLeft','left',2],['ArrowUp','up',1],['ArrowRight','right',3],['ArrowDown','down',0]]){const frames=new Set();await page.keyboard.down(k);for(let n=0;n<16;n++){await page.waitForTimeout(40);frames.add(Number((await snap()).player.frame));}await page.keyboard.up(k);await page.waitForTimeout(50);assert.equal((await snap()).player.direction,dir);assert.ok([1,2,3,4].every(f=>frames.has(row*6+f)),dir);animationFrames[dir]=[...frames];}
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);
const result={result:'PASS',base,house:sides,doorEntryExit:true,starterOnce:true,cropLoop:'3 growth days, 2 harvested tomatoes, save/refresh/Continue',pondPerimeter:true,refill:true,cityClosed:true,touch:true,viewports:viewportResults,girlAnimationFrames:animationFrames,errors,warnings};await writeFile(`${out}/${base.includes('5174')?'development':'production'}-results.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result));await ctx.close();await browser.close();
