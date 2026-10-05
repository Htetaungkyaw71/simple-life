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
