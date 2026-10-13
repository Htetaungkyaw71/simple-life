# v0.24.0 approved PixelLab farmer checks

The user-approved export is packed at native resolution, with four 32×32 static idle directions translated into 48×48 cells at (8,9), plus 32 untouched running PNGs. Ground row 40, integer 2× scale and nearest filtering. Eight frames at 16 fps make a half-second loop. Other looks, girl and town atlas are byte-identical to v0.23.0.

Run `audit-assets.py` with bundled Python/Pillow from the project root. Source audit verifies 41 file hashes, 48 exact packed cells / 14,142 nontransparent pixels, 32 original running frames, eight unique frames per direction and 48 real opaque skin-pixel grips. Shared ground registration retains source motion instead of individually recentering frames.

317 tests and normal/explicit playtest builds pass. Disposable browser fixtures verify desktop English, landscape Myanmar and portrait Myanmar WebGL appearance/purchases, tools, jump, rotation and reload; keyboard/touch movement observes all eight phases and tools follow original hand positions; three depth profiles cover indoors, occlusion, crops, bridges, ground/jump shadows, shallow-water cropping/reflections and saves. Browser consoles are clean. Original Szadiart rig checks cover the retained 112 style/NPC direction cycles.

Runtime allowlist remains 46 files / 12,199,891 bytes / 27 unchanged WAVs. Runtime source PNGs match byte-for-byte, dependency notices remain and source archives/evidence/unused PNGs are excluded. Publication checks are recorded after deployment. No source push or competition submission. Physical phones/Safari and human visual acceptance remain unverified.
