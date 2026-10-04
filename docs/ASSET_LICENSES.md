# Assets, licences and creation sources
## Current original pixel assets — 2026-10-03–04
All files below were newly authored with Codex assistance for Simple Life using deterministic integer-pixel drawing in `scripts/generate-pixel-assets.py`. They are original temporary game assets, not downloaded art or copied reference assets. PNGs are rasterized by Pillow without smoothing, then loaded locally by Phaser. There are no externally licensed art packs. Team usage-rights/human-review confirmation remains required before the final competition declaration; this file is not a signed legal opinion.

| Runtime file / atlas frames | Purpose | Creator/source |
| --- | --- | --- |
| `public/assets/pixel/world.png`, `world.json` | Packed source atlas and named frames | Original Codex-assisted project code, generator above |
| `grass0`–`grass3`, `path0`–`path1` | 16×16 tropical terrain and paths | Same generator, seeded pixel variations |
| `soil`, `watered-soil`, `crop0`–`crop5` | Individual farm plots, seed/sprout/growing/mature/wilt/dead crop artwork | Same generator; tomato only |
| `floor0`–`floor1`, `stone`, `wall`, `water0`–`water1` | House interior, masonry, walls and pond | Same generator |
| `tree0`–`tree1`, `palm`, `bush`, `flowers`, `rock` | Layered vegetation and ground decoration | Same generator |
| `fence`, `sign`, `house`, `window`, `door` | Farm structures and navigation | Same generator |
| `bed`, `table`, `dresser`, `counter`, `pot` | Interior furniture and market fixtures | Same generator |
| `seed-shop`, `produce-shop` | Original city stalls and shopkeepers | Same generator |
| `seed`, `can`, `sickle`, `tomato` | Actual item/tool inventory icons | Same generator; no emoji |
| `coin`, `heart`, `energy`, `marker`, `sun`, `moon`, `pause` | Currency, HUD and interaction art | Same generator |
| `public/assets/pixel/boy.png`, `girl.png` | 24×32 frames, idle + 2 walk frames per direction, 12 frames each | Same generator, original silhouettes |
| `public/assets/pixel/font.png`, `font.xml` | Original 5×7 bitmap glyphs; ASCII lowercase reuses uppercase forms | Same generator; no bundled third-party font |
| `src/art/worldArt.js`, `src/ui/pixelWidgets.js` | Pixel rug/borders, atlas composition and UI frames | Original Codex-assisted integer-coordinate source |

The previous runtime Graphics scenery and DOM/CSS character/icon approximations were replaced. No music, sound effects, voice, external images or font files have been added. Public asset README and generation source retain reproducible creation evidence. The Plant Tales YouTube reference is visual inspiration only; none of its media/assets/code is redistributed.

## Libraries and development tools
- Phaser 3.90.0, Phaser Studio, https://github.com/phaserjs/phaser — MIT; runtime engine. Licence copied under docs/licenses.
- Vite 6.4.3, Vite contributors, https://github.com/vitejs/vite — MIT; local build/dev tool. Exact transitive versions, registry sources and integrity hashes are in package-lock.json. Local evidence in docs/licenses/DEPENDENCIES.md and accompanying files.
- Pillow, Python Pillow contributors, https://github.com/python-pillow/Pillow — HPND (PIL Software License). Used only to rasterize project-authored pixel geometry; not distributed with runtime. Licence evidence copied under docs/licenses/Pillow-LICENSE.txt.
- Node.js/npm: local build/tests. Python: optional asset regeneration only. Playwright/agent-browser: development QA only, not runtime dependencies. OpenAI Codex: disclosed AI coding/art assistance; details in AI_USAGE.md.
