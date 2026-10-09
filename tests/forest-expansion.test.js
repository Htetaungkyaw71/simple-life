import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FOREST_MAP,FOREST_SIZE,REGIONS,FORAGE_NODES,TREASURES,FOREST_ENTRANCE} from '../src/data/forest.js';
import {forestTree} from '../src/data/forestGrowth.js';
import {riverRow,waterAt,dryFootprint,channelRows} from '../src/data/water.js';
import {ANIMAL_SPAWNS} from '../src/data/wildlife.js';
import {WOODLAND_WILDLIFE} from '../src/data/woodlandWildlife.js';
import {terrainTiles} from '../src/art/terrainTiles.js';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';

test('eastern extension doubles area while preserving the original region and entrance coordinates',()=>{
 assert.deepEqual(FOREST_SIZE,{width:10240,height:5120});
 assert.equal(FOREST_SIZE.width*FOREST_SIZE.height,2*5120*5120);
 assert.deepEqual(FOREST_ENTRANCE,{x:640,y:4848});
 const original=['frost','highland','basalt','pride','bamboo','leopard','tiger','cheetah','guava','rhino','elephant','herds','jaguar','wolf','hyena','brush','entrance','river','canopy','snake'];
 original.forEach((id,i)=>assert.deepEqual([REGIONS[i].id,REGIONS[i].x,REGIONS[i].y],[id,(i%4)*1280,Math.floor(i/4)*1024]));
 for(let y=512;y<5120;y+=1024)for(let x=640;x<10240;x+=1280)assert.equal(REGIONS.filter(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h).length,1);
});
test('approved forest trees are moderately thinned while new habitats retain dense ground cover',()=>{
 const west=FOREST_MAP.props.filter(p=>forestTree(p)&&p.x<5120).length;
 assert.ok(west>2092*.70&&west<2092*.95,`${west} western trees`);
 assert.ok(FOREST_MAP.props.filter(p=>forestTree(p)&&p.x>=5120).length>1200,'dense eastern groves remain around river and rocky clearings');
 assert.ok(FOREST_MAP.grass.filter(g=>g.x>=5120).length>6000);
 assert.equal(FOREST_MAP.paths.length,0);assert.equal(FOREST_MAP.falls.length,0);assert.ok(FOREST_MAP.ledges.length>500);
});
test('branching river banks have crisp varying spans and connected polyline joints',()=>{
 assert.equal(FOREST_MAP.rivers.length,13);
 for(const r of FOREST_MAP.rivers){
  const rows=[...channelRows(r)].flatMap(([y,spans])=>spans.map(([x,z])=>[x,y,z-x]));
  assert.ok(new Set(rows.map(row=>row[0])).size>15,r.id);assert.ok(new Set(rows.map(row=>row[2])).size>8,r.id);
  for(const [left,y,w]of rows){assert.equal(left%2,0);assert.equal(w%2,0);assert.ok(left>=0&&left+w<=FOREST_SIZE.width);assert.ok(waterAt(FOREST_MAP,{x:left+w/2,y},false));}
  for(const [x,y]of r.points)assert.ok(waterAt(FOREST_MAP,{x,y},false),r.id+' connected joint');
 }
});
test('forest terrain covers the doubled map with GPU-safe adjacent tiles and no missing or overlapping area',()=>{
 const tiles=terrainTiles(FOREST_SIZE);assert.equal(tiles.length,6);
 assert.equal(tiles.reduce((n,t)=>n+t.w*t.h,0),FOREST_SIZE.width*FOREST_SIZE.height/4);
 assert.equal(new Set(tiles.map(t=>t.key)).size,tiles.length);
 for(const t of tiles){
  assert.ok(t.w>0&&t.h>0&&t.w<=2048&&t.h<=2048);
  assert.ok(t.x+t.w<=FOREST_SIZE.width/2&&t.y+t.h<=FOREST_SIZE.height/2);
  for(const other of tiles)if(other!==t)assert.ok(t.x+t.w<=other.x||other.x+other.w<=t.x||t.y+t.h<=other.y||other.y+other.h<=t.y);
 }
});
test('more daily fruit and small native animal groups occupy every eastern region without adding species or caches',()=>{
 assert.equal(FORAGE_NODES.length,323);assert.equal(TREASURES.length,14);
 for(const node of FORAGE_NODES)assert.ok(dryFootprint(FOREST_MAP,{x:node.x-16,y:node.y-24,w:32,h:24}),node.id);
 assert.equal(ANIMAL_SPAWNS.length,30);assert.equal(WOODLAND_WILDLIFE.length,128);
 assert.deepEqual([...new Set(WOODLAND_WILDLIFE.map(a=>a.species))].sort(),['deer','fox','grouse','hare']);
 for(const r of REGIONS.slice(20)){
  assert.equal(FORAGE_NODES.filter(n=>n.id.startsWith(r.id+'-fruit-')).length,4);
  assert.equal(WOODLAND_WILDLIFE.filter(a=>a.x>=r.x&&a.x<r.x+r.w&&a.y>=r.y&&a.y<r.y+r.h).length,4);
  const group=ANIMAL_SPAWNS.filter(a=>a.region===r.id);assert.ok(group.length===0||group.length===2);
  for(const a of group)assert.ok(dryFootprint(FOREST_MAP,{x:a.home.x-16,y:a.home.y-16,w:32,h:32}),a.id);
 }
});
test('existing schema-9 progress survives the extension and new groups initialize without revealing new regions',()=>{
 const raw=newState();raw.area='forest';raw.position={...FOREST_ENTRANCE};raw.day=7;raw.money=321;raw.inventory.mango=4;
 raw.forest.forageDay=7;raw.forest.collected=['berry-south','snake-fruit-0'];raw.forest.explored=['entrance','snake'];raw.forest.treasures=['snake-cache'];
 raw.forest.animals['boar-original'].health=1;
 raw.forest.animals['boar-snake'].health=0;raw.forest.animals['boar-snake'].defeatedDay=7;
 for(const id of Object.keys(raw.forest.animals))if(id.startsWith('east-'))delete raw.forest.animals[id];
 const s=validate(JSON.parse(JSON.stringify(raw)));
 assert.deepEqual(s.position,raw.position);assert.equal(s.money,321);assert.equal(s.inventory.mango,4);
 assert.deepEqual(s.forest.collected,raw.forest.collected);assert.deepEqual(s.forest.explored,raw.forest.explored);assert.deepEqual(s.forest.treasures,raw.forest.treasures);
 assert.equal(s.forest.animals['boar-original'].health,1);assert.equal(s.forest.animals['boar-snake'].health,0);
 assert.equal(Object.keys(s.forest.animals).length,30);
 for(const a of ANIMAL_SPAWNS.filter(a=>a.id.startsWith('east-')))assert.equal(s.forest.animals[a.id].health,3);
});
