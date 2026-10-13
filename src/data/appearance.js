export const OUTFITS={
 worker:{name:'Worker outfit',price:0},
 gardener:{name:'Garden outfit',price:0},
 copper:{name:'Copper outfit',price:90},
 plum:{name:'Plum outfit',price:120},
 forest:{name:'Forest outfit',price:150},
};
export const HAIRCUTS={
 midnight:{name:'Classic look',price:30},
 copper:{name:'Coastal look',price:45},
 chestnut:{name:'Autumn look',price:50},
 golden:{name:'Evening look',price:60},
};
export const OUTFIT_IDS=Object.keys(OUTFITS),HAIRCUT_IDS=Object.keys(HAIRCUTS);
export const PEOPLE={width:24,height:40,scale:2,toolScale:1,columns:12,frames:48,originY:1,idleFrames:[4,4,4,4],runStart:4,runFrames:4,jumpStart:8,walkFrames:4,moveFrameRate:10,idleFrameRate:6,wadeRows:5};
export const STYLE_SERVICES={clothes:{resident:'city-nell',name:'Nell',x:1568,y:1040},hair:{resident:'city-sol',name:'Sol',x:472,y:1040}};
export const freshAppearance=character=>({outfit:character==='girl'?'gardener':'worker',hair:character==='girl'?'chestnut':'midnight',owned:['worker','gardener']});
export const appearanceIndex=a=>Math.max(0,OUTFIT_IDS.indexOf(a?.outfit))*HAIRCUT_IDS.length+Math.max(0,HAIRCUT_IDS.indexOf(a?.hair));
export const appearanceFrame=(a,frame=0)=>appearanceIndex(a)*PEOPLE.frames+frame;
// PixelLab's run canvas has padding: row 40 is the shared native ground plane.
export const FARMER={...PEOPLE,width:48,height:48,originY:40/48,idleFrames:[1,1,1,1],runStart:1,runFrames:8,jumpStart:9,moveFrameRate:16};
export function playerVisual(appearance,character='boy'){
 const index=appearance?appearanceIndex(appearance):null;
 const texture=index===0?'boy':index===6?'girl':!appearance?character:null;
 return texture?{texture,offset:0,rig:FARMER,key:texture==='boy'?'farmer':'farmer-girl'}:{texture:'appearance',offset:appearanceFrame(appearance),rig:PEOPLE,key:`avatar-${index}`};
}
