import {FOREST_ITEMS,MEAT,GRILLED_MEAT} from './items.js';
export const LEGACY_GROWTH_DAYS={tomato:1,strawberry:2,carrot:2,corn:2,chili:1,eggplant:2,cucumber:1,watermelon:2,pumpkin:2,grape:2,blueberry:2,sweetPotato:1};
export const WATER_WINDOWS=[{id:'daily',start:0,end:1440,label:'Once daily'}];
const crop=(id,name,seedPrice,sellPrice,growthDays,harvestYield,energyRestored,description)=>({
 id,name,category:'field',seedKey:id==='tomato'?'seed':id+'Seed',produceKey:id,seedPrice,sellPrice,growthDays,harvestYield,energyRestored,regrow:false,unlock:null,description,
 watering:['daily'],growthStages:Array.from({length:growthDays+1},(_,i)=>i===growthDays?'Ripe':i===0?'Seed / sprout':i/growthDays>=.6?'Flowering':'Young plant'),stageCount:growthDays+1,stages:['seed','sprout','young','flowering','ripe'],icon:id+'-item',seedIcon:id+'-seed-item',
 sprites:Object.fromEntries(['seed','sprout','young','flowering','ripe','dry','wilted','dead'].map(key=>[key,id+'-'+key])),
});
export const CROPS={
 tomato:crop('tomato','Tomato',10,18,3,2,12,'A dependable first harvest.'),
 strawberry:crop('strawberry','Strawberry',18,28,4,2,8,'Sweet berries reward steady care.'),
 carrot:crop('carrot','Carrot',28,70,3,1,22,'One valuable root beneath the soil.'),
 corn:crop('corn','Corn',40,36,4,3,14,'A longer season, a generous harvest.'),
 chili:crop('chili','Chili',22,24,3,3,10,'Small peppers, a bright harvest.'),
 eggplant:crop('eggplant','Eggplant',32,46,4,2,18,'Purple fruit on a leafy bush.'),
 cucumber:crop('cucumber','Cucumber',26,30,3,3,16,'Crisp fruit on curling vines.'),
 watermelon:crop('watermelon','Watermelon',55,85,5,2,35,'Large sweet melons on low vines.'),
 pumpkin:crop('pumpkin','Pumpkin',48,74,6,2,28,'Golden pumpkins need patient care.'),
 grape:crop('grape','Grape',36,42,5,3,20,'Sweet clusters on a small vine.'),
 blueberry:crop('blueberry','Blueberry',30,38,4,3,16,'Blue berries on a low bush.'),
 sweetPotato:crop('sweetPotato','Sweet Potato',24,38,3,2,24,'A warm root under broad leaves.'),
};
export const CROP_IDS=Object.keys(CROPS);
export const INVENTORY_KEYS=[...CROP_IDS.flatMap(id=>[CROPS[id].seedKey,id]),...Object.keys(FOREST_ITEMS),'wood','grass','stone','meat','grilledMeat','benchDecor','planterDecor','fenceDecor','pathDecor'];
export const FIELD={x:352,y:224,cell:48,cols:4,rows:4};
// Preserve the original six save indices, then the later expansion to sixteen.
const cells=[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[3,0],[3,1],...Array.from({length:8},(_,i)=>[i%4,2+Math.floor(i/4)])];
export const PLOTS=cells.map(([col,row])=>({x:FIELD.x+24+col*48,y:FIELD.y+24+row*48,col,row}));

// Keep the original market salts stable when expanding the catalogue.
export const SALE_ITEMS={...Object.fromEntries(['tomato','strawberry','carrot','corn'].map(id=>[id,CROPS[id]])),...FOREST_ITEMS,...Object.fromEntries(CROP_IDS.slice(4).map(id=>[id,CROPS[id]])),meat:MEAT,grilledMeat:GRILLED_MEAT};
export const SALE_IDS=Object.keys(SALE_ITEMS);
