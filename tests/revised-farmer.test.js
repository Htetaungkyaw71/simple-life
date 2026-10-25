import test from 'node:test';
import assert from 'node:assert/strict';
import {BOY_FARMER,playerVisual} from '../src/data/appearance.js';
import {characterFrame} from '../src/systems/characterAnimation.js';
import {BOY_HANDS} from '../src/data/revisedFarmer.js';
import {HeldWateringCan} from '../src/entities/HeldWateringCan.js';
import {recorder} from './helpers/uiRecorder.js';
test('all four v2 directions retain exact idle holds, run phases and one-shot work recovery',()=>{
 for(const [row,direction] of ['down','up','left','right'].entries()){
  assert.equal(characterFrame(BOY_FARMER,'idle',direction,1099).phase,0);
  assert.equal(characterFrame(BOY_FARMER,'idle',direction,1100).phase,1);
  assert.equal(characterFrame(BOY_FARMER,'idle',direction,2100).phase,2);
  assert.equal(characterFrame(BOY_FARMER,'idle',direction,2220).phase,3);
  assert.equal(characterFrame(BOY_FARMER,'idle',direction,3220).phase,0);
  for(const [action,clip]of Object.entries(BOY_FARMER.clips)){
   let elapsed=0;
   for(let phase=0;phase<clip.count;phase++){
    const pose=characterFrame(BOY_FARMER,action,direction,elapsed);
    assert.equal(pose.frame,clip.offset+row*8+phase);assert.equal(pose.complete,false);
    elapsed+=clip.durations[phase];
   }
   const end=characterFrame(BOY_FARMER,action,direction,elapsed);
   assert.equal(end.complete,!clip.loop);assert.equal(end.phase,clip.loop?0:clip.count-1);
  }
  assert.equal(BOY_HANDS[direction].idle.length,4);assert.equal(BOY_HANDS[direction].running.length,8);
 }
 assert.equal(playerVisual({outfit:'worker',hair:'midnight'}).rig,BOY_FARMER);
});
test('a built-in tool pose suppresses the separate held tool and restores it for ordinary movement',()=>{
 const scene=recorder();scene.app={state:{selected:'axe'},paused:false};
 const held=new HeldWateringCan(scene,{down:[[15,-27]]});
 held.update({x:100,y:100},'down',1,0,false,0,true);
 assert.equal(held.can.visible,false);assert.equal(held.hand.visible,false);
 held.update({x:100,y:100},'down',1);
 assert.equal(held.can.visible,true);assert.equal(held.can.x,115);assert.equal(held.can.y,73);
});
