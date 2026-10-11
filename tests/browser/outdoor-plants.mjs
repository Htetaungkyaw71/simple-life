import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {forestStones} from '../../src/data/forestResources.js';
import {TREASURES} from '../../src/data/forest.js';
import {VEGETATION,vegetationKey} from '../../src/data/vegetation.js';
import {vegetationContext,useVegetation} from '../../src/systems/vegetation.js';
import {walkable,syncInterior} from '../../src/data/locations.js';
import {ROOM} from '../../src/data/interior.js';
import {COZY_FILES} from '../../src/audio/cozy.js';
import {contextFor} from '../../src/systems/context.js';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.GAME_URL||'http://127.0.0.1:4190/',out=process.env.AUDIO_QA_OUT||'docs/verification/outdoor-plants/local',records=[];await mkdir(out,{recursive:true});
const fixture=(area,position,selected='hand')=>{const s=newState();Object.assign(s,{area,position,selected,minute:720,hasVisitedFarm:true,hasVisitedCity:true,forestTutorialComplete:true,nightWarningSeen:true});s.story.intro='seen';return s;};
async function run(name,mobile,state,check){
 const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:720},hasTouch:mobile}),p=await ctx.newPage(),errors=[],requests=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(['warning','error'].includes(m.type()))errors.push(m.text());});p.on('request',r=>requests.push(r.url()));
 await p.addInitScript(s=>{
  if(!sessionStorage.getItem('fixture')){localStorage.setItem('simple-life.save.v1',JSON.stringify(s));sessionStorage.setItem('fixture','1');}window.__starts=[];window.__contexts=[];
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
 assert.deepEqual(await sources(),[],'Continue is silent');assert.deepEqual((await snap()).audio.profile.music,{});assert.ok((await snap()).audio.loops.every(v=>v.key.startsWith('ambience:')));await p.waitForTimeout(2100);const music=await level(2),nature=await level(3);assert.equal(music.peak,0);if(state.area==='interior')assert.equal(nature.peak,0);else assert.ok(nature.rms>.0001,'outdoor nature is audible');const interaction=await check({p,snap,click,sources,level});
 assert.deepEqual(errors,[]);assert.deepEqual((await snap()).audio.failures,[]);
 assert.ok(requests.every(u=>!u.includes('/sfx-')||Object.values(COZY_FILES).some(path=>u.endsWith('/'+path))),'unused effects never fetched');
 await p.screenshot({path:out+'/'+name+'.png'});records.push({name,mobile,music,nature,interaction,titleLevel:windowTitleLevel,nonLoopStarts:await sources(),audio:(await snap()).audio,area:(await snap()).state.area,errors});console.log('PASS',name);await ctx.close();
}
function plantFixture(area,name){
 const s=fixture(area,{x:480,y:600});
 for(const n of VEGETATION[area].grass.filter(n=>n.prop?.name===name))for(const distance of [32,48,60])for(const [dx,dy]of [[0,1],[-1,0],[1,0],[0,-1]]){
  s.position={x:n.x+dx*distance,y:n.y+dy*distance};
  if(!walkable(area,s.position.x,s.position.y,12,false,s))continue;
  const c=contextFor(s,null,'down');if(c?.id===n.id&&useVegetation(structuredClone(s),c).ok)return {s,n};
 }throw Error('No reachable '+area+' '+name);
}
try{
 for(const mobile of [false,true])for(const [area,name]of [['home','flowers'],['farm','flowers2'],['city','flowers2'],['forest','flowers2'],['forest','cp-plant-1-0'],['forest','bamboo-clump']]){
  if(process.env.BROWSER_QUICK==='1'&&!['home','farm'].includes(area))continue;
  const {s,n}=plantFixture(area,name);
  await run((mobile?'phone':'mac')+'-'+area+'-'+name,mobile,s,async({p,snap,click,sources,level})=>{
   const before=(await snap()).state.inventory.grass;assert.equal((await snap()).context.id,n.id);
   assert.ok((await snap()).groundPlants.some(v=>v.id===n.id&&v.visible));
   await p.evaluate(()=>{const c=window.__contexts[0],a=c.createAnalyser();a.fftSize=2048;c.qaGains[4].connect(a);window.__pickupPeak=0;const timer=setInterval(()=>{const b=new Float32Array(a.fftSize);a.getFloatTimeDomainData(b);for(const v of b)window.__pickupPeak=Math.max(window.__pickupPeak,Math.abs(v));},10);setTimeout(()=>{clearInterval(timer);c.qaGains[4].disconnect(a);a.disconnect();},1000);});
   if(mobile){const c=(await snap()).camera;await p.touchscreen.tap((n.x-c.x)*c.zoom,(n.y-c.y-12)*c.zoom);assert.equal((await snap()).state.inventory.grass,before,'ordinary mobile world taps stay silent');await click('attack',50);}
   else{const c=(await snap()).camera;await p.mouse.click((n.x-c.x)*c.zoom,(n.y-c.y-12)*c.zoom);await p.waitForTimeout(50);}
   assert.equal((await snap()).state.inventory.grass,before+1);assert.ok((await snap()).state.vegetation[vegetationKey(s)].grass.includes(n.id));
   assert.equal((await snap()).groundPlants.some(v=>v.id===n.id),false,'visual removed immediately');assert.equal((await sources()).length,1,'one collection effect');const pickupPeak=await p.evaluate(()=>window.__pickupPeak);assert.ok(pickupPeak>.0001,'pickup effect outputs real audio');const collectionStarts=await sources();
   await p.screenshot({path:out+'/'+(mobile?'phone':'mac')+'-'+area+'-'+name+'-gathered.png'});
   await p.reload();await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue');
   assert.equal((await snap()).state.inventory.grass,before+1);assert.equal((await snap()).groundPlants.some(v=>v.id===n.id),false,'removed plant stays removed after Continue');return {plant:n.id,pickupPeak,collectionStarts,reload:true};
  });
 }
 for(const mobile of [false,true]){
  syncInterior(mobile?390:1280,mobile?844:720);const s=fixture('interior',{x:ROOM.exit.x,y:ROOM.exit.y-8});s.roomSize={width:ROOM.width,height:ROOM.height};
  await run((mobile?'phone':'mac')+'-exit-home',mobile,s,async({p,snap,click,level,sources})=>{
   assert.equal((await snap()).context.type,'travel');if(mobile)await click('attack',2800);else{await p.keyboard.press('e');await p.waitForTimeout(2800);}assert.equal((await snap()).state.area,'home');assert.deepEqual(await sources(),[],'door stays silent');assert.ok((await level(3)).rms>.0001,'birds resume on exiting');
   const outdoor=await level(3);assert.deepEqual((await snap()).audio.profile.music,{});return {exit:true,outdoor};
  });
 }
 await writeFile(out+'/plant-checks.json',JSON.stringify({result:'PASS',fixtures:'Disposable saves; real mouse/touch actions, visible Phaser sprites, reload persistence and measured audio output. User saves untouched.',records},null,2)+'\n');
}finally{await browser.close();}
