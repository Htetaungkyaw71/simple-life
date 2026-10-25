# Crop world-green and anchor audit — 2026-10-25

## World palette sample

The audit sampled opaque green/yellow-green pixels from the real `town` atlas in named `grass`, `grass0–3`, `grass-detail0–3`, `bush`, four `nature-bush-*`, nine `tall-grass-*`, `tree0–3`, `tree`, `tree-tall`, `tree-wide`, Guava, Mango, Acacia, Palm and Willow frames. No screenshot or remote asset supplied colors.

Across 14,035 sampled pixels and 409 exact RGB colors, the weighted 10th–90th percentile ranges are H 66.6–162.1°, S 24.2–38.5%, L 18.8–55.3%. The tighter interquartile ranges are H 74.1–109.7°, S 27.8–33.3%, L 31.2–52.5%. The broad hue tail reflects the atlas's existing teal shrubs/trees; the most repeated olive/sage colors cluster around H 66.6–109.7° and S 25–33%.

## Deterministic correction

`scripts/import_sheet.py` uses an exact per-source-color lookup for dominant-channel greens in living stages only. The three tuning constants are `SATURATION_SCALE=0.78`, `HUE_SHIFT=8.0` (positive means subtract toward yellow/olive), and `LIGHTNESS_SCALE=0.94` for bright greens. It never filters, resizes or converts palette mode. Pre/post alpha planes are asserted byte-identical. Seed, dry, wilted and dead are protected byte-for-byte, which keeps soil and distressed tan/brown hues exact. Ripe green contrast spans range from 16.27 to 37.65 HSL-lightness points across the crop set.

Horizontal anchors are the median of weighted opaque-pixel centers in the bottom six rows of sprout, young, flowering and ripe frames. This follows stems/bases and bottom-row visual mass rather than asymmetric bounding boxes. All stages share the selected crop anchor. Exact per-stage centers and runtime atlas coordinates are stored in every per-crop `manifest.json`.

Source/runtime rights are unchanged from the linked per-crop records. This audit introduced no new external asset or dependency.
