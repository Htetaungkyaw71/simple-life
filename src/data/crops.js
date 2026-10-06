export const WATER_WINDOWS=[{id:'morning',start:360,end:720,label:'AM 06-12'},{id:'evening',start:960,end:1320,label:'PM 16-22'}];
export const CROPS={
 tomato:{id:'tomato',name:'Tomato',category:'field',seedPrice:10,sellPrice:18,growthDays:3,harvestYield:2,energyRestored:12,regrow:false,unlock:null,
  watering:['morning','evening'],growthStages:['Seed / sprout','Young plant','Flowering','Ripe'],stages:['seed','sprout','young','flowering','ripe'],
  sprites:Object.fromEntries(['seed','sprout','young','flowering','ripe','dry','wilted','dead'].map(key=>[key,'tomato-'+key]))},
};
export const FIELD={x:352,y:224,cell:48,cols:4,rows:4};
// Preserve the original six save indices, then the later expansion to sixteen.
const cells=[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[3,0],[3,1],...Array.from({length:8},(_,i)=>[i%4,2+Math.floor(i/4)])];
export const PLOTS=cells.map(([col,row])=>({x:FIELD.x+24+col*48,y:FIELD.y+24+row*48,col,row}));
