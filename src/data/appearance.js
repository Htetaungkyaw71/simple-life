export const OUTFITS={
 worker:{name:'Teal overalls',price:0},
 gardener:{name:'Olive overalls',price:0},
 copper:{name:'Copper vest',price:90},
 plum:{name:'Plum dress',price:120},
 forest:{name:'Forest jacket',price:150},
};
export const HAIRCUTS={
 midnight:{name:'Midnight cut',price:30},
 copper:{name:'Copper sweep',price:45},
 chestnut:{name:'Chestnut braid',price:50},
 golden:{name:'Golden waves',price:60},
};
export const OUTFIT_IDS=Object.keys(OUTFITS),HAIRCUT_IDS=Object.keys(HAIRCUTS);
export const PEOPLE={width:24,height:40,columns:9,frames:36,originY:1};
export const STYLE_SERVICES={clothes:{resident:'city-nell',name:'Nell',x:1568,y:1040},hair:{resident:'city-sol',name:'Sol',x:472,y:1040}};
export const freshAppearance=character=>({outfit:character==='girl'?'gardener':'worker',hair:character==='girl'?'chestnut':'midnight',owned:['worker','gardener']});
export const appearanceIndex=a=>Math.max(0,OUTFIT_IDS.indexOf(a?.outfit))*HAIRCUT_IDS.length+Math.max(0,HAIRCUT_IDS.indexOf(a?.hair));
export const appearanceFrame=(a,frame=0)=>appearanceIndex(a)*PEOPLE.frames+frame;
