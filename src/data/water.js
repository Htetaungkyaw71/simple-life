import {pondRows,pondInset} from './geometry.js';
// One shared surface definition for terrain, animated currents and wading.
// Bridges cover water visually, while the water below remains connected.
export function riverRow(r,y){
 if(r.points){const spans=channelRows(r).get(Math.floor(y/2)*2)||[];return spans.length?[spans[0][0],y,spans[0][1]-spans[0][0],2]:[r.x,y,0,2];}
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
const channels=new WeakMap(),surfaces=new WeakMap();
// Rasterize connected, variable-width polylines once, with rounded joins/caps.
// Every renderer, shoreline and wet-foot check uses the same crisp row spans.
function merge(spans){spans.sort((a,b)=>a[0]-b[0]);const out=[];for(const s of spans){const last=out.at(-1);if(last&&s[0]<=last[1])last[1]=Math.max(last[1],s[1]);else out.push([...s]);}return out;}
export function channelRows(r){
 if(channels.has(r))return channels.get(r);const rows=new Map();
 const disc=(x,y,radius)=>{for(let yy=Math.floor((y-radius)/2)*2;yy<=y+radius;yy+=2){const dy=yy+1-y;if(Math.abs(dy)>=radius)continue;const half=Math.sqrt(radius*radius-dy*dy),span=[Math.floor((x-half)/2)*2,Math.ceil((x+half)/2)*2];if(!rows.has(yy))rows.set(yy,[]);rows.get(yy).push(span);}};
 for(let i=1;i<r.points.length;i++){const a=r.points[i-1],b=r.points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]),steps=Math.ceil(length/12);
  for(let n=0;n<=steps;n++){const t=n/steps,wiggle=Math.sin((i+t)*7+r.phase)*4;disc(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,(a[2]+(b[2]-a[2])*t)/2+wiggle);}
 }
 for(const [y,spans]of rows)rows.set(y,merge(spans));channels.set(r,rows);return rows;
}
export function waterRows(map){
 if(!cached.has(map))cached.set(map,[...map.water.flatMap(pondRows),...(map.rivers||[]).flatMap(r=>r.points?[...channelRows(r)].flatMap(([y,spans])=>spans.map(([x,right])=>[x,y,right-x,2])):Array.from({length:r.h/2},(_,i)=>riverRow(r,r.y+i*2))),...(map.falls||[]).flatMap(f=>Array.from({length:f.h/2},(_,i)=>[f.x,f.y+i*2,f.w,2]))]);
 return cached.get(map);
}
export function waterAt(map,{x,y},bridges=true){
 if(bridges&&bridgeAt(map,{x,y}))return false;
 if(map.rivers?.some(r=>r.points)){
  if(!surfaces.has(map)){const rows=new Map();for(const [x,y,w]of waterRows(map)){if(!rows.has(y))rows.set(y,[]);rows.get(y).push([x,x+w]);}for(const [y,spans]of rows)rows.set(y,merge(spans));surfaces.set(map,rows);}
  return (surfaces.get(map).get(Math.floor(y/2)*2)||[]).some(([left,right])=>x>=left&&x<right);
 }
 if((map.rivers||[]).some(r=>{if(y<r.y||y>=r.y+r.h)return false;const [left,,w]=riverRow(r,r.y+Math.floor((y-r.y)/2)*2);return x>=left&&x<left+w;}))return true;
 if((map.falls||[]).some(f=>x>=f.x&&x<f.x+f.w&&y>=f.y&&y<f.y+f.h))return true;
 return map.water.some(([left,top,w,h])=>{if(y<top||y>=top+h)return false;const inset=Math.round(pondInset(Math.floor((y-top)/2)*2,h,w)/2)*2;return x>=left+inset&&x<left+w-inset;});
}
