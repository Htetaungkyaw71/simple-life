import {WOODLAND_WILDLIFE} from './wildlifeArt.js';
import {waterAt,dryFootprint} from './water.js';
export const forestTree=p=>p.name==='tree'||p.name==='snow-pine'||p.name.endsWith('-tree');
// Reserve connected clearings while growing the forest; no raised assemblies.
function hash(n,salt=0){let v=Math.imul(n^salt,1597334677);v=Math.imul(v^(v>>>16),2246822519);return (v^(v>>>13))>>>0;}
export function growForest(map,regions,nodes,treasures){
 map.terraces=[];map.ledges=[];
 const nearRoad=(x,y,pad=24)=>map.paths.some(([a,b,w,h])=>x>a-pad&&x<a+w+pad&&y>b-pad&&y<b+h+pad);
 const protectedPlaces=[...nodes,...treasures,...WOODLAND_WILDLIFE,{x:936,y:4472},{x:1008,y:4432},...treasures.map(t=>({x:t.x-64,y:t.y-64}))];
 const protectedPlace=(x,y)=>protectedPlaces.some(p=>Math.hypot(p.x-x,p.y-y)<88);
 for(const [i,r]of regions.entries()){
  const count=r.biome==='snow'?340:950;
  for(let n=0;n<count;n++){
   const x=r.x+40+hash(n,i+201)%1200,y=r.y+72+hash(n,i+887)%896;
   // Clear crossways and region seams connect the whole forest. Guard/forage
   // reservations are small clearings, not the old half-empty species arenas.
   if((r.id==='entrance'&&x>712&&x<1160&&y>4248&&y<4616)||y-r.y>952||nearRoad(x,y)||protectedPlace(x,y)||waterAt(map,{x,y})||map.props.some(p=>Math.hypot(x-p.x-32,y-p.y-90)<54))continue;
   const name=r.biome==='snow'?'snow-pine':r.biome==='savanna'?'acacia-tree':r.biome==='bamboo'&&n%4===0?'bamboo-clump':'tree';
   map.props.push({name,x:x-32,y:y-90});
  }
 }
 map.grass=[];
 for(const [i,r]of regions.entries())for(let n=0;n<(r.biome==='snow'?110:730);n++){
  const patch=Math.floor(n/14),k=n%14,seed=hash(patch,i+661);
  const cx=r.x+72+seed%1128,cy=r.y+88+(seed>>>12)%824;
  const x=cx+(hash(k,seed)%145)-72,y=cy+(hash(k,seed+983)%113)-56;
  if(nearRoad(x,y,2)||waterAt(map,{x,y})||protectedPlace(x,y))continue;
  map.grass.push({id:r.id+'-grass-'+n,x,y,variant:n%3,dry:r.biome==='savanna',snow:r.biome==='snow'});
 }
 // Low olive palmettos add a third foliage layer without blocking passages.
 for(const [i,r]of regions.entries())if(r.biome!=='snow')for(let n=0;n<36;n++){
  const x=r.x+64+hash(n,i+145)%1152,y=r.y+96+hash(n,i+379)%816;
  if(nearRoad(x,y)||protectedPlace(x,y)||!dryFootprint(map,{x:x-40,y:y-80,w:80,h:80}))continue;
  map.props.push({name:'forest-palmetto-'+n%2,x:x-40,y:y-80});
 }
}
export function finishForest(map,regions){
 for(const p of map.props){
  if(p.name!=='tree'&&p.name!=='acacia-tree')continue;
  const region=regions.find(r=>p.x+32>=r.x&&p.x+32<r.x+r.w&&p.y+90>=r.y&&p.y+90<r.y+r.h),biome=region?.biome||'wood',n=Math.abs(Math.floor(p.x*3+p.y*7))%13;
  if(['jungle','bamboo'].includes(biome))p.name=n<3?'palm-tree':n<12?'broadleaf-tree':'tree';
  else if(biome==='marsh')p.name=n<6?'willow-tree':n<9?'palm-tree':'broadleaf-tree';
  else if(biome==='wood')p.name=n<2?'palm-tree':n<11?'broadleaf-tree':n===11?'willow-tree':'tree';
  else if(biome==='savanna'&&n<3)p.name='palm-tree';
  else if(['pine','highland','stone'].includes(biome)&&n<4)p.name='broadleaf-tree';
 }
 map.props=map.props.filter(p=>!forestTree(p)||dryFootprint(map,{x:p.x+6,y:p.y+76,w:52,h:20}));
 map.details=map.details.filter(p=>p.name!=='fern'&&dryFootprint(map,{x:p.x,y:p.y,w:64,h:48}));
 map.grass=map.grass.filter(g=>dryFootprint(map,{x:g.x-24,y:g.y-48,w:48,h:48}));
 // Road masks were only used to reserve passable gaps during placement.
 map.paths=[];
}
export function ledgeBlocked(ledges,x,y,r=12){return ledges.some(l=>x+r>l.x&&x-r<l.x+l.w&&y>l.y&&y-r<l.y+l.h);}
