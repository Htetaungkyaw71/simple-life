# Chili runtime plant-sheet import

## Source and status

- User-supplied AI-assisted Pixel Snapper sheet: `ChatGPT Image 24 Oct 2026, 21_43_35-pixel-snapper.png`
- Repository source: `assets-src/ChatGPT_Image_24_Oct_2026__21_43_35-pixel-snapper.png`
- SHA-256: `91cee93f88e31220ed51f7e26a25a8835212a3cec986c2c1ddbe8084abac09c6`
- Source: 370×123 RGBA, 16 colors, opaque source alpha; eight separated native 1px stages
- Runtime: eight `chili-*` keys, common 41×76 frame, scale 1, `signOffsetY: -92`

The user supplied this sheet and is responsible for usage rights. It is disclosed as AI-assisted Pixel Snapper output, not hand-drawn, CC0, exclusive, or automatically competition-eligible.

## Deterministic import

Boundary-connected magenta/fringe cleanup and the conservative bottom-connected region check removed no opaque plant pixels. Retained pixels are source-exact with no repainting, resampling, interpolation, blur, or palette conversion; alpha is 0/255. Trimmed stages: 31×14, 23×21, 34×43, 39×62, 40×76, 35×65, 40×55, 41×21. No stage lost over 25%; the dead stage remains one connected shape. Full evidence is in `manifest.json`.

