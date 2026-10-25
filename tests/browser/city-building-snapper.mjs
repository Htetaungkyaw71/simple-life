import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const base=process.env.GAME_URL||'http://127.0.0.1:43864/?qa',out='docs/verification/city-building-snapper-v2';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true}),records=[];
try{
 const views=[['north',2216,488],['shops',1450,442],['planters',637,684],['cafe',872,1024],['west',176,926],['southwest',640,1296],['east',2200,1252],['south',2224,1640]].filter(([name])=>!process.env.QA_FILTER||new RegExp(process.env.QA_FILTER).test(name));
 for(const [name,x,y]of views){
  const context=await browser.newContext({viewport:{width:1280,height:720}}),page=await context.newPage(),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(['warning','error'].includes(m.type()))errors.push(m.text());});page.on('response',r=>{if(r.url().includes('city-buildings'))requests.push({url:r.url(),status:r.status()});});
  const state=newState('boy');Object.assign(state,{area:'city',position:{x,y},minute:600,money:1000,hasVisitedCity:true,hasVisitedFarm:true,starterSeedsClaimed:true,forestTutorialComplete:true,nightWarningSeen:true});state.story.intro='seen';
  await context.addInitScript(s=>{localStorage.setItem('simple-life.save.v1',JSON.stringify(s));localStorage.setItem('simple-life.language.v1','en');},state);await page.goto(base);await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
  const click=async id=>{const c=await page.evaluate(id=>window.__simpleLife.snapshot().controls.find(c=>c.id===id),id);assert.ok(c,id);await page.mouse.click(c.x+c.w/2,c.y+c.h/2);await page.waitForTimeout(250);};
  await click('welcome-language-en');await click('Continue');const entered=await page.waitForFunction(()=>window.__simpleLife?.snapshot().state?.area==='city',{timeout:5000}).catch(()=>null);if(!entered){const snapshot=await page.evaluate(()=>window.__simpleLife.snapshot());await page.screenshot({path:out+'/'+name+'-failure.png'});throw Error(name+' did not enter City: '+JSON.stringify({state:snapshot.state,controls:snapshot.controls,menu:snapshot.menu}));}await page.waitForTimeout(250);
  const actual=await page.evaluate(()=>({state:window.__simpleLife.snapshot().state,rendering:window.__simpleLife.snapshot().rendering,imageRendering:getComputedStyle(document.querySelector('canvas')).imageRendering}));
  assert.equal(actual.imageRendering,'pixelated');assert.equal(actual.state.area,'city');assert.ok(Math.hypot(actual.state.position.x-x,actual.state.position.y-y)<2,name+' fixture moved');assert.deepEqual(errors,[]);assert.equal(requests.length,2);assert.ok(requests.every(r=>r.status===200));
  await page.screenshot({path:out+'/'+name+'.png'});records.push({name,position:[x,y],imageRendering:actual.imageRendering,cityBuildingRequests:requests,errors});await context.close();
 }
 await writeFile(out+'/browser-checks.json',JSON.stringify({result:'PASS',views:records},null,2)+'\n');console.log('PASS city building browser QA '+records.length+' views');
}finally{await browser.close();}
