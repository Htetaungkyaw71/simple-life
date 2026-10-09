# Town polish source evidence — 2026-10-09

## Original additions

scripts/large_houses_art.py deterministically draws thirteen native 120×96 RGBA cells, house-village-0 through house-village-12. Roof/gable/chimney forms, masonry/plaster/timber shading, doors/windows, ivy/flowerboxes and foundations are independently authored project artwork with Codex assistance. They are not enlarged screenshot crops or copied commercial-game buildings. Exact solid alpha runs generate src/data/largeHouseGeometry.js. The established city_art/atlas pipeline appends them while preserving every old frame. Source regeneration requires Pillow; no downloaded generator executes.

src/art/FountainView.js, WaterView.js and waterRipples.js implement original pixel stream/ring/flow/reflection rendering. Existing fountain base cells are retained. Thirteen active houses use the new cells at 2× scale (240×192 world pixels versus old 160×128). Old small house cells remain for legacy/source compatibility; no unused external pack is included.

## Existing sources retained

Merchant walking reuses already selected/recoloured Pipoya 32×32 directional cells, under the recorded custom personal/commercial game-use terms, with creator credit/source links unchanged. See [Pipoya source and licence](pipoya/README.md). No new external artwork was retrieved for this pass. LimeZu and all other mixed-atlas credits/licences remain as recorded in [City evidence](city-redesign.md) and ../../ASSET_LICENSES.md. Original additions do not relicense creator-owned pixels or permit standalone pack redistribution. Other-pack submission rights limitations are unchanged.

## Audit

[Runtime audit](../../verification/town-polish/runtime-audit.json) compares baseline 51701a6: all 662 earlier frame rectangles/metadata and their RGBA pixels are unchanged; 13 new houses have distinct pixel hashes, 675 total cells. The six other art files are unchanged. Production contains the same eight art files and no archives, manifests, source packs or QA evidence. User references are visual requirements only; no embedded document instructions or source pixels are reused. No image model, dependency, publication or push.
