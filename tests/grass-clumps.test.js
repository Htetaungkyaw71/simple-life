import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {grassClusterLayout} from '../src/art/grassClumps.js';

test('approved clump sheet is three scale-1 48px cells',()=>{
 const data=fs.readFileSync('public/assets/pixel/processed/grass-clumps.png');
 assert.equal(data.readUInt32BE(16),144);
 assert.equal(data.readUInt32BE(20),48);
});

test('cluster layouts are fixed-seed, mixed and Poisson spaced',()=>{
 const first=grassClusterLayout('grass:grass-detail:1030:830',1046,862,0);
 const second=grassClusterLayout('grass:grass-detail:1030:830',1046,862,0);
 assert.deepEqual(first,second);
 assert.ok(first.length>=2&&first.length<=5);
 assert.ok(new Set(first.map(item=>item.variant)).size>=2);
 for(let i=0;i<first.length;i++)for(let j=i+1;j<first.length;j++){
  const distance=Math.hypot(first[i].dx-first[j].dx,first[i].dy-first[j].dy);
  assert.ok(distance>=11,{i,j,distance,first});
 }
 assert.ok(first.every(item=>Number.isInteger(item.dx)&&Number.isInteger(item.dy)));
 assert.ok(first.every(item=>typeof item.flipX==='boolean'));
});

test('cluster layout is visual-only and leaves source records untouched',()=>{
 const source=Object.freeze({id:'saved-grass-7',x:320,y:448,variant:1});
 const before=JSON.stringify(source);
 grassClusterLayout(source.id,source.x,source.y,source.variant);
 assert.equal(JSON.stringify(source),before);
});
