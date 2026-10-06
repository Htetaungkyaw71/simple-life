import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),results=[],errors=[];
for(const [width,height]of [[844,390],[390,844]])for(const target of ['bed','exit']){
 const ctx=await browser.newContext({viewport:{width,height}}),p=await ctx.newPage(),s=newState();s.area='interior';s.position=target==='bed'?{x:315,y:300}:{x:480,y:464};
 p.on('pageerror',e=>errors.push(e.message));await ctx.addInitScript(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await p.goto('http://127.0.0.1:4173/?qa');await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
 const snap=()=>p.evaluate(()=>window.__simpleLife.snapshot()),c=(await snap()).controls.find(c=>c.id==='Continue / Day 1');await p.mouse.click(c.x+c.w/2,c.y+c.h/2);await p.waitForTimeout(200);const v=await snap(),x=v.state.position.x-v.camera.x,y=v.state.position.y-v.camera.y;assert.ok(x>48&&x<width-48&&y>90&&y<height-100);assert.equal(v.context.type,target==='bed'?'bed':'travel');
 await p.screenshot({path:`docs/verification/stabilization/interior-${target}-${width}.png`});await p.keyboard.press('e');await p.waitForTimeout(100);const after=await snap();if(target==='bed'){assert.ok(after.menu);for(const c of after.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=width&&c.y+c.h<=height);}else assert.equal(after.state.area,'home');results.push({width,height,target,visible:true,interaction:true});await ctx.close();
}
assert.deepEqual(errors,[]);await writeFile('docs/verification/stabilization/interior.json',JSON.stringify({result:'PASS',results,errors},null,2));console.log(JSON.stringify({result:'PASS',results,errors}));await browser.close();
