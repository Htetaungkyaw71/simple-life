import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {chromium} from '/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const require=createRequire(import.meta.url),{PNG}=require('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const root=path.resolve(import.meta.dirname,'../../..'),out=path.join(root,'output/art/farmer-boy-approved-v1');
const reportDir=import.meta.dirname,manifest=JSON.parse(fs.readFileSync(path.join(out,'manifest.json'),'utf8'));
const pngs=[];function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,d.name);if(d.isDirectory())walk(p);else if(p.endsWith('.png'))pngs.push(p);}}walk(path.join(out,'frames'));assert.equal(pngs.length,156);
const checks=[];for(const file of pngs){const im=PNG.sync.read(fs.readFileSync(file));assert.equal(im.width,48);assert.equal(im.height,48);let minX=48,minY=48,maxX=-1,maxY=-1;for(let y=0;y<48;y++)for(let x=0;x<48;x++){const a=im.data[(y*48+x)*4+3];if(!file.endsWith('/idle/south/00.png'))assert.ok(a===0||a===255,'Generated alpha must be binary');if(a>=128){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}}assert.ok(maxX>=minX);assert.ok(minX>0&&maxX<47&&minY>0&&maxY<47,`Clipped frame ${file}`);if(file.includes('/idle/'))assert.equal(maxY-minY+1,30);checks.push({file:path.relative(out,file),bounds:[minX,minY,maxX,maxY]});}
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
assert.equal(sha(fs.readFileSync(path.join(out,'frames/idle/south/00.png'))),manifest.sources['approved-south-native'].sha256);
for(const [name,s]of Object.entries(manifest.sources))assert.equal(sha(fs.readFileSync(path.join(out,'source',name+'.png'))),s.sha256);
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});const records=[];
try{for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
 const context=await browser.newContext({viewport,hasTouch:viewport.width<500}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:4203/farmer-boy-approved-v1/');await page.waitForFunction(()=>window.reviewReady);await page.waitForTimeout(900);
 const info=await page.evaluate(()=>({canvases:document.querySelectorAll('canvas').length,frames:window.reviewFrames,errors:window.reviewErrors,overflow:document.documentElement.scrollWidth>innerWidth,loaded:Array.from(document.images).every(im=>im.complete)}));
 assert.equal(info.canvases,28);assert.equal(info.overflow,false);assert.deepEqual(info.errors,[]);
 for(const [action,spec]of Object.entries(manifest.actions))for(let row=0;row<4;row++)assert.equal(info.frames[action+'-'+row].length,spec.framesPerDirection);
 await page.locator('#pause').click();assert.equal(await page.locator('#pause').textContent(),'Resume');
 const snapshots=()=>page.evaluate(()=>Array.from(document.querySelectorAll('canvas')).map(c=>c.toDataURL()));const before=await snapshots();await page.waitForTimeout(400);assert.deepEqual(await snapshots(),before);
 await page.locator('#speed').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#rate').textContent(),'1.5×');
 await page.locator('#pause').click();await page.waitForTimeout(130);assert.notDeepEqual(await snapshots(),before);assert.deepEqual(errors,[]);
 await page.screenshot({path:path.join(reportDir,viewport.width+'-review.png'),fullPage:true});records.push({viewport,result:'PASS',...info,consoleErrors:errors});await context.close();
}}finally{await browser.close();}
fs.writeFileSync(path.join(reportDir,'checks.json'),JSON.stringify({nativeFrames:156,approvedSouthByteExact:true,sourceHashesMatch:true,nativeAudit:checks,browser:records},null,2)+'\n');console.log('PASS: 156 frame audit; desktop/mobile all phases, pause/resume, speed, no overflow/errors.');
