# Forest shore creation record — 2026-10-07 / v0.4.5

Request: scattered river waves; remove Forest roads, waterfalls and old stone/stair scenery; more tree types, near-river raised ground; grass off bridges and tree trunks out of water. Supplied screenshots dated 22:06:18 and 22:07:33 are style/removal references only. No reference pixels, tiles, characters, map layout or interface are copied.

| Work | Reproducible source | Provenance |
| --- | --- | --- |
| palm-tree, 64×96 | scripts/forest_trees_art.py | Original Simple Life integer-pixel trunk rings, curved fronds/leaflets and coconuts; Codex-assisted source |
| willow-tree, 72×96 | scripts/forest_trees_art.py | Original trunk/branch clusters and drooping leaves, deterministic source |
| Ten grassy riverbanks | src/art/bankTerrain.js; src/data/forestGrowth.js | Original continuous warm earth faces, chipped strata, irregular turf and grassy slopes; shared stepped front/collision profile |
| Scattered waves/glints | src/art/waterRipples.js, WaterView.js | Original hashed seed positions, independent delays/periods, native Graphics motifs clipped off bridge decks |
| Broadleaf variants | Existing tree0/tree1/tree-tall/tree-wide cells in town atlas | LimeZu Serene Village revamped 1.9, CC BY 4.0; https://limezu.itch.io/serenevillagerevamped ; existing source/legal evidence under limezu/ and existing in-game attribution |

Original work is authored locally with OpenAI Codex assistance (GPT-6 family session identity; exact backend identifier unavailable). No manual-human-drawing or exclusive-copyright claim. No external image-generation service or newly downloaded pack. `process-rpg-assets.py` packs two new original cells into the existing atlas and records them in originalAdditions; development Pillow is covered by existing docs/licenses/Pillow-LICENSE.txt.

Audit against baseline 32ea2a3: every previous 553 atlas frame is pixel-identical after repacking; both Channeechan farmer sheets are byte-identical. Town atlas now has 555 frames. Existing ToffeeCraft FreeEnvironment, Craftpix and LimeZu pixels/credits keep their established provenance and licence scope. No new third-party art or dependency rights decision. Current tree placement is 796 trees plus 41 bamboo stands, with 4,033 grass clumps; trunks and full grass footprints stay dry, and tree crowns may overhang shores naturally.

Evidence: docs/verification/forest-shore/art-build-audit.json, results.json and screenshots; scripts/source and Git history. Production still contains the same eight allowlisted art files; archives, source PNGs, manifests, scripts and QA evidence never ship. No creator contact, purchase, upload, push, publication or competition submission.
