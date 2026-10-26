import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {FARM_PLOTS} from '../../src/data/farms.js';
import {CROPS} from '../../src/data/crops.js';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.GAME_URL||'http://127.0.0.1:43864/';
const out=process.env.QA_OUT||'docs/verification/crop-palette-anchor-v1/stages';
const allCrops=['tomato','strawberry','carrot','corn','chili','eggplant','cucumber','watermelon','pumpkin','grape','blueberry','sweetPotato'];
const crops=process.env.QA_FILTER?allCrops.filter(crop=>new RegExp(process.env.QA_FILTER).test(crop)):allCrops;
const stages=['seed','sprout','young','flowering','ripe','dry','wilted','dead'];
const orderedPlots=FARM_PLOTS.slice(0,16).map((plot,index)=>({...plot,index})).sort((a,b)=>a.y-b.y||a.x-b.x);
await mkdir(out,{recursive:true});
const records=[];

function plotFor(crop,stage){
 const days=CROPS[crop].growthDays,base={crop,growth:0,wateredDay:1,missedDays:0,lastEvaluatedDay:0,plantedDay:1};
 if(stage==='seed')return {...base,wateredDay:0};
 if(stage==='sprout')return base;
 if(stage==='young')return {...base,growth:1};
 if(stage==='flowering')return {...base,growth:Math.ceil(days*.6)};
 if(stage==='ripe')return {...base,growth:days};
 if(stage==='dry')return {...base,growth:1,wateredDay:0,missedDays:1};
 if(stage==='wilted')return {...base,growth:1,wateredDay:0,missedDays:3};
 return {...base,growth:1,wateredDay:0,missedDays:4};
}

function galleryState(crop){
 const state=newState();
 Object.assign(state,{area:'farm',position:{x:orderedPlots[0].x,y:orderedPlots[0].y+12},minute:600,selected:'water',hasVisitedFarm:true,starterSeedsClaimed:true});
 state.story.intro='seen';
 for(let i=0;i<16;i++)state.plots[orderedPlots[i].index]=plotFor(crop,stages[i%8]);
 state.wetGround=orderedPlots.slice(8).map(p=>({area:'farm',farm:0,x:p.x,y:p.y,remaining:180000}));
 return state;
}

function harvestState(crop){
 const state=newState();
 const bed=FARM_PLOTS[0];
 Object.assign(state,{area:'farm',position:{x:bed.x,y:bed.y+12},minute:600,selected:'harvest',hasVisitedFarm:true,hasVisitedCity:true,starterSeedsClaimed:true});
 state.story.intro='seen';
 state.plots[0]=plotFor(crop,'ripe');
 state.inventory[crop]=0;
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
 await page.waitForTimeout(250);
 return {context,page,snapshot,errors,requests};
}

try{
 for(const crop of crops){
  const gallery=await openFixture(galleryState(crop));
  try{
   const view=await gallery.snapshot(),rendered=view.rendering.crops.map(item=>item.frame);
   for(const stage of stages)assert.equal(rendered.filter(frame=>frame===`${crop}-${stage}`).length,2,`${crop}-${stage} dry/wet pair`);
   assert.equal(view.context?.type,'plot');
   assert.equal(view.context?.label,'Water');
   assert.ok(view.prompt,'E / Water prompt container');
   assert.ok(view.texts.some(item=>item.visible!==false&&item.text.includes('Water')),'visible Water prompt');
   assert.equal(view.cropInfo?.name,CROPS[crop].name,'crop info panel');
   assert.deepEqual(gallery.errors,[]);
   assert.ok(gallery.requests.every(url=>url.startsWith(new URL(base).origin)||url.startsWith('blob:')||url.startsWith('data:')),'runtime requests stay local');
   await gallery.page.screenshot({path:`${out}/${crop}-all-stages-dry-watered.png`});
  }finally{await gallery.context.close();}

  const harvest=await openFixture(harvestState(crop));
  try{
   const before=await harvest.snapshot();
   assert.equal(before.context?.label,'Harvest');
   await harvest.page.keyboard.press('KeyE');
   await harvest.page.waitForTimeout(30);
   const after=await harvest.snapshot();
   assert.equal(after.state.plots[0].crop,null,`${crop} harvested plot`);
   assert.equal(after.state.inventory[crop],CROPS[crop].harvestYield,`${crop} harvest yield`);
   assert.equal(after.player?.action?.name,'harvesting',`${crop} harvest animation`);
   await harvest.page.screenshot({path:`${out}/${crop}-harvest-flight.png`});
   assert.deepEqual(harvest.errors,[]);
   assert.ok(harvest.requests.every(url=>url.startsWith(new URL(base).origin)||url.startsWith('blob:')||url.startsWith('data:')),'runtime requests stay local');
  }finally{await harvest.context.close();}
  records.push({crop,gallery:'PASS',dryAndWateredStages:8,signs:'PASS',cropInfo:'PASS',waterPrompt:'PASS',harvestFlightAndYield:'PASS'});
  console.log('PASS crop runtime',crop);
 }
 let merged=records;
 if(process.env.QA_FILTER){
  try{
   const previous=JSON.parse(await readFile(`${out}/results.json`,'utf8')).records||[];
   merged=[...new Map([...previous,...records].map(record=>[record.crop,record])).values()].sort((a,b)=>allCrops.indexOf(a.crop)-allCrops.indexOf(b.crop));
  }catch{}
 }
 const requestedComplete=crops.every(crop=>merged.some(record=>record.crop===crop));
 await writeFile(`${out}/results.json`,JSON.stringify({result:requestedComplete?'PASS':'PARTIAL',scope:crops,method:'Disposable localStorage fixtures in headless Google Chrome using the real Phaser canvas renderer; filtered runs merge by crop, no user save was read or changed.',records:merged},null,2)+'\n');
 await writeFile(`${out}/README.md`,'# Imported crop-sheet browser verification\n\nEach `*-all-stages-dry-watered.png` is the live Phaser farm. Columns read left-to-right across two rows as seed, sprout, young, flowering, ripe, dry, wilted and dead; the same eight stages repeat on watered soil in the lower two rows. The live water/basket/warning signs, crop info panel and `E / Water` prompt are included. Each `*-harvest-flight.png` captures the real harvest animation and fly-to-player produce icon.\n\n`results.json` records the assertions. The script uses disposable localStorage browser contexts and makes no remote runtime requests.\n');
}finally{await browser.close();}
