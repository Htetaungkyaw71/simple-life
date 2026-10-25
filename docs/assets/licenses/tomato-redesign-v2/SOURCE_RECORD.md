# Tomato redesign v2 source record

Date: 2026-10-24  
Status: runtime candidate awaiting user visual approval  
Authoring method: original deterministic Pillow drawing with Codex assistance

## Scope

Only these existing atlas cells were replaced:

- 24×32: `tomato-seed`, `tomato-sprout`, `tomato-young`, `tomato-flowering`, `tomato-ripe`, `tomato-dry`, `tomato-wilted`, `tomato-dead`
- 16×16: `tomato-item`, `tomato-seed-item`

Plant rectangles remain at y=132 and x=560, 586, 612, 638, 664, 690, 716 and 742. Icon rectangles remain at y=182, x=390 and 408. Keys, dimensions, coordinates and `town.json` metadata are unchanged. Editable source is `scripts/crop_art.py`.

The v2 palette uses colored green, maroon and brown outlines. Living stages have two-tone contact shadows; leaf clusters use three separated pointed leaflets; stakes, ties, large fruit, calyxes and decline poses remain Tomato-specific. The two development studies are derived in browser memory and have no runtime keys.

`previous-runtime-frames.png` is a 192×32 transparent strip captured from the immediately preceding Tomato version before the v2 source edit. It is used only by `tomato-debug.html`, remains outside `public/`, and is absent from the production build.

## Provenance and rights

No external image, commercial-game sprite, downloaded pack or image-generation service was used. These are original code-native project cells. Existing non-Tomato atlas cells retain their prior provenance and licences; this record does not broaden those rights.

## Reproduction and verification

The full atlas remains reproducible through the established pipeline after supplying the separately licensed external Pipoya archive:

```sh
SIMPLE_LIFE_PIPOYA_ZIP=/absolute/path/to/pipoya-characters.zip python3 scripts/process-rpg-assets.py
```

The archive remains absent on this machine, so the same `add_crop_art` and `add_city_crop_art` functions were used to paste the ten generated Tomato images into their existing rectangles. The in-place audit reports 2,105 changed pixels relative to the pre-task atlas, zero changes outside those ten rectangles and byte-preserved metadata.

- `scripts/crop_art.py` SHA-256: `62798af8802c2355b9df447d168ced26aef3c6c18160e669077832be82b65ab6`
- `town.png` SHA-256: `e1b1a3c2dc27d21223a7190c4452f797dbcfd030154f16560f64d05370065b0f`
- `previous-runtime-frames.png` SHA-256: `fbc6198a74a37facf5a3f57c108c3c60c0b655ff12bfc7fd2341a5635391787f`

Source-level comparison confirms exactly the ten named Tomato images differ from the preceding generator. Flattening each plant frame to a one-color alpha silhouette yields eight unique hashes. `npm test` reports 417/419 with only the two known unrelated dirty-worktree art assertions failing; `npm run build` succeeds with 193 modules. Browser inspection covers the expanded debug page and the isolated in-game farm gallery.
