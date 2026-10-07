import {FORAGE_NODES} from '../data/forest.js';
import {FOODS} from '../data/items.js';
import {forageAvailable} from '../systems/forest.js';
import {attackBox} from '../systems/combat.js';
import {isNight} from '../systems/time.js';

export class ForestView {
 constructor(scene){
  this.scene=scene;this.nodes=[];const s=scene.app.state;
  if(s?.area==='forest'){
   for(const node of FORAGE_NODES){
    if(node.item==='wildBerry')scene.add.image(node.x,node.y-10,'town','bush').setScale(2).setDepth(node.y-4);
    const sprite=scene.add.image(node.x,node.y-22,'town',FOODS[node.item].icon).setScale(2).setDepth(node.y+1);
    this.nodes.push({node,sprite});
   }
   this.boar=scene.add.sprite(0,0,'town','boar0').setOrigin(.5,.9).setScale(2);
   this.health=scene.add.graphics();this.warning=scene.add.bitmapText(0,0,'pixel','!',12).setScale(2).setOrigin(.5).setTint(0xffd080);
   this.bag=scene.add.image(0,0,'town','stash-bag').setOrigin(.5,1).setScale(2);
  }
  this.swing=scene.add.image(0,0,'town','wooden-club-item').setOrigin(.5,1).setScale(2).setVisible(false);
  this.arc=scene.add.graphics();
 }
 update(delta,r){
  const s=this.scene.app.state;if(!s)return;
  for(const {node,sprite}of this.nodes)sprite.setVisible(forageAvailable(s,node));
  if(this.boar){
   const b=s.forest.boar,p=b.position;this.boar.setVisible(b.health>0).setPosition(Math.round(p.x/2)*2,Math.round(p.y/2)*2).setDepth(p.y);
   this.boar.setFlipX(r.heading.x>0).setFrame('boar'+(r.mode==='warning'?3:Math.floor(r.now/180)%3));
   this.warning.setPosition(p.x,p.y-72).setDepth(p.y+1).setVisible(b.health>0&&r.mode==='warning');
   this.health.clear().setDepth(p.y+1);if(b.health>0&&(r.mode!=='wander'||b.health<3)){this.health.fillStyle(0x34344f).fillRect(p.x-18,p.y-58,36,6);this.health.fillStyle(0xe6af66).fillRect(p.x-16,p.y-56,b.health*10,2);}
   const bag=s.stash;this.bag.setVisible(!!bag);if(bag)this.bag.setPosition(bag.x,bag.y).setDepth(bag.y);
  }
  if(this.swingLeft>0){
   this.swingLeft-=delta;const phase=this.swingLeft>170?0:this.swingLeft>85?1:2,p=s.position,box=attackBox(p,this.swingDirection),center={x:box.x+box.w/2,y:box.y+box.h/2};
   const angle={up:-Math.PI/2,down:Math.PI/2,left:Math.PI,right:0}[this.swingDirection]+(phase-1)*Math.PI/4;
   this.swing.setVisible(this.swingLeft>0).setPosition(center.x,center.y+12).setRotation(angle+Math.PI/4).setDepth(p.y+50);
   this.arc.clear().setDepth(p.y+49);this.arc.fillStyle(0xffedcc,.55);
   for(let i=0;i<4;i++){const a=angle+(i-2)*.20;this.arc.fillRect(Math.round((p.x+Math.cos(a)*54)/2)*2,Math.round((p.y-16+Math.sin(a)*54)/2)*2,4,4);}
  }else{this.swing.setVisible(false);this.arc.clear();}
  this.scene.player?.sprite.setAlpha(r.now<r.invulnerableUntil&&Math.floor(r.now/90)%2?.42:1);
 }
 attack(direction,result){
  this.swingDirection=direction;this.swingLeft=260;
  if(result.hit){const p=this.scene.app.state.forest.boar.position;this.bits(p.x,p.y-20,0xffe6b3);this.boar?.setTintFill(0xffedcc);this.scene.time.delayedCall(100,()=>this.boar?.active&&this.boar.clearTint());this.scene.cameras.main.shake(80,.0012);}
  if(result.defeated){const b=this.scene.app.state.forest.boar.position;const ghost=this.scene.add.image(b.x,b.y,'town','boar0').setOrigin(.5,.9).setScale(2).setDepth(b.y+1);this.scene.tweens.add({targets:ghost,x:b.x+20,y:b.y-12,alpha:0,duration:450,onComplete:()=>ghost.destroy()});this.scene.app.ui.toast('Boar fled / +1 Wild Hide. Sell at City Market.');}
 }
 hurt(){const p=this.scene.app.state.position;this.bits(p.x,p.y-24,0xe99566);this.scene.cameras.main.shake(100,.0015);}
 bits(x,y,color){for(let i=0;i<8;i++){const bit=this.scene.add.rectangle(x-14+i*4,y,4,4,color).setDepth(y+60);this.scene.tweens.add({targets:bit,x:bit.x+(i-3)*4,y:y-20-(i%3)*6,alpha:0,duration:400+i*20,onComplete:()=>bit.destroy()});}}
 collect(node){this.bits(node.x,node.y-12,0xc7dc9a);const fruit=this.scene.add.image(node.x,node.y-30,'town',FOODS[node.item].icon).setScale(2).setDepth(node.y+80);this.scene.tweens.add({targets:fruit,y:node.y-68,alpha:0,duration:500,onComplete:()=>fruit.destroy()});}
 energy(amount){const p=this.scene.app.state.position;this.bits(p.x,p.y-35,0xb4d798);const t=this.scene.add.bitmapText(p.x,p.y-76,'pixel','+'+amount+' ENERGY',7).setScale(2).setOrigin(.5).setTint(0xc7dc9a).setDepth(3100);this.scene.tweens.add({targets:t,y:t.y-28,alpha:0,duration:650,onComplete:()=>t.destroy()});}
}

// Pixel bands paint the existing night colour at stepped opacity. This uses
// Graphics rectangles, so Canvas and WebGL share identical geometry; no shader.
export function forestNight(graphics,s,light){
 const cx=Math.round(s.position.x/16)*16,cy=Math.round(s.position.y/16)*16,key=[cx,cy,light.color,light.alpha].join(':');
 if(graphics.lightKey===key)return;graphics.lightKey=key;graphics.fillColor=light.color;graphics.clear().setAlpha(light.alpha);
 const radius=isNight(s)||s.minute>=1080?208:0;
 for(let y=-1024;y<3072;y+=16){
  if(!radius||Math.abs(y-cy)>radius){graphics.fillStyle(light.color).fillRect(-1280,y,5120,16);continue;}
  graphics.fillStyle(light.color).fillRect(-1280,y,cx-radius+1280,16).fillRect(cx+radius,y,3840-cx-radius,16);
  for(let x=cx-radius;x<cx+radius;x+=16){const a=Math.abs(x-cx),b=Math.abs(y-cy),distance=Math.max(a,b)+Math.min(a,b)*.4;const alpha=distance<112?.28:distance<160?.48:distance<200?.72:1;graphics.fillStyle(light.color,alpha).fillRect(x,y,16,16);}
 }
}
