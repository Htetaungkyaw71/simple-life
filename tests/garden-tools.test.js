import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {VEGETATION,vegetationKey,isTree,nearbyVegetation} from '../src/data/vegetation.js';
import {MAPS} from '../src/data/mapLayouts.js';
import {walkable} from '../src/data/locations.js';
import {vegetationContext,useVegetation,grassGround} from '../src/systems/vegetation.js';
import {contextFor} from '../src/systems/context.js';
import {lineClear,forageAvailable,refreshForest} from '../src/systems/forest.js';
import {FORAGE_NODES,BRIDGES} from '../src/data/forest.js';
import {CROPS,CROP_IDS} from '../src/data/crops.js';
import {usePlot} from '../src/systems/farming.js';
import {nextDay} from '../src/systems/time.js';
import {digGround,openGround} from '../src/systems/farmGround.js';
import {HeldWateringCan} from '../src/entities/HeldWateringCan.js';
import {refreshVegetationVisuals} from '../src/art/VegetationView.js';
import {GrassView} from '../src/art/GrassView.js';
import {BagPanel,bagItems} from '../src/ui/BagPanel.js';
import {Hud} from '../src/ui/Hud.js';
import {recorder} from './helpers/uiRecorder.js';
const approach=(s,n)=>{for(const distance of [32,48,60])for(const [dx,dy]of [[0,1],[-1,0],[1,0],[0,-1]]){const p={x:n.x+dx*distance,y:n.y+dy*distance};if(walkable(s.area,p.x,p.y,12,false,s)){s.position=p;return true;}}return false;};
function cuttable(area='farm',name){const s=newState();s.area=area;s.selected='axe';for(const n of VEGETATION[area].trees){if(name&&n.prop.name!==name||!approach(s,n))continue;const c=vegetationContext(s,'up',n),trial=structuredClone(s);if(c?.id===n.id&&useVegetation(trial,c).ok)return {s,n,c};}throw Error('No reachable '+area+' '+name);}
function patch(s){for(let y=96;y<1000;y+=8)for(let x=96;x<2100;x+=8){const p={x,y};if(grassGround(s,p)&&!nearbyVegetation(s,p,28).some(n=>!n.id.startsWith('tree:'))&&walkable(s.area,x,y+32,12,false,s)){s.position={x,y:y+32};return p;}}throw Error('No grass placement');}
test('every authored tree is registered and each outdoor area cuts roots only once, keeps rewards after reload',()=>{
 for(const area of ['home','farm','city','forest']){
  assert.equal(VEGETATION[area].trees.length,MAPS[area].props.filter(isTree).length);
  const {s,n,c}=cuttable(area),before=MAPS[area].obstacles.map(b=>[...b]);
  assert.equal(walkable(area,n.x,n.y,0,false,s),false);assert.equal(useVegetation(s,c).ok,true);assert.equal(s.inventory.wood,3);assert.equal(s.energy,99);
  assert.ok(walkable(area,n.x,n.y,0,false,s));const saved=structuredClone(s);assert.equal(useVegetation(s,c).ok,false);assert.deepEqual(s,saved);
  if(walkable(area,n.x,n.y,12,false,s))s.position={x:n.x,y:n.y};const loaded=validate(JSON.parse(JSON.stringify(s)));assert.deepEqual(loaded.position,s.position);assert.equal(loaded.inventory.wood,3);assert.deepEqual(loaded.vegetation,s.vegetation);assert.ok(walkable(area,n.x,n.y,0,false,loaded));assert.deepEqual(MAPS[area].obstacles,before);
 }
});
test('all forest tree silhouettes can be cut; utility use is atomic at zero energy, full bag or forged IDs',()=>{
 for(const name of new Set(VEGETATION.forest.trees.map(n=>n.prop.name))){const {s,c}=cuttable('forest',name);assert.equal(useVegetation(s,c).ok,true,name);}
 const {s,c}=cuttable();for(const mutate of [()=>{s.energy=0;},()=>{s.energy=100;s.inventory.wood=9998;}]){mutate();const before=structuredClone(s);assert.equal(useVegetation(s,c).ok,false);assert.deepEqual(s,before);}
 s.inventory.wood=0;const before=structuredClone(s);assert.equal(useVegetation(s,{...c,id:'tree:forged'}).ok,false);assert.deepEqual(s,before);
});
test('cut trees are separate on purchased farms and allow free digging on the cleared footprint',()=>{
 const {s,n,c}=cuttable();s.farms.push({fields:[true,false,false,false]});s.plots.push(...Array.from({length:64},()=>({crop:null,growth:0,morning:false,evening:false,dryDays:0,missedWindows:0,lastEvaluatedWindow:-1})));s.currentFarm=1;
 assert.ok(useVegetation(s,c).ok);assert.ok(walkable('farm',n.x,n.y,0,false,s));s.currentFarm=0;assert.equal(walkable('farm',n.x,n.y,0,false,s),false);
 s.currentFarm=1;const loaded=validate(s);assert.ok(walkable('farm',n.x,n.y,0,false,loaded));assert.ok(loaded.vegetation['farm:1']);assert.equal(loaded.vegetation['farm:0'],undefined);
 // Clear the nearby companion too, then dig a bed where the old root blocked it.
 for(const t of VEGETATION.farm.trees.filter(t=>Math.hypot(t.x-n.x,t.y-n.y)<60&&t.id!==n.id))assert.ok(useVegetation(s,{...t,type:'chop'}).ok);
 s.selected='shovel';const bed=digGround(s,{x:1704,y:216});assert.ok(bed.ok);assert.equal(validate(s).customBeds[0].x,1704);
});
test('hand gathering, planting and regathering conserves grass and persists a placed patch',()=>{
 const s=newState();s.area='forest';s.selected='hand';let found;
 for(const n of VEGETATION.forest.grass){if(!approach(s,n))continue;const c=vegetationContext(s,'up',n);if(c?.id===n.id&&useVegetation(structuredClone(s),c).ok){found=c;break;}}
 assert.ok(found);assert.ok(useVegetation(s,found).ok);assert.equal(s.inventory.grass,1);const copy=structuredClone(s);assert.equal(useVegetation(s,found).ok,false);assert.deepEqual(s,copy);
 s.area='farm';s.selected='grass';const p=patch(s);const c={...p,type:'placeGrass'};assert.equal(contextFor(s,null,'up',p).type,'placeGrass');assert.ok(useVegetation(s,c).ok);assert.equal(s.inventory.grass,0);
 const loaded=validate(s);assert.equal(loaded.vegetation['farm:0'].placed.length,1);assert.equal(loaded.inventory.grass,0);loaded.selected='hand';assert.ok(useVegetation(loaded,{...loaded.vegetation['farm:0'].placed[0],type:'gatherGrass'}).ok);assert.equal(loaded.inventory.grass,1);assert.equal(loaded.vegetation['farm:0'].placed.length,0);
});
test('grass refuses water, bridges, solid roots, farm beds and occupied patches without consuming stock',()=>{
 const s=newState();s.selected='grass';s.inventory.grass=5;
 for(const area of ['home','farm','forest']){s.area=area;const map=MAPS[area],water=map.water[0];const points=[...VEGETATION[area].trees.slice(0,1),...(water?[{x:water[0]+water[2]/2,y:water[1]+water[3]/2}]:[]),...(area==='forest'?BRIDGES.map(b=>({x:b.x+b.w/2,y:b.y+b.h/2})):[]),...(area==='farm'?[{x:376,y:248}]:[])];for(const p of points){s.position={x:p.x,y:p.y+32};const before=structuredClone(s);assert.equal(useVegetation(s,{...p,type:'placeGrass'}).ok,false);assert.deepEqual(s,before);}}
 s.area='farm';const p=patch(s);assert.ok(useVegetation(s,{...p,type:'placeGrass'}).ok);const before=structuredClone(s);assert.equal(useVegetation(s,{...p,type:'placeGrass'}).ok,false);assert.deepEqual(s,before);
});
test('schema 10 migration retains progress; schema 11 rejects unsafe and forged vegetation',()=>{
 const old=newState('girl');old.version=10;old.money=765;old.inventory.tomato=7;old.plots[0]={...old.plots[0],crop:'tomato',growth:2,morning:true};delete old.vegetation;delete old.inventory.wood;delete old.inventory.grass;
 const s=validate(old);assert.equal(s.version,12);assert.equal(s.money,765);assert.equal(s.inventory.tomato,7);assert.equal(s.plots[0].growth,1);assert.equal(s.inventory.wood,0);assert.deepEqual(s.vegetation,{});
 const t=VEGETATION.home.trees[0];s.vegetation={home:{trees:[t.id,t.id,'bad'],grass:['bad'],placed:[{x:NaN,y:32},{x:t.x,y:t.y}]},'farm:999':{trees:[t.id]}};const fixed=validate(s);assert.deepEqual(fixed.vegetation.home,{trees:[t.id],grass:[],placed:[]});assert.equal(fixed.vegetation['farm:999'],undefined);
});
test('all twelve crop identities mature in one or two full care nights; missed care still prevents growth',()=>{
 for(const id of CROP_IDS){const s=newState(),d=CROPS[id];s.inventory[d.seedKey]=1;s.selectedCrop=id;usePlot(s,0);s.selected='water';assert.ok(d.growthDays>=1&&d.growthDays<=2);for(let n=0;n<d.growthDays;n++){s.minute=360;usePlot(s,0);s.minute=960;usePlot(s,0);nextDay(s);}assert.equal(s.plots[0].growth,d.growthDays);s.selected='harvest';usePlot(s,0);assert.equal(s.inventory[id],d.harvestYield);}
 const s=newState();s.inventory.seed=1;usePlot(s,0);s.selected='water';usePlot(s,0);nextDay(s);assert.equal(s.plots[0].growth,0);
});
test('actual held utility sprites follow four farmer hand anchors, swing, switch and pause',()=>{
 const u=recorder(),s=newState();u.app={state:s,paused:false};const held=new HeldWateringCan(u);
 for(const tool of ['shovel','axe','water']){s.selected=tool;for(const direction of ['up','down','left','right']){held.update({x:100,y:100},direction,2);assert.ok(held.can.visible);assert.equal(held.can.frame,tool==='water'?'watering-can-item':tool+'-item');assert.ok(Math.hypot(held.hand.x-100,held.hand.y-100)<(tool==='axe'?40:32));assert.equal(held.can.depth,direction==='up'?99:101);}held.swing();held.update({x:100,y:100},'right',2);assert.ok(held.can.rotation>0);u.app.paused=true;u.time.now+=100;held.update({x:100,y:100},'right',2);assert.equal(held.remaining,420);u.app.paused=false;}
 s.selected='hand';held.update({x:100,y:100},'right',2);assert.equal(held.can.visible,false);
});
test('actual cleanup removes cut crown and shadow, and grass buckets filter removed/placed clumps',()=>{
 const {s,n,c}=cuttable('forest');useVegetation(s,c);let destroyed=0,refreshed=0;const crown={active:true,destroy(){this.active=false;destroyed++;}},shadow={destroy(){destroyed++;}},keep={active:true};const scene={app:{state:s},vegetationVisuals:new Map([[n.id,[shadow,crown]],['keep',[keep]]]),canopies:[{sprite:crown},{sprite:keep}],grass:{refresh(){refreshed++;}}};refreshVegetationVisuals(scene);assert.equal(destroyed,2);assert.equal(scene.canopies.length,1);assert.equal(refreshed,1);
 const g=MAPS.forest.grass[0];s.vegetation.forest.grass=[g.id];s.vegetation.forest.placed=[{id:'placed:100:100',x:100,y:100,variant:1}];const view=new GrassView({app:{state:s}},MAPS.forest);assert.equal(view.total,MAPS.forest.grass.length);assert.ok(![...view.buckets.values()].flat().some(n=>n.id===g.id));assert.ok([...view.buckets.values()].flat().some(n=>n.id==='placed:100:100'));
});
test('bag utility selection and materials work in the same canvas theme across seven viewports',()=>{
 for(const [w,h]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844],[640,360],[360,640]]){
  const u=recorder(w,h),s=newState(),app={state:s,paused:false,input:{},ui:u,save(){},scene:{forestView:{energy(){}}}};u.app=app;app.bagPanel=new BagPanel(app);s.inventory.grass=3;
  for(const id of ['shovel','axe','hand','grass']){u.time.now+=1000;app.bagPanel.open('gear');app.bagPanel.index=bagItems(s,'gear').findIndex(i=>i.id===id);const before={...s.inventory};app.bagPanel.perform();assert.equal(s.selected,id);assert.deepEqual(s.inventory,before);for(const c of u.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=u.w&&c.y+c.h<=u.h);}
 }
});

test('cutting a forage tree removes its fruit permanently while loose fruit keeps daily refresh',()=>{
 const s=newState();s.area='forest';s.selected='axe';let found;
 for(const f of FORAGE_NODES){const n=VEGETATION.forest.trees.find(t=>t.prop.x===f.x-56&&t.prop.y===f.y-120);if(n&&approach(s,n)&&useVegetation(structuredClone(s),{...n,type:'chop'}).ok){found={f,n};break;}}
 assert.ok(found);assert.ok(forageAvailable(s,found.f));assert.ok(useVegetation(s,{...found.n,type:'chop'}).ok);assert.equal(forageAvailable(s,found.f),false);s.day++;refreshForest(s);assert.equal(forageAvailable(s,found.f),false);assert.equal(forageAvailable(validate(s),found.f),false);
});
test('shovel digging clears planted ground cover immediately and keeps the free bed after reload',()=>{
 const s=newState();s.area='farm';s.selected='grass';s.inventory.grass=1;s.position={x:696,y:152};const p={x:696,y:120};assert.ok(useVegetation(s,{...p,type:'placeGrass'}).ok);s.selected='shovel';const r=digGround(s,p);assert.ok(r.ok);assert.equal(s.vegetation['farm:0'].placed.length,0);assert.equal(s.inventory.grass,0);assert.equal(validate(s).customBeds[0].x,696);
});
test('utility actions cannot reach through a solid well',()=>{
 const s=newState();s.area='farm';s.selected='grass';s.inventory.grass=1;s.position={x:1432,y:496};assert.ok(walkable('farm',1432,496));const before=structuredClone(s);const r=useVegetation(s,{type:'placeGrass',x:1496,y:496});assert.equal(r.ok,false);assert.equal(r.message,'Choose a clear approach');assert.deepEqual(s,before);
});
