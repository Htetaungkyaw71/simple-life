import {CITY_LAYOUT} from './cityLayout.js';
import {CITY_HOUSE_LAWNS} from './cityBuildingArt.js';
import {cityMaskHits} from './citySurfaceGeometry.js';
import {houseSolids} from './geometry.js';
const hit=(a,b,pad=0)=>a[0]<b[0]+b[2]+pad&&a[0]+a[2]>b[0]-pad&&a[1]<b[1]+b[3]+pad&&a[1]+a[3]>b[1]-pad;
// Run after the old deterministic placement, preserving identities from existing
// saves even when a previously gathered plant is moved to the new green border.
export function applyCityLayout(map){
 for(const move of CITY_LAYOUT.propMoves){
  const p=map.props.find(p=>p.name===move.name&&p.x===move.from[0]&&p.y===move.from[1]);
  if(!p)throw Error('Missing City layout prop '+move.name+' '+move.from);
  if(p.name==='tree'){p.vegetationId??=`tree:${p.name}:${p.x}:${p.y}`;p.treeVisual=move.treeVisual;}
  [p.x,p.y]=move.to;
 }
 map.cityLayout=CITY_LAYOUT;map.paths=CITY_LAYOUT.roads.map(r=>[...r]);map.paving=map.paths;map.squares=[];map.sidewalks=[];
 map.plaza=[352,320,704,240];
 regroupPlants(map);
}
function regroupPlants(map){
 const groundNames=new Set(['grass-detail','mushroom','flowers','flowers0','flowers1','flowers2','flowers3','flowers4']);
 const pool=[...map.details,...map.props].filter(p=>groundNames.has(p.name));
 for(const p of pool)p.vegetationId=`grass:${p.name}:${p.x}:${p.y}`;
 const grass=[...map.grass],used=new Set(),occupied=[];
 const solids=[...map.buildings.flatMap(b=>houseSolids(b.x,b.y,b.name)),...CITY_LAYOUT.reservedFrontages.map(r=>r.rect),...Object.values(CITY_HOUSE_LAWNS)];
 const foot=p=>p.landscapeVisual?.foot??(p.id?[p.x,p.y]:[p.x+16,p.y+32]);
 const pick=(list,cx,cy)=>list.filter(p=>!used.has(p)).sort((a,b)=>{const aa=foot(a),bb=foot(b);return Math.hypot(aa[0]-cx,aa[1]-cy)-Math.hypot(bb[0]-cx,bb[1]-cy);})[0];
 for(const a of CITY_LAYOUT.planting){
  const p=pick(a.kind==='grass'?grass:pool,...a.foot);if(!p)throw Error('City planting pool exhausted');used.add(p);
  if(p.id){[p.x,p.y]=a.foot;p.variant=Number(a.frame.split('-')[2]);}
  else p.landscapeVisual={frame:a.frame,scale:a.scale,x:a.x,y:a.y,foot:a.foot};
  occupied.push([a.foot[0]-18,a.foot[1]-12,36,16]);
 }
 const allowed=([cx,cy])=>{
  const box=[cx-18,cy-30,36,32];
  return cx>32&&cx<map.size.width-32&&cy>212&&cy<map.size.height-16&&!cityMaskHits('placementWalk',box,4)&&!map.gardens.some(r=>hit(box,r,8))&&!solids.some(r=>hit(box,r,24))&&!occupied.some(r=>hit(box,r,8));
 };
 const offsets=[];for(let y=-map.size.height;y<=map.size.height;y+=16)for(let x=-map.size.width;x<=map.size.width;x+=16)offsets.push([x,y]);offsets.sort((a,b)=>a[0]**2+a[1]**2-b[0]**2-b[1]**2||a[1]-b[1]||a[0]-b[0]);
 for(const p of [...pool,...grass]){
  if(used.has(p))continue;const original=foot(p);let point=original;
  if(!allowed(point)){const offset=offsets.find(([dx,dy])=>allowed([original[0]+dx,original[1]+dy]));if(!offset)throw Error('No green space for City plant '+(p.id||p.vegetationId));point=[original[0]+offset[0],original[1]+offset[1]];}
  if(p.id)[p.x,p.y]=point;else {p.x=point[0]-16;p.y=point[1]-32;}
  occupied.push([point[0]-12,point[1]-14,24,16]);
 }
}
