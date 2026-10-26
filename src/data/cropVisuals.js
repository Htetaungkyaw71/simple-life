// Visual-only native-frame compensation. Gameplay crop data and sprite keys stay unchanged.
export const CROP_ICON_SCALES=Object.freeze({
 'tomato-item':2/3,
 'tomato-seed-item':2/3,
});

export const DEFAULT_CROP_BASE_OFFSET_Y=0;

// Native-frame anchors are measured from each frame's left edge. The sign is
// 36 world pixels tall, so `baseOffsetY - ripeVisibleHeight - 36` places its
// bottom edge directly above the ripe plant without overlap.
export const CROP_RENDER_METADATA=Object.freeze({
 tomato:Object.freeze({visualScale:1,anchorX:23.5,baseOffsetY:0,signOffsetY:-106}),
 strawberry:Object.freeze({visualScale:1,anchorX:23,baseOffsetY:2,signOffsetY:-81}),
 carrot:Object.freeze({visualScale:1,anchorX:20,baseOffsetY:0,signOffsetY:-94}),
 corn:Object.freeze({visualScale:1,anchorX:22,baseOffsetY:0,signOffsetY:-127}),
 chili:Object.freeze({visualScale:1,anchorX:20,baseOffsetY:0,signOffsetY:-112}),
 eggplant:Object.freeze({visualScale:1,anchorX:23,baseOffsetY:0,signOffsetY:-107}),
 watermelon:Object.freeze({visualScale:1,anchorX:28.5,baseOffsetY:3,signOffsetY:-79}),
 pumpkin:Object.freeze({visualScale:1,anchorX:29.5,baseOffsetY:4,signOffsetY:-70}),
 grape:Object.freeze({visualScale:1,anchorX:20.5,baseOffsetY:0,signOffsetY:-111}),
 blueberry:Object.freeze({visualScale:1,anchorX:21,baseOffsetY:2,signOffsetY:-107}),
 sweetPotato:Object.freeze({visualScale:1,anchorX:29.5,baseOffsetY:3,signOffsetY:-78}),
 cucumber:Object.freeze({visualScale:1,anchorX:17,baseOffsetY:0,signOffsetY:-109}),
});
