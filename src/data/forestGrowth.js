import {WOODLAND_WILDLIFE} from './woodlandWildlife.js';
import {EAST_BOARS} from './forestExpansion.js';
import {waterAt,dryFootprint} from './water.js';
export const forestTree=p=>p.name==='tree'||p.name==='tree-wide'||p.name==='snow-pine'||p.name.endsWith('-tree');
// Reserve connected clearings while growing the forest; no raised assemblies.
function hash(n,salt=0){let v=Math.imul(n^salt,1597334677);v=Math.imul(v^(v>>>16),2246822519);return (v^(v>>>13))>>>0;}
export function growForest(map,regions,nodes,treasures){
 map.terraces=[];map.ledges=[];
 const nearRoad=(x,y,pad=24)=>map.paths.some(([a,b,w,h])=>x>a-pad&&x<a+w+pad&&y>b-pad&&y<b+h+pad);
 const protectedPlaces=[...nodes,...treasures,...WOODLAND_WILDLIFE.slice(0,48),...EAST_BOARS.map(a=>a.home),{x:936,y:4472},{x:1008,y:4432},...treasures.map(t=>({x:t.x-64,y:t.y-64}))];
 const protectedPlace=(x,y)=>protectedPlaces.some(p=>Math.hypot(p.x-x,p.y-y)<88);
 for(const [i,r]of regions.entries()){
  const count=r.biome==='snow'?270:620;
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
 map.props=map.props.filter(p=>!forestTree(p)||dryFootprint(map,{x:p.x-8,y:p.y+64,w:80,h:40}));
 map.details=map.details.filter(p=>p.name!=='fern'&&dryFootprint(map,{x:p.x,y:p.y,w:64,h:48}));
 map.grass=map.grass.filter(g=>dryFootprint(map,{x:g.x-24,y:g.y-48,w:48,h:48}));
 // Road masks were only used to reserve passable gaps during placement.
 map.paths=[];
}

// Keep Forest trunks visibly separated. Fruit and boundary trees are considered
// first so groves and the world edge retain their established shape.
export function thinForestTrees(map,protectedPoints=[],spacing=144){
 const trees=map.props.filter(forestTree),cell=spacing,buckets=new Map(),anchor=p=>({x:p.x+32,y:p.y+90});
 const add=p=>{const a=anchor(p),key=Math.floor(a.x/cell)+':'+Math.floor(a.y/cell);if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(p);};
 const nearby=p=>{const a=anchor(p),out=[];for(let gy=Math.floor(a.y/cell)-1;gy<=Math.floor(a.y/cell)+1;gy++)for(let gx=Math.floor(a.x/cell)-1;gx<=Math.floor(a.x/cell)+1;gx++)out.push(...buckets.get(gx+':'+gy)||[]);return out;};
 const priority=p=>p.name==='guava-tree'||p.name==='mango-tree'?0:p.x<0||p.y<0||p.x>map.size.width-80||p.y>map.size.height-140?1:protectedPoints.some(n=>Math.hypot(n.x-p.x-32,n.y-p.y-90)<72)?2:3;
 const ranked=trees.map(p=>({p,priority:priority(p),tie:hash(Math.round(p.x),Math.round(p.y))})).sort((a,b)=>a.priority-b.priority||a.tie-b.tie).map(entry=>entry.p),removed=new Set();
 for(const p of ranked){const a=anchor(p),tooClose=nearby(p).some(q=>{const b=anchor(q);return Math.hypot(a.x-b.x,a.y-b.y)<spacing;});if(tooClose)removed.add(p);else add(p);}
 map.props=map.props.filter(p=>!removed.has(p));
 return {before:trees.length,after:trees.length-removed.size,removed:removed.size};
}

export function addForestBushes(map,regions,protectedPoints=[],perRegion=28){
 const cell=80,props=new Map(),bushes=new Map(),add=(index,p,x,y)=>{const key=Math.floor(x/cell)+':'+Math.floor(y/cell);if(!index.has(key))index.set(key,[]);index.get(key).push(p);},near=(index,x,y,r)=>{for(let gy=Math.floor((y-r)/cell);gy<=Math.floor((y+r)/cell);gy++)for(let gx=Math.floor((x-r)/cell);gx<=Math.floor((x+r)/cell);gx++)for(const p of index.get(gx+':'+gy)||[])if(Math.hypot(x-p.x,y-p.y)<r)return true;return false;};
 for(const p of map.props)add(props,{x:p.x+32,y:p.y+90},p.x+32,p.y+90);
 let placed=0;
 for(const [i,r]of regions.entries()){
  let count=0;for(let n=0;n<224&&count<perRegion;n++){
   const x=r.x+72+hash(n,i+1223)%1136,y=r.y+104+hash(n,i+1699)%800;
   if(protectedPoints.some(p=>Math.hypot(p.x-x,p.y-y)<68)||!dryFootprint(map,{x:x-40,y:y-80,w:80,h:80})||near(props,x,y,48)||near(bushes,x,y,52))continue;
   const p={name:'forest-bush-'+count%4,x:x-40,y:y-80};map.details.push(p);add(bushes,{x,y},x,y);count++;placed++;
  }
 }
 return placed;
}
export function ledgeBlocked(ledges,x,y,r=12){return ledges.some(l=>x+r>l.x&&x-r<l.x+l.w&&y>l.y&&y-r<l.y+l.h);}
