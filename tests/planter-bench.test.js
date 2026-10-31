import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MAPS} from '../src/data/mapLayouts.js';
import {PLANTER_BENCH} from '../src/data/planterBench.js';
import {walkable,LOCATIONS} from '../src/data/locations.js';
import {dryFootprint} from '../src/data/water.js';

test('the three retained City planter benches share approved artwork and the compact terrace arrangement',()=>{
 const frame=JSON.parse(readFileSync('public/assets/pixel/processed/planter-bench-2026-10-29.json')).frames[PLANTER_BENCH.frame].frame;
 assert.deepEqual([frame.w,frame.h],PLANTER_BENCH.nativeSize);assert.deepEqual(PLANTER_BENCH.artOffset,[-17,-12]);assert.equal(PLANTER_BENCH.scale,.9);assert.ok(frame.w>frame.h);
 const matches=Object.values(MAPS).flatMap(m=>m.props).filter(p=>p.artFrame===PLANTER_BENCH.frame);assert.equal(matches.length,3);
 assert.deepEqual(matches.map(p=>[p.x,p.y]),[[469,580],[653,580],[837,580]]);assert.ok(matches.every(p=>p.artTexture===PLANTER_BENCH.texture&&p.noShadow));
 assert.ok(matches.every(p=>p.artScale===.9&&p.artOffset===PLANTER_BENCH.artOffset&&p.artDepthOffset===PLANTER_BENCH.depthOffset));
 assert.equal(MAPS.city.props.filter(p=>p.name==='city-bench-garden'&&!p.artFrame).length,0);
});

test('new planter footprint blocks passage through the wood and preserves dry approaches and both market lanes',()=>{
 const {x,y}=MAPS.city.props.find(p=>p.artFrame===PLANTER_BENCH.frame),[ox,oy,w,h]=PLANTER_BENCH.footprint,box=[x+ox,y+oy,w,h];
 assert.ok(MAPS.city.obstacles.some(b=>JSON.stringify(b)===JSON.stringify(box)));
 assert.ok(!MAPS.city.obstacles.some(b=>JSON.stringify(b)==='[420,578,128,62]'),'old broad mask removed');
 assert.equal(walkable('city',box[0]+w/2,box[1]+h/2),false);
 for(const p of [{x:box[0]-16,y:640},{x:box[0]+w+16,y:640},{x:520,y:580},{x:520,y:732},{x:484,y:488},{x:648,y:748},LOCATIONS.city.spawn])assert.ok(walkable('city',p.x,p.y),'open approach '+JSON.stringify(p));
 assert.ok(dryFootprint(MAPS.city,{x:x+6,y:y-5,w:121,h:102}));
});
