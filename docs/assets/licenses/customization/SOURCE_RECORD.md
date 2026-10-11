# v0.17.2 structural correction — 2026-10-11

The user requests the old house structure and position with different designs retained. Runtime HomeArt now reuses original project `house-village-0`, generated directly at native 180×144 in `scripts/large_houses_art.py` and recorded in ../home-proportions/SOURCE_RECORD.md and original-cells.json. It is independently authored original project art; no new outside licence or screenshot sampling. `src/art/homePalette.js` changes colors/materials only on existing ink, retaining alpha, structural edges, door/window/flowerbox/step geometry. Eight distinct themed derivatives are cached in memory, not written into the atlas or downloaded. The original house HUD glyph is in src/ui/statusArt.js. Prior themed room and decoration code remains. AI assistance recorded in docs/AI_USAGE.md. Subjective human art review pending.

All eight runtime art files remain byte-identical; earlier independently credited environment/furniture/audio rights and evidence continue to apply. Verification includes actual native-frame alpha/step equality and browser previews/house entry. Runtime asset/dependency notice audit is under docs/verification/customize-access. No archive, unused pack, evidence or credentials enters production.

---

# Home and garden customization — 2026-10-11

User authorized eight house designs/interiors, paid Farm/Home customization and a 100,000-coin testing gift. Original code artwork created with OpenAI Codex assistance, no image-generation model or imported reference pixels: src/art/HomeArt.js and new procedural cases in src/art/DecorationArt.js. Prices/design names/layouts are original project data. AI disclosure: docs/AI_USAGE.md. Human subjective review remains pending.

Reused oak/palm: forest-oak-0 and forest-palm-0 are original Codex-assisted scripts/forest_canopy_art.py cells, documented in docs/assets/licenses/forest-reference.md (no new outside licence). Other reused runtime frames: bench, planter, flowers2, fence, barrel, lamp and existing home-* furnishings. These are already integrated local cells with retained source/licence/attribution evidence under the earlier forest/home/chopping/placement/story records; no new external use rights inferred. Home upgrades retain the existing house envelope and do not modify the town atlas. All eight runtime art files remain byte-identical to v0.16.6. No source ZIP, unused pack, evidence, documentation or credential enters production. Runtime SHA256 manifest/audit is in docs/verification/customization.
