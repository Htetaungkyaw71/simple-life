import test from 'node:test';
import assert from 'node:assert/strict';
import {newState,emptyPlot} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {restoreGround,digGround,markWet,wetAt} from '../src/systems/farmGround.js';
import {visiblePlots,plotOwned,prepareStarterBeds} from '../src/systems/expansion.js';
import {contextFor} from '../src/systems/context.js';
import {usePlot} from '../src/systems/farming.js';
import {FIELDS} from '../src/data/farms.js';
import {MAPS} from '../src/data/mapLayouts.js';
const farm=()=>Object.assign(newState(),{area:'farm',selected:'shovel'});
test('empty original, starter extension and free-dug beds return to grass, persist and re-dig without changing indices',()=>{
 for(const p of [{x:376,y:248},{x:712,y:440},{x:888,y:744}]){
  let s=farm();s.position={x:p.x,y:p.y-28};if(!visiblePlots(s).some(b=>b.x===p.x&&b.y===p.y))assert.ok(digGround(s,p).ok);
  const b=visiblePlots(s).find(b=>b.x===p.x&&b.y===p.y),coins=s.money,energy=s.energy,count=s.customBeds.length;
  assert.equal(contextFor(s,null,'down',p).type,'restoreGround');markWet(s,p);assert.ok(restoreGround(s,p).ok);assert.equal(wetAt(s,p.x,p.y),false);assert.equal(plotOwned(s,b.index),false);assert.equal(s.money,coins);assert.equal(s.energy,energy);assert.equal(s.customBeds.length,count);
  s.inventory.seed=1;s.selected='seed';assert.match(usePlot(s,b.index),/Dig/);s=validate(s);assert.ok(!visiblePlots(s).some(v=>v.x===p.x&&v.y===p.y));assert.deepEqual(validate(s),s);prepareStarterBeds(s);assert.equal(plotOwned(s,b.index),false);
  s.selected='shovel';const dug=digGround(s,p);assert.ok(dug.ok,dug.message);assert.equal(dug.index,b.index);assert.equal(s.customBeds.length,count);assert.equal(plotOwned(validate(s),dug.index),true);
 }
});
test('restoring ground never deletes crops, acts out of reach or alters another farm',()=>{
 const s=farm(),p={x:376,y:248};s.position=p;s.inventory.seed=1;s.selected='seed';usePlot(s,0);s.selected='shovel';const planted=structuredClone(s);assert.equal(restoreGround(s,p).ok,false);assert.deepEqual(s,planted);
 s.restoredBeds=[{farm:0,...p},{farm:999,...p},{farm:0,x:999,y:999},null];const checked=validate(s);assert.deepEqual(checked.restoredBeds,[]);assert.equal(checked.plots[0].crop,'tomato');
 const empty={x:424,y:248};s.position={x:1200,y:700};const before=structuredClone(s);assert.equal(restoreGround(s,empty).ok,false);assert.deepEqual(s,before);
 s.area='forest';assert.equal(restoreGround(s,empty).ok,false);
 const two=farm();two.farms.push({fields:[true,false,false,false]});two.plots.push(...Array.from({length:64},emptyPlot));two.position=p;assert.ok(restoreGround(two,p).ok);two.currentFarm=1;assert.ok(visiblePlots(two).some(b=>b.index===64));assert.equal(plotOwned(two,64),true);
});
test('six-row saves lose only empty sixth-row soil once, retain planted crops and all custom record indices',()=>{
 const s=farm();delete s.farmLayoutRevision;const extra=Array.from({length:8},(_,i)=>({farm:0,x:376+i*48,y:488,plot:emptyPlot()}));extra[7].plot={...emptyPlot(),crop:'corn',growth:1};s.customBeds.push(...extra);markWet(s,extra[0]);const before=structuredClone(s.customBeds);
 const fixed=validate(s);assert.deepEqual(fixed.customBeds,before);assert.equal(fixed.restoredBeds.length,7);assert.equal(fixed.wetGround.length,0);assert.equal(visiblePlots(fixed).length,41);assert.equal(fixed.customBeds.at(-1).plot.crop,'corn');assert.deepEqual(validate(fixed),fixed);
 fixed.position={x:376,y:460};assert.ok(digGround(fixed,{x:376,y:488}).ok);assert.ok(visiblePlots(validate(fixed)).some(b=>b.x===376&&b.y===488));
});
test('five-row starter has grass clearance from roads and the relocated board uses previously undiggable road ground',()=>{
 const f=FIELDS[0];assert.equal(f.rows,5);assert.equal(f.h,240);
 for(const [x,y,w,h] of MAPS.farm.paths){const dx=Math.max(x-f.x-f.w,f.x-x-w,0),dy=Math.max(y-f.y-f.h,f.y-y-h,0);assert.ok(Math.hypot(dx,dy)>=32,JSON.stringify([x,y,w,h]));}
 const board=MAPS.farm.props.find(p=>p.name==='notice');assert.deepEqual([board.x,board.y],[800,532]);assert.ok(board.x>=f.x+f.w+64);assert.ok(board.y>=f.y+f.h+64);assert.ok(MAPS.farm.paths.some(([x,y,w,h])=>board.x+4>=x&&board.x+60<=x+w&&board.y+8>=y&&board.y+46<=y+h));
});
