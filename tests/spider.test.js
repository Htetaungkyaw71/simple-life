import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ANIMAL_SPAWNS,SPECIES,SPIDER_GROUPS} from '../src/data/wildlife.js';
import {forestHabitat} from '../src/data/forestHabitats.js';
import {wildlifeFrame} from '../src/data/wildlifeArt.js';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {attack,combatRuntime,animalRuntime,stepCombat} from '../src/systems/combat.js';
import {inTerritory} from '../src/systems/forest.js';

const atlas=JSON.parse(readFileSync('public/assets/pixel/processed/town.json'));
test('generated Forest Spider has complete local four-direction animation keys',()=>{
 for(const direction of ['down','up','left','right'])for(const action of ['idle','walk','run','attack'])for(let now=0;now<1800;now+=83){
  const frame=wildlifeFrame('spider',action,direction,now);assert.ok(atlas.frames[frame],frame);
 }
});

test('Forest Spiders spawn as small groups only in rainforest habitats',()=>{
 assert.equal(SPIDER_GROUPS.length,24);assert.equal(SPIDER_GROUPS.length%3,0);
 const regions=new Set(SPIDER_GROUPS.map(a=>a.region));assert.equal(regions.size,8);
 for(const region of regions)assert.equal(SPIDER_GROUPS.filter(a=>a.region===region).length,3);
 for(const a of SPIDER_GROUPS){assert.equal(forestHabitat(a.home).id==='rainforest'||forestHabitat(a.home).id==='darkForest',true,a.id);assert.ok(inTerritory(a.home,a.territory),a.id);}
 assert.equal(ANIMAL_SPAWNS.filter(a=>a.species==='spider').length,24);
});

test('Forest Spider uses its lighter combat balance and survives save migration',()=>{
 const definition=SPIDER_GROUPS[0],s=Object.assign(newState(),{area:'forest',selected:'axe',position:{x:definition.home.x,y:definition.home.y+42}}),r=combatRuntime(),animal=s.forest.animals[definition.id];
 animal.position={...definition.home};const hit=attack(s,r,'up',definition.id);assert.equal(hit.species,'spider');assert.equal(animal.health,SPECIES.spider.health-1);assert.equal(s.inventory.meat,0);assert.equal(s.inventory.wildHide,0);
 animal.position={x:s.position.x,y:s.position.y-24};const runtime=animalRuntime(r,definition.id);runtime.mode='charge';runtime.timer=600;runtime.heading={x:0,y:1};const event=stepCombat(s,r,50);assert.equal(event.hurt,true);assert.equal(s.health,100-SPECIES.spider.damage);
 const loaded=validate(JSON.parse(JSON.stringify(s)));assert.equal(loaded.forest.animals[definition.id].health,1);assert.equal(loaded.forest.animals[definition.id].species,'spider');
});
