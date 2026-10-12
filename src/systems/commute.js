import {walkable} from '../data/locations.js';
import {MAPS} from '../data/mapLayouts.js';
import {waterAt} from '../data/water.js';
const paths=new Map(),grids=new Map(),STEP=16;
// A shared dry walking grid uses the same house/head clearance as the farmer.
export function commutePath(area,start,end){
 const key=[area,start.x,start.y,end.x,end.y].join(':');if(paths.has(key))return paths.get(key);
 const size=MAPS[area].size||{width:2240,height:1152},cols=Math.ceil(size.width/STEP),rows=Math.ceil(size.height/STEP);
 let grid=grids.get(area);if(!grid){grid=new Map();grids.set(area,grid);}
 const safe=(x,y)=>{const k=x+','+y;if(!grid.has(k))grid.set(k,walkable(area,x,y,8)&&!waterAt(MAPS[area],{x,y}));return grid.get(k);};
 const cell=p=>{let best=null,d=Infinity;for(let y=Math.max(1,Math.floor(p.y/STEP)-6);y<Math.min(rows,Math.floor(p.y/STEP)+7);y++)for(let x=Math.max(1,Math.floor(p.x/STEP)-6);x<Math.min(cols,Math.floor(p.x/STEP)+7);x++){const dd=Math.hypot(x*STEP-p.x,y*STEP-p.y);if(dd<d&&safe(x*STEP,y*STEP)){best=y*cols+x;d=dd;}}return best;};
 const first=cell(start),last=cell(end);if(first==null||last==null)throw new Error('No doorway approach in '+area);
 const queue=[first],parent=new Map([[first,null]]);
 for(let i=0;i<queue.length&&!parent.has(last);i++){const k=queue[i],x=k%cols,y=Math.floor(k/cols);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,n=ny*cols+nx;if(nx<1||ny<1||nx>=cols||ny>=rows||parent.has(n)||!safe(nx*STEP,ny*STEP)||!safe((x+dx/2)*STEP,(y+dy/2)*STEP))continue;parent.set(n,k);queue.push(n);}}
 if(!parent.has(last))throw new Error('Disconnected NPC home in '+area);
 const points=[];for(let k=last;k!=null;k=parent.get(k))points.unshift({x:k%cols*STEP,y:Math.floor(k/cols)*STEP});
 const route=[{...start},...points,{...end}];if(paths.size>=64)paths.delete(paths.keys().next().value);paths.set(key,route);return route;
}
export function pathLength(route){return route.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.x-route[i].x,p.y-route[i].y),0);}
export function pathPose(route,distance){
 let from=route[0];for(const to of route.slice(1)){const dx=to.x-from.x,dy=to.y-from.y,d=Math.hypot(dx,dy);if(distance<=d&&d){const t=Math.max(0,distance)/d;return {position:{x:from.x+dx*t,y:from.y+dy*t},direction:Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up'};}distance-=d;from=to;}
 return {position:{...from},direction:'up'};
}
// Travel is clock-derived, including reload/scene reentry. Menus pause the clock.
export const NPC_HOME_MINUTE=1140;
// Reach the home door by 19:00; emerge at 06:00.
export function commutePose(n,minute){
 const route=n.commute,distance=pathLength(route),duration=Math.max(8,Math.min(60,distance/110*6)),leave=NPC_HOME_MINUTE-duration;
 if(minute<360||minute>=NPC_HOME_MINUTE)return {position:{...route[0]},direction:'up',visible:false,moving:false,mode:'home',leave};
 if(minute<360+duration)return {...pathPose(route,(minute-360)/duration*distance),visible:true,moving:true,mode:'toWork',leave};
 if(minute>=leave)return {...pathPose([...route].reverse(),(minute-leave)/duration*distance),visible:true,moving:true,mode:'toHome',leave};
 return {visible:true,moving:false,mode:'work',leave};
}
