import {test} from 'node:test';
import assert from 'node:assert/strict';
import {eatFood} from '../src/systems/forest.js';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {digGround,waterGround,dryGround,openGround,WET_DURATION,wetAt} from '../src/systems/farmGround.js';
import {visiblePlots,buyField,buyFarm} from '../src/systems/expansion.js';
import {plotAt} from '../src/systems/plots.js';
import {usePlot} from '../src/systems/farming.js';
import {nextDay,restUntilEvening,sleep} from '../src/systems/time.js';
import {cropStatus} from '../src/systems/cropStatus.js';
import {CROPS,CROP_IDS,SALE_IDS} from '../src/data/crops.js';
import {FARM_PLOTS} from '../src/data/farms.js';
import {contextFor} from '../src/systems/context.js';
import {soilPixels,bedMask,cropMarker,drawFarmBeds} from '../src/art/FarmView.js';
import {TradePanel} from '../src/ui/TradePanel.js';
import {BagPanel,bagItems} from '../src/ui/BagPanel.js';
import {recorder} from './helpers/uiRecorder.js';
const farm=()=>Object.assign(newState(),{area:'farm',selected:'shovel'});
const free=[];
for(let y=72;y<1056;y+=48)for(let x=72;x<2160;x+=48)if(openGround('farm',x,y,true)&&!FARM_PLOTS.some(b=>Math.abs(b.x-x)<48&&Math.abs(b.y-y)<48))free.push({x,y});
function dig(s,p=free[0]){s.position={x:p.x,y:p.y+30};return digGround(s,p);}
function uiApp(s,u){const app={state:s,ui:u,paused:false,input:{},sound(){},save(){},scene:{forestView:{energy(){}}},transact(fn){return fn(s);}};u.app=app;return app;}
test('shovel creates free beds on safe Farm ground and rejects repeats, paths, water, far targets and exhaustion',()=>{
 assert.ok(free.length>100);const s=farm(),coins=s.money,r=dig(s);assert.ok(r.ok);assert.equal(s.money,coins);assert.equal(s.energy,99);assert.equal(visiblePlots(s).length,17);assert.equal(plotAt(s,r.index).crop,null);
 const before=structuredClone(s);assert.equal(digGround(s,r).ok,false);assert.deepEqual(s,before);
 for(const point of [{x:320,y:72},{x:1800,y:744},{x:2160,y:24},{x:free.at(-1).x,y:free.at(-1).y}])assert.equal(digGround(s,point).ok,false);
 s.area='forest';assert.equal(digGround(s,r).ok,false);s.area='farm';s.energy=0;const p=free.find(p=>p.x!==r.x||p.y!==r.y);s.position=p;assert.equal(digGround(s,p).ok,false);
});
test('formerly locked field cells are individually dug without coins or unlocking all sixteen',()=>{
 const s=farm(),p=FARM_PLOTS[16];s.position={x:p.x,y:p.y+30};const result=digGround(s,p);assert.equal(result.ok,true);assert.equal(result.index,16);assert.equal(s.money,60);assert.equal(s.farms[0].fields[1],false);assert.equal(visiblePlots(s).length,17);s.selected='seed';s.inventory.seed=1;assert.equal(contextFor(s,16).index,16);assert.match(usePlot(s,16),/planted/);assert.equal(validate(s).plots[16].crop,'tomato');
});
test('custom beds complete planting, daily watering, growth, harvest and save/reload',()=>{
 let s=farm();const r=dig(s),id='cucumber';s.selected='seed';s.selectedCrop=id;s.inventory[CROPS[id].seedKey]=1;assert.match(usePlot(s,r.index),/planted/);assert.equal(cropStatus(s,r.index).name,'Cucumber');
 for(let day=0;day<CROPS[id].growthDays;day++){
  s.energy=100;s.selected='water';assert.equal(waterGround(s,r,r.index).cared,true);assert.equal(cropMarker(plotAt(s,r.index),s),null);const flags=structuredClone(plotAt(s,r.index));waterGround(s,r,r.index);assert.deepEqual(plotAt(s,r.index),flags,'repeat cannot add care/growth');restUntilEvening(s);assert.equal(waterGround(s,r,r.index).ok,false);nextDay(s);s.area='farm';s.position={x:r.x,y:r.y+30};s=validate(s);assert.equal(plotAt(s,r.index).growth,day+1);
 }
 s.selected='harvest';assert.match(usePlot(s,r.index),/harvested/);assert.equal(s.inventory[id],3);assert.equal(plotAt(s,r.index).crop,null);assert.equal(s.customBeds.length,1,'bed remains after harvest');
});
test('watering anywhere wets open outdoor ground, dries after three active minutes and persists without inventing care',()=>{
 let s=farm();s.selected='water';s.position=free[0];s.minute=800;const r=waterGround(s,free[0]);assert.ok(r.ok);assert.equal(s.energy,99);assert.ok(wetAt(s,r.x,r.y));assert.equal(s.wetGround[0].remaining,WET_DURATION);s=validate(s);assert.ok(wetAt(s,r.x,r.y));
 for(let n=0;n<1799;n++)dryGround(s,100);assert.ok(wetAt(s,r.x,r.y));assert.equal(dryGround(s,100),true);assert.equal(s.wetGround.length,0);
 s.position=free[0];waterGround(s,free[0]);sleep(s);assert.equal(s.wetGround.length,0,'sleep time jump dries cosmetic soil');
 for(const area of ['home','city','forest']){s.area=area;const point=area==='forest'?{x:640,y:4800}:area==='city'?{x:600,y:500}:{x:480,y:600};s.position=point;if(openGround(area,point.x,point.y))assert.ok(waterGround(s,point).ok);}
 s.area='interior';assert.equal(waterGround(s,s.position).ok,false);
});
test('watering at midday cares for a plant and a repeat leaves energy and soil timer unchanged',()=>{
 const s=farm(),r=dig(s);s.selected='seed';s.inventory.seed=1;usePlot(s,r.index);s.selected='water';s.minute=800;
 const p=plotAt(s,r.index),result=waterGround(s,r,r.index);assert.ok(result.ok);assert.equal(result.cared,true);assert.equal(p.wateredDay,s.day);assert.ok(wetAt(s,r.x,r.y));
 const before=structuredClone(s);assert.equal(waterGround(s,r,r.index).ok,false);assert.deepEqual(s,before);
});

test('schema 9 migration retains paid farms, original crops, inventory, money and forest progress',()=>{
 const old=farm();old.money=2000;for(const i of [1,2,3])buyField(old,i);buyFarm(old);old.version=9;old.plots[0].crop='tomato';old.plots[0].growth=2;old.plots[64].crop='corn';old.inventory.tomato=9;old.forest.treasures=['stone-cache'];const s=validate(old);assert.equal(s.version,17);for(const key of ['farms','money','inventory','currentFarm'])assert.deepEqual(s[key],old[key]);assert.deepEqual(s.plots,old.plots.map(p=>({...p,growth:p.crop==='tomato'?3:p.growth})));assert.deepEqual(s.customBeds,[]);assert.deepEqual(s.dugPlots,[]);assert.deepEqual(s.wetGround,[]);
});
test('new saves reject duplicate/overlapping/unsafe beds and invalid wet patches without harming planted progress',()=>{
 const s=farm(),r=dig(s);s.selected='seed';s.inventory.seed=1;usePlot(s,r.index);s.selected='water';waterGround(s,r,r.index);const before=validate(s);assert.deepEqual(validate(before),before);const b=s.customBeds[0];s.customBeds.push({...b},{...b,farm:999},{...b,x:1800,y:744},{...b,x:376,y:248},{...b,x:NaN});s.wetGround.push({area:'farm',farm:0,x:NaN,y:4,remaining:Infinity},{area:'__proto__',farm:0,x:120,y:120,remaining:20});const fixed=validate(s);assert.equal(fixed.customBeds.length,1);assert.equal(fixed.wetGround.length,1);assert.equal(fixed.customBeds[0].plot.crop,'tomato');
});
test('digging and watering share pointer/facing ground targets while Seed still finds saved custom beds',()=>{
 const s=farm();s.position={x:free[0].x,y:free[0].y+30};assert.equal(contextFor(s,null,'up',free[0]).type,'dig');const r=digGround(s,free[0]);s.selected='seed';assert.equal(contextFor(s,r.index).index,r.index);s.selected='water';assert.equal(contextFor(s,null,'up',r).index,r.index);
});
test('soil joins neighbours without turf seams; water and warning markers follow actual crop state',()=>{
 const b={x:100,y:100},beds=[b,{x:148,y:100},{x:100,y:148}];assert.equal(bedMask(b,beds),6);const dry=soilPixels(15),wet=soilPixels(15,true);assert.equal(dry.length,2304);assert.ok(wet[0]<dry[0]);const s=farm(),p={...s.plots[0],crop:'tomato'};assert.equal(cropMarker(p,s),'drop');p.missedDays=3;assert.equal(cropMarker(p,s),'warning');p.missedDays=0;p.growth=3;assert.equal(cropMarker(p,s),'basket');
});
test('all twelve seeds and all produce pages remain selectable at desktop and small/mobile sizes',()=>{
 assert.equal(CROP_IDS.length,12);assert.deepEqual(SALE_IDS.slice(0,14),['tomato','strawberry','carrot','corn','wildBerry','guava','mango','wildHide','banana','orange','papaya','coconut','dragonFruit','pineapple']);
 for(const [w,h] of [[1440,900],[1280,720],[1024,768],[844,390],[640,360],[390,844],[360,640]]){
  const s=farm(),u=recorder(w,h),a=uiApp(s,u);a.bagPanel=new BagPanel(a);const t=new TradePanel(a);t.open('seed');const found=new Set();for(let page=0;page<3;page++){for(const c of u.controls.filter(c=>c.id.startsWith('crop-')))found.add(c.id.slice(5));u.controls.find(c=>c.id==='seed-page').action();}assert.deepEqual([...found],CROP_IDS);
  a.bagPanel.open('produce');assert.equal(bagItems(s,'produce').length,14);u.controls.find(c=>c.id==='bag-page').action();assert.ok(u.controls.some(c=>c.id==='bag-item-wildHide'));for(const c of u.controls)assert.ok(c.y>=0&&c.y+c.h<=u.h,c.id+' bounds');
 }
});

test('harvested watermelon, grapes and blueberries are edible through the existing capped-energy rules',()=>{
 const s=farm();s.energy=50;for(const id of ['watermelon','grape','blueberry']){s.energy=50;s.inventory[id]=1;assert.match(eatFood(s,id),/energy/);assert.ok(s.energy>50&&s.energy<=100);assert.equal(s.inventory[id],0);}
});

test('watering selected still permits keyboard interaction with the home door and bed',()=>{
 const s=newState();s.selected='water';s.area='home';s.position={x:480,y:492};assert.equal(contextFor(s)?.type,'travel');
});

test('new shovel beds extend the original field on its own grid and join soil edges after reload',()=>{
 const s=farm(),p={x:568,y:248};s.position={x:568,y:278};const r=digGround(s,p);assert.ok(r.ok);assert.equal(r.x,568);assert.equal(r.y,248);const loaded=validate(s),beds=visiblePlots(loaded),old=beds.find(b=>b.x===520&&b.y===248),added=beds.find(b=>b.x===568&&b.y===248);assert.ok(added);assert.ok(bedMask(old,beds)&2);assert.ok(bedMask(added,beds)&8);
});

test('actual Farm view draws connected soil, new crop sprites and care markers without the old tile art',()=>{
 const s=farm(),r=dig(s);s.selected='seed';s.selectedCrop='watermelon';s.inventory.watermelonSeed=1;usePlot(s,r.index);const u=recorder();u.app={state:s};drawFarmBeds(u,u.root);assert.ok(u.root.list.some(n=>n.frame==='watermelon-seed'));assert.ok(u.root.list.some(n=>n.type==='graphics'));assert.equal(u.root.list.filter(n=>n.texture?.startsWith('farm-soil-')).length,17);assert.ok(!u.root.list.some(n=>['field-soil','field-watered'].includes(n.frame)));
});
