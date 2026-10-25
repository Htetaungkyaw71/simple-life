import test from 'node:test';
import assert from 'node:assert/strict';
import {MAPS} from '../src/data/mapLayouts.js';
import {PLANTER_BENCH} from '../src/data/planterBench.js';
import {PIXEL_SNAPPER_ART,PIXEL_SNAPPER_OVERRIDES} from '../src/data/pixelSnapperArt.js';
import {CITY_FOUNTAIN_ISLAND} from '../src/data/cityFountainIsland.js';

test('reviewed road furniture and storage positions are clean and reachable',()=>{
 assert.equal(Object.values(MAPS).flatMap(map=>map.props).filter(p=>['sign','road-sign','farm-sign'].includes(p.name)).length,0);
 assert.deepEqual(MAPS.city.signs.find(s=>s.type==='aid'),{type:'aid',x:1024,y:624,label:'Read seed-aid board'});
 assert.ok(MAPS.city.props.some(p=>p.name==='notice'&&p.x===976&&p.y===560));
 assert.deepEqual(MAPS.city.props.filter(p=>p.name==='barrel').map(p=>[p.x,p.y]),[[304,248]]);
 assert.ok(!MAPS.city.props.some(p=>p.name==='barrel'&&p.x>=1904&&p.x<=2480&&p.y>=736&&p.y<=960));
 assert.ok(MAPS.home.props.some(p=>p.name==='barrel'&&p.x===1432&&p.y===416));
 assert.ok(MAPS.home.props.some(p=>p.name==='crate'&&p.x===1560&&p.y===448));
 assert.equal(MAPS.home.props.filter(p=>p.name==='bench').length,0,'reviewed outdoor chair/bench is removed from Home');
});

test('reviewed furniture, pots and fountain use the revised visual layout',()=>{
 assert.equal(PLANTER_BENCH.scale,.56);
 assert.equal(PIXEL_SNAPPER_ART['snapper-bench'].scale,.72);
 assert.equal(PIXEL_SNAPPER_ART['snapper-flowerpot'].scale,.65);
 const fountain=MAPS.city.props.find(p=>p.name==='city-fountain0');
 assert.deepEqual([fountain.x,fountain.y],CITY_FOUNTAIN_ISLAND.position);
 assert.equal(fountain.noShadow,true);
 assert.deepEqual(CITY_FOUNTAIN_ISLAND.center,[704,420]);
 assert.equal(CITY_FOUNTAIN_ISLAND.scale,1.35);
 const pots=MAPS.city.props.filter(p=>p.name==='city-flower-display');
 assert.equal(pots.length,0,'the complete island sheet already contains its planters');
 assert.equal(MAPS.city.props.filter(p=>p.name==='city-flowerpot').length,0);
 assert.equal(MAPS.city.props.filter(p=>p.name==='planter').length,0);
 assert.equal(MAPS.city.props.filter(p=>p.name==='city-cafe-furniture').length,0);
 assert.equal(MAPS.city.props.filter(p=>p.name==='city-campfire').length,0);
});

test('seven new vegetation sources replace matching world art at established heights',()=>{
 for(const id of ['snapper-tree-broadleaf','snapper-tree-tall','snapper-tree-palm','snapper-grass','snapper-bush-new','snapper-tree-sparse','snapper-tree-snow'])assert.ok(PIXEL_SNAPPER_ART[id],id);
 for(const logical of ['forest-oak-0','forest-oak-1','forest-oak-2','forest-palm-0','forest-palm-1','willow-tree','env-pine-olive','env-pine-snow','nature-fruit-guava','nature-fruit-mango','nature-sapling','nature-young-fruit','nature-bush-small','grass-detail','dry-grass','snow-grass'])assert.ok(PIXEL_SNAPPER_OVERRIDES[logical],logical);
 const visibleHeight=id=>{const a=PIXEL_SNAPPER_ART[id];return (a.visibleBounds[3]-a.visibleBounds[1])*a.scale;};
 assert.ok(Math.abs(visibleHeight('snapper-tree-broadleaf')-224)<1);
 assert.ok(Math.abs(visibleHeight('snapper-tree-tall')-224)<1);
 assert.ok(Math.abs(visibleHeight('snapper-tree-palm')-256)<1);
 assert.ok(Math.abs(visibleHeight('snapper-tree-snow')-228)<1);
});
