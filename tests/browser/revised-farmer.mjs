import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {BOY_FARMER} from '../../src/data/appearance.js';
import {FARM_PLOTS} from '../../src/data/farms.js';
import {VEGETATION} from '../../src/data/vegetation.js';
import {walkable} from '../../src/data/locations.js';
import {contextFor} from '../../src/systems/context.js';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const url=process.env.GAME_URL||'http://127.0.0.1:4205/',out=process.env.QA_OUT||'docs/verification/farmer-boy-runtime';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true}),records=[];
const fixture=(area,position,selected='hand',character='boy')=>{
 const s=newState(character);Object.assign(s,{area,position,selected,minute:600,money:311,starterSeedsClaimed:true,hasVisitedFarm:true,hasVisitedCity:true,forestTutorialComplete:true,nightWarningSeen:true});s.story.intro='seen';return s;
};
try{for(const [width,height,lang]of [[1280,720,'en'],[1440,900,'en'],[1024,768,'en'],[844,390,'mm'],[390,844,'mm']]){
 const mobile=width<1000,ctx=await browser.newContext({viewport:{width,height},hasTouch:mobile}),p=await ctx.newPage(),errors=[],requests=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('request',r=>requests.push(r.url()));
 const snap=()=>p.evaluate(()=>window.__simpleLife.snapshot());
 const click=async(id,delay=120)=>{const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);await(mobile?p.touchscreen.tap(c.x+c.w/2,c.y+c.h/2):p.mouse.click(c.x+c.w/2,c.y+c.h/2));if(delay)await p.waitForTimeout(delay);};
 const start=async s=>{await p.goto(url+'?qa');await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await p.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await click('language-'+lang);await click('Continue');};
 const actionKey=()=>mobile?click('attack',0):p.keyboard.press('e');
 const capture=name=>p.screenshot({path:`${out}/${width}-${name}.png`});
 try{
  await start(fixture('home',{x:480,y:800}));let v=await snap();assert.equal(v.player.nativeHeight,64);assert.equal(v.player.rig.originY,56/64);assert.equal(v.player.rig.scale,1.5);assert.equal(v.player.texture,'boy');await capture('idle');
  await click('pause');await click('Return to title');await capture('title');await click('Play');if((await snap()).controls.some(c=>c.id==='Start fresh'))await click('Keep my farm');
  // Character choice uses the same ground anchor as the runtime.
  await p.evaluate(()=>localStorage.removeItem('simple-life.save.v1'));await p.reload();await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('language-'+lang);await click('Play');await capture('choice');await click('Back');
  const checks=[];
  if(width===1280||width===390){
   for(const [direction,key,dx,dy]of [['left','a',-1,0],['right','d',1,0],['up','w',0,-1],['down','s',0,1]]){
    await start(fixture('home',{x:480,y:800},'water'));const before=(await snap()).state.position;let cdp;
    if(mobile){const c=(await snap()).controls.find(c=>c.id==='move-stick');cdp=await ctx.newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:c.x+c.w*(.5+dx*.3),y:c.y+c.h*(.5+dy*.3)}]});}else await p.keyboard.down(key);
    const frames=await p.evaluate(()=>new Promise(resolve=>{const frames=[],until=performance.now()+800;function step(){const v=window.__simpleLife.snapshot();frames.push({frame:Number(v.player.frame),direction:v.player.direction,tool:v.heldTool.visible});if(performance.now()>until)resolve(frames);else requestAnimationFrame(step);}step();}));
    await capture('run-'+direction);
    if(cdp){await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}else await p.keyboard.up(key);
    const clip=BOY_FARMER.clips.running,row=['down','up','left','right'].indexOf(direction),actual=new Set(frames.filter(f=>f.direction===direction&&f.frame>=clip.offset+row*8&&f.frame<clip.offset+(row+1)*8).map(f=>f.frame%8));assert.equal(actual.size,8);assert.ok(frames.some(f=>f.tool));
    const after=(await snap()).state.position;assert.ok(Math.hypot(after.x-before.x,after.y-before.y)>10);checks.push('run-'+direction);
   }
   const bed=FARM_PLOTS[0],water=fixture('farm',{x:bed.x,y:bed.y+16},'water');water.plots[0]={crop:'tomato',growth:1,wateredDay:0,missedDays:0,lastEvaluatedDay:0};
   const harvest=fixture('farm',{x:bed.x,y:bed.y+16},'harvest');harvest.plots[0]={crop:'tomato',growth:3,wateredDay:1,missedDays:0,lastEvaluatedDay:0};
   const dig=fixture('farm',{x:696,y:152},'shovel');dig.ownsCopperCan=true;const chop=fixture('farm',{x:0,y:0},'axe');
   for(const n of VEGETATION.farm.trees){chop.position={x:n.x,y:n.y-48};if(walkable('farm',chop.position.x,chop.position.y,12,false,chop)&&contextFor(chop)?.id===n.id)break;}
   assert.equal(contextFor(chop)?.type,'chop');
   const animal=fixture('forest',{x:936,y:4428},'axe');assert.equal(contextFor(animal)?.type,'hunt');
   for(const [name,state,verify]of [
    ['watering',water,s=>assert.equal(s.plots[0].wateredDay,1)],
    ['harvesting',harvest,s=>assert.equal(s.inventory.tomato,2)],
    ['digging',dig,s=>assert.ok(s.customBeds.length>0)],
    ['chopping',chop,s=>assert.equal(s.energy,99)],
    ['attack',animal,s=>assert.equal(s.forest.animals['boar-original'].health,2)]
   ]){
    await start(state);await actionKey();
    const frames=await p.evaluate(name=>new Promise(resolve=>{const frames=[],until=performance.now()+850;function step(){const v=window.__simpleLife.snapshot();frames.push({action:v.player.action,frame:Number(v.player.frame),tool:v.heldTool.visible});if(performance.now()>until)resolve(frames);else requestAnimationFrame(step);}step();}),name);
    const active=frames.filter(f=>f.action?.name===name),clip=BOY_FARMER.clips[name];assert.ok(active.length>0,name);assert.ok(active.every(f=>!f.tool),'no double tool '+name);assert.equal(new Set(active.map(f=>f.frame%8)).size,clip.count,name);
    v=await snap();assert.equal(v.player.action,null);verify(v.state);checks.push(name);
   }
   await start(dig);await actionKey();await p.waitForTimeout(90);await click('pause',0);const paused=await snap();await p.waitForTimeout(450);v=await snap();assert.equal(v.player.frame,paused.player.frame);assert.equal(v.player.action.elapsed,paused.player.action.elapsed);await click('Resume');await p.waitForTimeout(650);assert.equal((await snap()).player.action,null);checks.push('pause-resume');
   await start(fixture('home',{x:480,y:800},'hand'));await p.keyboard.press('Space');await p.waitForTimeout(100);v=await snap();assert.ok(v.jump.active);assert.ok(Number(v.player.frame)>=BOY_FARMER.clips.running.offset);await p.waitForTimeout(700);assert.equal((await snap()).jump.active,null);checks.push('jump');
   // Existing girl and paid appearances keep their previous rigs and saved balances.
   await start(fixture('home',{x:480,y:800},'hand','girl'));assert.equal((await snap()).player.nativeHeight,64);
   const paid=fixture('home',{x:480,y:800});paid.appearance={outfit:'copper',hair:'midnight',owned:['worker','gardener','copper']};await start(paid);assert.equal((await snap()).player.nativeHeight,40);assert.equal((await snap()).state.money,311);
   await start(fixture('home',{x:480,y:800}));await p.reload();await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('language-'+lang);await click('Continue');assert.equal((await snap()).player.texture,'boy');assert.equal((await snap()).state.money,311);checks.push('other-looks-and-reload');
  }
  await start(fixture('home',{x:480,y:800}));await capture('final-game');assert.deepEqual(errors,[]);assert.ok(requests.every(u=>u.startsWith(new URL(url).origin)||u.startsWith('data:')||u.startsWith('blob:')));records.push({width,height,lang,checks,errors});console.log('PASS',width,checks.join(', '));
 }finally{await ctx.close();}
}await writeFile(out+'/browser.json',JSON.stringify({url,records},null,2)+'\n');}finally{await browser.close();}
