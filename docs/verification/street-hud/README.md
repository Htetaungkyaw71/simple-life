# v0.7.3 axe, road and meter repairs — 2026-10-09

npm test: **167 passed, zero failed**. npm run build: **94 modules, 12 files / 2,280,176 bytes**. Whitespace and unchanged-art/runtime audit pass. No gameplay values, save schema or new asset files.

Meaningful regressions check every City cottage's exact solid silhouette and all twenty complete 40×64 sunflower footprints against paved paths, sidewalks and square circulation. Four cottages move onto dry parcels; two northern road spurs begin below the enlarged cottages. Dry commute/doorway and district reachability tests remain green. Axe checks include native farmer hand anchor, lower wood grip, no added hand, outward blade at idle/half/full swing, horizontal mirroring and behind-up/front-other layering. Existing utility switching/pause and HUD size/compact crop placement tests remain green.

Native browser verification serves the production build on isolated localhost port 43866; no normal-origin save reset. Actual key 5 equips Axe, and WASD changes facing/walks the repaired lane. The input → existing tool state → Phaser presentation → local save flow is checked with read-only DOM telemetry; no API/env dependency.

- cottage-lane.jpg: enlarged twin-gable house and both sunflowers on their garden parcel, wide clear road, front-facing Axe without an added skin block, matching cream/grey meters.
- axe-back.jpg, axe-right.jpg, axe-left.jpg, axe-front.jpg: actual movement facings; up-facing Axe uses back depth, other facings use front depth, blade points outward from the native grip.
- phone-meters.jpg (360×640) and compact-meters.jpg (640×360): matching round badges, beveled tracks and readable red health/gold energy with clear existing controls. Partial energy fill remains aligned; compact capture is at night.
- browser-checks.json: positions, held-tool transforms, player facings, viewport/control bounds and empty warnings/errors. Normal preview 4175 was refreshed and also reported no warnings/errors. QA tab/server closed and viewport override reset.

Reproduce: npm test; npm run build; python3 scripts/qa/street-hud-audit.py. The audit compares ef08d42, asserts all eight art files byte-identical and the exact runtime allowlist, and records hashes/build totals. The atlas still has 835 frames. Vendor archives, docs, scripts and QA fixtures/captures are excluded from production. Original meter source and retained licence evidence: [source record](../../assets/licenses/street-hud.md).

Limitations: Chromium viewport emulation only; physical devices/notches, other browser engines, sustained performance and human visual acceptance remain unverified. Existing licence/submission limitations remain. No download/dependency/backend/push/publication.
