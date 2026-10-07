import {WOODLAND_WILDLIFE,animalDirection,wildlifeFrame} from '../data/wildlifeArt.js';
import {nearestSafe} from '../data/locations.js';
import {displace} from '../systems/combat.js';
export class WoodlandView {
 constructor(scene){
  this.scene=scene;this.animals=WOODLAND_WILDLIFE.map((a,i)=>{
   const p=nearestSafe('forest',a);return {...a,p,home:{...p},i,direction:'down',sprite:scene.add.image(p.x,p.y,'town',wildlifeFrame(a.species,'idle','down',0)).setOrigin(.5,.9).setScale(2),label:scene.add.bitmapText(p.x,p.y-64,'pixel',a.name,6).setScale(2).setOrigin(.5).setTint(0xffedcc)};
  });
 }
 update(delta,now){
  const player=this.scene.app.state.position,view=this.scene.cameras.main.worldView;
  for(const a of this.animals){
   const visible=a.p.x>view.x-80&&a.p.x<view.right+80&&a.p.y>view.y-80&&a.p.y<view.bottom+80;a.sprite.setVisible(visible);a.label.setVisible(false);if(!visible)continue;
   const distance=Math.hypot(player.x-a.p.x,player.y-a.p.y),homeDistance=Math.hypot(a.p.x-a.home.x,a.p.y-a.home.y);
   let heading={x:Math.sin(now/2000+a.i*2),y:Math.cos(now/2400+a.i*2)},speed=12;
   if(distance<110){heading={x:(a.p.x-player.x)/(distance||1),y:(a.p.y-player.y)/(distance||1)};speed=80;}
   else if(homeDistance>100){heading={x:(a.home.x-a.p.x)/homeDistance,y:(a.home.y-a.p.y)/homeDistance};speed=24;}
   else if(Math.floor(now/1800+a.i)%3===0)speed=0;
   const moved=speed>0&&displace('forest',a.p,heading.x*speed*Math.min(delta,50)/1000,heading.y*speed*Math.min(delta,50)/1000,false,8);
   if(moved)a.direction=animalDirection(heading,a.direction);
   a.sprite.setFrame(wildlifeFrame(a.species,moved?'walk':'idle',a.direction,now)).setPosition(Math.round(a.p.x/2)*2,Math.round(a.p.y/2)*2).setDepth(a.p.y);
   a.label.setVisible(distance<150).setPosition(a.p.x,a.p.y-62).setDepth(a.p.y+1);
  }
 }
}
