import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.env.GAME_URL||'http://127.0.0.1:4186/',records=[];
for(const mode of ['denied-storage','legacy-muted','legacy-unmuted','unavailable-audio']){
 const context=await browser.newContext(),page=await context.newPage(),errors=[],warnings=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});
 await page.addInitScript(mode=>{
  if(mode==='denied-storage')Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Denied','SecurityError');}});
  if(mode.startsWith('legacy-'))localStorage.setItem('simple-life.audio-muted.v1',String(mode==='legacy-muted'));
  if(mode==='unavailable-audio'){const unavailable=class{constructor(){throw Error('Audio unavailable');}};window.AudioContext=unavailable;window.webkitAudioContext=unavailable;}
 },mode);
 await page.goto(base+'?qa');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
 const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
 const click=async id=>{const b=(await snap()).controls.find(c=>c.id===id);assert.ok(b&&!b.disabled,id);await page.mouse.click(b.x+b.w/2,b.y+b.h/2);await page.waitForTimeout(200);};
 if(mode.startsWith('legacy-'))assert.equal((await snap()).audio.muted,mode==='legacy-muted');
 await click('Play');await click('Play as Girl');await click('intro-skip');assert.equal((await snap()).state.money,60);
 await page.keyboard.press('Escape');await click((await snap()).controls.find(c=>c.id.startsWith('Audio /')).id);await click('audio-music-down');assert.equal((await snap()).audio.preferences.music,.25);await click('audio-back');await click('Resume');
 if(mode==='unavailable-audio')assert.equal((await snap()).audio.unavailable,true);
 assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);records.push({mode,result:'PASS',newGameMoney:60,audio:(await snap()).audio,errors,warnings});await context.close();
}
await writeFile('docs/verification/story-audio/audio-storage.json',JSON.stringify({result:'PASS',records},null,2));await browser.close();console.log('Audio storage resilience PASS');
