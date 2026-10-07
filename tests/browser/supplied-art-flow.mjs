import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4175/';
const out=process.env.QA_OUTPUT||'docs/verification/supplied-art/flow';await mkdir(out,{recursive:true});const errors=[],checks=[];
try{
 for(const character of ['boy','girl']){
  const ctx=await browser.newContext({viewport:{width:1280,height:720},hasTouch:true}),page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
  const ready=()=>page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
  async function click(id){const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);await page.mouse.click(c.x+c.w/2,c.y+c.h/2);await page.waitForTimeout(200);}
  await page.goto(base+'?qa');await ready();await click('New Game');await click('Play as '+(character==='boy'?'Boy':'Girl'));assert.equal((await snap()).state.character,character);assert.equal((await snap()).state.area,'home');await page.screenshot({path:out+'/new-game-'+character+'.png'});
  const s=newState(character);Object.assign(s,{area:'forest',position:{x:1550,y:4960},minute:600,forestTutorialComplete:true,inventory:{...s.inventory,mango:3},money:147});
  await page.goto(base+'?qa');await ready();await page.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await page.reload();await ready();await click('Continue / Day 1');assert.equal((await snap()).water.wading,true);await page.keyboard.down('ArrowRight');await page.waitForTimeout(180);await page.keyboard.up('ArrowRight');assert.equal((await snap()).water.wading,true);await page.screenshot({path:out+'/wading-'+character+'.png'});
  await page.keyboard.press('j');await page.waitForTimeout(170);assert.ok((await snap()).jump.active);assert.equal((await snap()).water.wading,false);await page.screenshot({path:out+'/water-jump-'+character+'.png'});await page.waitForTimeout(650);assert.equal((await snap()).jump.active,null);
  await page.keyboard.press('Escape');await page.waitForTimeout(100);await click('Save');await page.reload();await ready();await click('Continue / Day 1');const loaded=(await snap()).state;assert.equal(loaded.character,character);assert.equal(loaded.money,147);assert.equal(loaded.inventory.mango,3);assert.equal(loaded.version,9);checks.push({character,newGame:true,waterWalk:true,waterJump:true,savedProgress:true});await ctx.close();
 }
 assert.deepEqual(errors,[]);await writeFile(out+'/results.json',JSON.stringify({passed:true,checks,errors},null,2));console.log('PASS new-game selection, water walking/jump, saved character/progress for both farmers');
}finally{await browser.close();}
