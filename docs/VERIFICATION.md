# Verification — Milestone 1 visual correction, 2026-10-04
## Production acceptance
`tests/browser/canvas-acceptance.mjs` passed against the production preview at port 4173, after passing against the development build. Tests control keyboard, mouse and real CDP touch events on the rendered canvas. The diagnostic snapshot is read-only and used for assertions/control hit regions; no gameplay functions or progress fields are mutated during the complete loop.

- Viewports: **1440×900, 1280×720, 1024×768, 390×844, 844×390**.
- At each: canvas dimensions equal viewport, document does not scroll, no DOM header/footer/buttons/headings outside the canvas, dark page fallback, canvas buttons within bounds, player movement and camera world bounds valid.
- Camera follows across the farm; no map-edge blank area. Integer zoom and nearest filtering; screenshots visually inspected by the agent.
- Full loop: new girl → Home/Farm/City → buy seed → plant → morning/evening water and sleep for three growing days → harvest two on day 4 → sell → 86 coins → Save → refresh → Continue. Character, area, day, money, health, energy, crops, inventory and sales count preserved. Boy selection also passes.
- Touch movement, selected tools, pause freezing time, direction changes/idle, local-only asset requests.
- No page errors or console warnings recorded in the complete production run.

`tests/browser/canvas-legacy-menus.mjs` passed in a separate disposable context with a version-1 save fixture. Preserves money/day, planted crop state, inventories, health/energy, selection and character. Both actual walking frames per direction were observed, followed by idle. Boundary collision and camera limits checked. Title/help/confirmation/character menus checked at 390×844 and 844×390.

Reports: docs/verification/redesign/results.json and legacy-menus.json. Screenshots are development evidence, not final competition submission media. Old screenshots at docs/verification/ root show the superseded 0.1.0 presentation.

## Rules and build
`npm test`: **7/7 passed**, same pure rules/save/collision regressions as before the redesign. Gameplay/data/config modules remain unchanged in Git diff. `npm run build`: succeeds without important warnings; Phaser is split into a vendor chunk. No new runtime package dependency. Version 0.1.1.

## Issues corrected during verification
Title spacing, zoomed camera-coordinate interpretation for prompts, mobile menu sizing, distinct farm plot appearance, prompt placement/ripe-crop text, health/energy bar geometry resizing, and stale notifications overlapping pause headings. The old DOM browser tests were replaced because the visible interface now lives entirely inside Canvas.

## Repeat browser tests
Playwright is optional QA tooling, not a game dependency. Use an isolated browser session, never a user's live farm. The first script creates/replaces progress in its disposable context. The second uses only a test-context legacy fixture.

```sh
# Start npm run dev or npm run preview separately.
agent-browser --session redesign open 'http://127.0.0.1:4173/?qa'
agent-browser --session redesign get cdp-url
# Set CDP_URL to that returned browser WebSocket URL.
# Set PLAYWRIGHT_MODULE to a Playwright index.mjs if not normally importable.
GAME_URL=http://127.0.0.1:4173/ node tests/browser/canvas-acceptance.mjs
GAME_URL=http://127.0.0.1:4173/ node tests/browser/canvas-legacy-menus.mjs
```

## Limits
Desktop engine tested: Chromium 154.0.8037.93. Mobile sizes/touch are emulation, not physical Android/iOS. Safari/WebKit, Firefox, Edge, real safe-area/browser-chrome behavior and throttled-network measurements remain pending. The earlier optional WebKit run failed because the installed WebKit and Playwright protocols do not match; no game compatibility failure or success is inferred from that environment error.
