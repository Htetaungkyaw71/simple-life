# Fountain island water animation v5 — source record

Date: 2026-10-21

Status: active City runtime animation.

## Source and method

- Stable source sprite: `docs/assets/licenses/fountain-island-user-v2/processed-flowing.png`
- Source SHA-256: `7a72f81a629794de5d8b718744ab5e8896171b8b7d2246f1552d5a95a4e00bd5`
- Source provenance: ChatGPT-generated PNG supplied by the user and already recorded in `../fountain-island-user-v2/SOURCE_RECORD.md`.
- Processor: `scripts/animate_user_fountain_water_v5.py`, using Pillow and numpy only.
- No image-generation tool, external asset, remote runtime request or new dependency was used.

The processor starts from the static source and does not read or reuse the
superseded animation sheet. It flood-fills the basin's exact source-water
pixels, erodes that surface by one pixel from the rim, and adds only exact
source-water pixels from the bowl, jet and three stream corridors. The final
1,247-pixel mask is asserted to contain no stone, plant, grass, barrel, curb or
shadow pixel. Review files in this directory are `water_mask.png`,
`mask_overlay.png`, `diff_heatmap.png` and `animation_report.json`.

## Deterministic loop

The output has eight 207×214 frames at 8 fps. The two basin landing points are
`(82,109)` and `(124,109)`; the central jet lands in the bowl at `(102,85)`;
the top-jet tip is `(102,73)`. Three fixed one-pixel stream columns use
two-pixel highlight dashes that descend one source row per frame with an
eight-frame period. The jet tip follows a four-frame 73/74/74/73 cycle.

Landing ripples use newly defined compact flattened ellipses with radii 2, 4
and 6, staggered by 0, 3 and 5 frames. There are no sweeping basin arcs or
crescents. Six fixed glints remain on for two staggered frames and three fixed
bowl pixels shimmer on a four-frame cycle. Every edit uses one of the source's
three exact water colors: `(125,146,156)`, `(167,178,185)` and
`(218,231,236)`.

## Automatic results

- Changed pixels from the source by frame: 21, 29, 33, 17, 24, 33, 24, 34.
- Changed share of mask: 1.684%, 2.326%, 2.646%, 1.363%, 1.925%, 2.646%, 1.925%, 2.727%; all below 3% (37 pixels).
- Consecutive transition changes, including frame 8→1: 36, 49, 38, 27, 42, 49, 50, 43.
- Frame 8→1 versus frame 1→2 delta: 7 pixels.
- Outside-mask changes: 0 in every frame.
- One-pixel rim-guard changes: 0 in every frame.
- New palette colors: 0 in every frame.
- Maximum connected changed pale component: 9×3 pixels (below the 12-pixel extent limit).
- Requested maximum ring radius: 6 pixels (below the 7-pixel limit).

Runtime sheet: `public/assets/pixel/processed/fountain-island.png`, 1656×214,
SHA-256 `805871dcd04f4ba49d6bd4c240388dd0acc1731dbcccbe94ca71c78f2c55543d`.
Complete review exports are under `output/art/fountain-water-v5/`.

Reproduction command (using the bundled Python environment or any environment
with Pillow and numpy):

```sh
python3 scripts/animate_user_fountain_water_v5.py \
  docs/assets/licenses/fountain-island-user-v2/processed-flowing.png \
  output/art/fountain-water-v5 \
  --runtime-sheet public/assets/pixel/processed/fountain-island.png
```

Final competition eligibility and rights acceptance remain the human team's
responsibility; the project does not claim exclusive or human-drawn authorship.
