import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FOREST_LEAF_TONES,forestLeafColor} from '../src/art/forestPalette.js';
import {nightBands} from '../src/art/nightBands.js';
import {FOREST_MAP} from '../src/data/forest.js';
import {waterAt,riverRow} from '../src/data/water.js';
import {walkable} from '../src/data/locations.js';
test('mixed green foliage shares muted olive shades while bark, fruit and neutral snow stay intact',()=>{
 for(const c of [[20,60,42],[63,132,123],[97,191,169],[168,207,153]])assert.ok(FOREST_LEAF_TONES.some(p=>p.every((v,i)=>v===forestLeafColor(...c)[i])));
 for(const c of [[130,79,53],[205,74,60],[231,214,158],[200,203,202]])assert.deepEqual(forestLeafColor(...c),c);
 for(const c of FOREST_LEAF_TONES){assert.ok(c[1]>=c[0]);assert.ok(c[2]<c[0]);}
});
test('bridge decks fully span bending water, meet dry land and remain traversable across their length',()=>{
 for(const b of FOREST_MAP.bridges){
  for(let y=b.y+8;y<b.y+b.h-8;y+=8)for(let x=b.x+12;x<b.x+b.w-12;x+=8){assert.ok(walkable('forest',x,y),b.river);assert.equal(waterAt(FOREST_MAP,{x,y}),false);}
  if(b.axis==='vertical')for(let x=b.x+8;x<b.x+b.w-8;x+=8){assert.equal(waterAt(FOREST_MAP,{x,y:b.y+4},false),false);assert.equal(waterAt(FOREST_MAP,{x,y:b.y+b.h-4},false),false);}
  else for(let y=b.y+8;y<b.y+b.h-8;y+=8){assert.equal(waterAt(FOREST_MAP,{x:b.x+4,y},false),false);assert.equal(waterAt(FOREST_MAP,{x:b.x+b.w-4,y},false),false);}
 }
});
test('night shading has complete nonoverlapping coverage and merges equal opacity cells',()=>{
 const bounds={left:0,top:0,right:640,bottom:384,cx:320,cy:192,radius:208},bands=nightBands(bounds);
 assert.ok(bands.length<100);
 for(let y=8;y<384;y+=16)for(let x=8;x<640;x+=16){const hit=bands.filter(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h);assert.equal(hit.length,1);}
 assert.equal(bands.find(r=>320>=r.x&&320<r.x+r.w&&192>=r.y&&192<r.y+r.h).alpha,.28);
 assert.equal(bands.find(r=>8>=r.x&&8<r.x+r.w&&8>=r.y&&8<r.y+r.h).alpha,1);
 assert.deepEqual(nightBands({...bounds,radius:0}),[{x:0,y:0,w:640,h:384,alpha:1}]);
});
