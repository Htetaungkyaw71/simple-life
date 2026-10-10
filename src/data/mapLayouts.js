import {FOREST_MAP,WATERFALLS} from './forest.js';
import {CITY} from './city.js';
import {FIELDS} from './farms.js';
import {ROOM_SOLIDS} from './interior.js';
import {HOUSE,houseSolids,shedSolids} from './geometry.js';
export {pondInset} from './geometry.js';
// Visual layout and physical footprints share one source; positions are world units.
export const MAP_SIZE = { width: 2240, height: 1152 };

const prop=(name,x,y,extra={})=>({name,x,y,...extra});
const trees=(x,y,cols,rows,step=112)=>Array.from({length:cols*rows},(_,i)=>prop('tree',x+i%cols*step,y+Math.floor(i/cols)*step));
const border=[...Array.from({length:21},(_,i)=>prop('tree',i*112-16,-30)),...Array.from({length:21},(_,i)=>prop('tree',i*112-16,1056)),...Array.from({length:8},(_,i)=>prop('tree',-48,96+i*120)),...Array.from({length:8},(_,i)=>prop('tree',2184,96+i*120))];
const home={
 paths:[[448,448,64,704],[448,608,1792,64],[864,256,96,672],[1088,320,576,64],[1600,320,64,352],[896,896,832,64]],
 buildings:[prop('house-village-0',HOUSE.door.x-180,HOUSE.y-150),prop('shed',1088,224),prop('house-village-1',1624,96),prop('shed',1888,800)],
 props:[prop('crate',528,496),prop('farm-sign',384,568),prop('road-sign',2016,548,{text:'CITY',direction:0}),prop('road-sign',1056,548,{text:'CITY',direction:0}),prop('mailbox',816,572),prop('notice',936,576),prop('bench',960,824),prop('table',976,884),prop('bench',1064,916),prop('wheelbarrow',1056,326),prop('barrel',1200,290),prop('crate',1204,328),prop('well',1356,420),prop('bench',1760,344),prop('lamp',1632,338),...trees(1040,112,4,1),...trees(1800,400,3,2),...trees(96,640,3,3),...trees(480,880,3,1)],
 water:[[1376,736,288,128]],
 fences:[[256,1104,160,'h'],[544,1104,160,'h'],[832,176,416,'h'],[832,176,320,'v'],[832,704,480,'h'],[832,768,256,'v'],[832,1024,928,'h']],
 signs:[{x:2048,y:604,type:'hint',label:'CITY / follow the east road'},{x:1088,y:604,type:'hint',label:'CITY / follow the east road'},{x:408,y:616,type:'hint',label:'Farm - follow the south road'},{x:944,y:606,label:'Read the board',title:'A little room to grow',body:'Welcome home. The south path leads to your farm. The well and picnic corner are yours to enjoy.'},{x:880,y:896,label:'Read the carving',title:'The shade garden',body:'Someone carved a tiny sun into this bench. A fine spot to watch the afternoon drift by.'}],
 extras:[]
};
home.paths.push([672,0,96,672]);
home.props.push(prop('road-sign',768,136,{text:'FOREST',direction:6}));
home.signs.push({type:'hint',x:800,y:192,label:'FOREST / follow the north road'});
const farm={
 paths:[[288,0,64,336],[192,272,144,64],[128,528,832,64],[832,256,64,192],[160,224,64,416],[192,432,1024,64],[640,288,64,640],[640,896,1376,64],[960,448,64,448],[960,576,928,64],[1472,256,64,672],[1024,352,800,64]],
 buildings:[prop('house-village-2',56,32),prop('shed',848,624)],
 props:[...FIELDS.flatMap(f=>[prop('scarecrow',f.x+216,f.y-48),prop('barrel',f.x+216,f.y+96),prop('pebble',f.x+216,f.y+152),prop('flowers2',f.x+200,f.y+32),prop('flowers1',f.x-48,f.y+160)]),prop('sign',288,672),prop('notice',736,384),prop('wheelbarrow',796,688),prop('barrel',1016,688),prop('crate',1016,738),prop('well',1456,472),prop('bench',1888,864),prop('sign',828,236),...trees(1648,128,4,3,120),...trees(96,608,2,3),...trees(1168,944,6,1)],
 water:[[1696,656,320,176]],
 fields:FIELDS,
 fences:[...FIELDS.map(f=>[f.x+16,f.y-48,160,'h']),[1600,96,512,'h'],[1600,504,512,'h']],
 signs:[{x:304,y:712,type:'field',field:3,label:'Shovel / dig free beds'},{x:764,y:428,type:'farmOffice',label:'Farm board / trade and expand'},{x:1496,y:568,label:'Read orchard sign',title:'A growing garden',body:'Plant fruit and vegetable seeds from the City. Dig clear grass with your shovel to make free beds.'},{x:1088,y:568,label:'Read irrigation note',title:'Water once each day',body:'Water any time, once a day. Two missed days pause growth; day three needs recovery water, and day four kills the crop. One watered night brings your first Tomato harvest.'}],
 extras:[]
};
const city=CITY;
const interior={paths:[],buildings:[],props:[],water:[],fences:[],signs:[],details:[],obstacles:[]};
export const MAPS={home,farm,city};
const footprints={tree:[22,76,20,16],cypress:[10,20,12,12],bush:[6,12,20,14],house:[0,48,160,80],'house-blue':[0,48,160,80],shed:[0,32,96,64],bench:[0,18,64,18],table:[0,8,64,40],well:[2,6,28,26],barrel:[2,2,28,30],crate:[0,0,32,32],fountain0:[4,40,88,48],'city-fountain0':[6,72,148,92],'city-lamp':[14,76,12,18],'city-bench-garden':[0,36,128,62],'city-flowerpot':[4,42,32,20],'city-tent':[2,68,122,24],scarecrow:[26,40,12,38],notice:[4,8,56,38],mailbox:[10,16,12,20],lamp:[12,48,8,14],sign:[10,44,12,16],'farm-sign':[20,48,8,16],'road-sign':[28,48,8,16],planter:[4,8,24,20],'seed-stall':[8,88,144,40],'produce-stall':[8,88,144,40],'outfitter-stall':[8,88,144,40]};
for(const [area,map]of Object.entries(MAPS)){
 if(area!=='city')map.props.push(...[[720,736],[1344,1000],[2064,96],[2080,960],[1984,384],[592,96]].map(([x,y])=>prop('rock',x,y)));
 map.props.push(...(area==='city'?[...Array.from({length:23},(_,i)=>prop('tree',i*112-16,1736)),...Array.from({length:12},(_,i)=>prop('tree',-48,240+i*120)),...Array.from({length:12},(_,i)=>prop('tree',2504,240+i*120))]:border).map(p=>({...p})));
 const companions=map.props.filter(p=>p.name==='tree').map((p,i)=>prop('tree',p.x+44,p.y+20+(i%3)*8)).filter(p=>!map.paths.some(([x,y,w,h])=>p.x+32>x-44&&p.x+32<x+w+44&&p.y+90>y-44&&p.y+90<y+h+44)&&!(area==='home'&&p.x<640&&p.y<520));map.props.push(...companions);
 // Deterministic decoration avoids the roads, fields and room; decoration has no hitbox.
 map.details=Array.from({length:220},(_,i)=>({x:64+(i*173)%(area==='city'?2432:2112),y:64+(i*257)%(area==='city'?1632:992),name:i%9===0?'flowers':i%7===0?'mushroom':'grass-detail'})).filter(p=>!map.paths.some(([x,y,w,h])=>p.x>x-32&&p.x<x+w&&p.y>y-32&&p.y<y+h)&&!(area==='home'&&p.x<832&&p.y<544)&&!(area==='farm'&&map.fields.some(f=>p.x>f.x-32&&p.x<f.x+f.w&&p.y>f.y-32&&p.y<f.y+f.h)));
 for(const [x,y,w,dir]of map.fences)for(let n=0;n<w;n+=32)map.props.push(prop(dir==='h'?'fence':'fence-v',x+(dir==='h'?n:0),y+(dir==='v'?n:0),{fence:true}));

 for(const tree of map.props.filter(p=>p.name==='tree')){for(let n=0;n<3;n++)map.details.push({name:n===0?'fern':n===1?'flowers'+(Math.floor(tree.x/112)%5+5)%5:'grass-detail',x:tree.x+((n*23+17)%74)-10,y:tree.y+82+n*6});}
 if(area==='city'){map.props=map.props.filter(p=>p.x<map.size.width&&p.y<map.size.height&&!(p.x<80&&Math.abs(p.y+90-488)<100));map.details=map.details.filter(p=>p.name!=='fern'&&p.y>192&&p.x<map.size.width-32&&p.y<map.size.height-32&&!([...map.sidewalks,...map.squares,...map.gardens]).some(([x,y,w,h])=>p.x>x-24&&p.x<x+w&&p.y>y-24&&p.y<y+h));}
 if(area==='home'){map.props=map.props.filter(p=>!(Math.abs(p.x+32-720)<92&&p.y<96));map.props=map.props.filter(p=>!(p.x>2100&&Math.abs(p.y+90-640)<112));map.details=map.details.filter(p=>!(p.x>2112&&Math.abs(p.y-640)<64));}
 map.details=map.details.filter(p=>!map.water.some(([x,y,w,h])=>p.x>x-16&&p.x<x+w&&p.y>y-16&&p.y<y+h));
 if(area==='home'||area==='farm'){const cx=area==='home'?480:320;const nearEdge=p=>Math.abs(p.x+32-cx)<88&&(area==='home'?p.y>1000:p.y<48);map.props=map.props.filter(p=>!nearEdge(p));map.details=map.details.filter(p=>!nearEdge(p));}
 // Cut 2–3 tile openings where a fence intersects a road; collision uses this filtered list.
 map.props=map.props.filter(p=>!p.fence||!map.paths.some(([x,y,w,h])=>p.x+24>x&&p.x+8<x+w&&p.y+28>y&&p.y+12<y+h));
 map.obstacles=[...map.buildings,...map.props].flatMap(p=>{if(p.name.startsWith('house'))return houseSolids(p.x,p.y,p.name);if(p.name==='shed')return shedSolids(p.x,p.y);const f=footprints[p.name];return f?[[p.x+f[0],p.y+f[1],f[2],f[3]]]:p.fence?[[p.x+8,p.y+12,16,16]]:[]});
 // Water is walkable; only scenery contributes physical footprints.
}
interior.obstacles=ROOM_SOLIDS;
// Staffed stall posts/back shelves/counters and fountain column share actual art geometry.
for(const p of city.props.filter(p=>p.name.endsWith('-stall')))city.obstacles.push([p.x+6,p.y+40,8,88],[p.x+146,p.y+40,8,88],[p.x+8,p.y+40,144,14]);
city.obstacles.push([696,358,16,66]);

FOREST_MAP.obstacles=FOREST_MAP.props.flatMap(p=>{if(p.rocky)return p.solid?[[p.x+12,p.foot-24,p.w-24,24]]:[];if(p.name.startsWith('cp-plant-'))return [];if(p.name.startsWith('cp-ruins-')){const n=Number(p.name.at(-1));return n===3?[[p.x+8,p.y+40,28,32],[p.x+84,p.y+40,28,32]]:n===4?[[p.x+10,p.y+42,70,38]]:[];}if(p.name==='cave-mouth')return [[p.x+4,p.y+28,26,56],[p.x+96,p.y+28,28,56]];if(p.name==='bamboo-gate')return [[p.x,p.y,16,84],[p.x+80,p.y,16,84]];const f=footprints[p.name]||({'palm-tree':[22,76,20,16],'willow-tree':[22,76,20,16],'broadleaf-tree':[22,76,20,16],'guava-tree':[22,76,20,16],'mango-tree':[22,76,20,16],'tree-wide':[26,76,42,16],rock:[6,28,50,28],'forest-log':[0,14,64,18],'shrine-stone':[8,22,32,26],'bamboo-clump':[20,48,20,16],'snow-pine':[22,76,20,16],'acacia-tree':[22,76,20,16],'cave-mouth':[8,56,112,24],'ice-crystal':[6,34,40,22],'bamboo-gate':[0,0,8,84],'ruin-pillar':[8,40,24,24],'camp-tent':[8,48,72,24],'waterfall-stone':[8,32,40,24]})[p.name];return f?[[p.x+f[0],p.y+f[1],f[2],f[3]]]:[];});
// Solid rock side banks leave the waterfall's flowing centre open.
FOREST_MAP.obstacles.push(...WATERFALLS.flatMap(f=>[[f.x-24,f.y+10,24,f.h-4],[f.x+f.w,f.y+10,24,f.h-4]]));
MAPS.forest=FOREST_MAP;
MAPS.interior=interior;
home.details=home.details.filter(p=>!(p.x>380&&p.x<610&&p.y>290&&p.y<555));
farm.obstacles.push([840,232,16,16],[872,232,16,16]);
