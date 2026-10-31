# Grape palette-and-anchor update — 2026-10-25

Cleanup revision, 2026-10-26: background references are `(254,3,253)` and `(255,0,255)`; fringe references are `(111,24,111)`, `(151,25,171)` and `(212,31,210)`. Distance is 4 per RGB channel, and only background-connected 8-neighbour components are removable. Identical interior grape colours that do not connect to background are preserved.

This section supersedes the old source-exact color/sign metadata below. The 42×75 strip uses the deterministic exact-RGBA living-green lookup (`0.78` saturation, 8° toward olive, `0.94` bright-green lightness), changing 2,499 pixels with geometry and binary alpha unchanged. Its ripe greens retain a 37.65-point lightness span. Seed/dry/wilted/dead are byte-identical to `candidate-b-pre-palette.png`. Runtime metadata: scale 1, `anchorX: 20.5`, `baseOffsetY: 0`, `signOffsetY: -111`. Exact evidence is in `manifest.json`.

# Historical Grape runtime plant-sheet import

## Source and status

- User-supplied AI-assisted Pixel Snapper sheet: `ChatGPT Image 24 Oct 2026, 21_43_00-pixel-snapper.png`
- Repository source: `assets-src/ChatGPT_Image_24_Oct_2026__21_43_00-pixel-snapper.png`
- SHA-256: `d19784d3623cd37762c095257a72334cc73a5714ad5e28e733cfbde57dc811d0`
- Source: 370×123 RGBA, 16 colors, opaque source alpha; eight separated native 1px stages
- Runtime ID/key prefix: `grape` (the display name is Grapes); common 42×75 frame, scale 1, `signOffsetY: -91`

The user supplied this sheet and is responsible for usage rights. It is disclosed as AI-assisted Pixel Snapper output, not hand-drawn, CC0, exclusive, or automatically competition-eligible.

## Deterministic import

Boundary-connected magenta/fringe cleanup and the conservative bottom-connected region mask removed two pixels only from the dead-stage base. Proposed young/dry removals were automatically rolled back to protect connected plant art. No stage lost over 25%. Retained pixels are source-exact with no repainting, resampling, interpolation, blur, or palette conversion; alpha is 0/255. Trimmed stages: 29×14, 20×19, 32×50, 39×68, 40×75, 38×68, 42×57, 20×57. The dead stage remains one connected shape. Full evidence is in `manifest.json`.

