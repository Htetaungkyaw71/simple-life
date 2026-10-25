const DIRECTIONS=['down','up','left','right'];
// Visual timing only. Rewards, damage, energy and cooldowns stay in their systems.
export function characterFrame(rig,action,direction,elapsed=0){
 const clip=rig.clips[action],duration=clip.durations.reduce((sum,n)=>sum+n,0);
 let time=Math.max(0,elapsed),phase=0;
 if(clip.loop)time%=duration;
 for(;phase<clip.count-1&&time>=clip.durations[phase];phase++)time-=clip.durations[phase];
 return {frame:clip.offset+Math.max(0,DIRECTIONS.indexOf(direction))*rig.columns+phase,phase,duration,complete:!clip.loop&&elapsed>=duration};
}
