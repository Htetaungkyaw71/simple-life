# Original home and mobile art — 2026-10-09

Project-authored Python pixel artwork with OpenAI Codex assistance. No new external pack, reference image extraction, image generator or vendor alteration. The supplied Plant Tales screenshots describe desired house structure, colours and furnishing types; the pixels and room layout are independently drawn. Original work follows the project's existing original-addition policy; no third-party licence is introduced. Existing mixed-source atlas/farmer/NPC creator licences stay in ASSET_LICENSES.md.

- scripts/large_houses_art.py: thirteen 120×96 cottage finishes, common broad roof/central gable/flat facade/double-door/window/planter footprint; exact collision runs through row 85, steps rows 86–94 remain walkable.
- scripts/home_interior_art.py: twelve home-* native cells, patterned tile/wall/window/fireplace/log/rug/pottery/counter/table/bench/bed/plant art.
- scripts/refresh-home-art.py: idempotent in-place house replacement and only used interior frames appended to the existing town PNG/JSON. Regenerate from project root with bundled Pillow Python. Full process-rpg-assets.py also includes the home furnishings; existing selected rocky integration remains separate.
- src/ui/MobileControls.js: original procedural stepped circular joystick and existing themed action frames. No raster file.

Pixel RGBA hashes/sizes: original-cells.json. Runtime audit: ../../../verification/home-mobile/runtime-audit.json. All twelve new frame names are used by worldArt/interior room data. Runtime uses only the established eight asset paths; no ZIP/PSD/reference/source/provenance file enters dist. No dependency licence changes.
