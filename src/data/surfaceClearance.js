import {dryFootprint} from './water.js';

const NATURAL_NAMES=new Set(['tree','cypress','bush','rock','ice-crystal','bamboo-clump','snow-pine','acacia-tree','palm-tree','willow-tree','broadleaf-tree','tree-wide','guava-tree','mango-tree','grass-detail','dry-grass','snow-grass','fern','mushroom','flowers','flowers0','flowers1','flowers2','flowers3','flowers4']);

export const isNaturalScenery=p=>NATURAL_NAMES.has(p.name)||p.name?.endsWith('-tree')||p.name?.startsWith('forest-palmetto-')||p.name?.startsWith('forest-bush-')||p.name?.startsWith('cp-plant-');

export function surfaceFootprint(p,footprints={}){
 if(p.landscapeVisual?.foot){const [x,y]=p.landscapeVisual.foot;return {x:x-24,y:y-48,w:48,h:48};}
 if(p.rocky)return {x:p.x,y:p.y,w:p.w||64,h:p.h||64};
 // Use the whole visible lower trunk, not only the narrow collision root.
 if(p.name==='tree'||p.name==='snow-pine'||p.name?.endsWith('-tree'))return {x:p.x,y:p.y+48,w:64,h:52};
 if(p.name==='rock')return {x:p.x-20,y:p.y-8,w:104,h:120};
 const f=p.footprint||footprints[p.name];
 return f?{x:p.x+f[0]-4,y:p.y+f[1]-4,w:f[2]+8,h:f[3]+8}:{x:p.x,y:p.y,w:p.w||64,h:p.h||64};
}

export const groundDetailFootprint=p=>p.landscapeVisual?.foot?surfaceFootprint(p):{x:p.x-8,y:p.y-16,w:48,h:48};

export function hitsRows({x,y,w,h},rows,pad=0){
 return (rows||[]).some(([rx,ry,rw,rh])=>x+w>rx-pad&&x<rx+rw+pad&&y+h>ry-pad&&y<ry+rh+pad);
}

const placedVisualFootprint=p=>{
 if(p.name==='barrel')return {x:p.x,y:p.y,w:98,h:101};
 if(p.name==='crate')return {x:p.x,y:p.y,w:32,h:36};
 if(p.artFrame==='outdoor-well-large')return {x:p.x,y:p.y,w:72,h:96};
 return surfaceFootprint(p);
};

export function clearMapSurfaces(map,footprints={}){
 // Water, rivers and bridge decks never receive world objects. Road filtering
 // is limited to incidental scenery so gameplay signs and services stay usable.
 map.props=map.props.filter(p=>{
  const box=surfaceFootprint(p,footprints);
  return dryFootprint(map,box)&&(!isNaturalScenery(p)||!hitsRows(box,map.paths,24));
 });
 const placed=map.props.filter(p=>!isNaturalScenery(p)&&!p.fence).map(placedVisualFootprint);
 map.details=(map.details||[]).filter(p=>{
  const box=groundDetailFootprint(p);
  return dryFootprint(map,box)&&!hitsRows(box,map.paths,8)&&!placed.some(object=>hitsRows(box,[[object.x,object.y,object.w,object.h]],2));
 });
 map.grass=(map.grass||[]).filter(p=>{
  const box={x:p.x-24,y:p.y-48,w:48,h:48};
  return dryFootprint(map,box)&&!hitsRows(box,map.paths,8);
 });
 return map;
}
