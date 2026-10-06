# Current verification — Milestone 1.2, 2026-10-06

Evidence: `docs/verification/expansion/`, plus `regression/` for the complete farm loop. Chromium/Google Chrome, bundled Playwright fallback (agent-browser CLI unavailable), isolated profiles/contexts, disposable localStorage and real keyboard/mouse/touch. User saves untouched.

- `npm test`: **39/39 pass**. Production build succeeds, **1,648,968 bytes** uncompressed; eight unchanged allowlisted runtime art files, no source/vendor/QA assets or new dependencies. Whitespace diff check passes.
- `tests/browser/expansion.mjs`: sign lettering containment/removal, insufficient funds, farm-board seed/produce trade, all three field purchases, confirmed new-farm purchase/gating/switching and reload, independent farm crop indices, all 64 original-farm targets, late-night movement/persistence and manual bed Sleep. Forty mobile crop targets verify panel boundaries and non-overlap across expanded fields/farm 2. Six viewports: 1440×900,1280×720,1024×768,844×390,390×844,640×360; every farm-board/trade/land/confirmation/farm page fits. Touch purchases at all small sizes. Report `results.json`; errors/warnings empty; requests same-origin/data/local blob only.
- `tests/browser/farming-information.mjs` with `QA_OUTPUT=docs/verification/expansion/regression`: full starter → Farm → plant → AM water → bed rest → PM water → three sleeps → harvest → saved reload, old field cell targeting, shed/road/sign/locked-field/interior regressions and five sizes. Report `regression/results.json`; errors/warnings empty.

The first focused run found the 640×360 board menu bottom four pixels outside the viewport. Button-row spacing below 400 display pixels was adjusted; the complete final focused suite passed afterward. Sign, field, crop and menu screenshots were visually inspected. Physical phones and non-Chromium browsers remain unverified. No publishing/push.

Run production preview and an isolated Chrome CDP endpoint, then set PLAYWRIGHT_MODULE, CDP_URL and GAME_URL. Current full regression supports QA_OUTPUT to keep older reports intact. Historical browser suites use older scene coordinates/rules; their previous reports do not claim current acceptance.

---

# Historical verification — Milestone 1.1, 2026-10-06


Evidence: `docs/verification/farming-information/`. Google Chrome/Chromium, isolated profiles/contexts and disposable localStorage, real keyboard/mouse/CDP touch. Bundled Playwright was used because the agent-browser CLI was unavailable. User saves were untouched.

`npm test`: **35/35 pass** (29 existing, six additional crop-status/navigation/migration tests). Production build passes with the same eight runtime art files and no vendor/QA assets or new dependencies. Source diff passes whitespace checks.

- `farming-information.mjs`: complete starter → Farm → plant → AM water → bed rest → PM water → sleep, three nights → harvest → save/reload; visits stay saved; all sixteen targets; shed/gates/sign/expansion/interior regressions; five sizes. Report: results.json.
- `farming-information-layout.mjs`: four care states at five sizes, explicit panel non-overlap with farmer, inspected tile, controls and prompt; objective/waypoint/physical sign screenshots; touch plant/water/move/save at both mobile sizes; real expiry, recovery and dead/clear; old save and fresh game. Report: layout-results.json.
- `farming-information-targets.mjs`: all sixteen planted cells at both mobile sizes, objective minimizes after seven seconds, arrow hides at visible exit and pause/title works. Report: targets-results.json.
- Existing `farming-care-touch.mjs` rerun with QA_OUTPUT pointing here: care/death/reload/v2/unsafe position, bed/kitchen/table/shelf/wall collision, original eight visual states, real touch. Report: care-touch-results.json.

All reports have empty browser error/warning arrays. The full loop passed before a final landscape-only panel-width adjustment; final layout/all-target checks were repeated after it, followed by a passing complete final-build rerun for matching screenshots. The final added “Newly planted / water AM/PM” wording preserves these placements.

Sizes: **1440×900, 1280×720, 1024×768, 844×390, 390×844**. Panels/crop/controls inspected at each. Desktop without coarse-pointer emulation was also smoke-tested; touch emulation deliberately covers hybrid desktop and mobile layouts. Physical phones and non-Chromium engines remain unverified.

Run preview, launch an isolated Chrome CDP endpoint, then set PLAYWRIGHT_MODULE, CDP_URL and GAME_URL to run the three scripts. Supplemental accepts QA_OUTPUT; no browser package becomes a runtime dependency. No publishing or push.

---

# Historical verification — final foundation and farming presentation

2026-10-06. Evidence: `docs/verification/farming-presentation/`. Isolated Chromium contexts with disposable saves; real keyboard/mouse/CDP touch input and read-only QA snapshots. User saves untouched.

- Development at port 5174: title canvas/no Vite overlay, new boy game and keyboard movement pass without console errors (`development-smoke.json`, `development-title.png`).
- `npm test`: **29/29 pass**. `npm run build`: succeeds, eight runtime art files; regenerated town atlas has 96 frames, no vendor/test files shipped.
- `tests/browser/farming-presentation.mjs`: full starter/edge-travel/sixteen-target/plant/AM+PM water/rest/three-night/sleep/harvest/save-refresh loop, locked expansion, eight greenhouse approaches, road gate/closed fence, Farm sign, bed/exit and HUD at five sizes. Report `results.json`.
- `tests/browser/farming-care-touch.mjs`: real window expiry, one-miss wilt, recovery, two-miss death/clear, repeated persistence, v2 migration, unsafe shed save, bed/kitchen/table/shelf/wall collision; real touch planting/watering/movement at 844×390 and 390×844. Report `care-touch-results.json`.
- Sizes: **1440×900, 1280×720, 1024×768, 844×390, 390×844**. Outdoor zoom 1; indoor integer zoom 2; displayed farmer frame 64px throughout. Desktop room fully visible; mobile follows. See PROJECT_STATUS.md for logical dimensions.
- Visually inspected eight-state crop gallery and in-world crop fixture, dry/wet/wilt/dead appearance, compact field, all room aspect ratios, greenhouse foundation approaches and Farm direction hint. Zero browser page errors/console warnings.

Run with `PLAYWRIGHT_MODULE` (optional module path), `CDP_URL` (isolated Chromium endpoint), optional `GAME_URL` (default preview 4173). Main suite `SKIP_LOOP=1` is a focused geometry/layout rerun, not a full-loop pass; use the default for complete acceptance. Supplemental fixtures intentionally initialize isolated localStorage; gameplay actions use real inputs.

Physical devices and non-Chromium browsers are unverified. Historical results below do not assert current room/plot coordinates or watering rules.

---

# Historical verification — Playable Foundation repair

2026-10-06. Evidence: `docs/verification/foundation-repair/`. Disposable Chromium contexts, real keyboard/mouse/touch input; user save untouched.

- `npm test`: **19/19 pass**. `npm run build`: succeeds, eight unchanged runtime art files.
- `tests/browser/foundation-repair.mjs`: eight house approaches, separate door entry/exit, save refresh, old middle trigger absent, automatic edge travel round trip/no bounce, furniture and wall collision, sleeping, five viewport sizes. `results.json`, zero errors/warnings.
- `tests/browser/foundation-repair-touch.mjs`: final rebuilt production exact two-tile inward spawns and real touch round trip, door Use, prompt hiding and unsafe-save recovery. `final-touch-results.json`. Both suites were rerun against the final house-clearance and two-tile-spawn build.
- Screenshots: house approaches, safe exit, south path, Farm arrival, entrance/bed/exit at 1440×900, 1280×720, 1024×768, 844×390 and 390×844. Visually inspected. Compact prompt height 28px, zoom 1, no sprite or tile resampling.

Run with `PLAYWRIGHT_MODULE` (optional module path), `CDP_URL` (isolated Chromium endpoint), optional `GAME_URL` (default preview 4173). The suites initialize disposable fixtures, navigate with real inputs and inspect read-only QA snapshots. Physical devices and non-Chromium engines remain unverified. Historical suites below retain old transition/interior coordinates and are not current acceptance claims.

---

# Historical verification — final Milestone 1 stabilization

2026-10-05. Evidence: `docs/verification/stabilization/`. Tests use disposable Chromium contexts and leave the user’s live save untouched.

- `npm test`: 16/16 pass. `npm run build`: succeeds, eight runtime art files, no development galleries/vendor archives.
- `tests/browser/stabilization.mjs`: production full real-input starter/house/field/pond/three-day crop/harvest/save/refresh/Continue loop, closed City, five viewport sizes; zero errors/warnings. `production-results.json`.
- `tests/browser/stabilization-fixtures.mjs`: both characters’ four walking frames and idle in every direction, sixteen saved crop variants, development-only collision outlines, real touch selection/movement/Use/starter uniqueness/tools. `fixtures.json`.
- `tests/browser/stabilization-interior.mjs`: final rebuilt production bed/exit visibility and actual interactions at 844×390 and 390×844. `interior.json`. This focused test follows the final short-interior camera correction; the full loop passed before that correction.
- `scripts/verify-character-frames.py`: all 48 original boy/girl frames checked; nearest-neighbour galleries inspected. Crop-state, mobile and compact-interior screenshots also inspected.

Browser scripts use `PLAYWRIGHT_MODULE` (optional module path), `CDP_URL` (isolated Chromium endpoint), and the main suite accepts `GAME_URL`. Fixture/interior suites use local preview 4173 and development 5174. Current camera zoom remains 1. Physical devices and non-Chromium engines are unverified.

Earlier scripts `canvas-acceptance.mjs`, `canvas-legacy-menus.mjs` and `world-exploration.mjs` retain historical City/six-plot assumptions. Their results below belong to earlier commits and are not current-scope acceptance claims.

---

# Historical verification — replacement craftsmanship pass

2026-10-05, Chromium 154.0.8037.93, isolated contexts. Current evidence: `docs/verification/craftsmanship/`.

- Development and production real-input full farming loop: PASS, day 4 / 86 coins after sell, Save/reload/Continue, zero page errors/warnings. `development-results.json` and `results.json`.
- Five requested sizes: 1440×900, 1280×720, 1024×768, 844×390, 390×844. Canvas, controls, touch movement, camera and menus checked.
- Current zoom 1; source pixels 2×. Farmer frame 64px (8.9% at 720px height). Four walking frames per direction plus directional idle.
- Legacy/menu suite: PASS; v1 progress preserved, Credits links present, compact layouts fit, all four walking poses observed. `legacy-menus.json`.
- 16-landmark exploration: actual keyboard paths, pond-area navigation, NPC/sign dialogs and bounded camera. `exploration.json`. Repeated after final pond shoreline/underplant correction.
- 10/10 Node tests; production build succeeds; explicit eight-file art allowlist inspected. No vendor or unused source-pack files in dist.

Visual corrections included removing a grass edge from the path-interior texture, preventing decoration over pond water, sharing rounded shoreline geometry with collisions, and updating old test assumptions for compact home/camera scale. The full game loop passed before the final pond/fern-only polish; affected exploration and legacy checks were rerun after rebuilding.

Physical mobile devices and non-Chromium engines remain unverified. No human visual acceptance is claimed. Commands in the historical record below still name the same browser suites; their current output folder is craftsmanship.

---

## Historical pass 2 record (superseded art/scale)

# Verification — Milestone 1 visual improvement pass 2
Completed 2026-10-05, version 0.1.2. Browser engine: Chromium 154.0.8037.93. Tests use isolated browser contexts, not the user's live farm.

## Production acceptance
`tests/browser/canvas-acceptance.mjs` passes at http://127.0.0.1:4173/, after the development loop passed at port 5174. Real keyboard, pointer and CDP touch events drive the canvas. Read-only snapshots supply assertions and control rectangles; no gameplay methods or progress fields are mutated in the full loop.
- New Game → girl → leave home through the yard → Farm → City → buy seed → plant → morning/evening water and sleep across three growing days → day 4 → harvest two → sell → 86 coins → Save → refresh → Continue. Character, area, stats, money, inventory, crop state and sold count compare successfully.
- Both character choices, directional idle transitions, pause freezes time, touch movement, local-only runtime resource requests.
- Viewports **1440x900, 1280x720, 1024x768, 390x844, 844x390**: canvas matches viewport, document does not scroll, no external DOM headings/buttons/header/footer, dark fallback, controls within bounds, keyboard movement and valid camera extents.
- At 1280x720: zoom 1.5, ~853x480 world units / ~26.7x15 tiles. Player frame 72px tall (10%). Compact zoom 1 yields a 48px farmer; the largest height proportion is ~12.3% at 844x390. Source pixels display at integral 3x/2x scales, with nearest filtering.
- Final production loop: **zero page errors and zero console warnings**. Evidence: docs/verification/pass2/results.json and named screenshots.

## Legacy saves, dialogue and exploration
`canvas-legacy-menus.mjs` passes against production. Version-1 fixture retains money/day/inventory/crop watering/growth/health/energy/selection and character. Both walking frames and idle observed in every direction. Boundary collision and camera bounds pass. 390x844 and 844x390 title/help/confirmation/character menus fit. Evidence: legacy-menus.json.
`world-exploration.mjs` passes against production through **16 landmarks**, using initial disposable test fixtures and actual keyboard navigation: homestead gate/shed/cottage/pond/picnic; farm board/four fields/orchard/irrigation/east boundary; city Mira/fountain/Ko/closed shop/Nell/east boundary. All three NPC dialogues and contextual signs open/close correctly. New eastern/southern districts remain reachable; camera reveals no out-of-map space. Zero page errors. Evidence: exploration.json and landmark/dialog screenshots.
Screenshots were inspected for scale, scene composition, mobile HUD/control placement, readable paths and object layering. Prior screenshots under docs/verification/redesign and root verification folder are historical releases, not current acceptance evidence.

## Rules, build and asset packaging
`npm test`: **10/10 passed**. Seven established farming/save/economy/clock/collision tests plus responsive scale, map reachability, and legacy unsafe-position fallback without progress loss. No changes to src/systems/* or src/data/crops.js. `npm run build` passes without important warnings.
The full gameplay pass preceded a final tree/house tile-only correction; JS/collision output was unchanged and the expanded-world traversal was repeated after rebuilding those assets.
Build output inspected: only the explicit eight PNG/JSON/XML runtime art files plus HTML/CSS/JS. No vendor archive, source pack preview, unused individual pack files, original superseded character sheets or generation tools in dist. The official vendor ZIP stays untouched in source. No new npm dependency.

## Corrections found during this pass
Opened an active-field fence gate that blocked the old direct route. Put the homestead return spawn on its clear path. Replaced unsuitable forest-border tiles with the pack's standalone tree composition and corrected house window/gable tiles and removed opaque grass squares from resting fields; simplified fountain paving. The old browser test's harvest coordinate lay within one pixel of the nearest-bed midpoint, so timing variance could select the empty neighboring bed. It now stands clearly beside the mature crop and asserts the highlighted index before harvesting; no crop-selection/rule rewrite was needed. An expired isolated browser session was restarted; this was a test environment issue, not a runtime game failure.

## Repeat browser checks
Optional QA tooling, not runtime dependencies:
```sh
npm run preview
agent-browser --session pass2 open 'http://127.0.0.1:4173/?qa'
agent-browser --session pass2 get cdp-url
# Export CDP_URL using that returned WebSocket URL.
# Export PLAYWRIGHT_MODULE if Playwright is outside normal node resolution.
GAME_URL=http://127.0.0.1:4173/ node tests/browser/canvas-acceptance.mjs
GAME_URL=http://127.0.0.1:4173/ node tests/browser/canvas-legacy-menus.mjs
GAME_URL=http://127.0.0.1:4173/ node tests/browser/world-exploration.mjs
```

## Limits
Mobile viewports/touch are Chromium emulation, not physical phones. Android/iOS, real notches/browser chrome, Safari/WebKit, Firefox, Edge and throttled-network timing remain unverified. No success is claimed for those. User visual review and competition declarations remain human work. No Milestone 2 or publishing actions.

Final craftsmanship sign-placement review: `final-city.png` confirms both shop labels remain above the artwork. Final production page had zero errors; a short 60-frame local sample had median requestAnimationFrame interval 16.7 ms. This is not a physical-device performance claim. Final `npm test` and `npm run build` passed after that label-only correction.

Final development smoke: desktop keyboard movement, schema 4, first-time waypoint, pause freeze, fullscreen/no scroll pass with empty errors/warnings. Fresh Chrome identified the initial-origin 404 as `/favicon.ico`; the shell now declares an empty inline favicon, preventing that browser request without adding a runtime asset or visible DOM UI. Fresh-process dev/production resource checks pass.

Fresh-origin resource check is reproducible with `tests/browser/farming-information-resources.mjs` (PLAYWRIGHT_MODULE, optional CHROME_EXECUTABLE, DEV_URL and GAME_URL). It launches a new isolated browser; only same-origin files and locally generated data/blob images are accepted.
