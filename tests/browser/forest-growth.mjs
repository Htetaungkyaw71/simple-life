import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {walkable,syncInterior} from '../../src/data/locations.js';
import {PLOTS} from '../../src/data/crops.js';
import {newState} from '../../src/systems/state.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4175/';
const out=process.env.QA_OUTPUT||'docs/verification/forest-growth';await mkdir(out,{recursive:true});
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




import {FOREST_MAP} from '../../src/data/forest.js';
const t={x:2016,y:850,w:256,h:128}; // former bank location, now open ground
await fixture('forest',{x:t.x+32,y:t.y+t.h+16},{minute:600,forestTutorialComplete:true,ownsClub:true,clubEquipped:true});
await hold('ArrowUp',400);const stopped=(await snap()).state.position;assert.ok(stopped.y<t.y+t.h,'removed bank permits walking');await shot('former-bank-walkable');
await page.keyboard.press('j',{delay:20});await page.waitForTimeout(230);const airborne=await snap();assert.ok(airborne.jump.active);assert.equal(airborne.player.frame,16);assert.ok(airborne.state.position.y<stopped.y);await shot('jump-open-ground');
const energy=airborne.state.energy;await page.keyboard.press('k');assert.equal((await snap()).state.energy,energy,'airborne club input does not spend energy');await page.waitForTimeout(600);const landed=await snap();assert.equal(landed.jump.active,null);assert.ok(landed.state.position.y<t.y+t.h-60);assert.ok(walkable('forest',landed.state.position.x,landed.state.position.y));await shot('ground-landed');
// Pausing freezes the arc. Saving/reloading during it stores its grounded origin.
await fixture('forest',{x:t.x+32,y:t.y+t.h+16},{minute:600,forestTutorialComplete:true,character:'girl'});await hold('ArrowUp',70);const origin=(await snap()).state.position;await page.keyboard.press('Shift',{delay:15});await page.waitForTimeout(140);await page.keyboard.press('Escape');const paused=await snap();assert.ok(paused.jump.active);await page.waitForTimeout(750);assert.equal((await snap()).jump.active.elapsed,paused.jump.active.elapsed);await click('Save');const persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('simple-life.save.v1')));assert.deepEqual(persisted.position,origin);assert.equal(persisted.version,9);await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day 1');assert.equal((await snap()).jump.active,null);assert.deepEqual((await snap()).state.position,origin);await shot('girl-grounded-reload');
// Touching a clump bends its native pixels; leaving it lets it spring upright.
const g=FOREST_MAP.grass.find(g=>g.id.startsWith('entrance')&&g.y<4870&&Array.from({length:41},(_,i)=>g.x-80+i*4).every(x=>walkable('forest',x,g.y)));
assert.ok(g,'safe grass interaction');await fixture('forest',{x:g.x-56,y:g.y},{minute:600,forestTutorialComplete:true});await move(g.x,g.y);await page.waitForTimeout(200);assert.ok((await snap()).grass.bending.some(b=>b.x===g.x&&b.y===g.y));await shot('grass-bending');await move(g.x+76,g.y);await page.waitForTimeout(600);assert.ok(!(await snap()).grass.bending.some(b=>b.x===g.x&&b.y===g.y));assert.ok((await snap()).grass.visible<(await snap()).grass.total/3);await shot('dense-grass-spring-back');
// Four directions still walk using the correct new nine-column rig.
for(const character of ['boy','girl']){await fixture('forest',{x:640,y:4848},{character,minute:600,forestTutorialComplete:true});for(const k of ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'])await hold(k,160);await shot(character+'-forest');}
// Water walking/crop and cliff jumps coexist; a jump clears the waterline until landing.
await fixture('forest',{x:2370,y:1900},{minute:600,forestTutorialComplete:true});assert.equal((await snap()).water.wading,true);await page.keyboard.press('j');await page.waitForTimeout(150);assert.equal((await snap()).water.wading,false);await shot('jump-out-of-water');await page.waitForTimeout(650);assert.equal((await snap()).water.wading,true);await reloadContinue();assert.equal((await snap()).water.wading,true);
const viewports=[];
for(const [width,height]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844],[360,640],[640,360]]){
 await page.setViewportSize({width,height});await fixture('forest',{x:640,y:4848},{minute:600,energy:0,forestTutorialComplete:true});
 for(const c of (await snap()).controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=width&&c.y+c.h<=height,c.id+' '+width+'x'+height);
 const c=(await snap()).controls.find(c=>c.id==='jump'),touch=await ctx.newCDPSession(page);await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:c.x+c.w/2,y:c.y+c.h/2}]});await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(120);assert.ok((await snap()).jump.active);await shot('touch-jump-'+width+'x'+height);await page.waitForTimeout(750);assert.ok(walkable('forest',(await snap()).state.position.x,(await snap()).state.position.y));await touch.detach();
 await key('Escape');await click('Controls');const menu=(await snap()).menuBounds;assert.ok(menu.x>=0&&menu.y>=0&&menu.x+menu.w<=width&&menu.y+menu.h<=height,'controls menu '+width+'x'+height);await shot('jump-controls-'+width+'x'+height);viewports.push([width,height]);
}
await page.setViewportSize({width:1280,height:720});await fixture('forest',{x:400,y:4800},{minute:1320,forestTutorialComplete:true,nightWarningSeen:true});await shot('canvas-night-grass');await key('Escape');await click('Save');await page.goto(base+'?qa&renderer=webgl');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day 1');await page.keyboard.press('j');await page.waitForTimeout(160);assert.ok((await snap()).jump.active);await shot('webgl-night-jump');await page.waitForTimeout(650);assert.ok((await snap()).grass.visible>0);
await fixture('interior',{...newState().position},{minute:600});assert.equal((await snap()).jump.active,null);await shot('interior-retained-character');
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);assert.deepEqual(failedRequests,[]);assert.deepEqual(foreignRequests,[]);
await writeFile(out+'/results.json',JSON.stringify({passed:true,viewports,grassTotal:FOREST_MAP.grass.length,treeAndBambooProps:FOREST_MAP.props.filter(p=>p.name.includes('tree')||p.name==='snow-pine'||p.name==='bamboo-clump').length,terraces:FOREST_MAP.terraces.length,errors,warnings,failedRequests,foreignRequests},null,2));await ctx.close();await browser.close();console.log('PASS forest growth / jump / grass / saves / seven viewports / renderers');
