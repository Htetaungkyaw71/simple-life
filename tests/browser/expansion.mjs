import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {FARM_PLOTS} from '../../src/data/farms.js';
import {syncInterior} from '../../src/data/locations.js';
import {ROOM} from '../../src/data/interior.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4174/';
const ctx=await browser.newContext({viewport:{width:1280,height:720},hasTouch:true}),page=await ctx.newPage();
const out='docs/verification/expansion',errors=[],warnings=[],requests=[];await mkdir(out,{recursive:true});
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='warning')warnings.push(m.text());if(m.type()==='error')errors.push(m.text());});
page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});page.on('request',r=>requests.push(r.url()));
const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
async function click(id,touch=false){const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);if(touch)await page.touchscreen.tap(c.x+c.w/2,c.y+c.h/2);else await page.mouse.click(c.x+c.w/2,c.y+c.h/2);await page.waitForTimeout(120);}
async function load(extra={}){syncInterior(page.viewportSize().width,page.viewportSize().height);const s=Object.assign(newState(),extra);await page.goto(base+'?qa');await page.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day '+s.day);return snap();}
async function use(){await page.keyboard.press('e');await page.waitForTimeout(120);}
const shot=name=>page.screenshot({path:`${out}/${name}.png`});
async function persist(){await page.keyboard.press('Escape');await click('Save');const saved=(await snap()).state;await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day '+saved.day);for(const k of ['farms','currentFarm','plots','money','inventory','day','energy'])assert.deepEqual((await snap()).state[k],saved[k],k);return (await snap()).state;}
function fits(v){const {width,height}=page.viewportSize();if(v.menuBounds){const b=v.menuBounds;assert.ok(b.x>=0&&b.y>=0&&b.x+b.w<=width&&b.y+b.h<=height,JSON.stringify(b));}for(const c of v.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=width&&c.y+c.h<=height,c.id);}
// Remaining board lettering fits; removed south board and hint are both absent.
await load({position:{x:448,y:616}});let v=await snap();assert.equal(v.farmSigns.length,1);const {board,text}=v.farmSigns[0];assert.ok(text.x>=board.x&&text.x+text.w<=board.x+board.w&&text.y>=board.y&&text.y+text.h<=board.y+board.h);await shot('home-sign-fit');
await load({position:{x:436,y:1036}});assert.notEqual((await snap()).context?.type,'hint');await shot('south-sign-removed');
// Insufficient funds: a real locked-field interaction opens a disabled purchase.
await load({area:'farm',position:{x:376,y:680},money:60});await use();assert.ok((await snap()).controls.find(c=>c.id==='Buy / 240 coins').disabled);await shot('insufficient-coins');await click('Not now');assert.equal((await snap()).state.money,60);
// Purchases, first-farm gate, all three fields, and new farm confirmation.
await load({area:'farm',position:{x:764,y:440},money:2000,inventory:{seed:8,tomato:2}});await use();await click('Visit / buy farms');assert.ok((await snap()).controls.find(c=>c.id==='Buy farm / 600 coins').disabled);await click('Back');
await click('Seeds and harvest');await click('Sell all / 36 coins');assert.equal((await snap()).state.money,2036);assert.equal((await snap()).state.inventory.tomato,0);await click('Buy 1 seed / 10 coins');assert.equal((await snap()).state.money,2026);assert.equal((await snap()).state.inventory.seed,9);await click('Back');await click('Buy planting land');
for(const [field,price]of [[2,120],[3,180],[4,240]]){await click(`Field ${field} / ${price} coins`);await click(`Buy / ${price} coins`);assert.ok((await snap()).state.farms[0].fields[field-1]);await use();if(field!==4)await click('Buy planting land');}
assert.equal((await snap()).state.money,1486);await shot('four-fields-owned-menu');await click('Visit / buy farms');await click('Buy farm / 600 coins');await shot('new-farm-confirm');await click('Buy farm');v=await snap();assert.equal(v.state.money,886);assert.equal(v.state.currentFarm,1);assert.equal(v.state.farms.length,2);assert.ok(v.controls.find(c=>c.id==='Buy farm / 1200 coins').disabled);
await click('Previous farm');assert.equal((await snap()).state.currentFarm,0);assert.ok((await snap()).controls.find(c=>c.id==='Buy farm / 1200 coins').disabled);await click('Next farm');assert.equal((await snap()).state.currentFarm,1);await click('Back');await click('Back to farming');let owned=await persist();console.log('Purchases, confirmation, farm switching and reload PASS');
// All 64 field cells retain correct global targeting. Each field plants and waters.
const inspected=[];
for(const farm of [0,1])for(const field of (farm===0?[0,1,2,3]:[0])){
 const index=farm*64+field*16,p=FARM_PLOTS[field*16];await load({...owned,currentFarm:farm,area:'farm',position:{x:p.x,y:p.y},minute:360,selected:'seed'});await use();assert.equal((await snap()).state.plots[index].crop,'tomato');assert.equal((await snap()).cropInfo.index,index);await page.keyboard.press('2');await use();assert.ok((await snap()).state.plots[index].morning);await shot(`farm-${farm+1}-field-${field+1}`);owned=await persist();inspected.push(index);
}
for(let i=0;i<64;i++){const p=FARM_PLOTS[i];await load({...owned,currentFarm:0,area:'farm',position:{x:p.x,y:p.y}});assert.equal((await snap()).context.index,i,'target '+i);}
// Manual late-night play cannot grow crops or move the player home; reload retains it.
const late=newState();late.plots[0]={...late.plots[0],crop:'tomato',morning:true,evening:true};await load({...late,area:'farm',position:{x:376,y:248},minute:1438.8,energy:17});await page.waitForTimeout(700);v=await snap();assert.equal(v.state.minute,1439);assert.equal(v.state.day,1);assert.equal(v.state.area,'farm');assert.equal(v.state.energy,17);assert.equal(v.state.plots[0].growth,0);await page.keyboard.down('ArrowRight');await page.waitForTimeout(150);await page.keyboard.up('ArrowRight');assert.ok((await snap()).state.position.x>376);await shot('manual-night');const savedLate=await persist();assert.equal((await snap()).state.minute,1439);
syncInterior(1280,720);await load({...savedLate,area:'interior',position:{x:ROOM.bed.x,y:ROOM.bed.y}});await use();assert.equal((await snap()).state.day,1);await click('Sleep / next day');assert.equal((await snap()).state.day,2);assert.equal((await snap()).state.energy,100);assert.equal((await snap()).state.plots[0].growth,1);await shot('manual-sleep');
// Paid-land and farm pages fit desktop and mobile; touch actually buys a field.
const sizes=[];
for(const [width,height]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844],[640,360]]){
 await page.setViewportSize({width,height});await load({area:'farm',position:{x:764,y:440},money:2000,inventory:{seed:2,tomato:2}});await use();fits(await snap());await shot(`board-${width}x${height}`);
 await click('Seeds and harvest');fits(await snap());await shot(`trade-${width}x${height}`);await click('Back');await click('Buy planting land');fits(await snap());await shot(`land-${width}x${height}`);await click('Field 2 / 120 coins');fits(await snap());await shot(`purchase-${width}x${height}`);await click('Buy / 120 coins',width<1000);assert.ok((await snap()).state.farms[0].fields[1]);await use();await click('Visit / buy farms');fits(await snap());await shot(`farms-${width}x${height}`);sizes.push({width,height,menusFit:true,touchPurchase:width<1000});
}
// Expanded-field information panels stay clear of crops, farmers and touch controls.
const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
let mobileTargets=0;
for(const [width,height]of [[844,390],[390,844]]){
 await page.setViewportSize({width,height});
 for(const [farm,fields]of [[0,[0,1,2,3]],[1,[0]]])for(const field of fields)for(const cell of [0,6,11,15]){
  const local=field*16+cell,index=farm*64+local,p=FARM_PLOTS[local],s=structuredClone(owned);s.plots[index]={...s.plots[index],crop:'tomato',growth:1,morning:true};
  await load({...s,currentFarm:farm,area:'farm',position:{x:p.x,y:p.y},minute:360});const v=await snap(),panel=v.cropInfo;assert.ok(panel,'panel '+index+' '+width);assert.equal(panel.index,index);assert.ok(panel.x>=0&&panel.y>=0&&panel.x+panel.w<=width&&panel.y+panel.h<=height);
  for(const c of v.controls)assert.ok(!overlaps(panel,c),'touch clear '+c.id);
  const tile={x:(p.x-v.camera.x)*v.camera.zoom-25,y:(p.y-v.camera.y)*v.camera.zoom-26,w:50,h:50};const player={x:tile.x,y:tile.y-42,w:50,h:70};assert.ok(!overlaps(panel,tile));assert.ok(!overlaps(panel,player));
  if(cell===0)await shot(`crop-farm-${farm+1}-field-${field+1}-${width}x${height}`);mobileTargets++;
 }
}
assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);assert.ok(requests.every(u=>u.startsWith(new URL(base).origin)||u.startsWith('data:')||u.startsWith('blob:'+new URL(base).origin)));
await writeFile(out+'/results.json',JSON.stringify({result:'PASS',signFits:true,southSignRemoved:true,coins:true,fieldPurchases:3,newFarm:true,independentCropIndices:inspected,targetedCells:64,mobileCropTargets:mobileTargets,manualSleep:true,persistence:true,sizes,errors,warnings},null,2));console.log('Expansion, all cells, manual sleep, six-size menus and touch PASS');await ctx.close();await browser.close();
