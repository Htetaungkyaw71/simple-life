import {pixelArrow} from '../ui/statusArt.js';
import {FIELD,CROPS} from '../data/crops.js';
import {cropVisual,waterPeriod} from '../systems/watering.js';
import {ROOM,FURNITURE} from '../data/interior.js';
import {pondRows} from '../data/geometry.js';
import {MAPS} from '../data/mapLayouts.js';
import {terrain} from './Terrain.js';
const SCALE=2;
export function image(scene,name,x,y,depth=0){const atlas=scene.textures.get('town').has(name)?'town':'world';return scene.add.image(Math.round(x),Math.round(y),atlas,name).setOrigin(0).setScale(scene.artScale||SCALE).setDepth(depth);}
function tiled(scene,name,x,y,w,h,depth=0){const atlas=scene.textures.get('town').has(name)?'town':'world';return scene.add.tileSprite(x,y,w,h,atlas,name).setOrigin(0).setTileScale(scene.artScale||SCALE).setDepth(depth);}
function label(scene,x,y,value){return scene.add.bitmapText(x,y,'pixel',value,6).setScale(2).setOrigin(.5,0).setTint(0xffefd0).setDropShadow(1,1,0x34344f,1).setDepth(y+3);}
function object(scene,p){
 if(p.name==='farm-sign')return farmSign(scene,p);
 let name=p.name;
 if(name==='tree')name=['tree0','tree1','tree2','tree3','tree-tall'][Math.abs(Math.floor(p.x/32+p.y/32))%5];
 const height=scene.textures.getFrame(scene.textures.get('town').has(name)?'town':'world',name).height*2;
 const foot=p.y+(name.startsWith('tree')?90:name.startsWith('house')?110:name==='shed'?124:height);
 if(!p.fence){const shadow=scene.add.ellipse(p.x+height*.28,p.y+height-5,Math.min(100,height*.72),12,0x253951,.18).setDepth(1);if(name.startsWith('tree'))shadow.setPosition(p.x+34,p.y+88).setSize(78,24);}
 const obj=image(scene,name,p.x,p.y,foot);
 if(name.startsWith('tree'))scene.canopies.push({sprite:obj,x:p.x+32,y:p.y+90});
 if(p.animated==='fountain')scene.fountains.push(obj);
 if(p.nameplate)label(scene,p.x+80,p.y+136,p.nameplate);
 return obj;
}
function farmSign(scene,p){
 const g=scene.add.graphics().setPosition(p.x,p.y).setScale(2).setDepth(p.y+64);
 g.fillStyle(0x544249);g.fillRect(9,19,6,13);g.fillStyle(0xa8794e);g.fillRect(10,20,4,12);
 g.fillStyle(0x544249);g.fillRect(0,0,24,23);g.fillStyle(0xa8794e);g.fillRect(1,1,22,21);g.fillStyle(0xd6ad73);g.fillRect(2,2,20,2);g.fillRect(2,20,20,1);
 pixelArrow(g,2,12,15,0xffedcc);scene.add.bitmapText(p.x+2,p.y+8,'pixel','FARM',8).setScale(2).setTint(0xffedcc).setDepth(p.y+65);return g;
}
export function drawWorld(scene,area){
 scene.artScale=2;const map=MAPS[area];scene.water=[];scene.fountains=[];scene.canopies=[];scene.doors=[];
 if(area!=='interior')terrain(scene,area,map);
 for(const p of map.details)image(scene,p.name,p.x,p.y,0);
 for(const [x,y,w,h]of map.water){for(let yy=y+24;yy<y+h-24;yy+=40)for(let xx=x+60;xx<x+w-50;xx+=58){const rows=pondRows([x,y,w,h]).filter(r=>r[1]>=yy&&r[1]<yy+32);if(rows.length===16&&rows.every(r=>xx>=r[0]&&xx+32<=r[0]+r[2]))scene.water.push(image(scene,'water0',xx,yy,0));};for(let i=0;i<4;i++)image(scene,'bush',x+40+i*52,y+h-4,y+h+26);}
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
  for(const field of map.fields)if(!field.active){
    for(let y=field.y+8;y<field.y+field.h;y+=32)for(let x=field.x+8;x<field.x+field.w;x+=40)image(scene,(x+y)%3?'grass-detail':'fern',x,y,1);
    for(let i=0;i<3;i++)image(scene,'pebble',field.x+24+i*64,field.y+48+(i%2)*48,1);
  }
  const border=scene.add.graphics().setDepth(1);border.fillStyle(0x66564a);border.fillRect(FIELD.x-4,FIELD.y-4,200,200);border.lineStyle(2,0xc2a17a);border.strokeRect(FIELD.x-2,FIELD.y-2,196,196);
  image(scene,'fence',832,220,252);image(scene,'fence',864,220,252);
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
 const s=scene.app.state||{minute:360};
 for(const [i,pos]of scene.plotPositions.entries()){
  const p=plots?.[i],period=waterPeriod(s),wet=p&&(period?p[period]:s.minute<960?p.morning:p.evening);
  group.add(image(scene,wet?'field-watered':'field-soil',pos.x-24,pos.y-24,2));
  if(p?.crop){const visual=cropVisual(p,s),plant=scene.add.image(pos.x,pos.y+20,'town',CROPS[p.crop].sprites[visual]).setOrigin(.5,1).setScale(2).setDepth(pos.y+20);group.add(plant);}
 }
}
