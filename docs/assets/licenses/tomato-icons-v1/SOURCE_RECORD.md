# Tomato snapped icon candidates

## Status

Approved and integrated. The runtime atlas entries `tomato-item` and `tomato-seed-item` use the selected 24×24 candidates under their existing keys. No other icon or gameplay asset was replaced.

## Source

- User-supplied file: `assets-src/ChatGPT_Image_24_Oct_2026__21_08_37-pixel-snapper.png`
- Byte-identical evidence copy: `source.png`
- SHA-256: `f43666f17eddf3f26c988d018ed167a393269aba58cad6a80672db8a66308c33`
- Canvas: 108×74 RGBA
- Palette: 15 exact colors
- Source alpha: fully opaque
- Background: `(255, 3, 253, 255)`

The source was supplied by the user as an AI-assisted Pixel Snapper result. The user is responsible for rights to it. It is not represented as hand-drawn, CC0, exclusive, or guaranteed competition-eligible.

## Deterministic processing

`scripts/import_tomato_icons.py` removes only the exact magenta-family background pixels, retains every non-magenta RGBA value unchanged, and pads the three connected sprites into transparent 24×24 review frames. It performs no redraw, repaint, scaling, interpolation, palette conversion, or image generation. Output alpha is strictly 0 or 255.

The three trimmed sprites are:

- selected produce: 21×21 pixels;
- alternate produce: 19×19 pixels;
- seed packet: 19×22 pixels.

The exact bounds, placements, hashes, palette result, and selected produce candidate are in `audit.json`.

## Display audit

The native frames remain 24×24. Tomato-only visual metadata applies a per-icon scale of `2/3`, so each frame displays in the established 16×16 footprint while retaining its source pixels in the atlas.

- Toolbar, Bag tabs/items, seed shop, and market buttons require the 16 px display footprint to avoid clipping or offset overflow.
- TradePanel detail art requires the factor to preserve the current 16 px compact and 32 px full-detail sizes.
- CropInfo requires it to preserve the current 12 px display and avoid title/stage overlap.
- Resource/reward seed rows require it to preserve their 12 px footprint.
- Planting and harvest fly-to-player effects are unclipped, but require it to preserve the current 16 px and 32 px effect sizes instead of growing to 24 px and 48 px.

The development-only `tomato-debug.html` shows the candidates beside Carrot at 1×, 2×, and 8×, plus real-scale toolbar and Bag slot mockups. Runtime installation is reproducible with `scripts/install_tomato_icons.py`; it clears only the two superseded atlas cells, appends the two native frames, and verifies all non-target frame pixels and metadata before writing. No gameplay data, key, save, or other crop/icon changed.
