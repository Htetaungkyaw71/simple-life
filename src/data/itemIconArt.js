// Native item-icon frames integrated from the three reviewed 4x3 sheets.
// The smallest lossless common frame is 24x24; integer 1x is the nearest
// permitted display scale to the former 16x16 icons.
export const ITEM_ICON_FRAME_SIZE=24;
export const ITEM_ICON_KEYS=Object.freeze([
 'tomato-seed-item','strawberry-seed-item','carrot-seed-item','corn-seed-item','chili-seed-item','eggplant-seed-item','watermelon-seed-item','pumpkin-seed-item','grape-seed-item','blueberry-seed-item','sweetPotato-seed-item',
 'cucumber-seed-item',
 'tomato-item','strawberry-item','carrot-item','corn-item','chili-item','eggplant-item','cucumber-item','watermelon-item','pumpkin-item','grape-item','blueberry-item','sweetPotato-item',
 'meat-item','wild-berry-item','guava-item','mango-item','banana-item','orange-item','papaya-item','coconut-item','dragon-fruit-item','pineapple-item',
]);
// Opaque bounds are measured from the installed native atlas frames. The UI
// scene is rooted at 2x, so .5 and 1 produce lossless 1x and 2x pixels.
const normalizedRows=[
 ['tomato-item',24,23,.9],['strawberry-item',19,24,1],['carrot-item',23,24,1],['corn-item',21,24,1],
 ['chili-item',17,18,1.3],['eggplant-item',20,24,1],['cucumber-item',18,14,1.3],['watermelon-item',21,24,1],
 ['pumpkin-item',23,24,1],['grape-item',17,19,1.2],['blueberry-item',24,22,1],['sweetPotato-item',24,24,1],
 ['meat-item',24,21,1],['wild-berry-item',18,18,1.2],['guava-item',20,24,1],['mango-item',24,24,1],
 ['banana-item',17,16,1.3],['orange-item',23,24,1],['papaya-item',24,22,1],['coconut-item',17,17,1.2],
 ['dragon-fruit-item',19,24,1],['pineapple-item',20,24,1],
];
export const ITEM_ICON_DISPLAY_METADATA=Object.freeze(Object.fromEntries(normalizedRows.map(([key,width,height,slotNativeScale])=>[key,Object.freeze({nativeSize:Object.freeze([width,height]),slotNativeScale,slotScale:slotNativeScale/2,tabScale:.5,worldScale:1})])));
export const ITEM_ICON_DISPLAY_SCALES=Object.freeze(Object.fromEntries(ITEM_ICON_KEYS.map(key=>[key,ITEM_ICON_DISPLAY_METADATA[key]?.slotScale??1])));
export const itemIconDisplayScale=(name,context='slot')=>{const item=ITEM_ICON_DISPLAY_METADATA[name];return item?(context==='tab'?item.tabScale:context==='world'?item.worldScale:item.slotScale):null;};
export const itemIconDisplaySize=(name,context='slot')=>ITEM_ICON_FRAME_SIZE*(itemIconDisplayScale(name,context)??ITEM_ICON_DISPLAY_SCALES[name]??2/3);
