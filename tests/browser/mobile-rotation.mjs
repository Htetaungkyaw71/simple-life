import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {STORY_FLAGS} from '../../src/data/story.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.GAME_URL||'http://127.0.0.1:4196/',out=process.env.QA_OUT||'/tmp/simple-life-mobile-rotation',results=[];await mkdir(out,{recursive:true});
const fixture=(area,position)=>{const s=newState();Object.assign(s,{area,position,minute:720,forestTutorialComplete:true,hasVisitedCity:true,hasVisitedFarm:true});s.story.intro='seen';s.story.flags=STORY_FLAGS.filter(f=>!['placed','complete'].includes(f));s.inventory.seed=3;return s;};
async function open(s,renderer='canvas',size={width:390,height:844}){
 const ctx=await browser.newContext({viewport:size,hasTouch:true,isMobile:true}),p=await ctx.newPage(),errors=[],requests=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(['warning','error'].includes(m.type()))errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});p.on('request',r=>requests.push(r.url()));
 await p.addInitScript(s=>{if(s&&!sessionStorage.getItem('fixture')){localStorage.setItem('simple-life.save.v1',JSON.stringify(s));sessionStorage.setItem('fixture','1');}window.__qaOneShots=[];const start=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...a){if(!this.loop)window.__qaOneShots.push(this.buffer?.duration);return start.apply(this,a);};},s);
 const url=new URL(base);url.searchParams.set('qa','');url.searchParams.set('renderer',renderer);await p.goto(url.href);await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
 const snap=()=>p.evaluate(()=>window.__simpleLife.snapshot());
 const tap=async id=>{const b=(await snap()).controls.find(c=>c.id===id);assert.ok(b&&!b.disabled,id);const box=await p.locator('canvas').boundingBox();await p.touchscreen.tap(box.x+b.x+b.w/2,box.y+b.y+b.h/2);await p.waitForTimeout(200);};
 const bounds=async()=>{const s=await snap(),{width,height}=p.viewportSize();const box=await p.locator('canvas').boundingBox();assert.equal(box.width,width);assert.equal(box.height,height);for(const b of s.controls){assert.ok(b.x>=0&&b.y>=0&&b.x+b.w<=width&&b.y+b.h<=height,b.id+' viewport bounds');assert.ok(b.w>=44&&b.h>=44,b.id+' touch size');}};
 const clean=()=>{assert.deepEqual(errors,[]);assert.ok(requests.every(r=>r.startsWith(new URL(base).origin)||r.startsWith('blob:')||r.startsWith('data:')));};
 if(s)await tap('Continue');return {ctx,p,snap,tap,bounds,clean,errors,requests};
}
try{
 for(const renderer of ['canvas','webgl']){
  const t=await open(fixture('farm',{x:376,y:248}),renderer),{ctx,p,snap,tap,bounds,clean}=t,cdp=await ctx.newCDPSession(p);
  await tap('tool-seed');await tap('attack');assert.ok((await snap()).state.plots.some(c=>c.crop==='tomato'));await tap('tool-water');await tap('attack');assert.ok((await snap()).state.plots.some(c=>c.wateredDay===1));
  let held=false;
  for(const [i,[width,height]]of [[390,844],[844,390],[390,844],[640,360],[844,300],[568,256],[390,844]].entries()){
   await p.evaluate(short=>{const a=document.getElementById('app');for(const side of ['left','right','bottom'])a.style.setProperty('--safe-'+side,(short?(side==='bottom'?21:44):0)+'px');},width===844&&height===300);await p.setViewportSize({width,height});await p.evaluate(()=>dispatchEvent(new Event('orientationchange')));await p.waitForTimeout(550);
   if(held){assert.ok(!Math.hypot((await snap()).input.stick?.x||0,(await snap()).input.stick?.y||0),'rotation releases movement');await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});}
   await bounds();if((await snap()).state.selected==='water'){await tap('tool-water');assert.equal((await snap()).state.selected,'hand');}await tap('tool-water');assert.equal((await snap()).state.selected,'water');await tap('choose-seeds');await bounds();if((await snap()).controls.some(c=>c.id==='bag-page')){await tap('bag-page');await bounds();}await tap('bag-close');
   await tap('pause');await bounds();await tap('Audio / ON');await bounds();await tap('audio-master-down');await tap('audio-master-up');await tap('audio-back');await tap('JOURNAL');await bounds();await tap('journal-close');await tap('Resume');
   const s=await snap(),b=s.controls.find(c=>c.id==='move-stick'),sign=i%2?-1:1;
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+b.w*(sign>0?.75:.25),y:b.y+b.h/2}]});
   await p.waitForFunction(p=>{const s=window.__simpleLife.snapshot();return Math.hypot(s.state.position.x-p.x,s.state.position.y-p.y)>10;},s.state.position,{timeout:5000});held=true;
   await p.screenshot({path:out+'/'+renderer+'-'+width+'x'+height+'.png'});
   results.push({case:'rotate-play',renderer,width,height,movement:true,bag:true,pauseAudioJournal:true});console.log('PASS',renderer,width,height);
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await tap('jump');await p.waitForFunction(()=>window.__simpleLife.snapshot().jump.active);await p.waitForFunction(()=>!window.__simpleLife.snapshot().jump.active,{timeout:3000});
  await p.evaluate(()=>{document.getElementById('game').style.transform='translate(12px,18px)';visualViewport.dispatchEvent(new Event('scroll'));});await p.waitForTimeout(350);await tap('pause');await tap('Save');const saved=(await snap()).state;await p.reload();await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await tap('Continue');assert.equal((await snap()).state.money,saved.money);assert.deepEqual((await snap()).state.inventory,saved.inventory);clean();await ctx.close();
 }
 // Actual edge travel, with warmed audio and already recorded Journal flags, so
 // one-shot output measures arrival rather than a new story-step notification.
 for(const [name,area,position,key,to]of [
  ['home-farm','home',{x:480,y:1104},'ArrowDown','farm'],['farm-home','farm',{x:320,y:48},'ArrowUp','home'],
  ['home-city','home',{x:2192,y:640},'ArrowRight','city'],['city-home','city',{x:48,y:488},'ArrowLeft','home'],
  ['home-forest','home',{x:720,y:48},'ArrowUp','forest'],['forest-home','forest',{x:5120,y:5088},'ArrowDown','home']]){
  const t=await open(fixture(area,position),'canvas',{width:844,height:390}),{ctx,p,snap,clean}=t;
  await p.waitForFunction(()=>window.__simpleLife.snapshot().audio.pending===0);await p.waitForTimeout(1300);const before=await p.evaluate(()=>window.__qaOneShots.length);
  await p.keyboard.down(key);try{await p.waitForFunction(to=>window.__simpleLife.snapshot().state.area===to,to,{timeout:6000});}finally{await p.keyboard.up(key);}await p.waitForTimeout(800);
  assert.equal(await p.evaluate(()=>window.__qaOneShots.length),before,name+' no transition effect');assert.equal((await snap()).audio.voices,0);clean();results.push({case:name,silent:true});console.log('PASS silent',name);await ctx.close();
 }
 // A fresh phone can enter the game even with the landscape browser bars open.
 const t=await open(null,'canvas',{width:568,height:256});await t.bounds();await t.tap('Controls');await t.bounds();await t.tap('Close');await t.tap('Play');await t.bounds();await t.tap('Play as Boy');for(let i=0;i<4;i++){await t.bounds();await t.tap('intro-continue');}await t.bounds();assert.equal((await t.snap()).state.money,60);t.clean();await t.ctx.close();results.push({case:'fresh-short-landscape',width:568,height:256});
 await writeFile(out+'/results.json',JSON.stringify({result:'PASS',method:'Disposable native Chrome touch contexts, real rotated gameplay, interrupted touches, actual planting/watering, pause/Bag/audio/Journal/reload. Targeted preload saves isolate terrain and completed Journal flags for arrival sound measurement; no user save touched.',results},null,2));
}catch(e){await writeFile(out+'/failure.txt',e.stack);throw e;}finally{await browser.close();}
