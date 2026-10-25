import test from 'node:test';
import assert from 'node:assert/strict';
import {GIRL_FARMER,BOY_FARMER,playerVisual} from '../src/data/appearance.js';
import {GIRL_CLIPS,GIRL_V2_HANDS,GIRL_CARRY_ANGLES} from '../src/data/revisedGirl.js';
import {BOY_HANDS,BOY_TOOL_FRAMES} from '../src/data/revisedFarmer.js';
import {characterFrame} from '../src/systems/characterAnimation.js';
import {farmerCarryPose} from '../src/systems/farmerCarry.js';
import {HeldWateringCan} from '../src/entities/HeldWateringCan.js';
import {recorder} from './helpers/uiRecorder.js';

const profile={hands:GIRL_V2_HANDS,angles:GIRL_CARRY_ANGLES};
test('female starter appearance keeps its saved identity and uses the complete matching rig',()=>{
 assert.equal(playerVisual({outfit:'gardener',hair:'chestnut'},'girl').rig,GIRL_FARMER);
 assert.equal(playerVisual(null,'girl').rig,GIRL_FARMER);
 assert.equal(GIRL_FARMER.height,64);assert.equal(GIRL_FARMER.originY,56/64);assert.equal(GIRL_FARMER.scale,1.45);
 assert.ok(Math.abs(41*GIRL_FARMER.scale-40*BOY_FARMER.scale)<1,'standing world height matches the boy');
 assert.equal(Object.keys(GIRL_CLIPS).length,8);
 assert.deepEqual(GIRL_CLIPS,BOY_FARMER.clips);
 for(const [row,dir]of ['down','up','left','right'].entries()){
  assert.equal(characterFrame(GIRL_FARMER,'idle',dir,2100).phase,2);
  assert.equal(characterFrame(GIRL_FARMER,'running',dir,500).frame,32+row*8+6);
  assert.equal(characterFrame(GIRL_FARMER,'jumping',dir,300).frame,224+row*8+3);
  assert.equal(characterFrame(GIRL_FARMER,'jumping',dir,600).complete,true);
 }
});

test('female carry uses her own hands on every movement phase while sharing the approved tools',()=>{
 let differs=0;
 for(const dir of ['down','up','left','right'])for(const mode of ['idle','running','jumping'])for(const [phase,hand]of GIRL_V2_HANDS[dir][mode].entries()){
  for(const tool of ['axe','shovel','water']){
   const p=farmerCarryPose({x:100,y:200},dir,mode,phase,tool,24,profile);
   assert.equal(p.x,100+hand[0]);assert.equal(p.y,176+hand[1]);assert.equal(p.frame,BOY_TOOL_FRAMES[tool][dir]);
   assert.equal(p.rotation,GIRL_CARRY_ANGLES[dir][mode][phase]*(tool==='water'?.35:tool==='shovel'?.6:1));
  }
  if(hand.some((n,i)=>n!==BOY_HANDS[dir][mode][phase][i]))differs++;
 }
 assert.ok(differs>0,'female hand registration is independent of male art');
});

test('the hand above a carried tool comes from the female texture and hides with combined actions',()=>{
 const scene=recorder(),image=scene.add.image;
 scene.add.image=(...args)=>{const n=image(...args);n.setCrop=(...crop)=>{n.crop=crop;return n;};return n;};
 scene.app={state:{selected:'axe'},paused:false};
 scene.player={rig:GIRL_FARMER,carryProfile:profile,sprite:{texture:{key:'girl'},frame:{name:0},x:100,y:200}};
 const held=new HeldWateringCan(scene);
 held.update({x:100,y:200},'down',1,0,false,0,false,'idle');
 assert.equal(held.can.texture,'boy','shared tool pixels remain in their existing atlas');
 assert.equal(held.grip.texture,'girl');assert.equal(held.grip.frame,0);assert.equal(held.grip.visible,true);
 held.update({x:100,y:200},'down',1,0,false,0,true,'idle');
 assert.equal(held.can.visible,false);assert.equal(held.grip.visible,false);assert.equal(held.hand.visible,false);
});
