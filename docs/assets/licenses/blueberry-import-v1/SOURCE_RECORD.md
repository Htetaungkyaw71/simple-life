# Blueberry runtime plant-sheet import

## Source and status

- User-supplied AI-assisted Pixel Snapper sheet: `ChatGPT Image 24 Oct 2026, 21_43_05-pixel-snapper.png`
- Repository source: `assets-src/ChatGPT_Image_24_Oct_2026__21_43_05-pixel-snapper.png`
- SHA-256: `c6055d424350fb4cdb2c83d486a8625dd021126a073bdcacb68815b120437269`
- Source: 368×119 RGBA, 16 colors, opaque source alpha; eight separated native 1px stages
- Runtime ID/key prefix: `blueberry` (the supplied name was Blueberries); common 43×73 frame, scale 1, `signOffsetY: -89`

The user supplied this sheet and is responsible for usage rights. It is disclosed as AI-assisted Pixel Snapper output, not hand-drawn, CC0, exclusive, or automatically competition-eligible.

## Deterministic import

Boundary-connected magenta/fringe cleanup and the conservative bottom-connected region check removed no opaque plant pixels. Retained pixels are source-exact with no repainting, resampling, interpolation, blur, or palette conversion; alpha is 0/255. Trimmed stages: 30×16, 22×22, 39×40, 37×59, 43×73, 38×59, 38×48, 36×23. No stage lost over 25%; the dead stage remains one connected shape. Full evidence is in `manifest.json`.

