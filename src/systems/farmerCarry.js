import {BOY_HANDS,BOY_TOOL_FRAMES,BOY_CARRY_ANGLES} from '../data/revisedFarmer.js';

// The same local phase drives body, painted hand and held-tool angle. The
// world jump arc is applied once to both layers, independently of tool use.
export function farmerCarryPose(position,direction,mode,phase,tool,height=0,profile=null){
 const frame=BOY_TOOL_FRAMES[tool]?.[direction];
 if(frame===undefined)return null;
 const sourceHands=profile?.hands||BOY_HANDS,angles=profile?.angles||BOY_CARRY_ANGLES;
 const hands=sourceHands[direction]?.[mode]||sourceHands.down.idle;
 const [hx,hy]=hands[phase]||hands[0];
 return {frame,x:Math.round(position.x+hx),y:Math.round(position.y+hy-height),
  rotation:(angles[direction]?.[mode]?.[phase]||0)*(tool==='water'?.35:tool==='shovel'?.6:1),
  depth:Math.round(position.y)+(direction==='up'?-1:1),
  gripX:32.5/64,gripY:32.5/64,hand:[hx,hy]};
}
