# Outdoor nature and default plant collection — v0.17.4, 2026-10-11

The user reports outdoor silence and asks to gather all default ground plants, supplying a wildflower screenshot. Home/Farm/City daytime profiles had no nature layer. Reuse the existing approved birds WAV at 60% layer gain there; preserve Forest habitat policy, night crickets, positional river/fountain, successful-action SFX and every quiet indoor profile. No wind or gameplay music is restored.

Register default flowers (all six variants), ferns, mushrooms, snow/dry grass, low palmettos, animated plants and bamboo in the existing grass collection system, from map details and props. Use native sprite feet. Empty hands gather one Grass with the existing pickup sample; prevent duplicate/full-bag/tired/wrong-tool/distance/blocked interactions. Removal persists per area/farm and after reload, cleans animation references and removes bamboo's own solid mask. Crops, axe trees and purchased decoration choices stay separate. Existing Grass tool still replants grass; this request does not add a new plant inventory system.

## Verification

- `tests.txt`: **276 tests pass**, including every default ground-plant frame in all outdoor areas, atomic guards, duplicate/reload prevention, farm isolation, bamboo clearance and outdoor/interior audio lifecycle.
- `build.txt`, `playtest-build.txt`: normal and explicit playtest builds pass, **136 modules**. Existing schema 18 and once-per-save +100000 gift retained.
- `local/plant-checks.json`: **14 real browser cases**: Mac mouse and native touch 390×844, default flowers Home/Farm/City/Forest, animated Forest plants and bamboo. Immediate visual removal, exactly one reward and short pickup audio measured during the action, saved reload removal, ordinary mobile taps stay inactive. Two actual house exits restore measured outdoor birds from silent indoors; doors remain silent. Screenshots visually reviewed on Mac/phone layouts.
- `local/sleep-checks.json`: **nine browser audio cases**: daytime outdoor birds, unchanged quiet snow/desert policy, Mac/touch sleep and evening/morning wake with preserved sound output, cancellation. Zero indoor ambience output and no wind/fireplace fetch, no gameplay music or console/audio failures.
- `runtime-audit.json`: **34 files / 11,544,720 bytes / 22 approved WAVs / eight unchanged art files**, full dependency notices. Every audio/art byte retains reviewed provenance. No archives, unused assets, new dependency/backend or paid service. `deployment-files.json` hashes the runtime-only stage.
- Source baseline **0cf62d95072f1bb95e1beff03d14eedf89175061 plus authorized uncommitted work**. `git diff --check` passes; no commit or push.

The first pickup measurement waited until after the brief sound had ended during a large Forest snapshot. The final browser check samples the actual effects bus during collection; all 14 cases pass. This was a test timing correction, not an audio fallback/change.

## Reproduction

```
npm test
npm run build
npm run build:playtest
AUDIO_QA_OUT=docs/verification/outdoor-plants/local node tests/browser/outdoor-plants.mjs
AUDIO_QA_OUT=docs/verification/outdoor-plants/local node tests/browser/sleep-wakeup.mjs
AUDIO_QA_OUT=docs/verification/outdoor-plants /Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/qa/cozy-audio-audit.py
```

Disposable browser contexts and targeted saves; user saves untouched. Chromium Mac and phone layouts verified. Physical phones, Safari/Firefox/Edge and subjective listening remain unverified. Pure gameplay and real Web Audio output are checked.

## Publication

Existing authorized free Vercel `simple-life-playtest` / `htetaungkyaw71s-projects`, unchanged preview/generated protection `prod_deployment_urls_and_all_previews`. Runtime-only production stage is checked before promoting to the stable public URL; safe deployment metadata contains no access secret. Hosted results recorded alongside this report after completion.

READY promoted deployment **dpl_7nvBNxA22GFybwBYQ85J3qDAP5dZ**. Two staged and two public fresh/save flows pass; all **34 hosted file hashes** match. Public origin returns **200** without a login, redirect or share query. Safe metadata is `deployment.json`; friend URL remains **https://simple-life-playtest.vercel.app/**. Refresh and Continue preserves the same-origin save.

`public/plant-checks.json`: **six live affected cases** repeat Mac/touch Home/Farm flower collection, measured pickup audio, immediate visual removal and saved reload, plus two actual exits from quiet interiors to audible outdoor birds. No console/audio failures or gameplay music. Local Forest/City/animated/bamboo checks are covered by the 14-case local suite and exact deployed hashes.
