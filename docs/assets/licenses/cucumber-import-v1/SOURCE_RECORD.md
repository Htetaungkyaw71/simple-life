# Cucumber runtime plant-sheet import — 2026-10-25

## Source and rights

- User-supplied AI-assisted Pixel Snapper sheet: `ChatGPT Image 25 Oct 2026, 18_55_43-pixel-snapper.png`
- Repository source: `assets-src/ChatGPT_Image_25_Oct_2026__18_55_43-pixel-snapper.png`
- SHA-256: `1122eb7041a264dd76556e6322abfd2d16c251528862cb672c73aad6ebdde2c8`
- Source: 334×113 RGBA, 16 exact colors, opaque source alpha, eight separated native 1px stages

The user supplied this sheet and remains responsible for usage rights. It is disclosed as AI-assisted Pixel Snapper output, not hand-drawn, CC0, exclusive or guaranteed competition-eligible.

## Deterministic import

`scripts/import_sheet.py` verified the clean hard-pixel grid and removed the boundary-confirmed three-color magenta background/fringe, including 233 enclosed pixels that used those exact detected background colors. The spatial repeated-base audit found no removable non-seed ground region. Per-stage opaque soil removal is `0, 0, 0, 0, 0, 0, 0, 0`; no stage exceeds 25%, and the dead stage is one connected shape. The immutable cleanup result is `candidate-b-pre-palette.png`.

The living stages then use one exact-RGBA lookup with `SATURATION_SCALE=0.78`, a positive `HUE_SHIFT=8` interpreted toward yellow/olive, and `LIGHTNESS_SCALE=0.94` for bright greens. The lookup changes 2,490 pixels. Seed, dry, wilted and dead colors remain byte-identical. There is no filtering, resampling, resizing or palette-mode conversion; alpha remains strictly 0/255.

The eight stages are packed bottom-aligned in one 36×73 frame without clipping. Trimmed sizes are 27×15, 21×17, 31×43, 35×63, 35×73, 32×63, 36×51 and 34×24. The bottom-row audit selected one shared `anchorX: 17`. Runtime visual metadata is scale 1, `baseOffsetY: 0`, `signOffsetY: -109`; crop ID and keys remain `cucumber` / `cucumber-seed` through `cucumber-dead`. Exact source bounds, lookup pairs, anchor samples, cleanup checks, hashes and atlas coordinates are in `manifest.json`.

## Reproduction

```sh
/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/import_sheet.py \
  --input assets-src/ChatGPT_Image_25_Oct_2026__18_55_43-pixel-snapper.png \
  --crop cucumber \
  --keys cucumber-seed,cucumber-sprout,cucumber-young,cucumber-flowering,cucumber-ripe,cucumber-dry,cucumber-wilted,cucumber-dead \
  --output-dir docs/assets/licenses/cucumber-import-v1
```
