# Farmer boy action export checks — 2026-10-13

Generation/export scope only; existing v0.25.0 game remains playable with its approved male/female sprites.

- Native audit:156 individual48×48 PNGs, binary0/255 alpha, shared32-colour palette, nonempty ink strictly inside cells, all four idle heights30pixels. Nine selected raw PNGs are byte-identical to their imagegen originals. Seventeen tracked existing runtime pixel/font/JSON files remain byte-identical to HEAD. ZIP contains all156 frames; native sheet hashes and per-direction phase counts are in source record.json.
- Every running direction has eight distinct native phases; all other action directions have six distinct phases. Distinct pixel phases do not by themselves certify natural human motion. Contact sheet and generated inputs were visually inspected; source directional errors were corrected with imagegen and documented mirroring.
- Interactive preview checked in isolated Chrome at1280×900 and390×844:28 canvases load, all expected phases render, pause/resume and1.5× speed work, no horizontal overflow or page/console errors. A missing favicon initially produced404 and was corrected. Local captures/report stay under this directory, excluded from runtime.
- `npm test`:318 pass,0fail. `npm run build`:passes. Production asset allowlist stays unchanged and excludes all source/export/prompt/preview files. No gameplay interaction was changed; this browser check tests the affected animation-review artifact.

Reproduce export with bundled Pillow Python: `python3 scripts/export_farmer_boy_actions.py`. Serve `output/art` locally and open `farmer-boy-actions-v1/index.html`. Live review during this session: http://127.0.0.1:4202/farmer-boy-actions-v1/ . No generated file is fetched remotely at runtime.

Limitations: generated tool shapes and body/head clusters can vary between action sheets; transition polish, per-pose hand alignment and gameplay event timing need a later integration pass. No claim of authored jump motion, physical-phone testing, Safari/Firefox verification, final user acceptance or competition eligibility. The gallery is a companion asset-review document and does not replace the game's fullscreen Phaser canvas shell.
