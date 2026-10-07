# Forest shore verification — v0.4.5 / schema 9

Baseline: 32ea2a3 (v0.4.4, 92 tests). Final **96/96 npm tests**, `npm run build` and `git diff --check` pass. Four new pure tests cover road/fall removal and riverbank slope routes, all grass/tree dry footprints independently against water/bridges, habitat tree varieties, and scattered ripple positions/independent phases. Retained route, jump/collision/interruption, species/treasure, save/migration, farming/economy/sleep tests remain green.

CUA verification uses an agent-created in-app Chromium tab on **127.0.0.1:4176**, separate from the user's 4175 origin/save. `forest-shore-server.mjs` initializes explicit disposable starting saves before the production game loads. Native canvas controls drive the actual interactions; a test-only canvas attribute copies read-only `?qa` snapshots for observation. No gameplay mutation function is called during verification. The server/exporter is excluded from production.

Verified flows (results.json):
- Water movement via the canvas UP control: (2370,1900) → (2370,1661.554), crossing the bridge area and ending wet; isolated bridge fixture has no ankle crop/wading and no grass on the deck.
- Earth-bank walking stops at (2048,989.642); actual JUMP button leaps to (2048,861.642), then lands. New fronts retain collision while their slopes remain walkable (pure route/jump tests).
- Pause freezes the clock; two screenshots of the same water crop stay byte-identical across separate tool calls. Save/reload/Continue retains the grounded position (2048,1122).
- Forest roads and old stone/stair assemblies are absent at the former terrace location (224,5018). Palm/broadleaf/conifer mixtures and marsh willows render. Former waterfall pool (160,3340) is walkable without a fall face or side-wall obstruction, also rendered with `renderer=webgl` at night.
- Desktop **1280×720**, portrait **390×844**, short landscape **640×360** visually inspected; portrait and short canvas controls fit their viewports. Temporary viewport override reset. Initial short-screen screenshot preceded resize settling; replaced with the settled short-bridge.jpg capture. Brief native key taps did not create sustained movement, so directional canvas drag was used for measured traversal.
- Captured browser warnings/errors: **empty**. Visual evidence: bank.jpg, jump.jpg, river.jpg, bridge.jpg, portrait-water.jpg, short-bridge.jpg, palms.jpg, willows.jpg, old-terrace-cleared.jpg, former-fall-night.jpg.

Art/build audit (art-build-audit.json): **553 unchanged existing frame pixels**, **two new original tree cells**, **unchanged boy/girl files**, 555 total atlas cells. **12 production files / eight allowlisted art files / 2,031,270 bytes**; no archive/source/manifest/test/evidence files. Build-relative local resources and existing dependencies remain.

Reproduction:
```sh
npm test
npm run build
node tests/browser/forest-shore-server.mjs
# Open http://127.0.0.1:4176/?qa&fixture=river in a disposable QA browser tab.
# Continue; use native canvas controls. Other fixtures: bank, bridge, palms,
# willows, oldTerrace, formerFall. Append &renderer=webgl&night for night water.
# Navigate to ?qa without a fixture when checking save/reload persistence.
```

These are prepared affected-flow checks, not another complete farming playthrough or physical touch-device test. Other engines/phones, long-term performance/balance and final human acceptance remain unverified. User live save untouched. Nothing pushed or published.
