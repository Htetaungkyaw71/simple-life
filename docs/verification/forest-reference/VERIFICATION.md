# v0.4.8 verification — 2026-10-08

- `npm test`: **106/106 pass**. Retained checks cover crops, City/land purchases, market pricing, time/sleep/fatigue, all schema migrations, free jumping, boar warning/charges/hides, 25%-coin recovery, all river/bridge footprints and BFS reachability of 20 regions / 63 fruit nodes / 14 caches.
- Updated superseded all-species tests assert only five supplied animal identities, 16 saved boars and one nearby guard per cache; real boar directional combat/respawn and malformed/removed save records remain covered. New tests check original frame families/three foliage layers, dense non-row grass, coherent deterministic forest-only soil and retained farm/cache/discovery/injured-boar/stash progress.
- `npm run build`: pass, version 0.4.8, 66 modules. Eight art-file allowlist / twelve total files / 2,004,320 bytes; no archives, vendor originals, source manifests, other animal packs or QA artefacts. See build-art-audit.json.
- Pixel audit against da94557: all 258 Craftpix cells unchanged, 440 retained cells unchanged, only 27 existing grass cells changed; seven new original forest cells and 447 removed animal cells. Six non-atlas art files including both farmer sheets unchanged.
- `git diff --check`: pass. Local Vite preview remains listening on 127.0.0.1:4175. HTTP GET returns the current index with index-DuA8TZ4-.js.

## Art studies
Run from the project root:

```sh
node scripts/qa/forest-reference-floor.mjs
python3 scripts/qa/forest-reference-study.py
```

Python needs Pillow (already recorded under docs/licenses). These scripts use the actual deterministic map/terrain functions and atlas cells, then approximate sprite placement/palette/canopy fade in an offline Pillow composition. They do **not** instantiate Phaser, run gameplay, verify interaction, render the HUD/night/bridges/ripples or measure device performance. Files homewood-study.png, deepwood-study.png and riverbank-study.png are visibly labelled offline studies. New density: 2,512 trees + 47 bamboo stands, 353 low palmettos, 7,945 responsive grass clumps. Visual review checked different crown profiles/full palms, olive colours, pixel edges, overlapping vegetation and warm soil pockets. A local CPU terrain bake was 466ms; this is not a browser/device benchmark.

## Browser limitation
The browser tool previously rejected read-only selection of the existing http://127.0.0.1:4175/ tab under its URL protocol policy, despite reporting http/https as allowed. Current read-only inventory sees that existing user tab. The restriction was respected: no raw CDP, alternate browser, OS automation or indirect navigation workaround. Native movement/jump/grass/water/combat/map/save checks and responsive/Canvas/WebGL/performance review of this version remain **unverified**. Earlier versions' browser results are historical and cannot certify this pass. User-origin save was not modified by QA. Final human acceptance/physical devices/other engines remain outstanding. No push/publication/submission.
