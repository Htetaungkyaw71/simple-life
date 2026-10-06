import {ROOM_SOLIDS} from './interior.js';
import {HOUSE,houseSolids,pondRows} from './geometry.js';
export {pondInset} from './geometry.js';
// Visual layout and physical footprints share one source; positions are world units.
export const MAP_SIZE = { width: 2240, height: 1152 };

const prop=(name,x,y,extra={})=>({name,x,y,...extra});
const trees=(x,y,cols,rows,step=112)=>Array.from({length:cols*rows},(_,i)=>prop('tree',x+i%cols*step,y+Math.floor(i/cols)*step));
const border=[...Array.from({length:21},(_,i)=>prop('tree',i*112-16,-30)),...Array.from({length:21},(_,i)=>prop('tree',i*112-16,1056)),...Array.from({length:8},(_,i)=>prop('tree',-48,96+i*120)),...Array.from({length:8},(_,i)=>prop('tree',2184,96+i*120))];
const home={
 paths:[[448,448,64,704],[448,608,1568,64],[864,256,64,672],[1088,320,576,64],[1600,320,64,352],[896,896,832,64]],
 buildings:[prop('house',HOUSE.x,HOUSE.y),prop('shed',1088,224),prop('house-blue',1664,160),prop('shed',1888,800)],
 props:[prop('crate',528,496),prop('mailbox',816,572),prop('notice',936,576),prop('bench',960,824),prop('table',976,884),prop('bench',1064,916),prop('wheelbarrow',1056,326),prop('barrel',1200,290),prop('crate',1204,328),prop('well',1356,420),prop('bench',1760,344),prop('lamp',1632,338),...trees(1040,112,4,1),...trees(1800,400,3,2),...trees(96,640,3,3),...trees(480,880,3,1)],
 water:[[1376,736,288,128]],
 fences:[[256,1104,160,'h'],[544,1104,160,'h'],[832,176,416,'h'],[832,176,320,'v'],[832,704,480,'h'],[832,768,256,'v'],[832,1024,928,'h']],
 signs:[{x:944,y:606,label:'Read the board',title:'A little room to grow',body:'Welcome home. The south path leads to your farm. The well and picnic corner are yours to enjoy.'},{x:880,y:896,label:'Read the carving',title:'The shade garden',body:'Someone carved a tiny sun into this bench. A fine spot to watch the afternoon drift by.'}],
 extras:[]
};
const farm={
 paths:[[288,0,64,336],[192,272,144,64],[128,528,832,64],[832,256,64,192],[160,224,64,416],[192,432,1024,64],[640,288,64,640],[640,896,1376,64],[960,448,64,448],[960,576,928,64],[1472,256,64,672],[1024,256,800,64]],
 buildings:[prop('house',96,96),prop('shed',848,624)],
 props:[prop('scarecrow',640,154),prop('notice',736,384),prop('wheelbarrow',796,688),prop('barrel',952,688),prop('crate',952,722),prop('well',1456,472),prop('bench',1888,864),prop('sign',828,236),...trees(1648,128,4,3,120),...trees(96,608,2,3),...trees(1168,944,6,1)],
 water:[[1696,656,320,176]],
 fields:[{x:326,y:201,w:304,h:304,active:true},{x:1088,y:128,w:288,h:288},{x:1088,y:656,w:288,h:192},{x:352,y:656,w:224,h:192}],
 fences:[[1056,96,352,'h'],[1056,384,352,'h'],[1056,624,352,'h'],[1056,864,352,'h'],[320,624,288,'h'],[320,864,288,'h'],[1600,96,512,'h'],[1600,504,512,'h']],
 signs:[{x:764,y:428,label:'Read the farm board',title:'The active field',body:'The 4 by 4 field beside the home lane is ready for tomatoes. Collect 3 starter seeds from the crate beside your house. Other fields are resting.'},{x:1496,y:568,label:'Read orchard sign',title:'The quiet orchard',body:'Young trees, long shadows. Fruit growing is reserved for a later season.'},{x:1088,y:568,label:'Read irrigation note',title:'Water twice each day',body:'Water before 16:00 and again in the evening. Three well-watered nights bring your first harvest.'}],
 extras:[]
};
const city={
 paths:[[32,256,2112,96],[288,288,64,608],[608,288,64,608],[928,160,96,832],[320,576,1728,96],[320,896,1728,64],[1376,288,64,640],[1920,288,64,640]],
 buildings:[prop('house-blue',1104,128,{nameplate:'POST OFFICE'}),prop('house',1504,128,{nameplate:'TEA HOUSE'}),prop('house-blue',1888,128,{nameplate:'LANTERN HOUSE'}),prop('house',1088,736,{nameplate:'RIVER HOME'}),prop('house-blue',1472,736,{nameplate:'WEAPON SHOP / CLOSED'}),prop('house',1888,736,{nameplate:'GARDEN HOME'})],
 props:[prop('fountain0',1104,432,{animated:'fountain'}),prop('bench',1032,544),prop('bench',1248,544),prop('notice',840,484),prop('well',1736,448),prop('barrel',780,164),prop('crate',796,200),prop('crate',1404,768),prop('barrel',2048,772),prop('sign',64,232),...trees(160,624,1,3),...trees(1728,752,1,2),...trees(2016,416,1,2),...trees(416,704,2,2)],
 water:[],fences:[[1088,1024,960,'h'],[1056,64,1056,'h']],
 signs:[{x:1496,y:862,label:'Read closed-shop sign',title:'A shop for another day',body:'WEAPON SHOP - CLOSED. The owner is away. No weapons or combat are available in this peaceful slice.'},{x:864,y:526,label:'Read town directions',title:'Lantern Square',body:'Seeds and produce: west market. Homes: south lane. Fountain and post office: east. Follow the west road back to Farm.'}],
 npcs:[{x:864,y:366,name:'Mira',sprite:'npc0',body:'I take the long way past the fountain each morning. There is always a little colour hiding between the paving stones.'},{x:1296,y:604,name:'Ko',sprite:'npc1',body:'The seed stall is on the west street. Tomatoes like a morning drink and another before bed. That is my whole gardening secret.'},{x:1792,y:930,name:'Nell',sprite:'npc2',body:'This is the quiet end of town. The closed shop can wait. Today, a full basket and a good walk are plenty.'}],
 extras:[]
};
const interior={paths:[],buildings:[],props:[],water:[],fences:[],signs:[],details:[],obstacles:[]};
export const MAPS={home,farm,city};
const footprints={tree:[22,76,20,16],cypress:[10,20,12,12],bush:[6,12,20,14],house:[0,48,160,80],'house-blue':[0,48,160,80],shed:[0,32,96,64],bench:[0,18,64,18],table:[0,8,64,40],well:[2,6,28,26],barrel:[2,2,28,30],crate:[0,0,32,32],fountain0:[4,40,88,48],scarecrow:[26,40,12,38],notice:[4,8,56,38],mailbox:[10,16,12,20],lamp:[12,48,8,14]};
for(const [area,map]of Object.entries(MAPS)){
 map.props.push(...[[720,736],[1344,1000],[2064,96],[2080,960],[1984,384],[592,96]].map(([x,y])=>prop('rock',x,y)));
 map.props.push(...border.map(p=>({...p})));
 const companions=map.props.filter(p=>p.name==='tree').map((p,i)=>prop('tree',p.x+44,p.y+20+(i%3)*8)).filter(p=>!map.paths.some(([x,y,w,h])=>p.x+32>x-44&&p.x+32<x+w+44&&p.y+90>y-44&&p.y+90<y+h+44)&&!(area==='home'&&p.x<640&&p.y<520));map.props.push(...companions);
 // Deterministic decoration avoids the roads, fields and room; decoration has no hitbox.
 map.details=Array.from({length:220},(_,i)=>({x:64+(i*173)%2112,y:64+(i*257)%992,name:i%9===0?'flowers':i%7===0?'mushroom':'grass-detail'})).filter(p=>!map.paths.some(([x,y,w,h])=>p.x>x-32&&p.x<x+w&&p.y>y-32&&p.y<y+h)&&!(area==='home'&&p.x<832&&p.y<544)&&!(area==='farm'&&map.fields.some(f=>p.x>f.x-32&&p.x<f.x+f.w&&p.y>f.y-32&&p.y<f.y+f.h)));
 for(const [x,y,w,dir]of map.fences)for(let n=0;n<w;n+=32)map.props.push(prop(dir==='h'?'fence':'fence-v',x+(dir==='h'?n:0),y+(dir==='v'?n:0),{fence:true}));
 if(area==='city')for(const [x,y]of [[256,352],[704,352],[960,352],[1376,352],[1920,352],[960,672],[1376,672],[1920,672],[352,928]])map.props.push(prop('lamp',x,y));
 for(const tree of map.props.filter(p=>p.name==='tree')){for(let n=0;n<3;n++)map.details.push({name:n===0?'fern':n===1?'flowers'+(Math.floor(tree.x/112)%5+5)%5:'grass-detail',x:tree.x+((n*23+17)%74)-10,y:tree.y+82+n*6});}
 map.details=map.details.filter(p=>!map.water.some(([x,y,w,h])=>p.x>x-16&&p.x<x+w&&p.y>y-16&&p.y<y+h));
 if(area==='home'||area==='farm'){const cx=area==='home'?480:320;const nearEdge=p=>Math.abs(p.x+32-cx)<88&&(area==='home'?p.y>1000:p.y<48);map.props=map.props.filter(p=>!nearEdge(p));map.details=map.details.filter(p=>!nearEdge(p));}
 map.obstacles=[...map.buildings,...map.props].flatMap(p=>{if(p.name.startsWith('house'))return houseSolids(p.x,p.y);const f=footprints[p.name];return f?[[p.x+f[0],p.y+f[1],f[2],f[3]]]:p.fence?[[p.x+8,p.y+12,16,16]]:[]});
 map.obstacles.push(...map.water.flatMap(pondRows));
}
interior.obstacles.push(...ROOM_SOLIDS);
// The two functional stalls are retained at their familiar map coordinates.
city.obstacles.push([270,152,160,80],[560,152,160,80]);

MAPS.interior=interior;
home.details=home.details.filter(p=>!(p.x>380&&p.x<610&&p.y>290&&p.y<555));
farm.obstacles.push([840,232,16,16],[872,232,16,16]);
