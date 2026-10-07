import {waterAt} from './water.js';
// Authored low terraces stay away from species territories and connected roads.
export function growForest(map,regions,nodes,treasures){
 map.terraces=regions.map((r,i)=>({id:r.id+'-terrace',x:r.x+144+(i%2)*64,y:r.y+816,w:256,h:128}));
 map.ledges=map.terraces.flatMap(t=>Array.from({length:8},(_,i)=>({x:t.x+i*32,y:t.y+t.h-24-([0,0,16,16,16,16,0,0][i]),w:32,h:20})).filter((_,i)=>i!==3&&i!==4).concat([{x:t.x,y:t.y,w:16,h:t.h-32},{x:t.x+t.w-16,y:t.y,w:16,h:t.h-32}]));
 // Remove old scenery under the new landform rather than hiding solid trunks.
 map.props=map.props.filter(p=>!map.terraces.some(t=>p.x+32>t.x-28&&p.x+32<t.x+t.w+28&&p.y+80>t.y-32&&p.y+80<t.y+t.h+32));
 const nearRoad=(x,y,pad=24)=>map.paths.some(([a,b,w,h])=>x>a-pad&&x<a+w+pad&&y>b-pad&&y<b+h+pad);
 const protectedPlace=(x,y)=>nodes.concat(treasures).some(p=>Math.hypot(p.x-x,p.y-y)<88)||map.terraces.some(t=>x>t.x-48&&x<t.x+t.w+48&&y>t.y-48&&y<t.y+t.h+48);
 for(const [i,r]of regions.entries()){
  const count=['savanna','stone','snow'].includes(r.biome)?150:330;
  for(let n=0;n<count;n++){
   const x=r.x+48+(n*173+i*67)%1180,y=r.y+96+(n*239+i*43)%852;
   const territory=(x>r.x+650&&y<r.y+590)||(['herds','river','snake'].includes(r.id)&&x<r.x+480&&y<r.y+620)||(r.id==='entrance'&&x>720&&y<r.y+540);
   if(territory||nearRoad(x,y)||protectedPlace(x,y)||waterAt(map,{x,y})||map.props.some(p=>Math.hypot(x-p.x-32,y-p.y-84)<56))continue;
   const name=r.biome==='snow'?'snow-pine':r.biome==='savanna'?'acacia-tree':r.biome==='bamboo'?'bamboo-clump':'tree';
   map.props.push({name,x:x-32,y:y-84});
  }
 }
 map.grass=[];
 for(const [i,r]of regions.entries())for(let n=0;n<(r.biome==='snow'?90:r.biome==='savanna'?200:440);n++){
  // Clumps grow in winding patches, with quiet dirt paths left visible.
  const patch=Math.floor(n/11),k=n%11;
  const x=r.x+48+(patch*193+i*37+k*22)%1168,y=r.y+64+(patch*277+i*59+(k%4)*24)%880;
  if(nearRoad(x,y,6)||waterAt(map,{x,y})||protectedPlace(x,y)||map.ledges.some(l=>x>l.x-24&&x<l.x+l.w+24&&y>l.y-24&&y<l.y+l.h+24))continue;
  map.grass.push({id:r.id+'-grass-'+n,x,y,variant:n%3,dry:r.biome==='savanna',snow:r.biome==='snow'});
 }
}
export function ledgeBlocked(ledges,x,y,r=12){return ledges.some(l=>x+r>l.x&&x-r<l.x+l.w&&y>l.y&&y-r<l.y+l.h);}
