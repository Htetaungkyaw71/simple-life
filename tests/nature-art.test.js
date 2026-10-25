import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {treeVisual,groundPlantVisual} from '../src/art/treeVisual.js';
import {NATURE_TREE_ORIGINS} from '../src/data/natureArt.js';
import {MAPS} from '../src/data/mapLayouts.js';
import {isTree} from '../src/data/vegetation.js';
const meta=JSON.parse(readFileSync('public/assets/pixel/processed/town.json'));
test('every map tree resolves a local native frame with a registered trunk origin and unchanged map coordinates',()=>{
 for(const [area,map] of Object.entries(MAPS))for(const p of map.props.filter(isTree)){
  const position={x:p.x,y:p.y},v=treeVisual(p,area==='forest'&&p.name==='snow-pine'?'snow':'');assert.ok(meta.frames[v.frame],v.frame);assert.ok(v.originX>.25&&v.originX<.75,v.frame);assert.deepEqual({x:p.x,y:p.y},position);
 }
 assert.equal(treeVisual({name:'guava-tree',x:0,y:0}).frame,'nature-fruit-guava');assert.equal(treeVisual({name:'mango-tree',x:0,y:0}).frame,'nature-fruit-mango');assert.equal(treeVisual({name:'palm-tree',x:0,y:0},'snow').frame,'env-pine-snow');assert.notEqual(NATURE_TREE_ORIGINS['forest-palm-0'],.5,'asymmetric palm aligns its root instead of canopy centre');
});
test('native grass retains all bend and habitat frames; new fruit frames fit the existing allowlisted atlas',()=>{
 for(let variant=0;variant<3;variant++)for(let bend=0;bend<3;bend++)for(const theme of ['','dry-','snow-'])assert.deepEqual([meta.frames[`tall-grass-${theme}${variant}-${bend}`].frame.w,meta.frames[`tall-grass-${theme}${variant}-${bend}`].frame.h],[24,24]);
 const bytes=readFileSync('public/assets/pixel/processed/town.png');assert.equal(bytes.readUInt32BE(16),meta.meta.size.w);assert.equal(bytes.readUInt32BE(20),meta.meta.size.h);
 for(const name of ['nature-fruit-guava','nature-fruit-mango']){const f=meta.frames[name].frame;assert.ok(f.x+f.w<=meta.meta.size.w&&f.y+f.h<=meta.meta.size.h);assert.equal(f.h,112);}
});

test('rejected palmetto/fern designs resolve only to leafy bushes and common trees include two smaller forms',()=>{
 for(const name of ['fern','forest-palmetto-0','forest-palmetto-1'])for(let n=0;n<20;n++){const v=groundPlantVisual({name,x:n*16,y:80});assert.ok(v.frame.startsWith('nature-bush-'));assert.ok(meta.frames[v.frame]);}
 const kinds=new Set(Array.from({length:40},(_,n)=>treeVisual({name:'tree',x:n*32,y:0}).frame));assert.ok(kinds.has('nature-sapling'));assert.ok(kinds.has('nature-young-fruit'));assert.ok(meta.frames['nature-sapling'].frame.h<meta.frames['forest-oak-0'].frame.h);
});
