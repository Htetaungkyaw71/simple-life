# Original garden tools and seed pictures — v0.6.2

Date: 2026-10-08. Source: scripts/garden_tools_art.py, called by scripts/farm_crop_art.py in the established town-atlas pipeline. Original project 16×16 utility pixels: axe-item, hand-item, wood-item, grass-item. Improved original crop packets/markers: twelve -seed-item inventory cells and twelve -seed planting cells. Packet fruit emblems reuse the project's original crop-item pixels. Code-native deterministic raster work assisted by OpenAI Codex; no image model or external download. Not claimed human hand-drawn work.

The user references guide broad appearance only; no screenshot/commercial-game pixel or map extraction. No new external licence/dependency. Existing project licensing and separate retained creator terms in ASSET_LICENSES.md apply; this record does not relicense their work or certify submission rights.

Audit relative to f87c2cf: 556 → 560 frames; all prior frame coordinates unchanged; 532 prior pixels unchanged; only twenty-four original seed cells modified; four utility icons added. Both Channeechan farmer PNGs, world PNG/JSON and font PNG/XML are byte-identical. Retained LimeZu/ToffeeCraft/Craftpix/Channeechan/Eris Esra creator pixels/obligations remain. Evidence: ../../verification/garden-tools/runtime-audit.json and atlas-study.png. Runtime ships only the existing eight art files; scripts/source archives/QA gallery excluded.

Regenerate atlas with Python/Pillow: python3 scripts/extend-farm-art.py (or full process-rpg-assets.py). Reproduce the comparison after npm run build with python3 scripts/qa/garden-tools-audit.py. No publishing/push/submission performed.
