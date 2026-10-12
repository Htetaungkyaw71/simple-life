# v0.18.5 — mobile trade and icon controls, 2026-10-12

The supplied Market screenshot shows the heading sharing the page button's space and selected-item text crossing the crop tabs. TradePanel's old `lift` subtraction moved details up too far on short landscape screens. The new layout keeps header/tabs separate, uses an item/action column pair in short landscape, measures wrapped detail rows, moves narrow-phone balances below item details and header info out of long item names, and centers inside safe margins. Jump/Use captions are removed and their existing glyphs centered; the Forest hotbar uses its existing folded-map glyph. Entering the house requests no door effect. The previous exit sound remains.

## Reproduction

```sh
npm test
npm run build
npm run build:playtest -- --outDir /tmp/simple-life-v0185-playtest --emptyOutDir
# Keep dist stable during browser tests. All contexts below are disposable.
GAME_URL=http://127.0.0.1:4198/ QA_FILTER=canvas QA_OUT=/tmp/simple-life-v0185-trade-canvas-final node tests/browser/mobile-trade.mjs
GAME_URL=http://127.0.0.1:4198/ QA_FILTER=webgl QA_OUT=/tmp/simple-life-v0185-trade-webgl-final node tests/browser/mobile-trade.mjs
GAME_URL=http://127.0.0.1:4198/ QA_FILTER='canvas-(320|360|844x390)' QA_OUT=/tmp/simple-life-v0185-final-extra-canvas node tests/browser/mobile-trade.mjs
GAME_URL=http://127.0.0.1:4198/ QA_FILTER='webgl-(320|360|844x390)' QA_OUT=/tmp/simple-life-v0185-final-extra-webgl node tests/browser/mobile-trade.mjs
GAME_URL=http://127.0.0.1:4198/ QA_FILTER='(canvas|webgl)-(568|844)-home' QA_OUT=/tmp/simple-life-v0185-house node tests/browser/ui-typography.mjs
GAME_URL=http://127.0.0.1:4198/ QA_OUT=/tmp/simple-life-v0185-icons node tests/browser/mobile-icons.mjs
AUDIO_QA_OUT=/tmp/simple-life-v0185-audit /Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/qa/cozy-audio-audit.py
git diff --check
```

## Completed checks

- **296 tests pass**, with maximum-stock/full-quote/long-feedback bounds and icon-only regressions.
- **Normal and explicit playtest builds pass, 137 modules each**. Default balance/gift isolation is unchanged.
- The main trade reports pass **28 cases** (14 per renderer), before the last narrow-phone addition; **12 final-build narrow/landscape cases** (320×568, 360×640, 844×390 × both trade types/renderers) also pass, including four additional 320px cases: **32 distinct trade cases total**. The 12 final cases follow the narrow-header/long-feedback fixes; the other main cases verify unchanged layout branches. Reports: `/tmp/simple-life-v0185-final-extra-canvas/results.json` and `/tmp/simple-life-v0185-final-extra-webgl/results.json`.
- **Four house-entry typography cases and six icon-navigation cases pass**. Native taps verify silent entry with warmed/decoded audio, interior zoom, map opening/closing, real jumping and Use.
- Final audit passes: **44 files / 11,746,118 bytes**, **28 approved WAVs**, **eight unchanged previous art files**, **four unchanged approved font files**, full dependency notices and no source/archive/unused pack files. Evidence: `/tmp/simple-life-v0185-audit/runtime-audit.json`.
- Both existing phone/Mac preview URLs return HTTP 200; they serve the rebuilt local dist. `git diff --check` passes.

## Verification scope

The trade suite uses native Chrome mouse/touch inputs and fixture saves at the actual City counters: all **12 seed types and 24 sale items**, details and page changes, quantity 1/5/MAX/ALL, real transaction quotes, exact coin/stock changes, paused time and Save/reload/Continue. Canvas and WebGL each cover **1280×720, 390×844, 360×640, 844×390, 844×335, 844×300 568×256 and 320×568**. Landscape safe areas use 59/44px side margins and a 21px bottom margin; rotation resets side insets for portrait and restores them for landscape. It checks actual text intersections, text against unrelated controls, full transaction-quote visibility, menu bounds, at least 44px targets, native font sizes/integer parent scales and clean console/local requests.

The offline catalogue regression checks every item/details page at eight sizes, maximum stock quotes and wrapped feedback. Existing regressions now require icon-only action nodes/map glyph and retain real Use/Hit behavior. The house typography subset checks four Canvas/WebGL landscape cases, including silent entry through a native tap with decoded/preloaded audio and enlarged interior zoom. Six icon cases navigate the real map, jump and use at portrait/landscape/short sizes.

Screenshots inspected include narrow portrait seed shopping, shortest landscape buy/sell, safe-area landscape Market and the Forest icon-only HUD. The test harness first kept landscape-only side insets after switching to portrait; that unsupported fixture was corrected to match orientation-specific safe areas. An initial icon fixture stood beside the Forest exit, so Use correctly traveled Home; the final fixture stands farther inside the Forest. Neither test-fixture correction changes gameplay.

## Limits

These are native Chrome emulation checks, not physical-phone Safari/WebKit acceptance. The existing 2× UI, requested Thaleah/m5x7 font assets and filtering rules, economy, catalogue, save schema, camera and world art remain. No new asset/dependency, public deployment, push, or existing user-save editing. The phone preview needs the Mac/server running on the same Wi-Fi: http://192.168.100.7:4198/. Mac preview: http://127.0.0.1:4196/.
