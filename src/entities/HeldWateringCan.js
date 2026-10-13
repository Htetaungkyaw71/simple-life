// Hand anchors are native farmer pixels relative to the grounded feet.
const HANDS={down:[5,-11],up:[-5,-13],left:[-6,-12],right:[6,-12]};
export function wateringCanPose(position,direction,scale,height=0,pouring=false,bob=0){
 const [hx,hy]=HANDS[direction]||HANDS.down,flip=direction==='left'||direction==='up';
 return {x:Math.round(position.x+hx*scale),y:Math.round(position.y+(hy+bob)*scale-height),flip,originX:flip?13/16:3/16,rotation:(flip?-1:1)*(pouring?.55:0),depth:Math.round(position.y)+(direction==='up'?-1:1)};
}
export const AXE_SWING_MS=420;
// Slow lift, quick cut, then settle back into the reference resting pose.
export function axeSwingPose(direction,remaining){
 const flip=direction==='right'||direction==='down',side=flip?1:-1,t=1-Math.max(0,Math.min(AXE_SWING_MS,remaining))/AXE_SWING_MS;
 const ease=v=>v*v*(3-2*v);
 const turn=remaining<=0?0:t<.26?-.55*ease(t/.26):t<.60?-.55+1.65*ease((t-.26)/.34):1.1*(1-ease((t-.60)/.40));
 return {flip,originX:flip?13/16:3/16,rotation:Math.PI+side*turn,reach:Math.round(Math.sin(t*Math.PI)*2)*2};
}
// Canvas and WebGL share the same cached native pixels; sprite tint is WebGL-only.
export function copperCanPixels(input){
 const data=new Uint8ClampedArray(input);
 for(let i=0;i<data.length;i+=4){if(!data[i+3]||Math.max(data[i],data[i+1],data[i+2])<80)continue;const light=(data[i]+data[i+1]+data[i+2])/3;data[i]=Math.min(255,Math.round(light*1.1+24));data[i+1]=Math.round(light*.78+12);data[i+2]=Math.round(light*.47+8);}
 return data;
}
function copperCanTexture(scene){
 const key='watering-can-copper';if(scene.textures.exists(key))return key;
 const frame=scene.textures.getFrame('town','watering-can-item'),t=scene.textures.createCanvas(key,frame.cutWidth,frame.cutHeight),ctx=t.context;
 ctx.drawImage(frame.source.image,frame.cutX,frame.cutY,frame.cutWidth,frame.cutHeight,0,0,frame.cutWidth,frame.cutHeight);
 const pixels=ctx.getImageData(0,0,frame.cutWidth,frame.cutHeight);pixels.data.set(copperCanPixels(pixels.data));ctx.putImageData(pixels,0,0);t.setFilter(1);t.refresh();return key;
}
export class HeldWateringCan {
 constructor(scene){
  this.scene=scene;this.can=scene.add.image(0,0,'town','watering-can-item').setVisible(false);
  this.hand=scene.add.rectangle(0,0,2,2,0xf1b7ad).setVisible(false);this.remaining=0;this.lastTool=scene.app.state?.selected;this.lastTime=scene.time.now;
 }
 pour(){this.remaining=650;}
 swing(){this.remaining=AXE_SWING_MS;this.swingDirection=this.scene.player?.direction;}
 update(position,direction,scale,height=0,moving=false){
  const now=this.scene.time.now,delta=Math.max(0,Math.min(100,now-this.lastTime));this.lastTime=now;
  if(!this.scene.app.paused)this.remaining=Math.max(0,this.remaining-delta);
  const tool=this.scene.app.state?.selected,visible=['water','shovel','axe'].includes(tool)&&!this.scene.app.transitioning;
  if(this.lastTool!==tool){this.remaining=0;this.lastTool=tool;}
  this.can.setVisible(visible);this.hand.setVisible(visible&&tool!=='axe');if(!visible){this.remaining=0;return;}
  const bob=moving&&!this.remaining?Math.floor(now/125)%2:0,p=wateringCanPose(position,direction,scale,height,this.remaining>0,bob);
  if(tool!=='water'){p.originX=p.flip?12/16:4/16;p.rotation=(p.flip?-1:1)*(this.remaining?(.9*this.remaining/420):0);}
  if(tool==='axe'){
   const facing=this.remaining&&this.swingDirection?this.swingDirection:direction,pose=axeSwingPose(facing,this.remaining);
   Object.assign(p,pose);
   p.depth=Math.round(position.y)+(facing==='up'?-1:1);
  }
  const copper=tool==='water'&&this.scene.app.state?.ownsCopperCan;this.can.setTexture(copper?copperCanTexture(this.scene):'town',copper?undefined:tool==='water'?'watering-can-item':tool+'-item').setOrigin(p.originX,tool==='water'?5/16:tool==='axe'?2/16:3/16).setScale(scale).setFlipX(p.flip).setFlipY(false).setPosition(p.x,p.y).setRotation(p.rotation).setDepth(p.depth);
  this.can.setTint(0xffffff);
  this.hand.setSize(2,2).setScale(scale).setPosition(p.x,p.y).setDepth(p.depth+1);
 }
 nozzle(){const sign=this.can.flipX?-1:1,scale=this.can.scaleX;return {x:this.can.x+sign*10*scale,y:this.can.y+(this.remaining?4:-1)*scale};}
}
