import {MAPS} from '../data/mapLayouts.js';
export class Atmosphere {
 constructor(scene,area){
  this.scene=scene;this.area=area;this.lastStep=0;this.frame=-1;
  this.butterflies=MAPS[area].details.filter(p=>p.name==='flowers').slice(0,8).map((p,i)=>({x:p.x,y:p.y,i,sprite:scene.add.image(p.x,p.y,'town','butterfly0').setScale(2).setDepth(1800)}));
 }
 update(time,moving,position){
  const frame=Math.floor(time/600)%2;
  if(frame!==this.frame){this.frame=frame;for(const water of this.scene.water)water.setFrame('water'+frame);for(const fountain of this.scene.fountains)fountain.setFrame('fountain'+frame);}
  for(const b of this.butterflies)b.sprite.setFrame('butterfly'+Math.floor(time/180+b.i)%2).setPosition(b.x+Math.round(Math.sin(time/1300+b.i)*24)*2,b.y+Math.round(Math.cos(time/1800+b.i)*12)*2);
  if(moving&&time-this.lastStep>180){this.lastStep=time;const dust=this.scene.add.image(Math.round(position.x/2)*2,Math.round(position.y/2)*2,'town','dust').setScale(2).setDepth(position.y-1);this.scene.tweens.add({targets:dust,y:dust.y-6,alpha:0,duration:280,onComplete:()=>dust.destroy()});}
 }
 feedback(x,y){const spark=this.scene.add.image(x,y-48,'world','marker').setScale(2).setDepth(1900);this.scene.tweens.add({targets:spark,y:y-68,alpha:0,duration:240,onComplete:()=>spark.destroy()});}
}
