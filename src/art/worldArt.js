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
const SCALE=2;
export function image(scene,name,x,y,depth=0){const atlas=scene.textures.get('town').has(name)?'town':'world';return scene.add.image(Math.round(x),Math.round(y),atlas,name).setOrigin(0).setScale(scene.artScale||SCALE).setDepth(depth);}
function tiled(scene,name,x,y,w,h,depth=0){const atlas=scene.textures.get('town').has(name)?'town':'world';return scene.add.tileSprite(x,y,w,h,atlas,name).setOrigin(0).setTileScale(scene.artScale||SCALE).setDepth(depth);}
function label(scene,x,y,value){return scene.add.bitmapText(x,y,'pixel',value,6).setScale(2).setOrigin(.5,0).setTint(0xffefd0).setDropShadow(1,1,0x34344f,1).setDepth(y+3);}
function object(scene,p){
 if(p.name==='road-sign')return roadSign(scene,p);
 if(p.name==='farm-sign')return farmSign(scene,p);
 if(scene.app.state?.area==='forest'){
  const tree=['tree','snow-pine','palm-tree','willow-tree','broadleaf-tree'].includes(p.name),variant=Math.abs(Math.floor(p.x/32+p.y/32));
  const replacement=tree?(p.name==='palm-tree'||p.name==='willow-tree'?p.name:p.name==='broadleaf-tree'?['tree0','tree1','tree-tall','tree-wide'][variant%4]:p.name==='snow-pine'?'env-pine-snow':(variant%7===0?'env-fir':variant%2?'env-pine-olive':'env-pine-jade')):p.name==='rock'?'env-boulder':p.name==='ice-crystal'?'env-ice':null;
  if(replacement){
   const frame=scene.textures.getFrame('town',replacement),scale=tree?2:1;
   const foot=p.y+(tree?90:p.name==='rock'?64:104),cx=p.x+32;
   const obj=scene.add.image(cx,foot,'town',replacement).setOrigin(.5,1).setScale(scale).setDepth(foot);
   scene.add.ellipse(cx,foot-3,tree?48:40,12,0x253951,.18).setDepth(1);
   if(tree)scene.canopies.push({sprite:obj,x:cx,y:foot,baseX:cx,width:frame.width*scale,height:frame.height*scale});
   return obj;
  }
 }
 let name=p.name;
 if(name==='tree')name=['tree0','tree1','tree2','tree3','tree-tall'][Math.abs(Math.floor(p.x/32+p.y/32))%5];
 const height=scene.textures.getFrame(scene.textures.get('town').has(name)?'town':'world',name).height*2;
 const foot=p.y+((name.startsWith('tree')||name.endsWith('-tree')||name==='snow-pine')?90:name.startsWith('house')?110:name==='shed'?124:height);
 if(!p.fence){const shadow=scene.add.ellipse(p.x+height*.28,p.y+height-5,Math.min(100,height*.72),12,0x253951,.18).setDepth(1);if(name.startsWith('tree'))shadow.setPosition(p.x+34,p.y+88).setSize(78,24);}
 const obj=image(scene,name,p.x,p.y,foot);
 if(name.startsWith('tree')||name.endsWith('-tree')||name==='snow-pine')scene.canopies.push({sprite:obj,x:p.x+32,y:p.y+90});
 if(p.animated==='fountain')scene.fountains.push(obj);
 if(p.animated==='plant')scene.plants.push({sprite:obj,prefix:name.slice(0,-1)});
 if(p.nameplate)label(scene,p.x+80,p.y+136,p.nameplate);
 return obj;
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
 scene.roadSigns=[];scene.merchants=[];scene.shopLabels=[];scene.farmSigns=[];scene.artScale=2;const map=MAPS[area];scene.water=[];scene.fountains=[];scene.plants=[];scene.canopies=[];scene.doors=[];
 if(area!=='interior')terrain(scene,area,map);
 for(const p of map.details){
  if(area==='forest'&&p.name==='dry-grass'&&Math.floor(p.x+p.y)%5===0){
   scene.add.image(p.x+16,p.y+32,'town',Math.floor(p.x)%2?'env-agave':'env-dry-plant').setOrigin(.5,1).setScale(1).setDepth(0);
  }else image(scene,p.name,p.x,p.y,0);
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
  for(const [index,field] of map.fields.entries())if(scene.app.state&&!ownedField(scene.app.state,index)){
    for(let y=field.y+8;y<field.y+field.h;y+=32)for(let x=field.x+8;x<field.x+field.w;x+=40)image(scene,(x+y)%3?'grass-detail':'fern',x,y,1);
    for(let i=0;i<3;i++)image(scene,'pebble',field.x+24+i*64,field.y+48+(i%2)*48,1);
  }
  for(const [index,field]of FIELDS.entries()){
   if(scene.app.state&&!ownedField(scene.app.state,index)){label(scene,field.x+96,field.y+88,`FIELD ${index+1} / ${field.price} COINS`);continue;}
   const border=scene.add.graphics().setDepth(1);border.fillStyle(0x66564a);border.fillRect(field.x-4,field.y-4,200,200);border.lineStyle(2,0xc2a17a);border.strokeRect(field.x-2,field.y-2,196,196);
  }
  image(scene,'fence',832,220,252);image(scene,'fence',864,220,252);
 }else if(area==='city'){
  const [x,y,w,h]=map.plaza;tiled(scene,'town-paving',x,y,w,h,0);
  for(const [cx,kind,name]of [[432,'seed','SEEDS'],[896,'sell','PRODUCE'],[336,'outfitter','OUTFITTER']]){
   const t=label(scene,cx,kind==='outfitter'?722:290,name);scene.shopLabels.push({text:t,kind,name});
  }
  label(scene,704,608,'LANTERN SQUARE');label(scene,1080,626,'SEED AID');
 }

 if(area==='forest'){for(const b of BRIDGES){const bridge=scene.add.graphics().setDepth(0);bridge.fillStyle(0x694757).fillRect(b.x,b.y,b.w,b.h);for(let yy=4;yy<b.h;yy+=12){bridge.fillStyle(0xb58b61).fillRect(b.x+4,b.y+yy,b.w-8,8);bridge.fillStyle(0xd5b37e).fillRect(b.x+4,b.y+yy,b.w-8,2);}bridge.fillStyle(0x544249).fillRect(b.x,b.y,6,b.h).fillRect(b.x+b.w-6,b.y,6,b.h);}}
 for(const p of [...map.buildings,...map.props])object(scene,p);
 for(const npc of map.npcs||[]){const sprite=image(scene,npc.sprite,npc.x-24,npc.y-60,npc.y);scene.merchants.push({sprite,kind:npc.kind||(npc.name==='Clara'?'seed':'sell'),normal:npc.sprite,idle:npc.idle});}
 for(const sign of map.signs)if(sign.type!=='aid'&&!map.props.some(p=>Math.hypot(p.x-sign.x,p.y-sign.y)<70))image(scene,'sign',sign.x-16,sign.y-40,sign.y);
}
export function drawPlots(scene,plots,group){
 group.clear(true,true);
 const s=scene.app.state||{minute:360};
 for(const pos of scene.plotPositions){
  const i=pos.index;
  const p=plots?.[i],period=waterPeriod(s),wet=p&&(period?p[period]:s.minute<960?p.morning:p.evening);
  group.add(image(scene,wet?'field-watered':'field-soil',pos.x-24,pos.y-24,2));
  if(p?.crop){const visual=cropVisual(p,s),plant=scene.add.image(pos.x,pos.y+20,'town',CROPS[p.crop].sprites[visual]).setOrigin(.5,1).setScale(2).setDepth(pos.y+20);group.add(plant);}
 }
}
