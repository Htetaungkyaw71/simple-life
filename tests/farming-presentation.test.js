import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {usePlot} from '../src/systems/farming.js';
import {waterPeriod,evaluateWatering,cropVisual} from '../src/systems/watering.js';
import {nextDay,restUntilEvening} from '../src/systems/time.js';
import {validate} from '../src/systems/save.js';
import {PLOTS,FIELD,CROPS} from '../src/data/crops.js';
import {walkable,syncInterior,LOCATIONS} from '../src/data/locations.js';
import {MAPS} from '../src/data/mapLayouts.js';
import {ROOM} from '../src/data/interior.js';
const planted=()=>{const s=newState();s.inventory.seed=1;usePlot(s,0);s.selected='water';return s;};
test('daily watering works at every hour and repeat use never spends extra energy',()=>{
 for(const minute of [0,359,360,719,720,800,959,960,1319,1320,1439]){
  const s=planted();s.minute=minute;assert.equal(waterPeriod(s),'daily');assert.equal(usePlot(s,0),'Watered');const e=s.energy;
  assert.equal(usePlot(s,0),'Already watered today');assert.equal(s.energy,e);
 }
});

test('missed-day evaluation is idempotent across sleeping and reload; watering resumes growth',()=>{
 const s=planted();s.minute=1320;evaluateWatering(s);assert.equal(s.plots[0].missedDays,0);
 nextDay(s);assert.equal(s.plots[0].missedDays,1);assert.equal(cropVisual(s.plots[0],s),'dry');evaluateWatering(s);assert.equal(s.plots[0].missedDays,1);
 const loaded=validate(JSON.parse(JSON.stringify(s)));evaluateWatering(loaded);assert.equal(loaded.plots[0].missedDays,1);
 usePlot(loaded,0);assert.equal(loaded.plots[0].missedDays,0);nextDay(loaded);assert.equal(loaded.plots[0].growth,1);
});

test('four consecutive missed days kill; late same-day watering still earns growth',()=>{
 const s=planted();for(let i=1;i<=4;i++){nextDay(s);assert.equal(cropVisual(s.plots[0],s),i===4?'dead':i===3?'wilted':'dry');}
 const late=newState();late.minute=1439;late.inventory.seed=1;usePlot(late,0);late.selected='water';usePlot(late,0);nextDay(late);assert.equal(late.plots[0].growth,1);assert.equal(late.plots[0].missedDays,0);
});

test('short-season crop poses cover readable seeds, sprouts, maturity, drought and death',()=>{
 const s=planted(),p=s.plots[0],seen=new Set();const capture=()=>seen.add(CROPS.tomato.sprites[cropVisual(p,s)]);
 capture();usePlot(s,0);capture();p.growth=1;capture();p.growth=0;p.wateredDay=0;p.missedDays=3;capture();p.missedDays=4;capture();assert.equal(seen.size,5);assert.equal(new Set(Object.values(CROPS.tomato.sprites)).size,8);
});

test('v1/v2 saves migrate individual crops and preserve economy, reward and locked expansion',()=>{
 for(const version of [1,2]){const s=newState('girl');s.version=version;s.money=123;s.day=7;s.minute=1020;s.starterSeedsClaimed=true;delete s.expansionUnlocked;s.plots[3]={crop:'tomato',growth:2,morning:true,evening:false,dryDays:1};const v=validate(s);assert.equal(v.version,14);assert.equal(v.money,123);assert.equal(v.starterSeedsClaimed,true);assert.equal(v.expansionUnlocked,false);assert.equal(v.plots[3].missedDays,0);assert.equal(v.plots[3].growth,3);assert.equal(v.plots[3].wateredDay,7);assert.deepEqual(validate(v),v);}
});
test('compact field has contiguous sixteen reachable cells, with no paths or props crossing them',()=>{
 assert.equal(PLOTS.length,16);assert.equal(new Set(PLOTS.map(p=>p.x)).size,4);assert.equal(FIELD.cell,48);
 for(const p of PLOTS){assert.ok(walkable('farm',p.x,p.y));assert.ok(!MAPS.farm.paths.some(([x,y,w,h])=>p.x+24>x&&p.x-24<x+w&&p.y+24>y&&p.y-24<y+h));}
});
test('greenhouse complete foundation is blocked but the roof overhang is not the collider',()=>{
 for(const area of ['home','farm'])for(const shed of MAPS[area].buildings.filter(p=>p.name==='shed')){assert.equal(walkable(area,shed.x+84,shed.y+112),false);assert.equal(walkable(area,shed.x+48,shed.y+116),false);assert.ok(walkable(area,shed.x+48,shed.y+40));const loaded=validate({...newState(),area,position:{x:shed.x+84,y:shed.y+112}});assert.ok(walkable(area,loaded.position.x,loaded.position.y));}
});
test('interior fits desktop with the same framing as outdoors, stays readable on mobile and keeps all anchors safe',()=>{
 for(const[w,h]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844]]){syncInterior(w,h);assert.equal(ROOM.zoom,1.5);if(w>=1000){assert.ok(ROOM.width*ROOM.zoom<=w);assert.ok(ROOM.height*ROOM.zoom<=h);}for(const p of [ROOM.spawn,ROOM.bed,ROOM.exit])assert.ok(walkable('interior',p.x,p.y));assert.equal(LOCATIONS.interior.bounds[2],ROOM.width-32);}
 syncInterior(1280,720);
});
test('road openings remove fence bodies while closed segments remain solid',()=>{
 for(const area of ['home','farm'])for(const p of MAPS[area].props.filter(p=>p.fence))assert.ok(!MAPS[area].paths.some(([x,y,w,h])=>p.x+24>x&&p.x+8<x+w&&p.y+28>y&&p.y+12<y+h));
 for(let y=680;y<=760;y+=4)assert.ok(walkable('home',896,y));assert.equal(walkable('home',1000,728),false);
});
test('responsive interior saves remap safely without losing progress',()=>{
 syncInterior(1280,720);const s=newState('girl');s.area='interior';s.position={...ROOM.spawn};s.money=987;s.inventory.tomato=12;s.starterSeedsClaimed=true;s.expansionUnlocked=false;
 syncInterior(390,844);const loaded=validate(s);assert.ok(walkable('interior',loaded.position.x,loaded.position.y));assert.equal(loaded.money,987);assert.equal(loaded.inventory.tomato,12);assert.equal(loaded.starterSeedsClaimed,true);assert.equal(loaded.expansionUnlocked,false);assert.deepEqual(validate(loaded),loaded);syncInterior(1280,720);
});
