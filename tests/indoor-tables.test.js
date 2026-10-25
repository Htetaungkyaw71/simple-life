import test from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {decorationAllowed} from '../src/systems/customization.js';
import {craftDecoration,decorationPlacement} from '../src/systems/settlement.js';
import {MAPS} from '../src/data/mapLayouts.js';
import {FURNITURE,ROOM,configureRoom,roomArtSize,roomVisibleRect} from '../src/data/interior.js';

test('outdoor maps have no tables; the dining table remains inside and outdoor placement cannot consume one',()=>{
 for(const area of ['home','farm','city','forest'])assert.ok(!MAPS[area].props.some(p=>p.name==='table'||p.name==='home-table'),area);
 assert.ok(FURNITURE.some(([name])=>name==='home-table'));
 for(const area of ['home','farm']){
  const s=newState();s.area=area;s.inventory.wood=100;s.inventory.stone=100;craftDecoration(s,'table');
  assert.equal(s.inventory.tableDecor,1);assert.equal(decorationAllowed(area,'table'),false);
  s.selected='decorate';s.selectedDecoration='table';const before=structuredClone(s);
  assert.equal(decorationPlacement(s,{x:1152,y:800}).ok,false);assert.deepEqual(s,before);
 }
 assert.equal(decorationAllowed('interior','table'),true);
});
test('Continue returns former outdoor tables to Bag once while keeping all other ownership and progress',()=>{
 const raw=newState('girl');raw.money=723;raw.inventory.tableDecor=3;raw.inventory.benchDecor=2;
 raw.settlement.decorations=[{type:'table',area:'home',x:1152,y:800},{type:'table',farm:0,x:1152,y:800}];
 const loaded=validate(raw);assert.equal(loaded.inventory.tableDecor,5);assert.equal(loaded.inventory.benchDecor,2);assert.equal(loaded.money,723);assert.deepEqual(loaded.settlement.decorations,[]);
 assert.deepEqual(validate(loaded),loaded,'repeated Continue never duplicates packed tables');
 raw.inventory.tableDecor=9997;assert.equal(validate(raw).inventory.tableDecor,9999);
});
test('the back dining seat clears the hearth in every room size; displaced owned indoor decor is packed safely',()=>{
 for(const [w,h]of [[1280,720],[390,844],[640,360]]){
  configureRoom(w,h);const bench=FURNITURE.find(([n])=>n==='home-bench'),hearth=FURNITURE.find(([n])=>n==='home-fireplace');
  assert.ok(bench[1]+roomArtSize(bench[0]).w+8<=hearth[1],'eight world units of horizontal clearance');
  const visible=roomVisibleRect(hearth);assert.equal(ROOM.hearth.x,Math.round(visible.x+visible.w/2));assert.equal(ROOM.hearth.y,visible.y+visible.h+16);
 }
 configureRoom();
 const s=newState();s.area='interior';s.settlement.decorations=[{type:'bookcase',area:'interior',x:392,y:120}];s.inventory.bookcaseDecor=2;
 const v=validate(s);assert.deepEqual(v.settlement.decorations,[]);assert.equal(v.inventory.bookcaseDecor,3);assert.deepEqual(validate(v),v);
});
