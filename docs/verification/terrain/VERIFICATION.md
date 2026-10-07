# Ground and river acceptance — v0.4.4, 2026-10-07

Baseline: 29f8184, v0.4.3 / schema 9. Work is visual material/rendering only; geometry, player/tree/tall-grass source art, gameplay and save schema are unchanged.

- `npm test`: **92 passed / 0 failed**. Four new ground material tests verify deterministic non-repeating ground, distance-to-shore including inner islands, darker deep water/unchanged remote land, and continuous habitat palette boundaries. Retained farming, City, time, growth, collision, jump, survival, treasure and migration rules pass.
- `npm run build`: PASS. `build-audit.json`: **12 files / 2,024,149 bytes / eight art files**, all byte-identical to baseline; source packs/unused art/manifest/QA/reference media excluded. No new dependency. `git diff --check`: PASS.
- `growth/results.json`: PASS. Real walking stops at low ledge; J/Shift jump/landing, airborne attack rejection, paused jump timer, grounded Save/reload, local grass bending/spring-back, both farmer directions, water crop suppression/restoration and wet reload. Actual touch JUMP/control bounds at **1440×900, 1280×720, 1024×768, 844×390, 390×844, 360×640, 640×360**. Canvas/WebGL night grass/jump. 820 tree/bamboo props, 3,880 grass clumps, 20 terraces preserved.
- `water/results.json`: PASS. Actual direct river crossing away from bridges, wet Save/refresh/Continue, Home/Farm pond entry/exit and waterfall-centre traversal. Native Boar hit/flee/hide/reload, four woodland species, ruins/plants, held touch, canvas controls and linked credits at seven sizes; Canvas/WebGL night water.
- `materials/results.json`: PASS. Final material captures for Home/Farm/City/Homewood/waterfall, all nine habitat palettes, Canvas/WebGL day/night river, minimum portrait ground/river. Isolated fixture starts use schema 9 and native 64-display-pixel farmers. Reload → Continue → settled capture observed **533–1,145ms** on this machine. The paused river crop stays byte-identical over 750ms with frozen game time; reflections visibly change again after unpause. No gameplay mutation hooks.

Every completed browser report has empty error, warning, failed-request and foreign-request arrays. All saves are prepared in disposable isolated Chromium contexts, then affected interactions use actual keyboard/mouse/CDP touch. User live saves remain untouched. Captures provide evidence, not additional runtime assets.

Visual review: inspected Homewood, portrait ground, layered river in Canvas/WebGL, waterfall pool, stone habitat and regression jump/water screenshots. Short grass/clover/leaf marks and flowers vary at native scale; dirt/pebbles avoid the old tile repetition, subdued shores and water depth remain readable beneath the farmer/bridge. First draft had smooth water contour rings; these were replaced with irregular stone clusters before final build/browser checks. The first material test used the whole canvas as a denominator while comparing only width-minus-16; its assertion now measures the actual compared region. No gameplay assertion was weakened.

Reproduce with production preview on 4175 and a separate isolated Chromium CDP endpoint; provide `CDP_URL` and `PLAYWRIGHT_MODULE` if using external/bundled tooling:

```sh
npm test
npm run build
npm run preview -- --port 4175
QA_OUTPUT=docs/verification/terrain/growth node tests/browser/forest-growth.mjs
QA_OUTPUT=docs/verification/terrain/water node tests/browser/asset-water.mjs
node tests/browser/terrain.mjs
```

The existing complete farming playthrough is historical evidence; this visual change reruns affected rules/flows and does not claim a new complete farming season. Physical devices, Safari/WebKit/Firefox/Edge, prolonged memory/performance and final human art acceptance remain unverified. Existing external pack licence records are unchanged. No image-generation service, asset purchase, creator contact, push or publication.
