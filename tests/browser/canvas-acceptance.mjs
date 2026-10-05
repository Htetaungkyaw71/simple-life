import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL);const context=await browser.newContext({viewport:{width:1280,height:720},hasTouch:true});const page=await context.newPage();
const errors=[],warnings=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='warning')warnings.push(m.text());});
const base=process.env.GAME_URL||'http://127.0.0.1:5174/';await mkdir('docs/verification/craftsmanship',{recursive:true});
const shot=name=>page.screenshot({path:`docs/verification/craftsmanship/${name}.png`});
const snap=()=>page.evaluate(()=>window.__simpleLife.snapshot());
async function click(id){const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,`Enabled control ${id}`);await page.mouse.click(c.x+c.w/2,c.y+c.h/2);await page.waitForTimeout(80);}
async function key(k){await page.keyboard.press(k,{delay:60});await page.waitForTimeout(90);}
async function move(x,y){for(const [axis,target,negative,positive]of [['x',x,'ArrowLeft','ArrowRight'],['y',y,'ArrowUp','ArrowDown']])for(let n=0;n<5;n++){const diff=target-(await snap()).state.position[axis];if(Math.abs(diff)<6)break;await page.keyboard.down(diff<0?negative:positive);await page.waitForTimeout(Math.min(3500,Math.abs(diff)/260*1000));await page.keyboard.up(diff<0?negative:positive);await page.waitForTimeout(60);}const p=(await snap()).state.position;assert.ok(Math.hypot(p.x-x,p.y-y)<15,`move ${JSON.stringify(p)} -> ${x},${y}`);}
const use=()=>key('e');const area=async name=>assert.equal((await snap()).state.area,name);
await page.goto(base+'?qa');await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length>0);await shot('title-1280x720');await click('New Game');await shot('character-select');await click('Play as Girl');
const viewportResults=[];
for(const [width,height]of [[1440,900],[1280,720],[1024,768],[390,844],[844,390]]){
 await page.setViewportSize({width,height});await page.waitForTimeout(350);const dom=await page.evaluate(()=>({canvas:[document.querySelector('canvas').clientWidth,document.querySelector('canvas').clientHeight],scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],size:[innerWidth,innerHeight],extras:document.querySelectorAll('header,footer,button,h1').length,bg:getComputedStyle(document.body).backgroundColor}));
 assert.deepEqual(dom.canvas,[width,height]);assert.deepEqual(dom.scroll,[width,height]);assert.equal(dom.extras,0);assert.equal(dom.bg,'rgb(38, 62, 56)');
 let s=await snap();for(const c of s.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=width&&c.y+c.h<=height,`${width} control clipped: ${JSON.stringify(c)}`);
 const before=s.state.position;await page.keyboard.down('ArrowRight');await page.waitForTimeout(130);await page.keyboard.up('ArrowRight');await page.waitForTimeout(60);s=await snap();assert.ok(s.state.position.x>before.x+5);
 if(width===1280){assert.ok(s.camera.width/32===40);assert.ok(s.camera.height/32===22.5);assert.ok(s.player.height/height<=.10);}assert.ok(s.player.height/height<.17);
 const cam=s.camera;assert.ok(cam.x>=-1&&cam.y>=-1&&cam.x+cam.width<=2241&&cam.y+cam.height<=1153,'Camera exposes no out-of-map area');
 await page.keyboard.down('ArrowLeft');await page.waitForTimeout(130);await page.keyboard.up('ArrowLeft');await page.waitForTimeout(60);await shot(`home-${width}x${height}`);await key('Escape');await shot(`pause-${width}x${height}`);s=await snap();for(const c of s.controls)assert.ok(c.y+c.h<=height,`pause clipped ${height}`);await click('Resume');
 viewportResults.push({width,height,canvas:'fills viewport',scroll:false,movement:true,camera:cam});
}
await page.setViewportSize({width:390,height:844});await page.waitForTimeout(250);
const cdp=await context.newCDPSession(page);let control=(await snap()).controls.find(c=>c.id==='move-left');let before=(await snap()).state.position.x;
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:control.x+control.w/2,y:control.y+control.h/2}]});await page.waitForTimeout(250);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok((await snap()).state.position.x<before-15,'real touch movement');
await page.setViewportSize({width:1280,height:720});await page.waitForTimeout(200);
await move(480,445);await move(480,560);await move(880,640);await use();await area('farm');const initialCam=(await snap()).camera.x;await move(845,275);assert.ok((await snap()).camera.x>initialCam+100,'Camera follows across farm');await shot('farm-east-camera');await use();await area('city');await move(355,270);await use();await shot('seed-shop');await click('Buy 1 seed / 10 coins');await click('Back to the lane');assert.equal((await snap()).state.inventory.seed,1);
await move(90,290);await use();await area('farm');await move(370,245);await key('1');await use();assert.equal((await snap()).state.plots[0].crop,'tomato');
async function toBed(){await move(180,260);await use();await area('home');await move(480,640);await move(480,420);await move(370,420);await move(370,300);await move(315,300);await use();}
async function toPlot(){await move(480,445);await move(480,560);await move(880,640);await use();await area('farm');await move(370,245);}
for(let day=1;day<=3;day++){
 await key('2');await use();assert.equal((await snap()).state.plots[0].morning,true);await toBed();await click('Rest until evening');await toPlot();await key('2');await use();assert.equal((await snap()).state.plots[0].evening,true);if(day===1)await shot('evening-watered');await toBed();await click('Sleep / next day');assert.equal((await snap()).state.plots[0].growth,day);await toPlot();console.log('Growing day '+day+' passed');
}
await move(370,276);assert.equal((await snap()).context.index,0,'Mature plot is the highlighted target');await shot('mature-tomatoes');await key('3');await use();assert.equal((await snap()).state.inventory.tomato,2);await move(845,275);await use();await area('city');await move(650,280);await use();await click('Sell 2 / 36 coins');await click('Back to the lane');
await key('Escape');await click('Save');const saved=(await snap()).state;assert.equal(saved.money,86);assert.equal(saved.day,4);await page.reload();await page.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length>0);await click('Continue / Day 4');const loaded=(await snap()).state;
for(const key of ['character','area','day','money','health','energy','inventory','plots','sold'])assert.deepEqual(loaded[key],saved[key],`save preservation ${key}`);
await shot('continued-city');
// Verify both directional sheets and idle transition through real controls.
for(const [k,dir]of [['ArrowLeft','left'],['ArrowUp','up'],['ArrowRight','right'],['ArrowDown','down']]){await page.keyboard.down(k);await page.waitForTimeout(180);assert.equal((await snap()).player.direction,dir);await page.keyboard.up(k);await page.waitForTimeout(100);assert.equal(Number((await snap()).player.frame)%6,0);}
await key('Escape');const paused=(await snap()).state.minute;await page.waitForTimeout(800);assert.equal((await snap()).state.minute,paused);await click('Return to title');await click('New Game');await click('Start fresh');await click('Play as Boy');assert.equal((await snap()).state.character,'boy');
const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));assert.ok(resources.every(r=>new URL(r).origin===new URL(base).origin),'Local assets only');assert.deepEqual(errors,[]);
const report={result:'PASS',url:base,browser:browser.version(),viewports:viewportResults,fullLoop:'PASS: day 4, 86 coins, save/reload/Continue',touch:true,bothCharacters:true,animations:true,errors,warnings};await writeFile('docs/verification/craftsmanship/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));await context.close();await browser.close();
