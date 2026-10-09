import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {residentsFor,stepResident,residentContext,residentMoveAllowed} from '../src/systems/residents.js';
import {commutePose,pathLength,pathPose} from '../src/systems/commute.js';
import {MAPS} from '../src/data/mapLayouts.js';
import {HOUSE,houseSolids} from '../src/data/geometry.js';
import {walkable} from '../src/data/locations.js';
import {waterAt} from '../src/data/water.js';
import {waterRipples,ripplePose} from '../src/art/waterRipples.js';
import {HeldWateringCan} from '../src/entities/HeldWateringCan.js';
import {Hud} from '../src/ui/Hud.js';
import {newState} from '../src/systems/state.js';
import {recorder} from './helpers/uiRecorder.js';

test('residents and every seller emerge at dawn, commute over safe dry routes, and enter doors before 8pm',()=>{
 for(const area of ['home','city']){
  const state={minute:359},people=residentsFor(area,state);assert.equal(people.length,area==='home'?2:11);
  for(const n of people){
   assert.equal(n.visible,false);assert.equal(residentContext([n],n.position),null);assert.ok(residentMoveAllowed([n],n.position,{x:n.position.x+1,y:n.position.y}));
   state.minute=360;stepResident(n,area,16,{x:0,y:0},state);assert.equal(n.mode,'toWork');assert.equal(n.visible,true);assert.deepEqual(n.position,n.commute[0]);
   for(let i=2;i<n.commute.length;i++){const a=n.commute[i-1],b=n.commute[i],d=Math.hypot(a.x-b.x,a.y-b.y);for(let v=0;v<=d;v+=2){const p=pathPose([a,b],v).position;assert.ok(walkable(area,p.x,p.y,8),n.name+' blocked path');assert.equal(waterAt(MAPS[area],p),false);}}
   state.minute=420;stepResident(n,area,0,{x:0,y:0},state);assert.equal(n.mode,'work');assert.equal(n.visible,true);
   const before={...n.position},leave=commutePose(n,600).leave;state.minute=leave;stepResident(n,area,0,{x:0,y:0},state);assert.equal(n.mode,'toHome');assert.ok(Math.hypot(n.position.x-before.x,n.position.y-before.y)<.01,'no teleport at departure');
   state.minute=1199.99;stepResident(n,area,16,{x:0,y:0},state);assert.ok(Math.hypot(n.position.x-n.commute[0].x,n.position.y-n.commute[0].y)<2,'returns to actual doorway');
   state.minute=1200;stepResident(n,area,16,{x:0,y:0},state);assert.equal(n.visible,false);assert.equal(n.mode,'home');
   state.minute=360;stepResident(n,area,0,{x:0,y:0},state);assert.deepEqual(n.position,n.commute[0]);
  }
 }
});
test('late-evening reload reconstructs travel and pauses keep the clock-derived position stable',()=>{
 const people=residentsFor('city',{minute:1199});assert.ok(people.some(n=>n.kind));for(const n of people){assert.equal(n.mode,'toHome');const before={...n.position};stepResident(n,'city',0,{x:0,y:0},{minute:1199});assert.ok(Math.hypot(n.position.x-before.x,n.position.y-before.y)<1e-6);assert.ok(pathLength(n.commute)>64);}
 for(const minute of [0,359,1200,1439])assert.ok(residentsFor('city',{minute}).every(n=>!n.visible));
});
test('all rendered houses are larger, unique, physically solid, and preserve the Home entry',()=>{
 const frames=JSON.parse(readFileSync('public/assets/pixel/processed/town.json')).frames,names=[];
 for(const area of ['home','farm','city'])for(const b of MAPS[area].buildings.filter(b=>b.name.startsWith('house'))){names.push(b.name);const f=frames[b.name].frame;assert.equal(f.w,120);assert.equal(f.h,96);const boxes=houseSolids(b.x,b.y,b.name);assert.ok(boxes.length>40);assert.equal(walkable(area,b.x+120,b.y+140),false);assert.ok(walkable(area,b.x+120,b.y+234,8));}
 assert.equal(new Set(names).size,names.length);assert.ok(walkable('home',HOUSE.door.x,HOUSE.door.y));
});
test('axe uses the farmer hand without an added hand, points outward and layers front/back by facing',()=>{
 const u=recorder(),s=newState();u.app={state:s,paused:false};s.selected='axe';const held=new HeldWateringCan(u);
 for(const dir of ['left','right','up','down']){
  held.update({x:100,y:100},dir,2);assert.equal(held.can.originY,2/16);assert.equal(held.can.originX,held.can.flipX?13/16:3/16);assert.equal(held.can.flipY,false);assert.equal(held.hand.visible,false);assert.equal(held.can.depth,dir==='up'?99:101);assert.ok(Math.hypot(held.can.x-100,held.can.y-100)<32);
  for(const remaining of [0,420]){held.remaining=remaining;held.update({x:100,y:100},dir,2);const bladeX=held.can.flipX?5:11,bladeY=7;const dx=bladeX-held.can.originX*16,dy=bladeY-held.can.originY*16;const worldX=held.can.x+(dx*Math.cos(held.can.rotation)-dy*Math.sin(held.can.rotation))*2;assert.ok(held.can.flipX?worldX>110:worldX<90,'blade faces away from body');const worldY=held.can.y+(dx*Math.sin(held.can.rotation)+dy*Math.cos(held.can.rotation))*2;assert.ok(worldY<held.can.y,'blade stays above grip, handle slopes downward');}held.remaining=0;
 }
 s.selected='water';held.update({x:100,y:100},'right',2);assert.equal(held.hand.visible,true);assert.equal(held.can.flipY,false);
});
test('phone and desktop HUD has equal framed meter fills and no USE button',()=>{
 for(const [w,h]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844],[360,640]]){
  const u=recorder(w,h),s=newState();u.app={state:s,input:{},scene:{cameras:{main:{worldView:{x:0,y:0},zoom:1}}}};const hud=new Hud(u);assert.equal(hud.healthWidth,hud.energyWidth);assert.equal(hud.health.h,hud.energy.h);assert.equal(hud.health.x,hud.energy.x);assert.ok(!u.controls.some(c=>c.id==='use'));for(const c of u.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=u.w&&c.y+c.h<=u.h);
 }
});
test('wide City canal has moving independent ripples across its full width, excluding bridges',()=>{
 const ripples=waterRipples(MAPS.city);assert.ok(ripples.length>80);for(const r of ripples)assert.ok(waterAt(MAPS.city,r));for(const x of [0,640,1280,1920])assert.ok(ripples.some(r=>r.x>=x&&r.x<x+640));assert.ok(ripples.some(r=>{const a=ripplePose(r,300),b=ripplePose(r,1300);return a&&b&&(a.x!==b.x||a.y!==b.y);}));
});
