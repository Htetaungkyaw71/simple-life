import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FOREST_MAP,REGIONS,FORAGE_NODES} from '../src/data/forest.js';
import {walkable,nearestSafe} from '../src/data/locations.js';
import {combatRuntime,animalRuntime,stepCombat} from '../src/systems/combat.js';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {jumpRuntime,beginJump,stepJump,jumpPose,groundedPosition,cancelJump} from '../src/systems/jump.js';
const forest=p=>Object.assign(newState(),{area:'forest',position:p});
test('removed earth bank is walkable and jumping retains cooldown and grounded reload',()=>{
 const p={x:2048,y:994},s=forest(p),r=jumpRuntime();
 assert.ok(walkable('forest',p.x,970));
 assert.ok(FOREST_MAP.ledges.length>0);
 assert.equal(beginJump(s,r,{x:0,y:-1}),true);assert.equal(beginJump(s,r,{x:0,y:-1}),false);
 for(let n=0;n<5;n++)stepJump(s,r,50);assert.ok(jumpPose(r).height>0);assert.ok(s.position.y<p.y);
 const loaded=validate({...s,position:groundedPosition(s,r)});assert.deepEqual(loaded.position,p);assert.equal(loaded.version,17);
 for(let n=0;n<7;n++)stepJump(s,r,50);assert.equal(r.active,null);assert.ok(s.position.y<p.y-60);assert.ok(walkable('forest',s.position.x,s.position.y));
 assert.equal(beginJump(s,r,{x:0,y:-1}),false,'cooldown');for(let n=0;n<6;n++)stepJump(s,r,50);assert.equal(beginJump(s,r,{x:0,y:0}),true);
});
test('jump cannot tunnel through tree trunks, cave pillars or bounds and never grants combat immunity',()=>{
 const box=FOREST_MAP.obstacles.find(([x,y,w,h])=>w===20&&h===16&&x>100&&y>100&&walkable('forest',x+w/2,y+h+16));assert.ok(box);const [x,y,w,h]=box,p={x:x+w/2,y:y+h+16};
 {const s=forest(p),r=jumpRuntime();assert.ok(beginJump(s,r,{x:0,y:-1}));for(let n=0;n<12;n++)stepJump(s,r,50);assert.ok(s.position.y>=y+h+12);}
 const cave=FOREST_MAP.props.find(p=>p.name==='cave-mouth'&&walkable('forest',p.x+18,p.y+100));assert.ok(cave);const cs=forest({x:cave.x+18,y:cave.y+100}),cr=jumpRuntime();assert.ok(beginJump(cs,cr,{x:0,y:-1}));for(let n=0;n<12;n++)stepJump(cs,cr,50);assert.ok(cs.position.y>=cave.y+96,'cave pillar blocks the whole swept path');
 const invalid=forest({x:x+w/2,y:y+h/2});assert.equal(beginJump(invalid,jumpRuntime(),{x:0,y:-1}),false);
 const s=forest(nearestSafe('forest',{x:32,y:48})),r=jumpRuntime();beginJump(s,r,{x:-1,y:-1});for(let n=0;n<12;n++)stepJump(s,r,50);assert.ok(walkable('forest',s.position.x,s.position.y));assert.equal(s.health,100);assert.equal(s.energy,100);assert.equal(s.version,17);
 const indoors=Object.assign(newState(),{area:'interior'});assert.equal(beginJump(indoors,jumpRuntime(),{x:0,y:1}),false);
});
test('interrupting a leap returns safely to its grounded origin without losing progress',()=>{
 const s=forest({x:640,y:4848}),r=jumpRuntime(),origin={...s.position};s.money=312;s.inventory.mango=7;s.energy=0;beginJump(s,r,{x:1,y:0});stepJump(s,r,50);cancelJump(s,r);assert.equal(r.active,null);assert.deepEqual(s.position,origin);assert.equal(s.money,312);assert.equal(s.inventory.mango,7);assert.equal(s.energy,0);
});
test('dense vegetation leaves natural riverbanks, fruits and water accessible',()=>{
 assert.ok(FOREST_MAP.terraces.length>=65);assert.ok(FOREST_MAP.grass.length>3000);
 assert.ok(FOREST_MAP.props.filter(p=>p.name.includes('tree')||p.name==='snow-pine'||p.name==='bamboo-clump').length>750);
 for(const n of FORAGE_NODES)assert.ok(walkable('forest',n.x,n.y),n.id);
 for(const t of FOREST_MAP.terraces)assert.ok(t.segments.length>0,t.id);
});

test('an animal charge can still hurt during a leap; interruption grounds the farmer',()=>{
 const s=forest({x:936,y:4512}),j=jumpRuntime(),combat=combatRuntime(),origin={...s.position};assert.ok(beginJump(s,j,{x:0,y:1}));stepJump(s,j,50);const boar=s.forest.animals['boar-original'];boar.position={x:s.position.x,y:s.position.y-24};const r=animalRuntime(combat,'boar-original');r.mode='charge';r.timer=600;r.heading={x:0,y:1};const result=stepCombat(s,combat,50);assert.equal(result.hurt,true);assert.equal(s.health,85);cancelJump(s,j);assert.deepEqual(s.position,origin);assert.ok(walkable('forest',s.position.x,s.position.y));
});
