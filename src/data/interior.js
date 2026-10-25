import {HOME_INTERIOR_ART} from './homeInteriorArt.js';
// One shared native/world scale keeps the approved furniture proportions.
export const ROOM={width:624,height:400,zoom:1.5,spawn:{},bed:{},hearth:{},exit:{},bounds:[]};
export const DINING_TABLE_ART=HOME_INTERIOR_ART['home-table'];
export const FURNITURE=[],ROOM_SOLIDS=[];
export const ROOM_SURFACE={floorY:112,side:16,front:32,entrance:72};
export const roomArtSize=name=>{const a=HOME_INTERIOR_ART[name],[l,t,r,b]=a.visibleBounds;return {w:(r-l)*a.scale,h:(b-t)*a.scale};};
export const roomFloorPiece=name=>['home-rug','home-bedside-rug','home-threshold'].includes(name);
export function roomVisibleRect([name,x,y]){const a=HOME_INTERIOR_ART[name],[l,t,r,b]=a.visibleBounds;return {x:x+l*a.scale,y:y+t*a.scale,w:(r-l)*a.scale,h:(b-t)*a.scale};}
function atVisible(name,left,top){const a=HOME_INTERIOR_ART[name];return [name,left-a.visibleBounds[0]*a.scale,top-a.visibleBounds[1]*a.scale];}
function atFeet(name,left,bottom){const a=HOME_INTERIOR_ART[name];return atVisible(name,left,bottom-(a.visibleBounds[3]-a.visibleBounds[1])*a.scale);}
function centeredAtBottom(name,rect,bottomInset=10){const a=HOME_INTERIOR_ART[name],[l,t,r,b]=a.visibleBounds;return [name,rect.x+rect.w/2-(l+r)*a.scale/2,rect.y+rect.h-bottomInset-b*a.scale];}
export function configureRoom(viewWidth=1280,viewHeight=720){
 const w=Math.max(576,Math.min(800,Math.floor((viewWidth-32)/32)*16));
 const h=Math.max(400,Math.min(480,Math.floor((viewHeight-96)/32)*16));
 const changed=w!==ROOM.width||h!==ROOM.height;ROOM.width=w;ROOM.height=h;
 const fireplace=atFeet('home-fireplace',w/2-44,146),fireplaceRect=roomVisibleRect(fireplace);
 FURNITURE.splice(0,FURNITURE.length,
  atVisible('home-window',48,18),atVisible('home-window',w/2+78,18),
  atVisible('home-wall-shelf',144,40),atFeet('home-counter',32,140),
  fireplace,centeredAtBottom('home-fire',fireplaceRect,8),atFeet('home-logs',w/2+76,138),
  atFeet('home-pottery',w-116,134),
  atVisible('home-rug',27,h-221),atVisible('home-table',75,h-171),
  atVisible('home-bench',92,h-211),atVisible('home-bench-front',93,h-90),
  atVisible('home-bedside-rug',w-177,202),atVisible('home-bed',w-105,191),atFeet('home-storage-jar',w-62,190),
  atFeet('home-leafy-pot',34,h-39),atFeet('home-flower-pot',w-58,h-39),atVisible('home-threshold',w/2-33.5,h-68));
 const bed=FURNITURE.find(([n])=>n==='home-bed'),fire=FURNITURE.find(([n])=>n==='home-fireplace');
 Object.assign(ROOM.spawn,{x:w/2,y:h-100});
 const bedRect=roomVisibleRect(bed),fireRect=roomVisibleRect(fire);
 Object.assign(ROOM.bed,{x:bedRect.x-16,y:Math.round(bedRect.y+bedRect.h*.65)});
 Object.assign(ROOM.hearth,{x:Math.round(fireRect.x+fireRect.w/2),y:fireRect.y+fireRect.h+16});
 Object.assign(ROOM.exit,{x:w/2,y:h-52});ROOM.bounds=[16,ROOM_SURFACE.floorY,w-32,h-32-ROOM_SURFACE.floorY];
 ROOM_SOLIDS.splice(0,ROOM_SOLIDS.length,
  [0,0,w,ROOM_SURFACE.floorY],[0,112,16,h-112],[w-16,112,16,h-112],
  [0,h-32,w/2-36,32],[w/2+36,h-32,w/2-36,32]);
 for(const piece of FURNITURE){
  const [name]=piece,r=roomVisibleRect(piece);let box;
  if(name==='home-table')box=[r.x+6,r.y+r.h*.5,r.w-12,r.h*.42];
  else if(name.startsWith('home-bench'))box=[r.x+5,r.y+r.h*.48,r.w-10,r.h*.42];
  else if(name==='home-bed')box=[r.x+6,r.y+10,r.w-12,r.h-16];
  else if(name==='home-fireplace')box=[r.x+6,r.y+r.h-22,r.w-12,20];
  else if(name==='home-counter'||name==='home-pottery')box=[r.x+5,r.y+r.h-26,r.w-10,24];
  else if(name==='home-logs')box=[r.x+4,r.y+r.h-18,r.w-8,16];
  else if(['home-leafy-pot','home-flower-pot'].includes(name))box=[r.x+r.w*.24,r.y+r.h-18,r.w*.52,16];
  if(box)ROOM_SOLIDS.push(box.map(Math.round));
 }
 return changed;
}
configureRoom();
