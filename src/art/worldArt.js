import {forestHabitat} from '../data/forestHabitats.js';
import {drawCityBridge} from './cityBridge.js';
import {VEGETATION,removed} from '../data/vegetation.js';
import {drawFarmBeds} from './FarmView.js';
import {BRIDGES} from '../data/forest.js';
import {shopOpen} from '../systems/market.js';
import {pixelArrow} from '../ui/statusArt.js';
import {FIELDS} from '../data/farms.js';
import {ownedField} from '../systems/expansion.js';
import {CROPS} from '../data/crops.js';
import {cropVisual,waterPeriod} from '../systems/watering.js';
import {ROOM,FURNITURE} from '../data/interior.js';
import {MAPS} from '../data/mapLayouts.js';
import {terrain} from './Terrain.js';
import {forestTexture} from './forestPalette.js';
import {drawBridge} from './BridgeView.js';
const SCALE=2;
export function image(scene,name,x,y,depth=0){const atlas=scene.textures.get('town').has(name)?'town':'world';return scene.add.image(Math.round(x),Math.round(y),atlas,name).setOrigin(0).setScale(scene.artScale||SCALE).setDepth(depth);}
function tiled(scene,name,x,y,w,h,depth=0){const atlas=scene.textures.get('town').has(name)?'town':'world';return scene.add.tileSprite(x,y,w,h,atlas,name).setOrigin(0).setTileScale(scene.artScale||SCALE).setDepth(depth);}
function label(scene,x,y,value){return scene.add.bitmapText(x,y,'pixel',value,6).setScale(2).setOrigin(.5,0).setTint(0xffefd0).setDropShadow(1,1,0x34344f,1).setDepth(y+3);}
function object(scene,p){
 if(p.rocky)return image(scene,p.name,p.x,p.y,p.foot);
 const node=VEGETATION[scene.worldArea].byProp.get(p);if(node&&removed(scene.app.state,node.id))return;
 const visuals=[];const record=sprite=>{if(node){visuals.push(sprite);scene.vegetationVisuals.set(node.id,[...(scene.vegetationVisuals.get(node.id)||[]),...visuals]);}return sprite;};
 if(p.name==='road-sign')return roadSign(scene,p);
 if(p.name==='farm-sign')return farmSign(scene,p);
 if(['forest','city'].includes(scene.app.state?.area)){
  const tree=['tree','snow-pine','palm-tree','willow-tree','broadleaf-tree'].includes(p.name),variant=Math.abs(Math.floor(p.x/32+p.y/32));
  const habitat=scene.worldArea==='forest'?forestHabitat({x:p.x+32,y:p.y+90}).id:'';
  const replacement=tree?(habitat==='snow'?'env-pine-snow':(p.name==='palm-tree'?'forest-palm-'+variant%2:p.name==='willow-tree'?p.name:p.name==='broadleaf-tree'?'forest-oak-'+variant%3:p.name==='snow-pine'?'env-pine-olive':(variant%5===0?'env-pine-olive':'forest-oak-'+variant%3))):p.name==='rock'?'env-boulder':p.name==='ice-crystal'?'env-ice':null;
  if(replacement){
   const frame=scene.textures.getFrame('town',replacement),scale=tree?2:1;
   const foot=p.y+(tree?90:p.name==='rock'?64:104),cx=p.x+32;
   const obj=scene.add.image(cx,foot,tree?forestTexture(scene,replacement,habitat):'town',tree?undefined:replacement).setOrigin(.5,1).setScale(scale).setDepth(foot);
   visuals.push(scene.add.ellipse(cx,foot-3,tree?48:40,12,0x38422b,.22).setDepth(1));
   if(tree)scene.canopies.push({sprite:obj,x:cx,y:foot,baseX:cx,width:frame.width*scale,height:frame.height*scale,frame:replacement});
   return record(obj);
  }
 }
 let name=p.name;
 if(name==='tree')name=['tree0','tree1','tree2','tree3','tree-tall'][Math.abs(Math.floor(p.x/32+p.y/32))%5];
 const height=scene.textures.getFrame(scene.textures.get('town').has(name)?'town':'world',name).height*2;
 const foot=p.y+((name.startsWith('tree')||name.endsWith('-tree')||name==='snow-pine')?90:name.startsWith('house-village')?172:name.startsWith('house')?110:name==='shed'?124:height);
 if(name.startsWith('house-village')||name==='shed'){const g=scene.add.graphics().setDepth(1);g.fillStyle(0x343a2a,.22);g.fillPoints([{x:p.x+28,y:foot-16},{x:p.x+212,y:foot-16},{x:p.x+246,y:foot+12},{x:p.x+54,y:foot+12}],true);}
 if(!p.fence){const shadow=scene.add.ellipse(p.x+height*.28,p.y+height-5,Math.min(100,height*.72),12,0x253951,.18).setDepth(1);if(name.startsWith('tree'))shadow.setPosition(p.x+34,p.y+88).setSize(78,24);visuals.push(shadow);}
 const forestPlant=scene.app.state?.area==='forest'&&(name.startsWith('tree')||name.endsWith('-tree')||name==='bamboo-clump'||name.startsWith('forest-palmetto-'));
 const obj=forestPlant?scene.add.image(p.x,p.y,forestTexture(scene,name,forestHabitat({x:p.x+32,y:p.y+90}).id)).setOrigin(0).setScale(2).setDepth(foot):image(scene,name,p.x,p.y,foot);
 if(name.startsWith('tree')||name.endsWith('-tree')||name==='snow-pine')scene.canopies.push({sprite:obj,x:p.x+32,y:p.y+90,frame:name});
 if(p.animated==='fountain')scene.fountains.push({sprite:obj,prefix:name.slice(0,-1)});
 if(p.animated==='plant')scene.plants.push({sprite:obj,prefix:name.slice(0,-1)});
 if(p.nameplate)label(scene,p.x+80,p.y+136,p.nameplate);
 return record(obj);
}
function farmSign(scene,p){
 const g=scene.add.graphics().setPosition(p.x,p.y).setScale(2).setDepth(p.y+64);
 g.fillStyle(0x544249);g.fillRect(9,19,6,13);g.fillStyle(0xa8794e);g.fillRect(10,20,4,12);
 g.fillStyle(0x544249);g.fillRect(0,0,24,23);g.fillStyle(0xa8794e);g.fillRect(1,1,22,21);g.fillStyle(0xd6ad73);g.fillRect(2,2,20,2);g.fillRect(2,20,20,1);
 pixelArrow(g,2,12,15,0xffedcc);const t=scene.add.bitmapText(p.x+24,p.y+8,'pixel','FARM',6).setOrigin(.5,0).setScale(2).setTint(0xffedcc).setDepth(p.y+65);scene.farmSigns.push({board:{x:p.x+4,y:p.y+4,w:40,h:38},text:t});return g;
}
function roadSign(scene,p){
 const g=scene.add.graphics().setPosition(p.x,p.y).setScale(2).setDepth(p.y+64);
 g.fillStyle(0x544249).fillRect(13,19,6,13);g.fillStyle(0xa8794e).fillRect(14,20,4,12);
 g.fillStyle(0x544249).fillRect(0,0,32,23);g.fillStyle(0xa8794e).fillRect(1,1,30,21);g.fillStyle(0xd6ad73).fillRect(2,2,28,2).fillRect(2,20,28,1);
 pixelArrow(g,p.direction,p.direction===4?6:p.direction===6||p.direction===2?16:26,p.direction===6||p.direction===2?15:11,0xffedcc);
 const t=scene.add.bitmapText(p.x+(p.direction===4?22:7),p.y+(p.direction===6||p.direction===2?6:16),'pixel',p.text,p.text==='FOREST'?5:6).setScale(2).setTint(0xffedcc).setDepth(p.y+65);scene.roadSigns.push({board:{x:p.x+4,y:p.y+4,w:56,h:38},text:t});
 return g;
}
export function drawWorld(scene,area){
 scene.worldArea=area;scene.vegetationVisuals=new Map();scene.roadSigns=[];scene.merchants=[];scene.shopLabels=[];scene.farmSigns=[];scene.artScale=2;const map=MAPS[area];scene.water=[];scene.fountains=[];scene.plants=[];scene.canopies=[];scene.doors=[];
 if(area!=='interior')terrain(scene,area,map);
 for(const p of map.details){
  const node=VEGETATION[area].byProp.get(p);if(node&&removed(scene.app.state,node.id))continue;
  if(area==='forest'&&p.name==='dry-grass'&&Math.floor(p.x+p.y)%5===0){
   const sprite=scene.add.image(p.x+16,p.y+32,'town',Math.floor(p.x)%2?'env-agave':'env-dry-plant').setOrigin(.5,1).setScale(1).setDepth(0);if(node)scene.vegetationVisuals.set(node.id,[sprite]);
  }else {const sprite=image(scene,p.name,p.x,p.y,0);if(node)scene.vegetationVisuals.set(node.id,[sprite]);}
 }
 if(area==='interior'){
  const w=ROOM.width,h=ROOM.height;
  tiled(scene,'wall',-1024,-1024,3072,3072,-1);tiled(scene,'floor0',0,0,w,h,0);
  tiled(scene,'wall',0,0,w,48,48);tiled(scene,'wall',0,48,16,h-48,h);tiled(scene,'wall',w-16,48,16,h-48,h);
  tiled(scene,'wall',0,h-32,w/2-24,32,h);tiled(scene,'wall',w/2+24,h-32,w/2-24,32,h);
  for(const [name,x,y]of FURNITURE)image(scene,name,x,y,name==='rug'?1:y+scene.textures.getFrame('town',name).height*2);
  scene.doors.push(image(scene,'door0',w/2-16,h-64,h));
 }else if(area==='home'){
  label(scene,544,554,'STARTER SEEDS');const arrow=scene.add.graphics().setDepth(1);arrow.fillStyle(0xffe4a3,.8);arrow.fillRect(478,1090,4,12);arrow.fillRect(474,1098,12,4);arrow.fillRect(476,1102,8,2);arrow.fillRect(478,1104,4,2);image(scene,'post',416,1104,1136);image(scene,'post',528,1104,1136);
 }else if(area==='farm'){
  image(scene,'fence',832,220,252);image(scene,'fence',864,220,252);
 }else if(area==='city'){
  for(const b of map.bridges)drawCityBridge(scene,b);
  for(const [cx,kind,name]of [[432,'seed','SEEDS'],[896,'sell','PRODUCE'],[336,'outfitter','OUTFITTER']]){
   const t=label(scene,cx,kind==='outfitter'?610:178,name);t.setDepth(1001);scene.shopLabels.push({text:t,kind,name});
  }
  label(scene,1080,626,'SEED AID');
 }

 if(area==='forest')for(const b of BRIDGES)drawBridge(scene,b);
 for(const p of [...map.buildings,...map.props])object(scene,p);

 for(const sign of map.signs)if(sign.type!=='aid'&&!map.props.some(p=>Math.hypot(p.x-sign.x,p.y-sign.y)<70))image(scene,'sign',sign.x-16,sign.y-40,sign.y);
}
export function drawPlots(scene,plots,group){drawFarmBeds(scene,group);}
