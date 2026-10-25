# Existing non-Pixel-Snapper review export — source record

Date: 2026-10-19

The user requested copies of artwork already present in Simple Life, explicitly without new image generation. `scripts/export_existing_non_snapper_assets.mjs` crops named atlas rectangles at their exact native dimensions and writes them to `output/deliverables/existing-non-pixel-snapper-assets/`. It does not resize, filter, recolour, repaint, trace or composite the pixels.

The output manifest is the authoritative machine-readable record. It lists 19 files with source atlas, source frame, dimensions, output SHA-256 and `nativePixelsUnchanged: true`. The two `previous-cafe-*` files come from the existing `cedar-table` and `cedar-chair` atlas frames and are supplied for comparison only; the current City does not place them.

Source atlases:

- `public/assets/pixel/processed/town.png` and `.json`
- `public/assets/pixel/world.png` and `.json`

Licence/terms: no new asset or licence is introduced. Each exported crop inherits the existing provenance and terms recorded for its atlas/frame in this repository, including the established original-project/AI-assistance disclosures and any applicable credited source terms. The exports are not represented as newly authored, CC0, exclusive, human-only, or guaranteed competition-eligible. They remain outside `public/`, `dist/` and the runtime asset allowlist.

AI use: Codex selected requested existing frame names and authored the deterministic crop/export script and manifest. No image model or external generation service was used.
