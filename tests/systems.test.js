import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newState } from '../src/systems/state.js';
import { usePlot } from '../src/systems/farming.js';
import { buySeed, sellProduce } from '../src/systems/economy.js';
import { nextDay, tick } from '../src/systems/time.js';
import { validate, SaveService } from '../src/systems/save.js';
import { walkable, LOCATIONS } from '../src/data/locations.js';
test('complete three-day farming economy and persistence loop',()=>{
 const s=newState('girl');buySeed(s);assert.equal(s.money,50);usePlot(s,0);s.selected='water';
 for(let day=0;day<3;day++){usePlot(s,0);const energy=s.energy;usePlot(s,0);assert.equal(s.energy,energy);s.minute=960;usePlot(s,0);nextDay(s);assert.equal(s.plots[0].growth,day+1);assert.equal(s.energy,100);}
 s.selected='harvest';usePlot(s,0);assert.equal(s.inventory.tomato,2);sellProduce(s);assert.equal(s.money,86);assert.equal(s.sold,2);
 const memory=new Map();const saves=new SaveService({getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)});assert.ok(saves.write(s));assert.deepEqual(saves.load(),s);
});
test('missing water delays growth; dry crops die and can be cleared without energy',()=>{const s=newState();buySeed(s);usePlot(s,0);s.selected='water';usePlot(s,0);nextDay(s);assert.equal(s.plots[0].growth,0);nextDay(s);assert.equal(s.plots[0].dryDays,1);nextDay(s);assert.equal(s.plots[0].dryDays,2);s.energy=0;usePlot(s,0);assert.equal(s.plots[0].crop,null);});
test('no purchase, duplicate planting, early harvest or zero-energy exploits',()=>{const s=newState();s.money=0;buySeed(s);assert.equal(s.inventory.seed,0);s.money=60;buySeed(s);s.energy=0;usePlot(s,0);assert.equal(s.inventory.seed,1);s.energy=100;usePlot(s,0);buySeed(s);usePlot(s,0);assert.equal(s.inventory.seed,1);s.selected='harvest';usePlot(s,0);assert.equal(s.inventory.tomato,0);sellProduce(s);assert.equal(s.money,40);});
test('hostile/malformed saves cannot create invalid movement, counts or plots',()=>{assert.equal(validate({version:99}),null);const s=newState();Object.assign(s,{money:-100,energy:Infinity,area:'__proto__',position:{x:NaN,y:20},selected:'weapon',plots:[{crop:'tomato',growth:999,dryDays:-1,morning:'yes'}]});s.inventory.seed=-2;const v=validate(s);assert.equal(v.money,0);assert.equal(v.energy,100);assert.equal(v.area,'home');assert.ok(walkable(v.area,v.position.x,v.position.y));assert.equal(v.inventory.seed,0);assert.equal(v.plots.length,16);assert.equal(v.plots[0].growth,3);assert.equal(v.plots[0].morning,false);});
test('corrupt JSON and denied storage recover safely',()=>{const save=new SaveService({getItem:()=>'{',setItem:()=>{throw Error('quota');}});assert.equal(save.load(),null);assert.ok(save.error);assert.equal(save.write(newState()),false);});
test('all spawns are safe and obstacles block movement',()=>{for(const [key,v]of Object.entries(LOCATIONS))assert.ok(walkable(key,v.spawn.x,v.spawn.y));assert.equal(walkable('interior',260,200),false);assert.equal(walkable('farm',0,0),false);});
test('midnight returns home with growth, while large frame deltas are capped',()=>{const s=newState();s.minute=1439.9;assert.equal(tick(s,100),true);assert.equal(s.day,2);assert.equal(s.area,'interior');assert.equal(s.minute,360);tick(s,60000);assert.ok(s.minute<361);});
