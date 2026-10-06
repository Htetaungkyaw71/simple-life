# Technical notes — farming presentation
Phaser 3.90.0 / Vite 6.4.3 / JavaScript ES modules; HTML5 Canvas, fullscreen RESIZE, nearest filtering, rounded pixels. No backend, DOM HUD, remote runtime resources or new dependency. Eight runtime art files remain allowlisted. Production is approximately 1.6 MB uncompressed, mostly Phaser.

Outdoor zoom 1 / farmer scale 2; indoor zoom 2 / farmer scale 1 gives the same 64px frame. Furniture remains scale 2 for a cozy readable room. Responsive layout fits desktop; mobile camera follows a minimum 480-unit-wide room. Indoor movement halves world speed, preserving displayed speed. Shared feet probes are 24×12 outside and 12×6 inside; house-specific visual clearance is retained. Shed collision uses ground geometry, not projected roof pixels.

Schema 5 keeps the existing localStorage key and migrates versions 1/2/3/4 individually. Crop window cursors prevent repeated missed-water evaluation on reload/rest/sleep. Room size accompanies indoor saves for responsive remapping; shared nearest-safe geometry repairs invalid coordinates. See ARCHITECTURE.md for contracts. City remains closed; existing seed/produce economy functions are now used at the Farm board.

Current acceptance scripts and evidence: VERIFICATION.md. Read-only QA snapshots are exposed by development or ?qa; collision outlines only in development. No galleries/scripts/vendor files ship in dist. Mobile checks use Chromium emulation; physical phones and non-Chromium browsers remain unverified.

Optional Python/Pillow regeneration: scripts/process-rpg-assets.py imports crop_art.py for eight original tomato states and two soil frames. Original bitmap font/UI remain in generate-pixel-assets.py. npm builds use committed assets and need no Python. Serve dist over HTTP(S). No publishing or push in this task.

Milestone 1.1 adds pure crop information, saved first-Farm-visit migration and contextual Phaser UI only. No runtime dependency or art-file change. New original glyph masks and road-board geometry are source-authored in statusArt.js/worldArt.js; the production eight-file asset allowlist remains unchanged.

Milestone 1.2 uses 64 plot slots per farm and independently saved field ownership/currentFarm. Additional farms reuse the authored map and scene, with independent crops and shared time/care. The 100-farm limit bounds validation/storage; typical saves are far smaller. No new dependency, image asset or remote service. Field/new-farm costs are configurable in data/farms.js. Late night caps at minute 1439 and continues allowing play until explicit bed Sleep; autosave/refresh cannot force sleep. Expanded crop panels use context coordinates rather than first-field indices.
