# v0.18.1 mobile rotation and silent travel — 2026-10-12

Before changes, native short-landscape probing reproduced clipped start controls at 844×300, 667×280 and 568×256; ordinary 844×390 touch rotation worked in Chrome, so the user's exact physical-device freeze is not claimed reproduced. The existing resize handler could skip touch-bound refresh when the canvas moved without changing size, and UI layout reset the stick without reclaiming cancelled Phaser pointer slots. The follow-up closes those lifecycle gaps and fixes the observed menu overflow.

## Reproduction

```sh
npm test
npm run build
npm run build:playtest -- --outDir /tmp/simple-life-landscape-playtest --emptyOutDir
npm run preview -- --port 4196
GAME_URL=http://127.0.0.1:4196/ QA_OUT=/tmp/simple-life-mobile-rotation-final node tests/browser/mobile-rotation.mjs
GAME_URL=http://127.0.0.1:4196/ QA_CASE=fresh QA_OUT=/tmp/simple-life-landscape-fresh node tests/browser/judge-polish.mjs
AUDIO_QA_OUT=/tmp/simple-life-landscape-audit python3 scripts/qa/cozy-audio-audit.py
git diff --check
```

Use the bundled Python and native Chrome/Playwright paths on this host, or set PLAYWRIGHT_MODULE/CHROME_EXECUTABLE for another installation. Browser checks run isolated contexts on localhost, with explicit preload fixtures for safe farm terrain and already recorded Journal flags. Actual keyboard/touch drives planting/watering, movement, menus and edge travel after preload. Read-only snapshots and a test-only AudioBufferSourceNode.start observer measure visible state and non-loop source starts. No public or existing user save is edited; generated screenshots/reports/test saves remain under /tmp.

## Checks

- Full suite **292 pass / 0 fail**. New regressions confirm silent travel at playback/fallback/preload boundaries and 44px-or-larger start/Bag/Audio controls at 844×300, 667×280 and 568×256; every Bag item remains reachable through pagination.
- Normal and explicit playtest production builds pass (**138 modules**). Normal output remains in dist; playtest is separate under /tmp. Existing gift isolation and normal 60c are retained.
- Runtime audit passes: **40 files / 11,719,411 bytes**, **28 approved byte-identical WAVs**, eight unchanged art files and full Phaser/EventEmitter3/Vite notices. No gate WAV, unused pack/source archive or remote runtime asset.
- Native fresh regression: four PASS cases at **1280×720, 1440×900, 390×844 and 640×360**, exercising the normal 60c intro, actual joystick release, pause/Bag/Customize/audio preferences, Continue/reload and viewport resizing.
- Native rotation/travel regression: **21 PASS cases**. Canvas and WebGL each rotate live gameplay through **390×844 → 844×390 → 390×844 → 640×360 → 844×300 → 568×256 → 390×844**, reclaiming interrupted held touches and exercising actual movement/tool taps, planting/watering, Bag pagination, Pause/Audio/Journal, jump and save/reload. Six actual edge crossings (Home↔Farm, Home↔City, Home↔Forest) show no one-shot source starts or active effect voices at arrival. A fresh 568×256 phone completes all four intro panels and enters the normal 60c game. All controls remain on screen at touch size, with no console warning/error or external request.
- Supplemental final pass includes simulated **44px left/right + 21px bottom safe insets at 844×300**, and canvas translation without a logical-size change followed by a visual-viewport scroll notification. Native Pause/Save taps still hit after the translated canvas; reload preserves inventory/coins. These are controlled layout fixtures rather than a physical-device claim.
- Staged whitespace/hygiene checks exclude generated captures/test saves, credentials and vendor archives.

## Limits

The exact physical phone/browser was not supplied. Chrome viewport/touch/safe-area/bar emulation cannot certify actual iOS/Android rotation, browser chrome, device interruption/audio or other engines. Existing historical evidence remains unchanged. No new asset or dependency, push, deployment or submission.
