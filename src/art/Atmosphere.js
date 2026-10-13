import {wateringCanPose} from '../entities/HeldWateringCan.js';
import {PEOPLE} from '../data/appearance.js';
import {FountainView} from './FountainView.js';
import {shopOpen} from '../systems/market.js';
import {CROPS} from '../data/crops.js';
import {MAPS} from '../data/mapLayouts.js';
import {WaterView} from './WaterView.js';
import {canopyOccludes} from './occlusion.js';
export class Atmosphere {
 constructor(scene,area){
  this.waterView=new WaterView(scene,area);this.fountainView=new FountainView(scene);this.elapsed=0;
  this.scene=scene;this.area=area;this.lastStep=0;this.frame=-1;
  this.butterflies=MAPS[area].details.filter(p=>p.name.startsWith('flowers')).slice(0,8).map((p,i)=>({x:p.x,y:p.y,i,sprite:scene.add.image(p.x,p.y,'town','butterfly0').setScale(2).setDepth(1800)}));
 }
 update(time,moving,position,delta=0){
  this.elapsed+=delta;time=this.elapsed;this.fountainView.update(time);
  this.waterView.update(time,moving,position);
  for(const p of this.scene.plants||[])p.sprite.setFrame(p.prefix+Math.floor(time/260)%4);
  for(const l of this.scene.shopLabels||[])l.text.setText(shopOpen(this.scene.app.state,l.kind)&&this.scene.residents.available(l.kind)?l.name:l.name+' / CLOSED');
  const frame=Math.floor(time/600)%2;
  if(frame!==this.frame){this.frame=frame;for(const water of this.scene.water)water.setFrame('water'+frame);for(const fountain of this.scene.fountains)fountain.sprite.setFrame(fountain.prefix+frame);}
  for(const c of this.scene.canopies){c.sprite.setX((c.baseX??c.x-32)+(Math.sin(time/1800+c.x)>.94?2:0));const near=canopyOccludes(c.sprite.getBounds(),c.y,position,this.scene.player?.sprite.displayHeight||60);c.sprite.setAlpha(near?.5:1);}
  for(const door of this.scene.doors){const near=Math.hypot(position.x-door.x-16,position.y-door.y)<85;door.setFrame(near?'door2':'door0');}
  for(const b of this.butterflies)b.sprite.setVisible(this.scene.app.state.minute>=360&&this.scene.app.state.minute<1200).setFrame('butterfly'+Math.floor(time/180+b.i)%2).setPosition(b.x+Math.round(Math.sin(time/1300+b.i)*24)*2,b.y+Math.round(Math.cos(time/1800+b.i)*12)*2);
  if(moving&&!this.scene.jumping?.active&&!this.waterView.wading&&time-this.lastStep>180){this.lastStep=time;const dust=this.scene.add.image(Math.round(position.x/2)*2,Math.round(position.y/2)*2,'town','dust').setScale(2).setDepth(position.y-1);this.scene.tweens.add({targets:dust,y:dust.y-6,alpha:0,duration:280,onComplete:()=>dust.destroy()});}
 }
 refill(position){for(let i=0;i<6;i++){const drop=this.scene.add.rectangle(position.x-12+i*4,position.y-12,2,4,0xade8ed).setDepth(position.y+1);this.scene.tweens.add({targets:drop,y:drop.y-18-(i%3)*4,alpha:0,duration:450+i*35,onComplete:()=>drop.destroy()});}}
 farming(action,x,y,crop='tomato'){
  if(action==='water'){this.pour(x,y);this.bounce(x,y);return;}
  this.bounce(x,y);if(action==='plant'){const dent=this.scene.add.ellipse(x,y+3,14,6,0x79573f).setDepth(y-1);this.scene.tweens.add({targets:dent,alpha:0,duration:400,onComplete:()=>dent.destroy()});const seed=this.scene.add.image(x,y-24,'town',CROPS[crop].seedIcon).setScale(1).setDepth(y+20);this.scene.tweens.add({targets:seed,y:y+3,scaleX:.3,scaleY:.3,alpha:0,duration:250,onComplete:()=>seed.destroy()});const player=this.scene.player;if(player){const pose=wateringCanPose(this.scene.app.state.position,player.direction,PEOPLE.toolScale),hand=this.scene.add.rectangle(pose.x,pose.y,4,4,0xf1b7ad).setDepth(pose.depth+2);this.scene.tweens.add({targets:hand,y:pose.y+8,duration:110,yoyo:true,onComplete:()=>hand.destroy()});}}
  const color=action==='water'?0x9cdce2:action==='harvest'?0xe87651:0xd7b789;
  for(let i=0;i<7;i++){const bit=this.scene.add.rectangle(x-12+i*4,y+8,2,action==='water'?4:2,color).setDepth(y+30);this.scene.tweens.add({targets:bit,x:bit.x+(i-3)*3,y:y-10-(i%3)*5,alpha:0,duration:350+i*25,onComplete:()=>bit.destroy()});}
  if(action==='harvest'){const fruit=this.scene.add.image(x,y-12,'town',CROPS[crop].icon).setScale(2).setDepth(y+40);this.scene.tweens.add({targets:fruit,x:this.scene.app.state.position.x,y:this.scene.app.state.position.y-42,alpha:0,duration:600,onComplete:()=>fruit.destroy()});}
 }
 bounce(x,y){for(const n of this.scene.plots.getChildren()){if(n.type==='Image'&&Math.abs(n.x-x)<4&&Math.abs(n.y-y)<50)this.scene.tweens.add({targets:n,y:n.y-4,duration:100,yoyo:true});}}
 vegetation(action,x,y){
  const color=action==='chop'?0xb48b55:0x97a75b;
  for(let i=0;i<7;i++){const bit=this.scene.add.rectangle(x-12+i*4,y-8,4,2,color).setDepth(y+30);this.scene.tweens.add({targets:bit,x:bit.x+(i-3)*5,y:y-28-(i%3)*6,alpha:0,duration:400+i*25,onComplete:()=>bit.destroy()});}
  if(action!=='placeGrass'){const item=this.scene.add.image(x,y-12,'town',action==='chop'?'wood-item':'grass-item').setScale(2).setDepth(y+40);this.scene.tweens.add({targets:item,y:y-48,alpha:0,duration:600,onComplete:()=>item.destroy()});}
 }
 pour(x,y){
  const s=this.scene,player=s.player;if(!player)return;player.wateringCan.pour();player.wateringCan.update(player.anchor,player.direction,player.sprite.scaleX);
  // The stream starts at the held spout and lands on the selected soil.
  for(let i=0;i<12;i++){const start=player.wateringCan.nozzle(),drop=s.add.rectangle(start.x,start.y,2,4,0xadc6c4).setDepth(Math.max(y,player.anchor.y)+3).setAlpha(0);s.tweens.add({targets:drop,x:x-8+(i%5)*4,y:y+6+(i%3)*3,alpha:{from:1,to:0},delay:i*35,duration:280,onComplete:()=>drop.destroy()});}
 }
 coins(amount,position){if(amount>0)for(let i=0;i<3;i++){const arc=this.scene.add.image(position.x,position.y-44,'world','coin').setScale(1).setDepth(3100);this.scene.tweens.add({targets:arc,x:position.x+(i-1)*22,y:position.y-84-(i%2)*8,alpha:0,duration:420+i*60,onComplete:()=>arc.destroy()});}const coin=this.scene.add.image(position.x,position.y-70,'world','coin').setScale(2).setDepth(3100);const caption=this.scene.add.bitmapText(position.x+20,position.y-76,'pixel',(amount>0?'+':'')+amount,8).setScale(2).setTint(0xffdd96).setDepth(3100);this.scene.tweens.add({targets:[coin,caption],y:'-=30',alpha:0,duration:1500,onComplete:()=>{coin.destroy();caption.destroy();}});}
 feedback(x,y){const spark=this.scene.add.image(x,y-48,'world','marker').setScale(2).setDepth(1900);this.scene.tweens.add({targets:spark,y:y-68,alpha:0,duration:240,onComplete:()=>spark.destroy()});}
}
