# v0.4.9 verification — 2026-10-08

- `npm test`: **112/112 pass** (tests.txt). Retained farming/City/land/market/care/time/sleep/fatigue/club/combat/defeat/recovery/save rules remain covered. Six new expansion checks cover exactly twice v0.4.8 area/original region coordinates, modest western tree thinning, independently wavy integer river banks, complete nonoverlapping GPU-safe tile coverage, dry fruit/native pair groups and old schema-9 progress/new-region initialization.
- BFS reaches every one of forty regions, 163 fruit spots and fourteen finite guarded caches. Shared water rows/wading agree; all twenty-two bridges span their channels, meet dry land and remain walkable. Full grass footprints avoid water/decks; tree roots avoid water. New boar/quiet homes are safe, with new boar footprints dry. Existing wet-player/bag tests select the actual widened channel centre; saved positions/amounts/stocks survive. Old discovery/cache/forage IDs, original boar health and legacy +4096 Y migration remain.
- `npm run build`: pass, version 0.4.9, 69 modules (build.txt). Twelve files / eight art files / 2,008,179 bytes; no vendor archives, manifests, generator/QA scripts/images or unused packs. All eight art files match baseline 8275b7f exactly, with 474 town atlas entries. See build-art-audit.json.
- `git diff --check`: pass. Existing Vite preview PID 22732 remains on 127.0.0.1:4175. Local HTTP GET succeeds and contains index-BIKc8sEC.js. This checks server/build availability, not Phaser/browser play.

## Offline art review

Run from the project root:

```sh
node scripts/qa/forest-expansion-floor.mjs
python3 scripts/qa/forest-expansion-study.py
```

Python requires the recorded Pillow tooling. Scripts use actual deterministic map/terrain functions and approved atlas cells, then approximate sprite placement/palette/crown fade in an offline Pillow composition. Inspected homewood-study.png, eastern-grove-study.png and riversong-study.png are visibly labelled **OFFLINE ART STUDY / NOT A BROWSER CAPTURE**. Review checked retained olive art, slightly more open western clearings, eastern palms/ground cover and uneven riverbanks/sandy pockets. Forest: 4,070 trees (2,092 west / 1,978 east), 110 bamboo, 628 palmettos and 15,027 responsive grass clumps. Western tree count is 16.7% lower than baseline 2,512. Local CPU terrain bake took 1,263ms; it is not a browser/device loading/performance benchmark.

Studies do not instantiate Phaser, interact with animals/fruit, render the HUD/night/bridges/animated ripples or verify responsive/device performance. Source ground is coherently baked at 5120×2560 native pixels and sliced into six <=2048×2048 native cached textures for runtime; pure tests verify coverage and bounds, while browser texture acceptance remains unverified.

## Browser limitation

The browser tool previously rejected read-only selection of the existing http://127.0.0.1:4175/ user tab under its URL protocol policy, despite reporting http/https allowed. The restriction persists in this task's recorded context and was respected: no raw CDP, alternate browser surface, OS automation or indirect navigation workaround. Current native movement/jump/grass/water/fruit/combat/map/save checks, responsive Canvas/WebGL and device performance remain **unverified**. Earlier browser results are historical and cannot certify this extension. User-origin save was untouched by QA. Physical devices/other engines, balance and final human acceptance remain outstanding. No push/publication/submission.
