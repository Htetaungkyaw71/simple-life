import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {VEGETATION} from '../../src/data/vegetation.js';
import {walkable} from '../../src/data/locations.js';
import {FARM_PLOTS} from '../../src/data/farms.js';
import {COZY_FILES} from '../../src/audio/cozy.js';
import {contextFor} from '../../src/systems/context.js';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.GAME_URL||'http://127.0.0.1:4190/',out=process.env.AUDIO_QA_OUT||'docs/verification/hit-feedback',records=[];await mkdir(out,{recursive:true});
const fixture=(area,position,selected='hand')=>{const s=newState();Object.assign(s,{area,position,selected,minute:720,hasVisitedFarm:true,hasVisitedCity:true,forestTutorialComplete:true,nightWarningSeen:true});s.story.intro='seen';return s;};
async function run(name,mobile,state,check){
 const ctx=await browser.newContext({viewport:mobile?{width:640,height:360}:{width:1280,height:720},hasTouch:mobile}),p=await ctx.newPage(),errors=[],requests=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(['warning','error'].includes(m.type()))errors.push(m.text());});p.on('request',r=>requests.push(r.url()));
 await p.addInitScript(s=>{
  localStorage.setItem('simple-life.save.v1',JSON.stringify(s));window.__starts=[];
  const Native=window.AudioContext;window.AudioContext=class extends Native{createBufferSource(){const source=super.createBufferSource(),start=source.start.bind(source);source.start=(...args)=>{window.__starts.push({loop:source.loop,seconds:source.buffer?.duration});return start(...args);};return source;}};
 },state);
 const pageURL=new URL(base);pageURL.searchParams.set('qa','');await p.goto(pageURL.href);await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
 const snap=()=>p.evaluate(()=>window.__simpleLife.snapshot());
 const click=async(id,delay=300)=>{const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);if(mobile)await p.touchscreen.tap(c.x+c.w/2,c.y+c.h/2);else await p.mouse.click(c.x+c.w/2,c.y+c.h/2);await p.waitForTimeout(delay);};
 const sources=()=>p.evaluate(()=>window.__starts.filter(s=>!s.loop));
 await click('Continue');await p.waitForFunction(()=>window.__simpleLife.snapshot().audio.pending===0&&window.__simpleLife.snapshot().audio.context==='running');
 assert.deepEqual(await sources(),[],'Continue is silent');await check({p,snap,click,sources});
 assert.deepEqual(errors,[]);assert.deepEqual((await snap()).audio.failures,[]);
 assert.ok(requests.every(u=>!u.includes('/sfx-')||Object.values(COZY_FILES).some(path=>u.endsWith('/'+path))),'unused effects never fetched');
 await p.screenshot({path:out+'/'+name+'.png'});records.push({name,mobile,nonLoopStarts:await sources(),audio:(await snap()).audio,area:(await snap()).state.area,errors});console.log('PASS',name);await ctx.close();
}
try{
 for(const mobile of [false,true])await run((mobile?'phone':'mac')+'-menus-bag-jump',mobile,fixture('home',{x:480,y:600}),async({p,snap,click,sources})=>{
  await click('choose-seeds');await click('bag-tab-gear');await click('bag-item-axe');await click('bag-action');assert.equal((await snap()).state.selected,'axe');
  await click('choose-seeds');await click('bag-tab-gear');await click('bag-item-axe');await click('bag-action');assert.equal((await snap()).state.selected,'hand');
  await p.keyboard.press('Escape');assert.equal((await snap()).paused,true);await click('Resume');
  if(mobile)await click('jump',30);else{await p.keyboard.press('Space');await p.waitForTimeout(30);}assert.ok((await snap()).jump.active);await p.waitForTimeout(850);assert.deepEqual(await sources(),[]);
 });
 await run('phone-empty-swing',true,fixture('farm',{x:320,y:64},'axe'),async({snap,click,sources})=>{
  assert.ok(!['chop','hunt'].includes((await snap()).context?.type));const before=(await snap()).state.energy;
  await click('attack',30);assert.ok((await snap()).pendingAttack,'empty swing animation begins');await new Promise(r=>setTimeout(r,400));
  assert.equal((await snap()).pendingAttack,null);assert.equal((await snap()).state.energy,before);assert.deepEqual(await sources(),[],'empty attack is silent');
 });
 const treeState=fixture('farm',{x:0,y:0},'axe');let tree;
 for(const n of VEGETATION.farm.trees){treeState.position={x:n.x,y:n.y-48};const c=contextFor(treeState);if(walkable('farm',treeState.position.x,treeState.position.y,12,false,treeState)&&c?.type==='chop'&&c.id===n.id){tree=n;break;}}assert.ok(tree);
 await run('phone-tree-three-hits',true,treeState,async({snap,click,sources})=>{for(let i=0;i<3;i++){const before=(await sources()).length;await click('attack',600);assert.equal((await sources()).length,before+1,i<2?'tree impact only':'Wood pickup only');}assert.equal((await snap()).state.inventory.wood,3);});
 const bed=FARM_PLOTS[0],farm=fixture('farm',{x:bed.x,y:bed.y+16},'seed');farm.inventory.seed=2;
 await run('phone-plant-water',true,farm,async({snap,click,sources})=>{
  assert.equal((await snap()).context.type,'plot');assert.equal((await snap()).context.index,0);
  await click('attack');assert.equal((await snap()).state.plots[0].crop,'tomato');assert.equal((await sources()).length,1,'planting sound');
  await click('tool-water');assert.equal((await sources()).length,1,'tool selection silent');await click('attack');assert.equal((await snap()).state.plots[0].wateredDay,1);assert.equal((await sources()).length,2,'watering sound');
 });
 const ripe=fixture('farm',{x:bed.x,y:bed.y+16},'harvest');ripe.plots[0]={crop:'tomato',growth:3,wateredDay:1,missedDays:0,lastEvaluatedDay:0};
 await run('phone-harvest',true,ripe,async({snap,click,sources})=>{await click('attack');assert.equal((await snap()).state.inventory.tomato,2);assert.equal((await sources()).length,1,'harvest sound');});
 for(const health of [3,1]){
  const animal=fixture('forest',{x:936,y:4428},'axe');animal.forest.animals['boar-original'].health=health;animal.forest.boar.health=health;
  await run('phone-animal-'+(health===1?'defeat':'hit'),true,animal,async({snap,click,sources})=>{
   assert.equal((await snap()).context.type,'hunt');assert.equal((await snap()).context.id,'boar-original');await click('attack',300);
   assert.equal((await snap()).state.forest.animals['boar-original'].health,health-1);assert.equal((await sources()).length,1,'only landed animal hit/defeat sound');
  });
 }
 for(const [to,pos,key]of [['farm',{x:480,y:1096},'ArrowDown'],['city',{x:2180,y:640},'ArrowRight'],['forest',{x:704,y:48},'ArrowUp']]){
  await run('travel-'+to,true,fixture('home',pos),async({p,snap,sources})=>{await p.waitForTimeout(550);await p.keyboard.down(key);await p.waitForTimeout(550);await p.keyboard.up(key);await p.waitForTimeout(850);assert.equal((await snap()).state.area,to);assert.deepEqual(await sources(),[]);if(to==='forest')assert.ok((await snap()).audio.loops.some(v=>v.key==='ambience:forestDay'));});
 }
 await run('phone-house-door',true,fixture('home',{x:480,y:500}),async({snap,click,sources})=>{assert.equal((await snap()).context.type,'travel');await click('attack',850);assert.equal((await snap()).state.area,'interior');assert.deepEqual(await sources(),[]);});
 for(const type of ['seed','sell']){
  const s=fixture('city',{x:type==='seed'?432:896,y:330});s.inventory.tomato=2;
  await run('shop-'+(type==='seed'?'buy':'sell'),type==='seed',s,async({p,snap,click,sources})=>{
   await p.waitForFunction(()=>['seed','sell'].includes(window.__simpleLife.snapshot().context?.type));
   if(type==='seed')await click('attack');else{await p.keyboard.press('e');await p.waitForTimeout(300);}assert.equal((await snap()).menu,'trade');assert.deepEqual(await sources(),[],'opening shop is silent');
   await click('crop-tomato');await click('trade-1');assert.deepEqual(await sources(),[],'selecting stock/quantity is silent');
   const before=(await snap()).state;await click('trade-confirm',300);const after=(await snap()).state;
   if(type==='seed'){assert.equal(after.money,before.money-10);assert.equal(after.inventory.seed,before.inventory.seed+1);}else{assert.ok(after.money>before.money);assert.equal(after.inventory.tomato,before.inventory.tomato-1);}
   assert.equal((await sources()).length,1,'one transaction sound only');await click('trade-close');assert.equal((await sources()).length,1,'closing shop is silent');
  });
 }
 await writeFile(out+'/interaction-checks.json',JSON.stringify({result:'PASS',fixtures:'Disposable targeted saves on 4190. Native AudioBufferSource.start observed; no application mutation hooks or user-origin edits.',records},null,2)+'\n');
}finally{await browser.close();}
