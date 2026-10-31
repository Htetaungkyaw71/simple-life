// Eastern extension: the original 10240x5120 forest keeps its coordinates and
// IDs. Additional 1280x1024 regions fill the 3x-total-area wilderness.
import {forestHabitat} from './forestHabitats.js';
const habitats=[
 ['moss','Mossreach','wood'],['cedar','Cedar Hollow','pine'],['sunpalm','Sunpalm Grove','jungle'],['reed','Reedwater','marsh'],
 ['orchid','Orchid Woods','jungle'],['greenbamboo','Green Bamboo','bamboo'],['amber','Amber Meadow','savanna'],['riversong','Riversong','marsh'],
 ['coconut','Coconut Grove','jungle'],['silverpine','Silver Pines','pine'],['redstone','Redstone Caves','stone'],['fruitvale','Fruitvale','wood'],
 ['mistwood','Mistwood','highland'],['papaya','Papaya Grove','jungle'],['willow','Willow Bend','marsh'],['sungrass','Sungrass Reach','savanna'],
 ['eastwood','Eastwood','wood'],['banana','Banana Glade','bamboo'],['fernshade','Palmshade','jungle'],['lakewood','Lakewood','marsh'],
];
const legacy=habitats.map(([id,name,biome],i)=>({id:'east-'+id,name,biome,danger:0,species:'woodland',x:5120+(i%4)*1280,y:Math.floor(i/4)*1024,w:1280,h:1024}));
const prefixes=['Moon','Rain','Olive','Amber','Quiet','Wild','Mist','Sun','Stone','Fern','River','Cloud','Orchid','Cedar','Mango','Lotus'];
const suffixes=['Terrace','Hollow','Meadow','Grove','Reach'];
const biomes=['wood','jungle','savanna','marsh','bamboo','pine','stone','highland'];
const far=Array.from({length:80},(_,i)=>{
 const column=i%16,row=Math.floor(i/16),prefix=prefixes[column],suffix=suffixes[row],safeStart=row===4&&column>=3&&column<=5;
 return {id:`far-${column}-${row}`,name:safeStart?'Easy Rainforest':`${prefix} ${suffix}`,biome:safeStart?'jungle':biomes[(column+row*3)%biomes.length],danger:safeStart?0:(column+row)%7===0?3:0,species:'woodland',x:10240+column*1280,y:row*1024,w:1280,h:1024,...(safeStart?{safeStart:true}:{})};
});
export const EAST_REGIONS=[...legacy,...far];
const boarHomes=[[808,192],[968,192],[840,320],[1000,320]];
export const EAST_BOARS=EAST_REGIONS.filter(r=>['rainforest','easyRainforest'].includes(forestHabitat({x:r.x+r.w/2,y:r.y+r.h/2}).id)).flatMap(r=>boarHomes.map(([dx,dy],n)=>({id:r.id+'-boar-'+n,species:'boar',region:r.id,territory:[r.x+752,r.y+144,384,360],home:{x:r.x+dx,y:r.y+dy}})));
