import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {tick,sleep,wakeTime,phase,clock,daylight,isNight} from '../src/systems/time.js';
import {usePlot} from '../src/systems/farming.js';
import {wateringLabel} from '../src/systems/watering.js';
import {newFarm} from '../src/systems/expansion.js';
import {emptyPlot} from '../src/systems/state.js';
import {marketPrice,shopOpen} from '../src/systems/market.js';
test('daytime sleep wakes at night; nighttime sleep wakes at morning, including after midnight',()=>{
 for(const [minute,day,wake]of [[360,1,1200],[719,1,1200],[1080,1,1200],[1199,1,1200],[1200,2,360],[1439,2,360],[0,1,360],[359,1,360]]){
  const s=newState();s.minute=minute;s.energy=5;s.fatigueMinutes=29;assert.equal(wakeTime(s),wake);sleep(s);
  assert.equal(s.day,day);assert.equal(s.minute,wake);assert.equal(s.energy,100);assert.equal(s.fatigueMinutes,0);assert.equal(s.area,'interior');
 }
});
test('an awake midnight settles every farm once; later early-morning sleep adds no growth',()=>{
 const s=newState();s.farms.push(newFarm());s.plots.push(...Array.from({length:64},emptyPlot));s.area='farm';s.inventory.seed=2;
 for(const i of [0,64]){usePlot(s,i);s.selected='water';usePlot(s,i);s.selected='seed';}
 s.minute=1200;s.selected='water';for(const i of [0,64])usePlot(s,i);
 const before=marketPrice(s,'tomato');s.minute=1439.9;s.fatigueMinutes=59.9;s.energy=10;tick(s,100);
 assert.equal(s.day,2);assert.ok(s.minute<1);assert.equal(s.energy,10);assert.equal(s.area,'farm');
 for(const i of [0,64]){assert.equal(s.plots[i].growth,1);assert.equal(s.plots[i].wateredDay,1);}
 const price=marketPrice(s,'tomato');assert.notDeepEqual(price,before);sleep(s);assert.equal(s.day,2);assert.deepEqual(marketPrice(s,'tomato'),price);
 for(const i of [0,64])assert.equal(s.plots[i].growth,1);
});
test('sleeping across midnight counts missed days and never grows twice in one day',()=>{
 const s=newState();s.selectedCrop='corn';s.inventory.cornSeed=1;usePlot(s,0);s.selected='water';usePlot(s,0);sleep(s);assert.equal(s.minute,1200);assert.equal(s.plots[0].growth,0);usePlot(s,0);sleep(s);assert.equal(s.day,2);assert.equal(s.plots[0].growth,1);
 sleep(s);assert.equal(s.day,2);assert.equal(s.plots[0].growth,1);sleep(s);assert.equal(s.day,3);assert.equal(s.plots[0].growth,1);assert.equal(s.plots[0].missedDays,1);
});
test('elapsed time leaves energy unchanged, including legacy fatigue saves',()=>{
 const s=newState();s.minute=10;s.energy=1;s.fatigueMinutes=59.8;s.area='farm';const p={...s.position};const v=validate(s);assert.equal(v.minute,10);assert.equal(v.fatigueMinutes,59.8);tick(v,100);assert.equal(v.energy,1);
 for(let n=0;n<100;n++)tick(v,100);assert.equal(v.energy,1);assert.equal(v.area,'farm');assert.deepEqual(v.position,validate(s).position);assert.deepEqual(s.position,p);
 const old={...s,version:6};delete old.fatigueMinutes;assert.equal(validate(old).fatigueMinutes,0);assert.equal(validate(old).version,13);
 const bad=validate({...s,fatigueMinutes:Infinity});assert.equal(bad.fatigueMinutes,0);
});
test('midnight clock and phases remain correct; both shops close at night',()=>{
 assert.equal(clock({minute:1439}),'23:59');assert.equal(clock({minute:0}),'00:00');assert.equal(clock({minute:2.9}),'00:02');
 for(const minute of [0,120,359,1200,1439]){assert.equal(phase({minute}),'Night');assert.ok(isNight({minute}));assert.equal(shopOpen({minute},'seed'),false);assert.equal(shopOpen({minute},'sell'),false);}
 assert.equal(wateringLabel({minute:120}),'WATER ONCE DAILY');assert.equal(phase({minute:360}),'Morning');
});
test('day/dusk/moonlight are bounded and repeat across midnight with readable darkness',()=>{
 for(let minute=0;minute<1440;minute++){const a=daylight({minute}).alpha;assert.ok(a>=0&&a<=.78);}
 assert.equal(daylight({minute:720}).alpha,0);assert.ok(daylight({minute:1140}).alpha>.4);assert.deepEqual(daylight({minute:1439}),daylight({minute:0}));assert.equal(daylight({minute:0}).alpha,.78);assert.equal(daylight({minute:420}).alpha,0);
});
