import {PEOPLE_HANDS,PEOPLE_STYLE_HANDS} from '../data/peopleHands.js';
import {appearanceIndex} from '../data/appearance.js';
import {farmerCarryPose} from '../systems/farmerCarry.js';
// Native source grips relative to the shared ground plane.
const HANDS=Object.fromEntries(Object.entries(PEOPLE_HANDS).map(([dir,poses])=>[dir,poses[0]]));
export function wateringCanPose(position,direction,scale,height=0,pouring=false,bob=0,style=0,sourceHands=null){
 const hands=sourceHands||PEOPLE_STYLE_HANDS[style]||PEOPLE_STYLE_HANDS[0],[hx,hy]=hands[direction]?.[0]||HANDS.down,flip=direction==='left'||direction==='up';
 return {x:Math.round(position.x+hx*scale),y:Math.round(position.y+(hy+bob)*scale-height),flip,originX:flip?13/16:3/16,rotation:(flip?-1:1)*(pouring?.55:0),depth:Math.round(position.y)+(direction==='up'?-1:1)};
}

// Match every authored idle/run/jump grip instead of a synthetic four-step bob.
export function walkingHandOffset(direction,frame,style=0,sourceHands=null){
 const hands=sourceHands||PEOPLE_STYLE_HANDS[style]||PEOPLE_STYLE_HANDS[0],poses=hands[direction]||hands.down,[x,y]=poses[frame]||poses[0],[bx,by]=poses[0];
 return {x:x-bx,y:y-by};
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
 constructor(scene,sourceHands=null){
  this.scene=scene;this.sourceHands=sourceHands;this.style=appearanceIndex(scene.app.state?.appearance);this.can=scene.add.image(0,0,'town','watering-can-item').setVisible(false);
  this.hand=scene.add.rectangle(0,0,2,2,0xf1b7ad).setVisible(false);this.remaining=0;this.lastTool=scene.app.state?.selected;this.lastTime=scene.time.now;
 }
 pour(){this.remaining=650;}
 swing(){this.remaining=AXE_SWING_MS;this.swingDirection=this.scene.player?.direction;}
 update(position,direction,scale,height=0,moving=false,walkFrame=0,bakedTool=false,carryMode=null){
  const now=this.scene.time.now,delta=Math.max(0,Math.min(100,now-this.lastTime));this.lastTime=now;
  if(!this.scene.app.paused)this.remaining=Math.max(0,this.remaining-delta);
  const tool=this.scene.app.state?.selected,visible=['water','shovel','axe'].includes(tool)&&!this.scene.app.transitioning;
  if(this.lastTool!==tool){this.remaining=0;this.lastTool=tool;}
  this.can.setVisible(visible&&!bakedTool);this.hand.setVisible(visible&&!bakedTool&&tool!=='axe'&&!this.sourceHands);this.grip?.setVisible(false);if(!visible){this.remaining=0;return;}
  if(carryMode){
   const player=this.scene.player,body=player?.sprite,p=farmerCarryPose(position,direction,carryMode,walkFrame,tool,height,player?.carryProfile);
   this.hand.setVisible(false);if(!p||bakedTool)return;
   this.can.setTexture('boy',p.frame).setOrigin(p.gripX,p.gripY).setScale(player.rig.scale).setFlipX(false).setFlipY(false).setPosition(p.x,p.y).setRotation(p.rotation).setDepth(p.depth).setTint(0xffffff);
   // Repaint the actual source hand over the handle; never fabricate fingers.
   if(direction!=='up'&&body){
    this.grip??=this.scene.add.image(0,0,body.texture.key,0);
    const [hx,hy]=p.hand,s=player.rig.scale,x=Math.round(hx/s+32-.5),y=Math.round(hy/s+56-.5);
    this.grip.setTexture(body.texture.key,body.frame.name).setOrigin(.5,player.rig.originY).setScale(s).setPosition(body.x,body.y).setCrop(x-1,y-1,3,3).setDepth(p.depth+1).setVisible(true);
   }
   return;
  }
  const hand=!this.remaining?walkingHandOffset(direction,walkFrame,this.style,this.sourceHands):{x:0,y:0},p=wateringCanPose(position,direction,scale,height,this.remaining>0,0,this.style,this.sourceHands);
  p.x+=hand.x*scale;p.y+=hand.y*scale;
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
 nozzle(){const baked=this.scene.player?.actionNozzle?.();if(baked)return baked;const sign=this.can.flipX?-1:1,scale=this.can.scaleX;return {x:this.can.x+sign*10*scale,y:this.can.y+(this.remaining?4:-1)*scale};}
}
