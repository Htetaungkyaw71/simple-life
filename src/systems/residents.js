import {RESIDENTS} from '../data/residents.js';
import {walkable} from '../data/locations.js';
export function residentsFor(area){return (RESIDENTS[area]||[]).map(n=>({...n,position:{x:n.x,y:n.y},waypoint:1,direction:'down',elapsed:0,wait:1500,moving:false}));}
// Ambient movement is transient and follows short authored, tested safe routes.
export function stepResident(n,area,delta,player){
 n.elapsed+=delta;n.moving=false;
 if(Math.hypot(player.x-n.position.x,player.y-n.position.y)<84){const dx=player.x-n.position.x,dy=player.y-n.position.y;if(Math.hypot(dx,dy)>10)n.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';return;}
 if(n.route.length<2)return;
 if(n.wait>0){n.wait=Math.max(0,n.wait-delta);return;}
 const [x,y]=n.route[n.waypoint],dx=x-n.position.x,dy=y-n.position.y,d=Math.hypot(dx,dy);
 if(d<2){n.position={x,y};n.waypoint=(n.waypoint+1)%n.route.length;n.wait=2000;return;}
 const step=Math.min(d,26*delta/1000),p={x:n.position.x+dx/d*step,y:n.position.y+dy/d*step};
 if(!walkable(area,p.x,p.y,8))return;
 n.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';n.position=p;n.moving=true;
}
export function residentContext(residents,player){
 const n=residents.filter(n=>Math.hypot(player.x-n.position.x,player.y-n.position.y)<58).sort((a,b)=>Math.hypot(player.x-a.position.x,player.y-a.position.y)-Math.hypot(player.x-b.position.x,player.y-b.position.y))[0];
 return n?{type:'dialog',...n.position,label:'Talk to '+n.name,title:n.name,body:n.body}:null;
}

export function residentMoveAllowed(people,from,to){return people.every(n=>{const p=n.position,next=Math.hypot(to.x-p.x,to.y-p.y);return next>=24||next>=Math.hypot(from.x-p.x,from.y-p.y);});}
