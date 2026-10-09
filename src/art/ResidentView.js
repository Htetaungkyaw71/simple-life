import {residentsFor,stepResident,residentContext,residentMoveAllowed} from '../systems/residents.js';
export class ResidentView{
 constructor(scene,area){this.scene=scene;this.area=area;this.people=residentsFor(area,scene.app.state).map(n=>({...n,sprite:scene.add.image(n.x,n.y,'town',`town-person-${n.art}-down-0`).setOrigin(.5,.94).setScale(2).setDepth(n.y),shadow:scene.add.ellipse(n.x,n.y-3,28,8,0x3d4531,.22).setDepth(1)}));scene.merchants=this.people.filter(n=>n.kind);this.update(0,scene.app.state?.position||{x:0,y:0});}
 update(delta,player){for(const n of this.people){stepResident(n,this.area,delta,player,this.scene.app.state);n.sprite.setVisible(n.visible);n.shadow.setVisible(n.visible);const frame=n.moving?1+Math.floor(n.elapsed/125)%4:0;n.sprite.setPosition(Math.round(n.position.x/2)*2,Math.round(n.position.y/2)*2).setDepth(n.position.y).setFrame(`town-person-${n.art}-${n.direction}-${frame}`);n.shadow.setPosition(n.sprite.x,n.sprite.y-3);}}
 canMove(from,to){return residentMoveAllowed(this.people,from,to);}
 context(player){return residentContext(this.people,player);}
 available(kind){return this.people.some(n=>n.kind===kind&&n.mode==='work'&&n.visible);}
 snapshot(){return this.people.map(n=>({id:n.id,name:n.name,x:n.position.x,y:n.position.y,direction:n.direction,moving:n.moving,visible:n.visible,mode:n.mode,home:n.home,frame:n.sprite.frame.name}));}
}
