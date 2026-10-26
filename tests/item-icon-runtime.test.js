import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {decodeRgbaPng} from './helpers/png.js';
import {ITEM_ICON_FRAME_SIZE,ITEM_ICON_KEYS,ITEM_ICON_DISPLAY_SCALES} from '../src/data/itemIconArt.js';

const isMagenta=([r,g,b,a])=>Boolean(a&&r>=100&&b>=80&&r>g*2&&b>g*2&&Math.abs(r-b)<=70);

test('every replaced item key exists with binary alpha and no detected magenta',()=>{
 const atlas=JSON.parse(readFileSync('public/assets/pixel/processed/town.json','utf8'));
 const png=decodeRgbaPng(readFileSync('public/assets/pixel/processed/town.png'));
 assert.equal(ITEM_ICON_FRAME_SIZE,24);
 assert.equal(new Set(ITEM_ICON_KEYS).size,ITEM_ICON_KEYS.length);
 for(const key of ITEM_ICON_KEYS){
  const frame=atlas.frames[key]?.frame;
  assert.ok(frame,`missing ${key}`);
  assert.deepEqual([frame.w,frame.h],[24,24],`${key} frame size`);
  assert.equal(ITEM_ICON_DISPLAY_SCALES[key],1,`${key} integer display scale`);
  let opaque=0;
  for(let y=frame.y;y<frame.y+frame.h;y++)for(let x=frame.x;x<frame.x+frame.w;x++){
   const at=(y*png.width+x)*4,pixel=[png.data[at],png.data[at+1],png.data[at+2],png.data[at+3]];
   assert.ok(pixel[3]===0||pixel[3]===255,`${key} non-binary alpha ${pixel[3]}`);
   assert.equal(isMagenta(pixel),false,`${key} retains magenta at ${x-frame.x},${y-frame.y}`);
   opaque+=pixel[3]===255;
  }
  assert.ok(opaque>0,`${key} is empty`);
 }
});

test('green pepper remains unmapped and cucumber keeps its established keys',()=>{
 assert.equal(ITEM_ICON_KEYS.includes('greenPepper-item'),false);
 assert.equal(ITEM_ICON_KEYS.includes('greenPepper-seed-item'),false);
 assert.equal(ITEM_ICON_KEYS.includes('cucumber-item'),false);
 assert.equal(ITEM_ICON_KEYS.includes('cucumber-seed-item'),false);
});
