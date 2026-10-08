// Hand anchors are native farmer pixels relative to the grounded feet.
const HANDS={down:[5,-9],up:[-6,-13],left:[-8,-11],right:[8,-11]};
export function wateringCanPose(position,direction,scale,height=0,pouring=false,bob=0){
 const [hx,hy]=HANDS[direction]||HANDS.down,flip=direction==='left'||direction==='up';
 return {x:Math.round(position.x+hx*scale),y:Math.round(position.y+(hy+bob)*scale-height),flip,originX:flip?13/16:3/16,rotation:(flip?-1:1)*(pouring?.55:0),depth:Math.round(position.y)+(direction==='up'?-1:1)};
}
export class HeldWateringCan {
 constructor(scene){
  this.scene=scene;this.can=scene.add.image(0,0,'town','watering-can-item').setVisible(false);
  this.hand=scene.add.rectangle(0,0,2,2,0xf1b7ad).setVisible(false);this.remaining=0;this.lastTime=scene.time.now;
 }
 pour(){this.remaining=650;}
 update(position,direction,scale,height=0,moving=false){
  const now=this.scene.time.now,delta=Math.max(0,Math.min(100,now-this.lastTime));this.lastTime=now;
  if(!this.scene.app.paused)this.remaining=Math.max(0,this.remaining-delta);
  const visible=this.scene.app.state?.selected==='water'&&!this.scene.app.transitioning;
  this.can.setVisible(visible);this.hand.setVisible(visible);if(!visible){this.remaining=0;return;}
  const bob=moving&&!this.remaining?Math.floor(now/125)%2:0,p=wateringCanPose(position,direction,scale,height,this.remaining>0,bob);
  this.can.setOrigin(p.originX,5/16).setScale(scale).setFlipX(p.flip).setPosition(p.x,p.y).setRotation(p.rotation).setDepth(p.depth);
  this.hand.setScale(scale).setPosition(p.x,p.y).setDepth(p.depth+1);
 }
 nozzle(){const sign=this.can.flipX?-1:1,scale=this.can.scaleX;return {x:this.can.x+sign*10*scale,y:this.can.y+(this.remaining?4:-1)*scale};}
}
