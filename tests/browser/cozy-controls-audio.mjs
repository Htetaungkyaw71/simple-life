import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {contextFor} from '../../src/systems/context.js';
import {FARM_PLOTS} from '../../src/data/farms.js';
import {forestStones} from '../../src/data/forestResources.js';
import {LOCATIONS,walkable,syncInterior} from '../../src/data/locations.js';
import {ROOM} from '../../src/data/interior.js';
import {COZY_FILES} from '../../src/audio/cozy.js';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--autoplay-policy=user-gesture-required']});
const base=process.env.GAME_URL||'http://127.0.0.1:4190/',out=process.env.AUDIO_QA_OUT||'docs/verification/cozy-audio';await mkdir(out,{recursive:true});const records=[];
async function session(width,height,mobile,state=null,renderer='canvas'){
 const ctx=await browser.newContext({viewport:{width,height},hasTouch:mobile}),page=await ctx.newPage(),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.text());});page.on('request',r=>requests.push(r.url()));
 await page.addInitScript(state=>{
  if(state)localStorage.setItem('simple-life.save.v1',JSON.stringify(state));
  const Native=window.AudioContext;window.__audioInstances=[];
  window.AudioContext=class extends Native{constructor(...args){super(...args);this.qaGains=[];window.__audioInstances.push(this);}createGain(){const n=super.createGain();this.qaGains.push(n);return n;}};
 },state);
 await page.goto(base+'?qa&renderer='+renderer);await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
 const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
 const click=async(id,delay=240)=>{const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);if(mobile)await page.touchscreen.tap(c.x+c.w/2,c.y+c.h/2);else await page.mouse.click(c.x+c.w/2,c.y+c.h/2);await page.waitForTimeout(delay);};
 const world=async(x,y)=>{const c=(await snap()).camera,px=(x-c.x)*c.zoom,py=(y-c.y)*c.zoom;if(mobile)await page.touchscreen.tap(px,py);else await page.mouse.click(px,py);await page.waitForTimeout(250);};
 const stick=async(dx,dy,ms)=>{const b=(await snap()).controls.find(c=>c.id==='move-stick'),cdp=await ctx.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+b.w/2+dx,y:b.y+b.h/2+dy}]});await page.waitForTimeout(ms);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();await page.waitForTimeout(180);};
 assert.equal((await snap()).audio.context,'locked');assert.ok(!requests.some(u=>u.endsWith('.wav')));
 if(state)await click('Continue');else{await click('Play');await click('Play as Boy');await click('intro-skip');}
 await page.waitForFunction(()=>window.__simpleLife.snapshot().audio.pending===0&&window.__simpleLife.snapshot().audio.context==='running');await page.waitForTimeout(2200);
 async function level(bus=3){return page.evaluate(async index=>{const c=window.__audioInstances[0],a=c.createAnalyser();a.fftSize=2048;c.qaGains[index].connect(a);let sum=0,n=0,peak=0;for(let i=0;i<15;i++){const b=new Float32Array(a.fftSize);a.getFloatTimeDomainData(b);for(const v of b){sum+=v*v;n++;peak=Math.max(peak,Math.abs(v));}await new Promise(r=>setTimeout(r,30));}c.qaGains[index].disconnect(a);a.disconnect();return {rms:Math.sqrt(sum/n),peak};},bus);}
 async function finish(name,details={}){await page.screenshot({path:out+'/'+name+'.png'});assert.deepEqual(errors,[],name);assert.ok(requests.every(u=>u.startsWith(new URL(base).origin)||u.startsWith('data:')||u.startsWith('blob:')));assert.deepEqual((await snap()).audio.failures,[]);records.push({name,viewport:{width,height},renderer,...details,audio:(await snap()).audio,errors});await writeFile(out+'/browser-checks.json',JSON.stringify({result:'IN PROGRESS',records},null,2));console.log('PASS',name);await ctx.close();}
 return {ctx,page,snap,click,world,stick,level,finish};
}
const fixture=(area,selected='hand',minute=720)=>{const s=newState();s.area=area;s.selected=selected;s.minute=minute;s.story.intro='seen';s.hasVisitedFarm=true;s.forestTutorialComplete=true;s.nightWarningSeen=true;return s;};
try{
 for(const [width,height]of [[1440,900],[1280,720],[1024,768],[844,390],[640,360],[390,844],[360,640]]){
  const q=await session(width,height,width<1000);assert.equal((await q.snap()).state.selected,'hand');assert.ok(!(await q.snap()).controls.some(c=>c.id==='tool-hand'));
  await q.click('choose-seeds');await q.click('bag-tab-gear');assert.ok(!(await q.snap()).controls.some(c=>c.id==='bag-item-hand'));await q.click('bag-item-axe');await q.click('bag-action');assert.equal((await q.snap()).state.selected,'axe');
  await q.click('choose-seeds');await q.click('bag-tab-gear');await q.click('bag-item-axe');assert.equal((await q.snap()).controls.find(c=>c.id==='bag-action').label,'Put away');await q.click('bag-action');assert.equal((await q.snap()).state.selected,'hand');
  if(width<1000){const c=(await q.snap()).controls;for(const id of ['jump','attack']){const b=c.find(c=>c.id===id);assert.ok(b.w>=44&&b.h>=44&&b.x>=0&&b.y>=0&&b.x+b.w<=width&&b.y+b.h<=height);}await q.click('jump',30);assert.ok((await q.snap()).jump.active);await q.page.waitForTimeout(800);}
  await q.page.reload();await q.page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await q.click('Continue');assert.equal((await q.snap()).state.selected,'hand');
  await q.finish('controls-'+width+'x'+height,{freshDefault:true,noHandItem:true,putAway:true,reload:true});
 }
 for(const mobile of [true,false]){
  const s=fixture('farm','seed'),bed=FARM_PLOTS[0];s.position={x:bed.x,y:bed.y+16};s.inventory.seed=2;
  const q=await session(mobile?390:640,mobile?844:360,mobile,s);assert.equal((await q.snap()).context.type,'plot');assert.equal((await q.snap()).context.index,0);await q.world(bed.x,bed.y);
  assert.equal((await q.snap()).state.plots[0].crop,mobile?null:'tomato');
  if(mobile)await q.click('attack');assert.equal((await q.snap()).state.plots[0].crop,'tomato');assert.equal((await q.snap()).state.inventory.seed,1);
  await q.click('tool-water');await q.click('attack');assert.equal((await q.snap()).state.plots[0].wateredDay,1);
  const sound=await q.level(4);assert.ok(sound.peak>.005,'restored watering feedback');await q.page.keyboard.press('2');await q.page.keyboard.press('2');assert.equal((await q.snap()).state.selected,'water','desktop numeric shortcuts remain idempotent');
  await q.click('tool-water');assert.equal((await q.snap()).state.selected,'hand');await q.finish(mobile?'touch-farming':'desktop-small-window',{worldTapBlocked:mobile,plant:true,water:true,sound,keyboardPreserved:true});
 }
 const grown=fixture('farm','harvest');grown.position={x:FARM_PLOTS[0].x,y:FARM_PLOTS[0].y+16};grown.plots[0]={crop:'tomato',growth:3,wateredDay:1,missedDays:0,lastEvaluatedDay:0};const harvest=await session(360,640,true,grown);await harvest.click('attack');assert.equal((await harvest.snap()).state.inventory.tomato,2);await harvest.finish('touch-harvest',{harvest:true});
 const door=fixture('home');door.position={x:480,y:500};const d=await session(390,844,true,door);assert.equal((await d.snap()).context.type,'travel');await d.world(480,496);assert.equal((await d.snap()).state.area,'home');await d.click('attack',800);assert.equal((await d.snap()).state.area,'interior');assert.equal((await d.snap()).controls.find(c=>c.id==='attack').disabled,false);await d.stick(0,30,150);assert.equal((await d.snap()).context.type,'travel');await d.click('attack',800);assert.equal((await d.snap()).state.area,'home');await d.finish('touch-door',{enterExit:true,joystickApproach:true});
 syncInterior(360,640);const bedState=fixture('interior','hand',1320);bedState.roomSize={width:ROOM.width,height:ROOM.height};bedState.position={x:ROOM.bed.x-24,y:ROOM.bed.y};const b=await session(360,640,true,bedState);assert.equal((await b.snap()).context.type,'bed');assert.equal((await b.snap()).controls.find(c=>c.id==='jump').disabled,true);await b.click('attack');const sleep=(await b.snap()).controls.find(c=>c.id.startsWith('Sleep until'));await b.click(sleep.id);assert.equal((await b.snap()).state.day,2);await b.finish('touch-sleep',{bedUse:true,sleep:true});
 const stone=forestStones().find(n=>n.region==='entrance'),fs=fixture('forest');fs.position={x:stone.x,y:stone.y};const f=await session(640,360,true,fs);assert.equal((await f.snap()).context.type,'stone');await f.world(stone.x,stone.y);assert.equal((await f.snap()).state.inventory.stone,0);await f.click('attack');assert.equal((await f.snap()).state.inventory.stone,2);const ambience=await f.level();assert.ok(ambience.rms>.001,'audible Forest bus');await f.page.waitForTimeout(31000);assert.ok((await f.snap()).audio.loops.some(v=>v.key==='ambience:forestDay'));await f.finish('forest-day',{stone:true,ambience,loopSeconds:31});
 const ns=fixture('forest','hand',1320);ns.position={x:5120,y:4848};const n=await session(640,360,true,ns,'webgl');const night=await n.level();assert.ok(night.rms>.001);assert.ok((await n.snap()).audio.loops.some(v=>v.key==='ambience:night'));await n.page.evaluate(()=>window.dispatchEvent(new Event('blur')));await n.page.waitForTimeout(250);assert.equal((await n.snap()).audio.context,'suspended');await n.page.evaluate(()=>window.dispatchEvent(new Event('focus')));await n.page.waitForTimeout(300);assert.equal((await n.snap()).audio.context,'running');assert.equal(await n.page.evaluate(()=>window.__audioInstances.length),1);await n.finish('forest-night',{night,focusSuspendResume:true,oneContext:true});
 // Decode every current production sample through the actual browser decoder.
 const a=await session(1280,720,false);const decoded=await a.page.evaluate(async files=>{const c=window.__audioInstances[0];const rows=[];for(const [id,path]of Object.entries(files)){const response=await fetch(path);if(!response.ok)throw Error(id);const b=await c.decodeAudioData(await response.arrayBuffer());rows.push({id,seconds:b.duration,channels:b.numberOfChannels});}return rows;},COZY_FILES);assert.equal(decoded.length,Object.keys(COZY_FILES).length);await a.finish('audio-decode',{decoded});
 await writeFile(out+'/browser-checks.json',JSON.stringify({result:'PASS',fixtures:'Isolated QA saves only for targeted interactions; fresh defaults checked through real New Game. User origins untouched.',records},null,2));console.log('Cozy audio/controls browser PASS',records.length);
}finally{await browser.close();}
