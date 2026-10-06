# Project status

## Milestone 1.2 — paid farm expansion and manual bedtime, 2026-10-06

**Completed after the user explicitly selected implementation now.** Home/Farm remain the only active outdoor locations; City is closed. Approved art, Phaser/Vite, fullscreen canvas UI and runtime asset allowlist retained. No push or publication.

- Removed the southern Home FARM board/hint/collider shown in screenshot 1. Remaining first-junction lettering is smaller, centered and verified inside its board; guide text now references one sign.
- Three additional fields cost **120 / 180 / 240 coins**. Locked land opens a purchase dialog and cannot consume seeds/energy; Farm board lists purchases. Each bought field repeats the original **192×192, 4×4, 48-unit cells** with matching border/north fence/scarecrow/barrel/flowers/pebble composition. A verified crossing road is moved below field 2. Four owned fields provide 64 cells.
- Farm board provides existing **10-coin tomato seeds / 18-coin produce sales** so harvests fund expansion while City remains closed. After all four fields on the newest farm are owned, buy another farm for **600 × farms already owned**. New farm starts with field 1 unlocked. Previous/Next at the board selects owned farms. Duplicate/insufficient purchases cannot spend coins; purchase confirmation and disabled buttons show affordability/gating.
- Schema **5**, same save key, accepts **1–5**. Old field indices/care/history/inventory/currency persist into farm 1. Each farm has independent ownership/crops, selected farm persists, locked slots cannot restore forged crops. All farms share time/energy/inventory; watering expiry and explicit sleep settle every planted crop. Crop panels use actual interaction coordinates across all farms.
- Automatic sleep/teleport/day rollover removed. Late night waits at minute 1439 (**23:50 clock**) while movement/actions remain available. A nonblocking prompt encourages returning home. Only bed → Sleep advances the day, grows cared-for crops and restores energy. Refresh at late night preserves the same day and location.
- Four-choice canvas menus fit 640×360 after a small row-spacing correction; no DOM HUD/new image/dependency/remote runtime asset. Eight allowlisted art files unchanged.

### Checks and evidence

- `npm test`: **39/39 pass**, including paid purchases, duplicate/insufficient funds, all 64 cell geometry/contexts, farm independence, shared overnight care, v1–v4 migration, malformed ownership and manual-night persistence. `npm run build`: succeeds; **1,648,968 bytes** uncompressed and eight runtime art files. `git diff --check`: clean.
- `tests/browser/expansion.mjs`: remaining sign text bounds/removal; insufficient coin UI; all three field transactions; seed buy/produce sale; new farm confirmation/gate; switching/save/reload; all **64** cell targets; planting/watering independent indices 0/16/32/48/64; late-night movement/save/refresh and explicit bed Sleep. Six-size menus: **1440×900, 1280×720, 1024×768, 844×390, 390×844, 640×360**. Touch purchases at small sizes. **40 mobile crop targets** across four fields and farm 2 retain clear panels/player/crops/controls. All requests local; no page errors, HTTP failures or console warnings. Report: verification/expansion/results.json.
- Updated `farming-information.mjs` full regression: new game/starter/edge travel, sixteen original cell targets, AM+PM water/rest, three cared-for nights/harvest, saved refresh, locked purchase dialog, shed’s eight approaches, road gates, remaining sign, interior bed/exit and five sizes. No errors/warnings. Report: verification/expansion/regression/results.json.
- Screenshots inspected: remaining sign fit, removed south board, repeated field design, expanded crop panels, narrow/short purchase menus. Browser QA used isolated contexts/disposable saves and actual keyboard/mouse/touch. User-origin saves untouched.

### Limitations

Prices are editable initial balance, not a long-term economy/playtest result. Additional farms reuse the same authored map, accessed at the board; they do not extend one continuous world. Care continues on unvisited farms. A 100-farm validation limit bounds browser save size. Unlimited water and silent audio remain. Physical phones/notches, Safari/WebKit, Firefox and Edge remain unverified; mobile tests are Chromium emulation. City and other previously deferred systems remain outside this extension. Final human acceptance is not claimed.

---

## Historical Milestone 1.1 — farming information and new-player navigation, 2026-10-06


**Completed on the existing foundation.** Phaser/Vite, approved retro art, fullscreen canvas, gameplay rules, maps, controls, save key and City closure retained. No push, publication or deployment.

- One contextual crop panel: tomato icon/name, four earned growth stages, segmented progress, remaining cared-for nights, next eligible stage, current condition and explicit AM/PM watering states. It hides on empty targets or away from the field and avoids the inspected crop/farmer. Responsive placement is 368×160 display pixels normally, 352×160 in short landscape. Touch controls remain accessible; short landscape tool text sits below the hotbar. Farm action prompts remain visible; informational toasts defer visually while inspecting.
- Timer is a pure projection of authoritative growth and the existing watering-window evaluator. No real-time countdown, additional crop simulation or offline progression. Three fully watered sleeps still yield two tomatoes. Missed/skipped morning care cannot promise growth that night; wilt/dead/ripe replace the estimate with an action message. Saved planting timestamps are optional; unknown legacy planting times are not invented. Recovery is shown for the repairing window.
- Two original wooden FARM/down-arrow boards: first Home path junction and south exit, both west of the road, with accurate 8×16 post collision. Compact proximity hint; signs never transition. Seed collection shows a seven-second nonblocking objective, then a small leaf icon. An eight-direction pixel waypoint aims at the actual (480,1136) edge-zone centre, clips to the gameplay safe area, updates with movement and hides when the exit is visible.
- Schema **4**, same storage key, versions 1–4 supported. `hasVisitedFarm` starts false and saves true on Farm entry. Legacy inference uses Farm/City location, planted/dead crops, tomatoes or sales; starter seeds alone do not imply a visit. Completed guides remain disabled after return/sleep/reload; New Game resets them. Optional plantedDay/plantedMinute/recoveredWindow preserve crop evidence.
- Original nine-by-nine glyphs: leaf, game clock, sun, moon, drop, warning, basket and cardinal/diagonal arrows; existing tomato item icon and font reused. Board art is deterministic integer Phaser geometry. No new runtime art file, asset family, dependency, external download or licence. Evidence: assets/licenses/milestone-1.1-original-ui.md; AI and Credits/Licences updated.

### Checks and evidence

- Baseline: clean working tree at 54502da, 29/29 tests and build; isolated new-game/movement/browser inspection before editing. Supplied screenshots were inspected as visual references.
- Final `npm test`: **35/35 pass**. Six added tests cover pure crop information, complete growth/care/save loop, paused/recovery/late-plant/dead states, versions 1–4 visit migration, waypoint target/hiding, sign footprint and eight-direction arrow pixels. Existing tests updated only for schema 4.
- `npm run build`: succeeds; eight allowlisted runtime art files, no source/vendor/QA files, no new dependency. `git diff --check`: clean.
- Production `tests/browser/farming-information.mjs`: starter objective, sixteen plot targets, planting, AM/PM water, rest, three nights, harvest, save/reload, Farm round trip, shed/gates/signs/expansion/house bed and doors; read-only snapshots, real keyboard and mouse. Zero page errors/console warnings.
- `farming-information-layout.mjs`: growing/paused/ready/dead panel at **1440×900, 1280×720, 1024×768, 844×390, 390×844**, explicit bounds/crop/player/control/prompt non-overlap; guides/signs, real CDP touch plant/water/move/save, window expiry/recovery/dead clearing, legacy migration and fresh game. Zero errors/warnings.
- `farming-information-targets.mjs`: all sixteen planted cells at both mobile sizes remain inspectable and clear; seven-second objective minimization, visible-exit waypoint hiding and pause/return-to-title. Zero errors/warnings.
- Existing supplemental `farming-care-touch.mjs`: one-miss recovery/two-miss death/clear, persistence/v2/unsafe shed repair, five indoor collision approaches, eight crop visual states and both touch sizes. Zero errors/warnings. Optional QA_OUTPUT preserves prior milestone evidence.
- Reports and inspected screenshots: `docs/verification/farming-information/`. Complete-loop checks passed before the final narrower landscape panel; final targeted layout/all-cell checks passed after that adjustment. The complete final build rerun also passes with matching report/screenshots.

### Changed files

- New: src/systems/cropStatus.js, navigation.js; src/ui/CropInfo.js, FarmGuide.js, statusArt.js; tests/farming-information.test.js; tests/browser/farming-information.mjs, farming-information-layout.mjs, farming-information-targets.mjs, farming-information-resources.mjs; original-art evidence and browser reports/screenshots.
- Updated: src/data/crops.js, mapLayouts.js; src/systems/state.js, save.js, farming.js, context.js; src/scenes/WorldScene.js; src/art/worldArt.js; src/ui/Hud.js, interface.js; src/main.js, index.html; existing schema assertions in farming-presentation/stabilization and farming-care-touch; README, GAME_DESIGN, ARCHITECTURE, TECHNICAL_NOTES, VERIFICATION, AI_USAGE, ASSET_CREDITS, ASSET_LICENSES and this status.

### Limitations and next milestone

No known blocker in the tested Milestone 1.1 loop. Physical phones/notches, Safari/WebKit, Firefox and Edge remain unverified; mobile checks are Chromium emulation. Old saves with no surviving evidence of a past Farm visit cannot infer that history and retain the guide until entry. Unknown old planting timestamps remain unknown. Unlimited water, silent audio hooks, retained midnight return and produce held in the bag remain foundation limitations. Human acceptance of the new UI is not claimed.

**Ready for a separately authorized City and Economy milestone.** This milestone stops here; City, shops, markets, additional crops, quests, weather, forest and combat remain deferred.

---

## Historical foundation status

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

Final development smoke: desktop keyboard movement, schema 4, first-time waypoint, pause freeze, fullscreen/no scroll pass with empty errors/warnings. Fresh Chrome identified the initial-origin 404 as `/favicon.ico`; the shell now declares an empty inline favicon, preventing that browser request without adding a runtime asset or visible DOM UI. Fresh-process dev/production resource checks pass.

Fresh-origin resource check is reproducible with `tests/browser/farming-information-resources.mjs` (PLAYWRIGHT_MODULE, optional CHROME_EXECUTABLE, DEV_URL and GAME_URL). It launches a new isolated browser; only same-origin files and locally generated data/blob images are accepted.
