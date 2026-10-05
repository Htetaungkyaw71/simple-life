import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');const browser=await chromium.connectOverCDP(process.env.CDP_URL);const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
// Separate disposable context: legacy save fixture, never the user's browser save.
const fixture={version:1,character:'boy',area:'farm',position:{x:480,y:330},day:9,minute:730,money:207,health:87,energy:60,selected:'water',inventory:{seed:3,tomato:4},plots:[{crop:'tomato',growth:2,morning:true,evening:false,dryDays:0},...Array.from({length:5},()=>({crop:null,growth:0,morning:false,evening:false,dryDays:0}))],sold:8};
await context.addInitScript(value=>{localStorage.setItem('simple-life.save.v1',JSON.stringify(value));},fixture);
await page.goto((process.env.GAME_URL||'http://127.0.0.1:4173/')+'?qa');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());async function click(id){const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);await page.mouse.click(c.x+c.w/2,c.y+c.h/2);await page.waitForTimeout(100);}
async function fits(){const [w,h]=await page.evaluate(()=>[innerWidth,innerHeight]);for(const c of (await snap()).controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=w&&c.y+c.h<=h,`clipped ${c.id} at ${w}x${h}`);}
for(const [w,h]of [[390,844],[844,390]]){
 await page.setViewportSize({width:w,height:h});await page.waitForTimeout(200);await fits();await click('Credits');await fits();await click('Back');await click('How to Play');await fits();await click('Next / Farming');await fits();await click('Got it');await click('New Game');await fits();await click('Start fresh');await fits();await page.screenshot({path:`docs/verification/craftsmanship/select-${w}x${h}.png`});await click('Back');
}
await click('Continue / Day 9');const loaded=(await snap()).state;for(const key of ['version','character','area','day','money','health','energy','selected','inventory','plots','sold'])assert.deepEqual(loaded[key],fixture[key]);
await page.setViewportSize({width:1280,height:720});await page.waitForTimeout(150);
const animationFrames={};
for(const [key,dir,base]of [['ArrowLeft','left',12],['ArrowUp','up',6],['ArrowRight','right',18],['ArrowDown','down',0]]){
 const frames=new Set();await page.keyboard.down(key);
 for(let n=0;n<16;n++){await page.waitForTimeout(40);frames.add(Number((await snap()).player.frame));}
 await page.keyboard.up(key);await page.waitForTimeout(80);assert.equal((await snap()).player.direction,dir);assert.equal(Number((await snap()).player.frame),base);assert.ok([1,2,3,4].every(n=>frames.has(base+n)),`four walking frames ${dir}`);animationFrames[dir]=[...frames];
}
const before=(await snap()).state.position;await page.keyboard.down('ArrowLeft');await page.waitForTimeout(2500);await page.keyboard.up('ArrowLeft');const left=(await snap()).state.position;assert.ok(left.x>=44,'map boundary collision');assert.ok(left.x<before.x,'move to map boundary');
const edge=(await snap()).camera;assert.ok(edge.x>=0&&edge.x+edge.width<=2241);await page.screenshot({path:'docs/verification/craftsmanship/map-boundary.png'});
assert.deepEqual(errors,[]);const result={result:'PASS',legacySave:'v1 money/day/inventory/crops/energy/health preserved',menus:['390x844','844x390'],animationFrames,edge,errors};await writeFile('docs/verification/craftsmanship/legacy-menus.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await context.close();await browser.close();
