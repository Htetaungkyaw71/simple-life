import {REGIONS,FOREST_MAP} from './forest.js';
import {walkable} from './locations.js';
import {dryFootprint} from './water.js';
// Stable authored grid candidates; resolve after shared map geometry initializes.
let stones;
export function forestStones(){
 if(stones)return stones;
 stones=[];
 for(const r of REGIONS){
  let count=0;
  for(const dy of [980,952,176,400,624,848])for(const dx of [176,400,624,848,1072]){
   const x=r.x+dx,y=r.y+dy;
   if(count>=6||!walkable('forest',x,y,20)||!dryFootprint(FOREST_MAP,{x:x-20,y:y-28,w:40,h:32})||stones.some(n=>Math.hypot(n.x-x,n.y-y)<64))continue;
   stones.push({id:r.id+'-stone-'+count++,region:r.id,x,y});
  }
 }
 return stones;
}
