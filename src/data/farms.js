import {FIELD,PLOTS} from './crops.js';

// Keep legacy 4x4 save slots; each cleared growing area now spans eight columns and five rows.
export const FIELDS=[
 {...FIELD,cols:8,rows:5,w:384,h:240,price:0},
 {...FIELD,x:1088,y:128,cols:8,rows:5,w:384,h:240,price:120},
 {...FIELD,x:1088,y:656,cols:8,rows:5,w:384,h:240,price:180},
 {...FIELD,x:352,y:656,cols:8,rows:5,w:384,h:240,price:240},
];
// Append bottom rows after the existing right-hand extension to retain saved indices.
export const STARTER_EXTENSION=[
 ...Array.from({length:16},(_,i)=>({x:FIELD.x+24+(4+i%4)*48,y:FIELD.y+24+Math.floor(i/4)*48})),
 ...Array.from({length:8},(_,i)=>({x:FIELD.x+24+(i%8)*48,y:FIELD.y+24+(4+Math.floor(i/8))*48})),
];
export const PLOTS_PER_FARM=64;
export const MAX_CUSTOM_BEDS=2048;
export const MAX_FARMS=3;
// Preserve farms already purchased under earlier releases. New purchases stop at three.
export const SAVE_FARM_LIMIT=100;
export const FARM_PRICE=600;
export const FARM_PLOTS=FIELDS.flatMap((f,field)=>PLOTS.map(p=>({...p,x:p.x-FIELD.x+f.x,y:p.y-FIELD.y+f.y,field})));
