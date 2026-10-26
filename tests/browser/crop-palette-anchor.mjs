import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {FARM_PLOTS} from '../../src/data/farms.js';
import {CROPS} from '../../src/data/crops.js';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.GAME_URL||'http://127.0.0.1:43866/';
const phase=process.env.QA_PHASE||'after';
const out=process.env.QA_OUT||'docs/verification/crop-palette-anchor-v1';
const crops=['tomato','strawberry','carrot','corn','chili','eggplant','cucumber','watermelon','pumpkin','grape','blueberry','sweetPotato'];
const closeupCrops=process.env.QA_FILTER?crops.filter(crop=>new RegExp(process.env.QA_FILTER).test(crop)):crops;
const orderedPlots=FARM_PLOTS.slice(0,16).map((plot,index)=>({...plot,index})).sort((a,b)=>a.y-b.y||a.x-b.x);

function ripe(crop){
 return {crop,growth:CROPS[crop].growthDays,wateredDay:1,missedDays:0,lastEvaluatedDay:0,plantedDay:1};
}

function farmState(){
 const state=newState();
 Object.assign(state,{area:'farm',position:{x:632,y:456},minute:600,selected:'hand',hasVisitedFarm:true,starterSeedsClaimed:true});
 state.story.intro='seen';
 for(const [index,crop] of crops.entries())state.plots[orderedPlots[index].index]=ripe(crop);
 state.wetGround=orderedPlots.slice(0,crops.length).map(plot=>({area:'farm',farm:0,x:plot.x,y:plot.y,remaining:180000}));
 return state;
}

function closeupState(crop){
 const state=newState(),plot=orderedPlots[5];
 Object.assign(state,{area:'farm',position:{x:plot.x+112,y:plot.y+112},minute:600,selected:'hand',hasVisitedFarm:true,starterSeedsClaimed:true});
 state.story.intro='seen';
 state.plots[plot.index]=ripe(crop);
 state.wetGround=[{area:'farm',farm:0,x:plot.x,y:plot.y,remaining:180000}];
 return state;
}

async function openFixture(state){
 const context=await browser.newContext({viewport:{width:1600,height:1000}}),page=await context.newPage(),errors=[],requests=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',message=>{if(['error','warning'].includes(message.type()))errors.push(message.text());});
 page.on('request',request=>requests.push(request.url()));
 await page.addInitScript(value=>localStorage.setItem('simple-life.save.v1',JSON.stringify(value)),state);
 await page.goto(base+'?qa&renderer=canvas');
 await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length,undefined,{timeout:45000});
 const snapshot=()=>page.evaluate(()=>window.__simpleLife.snapshot());
 const title=await snapshot(),button=title.controls.find(control=>control.id==='Continue'||control.id.startsWith('Continue / Day'));
 assert.ok(button&&!button.disabled,'Continue control');
 for(let attempt=0;attempt<3;attempt++){
  await page.mouse.click(button.x+button.w/2,button.y+button.h/2);
  try{await page.waitForFunction(()=>window.__simpleLife?.snapshot().state?.area==='farm'&&!window.__simpleLife.snapshot().paused,undefined,{timeout:20000});break;}
  catch(error){if(attempt===2)throw error;}
 }
 await page.waitForTimeout(350);
 return {context,page,snapshot,errors,requests};
}

await mkdir(out,{recursive:true});
try{
 const fixture=await openFixture(farmState());
 try{
  const view=await fixture.snapshot();
  for(const crop of crops)assert.ok(view.rendering.crops.some(item=>item.frame===`${crop}-ripe`),`${crop} ripe frame rendered`);
  assert.deepEqual(fixture.errors,[]);
  assert.ok(fixture.requests.every(url=>url.startsWith(new URL(base).origin)||url.startsWith('blob:')||url.startsWith('data:')),'runtime requests stay local');
  await fixture.page.screenshot({path:`${out}/${phase}-whole-farm.png`});
  await writeFile(`${out}/${phase}-snapshot.json`,JSON.stringify({phase,crops,camera:view.camera,rendering:view.rendering.crops},null,2)+'\n');
  console.log(`PASS ${phase} whole-farm crop comparison`);
 }finally{await fixture.context.close();}

 if(phase==='after'){
  let centers=[];
  try{centers=JSON.parse(await readFile(`${out}/closeup-centers.json`,'utf8')).centers||[];}catch{}
  for(const crop of closeupCrops){
   const closeup=await openFixture(closeupState(crop));
   try{
    const view=await closeup.snapshot(),item=view.rendering.crops.find(entry=>entry.frame===`${crop}-ripe`);
    assert.ok(item,`${crop} ripe close-up frame`);
    assert.deepEqual(closeup.errors,[]);
    const worldCenter={x:item.x,y:item.depth-CROPS[crop].baseOffsetY};
    const screenCenter={x:(worldCenter.x-view.camera.x)*view.camera.zoom,y:(worldCenter.y-view.camera.y)*view.camera.zoom};
    const clip={x:Math.max(0,Math.round(screenCenter.x-110)),y:Math.max(0,Math.round(screenCenter.y-210)),width:220,height:280};
    clip.width=Math.min(clip.width,1600-clip.x);clip.height=Math.min(clip.height,1000-clip.y);
    await closeup.page.screenshot({path:`${out}/${crop}-ripe-watered-raw.png`,clip});
    centers=[...centers.filter(entry=>entry.crop!==crop),{crop,worldCenter,screenCenter,clip,cropCenterInClip:{x:screenCenter.x-clip.x,y:screenCenter.y-clip.y}}].sort((a,b)=>crops.indexOf(a.crop)-crops.indexOf(b.crop));
    await writeFile(`${out}/closeup-centers.json`,JSON.stringify({note:'Coordinates identify the exact 48x48 soil-square centre and crop base in each raw live-game capture.',centers},null,2)+'\n');
    console.log('PASS ripe watered close-up',crop);
   }finally{await closeup.context.close();}
  }
 }
}finally{await browser.close();}
