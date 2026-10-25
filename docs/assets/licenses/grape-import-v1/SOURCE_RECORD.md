# Grape runtime plant-sheet import

## Source and status

- User-supplied AI-assisted Pixel Snapper sheet: `ChatGPT Image 24 Oct 2026, 21_43_00-pixel-snapper.png`
- Repository source: `assets-src/ChatGPT_Image_24_Oct_2026__21_43_00-pixel-snapper.png`
- SHA-256: `d19784d3623cd37762c095257a72334cc73a5714ad5e28e733cfbde57dc811d0`
- Source: 370×123 RGBA, 16 colors, opaque source alpha; eight separated native 1px stages
- Runtime ID/key prefix: `grape` (the display name is Grapes); common 42×75 frame, scale 1, `signOffsetY: -91`

The user supplied this sheet and is responsible for usage rights. It is disclosed as AI-assisted Pixel Snapper output, not hand-drawn, CC0, exclusive, or automatically competition-eligible.

## Deterministic import

Boundary-connected magenta/fringe cleanup and the conservative bottom-connected region mask removed two pixels only from the dead-stage base. Proposed young/dry removals were automatically rolled back to protect connected plant art. No stage lost over 25%. Retained pixels are source-exact with no repainting, resampling, interpolation, blur, or palette conversion; alpha is 0/255. Trimmed stages: 29×14, 20×19, 32×50, 39×68, 40×75, 38×68, 42×57, 20×57. The dead stage remains one connected shape. Full evidence is in `manifest.json`.

