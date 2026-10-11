# Quiet house interior — v0.17.3, 2026-10-11

The user reports wind inside Home and requests retaining other effects. The continuous interior `room` loop (`fireplace.wav`) produced the wind-like background. `audioProfile` now returns no ambient layers indoors. Remove only that loop from `COZY_FILES`, the shared runtime/fetch/build allowlist. Other effect mappings, sleep/wake/rooster timing, outdoor profiles, title music policy and volume settings remain unchanged. House/crafting/placement, saves and once-per-save gift are untouched. Source WAV and licence/manifest provenance stay retained outside production.

## Checks

- `tests.txt`: **273 tests pass**. New lifecycle regression covers all nine house designs at four day/night times, no indoor loop request, preserved item/trade/furniture/sleep/wake effects and outdoor-loop retirement/restoration. Existing sound/purchase/save/gameplay tests pass.
- `build.txt`, `playtest-build.txt`: both builds succeed (**136 modules**).
- `local/sleep-checks.json`: **nine native browser audio cases** using disposable saves: Home/day quiet, Forest birds audible, snow/desert outdoor policy, Mac and phone sleep to evening/morning, and phone sleep cancellation. Actual Web Audio ambience output is **zero indoors**; no loop/WAV request there. Sleep and one morning rooster/evening wake effect still start and have audible measured output in sequence. Quiet Continue and cancelled sleep stay silent; gameplay music stays off. One canvas, clean console/audio failures.
- `runtime-audit.json`, `deployment-files.json`: **34 files / 11,543,935 bytes**, **22 reviewed WAVs**, eight unchanged runtime art files and full dependency notices. Fireplace/Wind/unused packs/archives/source/docs/credentials are excluded. Remaining WAV bytes match existing reviewed hashes.
- `git diff --check` passes. Existing source baseline **0cf62d95072f1bb95e1beff03d14eedf89175061 plus authorized uncommitted work**; no Git push/commit or new external asset/dependency/backend/paid service.

## Reproduction

```
npm test
npm run build
npm run build:playtest
AUDIO_QA_OUT=docs/verification/quiet-interior/local node tests/browser/sleep-wakeup.mjs
AUDIO_QA_OUT=docs/verification/quiet-interior /Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/qa/cozy-audio-audit.py
```

Isolated preview 4190 and disposable Mac 1280×720 / native-touch 390×844 contexts; user browser saves are untouched by automation. Actual audio graphs/source scheduling/output are measured. Physical phones, other browser engines and subjective listening review remain unverified.

## Authorized publication

Runtime-only staged production in the existing free `simple-life-playtest` / `htetaungkyaw71s-projects` project. Preview/generated URL protection remains `prod_deployment_urls_and_all_previews`. Test staged fresh Mac/touch games and all hashes before promotion; public [stable playtest](https://simple-life-playtest.vercel.app/) keeps the same save origin and needs no login/share query. Staged/public host results and safe deployment metadata are recorded here; no tester share token is stored in these reports. Refresh and Continue loads this update.

Final publication: READY promoted deployment **dpl_DLcL23nQQK4vS3AJnQ1N5bvafpnp**, safe metadata in deployment.json. `staged/hosted-checks.json` passes two fresh games and all 34 hashes before promotion. `hosted-checks.json` passes two fresh/reload games and all 34 exact public hashes; plain URL **200** without login/query. `public/sleep-checks.json` repeats all nine audio cases on the live origin, including **zero indoor ambience peak** on Mac/touch layouts and retained sleep/wake/rooster/outdoor output. No console/audio failures.
