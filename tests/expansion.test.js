import test from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {FIELDS,FARM_PLOTS} from '../src/data/farms.js';
import {buyField,buyFarm,visitFarm,visiblePlots,nextFarmPrice} from '../src/systems/expansion.js';
import {usePlot} from '../src/systems/farming.js';
import {nextDay,restUntilEvening} from '../src/systems/time.js';
import {validate} from '../src/systems/save.js';
import {walkable,LOCATIONS} from '../src/data/locations.js';
import {contextFor} from '../src/systems/context.js';
import {MAPS} from '../src/data/mapLayouts.js';

test('coin purchases reject locked land, insufficient funds and duplicate purchases',()=>{
 const s=newState();s.inventory.seed=1;const before=structuredClone(s);
 assert.match(usePlot(s,16),/Dig/);assert.deepEqual(s,before);
 assert.match(buyField(s,1),/need 120/);assert.deepEqual(s,before);
 assert.match(buyFarm(s),/need 600/);assert.deepEqual(s,before);
 s.money=120;assert.match(buyField(s,1),/ready/);assert.equal(s.money,0);assert.equal(visiblePlots(s).length,32);
 const owned=structuredClone(s);assert.match(buyField(s,1),/already/);assert.match(buyField(s,99),/Choose/);assert.match(buyField(s,-1),/Choose/);assert.deepEqual(s,owned);
 assert.match(usePlot(s,16),/planted/);assert.equal(s.plots[16].crop,'tomato');
});
test('four identical reachable fields unlock another independent farm and save all ownership',()=>{
 const s=newState();s.area='farm';s.money=2000;
 for(const i of [3,1,2])buyField(s,i);assert.equal(s.money,1460);assert.equal(visiblePlots(s).length,64);
 for(const [i,p]of FARM_PLOTS.entries()){
  assert.ok(walkable('farm',p.x,p.y),'reachable '+i);
  assert.ok(!MAPS.farm.paths.some(([x,y,w,h])=>p.x+24>x&&p.x-24<x+w&&p.y+24>y&&p.y-24<y+h),'road clear '+i);
  s.position={x:p.x,y:p.y};assert.equal(contextFor(s)?.index,i,'context '+i);
 }
 assert.ok(FIELDS.every(f=>f.w===192&&f.h===192&&f.cell===48&&f.rows===4&&f.cols===4));
 s.inventory.seed=2;usePlot(s,48);assert.equal(s.plots[48].crop,'tomato');
 assert.equal(nextFarmPrice(s),600);buyFarm(s);assert.equal(s.currentFarm,1);assert.equal(s.money,860);assert.equal(s.plots.length,128);assert.equal(visiblePlots(s).length,16);assert.equal(visiblePlots(s)[0].index,64);
 usePlot(s,64);assert.equal(s.plots[64].crop,'tomato');assert.equal(s.plots[48].crop,'tomato');
 const before=structuredClone(s);assert.match(buyFarm(s),/need 1200/);assert.deepEqual(s,before);
 assert.deepEqual(validate(JSON.parse(JSON.stringify(s))),s);
 assert.ok(visitFarm(s,0));assert.equal(visiblePlots(s).length,64);assert.ok(!visitFarm(s,4));
 buyField(s,3);assert.equal(s.money,860);assert.equal(nextFarmPrice(s),1200);
 assert.ok(!LOCATIONS.farm.interactions.some(p=>p.to==='city'));
});
test('watering and manual sleep settle crops on every owned farm exactly once',()=>{
 const s=newState();s.money=2000;for(const i of [1,2,3])buyField(s,i);s.inventory.seed=2;
 usePlot(s,0);buyFarm(s);usePlot(s,64);s.selected='water';
 for(let day=0;day<1;day++){
  usePlot(s,0);usePlot(s,64);restUntilEvening(s);usePlot(s,0);usePlot(s,64);nextDay(s);
  assert.equal(s.plots[0].growth,day+1);assert.equal(s.plots[64].growth,day+1);
 }
 const saved=validate(s);saved.selected='harvest';usePlot(saved,0);usePlot(saved,64);assert.equal(saved.inventory.tomato,4);
});
test('version 1-4 migration preserves original crop indices and ignores forged expansion',()=>{
 for(const version of [1,2,3,4]){
  const raw=newState();raw.version=version;raw.plots=raw.plots.slice(0,16);raw.plots[5].crop='tomato';raw.plots[5].growth=2;raw.farms=[{fields:[true,true,true,true]}];raw.currentFarm=99;
  const s=validate(raw);assert.equal(s.version,13);assert.equal(s.plots[5].growth,1);assert.deepEqual(s.farms,[{fields:[true,false,false,false]}]);assert.equal(s.currentFarm,0);assert.equal(s.plots.length,64);
 }
 const s=newState();s.currentFarm=999;s.farms=[null,{fields:[false,'yes',true,1]}];s.plots[16].crop='tomato';const v=validate(s);assert.equal(v.currentFarm,1);assert.deepEqual(v.farms[1].fields,[true,false,true,false]);assert.equal(v.plots[16].crop,null);
});
