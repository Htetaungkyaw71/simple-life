import test from 'node:test';
import assert from 'node:assert/strict';
import {BOY_FARMER} from '../src/data/appearance.js';
import {BOY_HANDS,BOY_TOOL_FRAMES} from '../src/data/revisedFarmer.js';
import {characterFrame} from '../src/systems/characterAnimation.js';
import {farmerCarryPose} from '../src/systems/farmerCarry.js';
import {jumpPose,JUMP_DURATION} from '../src/systems/jump.js';
import {HeldWateringCan} from '../src/entities/HeldWateringCan.js';
import {PlayerView} from '../src/entities/PlayerView.js';
import {recorder} from './helpers/uiRecorder.js';

test('authored jump covers six phases in each direction on the existing 600 ms arc',()=>{
 assert.equal(BOY_FARMER.clips.jumping.durations.reduce((a,b)=>a+b),JUMP_DURATION);
 for(const direction of ['down','up','left','right']){
  const phases=new Set();
  for(let elapsed=0;elapsed<600;elapsed+=10){
   const jump=jumpPose({active:{elapsed}}),frame=characterFrame(BOY_FARMER,'jumping',direction,jump.elapsed);
   phases.add(frame.phase);assert.ok(frame.frame>=224&&frame.frame<256);assert.equal(jump.elapsed,elapsed);
  }
  assert.equal(phases.size,6);
 }
 assert.equal(jumpPose({active:null}).frame,null);
});

test('every carried tool follows the actual hand phase and the same airborne height',()=>{
 const position={x:100,y:200};
 for(const direction of ['down','up','left','right'])for(const mode of ['idle','running','jumping'])for(const [phase,hand]of BOY_HANDS[direction][mode].entries())for(const tool of ['axe','shovel','water']){
  const p=farmerCarryPose(position,direction,mode,phase,tool,24);
  assert.equal(p.frame,BOY_TOOL_FRAMES[tool][direction]);
  assert.equal(p.x,position.x+hand[0]);assert.equal(p.y,position.y+hand[1]-24);
  assert.equal(p.depth,position.y+(direction==='up'?-1:1));
  assert.ok(Number.isFinite(p.rotation)&&Math.abs(p.rotation)<.3);
 }
 assert.equal(farmerCarryPose(position,'down','idle',0,'hand'),null);
});

test('combined actions hide the carried image immediately and restore its new matching texture',()=>{
 const scene=recorder();scene.app={state:{selected:'axe'},paused:false};
 const held=new HeldWateringCan(scene);scene.player={rig:BOY_FARMER};
 held.update({x:100,y:200},'up',1,0,false,0,false,'idle');
 assert.equal(held.can.texture,'boy');assert.equal(held.can.frame,BOY_TOOL_FRAMES.axe.up);
 assert.equal(held.can.visible,true);assert.equal(held.can.flipX,false);
 held.update({x:100,y:200},'up',1,0,false,0,true,'idle');
 assert.equal(held.can.visible,false);assert.equal(held.hand.visible,false);
 held.update({x:100,y:200},'up',1,0,false,0,false,'idle');assert.equal(held.can.visible,true);
 scene.app.state.selected='hand';held.update({x:100,y:200},'up',1,0,false,0,false,'idle');assert.equal(held.can.visible,false);
});

test('PlayerView uses elapsed jump art and cancels a baked action without changing its world arc',()=>{
 const scene=recorder();scene.app={state:{selected:'shovel'},paused:false};
 const sprite=scene.add.sprite(0,0,'boy',0);sprite.stop=()=>sprite;sprite.setFrame=frame=>{sprite.frame=frame;return sprite;};
 const held={remaining:0,update(...args){this.last=args;}};
 const player={rig:BOY_FARMER,scene,sprite,anchor:scene.add.container(),shadow:scene.add.container(),wateringCan:held,direction:'right',lastMotionTime:1000,motionElapsed:0,action:{name:'digging',tool:'shovel',elapsed:10}};
 const before=globalThis.document;globalThis.document={hidden:false};
 try{
  const jump=jumpPose({active:{elapsed:300}});
  PlayerView.prototype.update.call(player,{x:100,y:200},0,0,jump,{x:0,y:0});
  assert.equal(player.action,null);assert.equal(sprite.frame,characterFrame(BOY_FARMER,'jumping','right',300).frame);
  assert.equal(sprite.y,200-jump.height);assert.equal(held.last.at(-1),'jumping');
 }finally{if(before===undefined)delete globalThis.document;else globalThis.document=before;}
});
