import {pondRows,pondInset} from './geometry.js';
// One shared surface definition for terrain, animated currents and wading.
// Bridges cover water visually, while the water below remains connected.
export function riverRow(r,y){
 const offset=Math.round((Math.sin((y-r.y)/230+r.phase)*20+Math.sin((y-r.y)/97+r.phase)*6)/2)*2;
 return [r.x+offset,y,r.w,2];
}
const cached=new WeakMap();
export function waterRows(map){
 if(!cached.has(map))cached.set(map,[...map.water.flatMap(pondRows),...(map.rivers||[]).flatMap(r=>Array.from({length:r.h/2},(_,i)=>riverRow(r,r.y+i*2))),...(map.falls||[]).flatMap(f=>Array.from({length:f.h/2},(_,i)=>[f.x,f.y+i*2,f.w,2]))]);
 return cached.get(map);
}
export function waterAt(map,{x,y},bridges=true){
 if(bridges&&(map.bridges||[]).some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h))return false;
 if((map.rivers||[]).some(r=>{if(y<r.y||y>=r.y+r.h)return false;const [left,,w]=riverRow(r,r.y+Math.floor((y-r.y)/2)*2);return x>=left&&x<left+w;}))return true;
 if((map.falls||[]).some(f=>x>=f.x&&x<f.x+f.w&&y>=f.y&&y<f.y+f.h))return true;
 return map.water.some(([left,top,w,h])=>{if(y<top||y>=top+h)return false;const inset=Math.round(pondInset(Math.floor((y-top)/2)*2,h,w)/2)*2;return x>=left+inset&&x<left+w-inset;});
}
