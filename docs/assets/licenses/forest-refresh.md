# Forest habitats, shelves and ambient sound — 2026-10-09

No new downloaded asset, dependency, recording, image model or runtime file. User screenshots guide broad habitat ordering and stepped grassy terrain only. Their pixels, exact boundaries and layout were not extracted.

Original Codex-assisted project code: src/data/forestHabitats.js (irregular climate boundaries), forestTerrain.js (dry segmented shelves/gaps), habitat ground/foliage/map adaptations, staged held-axe transforms, and src/audio/ForestAmbience.js (local filtered noise, wind/river/insects and short synthesized bird tones). Sound is generated with Web Audio after a user input, stops outside active Forest play, and has a local mute preference. No browser permission or remote audio service is involved.

Shelf faces reuse the existing native **cliff-face** atlas cell, extracted from LimeZu **Serene Village Revamped 1.9**, CC BY 4.0. The cached rendering preserves the native face pattern and source alpha, adds an original opaque brown backing, and adapts face-earth and grass-rim palettes for each habitat. The atlas source itself is unchanged. Creator/source/terms remain credited. Extraction coordinates and archive evidence: [forest-growth source record](forest-growth/SOURCE_RECORD.md), [LimeZu evidence](limezu). All mixed-source art retains its existing specific creator terms and release limitations.

All eight runtime art files and 838 atlas cells are byte-identical to v0.8.0 commit 2484fba. Vendor packs and unused source files remain outside the production allowlist. Reproduction: bundled Python with scripts/qa/forest-refresh-audit.py. [Audit](../../verification/forest-refresh/runtime-audit.json).
