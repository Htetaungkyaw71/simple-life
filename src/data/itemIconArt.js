// Native item-icon frames integrated from the three reviewed 4x3 sheets.
// The smallest lossless common frame is 24x24; integer 1x is the nearest
// permitted display scale to the former 16x16 icons.
export const ITEM_ICON_FRAME_SIZE=24;
export const ITEM_ICON_KEYS=Object.freeze([
 'tomato-seed-item','strawberry-seed-item','carrot-seed-item','corn-seed-item','chili-seed-item','eggplant-seed-item','watermelon-seed-item','pumpkin-seed-item','grape-seed-item','blueberry-seed-item','sweetPotato-seed-item',
 'tomato-item','strawberry-item','carrot-item','corn-item','chili-item','eggplant-item','watermelon-item','pumpkin-item','grape-item','blueberry-item','sweetPotato-item',
 'meat-item','wild-berry-item','guava-item','mango-item','banana-item','orange-item','papaya-item','coconut-item','dragon-fruit-item','pineapple-item',
]);
export const ITEM_ICON_DISPLAY_SCALES=Object.freeze(Object.fromEntries(ITEM_ICON_KEYS.map(key=>[key,1])));
export const itemIconDisplaySize=name=>ITEM_ICON_DISPLAY_SCALES[name]?ITEM_ICON_FRAME_SIZE*ITEM_ICON_DISPLAY_SCALES[name]:16;
