import {CLUB,AXE} from '../data/items.js';
import {WOODLAND_WILDLIFE,WOODLAND_BY_ID,WOODLAND_SPECIES} from '../data/woodlandWildlife.js';
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
export function displace(area,p,dx,dy,territory=false,radius=territory?16:12,state=null){
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/4));let moved=false;
 for(let i=0;i<steps;i++){
  const q={x:p.x+dx/steps,y:p.y+dy/steps};
  if(!walkable(area,q.x,q.y,radius,false,state)||territory&&!inTerritory(q,Array.isArray(territory)?territory:undefined))break;
  p.x=q.x;p.y=q.y;moved=true;
 }
 return moved;
}
export function attackTarget(s,direction,targetId=null){
 if(s.area!=='forest')return null;
 const box=attackBox(s.position,direction);
 return [...Object.values(s.forest.animals),...Object.values(s.forest.woodland)].filter(a=>(ANIMAL_BY_ID[a.id]||WOODLAND_BY_ID[a.id])&&a.health>0&&(!targetId||a.id===targetId)&&hitInside(box,a.position)&&lineClear('forest',s.position,a.position,0,s)).sort((a,b)=>Math.hypot(a.position.x-s.position.x,a.position.y-s.position.y)-Math.hypot(b.position.x-s.position.x,b.position.y-s.position.y))[0]||null;
}
export function huntContext(s,direction,target=null){
 if(s.selected!=='axe')return null;
 const a=attackTarget(s,direction);
 return a&&(!target||Math.hypot(a.position.x-target.x,a.position.y-target.y)<48)?{type:'hunt',id:a.id,...a.position,label:'Axe / '+(SPECIES[a.species]?.name||WOODLAND_BY_ID[a.id].name)}:null;
}
export function attack(s,r,direction,targetId=null){
 const axe=s.selected==='axe',weapon=axe?AXE:CLUB;
 if(!axe&&(!s.ownsClub||!s.clubEquipped))return {ok:false,message:'Select Axe or buy a club at the City Outfitter.'};
 if(r.now<r.nextAttack)return {ok:false};
 if(s.energy<weapon.energy)return {ok:false,message:'Too tired / eat food or sleep.'};
 const target=attackTarget(s,direction,targetId),meat=target?.species==='boar'?2:WOODLAND_SPECIES[target?.species]?.meat||0;
 if(target?.health===1&&(s.inventory.meat+meat>9999||target.species==='boar'&&s.inventory.wildHide>=9999))return {ok:false,message:'Bag full / make room for the drop.'};
 s.energy-=weapon.energy;r.nextAttack=r.now+weapon.cooldown;
 const box=attackBox(s.position,direction),result={ok:true,weapon:axe?'axe':'club',box,hit:false,defeated:false};
 if(s.area==='forest'){
  if(target){
   const definition=ANIMAL_BY_ID[target.id],p=target.position,len=Math.hypot(p.x-s.position.x,p.y-s.position.y)||1;
   result.hit=true;result.animalId=target.id;result.species=target.species;target.health--;
   displace('forest',p,(p.x-s.position.x)/len*18,(p.y-s.position.y)/len*18,definition?.territory||false,SPECIES[target.species]?.body||8,s);
   if(definition){const runtime=animalRuntime(r,target.id);runtime.mode='recover';runtime.timer=600;}
   if(!target.health){result.defeated=true;target.defeatedDay=s.day;s.inventory.meat+=meat;result.meat=meat;if(target.species==='boar')s.inventory.wildHide++;}
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
 const sees=inTerritory(player,definition.territory)&&distance<awareness&&lineClear('forest',p,player,12,s);r.timer-=ms;
 if(r.mode==='warning'){
  if(r.timer<=0){r.mode='charge';r.timer=650;return {charge:true};}
 }else if(r.mode==='charge'){
  if(distance<34&&lineClear('forest',p,player,0,s)&&damagePlayer(s,global,d.damage)){
   const len=distance||1;displace('forest',player,(player.x-p.x)/len*18,(player.y-p.y)/len*18,false,12,s);r.mode='recover';r.timer=d.recovery;return {hurt:true,damage:d.damage,dead:s.health===0,species:a.species};
  }
  const moved=displace('forest',p,r.heading.x*d.speed*speed*ms/1000,r.heading.y*d.speed*speed*ms/1000,definition.territory,d.body,s);
  if(!moved||r.timer<=0){r.mode='recover';r.timer=d.recovery;}
 }else if(r.mode==='recover'){
  if(r.timer<=0){r.mode='wander';r.timer=0;}
 }else if(sees&&!r.grace){
  const len=distance||1;r.heading={x:(player.x-p.x)/len,y:(player.y-p.y)/len};r.mode='warning';r.timer=d.warning;return {warning:true};
 }else{
  if(r.timer<=0){r.wander++;r.timer=1400;const angle=r.wander*2.4+ANIMAL_SPAWNS.indexOf(definition);r.heading={x:Math.cos(angle),y:Math.sin(angle)};}
  const home=definition.home,homeDistance=Math.hypot(p.x-home.x,p.y-home.y);
  if(!sees&&homeDistance>110)r.heading={x:(home.x-p.x)/homeDistance,y:(home.y-p.y)/homeDistance};
  if(!displace('forest',p,r.heading.x*32*speed*ms/1000,r.heading.y*32*speed*ms/1000,definition.territory,d.body,s))r.timer=0;
 }
 return {};
}
export function stepCombat(s,r,delta){
 const ms=Math.max(0,Math.min(delta,50));r.now+=ms;
 if(s.area!=='forest'||s.health<=0)return {};
 stepWoodland(s,ms,r.now);
 let events={};
 for(const definition of ANIMAL_SPAWNS){
  const runtime=animalRuntime(r,definition.id);runtime.now=r.now;
  const result=stepAnimal(s,r,runtime,s.forest.animals[definition.id],definition,ms);events={...events,...result};if(result.dead)return events;
 }
 return events;
}
// The old quiet-animal motion is now pure and saved, using the same dry collision.
export function stepWoodland(s,delta,now){
 for(const [i,definition]of WOODLAND_WILDLIFE.entries()){
  const a=s.forest.woodland[definition.id],p=a.position,home=definition;
  if(!a.health||Math.hypot(p.x-s.position.x,p.y-s.position.y)>960)continue;
  const distance=Math.hypot(s.position.x-p.x,s.position.y-p.y),homeDistance=Math.hypot(p.x-home.x,p.y-home.y);
  let heading={x:Math.sin(now/2000+i*2),y:Math.cos(now/2400+i*2)},speed=12;
  if(distance<110){heading={x:(p.x-s.position.x)/(distance||1),y:(p.y-s.position.y)/(distance||1)};speed=80;}
  else if(homeDistance>100){heading={x:(home.x-p.x)/homeDistance,y:(home.y-p.y)/homeDistance};speed=24;}
  else if(Math.floor(now/1800+i)%3===0)speed=0;
  if(speed)displace('forest',p,heading.x*speed*delta/1000,heading.y*speed*delta/1000,false,8,s);
 }
}
