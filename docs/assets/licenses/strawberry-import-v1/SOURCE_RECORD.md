# Strawberry snapped-sheet review record

## Status

Review-only candidate. The source, cleaned sheet, manifest and comparison-page assets are outside `public/`, the production atlas and `dist`. The eight runtime `strawberry-*` frames remain unchanged pending explicit user approval.

## Source

- User-supplied file: `ChatGPT Image 24 Oct 2026, 21_21_57-pixel-snapper.png`
- Requested import path: `assets-src/ChatGPT_Image_24_Oct_2026__21_21_57-pixel-snapper.png`
- Evidence copy: `source.png`
- SHA-256: `8a1b78c74396cb4dd0a9acd6718fde236ad9636e0852f02351075be57c40f4bf`
- Native canvas: 361×121 RGBA
- Source palette: 16 exact RGBA colours; alpha is 255 throughout
- Dominant background: `(254, 3, 253, 255)`

The user supplied this AI-assisted Pixel Snapper result and is responsible for the right to use it. This record does not represent it as hand-drawn, CC0, exclusive or automatically competition-eligible.

## Grid verification

The separated sheet contains exactly eight horizontal stage runs in the requested order. It is native hard-edged 1-pixel art, not a uniform 2× enlargement: the best 2×2 alignment has only 98 homogeneous non-background-touched blocks out of 1,778 (5.5118%). No reduction candidate was generated.

The retained review candidate uses one common 48×38 frame, the largest cleaned-stage footprint rounded up to the existing 48-pixel farm-row width. Every stage is bottom-centred at anchor `(24, 37)` with no resizing.

| Stage | Clean trimmed size | Opaque colours |
| --- | ---: | ---: |
| seed | 30×15 | 7 |
| sprout | 19×11 | 5 |
| young | 38×27 | 8 |
| flowering | 41×36 | 13 |
| ripe | 46×38 | 14 |
| dry | 40×35 | 13 |
| wilted | 41×25 | 8 |
| dead | 38×18 | 6 |

## Deterministic processing

`scripts/import_sheet.py` removes two exact keyed magenta-family colours: 37,632 background pixels `(254, 3, 253, 255)` and 163 fringe pixels `(180, 19, 169, 255)`. It removes 1,053 repeated baked base/ground pixels from stages 2–8 and two isolated non-magenta pixels, while retaining the seed-stage mound. It does not redraw, repaint, palette-convert, blur, interpolate or invoke an image-generation model.

All retained opaque RGBA values are exact members of the source palette. The candidate contains 14 opaque colours plus transparent RGBA, and alpha is strictly `0` or `255`. The final review-sheet SHA-256 is `ae88b004cb85efbc7fd53df7e667c12760c08f80c60d49d1da23aee1bbbcccfb`.

## Proposed runtime presentation after approval

The native 48×38 frames should render at crop scale `1`, matching the current native 48-pixel-wide Tomato density. Current Carrot remains a 24×32 frame rendered at scale `2`.

The existing shared Strawberry `signOffsetY: -54` already fits the shorter candidate. With the crop anchor at plot `y + 20`, the 38-pixel ripe frame starts at `y - 18`; the 2× water/basket/warning sign is 36 world pixels tall and spans `y - 54` through `y - 18`. It therefore sits directly above the ripe plant without overlap, so no Strawberry-specific sign-offset change is needed.

## Reproduction

```sh
/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/import_sheet.py \
  --input assets-src/ChatGPT_Image_24_Oct_2026__21_21_57-pixel-snapper.png \
  --crop strawberry \
  --frame-count 8 \
  --frame-size 24x48 \
  --keys strawberry-seed,strawberry-sprout,strawberry-young,strawberry-flowering,strawberry-ripe,strawberry-dry,strawberry-wilted,strawberry-dead \
  --output-dir docs/assets/licenses/strawberry-import-v1
```

Human visual approval is required before replacing any runtime atlas cell or crop metadata.
