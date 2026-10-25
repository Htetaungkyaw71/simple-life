# Carrot runtime plant-sheet import

## Source and status

- User-supplied AI-assisted Pixel Snapper sheet: `ChatGPT Image 24 Oct 2026, 21_41_51-pixel-snapper.png`
- Repository source: `assets-src/ChatGPT_Image_24_Oct_2026__21_41_51-pixel-snapper.png`
- SHA-256: `1b77592a8c6eb5678405bdaa313e3f240a9f1cebe7cda4d85d4a8b5e94ed17e6`
- Source: 361×117 RGBA, 16 colors, opaque source alpha; eight separated native 1px stages
- Runtime: eight `carrot-*` keys, common 42×58 frame, scale 1, `signOffsetY: -74`

The user supplied this sheet and is responsible for usage rights. It is disclosed as AI-assisted Pixel Snapper output, not hand-drawn, CC0, exclusive, or automatically competition-eligible.

## Deterministic import

Boundary-connected magenta/fringe cleanup and the conservative bottom-connected region check removed no opaque plant pixels. Retained pixels are source-exact with no repainting, resampling, interpolation, blur, or palette conversion; alpha is 0/255. Trimmed stages: 26×14, 22×16, 37×31, 42×48, 41×58, 37×46, 37×33, 39×20. No stage lost over 25%; the dead stage remains one connected shape. Full evidence is in `manifest.json`.

