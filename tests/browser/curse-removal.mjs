import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {TESTING_COIN_GRANT} from '../../src/systems/testingCredit.js';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const base=process.env.GAME_URL||'http://127.0.0.1:4196/',out=process.env.QA_OUT||'/private/tmp/simple-life-curse-removal';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true}),records=[];
const profiles=[['canvas','en',1280,720],['canvas','mm',568,256],['canvas','mm',390,844],['webgl','en',844,390]];
try{for(const [renderer,lang,width,height] of profiles){
 const name=renderer+'-'+lang+'-'+width,ctx=await browser.newContext({viewport:{width,height},hasTouch:width<1000}),p=await ctx.newPage(),errors=[];
 if(process.env.QA_FILTER&&!new RegExp(process.env.QA_FILTER).test(name)){await ctx.close();continue;}
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(['warning','error'].includes(m.type()))errors.push(m.text());});
 const snap=()=>p.evaluate(()=>{const v=window.__simpleLife.snapshot();return Object.fromEntries(['state','controls','menu','paused','residents','merchants','camera','texts','context'].map(k=>[k,v[k]]));});
 const click=async id=>{const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);await(width<1000?p.touchscreen.tap(c.x+c.w/2,c.y+c.h/2):p.mouse.click(c.x+c.w/2,c.y+c.h/2));await p.waitForTimeout(120);};
 const use=async()=>{if(width<1000)await click('attack');else{await p.keyboard.press('e');await p.waitForTimeout(120);}};
 const fixture=(area,position)=>{const s=newState('girl',123);Object.assign(s,{area,position,day:9,minute:1140,money:1234,testingCoinGrant:TESTING_COIN_GRANT,forestTutorialComplete:true,nightWarningSeen:true,starterSeedsClaimed:true,hasVisitedFarm:true});s.story.intro='seen';s.inventory.wood=19;s.inventory.meat=7;s.curse={stage:'broken',brokenDay:7,paid:{money:120,wood:12,stone:0,meat:2},ghosts:[{id:'curse-ghost-0',area,position:{x:position.x+20,y:position.y},health:3,arrival:0,windup:1}]};return s;};
 const start=async s=>{const url=new URL(base);url.searchParams.set('qa','');url.searchParams.set('renderer',renderer);for(let i=0;i<3;i++){try{await p.goto(url.href);break;}catch(e){if(i===2||!e.message.includes('ERR_CONNECTION_RESET'))throw e;}}await p.waitForFunction(()=>{try{return !!window.__simpleLife?.snapshot().controls.length;}catch{return false;}});await p.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await click('language-'+lang);await click('Continue');};
 try{
  const s=fixture('farm',{x:896,y:600});s.stash={area:'farm',farm:0,...s.position,coins:250};await start(s);
  let v=await snap();assert.equal(Object.hasOwn(v.state,'curse'),false);assert.equal(v.state.money,1234);assert.equal(v.state.inventory.wood,19);assert.equal(v.context.type,'stash');
  await use();assert.equal((await snap()).state.money,1484);assert.equal((await snap()).state.stash,null);
  await p.waitForTimeout(6200);assert.equal((await snap()).state.health,100);
  await click('pause');v=await snap();assert.equal(v.controls.length,7);assert.ok(!v.controls.some(c=>c.id==='Cursed cave'));
  for(const c of v.controls){assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=width&&c.y+c.h<=height,JSON.stringify(c));}
  await click('Save');await click('Resume');await p.reload();await p.waitForFunction(()=>{try{return !!window.__simpleLife?.snapshot().controls.length;}catch{return false;}});await click('language-'+lang);await click('Continue');v=await snap();assert.equal(v.state.money,1484);assert.equal(v.state.health,100);assert.equal(Object.hasOwn(v.state,'curse'),false);
  await start(fixture('forest',{x:8046,y:1238}));v=await snap();assert.notEqual(v.context?.type,'cursedCave');assert.deepEqual(v.state.position,{x:8046,y:1238});
  await p.screenshot({path:out+'/'+name+'-clearing.png'});await p.keyboard.down('w');await p.waitForTimeout(220);await p.keyboard.up('w');assert.ok((await snap()).state.position.y<1238,'removed cave approach can be walked through');
  await start(fixture('city',{x:896,y:600}));v=await snap();assert.equal(v.residents.length,11);assert.ok(v.residents.every(n=>!n.visible&&n.mode==='home'));assert.ok(v.merchants.every(n=>!n.visible));
  await start(fixture('home',{x:480,y:500}));await use();await p.waitForFunction(()=>window.__simpleLife.snapshot().state.area==='interior');assert.equal((await snap()).state.health,100);
  assert.deepEqual(errors,[]);records.push({name,result:'PASS',legacySave:true,noGhostDamage:true,stashRecovery:true,noCave:true,pauseBounds:true,reload:true,NPCsHomeAt19:true,houseEntry:true,errors});console.log('PASS removal',name);
 }catch(e){await p.screenshot({path:out+'/'+name+'-failure.png'});await writeFile(out+'/failure.json',JSON.stringify({error:e.stack,snapshot:await snap().catch(()=>null),errors},null,2));throw e;}finally{await ctx.close();}
}await writeFile(out+'/results.json',JSON.stringify({result:'PASS',url:base,records},null,2)+'\n');}finally{await browser.close();}
