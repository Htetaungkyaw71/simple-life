// Forest food is inventory, never a field crop or a purchasable seed.
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
export const FOOD_IDS=Object.keys(FOODS);
export const FOREST_ITEMS={wildBerry:FOODS.wildBerry,guava:FOODS.guava,mango:FOODS.mango,wildHide:{id:'wildHide',name:'Wild Hide',sellPrice:18,energyRestored:0,icon:'wild-hide-item'},...Object.fromEntries(FOOD_IDS.slice(3).map(id=>[id,FOODS[id]]))};
export const CLUB={id:'woodenClub',name:'Wooden Club',price:45,energy:5,cooldown:450,icon:'wooden-club-item'};
