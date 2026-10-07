import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {walkable,syncInterior} from '../../src/data/locations.js';
import {PLOTS} from '../../src/data/crops.js';
import {newState} from '../../src/systems/state.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4175/';
const out=process.env.QA_OUTPUT||'docs/verification/forest-growth/final';await mkdir(out,{recursive:true});
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





await page.setViewportSize({width:390,height:844});await fixture('forest',{x:900,y:4624},{minute:600,forestTutorialComplete:true});
const controls=(await snap()).controls,right=controls.find(c=>c.id==='move-right'),jump=controls.find(c=>c.id==='jump');const point=(c,id)=>({x:c.x+c.w/2,y:c.y+c.h/2,id});const touch=await ctx.newCDPSession(page);await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(right,0)]});await page.waitForTimeout(100);await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(right,0),point(jump,1)]});await page.waitForTimeout(120);const j=(await snap()).jump.active;assert.ok(j);assert.ok(j.destination.x>j.origin.x);assert.equal(j.destination.y,j.origin.y);await shot('two-finger-directional-jump');await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point(right,0)]});await page.waitForTimeout(750);assert.equal((await snap()).jump.active,null);assert.ok((await snap()).state.position.x>j.destination.x+10,'movement finger remains held after jump finger lifts');await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await touch.detach();
await fixture('forest',{x:640,y:4848},{minute:600,forestTutorialComplete:true});const origin=(await snap()).state.position;await page.keyboard.down('j');for(let n=0;n<6;n++){await page.waitForTimeout(200);await page.keyboard.down('j');}await page.keyboard.up('j');assert.equal((await snap()).jump.active,null);assert.ok((await snap()).state.position.y-origin.y<=128.1,'held repeat cannot chain jumps');await shot('single-jump-key-repeat');
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);assert.deepEqual(failedRequests,[]);assert.deepEqual(foreignRequests,[]);await writeFile(out+'/results.json',JSON.stringify({passed:true,twoFingerDirectionalJump:true,movementPersistsAfterJumpTouchRelease:true,heldKeyRepeatNoChain:true,errors,warnings,failedRequests,foreignRequests},null,2));await ctx.close();await browser.close();console.log('PASS final directional touch / release / key repeat');
