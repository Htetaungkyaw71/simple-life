import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {LOCATIONS,walkable} from '../../src/data/locations.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),errors=[];await mkdir('docs/verification/craftsmanship',{recursive:true});
const visits={home:[[880,640,'homestead-gate'],[1160,368,'homestead-shed'],[1744,344,'homestead-cottage'],[1600,688,'homestead-pond'],[1024,880,'homestead-picnic']],farm:[[800,432,'farm-board'],[1040,576,'farm-four-fields'],[1536,568,'farm-orchard'],[1664,608,'farm-irrigation'],[2016,952,'farm-east-boundary']],city:[[864,366,'city-mira'],[1184,576,'city-fountain'],[1296,604,'city-ko'],[1496,880,'city-closed-shop'],[1792,930,'city-nell'],[2112,960,'city-east-boundary']]};
const report=[];
for(const [area,destinations]of Object.entries(visits)){
 const ctx=await browser.newContext({viewport:{width:1280,height:720}}),page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));const fixture=newState('girl');fixture.area=area;fixture.position={...LOCATIONS[area].spawn};await ctx.addInitScript(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),fixture);
 await page.goto((process.env.GAME_URL||'http://127.0.0.1:5174/')+'?qa');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
 async function click(id){const b=(await snap()).controls.find(c=>c.id===id);assert.ok(b,id);await page.mouse.click(b.x+b.w/2,b.y+b.h/2);await page.waitForTimeout(100);}
 await click('Continue / Day 1');
 async function moveTo(x,y){
  for(let tries=0;tries<5;tries++){const pos=(await snap()).state.position,dx=x-pos.x,dy=y-pos.y;if(Math.hypot(dx,dy)<5)return;const horizontal=Math.abs(dx)>Math.abs(dy),d=horizontal?dx:dy,key=horizontal?(d<0?'ArrowLeft':'ArrowRight'):(d<0?'ArrowUp':'ArrowDown');await page.keyboard.down(key);await page.waitForTimeout(Math.max(20,Math.abs(d)/260*1000));await page.keyboard.up(key);await page.waitForTimeout(25);}
  const p=(await snap()).state.position;assert.ok(Math.hypot(p.x-x,p.y-y)<12,`${area} movement stalled ${JSON.stringify(p)} -> ${x},${y}`);
 }
 async function navigate(x,y){
  const p=(await snap()).state.position;const start=[Math.round(p.x/16)*16,Math.round(p.y/16)*16];await moveTo(...start);
  const q=[start],from=new Map([[start.join(','),null]]);let goal;
  for(let i=0;i<q.length;i++){const v=q[i];if(Math.hypot(v[0]-x,v[1]-y)<24){goal=v;break;}for(const [dx,dy]of [[16,0],[-16,0],[0,16],[0,-16]]){const n=[v[0]+dx,v[1]+dy],key=n.join(',');if(!from.has(key)&&walkable(area,...n)&&walkable(area,v[0]+dx/2,v[1]+dy/2)){from.set(key,v);q.push(n);}}}
  assert.ok(goal,'reachable destination');const path=[];for(let v=goal;v;v=from.get(v.join(',')))path.push(v);path.reverse();let last=path[0];
  for(let i=1;i<path.length;i++){const v=path[i],next=path[i+1];if(!next||v[0]-last[0]!==next[0]-v[0]||v[1]-last[1]!==next[1]-v[1])await moveTo(...v);last=v;}
 }
 for(const [x,y,name]of destinations){await navigate(x,y);await page.waitForTimeout(100);const s=await snap();assert.ok(s.camera.x>=0&&s.camera.y>=0&&s.camera.x+s.camera.width<=2241&&s.camera.y+s.camera.height<=1153);await page.screenshot({path:`docs/verification/craftsmanship/${name}.png`});let dialog=null;if(s.context?.type==='dialog'){await page.keyboard.press('e');await page.waitForTimeout(100);assert.equal((await snap()).menu,'dialog');dialog=s.context.title;await page.screenshot({path:`docs/verification/craftsmanship/${name}-dialog.png`});await click('See you around');}report.push({area,name,position:s.state.position,camera:s.camera,dialog});console.log(name+' passed');}
 await ctx.close();
}
assert.deepEqual(errors,[]);await writeFile('docs/verification/craftsmanship/exploration.json',JSON.stringify({result:'PASS',visits:report,errors},null,2));await browser.close();
