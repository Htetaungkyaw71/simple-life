import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {VEGETATION} from '../../src/data/vegetation.js';
import {walkable} from '../../src/data/locations.js';
import {contextFor} from '../../src/systems/context.js';
import {useVegetation} from '../../src/systems/vegetation.js';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true}),records=[],out='docs/verification/cozy-audio';
async function run(name,s,check){
 const ctx=await browser.newContext({viewport:{width:640,height:360},hasTouch:true}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(['warning','error'].includes(m.type()))errors.push(m.text());});
 await p.addInitScript(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await p.goto('http://127.0.0.1:4190/?qa');await p.waitForFunction(()=>window.__simpleLife?.snapshot().controls.length);
 const snap=()=>p.evaluate(()=>window.__simpleLife.snapshot()),tap=async(id,delay=550)=>{const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);await p.touchscreen.tap(c.x+c.w/2,c.y+c.h/2);await p.waitForTimeout(delay);};
 await tap('Continue');await p.waitForFunction(()=>window.__simpleLife.snapshot().audio.pending===0);await check({p,snap,tap});assert.deepEqual(errors,[]);await p.screenshot({path:out+'/'+name+'.png'});records.push({name,errors,state:(await snap()).state,context:(await snap()).context,audio:(await snap()).audio});await ctx.close();
}
try{
 const f=newState();Object.assign(f,{area:'forest',position:{x:616,y:4664},forestTutorialComplete:true,nightWarningSeen:true,stash:{area:'forest',x:616,y:4664,coins:15}});f.story.intro='seen';
 await run('touch-stash-fruit',f,async({snap,tap})=>{assert.equal((await snap()).context.type,'stash');await tap('attack');assert.equal((await snap()).state.money,75);assert.equal((await snap()).state.stash,null);assert.equal((await snap()).context.type,'forage');await tap('attack');assert.equal((await snap()).state.inventory.guava,1);assert.equal((await snap()).state.selected,'hand');});
 const s=newState();s.area='farm';s.hasVisitedFarm=true;s.selected='axe';s.story.intro='seen';let tree;
 for(const n of VEGETATION.farm.trees){s.position={x:n.x,y:n.y-48};const c=contextFor(s);if(walkable('farm',s.position.x,s.position.y,12,false,s)&&c?.type==='chop'&&c.id===n.id&&useVegetation(structuredClone(s),c).ok){tree=n;break;}}
 assert.ok(tree,'reachable tree facing down');
 await run('touch-three-hit-tree',s,async({p,snap,tap})=>{const c=(await snap()).camera;await p.touchscreen.tap((tree.x-c.x)*c.zoom,(tree.y-c.y)*c.zoom);assert.equal((await snap()).state.inventory.wood,0);for(let i=1;i<=3;i++){await tap('attack');assert.equal((await snap()).state.inventory.wood,i===3?3:0);if(i<3)assert.equal((await snap()).state.vegetation['farm:0'].treeHits[tree.id],i);}assert.ok((await snap()).state.vegetation['farm:0'].trees.includes(tree.id));});
 await writeFile(out+'/world-actions.json',JSON.stringify({result:'PASS',records},null,2));console.log('Default hands / touch chopping PASS');
}finally{await browser.close();}
