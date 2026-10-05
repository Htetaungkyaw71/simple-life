# Assets, licences and creation sources
## Pass 2 selected external environment — recorded before integration, 2026-10-04
| Asset / pack | Creator | Original page | Direct download | Licence | Attribution | Downloaded | Files used | Modifications | In-game use |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tiny Town 1.1 | Kenney | https://kenney.nl/assets/tiny-town (also https://opengameart.org/content/tiny-town) | https://kenney.nl/media/pages/assets/tiny-town/a415fbeb49-1735736916/kenney_tiny-town.zip | CC0 1.0 Universal | Tiny Town by Kenney (www.kenney.nl), CC0; credit voluntary | 2026-10-04 | Selected Tiles/tile_*.png; exact tile IDs recorded in processed/manifest.json | Palette normalization, tile composition, atlas packing; no smoothing | Primary terrain, paths, vegetation, buildings, fences, props in Home/Farm/City |

Untouched archive: public/assets/vendor/kenney/tiny-town/kenney_tiny-town.zip. Licence, official-page copy, URL and archive SHA256: docs/assets/licenses/. Runtime adapted assets: public/assets/pixel/processed/. Build excludes the source archive and all unused pack files. No marketplace preview image is used. No additional external character pack: retained original characters are redrawn to a compatible smaller pixel grid.

The original-only statements below describe the previous 0.1.1 release. Pass 2 uses the CC0 environment above alongside retained original furniture, crop, UI and character work.
## Current original pixel assets — 2026-10-03–04
All files below were newly authored with Codex assistance for Simple Life using deterministic integer-pixel drawing in `scripts/generate-pixel-assets.py`. They are original temporary game assets, not downloaded art or copied reference assets. PNGs are rasterized by Pillow without smoothing, then loaded locally by Phaser. There are no externally licensed art packs. Team usage-rights/human-review confirmation remains required before the final competition declaration; this file is not a signed legal opinion.

| Runtime file / atlas frames | Purpose | Creator/source |
| --- | --- | --- |
| `public/assets/pixel/world.png`, `world.json` | Packed source atlas and named frames | Original Codex-assisted project code, generator above |
| `grass0`–`grass3`, `path0`–`path1` | 16×16 tropical terrain and paths | Same generator, seeded pixel variations |
| `soil`, `watered-soil`, `crop0`–`crop5` | Individual farm plots, seed/sprout/growing/mature/wilt/dead crop artwork | Same generator; tomato only |
| `floor0`–`floor1`, `stone`, `wall`, `water0`–`water1` | House interior, masonry, walls and pond | Same generator |
| `tree0`–`tree1`, `palm`, `bush`, `flowers`, `rock` | Layered vegetation and ground decoration | Same generator |
| `fence`, `sign`, `house`, `window`, `door` | Farm structures and navigation | Same generator |
| `bed`, `table`, `dresser`, `counter`, `pot` | Interior furniture and market fixtures | Same generator |
| `seed-shop`, `produce-shop` | Original city stalls and shopkeepers | Same generator |
| `seed`, `can`, `sickle`, `tomato` | Actual item/tool inventory icons | Same generator; no emoji |
| `coin`, `heart`, `energy`, `marker`, `sun`, `moon`, `pause` | Currency, HUD and interaction art | Same generator |
| `public/assets/pixel/boy.png`, `girl.png` | 24×32 frames, idle + 2 walk frames per direction, 12 frames each | Same generator, original silhouettes |
| `public/assets/pixel/font.png`, `font.xml` | Original 5×7 bitmap glyphs; ASCII lowercase reuses uppercase forms | Same generator; no bundled third-party font |
| `src/art/worldArt.js`, `src/ui/pixelWidgets.js` | Pixel rug/borders, atlas composition and UI frames | Original Codex-assisted integer-coordinate source |

The previous runtime Graphics scenery and DOM/CSS character/icon approximations were replaced. No music, sound effects, voice, external images or font files have been added. Public asset README and generation source retain reproducible creation evidence. The Plant Tales YouTube reference is visual inspiration only; none of its media/assets/code is redistributed.

## Libraries and development tools
- Phaser 3.90.0, Phaser Studio, https://github.com/phaserjs/phaser — MIT; runtime engine. Licence copied under docs/licenses.
- Vite 6.4.3, Vite contributors, https://github.com/vitejs/vite — MIT; local build/dev tool. Exact transitive versions, registry sources and integrity hashes are in package-lock.json. Local evidence in docs/licenses/DEPENDENCIES.md and accompanying files.
- Pillow, Python Pillow contributors, https://github.com/python-pillow/Pillow — HPND (PIL Software License). Used only to rasterize project-authored pixel geometry; not distributed with runtime. Licence evidence copied under docs/licenses/Pillow-LICENSE.txt.
- Node.js/npm: local build/tests. Python: optional asset regeneration only. Playwright/agent-browser: development QA only, not runtime dependencies. OpenAI Codex: disclosed AI coding/art assistance; details in AI_USAGE.md.

## Pass 2 integration manifest and retained original work
The final environment atlas contains **45 named frames**, assembled from **49 selected Kenney PNG tiles plus original additions**. Exact IDs and named frame inventory: public/assets/pixel/processed/manifest.json. Palette adaptation and composition source: scripts/process-town-assets.py. Every source tile ID in the manifest corresponds to Tiles/tile_NNNN.png in the untouched archive. No source PSD/Aseprite/project file is used or shipped.

| Files / frames | Creator and source | Modifications / use | Rights evidence |
| --- | --- | --- | --- |
| processed/town.png + town.json: grass, grass-detail, flowers, bush, mushroom, fence, post, fence-v, crate, sign, well, wheelbarrow, barrel, path + eight path edges/corners, tree, three roof parts, house, house-blue, shed | Kenney, Tiny Town 1.1; official URL/download in table above | Palette lookup; grass base made transparent for overlay; modular composition and atlas packing. Home/Farm/City primary environment | CC0 1.0; creator License.txt and official page in docs/assets/licenses/ |
| Same processed atlas: plaza, bench, lamp, mailbox, scarecrow, notice, fountain0/1, butterfly0/1, dust, bed, table, npc0/1/2 | Original project art authored with Codex assistance in process-town-assets.py, 2026-10-04 | Original integer pixel geometry; NPCs are palette variants of original farmer frames. Furniture, civic/farm landmarks, ambient effects and optional dialogue characters | Original project work; AI_USAGE.md. Not represented as Kenney art |
| processed/boy.png and girl.png | Original Codex-assisted project characters, 2026-10-04 | Redrawn as 16x24 frames, retaining hats, farm clothes, boy/girl identity and independent four-direction animation; no resampling or external character pack | Same original-project provenance |
| world.png/world.json and font.png/font.xml | Retained original pass-1 code-native pixel assets | Crop stages, soil/water, floor/walls/windows/dresser, market stalls, plants/stones, item/HUD icons, interaction marker and bitmap text. Some environment entries are superseded; no new licence claim | Original inventory/source above; AI_USAGE.md |

No externally generated AI imagery or PixelLab output was used. No audio pack was added. The production asset list contains only eight runtime PNG/JSON/XML files, with no vendor ZIP or unused pack files. Voluntary credit: **Tiny Town by Kenney (www.kenney.nl), CC0 1.0; palette/composition adapted for Simple Life.**

## Current replacement — Serene Village craftsmanship pass (2026-10-05)

This entry supersedes Tiny Town as the active environment family; the Kenney archive and its evidence remain historical. No Kenney-derived tile is in the current `town` runtime atlas.

- **Name / creator:** Serene Village revamped v1.9, LimeZu.
- **Official source:** https://limezu.itch.io/serenevillagerevamped
- **Licence:** Creative Commons Attribution 4.0 International, https://creativecommons.org/licenses/by/4.0/ . Allows sharing/adaptation including commercial games, subject to attribution, licence link, change identification, and no additional restrictions on licensed material.
- **Credit:** “Serene Village revamped by LimeZu — CC BY 4.0. Adapted palette and atlas for Simple Life.” In-game Credits includes clickable source/licence links. Original missing game art is identified separately.
- **Downloaded:** 2026-10-05, official free itch.io flow, no account/payment.
- **Untouched source:** `public/assets/vendor/limezu/serene-village/Serene_Village_revamped_v1.9.zip`, SHA-256 `22f5b68d950fd8eeafe65690daa1723c74b68ccbc3db7240c3bd4935915e9041`.
- **Original files used:** `SERENE_VILLAGE_REVAMPED/Serene_Village_16x16.png`; `SERENE_VILLAGE_REVAMPED/Animated stuff/door_16x16.png`. No higher-resolution duplicates, demos or previews used.
- **Modifications:** native-resolution extraction/repacking, selected green hues moved toward jade, original chimney/market-awning additions. Exact source rectangles in `public/assets/pixel/processed/manifest.json`; reproducible `scripts/process-rpg-assets.py`.
- **Locations:** Home, Farm, City and title-world backdrop; trees, bushes/flowers, paths, houses, shed, shop fronts, fences, rocks and doors.
- **Evidence:** `docs/assets/licenses/limezu/serene-village-source.html` (creator page declares CC BY 4.0), `CC-BY-4.0.txt` (full legal text), this attribution/change record. Archive has no standalone licence; the creator's explicit page declaration is preserved.
- **Original additions:** boy/girl 24×32 sheets, NPC variants, missing kitchen/bed/storage/table/chair/rug/window/indoor tiles, fountain, utility props, water overlays, farming soil and effects. Created in the project pipeline, not from Modern Interiors or another pack. Existing original crop atlas, bitmap font, UI icons and markers remain. AI assistance recorded in AI_USAGE.md; no claim of exclusive copyright is made for AI-assisted originals.
- **Rejected companion:** Modern Interiors Free v2.2 is non-commercial only and was not integrated. No purchased, login-only, GPL or ShareAlike assets were introduced.
- **Distribution:** eight allowlisted runtime files only. Untouched ZIP and unused files never ship in `dist/`.
