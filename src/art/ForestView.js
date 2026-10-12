import {worldText} from '../i18n/myanmarText.js';
import {nightBands} from './nightBands.js';
import {ANIMAL_SPAWNS,SPECIES} from '../data/wildlife.js';
import {FORAGE_NODES,TREASURES} from '../data/forest.js';
import {FOODS} from '../data/items.js';
import {forageAvailable,treasureAvailable} from '../systems/forest.js';
import {animalRuntime} from '../systems/combat.js';
import {WoodlandView} from './WoodlandView.js';
import {animalDirection,combatAnimalVisual} from '../data/wildlifeArt.js';
import {isNight} from '../systems/time.js';
import {forestStones} from '../data/forestResources.js';
import {stoneAvailable} from '../systems/resources.js';

export class ForestView {
 constructor(scene){
  this.scene=scene;this.nodes=[];const s=scene.app.state;
  if(s?.area==='forest'){
   for(const node of FORAGE_NODES){
    if(node.item==='wildBerry')scene.add.image(node.x,node.y-10,'town','bush').setScale(2).setDepth(node.y-4);
    const sprite=scene.add.image(node.x,node.y-22,'town',FOODS[node.item].icon).setScale(2).setDepth(node.y+1);
    this.nodes.push({node,sprite});
   }
   this.animals=ANIMAL_SPAWNS.map(a=>{const pose=combatAnimalVisual(a.species,'idle','down',0);return {definition:a,direction:'down',lastSide:'right',previous:{...a.home},sprite:scene.add.sprite(0,0,'town',pose.frame).setOrigin(.5,pose.originY).setScale(2),shadow:scene.add.ellipse(0,0,Math.min(64,SPECIES[a.species].body*2.5),10,0x253324,.2),health:scene.add.graphics(),warning:scene.add.bitmapText(0,0,'pixel','!',12).setScale(2).setOrigin(.5).setTint(0xffd080),name:worldText(scene,0,0,SPECIES[a.species].name,6).setScale(2).setOrigin(.5).setTint(0xffedcc)};});
   this.woodland=new WoodlandView(scene);
   this.stones=forestStones().map(node=>({node,sprite:scene.add.image(node.x,node.y,'town','loose-stones').setOrigin(.5,1).setScale(2).setDepth(node.y)}));
   this.chests=TREASURES.map(t=>({treasure:t,sprite:scene.add.image(t.x,t.y,'town','ancient-chest').setOrigin(.5,1).setScale(2).setDepth(t.y)}));
   this.bag=scene.add.image(0,0,'town','stash-bag').setOrigin(.5,1).setScale(2);
  }
  this.arc=scene.add.graphics();
 }
 update(delta,r){
  const s=this.scene.app.state;if(!s)return;
  for(const {node,sprite}of this.nodes)sprite.setVisible(forageAvailable(s,node));
  for(const {node,sprite}of this.stones||[])sprite.setVisible(stoneAvailable(s,node));
  this.woodland?.update(delta,r.now);
  if(this.animals){
   const view=this.scene.cameras.main.worldView;
   for(const entry of this.animals){
    const b=s.forest.animals[entry.definition.id],p=b.position,runtime=animalRuntime(r,b.id),d=SPECIES[b.species];
    const visible=b.health>0&&p.x>view.x-120&&p.x<view.right+120&&p.y>view.y-120&&p.y<view.bottom+120;
    const moving=Math.hypot(p.x-entry.previous.x,p.y-entry.previous.y)>.05;
    entry.direction=animalDirection(runtime.heading,entry.direction);entry.previous={...p};
    if(['left','right'].includes(entry.direction))entry.lastSide=entry.direction;
    const action=runtime.mode==='charge'?'run':runtime.mode==='warning'?'attack':moving?'walk':'idle';
    const pose=combatAnimalVisual(b.species,action,entry.direction,r.now,entry.lastSide);
    entry.sprite.setVisible(visible).setPosition(Math.round(p.x/2)*2,Math.round(p.y/2)*2).setDepth(p.y).setFlipX(pose.flipX).setFrame(pose.frame).setOrigin(.5,pose.originY);
    entry.shadow.setVisible(visible).setPosition(entry.sprite.x,entry.sprite.y-2).setDepth(p.y-.1);
    const top=entry.sprite.displayHeight*entry.sprite.originY;
    entry.warning.setPosition(p.x,p.y-top-20).setDepth(p.y+1).setVisible(visible&&runtime.mode==='warning');
    entry.health.clear().setDepth(p.y+1);
    const near=visible&&Math.hypot(p.x-s.position.x,p.y-s.position.y)<190;
    if(near){entry.health.fillStyle(0x34344f).fillRect(p.x-20,p.y-top-8,40,6);entry.health.fillStyle(d.tier>=4?0xdd7e6c:0xe6af66).fillRect(p.x-18,p.y-top-6,36*b.health/d.health,2);}
    entry.name.setPosition(p.x,p.y-top-26).setDepth(p.y+1).setVisible(near&&runtime.mode!=='warning');
   }
   for(const {treasure,sprite}of this.chests)sprite.setVisible(treasureAvailable(s,treasure)&&Math.hypot(treasure.x-s.position.x,treasure.y-s.position.y)<200);
   const bag=s.stash;this.bag.setVisible(!!bag);if(bag)this.bag.setPosition(bag.x,bag.y).setDepth(bag.y);
  }
  if(this.swingLeft>0){
   this.swingLeft-=delta;const t=1-this.swingLeft/420,p=s.position;
   const angle={up:-Math.PI/2,down:Math.PI/2,left:Math.PI,right:0}[this.swingDirection]+(t-.45)*2;

   this.arc.clear().setDepth(p.y+(this.swingDirection==='up'?-2:3));
   if(t>.26&&t<.66){
    const can=this.scene.player.wateringCan.can;
    // Follow the actual blade rather than an unrelated circle around the feet.
    const dx=(can.flipX?5:11)-can.originX*16,dy=7-can.originY*16;
    const blade={x:can.x+(dx*Math.cos(can.rotation)-dy*Math.sin(can.rotation))*2,y:can.y+(dx*Math.sin(can.rotation)+dy*Math.cos(can.rotation))*2};
    this.arc.fillStyle(0xffedcc,.55);
    for(let i=0;i<3;i++)this.arc.fillRect(Math.round((blade.x-i*4*Math.cos(angle))/2)*2,Math.round((blade.y-i*4*Math.sin(angle))/2)*2,4,2);
   }
  }else{this.arc.clear();}
  this.scene.player?.sprite.setAlpha(r.now<r.invulnerableUntil&&Math.floor(r.now/90)%2?.42:1);
 }
 beginSwing(direction){this.swingDirection=direction;this.swingLeft=420;}
 attack(direction,result){
  const s=this.scene.app.state,animal=s.forest.animals[result.animalId]||s.forest.woodland[result.animalId],entry=this.animals?.find(a=>a.definition.id===result.animalId)||this.woodland?.animals.find(a=>a.id===result.animalId);
  if(result.hit){const p=animal.position;this.bits(p.x,p.y-20,0xffe6b3);entry.sprite.setTintFill(0xffedcc);this.scene.time.delayedCall(100,()=>entry.sprite.active&&entry.sprite.clearTint());}
  if(result.defeated){const b=animal.position;const ghost=this.scene.add.image(b.x,b.y,'town',entry.sprite.frame.name).setFlipX(entry.sprite.flipX).setOrigin(.5,entry.sprite.originY).setScale(2).setDepth(b.y+1);this.scene.tweens.add({targets:ghost,alpha:0,duration:450,onComplete:()=>ghost.destroy()});this.scene.app.ui.toast('+'+result.meat+' Meat'+(result.species==='boar'?' / +1 Wild Hide':''));}
 }
 hurt(){const p=this.scene.app.state.position;this.bits(p.x,p.y-24,0xe99566);this.scene.cameras.main.shake(100,.0015);}
 bits(x,y,color){for(let i=0;i<8;i++){const bit=this.scene.add.rectangle(x-14+i*4,y,4,4,color).setDepth(y+60);this.scene.tweens.add({targets:bit,x:bit.x+(i-3)*4,y:y-20-(i%3)*6,alpha:0,duration:400+i*20,onComplete:()=>bit.destroy()});}}
 collect(node){this.bits(node.x,node.y-12,0xc7dc9a);const fruit=this.scene.add.image(node.x,node.y-30,'town',FOODS[node.item].icon).setScale(2).setDepth(node.y+80);this.scene.tweens.add({targets:fruit,y:node.y-68,alpha:0,duration:500,onComplete:()=>fruit.destroy()});}
 energy(amount){const p=this.scene.app.state.position;this.bits(p.x,p.y-35,0xb4d798);const t=worldText(this.scene,p.x,p.y-76,'+'+amount+' ENERGY',7).setScale(2).setOrigin(.5).setTint(0xc7dc9a).setDepth(10002);this.scene.tweens.add({targets:t,y:t.y-28,alpha:0,duration:650,onComplete:()=>t.destroy()});}
 health(amount){const p=this.scene.app.state.position;this.bits(p.x,p.y-35,0xe99566);const t=worldText(this.scene,p.x,p.y-96,'+'+amount+' HEALTH',7).setScale(2).setOrigin(.5).setTint(0xffd0b5).setDepth(10002);this.scene.tweens.add({targets:t,y:t.y-28,alpha:0,duration:650,onComplete:()=>t.destroy()});}
}

// Pixel bands paint the existing night colour at stepped opacity. This uses
// Graphics rectangles, so Canvas and WebGL share identical geometry; no shader.
export function forestNight(graphics,s,light){
 const camera=graphics.scene.cameras.main,view=camera.worldView;
 const left=Math.floor(view.x/16)*16-32,top=Math.floor(view.y/16)*16-32,right=left+Math.ceil(view.width/16)*16+64,bottom=top+Math.ceil(view.height/16)*16+64;
 const cx=Math.round(s.position.x/16)*16,cy=Math.round(s.position.y/16)*16,key=[cx,cy,left,top,right,bottom,light.color,light.alpha].join(':');
 if(graphics.lightKey===key)return;graphics.lightKey=key;graphics.fillColor=light.color;graphics.clear().setAlpha(light.alpha);
 const radius=isNight(s)||s.minute>=1080?208:0;
 for(const r of nightBands({left,top,right,bottom,cx,cy,radius}))graphics.fillStyle(light.color,r.alpha).fillRect(r.x,r.y,r.w,r.h);
}
