import {CITY_SHOPS_PLAN as P} from './cityShopsPlan.js';
import {CITY_SHOP_ART as ART} from './cityShopArt.js';
import {CITY_COTTAGE_ART} from './cityCottageArt.js';
import {CITY_BUILDING_ART,CITY_BUILDING_PLACEMENTS,CITY_HOUSE_LAWNS} from './cityBuildingArt.js';
import {CITY_LAYOUT} from './cityLayout.js';
import {CITY_FOUNTAIN_ISLAND,CITY_FOUNTAIN_PLANTING} from './cityFountainIsland.js';
import {cityGreenGround,cityTreeGround} from './cityPlacement.js';
const same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
const hit=(a,b,pad=0)=>a[0]<b[0]+b[2]+pad&&a[0]+a[2]>b[0]-pad&&a[1]<b[1]+b[3]+pad&&a[1]+a[3]>b[1]-pad;
const scaleRows=(rows,scale)=>rows.map(([x,y,w,h])=>[x*scale,y*scale,w*scale,h*scale]);
const artFor=b=>b.id==='cottage-b'?CITY_COTTAGE_ART:b.id==='cafe'?CITY_BUILDING_ART['cafe-terracotta-awning']:b.id==='barber'?CITY_BUILDING_ART['shop-barber-blue-roof']:b.id==='clothing'?CITY_BUILDING_ART['shop-clothing-sage-awning']:ART[b.id];
const artBuilding=b=>{const a=artFor(b),origin=a.originOffset?[b.origin[0]+a.originOffset[0],b.origin[1]+a.originOffset[1]]:b.origin,door=a.doorOffset?[origin[0]+a.doorOffset[0],origin[1]+a.doorOffset[1]]:b.door,approach=a.doorOffset?[door[0],b.approach[1]]:b.approach,scale=b.scale||a.scale||2,solidRows=a.foundationRows?scaleRows(a.foundationRows,scale):a.solidRows;return {x:origin[0],y:origin[1],artTexture:a.texture,artFrame:a.frame,artScale:scale,artDepth:origin[1]+(a.bounds?.[3]??a.height)*scale,noShadow:true,solidRows,entry:{x:door[0],y:door[1]},porch:{x:approach[0],y:approach[1]}};};
const replaceResidentialArt=map=>{for(const [index,placement]of Object.entries(CITY_BUILDING_PLACEMENTS)){const b=map.buildings[Number(index)],a=CITY_BUILDING_ART[placement.id],scale=placement.scale||a.scale,[cx,base]=placement.anchor;b.x=Math.round(cx-a.width*scale/2);b.y=base-a.height*scale;b.artTexture=a.texture;b.artFrame=a.frame;b.artScale=scale;b.artDepth=b.y+a.bounds[3]*scale;b.noShadow=true;b.solidRows=scaleRows(a.foundationRows,scale);b.entry={x:placement.entry[0],y:placement.entry[1]};b.porch={x:placement.porch[0],y:placement.porch[1]};}};
const clearResidentialTrees=map=>{
 const lawns=Object.values(CITY_HOUSE_LAWNS),trees=map.props.filter(p=>p.name==='tree'),offsets=[];
 for(let y=-map.size.height;y<=map.size.height;y+=16)for(let x=-map.size.width;x<=map.size.width;x+=16)offsets.push([x,y]);
 offsets.sort((a,b)=>a[0]**2+a[1]**2-b[0]**2-b[1]**2||a[1]-b[1]||a[0]-b[0]);
 for(const tree of trees){if(!lawns.some(r=>hit([tree.x,tree.y,64,96],r)))continue;const from={x:tree.x,y:tree.y},others=trees.filter(p=>p!==tree);
  const offset=offsets.find(([dx,dy])=>{const p={x:from.x+dx,y:from.y+dy},crown=[p.x,p.y,64,96];return p.x>=16&&p.y>=192&&p.x+64<=map.size.width-16&&p.y+96<=map.size.height-16&&cityGreenGround(map,cityTreeGround(p))&&!lawns.some(r=>hit(crown,r,12))&&!others.some(q=>hit(crown,[q.x,q.y,64,96],8));});
  if(!offset)throw Error('No grass relocation for City tree '+from.x+','+from.y);
  tree.vegetationId??=`tree:${tree.name}:${tree.x}:${tree.y}`;tree.relocatedFrom??=from;tree.x+=offset[0];tree.y+=offset[1];
 }
};
export function applyCityShops(map){
 for(const h of P.convertedHouses){const b=map.buildings[h.index],p=P.buildings.find(a=>a.id===h.replacementHome);if(b.name!==h.name)throw Error('City home identity changed');Object.assign(b,artBuilding(p));}
 replaceResidentialArt(map);
 clearResidentialTrees(map);
 for(const b of P.buildings.slice(0,3))map.buildings.push({name:'city-'+b.id,...artBuilding(b)});
 map.props=map.props.filter(p=>p.name!=='planter'&&!same([p.x,p.y],P.camp.removedPlanter)&&!P.omittedFrontagePots.some(a=>same(a,[p.x,p.y])));
 // The current review removes the camp barrel; the older proposal remains as
 // provenance, so only the retained camp furniture is moved at runtime.
 for(const m of [...P.camp.moves.filter(p=>p.name!=='barrel'),...P.lampMoves.map(p=>({...p,name:'city-lamp'}))]){
  const p=map.props.find(p=>p.name===m.name&&same([p.x,p.y],m.from));if(!p)throw Error('Missing approved City object '+m.name+' '+m.from);[p.x,p.y]=m.to;
 }
 const planterKeep=new Set(['469,580','653,580','837,580']);
 map.props=map.props.filter(p=>p.name!=='city-bench-garden'||planterKeep.has(`${p.x},${p.y}`));
 const lawns=Object.values(CITY_HOUSE_LAWNS);
 // Clear old procedural decoration from the new residential lawns. Required
 // road furniture is moved to the nearest open verge instead of being hidden.
 const lampMoves=new Map([['1920,264',[1832,336]],['572,1104',[680,1200]],['1312,586',[1200,560]],['1848,1208',[1728,1200]]]);
 for(const p of map.props){const to=lampMoves.get(`${p.x},${p.y}`);if(p.name==='city-lamp'&&to)[p.x,p.y]=to;}
 // The eight-frame sheet contains the complete island and is placed from its
 // transparent canvas. Its stepped solid rows match the visible island.
 const fountain=map.props.find(p=>p.name==='city-fountain0');if(fountain){const scale=CITY_FOUNTAIN_ISLAND.scale;[fountain.x,fountain.y]=CITY_FOUNTAIN_ISLAND.position;fountain.solidRows=CITY_FOUNTAIN_ISLAND.solidRows.map(([x,y,w,h])=>{const left=Math.round(x*scale),top=Math.round(y*scale);return [left,top,Math.round((x+w)*scale)-left,Math.round((y+h)*scale)-top];});fountain.noShadow=true;}
 // Keep the café frontage and camp lawn open in the current review. The old
 // café furniture remains in the source atlas for the separately exported
 // comparison images, but is intentionally not placed in the world.
 map.cityPlanting=CITY_LAYOUT.planting.filter(a=>!a.group.startsWith('island')&&!lawns.some(r=>hit([a.foot[0]-12,a.foot[1]-16,24,16],r))).map(a=>({...a,foot:[...a.foot]}));
 for(const m of P.flowerMoves){
  const g=m.frame.startsWith('tall-grass')&&map.grass.find(g=>same([g.x-24,g.y-48],m.from));if(g){[g.x,g.y]=[m.to[0]+24,m.to[1]+48];const a=map.cityPlanting.find(a=>a.x===m.from[0]&&a.y===m.from[1]);if(a){a.x=m.to[0];a.y=m.to[1];a.foot=[g.x,g.y];}continue;}
  const p=[...map.props,...map.details].find(p=>same(p.landscapeVisual?[p.landscapeVisual.x,p.landscapeVisual.y]:[p.x,p.y],m.from));if(!p){if(lawns.some(r=>hit([m.from[0],m.from[1],1,1],r,24)))continue;throw Error('Missing City plant move '+m.from);}
  const dx=m.to[0]-m.from[0],dy=m.to[1]-m.from[1];
  if(p.landscapeVisual){const a=p.landscapeVisual;p.landscapeVisual={...a,x:a.x+dx,y:a.y+dy,foot:[a.foot[0]+dx,a.foot[1]+dy]};}
  else {p.x+=dx;p.y+=dy;}
  const a=map.cityPlanting.find(a=>a.x===m.from[0]&&a.y===m.from[1]);if(a){a.x+=dx;a.y+=dy;a.foot=[a.foot[0]+dx,a.foot[1]+dy];}
 }
 // Reuse all eight existing gatherable island identities; four extra drifts
 // are fixed ornamental cover, not respawned or duplicate gatherable nodes.
 const pool=[...map.props,...map.details].filter(p=>p.landscapeVisual&&p.landscapeVisual.foot[0]>=576&&p.landscapeVisual.foot[0]<=832&&p.landscapeVisual.foot[1]>=354&&p.landscapeVisual.foot[1]<=522);
 const grass=map.grass.filter(p=>p.x>=576&&p.x<=832&&p.y>=354&&p.y<=522);
 for(const [i,a]of CITY_FOUNTAIN_PLANTING.entries()){
  // Preserve established gatherable IDs for old saves, but tuck their visuals
  // beneath the opaque basin. The complete island sprite supplies the plants.
  const under=[676+(i%4)*18,420+Math.floor(i/4)*12],info={...a,x:under[0]-16,y:under[1]-32,foot:under,kind:a.frame.startsWith('tall-grass')?'grass':'flowers',group:'island-underlay-'+i};map.cityPlanting.push(info);
  if(info.kind==='grass'){const p=grass.shift();if(!p)throw Error('Missing island grass identity');[p.x,p.y]=info.foot;p.variant=Number(a.frame.split('-')[2]);}
  else {const p=pool.shift();if(p)p.landscapeVisual={...info};else map.props.push({name:'city-garden-cover',x:info.x,y:info.y,landscapeVisual:{...info}});}
 }
 if(pool.length||grass.length)throw Error('Unassigned island plant identity');
 map.gardens=map.gardens.map(g=>g[0]===1904&&g[1]===736?[...P.camp.parcel]:g);
 map.cityShops=P;
}
