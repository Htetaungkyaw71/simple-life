import {styleMarker} from './StyleMarker.js';
import {PEOPLE} from '../data/appearance.js';
import {groundShadow} from './GroundShadow.js';
import {residentsFor,stepResident,residentContext,residentMoveAllowed} from '../systems/residents.js';
export class ResidentView{
 constructor(scene,area){this.scene=scene;this.area=area;this.people=residentsFor(area,scene.app.state).map(n=>({...n,sprite:scene.add.image(n.x,n.y,'town',`town-person-${n.art}-down-0`).setOrigin(.5,PEOPLE.originY).setScale(PEOPLE.scale).setDepth(n.y),shadow:groundShadow(scene,n.x,n.y-3)}));scene.merchants=this.people.filter(n=>n.kind);for(const n of this.people)if(n.service)n.marker=styleMarker(scene,n.x,n.y-96,n.service);this.update(0,scene.app.state?.position||{x:0,y:0});}
 update(delta,player){for(const n of this.people){stepResident(n,this.area,delta,player,this.scene.app.state);n.sprite.setVisible(n.visible);n.shadow.setVisible(n.visible);n.marker?.setVisible(n.visible&&n.mode==='work'&&this.scene.app.state.minute>=420&&this.scene.app.state.minute<1140);const frame=n.moving?1+Math.floor(n.elapsed/125)%4:0;n.sprite.setPosition(Math.round(n.position.x/2)*2,Math.round(n.position.y/2)*2).setDepth(n.position.y).setFrame(`town-person-${n.art}-${n.direction}-${frame}`);n.shadow.setPosition(n.sprite.x,n.sprite.y-3);}}
 canMove(from,to){return residentMoveAllowed(this.people,from,to);}
 context(player){return residentContext(this.people,player);}
 available(kind){return this.people.some(n=>n.kind===kind&&n.mode==='work'&&n.visible);}
 snapshot(){return this.people.map(n=>({id:n.id,name:n.name,kind:n.kind,x:n.position.x,y:n.position.y,direction:n.direction,moving:n.moving,visible:n.visible,mode:n.mode,home:n.home,frame:n.sprite.frame.name}));}
}
