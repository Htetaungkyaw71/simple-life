# Project status
**Version 0.1.0 — Milestone 1 complete, 2026-10-03.** No Milestone 2 gameplay was started.

## Completed features
- Title screen, New Game confirmation, Continue, instructions, boy/girl selection.
- Original procedural tropical artwork and three connected locations: Home, Farm, City.
- Top-down keyboard/touch movement, obstacle collisions, safe spawns and nearby contextual interactions.
- Home bed: rest until evening or sleep to the next morning with restored energy.
- Configurable four-minute day, morning/afternoon/evening/night, night tint, midnight return home; simulation pauses in menus/hidden tabs.
- Money (starts at 60), health/energy meters, day/time, location, selected tool/item counts, objective and action hints.
- City seed shop and produce market; six pre-tilled plots; data-driven tomato (10-coin seed, 3 successful growth days, yield 2, sell 18 each).
- Plant, morning/evening water, sleep/grow, harvest and sell. Duplicate/invalid actions and insufficient funds/energy handled. Dry-day delays/wilting/dead-crop clearing.
- Versioned validated localStorage saves, periodic/action/transition/sleep/page-hide saving, refresh/Continue, visible storage-failure feedback.
- Responsive desktop/portrait/landscape touch UI, tool buttons, touch movement and Use button.

## Controls
WASD/arrows move; E/Space use/interact; 1 Seed, 2 Water, 3 Harvest; Escape pauses. Small screens provide a directional pad, tool buttons and Use. Click/tap a nearby plot to target/use it. Bed options make the three-day loop playable without waiting for every clock interval. Water before and after 16:00 on each growing day; planted on day 1 with proper care, tomatoes mature on day 4.

## Commands
- `npm ci` — install locked dependencies (Node 22.12+ recommended).
- `npm run dev` — development server, normally http://127.0.0.1:5173.
- `npm test` — deterministic system tests.
- `npm run build` — production static files in dist/.
- `npm run preview` — serve production, normally http://127.0.0.1:4173.

## Verification
7/7 system tests pass. Full keyboard/UI farming loop passed in Chromium on dev AND production: choose girl → travel → buy → plant → morning/evening water and sleep for 3 days → harvest 2 → sell → 86 coins on day 4 → save → refresh → Continue with state preserved. Pause tested. Production touch movement/tool selection and layouts at 360×640, 640×360 and 1280×720 pass with no page errors. Rapid taps tested after an input fix. Production build succeeds, about 1.5 MB uncompressed; npm audit at installation reports zero vulnerabilities after pinning Vite 6.4.3. Details and reproducible optional browser scripts: VERIFICATION.md.

## Known issues and limitations
No known blocking issue in the tested Milestone 1 loop. Mobile tests use Chromium touch emulation; physical Android/iOS devices and current Safari, Firefox and Edge remain unverified. Optional WebKit smoke could not create a page because the installed runtime has a protocol mismatch (not a demonstrated game failure). Slow-network and real-device performance measurements remain pending. Saves are browser/origin-specific and unavailable if storage is disabled or cleared. Health has no damage mechanic and the game has no audio in this slice. Tiny map labels scale with the canvas; essential instructions also appear in readable HTML UI. Final submission/human review is not complete.

## Files and systems created
- Root: AGENTS.md, README.md, package.json/package-lock.json, index.html, vite.config.js, .gitignore; local Git initialized.
- src/config.js and main.js: configuration and lifecycle/transactions.
- src/data/crops.js and locations.js: crop definitions, plot layout, map geometry, connections and collision queries.
- src/systems/{state,save,farming,economy,time}.js: pure state/rules and persistence.
- src/scenes/WorldScene.js: world rendering, context and movement orchestration.
- src/art/worldArt.js: original procedural scenery and characters.
- src/ui/interface.js and styles.css: accessible DOM menus, HUD, responsive controls.
- tests/systems.test.js and tests/browser/*.mjs: rules, complete-loop and layout/touch verification; optional WebKit smoke.
- docs/: design, architecture, implementation plan, competition requirements, AI/asset records and declaration drafts, technical notes, licence evidence and verification screenshots.

## Recommended next milestone — not started
First perform a human playtest and actual Android/iOS/Safari/Firefox checks, reviewing disclosed AI code/art and licensing. After a new scope approval, plan Milestone 2 around the forest exploration/risk loop while preserving the existing farming/economy/save foundation. Combat, animals, weapons, death/recovery, extra crops and story require that separate milestone; none are included here. Official hosting, private repository reviewer access, runtime ZIP, demo, final screenshots, team profile and final declarations remain release work.
