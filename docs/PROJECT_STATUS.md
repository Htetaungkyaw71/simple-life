# Project status

## Milestone 3 — Forest, Foraging & Survival V1, 2026-10-07

**Implemented and verified locally, version 0.3.0 / schema 8**, under the user's explicit Milestone 3 brief. The prior scope closures below are historical. The existing Phaser/Vite architecture, separate canvas UI, boy/girl sprites, Home/interior/Farm/City, four crops, paid fields/farms, daily prices, merchant hours, saved fatigue, continuous midnight and manual sleep remain.

- Home's marked north road reaches the full edge and enters a handcrafted **1280×1024 Forest**. Safe inward arrivals, short fades and the shared 700ms cooldown prevent bounce. The safe entrance, winding path, berry clearing, guava grove, deep boar territory, shrine pond, logs, rocks, flowers and irregular tree groups use shared collision/save geometry. The forest's south edge returns Home.
- Six saved forage nodes offer **Wild Berry (+12 energy / 6 base coins), Guava (+20 / 12), Mango (+30 / 20)**, one collection per node/day with small pixel effects. Midnight refreshes availability; scene reentry/reload does not. BAG has compact FOOD and EQUIPMENT pages. EAT 1 removes exactly one, caps energy at 100 and refuses consumption at full energy. City Market buys all three fruit and **Wild Hide (18 base coins)** with the established saved daily multiplier; crop prices retain their original indices.
- One compact **OUTFITTER** stall sells a permanent **45-coin Wooden Club**, auto-equipping once and blocking duplicate purchases. Its keeper follows **07:00–20:00**, with a concise closed message. Gear shows ownership/equipped state, EQUIP, hide count and where to sell it.
- One **Wild Boar** wanders within a deep territory, checks solids/line of sight, telegraphs for 650ms, commits to its charge and pauses after hit/miss. Three directional club hits defeat it and give one hide. Each swing costs five energy with a 450ms cooldown; boar damage is 15 with 750ms player invulnerability and small collision-safe knockback. Swing/hit/hurt/defeat pixels and subtle shake provide feedback. Space/K and the visible equipped ATTACK button work alongside USE, including two-finger movement/attack. Partial boar health persists; a defeated boar returns on a later day.
- At zero health, input stops, the farmer falls/fades and wakes beside the bed at **06:00 next day**, with health/energy 100. Existing care/growth settles once. Exactly **floor(25% of carried coins)** enters one saved forest Stash Bag; no empty bag is created. USE recovers it once. A second defeat permanently replaces the previous bag. The loss and respawn save atomically before animation, so refreshing during the fade cannot duplicate loss. Bags survive travel, midnight, sleep and reload; unsafe coordinates repair to nearby ground.
- Forest night preserves the cool global overlay but adds stepped 16-unit pixel visibility bands around the player. Distant areas remain dark. After 20:00, boar movement increases 15% and awareness from 190 to 228 units, retaining the warning/grace. One saved night warning, three paused first-visit messages and first-defeat recovery guidance explain the rules.
- Schema **8** retains the storage key and accepts **1–8**, preserving crops, paid farms, currency, character, city progress, daily price seed and time. New forest inventory, collection state, club, boar, guidance flags and stash fields validate independently. Details: SAVE_SCHEMA.md. No new dependency, backend, downloaded asset or runtime remote request.
- Original native pixel art adds items, boar poses, bag, landmark and adapted original stall. Guava/Mango trees derive from the existing **LimeZu CC BY 4.0** tree with original fruit clusters. Atlas now has **150 frames**; the same eight runtime art files remain allowlisted. Creator/license/modification and AI evidence is recorded in ASSET_LICENSES.md, ASSET_CREDITS.md, assets/licenses/milestone-3-forest.md and AI_USAGE.md. Existing dependency license evidence remains applicable. Sounds remain silent because no suitable licensed effects are supplied.

### Checks and evidence

Baseline `878d155` was clean; **56/56 tests** and production build passed before editing. Final **71/71 tests pass**, including 15 forest/survival rule tests and retained farming, city, expansion, migration, collision and day/night regressions. `npm run build` succeeds; **1,711,341 bytes**, **12 files / eight art files**, with no vendor/source/QA/unused pack assets shipped. `git diff --check` passes. Evidence is under **verification/forest/**.

`natural-loop.json` and `results.json`: PASS for a real New Game girl/starter → three cared-for Tomato nights → harvest/sell → buy club → forest guidance → berry/guava collect → eat → boar damage/three-hit defeat/hide → mango collect → reentry preservation → fruit/hide sales → sleep/new-day respawn → player defeat → saved bag reload → return/recovery → Home save/reload. No gameplay mutation hook or injected growth/stock/time was used in this playthrough. It finishes day 6 with **101 coins**, club and saved guidance intact, and no remaining bag.

`final/results.json`: final-build checks pass at **1440×900, 1280×720, 1024×768, 844×390 landscape and 390×844 portrait** for FOOD/GEAR/Outfitter/market bounds, keyboard/mouse/touch eating and attack, pause, tutorials, closed merchant, zero-energy recovery and full-energy rejection. Additional checks cover two-finger movement while attacking, second-death bag replacement, refresh during defeat fade, and **Canvas plus WebGL night rendering**. `city/results.json` passes the existing focused economy suite: quantities/repeat protection, hours, touch/keyboard, seed aid, crop panels, collisions, reload prices, migration, signs and retained Farm board trade. Every completed browser report has empty error, warning, failed-request and foreign-request arrays. Screenshots were visually inspected for night readability, original art/layering and responsive panels; the final inward spawn keeps the farmer clear of the portrait hotbar.

QA uses isolated Chromium contexts and disposable local saves, actual keyboard/mouse/touch and copied read-only snapshots. The user's live save was untouched. Full-loop evidence predates only the final inward-arrival and independent touch-release corrections; the affected navigation, five-size layout, combat touch and interrupted-defeat cases were rerun on the final build. Commands and evidence distinctions are in VERIFICATION.md.

### Remaining limitations

Physical phones/notches and Safari/WebKit/Firefox/Edge are unverified; touch is Chromium emulation. Combat/economy/night values need human play review over longer sessions. Audio remains silent, and existing unlimited water/repeated farm layouts remain. Pixel assets are code-authored with disclosed AI assistance; final competition declarations and visual acceptance remain human work. No known blocker remains in the tested loop. Local Git commit is authorized and created for this milestone; **no push, publish, deploy or Milestone 4 work**.

---

## Clean shops and continuous day/night — 2026-10-07

**Implemented on Milestone 2, version 0.2.1**, following the user's screenshot and explicit request. The text-heavy shop is replaced by a compact pixel card: four crop-icon tabs, item/name, bag count and unit price, 1/5/Max or All selection and one Buy/Sell action with exact quantity/total. The ? button opens optional care/growth/yield/shop/price details. BAG uses the same icon tabs. World remains visible around the smaller card. Keyboard focus starts on the primary action; left/right cycle crops, up/down/Tab navigate and Enter confirms. Mouse/touch and Escape remain.

- Full daylight, warm dusk and dawn fade into dark cool moonlight. Full night starts at **20:00**; only 22% of the scene remains visible beneath the overlay. No lamp/player/window light halo is added. Existing original sun/moon HUD glyphs track the phase; butterflies hide at night.
- Both shops now operate **07:00–20:00**. Shopkeepers disappear outside their opening hours and reappear on reopening, including immediate load/travel. Closed counters show their hours and cannot open trade. Panels continue pausing the world, clock and fatigue.
- The minute-precision clock runs continuously through **23:59 → 00:00**, incrementing the day without teleporting, forcing sleep or restoring energy. Midnight evaluates care/growth once for every farm and derives the new day's market prices. Crops grow when properly cared for even if the player stays awake. Before-dawn watering guidance points to 06:00.
- Awake time drains **one energy per 30 game minutes**, in addition to existing farming costs. The fractional remainder is saved. Energy bottoms at zero; movement and the route home remain available. Sleep is always chosen at the bed: daytime **06:00–20:00** sleep wakes at **20:00** that day; nighttime sleep wakes at **06:00** next day, or the same morning when already past midnight. The bed shows the wake time before confirmation and restores energy to 100. Early-morning sleep cannot grant duplicate growth. Daytime sleep leaves the 20:00–22:00 portion of evening watering available.
- Schema **7** retains the storage key and accepts versions **1–7**, preserving previous crops/coins/farms/care/positions. Saves now permit 00:00–05:59 and include fatigueMinutes. No offline simulation, forced sleep, damage/death, extra crops, weather or audio is introduced. Raster art, dependencies, existing licence evidence and the eight-file runtime art allowlist remain.

### Checks and limitations

`npm test`: **56/56 pass**; `npm run build`: succeeds. Six new meaningful rule tests cover all sleep boundaries, awake/shared-farm midnight and single growth, skipped-window care/death, saved fatigue/zero energy, clock/hours and lighting bounds. Existing regression assertions follow schema 7 and midnight growth text. Build inventory: verification/day-night/build-files.json (12 files, eight art files, 1681390 bytes). Whitespace diff check passes.

Browser evidence is under **docs/verification/day-night/**. `results.json`: PASS for awake midnight/single growth/new prices, saved pre-dawn time/fatigue, all four bed sleep cases, zero-energy movement, merchant closing/hiding, optional details, keyboard crop/purchase and touch seed selection. Shop/detail/BAG bounds pass at **1440×900,1280×720,1024×768,844×390,390×844,360×640,640×360**. The short landscape layout compresses its vertical spacing. Night/day/sunset, phone/short-shop and optional-detail screenshots were visually inspected. Browser error/warning/failed/foreign-request arrays are empty.

`city/natural-loop.json`: complete real New Game starter → three cared-for Tomato nights → City sale → Strawberry purchase → four cared-for nights → second sale → Save/refresh/Continue PASS, finishing day 8 with 138 coins and four total produce sold. The actual bed uses Sleep-to-20:00 for evening care and Sleep-to-06:00 overnight; no growth/time/stock injection. Reload verifies saved stocks/care/progress and exact fatigue accounting for the awake minutes after Continue. The prior energy-only assertion was corrected because resuming near a fatigue boundary legitimately costs another point. `city/results.json` (full suite) and `city/final/results.json` (focused pass): shop quantities/repeat gates/closed hours/price reload/touch/crop panels/collisions/signs/retained Farm trade PASS with empty browser errors/warnings and only local requests. QA uses isolated disposable saves and actual keyboard/mouse/touch; the user's save is untouched. Existing maps/assets/fullscreen architecture and Farm expansion remain.

Limits: Chromium desktop and touch emulation; physical phones/notches and Safari/WebKit/Firefox/Edge are unverified. Fatigue/darkness are initial balance values requiring user play review; night intentionally has limited visibility. Silent audio/unlimited water/repeated farm maps remain. No push, publication, hosting or competition submission.

---

## Historical Milestone 2 — City and Economy V1, 2026-10-06

**Completed on the existing Phaser/Vite foundation**, version 0.2.0. The latest user brief explicitly opens City and four crops. Home/interior/Farm, the original three starter seeds, matching paid fields/additional farms and manual bedtime are preserved. No push, publish or deployment.

- Home’s east road reaches the actual boundary and leads through a 140ms fade to City (64,488), facing inward. Wooden CITY arrow signs fit their boards and have accurate post collision. The matching HOME sign/west road returns to Home (2176,640). Safe inward spawns and the retained 700ms cooldown prevent return loops; Home/Farm travel is unchanged.
- Lantern Square is a compact **1280×896** scene: connected entrance/shop/plaza/return roads, original quiet stone paving, fountain, benches, lamps, flowers/planters, noticeboard, barrel/crate decorations, tree borders, five future-use buildings and two staffed outdoor awning stalls. Outdoor stalls fit the existing scene architecture without introducing shop interiors. Ground dimensions/camera bounds follow the map; backdrop grass fills small viewport margins. Shared solids cover counter shelves/posts, merchants, fountain, buildings, props and signs; foot depth/nearest rendering remain.
- Clara’s Seed Shop (**07:00–20:00**) sells Tomato/Strawberry/Carrot/Corn; Niko’s Produce Market (**07:00–21:00**) buys harvested produce only. Paged canvas panels show icons/name/owned coins, fixed seed or exact daily sale price, growth/yield/description, per-button quantity and total; Buy 1/5/Max and Sell 1/5/All. Disabled controls explain funds/stock/caps, with a precise empty-bag or missing-selected-crop message. Market defaults to an available harvest. Large quantities retain exact totals and a readable quantity summary. Shops pause movement/time and support keyboard, mouse, touch and Escape; closed signs/approach hints show hours. Existing-open panels can finish safely.
- Four playable crop definitions: **Tomato 10 seed / 18 base sale / 3 nights / yield 2; Strawberry 18 / 28 / 4 / 2; Carrot 28 / 70 / 4 / 1; Corn 40 / 36 / 5 / 3**. All share existing AM+PM care, wilt/recovery/dead clearing and manual overnight growth. Original 24×32 art has eight distinct states per crop. Crop panels/timers/stages, item icons and harvest effects are data-driven. Q cycles planting seeds; BAG offers a canvas selector. No regrowth/eating mechanic.
- Pure market hashing combines unsigned save seed, day and crop index, choosing an inclusive 85–120 percent; sale is max(1, round(base × percent / 100)). Low <95 / High >105 / otherwise Normal, with text and appropriate pixel arrows. Fixed seed prices never change. New saves get a local random seed; old saves use seed 1; reload cannot reroll. Cared-for worst-day net per plot is positive: **20 / 30 / 32 / 53 coins**. This is initial balance rather than a long-term player study.
- First harvest briefly expands the city-selling objective and guides toward the real route; the saved first city visit removes the temporary guide and gives one nonblocking merchant greeting. Saved flags cover harvest/visit/buy/sell. Existing Farm board Tomato convenience trade remains, now using the same daily produce price; it still manages matching fields and farms. City sells the other three seeds and offers full quantity controls.
- Atomic bounded integer transactions cap each item at 9999 and coins at 9,999,999. A 240ms input gate and transition guard reject duplicate purchases/sales. City seed aid offers one free Tomato seed per day only with <10 coins, no seeds/produce and no living crop; it persists and cannot duplicate within a day. No money grant or automatic sleep is introduced.
- Schema **6**, same storage key, accepts **1–6**. Migration preserves money, original tomato keys/indices/care/timestamps, day/time/health/energy, starter progress and all schema-5 paid farms/fields. New keys/defaults initialize independently; invalid positions repair to nearby safe ground. Market seed, selected crop, tutorial flags and lastRecoveryDay save atomically. Shop panels are transient and resume closed after reload. No offline advancement.
- Original art extends the atlas from 96 to **135 frames**, with provenance in crop_art.py/manifest and assets/licenses/milestone-2-original-city.md. Existing LimeZu CC BY 4.0 credits/evidence remain; no new download/dependency/font/audio pack. Sound-request hooks cover entry/open/buy/sell/failure/close; floating coins and a brief shop coin-count animation give feedback.

### Checks and evidence

- Baseline c3142d4: clean tree, **39 tests**, production build and isolated Home/interior/Farm bed/doors/geometry/five-size browser checks passed before editing.
- Final `npm test`: **50/50 pass**. Eleven added tests cover all crops/growth/status, buy/sell quantities and bounds, inventory separation, prices across 100 days/reload, hours, tutorial/edge safety, schemas 1–5 with paid farms, input gates and seed-aid recovery. Original tests remain, updated for opened City, schema 6 and daily prices. `git diff --check`: clean.
- Production build passes; **1,679,409 bytes** uncompressed, **12 files total / eight allowlisted art files**. No source/vendor ZIP/manifest/QA image/unused pack enters dist. Inventory: verification/city/build-files.json.
- `tests/browser/city-economy.mjs` real new-game playthrough: girl / 60 coins / starter three seeds / Tomato AM+PM care over three sleeps / first-harvest City objective / Home east route / City sale / buy Strawberry / Home/Farm return / four cared-for sleeps / second City sale / Save/refresh/Continue. Actual acceptance save is day 8 with **138 coins**, two original Tomato seeds retained, four total items sold and all four tutorial flags true. Numeric sale, inventory and save assertions pass; seeded day-8 prices remain stable. Evidence: verification/city/natural-loop.json and completed-two-crop-city-loop.png.
- Full suite and final focused production pass: Buy 1/5/Max, Sell 1/5/All, rapid mouse buy/sell bursts, disabled low-funds/no-produce controls, closed hours and finish-before-close pause, three repeated City round trips, keyboard purchase, touch buy/seed selection/Corn planting+water, all four crop panels, daily-price rendered label reload, legacy City migration, stall counter/post/back/fountain collision, sign text fit and preserved Farm-board trade. Paged shops/scene/controls/text at **1440×900, 1280×720, 1024×768, 844×390, 390×844** stay in the viewport; no scrolling/DOM HUD. Final large-quantity portrait check retains exact amounts. Reports: verification/city/results.json and final/results.json. **Zero browser errors, warnings, failed HTTP requests or foreign runtime requests**.
- Art check: 32 crop frames are nonempty 24×32 with eight unique pixel hashes per crop. Gallery and art-results.json under verification/city; city, short/portrait shop, objective, crop and final loop screenshots visually inspected. QA uses isolated profiles/disposable saves and real inputs; no gameplay mutation hook or user save edits. Chromium emulates touch; no human acceptance is claimed.

### Files and limitations

Main changes: data/{crops,locations,mapLayouts}; systems/{state,save,economy,market,inputGate,recovery,farming,watering,cropStatus,context,navigation}; UI/{TradePanel,interface,Hud,FarmOffice,FarmGuide,CropInfo,pixelWidgets}; WorldScene/main; art/{Terrain,worldArt,Atmosphere}; original-art scripts and committed town atlas/manifest; economy and updated regression tests; browser City suite/evidence; README/AGENTS/design/status/architecture/technical/AI/credits/licence records. Package version changes to 0.2.0; dependencies remain unchanged.

Known limitations: initial balance, silent audio hooks, unlimited water, repeated-map farms and shared unvisited care; no shop interiors (outdoor stalls deliberately chosen). Physical phones/notches, Safari/WebKit, Firefox and Edge are unverified. Future-use buildings remain decorative. No known blocker in the tested City economy loop. Recommended next milestone: deliberate food/energy use and small farming-quality improvements, beginning with real-device and longer balance testing; deferred forest/weather/festival/relationships require new authorization.

---

## Historical Milestone 1.2 — paid farm expansion and manual bedtime, 2026-10-06

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
