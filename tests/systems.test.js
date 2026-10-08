import {marketPrice} from '../src/systems/market.js';
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
 s.selected='harvest';usePlot(s,0);assert.equal(s.inventory.tomato,2);sellProduce(s);assert.equal(s.money,50+2*marketPrice(s,'tomato').price);assert.equal(s.sold,2);
 const memory=new Map();const saves=new SaveService({getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)});assert.ok(saves.write(s));assert.deepEqual(saves.load(),s);
});
test('missing water delays growth; dry crops die and can be cleared without energy',()=>{const s=newState();buySeed(s);usePlot(s,0);s.selected='water';usePlot(s,0);nextDay(s);assert.equal(s.plots[0].growth,0);assert.equal(s.plots[0].missedWindows,1);nextDay(s);assert.equal(s.plots[0].missedWindows,2);s.energy=0;usePlot(s,0);assert.equal(s.plots[0].crop,null);});
test('no purchase, duplicate planting, early harvest or zero-energy exploits',()=>{const s=newState();s.money=0;buySeed(s);assert.equal(s.inventory.seed,0);s.money=60;buySeed(s);s.energy=0;usePlot(s,0);assert.equal(s.inventory.seed,1);s.energy=100;usePlot(s,0);buySeed(s);usePlot(s,0);assert.equal(s.inventory.seed,1);s.selected='harvest';usePlot(s,0);assert.equal(s.inventory.tomato,0);sellProduce(s);assert.equal(s.money,40);});
test('hostile/malformed saves cannot create invalid movement, counts or plots',()=>{assert.equal(validate({version:99}),null);const s=newState();Object.assign(s,{money:-100,energy:Infinity,area:'__proto__',position:{x:NaN,y:20},selected:'weapon',plots:[{crop:'tomato',growth:999,dryDays:-1,morning:'yes'}]});s.inventory.seed=-2;const v=validate(s);assert.equal(v.money,0);assert.equal(v.energy,100);assert.equal(v.area,'home');assert.ok(walkable(v.area,v.position.x,v.position.y));assert.equal(v.inventory.seed,0);assert.equal(v.plots.length,64);assert.equal(v.plots[0].growth,3);assert.equal(v.plots[0].morning,false);});
test('corrupt JSON and denied storage recover safely',()=>{const save=new SaveService({getItem:()=>'{',setItem:()=>{throw Error('quota');}});assert.equal(save.load(),null);assert.ok(save.error);assert.equal(save.write(newState()),false);});
test('all spawns are safe and obstacles block movement',()=>{for(const [key,v]of Object.entries(LOCATIONS))assert.ok(walkable(key,v.spawn.x,v.spawn.y));assert.equal(walkable('interior',60,110),false);assert.equal(walkable('farm',0,0),false);});
test('midnight advances naturally without sleep, teleport or free energy',()=>{
 const s=newState();s.area='farm';s.position={x:376,y:248};s.energy=17;s.minute=1438.9;s.plots[0]={...s.plots[0],crop:'tomato',morning:true,evening:true};
 const pos={...s.position};for(let i=0;i<100;i++)tick(s,60000);
 assert.ok(s.minute>0&&s.minute<60);assert.equal(s.day,2);assert.equal(s.area,'farm');assert.deepEqual(s.position,pos);assert.equal(s.energy,17);assert.equal(s.plots[0].growth,1);
 const loaded=validate(s);assert.ok(loaded.minute<60);tick(loaded,100);assert.equal(loaded.day,2);assert.equal(loaded.plots[0].growth,1);
 nextDay(loaded);assert.equal(loaded.day,3);assert.equal(loaded.area,'interior');assert.equal(loaded.minute,360);assert.equal(loaded.energy,100);assert.equal(loaded.plots[0].growth,1);
 const fresh=newState();tick(fresh,60000);assert.ok(fresh.minute<361);
});
