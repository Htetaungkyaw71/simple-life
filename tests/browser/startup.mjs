import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.GAME_URL||'http://127.0.0.1:4198/',out=process.env.QA_OUT||'/tmp/simple-life-startup',results=[];
await mkdir(out,{recursive:true});
try{
 for(const renderer of ['canvas','webgl'])for(const [width,height,touch]of [[1280,720,false],[1440,900,false],[390,844,true],[844,390,true]]){
  const name=renderer+'-'+width+'-'+height,ctx=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch}),page=await ctx.newPage(),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});page.on('request',r=>requests.push(r.url()));
  const url=new URL(base);url.searchParams.set('qa','');url.searchParams.set('renderer',renderer);
  const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
  const ready=()=>page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
  const click=async id=>{const c=(await snap()).controls.find(c=>c.id===id),box=await page.locator('canvas').boundingBox();assert.ok(c&&!c.disabled,id);const x=box.x+c.x+c.w/2,y=box.y+c.y+c.h/2;await(touch?page.touchscreen.tap(x,y):page.mouse.click(x,y));await page.waitForTimeout(180);};
  try{
   await page.goto(url.href);await ready();assert.equal((await snap()).menu,'title');assert.equal((await snap()).state,null);
   assert.equal(await page.evaluate(()=>navigator.maxTouchPoints>0),touch,'explicit touch capability');
   await page.screenshot({path:out+'/'+name+'-title.png'});
   await click('Controls');await click('Close');await click('Play');await click('Play as Boy');await click('intro-skip');
   assert.equal((await snap()).state.money,60);assert.equal((await snap()).paused,false);
   const before=(await snap()).state.position;
   if(touch){const c=(await snap()).controls.find(c=>c.id==='move-stick'),cdp=await ctx.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:c.x+c.w/2,y:c.y+c.h*.85}]});await page.waitForTimeout(350);await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await cdp.detach();}
   else{await page.keyboard.down('ArrowDown');await page.waitForTimeout(350);await page.keyboard.up('ArrowDown');}
   const after=(await snap()).state.position;assert.ok(Math.hypot(after.x-before.x,after.y-before.y)>10,'actual input moves farmer');
   await click('pause');await click('Save');const saved=(await snap()).state;
   await page.reload();await ready();await click('Continue');assert.equal((await snap()).state.money,60);assert.deepEqual((await snap()).state.position,saved.position);assert.equal((await snap()).state.story.intro,'skipped');
   await page.screenshot({path:out+'/'+name+'-continued.png'});
   assert.deepEqual(errors,[]);assert.ok(requests.every(r=>r.startsWith(new URL(base).origin)||r.startsWith('data:')||r.startsWith('blob:')));
   results.push({name,renderer,width,height,touch,result:'PASS',errors,requests:requests.length});console.log('PASS',name,'touch='+touch);
  }catch(error){await page.screenshot({path:out+'/'+name+'-failure.png'});await writeFile(out+'/'+name+'-failure.txt',error.stack+'\n'+JSON.stringify(errors));throw error;}finally{await ctx.close();}
 }
 await writeFile(out+'/results.json',JSON.stringify({result:'PASS',base,method:'Fresh isolated Chrome contexts, explicitly with and without touch; native mouse/keyboard/touch inputs. No fixture saves or gameplay mutation hooks.',results},null,2));
}finally{await browser.close();}
