export const KEY_ACTIONS={SPACE:'jump',J:'jump',SHIFT:'jump',K:'attack',B:'bag',M:'map'};
export function keyboardAction(key,area,{paused=false,repeat=false,transitioning=false}={}){
 if(!area||paused||repeat||transitioning)return null;
 const action=KEY_ACTIONS[key];if(!action)return null;
 return action==='bag'||action==='jump'&&['home','farm','city','forest'].includes(area)||area==='forest'?action:null;
}
export function touchJumpTap(previous,point,time){
 const jump=!!previous&&time>=previous.time&&time-previous.time<320&&Math.hypot(point.x-previous.x,point.y-previous.y)<28;
 return {jump,tap:jump?null:{time,x:point.x,y:point.y}};
}
