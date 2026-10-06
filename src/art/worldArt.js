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
 const foot=p.y+(name.startsWith('tree')?90:name.startsWith('house')?128:name==='shed'?128:height);
 if(!p.fence){const shadow=scene.add.ellipse(p.x+height*.28,p.y+height-5,Math.min(100,height*.72),12,0x253951,.18).setDepth(1);if(name.startsWith('tree'))shadow.setPosition(p.x+34,p.y+88).setSize(78,24);}
 const obj=image(scene,name,p.x,p.y,foot);
 if(name.startsWith('tree'))scene.canopies.push({sprite:obj,x:p.x+32,y:p.y+90});
 if(p.animated==='fountain')scene.fountains.push(obj);
 if(p.nameplate)label(scene,p.x+80,p.y+136,p.nameplate);
 return obj;
}
export function drawWorld(scene,area){
 const map=MAPS[area];scene.water=[];scene.fountains=[];scene.canopies=[];scene.doors=[];
 if(area==='interior')scene.add.rectangle(-2240,-1152,6720,3456,0x263e38).setOrigin(0).setDepth(-2);else terrain(scene,area,map);
 for(const p of map.details)image(scene,p.name,p.x,p.y,0);
 for(const [x,y,w,h]of map.water){for(let yy=y+24;yy<y+h-24;yy+=40)for(let xx=x+60;xx<x+w-50;xx+=58){const rows=pondRows([x,y,w,h]).filter(r=>r[1]>=yy&&r[1]<yy+32);if(rows.length===16&&rows.every(r=>xx>=r[0]&&xx+32<=r[0]+r[2]))scene.water.push(image(scene,'water0',xx,yy,0));};for(let i=0;i<4;i++)image(scene,'bush',x+40+i*52,y+h-4,y+h+26);}
 if(area==='interior'){
  // A compact furnished cutaway; familiar bed, spawn and south-door coordinates stay safe.
  tiled(scene,'floor0',240,144,352,352,1);
  tiled(scene,'wall',224,112,384,64,170);
  tiled(scene,'wall',224,176,16,320,520);tiled(scene,'wall',592,176,16,320,520);
  tiled(scene,'wall',224,496,222,16,520);tiled(scene,'wall',514,496,94,16,520);
  image(scene,'window',300,116,172);image(scene,'window',516,116,172);
  image(scene,'bed',240,180,260);image(scene,'kitchen',384,164,228);image(scene,'dresser',512,176,240);
  image(scene,'shelf',246,278,330);image(scene,'pot',554,306,354);image(scene,'table',256,380,428);image(scene,'chair',274,434,480);
  image(scene,'rug',382,374,2);image(scene,'pot',538,426,474);image(scene,'planter',404,132,173);
  label(scene,416,94,'HOME / SHADE GARDEN');
  scene.doors.push(image(scene,'door0',464,482,485));
 }else if(area==='home'){
  label(scene,544,554,'STARTER SEEDS');label(scene,880,686,'FARM GATE');image(scene,'post',840,640,672);image(scene,'post',920,640,672);
 }else if(area==='farm'){
  for(const field of map.fields)if(!field.active){tiled(scene,'soil',field.x,field.y,field.w,field.h,1);for(let y=field.y+16;y<field.y+field.h;y+=64)for(let x=field.x+16;x<field.x+field.w;x+=64)image(scene,'grass-detail',x,y,2);label(scene,field.x+field.w/2,field.y+field.h+12,'RESTING FIELD');}
  image(scene,'sign',292,198,250);label(scene,478,183,'ACTIVE FIELD / 4 X 4');label(scene,180,234,'HOME');label(scene,864,318,'CITY / OPENING SOON');image(scene,'fence',832,220,252);image(scene,'fence',864,220,252);label(scene,1872,544,'QUIET ORCHARD');
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
