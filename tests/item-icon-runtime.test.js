import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {decodeRgbaPng} from './helpers/png.js';
import {ITEM_ICON_FRAME_SIZE,ITEM_ICON_KEYS,ITEM_ICON_DISPLAY_SCALES} from '../src/data/itemIconArt.js';

const cleanupReferences=[[254,3,253],[255,0,255]];
const isCleanupColor=([r,g,b,a])=>Boolean(a&&cleanupReferences.some(reference=>Math.max(Math.abs(r-reference[0]),Math.abs(g-reference[1]),Math.abs(b-reference[2]))<=4));

test('every replaced item key exists with binary alpha and no detected magenta',()=>{
 const atlas=JSON.parse(readFileSync('public/assets/pixel/processed/town.json','utf8'));
 const png=decodeRgbaPng(readFileSync('public/assets/pixel/processed/town.png'));
 assert.equal(ITEM_ICON_FRAME_SIZE,24);
 assert.equal(new Set(ITEM_ICON_KEYS).size,ITEM_ICON_KEYS.length);
 for(const key of ITEM_ICON_KEYS){
  const frame=atlas.frames[key]?.frame;
  assert.ok(frame,`missing ${key}`);
  assert.deepEqual([frame.w,frame.h],[24,24],`${key} frame size`);
  assert.ok([.45,.5,.6,.65,1].includes(ITEM_ICON_DISPLAY_SCALES[key]),`${key} nearest-neighbor display scale`);
  let opaque=0;
  for(let y=frame.y;y<frame.y+frame.h;y++)for(let x=frame.x;x<frame.x+frame.w;x++){
   const at=(y*png.width+x)*4,pixel=[png.data[at],png.data[at+1],png.data[at+2],png.data[at+3]];
   assert.ok(pixel[3]===0||pixel[3]===255,`${key} non-binary alpha ${pixel[3]}`);
   assert.equal(isCleanupColor(pixel),false,`${key} retains a recorded background color at ${x-frame.x},${y-frame.y}`);
   opaque+=pixel[3]===255;
  }
  assert.ok(opaque>0,`${key} is empty`);
 }
});

test('green pepper remains unmapped and repaired cucumber uses its established keys',()=>{
 assert.equal(ITEM_ICON_KEYS.includes('greenPepper-item'),false);
 assert.equal(ITEM_ICON_KEYS.includes('greenPepper-seed-item'),false);
 assert.equal(ITEM_ICON_KEYS.includes('cucumber-item'),true);
 assert.equal(ITEM_ICON_KEYS.includes('cucumber-seed-item'),true);
});

test('purple fruit cleanup keeps at least 85 percent of every named source icon',()=>{
 const produce=JSON.parse(readFileSync('docs/assets/licenses/item-icons-crop-produce-v1/manifest.json','utf8'));
 const fruit=JSON.parse(readFileSync('docs/assets/licenses/item-icons-fruit-tab-v1/manifest.json','utf8'));
 for(const [manifest,positions]of [[produce,[6,10,11]],[fruit,[2,9,12]]])for(const position of positions){
  const icon=manifest.icons[position-1];
  assert.ok(icon.retainedPercent>=85,`${icon.label} retained ${icon.retainedPercent}%`);
  assert.equal(icon.retainedOpaquePixels<=icon.sourceOpaquePixels,true,icon.label);
 }
});

test('generated repair sheet is snapped, filled and mapped without magenta',()=>{
 const manifest=JSON.parse(readFileSync('docs/assets/licenses/item-icon-repair-v1/manifest.json','utf8'));
 assert.deepEqual(manifest.frameSize,[24,24]);
 assert.deepEqual(manifest.icons.map(icon=>icon.itemKey),['cucumber-seed-item','cucumber-item','grape-item','wild-berry-item']);
 for(const icon of manifest.icons){
  assert.deepEqual(icon.alphaValues,[0,255],icon.label);
  assert.deepEqual(icon.magentaColors,[],icon.label);
  assert.ok(icon.opaquePixels>0,icon.label);
 }
 assert.ok(manifest.icons[1].principalAxisRatio>=3,'cucumber must remain visibly slender');
});
