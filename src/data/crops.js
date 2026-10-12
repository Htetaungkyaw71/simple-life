import {DECORATIONS} from './settlement.js';
import {FOREST_ITEMS,MEAT,GRILLED_MEAT,FOODS,FOOD_IDS} from './items.js';
export const LEGACY_GROWTH_DAYS={tomato:1,strawberry:2,carrot:2,corn:2,chili:1,eggplant:2,cucumber:1,watermelon:2,pumpkin:2,grape:2,blueberry:2,sweetPotato:1};
export const WATER_WINDOWS=[{id:'daily',start:0,end:1440,label:'Once daily'}];
const crop=(id,name,seedPrice,sellPrice,growthDays,harvestYield,energyRestored,description)=>({
 id,name,category:'field',seedKey:id==='tomato'?'seed':id+'Seed',produceKey:id,seedPrice,sellPrice,growthDays,harvestYield,energyRestored,regrow:false,unlock:null,description,
 watering:['daily'],growthStages:Array.from({length:growthDays+1},(_,i)=>i===growthDays?'Ripe':i===0?'Seed / sprout':i/growthDays>=.6?'Flowering':'Young plant'),stageCount:growthDays+1,stages:['seed','sprout','young','flowering','ripe'],icon:id+'-item',seedIcon:id+'-seed-item',
 sprites:Object.fromEntries(['seed','sprout','young','flowering','ripe','dry','wilted','dead'].map(key=>[key,id+'-'+key])),
});
export const CROPS={
 tomato:crop('tomato','Tomato',10,18,3,2,12,'Low-cost first crop'),
 strawberry:crop('strawberry','Strawberry',18,51,4,2,18,'Rich return on a small seed budget'),
 carrot:crop('carrot','Carrot',28,70,3,1,28,'Fast single root / travel food'),
 corn:crop('corn','Corn',40,30,4,4,10,'Four ears / market volume'),
 chili:crop('chili','Chili',22,24,3,3,6,'Fast cash / light food'),
 eggplant:crop('eggplant','Eggplant',32,52,4,2,24,'Balanced meal and market crop'),
 cucumber:crop('cucumber','Cucumber',26,33,4,3,16,'Three fruits / strong market days'),
 watermelon:crop('watermelon','Watermelon',55,90,5,2,35,'Premium melons / long journey food'),
 pumpkin:crop('pumpkin','Pumpkin',48,72,6,3,38,'Patient harvest / hearty food'),
 grape:crop('grape','Grape',36,46,5,4,20,'Four clusters / high market volume'),
 blueberry:crop('blueberry','Blueberry',30,33,4,3,20,'Three berries / better food than cucumber'),
 sweetPotato:crop('sweetPotato','Sweet Potato',24,42,4,2,32,'Affordable hearty exploration food'),
};
// Existing food flow now gives every crop a clear eating opportunity cost.
for(const c of Object.values(CROPS)){c.trait=c.description;FOODS[c.id]={id:c.id,name:c.name,sellPrice:c.sellPrice,energyRestored:c.energyRestored,healthRestored:Math.round(c.energyRestored*.4),icon:c.icon};if(!FOOD_IDS.includes(c.id))FOOD_IDS.push(c.id);}
export const CROP_IDS=Object.keys(CROPS);
export const INVENTORY_KEYS=[...CROP_IDS.flatMap(id=>[CROPS[id].seedKey,id]),...Object.keys(FOREST_ITEMS),'wood','grass','stone','meat','grilledMeat',...Object.values(DECORATIONS).map(d=>d.item)];
export const FIELD={x:352,y:224,cell:48,cols:4,rows:4};
// Preserve the original six save indices, then the later expansion to sixteen.
const cells=[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[3,0],[3,1],...Array.from({length:8},(_,i)=>[i%4,2+Math.floor(i/4)])];
export const PLOTS=cells.map(([col,row])=>({x:FIELD.x+24+col*48,y:FIELD.y+24+row*48,col,row}));

// Keep the original market salts stable when expanding the catalogue.
export const SALE_ITEMS={...Object.fromEntries(['tomato','strawberry','carrot','corn'].map(id=>[id,CROPS[id]])),...FOREST_ITEMS,...Object.fromEntries(CROP_IDS.slice(4).map(id=>[id,CROPS[id]])),meat:MEAT,grilledMeat:GRILLED_MEAT};
export const SALE_IDS=Object.keys(SALE_ITEMS);
