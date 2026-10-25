import {houseSolids} from './geometry.js';
import {RESIDENTS} from './residents.js';
import {cityMaskHits,cityRoadRects} from './citySurfaceGeometry.js';
export const rectHit=(a,b,pad=0)=>a[0]<b[0]+b[2]+pad&&a[0]+a[2]>b[0]-pad&&a[1]<b[1]+b[3]+pad&&a[1]+a[3]>b[1]-pad;
export const cityRoads=map=>map.cityLayout?cityRoadRects():[...map.paths,...map.paving,...map.squares.map(([x,y,w,h])=>[x+12,y+12,w-24,h-24])];
export const cityTreeGround=p=>[p.x+22,p.y+76,20,16];
export const cityLampGround=p=>[p.x+14,p.y+76,12,18];
const waterRects=map=>map.falls.map(r=>Array.isArray(r)?r:[r.x,r.y,r.w,r.h]);
// The out-of-map town backdrop is also grass; river embankments and gardens are not.
export function cityGreenGround(map,box){const paved=map.cityLayout?cityMaskHits('walk',box,4):[...map.paths,...map.paving,...map.sidewalks,...map.squares].some(r=>rectHit(box,r,8));return !paved&&![...map.gardens,...waterRects(map),...map.bridges.map(b=>[b.x,b.y,b.w,b.h])].some(r=>rectHit(box,r,8));}
export function placeCityRoadside(map,footprints){
 const roads=cityRoads(map),water=[...waterRects(map),...map.gardens,...map.bridges.map(b=>[b.x,b.y,b.w,b.h])];
 const houses=map.buildings.flatMap(p=>houseSolids(p.x,p.y,p.name));
 const routes=RESIDENTS.city.flatMap(n=>{const points=n.route.length?n.route:[[n.x,n.y]];return points.map((p,i)=>{const q=points[(i+1)%points.length];return [Math.min(p[0],q[0])-24,Math.min(p[1],q[1])-24,Math.abs(q[0]-p[0])+48,Math.abs(q[1]-p[1])+48];});});
 const offsets=[];for(let y=-256;y<=256;y+=8)for(let x=-256;x<=256;x+=8)offsets.push([x,y]);offsets.sort((a,b)=>(a[0]*a[0]+a[1]*a[1])-(b[0]*b[0]+b[1]*b[1])||a[1]-b[1]||a[0]-b[0]);
 const boxFor=p=>{if(p.name==='tree')return cityTreeGround(p);const f=p.footprint||footprints[p.name];return f?[p.x+f[0],p.y+f[1],f[2],f[3]]:p.fence?[p.x+8,p.y+12,16,16]:null;};
 for(const p of map.props.filter(p=>p.name==='city-lamp'||p.name==='tree')){
  const tree=p.name==='tree',validGround=b=>tree?cityGreenGround(map,b):!roads.some(r=>rectHit(b,r,6))&&!water.some(r=>rectHit(b,r,6));
  const original=boxFor(p);if(validGround(original))continue;
  const other=map.props.filter(q=>q!==p).map(boxFor).filter(Boolean),from={x:p.x,y:p.y};
  const offset=offsets.find(([dx,dy])=>{const b=[original[0]+dx,original[1]+dy,original[2],original[3]];return validGround(b)&&!houses.some(r=>rectHit(b,r,8))&&!routes.some(r=>rectHit(b,r))&&!other.some(r=>rectHit(b,r,8));});
  if(!offset)throw Error('No roadside position for '+p.name+' at '+p.x+','+p.y);
  if(tree)p.vegetationId=`tree:${p.name}:${p.x}:${p.y}`;
  p.relocatedFrom=from;p.x+=offset[0];p.y+=offset[1];
 }
}
