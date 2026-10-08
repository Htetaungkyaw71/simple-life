import {test} from 'node:test';
import assert from 'node:assert/strict';
import {REGIONS,FOREST_SIZE,FORAGE_NODES,TREASURES,FOREST_ENTRANCE} from '../src/data/forest.js';
import {ANIMAL_SPAWNS,SPECIES,ANIMAL_BY_ID} from '../src/data/wildlife.js';
import {walkable,LOCATIONS} from '../src/data/locations.js';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {refreshForest,recoverTreasure,inTerritory} from '../src/systems/forest.js';
import {attack,combatRuntime,animalRuntime,stepCombat} from '../src/systems/combat.js';
import {marketPrice} from '../src/systems/market.js';
const forest=()=>Object.assign(newState(),{area:'forest',position:{...FOREST_ENTRANCE},forestTutorialComplete:true,ownsClub:true,clubEquipped:true});
test('40-fold land area retains 40 regions, only Craftpix boars and one guard per cache',()=>{
 assert.equal(FOREST_SIZE.width*FOREST_SIZE.height,40*1280*1024);assert.equal(REGIONS.length,40);assert.deepEqual(Object.keys(SPECIES),['boar']);assert.equal(ANIMAL_SPAWNS.length,30);
 for(const a of ANIMAL_SPAWNS){assert.equal(a.species,'boar');assert.ok(walkable('forest',a.home.x,a.home.y,16),a.id);assert.ok(inTerritory(a.home,a.territory),a.id);}
 for(const t of TREASURES){const guards=ANIMAL_SPAWNS.filter(a=>a.region===t.region);assert.equal(guards.length,1);assert.ok(Math.hypot(guards[0].home.x-t.x,guards[0].home.y-t.y)<240);}
});
test('one navigable world reaches every region, fruit and hidden chest without crossing solids',()=>{
 const q=[[640,4832]],seen=new Set(['640,4832']);for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [dx,dy]of [[32,0],[-32,0],[0,32],[0,-32]]){const a=x+dx,b=y+dy,k=a+','+b;if(!seen.has(k)&&walkable('forest',a,b,16)&&walkable('forest',x+dx/2,y+dy/2,16)){seen.add(k);q.push([a,b]);}}}
 for(const r of REGIONS)assert.ok(q.some(([x,y])=>x>r.x&&x<r.x+r.w&&y>r.y&&y<r.y+r.h),r.id);
 for(const p of [...FORAGE_NODES,...TREASURES]){assert.ok(walkable('forest',p.x,p.y),p.id);assert.ok(q.some(([x,y])=>Math.hypot(x-p.x,y-p.y)<48),p.id);}
});
test('species health and damage work through directional combat with shared pack invulnerability',()=>{
 for(const key of ['boar']){
  const s=forest(),r=combatRuntime(),a=ANIMAL_SPAWNS.find(a=>a.species===key),target=s.forest.animals[a.id];
  s.position={x:a.home.x,y:a.home.y+42};const hit=attack(s,r,'up');assert.equal(hit.animalId,a.id);assert.equal(target.health,SPECIES[key].health-1);assert.equal(s.energy,95);
  // A locked charge right beside the player gives exactly this species' damage.
  target.position={x:s.position.x,y:s.position.y-24};const runtime=animalRuntime(r,a.id);runtime.mode='charge';runtime.timer=600;runtime.heading={x:0,y:1};const result=stepCombat(s,r,50);assert.equal(result.hurt,true);assert.equal(s.health,100-SPECIES[key].damage);
  const health=s.health;stepCombat(s,r,50);assert.equal(s.health,health);
 }
});
test('territory isolation and telegraphs prevent instant distant attacks; dead groups wait for a new day',()=>{
 const s=forest(),r=combatRuntime();for(let n=0;n<100;n++)stepCombat(s,r,50);assert.equal(s.health,100);
 const wolf=ANIMAL_SPAWNS.find(a=>a.species==='boar'),target=s.forest.animals[wolf.id];target.health=0;target.defeatedDay=s.day;refreshForest(s);assert.equal(s.forest.animals[wolf.id].health,0);s.day++;refreshForest(s);assert.equal(s.forest.animals[wolf.id].health,SPECIES.boar.health);
 for(const a of ANIMAL_SPAWNS)assert.ok(inTerritory(s.forest.animals[a.id].position,a.territory));
});
test('rare guarded treasure pays once, refuses live nearby guards and persists across days/reload',()=>{
 const s=forest(),t=TREASURES.find(t=>t.region==='snake');s.position={x:t.x,y:t.y};const money=s.money;assert.match(recoverTreasure(s,t.id),/Danger/);assert.equal(s.money,money);
 for(const a of Object.values(s.forest.animals))if(Math.hypot(a.position.x-t.x,a.position.y-t.y)<240){a.health=0;a.defeatedDay=s.day;}
 assert.match(recoverTreasure(s,t.id),/recovered/);assert.equal(s.money,money+t.coins);assert.match(recoverTreasure(s,t.id),/already|recovered/);assert.equal(s.money,money+t.coins);
 s.day++;refreshForest(s);const saved=validate(JSON.parse(JSON.stringify(s)));assert.ok(saved.forest.treasures.includes(t.id));assert.equal(saved.money,money+t.coins);
});
test('schema 8 migration translates legacy forest positions, bag and injured boar without changing progress/prices',()=>{
 const raw=forest();raw.version=8;raw.position={x:640,y:752};raw.money=321;raw.day=7;raw.minute=900;raw.inventory.mango=4;raw.plots[0]={...raw.plots[0],crop:'tomato',growth:2};raw.forest={forageDay:7,collected:['berry-south'],boar:{health:1,position:{x:936,y:376},defeatedDay:0}};raw.stash={area:'forest',x:640,y:960,coins:42};
 const before=['tomato','wildBerry','guava','mango','wildHide'].map(id=>marketPrice(raw,id));const s=validate(raw);assert.equal(s.version,10);assert.deepEqual(s.position,{x:640,y:4848});assert.equal(s.stash.y,5056);assert.equal(s.stash.coins,42);assert.equal(s.forest.boar.position.y,4472);assert.equal(s.forest.boar.health,1);assert.equal(s.money,321);assert.equal(s.inventory.mango,4);assert.equal(s.plots[0].growth,2);assert.deepEqual(s.forest.collected,['berry-south']);assert.equal(Object.keys(s.forest.animals).length,ANIMAL_SPAWNS.length);assert.deepEqual(['tomato','wildBerry','guava','mango','wildHide'].map(id=>marketPrice(s,id)),before);
});
test('schema 9 rejects unknown animals, unsafe territory locations and forged discovery/treasure IDs',()=>{
 const raw=forest(),wolf=ANIMAL_SPAWNS.find(a=>a.species==='boar');raw.forest.animals[wolf.id].position={x:640,y:4848};raw.forest.animals[wolf.id].health=999;raw.forest.animals.fake={health:900};raw.forest.animals['wolf-0']={health:4,position:{x:2240,y:3400},defeatedDay:0};raw.forest.explored=['frost','fake','frost'];raw.forest.treasures=['snake-cache','fake','snake-cache'];const s=validate(raw);assert.deepEqual(s.forest.animals[wolf.id].position,wolf.home);assert.equal(s.forest.animals[wolf.id].health,SPECIES.boar.health);assert.equal(s.forest.animals.fake,undefined);assert.equal(s.forest.animals['wolf-0'],undefined);assert.deepEqual(s.forest.explored,['frost','entrance']);assert.deepEqual(s.forest.treasures,['snake-cache']);
});
