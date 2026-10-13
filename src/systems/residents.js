import {HOUSE} from '../data/geometry.js';
import {MAPS} from '../data/mapLayouts.js';
import {commutePath,commutePose,pathPose,pathLength,NPC_HOME_MINUTE} from './commute.js';
import {RESIDENTS,MERCHANT_RESIDENTS} from '../data/residents.js';
import {walkable} from '../data/locations.js';
export function residentsFor(area,state=null){
 const list=[...(RESIDENTS[area]||[]),...(state&&area==='city'?MERCHANT_RESIDENTS:[])];
 return list.map(def=>{
  const n={...def,position:{x:def.x,y:def.y},waypoint:1,direction:'down',elapsed:0,wait:1500,moving:false,visible:true,mode:'work'};
  if(state){const b=MAPS[area].buildings[n.home],door=b.name==='house-village-0'?{x:HOUSE.door.x,y:b.y+256}:{x:b.x+120,y:b.y+170},porch=b.name==='house-village-0'?{...HOUSE.porch}:{x:b.x+120,y:b.y+234};n.commute=[door,...commutePath(area,porch,n.position)];Object.assign(n,commutePose(n,state.minute));}
  return n;
 });
}
// Ambient movement is transient and follows short authored, tested safe routes.
export function stepResident(n,area,delta,player,state=null){
 n.elapsed+=delta;n.moving=false;
 if(state){
  let pose=commutePose(n,state.minute);
  if(pose.mode==='toHome'){
   if(n.mode==='work'){const porch=n.commute[1];n.returnRoute=[...commutePath(area,n.position,porch),n.commute[0]];}
   const route=n.returnRoute||[...n.commute].reverse();pose={...pose,...pathPose(route,(state.minute-pose.leave)/(NPC_HOME_MINUTE-pose.leave)*pathLength(route))};
  }else if(pose.mode!=='home')n.returnRoute=null;
  if(n.mode!=='work'&&pose.mode==='work')n.position={x:n.x,y:n.y};
  Object.assign(n,pose);if(n.mode!=='work')return;
 }
 if(n.kind)return;
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
 const n=residents.filter(n=>n.visible!==false&&!n.kind&&Math.hypot(player.x-n.position.x,player.y-n.position.y)<58).sort((a,b)=>Math.hypot(player.x-a.position.x,player.y-a.position.y)-Math.hypot(player.x-b.position.x,player.y-b.position.y))[0];
 if(n?.service&&n.mode==='work')return {type:'appearanceShop',category:n.service,...n.position,residentId:n.id,label:n.service==='clothes'?'Clothes / Nell':'Barber / Sol'};
 return n?{type:'dialog',...n.position,residentId:n.id,label:'Talk to '+n.name,title:n.name,body:n.body}:null;
}

export function residentMoveAllowed(people,from,to){return people.filter(n=>n.visible!==false).every(n=>{const p=n.position,next=Math.hypot(to.x-p.x,to.y-p.y);return next>=24||next>=Math.hypot(from.x-p.x,from.y-p.y);});}

export function residentReaction(s,body){
 if(s.story?.keepsake!=='hidden'&&s.story?.keepsake)return 'That little sun belonged to your grandfather. Take it home; there is always another morning.';
 if(s.settlement.projects.includes('commons'))return 'Our new Commons seats feel like home. The Farm board now has a Copper Can for you.';
 if(s.hasSoldProduce)return 'Your first harvest reached the market! Help our Commons at the town board by the square.';
 return 'Water once each day. While the seeds grow, visit the town board. Gather 12 Wood and 6 Stone for our Commons.';
}
