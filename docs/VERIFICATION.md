# Milestone 1 verification — 2026-10-03
## Deterministic systems
`npm test`: 7/7 passing. Covers full three-successful-day crop/economy/save loop, missed watering/dry death/free clearing, energy/funds/duplicate-action safeguards, malformed save validation, denied storage/corrupt JSON, collision/spawn safety, capped delta and midnight rollover.

## Browser loop
`tests/browser/full-loop.mjs` ran with Playwright controlling a dedicated agent-browser Chromium session on the dev server, then the production preview. It used real keyboard movement and UI buttons, never injected gameplay state. Save snapshots were read for assertions.
Passed: New Game → girl → movement through Home/Farm/City → buy 1 seed → plant → morning and evening watering on each of 3 days, bed rest/sleep → mature crop on day 4 → harvest 2 tomatoes → sell for 36 → balance 86 → save → refresh → Continue. Character, area, inventory, crop plots, money, day, energy and health survived refresh. Pause froze time. No page errors.
Found/fixed: sub-frame key taps could be missed by frame-polled JustDown. Actions now use non-repeating key-down events. Retested rapid taps in production. First Vite launch briefly failed during dependency replacement; restarted and verified cleanly. Updated Vite from 6.1.0 to patched 6.4.3; npm installation audit reports zero vulnerabilities.

## Mobile and visual checks
`tests/browser/layout-touch.mjs`: passed on production. Chromium mobile emulation with real CDP touch start/end moved the player ~92 world pixels; touchscreen tool selection, 360×640, 640×360 and 1280×720 checks passed. No horizontal overflow or clipped essential panels; no page errors. Inspected screenshots manually as an agent. A narrow-landscape grid overflow and portrait HUD wrapping were found and corrected. Actual physical Android/iOS devices remain untested.
Screenshots are in docs/verification/, separate from the runtime build. These are development evidence, not the final competition submission screenshot set.

## Repeating browser tests
Install Playwright in a separate QA environment (not needed to run the game). Set PLAYWRIGHT_MODULE to its index.mjs path if not on Node's module resolution path. Start a dedicated `agent-browser --session simplelife open http://127.0.0.1:5173`, get its `get cdp-url`, then set CDP_URL to that URL.

```sh
node tests/browser/full-loop.mjs
GAME_URL=http://127.0.0.1:4173 node tests/browser/full-loop.mjs
node tests/browser/layout-touch.mjs
node tests/browser/webkit-smoke.mjs
```

The loop creates/replaces a save only in the dedicated test browser. Use GAME_URL to select dev or preview. WebKit smoke uses Playwright's installed WebKit by default; WEBKIT_EXECUTABLE can point to an existing compatible pw_run.sh. Browser tests capture screenshots into docs/verification/.

## Coverage limits and performance
Verified desktop engine: Headless Chromium 154. Mobile coverage is Chromium emulation, not a physical phone. Attempted a separate WebKit smoke run: the bundled Playwright expected a missing WebKit revision; the older installed WebKit failed at page creation with a Playwright protocol mismatch (`Page.overrideSetting: Unknown setting: PushAPIEnabled`). Safari/WebKit, Firefox, Edge and physical Android/iOS verification remain pending; no pass is claimed for them.
The production build completed successfully with no chunk-size warnings after splitting Phaser. Local loading was responsive; a throttled stable-network/real-device loading benchmark is still pending. Do not equate localhost timing with competition hosting performance.
