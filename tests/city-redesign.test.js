import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MAPS} from '../src/data/mapLayouts.js';
import {RESIDENTS} from '../src/data/residents.js';
import {residentsFor,stepResident,residentContext,residentMoveAllowed} from '../src/systems/residents.js';
import {walkable,EDGE_TRAVEL} from '../src/data/locations.js';
import {waterAt} from '../src/data/water.js';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';

test('fourfold City has connected bridge landings, service approaches and new districts',()=>{
 const m=MAPS.city;assert.equal(m.size.width*m.size.height,1280*896*4);assert.equal(m.bridges.length,2);assert.equal(m.gardens.length,3);
 const step=16,start={x:640,y:192},queue=[start],seen=new Set(['640,192']);
 for(let i=0;i<queue.length;i++){const p=queue[i];for(const [dx,dy]of [[step,0],[-step,0],[0,step],[0,-step]]){const x=p.x+dx,y=p.y+dy,k=x+','+y;if(!seen.has(k)&&walkable('city',x,y)&&walkable('city',p.x+dx/2,p.y+dy/2)&&!waterAt(m,{x,y})){seen.add(k);queue.push({x,y});}}}
 for(const [x,y]of [[432,306],[896,306],[336,738],[1800,224],[1840,488],[1760,1032],[1648,1344],[400,1500]])assert.ok(queue.some(p=>Math.hypot(p.x-x,p.y-y)<32),'unreachable district '+x+','+y);
 for(const b of m.bridges)for(let y=12;y<b.h;y+=8){const x=b.x+b.w/2;assert.ok(walkable('city',x,y));assert.equal(waterAt(m,{x,y}),false);assert.ok(waterAt(m,{x:b.x-20,y:60}));}
 assert.ok(walkable('city',EDGE_TRAVEL.homeCity.spawn.x,EDGE_TRAVEL.homeCity.spawn.y));
});
test('residents use native directional cells and collision-safe dry routes at Home and City',()=>{
 const frames=JSON.parse(readFileSync('public/assets/pixel/processed/town.json')).frames;
 for(const [area,list]of Object.entries(RESIDENTS))for(const n of list){assert.ok(walkable(area,n.x,n.y,8),n.name);for(const direction of ['down','up','left','right'])for(let f=0;f<3;f++){const cell=frames[`resident-${n.art}-${direction}-${f}`];assert.equal(cell.frame.w,32);assert.equal(cell.frame.h,32);}
  for(let i=0;i<n.route.length;i++){const a=n.route[i],b=n.route[(i+1)%n.route.length],d=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let step=0;step<=d;step+=2){const t=d?step/d:0,p={x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t};assert.ok(walkable(area,p.x,p.y,8),n.name);assert.equal(waterAt(MAPS[area],p),false,n.name);}}
 }
});
test('short conversations stop walking nearby and transient routes leave saved progress unchanged',()=>{
 const s=newState();const saved=JSON.stringify(s),people=residentsFor('city'),june=people[0];june.wait=0;
 stepResident(june,'city',50,{x:2000,y:1300});assert.ok(june.moving);assert.ok(june.position.x>560);const p={...june.position};
 const player={x:p.x,y:p.y+30};stepResident(june,'city',1000,player);assert.deepEqual(june.position,p);assert.equal(june.moving,false);assert.equal(june.direction,'down');assert.equal(residentContext(people,player).title,'June');assert.equal(residentContext(people,{x:2460,y:1630}),null);
 assert.equal(residentMoveAllowed(people,{x:p.x+28,y:p.y},{x:p.x+20,y:p.y}),false);assert.equal(residentMoveAllowed(people,{x:p.x+4,y:p.y},{x:p.x+8,y:p.y}),true);assert.equal(JSON.stringify(s),saved);const legacy={...s,area:'city',money:277,day:12,position:{x:704,y:440}};const repaired=validate(legacy);assert.equal(repaired.money,277);assert.equal(repaired.day,12);assert.ok(walkable('city',repaired.position.x,repaired.position.y));assert.equal(repaired.version,11);
});
