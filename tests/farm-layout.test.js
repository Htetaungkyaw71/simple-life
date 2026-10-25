import test from 'node:test';
import assert from 'node:assert/strict';
import {newState,emptyPlot} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {FIELDS,FARM_PLOTS,STARTER_EXTENSION} from '../src/data/farms.js';
import {visiblePlots,prepareStarterBeds} from '../src/systems/expansion.js';
import {openGround,digGround} from '../src/systems/farmGround.js';
import {usePlot} from '../src/systems/farming.js';
import {MAPS} from '../src/data/mapLayouts.js';
import {contextFor} from '../src/systems/context.js';
test('eight-column starter and four identical growing areas are clear, with fewer roads confined to previous road ground',()=>{
 const s=newState(),beds=visiblePlots(s);assert.equal(beds.length,40);assert.equal(new Set(beds.map(b=>b.x)).size,8);assert.equal(new Set(beds.map(b=>b.y)).size,5);assert.equal(s.plots.length,64);
 s.area='farm';s.position={x:712,y:392};for(const tool of ['seed','water','harvest']){s.selected=tool;assert.equal(contextFor(s).type,'plot');assert.equal(contextFor(s).x,712);}
 assert.equal(contextFor(s,75,'up').index,75,'pointed neighbouring bed retains priority');
 s.selected='hand';s.position={x:828,y:576};assert.equal(contextFor(s).type,'farmOffice');
 assert.equal(MAPS.farm.paths.length,6);
 const old=[[288,0,64,336],[192,272,144,64],[128,528,832,64],[832,256,64,192],[160,224,64,416],[192,432,1024,64],[640,288,64,640],[640,896,1376,64],[960,448,64,448],[960,576,928,64],[1472,256,64,672],[1024,352,800,64]];
 for(const [x,y,w,h] of MAPS.farm.paths)assert.ok(old.some(([a,b,c,d])=>x>=a&&y>=b&&x+w<=a+c&&y+h<=b+d));
 for(const f of FIELDS){assert.equal(f.cols,8);assert.equal(f.rows,5);assert.equal(f.w,384);assert.equal(f.h,240);
  for(let row=0;row<5;row++)for(let col=0;col<8;col++){
   const p={x:f.x+24+col*48,y:f.y+24+row*48};assert.ok(openGround('farm',p.x,p.y,true,s),JSON.stringify(p));
   assert.ok(!MAPS.farm.paths.some(([x,y,w,h])=>p.x+24>x&&p.x-24<x+w&&p.y+24>y&&p.y-24<y+h));
  }
 }
});
test('old custom crops, original plot IDs, paid furniture and wallet survive the additive larger starter migration',()=>{
 const s=newState('girl');s.area='farm';s.position={x:480,y:500};s.day=7;s.money=734;s.customBeds=[];
 s.plots[0]={...emptyPlot(),crop:'tomato',growth:2,wateredDay:7,lastEvaluatedDay:6};
 s.customBeds=[{farm:0,x:568,y:248,plot:{...emptyPlot(),crop:'corn',growth:1}},{farm:0,x:888,y:744,plot:{...emptyPlot(),crop:'chili',growth:1}}];
 s.settlement.decorations=[{type:'bench',farm:0,x:616,y:344}];
 const migrated=validate(s);assert.equal(migrated.money,734);assert.deepEqual(migrated.position,s.position);assert.deepEqual(migrated.plots[0],s.plots[0]);assert.deepEqual(migrated.customBeds.slice(0,2),s.customBeds);assert.deepEqual(migrated.settlement.decorations,s.settlement.decorations);
 assert.equal(migrated.customBeds.filter(b=>b.x===568&&b.y===248).length,1);assert.ok(!migrated.customBeds.some(b=>b.x===616&&b.y===344));assert.deepEqual(validate(migrated),migrated);
 const twice=structuredClone(migrated);prepareStarterBeds(twice,null,()=>false);assert.deepEqual(twice,migrated);
});
test('all growing areas and clear grass outside them accept shovel beds and seeds without Copper',()=>{
 for(const f of FIELDS.slice(1)){
  const s=newState();s.area='farm';s.selected='shovel';const p={x:f.x+24+7*48,y:f.y+24+4*48};s.position={x:p.x,y:p.y+28};
  const r=digGround(s,p);assert.ok(r.ok,r.message);assert.equal(s.money,60);assert.equal(s.ownsCopperCan,false);s.selected='seed';s.inventory.seed=1;assert.match(usePlot(s,r.index),/planted/);assert.equal(validate(s).customBeds.find(b=>b.x===p.x&&b.y===p.y).plot.crop,'tomato');
 }
 const s=newState();s.area='farm';s.selected='shovel';s.position={x:888,y:772};const r=digGround(s,{x:888,y:744});assert.ok(r.ok,r.message);assert.equal(s.energy,99);assert.equal(s.money,60);assert.equal(s.ownsCopperCan,false);s.selected='seed';s.inventory.seed=1;assert.match(usePlot(s,r.index),/planted/);assert.equal(validate(s).customBeds.find(b=>b.x===r.x&&b.y===r.y).plot.crop,'tomato');
 assert.equal(STARTER_EXTENSION.length,24);assert.equal(FARM_PLOTS.length,64);
});
