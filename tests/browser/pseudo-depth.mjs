import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {TESTING_COIN_GRANT} from '../../src/systems/testingCredit.js';
import {VEGETATION} from '../../src/data/vegetation.js';
import {MAPS} from '../../src/data/mapLayouts.js';
import {walkable} from '../../src/data/locations.js';
import {FARM_PLOTS} from '../../src/data/farms.js';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const base=process.env.GAME_URL||'http://127.0.0.1:4196/',out=process.env.QA_OUT||'/private/tmp/simple-life-pseudo-depth';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true}),records=[];
const routeClear=t=>{for(const [dx,dy]of [[0,-46],[-60,-46],[-60,54],[0,54]])if(!walkable('home',t.x+dx,t.y+dy))return false;return true;};
const tree=VEGETATION.home.trees.find(routeClear);assert.ok(tree);
try{for(const [renderer,lang,width,height]of [['canvas','en',1280,720],['canvas','mm',844,390],['webgl','en',390,844]]){
 const name=renderer+'-'+lang+'-'+width;if(process.env.QA_FILTER&&!new RegExp(process.env.QA_FILTER).test(name))continue;
 const ctx=await browser.newContext({viewport:{width,height},hasTouch:width<1000}),p=await ctx.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(['warning','error'].includes(m.type()))errors.push(m.text());});
 const snap=()=>p.evaluate(()=>{const v=window.__simpleLife.snapshot();return Object.fromEntries(['state','controls','rendering','camera','jump','water','paused','input'].map(k=>[k,v[k]]));});
 const click=async id=>{const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);await(width<1000?p.touchscreen.tap(c.x+c.w/2,c.y+c.h/2):p.mouse.click(c.x+c.w/2,c.y+c.h/2));await p.waitForTimeout(150);};
 const fixture=(area,position)=>{const s=newState();Object.assign(s,{area,position,day:8,minute:720,money:235,testingCoinGrant:TESTING_COIN_GRANT,starterSeedsClaimed:true,forestTutorialComplete:true,nightWarningSeen:true,hasVisitedFarm:true});s.story.intro='seen';return s;};
 const start=async s=>{const url=new URL(base);url.searchParams.set('qa','');url.searchParams.set('renderer',renderer);for(let i=0;i<3;i++){try{await p.goto(url.href);break;}catch(e){if(i===2||!e.message.includes('ERR_CONNECTION_RESET'))throw e;}}await p.waitForFunction(()=>{try{return !!window.__simpleLife?.snapshot().controls.length;}catch{return false;}});await p.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await click('language-'+lang);await click('Continue');};
 const move=async(key,ms)=>{await p.keyboard.down(key);await p.waitForTimeout(ms);await p.keyboard.up(key);await p.waitForTimeout(100);};
 const capture=async part=>p.screenshot({path:out+'/'+name+'-'+part+'.png'});
 try{
  await start(fixture('home',{x:480,y:600}));let v=await snap();assert.equal(v.rendering.player.shadow.visible,true);assert.equal(v.rendering.player.shadow.depth,3);
  if(width<1000)await click('jump');else{await p.keyboard.press('Space');await p.waitForTimeout(150);}v=await snap();assert.ok(v.jump.active);assert.ok(v.rendering.player.y<v.state.position.y);assert.ok(Math.abs(v.rendering.player.shadow.y-(Math.round(v.state.position.y)-3))<1);assert.equal(v.rendering.player.shadow.alpha,.13);await capture('jump');await p.waitForTimeout(900);assert.equal((await snap()).state.money,235);
  await start(fixture('home',{x:480,y:500}));if(width<1000)await click('attack');else await p.keyboard.press('e');await p.waitForFunction(()=>window.__simpleLife.snapshot().state.area==='interior');v=await snap();assert.equal(v.rendering.player.shadow.visible,true);assert.equal(v.rendering.player.shadow.depth,3);await capture('interior');
  await start(fixture('home',{x:tree.x,y:tree.y-46}));v=await snap();const canopy=v.rendering.canopies.find(c=>c.foot===tree.y&&tree.x>c.bounds.x&&tree.x<c.bounds.x+c.bounds.width);assert.ok(canopy&&canopy.alpha===.5,'tree reveals farmer behind crown');assert.ok(v.rendering.player.depth<canopy.depth);await capture('behind-tree');
  assert.ok(v.rendering.plants.some(n=>n.id.startsWith('grass:flowers')&&n.depth>3));
  await start(fixture('home',{x:tree.x,y:tree.y+54}));v=await snap();assert.ok(v.rendering.canopies.filter(c=>c.foot===tree.y).every(c=>c.alpha===1));await capture('front-tree');await move('d',150);assert.ok((await snap()).state.position.x>tree.x);
  const bed=FARM_PLOTS[0],s=fixture('farm',{x:bed.x,y:bed.y+4});s.plots[0]={crop:'tomato',growth:3,wateredDay:8,lastEvaluatedDay:7,missedDays:0};await start(s);v=await snap();const crop=v.rendering.crops.find(c=>c.frame==='tomato-ripe');assert.ok(crop);assert.ok(v.rendering.player.depth<crop.depth);assert.equal(v.rendering.player.shadow.visible,true);await move('s',180);v=await snap();assert.ok(v.rendering.player.depth>crop.depth);assert.equal(v.state.plots[0].crop,'tomato');assert.equal(v.state.money,235);await capture('farm');
  const bridge=MAPS.city.bridges[0];await start(fixture('city',{x:bridge.x+bridge.w/2,y:bridge.y+80}));v=await snap();assert.ok(v.rendering.rails.length>4);assert.ok(v.rendering.rails.some(r=>r.depth<v.state.position.y)&&v.rendering.rails.some(r=>r.depth>v.state.position.y));assert.equal(v.water.wading,false);assert.equal(v.rendering.player.shadow.visible,true);await capture('bridge');await move('s',200);assert.ok((await snap()).state.position.y>bridge.y+80);
  const forestBridge=MAPS.forest.bridges.find(b=>b.axis!=='vertical');assert.ok(forestBridge);await start(fixture('forest',{x:forestBridge.x+forestBridge.w/2,y:forestBridge.y+forestBridge.h/2}));v=await snap();assert.ok(v.rendering.rails.some(r=>r.depth===forestBridge.y+forestBridge.h));assert.equal(v.water.wading,false);assert.equal(v.rendering.player.shadow.visible,true);await capture('forest-bridge');const beforeX=v.state.position.x;await move('d',200);assert.ok((await snap()).state.position.x>beforeX);
  await start(fixture('city',{x:bridge.x-24,y:80}));v=await snap();assert.equal(v.water.wading,true);assert.equal(v.rendering.player.shadow.visible,false);assert.equal(v.water.reflection,true);await capture('water');
  await click('pause');assert.equal((await snap()).rendering.player.shadow.visible,false);await click('Save');await click('Resume');await p.reload();await p.waitForFunction(()=>{try{return !!window.__simpleLife?.snapshot().controls.length;}catch{return false;}});await click('language-'+lang);await click('Continue');v=await snap();assert.equal(v.state.money,235);assert.equal(v.state.area,'city');assert.equal(v.state.health,100);assert.equal(v.state.energy,100);assert.deepEqual(errors,[]);
  records.push({name,result:'PASS',groundAndJumpShadow:true,frontBackTree:true,cropDepth:true,layeredBridge:true,waterReflection:true,saveReload:true,errors});console.log('PASS depth',name);
 }catch(e){await capture('failure');await writeFile(out+'/failure.json',JSON.stringify({error:e.stack,snapshot:await snap().catch(()=>null),tree,errors},null,2));throw e;}finally{await ctx.close();}
}await writeFile(out+'/results.json',JSON.stringify({result:'PASS',url:base,records},null,2)+'\n');}finally{await browser.close();}
