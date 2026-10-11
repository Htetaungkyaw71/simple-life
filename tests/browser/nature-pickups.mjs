import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {forestStones} from '../../src/data/forestResources.js';
import {TREASURES} from '../../src/data/forest.js';
import {COZY_FILES} from '../../src/audio/cozy.js';
import {contextFor} from '../../src/systems/context.js';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.GAME_URL||'http://127.0.0.1:4190/',out=process.env.AUDIO_QA_OUT||'docs/verification/nature-pickups',records=[];await mkdir(out,{recursive:true});
const fixture=(area,position,selected='hand')=>{const s=newState();Object.assign(s,{area,position,selected,minute:720,hasVisitedFarm:true,hasVisitedCity:true,forestTutorialComplete:true,nightWarningSeen:true});s.story.intro='seen';return s;};
async function run(name,mobile,state,check){
 const ctx=await browser.newContext({viewport:mobile?{width:640,height:360}:{width:1280,height:720},hasTouch:mobile}),p=await ctx.newPage(),errors=[],requests=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(['warning','error'].includes(m.type()))errors.push(m.text());});p.on('request',r=>requests.push(r.url()));
 await p.addInitScript(s=>{
  localStorage.setItem('simple-life.save.v1',JSON.stringify(s));window.__starts=[];window.__contexts=[];
  const Native=window.AudioContext;window.AudioContext=class extends Native{constructor(...args){super(...args);this.qaGains=[];window.__contexts.push(this);}createGain(){const g=super.createGain();this.qaGains.push(g);return g;}createBufferSource(){const source=super.createBufferSource(),start=source.start.bind(source);source.start=(...args)=>{window.__starts.push({loop:source.loop,seconds:source.buffer?.duration});return start(...args);};return source;}};
 },state);
 const pageURL=new URL(base);pageURL.searchParams.set('qa','');await p.goto(pageURL.href);await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
 const snap=()=>p.evaluate(()=>window.__simpleLife.snapshot());
 const click=async(id,delay=300)=>{const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);if(mobile)await p.touchscreen.tap(c.x+c.w/2,c.y+c.h/2);else await p.mouse.click(c.x+c.w/2,c.y+c.h/2);await p.waitForTimeout(delay);};
 let windowTitleLevel;
 const level=bus=>p.evaluate(async index=>{const c=window.__contexts[0],a=c.createAnalyser();a.fftSize=2048;c.qaGains[index].connect(a);let sum=0,n=0,peak=0;for(let i=0;i<10;i++){const b=new Float32Array(a.fftSize);a.getFloatTimeDomainData(b);for(const v of b){sum+=v*v;n++;peak=Math.max(peak,Math.abs(v));}await new Promise(r=>setTimeout(r,30));}c.qaGains[index].disconnect(a);a.disconnect();return {rms:Math.sqrt(sum/n),peak};},bus);
 const sources=()=>p.evaluate(()=>window.__starts.filter(s=>!s.loop));
 if(name==='title-to-world'){await p.keyboard.press('Shift');await p.waitForFunction(()=>window.__simpleLife.snapshot().audio.loops.some(v=>v.key==='music:cozyMusic'));await p.waitForTimeout(2800);const titleLevel=await level(2);assert.ok(titleLevel.rms>.001);windowTitleLevel=titleLevel;}
 await click('Continue');await p.waitForFunction(()=>window.__simpleLife.snapshot().audio.pending===0&&window.__simpleLife.snapshot().audio.context==='running');
 assert.deepEqual(await sources(),[],'Continue is silent');assert.deepEqual((await snap()).audio.profile.music,{});assert.ok((await snap()).audio.loops.every(v=>v.key.startsWith('ambience:')));await p.waitForTimeout(2100);const music=await level(2),nature=await level(3);assert.equal(music.peak,0);if(state.area==='forest')assert.ok(nature.rms>.0005);else assert.ok(nature.rms>.0001,'outdoor birds are audible without wind');await check({p,snap,click,sources});
 assert.deepEqual(errors,[]);assert.deepEqual((await snap()).audio.failures,[]);
 assert.ok(requests.every(u=>!u.includes('/sfx-')||Object.values(COZY_FILES).some(path=>u.endsWith('/'+path))),'unused effects never fetched');
 await p.screenshot({path:out+'/'+name+'.png'});records.push({name,mobile,music,nature,titleLevel:windowTitleLevel,nonLoopStarts:await sources(),audio:(await snap()).audio,area:(await snap()).state.area,errors});console.log('PASS',name);await ctx.close();
}
try{
 await run('title-to-world',false,fixture('home',{x:480,y:600}),async({p,snap,click})=>{await p.keyboard.press('Escape');assert.equal((await snap()).paused,true);assert.deepEqual((await snap()).audio.profile.music,{});await click('Resume');});
 await run('forest-night-nature',true,Object.assign(fixture('forest',{x:5120,y:4848}),{minute:1320}),async({snap})=>{assert.ok((await snap()).audio.loops.some(v=>v.key==='ambience:night'));});
 const stone=forestStones().find(n=>n.region==='entrance');
 for(const mobile of [false,true])for(const kind of ['fruit','stone','starter','stash','treasure']){
  const s=fixture(kind==='starter'?'home':'forest',kind==='starter'?{x:544,y:566}:kind==='stone'?{x:stone.x,y:stone.y}:{x:616,y:4664});
  if(kind==='stash')s.stash={area:'forest',...s.position,coins:15};
  if(kind==='treasure'){const t=TREASURES.find(t=>contextFor(Object.assign(s,{position:{x:t.x,y:t.y}}))?.type==='treasure');assert.ok(t);s.position={x:t.x,y:t.y};for(const a of Object.values(s.forest.animals)){a.health=0;a.defeatedDay=1;}}
  await run((mobile?'phone':'mac')+'-'+kind,mobile,s,async({p,snap,click,sources})=>{
   const before=(await snap()).state,c=(await snap()).context;assert.equal(c.type,{fruit:'forage',stone:'stone',starter:'starter',stash:'stash',treasure:'treasure'}[kind]);
   if(mobile)await click('attack');else{await p.keyboard.press('e');await p.waitForTimeout(300);}const after=(await snap()).state;
   if(kind==='fruit')assert.equal(after.inventory[c.item],before.inventory[c.item]+1);
   if(kind==='stone')assert.equal(after.inventory.stone,before.inventory.stone+2);
   if(kind==='starter'){assert.equal(after.inventory.seed,before.inventory.seed+3);assert.equal(after.starterSeedsClaimed,true);}
   if(kind==='stash'){assert.equal(after.stash,null);assert.equal(after.money,before.money+15);}
   if(kind==='treasure'){assert.equal(after.forest.treasures.length,before.forest.treasures.length+1);assert.ok(after.money>before.money);}
   assert.equal((await sources()).length,1,'one successful pickup effect');
  });
 }
 for(const kind of ['fruit','stone','starter']){
  const s=fixture(kind==='starter'?'home':'forest',kind==='starter'?{x:544,y:566}:kind==='stone'?{x:stone.x,y:stone.y}:{x:616,y:4664});
  s.inventory[kind==='starter'?'seed':kind==='stone'?'stone':'guava']=9999;
  await run('full-bag-'+kind,true,s,async({snap,click,sources})=>{const before=(await snap()).state.inventory;await click('attack');assert.deepEqual((await snap()).state.inventory,before);assert.deepEqual(await sources(),[],'failed pickup stays silent');});
 }
 await writeFile(out+'/pickup-checks.json',JSON.stringify({result:'PASS',fixtures:'Disposable targeted saves; native AudioBufferSource starts and real Web Audio bus analyser output observed. No application mutation hooks or user-origin edits.',records},null,2)+'\n');
}finally{await browser.close();}
