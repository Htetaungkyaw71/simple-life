import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {CURSED_CAVE,CURSE_GHOST} from '../src/data/cursedCave.js';
import {nearCave,breakSeal,contribute,stepCurse} from '../src/systems/curse.js';
import {combatRuntime,attack,stepCombat} from '../src/systems/combat.js';
import {contextFor} from '../src/systems/context.js';
import {walkable} from '../src/data/locations.js';
import {FOREST_MAP} from '../src/data/forest.js';
import {defeat} from '../src/systems/defeat.js';
import {recoverStash} from '../src/systems/forest.js';
const cave=()=>Object.assign(newState(),{area:'forest',position:{...CURSED_CAVE.approach},selected:'axe'});
const broken=()=>{const s=cave();breakSeal(s,true);s.area='farm';s.position={x:896,y:600};s.minute=1140;return s;};
const step=(s,r,n=1)=>{let e;for(let i=0;i<n;i++){stepCombat(s,r,50);e=stepCurse(s,r,50);}return e;};
test('the skull caves are absent and the new seal is solid with a reachable entrance',()=>{
 assert.equal(FOREST_MAP.props.some(p=>p.name==='rocky-cave'),false);const s=cave();assert.ok(nearCave(s));assert.ok(walkable('forest',s.position.x,s.position.y,12,false,s));assert.equal(walkable('forest',CURSED_CAVE.x,CURSED_CAVE.y-60,12,false,s),false);assert.equal(contextFor(s).type,'cursedCave');
});
test('walking, inspecting, attacking and unconfirmed or distant choices never release the curse',()=>{
 const s=cave(),r=combatRuntime(),before=structuredClone(s.curse);attack(s,r,'up');assert.deepEqual(s.curse,before);assert.equal(breakSeal(s).ok,false);s.position.x-=200;assert.equal(breakSeal(s,true).ok,false);s.minute=1140;step(s,r,120);assert.deepEqual(s.curse,before);
});
test('explicit seal break grants a bounded cache once; no repeated rewards',()=>{
 const s=cave();s.money=9999998;assert.equal(breakSeal(s,true).coins,1);assert.equal(s.money,9999999);assert.equal(breakSeal(s,true).ok,false);assert.equal(s.curse.brokenDay,1);
});
test('7 pm starts at most three reachable ghosts, midnight preserves the night and 6 am clears it',()=>{
 const s=broken(),r=combatRuntime();s.minute=1139;step(s,r);assert.ok(s.curse.ghosts.every(g=>g.position===null));s.minute=1140;assert.equal(step(s,r).beganNight,true);assert.equal(s.curse.ghosts.length,3);for(const g of s.curse.ghosts){assert.ok(walkable(s.area,g.position.x,g.position.y,12,false,s));assert.ok(Math.hypot(g.position.x-s.position.x,g.position.y-s.position.y)>130);}
 const g=s.curse.ghosts[0];g.health=0;g.respawn=5000;s.day++;s.minute=0;step(s,r);assert.equal(s.curse.ghosts[0].respawn,4950);s.minute=359;assert.notEqual(s.curse.nightKey,null);s.minute=360;assert.equal(step(s,r).dawn,true);assert.ok(s.curse.ghosts.every(g=>!g.position));s.minute=1140;assert.equal(step(s,r).beganNight,true);
});
test('native Axe hits, no ghost loot, saved five-second respawn, and combat takes priority near the seal',()=>{
 const s=broken(),r=combatRuntime();step(s,r);const g=s.curse.ghosts[0];g.position={x:s.position.x+28,y:s.position.y};g.arrival=0;const before={...s.inventory},energy=s.energy;
 for(let i=0;i<3;i++){r.now=r.nextAttack;const hit=attack(s,r,'right',g.id);assert.equal(hit.ghost,true);assert.equal(hit.defeated,i===2);}assert.deepEqual(s.inventory,before);assert.ok(s.energy<energy);assert.equal(g.respawn,5000);
 const loaded=validate(JSON.parse(JSON.stringify(s)));assert.equal(loaded.curse.ghosts[0].respawn,5000);step(loaded,r,99);assert.equal(loaded.curse.ghosts[0].health,0);assert.equal(loaded.curse.ghosts[0].respawn,50);step(loaded,r);assert.equal(loaded.curse.ghosts[0].health,3);assert.equal(loaded.curse.ghosts[0].respawn,0);assert.ok(loaded.curse.ghosts[0].arrival>0);
 s.area='forest';s.position={...CURSED_CAVE.approach};g.health=3;g.respawn=g.arrival=0;g.area='forest';g.position={x:s.position.x+24,y:s.position.y};assert.equal(contextFor(s,null,'right').type,'hunt');
});
test('telegraphed attacks share invulnerability and cannot damage the safe interior',()=>{
 const s=broken(),r=combatRuntime();step(s,r);for(const g of s.curse.ghosts){g.position={x:s.position.x+30,y:s.position.y};g.arrival=0;g.windup=50;}
 const e=step(s,r);assert.equal(e.damage,CURSE_GHOST.damage);assert.equal(s.health,88,'three simultaneous hits cause only one damage event');s.area='interior';const health=s.health;step(s,r,180);assert.equal(s.health,health);assert.ok(s.curse.ghosts.every(g=>g.position===null));
});
test('repairs accept partial resources once, survive reload and permanently record Curse Breaker',()=>{
 let s=cave();breakSeal(s,true);s.money=100;s.inventory.wood=12;s.inventory.stone=8;s.inventory.meat=3;for(const key of Object.keys(CURSED_CAVE.cost))assert.equal(contribute(s,key).ok,true);assert.equal(s.money,0);assert.equal(s.inventory.meat,0);assert.equal(contribute(s,'meat').ok,false);s=validate(JSON.parse(JSON.stringify(s)));assert.deepEqual(s.curse.paid,{money:100,wood:12,stone:8,meat:3});
 s.money=900;Object.assign(s.inventory,{wood:100,stone:100,meat:100});for(const key of Object.keys(CURSED_CAVE.cost)){const r=contribute(s,key);assert.equal(r.ok,true);}assert.equal(s.curse.stage,'restored');assert.equal(s.money,400);assert.equal(s.inventory.meat,83);const before=structuredClone(s);assert.equal(contribute(s,'meat').ok,false);assert.equal(breakSeal(s,true).ok,false);assert.deepEqual(s,before);
 s=validate(JSON.parse(JSON.stringify(s)));assert.equal(s.curse.stage,'restored');s.minute=1140;step(s,combatRuntime(),400);assert.ok(s.curse.ghosts.every(g=>!g.position));
});
test('legacy saves are harmless; malformed curse state and timers remain bounded',()=>{
 const old=newState();delete old.curse;assert.equal(validate(old).curse.stage,'sealed');const s=cave();s.curse={stage:'restored',paid:{money:-1,wood:Infinity,stone:1e20,meat:20},ghosts:[{id:'curse-ghost-0',health:0,respawn:1e20,area:'interior',position:{x:1,y:1}}]};const c=validate(s).curse;assert.equal(c.stage,'broken');assert.deepEqual(c.paid,{money:0,wood:0,stone:32,meat:20});assert.equal(c.ghosts.length,3);assert.equal(c.ghosts[0].respawn,5000);assert.equal(c.ghosts[0].position,null);
});
test('night defeats retain 25 percent recoverable coin bags in every outdoor area and their farm domain',()=>{
 for(const area of ['home','farm','city','forest']){let s=newState();s.area=area;s.position=area==='forest'?{...CURSED_CAVE.approach}:{x:896,y:600};s.money=1000;if(area==='farm'){s.farms.push(structuredClone(s.farms[0]));s.currentFarm=1;}const coins=defeat(s);assert.equal(coins,250);s=validate(JSON.parse(JSON.stringify(s)));assert.equal(s.stash.area,area);assert.equal(s.stash.coins,250);s.area=area;s.position={x:s.stash.x,y:s.stash.y};if(area==='farm'){s.currentFarm=0;assert.equal(recoverStash(s),'Walk closer to your Stash Bag.');s.currentFarm=1;}assert.match(recoverStash(s),/Recovered 250/);assert.equal(s.money,1000);assert.equal(s.stash,null);}
});
