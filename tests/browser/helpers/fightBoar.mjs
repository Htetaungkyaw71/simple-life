import {walkable} from '../../../src/data/locations.js';
import {attackBox,hitInside} from '../../../src/systems/combat.js';
// Ordinary inputs only: step out of the committed charge, close during recovery,
// hold face/attack across browser frames. Snapshots never mutate game state.
export async function fightBoar({page,snap,click,mobile=false,id,navigate=null,timeoutMs=90000}){
 const deadline=Date.now()+timeoutMs;
 while(Date.now()<deadline){
  const v=await snap();if(v.state.area!=='forest'||!v.state.forest.animals[id].health)return;
  const b=v.state.forest.animals[id].position,p=v.state.position,r=id==='boar-original'?v.combat:v.combat.animals[id]||{mode:'wander'},dx=b.x-p.x,dy=b.y-p.y;
  if(['warning','charge'].includes(r.mode)){
   const horizontal=Math.abs(r.heading.y)>Math.abs(r.heading.x),side=horizontal?[['ArrowRight',1,0],['ArrowLeft',-1,0]]:[['ArrowDown',0,1],['ArrowUp',0,-1]],choices=[...side,...(horizontal?[['ArrowDown',0,1],['ArrowUp',0,-1]]:[['ArrowRight',1,0],['ArrowLeft',-1,0]])],dodge=choices.find(([,x,y])=>[8,16,24,32,40,48,56,64].every(d=>walkable('forest',p.x+x*d,p.y+y*d,12,false,v.state)))||side[0];
   await page.keyboard.down(dodge[0]);try{await page.waitForFunction(p=>{const q=window.__simpleLife.snapshot().state.position;return Math.hypot(q.x-p.x,q.y-p.y)>55;},p,{timeout:2000});}catch{}finally{await page.keyboard.up(dodge[0]);}await page.waitForTimeout(100);continue;
  }
  const k=Math.abs(dx)>Math.abs(dy)?dx<0?'ArrowLeft':'ArrowRight':dy<0?'ArrowUp':'ArrowDown';
  if(Math.hypot(dx,dy)>55&&navigate){
   const spots=[[0,48],[48,0],[-48,0],[0,-48],[48,48],[-48,48],[48,-48],[-48,-48]]
    .map(([x,y])=>({x:b.x+x,y:b.y+y}))
    .filter(q=>walkable('forest',q.x,q.y,18,false,v.state)&&walkable('forest',q.x,q.y+5,18,false,v.state))
    .sort((a,c)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(c.x-p.x,c.y-p.y));
   let reached=false;
   for(const q of spots){try{await navigate(q.x,q.y,24);reached=true;break;}catch(e){if(!/route forest|Blocked|safe start/.test(e.message))throw e;}}
   if(!reached)throw Error('No reachable boar approach '+id);
   continue;
  }
  if(Math.hypot(dx,dy)>55){await page.keyboard.down(k);await page.waitForTimeout(120);await page.keyboard.up(k);await page.waitForTimeout(30);}
  else{await page.keyboard.press(k,{delay:75});const aim=await snap();if(aim.state.area==='forest'&&hitInside(attackBox(aim.state.position,aim.player.direction),aim.state.forest.animals[id].position))await(mobile?click('attack'):page.keyboard.press('k',{delay:75}));await page.waitForTimeout(200);}
 }
 throw Error('Timed out fighting '+id);
}
