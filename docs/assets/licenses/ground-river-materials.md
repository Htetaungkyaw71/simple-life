# Original ground and river materials — 2026-10-07, v0.4.4

User request: current trees/tall grass are approved; ground should resemble their richer grass/flowers screenshot and river should have realistic shore/depth texture. Three desktop screenshots dated 18:04:53, 18:06:21 and 18:47:40 are style references only. No pixels, tiles, layout or media are extracted or redistributed.

| Material | Creation source | Use / provenance |
| --- | --- | --- |
| Native shade/moss fields, habitat blends | src/art/groundSurface.js: paintGround | Deterministic integer hash plus interpolated native fields, muted regional palette; original project code with Codex assistance |
| Short grass, low clover/leaf marks, flower clusters and path pebbles | groundSurface.js: paintGroundDetails; Terrain.js | Original fillRect glyphs, native coordinates, safe path/water margins; code-authoring rather than model-generated imagery |
| Exposed earth/sand/turf banks, submerged stones, shallow/deep water | groundSurface.js: shoreDistance / paintWater | Original distance/material rules and hashed jagged rock shapes, clipped to existing shared water union |
| Reflections and ankle ripples | src/art/WaterView.js | Original camera-local Phaser Graphics; simulation-time phases, existing wading/crop logic |
| Cliff faces and stairs; approved tree/player/tall-grass art | Existing town atlas and existing provenance | Reused unchanged; retain LimeZu, ToffeeCraft, Channeechan/Eris Esra and original-project credits, independently from new material code |

Creator: Simple Life original project source, assisted by OpenAI Codex (GPT-6 family session identity). Exact backend ID not supplied. No exclusive-copyright claim for AI-assisted work and no claim of manual human drawing. No new raster/atlas file or external runtime asset. Forest ground is baked into a local native Canvas texture; it is not exported as a source pack. Code/Git history and AI_USAGE.md provide creation evidence.

Primary-source survey, 2026-10-07:
- [Top Down Grass, Beach and Water Tileset — Matiaan](https://opengameart.org/content/top-down-grass-beach-and-water-tileset): creator upload lists CC0 and terrain_tiles24.png. Inspected, not downloaded or integrated.
- [Grassy Top Down Tileset — Ringosnoop](https://ringosnoop.itch.io/grassy-top-down-tileset): search result indicates CC0; creator page retrieval timed out. Not relied on for an integration decision, not downloaded or used.
- Existing [Serene Village — LimeZu](https://limezu.itch.io/serenevillagerevamped) terrain remains licensed/credited independently in the prior source record.

Decision: extend the existing continuous-mask renderer with original native materials rather than introduce a new pack. Existing eight-file art allowlist and dependency licences are unchanged. No purchase, creator contact, upload, push or publication.
