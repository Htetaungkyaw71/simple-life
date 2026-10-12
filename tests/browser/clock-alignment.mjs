import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {TESTING_COIN_GRANT} from '../../src/systems/testingCredit.js';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const base=process.env.GAME_URL||'http://127.0.0.1:4196/',out=process.env.QA_OUT||'/tmp/simple-life-clock';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true}),records=[];
try{for(const language of ['mm','en'])for(const renderer of ['canvas','webgl'])for(const [width,height]of [[1280,720],[390,844],[844,390],[568,256]]){
 const name=language+'-'+renderer+'-'+width;if(process.env.QA_FILTER&&!new RegExp(process.env.QA_FILTER).test(name))continue;
 const ctx=await browser.newContext({viewport:{width,height},hasTouch:width<1000}),p=await ctx.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(['warning','error'].includes(m.type()))errors.push(m.text());});
 const s=newState();s.story.intro='seen';s.minute=920;s.money=100060;s.testingCoinGrant=TESTING_COIN_GRANT;s.starterSeedsClaimed=s.hasVisitedFarm=true;
 await p.addInitScript(s=>{if(!localStorage.getItem('simple-life.save.v1'))localStorage.setItem('simple-life.save.v1',JSON.stringify(s));},s);
 const snap=()=>p.evaluate(()=>window.__simpleLife.snapshot()),click=async id=>{const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);await p.mouse.click(c.x+c.w/2,c.y+c.h/2);await p.waitForTimeout(150);};
 try{for(const [i,fixture]of [{minute:920,day:1,money:100060},{minute:1439,day:99999,money:9999999}].entries()){
  await p.goto(base+'?qa&renderer='+renderer);await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
  // Seed while the title is open so the prior world's pagehide autosave cannot overwrite the fixture.
  if(i)await p.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),{...s,...fixture});
  await click('language-'+language);await click('Continue');
  const v=await snap(),time=v.texts.find(t=>/^\d+:\d+ (am|pm)$/.test(t.source)),day=v.texts.find(t=>/^Day \d+$/.test(t.source)),money=v.texts.find(t=>/^\d+c$/.test(t.source));assert.ok(time&&day&&money,'all clock rows render');assert.equal(v.state.day,fixture.day);assert.equal(v.state.money,fixture.money,'fixture balance survives Continue');
  const panel={x:width-12-(height<300&&width<1000?72:0)-(width<1000?132:152),y:12,w:width<1000?132:152,h:language==='mm'?72:62};
  const coins={...panel,y:panel.y+panel.h+6,h:36},center=b=>b.y+b.h/2;
  for(const [t,b]of [[time,panel],[day,panel],[money,coins]]){assert.ok(t.x>=b.x+4&&t.x+t.w<=b.x+b.w-4,t.text+' horizontal padding');assert.ok(t.y>=b.y+4&&t.y+t.h<=b.y+b.h-4,t.text+' vertical padding');assert.ok(Math.abs(t.x+t.w/2-(b.x+b.w/2))<=1,t.text+' horizontal centering');assert.equal(t.scaleX,2);assert.equal(t.scaleY,2);}
  assert.ok(day.y-(time.y+time.h)>=4,'clock rows have breathing room');assert.ok(Math.abs((time.y+day.y+day.h)/2-center(panel))<=1,'time/day block is centered');assert.ok(Math.abs(center(money)-center(coins))<=1,'coins vertically centered');
  for(const t of [time,day,money])for(const c of v.controls)assert.ok(!(t.x<c.x+c.w&&t.x+t.w>c.x&&t.y<c.y+c.h&&t.y+t.h>c.y),'clock clear of '+c.id);
  assert.deepEqual(errors,[]);await p.screenshot({path:out+'/'+name+'-'+i+'.png'});records.push({name,fixture,result:'PASS',time,day,money,panel,coins});
 }console.log('PASS clock',name);}catch(e){await p.screenshot({path:out+'/'+name+'-failure.png'});await writeFile(out+'/failure.json',JSON.stringify({error:e.stack,snapshot:await snap()},null,2));throw e;}finally{await ctx.close();}
}await writeFile(out+'/results.json',JSON.stringify({result:'PASS',records},null,2));}finally{await browser.close();}
