import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {CROPS,CROP_IDS} from '../../src/data/crops.js';
import {FOOD_IDS} from '../../src/data/items.js';
import {FARM_PLOTS} from '../../src/data/farms.js';

const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.GAME_URL||'http://127.0.0.1:43900/';
const out=process.env.QA_OUT||'docs/verification/item-icons-runtime-v1';
await mkdir(out,{recursive:true});

const plot=(crop,ripe=false)=>({crop,growth:ripe?CROPS[crop].growthDays:0,wateredDay:1,missedDays:0,lastEvaluatedDay:0,plantedDay:1});
const prepared=(area,position)=>{
 const state=newState();Object.assign(state,{area,position,minute:600,money:9999,selected:'seed',selectedCrop:'tomato',hasVisitedFarm:true,hasVisitedCity:true,starterSeedsClaimed:true});state.story.intro='seen';
 for(const id of CROP_IDS){state.inventory[CROPS[id].seedKey]=12;state.inventory[id]=12;}
 for(const id of FOOD_IDS)state.inventory[id]=12;
 return state;
};

async function fixture(state){
 const context=await browser.newContext({viewport:{width:1280,height:720}}),page=await context.newPage(),errors=[],requests=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',message=>{if(['error','warning'].includes(message.type()))errors.push(message.text());});
 page.on('request',request=>requests.push(request.url()));
 await page.addInitScript(value=>localStorage.setItem('simple-life.save.v1',JSON.stringify(value)),state);
 await page.goto(base+'?qa&renderer=canvas');
 await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length,undefined,{timeout:45000});
 const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
 const title=await snap(),button=title.controls.find(control=>control.id==='Continue'||control.id.startsWith('Continue / Day'));
 assert.ok(button&&!button.disabled,'Continue control');
 await page.mouse.click(button.x+button.w/2,button.y+button.h/2);
 await page.waitForFunction(expected=>window.__simpleLife?.snapshot().state?.area===expected,state.area,{timeout:20000});
 await page.waitForTimeout(300);
 const click=async id=>{const control=(await snap()).controls.find(entry=>entry.id===id);assert.ok(control,id);await page.mouse.click(control.x+control.w/2,control.y+control.h/2);await page.waitForTimeout(120);};
 return {context,page,snap,click,errors,requests};
}

const results=[];
try{
 const farmState=prepared('farm',{x:FARM_PLOTS[0].x,y:FARM_PLOTS[0].y+12});farmState.plots[0]=plot('tomato');
 const farm=await fixture(farmState);
 try{
  await farm.page.screenshot({path:`${out}/toolbar.png`});results.push('toolbar');
  await farm.click('choose-seeds');await farm.page.screenshot({path:`${out}/bag-seeds.png`});results.push('bag-seeds');
  await farm.click('bag-tab-produce');await farm.page.screenshot({path:`${out}/bag-produce.png`});results.push('bag-produce');
  await farm.click('bag-tab-food');await farm.page.screenshot({path:`${out}/bag-fruit.png`});results.push('bag-fruit');
  assert.deepEqual(farm.errors,[]);
  assert.ok(farm.requests.every(url=>url.startsWith(new URL(base).origin)||url.startsWith('blob:')||url.startsWith('data:')),'farm requests stay local');
 }finally{await farm.context.close();}

 const city=await fixture(prepared('city',{x:432,y:306}));
 try{
  assert.equal((await city.snap()).context?.type,'seed');await city.page.keyboard.press('KeyE');await city.page.waitForTimeout(160);
  assert.equal((await city.snap()).menu,'trade');await city.page.screenshot({path:`${out}/seed-shop.png`});results.push('seed-shop');
  assert.deepEqual(city.errors,[]);
  assert.ok(city.requests.every(url=>url.startsWith(new URL(base).origin)||url.startsWith('blob:')||url.startsWith('data:')),'shop requests stay local');
 }finally{await city.context.close();}

 const market=await fixture(prepared('city',{x:896,y:306}));
 try{
  assert.equal((await market.snap()).context?.type,'sell');await market.page.keyboard.press('KeyE');await market.page.waitForTimeout(160);
  assert.equal((await market.snap()).menu,'trade');await market.page.screenshot({path:`${out}/market.png`});results.push('market');
  assert.deepEqual(market.errors,[]);
  assert.ok(market.requests.every(url=>url.startsWith(new URL(base).origin)||url.startsWith('blob:')||url.startsWith('data:')),'market requests stay local');
 }finally{await market.context.close();}

 const harvestState=prepared('farm',{x:FARM_PLOTS[0].x,y:FARM_PLOTS[0].y+12});harvestState.selected='harvest';harvestState.plots[0]=plot('tomato',true);harvestState.inventory.tomato=0;
 const harvest=await fixture(harvestState);
 try{
  assert.equal((await harvest.snap()).context?.label,'Harvest');await harvest.page.keyboard.press('KeyE');await harvest.page.waitForTimeout(80);
  assert.equal((await harvest.snap()).state.inventory.tomato,CROPS.tomato.harvestYield);await harvest.page.screenshot({path:`${out}/harvest-effect.png`});results.push('harvest-effect');
  assert.deepEqual(harvest.errors,[]);
  assert.ok(harvest.requests.every(url=>url.startsWith(new URL(base).origin)||url.startsWith('blob:')||url.startsWith('data:')),'harvest requests stay local');
 }finally{await harvest.context.close();}

 await writeFile(`${out}/browser-results.json`,JSON.stringify({result:'PASS',base,viewport:[1280,720],screenshots:results,method:'Disposable localStorage fixtures in headless Google Chrome using the real Phaser canvas; no user save read or changed and all runtime requests remained local.'},null,2)+'\n');
 console.log('PASS item icon runtime captures',results.join(', '));
}finally{await browser.close();}
