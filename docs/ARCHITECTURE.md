# Architecture — Milestone 1 craftsmanship pass

Phaser 3.90 / Vite 6.4 / JavaScript ES modules / HTML5 Canvas. Fullscreen canvas host, separate Phaser UI scene, localStorage, no backend or remote runtime assets. Gameplay remains in the established pure systems.

## World and presentation

- `src/data/mapLayouts.js`: 2240×1152 worlds; authored routes, buildings, props, ponds, fences, fields and townspeople. Footprints share the layout source. Compact home retains bed/door/spawn approaches. Pond shore inset is shared with collision rows. Low decorative plants have no collision; trunks do.
- `src/data/locations.js`: safe spawns, connections and functional bed/shop/dialogue contexts. Existing six plot indices stay in the northwest farm field. Other fields remain decorative.
- `src/art/Terrain.js`: bakes static ground to a local canvas texture at native pixel resolution. Connected path masks have rounded, perturbed boundaries; source dirt pixels fill their interiors. Pond outlines use the shared shore function. One baked ground image replaces thousands of terrain display objects. Rebuild removes the preceding cached texture.
- `src/art/worldArt.js`: native 16-pixel terrain, original 24×32 characters, atlas scenery at two world units per source pixel; object foot depth, interior composition, shadows and crop rendering. Ripe crops pulse a glint.
- `src/entities/PlayerView.js`: two idle frames and four walking frames for each direction. Six columns, four rows in down/up/left/right order; walking 8 fps. Radius-12 foot collision and interaction facing are preserved.
- `src/scenes/displayScale.js`: camera zoom 1 throughout. Two display pixels/source pixel; 64px character frames at 1280×720 (8.9%), view 40×22.5 terrain tiles. Short landscape has less vertical context. Camera bounds prevent outside-map exposure.
- `src/art/Atmosphere.js`: water/fountain, butterflies, one-pixel leaf shifts, dust, interaction flash, proximity-responsive doors, coin transaction feedback. Tree crowns soften when overlapping the player. Presentation only; no game-state changes.
- `src/scenes/WorldScene.js`: preload local assets, movement, collision, context, crop groups, night tint and bounded follow camera. Rounded display coordinates and nearest-neighbour rendering.
- `src/ui/{interface,Hud,pixelWidgets}.js`: independent 2× canvas UI. Smaller HUD frames/hotbar, translucent idle directional buttons, contextual prompt, responsive menus and title Credits with source/licence links. Actual external links open only on user clicks.
- `src/main.js`: existing lifecycle, transactions, saving, menus and dialogue, plus visual money-change feedback.

## Save/gameplay contract

`src/systems/*`, `src/data/crops.js`, save key `simple-life.save.v1`, schema version 1, prices/yields, two daily waterings, three-day growth, health/energy, inventory and six crop indices are unchanged. Existing validation moves an unsafe saved position to the area's safe spawn while preserving progress. New Game still confirms replacement.

## Asset pipeline

Primary external environment: Serene Village revamped 1.9, LimeZu, CC BY 4.0. Untouched official ZIP: `public/assets/vendor/limezu/serene-village/`. Licence/source evidence: `docs/assets/licenses/limezu/`. `scripts/process-rpg-assets.py` reads native 16×16 source tiles, extracts selected rectangles, adjusts selected greens, adds original missing farmers/furniture/props, and packs 86 frames into the runtime atlas. Original farmer sheets have 24 frames each. The manifest records source rectangles, aliases, modifications and originals. No pack preview or reference-video art is used.

Older Kenney archive and processing script remain historical sources; their environment tiles are superseded. The original `world` atlas retains crops, bitmap icons and interaction markers; the original font is retained. Runtime `town` frames replace older environment/furniture lookups. `vite.config.js` still emits only eight named runtime art files; no archive, manifest, licence HTML, source script or unused pack file enters the production output. Python/Pillow is needed only for art regeneration; npm builds use committed outputs.

## Verification

Node tests cover rules/save failure handling, camera scale, all interaction/district reachability and unsafe legacy positions. Browser tests use isolated contexts and real keyboard/mouse/CDP touch input. Legacy/exploration suites initialize disposable fixtures. DEV or `?qa` exposes cloned read-only state, control rectangles, camera and animation observations; no mutation hooks. New evidence is under `docs/verification/craftsmanship/`; prior pass reports are historical.
