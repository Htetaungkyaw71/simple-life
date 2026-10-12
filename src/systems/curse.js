import {CURSED_CAVE,CURSE_GHOST,CURSE_DAWN,freshCurse,freshGhost,curseNight,curseComplete} from '../data/cursedCave.js';
import {walkable,inBounds} from '../data/locations.js';
import {lineClear} from './forest.js';
import {damagePlayer,displace} from './combat.js';
export const nearCave=s=>s?.area==='forest'&&Math.hypot(s.position.x-CURSED_CAVE.approach.x,s.position.y-CURSED_CAVE.approach.y)<CURSED_CAVE.radius&&lineClear('forest',s.position,CURSED_CAVE.approach,0,s);
export function caveContext(s,target=null){return nearCave(s)&&(!target||Math.hypot(target.x-CURSED_CAVE.x,target.y-CURSED_CAVE.y)<130)?{type:'cursedCave',...CURSED_CAVE.approach,label:s.curse?.stage==='broken'?'Rebuild cursed cave':s.curse?.stage==='restored'?'Restored cave':'Inspect sealed cave'}:null;}
export function breakSeal(s,confirmed=false){
 if(!confirmed||!nearCave(s)||s.curse?.stage!=='sealed')return {ok:false,message:'The seal is unchanged.'};
 s.curse.stage='broken';s.curse.discovered=true;s.curse.brokenDay=s.day;
 const coins=Math.min(CURSED_CAVE.coins,9999999-s.money);s.money+=coins;
 return {ok:true,coins,message:'Curse released. Ghosts come at 7 pm. Rebuild the cave to stop them.'};
}
export function contribute(s,key){
 const c=s.curse,cost=CURSED_CAVE.cost;if(!nearCave(s)||c?.stage!=='broken'||!Object.hasOwn(cost,key))return {ok:false,message:'Repair at the cave entrance.'};
 const held=key==='money'?s.money:s.inventory[key],amount=Math.min(cost[key]-c.paid[key],Math.max(0,held));
 if(amount<=0)return {ok:false,message:c.paid[key]>=cost[key]?'This contribution is complete.':'Gather more resources first.'};
 if(key==='money')s.money-=amount;else s.inventory[key]-=amount;c.paid[key]+=amount;
 if(curseComplete(c)){c.stage='restored';c.restoredDay=s.day;c.nightKey=null;c.ghosts=c.ghosts.map((_,i)=>freshGhost(i));return {ok:true,amount,complete:true,message:'Curse broken. The cave is restored. Curse Breaker earned.'};}
 return {ok:true,amount,complete:false,message:'Contribution saved. Return with the remaining resources.'};
}
export function restoreCurse(raw,s){
 const c=freshCurse(),r=raw?.curse;if(!r||typeof r!=='object'||Array.isArray(r))return c;
 const num=(v,max)=>Number.isFinite(v)?Math.max(0,Math.min(max,Math.floor(v))):0;
 c.discovered=r.discovered===true;
 if(!['broken','restored'].includes(r.stage))return c;
 c.stage='broken';c.discovered=true;c.brokenDay=Math.max(1,num(r.brokenDay,s.day));
 for(const [key,n]of Object.entries(CURSED_CAVE.cost))c.paid[key]=num(r.paid?.[key],n);
 if(curseComplete(c)){c.stage='restored';c.restoredDay=Math.max(c.brokenDay,num(r.restoredDay,s.day));return c;}
 if(Number.isInteger(r.nightKey)&&r.nightKey>=0&&r.nightKey<=s.day)c.nightKey=r.nightKey;
 c.ghosts=c.ghosts.map(g=>{const old=Array.isArray(r.ghosts)?r.ghosts.find(n=>n?.id===g.id):null;if(!old)return g;
  g.health=num(old.health,CURSE_GHOST.health);g.respawn=g.health?0:Math.max(1,num(old.respawn,CURSE_GHOST.respawn));g.arrival=num(old.arrival,CURSE_GHOST.arrival);g.windup=num(old.windup,CURSE_GHOST.windup);g.recovery=num(old.recovery,CURSE_GHOST.recovery);
  if(['home','farm','city','forest'].includes(old.area)&&inBounds(old.area,old.position?.x,old.position?.y,12)&&walkable(old.area,old.position.x,old.position.y,8,false,s)){g.area=old.area;g.position={x:old.position.x,y:old.position.y};}
  return g;
 });return c;
}
function spawn(s,g,i){
 // Arrive away from the farmer on reachable ground, never inside a house/wall.
 for(const radius of [170+i*24,220,130,280])for(let n=0;n<16;n++){
  const angle=(n+i*5)*Math.PI/8,p={x:Math.round(s.position.x+Math.cos(angle)*radius),y:Math.round(s.position.y+Math.sin(angle)*radius)};
  if(walkable(s.area,p.x,p.y,12,false,s)&&lineClear(s.area,s.position,p,8,s)){g.area=s.area;g.position=p;g.arrival=CURSE_GHOST.arrival;g.windup=0;g.recovery=0;return true;}
 }g.area=null;g.position=null;return false;
}
export function stepCurse(s,r,delta){
 const c=s.curse;if(c?.stage!=='broken'||s.health<=0)return {};
 const ms=Math.max(0,Math.min(delta,50));let events={};
 if(!curseNight(s)){if(c.nightKey!==null){c.nightKey=null;c.ghosts=c.ghosts.map((_,i)=>freshGhost(i));return {dawn:true};}return events;}
 const night=s.day-(s.minute<CURSE_DAWN?1:0);
 if(c.nightKey!==night){c.nightKey=night;c.ghosts=c.ghosts.map((_,i)=>freshGhost(i));events.beganNight=true;}
 for(const [i,g]of c.ghosts.entries()){
  if(g.respawn>0){g.respawn=Math.max(0,g.respawn-ms);if(g.respawn===0){g.health=CURSE_GHOST.health;g.area=null;g.position=null;}else continue;}
  if(s.area==='interior'){g.area=null;g.position=null;g.arrival=CURSE_GHOST.arrival;g.windup=0;continue;}
  if(!g.position||g.area!==s.area||Math.hypot(g.position.x-s.position.x,g.position.y-s.position.y)>520){if(!spawn(s,g,i))continue;}
  if(g.arrival>0){g.arrival=Math.max(0,g.arrival-ms);continue;}
  g.recovery=Math.max(0,g.recovery-ms);
  const distance=Math.hypot(g.position.x-s.position.x,g.position.y-s.position.y),clear=lineClear(s.area,g.position,s.position,0,s);
  if(g.windup>0){g.windup=Math.max(0,g.windup-ms);if(!g.windup){g.recovery=CURSE_GHOST.recovery;if(distance<44&&clear&&damagePlayer(s,r,CURSE_GHOST.damage)){events={...events,hurt:true,damage:CURSE_GHOST.damage,dead:s.health===0};if(events.dead)return events;}}continue;}
  if(distance<62&&clear&&!g.recovery){g.windup=CURSE_GHOST.windup;events.warning=true;continue;}
  const heading=Math.atan2(s.position.y-g.position.y,s.position.x-g.position.x),step=CURSE_GHOST.speed*ms/1000;
  if(distance>34)for(const offset of [0,(i%2?1:-1)*Math.PI/3,(i%2?-1:1)*Math.PI/3,Math.PI/2,-Math.PI/2])if(displace(s.area,g.position,Math.cos(heading+offset)*step,Math.sin(heading+offset)*step,false,8,s))break;
 }return events;
}
