// Authored 800×480 envelope; desktop layouts fit the full room at integer zoom 2.
// Native-size indoor sprites keep the farmer's displayed height equal to outdoors.
export const ROOM={width:624,height:304,zoom:2,spawn:{},bed:{},exit:{},bounds:[]};
export const FURNITURE=[],ROOM_SOLIDS=[];
export function configureRoom(viewWidth=1280,viewHeight=720){
 const w=Math.max(480,Math.min(800,Math.floor((viewWidth-32)/32)*16));
 const h=Math.max(304,Math.min(480,Math.floor((viewHeight-96)/32)*16));
 const changed=w!==ROOM.width||h!==ROOM.height;ROOM.width=w;ROOM.height=h;
 Object.assign(ROOM.spawn,{x:w/2,y:h-112});Object.assign(ROOM.bed,{x:w-116,y:188});Object.assign(ROOM.exit,{x:w/2,y:h-80});ROOM.bounds=[16,48,w-32,h-80];
 FURNITURE.splice(0,FURNITURE.length,
  ['home-window',40,8],['home-window',w/2-16,8],['home-window',w-88,8],
  ['home-fireplace',w/2-104,8],['home-logs',w/2-16,72],
  ['home-counter',32,72],['home-pottery',w-104,64],
  ['home-rug',w/2-216,h-184],['home-table',w/2-184,h-156],
  ['home-bench',w/2-152,h-188],['home-bench',w/2-152,h-70],
  ['home-rug',w-208,136],['home-bed',w-104,148],
  ['home-pot',w-48,h-72],['home-pot',32,h-72]);
 ROOM_SOLIDS.splice(0,ROOM_SOLIDS.length,
  [0,32,w,16],[0,48,16,h-48],[w-16,48,16,h-48],[0,h-32,w/2-24,32],[w/2+24,h-32,w/2-24,32],
  [w/2-104,48,80,80],[w/2-16,84,56,36],[32,80,96,40],[w-104,76,72,60],
  [w/2-184,h-148,128,72],[w/2-152,h-188,64,24],[w/2-152,h-70,64,24],
  [w-104,148,48,80],[w-48,h-60,32,36],[32,h-60,32,36]);
 return changed;
}
configureRoom();
