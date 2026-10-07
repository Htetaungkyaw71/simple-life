import {CLUB} from '../data/items.js';
import {BOAR_HOME} from '../data/forest.js';
import {walkable} from '../data/locations.js';
import {isNight} from './time.js';
import {inTerritory,lineClear} from './forest.js';

export const combatRuntime=()=>({now:0,nextAttack:0,invulnerableUntil:0,mode:'wander',timer:800,heading:{x:0,y:0},wander:0,grace:800});
export function attackBox(p,direction){
 const boxes={up:[-32,-78,64,72],down:[-32,-12,64,72],left:[-78,-48,72,64],right:[6,-48,72,64]};
 const [x,y,w,h]=boxes[direction]||boxes.down;return {x:p.x+x,y:p.y+y,w,h};
}
export function hitInside(box,p){return p.x+14>box.x&&p.x-14<box.x+box.w&&p.y>box.y&&p.y-24<box.y+box.h;}
// Swept small steps prevent tunnelling; boar and knockback use the same map solids.
export function displace(area,p,dx,dy,territory=false){
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/4));let moved=false;
 for(let i=0;i<steps;i++){
  const q={x:p.x+dx/steps,y:p.y+dy/steps};
  if(!walkable(area,q.x,q.y,territory?16:12)||territory&&!inTerritory(q))break;
  p.x=q.x;p.y=q.y;moved=true;
 }
 return moved;
}
export function attack(s,r,direction){
 if(!s.ownsClub||!s.clubEquipped)return {ok:false,message:'Buy a club at the City Outfitter.'};
 if(r.now<r.nextAttack)return {ok:false};
 if(s.energy<CLUB.energy)return {ok:false,message:'Too tired / eat forest fruit or sleep.'};
 s.energy-=CLUB.energy;r.nextAttack=r.now+CLUB.cooldown;
 const box=attackBox(s.position,direction),boar=s.forest.boar,result={ok:true,box,hit:false,defeated:false};
 if(s.area==='forest'&&boar.health>0&&hitInside(box,boar.position)&&lineClear('forest',s.position,boar.position)){
  result.hit=true;boar.health--;const len=Math.hypot(boar.position.x-s.position.x,boar.position.y-s.position.y)||1;
  displace('forest',boar.position,(boar.position.x-s.position.x)/len*18,(boar.position.y-s.position.y)/len*18,true);
  r.mode='recover';r.timer=600;
  if(!boar.health){result.defeated=true;boar.defeatedDay=s.day;s.inventory.wildHide=Math.min(9999,s.inventory.wildHide+1);}
 }
 return result;
}
export function damagePlayer(s,r,damage=15){
 if(r.now<r.invulnerableUntil||s.health<=0)return false;
 s.health=Math.max(0,s.health-damage);r.invulnerableUntil=r.now+750;return true;
}
export function stepCombat(s,r,delta){
 const ms=Math.max(0,Math.min(delta,50));r.now+=ms;r.grace=Math.max(0,r.grace-ms);
 if(s.area!=='forest'||s.forest.boar.health<=0||s.health<=0)return {};
 const b=s.forest.boar,p=b.position,player=s.position,night=isNight(s),distance=Math.hypot(player.x-p.x,player.y-p.y),awareness=night?228:190,speed=night?1.15:1;
 const sees=inTerritory(player)&&distance<awareness&&lineClear('forest',p,player,12);
 r.timer-=ms;
 if(r.mode==='warning'){
  if(r.timer<=0){r.mode='charge';r.timer=650;return {charge:true};}
 }else if(r.mode==='charge'){
  if(distance<34&&lineClear('forest',p,player)&&damagePlayer(s,r)){
   const len=distance||1;displace('forest',player,(player.x-p.x)/len*18,(player.y-p.y)/len*18);r.mode='recover';r.timer=1000;return {hurt:true,dead:s.health===0};
  }
  const moved=displace('forest',p,r.heading.x*280*speed*ms/1000,r.heading.y*280*speed*ms/1000,true);
  if(!moved||r.timer<=0){r.mode='recover';r.timer=1000;}
 }else if(r.mode==='recover'){
  if(r.timer<=0){r.mode='wander';r.timer=0;}
 }else if(sees&&!r.grace){
  const len=distance||1;r.heading={x:(player.x-p.x)/len,y:(player.y-p.y)/len};r.mode='warning';r.timer=650;return {warning:true};
 }else{
  if(r.timer<=0){r.wander++;r.timer=1400;const a=r.wander*2.4;r.heading={x:Math.cos(a),y:Math.sin(a)};}
  if(!sees&&Math.hypot(p.x-BOAR_HOME.x,p.y-BOAR_HOME.y)>110){const len=Math.hypot(p.x-BOAR_HOME.x,p.y-BOAR_HOME.y);r.heading={x:(BOAR_HOME.x-p.x)/len,y:(BOAR_HOME.y-p.y)/len};}
  if(!displace('forest',p,r.heading.x*32*speed*ms/1000,r.heading.y*32*speed*ms/1000,true))r.timer=0;
 }
 return {};
}
