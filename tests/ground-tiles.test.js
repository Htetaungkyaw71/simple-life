import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {GROUND_SEED,GROUND_TILE_KEYS,LAWN_PALETTE,groundBlobField} from '../src/art/groundTiles.js';

test('corrected lawn tiles are local 128px PNG assets',()=>{
 assert.deepEqual(GROUND_TILE_KEYS,['grassGroundA','grassGroundB','grassGroundC']);
 assert.deepEqual(LAWN_PALETTE,['#6C7749','#798455','#859056','#8C9564','#939C67','#9EA66B']);
 for(const suffix of ['a','b','c'])assert.equal(fs.existsSync(`public/assets/pixel/processed/grass-ground-${suffix}.png`),true);
});

test('world-space dark pockets are deterministic and cover 15-20 percent',()=>{
 const options={cell:94,chance:40,minRadius:20,maxRadius:60,salt:GROUND_SEED+200};
 const first=groundBlobField(1536,1536,options),second=groundBlobField(1536,1536,options);
 assert.deepEqual(first,second);
 const coverage=first.reduce((total,value)=>total+value,0)/first.length*100;
 assert.ok(coverage>=15&&coverage<=20,coverage);
});
