# Forest entrance verification — v0.12.1

2026-10-10, native in-app Chromium, isolated QA origin 43863 serving the final production dist. Main 4175 origin/save kept separate. Keyboard/mouse actions only; canvas QA DOM attributes read for state confirmation.

- At 1280×720, load `/?qa&fixture=homeForestGate`, Continue and hold Up for 800ms: enters Forest at x=5120, y≈4848. Hold Down through the clear approach: returns Home through its north gate.
- Load `/?qa&fixture=portal`, Continue and hold Up for 350ms: the central Return Gate lands at (5120,4848).
- Load `/?qa&fixture=forestEntrance&reveal`, Continue and M: full-map.png shows Home at the southern centre. map-home.png captures the two-region discovery view; entrance.png shows the open natural grassy approach.
- Resize to 360×640 and open M: phone-map.png confirms menu bounds, 44px controls and Home label clear of habitat names. Temporary viewport reset afterward.
- Walk south to Home, navigate fixture-free `/?qa`, Continue: saved Home area retained. Isolated warn/error console log collection returned empty.
- Normal 4175 was refreshed, continued from the user's saved Forest position and paused. No fixture/reveal or test coin gift was applied there.

`npm test`: 199/199; `npm run build`: 106 modules; runtime allowlist: eight art files, twelve total dist files. Tests cover the full exit width, dry/walkable approach and junction, shared spawn/cooldown, obsolete southwest trigger, portal and legacy safe player/inventory preservation. Schema 13 unchanged. Physical phones, Safari/Firefox/Edge, sound balance and final competition acceptance are not claimed. Wood/stone project ideas have not been implemented.
