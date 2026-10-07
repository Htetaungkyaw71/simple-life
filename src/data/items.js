// Forest food is inventory, never a field crop or a purchasable seed.
export const FOODS={
 wildBerry:{id:'wildBerry',name:'Wild Berry',sellPrice:6,energyRestored:12,icon:'wild-berry-item'},
 guava:{id:'guava',name:'Guava',sellPrice:12,energyRestored:20,icon:'guava-item'},
 mango:{id:'mango',name:'Mango',sellPrice:20,energyRestored:30,icon:'mango-item'},
};
export const FOOD_IDS=Object.keys(FOODS);
export const FOREST_ITEMS={...FOODS,wildHide:{id:'wildHide',name:'Wild Hide',sellPrice:18,energyRestored:0,icon:'wild-hide-item'}};
export const CLUB={id:'woodenClub',name:'Wooden Club',price:45,energy:5,cooldown:450,icon:'wooden-club-item'};
