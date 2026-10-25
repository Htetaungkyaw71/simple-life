import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {PIXEL_SNAPPER_ART,PIXEL_SNAPPER_HOME_ART,PIXEL_SNAPPER_OVERRIDES} from '../src/data/pixelSnapperArt.js';
import {FURNITURE} from '../src/data/interior.js';
import {MAPS} from '../src/data/mapLayouts.js';

const atlas=JSON.parse(readFileSync('public/assets/pixel/processed/pixel-snapper-assets.json'));
const audit=JSON.parse(readFileSync('output/art/pixel-snapper-assets-v1/art-audit.json'));
const sha=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
test('forty-six retained sources stay native while the replaced grass adds two same-size bend frames',()=>{
 assert.deepEqual(atlas.meta.size,{w:2048,h:2048});assert.equal(audit.assets.length,47);assert.equal(Object.keys(atlas.frames).length,49);
 for(const item of audit.assets){const frame=atlas.frames[item.id].frame,art=PIXEL_SNAPPER_ART[item.id];assert.deepEqual([frame.w,frame.h],item.dimensions);assert.deepEqual([art.width,art.height],item.dimensions);assert.equal(sha(item.source),item.sha256);assert.equal(item.nativePixelsUnchanged,true);assert.equal(item.alpha.transparent,true);assert.equal(art.texture,'pixelSnapper');}
 assert.ok(Object.values(PIXEL_SNAPPER_HOME_ART).every(a=>a.texture==='pixelSnapper'));
 assert.ok(['home-storage-jar','home-threshold'].every(name=>FURNITURE.some(([n])=>n===name)));
 assert.ok(!MAPS.city.props.some(p=>p.name==='city-campfire'));
 assert.equal(PIXEL_SNAPPER_HOME_ART['home-fire'].frame,'snapper-fire-small');
 assert.equal(PIXEL_SNAPPER_HOME_ART['home-logs'].frame,'snapper-home-wood-pile');
 assert.deepEqual([PIXEL_SNAPPER_ART['snapper-home-wood-pile'].width,PIXEL_SNAPPER_ART['snapper-home-wood-pile'].height],[1448,1086]);
 assert.ok(!atlas.frames['snapper-sign']);
 assert.deepEqual([PIXEL_SNAPPER_ART['snapper-wood-item'].width,PIXEL_SNAPPER_ART['snapper-wood-item'].height],[133,101]);
 assert.equal(PIXEL_SNAPPER_OVERRIDES['wood-item'].frame,'snapper-wood-item');
 for(const id of ['snapper-grass','snapper-grass-bend-left','snapper-grass-bend-right'])assert.deepEqual([atlas.frames[id].frame.w,atlas.frames[id].frame.h],[79,79]);
 for(const id of ['snapper-clothing-rack-v3','snapper-clothing-cabinet','snapper-clothing-counter','snapper-clothing-fitting-corner','snapper-clothing-mirror','snapper-clothing-display-table','snapper-barber-worktop','snapper-barber-coat-hooks','snapper-barber-storage'])assert.ok(atlas.frames[id],id);
});
