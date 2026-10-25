import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {CITY_FOUNTAIN_ISLAND} from '../src/data/cityFountainIsland.js';
import {walkable} from '../src/data/locations.js';

const file='public/assets/pixel/processed/fountain-island.png';
const png=readFileSync(file);
const uint32=offset=>png.readUInt32BE(offset);
const report=JSON.parse(readFileSync('docs/assets/licenses/fountain-island-water-v5/animation_report.json','utf8'));

test('user fountain island is the exact verified eight-frame water-only runtime sheet',()=>{
 assert.equal(png.subarray(1,4).toString(),'PNG');
 assert.deepEqual([uint32(16),uint32(20)],[1656,214]);
 assert.equal(createHash('sha256').update(png).digest('hex'),'805871dcd04f4ba49d6bd4c240388dd0acc1731dbcccbe94ca71c78f2c55543d');
 assert.deepEqual(CITY_FOUNTAIN_ISLAND.frameSize,[207,214]);
 assert.equal(CITY_FOUNTAIN_ISLAND.frames,8);assert.equal(CITY_FOUNTAIN_ISLAND.fps,8);
 assert.deepEqual(CITY_FOUNTAIN_ISLAND.center,[704,420]);
 assert.deepEqual(CITY_FOUNTAIN_ISLAND.position,[565,276]);
 assert.equal(CITY_FOUNTAIN_ISLAND.scale,1.35);
 assert.deepEqual(CITY_FOUNTAIN_ISLAND.visibleBounds,[36,44,170,170]);
});

test('water animation evidence proves mask, palette, budget and loop checks',()=>{
 assert.deepEqual(report.frameSize,[207,214]);
 assert.deepEqual(report.sheetSize,[1656,214]);
 assert.equal(report.frames,8);assert.equal(report.fps,8);
 assert.equal(report.maskTouchesExcludedPixels,false);
 assert.deepEqual(report.landingPoints,[[82,109],[102,85],[124,109]]);
 assert.deepEqual(report.topJetTip,[102,73]);
 assert.deepEqual(report.ringRadii,[2,4,6]);
 assert.ok(report.changedPercentFromBase.every(value=>value<=3));
 assert.ok(report.outsideMaskChanges.every(value=>value===0));
 assert.ok(report.rimGuardChanges.every(value=>value===0));
 assert.ok(report.newPaletteColours.every(value=>value===0));
 assert.ok(report.maximumChangedPaleComponent.every(value=>value<=12));
 assert.equal(report.checks.loopSeamSimilar,true);
 assert.equal(report.checks.transitionsSimilar,true);
});

test('the whole visible fountain island is solid while its transparent corners stay open',()=>{
 for(const point of [[704,420],[636,420],[772,420],[704,354],[704,486]])assert.equal(walkable('city',...point),false,point.join(','));
 for(const point of [[588,310],[820,310],[588,530],[820,530]])assert.equal(walkable('city',...point),true,point.join(','));
 assert.equal(CITY_FOUNTAIN_ISLAND.solidRows.length,9);
});
