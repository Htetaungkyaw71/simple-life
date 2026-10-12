import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {LOCATIONS} from '../../src/data/locations.js';
import {VEGETATION} from '../../src/data/vegetation.js';
import {ANIMAL_SPAWNS} from '../../src/data/wildlife.js';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true}),base=process.env.GAME_URL||'http://127.0.0.1:4200/',out=process.env.QA_OUT||'/tmp/simple-life-mm-world',results=[];await mkdir(out,{recursive:true});
try{for(const language of ['en','mm'])for(const [width,height]of [[1280,720],[390,844],[844,390],[568,256]])for(const area of ['home','city','forest']){
 const name=language+'-'+width+'-'+area;if(process.env.QA_FILTER&&!new RegExp(process.env.QA_FILTER).test(name))continue;const c=await browser.newContext({viewport:{width,height},hasTouch:width<1000}),p=await c.newPage(),errors=[],s=newState();s.area=area;s.story.intro='seen';s.starterSeedsClaimed=s.hasVisitedFarm=s.hasVisitedCity=s.forestTutorialComplete=true;s.minute=600;s.position=area==='forest'?{...ANIMAL_SPAWNS[0].home}:area==='home'?{x:VEGETATION.home.trees[0].x,y:VEGETATION.home.trees[0].y+40}:{...LOCATIONS.city.spawn};s.selected=area==='home'?'axe':'hand';
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await p.addInitScript(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);
 const snap=()=>p.evaluate(()=>window.__simpleLife.snapshot()),click=async id=>{const b=(await snap()).controls.find(b=>b.id===id);assert.ok(b,id);await p.mouse.click(b.x+b.w/2,b.y+b.h/2);await p.waitForTimeout(120);};
 try{await p.goto(base+'?qa');await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);await click('language-'+language);await click('Continue');if(area==='home'){await p.keyboard.down('ArrowUp');await p.waitForTimeout(80);await p.keyboard.up('ArrowUp');}await p.waitForTimeout(250);const v=await snap();
 assert.equal(v.animalNames,false,'wildlife must not create nameplates');
 for(const {board:b,text:t}of [...v.roadSigns,...v.farmSigns]){assert.ok(t.x>=b.x&&t.y>=b.y&&t.x+t.w<=b.x+b.w&&t.y+t.h<=b.y+b.h,JSON.stringify({b,t}));}
 if(language==='mm'){if(area==='city'){const aid=v.worldTexts.find(t=>t.source==='SEED AID');assert.ok(aid);assert.equal(aid.text,'မျိုးစေ့အကူအညီ');assert.equal(aid.size,7);}if(area==='home'){assert.ok(v.treeProgress,'nearby tree meter');assert.match(v.treeProgress.label,/^\d\/3$/);}}
 if(area==='forest')assert.ok(v.wildlife.some(a=>a.visible),'visible wildlife');assert.deepEqual(errors,[]);await p.screenshot({path:out+'/'+name+'.png'});results.push({name,result:'PASS'});console.log('PASS world',name);
 }catch(e){await p.screenshot({path:out+'/'+name+'-failure.png'});await writeFile(out+'/'+name+'-failure.json',JSON.stringify({error:e.stack,snapshot:await snap().catch(()=>null)},null,2));throw e;}finally{await c.close();}
}await writeFile(out+'/results.json',JSON.stringify({result:'PASS',results},null,2));}finally{await browser.close();}
