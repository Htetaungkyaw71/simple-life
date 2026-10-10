import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {collectStarterSeeds} from '../src/systems/starter.js';
import {contextFor} from '../src/systems/context.js';
import {PLOTS} from '../src/data/crops.js';
import {MAPS} from '../src/data/mapLayouts.js';
import {HOUSE,pondRows} from '../src/data/geometry.js';
import {walkable,LOCATIONS} from '../src/data/locations.js';
test('starter reward is exactly three, once across save/continue, fresh in a new game',()=>{
 let s=newState();assert.equal(collectStarterSeeds(s),'Received 3 tomato seeds.');assert.equal(s.inventory.seed,3);s=validate(JSON.parse(JSON.stringify(s)));collectStarterSeeds(s);assert.equal(s.inventory.seed,3);assert.equal(s.starterSeedsClaimed,true);const fresh=newState();assert.equal(fresh.starterSeedsClaimed,false);collectStarterSeeds(fresh);assert.equal(fresh.inventory.seed,3);
});
test('legacy crops expand without reordering and City saves migrate safely into the opened town',()=>{
 const old=newState('girl');old.version=1;old.area='city';old.money=217;old.plots=old.plots.slice(0,6);old.plots[5]={crop:'tomato',growth:2,morning:true,evening:false,dryDays:0};delete old.starterSeedsClaimed;
 const s=validate(old);assert.equal(s.version,15);assert.equal(s.area,'city');assert.ok(walkable('city',s.position.x,s.position.y));assert.equal(s.money,217);assert.equal(s.plots[5].growth,3);assert.equal(s.plots[5].crop,'tomato');assert.equal(s.plots[5].wateredDay,1);assert.equal(s.plots.length,64);assert.equal(s.plots[15].crop,null);assert.equal(s.starterSeedsClaimed,false);
 old.area='home';old.position={x:370,y:350};assert.equal(validate(old).area,'interior');
});
test('house solids cover walls, corners, windows and rear; porch and door remain accessible',()=>{
 for(const [x,y]of [[416,400],[544,400],[480,330],[424,420],[536,420],[440,400]])assert.equal(walkable('home',x,y),false,`${x},${y}`);
 assert.equal(walkable('home',480,450),false);assert.equal(walkable('home',480,492),true);
 const s=newState();s.position={...HOUSE.porch};assert.equal(contextFor(s).to,'interior');s.position={x:440,y:440};assert.notEqual(contextFor(s)?.to,'interior');s.position={x:480,y:300};assert.notEqual(contextFor(s)?.to,'interior');
 s.position={x:480,y:400};const loaded=validate(s);assert.ok(walkable(loaded.area,loaded.position.x,loaded.position.y));assert.ok(Math.hypot(loaded.position.x-480,loaded.position.y-400)<100);
});
test('active field has sixteen reachable cells and action-specific prompts',()=>{
 assert.equal(new Set(PLOTS.map(p=>p.x)).size,4);assert.equal(new Set(PLOTS.map(p=>p.y)).size,4);
 const s=newState();s.area='farm';for(const p of PLOTS)assert.ok(walkable('farm',p.x,p.y));s.position={...PLOTS[0]};assert.match(contextFor(s).label,/No seeds/);collectStarterSeeds(s);assert.equal(contextFor(s).label,'Plant seed');s.selected='water';assert.equal(contextFor(s).label,'Water ground');s.plots[0].crop='tomato';assert.equal(contextFor(s).label,'Water');s.plots[0].wateredDay=1;assert.equal(contextFor(s).label,'Already watered today');s.plots[0].growth=3;s.selected='harvest';assert.equal(contextFor(s).label,'Harvest');s.position={x:800,y:520};assert.notEqual(contextFor(s)?.type,'plot');
 assert.ok(Object.hasOwn(LOCATIONS,'city'));assert.ok(!LOCATIONS.farm.interactions.some(p=>p.to==='city'));
});
test('pond surfaces are walkable, adjacent banks remain usable and cans refill on land',()=>{
 for(const area of ['home','farm'])for(const pond of MAPS[area].water){
  const rows=pondRows(pond);for(const [x,y,w]of rows){assert.equal(walkable(area,x+w/2,y+1,0),true);assert.equal(walkable(area,x+.5,y+1,0),true);assert.equal(walkable(area,x+w-.5,y+1,0),true);}
  const [x,y,w]=pond;const s=newState();s.area=area;s.selected='water';s.position={x:x+w/2,y:y-16};assert.ok(walkable(area,s.position.x,s.position.y));assert.equal(contextFor(s).type,'refill');s.selected='seed';assert.notEqual(contextFor(s)?.type,'refill');
 }
});
test('all sixteen daily crop states round-trip and harvested cells remain empty',()=>{
 const s=newState();s.area='farm';s.starterSeedsClaimed=true;
 const variants=[{crop:null,growth:0},{crop:'tomato',growth:0},{crop:'tomato',growth:0,wateredDay:1},{crop:'tomato',growth:1},{crop:'tomato',growth:0,missedDays:1},{crop:'tomato',growth:0,missedDays:2},{crop:'tomato',growth:0,missedDays:3},{crop:'tomato',growth:0,missedDays:4}];
 s.plots=s.plots.map((p,i)=>i>=16?p:({...p,...variants[i%variants.length]}));assert.deepEqual(validate(JSON.parse(JSON.stringify(s))).plots,s.plots);
});
