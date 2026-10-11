import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FOREST_MAP,TREASURES,REGIONS} from '../src/data/forest.js';
import {forestTree} from '../src/data/forestGrowth.js';
import {forestLeafColor,FOREST_LEAF_TONES} from '../src/art/forestPalette.js';
import {paintGround} from '../src/art/groundSurface.js';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {walkable} from '../src/data/locations.js';

test('reference forest has broad original crowns, full palms and three overlapping foliage layers',()=>{
 const atlas=JSON.parse(readFileSync('public/assets/pixel/processed/town.json'));
 for(const name of ['forest-oak-0','forest-oak-1','forest-oak-2','forest-palm-0','forest-palm-1','forest-palmetto-0','forest-palmetto-1'])assert.ok(atlas.frames[name]);
 assert.ok(FOREST_MAP.props.filter(forestTree).length>2000);
 assert.ok(FOREST_MAP.props.filter(p=>p.name.startsWith('forest-palmetto-')).length>100);
 assert.ok(FOREST_MAP.grass.length>7000);
 assert.deepEqual(forestLeafColor(52,52,79),FOREST_LEAF_TONES[0],'forest-only outlines use olive ink');
 const r=REGIONS.find(r=>r.id==='leopard'),grass=FOREST_MAP.grass.filter(g=>g.x>r.x&&g.x<r.x+r.w&&g.y>r.y&&g.y<r.y+r.h);
 assert.ok(new Set(grass.map(g=>g.y%24)).size>20,'clumps avoid repeated horizontal rows');
});
test('moss and bare-soil pockets are coherent deterministic forest-only ground materials',()=>{
 const w=512,h=512,a=new Uint8ClampedArray(w*h*4),b=new Uint8ClampedArray(a.length),home=new Uint8ClampedArray(a.length);
 const regions=[{x:0,y:0,w:w*2,h:h*2,biome:'wood'}],f=paintGround(a,w,h,regions),g=paintGround(b,w,h,regions),old=paintGround(home,w,h);
 assert.deepEqual(a,b);assert.deepEqual(f.soil,g.soil);assert.ok(!old.soil.some(Boolean),'Home/Farm ground gains no forest soil patches');
 const soil=f.soil.reduce((n,v)=>n+v,0);assert.ok(soil>w*h*.05&&soil<w*h*.4);
 let joined=0;for(let i=w;i<f.soil.length-1;i++)if(f.soil[i]&&(f.soil[i-1]||f.soil[i-w]))joined++;
 assert.ok(joined>soil*.95,'soil forms pockets, not isolated noise pixels');
 for(let i=3;i<a.length;i+=4)assert.equal(a[i],255);
});
test('roster cleanup preserves farm progress, injured original boar and all saved cache/discovery IDs',()=>{
 const raw=newState();raw.area='forest';raw.position={x:640,y:4848};raw.money=432;raw.day=5;raw.minute=720;raw.inventory.mango=8;raw.forest.animals['boar-original'].health=1;raw.forest.animals['wolf-0']={id:'wolf-0',species:'wolf',health:2,position:{x:2200,y:3400},defeatedDay:0};raw.forest.treasures=TREASURES.map(t=>t.id);raw.forest.explored=REGIONS.map(r=>r.id);raw.stash={area:'forest',x:640,y:4848,coins:108};raw.plots[0]={...raw.plots[0],crop:'tomato',growth:2};
 const saved=validate(JSON.parse(JSON.stringify(raw)));
 assert.equal(saved.money,432);assert.equal(saved.day,5);assert.equal(saved.minute,720);assert.equal(saved.inventory.mango,8);assert.equal(saved.plots[0].growth,2);assert.equal(saved.forest.boar.health,1);assert.equal(saved.forest.animals['wolf-0'],undefined);assert.deepEqual(saved.forest.treasures,raw.forest.treasures);assert.deepEqual(saved.forest.explored,raw.forest.explored);assert.equal(saved.stash.coins,108);assert.ok(walkable('forest',saved.position.x,saved.position.y));assert.equal(saved.version,18);
});
