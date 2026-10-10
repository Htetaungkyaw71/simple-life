import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {combatRuntime,attack,stepCombat,huntContext} from '../src/systems/combat.js';
import {eatFood,refreshForest} from '../src/systems/forest.js';
import {collectStone,stoneContext} from '../src/systems/resources.js';
import {forestStones} from '../src/data/forestResources.js';
import {contextFor} from '../src/systems/context.js';
import {WOODLAND_WILDLIFE,WOODLAND_SPECIES} from '../src/data/woodlandWildlife.js';
import {FOODS} from '../src/data/items.js';
import {REGIONS} from '../src/data/forest.js';
import {MAPS} from '../src/data/mapLayouts.js';
import {walkable} from '../src/data/locations.js';
import {dryFootprint} from '../src/data/water.js';
import {SALE_IDS} from '../src/data/crops.js';
import {marketPrice} from '../src/systems/market.js';
import {BagPanel,bagItems} from '../src/ui/BagPanel.js';
import {Hud} from '../src/ui/Hud.js';
import {recorder} from './helpers/uiRecorder.js';

const forest=()=>Object.assign(newState(),{area:'forest',selected:'axe',position:{x:936,y:4526}});
test('free axe defeats a boar, awards meat/hide once, gates cooldown and rejects retired gear',()=>{
 const s=forest(),r=combatRuntime();s.ownsClub=false;
 for(let i=0;i<3;i++){
  s.forest.boar.position={x:936,y:4478};r.now=i*500;
  const result=attack(s,r,'up');assert.equal(result.hit,true);assert.equal(result.weapon,'axe');assert.equal(result.defeated,i===2);
  const copy=structuredClone(s);assert.equal(attack(s,r,'up').ok,false);assert.deepEqual(s,copy);
 }
 assert.equal(s.energy,97);assert.equal(s.inventory.meat,2);assert.equal(s.inventory.wildHide,1);
 let loaded=validate(JSON.parse(JSON.stringify(s)));assert.equal(loaded.forest.boar.health,0);assert.equal(loaded.inventory.meat,2);
 r.now=1500;attack(loaded,r,'up');assert.equal(loaded.inventory.meat,2);
 loaded.day++;refreshForest(loaded);assert.equal(loaded.forest.boar.health,3);
 const club=forest();club.selected='seed';club.ownsClub=club.clubEquipped=true;club.forest.boar.position={x:936,y:4478};const before=structuredClone(club);assert.equal(attack(club,combatRuntime(),'up').ok,false);assert.deepEqual(club,before);
});
test('all four quiet species can be hunted and saved without becoming hostile or guarding caches',()=>{
 for(const species of Object.keys(WOODLAND_SPECIES)){
  const s=forest(),r=combatRuntime(),n=WOODLAND_WILDLIFE.find(a=>a.species===species),a=s.forest.woodland[n.id];
  s.position={x:a.position.x,y:a.position.y+44};const point={...a.position};
  assert.equal(huntContext(s,'up').type,'hunt');
  for(let i=0;i<WOODLAND_SPECIES[species].health;i++){a.position={...point};r.now=i*500;assert.equal(attack(s,r,'up',n.id).hit,true);}
  assert.equal(a.health,0);assert.equal(s.inventory.meat,WOODLAND_SPECIES[species].meat);assert.equal(s.inventory.wildHide,0);
  const saved=validate(JSON.parse(JSON.stringify(s)));assert.equal(saved.forest.woodland[n.id].health,0);assert.equal(saved.inventory.meat,s.inventory.meat);
  saved.area='home';saved.area='forest';refreshForest(saved);assert.equal(saved.forest.woodland[n.id].health,0);
  saved.day++;refreshForest(saved);assert.equal(saved.forest.woodland[n.id].health,WOODLAND_SPECIES[species].health);
 }
});
test('hunt rejects wrong facing, blockers, insufficient energy and a lethal drop without bag space atomically',()=>{
 const s=forest(),r=combatRuntime();s.forest.boar.position={x:936,y:4478};assert.equal(attack(s,r,'down').hit,false);
 r.now=500;s.energy=0;const before=structuredClone(s);assert.equal(attack(s,r,'up').ok,false);assert.deepEqual(s,before);
 s.energy=50;s.forest.boar.health=1;s.inventory.meat=9998;const full=structuredClone(s);assert.match(attack(s,r,'up').message,/Bag full/);assert.deepEqual(s,full);
 s.inventory.meat=0;s.position={x:724,y:4802};s.forest.boar.position={x:724,y:4770};assert.equal(attack(s,r,'up').hit,false);
});
test('quiet motion lives in saved pure state, keeps collision-safe feet and dead animals still',()=>{
 const s=forest(),n=WOODLAND_WILDLIFE[0],a=s.forest.woodland[n.id];s.position={x:a.position.x+60,y:a.position.y};const r=combatRuntime(),p={...a.position};
 for(let i=0;i<20;i++)stepCombat(s,r,50);
 assert.ok(walkable('forest',a.position.x,a.position.y,8));assert.ok(Math.hypot(a.position.x-p.x,a.position.y-p.y)>0);
 a.health=0;a.defeatedDay=s.day;const stopped={...a.position};stepCombat(s,r,50);assert.deepEqual(a.position,stopped);
});
test('more stones occupy all forty dry habitats; gathering is one-time per day and survives reload',()=>{
 const nodes=forestStones();assert.equal(nodes.length,240);assert.equal(new Set(nodes.map(n=>n.id)).size,240);
 for(const r of REGIONS)assert.equal(nodes.filter(n=>n.region===r.id).length,6);
 for(const n of nodes){assert.ok(walkable('forest',n.x,n.y,20));assert.ok(dryFootprint(MAPS.forest,{x:n.x-20,y:n.y-28,w:40,h:32}));}
 const n=nodes.find(n=>n.region==='entrance'),s=forest();s.selected='hand';s.position={x:n.x,y:n.y};assert.equal(stoneContext(s).id,n.id);assert.equal(contextFor(s).type,'stone');assert.equal(contextFor(s,null,'down',n).type,'stone');assert.equal(collectStone(s,n.id),'+2 Stone');assert.equal(s.energy,99);
 assert.equal(s.inventory.stone,2);assert.match(collectStone(s,n.id),/Already/);let saved=validate(JSON.parse(JSON.stringify(s)));assert.deepEqual(saved.forest.stones,[n.id]);assert.equal(stoneContext(saved),null);
 saved.area='home';saved.area='forest';refreshForest(saved);assert.match(collectStone(saved,n.id),/Already/);
 saved.day++;refreshForest(saved);assert.deepEqual(saved.forest.stones,[]);assert.equal(collectStone(saved,n.id),'+2 Stone');
 saved.position={x:n.x+300,y:n.y};const far=structuredClone(saved);collectStone(saved,'forged');assert.deepEqual(saved,far);
});
test('food heals at full energy, caps both stats and never wastes a full/dead/invalid inventory meal',()=>{
 for(const [id,food]of Object.entries(FOODS)){
  const s=forest();s.inventory[id]=2;s.health=50;s.energy=100;assert.match(eatFood(s,id),/health/);assert.equal(s.health,50+food.healthRestored);assert.equal(s.energy,100);assert.equal(s.inventory[id],1);
  s.health=99;s.energy=99;eatFood(s,id);assert.equal(s.health,100);assert.equal(s.energy,100);assert.equal(s.inventory[id],0);
  s.inventory[id]=1;const full=structuredClone(s);assert.match(eatFood(s,id),/already full/);assert.deepEqual(s,full);
  s.health=0;const dead=structuredClone(s);eatFood(s,id);assert.deepEqual(s,dead);
  s.health=50;s.inventory[id]=-1;const invalid=structuredClone(s);eatFood(s,id);assert.deepEqual(s,invalid);
 }
});
test('schema 1–11 migrates safely; new bounded records reject forged IDs and preserve market salts',()=>{
 for(let version=1;version<=11;version++){
  const raw=newState('girl');raw.version=version;raw.money=123;raw.inventory.wood=6;delete raw.inventory.stone;delete raw.inventory.meat;delete raw.forest.woodland;delete raw.forest.stones;
  const s=validate(raw);assert.equal(s.version,16);assert.equal(s.money,123);assert.equal(s.inventory.wood,6);assert.equal(s.inventory.stone,0);assert.equal(s.inventory.meat,0);assert.equal(Object.keys(s.forest.woodland).length,128);
 }
 const raw=forest(),n=WOODLAND_WILDLIFE[0];raw.inventory.meat=Infinity;raw.inventory.stone=-2;raw.forest.stones=['forged',forestStones()[0].id,forestStones()[0].id];raw.forest.woodland[n.id].position={x:-1000,y:NaN};raw.forest.woodland.forged={health:999};
 const s=validate(raw);assert.equal(s.inventory.meat,0);assert.equal(s.inventory.stone,0);assert.equal(Object.keys(s.forest.woodland).length,128);assert.equal(s.forest.stones.length,1);assert.ok(walkable('forest',s.forest.woodland[n.id].position.x,s.forest.woodland[n.id].position.y));
 const originalSales=['tomato','strawberry','carrot','corn','wildBerry','guava','mango','wildHide','banana','orange','papaya','coconut','dragonFruit','pineapple','chili','eggplant','cucumber','watermelon','pumpkin','grape','blueberry','sweetPotato'];
 assert.deepEqual(SALE_IDS,[...originalSales,'meat','grilledMeat']);for(const id of originalSales)assert.deepEqual(marketPrice(s,id),marketPrice({...s,version:11},id));
});
test('food page two, healing at full energy and axe attack fit desktop/phone/compact canvas controls',()=>{
 for(const [w,h]of [[1280,720],[360,640],[640,360]]){
  const s=forest(),u=recorder(w,h);s.energy=100;s.health=75;s.inventory.meat=1;
  const a={state:s,input:{},save(){},sound(){},scene:{forestView:{energy(){},health(){}},cameras:{main:{worldView:{x:0,y:0},zoom:1}}},ui:u};u.app=a;const b=new BagPanel(a);a.bagPanel=b;b.open('food');b.index=bagItems(s,'food').findIndex(i=>i.id==='meat');b.show();
  assert.equal(u.controls.find(c=>c.id==='bag-action').disabled,false);b.perform();assert.equal(s.health,100);assert.equal(s.inventory.meat,0);
  const hud=new Hud(u);assert.ok(!u.controls.some(c=>c.id==='tool-axe'));assert.equal(u.controls.some(c=>c.id==='attack'),u.touch);assert.equal(hud.healthWidth,hud.energyWidth);
  for(const c of u.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=u.w&&c.y+c.h<=u.h,c.id);
 }
});
