import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {syncInterior,nearestSafe,walkable} from '../../src/data/locations.js';
import {REGIONS} from '../../src/data/forest.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL),base=process.env.GAME_URL||'http://127.0.0.1:4175/';
const out=process.env.QA_OUTPUT||'docs/verification/supplied-art/final';await mkdir(out,{recursive:true});
const ctx=await browser.newContext({viewport:{width:1280,height:720},hasTouch:true}),page=await ctx.newPage(),errors=[],warnings=[],failed=[],foreign=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});
page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});page.on('request',r=>{if(!r.url().startsWith(new URL(base).origin)&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))foreign.push(r.url());});
const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
async function click(id){const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);await page.mouse.click(c.x+c.w/2,c.y+c.h/2);await page.waitForTimeout(150);}
async function fits(){const s=await snap(),v=page.viewportSize(),b=s.menuBounds;assert.ok(b.x>=0&&b.y>=0&&b.x+b.w<=v.width&&b.y+b.h<=v.height,JSON.stringify({v,b}));for(const c of s.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=v.width&&c.y+c.h<=v.height,c.id);}
const shot=n=>page.screenshot({path:out+'/'+n+'.png'});
async function fixture(character,area,position){const v=page.viewportSize();syncInterior(v.width,v.height);const s=newState(character);s.area=area;s.position=nearestSafe(area,position);Object.assign(s,{minute:600,forestTutorialComplete:true,nightWarningSeen:true,starterSeedsClaimed:true,hasVisitedFarm:true,hasVisitedCity:true});await page.goto(base+'?qa');await page.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('Continue / Day 1');await page.waitForTimeout(250);assert.equal((await snap()).state.character,character);assert.equal((await snap()).state.area,area);}
const sizes=[[1440,900],[1280,720],[1024,768],[844,390],[390,844],[360,640],[640,360]],directions=[];
try{
 await page.goto(base+'?qa');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
 for(const [width,height]of sizes){await page.setViewportSize({width,height});await page.waitForTimeout(100);await click('Credits');await fits();await click('More art credits');await fits();await shot('farmers-credits-'+width+'x'+height);await click('Forest & licences');await fits();await shot('forest-credits-'+width+'x'+height);await click('Back');await fits();await click('Back');await click('New Game');await fits();await shot('selection-'+width+'x'+height);await click('Back');}
 await page.setViewportSize({width:1280,height:720});
 for(const character of ['boy','girl']){
  for(const [area,p]of [['home',{x:900,y:600}],['farm',{x:320,y:620}],['city',{x:640,y:640}],['interior',{x:280,y:176}],['forest',{x:640,y:4848}]]){
   await fixture(character,area,p);assert.equal((await snap()).player.height,64);
   for(const [key,direction,row]of [['ArrowDown','down',0],['ArrowUp','up',1],['ArrowLeft','left',2],['ArrowRight','right',3]]){await page.keyboard.down(key);await page.waitForTimeout(170);const s=await snap();assert.equal(s.player.direction,direction);assert.ok(Number(s.player.frame)>=row*9+1&&Number(s.player.frame)<=row*9+4);assert.ok(walkable(area,s.state.position.x,s.state.position.y));await page.keyboard.up(key);await page.waitForTimeout(50);directions.push([character,area,direction]);}
   await shot(character+'-'+area);
  }
 }
 const habitats=[];
 for(const id of ['entrance','frost','wolf','pride','bamboo','tiger','basalt']){
  const r=REGIONS.find(r=>r.id===id);await fixture('girl','forest',{x:r.x+496,y:r.y+720});const canopies=(await snap()).canopies;assert.ok(canopies.some(c=>c.frame==='env-pine-jade'));assert.ok(canopies.some(c=>c.frame==='env-pine-olive'));assert.ok(canopies.some(c=>c.frame==='env-fir'));assert.ok(canopies.some(c=>c.frame==='env-pine-snow'));await shot('habitat-'+id);habitats.push(id);
 }
 // Stand under a crown through a validated disposable save and inspect fading.
 const c=(await snap()).canopies.find(c=>c.frame==='env-pine-jade'&&walkable('forest',c.x,c.y-48));assert.ok(c);await fixture('girl','forest',{x:c.x,y:c.y-48});await page.waitForTimeout(200);const near=(await snap()).canopies.find(n=>n.x===c.x&&n.y===c.y);assert.equal(near.alpha,.5);assert.equal(near.baseX,c.x);await shot('aligned-fading-crown');
 assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);assert.deepEqual(failed,[]);assert.deepEqual(foreign,[]);
 await writeFile(out+'/results.json',JSON.stringify({passed:true,viewports:sizes,characterDirectionChecks:directions,habitats,crownFade:true,unchangedSpriteHeight:64,errors,warnings,failed,foreign},null,2));
 console.log('PASS supplied characters in five areas / four directions, seven viewport selection/credits, seven habitats, aligned crown fade');
}finally{await ctx.close();await browser.close();}
