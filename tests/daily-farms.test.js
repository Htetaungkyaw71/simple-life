import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyPlot} from '../src/systems/state.js';
import {plantingState as newState} from './helpers/plantingState.js';
import {usePlot,growOvernight} from '../src/systems/farming.js';
import {nextDay} from '../src/systems/time.js';
import {buyFarm,visitFarm,canExpandFarm} from '../src/systems/expansion.js';
import {validate} from '../src/systems/save.js';
import {cropStatus} from '../src/systems/cropStatus.js';
import {recoveryEligible} from '../src/systems/recovery.js';
import {RESIDENTS,MERCHANT_RESIDENTS} from '../src/data/residents.js';
import {residentsFor,stepResident,residentContext} from '../src/systems/residents.js';
import {MAX_FARMS,SAVE_FARM_LIMIT} from '../src/data/farms.js';
import {FarmOffice} from '../src/ui/FarmOffice.js';
const advanceMinutes=(s,minutes)=>{for(let i=0;i<minutes/1440;i++)nextDay(s);};
const growing=()=>{const s=newState();s.inventory.cornSeed=1;s.selectedCrop='corn';usePlot(s,0);s.selected='water';return s;};
test('one daily watering survives reload and earns growth exactly once at midnight',()=>{
 let s=growing();s.minute=800;usePlot(s,0);const e=s.energy;s=validate(s);s.minute=1439;assert.match(usePlot(s,0),/Already watered today/);assert.equal(s.energy,e);
 growOvernight(s);assert.equal(s.plots[0].growth,1);growOvernight(s);assert.equal(s.plots[0].growth,1);
 s.day++;s.minute=0;s=validate(s);assert.equal(cropStatus(s,0).need,'Needs water');usePlot(s,0);advanceMinutes(s,1440);assert.equal(s.plots[0].growth,2);
 for(let i=0;i<2;i++){usePlot(s,0);advanceMinutes(s,1440);}
 advanceMinutes(s,1440*7);assert.equal(s.plots[0].missedDays,0,'ripe crops await harvesting without expiring');
});
test('sleeping through multiple days counts whole missed days only, and the third-day crop can recover',()=>{
 const s=growing();s.minute=0;advanceMinutes(s,1440*2);assert.equal(s.plots[0].missedDays,2);assert.equal(cropStatus(s,0).dead,false);
 advanceMinutes(s,1440);assert.equal(cropStatus(s,0).condition,'Recovering');const saved=validate(s);usePlot(saved,0);assert.equal(saved.plots[0].missedDays,0);advanceMinutes(saved,1440);assert.equal(saved.plots[0].growth,1);
 advanceMinutes(s,1440);assert.equal(cropStatus(s,0).dead,true);s.money=0;s.inventory.cornSeed=0;assert.ok(recoveryEligible(s));s.selected='harvest';s.energy=0;assert.match(usePlot(s,0),/cleared/);
});
test('schema 1–12 grants either old watering credit, preserves dead crops and migrates once',()=>{
 for(let version=1;version<=12;version++)for(const period of ['morning','evening']){
  const raw=newState('girl');Object.assign(raw,{version,day:7,minute:1000,money:327,ownsClub:version===12,clubEquipped:true});raw.plots[0]={crop:'corn',growth:1,[period]:true,missedWindows:1};
  const s=validate(raw);assert.equal(s.version,19);assert.equal(s.plots[0].wateredDay,7);assert.equal(s.plots[0].missedDays,0);assert.equal(s.plots[0].lastEvaluatedDay,6);assert.equal(s.money,version===12?372:327);assert.deepEqual(validate(s),s);
  raw.plots[0].missedWindows=2;assert.equal(validate(raw).plots[0].missedDays,4);
 }
});
test('farm purchases depend only on coins, stop at three and preserve custom beds',()=>{
 const s=newState();s.money=599;const before=structuredClone(s);assert.match(buyFarm(s),/600/);assert.deepEqual(s,before);
 s.money=1800;s.inventory.seed=1;usePlot(s,0);s.customBeds=[{farm:0,x:568,y:248,plot:{...emptyPlot(),crop:'corn',growth:1}}];
 assert.ok(canExpandFarm(s));buyFarm(s);assert.equal(s.money,1200);assert.equal(s.currentFarm,1);assert.equal(s.plots.length,128);buyFarm(s);assert.equal(s.money,0);assert.equal(s.currentFarm,2);assert.equal(s.plots.length,192);assert.equal(MAX_FARMS,3);
 s.money=9000;const full=structuredClone(s);assert.match(buyFarm(s),/full/);assert.deepEqual(s,full);assert.ok(visitFarm(s,0));assert.equal(s.plots[0].crop,'tomato');assert.equal(validate(s).customBeds[0].plot.crop,'corn');
 const old={...s,version:12,farms:Array.from({length:SAVE_FARM_LIMIT},()=>({fields:[true,false,false,false]})),currentFarm:99,plots:Array.from({length:SAVE_FARM_LIMIT*64},emptyPlot)};old.plots[99*64]={crop:'corn',growth:1,morning:true};
 const migrated=validate(old);assert.equal(migrated.farms.length,100);assert.equal(migrated.currentFarm,99);assert.equal(migrated.plots[99*64].growth,1);assert.deepEqual(validate(migrated),migrated);assert.match(buyFarm(migrated),/full/);
});
test('actual farm board purchase is gated, rebuilds the selected farm and disables fourth purchase',()=>{
 const s=newState();s.money=2000;let builds=0,saves=0,choices;
 const a={state:s,ui:{time:{now:1000},modal(k,t,b,c){choices=c;}},scene:{build(){builds++;}},save(){saves++;},transact(fn){fn(s);this.save();}};
 const office=new FarmOffice(a);office.farms();assert.equal(choices[0][0],'Buy farm 2 / 600c');assert.equal(choices[0][2],false);choices[0][1]();assert.equal(s.money,1400);assert.equal(builds,1);assert.equal(saves,1);office.purchase();assert.equal(s.farms.length,2);
 a.ui.time.now+=1000;office.purchase();assert.equal(s.money,200);assert.equal(builds,2);assert.equal(choices[0][0],'Farm collection full');assert.equal(choices[0][2],true);
});
test('Rowan stays a resident with a daily commute while only seed and produce shops remain',()=>{
 assert.deepEqual(MERCHANT_RESIDENTS.map(n=>n.kind),['seed','sell']);assert.ok(RESIDENTS.city.some(n=>n.id==='rowan'&&!n.kind));
 const s=newState();s.minute=600;const people=residentsFor('city',s),rowan=people.find(n=>n.id==='rowan');assert.equal(residentContext([rowan],{x:336,y:768}).title,'Rowan');
 s.minute=1200;stepResident(rowan,'city',50,{x:2000,y:1500},s);assert.equal(rowan.visible,false);s.minute=360;stepResident(rowan,'city',50,{x:2000,y:1500},s);assert.equal(rowan.visible,true);assert.equal(rowan.mode,'toWork');
});
