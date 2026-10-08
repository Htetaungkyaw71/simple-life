import {pondRows,pondInset} from './geometry.js';
// One shared surface definition for terrain, animated currents and wading.
// Bridges cover water visually, while the water below remains connected.
export function riverRow(r,y){
 const t=y-r.y,phase=r.phase||0,bend=r.bend??20,detail=r.detail??6,widen=r.widen??0,shore=r.shore??0;
 const offset=Math.round((Math.sin(t/230+phase)*bend+Math.sin(t/97+phase)*detail+Math.sin(t/43+phase*2)*4)/2)*2;
 const variation=Math.round((Math.sin(t/173+phase+.7)*widen+Math.sin(t/61+phase)*widen*.24)/2)*2;
 const left=Math.round((r.x+offset-variation/2+Math.sin(t/57+phase*3)*shore+Math.sin(t/29+.9+phase)*shore*.35)/2)*2;
 const right=Math.round((r.x+offset+r.w+variation/2+Math.sin(t/69+phase+.8)*shore+Math.sin(t/37+phase*2)*shore*.3)/2)*2;
 return [left,y,right-left,2];
}
export function bridgeAt(map,{x,y}){return (map.bridges||[]).some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h);}
// Include vegetation tips so a dry root cannot place leaves over a bridge deck.
export function dryFootprint(map,{x,y,w,h}){
 for(let yy=y;yy<=y+h;yy+=4)for(let xx=x;xx<=x+w;xx+=4)if(waterAt(map,{x:xx,y:yy},false)||bridgeAt(map,{x:xx,y:yy}))return false;
 return true;
}
const cached=new WeakMap();
export function waterRows(map){
 if(!cached.has(map))cached.set(map,[...map.water.flatMap(pondRows),...(map.rivers||[]).flatMap(r=>Array.from({length:r.h/2},(_,i)=>riverRow(r,r.y+i*2))),...(map.falls||[]).flatMap(f=>Array.from({length:f.h/2},(_,i)=>[f.x,f.y+i*2,f.w,2]))]);
 return cached.get(map);
}
export function waterAt(map,{x,y},bridges=true){
 if(bridges&&bridgeAt(map,{x,y}))return false;
 if((map.rivers||[]).some(r=>{if(y<r.y||y>=r.y+r.h)return false;const [left,,w]=riverRow(r,r.y+Math.floor((y-r.y)/2)*2);return x>=left&&x<left+w;}))return true;
 if((map.falls||[]).some(f=>x>=f.x&&x<f.x+f.w&&y>=f.y&&y<f.y+f.h))return true;
 return map.water.some(([left,top,w,h])=>{if(y<top||y>=top+h)return false;const inset=Math.round(pondInset(Math.floor((y-top)/2)*2,h,w)/2)*2;return x>=left+inset&&x<left+w-inset;});
}
