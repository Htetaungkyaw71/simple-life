import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {validate,SaveService} from '../src/systems/save.js';
import {LOCATIONS,EDGE_TRAVEL,edgeTravel,readyEdgeTravel,walkable,nearestSafe} from '../src/data/locations.js';
import {FORAGE_NODES,BOAR_HOME,FOREST_ENTRANCE,FOREST_SIZE,FOREST_MAP} from '../src/data/forest.js';
import {waterAt} from '../src/data/water.js';
import {FOODS,FOOD_IDS} from '../src/data/items.js';
import {MAPS} from '../src/data/mapLayouts.js';
import {collectForage,eatFood,recoverStash,refreshForest,lineClear,inTerritory} from '../src/systems/forest.js';
import {marketPrice,shopOpen} from '../src/systems/market.js';
import {sellCrop} from '../src/systems/economy.js';
import {attack,attackBox,hitInside,combatRuntime,stepCombat,damagePlayer,displace} from '../src/systems/combat.js';
import {defeat,droppedCoins} from '../src/systems/defeat.js';
import {tick,sleep} from '../src/systems/time.js';
const forest=()=>Object.assign(newState(),{area:'forest',position:{x:640,y:5056},forestTutorialComplete:true});

test('forest edges cover the whole north/south road, with safe inward spawns and cooldown',()=>{
 for(const [area,edge]of [['home',EDGE_TRAVEL.homeForest],['forest',EDGE_TRAVEL.forest]]){
  const [x,y,w,h]=edge.zone;
  for(const offset of [16,w/2,w-16]){const s=Object.assign(newState(),{area,position:{x:x+offset,y:y+h/2}});assert.equal(edgeTravel(s),edge);assert.equal(readyEdgeTravel(s,699,700),null);assert.equal(readyEdgeTravel(s,700,700),edge);}
  assert.ok(walkable(edge.to,edge.spawn.x,edge.spawn.y));assert.equal(edgeTravel({area:edge.to,position:edge.spawn}),null);
 }
 const old=newState();old.position={x:720,y:80};assert.equal(edgeTravel(old),null);
});
test('Forest entrance, exit opening and grassy approach share the bottom-centre route',()=>{
 const edge=EDGE_TRAVEL.forest;
 assert.equal(edge.zone[0]+edge.zone[2]/2,FOREST_SIZE.width/2);
 assert.equal(edge.zone[1]+edge.zone[3],FOREST_SIZE.height);
 assert.deepEqual(LOCATIONS.forest.spawn,FOREST_ENTRANCE);
 assert.deepEqual(EDGE_TRAVEL.homeForest.spawn,FOREST_ENTRANCE);
 // Walk the entire gate width and its junction with the eastern crossway.
 for(let y=4720;y<=5104;y+=16)for(let dx=-32;dx<=32;dx+=16){const p={x:FOREST_ENTRANCE.x+dx,y};assert.ok(walkable('forest',p.x,p.y),JSON.stringify(p));assert.equal(waterAt(FOREST_MAP,p),false);}
 for(let x=FOREST_ENTRANCE.x;x<=5584;x+=16)assert.ok(walkable('forest',x,4752),String(x));
 assert.equal(edgeTravel({area:'forest',position:{x:640,y:5104}}),null,'old southwest edge no longer travels');
 const legacy=Object.assign(newState(),{area:'forest',position:{x:640,y:4848},money:317});legacy.inventory.wood=12;legacy.inventory.stone=8;
 const saved=validate(legacy);assert.deepEqual(saved.position,legacy.position);assert.equal(saved.money,317);assert.equal(saved.inventory.wood,12);assert.equal(saved.inventory.stone,8);
});
test('forest solid trees, rocks, log and landmark share collision and safe position repair',()=>{
 for(const [x,y,w,h]of MAPS.forest.obstacles)assert.equal(walkable('forest',x+w/2,y+h/2,0),false);
 for(const p of [LOCATIONS.forest.spawn,BOAR_HOME,...FORAGE_NODES])assert.ok(walkable('forest',p.x,p.y),JSON.stringify(p));
 for(const p of [{x:-400,y:-100},{x:150,y:4596},{x:1100,y:4736}]){const fixed=nearestSafe('forest',p);assert.ok(walkable('forest',fixed.x,fixed.y));}
});
test('each free forage node collects once per day, persists on reload/reentry and refreshes at midnight',()=>{
 const s=forest();for(const node of FORAGE_NODES){s.position={x:node.x,y:node.y+24};assert.match(collectForage(s,node.id),/Collected/);const count=s.inventory[node.item];collectForage(s,node.id);assert.equal(s.inventory[node.item],count);}
 let saved=validate(JSON.parse(JSON.stringify(s)));saved.area='home';saved.area='forest';refreshForest(saved);assert.equal(saved.forest.collected.length,FORAGE_NODES.length);
 saved.minute=1439.9;tick(saved,100);assert.equal(saved.day,2);assert.deepEqual(saved.forest.collected,[]);assert.equal(saved.forest.forageDay,2);
 const node=FORAGE_NODES[0];saved.position={x:node.x,y:node.y+24};assert.match(collectForage(saved,node.id),/Collected/);
 const before=structuredClone(saved);saved.inventory[node.item]=9999;saved.day++;refreshForest(saved);assert.match(collectForage(saved,node.id),/full/);assert.equal(saved.forest.collected.length,0);assert.ok(before.inventory.wildBerry>0);
});
test('eating exactly one forest fruit respects energy values, full energy and invalid inventory',()=>{
 for(const id of FOOD_IDS){const s=forest();s.inventory[id]=2;s.energy=10;eatFood(s,id);assert.equal(s.energy,10+FOODS[id].energyRestored);assert.equal(s.inventory[id],1);s.energy=99;eatFood(s,id);assert.equal(s.energy,100);assert.equal(s.inventory[id],0);s.inventory[id]=1;assert.match(eatFood(s,id),/already full/);assert.equal(s.inventory[id],1);}
 const s=forest(),before=structuredClone(s);eatFood(s,'tomato');assert.deepEqual(s,before);
});
test('forest fruit and hide sales apply stable daily multiplier, keeping crop prices unchanged',()=>{
 const s=forest();s.money=100;for(const id of [...FOOD_IDS,'wildHide']){s.inventory[id]=3;const before=s.money,q=marketPrice(s,id);assert.ok(q.percent>=85&&q.percent<=120);sellCrop(s,id,1);assert.equal(s.money,before+q.price);assert.equal(s.inventory[id],2);assert.deepEqual(marketPrice(validate(s),id),q);}
});
test('retired club refunds an older purchase once without affecting progress',()=>{
 const old={...newState(),version:12,money:15,ownsClub:true,clubEquipped:true};const s=validate(old);assert.equal(s.money,60);assert.ok(!Object.hasOwn(s,'ownsClub'));assert.ok(!Object.hasOwn(s,'clubEquipped'));assert.deepEqual(validate(s),s);
 const capped=validate({...old,money:9999990});assert.equal(capped.money,9999999);
});

test('directional axe only hits in front, spends one energy and enforces 500ms cooldown',()=>{
 const s=forest();s.selected='axe';s.position={x:936,y:4496};
 for(const [dir,front,back]of [['up',{x:936,y:4448},{x:936,y:4550}],['down',{x:936,y:4542},{x:936,y:4442}],['left',{x:886,y:4484},{x:990,y:4484}],['right',{x:986,y:4484},{x:882,y:4484}]]){assert.ok(hitInside(attackBox(s.position,dir),front));assert.equal(hitInside(attackBox(s.position,dir),back),false);}
 const r=combatRuntime();s.forest.boar.position={x:936,y:4448};assert.equal(attack(s,r,'up').hit,true);assert.equal(s.energy,99);assert.equal(s.forest.boar.health,2);const before=structuredClone(s);assert.equal(attack(s,r,'up').ok,false);assert.deepEqual(s,before);r.now=499;assert.equal(attack(s,r,'up').ok,false);r.now=500;assert.equal(attack(s,r,'up').ok,true);s.forest.boar.position={x:936,y:4448};s.energy=0;r.now=1000;assert.match(attack(s,r,'up').message,/Too tired/);assert.equal(s.energy,0);
});
test('boar telegraphs, locks a charge, damages once, recovers and returns to wandering',()=>{
 const s=forest(),r=combatRuntime();s.position={x:936,y:4534};r.grace=0;r.timer=0;
 assert.equal(stepCombat(s,r,50).warning,true);assert.equal(s.health,100);assert.equal(r.mode,'warning');for(let i=0;i<12;i++)stepCombat(s,r,50);assert.equal(r.mode,'warning');assert.equal(s.health,100);stepCombat(s,r,50);assert.equal(r.mode,'charge');
 let hurt=false;for(let i=0;i<15;i++)hurt=stepCombat(s,r,50).hurt||hurt;assert.ok(hurt);assert.equal(s.health,85);assert.equal(r.mode,'recover');s.position={x:640,y:5056};for(let i=0;i<30;i++)stepCombat(s,r,50);assert.equal(r.mode,'wander');
});
test('boar charges cannot tunnel through obstacles or territory; melee cannot hit through solids',()=>{
 const p={x:724,y:4810};assert.equal(lineClear('forest',p,{x:724,y:4770},12),false);displace('forest',p,0,-160);assert.ok(walkable('forest',p.x,p.y));assert.ok(p.y>4770);
 const s=forest(),r=combatRuntime();r.mode='charge';r.timer=650;r.heading={x:1,y:0};s.forest.boar.position={x:1128,y:4486};for(let i=0;i<30;i++)stepCombat(s,r,50);assert.ok(inTerritory(s.forest.boar.position));assert.ok(walkable('forest',s.forest.boar.position.x,s.forest.boar.position.y,16));
 // Solid log directly separates a deliberately close player/animal fixture.
 s.position={x:724,y:4802};s.forest.boar.position={x:724,y:4770};s.selected='axe';r.nextAttack=0;assert.equal(attack(s,r,'up').hit,false);
});
test('damage invulnerability lasts 750ms and zero health cannot be damaged repeatedly',()=>{
 const s=forest(),r=combatRuntime();assert.equal(damagePlayer(s,r),true);assert.equal(s.health,85);r.now=749;assert.equal(damagePlayer(s,r),false);r.now=750;assert.equal(damagePlayer(s,r),true);s.health=10;r.now=1500;damagePlayer(s,r);assert.equal(s.health,0);r.now=3000;assert.equal(damagePlayer(s,r),false);
});
test('three hits defeat the boar with one hide, persist across travel and respawn only next day',()=>{
 const s=forest(),r=combatRuntime();s.selected='axe';
 for(let i=0;i<3;i++){s.position={x:936,y:4526};s.forest.boar.position={x:936,y:4478};r.now=i*500;const result=attack(s,r,'up');assert.equal(result.hit,true);assert.equal(result.defeated,i===2);}
 assert.equal(s.inventory.wildHide,1);s.area='home';s.area='forest';refreshForest(s);assert.equal(s.forest.boar.health,0);assert.equal(validate(s).forest.boar.health,0);r.now=2000;attack(s,r,'up');assert.equal(s.inventory.wildHide,1);s.day=2;refreshForest(s);assert.equal(s.forest.boar.health,3);
});
test('night awareness and movement increase with the same warning and safe entrance',()=>{
 const day=forest(),night=forest();day.position=night.position={x:936,y:4272};night.minute=1200;const a=combatRuntime(),b=combatRuntime();a.grace=b.grace=0;stepCombat(day,a,50);stepCombat(night,b,50);assert.equal(a.mode,'wander');assert.equal(b.mode,'warning');
 const walkingDay=forest(),walkingNight=forest(),dayRuntime=combatRuntime(),nightRuntime=combatRuntime();walkingDay.minute=480;walkingNight.minute=1200;dayRuntime.heading=nightRuntime.heading={x:1,y:0};stepCombat(walkingDay,dayRuntime,50);stepCombat(walkingNight,nightRuntime,50);assert.ok(Math.abs((walkingNight.forest.boar.position.x-BOAR_HOME.x)/(walkingDay.forest.boar.position.x-BOAR_HOME.x)-1.15)<.0001);
 assert.ok(Math.hypot(BOAR_HOME.x-640,BOAR_HOME.y-5056)>500);
});
test('defeat drops floor(25 percent), restores home bed next morning and settles crop growth once',()=>{
 for(const money of [0,1,3,4,99,100,9999999])assert.equal(droppedCoins(money),Math.floor(money/4));
 const s=forest();s.money=99;s.health=0;s.energy=0;s.minute=1430;s.plots[0]={...s.plots[0],crop:'tomato',wateredDay:1,lastEvaluatedDay:0};const dead={...s.position};assert.equal(defeat(s),24);assert.equal(s.money,75);assert.deepEqual(s.stash,{area:'forest',...dead,coins:24});assert.equal(s.day,2);assert.equal(s.minute,360);assert.equal(s.area,'interior');assert.equal(s.health,100);assert.equal(s.energy,100);assert.equal(s.plots[0].growth,1);assert.ok(walkable('interior',s.position.x,s.position.y));
 const early=forest();early.day=4;early.minute=120;defeat(early);assert.equal(early.day,5);assert.equal(early.minute,360);
});
test('stash survives sleep, day rollover, save/reload; recovery is atomic and second defeat replaces it',()=>{
 let s=forest();s.money=100;defeat(s);const bag={...s.stash};sleep(s);assert.deepEqual(s.stash,bag);
 const storage=new Map(),service=new SaveService({setItem:(k,v)=>storage.set(k,v),getItem:k=>storage.get(k)});service.write(s);s=service.load();assert.deepEqual(s.stash,bag);s.area='forest';s.position={x:bag.x,y:bag.y};assert.equal(recoverStash(s),'Recovered 25 coins');assert.equal(s.money,100);recoverStash(s);assert.equal(s.money,100);assert.equal(s.stash,null);
 defeat(s);assert.equal(s.stash.coins,25);s.area='forest';s.position={x:480,y:4800};defeat(s);assert.equal(s.stash.coins,18);assert.equal(s.money,57);assert.equal(s.stash.x,480);
 s.area='forest';s.money=0;defeat(s);assert.equal(s.stash,null);
});
test('schema 1–7 migration preserves existing progress and schema 9 repairs malformed forest fields',()=>{
 for(let version=1;version<=7;version++){const raw=newState('girl');Object.assign(raw,{version,day:8,minute:version<7?960:120,money:432,health:63,energy:44,marketSeed:9831,selectedCrop:'corn',hasVisitedCity:true});raw.inventory.tomato=5;raw.plots[0]={...raw.plots[0],crop:'tomato',growth:2,morning:true};delete raw.forest;delete raw.ownsClub;const s=validate(raw);assert.equal(s.version,16);for(const k of ['character','day','minute','money','health','energy','marketSeed','selectedCrop','hasVisitedCity'])assert.deepEqual(s[k],raw[k]);assert.equal(s.inventory.tomato,5);assert.equal(s.plots[0].growth,3);assert.ok(!Object.hasOwn(s,'ownsClub'));assert.equal(s.stash,null);assert.deepEqual(s.forest.collected,[]);}
 const raw=forest();raw.ownsClub=true;raw.clubEquipped=true;raw.inventory.mango=2;raw.forest.boar.health=1;raw.stash={area:'forest',x:150,y:4596,coins:42};const loaded=validate(raw);assert.equal(loaded.inventory.mango,2);assert.ok(!Object.hasOwn(loaded,'clubEquipped'));assert.equal(loaded.forest.boar.health,1);assert.ok(walkable('forest',loaded.stash.x,loaded.stash.y));raw.stash.coins=-4;assert.equal(validate(raw).stash,null);
});
