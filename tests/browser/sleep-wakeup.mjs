import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {ROOM} from '../../src/data/interior.js';
import {syncInterior,nearestSafe} from '../../src/data/locations.js';
import {COZY_FILES} from '../../src/audio/cozy.js';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.GAME_URL||'http://127.0.0.1:4190/',out=process.env.AUDIO_QA_OUT||'docs/verification/sleep-wakeup',records=[];await mkdir(out,{recursive:true});
const fixture=(area,position,selected='hand')=>{const s=newState();Object.assign(s,{area,position,selected,minute:720,hasVisitedFarm:true,hasVisitedCity:true,forestTutorialComplete:true,nightWarningSeen:true});s.story.intro='seen';return s;};
async function run(name,mobile,state,check){
 const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:720},hasTouch:mobile}),p=await ctx.newPage(),errors=[],requests=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(['warning','error'].includes(m.type()))errors.push(m.text());});p.on('request',r=>requests.push(r.url()));
 await p.addInitScript(s=>{
  localStorage.setItem('simple-life.save.v1',JSON.stringify(s));window.__starts=[];window.__contexts=[];
  const Native=window.AudioContext;window.AudioContext=class extends Native{constructor(...args){super(...args);this.qaGains=[];window.__contexts.push(this);}createGain(){const g=super.createGain();this.qaGains.push(g);return g;}createBufferSource(){const source=super.createBufferSource(),start=source.start.bind(source);source.start=(...args)=>{window.__starts.push({loop:source.loop,seconds:source.buffer?.duration,rate:source.playbackRate.value,scheduledAt:args[0]??this.currentTime,requestedAt:this.currentTime});return start(...args);};return source;}};
 },state);
 const pageURL=new URL(base);pageURL.searchParams.set('qa','');await p.goto(pageURL.href);await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
 const snap=()=>p.evaluate(()=>window.__simpleLife.snapshot());
 const click=async(id,delay=300)=>{const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);if(mobile)await p.touchscreen.tap(c.x+c.w/2,c.y+c.h/2);else await p.mouse.click(c.x+c.w/2,c.y+c.h/2);await p.waitForTimeout(delay);};
 let windowTitleLevel;
 const level=bus=>p.evaluate(async index=>{const c=window.__contexts[0],a=c.createAnalyser();a.fftSize=2048;c.qaGains[index].connect(a);let sum=0,n=0,peak=0;for(let i=0;i<10;i++){const b=new Float32Array(a.fftSize);a.getFloatTimeDomainData(b);for(const v of b){sum+=v*v;n++;peak=Math.max(peak,Math.abs(v));}await new Promise(r=>setTimeout(r,30));}c.qaGains[index].disconnect(a);a.disconnect();return {rms:Math.sqrt(sum/n),peak};},bus);
 const sources=()=>p.evaluate(()=>window.__starts.filter(s=>!s.loop));
 if(name==='title-to-world'){await p.keyboard.press('Shift');await p.waitForFunction(()=>window.__simpleLife.snapshot().audio.loops.some(v=>v.key==='music:cozyMusic'));await p.waitForTimeout(2800);const titleLevel=await level(2);assert.ok(titleLevel.rms>.001);windowTitleLevel=titleLevel;}
 await click('Continue');await p.waitForFunction(()=>window.__simpleLife.snapshot().audio.pending===0&&window.__simpleLife.snapshot().audio.context==='running');
 assert.deepEqual(await sources(),[],'Continue is silent');assert.deepEqual((await snap()).audio.profile.music,{});assert.ok((await snap()).audio.loops.every(v=>v.key.startsWith('ambience:')));await p.waitForTimeout(2100);const music=await level(2),nature=await level(3);assert.equal(music.peak,0);if(name==='forest-day-nature')assert.ok(nature.rms>.0005);else if(state.area==='home')assert.ok(nature.rms>.0001,'outdoor birds are audible without wind');if(state.area==='interior'){assert.equal(nature.peak,0,'no indoor wind-like background');assert.deepEqual((await snap()).audio.profile.layers,{});assert.equal((await snap()).audio.loops.length,0);}assert.ok(!(await snap()).audio.loops.some(v=>/wind|winter/.test(v.key)));await check({p,snap,click,sources,level});
 assert.deepEqual(errors,[]);assert.deepEqual((await snap()).audio.failures,[]);
 assert.ok(requests.every(u=>!/(meadow|winter|fireplace)\.wav/.test(u)),'wind and indoor background WAVs are never requested');
 assert.ok(requests.every(u=>!u.includes('/sfx-')||Object.values(COZY_FILES).some(path=>u.endsWith('/'+path))),'unused effects never fetched');
 await p.screenshot({path:out+'/'+name+'.png'});records.push({name,mobile,music,nature,titleLevel:windowTitleLevel,nonLoopStarts:await sources(),audio:(await snap()).audio,area:(await snap()).state.area,errors});console.log('PASS',name);await ctx.close();
}
try{
 for(const [name,area,position]of [['home-day-no-wind','home',{x:480,y:600}],['forest-day-nature','forest',{x:616,y:4664}],['snow-no-wind','forest',{x:480,y:1200}],['desert-no-wind','forest',{x:9500,y:1820}]]){
  const s=fixture(area,nearestSafe(area,position));await run(name,true,s,async({snap})=>{assert.equal(Object.hasOwn((await snap()).audio.profile.layers,'wind'),false);assert.equal(Object.hasOwn((await snap()).audio.profile.layers,'winter'),false);});
 }
 for(const mobile of [false,true])for(const minute of [720,1320]){
  syncInterior(mobile?390:1280,mobile?844:720);const s=fixture('interior',{x:ROOM.bed.x-24,y:ROOM.bed.y});s.roomSize={width:ROOM.width,height:ROOM.height};s.minute=minute;s.energy=35;
  await run((mobile?'phone':'mac')+'-sleep-'+(minute===1320?'morning':'evening'),mobile,s,async({p,snap,click,sources,level})=>{
   assert.equal((await snap()).context.type,'bed');if(mobile)await click('attack');else{await p.keyboard.press('e');await p.waitForTimeout(300);}assert.deepEqual(await sources(),[],'opening bed menu is silent');
   const button=(await snap()).controls.find(c=>c.id.startsWith('Sleep until'));await click(button.id,180);const after=(await snap()).state;
   assert.equal(after.energy,100);assert.equal(after.day,minute===1320?2:1);assert.ok(after.minute>=(minute===1320?360:1200)&&after.minute<(minute===1320?365:1205));
   const starts=await sources();assert.equal(starts.length,2,'sleep and one wake effect');assert.ok(Math.abs(starts[0].seconds-2.9700226757369617)<.001);
   assert.ok(Math.abs(starts[1].seconds-(minute===1320?8.306938775510204:.41002267573696144))<.001,'rooster only on morning waking');
   assert.ok(starts[1].scheduledAt>=starts[0].scheduledAt+starts[0].seconds/starts[0].rate+.075,'wake follows the sleep buffer');
   await p.waitForTimeout(Math.max(0,starts[1].scheduledAt-starts[1].requestedAt)*1000);const effect=await level(4);assert.ok(effect.peak>.001,'actual wake output');assert.equal((await level(2)).peak,0,'no wake music');
   await p.waitForTimeout(300);assert.equal((await sources()).length,2,'wake is not repeated');
  });
 }
 syncInterior(390,844);const s=fixture('interior',{x:ROOM.bed.x-24,y:ROOM.bed.y});s.roomSize={width:ROOM.width,height:ROOM.height};s.minute=1320;s.energy=35;
 await run('phone-cancel-sleep',true,s,async({snap,click,sources})=>{await click('attack');await click('Not yet');assert.equal((await snap()).state.energy,35);assert.equal((await snap()).state.day,1);assert.deepEqual(await sources(),[]);});
 await writeFile(out+'/sleep-checks.json',JSON.stringify({result:'PASS',fixtures:'Disposable targeted saves; native source starts, audio-clock scheduling and real Web Audio output observed. User saves untouched.',records},null,2)+'\n');
}finally{await browser.close();}
