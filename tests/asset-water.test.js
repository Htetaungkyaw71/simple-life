import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {MAPS} from '../src/data/mapLayouts.js';
import {FOREST_ENTRANCE,WATERFALLS} from '../src/data/forest.js';
import {waterRows,waterAt,riverRow} from '../src/data/water.js';
import {walkable,nearestSafe} from '../src/data/locations.js';
import {wildlifeFrame,animalDirection,WOODLAND_WILDLIFE} from '../src/data/wildlifeArt.js';
import {contextFor} from '../src/systems/context.js';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {lineClear} from '../src/systems/forest.js';
import {displace} from '../src/systems/combat.js';
test('river water is continuous across all five regions and bridges cover connected water',()=>{
 for(const river of MAPS.forest.rivers)for(let y=river.y+16;y<river.y+river.h-16;y+=2){const [left,,w]=riverRow(river,y);assert.ok(waterAt(MAPS.forest,{x:left+w/2,y},false));}
 for(const bridge of MAPS.forest.bridges){const p={x:bridge.x+bridge.w/2,y:bridge.y+bridge.h/2};assert.equal(waterAt(MAPS.forest,p),false);assert.equal(waterAt(MAPS.forest,p,false),true);assert.ok(walkable('forest',p.x,p.y));}
});
test('player crosses water directly; removed falls leave no invisible side-bank obstacles',()=>{
 const s=newState();s.area='forest';s.selected='water';const [left]=riverRow(MAPS.forest.rivers[0],1900);s.position={x:left-16,y:1900};assert.equal(contextFor(s).type,'refill');
 const p={x:2240,y:1900};displace('forest',p,280,0);assert.deepEqual(p,{x:2520,y:1900});assert.ok(lineClear('forest',{x:2240,y:1900},p));
 assert.deepEqual(WATERFALLS,[]);assert.deepEqual(MAPS.forest.falls,[]);
 assert.ok(walkable('forest',100,3344),'former west fall rock removed');assert.ok(walkable('forest',220,3344),'former east fall rock removed');
});
test('wet positions and coin bags round-trip without relocation or progress loss',()=>{
 for(const [area,p]of [['home',{x:1520,y:800}],['farm',{x:1856,y:744}],['forest',{x:2370,y:1900}]]){
  assert.ok(waterAt(MAPS[area],p));assert.ok(walkable(area,p.x,p.y));const s=newState();s.area=area;s.position=p;s.money=317;s.inventory.mango=4;s.stash={area:'forest',x:2370,y:1900,coins:44};
  const loaded=validate(JSON.parse(JSON.stringify(s)));assert.deepEqual(loaded.position,p);assert.deepEqual(loaded.stash,s.stash);assert.equal(loaded.money,317);assert.equal(loaded.inventory.mango,4);
 }
 assert.ok(walkable('forest',FOREST_ENTRANCE.x,FOREST_ENTRANCE.y));
});
test('terrain rows and wading use the same source-pixel water geometry',()=>{
 for(const map of Object.values(MAPS))for(const [x,y,w]of waterRows(map))assert.ok(waterAt(map,{x:x+w/2,y:y+1},false));
});
test('curated animation cells resolve to licensed atlas frames with correct directional identity',()=>{
 const atlas=JSON.parse(readFileSync('public/assets/pixel/processed/town.json')),manifest=JSON.parse(readFileSync('public/assets/pixel/processed/manifest.json'));
 for(const species of ['boar','fox','deer','hare','grouse'])for(const action of species==='boar'?['idle','walk','run','attack']:['idle','walk'])for(const direction of ['down','up','left','right'])for(let time=0;time<1800;time+=100){const id=wildlifeFrame(species,action,direction,time);assert.ok(atlas.frames[id],id);assert.equal(manifest.craftpixFrames[id].creator,'Craftpix');assert.ok(!manifest.originalAdditions.includes(id));}
 assert.equal(animalDirection({x:0,y:-1}),'up');assert.equal(animalDirection({x:-1,y:0}),'left');
 for(const a of WOODLAND_WILDLIFE)assert.deepEqual(nearestSafe('forest',a),{x:a.x,y:a.y},a.species);
 for(const [name,frame]of Object.entries(atlas.frames)){assert.ok(frame.frame.x+frame.frame.w<=atlas.meta.size.w,name);assert.ok(frame.frame.y+frame.frame.h<=atlas.meta.size.h,name);}
 assert.equal(readdirSync('docs/assets/licenses/craftpix').filter(n=>n.endsWith('-License.txt')).length,3);
});
