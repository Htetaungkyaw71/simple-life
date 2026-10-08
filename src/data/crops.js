import {FOREST_ITEMS} from './items.js';
export const WATER_WINDOWS=[{id:'morning',start:360,end:720,label:'AM 06-12'},{id:'evening',start:960,end:1320,label:'PM 16-22'}];
const crop=(id,name,seedPrice,sellPrice,growthDays,harvestYield,energyRestored,description,growthStages)=>({
 id,name,category:'field',seedKey:id==='tomato'?'seed':id+'Seed',produceKey:id,seedPrice,sellPrice,growthDays,harvestYield,energyRestored,regrow:false,unlock:null,description,
 watering:['morning','evening'],growthStages,stageCount:growthStages.length,stages:['seed','sprout','young','flowering','ripe'],icon:id+'-item',seedIcon:id+'-seed-item',
 sprites:Object.fromEntries(['seed','sprout','young','flowering','ripe','dry','wilted','dead'].map(key=>[key,id+'-'+key])),
});
export const CROPS={
 tomato:crop('tomato','Tomato',10,18,3,2,12,'A dependable first harvest.',['Seed / sprout','Young plant','Flowering','Ripe']),
 strawberry:crop('strawberry','Strawberry',18,28,4,2,8,'Sweet berries reward steady care.',['Seed / sprout','Young plant','Flowering','Fruit forming','Ripe']),
 carrot:crop('carrot','Carrot',28,70,4,1,22,'One valuable root beneath the soil.',['Seed / sprout','Young plant','Leafy crown','Root forming','Ripe']),
 corn:crop('corn','Corn',40,36,5,3,14,'A longer season, a generous harvest.',['Seed / sprout','Young plant','Tall stalk','Tassels','Cobs forming','Ripe']),
 chili:crop('chili','Chili',22,24,3,3,10,'Small peppers, a bright harvest.',['Seed / sprout', 'Young plant', 'Flowering', 'Ripe']),
 eggplant:crop('eggplant','Eggplant',32,46,4,2,18,'Purple fruit on a leafy bush.',['Seed / sprout', 'Young plant', 'Flowering', 'Fruit forming', 'Ripe']),
 cucumber:crop('cucumber','Cucumber',26,30,3,3,16,'Crisp fruit on curling vines.',['Seed / sprout', 'Young plant', 'Flowering', 'Ripe']),
 watermelon:crop('watermelon','Watermelon',55,85,5,2,35,'Large sweet melons on low vines.',['Seed / sprout', 'Young plant', 'Flowering', 'Fruit forming', 'Almost ripe', 'Ripe']),
 pumpkin:crop('pumpkin','Pumpkin',48,74,5,2,28,'Golden pumpkins need patient care.',['Seed / sprout', 'Young plant', 'Flowering', 'Fruit forming', 'Almost ripe', 'Ripe']),
 grape:crop('grape','Grape',36,42,4,3,20,'Sweet clusters on a small vine.',['Seed / sprout', 'Young plant', 'Flowering', 'Fruit forming', 'Ripe']),
 blueberry:crop('blueberry','Blueberry',30,38,4,3,16,'Blue berries on a low bush.',['Seed / sprout', 'Young plant', 'Flowering', 'Fruit forming', 'Ripe']),
 sweetPotato:crop('sweetPotato','Sweet Potato',24,38,3,2,24,'A warm root under broad leaves.',['Seed / sprout', 'Young plant', 'Flowering', 'Ripe']),
};
export const CROP_IDS=Object.keys(CROPS);
export const INVENTORY_KEYS=[...CROP_IDS.flatMap(id=>[CROPS[id].seedKey,id]),...Object.keys(FOREST_ITEMS)];
export const FIELD={x:352,y:224,cell:48,cols:4,rows:4};
// Preserve the original six save indices, then the later expansion to sixteen.
const cells=[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[3,0],[3,1],...Array.from({length:8},(_,i)=>[i%4,2+Math.floor(i/4)])];
export const PLOTS=cells.map(([col,row])=>({x:FIELD.x+24+col*48,y:FIELD.y+24+row*48,col,row}));

// Keep the original market salts stable when expanding the catalogue.
export const SALE_ITEMS={...Object.fromEntries(['tomato','strawberry','carrot','corn'].map(id=>[id,CROPS[id]])),...FOREST_ITEMS,...Object.fromEntries(CROP_IDS.slice(4).map(id=>[id,CROPS[id]]))};
export const SALE_IDS=Object.keys(SALE_ITEMS);
