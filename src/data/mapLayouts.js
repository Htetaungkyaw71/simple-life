import {FOREST_MAP,WATERFALLS} from './forest.js';
import {CITY} from './city.js';
import {FIELDS} from './farms.js';
import {ROOM_SOLIDS} from './interior.js';
import {HOUSE,houseSolids,shedSolids} from './geometry.js';
import {placeCityRoadside} from './cityPlacement.js';
import {applyCityLayout} from './applyCityLayout.js';
import {applyCityShops} from './applyCityShops.js';
import {SHOP_ROOMS,shopMap} from './cityShops.js';
import {PLANTER_BENCH} from './planterBench.js';
import {CITY_BUILDING_ART} from './cityBuildingArt.js';
import {clearMapSurfaces} from './surfaceClearance.js';
import {propArtInfo,propScale} from './propArt.js';
export {pondInset} from './geometry.js';
// Visual layout and physical footprints share one source; positions are world units.
export const MAP_SIZE = { width: 2240, height: 1152 };

const prop=(name,x,y,extra={})=>({name,x,y,...extra});
const trees=(x,y,cols,rows,step=112)=>Array.from({length:cols*rows},(_,i)=>prop('tree',x+i%cols*step,y+Math.floor(i/cols)*step));
const border=[...Array.from({length:21},(_,i)=>prop('tree',i*112-16,-30)),...Array.from({length:21},(_,i)=>prop('tree',i*112-16,1056)),...Array.from({length:8},(_,i)=>prop('tree',-48,96+i*120)),...Array.from({length:8},(_,i)=>prop('tree',2184,96+i*120))];
const home={
 paths:[[448,448,64,704],[448,608,1792,64],[864,256,96,672],[1088,320,576,64],[1600,320,64,352],[896,896,832,64]],
 buildings:[prop('house-village-0',HOUSE.door.x-180,HOUSE.y-150),prop('shed',1088,224),prop('house-village-1',1624,96),prop('shed',1888,800)],
 props:[prop('crate',528,496),prop('mailbox',816,572),prop('notice',936,576),prop('wheelbarrow',1056,326),prop('barrel',1432,416),prop('crate',1560,448),prop('well',1356,420),prop('lamp',1632,338),...trees(1040,112,4,1),...trees(1800,400,3,2),...trees(96,640,3,3),...trees(480,880,3,1)],
 water:[[1376,736,288,128]],
 fences:[[256,1104,160,'h'],[544,1104,160,'h'],[832,176,416,'h'],[832,176,320,'v'],[832,704,480,'h'],[832,768,256,'v'],[832,1024,928,'h']],
 signs:[{x:2048,y:604,type:'hint',label:'CITY / follow the east road'},{x:1088,y:604,type:'hint',label:'CITY / follow the east road'},{x:408,y:616,type:'hint',label:'Farm - follow the south road'},{x:944,y:606,label:'Read the board',title:'A little room to grow',body:'Welcome home. The south path leads to your farm. The well and picnic corner are yours to enjoy.'}],
 extras:[]
};
home.paths.push([672,0,96,672]);
home.signs.push({type:'hint',x:800,y:192,label:'FOREST / follow the north road'});
const farm={
 // One entrance lane and one main farm lane; every segment stays on an old road.
 paths:[[288,0,24,336],[192,272,128,64],[160,224,64,368],[128,528,832,64],[960,528,64,112],[1024,576,864,64]],
 buildings:[prop('house-village-2',56,32)],
 // Keep working landmarks; leave the growing area free of repeated display props.
 props:[prop('notice',800,532),prop('well',1456,472),prop('bench',1888,864),...trees(1648,128,4,3,120),...trees(96,608,2,3),...trees(1168,944,6,1)],
 water:[[1696,656,320,176]],
 fields:FIELDS,
 fences:[],
 signs:[{x:304,y:712,type:'field',field:3,label:'Shovel / dig free beds'},{x:828,y:576,type:'farmOffice',label:'Farm board / trade and expand'},{x:1496,y:568,label:'Read orchard sign',title:'A growing garden',body:'Plant fruit and vegetable seeds from the City. Dig clear grass with your shovel to make free beds.'},{x:1088,y:568,label:'Read irrigation note',title:'Water once each day',body:'Water any time, once a day. A missed day pauses growth; day three needs recovery water, and day four kills the crop. Three watered nights bring your first Tomato harvest.'}],
 extras:[]
};
const city=CITY;
const interior={paths:[],buildings:[],props:[],water:[],fences:[],signs:[],details:[],obstacles:[]};
export const MAPS={home,farm,city};
const scaleRows=(rows,scale)=>rows.map(([x,y,w,h])=>[x*scale,y*scale,w*scale,h*scale]);
const existingHouse=(building,id,cx,visibleBottom,entry,porch,collisionLip=0)=>{
 const a=CITY_BUILDING_ART[id],scale=a.scale,[,,,bottom]=a.bounds,base=visibleBottom+(a.height-bottom)*scale;
 const solidRows=scaleRows(a.foundationRows,scale);
 if(collisionLip){const [x,y,w]=solidRows[0];solidRows.unshift([x,y-collisionLip,w,collisionLip]);}
 Object.assign(building,{x:Math.round(cx-a.width*scale/2),y:base-a.height*scale,artTexture:a.texture,artFrame:a.frame,artScale:scale,artDepth:visibleBottom,noShadow:true,solidRows,entry:{...entry},porch:{...porch}});
};
// Reuse approved local residence art for the player's outdoor Home and Farm;
// no new generated asset or remote runtime dependency is introduced.
existingHouse(home.buildings[0],'house-03-green-bay',HOUSE.door.x,468,HOUSE.door,HOUSE.porch);
home.buildings[1].name='house-home-plum';
home.buildings[2].name='house-home-grey';
existingHouse(home.buildings[1],'house-05-plum-townhouse',1200,344,{x:1200,y:352},{x:1200,y:376});
existingHouse(home.buildings[2],'house-08-grey-hipped',1744,296,{x:1744,y:304},{x:1744,y:328});
home.buildings.splice(3,1);
existingHouse(farm.buildings[0],'house-02-blue-slate',160,238,{x:160,y:246},{x:160,y:264},4);
const VISIBLE_BODY_CLEARANCE=48;
const barrelArt=propArtInfo('barrel'),barrelScale=propScale('barrel');
const [barrelLeft,barrelTop,barrelRight,barrelBottom]=barrelArt.visibleBounds;
const barrelX=Math.floor(barrelLeft*barrelScale),barrelY=Math.floor(barrelTop*barrelScale);
const BARREL_FOOTPRINT=[barrelX,barrelY,Math.ceil(barrelRight*barrelScale)-barrelX,Math.ceil(barrelBottom*barrelScale)-barrelY+VISIBLE_BODY_CLEARANCE];
const footprints={tree:[22,76,20,16],cypress:[10,20,12,12],bush:[6,12,20,14],rock:[0,0,64,64+VISIBLE_BODY_CLEARANCE],house:[0,48,160,80],'house-blue':[0,48,160,80],shed:[0,32,96,64],bench:[0,18,64,18],table:[0,8,64,40],well:[2,6,28,26],barrel:BARREL_FOOTPRINT,crate:[0,0,32,32],fountain0:[4,40,88,48],'city-fountain0':[6,72,148,92],'city-lamp':[14,76,12,18],'city-bench-garden':[0,36,128,62],'city-flowerpot':[4,42,32,20],'city-tent':[2,68,122,24],scarecrow:[26,40,12,38],notice:[4,8,56,38],mailbox:[10,16,12,20],lamp:[12,48,8,14],sign:[10,44,12,16],'farm-sign':[20,48,8,16],'road-sign':[28,48,8,16],planter:[4,8,24,20],'seed-stall':[8,88,144,40],'produce-stall':[8,88,144,40],'outfitter-stall':[8,88,144,40]};
for(const [area,map]of Object.entries(MAPS)){
 if(area!=='city')map.props.push(...[[720,736],[1344,1000],[2064,96],[2080,960],[1984,384],[592,96]].map(([x,y])=>prop('rock',x,y)));
 map.props.push(...(area==='city'?[...Array.from({length:23},(_,i)=>prop('tree',i*112-16,1736)),...Array.from({length:12},(_,i)=>prop('tree',-48,240+i*120)),...Array.from({length:12},(_,i)=>prop('tree',2504,240+i*120))]:border).map(p=>({...p})));
 const companions=map.props.filter(p=>p.name==='tree').map((p,i)=>prop('tree',p.x+44,p.y+20+(i%3)*8)).filter(p=>!map.paths.some(([x,y,w,h])=>p.x+32>x-44&&p.x+32<x+w+44&&p.y+90>y-44&&p.y+90<y+h+44)&&!(area==='home'&&p.x<640&&p.y<520));map.props.push(...companions);
 // Deterministic decoration avoids the roads, fields and room; decoration has no hitbox.
 map.details=Array.from({length:220},(_,i)=>({x:64+(i*173)%(area==='city'?2432:2112),y:64+(i*257)%(area==='city'?1632:992),name:i%9===0?'flowers':i%7===0?'mushroom':'grass-detail'})).filter(p=>!map.paths.some(([x,y,w,h])=>p.x>x-32&&p.x<x+w&&p.y>y-32&&p.y<y+h)&&!(area==='home'&&p.x<832&&p.y<544)&&!(area==='farm'&&map.fields.some(f=>p.x>f.x-32&&p.x<f.x+f.w&&p.y>f.y-32&&p.y<f.y+f.h)));
 for(const [x,y,w,dir]of map.fences)for(let n=0;n<w;n+=32)map.props.push(prop(dir==='h'?'fence':'fence-v',x+(dir==='h'?n:0),y+(dir==='v'?n:0),{fence:true}));

 for(const tree of map.props.filter(p=>p.name==='tree')){for(let n=0;n<3;n++)map.details.push({name:n===0?'fern':n===1?'flowers'+(Math.floor(tree.x/112)%5+5)%5:'grass-detail',x:tree.x+((n*23+17)%74)-10,y:tree.y+82+n*6});}
 // The farm keeps natural ground flecks/grass, without bright ornamental bouquets.
 if(area==='farm'){
  map.details=map.details.filter(p=>!p.name.startsWith('flowers'));
  map.props=map.props.filter(p=>p.name!=='rock'||!map.fields.some(f=>p.x+64>f.x&&p.x<f.x+f.w&&p.y+64>f.y&&p.y<f.y+f.h));
 }
 if(area==='city'){map.props=map.props.filter(p=>p.x<map.size.width&&p.y<map.size.height&&!(p.x<80&&Math.abs(p.y+90-488)<100));map.details=map.details.filter(p=>p.name!=='fern'&&p.y>192&&p.x<map.size.width-32&&p.y<map.size.height-32&&!([...map.sidewalks,...map.squares,...map.gardens]).some(([x,y,w,h])=>p.x>x-24&&p.x<x+w&&p.y>y-24&&p.y<y+h));}
 if(area==='home'){map.props=map.props.filter(p=>!(Math.abs(p.x+32-720)<92&&p.y<96));map.props=map.props.filter(p=>!(p.x>2100&&Math.abs(p.y+90-640)<112));map.details=map.details.filter(p=>!(p.x>2112&&Math.abs(p.y-640)<64));}
 map.details=map.details.filter(p=>!map.water.some(([x,y,w,h])=>p.x>x-16&&p.x<x+w&&p.y>y-16&&p.y<y+h));
 if(area==='home'||area==='farm'){const cx=area==='home'?480:320;const nearEdge=p=>Math.abs(p.x+32-cx)<88&&(area==='home'?p.y>1000:p.y<48);map.props=map.props.filter(p=>!nearEdge(p));map.details=map.details.filter(p=>!nearEdge(p));}
 // Cut 2–3 tile openings where a fence intersects a road; collision uses this filtered list.
 map.props=map.props.filter(p=>!p.fence||!map.paths.some(([x,y,w,h])=>p.x+24>x&&p.x+8<x+w&&p.y+28>y&&p.y+12<y+h));
 // A closed gate replaces an already closed fence span, preserving every route opening.
 if(area==='city'){map.props=map.props.filter(p=>!(p.fence&&p.y===168&&p.x>=1280&&p.x<1376));map.props.push(prop('outdoor-closed-gate',1280,168,{artFrame:'outdoor-closed-gate',artScale:1,noShadow:true,footprint:[8,12,80,16]}));}
 for(const p of map.props.filter(p=>p.name==='well')){p.x-=12;p.y-=32;Object.assign(p,{artFrame:'outdoor-well-large',artScale:1,footprint:[15,68,42,24]});}
 if(area==='city'){
  for(const p of map.props.filter(p=>p.name==='city-bench-garden'&&!p.artFrame)){p.x+=13;p.y+=4;Object.assign(p,{artFrame:PLANTER_BENCH.frame,artScale:PLANTER_BENCH.scale,footprint:PLANTER_BENCH.footprint,noShadow:true});}
  placeCityRoadside(map,footprints);
  applyCityLayout(map);
  applyCityShops(map);
 }
 // City has its own identity-preserving roadside relocator because collected
 // plants are addressed by their original coordinates in existing saves.
 if(area!=='city')clearMapSurfaces(map,footprints);
 map.obstacles=[...map.buildings,...map.props].flatMap(p=>{if(p.solidRows)return p.solidRows.map(([x,y,w,h])=>[p.x+x,p.y+y,w,h]);if(p.name.startsWith('house'))return houseSolids(p.x,p.y,p.name);if(p.name==='shed')return shedSolids(p.x,p.y);const f=p.footprint||footprints[p.name];return f?[[p.x+f[0],p.y+f[1],f[2],f[3]]]:p.fence?[[p.x+8,p.y+12,16,16]]:[]});
 // Water is walkable; only scenery contributes physical footprints.
}
interior.obstacles=ROOM_SOLIDS;
// Staffed stall posts/back shelves/counters share actual art geometry. The
// fountain island contributes its own stepped solid rows during City setup.
for(const p of city.props.filter(p=>p.name.endsWith('-stall')))city.obstacles.push([p.x+6,p.y+40,8,88],[p.x+146,p.y+40,8,88],[p.x+8,p.y+40,144,14]);

clearMapSurfaces(FOREST_MAP,footprints);
FOREST_MAP.obstacles=FOREST_MAP.props.flatMap(p=>{if(p.rocky)return p.solid?[[p.x,p.y,p.w,p.h+VISIBLE_BODY_CLEARANCE]]:[];if(p.name==='rock')return [[p.x-20,p.y-8,104,72+VISIBLE_BODY_CLEARANCE]];if(p.name.startsWith('cp-plant-'))return [];if(p.name.startsWith('cp-ruins-')){const n=Number(p.name.at(-1));return n===3?[[p.x+8,p.y+40,28,32],[p.x+84,p.y+40,28,32]]:n===4?[[p.x+10,p.y+42,70,38]]:[];}if(p.name==='cave-mouth')return [[p.x+4,p.y+28,26,56],[p.x+96,p.y+28,28,56]];if(p.name==='bamboo-gate')return [[p.x,p.y,16,84],[p.x+80,p.y,16,84]];const f=footprints[p.name]||({'palm-tree':[22,76,20,16],'willow-tree':[22,76,20,16],'broadleaf-tree':[22,76,20,16],'guava-tree':[22,76,20,16],'mango-tree':[22,76,20,16],'tree-wide':[26,76,42,16],'forest-log':[0,14,64,18],'shrine-stone':[8,22,32,26],'bamboo-clump':[20,48,20,16],'snow-pine':[22,76,20,16],'acacia-tree':[22,76,20,16],'cave-mouth':[8,56,112,24],'ice-crystal':[6,34,40,22],'bamboo-gate':[0,0,8,84],'ruin-pillar':[8,40,24,24],'camp-tent':[8,48,72,24],'waterfall-stone':[8,32,40,24]})[p.name];return f?[[p.x+f[0],p.y+f[1],f[2],f[3]]]:[];});
// Solid rock side banks leave the waterfall's flowing centre open.
FOREST_MAP.obstacles.push(...WATERFALLS.flatMap(f=>[[f.x-24,f.y+10,24,f.h-4],[f.x+f.w,f.y+10,24,f.h-4]]));
MAPS.forest=FOREST_MAP;
MAPS.interior=interior;
for(const [area,room]of Object.entries(SHOP_ROOMS))MAPS[area]=shopMap(room);
home.details=home.details.filter(p=>!(p.x>380&&p.x<610&&p.y>290&&p.y<555));
