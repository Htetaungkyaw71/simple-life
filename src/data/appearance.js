import {BOY_CLIPS} from './revisedFarmer.js';
import {GIRL_CLIPS} from './revisedGirl.js';
export const OUTFITS={
 worker:{name:'Worker outfit',price:0},
 gardener:{name:'Garden outfit',price:0},
 copper:{name:'Copper outfit',price:90},
 plum:{name:'Plum outfit',price:120},
 forest:{name:'Forest outfit',price:150},
};
export const HAIRCUTS={
 midnight:{name:'Midnight hair',price:30},
 copper:{name:'Copper hair',price:45},
 chestnut:{name:'Chestnut hair',price:50},
 golden:{name:'Golden hair',price:60},
};
// Independent slots: these never select another body or NPC preset.
export const ACCESSORIES={
 straw:{name:'Straw hat',slot:'hat',price:55},
 canvas:{name:'Canvas backpack',slot:'bag',price:75},
};
export const ACCESSORY_IDS=Object.keys(ACCESSORIES);
export const OUTFIT_IDS=Object.keys(OUTFITS),HAIRCUT_IDS=Object.keys(HAIRCUTS);
export const PEOPLE={width:24,height:40,scale:2,toolScale:1,columns:12,frames:48,originY:1,idleFrames:[4,4,4,4],runStart:4,runFrames:4,jumpStart:8,walkFrames:4,moveFrameRate:10,idleFrameRate:6,wadeRows:5};
export const STYLE_SERVICES={clothes:{resident:'city-nell',name:'Nell',area:'clothing',x:252,y:154},hair:{resident:'city-sol',name:'Sol',area:'barber',x:300,y:220}};
export const freshAppearance=character=>({outfit:character==='girl'?'gardener':'worker',hair:character==='girl'?'chestnut':'midnight',owned:['worker','gardener'],ownedAccessories:[],accessories:{hat:null,glasses:null,bag:null}});
export const appearanceIndex=a=>Math.max(0,OUTFIT_IDS.indexOf(a?.outfit))*HAIRCUT_IDS.length+Math.max(0,HAIRCUT_IDS.indexOf(a?.hair));
export const appearanceFrame=(a,frame=0)=>appearanceIndex(a)*PEOPLE.frames+frame;
// PixelLab's run canvas has padding: row 40 is the shared native ground plane.
export const FARMER={...PEOPLE,width:48,height:48,originY:40/48,idleFrames:[1,1,1,1],runStart:1,runFrames:8,jumpStart:9,moveFrameRate:16};
export const BOY_FARMER={...FARMER,width:64,height:64,scale:1.5,originY:56/64,columns:8,frames:272,idleFrames:[4,4,4,4],runStart:0,runOffset:32,moveFrameRate:12,clips:BOY_CLIPS};
export const GIRL_FARMER={...BOY_FARMER,scale:1.45,frames:256,clips:GIRL_CLIPS};
export function playerVisual(appearance,character='boy'){
 const texture=character==='girl'?'girl':'boy';
 return {texture,offset:0,rig:texture==='boy'?BOY_FARMER:GIRL_FARMER,key:texture==='boy'?'farmer-v2':'farmer-girl-v2'};
}
