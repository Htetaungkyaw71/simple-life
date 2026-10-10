import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {buySeeds,sellCrop,quote,INVENTORY_LIMIT,COIN_LIMIT} from '../src/systems/economy.js';
import {marketPrice,shopOpen} from '../src/systems/market.js';
import {CROPS,CROP_IDS} from '../src/data/crops.js';
import {usePlot} from '../src/systems/farming.js';
import {nextDay} from '../src/systems/time.js';
import {contextFor} from '../src/systems/context.js';
import {edgeTravel,EDGE_TRAVEL,walkable} from '../src/data/locations.js';
import {cityObjective,cityWaypoint} from '../src/systems/navigation.js';
import {inputGate} from '../src/systems/inputGate.js';
import {claimRecoverySeed,recoveryEligible} from '../src/systems/recovery.js';
import {buyField,buyFarm} from '../src/systems/expansion.js';
test('all four crops complete distinct growth loops, harvest correctly and preserve care rules',()=>{
 for(const id of CROP_IDS){const d=CROPS[id],s=newState();s.inventory[d.seedKey]=1;s.selectedCrop=id;usePlot(s,0);assert.equal(s.plots[0].crop,id);assert.equal(s.inventory[d.seedKey],0);s.selected='harvest';usePlot(s,0);assert.equal(s.inventory[id],0);
 for(let night=0;night<d.growthDays;night++){s.minute=360;s.selected='water';usePlot(s,0);s.minute=960;usePlot(s,0);nextDay(s);assert.equal(s.plots[0].growth,night+1);}
 s.selected='harvest';usePlot(s,0);assert.equal(s.inventory[id],d.harvestYield);assert.equal(s.plots[0].crop,null);assert.equal(s.hasHarvestedFirstCrop,true);
 assert.ok(Math.round(d.sellPrice*.85)*d.harvestYield>d.seedPrice);assert.equal(new Set(Object.values(d.sprites)).size,8);}
});
test('buy 1, 5 and maximum spend exact integers; invalid and unaffordable transactions are atomic',()=>{
 for(const id of CROP_IDS){const s=newState();s.money=1000;const d=CROPS[id];buySeeds(s,id,1);buySeeds(s,id,5);assert.equal(s.inventory[d.seedKey],6);assert.equal(s.money,1000-6*d.seedPrice);const q=quote(s,'seed',id,'max');buySeeds(s,id,'max');assert.equal(s.money,1000-(6+q.quantity)*d.seedPrice);assert.ok(s.money<d.seedPrice);const before=structuredClone(s);for(const qty of [1,5,0,-1,1.2,Infinity,NaN,'nonsense'])buySeeds(s,id,qty);assert.deepEqual(s,before);}
 const s=newState();s.inventory.seed=9998;s.money=COIN_LIMIT;buySeeds(s,'tomato','max');assert.equal(s.inventory.seed,INVENTORY_LIMIT);const before=structuredClone(s);buySeeds(s,'__proto__',1);assert.equal(quote(s,'tools','tomato',1).ok,false);assert.deepEqual(s,before);
});
test('sell 1, 5 and all uses today\'s exact prices; no seed sales, overdraw or purse overflow',()=>{
 for(const id of CROP_IDS){const s=newState();s.inventory[id]=8;const unit=marketPrice(s,id).price;s.inventory[CROPS[id].seedKey]=9;sellCrop(s,id,1);sellCrop(s,id,5);assert.equal(s.inventory[id],2);sellCrop(s,id,'all');assert.equal(s.money,60+unit*8);assert.equal(s.sold,8);assert.equal(s.inventory[CROPS[id].seedKey],9);assert.equal(s.hasSoldProduce,true);const before=structuredClone(s);sellCrop(s,id,1);sellCrop(s,'seed',1);sellCrop(s,'water',1);assert.deepEqual(s,before);}
 const s=newState();s.money=COIN_LIMIT;s.inventory.tomato=20;const before=structuredClone(s);sellCrop(s,'tomato','all');assert.deepEqual(s,before);
});
test('deterministic daily prices stay within 85–120 percent and survive reload for a whole season',()=>{
 const seen=new Set();for(let day=1;day<=100;day++){const s=newState('girl',3597241);s.day=day;for(const id of CROP_IDS){const q=marketPrice(s,id);assert.ok(q.percent>=85&&q.percent<=120);assert.equal(q.price,Math.round(CROPS[id].sellPrice*q.percent/100));assert.deepEqual(marketPrice(validate(JSON.parse(JSON.stringify(s))),id),q);assert.equal(q.label,q.percent<95?'Low':q.percent>105?'High':'Normal');seen.add(q.percent);}}
 assert.ok(seen.size>30);assert.notDeepEqual(marketPrice(newState('boy',1),'tomato'),marketPrice(newState('boy',999),'tomato'));
});
test('shop boundary hours and context block closed counters while outdoor time continues',()=>{
 const s=newState();s.area='city';s.position={x:432,y:306};for(const minute of [360,419,1200,1439]){s.minute=minute;assert.equal(shopOpen(s,'seed'),false);assert.equal(contextFor(s).type,'hint');assert.match(contextFor(s).label,/Closed.*07:00-20:00/);}
 for(const minute of [420,1199]){s.minute=minute;assert.equal(contextFor(s).type,'seed');}s.position={x:896,y:306};s.minute=1199;assert.equal(contextFor(s).type,'sell');s.minute=1200;assert.equal(contextFor(s).type,'hint');
});
test('Home and City gates sit on actual edges with safe inward spawns; objective completes once',()=>{
 const s=newState();s.hasHarvestedFirstCrop=true;assert.ok(cityObjective(s));assert.ok(cityWaypoint(s,{x:0,y:0,width:1280,height:720}));s.position={x:2220,y:640};assert.equal(edgeTravel(s).to,'city');assert.equal(cityWaypoint(s,{x:1800,y:400,width:500,height:400}),null);
 for(const e of Object.values(EDGE_TRAVEL)){assert.ok(walkable(e.to,e.spawn.x,e.spawn.y));assert.equal(edgeTravel({area:e.to,position:e.spawn}),null);}s.area='city';s.position={x:20,y:488};assert.equal(edgeTravel(s).to,'home');s.hasVisitedCity=true;assert.equal(cityObjective(s),false);
});
test('schemas 1–5 preserve starter, coins, tomato crops and paid farm ownership in schema 9',()=>{
 for(let version=1;version<=5;version++){const old=newState('girl');old.version=version;old.money=10000;old.inventory.seed=2;old.inventory.tomato=7;old.plots[0]={...old.plots[0],crop:'tomato',growth:2,morning:true};old.starterSeedsClaimed=true;if(version===5){for(const i of [1,2,3])buyField(old,i);buyFarm(old);}delete old.marketSeed;delete old.selectedCrop;const s=validate(old);assert.equal(s.version,17);assert.equal(s.inventory.seed,2);assert.equal(s.inventory.tomato,7);assert.equal(s.inventory.cornSeed,0);assert.equal(s.money,old.money);assert.equal(s.plots[0].growth,3);assert.equal(s.starterSeedsClaimed,true);assert.equal(s.marketSeed,1);assert.equal(s.selectedCrop,'tomato');assert.equal(s.hasHarvestedFirstCrop,true);assert.equal(s.farms.length,version===5?2:1);}
});
test('transaction gate rejects rapid or invalid repetitions without blocking the next deliberate purchase',()=>{
 const gate=inputGate();assert.equal(gate.accept(1000),true);for(const t of [1000,1001,1100,1239,NaN])assert.equal(gate.accept(t),false);assert.equal(gate.accept(1240),true);
});
test('seed aid prevents irreversible bankruptcy and cannot duplicate or bypass inventory/crops',()=>{
 const s=newState();s.money=0;assert.ok(recoveryEligible(s));claimRecoverySeed(s);assert.equal(s.inventory.seed,1);claimRecoverySeed(s);assert.equal(s.inventory.seed,1);s.inventory.seed=0;assert.equal(recoveryEligible(s),false);nextDay(s);assert.ok(recoveryEligible(s));s.plots[0].crop='tomato';assert.equal(recoveryEligible(s),false);s.plots[0].missedDays=4;assert.ok(recoveryEligible(s));s.inventory.corn=1;assert.equal(recoveryEligible(s),false);s.inventory.corn=0;s.money=10;assert.equal(recoveryEligible(s),false);assert.equal(validate(s).lastRecoveryDay,1);
});

test('crop info and visual states use each crop duration without mutating gameplay',async()=>{
 const {cropStatus}=await import('../src/systems/cropStatus.js'),{cropVisual}=await import('../src/systems/watering.js');
 for(const id of CROP_IDS){const d=CROPS[id],s=newState();s.plots[0]={...s.plots[0],crop:id};const saved=structuredClone(s);const first=cropStatus(s,0);assert.equal(first.name,d.name);assert.equal(first.remaining,d.growthDays);assert.equal(first.stages,d.growthDays+1);assert.equal(first.icon,d.icon);assert.deepEqual(s,saved);
 s.plots[0].growth=d.growthDays;assert.equal(cropStatus(s,0).timer,'Ready to harvest');assert.equal(cropVisual(s.plots[0],s),'ripe');s.plots[0].growth=0;s.plots[0].missedDays=3;assert.equal(cropStatus(s,0).paused,true);assert.equal(cropVisual(s.plots[0],s),'wilted');s.plots[0].missedDays=4;assert.equal(cropStatus(s,0).dead,true);assert.equal(cropVisual(s.plots[0],s),'dead');}
});

test('empty market messages distinguish a missing crop from an entirely empty produce bag',()=>{
 const s=newState();assert.equal(quote(s,'sell','tomato','all').reason,'You have no produce to sell.');assert.equal(quote(s,'sell','tomato',1).reason,'You have no produce to sell.');s.inventory.carrot=2;assert.equal(quote(s,'sell','tomato','all').reason,'No Tomato to sell.');assert.equal(quote(s,'sell','carrot','all').ok,true);s.inventory.carrot=0;s.inventory.carrotSeed=9;assert.equal(quote(s,'sell','tomato','all').reason,'You have no produce to sell.');
});
