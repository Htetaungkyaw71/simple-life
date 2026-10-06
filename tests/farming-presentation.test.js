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
test('watering windows are bounded, separate and closed in between',()=>{
 const s=planted();for(const [minute,period]of [[360,'morning'],[719,'morning'],[720,null],[959,null],[960,'evening'],[1319,'evening'],[1320,null]]){s.minute=minute;assert.equal(waterPeriod(s),period);}
 s.minute=800;const energy=s.energy;assert.match(usePlot(s,0),/06-12/);assert.equal(s.energy,energy);
});
test('one missed window wilts, watering recovers, repeat evaluation never duplicates a miss',()=>{
 const s=planted();s.minute=720;evaluateWatering(s);assert.equal(s.plots[0].missedWindows,1);assert.equal(cropVisual(s.plots[0],s),'wilted');evaluateWatering(s);assert.equal(s.plots[0].missedWindows,1);
 const loaded=validate(JSON.parse(JSON.stringify(s)));evaluateWatering(loaded);assert.equal(loaded.plots[0].missedWindows,1);
 restUntilEvening(loaded);usePlot(loaded,0);assert.equal(loaded.plots[0].missedWindows,0);nextDay(loaded);assert.equal(loaded.plots[0].growth,0);assert.equal(loaded.plots[0].missedWindows,0);
});
test('two consecutive misses kill; sleeping cannot bypass a window; late planting is not penalized retroactively',()=>{
 const s=planted();s.minute=1320;evaluateWatering(s);assert.equal(cropVisual(s.plots[0],s),'dead');
 const p=planted();usePlot(p,0);nextDay(p);assert.equal(p.plots[0].missedWindows,1);usePlot(p,0);assert.equal(p.plots[0].missedWindows,0);
 const late=newState();late.minute=970;late.inventory.seed=1;usePlot(late,0);late.selected='water';usePlot(late,0);nextDay(late);assert.equal(late.plots[0].missedWindows,0);
});
test('eight distinct data-driven tomato visual keys cover care and growth',()=>{
 const s=planted(),p=s.plots[0],seen=new Set();const capture=()=>seen.add(CROPS.tomato.sprites[cropVisual(p,s)]);
 capture();usePlot(s,0);capture();p.growth=1;capture();p.growth=2;capture();p.growth=3;capture();p.growth=2;p.morning=false;capture();p.missedWindows=1;capture();p.missedWindows=2;capture();assert.equal(seen.size,8);
});
test('v1/v2 saves migrate individual crops and preserve economy, reward and locked expansion',()=>{
 for(const version of [1,2]){const s=newState('girl');s.version=version;s.money=123;s.day=7;s.minute=1020;s.starterSeedsClaimed=true;delete s.expansionUnlocked;s.plots[3]={crop:'tomato',growth:2,morning:true,evening:false,dryDays:1};const v=validate(s);assert.equal(v.version,3);assert.equal(v.money,123);assert.equal(v.starterSeedsClaimed,true);assert.equal(v.expansionUnlocked,false);assert.equal(v.plots[3].missedWindows,1);assert.equal(v.plots[3].growth,2);assert.equal(v.plots[3].morning,true);assert.deepEqual(validate(v),v);}
});
test('compact field has contiguous sixteen reachable cells, with no paths or props crossing them',()=>{
 assert.equal(PLOTS.length,16);assert.equal(new Set(PLOTS.map(p=>p.x)).size,4);assert.equal(FIELD.cell,48);
 for(const p of PLOTS){assert.ok(walkable('farm',p.x,p.y));assert.ok(!MAPS.farm.paths.some(([x,y,w,h])=>p.x+24>x&&p.x-24<x+w&&p.y+24>y&&p.y-24<y+h));}
});
test('greenhouse complete foundation is blocked but the roof overhang is not the collider',()=>{
 for(const area of ['home','farm'])for(const shed of MAPS[area].buildings.filter(p=>p.name==='shed')){assert.equal(walkable(area,shed.x+84,shed.y+112),false);assert.equal(walkable(area,shed.x+48,shed.y+116),false);assert.ok(walkable(area,shed.x+48,shed.y+40));const loaded=validate({...newState(),area,position:{x:shed.x+84,y:shed.y+112}});assert.ok(walkable(area,loaded.position.x,loaded.position.y));}
});
test('interior fits desktop at zoom two, stays readable on mobile and keeps all anchors safe',()=>{
 for(const[w,h]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844]]){syncInterior(w,h);assert.equal(ROOM.zoom,2);if(w>=1000){assert.ok(ROOM.width*2<=w);assert.ok(ROOM.height*2<=h);}for(const p of [ROOM.spawn,ROOM.bed,ROOM.exit])assert.ok(walkable('interior',p.x,p.y));assert.equal(LOCATIONS.interior.bounds[2],ROOM.width-32);}
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
