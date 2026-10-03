import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.connectOverCDP(process.env.CDP_URL);
const context=await browser.newContext({viewport:{width:360,height:640},isMobile:true,hasTouch:true,deviceScaleFactor:1});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.GAME_URL||'http://127.0.0.1:4173');
await page.getByRole('button',{name:'New Game',exact:true}).tap();await page.getByRole('button',{name:'Play as Boy',exact:true}).tap();
await page.locator('#save').tap();const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('simple-life.save.v1')));
// CDP sends real touch start/end events to the directional pad.
const cdp=await context.newCDPSession(page);const box=await page.getByRole('button',{name:'Move right',exact:true}).boundingBox();
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2}]});await page.waitForTimeout(450);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
await page.locator('#save').tap();const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('simple-life.save.v1')));assert.ok(after.position.x>before.position.x+40,'Touch movement');
await page.locator('[data-tool="water"]').tap();await page.locator('#save').tap();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('simple-life.save.v1')).selected),'water');
await page.waitForTimeout(450);await page.screenshot({path:'docs/verification/mobile-portrait.png',fullPage:true});
for(const [width,height]of [[360,640],[640,360],[1280,720]]){
 await page.setViewportSize({width,height});await page.waitForTimeout(400);
 await page.screenshot({path:`docs/verification/layout-${width}x${height}.png`,fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No horizontal overflow ${width}`);
 for(const selector of ['#hud','#bottom','#use','.tools','#world']) {const rect=await page.locator(selector).boundingBox();assert.ok(rect&&rect.width>0&&rect.x>=0&&rect.x+rect.width<=width+1,`Layout ${selector} ${width}`);}
 await page.screenshot({path:`docs/verification/layout-${width}x${height}.png`,fullPage:true});
}
// Fast taps must survive even when released within one rendered frame.
await page.keyboard.press('1');await page.locator('#save').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('simple-life.save.v1')).selected),'seed');
await page.keyboard.press('Escape');await page.getByRole('button',{name:'Keep playing',exact:true}).waitFor();await page.getByRole('button',{name:'Keep playing',exact:true}).click();
assert.deepEqual(errors,[]);console.log(JSON.stringify({result:'PASS',touchMovement:after.position.x-before.position.x,viewports:['360x640','640x360','1280x720'],rapidKeyTap:true,errors}));
await context.close();await browser.close();
