import {walkable} from '../data/locations.js';
export const JUMP_DURATION=600,JUMP_COOLDOWN=850,JUMP_DISTANCE=128;
export function jumpRuntime(){return {active:null,cooldown:0};}
export function beginJump(state,runtime,direction){
 if(!['home','farm','city','forest'].includes(state.area)||!walkable(state.area,state.position.x,state.position.y,12,false,state)||runtime.active||runtime.cooldown>0)return false;
 const len=Math.hypot(direction.x,direction.y),dx=len?direction.x/len:0,dy=len?direction.y/len:0,origin={...state.position};
 let destination={...origin};
 // Check the entire feet path. Only low ledges can be crossed; no solid tunnelling.
 for(let d=4;d<=JUMP_DISTANCE;d+=4){const x=origin.x+dx*d,y=origin.y+dy*d;if(!walkable(state.area,x,y,12,true,state))break;if(walkable(state.area,x,y,12,false,state))destination={x,y};}
 runtime.active={origin,destination,elapsed:0};runtime.cooldown=JUMP_COOLDOWN;return true;
}
export function stepJump(state,runtime,delta){
 const dt=Math.min(Math.max(delta,0),50);runtime.cooldown=Math.max(0,runtime.cooldown-dt);
 const j=runtime.active;if(!j)return false;j.elapsed=Math.min(JUMP_DURATION,j.elapsed+dt);const t=j.elapsed/JUMP_DURATION;
 state.position={x:j.origin.x+(j.destination.x-j.origin.x)*t,y:j.origin.y+(j.destination.y-j.origin.y)*t};
 if(t===1){state.position={...j.destination};runtime.active=null;return true;}return false;
}
export function jumpPose(runtime){const j=runtime.active;if(!j)return {height:0,frame:null};const t=j.elapsed/JUMP_DURATION;return {height:Math.round(4*t*(1-t)*32/2)*2,frame:t<.18?6:t>.84?8:7};}
// Autosaves/menus/pagehide persist the last grounded point, never a cliff face.
export function groundedPosition(state,runtime){return runtime?.active?{...runtime.active.origin}:{...state.position};}
export function cancelJump(state,runtime){if(runtime.active)state.position={...runtime.active.origin};runtime.active=null;}
