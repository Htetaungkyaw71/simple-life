# Tomato snapped-sheet candidate record

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
