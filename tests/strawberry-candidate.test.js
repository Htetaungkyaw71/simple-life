import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {CROPS} from '../src/data/crops.js';

const RECORD_DIR='docs/assets/licenses/strawberry-import-v1';
const SOURCE='assets-src/ChatGPT_Image_24_Oct_2026__21_21_57-pixel-snapper.png';
const EXPECTED_KEYS=['seed','sprout','young','flowering','ripe','dry','wilted','dead'].map(state=>'strawberry-'+state);
const EXPECTED_TRIMS=[[30,15],[19,11],[38,27],[41,36],[46,38],[40,35],[41,25],[38,18]];
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');

test('Strawberry review import is native, binary-alpha and bottom-centred without runtime integration',async()=>{
 const [manifest,source,evidence,candidate,debugPage]=await Promise.all([
  readFile(RECORD_DIR+'/manifest.json','utf8').then(JSON.parse),
  readFile(SOURCE),
  readFile(RECORD_DIR+'/source.png'),
  readFile(RECORD_DIR+'/candidate-b.png'),
  readFile('tomato-debug.html','utf8'),
 ]);

 assert.equal(hash(source),'8a1b78c74396cb4dd0a9acd6718fde236ad9636e0852f02351075be57c40f4bf');
 assert.equal(hash(evidence),hash(source));
 assert.equal(hash(candidate),'ae88b004cb85efbc7fd53df7e667c12760c08f80c60d49d1da23aee1bbbcccfb');
 assert.deepEqual(manifest.sourceSize,[361,121]);
 assert.equal(manifest.sourceUniqueColors,16);
 assert.equal(manifest.grid.nativePixelGrid,true);
 assert.equal(manifest.candidateA.available,false);
 assert.deepEqual(manifest.candidateB.frameSize,[48,38]);
 assert.deepEqual(manifest.candidateB.maxTrimmedStage,[46,38]);
 assert.equal(manifest.candidateB.uniqueOpaqueColors,14);
 assert.deepEqual(manifest.cleanup.alphaValues,[0,255]);
 assert.equal(manifest.cleanup.colorsRepainted,0);
 assert.deepEqual(manifest.keys,EXPECTED_KEYS);
 assert.deepEqual(manifest.candidateB.placements.map(({trimmedWidth,trimmedHeight})=>[trimmedWidth,trimmedHeight]),EXPECTED_TRIMS);
 for(const placement of manifest.candidateB.placements){
  assert.equal(placement.anchorX,24);
  assert.equal(placement.anchorY,37);
 }

 assert.equal(CROPS.strawberry.visualScale,2,'runtime Strawberry scale stays unchanged before approval');
 assert.equal(CROPS.strawberry.signOffsetY,-54,'existing runtime sign offset stays unchanged before approval');
 assert.match(debugPage,/strawberry-import-v1\/candidate-b\.png/);
 assert.match(debugPage,/Strawberry 1× \/ Tomato 1× \/ Carrot 2×/);
 assert.match(debugPage,/proposedSignOffsetY=-54/);
});
