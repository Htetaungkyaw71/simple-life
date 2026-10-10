import {test} from 'node:test';
import assert from 'node:assert/strict';
import {forestHabitat,HABITATS,habitatColor} from '../src/data/forestHabitats.js';
import {FOREST_MAP,REGIONS,FORAGE_NODES,TREASURES,BOAR_TERRITORY} from '../src/data/forest.js';
import {forestTree} from '../src/data/forestGrowth.js';
import {dryFootprint} from '../src/data/water.js';
import {walkable} from '../src/data/locations.js';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {tick} from '../src/systems/time.js';
import {attack,combatRuntime} from '../src/systems/combat.js';
import {jumpRuntime,beginJump,stepJump} from '../src/systems/jump.js';
import {axeSwingPose} from '../src/entities/HeldWateringCan.js';
import {WOODLAND_WILDLIFE} from '../src/data/woodlandWildlife.js';

test('seven broad reference habitats use irregular boundaries independent of discovery boxes',()=>{
 const count=FOREST_MAP.props.filter(forestTree).length;assert.ok(count>4070*.65&&count<4070*.85,'open river/landmark clearings with dense groves retained');
 assert.equal(HABITATS.length,7);assert.equal(REGIONS.length,40);
 for(const h of HABITATS){assert.equal(forestHabitat(h).id,h.id);assert.equal(habitatColor(h).length,3);}
 assert.equal(forestHabitat({x:640,y:4848}).id,'easyRainforest');
 const edges=[];for(let y=100;y<4300;y+=350){let x=100;while(x<2500&&forestHabitat({x,y}).id==='snow')x+=16;edges.push(x);}
 assert.ok(new Set(edges).size>6,'western snowy edge curves instead of following discovery tiles');
 assert.equal(forestHabitat({x:1280-2,y:2600}).id,forestHabitat({x:1280+2,y:2600}).id);
});
test('earth shelves keep dry faces, safe approaches, crossway gaps and working jumps',()=>{
 assert.ok(FOREST_MAP.terraces.length>=65);
 const [bx,by,bw,bh]=BOAR_TERRITORY;assert.ok(!FOREST_MAP.ledges.some(l=>l.x+l.w>bx&&l.x<bx+bw&&l.y+l.h>=by&&l.y<=by+bh),'the original tutorial boar clearing stays open');
 for(const b of FOREST_MAP.terraces)for(let i=1;i<b.segments.length;i++){const a=b.segments[i-1],c=b.segments[i];if(c.x-a.x===32)assert.ok(Math.abs(c.y-a.y)<=32,'adjacent stepped faces overlap into continuous ridges');}
 for(const l of FOREST_MAP.ledges){assert.equal(l.h,48);assert.ok(dryFootprint(FOREST_MAP,{x:l.x-24,y:l.y-144,w:80,h:224}),l.terrace);}
 const l=FOREST_MAP.ledges.find(l=>walkable('forest',l.x+16,l.y-16)&&walkable('forest',l.x+16,l.y+64)&&!walkable('forest',l.x+16,l.y+16));assert.ok(l);
 const s=Object.assign(newState(),{area:'forest',position:{x:l.x+16,y:l.y-16}}),r=jumpRuntime();
 assert.equal(beginJump(s,r,{x:0,y:1}),true);for(let i=0;i<12;i++)stepJump(s,r,50);
 assert.ok(s.position.y>l.y+32);assert.ok(walkable('forest',s.position.x,s.position.y));
 for(const n of [...FORAGE_NODES,...TREASURES])assert.ok(walkable('forest',n.x,n.y),n.id);
 for(const a of WOODLAND_WILDLIFE)assert.ok(dryFootprint(FOREST_MAP,{x:a.x-16,y:a.y-24,w:32,h:32}),a.id);
});
test('old discovery, food, cache and animal progress survives while extra animals initialize',()=>{
 const s=newState();s.forest.explored=['entrance','snake'];s.forest.collected=['berry-south','snake-fruit-0'];s.forest.treasures=['snake-cache'];s.forest.woodland[WOODLAND_WILDLIFE[0].id].health=0;s.forest.woodland[WOODLAND_WILDLIFE[0].id].defeatedDay=s.day;
 for(const a of WOODLAND_WILDLIFE.slice(48))delete s.forest.woodland[a.id];
 const loaded=validate(JSON.parse(JSON.stringify(s)));assert.deepEqual(loaded.forest.collected,s.forest.collected);assert.deepEqual(loaded.forest.explored,s.forest.explored);assert.deepEqual(loaded.forest.treasures,s.forest.treasures);
 assert.equal(loaded.forest.woodland[WOODLAND_WILDLIFE[0].id].health,0);assert.equal(Object.keys(loaded.forest.woodland).length,128);
});
test('idle clock and midnight never drain energy, and an empty axe swing is free even at zero energy',()=>{
 const s=newState();s.energy=37;s.minute=1439;s.fatigueMinutes=59.9;
 for(let i=0;i<1000;i++)tick(s,100);assert.equal(s.energy,37);assert.equal(s.day,2);assert.equal(s.fatigueMinutes,0);
 s.selected='axe';s.area='home';s.energy=0;const r=combatRuntime();assert.equal(attack(s,r,'right').ok,true);assert.equal(s.energy,0);assert.equal(attack(s,r,'right').ok,false,'free misses still obey cooldown');
});
test('axe lifts slowly, cuts quickly and recovers into the mirrored reference pose',()=>{
 for(const direction of ['left','right','up','down']){
  const idle=axeSwingPose(direction,0),lift=axeSwingPose(direction,320),cut=axeSwingPose(direction,190),recover=axeSwingPose(direction,20);
  assert.equal(axeSwingPose(direction,420).rotation,idle.rotation);assert.notEqual(lift.rotation,idle.rotation);assert.notEqual(cut.rotation,lift.rotation);
  assert.ok(Math.abs(recover.rotation-idle.rotation)<Math.abs(cut.rotation-idle.rotation));assert.ok(cut.reach>0);
 }
 assert.equal(axeSwingPose('left',200).rotation-Math.PI,-(axeSwingPose('right',200).rotation-Math.PI));
});
