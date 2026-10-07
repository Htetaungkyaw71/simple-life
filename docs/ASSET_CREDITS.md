## Current forest growth — 2026-10-07, v0.4.2
Native cliff faces/stairs/rims reuse **Serene Village 1.9 by LimeZu**, https://limezu.itch.io/serenevillagerevamped , **CC BY 4.0**, https://creativecommons.org/licenses/by/4.0/ . Four source rectangles are recorded in the manifest; extraction/repacking, existing palette/atlas adaptations. Existing in-game linked LimeZu credit applies. Tall grass/bent clumps and added farmer jump poses are original project work authored with Codex assistance, not pixels from the user's supplied packs. Those two packs were inspected and excluded for licence incompatibility; see assets/licenses/forest-growth/SOURCE_RECORD.md. Existing Craftpix, original UI/font/crops and dependency credits remain.

## Current selected Craftpix work — 2026-10-07, v0.4.1
Craftpix — Free Top-Down Hunt Animals Pixel Sprite Pack (Boar, Fox, Hare, Deer, Black Grouse), Free Top-Down Ruins Pixel Art (selected Brown-gray/Snow/Sand/Water fragments) and Free Predator Plant Mobs Pixel Art Pack (three idle plant variants). Craftpix Freebie Products §2, https://craftpix.net/file-licenses/ . Supplied by user; native PNG cells extracted/repacked in craftpix_art.py, no resampling/recolour. Exact files, rectangles, hashes and official pages: assets/licenses/craftpix/SOURCE_RECORD.md and processed/manifest.json. Voluntary in-game attribution with source/licence links. Source art excluded from production. Four waterfall-flow frames, union water terrain/currents and wading ripples are original Codex-assisted code, not Craftpix. LimeZu CC BY 4.0 environment and original farmers/UI remain independently credited.

# Asset credits
Historical foundation environment (superseded): **Tiny Town 1.1 by Kenney (www.kenney.nl), CC0 1.0 Universal**. Palette and tile composition adapted for Simple Life. Official source: https://kenney.nl/assets/tiny-town .
Original characters, crop stages, furniture, effects, item/HUD icons and bitmap font: project work authored with OpenAI Codex assistance. This includes the smaller farmers, NPC colour variants and supplemental town/farm props. No copied commercial-game art, external font, music or voice.
Phaser: MIT runtime engine. Vite: MIT build tooling. Pillow: HPND optional art-generation tooling. Full asset inventory, provenance, download URL, modifications and licence evidence: ASSET_LICENSES.md and assets/licenses/. AI disclosures: AI_USAGE.md.

## Active environment credit (replacement craftsmanship pass)

Serene Village revamped v1.9 by **LimeZu**, [source](https://limezu.itch.io/serenevillagerevamped), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Palette/atlas adapted; chimneys added for Simple Life. This replaces Kenney as the runtime environment. Original farmers, furnishings, crop art, font and canvas UI are documented in ASSET_LICENSES.md. Title → Credits exposes the required source/licence links.

## Farming presentation additions — 2026-10-06
Ten original Codex-assisted frames in the current town atlas: field-soil, field-watered, tomato-seed, tomato-sprout, tomato-young, tomato-flowering, tomato-ripe, tomato-dry, tomato-wilted and tomato-dead. Reproducible source: scripts/crop_art.py. No new external asset or licence. LimeZu remains the active environment creator; Kenney above is historical.

## Milestone 1.1 original UI and navigation art — 2026-10-06
Original Codex-assisted Simple Life pixel masks: leaf, game clock, morning sun, evening moon, water drop, warning, harvest basket and eight-direction arrows (`src/ui/statusArt.js`). Original wooden FARM board/post geometry and bitmap label (`src/art/worldArt.js`). Source URL: none; created locally for this project, with reproducible source and Git history. The existing original tomato icon and font are reused. No new third-party asset/licence or runtime image file. Art evidence: `docs/assets/licenses/milestone-1.1-original-ui.md`; AI disclosure: AI_USAGE.md. LimeZu attribution and the runtime asset allowlist remain intact.

## Milestone 1.2 reuse — 2026-10-06
No runtime raster/atlas/font file or external asset changed. The existing original soil/crop art and licensed LimeZu environment/props are reused for matching purchased fields/farms. FARM board geometry is retained with a smaller centered original bitmap label; its southern duplicate is removed. No new licence or dependency. Source-authored labels and canvas menus remain original Codex-assisted project work. Evidence: assets/licenses/milestone-1.1-original-ui.md and original-farming-art.md; existing LimeZu legal/source records and eight-file build allowlist remain unchanged.

## Milestone 2 original City/crop additions — 2026-10-06
39 original Codex-assisted frames extend the town atlas from 96 to 135: three new crops × eight states (24×32), four produce icons and four seed packets (16×16), two awning stalls (80×64), four merchant idle/blink frames derived from the existing original project NPCs (24×32), and one stone paving tile (16×16). Reproducible source: scripts/crop_art.py, packed by scripts/process-rpg-assets.py; manifest records original/addition provenance. CITY/HOME wooden signs and market arrows are original source geometry/glyphs in worldArt/statusArt. LimeZu environment props/tiles remain credited CC BY 4.0 with existing licence evidence. No new pack/download, image service, dependency, font or audio. Art evidence: assets/licenses/milestone-2-original-city.md. Runtime allowlist still contains eight files.

## 2026-10-07 reuse and presentation
Compact shop cards and day/night tint are original Codex-assisted Phaser canvas geometry/code. Original crop/packet/coin icons, font and sun/moon masks are reused; no runtime art file or external asset/licence/dependency changed. Existing LimeZu CC BY 4.0 credits remain. Creation evidence: assets/licenses/day-night-ui.md; AI disclosure: AI_USAGE.md. Eight-file production art allowlist is preserved.

## Milestone 3 forest assets — 2026-10-07

| Asset / local frame | Creator/source | License/provenance | Modifications/use |
| --- | --- | --- | --- |
| wild-berry-item, guava-item, mango-item, wild-hide-item, wooden-club-item, stash-bag, boar0–3, forest-log, shrine-stone | Simple Life original project work, authored with OpenAI Codex assistance in scripts/forest_art.py | Original integer-pixel source and Git history; no third-party source URL; no exclusive-copyright claim for AI-assisted work | 16×16 items, 24×24 bag, 32×26 boar poses, 32×18 log and 24×28 stone; native outline/shadow/highlight palette |
| guava-tree, mango-tree | LimeZu Serene Village revamped 1.9 tree0; source https://limezu.itch.io/serenevillagerevamped | CC BY 4.0, https://creativecommons.org/licenses/by/4.0/ ; existing creator-page/legal evidence under assets/licenses/limezu | Retains the native tree pixels/palette adaptation; original fruit clusters added by forest_art.py. Explicit derivedAdditions in manifest |
| outfitter-stall | Original Simple Life seed-stall from crop_art.py, adapted by forest_art.py | Original Codex-assisted source; no external pack | Cloth recolour and original Wooden Club display; existing original npc1 keeper reused |
| Forest route, wooden direction boards, stepped night bands, swing/impact/energy effects and canvas panels | Original project source in forest.js, worldArt.js, ForestView.js, SurvivalPanel.js | Codex assistance disclosed in AI_USAGE.md | Integer-pixel geometry and retained bitmap font; no reference-game artwork |

Current town atlas: **150 frames** (15 added). Existing licensed environment and character attribution stay visible in Credits. No new downloaded art, sound, music, font, runtime dependency or image-generation service. The existing eight-file art allowlist is unchanged; no vendor archive/source file enters production. Forest asset evidence: assets/licenses/milestone-3-forest.md. Existing library/tool license evidence under docs/licenses remains applicable, with package versions unchanged. Audio hooks stay silent because there are no suitable license-safe effects already supplied.


## Wilderness expansion — 2026-10-07

| Asset | Creator/source | License/evidence | Modifications |
|---|---|---|---|
| 84 wildlife frames, six fruit icons, grass details, bamboo, cave mouth, ruin pillar, ice crystal, camp tent, waterfall stone, ancient chest | Original Simple Life project work with OpenAI Codex assistance; scripts/wilderness_art.py; no external source URL | Original source/Git evidence; disclosed AI assistance, no exclusivity claim | Native 16×16 item pixels and species-specific silhouettes/markings/four poses; consistent shadow and highlight clusters |
| snow-pine, acacia-tree | LimeZu Serene Village tree0; https://limezu.itch.io/serenevillagerevamped | CC BY 4.0; https://creativecommons.org/licenses/by/4.0/ ; existing assets/licenses/limezu evidence | Recolored native foliage clusters with luminance retained; explicit derivedAdditions, excluded from originalAdditions |
| River, timber bridges, animated stepped waterfalls, cave floors, habitat palettes, exploration map | Original project data/Graphics/Canvas source | Codex assistance recorded in AI_USAGE.md | Uses the established bitmap font and licensed grass/tree palette family; no new downloaded asset or smooth filter |

Detailed creation record: assets/licenses/wilderness-expansion.md. Atlas now **252 frames at 1024²**, adding 100 original and two derived frames. Existing farmer sheets and original boar remain; same eight-file runtime allowlist. No new npm dependency, font, audio, external image service or remote runtime asset. Existing dependency/license evidence under docs/licenses remains unchanged.
