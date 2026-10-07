import {CLUB} from '../data/items.js';
import {ANIMAL_SPAWNS,ANIMAL_BY_ID,SPECIES} from '../data/wildlife.js';
import {walkable} from '../data/locations.js';
import {isNight} from './time.js';
import {inTerritory,lineClear} from './forest.js';

export const combatRuntime=()=>({now:0,nextAttack:0,invulnerableUntil:0,mode:'wander',timer:800,heading:{x:0,y:0},wander:0,grace:800,animals:{}});
export function animalRuntime(r,id){
 if(id==='boar-original')return r;
 return r.animals[id]??=( {...combatRuntime(),grace:1000+(ANIMAL_SPAWNS.findIndex(a=>a.id===id)%4)*350} );
}
export function attackBox(p,direction){
 const boxes={up:[-32,-78,64,72],down:[-32,-12,64,72],left:[-78,-48,72,64],right:[6,-48,72,64]};
 const [x,y,w,h]=boxes[direction]||boxes.down;return {x:p.x+x,y:p.y+y,w,h};
}
export function hitInside(box,p){return p.x+14>box.x&&p.x-14<box.x+box.w&&p.y>box.y&&p.y-24<box.y+box.h;}
export function displace(area,p,dx,dy,territory=false,radius=territory?16:12){
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/4));let moved=false;
 for(let i=0;i<steps;i++){
  const q={x:p.x+dx/steps,y:p.y+dy/steps};
  if(!walkable(area,q.x,q.y,radius)||territory&&!inTerritory(q,Array.isArray(territory)?territory:undefined))break;
  p.x=q.x;p.y=q.y;moved=true;
 }
 return moved;
}
export function attack(s,r,direction){
 if(!s.ownsClub||!s.clubEquipped)return {ok:false,message:'Buy a club at the City Outfitter.'};
 if(r.now<r.nextAttack)return {ok:false};
 if(s.energy<CLUB.energy)return {ok:false,message:'Too tired / eat forest fruit or sleep.'};
 s.energy-=CLUB.energy;r.nextAttack=r.now+CLUB.cooldown;
 const box=attackBox(s.position,direction),result={ok:true,box,hit:false,defeated:false};
 if(s.area==='forest'){
  const target=Object.values(s.forest.animals).filter(a=>a.health>0&&hitInside(box,a.position)&&lineClear('forest',s.position,a.position)).sort((a,b)=>Math.hypot(a.position.x-s.position.x,a.position.y-s.position.y)-Math.hypot(b.position.x-s.position.x,b.position.y-s.position.y))[0];
  if(target){
   const definition=ANIMAL_BY_ID[target.id],p=target.position,len=Math.hypot(p.x-s.position.x,p.y-s.position.y)||1;
   result.hit=true;result.animalId=target.id;result.species=target.species;target.health--;
   displace('forest',p,(p.x-s.position.x)/len*18,(p.y-s.position.y)/len*18,definition.territory,SPECIES[target.species].body);
   const runtime=animalRuntime(r,target.id);runtime.mode='recover';runtime.timer=600;
   if(!target.health){result.defeated=true;target.defeatedDay=s.day;s.inventory.wildHide=Math.min(9999,s.inventory.wildHide+1);}
  }
 }
 return result;
}
export function damagePlayer(s,r,damage=15){
 if(r.now<r.invulnerableUntil||s.health<=0)return false;
 s.health=Math.max(0,s.health-damage);r.invulnerableUntil=r.now+750;return true;
}
function stepAnimal(s,global,r,a,definition,ms){
 if(a.health<=0||Math.hypot(a.position.x-s.position.x,a.position.y-s.position.y)>960)return {};
 r.grace=Math.max(0,r.grace-ms);const d=SPECIES[a.species],p=a.position,player=s.position,night=isNight(s),distance=Math.hypot(player.x-p.x,player.y-p.y),awareness=d.awareness*(night?1.2:1),speed=night?1.15:1;
 const sees=inTerritory(player,definition.territory)&&distance<awareness&&lineClear('forest',p,player,12);r.timer-=ms;
 if(r.mode==='warning'){
  if(r.timer<=0){r.mode='charge';r.timer=650;return {charge:true};}
 }else if(r.mode==='charge'){
  if(distance<34&&lineClear('forest',p,player)&&damagePlayer(s,global,d.damage)){
   const len=distance||1;displace('forest',player,(player.x-p.x)/len*18,(player.y-p.y)/len*18);r.mode='recover';r.timer=d.recovery;return {hurt:true,damage:d.damage,dead:s.health===0,species:a.species};
  }
  const moved=displace('forest',p,r.heading.x*d.speed*speed*ms/1000,r.heading.y*d.speed*speed*ms/1000,definition.territory,d.body);
  if(!moved||r.timer<=0){r.mode='recover';r.timer=d.recovery;}
 }else if(r.mode==='recover'){
  if(r.timer<=0){r.mode='wander';r.timer=0;}
 }else if(sees&&!r.grace){
  const len=distance||1;r.heading={x:(player.x-p.x)/len,y:(player.y-p.y)/len};r.mode='warning';r.timer=d.warning;return {warning:true};
 }else{
  if(r.timer<=0){r.wander++;r.timer=1400;const angle=r.wander*2.4+ANIMAL_SPAWNS.indexOf(definition);r.heading={x:Math.cos(angle),y:Math.sin(angle)};}
  const home=definition.home,homeDistance=Math.hypot(p.x-home.x,p.y-home.y);
  if(!sees&&homeDistance>110)r.heading={x:(home.x-p.x)/homeDistance,y:(home.y-p.y)/homeDistance};
  if(!displace('forest',p,r.heading.x*32*speed*ms/1000,r.heading.y*32*speed*ms/1000,definition.territory,d.body))r.timer=0;
 }
 return {};
}
export function stepCombat(s,r,delta){
 const ms=Math.max(0,Math.min(delta,50));r.now+=ms;
 if(s.area!=='forest'||s.health<=0)return {};
 let events={};
 for(const definition of ANIMAL_SPAWNS){
  const runtime=animalRuntime(r,definition.id);runtime.now=r.now;
  const result=stepAnimal(s,r,runtime,s.forest.animals[definition.id],definition,ms);events={...events,...result};if(result.dead)return events;
 }
 return events;
}
