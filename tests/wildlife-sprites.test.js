import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SPECIES} from '../src/data/wildlife.js';
import {combatAnimalVisual} from '../src/data/wildlifeArt.js';
import {WILDLIFE_SPRITES} from '../src/data/wildlifeSprites.js';
import {ANIMAL_CREDITS} from '../src/data/animalCredits.js';
const atlas=JSON.parse(readFileSync('public/assets/pixel/processed/town.json'));
const manifest=JSON.parse(readFileSync('public/assets/pixel/processed/manifest.json'));
test('all 22 combat species resolve real local frames for every direction and combat phase',()=>{
 assert.equal(Object.keys(SPECIES).length,22);
 for(const species of Object.keys(SPECIES))for(const direction of ['up','down','left','right'])for(const action of ['idle','walk','run','attack'])for(let now=0;now<2300;now+=85){
  const pose=combatAnimalVisual(species,action,direction,now);
  assert.ok(atlas.frames[pose.frame],pose.frame);
  assert.ok(pose.originY>0&&pose.originY<=1,pose.frame);
 }
});
test('directional assets stay unmirrored; side assets face the movement and retain their last horizontal facing',()=>{
 for(const species of ['lion','polarBear','tiger','panda','elephant','crocodile'])for(const direction of ['up','down','left','right']){
  const pose=combatAnimalVisual(species,'walk',direction,140);
  assert.ok(pose.frame.includes('-'+direction+'-'));assert.equal(pose.flipX,false);
 }
 assert.equal(combatAnimalVisual('wolf','run','left',85).flipX,false);
 assert.equal(combatAnimalVisual('wolf','run','right',85).flipX,true);
 assert.equal(combatAnimalVisual('monkey','walk','right',140).flipX,false);
 assert.equal(combatAnimalVisual('monkey','walk','up',140,'left').flipX,true);
 assert.equal(combatAnimalVisual('cheetah','attack','right',0).frame,'wa-cheetah-idle-side-0');
 assert.equal(combatAnimalVisual('polarBear','attack','down',140).frame,'wa-polarBear-attack-down-1');
});
test('15 curated species have stable integer source-pixel feet, complete provenance and no superseded placeholder cells',()=>{
 assert.equal(Object.keys(WILDLIFE_SPRITES).length,15);
 for(const [species,rig] of Object.entries(WILDLIFE_SPRITES)){
  for(let i=0;i<4;i++)assert.ok(!atlas.frames[species+i]);
  for(const origin of Object.values(rig.origins))assert.ok(Math.abs(origin*rig.height-Math.round(origin*rig.height))<1e-9);
  const selected=Object.entries(manifest.wildlifeFrames).filter(([id])=>id.startsWith('wa-'+species+'-'));
  assert.ok(selected.length);
  for(const [id,p] of selected){
   assert.ok(p.creator&&p.license&&p.source&&p.file);assert.equal(p.rectangle.length,4);assert.equal(p.commonTrim.length,4);
   assert.ok(!manifest.originalAdditions.includes(id));
   assert.equal(atlas.frames[id].frame.w,rig.width);assert.equal(atlas.frames[id].frame.h,rig.height);
  }
 }
});
test('every selected creator is credited with a direct source and required licence links',()=>{
 const credits=JSON.stringify(ANIMAL_CREDITS);
 for(const p of Object.values(manifest.wildlifeFrames))assert.ok(credits.includes(p.source),p.source);
 for(const url of ['https://creativecommons.org/licenses/by/3.0/','https://static.opengameart.org/OGA-BY-3.0.txt'])assert.ok(credits.includes(url));
});
