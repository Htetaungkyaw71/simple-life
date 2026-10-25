import {styleMarker} from './StyleMarker.js';
import {residentVisual,residentFrame} from '../data/matchingNpcs.js';
import {groundShadow} from './GroundShadow.js';
import {residentsFor,stepResident,residentContext,residentMoveAllowed} from '../systems/residents.js';
export class ResidentView{
 constructor(scene,area){this.scene=scene;this.area=area;this.people=residentsFor(area,scene.app.state).map(n=>{const visual=residentVisual(n);return {...n,visual,sprite:scene.add.image(n.x,n.y,'town',residentFrame(n)).setOrigin(.5,visual.originY).setScale(visual.scale).setDepth(n.y),shadow:groundShadow(scene,n.x,n.y-3)};});scene.merchants=this.people.filter(n=>n.kind);for(const n of this.people)if(n.service)n.marker=styleMarker(scene,n.x,n.y-n.visual.height-6,n.service);this.update(0,scene.app.state?.position||{x:0,y:0});}
 update(delta,player){for(const n of this.people){stepResident(n,this.area,delta,player,this.scene.app.state);n.sprite.setVisible(n.visible);n.shadow.setVisible(n.visible);n.marker?.setVisible(n.visible&&n.mode==='work'&&this.scene.app.state.minute>=420&&this.scene.app.state.minute<1140);n.sprite.setPosition(Math.round(n.position.x),Math.round(n.position.y)).setDepth(n.position.y).setFrame(residentFrame(n));n.shadow.setPosition(n.sprite.x,n.sprite.y-3);}}
 canMove(from,to){return residentMoveAllowed(this.people,from,to);}
 context(player){return residentContext(this.people,player);}
 available(kind){return this.people.some(n=>n.kind===kind&&n.mode==='work'&&n.visible);}
 snapshot(){return this.people.map(n=>({id:n.id,name:n.name,kind:n.kind,x:n.position.x,y:n.position.y,direction:n.direction,moving:n.moving,visible:n.visible,mode:n.mode,home:n.home,frame:n.sprite.frame.name,nativeWidth:n.sprite.frame.width,nativeHeight:n.sprite.frame.height,scale:n.sprite.scaleX,originY:n.sprite.originY,markerVisible:n.marker?.visible||false}));}
}
