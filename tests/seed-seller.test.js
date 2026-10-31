import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MERCHANT_RESIDENTS} from '../src/data/residents.js';
import {residentVisual} from '../src/data/matchingNpcs.js';

test('Clara uses the allowlisted transparent 3x6 seed-seller rig',()=>{
 const clara=MERCHANT_RESIDENTS.find(n=>n.id==='clara');
 assert.ok(clara);assert.equal(clara.kind,'seed');assert.equal(clara.spriteSheet,'seed-seller');
 assert.equal(clara.x,432);assert.equal(clara.y,306);assert.equal(clara.home,3);
 const rig=residentVisual(clara);
 assert.equal(rig.columns,6);assert.deepEqual(rig.walkFrames,[4,4,4]);assert.deepEqual(rig.sitFrames,[5,5,5]);
 const png=readFileSync('public/assets/pixel/processed/seed-seller.png');
 assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
 assert.equal(png.readUInt32BE(16),384);assert.equal(png.readUInt32BE(20),192);
 assert.equal(png[24],8);assert.equal(png[25],6,'runtime sheet must be RGBA');
});
