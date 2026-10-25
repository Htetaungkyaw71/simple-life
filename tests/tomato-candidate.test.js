import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {CROPS} from '../src/data/crops.js';

const TOMATO_KEYS=['seed','sprout','young','flowering','ripe','dry','wilted','dead'].map(state=>'tomato-'+state);

test('approved Tomato Candidate B uses native frames and visual-only crop metadata',async()=>{
 assert.equal(CROPS.tomato.visualScale,1);
 assert.equal(CROPS.tomato.signOffsetY,-86);
 for(const id of ['cucumber','sweetPotato']){
  assert.equal(CROPS[id].visualScale,2,id);
  assert.equal(CROPS[id].signOffsetY,-54,id);
 }
 const atlas=JSON.parse(await readFile('public/assets/pixel/processed/town.json','utf8'));
 for(const key of TOMATO_KEYS){
  assert.deepEqual(atlas.frames[key].sourceSize,{w:48,h:70},key);
  assert.deepEqual(atlas.frames[key].spriteSourceSize,{x:0,y:0,w:48,h:70},key);
  assert.equal(atlas.frames[key].trimmed,false,key);
 }
 const farmView=await readFile('src/art/FarmView.js','utf8');
 assert.match(farmView,/setOrigin\(\.5,1\)\.setScale\(definition\.visualScale\)\.setDepth\(b\.y\+20\)/);
 assert.match(farmView,/setPosition\(b\.x-14,b\.y\+definition\.signOffsetY\)/);
});
