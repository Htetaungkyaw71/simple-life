import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EDGE_TRAVEL,edgeTravel,LOCATIONS,walkable,nearestSafe} from '../src/data/locations.js';
import {ROOM,ROOM_SOLIDS} from '../src/data/interior.js';
import {houseSolids,HOUSE} from '../src/data/geometry.js';
import {contextFor} from '../src/systems/context.js';
import {newState} from '../src/systems/state.js';
test('edge transitions replace the old middle trigger and land safely inward',()=>{
 const s=newState();s.position={x:880,y:640};assert.notEqual(contextFor(s)?.to,'farm');assert.equal(edgeTravel(s),null);
 for(const [area,e]of Object.entries(EDGE_TRAVEL)){s.area=area;const[x,y,w,h]=e.zone;s.position={x:x+w/2,y:y+h/2};assert.equal(edgeTravel(s),e);assert.ok(walkable(e.to,e.spawn.x,e.spawn.y));s.area=e.to;s.position=e.spawn;assert.equal(edgeTravel(s),null);}
});
test('complete house mask includes chimney, keeps porch clear and repairs to nearby ground',()=>{
 assert.ok(houseSolids(HOUSE.x,HOUSE.y).some(([x,y,w,h])=>530>=x&&530<x+w&&332>=y&&332<y+h));
 assert.equal(walkable('home',480,450),false);assert.ok(walkable('home',HOUSE.porch.x,HOUSE.porch.y));assert.ok(walkable('home',HOUSE.exit.x,HOUSE.exit.y));
 assert.ok(HOUSE.exit.y-(HOUSE.y+110)>=32);
 for(const p of [{x:480,y:400},{x:530,y:332}]){const repaired=nearestSafe('home',p);assert.ok(walkable('home',repaired.x,repaired.y));assert.ok(Math.hypot(repaired.x-p.x,repaired.y-p.y)<96);}
});
test('compact room has solid furniture, accessible bed and door, and bounded floor',()=>{
 assert.equal(ROOM.width,624);assert.equal(ROOM.height,304);
 for(const[x,y,w,h]of ROOM_SOLIDS)assert.equal(walkable('interior',x+w/2,y+h/2),false);
 for(const p of [ROOM.spawn,ROOM.bed,ROOM.exit])assert.ok(walkable('interior',p.x,p.y));
 const s=newState();s.area='interior';s.position=ROOM.bed;assert.equal(contextFor(s).type,'bed');s.position=ROOM.exit;assert.equal(contextFor(s).to,'home');
 assert.ok(!walkable('interior',0,100));assert.ok(!walkable('interior',ROOM.width+16,400));
});
