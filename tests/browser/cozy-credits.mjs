import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true}),records=[],out=process.env.AUDIO_QA_OUT||'docs/verification/cozy-audio';
try{
 for(const [width,height]of [[1440,900],[1280,720],[1024,768],[844,390],[640,360],[390,844],[360,640]]){
  const c=await browser.newContext({viewport:{width,height},hasTouch:width<1000}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:4190/?qa');await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
  const snap=()=>p.evaluate(()=>window.__simpleLife.snapshot()),click=async id=>{const b=(await snap()).controls.find(b=>b.id===id);assert.ok(b&&!b.disabled,id);await p.mouse.click(b.x+b.w/2,b.y+b.h/2);await p.waitForTimeout(120);};
  const bounds=async()=>{const s=await snap();for(const b of [...s.controls,s.menuBounds])assert.ok(b.x>=0&&b.y>=0&&b.x+b.w<=width&&b.y+b.h<=height,JSON.stringify(b));};
  await click('Credits');await bounds();await click('Audio');await bounds();assert.ok((await snap()).menuContent.body.includes('HuntSounds'));assert.ok((await snap()).menuContent.body.includes('Spaceyyy'));assert.ok((await snap()).menuContent.body.includes('alys'));await click('Farm & Nature sources');await bounds();await click('Back');await bounds();await p.screenshot({path:out+'/audio-credits-'+width+'x'+height+'.png'});await click('Back');await bounds();await click('Back');assert.deepEqual(errors,[]);records.push({width,height,creditControlsFit:true,bothCreatorsVisible:true,errors});await c.close();
 }
 await writeFile(out+'/credits.json',JSON.stringify({result:'PASS',records},null,2));console.log('Audio credits bounds PASS');
}finally{await browser.close();}
