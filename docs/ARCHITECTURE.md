# Architecture — Milestone 1 canvas redesign
Version 0.1.1. Vite serves ES modules; Phaser 3 uses its HTML5 Canvas renderer. The page contains only a viewport-sized game host. All visible title/character/shop/bed/pause/help screens, HUD, prompts and touch controls are drawn inside Phaser. No DOM game panels, framework, backend, tracking or runtime remote assets.

## Scene and rendering boundaries
- `src/scenes/WorldScene.js`: asset loading, world scene, keyboard input, collision queries, contextual interactions and bounded follow camera. Camera uses integer zoom, rounded pixels and the full 960×640 drawn extent. Zoom never reveals out-of-map space, including tall and large viewports. Phaser RESIZE uses the actual viewport; no aspect-ratio distortion or page scrolling.
- `src/art/worldArt.js`: compose original atlas sprites and 16px source terrain tiles at a consistent 2 world units per source pixel. Existing 960-wide gameplay coordinates and collision bounds remain unchanged. Fully drawn surrounding terrain/walls extend to the camera bounds. Furniture and vegetation use feet-based depth ordering against the player.
- `src/entities/PlayerView.js`: sprite presentation only; idle and two walking frames in each of four directions, independent boy/girl sheets, no mirrored substitutes. Collision remains the existing radius-12 rule. Context actions explicitly turn the sprite toward their target.
- `src/ui/interface.js`: separate UI Scene above the world, modal/menu lifecycle, keyboard menu navigation and temporary dismissible notifications. Its camera does not follow the world; all widgets stay screen-fixed.
- `src/ui/Hud.js`: small day/time, health/energy and coin panels, hotbar, contextual world-relative prompt, touch pad and Use button. Coordinates are recalculated on resize; safe-area insets are respected.
- `src/ui/pixelWidgets.js`: shared square pixel panels, bitmap text, atlas icons and hit targets. UI uses integer 2× scaling with readable bitmap text. No emoji inventory art or external fonts.
- `src/ui/styles.css`: fullscreen host, safe-area variables, nearest-neighbour canvas presentation and scroll/touch suppression only.
- `src/main.js`: application lifecycle and transactions, scenes, autosave and page lifecycle. Shops and rest dialogs call the unchanged systems.

## Preserved gameplay and save contract
`src/data/{crops,locations}.js`, `src/config.js`, and `src/systems/{state,save,farming,economy,time}.js` were not changed in the visual correction. Crop definitions, three-day watering/growth rules, prices, energy, clock, map connections/collision geometry and versioned save validation retain their established behavior.
State is authoritative; scenes are presentation. The same `simple-life.save.v1` key and schema are retained. No migration or reset is needed: character, area, existing safe coordinates, day/time, money, health/energy, inventory, selection, sales count and crop progress are preserved. A legacy v1 fixture is tested separately from the full UI loop.

## Assets and reproduction
`public/assets/pixel/world.png` plus `world.json` form the shared atlas; `boy.png` and `girl.png` contain 24×32 frames in 3 columns and 4 direction rows (down/up/left/right). `font.png` and `font.xml` contain the original 5×7 bitmap alphabet. All are committed runtime files and copied by Vite. `scripts/generate-pixel-assets.py` is the editable deterministic source (Python + Pillow), not a runtime requirement. No image-model output or downloaded art was used.

## Verification access
When running Vite dev, or production with `?qa`, `window.__simpleLife.snapshot()` exposes cloned read-only state, actual canvas control rectangles and camera/sprite observations. It has no mutation functions. Tests operate the same keyboard, pointer and touch events used by players; they do not invoke gameplay functions. Normal production URLs do not expose this diagnostic object. Optional Playwright browser tests are separate from npm/runtime dependencies.
