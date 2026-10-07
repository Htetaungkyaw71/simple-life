# Supplied art verification — 2026-10-07, v0.4.3 / schema 9

- Native integrity/gallery script: 72 populated 24×32 player cells across two 216×128 sheets. All 48 selected idle/walk cells exactly match supplied native crops/direction rows; remaining 24 are adapted jump poses. Galleries inspected visually for faces, limbs, clipping and direction.
- `npm test`: 88/88 pass. `npm run build`: pass, no important warnings. Explicit build audit: 12 files / eight allowlisted runtime art PNG/JSON/XML, 2,021,045 bytes. No vendor archive, original pack sheet, unused asset, manifest, licence page, QA image or source script. No dependency change.
- `tests/browser/forest-growth.mjs`: existing real-input grass bending/spring-back, safe ledge jump, blocked solids, airborne attack, pause, grounded midair save/reload, both directional rigs, waterline/landing/reload, seven viewport jump/help controls, Canvas/WebGL night and interior checks pass. Evidence: `growth/results.json`. This full suite preceded the final cosmetic fir-frequency/palette selection and compact-menu refinements; these final refinements have focused evidence below.
- `tests/browser/supplied-art.mjs`: final production Canvas checks: boy/girl in Home, Farm, City, interior and Forest; 40 direction/animation/collision checks; unchanged 64-pixel displayed sheet height; seven distinct habitat screenshots; presence of jade/olive/fir/snow replacement trees; correctly anchored fading crown. Selection and all new credit/link pages fully inside seven viewports: 1440×900, 1280×720, 1024×768, 844×390, 390×844, 360×640, 640×360. Screenshots inspected. `final/results.json`: zero errors, warnings, failed requests or foreign requests.
- `tests/browser/forest-growth-final.mjs`: final production two-finger directional jump, movement continues after releasing jump finger, safe grounded landing, held-key repeat cannot chain jumps. `touch/results.json`: pass, empty errors/warnings/failed/foreign requests.
- `tests/browser/supplied-art-flow.mjs`: actual New Game → Boy/Girl selections, walking in water, airborne waterline hide, landing, Save/reload/Continue preserve character, 147 coins, three Mango and schema 9. `flow/results.json`: both pass, zero errors.

All checks use the isolated Chrome profile `/tmp/simple-life-supplied-art-chrome`, disposable incognito contexts/saves and real keyboard/mouse/CDP touch. User live storage is untouched. No title/credits link was followed externally by the test; URLs/attribution are declared source links activated only by the user. No runtime network beyond local same-origin assets/data/blob.

## Corrections and limits
The new compact forest credit page was shortened while checking landscape layout. The 640×360 check then exposed a pre-existing four-physical-pixel character-selection overrun; its compact portrait spacing was reduced by four logical pixels and the final seven-size checks pass. A water-flow test initially injected a fixture into an actively running Home page; pagehide autosave correctly replaced it during reload. The test now navigates to the title first before seeding disposable storage; this was a fixture-order issue, not a game/save failure. No runtime rules were changed for either issue.

Physical mobile hardware, other browser engines, long-session performance and human visual acceptance remain unverified. Channeechan/Eris Esra game terms are recorded; ToffeeCraft Standard Free personal-game terms do not expressly confirm public prize-entry coverage. User noncommercial local integration is recorded, not final competition rights clearance. No push/publication/submission.

## Repeat
Build and serve the local production preview on 4175. Use an isolated Chromium CDP endpoint and set `CDP_URL`, optionally `PLAYWRIGHT_MODULE` to an installed Playwright module, and `GAME_URL` if different. Run:

```sh
npm test
npm run build
python3 scripts/verify-character-frames.py # requires Pillow and the user source RAR
QA_OUTPUT=docs/verification/supplied-art/growth node tests/browser/forest-growth.mjs
node tests/browser/supplied-art.mjs
QA_OUTPUT=docs/verification/supplied-art/touch node tests/browser/forest-growth-final.mjs
node tests/browser/supplied-art-flow.mjs
```

These packages are development-only tooling, not new runtime dependencies. Art regeneration separately needs Pillow/bsdtar and both user-owned source archives; source paths can be overridden as documented in the licence record.
