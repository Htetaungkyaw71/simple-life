import {WOODLAND_WILDLIFE,animalDirection,wildlifeFrame} from '../data/wildlifeArt.js';
export class WoodlandView {
 constructor(scene){
  this.scene=scene;this.animals=WOODLAND_WILDLIFE.map((a,i)=>{
   const p=scene.app.state.forest.woodland[a.id].position;return {...a,p,previous:{...p},i,direction:'down',sprite:scene.add.image(p.x,p.y,'town',wildlifeFrame(a.species,'idle','down',0)).setOrigin(.5,.9).setScale(2),label:scene.add.bitmapText(p.x,p.y-64,'pixel',a.name,6).setScale(2).setOrigin(.5).setTint(0xffedcc)};
  });
 }
 update(delta,now){
  const player=this.scene.app.state.position,view=this.scene.cameras.main.worldView;
  for(const a of this.animals){
   const state=this.scene.app.state.forest.woodland[a.id];a.p=state.position;
   const visible=state.health>0&&a.p.x>view.x-80&&a.p.x<view.right+80&&a.p.y>view.y-80&&a.p.y<view.bottom+80;a.sprite.setVisible(visible);a.label.setVisible(false);if(!visible)continue;
   const distance=Math.hypot(player.x-a.p.x,player.y-a.p.y),heading={x:a.p.x-a.previous.x,y:a.p.y-a.previous.y},moved=Math.hypot(heading.x,heading.y)>.05;a.previous={...a.p};
   if(moved)a.direction=animalDirection(heading,a.direction);
   a.sprite.setFrame(wildlifeFrame(a.species,moved?'walk':'idle',a.direction,now)).setPosition(Math.round(a.p.x/2)*2,Math.round(a.p.y/2)*2).setDepth(a.p.y);
   a.label.setVisible(distance<150).setPosition(a.p.x,a.p.y-62).setDepth(a.p.y+1);
  }
 }
}
