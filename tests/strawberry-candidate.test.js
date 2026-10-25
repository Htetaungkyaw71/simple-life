import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {CROPS} from '../src/data/crops.js';

const RECORD_DIR='docs/assets/licenses/strawberry-import-v1';
const EXPECTED_KEYS=['seed','sprout','young','flowering','ripe','dry','wilted','dead'].map(state=>'strawberry-'+state);

test('Strawberry sheet is installed natively with data-driven presentation metadata',async()=>{
 const [manifest,atlas]=await Promise.all([
  readFile(RECORD_DIR+'/manifest.json','utf8').then(JSON.parse),
  readFile('public/assets/pixel/processed/town.json','utf8').then(JSON.parse),
 ]);

 assert.deepEqual(manifest.sourceSize,[361,121]);
 assert.equal(manifest.sourceUniqueColors,16);
 assert.equal(manifest.grid.nativePixelGrid,true);
 assert.deepEqual(manifest.candidateB.frameSize,[46,47]);
 assert.deepEqual(manifest.candidateB.maxTrimmedStage,[46,47]);
 assert.equal(manifest.candidateB.uniqueOpaqueColors,16);
 assert.deepEqual(manifest.cleanup.alphaValues,[0,255]);
 assert.equal(manifest.cleanup.colorsRepainted,0);
 assert.deepEqual(manifest.keys,EXPECTED_KEYS);
 for(const key of EXPECTED_KEYS){
  assert.ok(atlas.frames[key],key);
  assert.deepEqual(atlas.frames[key].sourceSize,{w:46,h:47},key);
 }

 assert.equal(CROPS.strawberry.visualScale,1);
 assert.equal(CROPS.strawberry.signOffsetY,-63);
});
