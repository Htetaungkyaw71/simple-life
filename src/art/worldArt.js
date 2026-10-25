import {PROP_ART,propFrame,propScale,propTexture,propArtInfo} from '../data/propArt.js';
import {propImage} from './PropArt.js';
import {drawDecorationArt} from './DecorationArt.js';
import {groundShadow} from './GroundShadow.js';
import {worldText} from '../i18n/myanmarText.js';
import {forestHabitat} from '../data/forestHabitats.js';
import {drawCityBridge} from './cityBridge.js';
import {VEGETATION,removed,isTree} from '../data/vegetation.js';
import {drawFarmBeds} from './FarmView.js';
import {BRIDGES} from '../data/forest.js';
import {shopOpen} from '../systems/market.js';
import {FIELDS} from '../data/farms.js';
import {ownedField} from '../systems/expansion.js';
import {CROPS} from '../data/crops.js';
import {cropVisual} from '../systems/watering.js';
import {ROOM,FURNITURE,roomArtSize,roomFloorPiece} from '../data/interior.js';
import {HOME_INTERIOR_ART} from '../data/homeInteriorArt.js';
import {MAPS} from '../data/mapLayouts.js';
import {terrain} from './Terrain.js';
import {forestTexture} from './forestPalette.js';
import {treeVisual,groundPlantVisual} from './treeVisual.js';
import {drawBridge} from './BridgeView.js';
import {drawSettlement,settlementCovers} from './SettlementView.js';
import {drawHomeRoom,drawHomeWorldArt} from './HomeArt.js';
import {homeWorldPlacement} from '../data/homes.js';
import {drawOutdoorFences} from './OutdoorFenceView.js';
import {SHOP_ROOMS} from '../data/cityShops.js';
import {isIndoorArea} from '../data/areas.js';
import {drawCityShopRoom} from './CityShopRoom.js';
import {CITY_FOUNTAIN_ISLAND} from '../data/cityFountainIsland.js';
import {createGrassCluster} from './grassClumps.js';
const SCALE=2;
const TOUCH_GRASS_NAMES=new Set(['grass-detail','dry-grass','snow-grass']);
const registerTouchGrass=(scene,p,node,sprite)=>{if(TOUCH_GRASS_NAMES.has(p.name))scene.touchGrass.push({id:node?.id??`${p.name}:${p.x}:${p.y}`,x:node?.x??p.x+16,y:node?.y??p.y+32,sprite,bend:0});return sprite;};
const clusteredGrass=(scene,p,node)=>{const cluster=createGrassCluster(scene,{id:node.id,x:node.x,y:node.y,variant:node.variant||0}),sprite=cluster.sprites.at(-1);scene.touchGrass.push({id:node.id,x:node.x,y:node.y,sprite,cluster,bend:0});scene.vegetationVisuals.set(node.id,cluster.all);return sprite;};
const landscapeImage=(scene,a)=>{const frame=propFrame(a.frame),texture=propTexture(a.frame)||'town',art=propArtInfo(a.frame),scale=art&&frame===a.frame?a.scale:propScale(a.frame,a.scale);if(!art)return scene.add.image(a.x,a.y,texture,frame).setOrigin(0).setScale(scale).setDepth(a.foot[1]);const [l,,r,b]=art.visibleBounds;return scene.add.image(a.foot[0]-(l+r)*scale/2,a.foot[1]-b*scale,texture,frame).setOrigin(0).setScale(scale).setDepth(a.foot[1]);};
const footImage=(scene,frame,x,y,originX,scale,depth)=>{const resolved=propFrame(frame),texture=propTexture(frame)||'town',art=propArtInfo(frame),actual=art&&resolved===frame?scale:propScale(frame,scale);if(!art)return scene.add.image(x,y,texture,resolved).setOrigin(originX,1).setScale(actual).setDepth(depth);const [l,,r,b]=art.visibleBounds;return scene.add.image(x-(l+r)*actual/2,y-b*actual,texture,resolved).setOrigin(0).setScale(actual).setDepth(depth);};
export function image(scene,name,x,y,depth=0){if(name==='city-fountain0')return scene.add.sprite(Math.round(x),Math.round(y),CITY_FOUNTAIN_ISLAND.texture,0).setOrigin(0).setScale(CITY_FOUNTAIN_ISLAND.scale).setDepth(depth);if(name==='planter')return drawDecorationArt(scene,null,'planter','down',x,y,scene.artScale||SCALE,depth);if(name==='fern')return scene.add.image(Math.round(x),Math.round(y),forestTexture(scene,name)).setOrigin(0).setScale(scene.artScale||SCALE).setDepth(depth);return propImage(scene,name,x,y,scene.artScale||SCALE,depth);}
function tiled(scene,name,x,y,w,h,depth=0){const atlas=scene.textures.get('town').has(name)?'town':'world';return scene.add.tileSprite(x,y,w,h,atlas,name).setOrigin(0).setTileScale(scene.artScale||SCALE).setDepth(depth);}
function label(scene,x,y,value){return worldText(scene,x,y,value,6).setScale(2).setOrigin(.5,0).setTint(0xffefd0).setDropShadow(1,1,0x34344f,1).setDepth(y+3);}
function object(scene,p){
 if(scene.worldArea==='home'&&p===MAPS.home.buildings[0]&&scene.app.state?.home?.design!=='starter'){
  const placement=homeWorldPlacement(scene.app.state.home.design,p);
  groundShadow(scene,placement.x+placement.art.width*placement.scale/2,placement.depth-3,placement.art.width*placement.scale*.68,14,.18);
  return drawHomeWorldArt(scene,p,scene.app.state.home.design);
 }
 if(p.rocky)return image(scene,p.name,p.x,p.y,p.foot);
 const node=VEGETATION[scene.worldArea].byProp.get(p);if(node&&removed(scene.app.state,node.id))return;
 if(node&&TOUCH_GRASS_NAMES.has(p.name))return clusteredGrass(scene,p,node);
 const visuals=[];const record=sprite=>{if(node){visuals.push(sprite);scene.vegetationVisuals.set(node.id,[...(scene.vegetationVisuals.get(node.id)||[]),...visuals]);}return sprite;};
 if(p.landscapeVisual)return record(landscapeImage(scene,p.landscapeVisual));
 const cover=groundPlantVisual(p);if(cover){const x=node?.x??p.x+16,y=node?.y??p.y+32;return record(footImage(scene,cover.frame,x,y,cover.originX,2,y));}
 if(p.artFrame){
  const frame=propFrame(p.artFrame),texture=p.artTexture||propTexture(p.artFrame)||'town',f=scene.textures.getFrame(texture,frame),direct=!!propArtInfo(p.artFrame)&&frame===p.artFrame,scale=p.artTexture||direct?p.artScale||SCALE:propScale(p.artFrame,p.artScale||SCALE),w=f.width*scale,h=f.height*scale;
  if(!p.noShadow)groundShadow(scene,p.x+w/2,p.y+h-3,w*.75,8,.18);
  return scene.add.image(p.x,p.y,texture,frame).setOrigin(0).setScale(scale).setDepth(p.artDepth??p.y+h);
 }
 if(isTree(p)){
  const habitat=scene.worldArea==='forest'?forestHabitat({x:p.x+32,y:p.y+90}).id:'';
  const visual=treeVisual(p,habitat),art=propArtInfo(visual.frame),frame=scene.textures.getFrame('town',visual.frame),foot=p.y+90,cx=p.x+32;
  const obj=art?footImage(scene,visual.frame,cx,foot,visual.originX,2,foot):scene.add.image(cx,foot,forestTexture(scene,visual.frame,habitat)).setOrigin(visual.originX,1).setScale(2).setDepth(foot);
  visuals.push(groundShadow(scene,cx,foot-3,48,12));
  const scale=art?propScale(visual.frame,2):2,[l,t,r,b]=art?.visibleBounds??[0,0,frame.width,frame.height];
  scene.canopies.push({sprite:obj,x:cx,y:foot,baseX:cx,width:(r-l)*scale,height:(b-t)*scale,frame:visual.frame});
  return record(obj);
 }
 if(['forest','city'].includes(scene.worldArea)&&['rock','ice-crystal'].includes(p.name)){
  const name=p.name==='rock'?'env-boulder':'env-ice',foot=p.y+(p.name==='rock'?64:104),cx=p.x+32;
  visuals.push(groundShadow(scene,cx,foot-3,40,12));
  return record(scene.add.image(cx,foot,'town',propFrame(name)).setOrigin(.5,1).setScale(propScale(name,1)).setDepth(foot));
 }

 let name=p.name;
 if(name==='tree')name=['tree0','tree1','tree2','tree3','tree-tall'][Math.abs(Math.floor(p.x/32+p.y/32))%5];
 const height=scene.textures.getFrame(scene.textures.get('town').has(name)?'town':'world',name).height*2;
 const foot=p.animated==='fountain'?Math.round(p.y+CITY_FOUNTAIN_ISLAND.visibleBounds[3]*CITY_FOUNTAIN_ISLAND.scale):p.y+((name.startsWith('tree')||name.endsWith('-tree')||name==='snow-pine')?90:name==='house-village-0'?258:name.startsWith('house-village')?172:name.startsWith('house')?110:name==='shed'?124:height);
 if(name==='shed'){const g=scene.add.graphics().setDepth(1);g.fillStyle(0x343a2a,.22);g.fillPoints([{x:p.x+28,y:foot-16},{x:p.x+212,y:foot-16},{x:p.x+246,y:foot+12},{x:p.x+54,y:foot+12}],true);}
 if(!p.fence&&!p.noShadow){
  const tree=name.startsWith('tree')||name.endsWith('-tree')||name==='snow-pine',house=name.startsWith('house-village');
  const cx=tree?p.x+32:house?p.x+scene.textures.getFrame('town',name).width:PROP_ART[name]?p.x+scene.textures.getFrame(propTexture(name)||'town',propFrame(name)).width*propScale(name):p.x+height*.28;
  visuals.push(groundShadow(scene,cx,foot-3,tree?64:house?Math.min(240,scene.textures.getFrame('town',name).width*1.5):Math.min(100,height*.72),tree?16:12,.18));
 }
 const forestPlant=scene.app.state?.area==='forest'&&(name.startsWith('tree')||name.endsWith('-tree')||name==='bamboo-clump'||name.startsWith('forest-palmetto-'));
 const obj=forestPlant?scene.add.image(p.x,p.y,forestTexture(scene,name,forestHabitat({x:p.x+32,y:p.y+90}).id)).setOrigin(0).setScale(2).setDepth(foot):image(scene,name,p.x,p.y,foot);
 if(TOUCH_GRASS_NAMES.has(p.name))registerTouchGrass(scene,p,node,obj);
 if(name.startsWith('tree')||name.endsWith('-tree')||name==='snow-pine')scene.canopies.push({sprite:obj,x:p.x+32,y:p.y+90,frame:name});
 if(p.animated==='fountain')scene.fountains.push({sprite:obj,prefix:name.slice(0,-1),frames:CITY_FOUNTAIN_ISLAND.frames,fps:CITY_FOUNTAIN_ISLAND.fps});
 if(p.animated==='plant')scene.plants.push({sprite:obj,prefix:name.slice(0,-1)});
 if(p.nameplate)label(scene,p.x+80,p.y+136,p.nameplate);
 return record(obj);
}
export function drawWorld(scene,area){
 scene.worldArea=area;scene.vegetationVisuals=new Map();scene.touchGrass=[];scene.roadSigns=[];scene.merchants=[];scene.shopLabels=[];scene.farmSigns=[];scene.artScale=2;const map=MAPS[area];scene.water=[];scene.fountains=[];scene.plants=[];scene.canopies=[];scene.doors=[];scene.bridgeRails=[];
 if(!isIndoorArea(area))terrain(scene,area,map);
 for(const p of map.details){
  const [plantX,plantY]=p.landscapeVisual?.foot??[p.x+16,p.y+32];
  if(settlementCovers(scene.app.state,area,plantX,plantY))continue;
  const node=VEGETATION[area].byProp.get(p);if(node&&removed(scene.app.state,node.id))continue;
  if(node&&TOUCH_GRASS_NAMES.has(p.name)){clusteredGrass(scene,p,node);continue;}
  if(p.landscapeVisual){const sprite=landscapeImage(scene,p.landscapeVisual);if(node)scene.vegetationVisuals.set(node.id,[sprite]);continue;}
  const cover=groundPlantVisual(p);if(cover){const x=node?.x??p.x+16,y=node?.y??p.y+32,sprite=footImage(scene,cover.frame,x,y,cover.originX,2,y);if(node)scene.vegetationVisuals.set(node.id,[sprite]);continue;}
  if(area==='forest'&&p.name==='dry-grass'&&Math.floor(p.x+p.y)%5===0){
   const sprite=scene.add.image(p.x+16,p.y+32,'town',Math.floor(p.x)%2?'env-agave':'env-dry-plant').setOrigin(.5,1).setScale(1).setDepth(p.y+32);if(node)scene.vegetationVisuals.set(node.id,[sprite]);
  }else {const upright=node&&!TOUCH_GRASS_NAMES.has(p.name);const sprite=image(scene,p.name,p.x,p.y,upright?node.y:0);registerTouchGrass(scene,p,node,sprite);if(node)scene.vegetationVisuals.set(node.id,[sprite]);}
 }
 if(area==='interior'){
  const w=ROOM.width,h=ROOM.height;
  scene.add.rectangle(-1024,-1024,3072,3072,0x32221e).setOrigin(0).setDepth(-1);
  drawHomeRoom(scene,scene.app.state);
  const fireplace=FURNITURE.find(([name])=>name==='home-fireplace');
  const fireplaceDepth=fireplace?fireplace[2]+roomArtSize('home-fireplace').h:0;
  for(const [name,x,y]of FURNITURE){
   const art=HOME_INTERIOR_ART[name],depth=roomFloorPiece(name)?1:y+roomArtSize(name).h;
   // The approved flame is a separate transparent source, so keep it just
   // above the opaque fireplace opening while floor pieces stay below actors.
   const displayDepth=name==='home-fire'?fireplaceDepth+.01:depth;
   scene.add.image(x,y,art.texture||'homeInterior',art.frame).setName('interior:'+name).setOrigin(0).setScale(art.scale).setDepth(displayDepth);
  }
 }else if(SHOP_ROOMS[area]){drawCityShopRoom(scene,area);
 }else if(area==='home'){
  label(scene,544,554,'STARTER SEEDS');const arrow=scene.add.graphics().setDepth(1);arrow.fillStyle(0xffe4a3,.8);arrow.fillRect(478,1090,4,12);arrow.fillRect(474,1098,12,4);arrow.fillRect(476,1102,8,2);arrow.fillRect(478,1104,4,2);image(scene,'post',416,1104,1136);image(scene,'post',528,1104,1136);
 }else if(area==='city'){
  for(const b of map.bridges)drawCityBridge(scene,b);
  for(const [cx,kind,name]of [[432,'seed','SEEDS'],[896,'sell','PRODUCE']]){
   const t=label(scene,cx,kind==='outfitter'?610:178,name);t.setDepth(1001);scene.shopLabels.push({text:t,kind,name});
  }
  const aid=map.signs.find(s=>s.type==='aid');if(aid)label(scene,aid.x,aid.y+18,'SEED AID');
 }

 if(area==='forest')for(const b of BRIDGES)drawBridge(scene,b);
 drawOutdoorFences(scene,map.props);
 for(const p of [...map.buildings,...map.props])if(!p.fence)object(scene,p);
 drawSettlement(scene,area);

 // Route-sign sprites are intentionally absent in every area. Existing
 // landmark and board interactions remain available through their own art.
}
export function drawPlots(scene,plots,group){drawFarmBeds(scene,group);}
