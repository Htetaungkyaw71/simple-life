# Strawberry runtime plant-sheet import

## Source and status

- User-supplied AI-assisted Pixel Snapper sheet: `ChatGPT Image 24 Oct 2026, 21_21_57-pixel-snapper.png`
- Repository source: `assets-src/ChatGPT_Image_24_Oct_2026__21_21_57-pixel-snapper.png`
- SHA-256: `8a1b78c74396cb4dd0a9acd6718fde236ad9636e0852f02351075be57c40f4bf`
- Source: 361×121 RGBA, 16 colors, opaque source alpha; eight separated native 1px stages
- Runtime: eight `strawberry-*` keys, common 46×47 frame, scale 1, `signOffsetY: -63`

The user supplied this sheet and is responsible for usage rights. It is disclosed as AI-assisted Pixel Snapper output, not hand-drawn, CC0, exclusive, or automatically competition-eligible.

## Deterministic import

`scripts/import_sheet.py` removed only boundary-connected magenta/fringe regions and checked for a repeated bottom-connected base region. No removable non-seed ground region was present, so no opaque plant pixel was removed. Retained pixels are source-exact; there was no repainting, resampling, interpolation, blur, or palette conversion. Alpha is strictly 0/255. Trimmed stages: seed 30×15, sprout 19×19, young 38×35, flowering 41×44, ripe 46×47, dry 40×44, wilted 41×35, dead 40×18. The dead stage remains one connected shape. Exact color counts, bounds, placements, hashes, cleanup checks and atlas coordinates are in `manifest.json`.
