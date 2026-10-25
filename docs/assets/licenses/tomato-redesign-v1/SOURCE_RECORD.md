# Tomato redesign v1 source record

Date: 2026-10-24  
Status: runtime candidate awaiting user visual approval  
Authoring method: original deterministic Pillow drawing with Codex assistance

## Scope

The only runtime cells replaced are:

- 24×32: `tomato-seed`, `tomato-sprout`, `tomato-young`, `tomato-flowering`, `tomato-ripe`, `tomato-dry`, `tomato-wilted`, `tomato-dead`
- 16×16: `tomato-item`, `tomato-seed-item`

The eight plant cells remain at atlas y=132 and x=560, 586, 612, 638, 664, 690, 716 and 742. The icons remain at y=182, x=390 and 408. Frame names, rectangles and metadata are unchanged. Editable source is `scripts/crop_art.py`; `scripts/crop_art.py.bak` is the user-requested pre-edit recovery copy.

The source defines a Tomato-only palette and helpers for the stake, string, vine, serrated leaves, star flowers, ripe/green fruit and distressed states. The packet uses the established project packet shell and the new Tomato emblem. No other crop generator differs between the backup and edited file.

`tomato-debug.html` reads these real atlas cells and live `soilPixels` output. Its vegetative and green-fruit studies are created in browser memory, have no atlas entries and are excluded from the production build.

## Provenance and rights

No external image, commercial-game sprite, downloaded pack or image-generation service was used. These cells are original code-native additions to the project. Existing non-Tomato atlas cells retain their existing provenance and licences; this record does not broaden those rights.

## Reproduction and checks

Full atlas command, after obtaining the separately licensed official Pipoya archive:

```sh
SIMPLE_LIFE_PIPOYA_ZIP=/absolute/path/to/pipoya-characters.zip python3 scripts/process-rpg-assets.py
```

The archive is intentionally not committed. On this machine the full command was attempted and stopped at the documented missing `/tmp/pipoya-characters.zip` dependency. The ten Tomato images produced by the same source functions were therefore pasted into their existing atlas rectangles. A pre/post pixel audit reported 1,974 changed pixels, all inside the ten named rectangles, and byte-identical atlas metadata for the targeted repack.

- `scripts/crop_art.py` SHA-256: `1e71854307b0276031009520883812a866886933336e81b7a97dc9137636b713`
- pre-edit `scripts/crop_art.py.bak` SHA-256: `2c9f15f447a57ebc00b05b6a6104232ac7b91d43f8a3e7f8b8cd42dde34a4eb1`
- resulting `town.png` SHA-256: `840114ca5961de9d88831536447db3650fd38c5c32826a152f202607757fc101`

Validation: `npm run build` passed; the full suite was 417/419 with only the two already-known unrelated dirty-worktree art assertions failing. Browser inspection covered the development review page and the isolated in-game farm gallery with water, basket and warning signs visible over the new plants.
