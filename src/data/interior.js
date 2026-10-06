// Authored 800×480 envelope; desktop layouts fit the full room at integer zoom 2.
// Native-size indoor sprites keep the farmer's displayed height equal to outdoors.
export const ROOM={width:624,height:304,zoom:2,spawn:{},bed:{},exit:{},bounds:[]};
export const FURNITURE=[],ROOM_SOLIDS=[];
export function configureRoom(viewWidth=1280,viewHeight=720){
 const w=Math.max(480,Math.min(800,Math.floor((viewWidth-32)/32)*16));
 const h=Math.max(304,Math.min(480,Math.floor((viewHeight-96)/32)*16));
 const changed=w!==ROOM.width||h!==ROOM.height;ROOM.width=w;ROOM.height=h;
 Object.assign(ROOM.spawn,{x:w/2,y:h-112});Object.assign(ROOM.bed,{x:112,y:160});Object.assign(ROOM.exit,{x:w/2,y:h-80});ROOM.bounds=[16,48,w-32,h-80];
 FURNITURE.splice(0,FURNITURE.length,
  ['window',64,4],['window',w-192,4],['window',w-80,4],
  ['bed',48,80],['rug',112,112],['shelf',48,h-96],['kitchen',w-224,56],['dresser',w-80,64],
  ['table',w-208,h-120],['chair',w-188,h-68],['pot',w-48,144],['pot',144,h-64],['planter',w/2-32,32]);
 ROOM_SOLIDS.splice(0,ROOM_SOLIDS.length,
  [0,32,w,16],[0,48,16,h-48],[w-16,48,16,h-48],[0,h-32,w/2-24,32],[w/2+24,h-32,w/2-24,32],
  [48,80,48,80],[48,h-96,64,48],[w-224,56,128,64],[w-80,64,64,64],
  [w-208,h-120,64,48],[w-188,h-68,32,32],[w-48,144,32,48],[144,h-64,32,48],[w/2-32,32,64,32]);
 return changed;
}
configureRoom();
