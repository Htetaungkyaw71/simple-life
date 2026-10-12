import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const {chromium,request}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const publicURL=process.env.PUBLIC_PLAYTEST_URL;
const expectedCoins=Number(process.env.PLAYTEST_COINS||60);
const access=publicURL?{url:publicURL,public:true}:JSON.parse(await readFile(process.env.PLAYTEST_ACCESS_FILE||'/private/tmp/simple-life-playtest-access.json','utf8'));
const out=process.env.AUDIO_QA_OUT||'docs/verification/hit-feedback';
const manifest=JSON.parse(await readFile(out+'/deployment-files.json','utf8'));
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const records=[],files=[];
const unauth=await request.newContext(),raw=await unauth.get(access.url,{maxRedirects:0});
if(access.public)assert.equal(raw.status(),200,'plain public game URL opens without authentication');else assert.ok([301,302,303,307,308,401,403].includes(raw.status()),'direct preview requires protected access');const directStatus=raw.status();await unauth.dispose();
try{
 for(const mobile of [false,true]){
  const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:720},hasTouch:mobile}),p=await ctx.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.text());});
  if(access.public){await p.goto(access.url);await p.waitForSelector('canvas');assert.equal(new URL(p.url()).origin,new URL(access.url).origin);assert.equal(new URL(p.url()).search,'','plain URL has no access query or redirect');}
  const u=new URL(access.shareURL||access.url);u.searchParams.set('qa','');await p.goto(u.href);await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
  const snap=()=>p.evaluate(()=>window.__simpleLife.snapshot());
  const click=async(id,delay=300)=>{const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);if(mobile)await p.touchscreen.tap(c.x+c.w/2,c.y+c.h/2);else await p.mouse.click(c.x+c.w/2,c.y+c.h/2);await p.waitForTimeout(delay);};
  await click('language-en');await click('Play');await click('Play as Boy');await click('intro-skip');await click('guide-back');await p.waitForFunction(()=>window.__simpleLife.snapshot().audio.pending===0&&window.__simpleLife.snapshot().audio.context==='running');
  assert.deepEqual((await snap()).audio.profile.music,{});assert.ok((await snap()).audio.loops.every(v=>v.key.startsWith('ambience:')));
  assert.equal((await snap()).state.money,expectedCoins);assert.equal((await snap()).state.selected,'hand');assert.equal((await snap()).audio.context,'running');assert.deepEqual((await snap()).audio.failures,[]);
  await click('choose-seeds');await click('bag-tab-gear');await click('bag-item-axe');await click('bag-action');assert.equal((await snap()).state.selected,'axe');
  await click('choose-seeds');await click('bag-tab-gear');await click('bag-item-axe');await click('bag-action');assert.equal((await snap()).state.selected,'hand');
  if(mobile){await click('jump',30);assert.ok((await snap()).jump.active);await p.waitForTimeout(850);}
  await p.reload();await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('language-en');await click('Continue');await p.waitForFunction(()=>window.__simpleLife.snapshot().audio.pending===0);
  assert.equal((await snap()).state.selected,'hand');assert.equal((await snap()).state.money,expectedCoins);assert.deepEqual((await snap()).audio.profile.music,{});assert.ok((await snap()).audio.loops.every(v=>v.key.startsWith('ambience:')));
  if(!mobile)for(const row of manifest.files){const r=await ctx.request.get(new URL(row.path,access.url).href);assert.equal(r.status(),200,row.path);const b=await r.body();assert.equal(b.length,row.bytes,row.path);assert.equal(createHash('sha256').update(b).digest('hex'),row.sha256,row.path);files.push({path:row.path,status:200,bytes:b.length,sha256:row.sha256});}
  const canvasCount=await p.locator('canvas').count();assert.equal(canvasCount,1);assert.deepEqual(errors,[]);
  await p.screenshot({path:out+'/hosted-'+(mobile?'phone':'mac')+'.png'});records.push({mobile,viewport:p.viewportSize(),freshGame:true,putAway:true,reload:true,jump:mobile,audio:(await snap()).audio,canvasCount,errors});await ctx.close();console.log('PASS hosted '+(mobile?'phone':'Mac'));
 }
 await writeFile(out+'/hosted-checks.json',JSON.stringify({result:'PASS',url:access.url,protectedDirectStatus:directStatus,publicDirectWithoutLogin:!!access.public,friendShareWithoutLogin:!access.public,shareMetadata:access.shareMetadata,fixtures:'Fresh New Game in disposable browser contexts; no fixture injection or user-profile storage.',records,files},null,2)+'\n');
}finally{await browser.close();}
