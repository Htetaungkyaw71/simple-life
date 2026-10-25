# Tomato runtime palette-and-anchor update — 2026-10-25

This section supersedes the historical review status below. The already approved 48×70 Tomato runtime strip is active under its unchanged eight `tomato-*` keys. `scripts/import_sheet.py` now regenerates it from the immutable `candidate-b-pre-palette.png` by an exact RGBA lookup: living green pixels only use `SATURATION_SCALE=0.78`, an 8° shift toward olive, and `LIGHTNESS_SCALE=0.94` for bright tones. Seed, dry, wilted and dead frames are byte-identical to the pre-palette strip; geometry and binary alpha are identical in every frame. The lookup changed 2,255 living-stage pixels.

The shared bottom-row anchor audit selected `anchorX: 23.5`; runtime metadata is scale 1, `baseOffsetY: 0`, `signOffsetY: -106`. The 36-pixel sign ends exactly at the 70-pixel ripe-frame top. Exact lookup pairs, per-stage counts, anchor samples, hashes and atlas coordinates are in `manifest.json`. User-supplied/AI-assisted provenance and rights limitations remain as recorded below.

# Historical Tomato snapped-sheet candidate record

## Status

Review-only candidate. None of these files is in `public/`, the production atlas, or `dist`. Runtime Tomato art remains unchanged pending the user's choice.

## Source

- User-supplied file: `ChatGPT Image 24 Oct 2026, 16_12_15-pixel-snapper.png`
- Evidence copy: `source.png`
- SHA-256: `828677bcbb662832447e22d05ac5c7a16ef11d1c8d40776e6414b61f4cd4fc3e`
- Native canvas: 379×123 RGBA
- Source palette: 16 exact RGBA colours; alpha is 255 throughout
- Dominant background: `(254, 3, 253, 255)`

The source was supplied by the user as an AI-assisted Pixel Snapper result. The user is responsible for rights to it. It is not represented here as hand-drawn, CC0, exclusive, or guaranteed competition-eligible.

## Deterministic processing

`scripts/import_sheet.py` performs inspection and review staging only. It removes the four exact hard-pixel magenta-family colours, deletes the repeated baked ground mask from stages 2–8, removes isolated non-magenta single pixels, and packs remaining pixels bottom-centred. It does not repaint plant colours, blur, interpolate, trace, or invoke an image-generation model. Output alpha is restricted to 0 or 255.

Candidate A is unavailable because only 289 of 2,265 non-background-touched 2×2 blocks are homogeneous at the best offset. The sheet is native 1-pixel art rather than a uniform 2× enlargement, so a 2:1 reduction would discard authored pixels.

Candidate B preserves the source-native pixel density in eight 48×70 frames. Forty-eight pixels matches the on-screen width of the current 24-pixel frame rendered at 2×; 70 pixels is the largest cleaned stage height. Exact bounds, removals, placements and hashes are in `manifest.json`.

## Reproduction

```sh
/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/import_sheet.py \
  --input docs/assets/licenses/tomato-import-v1/source.png \
  --crop tomato \
  --frame-count 8 \
  --frame-size 24x48 \
  --keys tomato-seed,tomato-sprout,tomato-young,tomato-flowering,tomato-ripe,tomato-dry,tomato-wilted,tomato-dead \
  --output-dir docs/assets/licenses/tomato-import-v1
```

Human visual approval and any runtime integration remain pending.
