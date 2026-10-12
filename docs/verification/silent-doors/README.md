# v0.18.6 — silent house exits and authorized playtest update, 2026-10-12

The user explicitly requests silent house exit followed by deployment to the existing game. Entry remains silent. Removing the travel sound call and door sample mapping blocks playback/preloading/fallback and excludes the retired sample from runtime. Other actions/ambience, game state and responsive UI remain. The release includes the preceding local v0.18.0–0.18.5 work.

## Build and release scope

296 tests and normal/explicit-playtest builds pass (137 modules each). Runtime audit passes: 43 files / 11,712,035 bytes / 27 approved WAVs, with byte-identical prior art/fonts and full notices. The static release stage is /private/tmp/simple-life-playtest-v0186/.vercel/output/static; only audited runtime files upload. Project prj_yAUSg3ycEwhd7xCyR5izuTPSUnRh / simple-life-playtest; team team_N7fzv8ro0kcyz4cs9Pt3Mnm2 / htetaungkyaw71s-projects. Existing protection prod_deployment_urls_and_all_previews stays unchanged. Static noindex/noarchive headers remain. CLI 63.1.2 uses its existing login; the connector cannot access this project, so CLI verification succeeds with explicit scope.

The hosted playtest keeps explicit VITE_PLAYTEST=true mode and its once-per-save +100,000c gift; normal builds retain the 60-coin start. Publishing uses the same origin so browser-local saves continue. No user-profile storage, source push, paid service, backend or organizer submission.

## Local browser verification

Eight house round-trip cases pass: Canvas/WebGL at desktop 1280×720, portrait 390×844 and landscape 844×390 / 568×256. Actual keyboard/touch exit and re-entry create no door one-shot or request; Save/reload preserves inventory and coins. Two fresh explicit-playtest cases pass on desktop and portrait phone, including all 43 runtime file hashes, Axe controls, phone jump and Continue. Disposable contexts only; clean console and requests.

## Reproduction

```sh
npm test
npm run build
npm run build:playtest -- --outDir /tmp/simple-life-v0186-playtest --emptyOutDir
# Stable explicit playtest preview on port 4199.
GAME_URL=http://127.0.0.1:4199/ QA_OUT=/tmp/simple-life-v0186-house node tests/browser/silent-house.mjs
PUBLIC_PLAYTEST_URL=http://127.0.0.1:4199/ PLAYTEST_COINS=100060 AUDIO_QA_OUT=/tmp/simple-life-v0186-hosted node tests/browser/playtest-hosted.mjs
AUDIO_QA_OUT=/tmp/simple-life-v0186-audit python3 scripts/qa/cozy-audio-audit.py
```

Native checks use disposable Chrome contexts. House fixtures start inside near the exit, then walk back to the entrance for re-entry. The initial harness tried to re-enter directly from the outside spawn, where no doorway context exists; correcting that movement leaves gameplay unchanged. The audio observer also waits for earlier menu voices to finish before measuring travel. One-shot Web Audio sources are observed after actual keyboard/touch travel; ambient loops are excluded. Save/reload keeps inventory and money. Fresh playtest checks exercise startup, Axe equip/put-away, phone jump, reload/Continue and every runtime file hash.

## Limits

Chrome mobile profiles are emulation. Physical-phone/Safari/WebKit appearance, touch comfort and subjective listening remain user checks. Competition rights/signatures/submission requirements remain the team's review; this deployment is the authorized friend playtest update only.
