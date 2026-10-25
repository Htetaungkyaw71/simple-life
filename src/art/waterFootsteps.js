// Short lived, bounded effects; nothing is written into the saved game.
export const MAX_WATER_BURSTS=24,WATER_BURST_LIFE=820;
export const waterMotion=()=>({position:null,wet:false,distance:0,lastStep:-1000,side:1,bursts:[],emitted:0});
export function stepWaterMotion(r,p,wet,moving,time){
 r.bursts=r.bursts.filter(b=>time-b.time<WATER_BURST_LIFE);
 const old=r.position,dx=old?p.x-old.x:0,dy=old?p.y-old.y:0,distance=Math.hypot(dx,dy);
 const emit=(point,kind)=>{const length=distance||1,nx=-dy/length,ny=dx/length,offset=kind==='step'?r.side*5:0;r.side*=-1;r.bursts.push({x:point.x+nx*offset,y:point.y+ny*offset-2,time,kind,dx:dx/length,dy:dy/length,side:r.side});if(r.bursts.length>MAX_WATER_BURSTS)r.bursts.shift();r.emitted++;r.lastStep=time;};
 if(old&&wet!==r.wet&&distance<48)emit(wet?p:old,'edge');
 if(wet&&r.wet&&moving&&distance>0&&distance<32){r.distance+=distance;if(r.distance>=14&&time-r.lastStep>=100){emit(p,'step');r.distance%=14;}}
 if(!wet)r.distance=0;
 r.position={...p};r.wet=wet;
 return r.bursts;
}
export function waterBurstPose(b,time){
 const t=Math.max(0,(time-b.time)/WATER_BURST_LIFE);if(t>=1)return null;
 const radius=6+t*(b.kind==='edge'?29:22),alpha=(1-t)*.7;
 const drops=t<.58?Array.from({length:b.kind==='edge'?6:4},(_,i)=>{const a=(i/6)*Math.PI*2+b.side*.4,d=t/.58;return {x:b.x+Math.cos(a)*(4+d*16)-b.dx*d*5,y:b.y+Math.sin(a)*(2+d*5)-Math.sin(d*Math.PI)*(9+i%3*3),alpha:1-d,w:2,h:i%2?4:2};}):[];
 return {x:b.x-b.dx*t*8,y:b.y-b.dy*t*8,radius,alpha,drops};
}
