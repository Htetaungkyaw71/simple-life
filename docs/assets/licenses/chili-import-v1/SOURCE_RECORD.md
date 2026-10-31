# Chili palette-and-anchor update — 2026-10-25

Cleanup revision, 2026-10-26: background references are `(254,3,253)` and `(255,0,255)`; fringe references are `(157,33,139)` and `(213,23,204)`. Distance is 4 per RGB channel, and only background-connected 8-neighbour components are removable. This keeps the corrected young stem free of pink fringe without using a hue-wide deletion rule.

This section supersedes the old source-exact color/sign metadata below. The 41×76 strip uses the deterministic exact-RGBA living-green lookup (`0.78` saturation, 8° toward olive, `0.94` bright-green lightness), changing 2,017 pixels with geometry and binary alpha unchanged. Seed/dry/wilted/dead are byte-identical to `candidate-b-pre-palette.png`. Runtime metadata: scale 1, `anchorX: 20`, `baseOffsetY: 0`, `signOffsetY: -112`. Exact evidence is in `manifest.json`.

# Historical Chili runtime plant-sheet import

## Source and status

- User-supplied AI-assisted Pixel Snapper sheet: `ChatGPT Image 24 Oct 2026, 21_43_35-pixel-snapper.png`
- Repository source: `assets-src/ChatGPT_Image_24_Oct_2026__21_43_35-pixel-snapper.png`
- SHA-256: `91cee93f88e31220ed51f7e26a25a8835212a3cec986c2c1ddbe8084abac09c6`
- Source: 370×123 RGBA, 16 colors, opaque source alpha; eight separated native 1px stages
- Runtime: eight `chili-*` keys, common 41×76 frame, scale 1, `signOffsetY: -92`

The user supplied this sheet and is responsible for usage rights. It is disclosed as AI-assisted Pixel Snapper output, not hand-drawn, CC0, exclusive, or automatically competition-eligible.

## Deterministic import

Boundary-connected magenta/fringe cleanup and the conservative bottom-connected region check removed no opaque plant pixels. Retained pixels are source-exact with no repainting, resampling, interpolation, blur, or palette conversion; alpha is 0/255. Trimmed stages: 31×14, 23×21, 34×43, 39×62, 40×76, 35×65, 40×55, 41×21. No stage lost over 25%; the dead stage remains one connected shape. Full evidence is in `manifest.json`.

