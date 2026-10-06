import {FIELD,PLOTS} from './crops.js';

// Each farm repeats the original 4x4 bed and its surrounding prop composition.
export const FIELDS=[
 {...FIELD,w:192,h:192,price:0},
 {...FIELD,x:1088,y:128,w:192,h:192,price:120},
 {...FIELD,x:1088,y:656,w:192,h:192,price:180},
 {...FIELD,x:352,y:656,w:192,h:192,price:240},
];
export const PLOTS_PER_FARM=64;
export const MAX_FARMS=100;
export const FARM_PRICE=600;
export const FARM_PLOTS=FIELDS.flatMap((f,field)=>PLOTS.map(p=>({...p,x:p.x-FIELD.x+f.x,y:p.y-FIELD.y+f.y,field})));
