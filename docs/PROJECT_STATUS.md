# Project status

**Milestone 1 — final foundation repair and farming presentation, 2026-10-06.** Existing Phaser 3/Vite, approved retro asset family, fullscreen canvas HUD, controls and localStorage retained. City remains closed. Approved future systems are design-only in GAME_DESIGN.md.

## Completed

- Greenhouse/shed supports, walls, foundation and step use shared ground-contact collision rectangles; roof projection is not solid. Feet probes align with the visible feet. Foundation depth gives natural front/behind ordering. Nearby Farm barrels/crate moved clear of the right approach. Unsafe saved positions relocate to nearby walkable ground.
- Fence tiles intersecting roads are removed before collision creation. Three-tile gate opening, solid remaining sections, road-centered down arrow. Wooden roadside sign shows a compact **FARM ↓** hint; only the map edge triggers travel.
- Compact responsive farmhouse, integer camera zoom **2**, larger furnishings, clear sleeping/kitchen/storage/entrance groups. Indoor farmer remains **64 display pixels**, matching outdoors. Full room visible on desktop; limited camera following on mobile. Authored envelope 800×480 is approximately 40% smaller than the old 1344×800; actual dimensions fit each viewport below.
- One coherent **192×192 tilled field**, sixteen contiguous **48×48 cells**, subtle seams, individual targeting, props outside plots and accessible surrounding ground. Removed development labels. Overgrown expansion land has weeds/stones and a compact town-unlock hint, no planting or soil fatigue. Saved unlock flag defaults false.
- Eight original tomato states: seed, sprout, young, flowering, ripe, dry, wilted and dead. Dark watered soil contrasts with lighter dry soil. Data-driven crop metadata includes future category/food/regrowth fields without adding new playable crops.
- Plant, water and harvest particles/pickup, compact feedback and silent sound-event hooks. No placeholder audio.
- Explicit **06:00–12:00 / 16:00–22:00** watering windows shown in HUD. One missed window wilts and pauses growth; timely watering recovers. Two consecutive misses kill. Three fully cared-for nights produce two tomatoes. Saved window cursor makes tick/rest/sleep/reload evaluation idempotent.
- Schema **3**, same localStorage key; versions 1/2 migrate while retaining crop indices, money, inventory, day, reward and valid progress. Room-size metadata safely remaps indoor positions across screen sizes. No offline progression.

## Interior sizes verified

| Viewport | Logical room | Camera zoom | Farmer display height |
| --- | --- | --- | --- |
| 1440×900 | 704×400 | 2 | 64px |
| 1280×720 | 624×304 | 2 | 64px |
| 1024×768 | 496×336 | 2 | 64px |
| 844×390 | 480×304 | 2 | 64px |
| 390×844 | 480×368 | 2 | 64px |

## Controls and commands

WASD/arrows move; E/Space uses the nearby target; 1/2/3 select Seed/Water/Harvest; Escape pauses. Touch direction pad, tools and USE are available. Walk through Home’s south map edge or Farm’s north edge to travel. Use the porch to enter Home and the indoor south door to leave. Bed offers rest until 16:00 or next-day sleep. Pause → Save; refresh → Continue.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Current local development port: 5174. Production preview: http://127.0.0.1:4173/ . Refresh to load the latest build. Development-only `?collisions` shows solid geometry; `?qa` provides read-only verification snapshots.

## Verification

- **29/29 Node tests pass**, covering window boundaries, care/growth, energy, legacy migration, repeated save evaluation, responsive position repair, road fences, crop targeting, greenhouse geometry, existing map/house/pond and storage regressions.
- Development smoke passes: title canvas, new boy game, keyboard movement, schema 3 and no console errors (development-smoke.json).
- Production build succeeds. Same eight allowlisted runtime art files; no vendor archives, unused pack files, QA galleries or new runtime dependency.
- Real browser full loop: girl → starter crate → edge travel → all sixteen plot targets → plant → AM water → rest → PM water → sleep for three nights → harvest → Save → refresh → Continue. Locked expansion refuses planting.
- Eight greenhouse approaches, open road gate/solid fence, non-transition sign, indoor bed/door and farm HUD at all five requested sizes. Screenshots inspected.
- Supplemental browser fixtures cover one miss/recovery/two-miss death/clear, old v2 save, unsafe greenhouse save, compact indoor furniture/wall collision and real touch farming/movement at both mobile sizes. Zero browser page errors/console warnings.
- Current scripts: tests/browser/farming-presentation.mjs and farming-care-touch.mjs. Evidence and JSON reports: docs/verification/farming-presentation/. Earlier suites use historical coordinates; see VERIFICATION.md.

## Files and systems

Added systems/watering.js, scripts/crop_art.py, tests/farming-presentation.test.js, two browser scripts and docs/FARMING_PRESENTATION_PLAN.md. Updated crop/interior/geometry/location/map data, farming/time/state/save/context, WorldScene/CollisionWorld/PlayerView, worldArt/Atmosphere, main lifecycle and canvas UI. Regenerated town PNG/JSON/manifest (96 frames). Updated README, design, architecture, technical, art, status, verification, AI and asset credit/licence records.

## Known limitations and next milestone

No known blocker in the verified foundation loop. Physical phones, safe-area notches and non-Chromium engines remain untested; mobile results are Chromium emulation. Small screens scroll through the room. Water is unlimited; sound hooks are silent; harvest stays in inventory while City is closed. Existing automatic midnight return is retained until the future day/night survival redesign. The supplied attachment contained text, not the referenced screenshots, so live game and project evidence guided inspection.

**Recommended next milestone: City and Economy**, under a separate instruction. Future ten-crop/orchard, market, food, weather, forest/combat/recovery, tool/weapon and story designs are documented only. No push or publication.
