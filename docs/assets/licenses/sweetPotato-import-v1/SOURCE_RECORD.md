# Sweet Potato runtime plant-sheet import — 2026-10-25

## Source and rights

- User-supplied AI-assisted Pixel Snapper sheet: `ChatGPT Image 25 Oct 2026, 15_15_15-pixel-snapper.png`
- Repository source: `assets-src/ChatGPT_Image_25_Oct_2026__15_15_15-pixel-snapper.png`
- SHA-256: `3b28ca231610f2e01288b51786cb5a1ac52ee261c86653a8d8b297cec59e0d20`
- Source: 412×123 RGBA, 16 exact colors, opaque source alpha, eight separated native 1px stages

The user supplied this sheet and remains responsible for usage rights. It is disclosed as AI-assisted Pixel Snapper output, not hand-drawn, CC0, exclusive or guaranteed competition-eligible.

## Deterministic import

`scripts/import_sheet.py` verified the clean hard-pixel grid, removed only the boundary-connected magenta background, and found no removable non-seed base region. Per-stage opaque removal is `0, 0, 0, 0, 0, 0, 0, 0`; no stage exceeds 25%, and the dead stage is one connected shape. The immutable cleanup result is `candidate-b-pre-palette.png`.

The living stages then use one exact-RGBA lookup with `SATURATION_SCALE=0.78`, a positive `HUE_SHIFT=8` interpreted toward yellow/olive, and `LIGHTNESS_SCALE=0.94` for bright greens. The lookup changes 2,529 pixels. Seed, dry, wilted and dead colors remain byte-identical. There is no filtering, resampling, resizing or palette-mode conversion; alpha remains strictly 0/255.

The eight stages are packed bottom-aligned in one 58×45 frame without clipping. Trimmed sizes are 29×15, 20×15, 40×25, 57×39, 58×45, 50×43, 52×31 and 39×15. The bottom-row audit selected one shared `anchorX: 29.5`. Runtime visual metadata is scale 1, `baseOffsetY: 3`, `signOffsetY: -78`; crop ID and keys remain `sweetPotato` / `sweetPotato-seed` through `sweetPotato-dead`. Exact source bounds, lookup pairs, anchor samples, cleanup checks, hashes and atlas coordinates are in `manifest.json`.

## Reproduction

```sh
/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/import_sheet.py \
  --input assets-src/ChatGPT_Image_25_Oct_2026__15_15_15-pixel-snapper.png \
  --crop sweetPotato \
  --keys sweetPotato-seed,sweetPotato-sprout,sweetPotato-young,sweetPotato-flowering,sweetPotato-ripe,sweetPotato-dry,sweetPotato-wilted,sweetPotato-dead \
  --output-dir docs/assets/licenses/sweetPotato-import-v1
```
