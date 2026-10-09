// Forest forage keeps its existing roster; farm fruit can also be eaten.
export const FOODS={
 wildBerry:{id:'wildBerry',name:'Wild Berry',sellPrice:6,energyRestored:12,icon:'wild-berry-item'},
 guava:{id:'guava',name:'Guava',sellPrice:12,energyRestored:20,icon:'guava-item'},
 mango:{id:'mango',name:'Mango',sellPrice:20,energyRestored:30,icon:'mango-item'},
};
Object.assign(FOODS,{
 banana:{id:'banana',name:'Banana',sellPrice:10,energyRestored:18,icon:'banana-item'},
 orange:{id:'orange',name:'Orange',sellPrice:14,energyRestored:22,icon:'orange-item'},
 papaya:{id:'papaya',name:'Papaya',sellPrice:22,energyRestored:32,icon:'papaya-item'},
 coconut:{id:'coconut',name:'Coconut',sellPrice:24,energyRestored:35,icon:'coconut-item'},
 dragonFruit:{id:'dragonFruit',name:'Dragon Fruit',sellPrice:36,energyRestored:42,icon:'dragon-fruit-item'},
 pineapple:{id:'pineapple',name:'Pineapple',sellPrice:28,energyRestored:38,icon:'pineapple-item'},
});
const FOREST_FOOD_IDS=Object.keys(FOODS);
export const FOREST_ITEMS={wildBerry:FOODS.wildBerry,guava:FOODS.guava,mango:FOODS.mango,wildHide:{id:'wildHide',name:'Wild Hide',sellPrice:18,energyRestored:0,icon:'wild-hide-item'},...Object.fromEntries(FOREST_FOOD_IDS.slice(3).map(id=>[id,FOODS[id]]))};
Object.assign(FOODS,{watermelon:{id:'watermelon',name:'Watermelon',sellPrice:85,energyRestored:35,icon:'watermelon-item'},grape:{id:'grape',name:'Grape',sellPrice:42,energyRestored:20,icon:'grape-item'},blueberry:{id:'blueberry',name:'Blueberry',sellPrice:38,energyRestored:16,icon:'blueberry-item'}});
export const FOOD_IDS=Object.keys(FOODS);
for(const food of Object.values(FOODS))food.healthRestored=Math.round(food.energyRestored*.4);
export const MEAT={id:'meat',name:'Meat',sellPrice:16,energyRestored:20,healthRestored:25,icon:'meat-item'};
FOODS.meat=MEAT;FOOD_IDS.push('meat');
export const AXE={energy:1,cooldown:500};
export const CLUB={id:'woodenClub',name:'Wooden Club',price:45,energy:2,cooldown:450,icon:'wooden-club-item'};
