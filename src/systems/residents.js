import {HOUSE} from '../data/geometry.js';
import {MAPS} from '../data/mapLayouts.js';
import {commutePath,commutePose,NPC_WALK_SPEED} from './commute.js';
import {RESIDENTS,MERCHANT_RESIDENTS} from '../data/residents.js';
import {walkable} from '../data/locations.js';
import {SHOP_ROOMS,shopAreaForResident} from '../data/cityShops.js';
import {silasResidentStoryPose} from './silasStory.js';
import {resolveResidentSchedule,residentDefinition} from './residentSchedules.js';
import {festivalResidentPose} from './lastLantern.js';
export function residentsFor(area,state=null){
 if(SHOP_ROOMS[area]){
  const room=SHOP_ROOMS[area],definition=residentDefinition(room.resident),resolved=state?resolveResidentSchedule(state,room.resident):null;
  if(!definition||state&&(!resolved?.serviceActive||resolved.area!==area))return [];
  return [{...definition,indoorService:true,workArea:area,x:room.position.x,y:room.position.y,position:{...room.position},waypoint:1,direction:resolved?.direction||'down',elapsed:0,wait:0,moving:false,sitting:false,visible:true,mode:'work',serviceActive:true,activity:resolved?.activity||null,meeting:null}];
 }
 const list=[...(RESIDENTS[area]||[]),...(state&&area==='city'?MERCHANT_RESIDENTS:[])];
 return list.map(def=>{
  const n={...def,position:{x:def.x,y:def.y},waypoint:1,direction:'down',elapsed:0,wait:1500,moving:false,sitting:!!def.seat,visible:true,mode:'work'};
  const workArea=area==='city'&&shopAreaForResident(n.id);if(workArea){n.workArea=workArea;Object.assign(n,SHOP_ROOMS[workArea].outside);n.position={x:n.x,y:n.y};}
  if(state){const resolved=resolveResidentSchedule(state,n.id);if(resolved){Object.assign(n,resolved);n.mode=resolved.phase;n.position={...resolved.position};n.x=n.position.x;n.y=n.position.y;n.serviceActive=resolved.serviceActive;n.activity=resolved.activity;n.meeting=resolved.activity?.meeting||null;}else n.visible=false;}
  else {const b=MAPS[area].buildings[n.home],door=b.entry|| (b.name==='house-village-0'?{x:HOUSE.door.x,y:b.y+256}:{x:b.x+120,y:b.y+170}),porch=b.porch||(b.name==='house-village-0'?{...HOUSE.porch}:{x:b.x+120,y:b.y+234});n.commute=[door,...commutePath(area,porch,n.position)];Object.assign(n,commutePose(n,720));}
  n.sitting=state?!!n.sitting:!!n.seat&&n.mode==='work';if(n.sitting&&n.seat)n.direction=n.seat.direction||n.direction||'down';
  if(n.workArea&&n.serviceActive)n.visible=false;
  return n;
 });
}
// Ambient movement is transient and follows short authored, tested safe routes.
export function stepResident(n,area,delta,player,state=null,people=[],festivalActive=false){
 n.elapsed+=delta;n.moving=false;
 const festival=festivalResidentPose(state,n,festivalActive);if(festival){Object.assign(n,festival);n.position={...festival.position};return;}
 if(n.indoorService){const resolved=resolveResidentSchedule(state,n.id);n.mode=resolved?.serviceActive?'work':'home';n.visible=!!resolved?.serviceActive&&resolved.area===area;n.serviceActive=n.visible;n.activity=resolved?.activity||null;n.position={x:n.x,y:n.y};const dx=player.x-n.x,dy=player.y-n.y;n.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';return;}
 if(state){
  const storyPose=silasResidentStoryPose(state,n);if(storyPose){Object.assign(n,storyPose);n.position={...storyPose.position};return;}
  const resolved=resolveResidentSchedule(state,n.id);if(!resolved){n.visible=false;return;}
  const target=scheduleTarget(n,resolved,state,area,people),visible=resolved.visible&&!(n.workArea&&resolved.area===n.workArea);
  n.mode=resolved.phase;n.pattern=resolved.pattern;n.serviceActive=resolved.serviceActive;n.activity=resolved.activity;n.meeting=resolved.activity?.meeting||null;n.area=resolved.area;n.visible=visible;
  if(!visible){n.position={...resolved.position};n.moving=false;n.sitting=false;n.scheduleRoute=null;return;}
  moveResidentToSchedule(n,area,target,delta,resolved,people,player);
  if(n.visible&&Math.hypot(player.x-n.position.x,player.y-n.position.y)<84&&!n.meeting&&!n.sitting){const dx=player.x-n.position.x,dy=player.y-n.position.y;if(Math.hypot(dx,dy)>10)n.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';}
  return;
 }
 if(n.workArea){n.visible=false;return;}
 if(n.sitting){n.position={x:n.x,y:n.y};n.direction=n.seat.direction||'down';return;}
 if(n.kind&&!['clara','niko'].includes(n.id))return;
 if(Math.hypot(player.x-n.position.x,player.y-n.position.y)<84){const dx=player.x-n.position.x,dy=player.y-n.position.y;if(Math.hypot(dx,dy)>10)n.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';return;}
 if(n.route.length<2)return;
 if(n.wait>0){n.wait=Math.max(0,n.wait-delta);return;}
 const [x,y]=n.route[n.waypoint],dx=x-n.position.x,dy=y-n.position.y,d=Math.hypot(dx,dy);
 if(d<2){n.position={x,y};n.waypoint=(n.waypoint+1)%n.route.length;n.wait=2000;return;}
 const step=Math.min(d,NPC_WALK_SPEED*delta/1000),p={x:n.position.x+dx/d*step,y:n.position.y+dy/d*step};
 if(!walkable(area,p.x,p.y,8))return;
 n.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';n.position=p;n.moving=true;
}

function scheduleTarget(n,resolved,state,area,people){
 const location=resolved.activity?.location;
 let target=location?.area==='city'?{x:location.x,y:location.y}:location?.outdoor?{...location.outdoor}:{...resolved.position};
 if(resolved.phase==='activity'&&!resolved.serviceActive&&!resolved.sitting){
  const offsets=[[0,0],[32,0],[0,32],[-32,0],[0,-32]],seed=[...n.id].reduce((sum,c)=>sum+c.charCodeAt(0),0),phase=Math.floor((state.minute+seed%12)/12);
  for(let i=0;i<offsets.length;i++){const [x,y]=offsets[(phase+i)%offsets.length],candidate={x:target.x+x,y:target.y+y};if(walkable(area,candidate.x,candidate.y,8)){target=candidate;break;}}
 }
 const nearby=p=>people.filter(other=>other!==n&&other.visible!==false&&Math.hypot(p.x-other.position.x,p.y-other.position.y)<72).length;
 if(!resolved.activity?.meeting&&nearby(target)>=2){const spread=[[96,0],[0,96],[-96,0],[0,-96],[96,96],[-96,96]],seed=[...n.id].reduce((sum,c)=>sum+c.charCodeAt(0),0);for(let i=0;i<spread.length;i++){const [x,y]=spread[(seed+i)%spread.length],candidate={x:target.x+x,y:target.y+y};if(walkable(area,candidate.x,candidate.y,8)&&nearby(candidate)<2){target=candidate;break;}}}
 return target;
}

function moveResidentToSchedule(n,area,target,delta,resolved,people,player){
 const key=[resolved.pattern,resolved.phase,resolved.activity?.id||'home',target.x,target.y].join(':');
 if(n.scheduleRoute?.key!==key){
  try{n.scheduleRoute=Math.hypot(n.position.x-target.x,n.position.y-target.y)<1?{key,points:[{...target}],index:1}:{key,points:commutePath(area,n.position,target),index:1};}
  catch{n.scheduleRoute={key,points:[{...n.position}],index:1,failed:true};}
 }
 const route=n.scheduleRoute,point=route.points[route.index];
 if(!point||route.failed){n.moving=false;n.sitting=!!resolved.sitting;const location=resolved.activity?.location;if(n.sitting&&location?.direction)n.direction=location.direction;return !route.failed;}
 const dx=point.x-n.position.x,dy=point.y-n.position.y,distance=Math.hypot(dx,dy);
 if(distance<.01){n.position={...point};route.index++;return moveResidentToSchedule(n,area,target,delta,resolved,people,player);}
 const step=Math.min(distance,NPC_WALK_SPEED*delta/1000);if(distance<=step){n.position={...point};route.index++;n.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';n.moving=true;n.sitting=false;return false;}
 const candidate={x:n.position.x+dx/distance*step,y:n.position.y+dy/distance*step},enteringSeat=!!resolved.sitting&&route.index===route.points.length-1,next=enteringSeat?candidate:separatedStep(n,area,candidate,dx,dy,step,people,player);
 // A seated pose is anchored inside the visible seat. Only the final short
 // approach may enter that authored anchor; every normal route still obeys
 // the bench collision used by the player and walking residents.
 if(!next||!enteringSeat&&!walkable(area,next.x,next.y,8)){n.moving=false;return false;}
 const mx=next.x-n.position.x,my=next.y-n.position.y;n.direction=Math.abs(mx)>Math.abs(my)?mx>0?'right':'left':my>0?'down':'up';n.position=next;n.moving=true;n.sitting=false;
 return false;
}

function separatedStep(n,area,candidate,dx,dy,step,people,player){
 const blockers=[...people.filter(other=>other!==n&&other.visible!==false).map(other=>other.position),player],clearance=p=>blockers.reduce((best,b)=>Math.min(best,Math.hypot(p.x-b.x,p.y-b.y)),Infinity),nearCount=p=>blockers.filter(b=>Math.hypot(p.x-b.x,p.y-b.y)<64).length,nearest=[...blockers].sort((a,b)=>Math.hypot(n.position.x-a.x,n.position.y-a.y)-Math.hypot(n.position.x-b.x,n.position.y-b.y))[0];
 const currentSpace=clearance(n.position);
 if(currentSpace<24&&nearest){
  let ax=n.position.x-nearest.x,ay=n.position.y-nearest.y,d=Math.hypot(ax,ay);if(d<.01){const h=[...n.id].reduce((sum,c)=>sum+c.charCodeAt(0),0)%4;[ax,ay]=[[1,0],[-1,0],[0,1],[0,-1]][h];d=1;}
  for(const [rx,ry]of [[ax,ay],[-ay,ax],[ay,-ax]]){const length=Math.hypot(rx,ry)||1,option={x:n.position.x+rx/length*step,y:n.position.y+ry/length*step};if(walkable(area,option.x,option.y,8)&&clearance(option)>currentSpace+.01)return option;}
 }
 if(clearance(candidate)>=24&&nearCount(candidate)<2)return candidate;
 const length=Math.hypot(dx,dy)||1,px=-dy/length,py=dx/length,sign=[...n.id].reduce((sum,c)=>sum+c.charCodeAt(0),0)%2?1:-1;
 let best=null,bestClearance=-1;
 for(const [forward,side] of [[.65,sign],[.65,-sign],[0,sign],[0,-sign],[-.45,sign],[-.45,-sign]]){
  const tx=dx/length*forward+px*side,ty=dy/length*forward+py*side,d=Math.hypot(tx,ty)||1,option={x:n.position.x+tx/d*step,y:n.position.y+ty/d*step};
  if(!walkable(area,option.x,option.y,8))continue;const space=clearance(option);if(space>=24&&nearCount(option)<2)return option;if(space>bestClearance&&nearCount(option)<2){best=option;bestClearance=space;}
 }
 return bestClearance>clearance(n.position)+.01?best:null;
}
export function residentContext(residents,player){
 const n=residents.filter(n=>n.visible!==false&&Math.hypot(player.x-n.position.x,player.y-n.position.y)<58).sort((a,b)=>Math.hypot(player.x-a.position.x,player.y-a.position.y)-Math.hypot(player.x-b.position.x,player.y-b.position.y))[0];
 return n?{type:'dialog',category:n.service,shop:n.kind,...n.position,residentId:n.id,label:'Talk to '+n.name,title:n.name,body:n.body,activity:n.activity?.id||null,dialogueGroup:n.activity?.dialogueGroup||null,meeting:n.meeting||null}:null;
}

export function residentMoveAllowed(people,from,to){return people.filter(n=>n.visible!==false).every(n=>{const p=n.position,next=Math.hypot(to.x-p.x,to.y-p.y);return next>=28||next>=Math.hypot(from.x-p.x,from.y-p.y);});}

export function residentReaction(s,body){
 if(s.story?.keepsake!=='hidden'&&s.story?.keepsake)return 'That little sun belonged to your grandfather. Take it home; there is always another morning.';
 if(s.settlement.projects.includes('commons'))return 'Our new Commons seats feel like home. The Farm board now has a Copper Can for you.';
 if(s.hasSoldProduce)return 'Your first harvest reached the market! Help our Commons at the town board by the square.';
 return 'Water once each day. While the seeds grow, visit the town board. Gather 12 Wood and 6 Stone for our Commons.';
}
