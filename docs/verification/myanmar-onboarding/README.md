# v0.19.0 — English/Myanmar and clear first-player directions (2026-10-12)

## Behavior

Cold startup offers English / မြန်မာ, with a separate remembered language preference; title/pause Language switches it while retaining the same gameplay save. Menus, world labels, crops/stock/quotes/clock, dialogues, Journal/ending and first-start copy use local Unicode dictionaries. Latin game/creator/product names and licence identifiers remain original. New players receive four readable/paginated cards covering the Keepsake goal, actual device controls, daily farming/selling and the Home crate/south Farm route. The guide follows intro completion or Skip and replays from title Controls. Existing flags drive a reminder through collecting, planting and watering. Reading is paused and has no economic reward. Recovery aid and the irrigation sign now correctly describe daily watering / three watered Tomato nights.

Myanmar uses the original bundled Noto Sans Myanmar UI Regular 2.103 TTF, OpenType whole-run shaping in Phaser Text, integer 10/14/28 logical sizes and resolution/root scale 2, nearest textures and measured leading/padding. English retains original Thaleah/m5x7. Empty dynamic labels choose Myanmar-capable Text; numeric counters explicitly retain their Latin bitmap path. A failed/aborted font or an eight-second hung load offers English safely with Myanmar disabled and a retry note. No remote runtime font/API or new dependency.

## Checks

- npm test: 301 passing tests, including separate/denied language storage, unchanged saves, goal/story/crop copy coverage, exact dynamic transaction amounts and Unicode wrapping.
- Normal and explicit-playtest builds succeed: 143 modules. Exact runtime audit verifies 45 files, 27 unchanged approved WAVs, eight unchanged previous art files, four unchanged Latin font files, Noto manifest/hash/exact bytes and full copyright/OFL/dependency notices. No vendor/archive/source/doc/QA/credential runtime file.
- Language/startup: 16 native Chrome cases, English/Myanmar × Canvas/WebGL × desktop 1280×720, portrait 390×844, landscape 844×390 and shortest 568×256. Native mouse/touch exercise chooser, title, farmer/intro, every guide page, Bag/Gear, Pause/Audio/Controls/Journal, switching, Save/reload/Continue. Integer scales, measured bounds, targets ≥44 CSS pixels, no text overlap or ellipsis, unchanged economy and same-origin requests are checked.
- Myanmar shops: 16 cases, Canvas/WebGL × 320×568 / 390×844 / 844×390 / 568×256 × Buy Seeds / Market. All 12 seeds and 24 sale items, full paginated descriptions, page/tab navigation, quantities 1/5/MAX/ALL, full quotes, exact real stock/coin changes, paused time, rotation and Save/Continue pass. Four English narrow/landscape regression cases pass.
- Myanmar resources: 20 cases, four desktop/phone sizes × Home/City/Farm/interior/Forest. Native entry covers house purchase/confirmation, garden/craft/furniture, Town projects, cooking, map and full details; readable panels/targets/no overlapping copy pass.
- Additional copy/startup: English/Myanmar at portrait/shortest landscape, every four-page intro and font/artist credits; aborted-font and hung-font fallback. Six cases pass. Short credit panels put full attribution in a details/paged view, and source-link captions remain concise.
- Actual starter task: fresh normal 60-coin Myanmar girl game, real keyboard navigation, Home crate's three seeds, south travel, select Tomato seed, plant, select watering can and water. The starter/plant/water flags and wateredDay are earned by real input. The visible crop name/daily care explicitly use Myanmar-capable Text; no save injection.
- Farming presentation: 16 fixture cases at four sizes × watered / recovering-dry / dead / ripe Tomato. Dynamic glyph font, crop-card bounds, row separation and avoidance of control hit areas pass; all five Journal chapters are checked. At 844×390 the card reserves the action column and the prompt clears joystick/Jump. Very short 568×256 retains the established action-prompt fallback when the crop card cannot avoid the actor/HUD.
- Explicit playtest fresh desktop/phone checks exercise startup, Axe equip/put-away, native Jump, reload/Continue, audio and every runtime file hash. Fresh balance is 100060c, and the gift does not repeat. Normal mode remains 60c.

Final-build targeted reruns, publication identity/file hashes and public checks are recorded below after completion. All normal checks use disposable contexts; resource/trade/farming/house fixtures are identified. Automation never touches the user's browser profile/save.

## Corrections made during verification

The ES2020 target required promise-based font boot rather than top-level await. Measured Myanmar metrics exposed Bag/shop/resource/credit overlaps and long short-screen descriptions; separate bands, concise captions and pages/details address them. Visual inspection caught empty dynamic labels selecting Latin fonts despite later Myanmar translations; the shared helper and explicit numeric role fix this, and actual visible farming plus sixteen status fixtures verify it. The landscape crop card and prompt now avoid actor/action/joystick space. The local preview's small connection backlog caused one network-reset check; a fixed production preview with a larger backlog passes the repeated English cases. The deliberate hung-font test waits for DOM readiness and scene readiness instead of waiting for its intentionally unfinished font request.

## Reproduction

```sh
npm test
npm run build
npm run build:playtest -- --outDir /tmp/simple-life-v0190-playtest --emptyOutDir
GAME_URL=http://127.0.0.1:4208/ node tests/browser/language-onboarding.mjs
GAME_URL=http://127.0.0.1:4208/ node tests/browser/language-extra.mjs
GAME_URL=http://127.0.0.1:4208/ node tests/browser/language-first-job.mjs
GAME_URL=http://127.0.0.1:4208/ node tests/browser/myanmar-gameplay.mjs
GAME_URL=http://127.0.0.1:4208/ QA_FILTER='(canvas|webgl)-(320x568|390x844|844x390|568x256)' node tests/browser/myanmar-trade.mjs
GAME_URL=http://127.0.0.1:4208/ node tests/browser/myanmar-resources.mjs
AUDIO_QA_OUT=/tmp/simple-life-v0190-audit python3 scripts/qa/cozy-audio-audit.py
```

Use a Python runtime with NumPy/Pillow for the audit and native Chrome/Playwright paths configured in the browser scripts. Local Mac preview: http://127.0.0.1:4196/ ; phone on the same Wi-Fi/Mac server: http://192.168.100.7:4198/ .

## Limits

Phone profiles are Chromium touch emulation. Physical iOS/Android, Safari/WebKit/other engines, touch comfort and native-speaker phrasing acceptance remain human checks. The language preference is per origin/browser, like existing local saves. Competition rights/signatures/demo/submission and subjective acceptance are not certified by these checks. No Git push, new backend/paid resource or organizer submission.
