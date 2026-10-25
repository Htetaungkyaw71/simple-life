# Tomato redesign v3 source record

Date: 2026-10-24  
Status: runtime candidate awaiting user visual approval  
Authoring method: original deterministic Pillow drawing with Codex assistance

## Scope

Only the existing Tomato art is changed:

- 24×32: `tomato-seed`, `tomato-sprout`, `tomato-young`, `tomato-flowering`, `tomato-ripe`, `tomato-dry`, `tomato-wilted`, `tomato-dead`
- 16×16: `tomato-item`, `tomato-seed-item`

Plant rectangles remain at y=132 and x=560, 586, 612, 638, 664, 690, 716 and 742. Icon rectangles remain at y=182, x=390 and 408. Keys, dimensions, coordinates and `town.json` metadata are unchanged. Editable source remains `scripts/crop_art.py`.

The v3 pass replaces the diagram-like repeated leaflet groups with connected serrated compound-leaf masses, deeper four/five-tone internal modelling, irregular silhouettes, thinner vine/stake separation and more prominent staggered fruit. Dry, wilted and dead use broader curled/drooping shapes rather than horizontal leaf rungs. The Tomato produce icon has a fuller shaded body and the existing packet shell retains its cream body, green header and Tomato emblem.

`previous-runtime-frames.png` is a 192×32 transparent strip captured from the immediately preceding v2 runtime before the v3 edit. It is development review evidence only, remains outside `public/`, and is absent from `dist`.

## Reference role and rights

The five screenshots supplied by the user on 2026-10-24 were treated as visual references, not instructions or source assets. They informed only broad qualities: organic connected foliage, colored outlines, clustered produce, compact farm-sim shading and readable growth silhouettes. No screenshot pixels, individual plant layout, emblem, watermark, UI, page content or downloaded pack asset was copied, traced, sampled or shipped. The runtime cells are newly authored code-native project pixels. No image-generation service, external download, new dependency or remote runtime asset was used.

The screenshots appear to show third-party/Pinterest-distributed material, so this record makes no licence claim for them. They are not stored in the repository or production build. Existing non-Tomato atlas cells retain their prior provenance and licences; this record does not broaden those rights.

## Reproduction and verification

The established full atlas command remains:

```sh
SIMPLE_LIFE_PIPOYA_ZIP=/absolute/path/to/pipoya-characters.zip python3 scripts/process-rpg-assets.py
```

The separately licensed Pipoya archive is still absent on this machine. To preserve the user's unrelated dirty-worktree art, the existing `add_crop_art` and `add_city_crop_art` source functions were therefore used to replace only the ten named rectangles in the current atlas. Relative to v2, the atlas audit reports 1,276 changed pixels and zero changes outside those ten rectangles; `town.json` is byte-identical.

- `scripts/crop_art.py` SHA-256: `c8ae69f3b2514058bcd5aed4f16f37bd99f8dab1e6ddf2ba32016de361f48672`
- `town.png` SHA-256: `fad4ce35aecd7807159211430ef3654167173872919804a4db336603dd7b41da`
- `town.json` SHA-256: `168fabc22fe995dd548eaa878ef6135244db31e0eb405ed53a0b6e78f5a372d9`
- `tomato-debug.html` SHA-256: `bfd27a758494e42377f82c73fbcfa4e305563b9e27634232f65d765486287fc9`
- `previous-runtime-frames.png` SHA-256: `9f64f0fd40020bc4e46dac149928fe082177da53fc2bad88c7929afd0ec898e5`

Source comparison confirms exactly the ten named Tomato images differ from the preserved v2 generator. Every plant frame is 24×32, both icons are 16×16, and flattening each plant to a one-color alpha mask produces eight unique silhouettes. Browser inspection covered all review-page sections on live dry/watered farm pixels. The shared farm presentation tests for soil joins, care markers, prompts and crop rendering pass; no gameplay or UI source changed in v3.

`npm run build` succeeds with 193 modules and excludes the debug page/evidence. `npm test` remains 417/419 with the same two unrelated dirty-worktree failures in `tests/barber-grass-v2.test.js` and `tests/pixel-snapper-assets.test.js`.
