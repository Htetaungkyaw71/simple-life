import {MAPS,MAP_SIZE} from '../data/mapLayouts.js';
const SCALE=2;
export function image(scene,name,x,y,depth=0){const atlas=scene.textures.get('town').has(name)?'town':'world';return scene.add.image(Math.round(x),Math.round(y),atlas,name).setOrigin(0).setScale(SCALE).setDepth(depth);}
function tiled(scene,name,x,y,w,h,depth=0){const atlas=scene.textures.get('town').has(name)?'town':'world';return scene.add.tileSprite(x,y,w,h,atlas,name).setOrigin(0).setTileScale(SCALE).setDepth(depth);}
function label(scene,x,y,value){return scene.add.bitmapText(x,y,'pixel',value,6).setScale(2).setOrigin(.5,0).setTint(0xe1d7ad).setDepth(y+3);}
function paths(scene,rectangles){
 const cells=new Set();for(const [x,y,w,h]of rectangles)for(let yy=Math.floor(y/32);yy<Math.ceil((y+h)/32);yy++)for(let xx=Math.floor(x/32);xx<Math.ceil((x+w)/32);xx++)cells.add(xx+','+yy);
 for(const key of cells){const [x,y]=key.split(',').map(Number),has=(dx,dy)=>cells.has((x+dx)+','+(y+dy));const n=!has(0,-1),s=!has(0,1),w=!has(-1,0),e=!has(1,0);const suffix=n&&w?'nw':n&&e?'ne':s&&w?'sw':s&&e?'se':n?'n':s?'s':w?'w':e?'e':'';image(scene,'path'+(suffix?'-'+suffix:''),x*32,y*32,1);}
}
export function drawWorld(scene,area){
 const map=MAPS[area];scene.water=[];scene.fountains=[];
 tiled(scene,'grass',0,0,MAP_SIZE.width,MAP_SIZE.height);for(const p of map.details)image(scene,p.name,p.x,p.y,0);
 paths(scene,map.paths);
 for(const [x,y,w,h]of map.water){tiled(scene,'path',x-16,y-16,w+32,h+32,1);const water=tiled(scene,'water0',x,y,w,h,2);scene.water.push(water);for(let xx=x;xx<x+w;xx+=64)image(scene,'bush',xx,y+h-4,y+h+24);}
 if(area==='home'){
  image(scene,'roof-left',144,48,112);tiled(scene,'roof-center',176,48,608,64,112);image(scene,'roof-right',784,48,112);
  tiled(scene,'floor0',176,144,608,352,1);tiled(scene,'wall',160,112,640,32,144);tiled(scene,'wall',160,144,16,352,520);tiled(scene,'wall',784,144,16,352,520);
  tiled(scene,'wall',160,496,286,16,520);tiled(scene,'wall',514,496,286,16,520);
  image(scene,'window',420,104,146);image(scene,'window',676,104,146);
  image(scene,'bed',240,180,260);image(scene,'dresser',580,174,238);image(scene,'table',610,340,388);image(scene,'pot',636,336,389);
  image(scene,'bench',404,200,238);image(scene,'pot',200,184,216);image(scene,'pot',736,432,464);image(scene,'barrel',704,176,208);image(scene,'crate',740,176,208);
  tiled(scene,'soil',406,352,144,64,1);tiled(scene,'floor1',414,360,128,48,2);
  image(scene,'sign',524,526,558);label(scene,480,144,'HOME / THE SHADE GARDEN');label(scene,880,686,'FARM GATE');
  image(scene,'post',840,640,672);image(scene,'post',920,640,672);
 }else if(area==='farm'){
  for(const field of map.fields)if(!field.active){tiled(scene,'soil',field.x,field.y,field.w,field.h,1);for(let y=field.y+16;y<field.y+field.h;y+=64)for(let x=field.x+16;x<field.x+field.w;x+=64)image(scene,'grass-detail',x,y,2);label(scene,field.x+field.w/2,field.y+field.h+12,'RESTING FIELD');}
  label(scene,468,150,'FIRST ROOTS');label(scene,180,234,'HOME');label(scene,864,318,'CITY LANE');label(scene,1872,544,'QUIET ORCHARD');
 }else{
  tiled(scene,'plaza',1024,400,320,176,1);
  image(scene,'seed-shop',264,104,232);image(scene,'produce-shop',552,104,232);
  image(scene,'pot',244,228,260);image(scene,'pot',724,228,260);label(scene,360,128,'SEEDS');label(scene,648,128,'PRODUCE');label(scene,1184,588,'LANTERN SQUARE');label(scene,94,338,'FARM');
 }
 for(const p of [...map.buildings,...map.props]){const obj=image(scene,p.name,p.x,p.y,p.y+(p.name.startsWith('house')?128:p.name==='tree'?90:p.name==='shed'?96:p.name==='lamp'?62:objHeight(scene,p.name)));if(p.animated==='fountain')scene.fountains.push(obj);if(p.nameplate)label(scene,p.x+80,p.y+136,p.nameplate);}
 for(const npc of map.npcs||[])image(scene,npc.sprite,npc.x-16,npc.y-44,npc.y);
 for(const sign of map.signs){if(!map.props.some(p=>Math.hypot(p.x-sign.x,p.y-sign.y)<70))image(scene,'sign',sign.x-16,sign.y-40,sign.y);}
}
function objHeight(scene,name){const atlas=scene.textures.get('town').has(name)?'town':'world';return scene.textures.getFrame(atlas,name).height*2;}
export function drawPlots(scene,plots,group){
 group.clear(true,true);
 for(const [i,pos]of scene.plotPositions.entries()){
  const p=plots?.[i],soil=p?.morning||p?.evening?'watered-soil':'soil';group.add(tiled(scene,soil,pos.x-32,pos.y-32,64,64,2));
  if(p?.crop){const stage=p.dryDays>=2?5:p.dryDays===1?4:p.growth;group.add(scene.add.image(pos.x,pos.y+20,'world','crop'+stage).setOrigin(.5,1).setScale(2).setDepth(pos.y+20));if(p.growth===3)group.add(scene.add.image(pos.x+22,pos.y-32,'world','marker').setScale(1).setDepth(pos.y+21));}
 }
}
