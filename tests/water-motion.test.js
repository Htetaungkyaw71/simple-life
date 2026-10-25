import test from 'node:test';import assert from 'node:assert/strict';
import {waterMotion,stepWaterMotion,waterBurstPose,WATER_BURST_LIFE,MAX_WATER_BURSTS} from '../src/art/waterFootsteps.js';
import {bridgeRailBoxes,bridgeRailBlocked} from '../src/data/bridgeRails.js';
import {MAPS} from '../src/data/mapLayouts.js';import {waterAt} from '../src/data/water.js';import {walkable,inBounds} from '../src/data/locations.js';
import {newState} from '../src/systems/state.js';import {validate} from '../src/systems/save.js';import {beginJump,jumpRuntime} from '../src/systems/jump.js';
test('running creates alternating footsteps, expanding wakes and droplets which expire without idle/blocked-foot spam',()=>{
 const r=waterMotion();stepWaterMotion(r,{x:100,y:100},true,false,0);
 for(let n=1;n<=6;n++)stepWaterMotion(r,{x:100+n*16,y:100},true,true,n*110);
 assert.equal(r.emitted,6);assert.ok(r.bursts.some(b=>b.y>100)&&r.bursts.some(b=>b.y<100));const b=r.bursts.at(-1),early=waterBurstPose(b,b.time+50),late=waterBurstPose(b,b.time+400);assert.ok(early.drops.length>0);assert.ok(late.radius>early.radius);assert.ok(late.alpha<early.alpha);assert.equal(waterBurstPose(b,b.time+WATER_BURST_LIFE),null);
 const count=r.emitted;stepWaterMotion(r,r.position,true,true,2000);assert.equal(r.emitted,count);assert.equal(r.bursts.length,0);assert.ok(r.bursts.length<=MAX_WATER_BURSTS);
});
test('water entry and exit splash at the wet foot; dry bridge movement and distant relocation make no false steps',()=>{
 const r=waterMotion();stepWaterMotion(r,{x:0,y:0},false,false,0);stepWaterMotion(r,{x:8,y:0},true,true,110);assert.equal(r.bursts.at(-1).kind,'edge');const wet={...r.position};stepWaterMotion(r,{x:16,y:0},false,true,220);assert.equal(r.bursts.at(-1).x,wet.x);const count=r.emitted;for(let n=1;n<20;n++)stepWaterMotion(r,{x:16+n*8,y:0},false,true,220+n*110);assert.equal(r.emitted,count);stepWaterMotion(r,{x:4000,y:3000},true,true,3000);assert.equal(r.emitted,count);
});
test('Forest and City bridges have solid sides while both centre approaches and the full deck stay open',()=>{
 for(const area of ['forest','city'])for(const b of MAPS[area].bridges){
  const horizontal=b.axis==='horizontal'||!b.axis&&b.w>b.h,cx=b.x+b.w/2,cy=b.y+b.h/2;
  assert.ok(bridgeRailBoxes(MAPS[area]).length>=2);assert.ok(bridgeRailBlocked(MAPS[area],horizontal?cx:b.x+4,horizontal?b.y+4:cy,0));assert.ok(!bridgeRailBlocked(MAPS[area],cx,cy));
  const length=horizontal?b.w:b.h;for(let d=4;d<length;d+=8){const x=horizontal?b.x+d:cx,y=horizontal?cy:b.y+d;if(inBounds(area,x,y))assert.ok(walkable(area,x,y),area+JSON.stringify({x,y}));}
  const side={x:horizontal?cx:b.x-24,y:horizontal?b.y-24:cy},near={x:horizontal?cx:b.x+4,y:horizontal?b.y+4:cy};assert.ok(waterAt(MAPS[area],side));assert.equal(walkable(area,near.x,near.y),false);
 }
});
test('jumping cannot tunnel through a bridge side and legacy saves in a rail move safely without losing crops or coins',()=>{
 const b=MAPS.forest.bridges.find(b=>b.axis!=='vertical'),s=newState();s.area='forest';s.position={x:b.x+b.w/2,y:b.y-24};const r=jumpRuntime();assert.ok(beginJump(s,r,{x:0,y:1}));assert.ok(r.active.destination.y<=b.y,'jump stops at rail');s.position={x:b.x+b.w/2,y:b.y+4};s.money=731;s.plots[0].crop='tomato';const v=validate(s);assert.ok(walkable('forest',v.position.x,v.position.y));assert.notDeepEqual(v.position,s.position);assert.equal(v.money,731);assert.equal(v.plots[0].crop,'tomato');
});
