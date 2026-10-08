import {EAST_REGIONS,EAST_BOARS} from './forestExpansion.js';
import {dryFootprint,riverRow} from './water.js';
import {growForest,finishForest} from './forestGrowth.js';
import {FOREST_MAP as STARTER,FORAGE_NODES as STARTER_NODES,FOREST_GUIDANCE} from './starterForest.js';
export {FOREST_GUIDANCE};
// Two adjacent 5120-square halves: twice v0.4.8, 40 times the original area.
export const FOREST_SIZE={width:10240,height:5120};
export const LEGACY_FOREST_OFFSET=4096;
export const FOREST_ENTRANCE={x:640,y:4848};
export const BOAR_HOME={x:936,y:4472};
export const BOAR_TERRITORY=[736,4272,400,320];
const names=[
 ['frost','Frost Lake','snow',5,'polarBear'],['highland','Cloud Highlands','highland',4,'gorilla'],['basalt','Basalt Caves','stone',4,'komodo'],['pride','Sunstone Savanna','savanna',5,'lion'],
 ['bamboo','Bamboo Sanctuary','bamboo',2,'panda'],['leopard','Dappled Glade','jungle',4,'leopard'],['tiger','Deepwood Thicket','jungle',5,'tiger'],['cheetah','Windgrass Plain','savanna',4,'cheetah'],
 ['guava','Guava Valley','jungle',2,'chimpanzee'],['rhino','Hornstone Basin','savanna',4,'rhinoceros'],['elephant','Oldgrowth Grove','savanna',4,'elephant'],['herds','Sunlit Meadows','savanna',2,'giraffe'],
 ['jaguar','Emerald Banks','jungle',5,'jaguar'],['wolf','Whispering Pines','pine',3,'wolf'],['hyena','Broken Sun Ruins','stone',3,'hyena'],['brush','Redbrush Reach','savanna',2,'kangaroo'],
 ['entrance','Homewood','wood',1,'boar'],['river','Riverbend Marsh','marsh',4,'crocodile'],['canopy','High Canopy','jungle',1,'monkey'],['snake','Stone Hollow','stone',3,'snake'],
];
export const REGIONS=names.map(([id,name,biome,danger,species],i)=>({id,name,biome,danger,species,x:(i%4)*1280,y:Math.floor(i/4)*1024,w:1280,h:1024})).concat(EAST_REGIONS.map(r=>({...r})));
export function forestRegion(p){return REGIONS.find(r=>p.x>=r.x&&p.x<r.x+r.w&&p.y>=r.y&&p.y<r.y+r.h)||REGIONS[16];}
const prop=(name,x,y,extra={})=>({name,x,y,...extra});
const shift=p=>({...p,y:p.y+LEGACY_FOREST_OFFSET});
const map={size:FOREST_SIZE,paths:STARTER.paths.map(([x,y,w,h])=>[x,y+4096,w,h]),buildings:[],props:STARTER.props.filter(p=>p.y>0&&p.x<1190).map(shift),water:STARTER.water.map(([x,y,w,h])=>[x,y+4096,w,h]),fences:[],signs:STARTER.signs.map(shift),extras:[],details:[],biomes:REGIONS};
// The original entrance remains intact, with two broad onward lanes.
map.paths.push([448,4096,96,496],[832,4576,448,96]);
export const FORAGE_NODES=STARTER_NODES.map(shift);
const foodCycle=['banana','orange','papaya','coconut','dragonFruit','pineapple','mango','guava','wildBerry'];
for(const [i,r]of REGIONS.entries())FORAGE_NODES.push({id:r.id+'-fruit-extra',item:foodCycle[(i+4)%foodCycle.length],x:r.x+608,y:r.y+872});
for(const [i,r] of REGIONS.entries()){
 if(r.id==='entrance')continue;
 const x=r.x,y=r.y;
 // Offset bends and side loops give each region a different travel silhouette.
 const bend=96+(i%3)*64;
 map.paths.push([x,y+672,1280,96],[x+448,y,96,1024],[x+448,y+480,384,80],[x+752,y+480,80,272],[x+bend,y+240,80,480],[x+bend,y+240,432-bend,80]);
 const landmark=r.id==='hyena'?'cp-ruins-brown-gray-3':r.biome==='stone'?'cave-mouth':r.biome==='snow'?'ice-crystal':r.id==='bamboo'?'bamboo-gate':r.id==='hyena'?'ruin-pillar':r.id==='herds'?'camp-tent':r.id==='jaguar'?'cp-ruins-water-3':'shrine-stone';
 map.props.push(prop(landmark,x+250,y+368));
 map.signs.push({type:'dialog',x:x+282,y:y+446,label:'Explore '+r.name,title:r.name,body:r.biome==='snow'?'Cold water and old ice. This is the farthest edge of the woods.':r.biome==='stone'?'A hidden stone chamber. Listen for movement before searching the shadows.':r.id==='jaguar'?'Earth banks overlook the river. Look for quiet groves near the far bank.':'Fruit and animal tracks mark this place. The main crossroads leads homeward to the southwest.'});
 map.props.push(prop('road-sign',x+560,y+774,{text:'HOME',direction:i%4?4:2}));
 map.signs.push({type:'hint',x:x+590,y:y+830,label:'HOME / southwest through Homewood'});
 // Three connected groves; the deepest fruit sits inside each species territory.
 const items=r.biome==='snow'?['wildBerry','orange','dragonFruit']:[foodCycle[i%foodCycle.length],foodCycle[(i+3)%foodCycle.length],foodCycle[(i+6)%foodCycle.length]];
 for(let n=0;n<3;n++){
  const px=x+[384,640,960][n],py=y+[620,536,328][n];
  FORAGE_NODES.push({id:r.id+'-fruit-'+n,item:items[n],x:px,y:py});
  if(n<2)map.props.push(prop(items[n]==='mango'?'mango-tree':items[n]==='guava'?'guava-tree':'tree',px-56,py-120));
 }
 // Native trees frame quiet routes without a repeated grid. Every species clearing stays open.
 for(let n=0;n<(r.biome==='savanna'?44:r.biome==='stone'?32:84);n++){
  const px=x+48+(n*193+i*71)%1172,py=y+48+(n*263+i*43)%904;
  const nearPath=map.paths.some(([a,b,w,h])=>px+32>a-56&&px+32<a+w+56&&py+90>b-56&&py+90<b+h+56);
  const territory=((r.id==='herds'||r.id==='river')&&px+32>x+32&&px+32<x+432&&py+90<y+600)||(px+32>x+660&&py+90<y+570)||(r.biome==='stone'&&px>x+100&&px<x+470&&py<y+450);
  const grove=FORAGE_NODES.some(p=>Math.hypot(p.x-px-32,p.y-py-90)<80);
  if(!nearPath&&!territory&&!grove)map.props.push(prop(n%11===0?'rock':r.biome==='bamboo'?'bamboo-clump':r.biome==='snow'?'snow-pine':r.biome==='savanna'?'acacia-tree':r.biome==='stone'?'rock':'tree',px,py));
 }
 for(let n=0;n<95;n++){
  const px=x+48+(n*173+i*31)%1180,py=y+64+(n*257+i*29)%896;
  if(!map.paths.some(([a,b,w,h])=>px>a-24&&px<a+w+24&&py>b-24&&py<b+h+24))map.details.push(prop(r.biome==='snow'?'snow-grass':r.biome==='savanna'?'dry-grass':n%9===0?'flowers2':n%7===0?'mushroom':'fern',px,py));
 }
}
// Winding, independently scalloped banks share one water/vegetation definition.
export const WATERFALLS=[];
map.falls=WATERFALLS;
map.rivers=[
 {id:'home-river',x:2304,y:0,w:144,h:5120,phase:0,bend:50,detail:12,widen:24,shore:20},
 {id:'west-pool',x:96,y:3112,w:128,h:352,phase:1,bend:20,detail:6,widen:12,shore:8},
 {id:'west-tributary',x:1136,y:896,w:104,h:2304,phase:1.4,bend:32,detail:8,widen:16,shore:12},
 {id:'east-creek',x:5760,y:0,w:128,h:5120,phase:1.8,bend:74,detail:12,widen:32,shore:22},
 {id:'riversong',x:7424,y:0,w:176,h:5120,phase:.7,bend:82,detail:14,widen:36,shore:24},
 {id:'willow-river',x:9088,y:0,w:144,h:5120,phase:2.6,bend:68,detail:12,widen:28,shore:20},
];
export const BRIDGES=[];
for(const r of map.rivers)if(r.h>1000)for(let row=0;row<5;row++){
 const y=row*1024+684;if(y<r.y||y+72>r.y+r.h)continue;
 const w=Math.ceil((r.w+2*(r.bend+r.detail+r.shore*1.35+6)+r.widen+96)/16)*16;
 BRIDGES.push({river:r.id,x:r.x-(w-r.w)/2,y,w,h:72});
}
map.bridges=BRIDGES;
// Local pools, lake and marsh banks remain navigable and visually distinct.
map.water.push([48,96,352,144],[1472,4896,224,144],[2864,288,224,128],[48,3328,224,128],[5248,144,352,224],[6656,3360,320,176],[9600,4576,352,240]);
// The short creek ends in rounded source pools instead of straight-cut caps.
const creek=map.rivers.find(r=>r.id==='west-tributary');
for(const y of [creek.y,creek.y+creek.h-2]){
 const [left,,w]=riverRow(creek,y),pw=Math.ceil((w+64)/2)*2;
 map.water.push([Math.round((left+w/2-pw/2)/2)*2,y-96,pw,192]);
}
map.details=map.details.filter(p=>!map.water.some(([x,y,w,h])=>p.x>x-24&&p.x<x+w&&p.y>y-24&&p.y<y+h));
map.props=map.props.filter(p=>!map.water.some(([x,y,w,h])=>p.x+32>x-8&&p.x+32<x+w+8&&p.y+90>y-8&&p.y+90<y+h+8));
// Widened channels may cover old grove points. Keep their stable IDs/stocks,
// moving just those fruit spots to the nearest clear dry bank within the region.
for(const node of FORAGE_NODES){
 if(dryFootprint(map,{x:node.x-16,y:node.y-24,w:32,h:24}))continue;
 const r=forestRegion(node),oldX=node.x;
 outer:for(let d=16;d<=400;d+=16)for(const sign of [-1,1]){
  const x=oldX+d*sign;
  if(x<r.x+32||x>r.x+r.w-32||!dryFootprint(map,{x:x-16,y:node.y-24,w:32,h:24})||map.props.some(p=>Math.hypot(p.x+32-x,p.y+90-node.y)<56))continue;
  const tree=map.props.find(p=>p.x===oldX-56&&p.y===node.y-120);
  if(tree)tree.x+=x-oldX;
  node.x=x;break outer;
 }
}
// Keep tree trunks and ground vegetation out of flowing channels and fall faces.
const flowing=(x,y,pad=0)=>[...map.rivers,...WATERFALLS].some(r=>x>r.x-28-pad&&x<r.x+r.w+28+pad&&y>r.y-pad&&y<r.y+r.h+pad);
map.props=map.props.filter(p=>!flowing(p.x+32,p.y+76,12));
map.details=map.details.filter(p=>!flowing(p.x+16,p.y+16,16));
// Move the perimeter east; the old seam is now an open forest connection.
for(let n=0;n<Math.ceil(FOREST_SIZE.width/120);n++)for(const y of [-32,5030]){
 const x=n*120-16;if(y>5000&&Math.abs(x+32-640)<100)continue;map.props.push(prop('tree',x,y));
}
for(let n=0;n<44;n++)for(const x of [-44,FOREST_SIZE.width-56])map.props.push(prop('tree',x,n*120));
export const TREASURES=REGIONS.filter(r=>r.danger>=3&&r.id!=='entrance').map((r,i)=>({id:r.id+'-cache',region:r.id,x:r.x+(r.id==='snake'?282:r.x===1280?992:1056),y:r.y+(r.id==='snake'?280:392),coins:120+r.danger*45+i*13,clue:'Look beyond the '+(r.biome==='stone'?'cave mouth':r.biome==='snow'?'frozen lake':'animal tracks')+'.'}));
// Stable region/cache IDs and rewards survive the animal roster change.
for(const r of REGIONS){r.species=r.id==='entrance'||TREASURES.some(t=>t.region===r.id)||EAST_BOARS.some(a=>a.region===r.id)?'boar':'woodland';r.danger=r.species==='boar'?1:0;}
// Curated ruin fragments and colourful animated flora frame off-road landmarks.
for(const r of REGIONS){
 if(r.id==='entrance')continue;
 const variant=r.biome==='snow'?'snow':r.biome==='savanna'?'sand':r.id==='jaguar'||r.id==='river'?'water':'brown-gray';
 map.props.push(prop('cp-ruins-'+variant+'-4',r.x+208,r.y+176));
 map.details.push(prop('cp-ruins-'+variant+'-5',r.x+344,r.y+520));
 if(['jungle','bamboo','marsh'].includes(r.biome))map.props.push(prop('cp-plant-'+(1+REGIONS.indexOf(r)%3)+'-0',r.x+320,r.y+824,{animated:'plant'}));
}
growForest(map,REGIONS,FORAGE_NODES,TREASURES);
finishForest(map,REGIONS);
export const FOREST_MAP=map;
