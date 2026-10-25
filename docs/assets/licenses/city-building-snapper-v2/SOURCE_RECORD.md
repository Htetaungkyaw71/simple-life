# City building Pixel Snapper v2 source record

Date: 2026-10-18

## Source and selection

The user first supplied ten Pixel Snapper PNG derivatives for the City's residences and café, then supplied two approved Pixel Snapper shop derivatives and explicitly requested their integration. The final batch therefore contains twelve native files.

The twelve preserved source files are under `output/art/city-building-snapper-v2/sources/`. Their native dimensions, visible-alpha bounds and SHA-256 hashes are recorded in `output/art/city-building-snapper-v2/art-audit.json`. The batch contains:

- `house-01-terracotta-gable.png`
- `house-02-blue-slate.png`
- `house-03-green-bay.png`
- `house-04-balcony-vine.png`
- `house-05-plum-townhouse.png`
- `house-06-green-hipped.png`
- `house-07-alpine-timber.png`
- `house-08-grey-hipped.png`
- `house-09-broad-farmhouse.png`
- `cafe-terracotta-awning.png`
- `shop-clothing-sage-awning.png`
- `shop-barber-blue-roof.png`

These are user-adapted derivatives of the previously disclosed OpenAI image-generation outputs in `city-building-redesign-v1`. They inherit that batch's reviewed output terms and AI-art disclosure. No claim of CC0, exclusive rights, human-only authorship, legal eligibility or final competition acceptance is made.

## Runtime transformation

`scripts/export_city_building_snapper.mjs`:

1. copies each supplied RGBA canvas into a 1024×512 transparent local atlas without resizing, resampling, recolouring or redrawing;
2. records native frames in `public/assets/pixel/processed/city-buildings.json`;
3. derives visible alpha bounds and lower-foundation scanline collision data;
4. emits data-driven integer placement, porch and lawn records in `src/data/cityBuildingArt.js`.

The three screenshot-identified wide residences (`house-01`, `house-04`, `house-07`) and café use per-frame nearest-filtered display scales that produce a common 190-world-pixel visible height, matching the two accepted reference cottages. The clothing facade remains 2×; the barber uses 1.65× so both shop facades have the same 198-world-pixel visible height and nearly identical full-canvas footprint. The other six residences remain 2×. Runtime hashes after the final export:

- `city-buildings.png`: `5ee4a05e7325dfcb37387c639f64483f144caea919ba8a7a962fb13480d638b2`
- `city-buildings.json`: `ec656a73aff951dc2ad0cb570202ef4780a799b13bc4a601fbb263911ea74f50`

The source PNGs and audit evidence stay outside `public/`; production contains only the packed PNG/JSON pair. No network request, remote asset, new dependency or third-party pack is used at runtime.

## Human and AI roles

The user selected, processed and supplied the Pixel Snapper outputs, later approved new clothing/barber derivatives, and requested integration, scale matching, grass lots, three planter benches and removal of one Home building. Codex implemented the atlas/data/map/collision/route integration, tests, browser evidence and documentation. No new image-generation call or subagent was used for this integration pass.
