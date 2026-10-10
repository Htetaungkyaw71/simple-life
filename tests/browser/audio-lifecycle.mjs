import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--autoplay-policy=user-gesture-required']});
const base=process.env.GAME_URL||'http://127.0.0.1:4186/',out='docs/verification/story-audio';await mkdir(out,{recursive:true});
const records=[];
for(const renderer of ['canvas','webgl']){
 const c=await browser.newContext({viewport:{width:640,height:360},hasTouch:true}),p=await c.newPage();const problems=[],warnings=[],sources=[];
 await p.addInitScript(()=>{const Native=window.AudioContext;window.__audioContextCount=0;window.AudioContext=class extends Native{constructor(...a){super(...a);window.__audioContextCount++;}};});
 p.on('pageerror',e=>problems.push(e.message));p.on('console',m=>{if(m.type()==='error')problems.push(m.text());if(m.type()==='warning')warnings.push(m.text());});p.on('request',r=>sources.push(r.url()));
 const snapshot=()=>p.evaluate(()=>window.__simpleLife.snapshot());
 const tap=async(id,delay=200)=>{const b=(await snapshot()).controls.find(b=>b.id===id);assert.ok(b&&!b.disabled,id);await p.touchscreen.tap(b.x+b.w/2,b.y+b.h/2);await p.waitForTimeout(delay);};
 await p.goto(base+'?qa&renderer='+renderer);await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);assert.equal((await snapshot()).audio.context,'locked');await tap('Controls');await tap('Close');await p.waitForTimeout(1000);
 const first=(await snapshot()).audio;assert.equal(first.loops.length,1);assert.equal(first.loops[0].key,'music:title');
 if(renderer==='canvas'){for(let i=0;i<12;i++)await p.waitForTimeout(10000);assert.equal((await snapshot()).audio.loops.length,1);}
 await tap('Play');await tap('Play as Boy');await tap('intro-skip');await p.waitForTimeout(3000);
 for(let i=0;i<12;i++){await p.keyboard.press('Escape');const a=(await snapshot()).controls.find(c=>c.id.startsWith('Audio /'));await tap(a.id);if(i===0){await tap('audio-master-down');await p.keyboard.press('ArrowRight');}await tap('audio-back');await tap('Resume');}
 assert.equal(await p.evaluate(()=>window.__audioContextCount),1);
 const before=(await snapshot()).audio;await p.evaluate(()=>window.dispatchEvent(new Event('blur')));await p.waitForTimeout(300);assert.equal((await snapshot()).audio.context,'suspended');await p.evaluate(()=>window.dispatchEvent(new Event('focus')));await p.waitForTimeout(300);assert.equal((await snapshot()).audio.context,'running');
 await tap('jump');assert.ok((await snapshot()).jump.active);await p.waitForTimeout(1000);await tap('choose-seeds');await tap('bag-tab-gear');await tap('bag-item-axe');await tap('bag-action');await tap('attack',20);assert.ok((await snapshot()).pendingAttack);await p.waitForTimeout(500);
 // Return/Continue uses real controls, retaining one context and bounded loop/voice pools.
 for(let i=0;i<12;i++){await p.keyboard.press('Escape');await tap('Return to title');await p.waitForTimeout(300);assert.ok((await snapshot()).audio.loops.every(v=>v.key==='music:title'));await tap('Continue');await p.waitForTimeout(300);}
 await p.waitForTimeout(4000);const after=(await snapshot()).audio;assert.equal(await p.evaluate(()=>window.__audioContextCount),1);assert.ok(after.loops.length<=3);assert.ok(after.voices<=1);assert.equal(after.pending,0);assert.deepEqual(after.failures,[]);assert.deepEqual(problems,[]);assert.deepEqual(warnings,[]);assert.ok(sources.every(u=>u.startsWith(new URL(base).origin)||u.startsWith('blob:')||u.startsWith('data:')));
 const preference=after.preferences;await p.reload();await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);assert.deepEqual((await snapshot()).audio.preferences,preference);
 records.push({renderer,contextCount:1,titleSeconds:renderer==='canvas'?120:1,pauseCycles:12,titleContinueCycles:12,focusSuspendResume:true,touchJumpAttack:true,preferencesPersist:true,before,after,errors:problems,warnings,localOnly:true});await c.close();
}
await writeFile(out+'/audio-lifecycle.json',JSON.stringify({result:'PASS',records},null,2));await browser.close();console.log('Audio lifecycle PASS');
