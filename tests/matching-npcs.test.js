import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {residentVisual,residentFrame,NPC_IDLE_DURATIONS,NPC_WALK_DURATIONS} from '../src/data/matchingNpcs.js';
import {residentsFor,stepResident} from '../src/systems/residents.js';
import {newState} from '../src/systems/state.js';
const atlas=JSON.parse(readFileSync('public/assets/pixel/processed/town.json')).frames;
test('only approved Nell/Sol resident IDs use new 64px art, preserving shared legacy NPC variants',()=>{
 for(const id of ['city-nell','city-sol']){
  const n={id,art:id==='city-nell'?2:5,direction:'down',elapsed:0,moving:false},v=residentVisual(n);
  assert.equal(v.custom,true);assert.equal(v.scale,1.5);assert.equal(v.originY,56/64);assert.equal(v.height,60);
  for(const direction of ['down','up','left','right'])for(const moving of [false,true]){
   const durations=moving?NPC_WALK_DURATIONS:NPC_IDLE_DURATIONS;let elapsed=0;
   for(let phase=0;phase<durations.length;phase++){
    const key=residentFrame({...n,direction,moving,elapsed});assert.ok(key.endsWith('-'+phase));assert.equal(atlas[key].frame.w,64);assert.equal(atlas[key].frame.h,64);elapsed+=durations[phase];
   }
   assert.ok(residentFrame({...n,direction,moving,elapsed}).endsWith('-0'));
  }
 }
 const clara=residentVisual({id:'clara',art:2,spriteSheet:'seed-seller'});
 assert.equal(clara.customSheet,true);assert.equal(clara.texture,'seed-seller');assert.equal(clara.columns,6);
 assert.deepEqual(clara.walkFrames,[4,4,4]);assert.deepEqual(clara.sitFrames,[5,5,5]);assert.equal(clara.scale,1.5);
 for(const n of [{id:'home-eli',art:5},{id:'city-june',art:0}]){
  assert.equal(residentVisual(n).custom,false);assert.equal(residentVisual(n).scale,2);
  assert.equal(residentFrame({...n,direction:'left',elapsed:120,moving:true}),`town-person-${n.art}-left-2`);
 }
});
test('approved stylists retain their shops, homes, safe commute and 7pm curfew without saved animation state',()=>{
 const s=newState();s.minute=600;const before=JSON.stringify(s),people=residentsFor('city',s);
 for(const id of ['city-nell','city-sol']){
  const n=people.find(n=>n.id===id);assert.equal(n.mode,'work');assert.ok(n.service);assert.ok(n.commute.length>2);assert.equal(n.route.length,0);
  stepResident(n,'city',500,{x:n.position.x,y:n.position.y+40},s);assert.equal(n.direction,'down');assert.equal(n.moving,false);assert.ok(residentFrame(n).includes('-idle-'));
 }
 for(const minute of [360,1139])for(const n of residentsFor('city',{minute}).filter(n=>['city-nell','city-sol'].includes(n.id))){assert.equal(n.moving,true);assert.ok(residentFrame(n).includes('-walking-'));}
 for(const minute of [359,1140,1439])assert.ok(residentsFor('city',{minute}).filter(n=>['city-nell','city-sol'].includes(n.id)).every(n=>!n.visible));
 assert.equal(JSON.stringify(s),before);
});
