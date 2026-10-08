import test from 'node:test';
import assert from 'node:assert/strict';
import {newState,emptyPlot} from '../src/systems/state.js';
import {usePlot} from '../src/systems/farming.js';
import {nextDay,restUntilEvening} from '../src/systems/time.js';
import {cropStatus} from '../src/systems/cropStatus.js';
import {validate} from '../src/systems/save.js';
import {farmObjective,farmWaypoint} from '../src/systems/navigation.js';
import {EDGE_TRAVEL,walkable,LOCATIONS} from '../src/data/locations.js';
import {MAPS} from '../src/data/mapLayouts.js';
const plant=()=>{const s=newState();s.area='farm';s.inventory.seed=3;usePlot(s,0);s.selected='water';return s;};
test('crop status is pure, stages follow earned nights and timer agrees through a complete harvest',()=>{
 const s=plant();const before=structuredClone(s);let info=cropStatus(s,0);
 assert.deepEqual(s,before);assert.equal(info.stage,1);assert.equal(info.stages,2);assert.equal(info.remaining,1);assert.equal(info.condition,'Newly planted');assert.equal(info.need,'Needs morning water');
 assert.equal(info.plantedDay,1);assert.equal(info.plantedMinute,360);assert.equal(cropStatus(s,1),null);
 for(let night=0;night<1;night++){
  usePlot(s,0);assert.equal(cropStatus(s,0).care[0].label,'Watered');assert.equal(cropStatus(s,0).condition,'Watered for this window');
  restUntilEvening(s);assert.equal(cropStatus(s,0).need,'Needs evening water');usePlot(s,0);
  info=cropStatus(s,0);assert.equal(info.condition,'Fully watered today');assert.equal(info.next,night===0?'Ready at midnight':'Next stage at midnight');
  assert.deepEqual(cropStatus(validate(JSON.parse(JSON.stringify(s))),0),info);nextDay(s);s.area='farm';assert.equal(cropStatus(s,0).stage,night+2);assert.equal(cropStatus(s,0).remaining,0-night);
 }
 info=cropStatus(s,0);assert.equal(info.timer,'Ready to harvest');assert.equal(info.progress,1);s.selected='harvest';usePlot(s,0);assert.equal(cropStatus(s,0),null);
});
test('misses, recovery, partial days and death never promise false growth',()=>{
 const s=plant();s.minute=720;const before=structuredClone(s);let info=cropStatus(s,0);
 assert.equal(info.condition,'Wilted');assert.equal(info.timer,'Growth paused - water this crop');assert.deepEqual(s,before);
 restUntilEvening(s);usePlot(s,0);info=cropStatus(s,0);assert.equal(info.condition,'Recovering');assert.equal(info.next,'Next stage after a full care day');
 assert.deepEqual(cropStatus(validate(s),0),info);nextDay(s);assert.equal(s.plots[0].growth,0);
 s.minute=1320;info=cropStatus(s,0);assert.equal(info.dead,true);assert.equal(info.timer,'Dead crop - clear the plot');assert.equal(info.need,'');
 usePlot(s,0);assert.equal(cropStatus(s,0),null);
 const late=newState();late.minute=970;late.inventory.seed=1;usePlot(late,0);late.selected='water';usePlot(late,0);
 assert.equal(cropStatus(late,0).next,'Next stage after a full care day');nextDay(late);assert.equal(late.plots[0].growth,0);
});
test('all five save versions infer farm visits only from real evidence and preserve fresh tutorials',()=>{
 for(const version of [1,2,3,4,5]){
  const fresh=newState();fresh.version=version;delete fresh.hasVisitedFarm;assert.equal(validate(fresh).hasVisitedFarm,false);
  for(const evidence of [{area:'farm'},{area:'city'},{inventory:{seed:0,tomato:2}},{sold:2},{plots:[{...emptyPlot(),crop:'tomato'}]}])assert.equal(validate({...fresh,...evidence}).hasVisitedFarm,true);
  assert.equal(validate({...fresh,hasVisitedFarm:true}).hasVisitedFarm,true);
 }
 const s=newState();s.starterSeedsClaimed=true;assert.equal(farmObjective(s),true);s.hasVisitedFarm=true;assert.equal(farmObjective(validate(s)),false);assert.equal(newState().hasVisitedFarm,false);
});
test('waypoint uses actual transition and hides for visible exit, interior and completed visits',()=>{
 const s=newState(),view={x:0,y:0,width:1280,height:720};let w=farmWaypoint(s,view);
 const [x,y,width,height]=EDGE_TRAVEL.home.zone;assert.deepEqual(w.target,{x:x+width/2,y:y+height/2});assert.equal(w.direction,2);
 s.position.x=1000;assert.equal(farmWaypoint(s,view).direction,3);s.position.x=100;assert.equal(farmWaypoint(s,view).direction,1);
 assert.equal(farmWaypoint(s,{...view,y:500}),null);s.area='interior';assert.equal(farmWaypoint(s,view),null);s.area='home';s.hasVisitedFarm=true;assert.equal(farmWaypoint(s,view),null);
});
test('permanent signs sit beside roads with accurate small colliders and remain hints',()=>{
 const signs=MAPS.home.props.filter(p=>p.name==='farm-sign');assert.equal(signs.length,1);
 assert.ok(!MAPS.home.obstacles.some(([x,y,w,h])=>x===416&&y===1044&&w===8&&h===16));
 for(const p of signs){assert.ok(MAPS.home.obstacles.some(([x,y,w,h])=>x===p.x+20&&y===p.y+48&&w===8&&h===16));assert.ok(walkable('home',480,p.y+48));}
 assert.equal(LOCATIONS.home.interactions.filter(p=>p.label==='Farm - follow the south road').length,1);
});
test('pixel waypoint arrow tips match all eight game directions',async()=>{
 const {pixelArrow}=await import('../src/ui/statusArt.js');
 for(const [direction,tip]of [[0,[3,0]],[1,[3,3]],[2,[0,3]],[3,[-3,3]],[4,[-3,0]],[5,[-3,-3]],[6,[0,-3]],[7,[3,-3]]]){
  const cells=[];const g={fillStyle(){},fillRect(x,y){cells.push([x,y]);}};pixelArrow(g,direction,0,0,0);
  assert.ok(cells.some(([x,y])=>x===tip[0]&&y===tip[1]),'arrow tip '+direction);
 }
});
