# Project status
**Version 0.1.2 — Milestone 1 visual improvement pass 2, 2026-10-05.** Milestone 2 has not started.

## Completed presentation and world
- Camera at 1280x720: zoom 2 → 1.5, or 4x → 3x source pixels. View expands from 20x11.25 to about 26.7x15 terrain tiles. Compact portrait/landscape uses zoom 1 / 2x source pixels. No cover-style enlargement or Normal mode that would oversize the player.
- Original farmer frames: 24x32 → 16x24; displayed height at 1280x720 is 128px → 72px (17.8% → 10%). Both genders retain idle/two walking poses in four directions and interaction facing. Foot radius remains 12.
- Every drawn map: 960x640 → **2240x1152** (70x36 tiles). Bounded follow camera, fullscreen canvas, no webpage shell or scrolling. Walking speed 190 → 260 world units/sec.
- Home: furnished cutaway house with roof/walls, fenced homestead, east farm gate, mailbox/board, shed, cottage, sitting area, pond, planted details and paths.
- Farm: one active field containing the original six planting beds, three separate resting fields, pond/irrigation note, storage shed, orchard, fences, gates and scarecrow. Reserved fields add no new crops/state.
- City: functional west seed/produce stalls, central fountain square, six additional building exteriors including a closed future weapon shop, homes/post office/tea house, lamps, benches, barrels, crates and three optional townspeople: Mira, Ko, Nell.
- Animated water/fountain, drifting butterflies, brief footstep dust, interaction flash, location notices, contextual signs and short optional dialogue. No new quest system or audio requirement.
- Primary environment pack: Kenney Tiny Town 1.1, CC0 1.0. Palette-normalized atlas uses 49 source tiles, plus original compatible props. Original smaller farmers, NPC variants, crop art, retained furniture/shops, bitmap font and HUD art are documented separately. Official source archive and licence evidence retained; build excludes vendor archive and unused pack files.

## Gameplay and saves preserved
No changes to src/systems/* or src/data/crops.js. Starting 60 coins; tomato seed 10; morning/evening watering across three growing days; harvest two tomatoes; sell for 36. Day/night, health/energy, sleep, buying/selling, all menus, autosave and Continue remain. Version-1 schema/key and six crop indices unchanged. Safe old positions remain; unsafe positions caused by new scenery relocate to the area's safe spawn without deleting money, inventory or crops.

## Controls and commands
WASD/arrows move; E/Space use/talk/read; 1/2/3 choose Seed/Water/Harvest; Escape pause. Canvas menus support pointer/touch and arrows/Enter. Touch directional pad/hotbar/Use; notifications dismiss with X. Pause: Resume, Save, Controls, Return to title.
`npm ci` installs. `npm run dev` starts development. `npm test` runs rules/layout tests. `npm run build` creates dist. `npm run preview` serves production, normally http://127.0.0.1:4173/ (use the printed port if occupied). Refresh an old preview tab. Node 22.12+ recommended. Python/Pillow are optional art-regeneration tools only.

## Verification
- **10/10** Node tests pass: established rules/save/collision tests, scale limits, reachability of every interaction and district, and preservation of progress when an old position becomes unsafe.
- Full development and final production loops passed: three watered growing days, harvest two, sell for 86 total coins, Save, refresh and Continue. Zero page errors or console warnings. An ambiguous automated harvest position was corrected and the highlighted crop target asserted; no crop-rule change was required.
- Five required viewports checked: **1440x900, 1280x720, 1024x768, 844x390, 390x844**. Canvas fills viewport, no document scroll/external UI, controls remain accessible, movement and bounded camera pass. Source-pixel display stays 3x/2x; farmer frame is no more than about 12% of viewport height.
- Production old-v1 save/menu/animation suite passed: normal progress preserved; both walk frames and idle observed in all directions. Portrait/landscape menu layouts pass.
- Production exploration passed through 16 homestead/farm/town landmarks, including all three NPC conversations and the closed-shop sign. Camera remains bounded in east/south districts. Zero page errors in exploration/legacy runs.
- Production build succeeds without important warnings. Explicit runtime list verified: no vendor archive or unused pack files in dist.
- Evidence: docs/verification/pass2/. Prior-pass screenshots/reports remain historical evidence only.

## Files and systems created/changed
Added: src/data/mapLayouts.js, src/scenes/displayScale.js, src/art/Atmosphere.js, scripts/process-town-assets.py, processed atlas/character files and manifest, vendor archive, licence evidence, ART_DIRECTION.md, ASSET_AUDIT.md, VISUAL_PASS_2_PLAN.md, tests/maps.test.js and browser/world-exploration.mjs.
Updated: WorldScene, worldArt, locations, config movement speed, main dialogue/location handling, HUD prompt offset, vite build asset allowlist, two existing canvas browser suites, README and permanent architecture/status/licence/AI/design/technical records.

## Known limits and next work
Physical Android/iOS, real safe-area/notch/browser chrome, Safari/WebKit, Firefox and Edge remain unverified. The earlier WebKit tooling mismatch was not a game result. Very narrow portrait screens intentionally show less width; they keep smaller pixels rather than enlarging the player. Only Wide is implemented; no optional Normal/Wide selector. Supplemental art remains temporary, and final human visual review is pending. No gameplay weapons, forest, combat, extra crops, large story, final music/voice, publishing or submission work.
Recommended next step: human review of this pass and physical-device/browser checks. New gameplay belongs to a separately authorized Milestone 2; it has not begun.
