# Crop palette and plot-anchor verification

This folder records disposable-save Google Chrome checks against the real Phaser canvas renderer. No user save was read or changed, and every observed request stayed on the local test origin.

## Visual evidence

- `before-after-whole-farm.png` places the checkpoint farm and final farm side by side beside the real grass, bushes and trees.
- `all-crops-stages-contact-sheet.png` contains every imported crop across all eight stages. In each source screenshot the upper two rows are dry soil and the lower two rows are watered soil.
- `ripe-watered-centers-contact-sheet.png` contains one isolated watered ripe plot per crop. Cyan plot outlines/crosshairs are post-capture QA annotations from `closeup-centers.json`; the underlying `*-raw.png` files are untouched live-game screenshots. The crosshair is the exact world-space center of the 48×48 soil square.
- `stages/*-harvest-flight.png` captures the live harvest action and fly-to-player item effect.

## Automated assertions

- All 11 crop families render all eight expected atlas keys twice in the stage grid, once on dry soil and once on watered soil.
- Water, basket and warning signs, the crop info panel, and the `E / Water` prompt are present.
- Harvest clears the plot, applies the existing yield and starts the real harvest animation/effect for every crop.
- All browser contexts reported no console/page errors and no remote runtime requests.
- `tests/crop-sheet-runtime.test.js` loads all 88 atlas frames, compares each pixel to its recorded candidate, asserts strict 0/255 alpha, validates shared anchors and sign geometry, and proves protected seed/dry/wilted/dead frames remain byte-identical to the immutable pre-palette candidates.

The world-green audit sampled 14,035 pixels from 35 named grass/bush/tall-grass/tree frames. Weighted 10th–90th percentile HSL is H 66.6–162.1°, S 24.2–38.5%, L 18.8–55.3%; the olive/sage interquartile core is H 74.1–109.7°, S 27.8–33.3%, L 31.2–52.5%.

Green pepper is absent because the crop registry has no green-pepper ID or sprite-key family. Cucumber is not a supplied import and is explicitly held at its previous render scale/offset.
