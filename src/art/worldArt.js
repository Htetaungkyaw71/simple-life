import {ROOM,FURNITURE} from '../data/interior.js';
import {pondRows} from '../data/geometry.js';
import {MAPS} from '../data/mapLayouts.js';
import {terrain} from './Terrain.js';
const SCALE=2;
export function image(scene,name,x,y,depth=0){const atlas=scene.textures.get('town').has(name)?'town':'world';return scene.add.image(Math.round(x),Math.round(y),atlas,name).setOrigin(0).setScale(SCALE).setDepth(depth);}
function tiled(scene,name,x,y,w,h,depth=0){const atlas=scene.textures.get('town').has(name)?'town':'world';return scene.add.tileSprite(x,y,w,h,atlas,name).setOrigin(0).setTileScale(SCALE).setDepth(depth);}
function label(scene,x,y,value){return scene.add.bitmapText(x,y,'pixel',value,6).setScale(2).setOrigin(.5,0).setTint(0xffefd0).setDropShadow(1,1,0x34344f,1).setDepth(y+3);}
function object(scene,p){
 let name=p.name;
 if(name==='tree')name=['tree0','tree1','tree2','tree3','tree-tall'][Math.abs(Math.floor(p.x/32+p.y/32))%5];
 const height=scene.textures.getFrame(scene.textures.get('town').has(name)?'town':'world',name).height*2;
 const foot=p.y+(name.startsWith('tree')?90:name.startsWith('house')?110:name==='shed'?128:height);
 if(!p.fence){const shadow=scene.add.ellipse(p.x+height*.28,p.y+height-5,Math.min(100,height*.72),12,0x253951,.18).setDepth(1);if(name.startsWith('tree'))shadow.setPosition(p.x+34,p.y+88).setSize(78,24);}
 const obj=image(scene,name,p.x,p.y,foot);
 if(name.startsWith('tree'))scene.canopies.push({sprite:obj,x:p.x+32,y:p.y+90});
 if(p.animated==='fountain')scene.fountains.push(obj);
 if(p.nameplate)label(scene,p.x+80,p.y+136,p.nameplate);
 return obj;
}
export function drawWorld(scene,area){
 const map=MAPS[area];scene.water=[];scene.fountains=[];scene.canopies=[];scene.doors=[];
 if(area!=='interior')terrain(scene,area,map);
 for(const p of map.details)image(scene,p.name,p.x,p.y,0);
 for(const [x,y,w,h]of map.water){for(let yy=y+24;yy<y+h-24;yy+=40)for(let xx=x+60;xx<x+w-50;xx+=58){const rows=pondRows([x,y,w,h]).filter(r=>r[1]>=yy&&r[1]<yy+32);if(rows.length===16&&rows.every(r=>xx>=r[0]&&xx+32<=r[0]+r[2]))scene.water.push(image(scene,'water0',xx,yy,0));};for(let i=0;i<4;i++)image(scene,'bush',x+40+i*52,y+h-4,y+h+26);}
 if(area==='interior'){
  tiled(scene,'wall',-2048,-2048,6144,6144,-1);
  tiled(scene,'floor0',0,0,ROOM.width,ROOM.height,0);
  tiled(scene,'wall',0,0,ROOM.width,128,128);
  tiled(scene,'wall',0,128,64,672,800);tiled(scene,'wall',1280,128,64,672,800);
  tiled(scene,'wall',0,736,624,64,800);tiled(scene,'wall',720,736,624,64,800);
  for(const [name,x,y]of FURNITURE)image(scene,name,x,y,name==='rug'?1:y+scene.textures.getFrame('town',name).height*2);
  scene.doors.push(image(scene,'door0',656,704,800));
 }else if(area==='home'){
  label(scene,544,554,'STARTER SEEDS');label(scene,480,1080,'FARM / SOUTH');image(scene,'post',416,1104,1136);image(scene,'post',528,1104,1136);
 }else if(area==='farm'){
  for(const field of map.fields)if(!field.active){tiled(scene,'soil',field.x,field.y,field.w,field.h,1);for(let y=field.y+16;y<field.y+field.h;y+=64)for(let x=field.x+16;x<field.x+field.w;x+=64)image(scene,'grass-detail',x,y,2);label(scene,field.x+field.w/2,field.y+field.h+12,'RESTING FIELD');}
  image(scene,'sign',292,198,250);label(scene,478,183,'ACTIVE FIELD / 4 X 4');label(scene,320,48,'HOME / NORTH');label(scene,864,318,'CITY / OPENING SOON');image(scene,'fence',832,220,252);image(scene,'fence',864,220,252);label(scene,1872,544,'QUIET ORCHARD');
 }else{
  tiled(scene,'plaza',1024,400,320,176,0);
  image(scene,'seed-shop',264,104,232);image(scene,'produce-shop',552,104,232);
  for(const x of [264,392,552,680])image(scene,'planter',x,238,270);
  image(scene,'crate',738,210,246);image(scene,'barrel',242,210,246);
  label(scene,344,238,'SEEDS');label(scene,632,238,'PRODUCE');label(scene,1184,588,'LANTERN SQUARE');label(scene,94,338,'FARM');
  scene.doors.push(image(scene,'door0',328,184,232),image(scene,'door0',616,184,232));
 }
 for(const p of [...map.buildings,...map.props])object(scene,p);
 for(const npc of map.npcs||[])image(scene,npc.sprite,npc.x-24,npc.y-60,npc.y);
 for(const sign of map.signs)if(!map.props.some(p=>Math.hypot(p.x-sign.x,p.y-sign.y)<70))image(scene,'sign',sign.x-16,sign.y-40,sign.y);
}
export function drawPlots(scene,plots,group){
 group.clear(true,true);
 for(const [i,pos]of scene.plotPositions.entries()){
  const p=plots?.[i],soil=p?.morning||p?.evening?'watered-soil':'soil';group.add(image(scene,soil,pos.x-32,pos.y-32,2));
  if(p?.crop){const stage=p.dryDays>=2?5:p.dryDays===1?4:p.growth;const plant=scene.add.image(pos.x,pos.y+20,'world','crop'+stage).setOrigin(.5,1).setScale(2).setDepth(pos.y+20);group.add(plant);if(p.growth===3){const spark=scene.add.image(pos.x+22,pos.y-32,'world','marker').setScale(1).setDepth(pos.y+21);group.add(spark);scene.tweens.add({targets:spark,alpha:.25,y:spark.y-4,duration:700,yoyo:true,repeat:-1});}}
 }
}
