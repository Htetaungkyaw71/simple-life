# v0.18.0 judge polish verification — 2026-10-11

## Scope and safety

Latest playable v0.17.4 passed 276 tests and its normal build before local checkpoint `3ececed`. Checkpoint includes the existing authorized source/licence work, excluding vendor archives, credentials and generated QA captures. New work uses fresh or explicitly identified disposable test contexts; the public deployed game was inspected at its title without Play/Continue or changing its browser save. No push, deployment or competition submission.

The native matrix and story timing method are recorded below. Temporary PNGs/JSON/traces/test saves remain outside the commit. `.gitignore` also excludes earlier untracked generated QA media/reports while preserving them locally; authored verification READMEs and already tracked historical evidence remain.

## Commands

```sh
npm test
npm run build
npm run build:playtest -- --outDir /tmp/simple-life-judge-playtest-final --emptyOutDir
git diff --check
AUDIO_QA_OUT=/tmp/simple-life-judge-audit python3 scripts/qa/cozy-audio-audit.py
# Use the bundled Python/runtime module on the test host, or set these overrides:
# PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs
# CHROME_EXECUTABLE=/absolute/path/to/native/chrome
npm run preview -- --port 4196
GAME_URL=http://127.0.0.1:4196/ QA_OUT=/tmp/simple-life-judge-final node tests/browser/judge-polish.mjs
GAME_URL=http://127.0.0.1:4196/ node tests/browser/judge-resize.mjs
GAME_URL=http://127.0.0.1:4196/ AUDIO_QA_OUT=/tmp/simple-life-judge-audio node tests/browser/audio-lifecycle.mjs
GAME_URL=http://127.0.0.1:4196/ QA_OUT=/tmp/simple-life-judge-story-final node tests/browser/judge-playthrough.mjs
GAME_URL=http://127.0.0.1:4196/ QA_OUT=/tmp/simple-life-judge-first-loop-final GUIDED=1 node tests/browser/judge-playthrough.mjs
npm run preview -- --port 4197 --outDir /tmp/simple-life-judge-playtest-final
GAME_URL=http://127.0.0.1:4197/ PLAYTEST=1 QA_CASE=fresh QA_OUT=/tmp/simple-life-judge-playtest-qa node tests/browser/judge-polish.mjs
```

Browser scripts use installed native Chrome in headless disposable contexts, actual keyboard/mouse/touch input and read-only game snapshots. `judge-polish.mjs` injects only clearly identified pre-load fixtures for targeted purchase, harvest/sale, Copper, late-story, boar, map and death/recovery cases; it is not evidence of natural completion time. The battle fixture isolates one boar to test warning/loot, while the fresh story meets its actual untouched cache guard. Default fresh story and first-loop scripts use no fixture, localStorage editing, gift, teleport, debug hook or crop-growth injection; optional QA_RESUME_SAVE restores only the unchanged game-produced disposable save and is disclosed below; bed rests are actual in-game actions. The default full-story driver rests at 20:00, as the Journal recommends; WAIT_MIDNIGHT=1 retains the conservative full-day variant. GUIDED=1 exercises the fastest actual-bed farming loop. Pure route search assists navigation, so optimized input timings are not novice human timings. Fresh timing runs use the final clock/economy/story/combat rules; the last cosmetic planting-hand gesture and Copper palette are covered separately by final native farm cases, and completion reload verifies the final artifact.

## Completed system/build checks

- Full final suite: **290 pass / 0 fail**, including gift isolation, 450-second deterministic clock/frame sizes, pause predicate, twelve crop tradeoffs and low-market profits, migration/ripe crops/completed story, stopped Copper ray/preview/cost/custom beds, no duplicate purchase/reward, exact food preview/cooldown, landmark Journal/map chapter gate, non-cancellable boar warning/recovery, 25% Stash/second-death/reload/negative/inventory/Keep­sake protection, audio lifecycle/mute/quiet interiors and the existing architecture/route/collision regressions.
- Both normal and explicit playtest production builds pass. No new dependency. Normal artifact remains in `dist`; playtest is separate in `/tmp`.
- Runtime audit: **41 files / 11,762,498 bytes**, eight unchanged allowed art files, **29 reviewed byte-identical WAVs**, full Phaser/EventEmitter3/Vite notices. No source/vendor archives, unused pack files, wind/fireplace or historical generated audio scores. Manifest hashes, PCM22050 mono16, peak/RMS/DC/seams pass.
- `git diff --check` passes for the new change. Unchanged archived creator HTML has historical whitespace and is not rewritten.
- Audio lifecycle: Canvas and WebGL, one AudioContext, 120-second Canvas title, twelve Pause/Audio cycles and twelve Title/Continue cycles per renderer, native touch Jump/attack, blur suspend/focus resume, bounded loops/voices, persisted preferences, clean errors/warnings and same-origin requests. Separate final fresh runs exercise actual mute/unmute and volume persistence.
- Resize regression: 640×360 → 390×844 → 640×360 confirms canvas and fullscreen host exactly match each new viewport with bounded controls. Before the fix, canvas retained the previous viewport; host ResizeObserver now resizes Phaser after layout.

## Progression measurements

Fresh optimized starter farming completed in **13–17 seconds**, and 12 Wood was collected by **30 seconds** on the final build. A separate fresh Journal-order run met a resident at **94s**, collected 12 Wood at **109s**, completed fruit errands at **228s** and built Commons at **303s**. Final fast guided first loop: harvest **403.143s (6.72 min)**; first sale **435.554s (7.26 min)**, with 60c/no gift, ordinary input/actual bed rests, and zero console errors/warnings. This demonstrates an achievable loop with room for 8–12-minute reading/learning; it does not certify blind human pacing. The evening-rest story path and its save continuation are measured below. Fast known-route drivers omit novice reading/learning; an 8–12-minute human Journal loop remains a final playtest target, not a measured human result.

Final native matrix: **41 normal-build cases + four explicit-playtest fresh cases**, all PASS at **1280×720, 1440×900, 390×844 and 640×360**. The normal matrix covers fresh four-panel intro, Continue/reload, Journal/Bag/Customize pause, real joystick hold/release, actual mute/unmute/volume persistence, fullscreen rotation, planting/watering/failed use, ripe harvesting and nonduplication, three-bed Copper/reload, all twelve seed-information strings and native text bounds, City sale, Copper purchase, ending letter/stats/continue, tree felling/reload, custom-bed coverage, active desktop/touch boar dodging/loot, hidden/late destination map, death/reload and one-time Stash recovery. Every case has zero console errors/warnings, zero audio failures and only same-origin/data/blob requests. Ten additional final-artifact Copper cases (five Canvas, five WebGL) pass across the four sizes and custom beds, including the cached copper pixels, preview, actual watering and reload.

Evening-rest story path: **PASS, 1,453.778s / approximately 24.23 minutes**, day 4, one harvest/two Tomatoes sold, Commons, fruit/eating/resident, one actual cache guard defeated, Keepsake collected/placed, zero deaths. Ending letter/statistics/continue and reload retain completion. The final continuation reports zero console errors/warnings and no testing gift. The fresh prefix reached Commons at **287s**, harvest at **1,140s**, and sale at **1,168.287s**; it then stalled when the input driver tried to approach the guard through a tree. The driver now chooses a walkable approach around obstacles. The unchanged game-produced state from the 1,331s capture was restored once into a new disposable context; the final artifact completed through ordinary input. Equality against the original failed-run snapshot was checked (canonical SHA256 `d481892fd6b983483f2334e6b77a16392812598bf9a14a08c383989d708def45`). No coins, flags, inventory, health, day or positions were edited. Total time combines the rounded captured prefix and continuation; excludes browser restart/offline downtime, includes the original approach stall, and is not an uninterrupted fresh-run or blind-human benchmark. In-game active completion was **1,433s / 23.88 minutes**, with 25 HP remaining. Stash explanation is in the Journal and actual death/recovery are verified separately in the targeted matrix.

The fastest bed-rest loop (7.26-minute sale) and the evening-rest path (19.47-minute sale) bracket different play styles. An 8–12-minute novice first sale is a human playtest target; automated timings do not establish it. The unchanged-save continuation verifies that the main ending is reachable with the normal economy in the requested approximate 20–30-minute arc.

## Human checks still required

Subjective illustration/animation/audio acceptance, actual iPhone/Android hardware and Safari/Firefox, blind novice timing, long-run optional house/farm economy and performance across low-end devices are not certified by Chrome emulation. Human competition rights/eligibility/team signatures, demo/profile, final assigned-host/source-reviewer/portal declarations and submission remain pending. No test signs or submits a declaration.
