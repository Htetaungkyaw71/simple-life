import test from 'node:test';
import {copperCanPixels} from '../src/entities/HeldWateringCan.js';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newState} from '../src/systems/state.js';
import {validate,SaveService} from '../src/systems/save.js';
import {testingCredit,testingCreditEnabled} from '../src/systems/testingCredit.js';
import {DAY_SECONDS} from '../src/config.js';
import {tick,simulationActive,nextDay} from '../src/systems/time.js';
import {CROPS} from '../src/data/crops.js';
import {FOODS} from '../src/data/items.js';
import {marketPrice} from '../src/systems/market.js';
import {COPPER_CAN,buyCopperCan,copperQuote,wateringPreview,waterWithCan} from '../src/systems/wateringCan.js';
import {visiblePlots,buyFarm} from '../src/systems/expansion.js';
import {FARM_PLOTS} from '../src/data/farms.js';
import {foodRestore,eatFood,recoverStash} from '../src/systems/forest.js';
import {defeat,droppedCoins} from '../src/systems/defeat.js';
import {CHAPTERS,STORY_FLAGS,STORY_GUARD} from '../src/data/story.js';
import {recordStory,storyObjective,storyMarker,completeStory} from '../src/systems/story.js';
import {attack,combatRuntime} from '../src/systems/combat.js';
import {digGround} from '../src/systems/farmGround.js';
const planted=()=>{const s=newState();s.area='farm';s.selected='water';s.ownsCopperCan=true;s.position={x:FARM_PLOTS[0].x-20,y:FARM_PLOTS[0].y};for(let i=0;i<3;i++)s.plots[i]={crop:'tomato',growth:0,wateredDay:0,missedDays:0,lastEvaluatedDay:0};return s;};
test('normal economy is gift-proof through direct API, queries, developer mode and save reload',()=>{
 const s=newState(),store=new Map(),save=new SaveService({getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)});save.write(s);
 for(const url of ['http://localhost/?testingCoins=100000','https://simple-life-playtest.vercel.app/?testingCoins=100000'])for(const dev of [false,true])assert.equal(testingCreditEnabled(url,dev,false),false);
 assert.deepEqual(testingCredit(s),{state:s,added:0});assert.equal(save.grantTestingCoins(),null);assert.equal(save.load().money,60);
 const gifted=testingCredit(s,true);assert.equal(gifted.added,100000);assert.equal(testingCredit(validate(gifted.state),true).added,0);assert.equal(validate(gifted.state).money,100060,'existing test saves preserve balances');
 assert.match(JSON.parse(readFileSync('package.json')).scripts.build,/VITE_PLAYTEST=false/);
});
test('clock spans 450 active seconds from 06:00 to midnight without drift across frame sizes',()=>{
 assert.equal(DAY_SECONDS,450);for(const ms of [20,50,100]){const s=newState();for(let i=0;i<450000/ms;i++)tick(s,ms);assert.ok(s.day===2||s.minute>1439.999999);assert.ok(Math.abs((s.day-1)*1440+s.minute-1440)<.000001);}
 for(const flag of ['paused','transitioning','hidden'])assert.equal(simulationActive({[flag]:true}),false);assert.equal(simulationActive({hitStop:55}),false);assert.equal(simulationActive({}),true);
});
test('all twelve crops have profitable low markets and tradeoffs rather than dominance',()=>{
 const all=Object.values(CROPS),profit=c=>(c.sellPrice*c.harvestYield-c.seedPrice)/c.growthDays;
 for(const c of all){assert.ok(Math.round(c.sellPrice*.75)*c.harvestYield>c.seedPrice,c.id);assert.equal(FOODS[c.id].energyRestored,c.energyRestored);assert.ok(c.trait);for(const b of all){if(c===b)continue;assert.ok(!(c.growthDays<=b.growthDays&&profit(c)>=profit(b)&&c.harvestYield>=b.harvestYield&&c.energyRestored>=b.energyRestored),c.id+' dominates '+b.id);}}
 const s=newState('girl',39),range=new Set();for(let day=1;day<=100;day++){s.day=day;range.add(marketPrice(s,'tomato').percent);assert.deepEqual(marketPrice(validate(s),'tomato'),marketPrice(s,'tomato'));}assert.ok(Math.min(...range)<=78&&Math.max(...range)>=127);
});
test('old ripe cucumber and sweet potato stay ripe; earned growing care and completed stories survive migration',()=>{
 const raw=newState();delete raw.balanceRevision;delete raw.ownsCopperCan;raw.plots[0]={crop:'cucumber',growth:3,wateredDay:0};raw.plots[1]={crop:'sweetPotato',growth:2,wateredDay:0};const s=validate(raw);assert.equal(s.plots[0].growth,4);assert.equal(s.plots[1].growth,2);assert.equal(s.ownsCopperCan,false);assert.deepEqual(validate(s),s);
 raw.story={...raw.story,flags:STORY_FLAGS.filter(f=>f!=='board'),completed:true,keepsake:'placed',intro:'seen'};assert.equal(validate(raw).story.completed,true);
});
test('Copper purchase requires Commons and exact coins/materials, persists, rejects duplicate and gates expansion',()=>{
 const s=newState();s.area='farm';s.money=1000;s.inventory.wood=6;s.inventory.stone=4;assert.equal(copperQuote(s).ok,false);assert.match(buyFarm(s),/Copper/);s.settlement.projects=['commons'];const before=s.money;buyCopperCan(s);assert.equal(s.money,before-COPPER_CAN.coins);assert.equal(s.inventory.wood,0);assert.equal(s.inventory.stone,0);assert.equal(validate(s).ownsCopperCan,true);const copy=structuredClone(s);buyCopperCan(s);assert.deepEqual(s,copy);buyFarm(s);assert.equal(s.farms.length,2);
});
test('Copper preview and water action agree on three fixed plots, costing two energy once',()=>{
 const s=planted(),preview=wateringPreview(s,FARM_PLOTS[0],'right');assert.deepEqual(preview.map(t=>t.index),[0,1,2]);assert.ok(preview.every(t=>t.eligible));const result=waterWithCan(s,FARM_PLOTS[0],'right');assert.deepEqual(result.tiles.map(t=>t.index),preview.map(t=>t.index));assert.equal(s.energy,98);assert.equal(s.wetGround.length,3);assert.ok(s.plots.slice(0,3).every(p=>p.wateredDay===1));const copy=structuredClone(s);assert.equal(waterWithCan(s,FARM_PLOTS[0],'right').ok,false);assert.deepEqual(s,copy);
});
test('Copper rays stop at missing plots, obstacles and wrong farm; failed or tired use is atomic',()=>{
 const s=planted();s.energy=1;const copy=structuredClone(s);assert.equal(waterWithCan(s,FARM_PLOTS[0],'right').ok,false);assert.deepEqual(s,copy);
 assert.equal(wateringPreview(s,FARM_PLOTS[0],'left').length,1);assert.deepEqual(wateringPreview({...s,area:'city'},FARM_PLOTS[0],'right'),[]);assert.deepEqual(wateringPreview(s,{x:0,y:0},'right'),[]);
 s.settlement.decorations=[{type:'fence',farm:0,x:FARM_PLOTS[1].x,y:FARM_PLOTS[1].y+8}];assert.equal(wateringPreview(s,FARM_PLOTS[0],'right').length,1);
});
test('Copper waters custom beds on the shared lattice and preserves ownership through old-save reload',()=>{
 const s=planted();s.customBeds=[{farm:0,x:568,y:248,plot:{crop:'tomato',growth:0,wateredDay:0,missedDays:0,lastEvaluatedDay:0}}];s.position={x:520,y:248};const first=visiblePlots(s).find(t=>t.x===520&&t.y===248);assert.deepEqual(wateringPreview(s,first,'right').map(t=>t.x),[520,568]);assert.equal(waterWithCan(s,first,'right').ok,true);assert.equal(s.customBeds[0].plot.wateredDay,1);assert.equal(validate(s).customBeds[0].plot.wateredDay,1);
});
test('food preview is exact, eating cooldown uses active time and cannot turn paused Bag into infinite healing',()=>{
 const s=newState();s.energy=99;s.health=98;s.inventory.mango=2;assert.deepEqual(foodRestore(s,'mango'),{health:2,energy:1});eatFood(s,'mango');s.energy=90;const copy=structuredClone(s);assert.match(eatFood(s,'mango'),/seconds/);assert.deepEqual(s,copy);s.energy=20;for(let i=0;i<120;i++)tick(s,100);assert.equal(s.foodCooldown,0);eatFood(s,'mango');assert.equal(s.inventory.mango,0);assert.ok(FOODS.mango.healthRestored<=5);
});
test('Journal guides errands during growth; map hides destination until the chapter and never uses raw coordinates',()=>{
 const s=newState();for(const flag of ['starter','plant','water'])recordStory(s,flag);assert.match(storyObjective(s).step,/City/);assert.equal(storyMarker(s),null);
 for(const [id]of CHAPTERS.slice(0,3).flatMap(c=>c.steps))recordStory(s,id);assert.equal(storyMarker(s).id,'snake-cache');s.story.keepsake='carried';assert.equal(storyMarker(s),null);assert.ok(!CHAPTERS.flatMap(c=>c.steps).some(s=>/\d{3,}\s*\//.test(s[2])));
});
test('landed attacks cannot repeatedly cancel boar warning or charge',()=>{
 const s=newState();s.area='forest';s.selected='axe';const b=s.forest.animals['boar-original'];s.position={x:b.position.x,y:b.position.y+40};const r=combatRuntime();r.mode='warning';r.timer=850;const hit=attack(s,r,'up','boar-original');assert.equal(hit.hit,true);assert.equal(r.mode,'warning');assert.equal(r.timer,850);r.now=500;r.mode='recover';r.timer=100;b.position={x:s.position.x,y:s.position.y-40};assert.equal(attack(s,r,'up','boar-original').hit,true);assert.equal(r.timer,100,'repeated hits cannot extend recovery indefinitely');
});
test('25% Stash loss, replacement, reload, recovery and protected inventory never duplicate or go negative',()=>{
 for(const money of [0,1,3,4,99,100,9999999]){let s=newState();s.area='forest';s.position={x:5120,y:4848};s.money=money;s.inventory.tomato=7;s.story.keepsake='carried';const loss=defeat(s);assert.equal(loss,droppedCoins(money));assert.equal(s.money,money-loss);s=validate(s);assert.equal(s.inventory.tomato,7);assert.equal(s.story.keepsake,'carried');if(s.stash){s.area='forest';s.position={x:s.stash.x,y:s.stash.y};recoverStash(s);const restored=s.money;recoverStash(s);assert.equal(s.money,restored);assert.equal(restored,money);}assert.ok(s.money>=0);}
 const s=newState();s.area='forest';s.position={x:5120,y:4848};s.money=100;defeat(s);s.area='forest';s.position={x:5120,y:4848};defeat(s);assert.equal(s.stash.coins,18);assert.equal(s.money,57);assert.equal(validate(s).stash.coins,18);
});

test('Copper does not charge extra energy for a single edge crop',()=>{const s=planted();s.energy=1;const result=waterWithCan(s,FARM_PLOTS[0],'left');assert.equal(result.ok,true);assert.equal(result.tiles.length,1);assert.equal(s.energy,0);assert.equal(s.plots[0].wateredDay,1);assert.equal(s.plots[1].wateredDay,0);});

test('Copper pixels preserve transparency and dark outlines with a warm body in both renderers',()=>{const original=new Uint8ClampedArray([240,240,240,0,30,40,35,255,150,160,170,255,230,240,250,128]),before=new Uint8ClampedArray(original),out=copperCanPixels(original);assert.deepEqual(original,before);for(let i=3;i<out.length;i+=4)assert.equal(out[i],original[i]);assert.deepEqual(out.slice(0,8),original.slice(0,8));for(const i of [8,12])assert.ok(out[i]>out[i+1]&&out[i+1]>out[i+2]);});
