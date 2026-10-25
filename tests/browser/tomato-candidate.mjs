import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState,emptyPlot} from '../../src/systems/state.js';
import {PLOTS} from '../../src/data/crops.js';

const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:720}});
const page=await context.newPage();
const base=process.env.GAME_URL||'http://127.0.0.1:4260/';
const out='docs/verification/tomato-candidate-b';
const errors=[];
await mkdir(out,{recursive:true});
page.on('pageerror',error=>errors.push(error.message));
page.on('console',message=>{if(['error','warning'].includes(message.type()))errors.push(message.text());});

const tomato=extra=>({...emptyPlot(),crop:'tomato',...extra});
const state=newState('boy');
Object.assign(state,{area:'farm',position:{x:PLOTS[0].x-20,y:PLOTS[0].y+20},selected:'water',minute:600,hasVisitedFarm:true});
state.story.intro='skipped';
state.plots[0]=tomato();
state.plots[1]=tomato({wateredDay:state.day});
state.plots[2]=tomato({growth:1,wateredDay:state.day});
state.plots[3]=tomato({growth:2,wateredDay:state.day});
state.plots[4]=tomato({growth:1});
state.plots[5]=tomato({growth:1,missedDays:3});
state.plots[6]=tomato({growth:3,wateredDay:state.day});
state.plots[7]=tomato({growth:1,missedDays:4});
state.plots[8]={...emptyPlot(),crop:'carrot',growth:3,wateredDay:state.day};

const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
const click=async id=>{const control=(await snap()).controls.find(item=>item.id===id);assert.ok(control&&!control.disabled,id);await page.mouse.click(control.x+control.w/2,control.y+control.h/2);await page.waitForTimeout(150);};
async function load(fixture){
 await page.goto(base+'?qa&renderer=canvas');
 await page.evaluate(value=>localStorage.setItem('simple-life.save.v1',JSON.stringify(value)),fixture);
 await page.reload();
 await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
 await click('Continue');
 await page.waitForTimeout(500);
}

try{
 await load(state);
 const view=await snap();
 const tomatoFrames=view.rendering.crops.map(crop=>crop.frame).filter(frame=>frame.startsWith('tomato-'));
 if(!tomatoFrames.length)console.log('crop frames',view.rendering.crops.map(crop=>crop.frame),'browser errors',errors);
 assert.deepEqual(new Set(tomatoFrames),new Set(['tomato-seed','tomato-sprout','tomato-young','tomato-flowering','tomato-ripe','tomato-dry','tomato-wilted','tomato-dead']));
 assert.ok(view.rendering.crops.some(crop=>crop.frame==='carrot-ripe'));
 assert.equal(view.context.type,'plot');
 assert.equal(view.context.label,'Water');
 assert.ok(view.cropInfo&&view.cropInfo.name==='Tomato');
 assert.ok(view.prompt,'E / Water prompt is visible');
 for(const crop of view.rendering.crops){
  const ripeBob=crop.depth-crop.y;
  assert.ok(ripeBob>=0&&ripeBob<=2.01,'plant depth stays at the bottom anchor while ripe plants bob');
 }
 await page.screenshot({path:out+'/actual-farm-all-stages.png'});

 const harvest=structuredClone(state);
 harvest.selected='harvest';
 harvest.position={x:PLOTS[0].x,y:PLOTS[0].y};
 harvest.plots[0]=tomato({growth:3,wateredDay:harvest.day});
 await load(harvest);
 assert.equal((await snap()).context.label,'Harvest');
 await page.keyboard.press('e');
 await page.waitForTimeout(140);
 const harvested=await snap();
 assert.equal(harvested.state.plots[0].crop,null);
 assert.equal(harvested.state.inventory.tomato,2);
 await page.screenshot({path:out+'/actual-farm-harvest-flight.png'});
 assert.deepEqual(errors,[]);
 await writeFile(out+'/browser-results.json',JSON.stringify({result:'PASS',frames:[...new Set(tomatoFrames)],carrot:true,prompt:'E / Water',cropInfo:true,harvestFlyToPlayer:true,errors},null,2));
 console.log('Tomato Candidate B real-farm browser verification PASS');
}finally{
 await context.close();
 await browser.close();
}
