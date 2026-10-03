// Run with PLAYWRIGHT_MODULE pointing to an installed Playwright index.mjs,
// and CDP_URL pointing to a dedicated agent-browser QA session.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.connectOverCDP(process.env.CDP_URL);
const page = browser.contexts()[0].pages()[0];
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.setViewportSize({width:1280,height:720});
await page.goto(process.env.GAME_URL || 'http://127.0.0.1:5173');
await page.getByRole('button',{name:'New Game',exact:true}).click();
if(await page.getByRole('button',{name:'Start fresh',exact:true}).count())await page.getByRole('button',{name:'Start fresh',exact:true}).click();
await page.getByRole('button',{name:'Play as Girl',exact:true}).click();
const state=async()=>{await page.locator('#save').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('simple-life.save.v1')));};
async function move(x,y){
 for(const [axis,target,negative,positive]of [['x',x,'ArrowLeft','ArrowRight'],['y',y,'ArrowUp','ArrowDown']]){
  for(let n=0;n<5;n++){const s=await state();const diff=target-s.position[axis];if(Math.abs(diff)<7)break;await page.keyboard.down(diff<0?negative:positive);await page.waitForTimeout(Math.min(3500,Math.abs(diff)/190*1000));await page.keyboard.up(diff<0?negative:positive);}
 }
 const s=await state();assert.ok(Math.hypot(s.position.x-x,s.position.y-y)<15,`Movement failed: ${JSON.stringify(s.position)} -> ${x},${y}`);
}
async function use(){await page.keyboard.press('e',{delay:90});await page.waitForTimeout(120);}
async function area(name){assert.equal((await state()).area,name);}
async function homeToPlot(){await move(480,445);await use();await area('farm');await move(370,245);}
async function plotToBed(){await move(180,260);await use();await area('home');await move(370,420);await move(370,345);await move(295,345);await use();}
await move(480,445);await use();await area('farm');
await move(845,275);await use();await area('city');
await move(355,270);await use();
await page.getByRole('button',{name:'Buy 1 seed · 10 coins',exact:true}).click();
await page.getByRole('button',{name:'Back to the lane',exact:true}).click();
assert.equal((await state()).inventory.seed,1);
await page.screenshot({path:'docs/verification/city.png'});
await move(90,290);await use();await area('farm');await move(370,245);await page.keyboard.press('1',{delay:90});await use();assert.equal((await state()).plots[0].crop,'tomato');
for(let day=1;day<=3;day++){
 await page.keyboard.press('2',{delay:90});await use();assert.equal((await state()).plots[0].morning,true);
 await plotToBed();await page.getByRole('button',{name:'Rest until evening',exact:true}).click();await homeToPlot();await page.keyboard.press('2',{delay:90});await use();assert.equal((await state()).plots[0].evening,true);
 await plotToBed();await page.getByRole('button',{name:'Sleep → next day',exact:true}).click();assert.equal((await state()).plots[0].growth,day);await homeToPlot();
 console.log(`Day ${day}: both waterings and overnight growth passed`);
}
await page.screenshot({path:'docs/verification/farm-ready.png'});
await page.keyboard.press('3',{delay:90});await use();assert.equal((await state()).inventory.tomato,2);
await move(845,275);await use();await area('city');await move(650,280);await use();
await page.getByRole('button',{name:'Sell 2 tomatoes · 36 coins',exact:true}).click();await page.getByRole('button',{name:'Back to the lane',exact:true}).click();
const before=await state();assert.equal(before.money,86);assert.equal(before.sold,2);assert.equal(before.day,4);
await page.reload();await page.getByRole('button',{name:'Continue · Day 4',exact:true}).click();const after=await state();
for(const key of ['money','sold','day','character','area','inventory','plots','energy','health'])assert.deepEqual(after[key],before[key],`Persistence: ${key}`);
await page.screenshot({path:'docs/verification/continued.png'});
await page.keyboard.press('Escape',{delay:90});const paused=await page.evaluate(()=>JSON.parse(localStorage.getItem('simple-life.save.v1')).minute);await page.waitForTimeout(1100);await page.getByRole('button',{name:'Keep playing',exact:true}).click();const unpaused=await state();assert.ok(unpaused.minute-paused<2,'Pause should freeze clock');
assert.deepEqual(errors,[]);console.log(JSON.stringify({result:'PASS',loop:'girl → movement → buy → plant → morning/evening water ×3 → sleep ×3 → harvest → sell → save → reload → Continue',money:after.money,day:after.day,errors}));
await browser.close();
