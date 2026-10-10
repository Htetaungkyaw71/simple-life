import {FOREST_PORTAL,addDarkLandmarks} from './forestLandmarks.js';
import {FOREST_RIVERS,FOREST_BRIDGES} from './forestRivers.js';
import {forestHabitat} from './forestHabitats.js';
import {addForestTerrain} from './forestTerrain.js';
import {WOODLAND_WILDLIFE} from './woodlandWildlife.js';
import {EAST_REGIONS,EAST_BOARS} from './forestExpansion.js';
import {dryFootprint,riverRow} from './water.js';
import {growForest,finishForest} from './forestGrowth.js';
import {FOREST_MAP as STARTER,FORAGE_NODES as STARTER_NODES,FOREST_GUIDANCE} from './starterForest.js';
import {FOREST_SIZE,FOREST_ENTRANCE,FOREST_APPROACHES} from './forestBounds.js';
export {FOREST_GUIDANCE};
export {FOREST_SIZE,FOREST_ENTRANCE} from './forestBounds.js';
// Two adjacent 5120-square halves: twice v0.4.8, 40 times the original area.
export const LEGACY_FOREST_OFFSET=4096;
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
// Keep the old Homewood routes; the active entrance is now at the full map's centre.
map.paths.push([448,4096,96,496],[832,4576,448,96]);
map.paths.push(...FOREST_APPROACHES);
map.props=map.props.filter(p=>!(p.name==='road-sign'&&p.text==='HOME'));
map.signs=map.signs.filter(p=>!p.label.startsWith('HOME /'));
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
 map.signs.push({type:'dialog',x:x+282,y:y+446,label:'Explore '+r.name,title:r.name,body:r.biome==='snow'?'Cold water and old ice. This is the farthest edge of the woods.':r.biome==='stone'?'A hidden stone chamber. Listen for movement before searching the shadows.':r.id==='jaguar'?'Natural shores follow the river. Look for quiet groves near the far bank.':'Fruit and animal tracks mark this place. The Forest exit is at the bottom centre of the map.'});
 map.props.push(prop('road-sign',x+560,y+774,{text:'HOME',direction:x+590<FOREST_ENTRANCE.x-128?0:x+590>FOREST_ENTRANCE.x+128?4:2}));
 map.signs.push({type:'hint',x:x+590,y:y+830,label:'HOME / bottom centre of the Forest map'});
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
map.rivers=FOREST_RIVERS;
export const BRIDGES=FOREST_BRIDGES;
map.bridges=BRIDGES;
// Local pools, lake and marsh banks remain navigable and visually distinct.
map.water.push([48,96,352,144],[1472,4896,224,144],[2864,288,224,128],[48,3328,224,128],[5248,144,352,224],[6656,3360,320,176],[9600,4576,352,240]);
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
// Move the perimeter east; the old seam is now an open forest connection.
for(let n=0;n<Math.ceil(FOREST_SIZE.width/120);n++)for(const y of [-32,5030]){
 const x=n*120-16;if(y>5000&&Math.abs(x+32-FOREST_ENTRANCE.x)<156)continue;map.props.push(prop('tree',x,y));
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
// Add fruit along the already open grassy crossways; all earlier IDs stay intact.
for(const [i,r]of REGIONS.entries())for(let n=0;n<4;n++){
 const node={id:r.id+'-grove-fruit-'+n,item:foodCycle[(i+n*2)%foodCycle.length],x:r.x+400+n*112,y:r.y+694+(n%2)*32};
 if(!dryFootprint(map,{x:node.x-16,y:node.y-24,w:32,h:24})){
  const old=node.x;
  outer:for(let d=16;d<=480;d+=16)for(const sign of [-1,1]){const x=old+sign*d;if(x<r.x+48||x>r.x+r.w-48||!dryFootprint(map,{x:x-16,y:node.y-24,w:32,h:24}))continue;node.x=x;break outer;}
 }
 FORAGE_NODES.push(node);
}
for(const animal of WOODLAND_WILDLIFE){
 if(dryFootprint(map,{x:animal.x-16,y:animal.y-24,w:32,h:32}))continue;
 const old=animal.x,r=forestRegion(animal);
 outer:for(let d=16;d<=480;d+=16)for(const sign of [-1,1]){const x=old+sign*d;if(x<r.x+48||x>r.x+r.w-48||!dryFootprint(map,{x:x-16,y:animal.y-24,w:32,h:32}))continue;animal.x=x;break outer;}
}
// A modest thinning opens sightlines while preserving remaining cut-tree IDs.
const places=[...FORAGE_NODES,...WOODLAND_WILDLIFE.slice(48)];
map.props=map.props.filter(p=>{
 if(!(p.name==='tree'||p.name==='snow-pine'||p.name.endsWith('-tree')))return true;
 if(p.x<0||p.y<0||p.x>FOREST_SIZE.width-80||p.y>FOREST_SIZE.height-140)return true;
 const h=(Math.imul(Math.round(p.x),374761393)^Math.imul(Math.round(p.y),668265263))>>>0;
 const habitat=forestHabitat({x:p.x+32,y:p.y+90}).id,opening=Math.sin(p.x/377)*.45+Math.sin(p.y/283)*.35+Math.sin((p.x+p.y)/631)*.2;
 const limit={meadow:.25,shrubland:.40,desert:-.15}[habitat];
 return (limit===undefined?h%100>=2:opening<limit)&&!places.some(n=>Math.hypot(n.x-p.x-32,n.y-p.y-90)<32);
});
for(const g of map.grass){const habitat=forestHabitat(g).id;g.snow=habitat==='snow';g.dry=habitat==='desert'||habitat==='shrubland';}
map.habitats=true;
const protectedPlaces=[...FORAGE_NODES,...TREASURES,...WOODLAND_WILDLIFE,...EAST_BOARS.map(a=>a.home),BOAR_HOME,{x:1008,y:4432},FOREST_ENTRANCE,FOREST_PORTAL];
addForestTerrain(map,REGIONS,protectedPlaces,[BOAR_TERRITORY,...FOREST_APPROACHES]);
addDarkLandmarks(map,protectedPlaces);
// Landing rails and dry approaches must be free of every scenery footprint.
map.props=map.props.filter(p=>!BRIDGES.some(b=>p.x+128>b.x-24&&p.x-16<b.x+b.w+24&&p.y+128>b.y-24&&p.y<b.y+b.h+24));
// Clear the return gate approach; surviving saved tree identities stay intact.
map.props=map.props.filter(p=>{
 const x=p.x+32,y=p.y+90,tree=p.name==='tree'||p.name==='snow-pine'||p.name.endsWith('-tree');
 // Clear the whole canopy silhouette, including trees rooted below the gate.
 const coversRing=tree&&x+96>FOREST_PORTAL.x-112&&x-96<FOREST_PORTAL.x+112&&y>FOREST_PORTAL.y-140&&y-256<FOREST_PORTAL.y+120;
 return !coversRing&&Math.hypot(x-FOREST_PORTAL.x,y-FOREST_PORTAL.y)>FOREST_PORTAL.clearing;
});
map.grass=map.grass.filter(p=>Math.hypot(p.x-FOREST_PORTAL.x,p.y-FOREST_PORTAL.y)>FOREST_PORTAL.clearing);
map.ledges=map.ledges.filter(l=>Math.hypot(l.x+16-FOREST_PORTAL.x,l.y+16-FOREST_PORTAL.y)>FOREST_PORTAL.clearing);
for(const b of map.terraces)b.segments=b.segments.filter(l=>map.ledges.includes(l));
// Clear complete canopy silhouettes and other scenery from the centre-bottom gate.
const inApproach=(x,y,pad=0)=>FOREST_APPROACHES.some(([a,b,w,h])=>x+pad>a&&x-pad<a+w&&y>b&&y-pad<b+h);
map.props=map.props.filter(p=>!inApproach(p.x+32,p.y+90,p.name==='tree'||p.name==='snow-pine'||p.name.endsWith('-tree')?96:48));
map.grass=map.grass.filter(p=>!inApproach(p.x,p.y,24));
map.details=map.details.filter(p=>!inApproach(p.x+16,p.y+32,32));
map.props.push(prop('road-sign',FOREST_ENTRANCE.x-160,4944,{text:'HOME',direction:2}));
map.signs.push({type:'hint',x:FOREST_ENTRANCE.x-128,y:5008,label:'HOME / leave through the opening south'});
export const FOREST_MAP=map;
