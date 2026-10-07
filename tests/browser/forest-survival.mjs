import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {walkable,syncInterior} from '../../src/data/locations.js';
import {PLOTS} from '../../src/data/crops.js';
import {newState} from '../../src/systems/state.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4175/';
const out=process.env.QA_OUTPUT||'docs/verification/forest';await mkdir(out,{recursive:true});
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
async function move(x,y){if((await snap()).state.area==='forest'&&y<=1024)y+=4096;for(const [axis,target,neg,pos]of [['x',x,'ArrowLeft','ArrowRight'],['y',y,'ArrowUp','ArrowDown']])for(let n=0;n<12;n++){const d=target-(await snap()).state.position[axis];if(Math.abs(d)<3)break;await hold(d<0?neg:pos,Math.max(20,Math.abs(d)/((await snap()).state.area==='interior'?130:260)*1000));}const p=(await snap()).state.position;assert.ok(Math.hypot(p.x-x,p.y-y)<12,`move ${JSON.stringify(p)} -> ${x},${y}`);}
async function navigate(x,y){if((await snap()).state.area==='forest'&&y<=1024)y+=4096;
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

async function fixture(area,position,extra={}){syncInterior(page.viewportSize().width,page.viewportSize().height);const s=newState();s.area=area;s.position=area==='forest'&&position.y<=1024?{x:position.x,y:position.y+4096}:position;Object.assign(s,extra);await page.goto(base+'?qa');await page.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day '+s.day);await page.waitForTimeout(200);}


import {FORAGE_NODES} from '../../src/data/forest.js';
import {marketPrice} from '../../src/systems/market.js';
async function toHome(){if((await snap()).state.area==='farm'){await navigate(320,64);await hold('ArrowUp',500);await page.waitForTimeout(350);}else if((await snap()).state.area==='forest'){await navigate(640,960);await hold('ArrowDown',500);await page.waitForTimeout(350);}else if((await snap()).state.area==='city'){await navigate(64,488);await hold('ArrowLeft',500);await page.waitForTimeout(350);}else if((await snap()).state.area==='interior'){const s=await snap();await navigate(s.room.exit.x,s.room.exit.y);await use();}assert.equal((await snap()).state.area,'home');}
async function toField(){if((await snap()).state.area!=='farm'){await toHome();await navigate(480,1088);await hold('ArrowDown',500);await page.waitForTimeout(350);}await navigate(376,248);}
async function toBed(){await toHome();await navigate(480,492);await use();assert.equal((await snap()).state.area,'interior');const s=await snap();await navigate(s.room.bed.x,s.room.bed.y);await use();}
async function toCity(){await toHome();await navigate(2176,640);await hold('ArrowRight',500);await page.waitForTimeout(350);assert.equal((await snap()).state.area,'city');}
async function toForest(){await toHome();await navigate(720,64);await hold('ArrowUp',500);await page.waitForTimeout(350);assert.equal((await snap()).state.area,'forest');if((await snap()).menu){for(let i=0;i<3;i++)await click('Continue');}assert.equal((await snap()).state.forestTutorialComplete,true);}
async function fight(){
 for(let n=0;n<12&&(await snap()).state.forest.boar.health>0;n++){
  const s=await snap(),b=s.state.forest.boar.position;await move(b.x,Math.min(4576,b.y+44));await hold('ArrowUp',25);await key(n%2?'k':'Space');await page.waitForTimeout(350);
 }
 assert.equal((await snap()).state.forest.boar.health,0);
}

await page.goto(base+'?qa');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
if(!process.env.SKIP_LOOP){
 await click('New Game');await click('Play as Girl');await navigate(544,548);await use();assert.equal((await snap()).state.inventory.seed,3);
 await toField();await key('1');await use();assert.equal((await snap()).state.plots[0].crop,'tomato');
 for(let n=0;n<3;n++){if(n)await toField();await key('2');await use();await toBed();await click('Sleep until 20:00');await toField();await key('2');await use();assert.equal((await snap()).state.plots[0].evening,true);await toBed();await click('Sleep until 06:00');assert.equal((await snap()).state.plots[0].growth,n+1);console.log('Farm night',n+1);}
 await toField();await key('3');await use();assert.equal((await snap()).state.inventory.tomato,2);await toCity();await navigate(896,306);await use();const beforeSale=(await snap()).state;await click('trade-all');assert.equal((await snap()).state.money,beforeSale.money+2*marketPrice(beforeSale,'tomato').price);await click('trade-close');
 await navigate(336,738);assert.equal((await snap()).context.type,'outfitter');await use();await shot('natural-outfitter');const money=(await snap()).state.money;await click('survival-action');assert.equal((await snap()).state.money,money-45);assert.equal((await snap()).state.clubEquipped,true);assert.equal((await snap()).controls.find(c=>c.id==='survival-action').disabled,true);await click('survival-close');
 await toForest();assert.equal((await snap()).state.area,'forest');await shot('natural-entrance');
 // Collect berry and guava before entering the territory.
 for(const node of [FORAGE_NODES[0],FORAGE_NODES[3]]){await navigate(node.x,node.y+24);assert.equal((await snap()).context.type,'forage');await use();assert.equal((await snap()).state.inventory[node.item],1);}
 await click('choose-seeds');await click('bag-food');await click('food-guava');const foodBefore=(await snap()).state;await page.keyboard.press('Enter');await page.waitForTimeout(300);assert.equal((await snap()).state.inventory.guava,0);assert.equal((await snap()).state.energy,Math.min(100,foodBefore.energy+20));await shot('natural-eat');await click('survival-close');
 await navigate(880,456);await move(936,438);await page.waitForFunction(()=>window.__simpleLife.snapshot().state.health<100);assert.ok((await snap()).state.health<=85);await shot('natural-hurt');await fight();assert.equal((await snap()).state.inventory.wildHide,1);await shot('natural-defeat-boar');
 const mango=FORAGE_NODES[5];await navigate(mango.x,mango.y+24);await use();assert.equal((await snap()).state.inventory.mango,1);await shot('natural-mango');
 // Reentry cannot reroll collected fruit or immediately revive the boar.
 await toHome();await toForest();assert.equal((await snap()).state.forest.boar.health,0);assert.equal((await snap()).state.inventory.wildBerry,1);assert.ok((await snap()).state.forest.collected.includes('berry-south'));
 await toCity();await navigate(896,306);await use();if(['tomato','strawberry','carrot','corn'].includes((await snap()).trade.crop))await click('market-page');await click('crop-mango');const mangoSale=(await snap()).state;await click('trade-confirm');assert.equal((await snap()).state.money,mangoSale.money+marketPrice(mangoSale,'mango').price);assert.equal((await snap()).state.inventory.mango,0);await click('crop-wildBerry');await click('trade-confirm');await click('crop-wildHide');await click('trade-confirm');await click('trade-close');
 await toBed();if((await snap()).controls.some(c=>c.id==='Sleep until 20:00')){await click('Sleep until 20:00');await use();}await click('Sleep until 06:00');assert.equal((await snap()).state.forest.boar.health,3);assert.deepEqual((await snap()).state.forest.collected,[]);await toForest();
 await navigate(880,456);await move(936,422);
 const deathMoney=(await snap()).state.money,deathDay=(await snap()).state.day;
 for(let n=0;n<18;n++){
  let s=await snap();if(s.state.area==='interior')break;
  const health=s.state.health,b=s.state.forest.boar.position;try{await move(b.x,Math.min(4570,b.y+38));}catch(e){if((await snap()).state.area!=='interior')throw e;}
  if((await snap()).state.area==='interior')break;
  await page.waitForFunction(h=>{const s=window.__simpleLife.snapshot();return s.state.health<h||s.state.area==='interior';},health,{timeout:6000});
 }
 await page.waitForFunction(()=>window.__simpleLife.snapshot().state.area==='interior'&&window.__simpleLife.snapshot().menu==='dialog');
 let s=await snap();assert.equal(s.state.health,100);assert.equal(s.state.energy,100);assert.equal(s.state.day,deathDay+1);assert.equal(s.state.minute,360);assert.equal(s.state.money,deathMoney-Math.floor(deathMoney*.25));assert.equal(s.state.stash.coins,Math.floor(deathMoney*.25));const bag={...s.state.stash};await shot('natural-death');await click('Continue');
 await reloadContinue();assert.deepEqual((await snap()).state.stash,bag);await toForest();await navigate(bag.x,bag.y);assert.equal((await snap()).context.type,'stash');await use();assert.equal((await snap()).state.money,deathMoney);assert.equal((await snap()).state.stash,null);await shot('natural-recovered');
 await toHome();await reloadContinue();s=await snap();assert.equal(s.state.clubEquipped,true);assert.equal(s.state.deathTutorialSeen,true);assert.equal(s.state.hasDied,true);
 await writeFile(out+'/natural-loop.json',JSON.stringify({result:'PASS',steps:'New Game / starter / Tomato grow-harvest-sell / buy club / forest tutorials / berry-guava / eat / boar damage-defeat / mango / market sales / sleep / die / save-reload / recover stash / return-reload',state:s.state,errors,warnings},null,2));console.log('Natural farm -> forest survival loop PASS');
}
// Focused fixtures use disposable save files; every interaction uses real input.
const viewports=[];
for(const [width,height]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844]]){
 await page.setViewportSize({width,height});await fixture('forest',{x:640,y:752},{minute:1320,forestTutorialComplete:true,ownsClub:true,clubEquipped:true,energy:80,inventory:{...newState().inventory,wildBerry:3,guava:2,mango:1}});await shot('night-'+width+'x'+height);
 assert.equal((await snap()).lighting.alpha,.78);for(const c of (await snap()).controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=width&&c.y+c.h<=height,c.id);
 await click('choose-seeds');await click('bag-food');await shot('food-'+width+'x'+height);const b=(await snap()).menuBounds;assert.ok(b.x>=0&&b.y>=0&&b.x+b.w<=width&&b.y+b.h<=height);const paused=(await snap()).state;await page.waitForTimeout(300);assert.deepEqual((await snap()).state,paused);
 let c=(await snap()).controls.find(c=>c.id==='survival-action');await page.touchscreen.tap(c.x+c.w/2,c.y+c.h/2);await page.waitForTimeout(280);assert.equal((await snap()).state.inventory.wildBerry,2);await click('bag-gear');await shot('gear-'+width+'x'+height);await click('survival-close');
 c=(await snap()).controls.find(c=>c.id==='attack');const energy=(await snap()).state.energy;await page.touchscreen.tap(c.x+c.w/2,c.y+c.h/2);await page.waitForTimeout(100);assert.equal((await snap()).state.energy,energy-5);await shot('touch-attack-'+width+'x'+height);
 await fixture('city',{x:336,y:738},{minute:480});await use();await shot('outfitter-'+width+'x'+height);const bb=(await snap()).menuBounds;assert.ok(bb.x>=0&&bb.y>=0&&bb.x+bb.w<=width&&bb.y+bb.h<=height);await click('survival-close');
 await fixture('city',{x:896,y:306},{minute:480,inventory:{...newState().inventory,mango:4,wildHide:1}});await use();if(['tomato','strawberry','carrot','corn'].includes((await snap()).trade.crop))await click('market-page');await shot('forest-market-'+width+'x'+height);const trade=await snap();for(const t of trade.trade.textBounds)assert.ok(t.x>=trade.menuBounds.x&&t.x+t.w<=trade.menuBounds.x+trade.menuBounds.w+1,JSON.stringify(t));viewports.push({width,height});
}
await page.setViewportSize({width:1280,height:720});
await fixture('home',{x:720,y:64},{minute:480});await hold('ArrowUp',350);await page.waitForTimeout(350);assert.equal((await snap()).state.area,'forest');const frozen=(await snap()).state;await page.waitForTimeout(500);assert.deepEqual((await snap()).state,frozen);for(let i=0;i<3;i++)await key('Enter');assert.equal((await snap()).state.forestTutorialComplete,true);await navigate(640,960);await hold('ArrowDown',450);await page.waitForTimeout(350);assert.equal((await snap()).state.area,'home');await hold('ArrowUp',350);await page.waitForTimeout(350);assert.equal((await snap()).state.area,'forest');assert.equal((await snap()).menu,null);await shot('forest-guidance-completed');
for(const minute of [410,1200]){await fixture('city',{x:336,y:738},{minute});assert.equal((await snap()).context.type,'hint');assert.ok((await snap()).merchants.find(n=>n.kind==='outfitter').visible===false);await use();assert.equal((await snap()).menu,null);}
await fixture('forest',{x:560,y:882},{minute:480,forestTutorialComplete:true,ownsClub:true,clubEquipped:true,energy:0});await key('Space');assert.equal((await snap()).state.energy,0);await use();assert.equal((await snap()).state.inventory.wildBerry,1);await click('choose-seeds');await click('bag-food');await key('Enter');assert.equal((await snap()).state.energy,12);await click('survival-close');await key('k');assert.equal((await snap()).state.energy,7);
await fixture('forest',{x:640,y:752},{minute:480,forestTutorialComplete:true,inventory:{...newState().inventory,wildBerry:2}});await click('choose-seeds');await click('bag-food');const full=(await snap()).state;await click('survival-action');assert.equal((await snap()).state.inventory.wildBerry,2);assert.equal((await snap()).state.energy,full.energy);await shot('full-energy');
// Two-finger movement remains held when the attacking finger lifts.
await page.setViewportSize({width:844,height:390});await fixture('forest',{x:640,y:752},{minute:480,forestTutorialComplete:true,ownsClub:true,clubEquipped:true});
const touchSession=await ctx.newCDPSession(page),right=(await snap()).controls.find(c=>c.id==='move-right'),attackControl=(await snap()).controls.find(c=>c.id==='attack');
const finger={id:1,x:right.x+right.w/2,y:right.y+right.h/2},attackFinger={id:2,x:attackControl.x+attackControl.w/2,y:attackControl.y+attackControl.h/2};
await touchSession.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[finger]});await page.waitForTimeout(80);
await touchSession.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[finger,attackFinger]});await page.waitForTimeout(80);
await touchSession.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[finger]});const heldX=(await snap()).state.position.x;await page.waitForTimeout(150);assert.ok((await snap()).state.position.x>heldX+15);assert.equal((await snap()).state.energy,95);
await touchSession.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await touchSession.detach();await shot('two-finger-move-attack');await page.setViewportSize({width:1280,height:720});
// A second fall replaces the saved old bag, and refresh during the fade is atomic.
await fixture('forest',{x:936,y:438},{minute:480,health:15,money:99,forestTutorialComplete:true,deathTutorialSeen:true,ownsClub:true,clubEquipped:true,stash:{area:'forest',x:640,y:5056,coins:50}});
await page.waitForFunction(()=>window.__simpleLife.snapshot().state.area==='interior');
await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day 2');
assert.equal((await snap()).state.money,75);assert.equal((await snap()).state.stash.coins,24);assert.equal((await snap()).state.health,100);assert.equal((await snap()).state.day,2);await shot('second-defeat-interrupted-fade-reload');
// Renderer equivalence smoke with explicit WebGL context. Default game remains Canvas.
await fixture('forest',{x:880,y:456},{minute:1320,forestTutorialComplete:true,ownsClub:true,clubEquipped:true});await key('Escape');await click('Save');await page.goto(base+'?qa&renderer=webgl');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day 1');assert.equal((await snap()).lighting.alpha,.78);await shot('webgl-night');
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);assert.deepEqual(failedRequests,[]);assert.deepEqual(foreignRequests,[]);
const result={result:'PASS',naturalLoop:!process.env.SKIP_LOOP,viewports,canvasAndWebGLNight:true,tutorialPause:true,closedOutfitter:true,zeroEnergyEating:true,touchAttack:true,twoFingerMoveAttack:true,fullEnergyNoConsumption:true,secondDeathReplacement:true,interruptedDefeatReload:true,errors,warnings,failedRequests,foreignRequests};await writeFile(out+'/results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await ctx.close();await browser.close();
