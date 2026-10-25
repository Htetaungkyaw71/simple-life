# Corn runtime plant-sheet import

## Source and status

- User-supplied AI-assisted Pixel Snapper sheet: `ChatGPT Image 24 Oct 2026, 21_41_59-pixel-snapper.png`
- Repository source: `assets-src/ChatGPT_Image_24_Oct_2026__21_41_59-pixel-snapper.png`
- SHA-256: `a98ada49ccdfb317b87ad9fbaae634bdb6dfc8823cbc2d0c50f8de0f9ecabfa3`
- Source: 369×119 RGBA, 16 colors, opaque source alpha; eight separated native 1px stages
- Runtime: eight `corn-*` keys, common 42×91 frame, scale 1, `signOffsetY: -107`

The user supplied this sheet and is responsible for usage rights. It is disclosed as AI-assisted Pixel Snapper output, not hand-drawn, CC0, exclusive, or automatically competition-eligible.

## Deterministic import

Boundary-connected magenta/fringe cleanup was followed by a repeated bottom-connected region mask. Removed opaque counts by stage were `0, 0, 1, 0, 4, 4, 3, 1`; the flowering removal was automatically rolled back because it would split the plant. No stage lost over 25%. Retained pixels are source-exact with no repainting, resampling, interpolation, blur, or palette conversion; alpha is 0/255. Trimmed stages: 30×16, 28×21, 40×54, 41×83, 42×91, 36×79, 39×57, 37×23. The dead stage remains one connected shape. Full evidence is in `manifest.json`.

