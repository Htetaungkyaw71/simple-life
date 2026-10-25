import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {syncInterior} from '../../src/data/locations.js';
import {ROOM} from '../../src/data/interior.js';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.GAME_URL||'http://127.0.0.1:4199/';
const out=process.env.QA_OUT||'/tmp/simple-life-meat-toolbar';
await mkdir(out,{recursive:true});
const results=[];

async function run(name,state,check,{width=1280,height=720}={}){
 syncInterior(width,height);
 const touch=width<1000,ctx=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch}),page=await ctx.newPage(),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.text());});
 page.on('request',r=>requests.push(r.url()));
 await page.addInitScript(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),state);
 const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
 const click=async id=>{const ss=await snap(),c=ss.controls.find(c=>c.id===id||c.id.startsWith(id));assert.ok(c&&!c.disabled,id+' / controls: '+ss.controls.map(c=>c.id).join(', '));await(touch?page.touchscreen.tap(c.x+c.w/2,c.y+c.h/2):page.mouse.click(c.x+c.w/2,c.y+c.h/2));await page.waitForTimeout(100);};
 try{
  await page.goto(base+'?qa&renderer=canvas');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue');
  await check({page,snap,click});
  await page.screenshot({path:out+'/'+name+'.png'});
  assert.deepEqual(errors,[]);assert.ok(requests.every(r=>r.startsWith(new URL(base).origin)||r.startsWith('blob:')||r.startsWith('data:')));
  results.push({name,width,height,result:'PASS'});
 }finally{await ctx.close();}
}

const farm=newState();Object.assign(farm,{area:'farm',position:{x:376,y:248},health:37,energy:62,starterSeedsClaimed:true,hasVisitedFarm:true});farm.story.intro='seen';farm.inventory.seed=3;
await run('toolbar-no-flash',farm,async({page,snap,click})=>{
 const noToggleText=s=>!s.texts.some(t=>/Seed \/ (Selected|Put away)|Harvest tool \/ (Selected|Put away)/.test(t.text));
 const clickWithStableMeters=async id=>{
  const expected=(await snap()).meters;
  await page.evaluate(()=>{window.__meterFrames=[];let remaining=12;const observe=()=>{window.__meterFrames.push(window.__simpleLife.snapshot().meters);if(--remaining)requestAnimationFrame(observe);};requestAnimationFrame(observe);});
  await click(id);await page.waitForTimeout(150);
  const frames=await page.evaluate(()=>window.__meterFrames);assert.ok(frames.length>=6);for(const frame of frames)assert.deepEqual(frame,expected);
 };
 await clickWithStableMeters('tool-seed');let s=await snap();assert.equal(s.state.selected,'seed');assert.equal(s.farmGuide.expanded,false);assert.ok(noToggleText(s));assert.ok(!s.texts.some(t=>t.visible!==false&&t.text.startsWith('Next:')));
 await clickWithStableMeters('tool-seed');s=await snap();assert.equal(s.state.selected,'hand');assert.equal(s.farmGuide.expanded,false);assert.ok(noToggleText(s));
 await clickWithStableMeters('tool-harvest');s=await snap();assert.equal(s.state.selected,'harvest');assert.equal(s.farmGuide.expanded,false);assert.ok(noToggleText(s));
});

const meal=newState();Object.assign(meal,{area:'interior',position:{...ROOM.spawn},roomSize:{width:ROOM.width,height:ROOM.height},health:50,energy:100,hasVisitedFarm:true});meal.story.intro='seen';meal.settlement.stove=true;meal.inventory.meat=1;meal.inventory.wood=1;
await run('meat-cook-eat',meal,async({snap,click})=>{
 await click('choose-seeds');await click('bag-tab-gear');let s=await snap();assert.ok(s.controls.some(c=>c.id==='bag-item-meat'),'Meat is visible on the first Gear page');
 await click('bag-item-meat');s=await snap();assert.equal(s.controls.find(c=>c.id==='bag-action').label,'Cook');await click('bag-action');s=await snap();assert.equal(s.menuContent.title,'Home hearth');
 await click('resource-action-0');s=await snap();assert.equal(s.state.inventory.meat,0);assert.equal(s.state.inventory.wood,0);assert.equal(s.state.inventory.grilledMeat,1);
 await click('resource-action-1');s=await snap();assert.ok(s.controls.some(c=>c.id==='bag-item-grilledMeat'));assert.equal(s.controls.find(c=>c.id==='bag-action').label,'Eat');await click('bag-action');s=await snap();assert.equal(s.state.inventory.grilledMeat,0);assert.equal(s.state.health,100);assert.equal(s.state.energy,100);
},{width:640,height:360});

await writeFile(out+'/results.json',JSON.stringify({result:'PASS',method:'Disposable localStorage saves and real Chrome canvas mouse/touch controls; user storage untouched.',results},null,2)+'\n');
console.log(JSON.stringify({result:'PASS',results}));
await browser.close();
