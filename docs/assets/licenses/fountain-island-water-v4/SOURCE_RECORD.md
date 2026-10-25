# Fountain island water animation v4 — source record

Date: 2026-10-21

Status: active City runtime animation.

## Source and method

- Stable source sprite: `docs/assets/licenses/fountain-island-user-v2/processed-flowing.png`
- Source SHA-256: `7a72f81a629794de5d8b718744ab5e8896171b8b7d2246f1552d5a95a4e00bd5`
- Source provenance: ChatGPT-generated PNG supplied by the user and already recorded in `../fountain-island-user-v2/SOURCE_RECORD.md`.
- Processor: `scripts/animate_user_fountain_water_v4.py` using Pillow and numpy only.
- Preserved diagnosed input: `old-animation-sheet.png`, SHA-256 `e99c5e085574afea45b4e436aa7a9e71ae610696bd02dc2aae1f14fca8d74d11`.
- No image-generation tool, external asset, remote runtime request or new dependency was used.

The water mask begins with a four-connected flood fill of source-water pixels
inside the stone-bounded basin and bowl. Three tight source-water corridors add
the native diagonal/discontinuous stream pixels. The mask is then asserted to
contain only the three exact source water colors, which excludes every stone,
plant, grass, barrel, curb and shadow pixel. Review files in this folder are
`water_mask.png`, `mask_overlay.png` and `diff_heatmap.png`.

## Old-loop diagnosis

The replaced 4-frame sheet had identical 207×214 frame sizes, 16 RGBA colors
per frame and zero changes outside the water mask. It changed 185, 174, 181 and
185 pixels from the source (about 10–11% of water) and changed 113, 109 and 109
pixels between consecutive frames; frame 4→1 changed 113. The visible problem
was not a broken seam: broad stream rectangles were recolored every frame,
highlights jumped two source pixels at a time, and basin dashes alternated at
the same time, producing busy motion.

## Current deterministic loop

The new loop has eight 207×214 frames at 8 fps. Highlights travel down fixed
one-pixel stream columns by exactly one source pixel per frame. Three flattened
2:1 landing ellipses use phase offsets 0, 3 and 5; seven fixed glints have
staggered two-frame visibility; three bowl pixels use a four-frame cycle; and
small landing splashes appear on frames 1, 3 and 5. All changes use the three
existing water colors `(125,146,156)`, `(167,178,185)` and `(218,231,236)`.

Automated results from `animation_report.json`:

- Water-mask pixels: 1,635; excluded-pixel contacts: 0.
- Changed water pixels by frame: 15, 92, 118, 15, 118, 127, 113, 122.
- Percent changed: 0.917%, 5.627%, 7.217%, 0.917%, 7.217%, 7.768%, 6.911%, 7.462% (all below 8%).
- Outside-mask changes: 0 in every frame.
- Palette violations: 0 in every frame.
- Frame transition changes: 96, 84, 122, 121, 93, 229, 77, 127.
- Loop seam 8→1 differs from transition 1→2 by 31 pixels, within the computed similarity tolerance of 34.

Runtime sheet: `public/assets/pixel/processed/fountain-island.png`, 1656×214,
SHA-256 `001d9fd2cc82225425e0e6b675cd5c25d2f1674cf244e05cccf49921c6816f53`.
Review exports are under `output/art/fountain-water-v4/`, including all eight
frames, the sheet, static base, masks, heatmap and light/dark 4× GIF previews.

Reproduction command (using the bundled Python environment or any environment
with Pillow and numpy):

```sh
python3 scripts/animate_user_fountain_water_v4.py \
  docs/assets/licenses/fountain-island-user-v2/processed-flowing.png \
  docs/assets/licenses/fountain-island-water-v4/old-animation-sheet.png \
  output/art/fountain-water-v4 \
  --runtime-sheet public/assets/pixel/processed/fountain-island.png
```

Final competition eligibility and rights acceptance remain the human team's
responsibility; the project does not claim exclusive or human-drawn authorship.
