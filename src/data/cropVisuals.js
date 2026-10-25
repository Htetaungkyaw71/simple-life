// Visual-only native-frame compensation. Gameplay crop data and sprite keys stay unchanged.
export const CROP_ICON_SCALES=Object.freeze({
 'tomato-item':2/3,
 'tomato-seed-item':2/3,
});

// The sign is 36 world pixels tall. `-16 - ripeVisibleHeight` places its
// bottom edge directly above the ripe plant when the plant stays anchored at
// plot y + 20 with origin (.5, 1).
export const CROP_RENDER_METADATA=Object.freeze({
 tomato:Object.freeze({visualScale:1,signOffsetY:-86}),
 strawberry:Object.freeze({visualScale:1,signOffsetY:-63}),
 carrot:Object.freeze({visualScale:1,signOffsetY:-74}),
 corn:Object.freeze({visualScale:1,signOffsetY:-107}),
 chili:Object.freeze({visualScale:1,signOffsetY:-92}),
 eggplant:Object.freeze({visualScale:1,signOffsetY:-87}),
 watermelon:Object.freeze({visualScale:1,signOffsetY:-62}),
 pumpkin:Object.freeze({visualScale:1,signOffsetY:-54}),
 grape:Object.freeze({visualScale:1,signOffsetY:-91}),
 blueberry:Object.freeze({visualScale:1,signOffsetY:-89}),
});
