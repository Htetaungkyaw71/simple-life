# v0.18.4 UI typography, house sound and mobile layout — 2026-10-12

The user's five phone screenshots identify unclear lettering, the customization footer crossing a button, cramped project/request rewards and a small interior. Changes use actual Thaleah Fat/m5x7 assets, keep UI text at native integer multiples, disable smoothing, reserve readable content/footer spacing and enlarge the landscape phone room.

## Reproduction

```sh
npm test
npm run build
npm run build:playtest -- --outDir /tmp/simple-life-v0184-playtest --emptyOutDir
# Keep the built dist stable while running browser suites.
GAME_URL=http://127.0.0.1:4198/ QA_FILTER=canvas QA_OUT=/tmp/simple-life-v0184-canvas node tests/browser/ui-typography.mjs
GAME_URL=http://127.0.0.1:4198/ QA_FILTER=webgl QA_OUT=/tmp/simple-life-v0184-webgl node tests/browser/ui-typography.mjs
node tests/browser/ui-typography-extras.mjs
GAME_URL=http://127.0.0.1:4198/ node tests/browser/startup.mjs
GAME_URL=http://127.0.0.1:4198/ node tests/browser/mobile-rotation.mjs
AUDIO_QA_OUT=/tmp/simple-life-v0184-audit python3 scripts/qa/cozy-audio-audit.py
git diff --check
```

## Evidence

- **295 unit/system tests pass**. New tests exercise a genuinely delayed door load, recording-only playback, natural rate, clear gain, one queued play and cleanup; long Journal hints and completion text before the footer; the pinned Canvas bitmap renderer still draws recoloured whole-sheet glyphs. The offline adapter now reads each actual font XML/native metric.
- **Normal and explicit playtest builds pass, 137 modules each**. Normal balance remains 60 coins; build-mode behavior and save regressions pass.
- The typography browser suite covers **30 cases**: Canvas/WebGL × desktop 1280×720, landscape 844×390/640×360/568×256 and portrait 390×844 × Home/City/Farm. It asserts native font-size multiples, integer text ancestor scales, extra leading, panel/viewport bounds, nonoverlapping resource text and footer clearance. Native clicks/taps exercise customization/house/garden/furniture, Copper Can, Commons/flower court/requests, Bag categories, Journal and all four introduction pages. Actual Commons construction consumes exactly 12 Wood/6 Stone and awards 240 coins. Actual house entry checks interior zoom and decoded wooden-door buffer duration. Both renderer reports live in the paths above. These 30 cases precede the final high-stock slot abbreviation; the six supplementary cases verify that last change.
- **Six supplementary phone cases pass**, run with `tests/browser/ui-typography-extras.mjs`: Canvas/WebGL × 390×844, 568×256 and 844×300. Native taps reach creator attribution, page completion letter/statistics, Continue back into gameplay and open high-stock Bag pages, with native typography/bounded text and clean consoles. Stock slots abbreviate 9999 to 9k while the selected Bag item retains the exact 9999 count. They use explicitly completed disposable saves, not user storage. Evidence: `/tmp/simple-life-v0184-extra`.
- **Eight fresh startup/save cases and 21 live rotation/farming/menu/travel cases pass** using the existing scripts during typography work. Fresh contexts explicitly distinguish desktop without touch from phones with touch; normal 60c start, native movement, cancel, Save/reload/Continue, rotation, planting/watering, tool/Bag/Audio/Journal/jump and six silent outdoor crossings remain valid. Those earlier runs precede the last small credit/resource footer spacing corrections; final typography cases exercise those corrections separately.
- Visually inspected title, portrait house preview, enlarged landscape interior, project/request/customization and shortest landscape resource captures. An early short-screen overlap caught by visual inspection is fixed with side-by-side costs and a separate reward row; the final suite asserts actual text intersections and footer clearance. A superseded full suite encountered a temporary navigation failure while dist was rebuilt; final runs use a stable dist.
- Runtime audit: **44 files / 11,745,847 bytes**, **28 unchanged approved WAVs**, **eight unchanged prior art files**, **four new hash-verified font files with binary alpha**, full Phaser/EventEmitter3/Vite notices. Source TTFs, archives, unused fonts/packs, documents and QA captures are excluded. Audit report: `/tmp/simple-life-v0184-audit/runtime-audit.json`.
- The LAN endpoint **http://192.168.100.7:4198/** returns HTTP 200. It serves the rebuilt dist; Mac and phone must share Wi-Fi and the server must remain running. Mac URL: http://127.0.0.1:4196/.

## Limits

Native Chrome emulation verifies the listed viewports/renderers and interactions. Final physical-phone appearance, touch comfort, subjective sound acceptance, Safari/WebKit and other engines remain user checks. Camera enlargement is for compact mobile landscape interiors; outdoor landscape retains wider .75 framing. Existing room/collision/furniture/save rules and world lettering/art remain. No publication/push or user-save editing.
