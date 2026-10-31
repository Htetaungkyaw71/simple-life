import {residentVisual,residentFrame} from '../data/matchingNpcs.js';
import {groundShadow} from './GroundShadow.js';
import {styleMarker} from './StyleMarker.js';
import {residentsFor,stepResident,residentContext,residentMoveAllowed} from '../systems/residents.js';

export class ResidentView{
 constructor(scene,area){
  this.scene=scene;this.area=area;
  this.people=residentsFor(area,scene.app.state).map(n=>{
   const baseVisual=residentVisual(n),scale=baseVisual.customSheet?(scene.player?.rig.scale??1.5)*(baseVisual.scaleMultiplier??1):(baseVisual.scale??1),visual={...baseVisual,scale,height:baseVisual.customSheet?64*scale:baseVisual.height};
   const sprite=visual.customSheet?scene.add.sprite(n.x,n.y,visual.texture,0):scene.add.image(n.x,n.y,'town',residentFrame(n));
   return {...n,visual,walkDistance:0,sprite:sprite.setOrigin(.5,visual.originY).setScale(scale).setDepth(n.y),shadow:groundShadow(scene,n.x,n.y-3)};
  });
  scene.merchants=this.people.filter(n=>n.kind);
  for(const n of this.people)if(n.service)n.marker=styleMarker(scene,n.x,n.y-n.visual.height-6,n.service);
  this.update(0,scene.app.state?.position||{x:0,y:0});
 }
 update(delta,player){
  for(const n of this.people){
   const previousX=n.position.x,previousY=n.position.y;stepResident(n,this.area,delta,player,this.scene.app.state,this.people,this.scene.app.festivalActive===true);
   n.sprite.setVisible(n.visible);n.shadow.setVisible(n.visible&&!n.sitting);n.marker?.setVisible(n.visible&&n.serviceActive);
   if(n.visual.customSheet){
    const direction=['down','up','left','right'].includes(n.direction)?n.direction:'down',row=direction==='down'?0:direction==='up'?1:2,walkFrames=n.visual.walkFrames[row],stepPixels=n.visual.stepPixels[row];
    if(n.moving)n.walkDistance+=Math.hypot(n.position.x-previousX,n.position.y-previousY);
    const frame=n.sitting?row*n.visual.columns+n.visual.sitFrames[row]:n.moving?row*n.visual.columns+1+Math.floor(n.walkDistance/(stepPixels*n.visual.scale))%walkFrames:row*n.visual.columns;
    const y=n.position.y+(n.sitting?n.visual.sitShift*n.visual.scale:0),depth=n.sitting?(n.activity?.location?.depth??n.seat?.depth??n.position.y+1):n.position.y,flipX=n.sitting?direction==='right':direction==='left';
    n.sprite.stop().setFrame(frame).setPosition(Math.round(n.position.x),Math.round(y)).setDepth(depth).setFlipX(flipX);
   }else n.sprite.setPosition(Math.round(n.position.x),Math.round(n.position.y)).setDepth(n.position.y).setFrame(residentFrame(n));
   n.shadow.setPosition(Math.round(n.position.x),Math.round(n.position.y)-3);
  }
 }
 canMove(from,to){return residentMoveAllowed(this.people,from,to);}
 context(player){return residentContext(this.people,player);}
 available(kind){return this.people.some(n=>n.kind===kind&&n.serviceActive&&n.visible);}
 snapshot(){return this.people.map(n=>({id:n.id,name:n.name,kind:n.kind,x:n.position.x,y:n.position.y,direction:n.direction,moving:n.moving,sitting:n.sitting,visible:n.visible,mode:n.mode,pattern:n.pattern,activity:n.activity?.id||null,meeting:n.meeting||null,serviceActive:!!n.serviceActive,home:n.home,frame:n.sprite.frame.name,nativeWidth:n.sprite.frame.width,nativeHeight:n.sprite.frame.height,scale:n.sprite.scaleX,originY:n.sprite.originY,markerVisible:n.marker?.visible||false}));}
}
