# User-supplied barber chair and grass v2 — source record

Date: 2026-10-21

Status: active runtime assets.

## Sources

The user supplied both AI-assisted Pixel Snapper PNGs directly in this task
and explicitly requested their integration. Preserved source copies are
`barber-chair.png` and `grass.png` in this directory.

- Barber chair: 237×131, SHA-256 `a534d79001d3e5436b93e7bd0f4bcf5a9d9001876337a5c485b5c1bc59ffb029`.
- Grass: 101×101, SHA-256 `8c9c4b18728fcc0830adeaafe88135fd488d2d4e658c0c35071a9f6dad25833d`.

The user is responsible for confirming rights and competition eligibility for
these supplied AI-assisted sources. They are not represented as hand-drawn,
exclusive, CC0 or independently licensed by the project.

## Deterministic processing

`scripts/integrate_barber_grass_v2.py` uses Pillow and numpy only. It removes
the flat magenta background and its matte-edge shades, preserves hard binary
alpha, and nearest-scales visible pixels into the exact preceding runtime
bounds:

- The chair remains in `city-review-barber-chair`, a 28×42 atlas cell with
  visible bounds `[2,4,26,40]`, rendered at the existing 2× room scale.
- The grass remains in `snapper-grass`, a 79×79 atlas cell with visible bounds
  `[9,10,69,79]`, rendered at the existing 0.46 world scale.
- Two 79×79 derivatives, `snapper-grass-bend-left` and
  `snapper-grass-bend-right`, use a maximum four-source-pixel row shear. There
  is no blur, antialiasing, interpolation or new painted color.

The two bend cells occupy previously unused transparent space in the existing
Pixel Snapper atlas. No new runtime file, remote request or dependency is
added. `manifest.json` records source/output/runtime hashes and checks. The
review PNGs preserve the processed chair, all three grass phases and a 4×
nearest-neighbor contact sheet.

Runtime hashes after integration:

- `public/assets/pixel/processed/town.png`: `e489a3e4a93dd02bca065e524c8fa1b23a79b28d59e1cca4dbf97b0fbcd982c5`
- `public/assets/pixel/processed/pixel-snapper-assets.png`: `50d9c59aede37855a21f6331e71d930b9717d349a9a15655c072f5454e581c48`
- `public/assets/pixel/processed/pixel-snapper-assets.json`: `114be286be2da0ab7e89c58e25a65c2d269cc52bcb71d3f7a4b988567c1d9b53`

The new grass contact animation is visual-only. Player proximity selects one
of the two derived frames and the tuft springs back to its base frame after
departure. Vegetation identity, gathering, collision, inventory and save data
are unchanged.
