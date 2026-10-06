# Architecture — final Milestone 1 stabilization

Phaser 3.90 / Vite 6.4 / JavaScript ES modules / HTML5 Canvas. Fullscreen canvas host, separate Phaser UI scene, localStorage, no backend or remote runtime assets. Gameplay remains in the established pure systems.

## World and presentation

- `src/data/mapLayouts.js`: 2240×1152 worlds; authored routes, buildings, props, ponds, fences, fields and townspeople. Footprints share the layout source. Compact home retains bed/door/spawn approaches. Pond shore inset is shared with collision rows. Low decorative plants have no collision; trunks do.
- `src/data/locations.js`: safe spawns, connections and functional bed/shop/dialogue contexts. Home exterior, interior and Farm are active. City is excluded from the location registry. A porch approach rectangle gates entry/exit. The northwest active field has 16 cells; first six indices preserve old saves. Other fields remain decorative.
- `src/data/geometry.js`: source-pixel building silhouette rectangles and exact two-world-pixel pond rows shared by rendering, physics and save checks. Zero-width shore rows are excluded.
- `src/physics/CollisionWorld.js`: Phaser Arcade static bodies from those rectangles; a 24×24 feet probe queries occupancy for normalized movement. Bounds and pure save-validation geometry agree. `?collisions` outlines solids only under `import.meta.env.DEV`; production cannot enable it.
- `src/systems/context.js`: approach-gated doors, state-aware crop prompts, claimed crate feedback and land-only shoreline interactions.
- `src/art/Terrain.js`: bakes static ground to a local canvas texture at native pixel resolution. Connected path masks have rounded, perturbed boundaries; source dirt pixels fill their interiors. Pond outlines use the shared shore function. One baked ground image replaces thousands of terrain display objects. Rebuild removes the preceding cached texture.
- `src/art/worldArt.js`: native 16-pixel terrain, original 24×32 characters, atlas scenery at two world units per source pixel; object foot depth, interior composition, shadows and crop rendering. Ripe crops pulse a glint.
- `src/entities/PlayerView.js`: two idle frames and four walking frames for each direction. Six columns, four rows in down/up/left/right order; walking 8 fps. Radius-12 foot collision and interaction facing are preserved.
- `src/scenes/displayScale.js`: camera zoom 1 throughout. Two display pixels/source pixel; 64px character frames at 1280×720 (8.9%), view 40×22.5 terrain tiles. Short landscape has less vertical context. Outdoor camera bounds prevent outside-map exposure. The existing interior is centred at the same zoom on taller screens and follows the farmer below 600px height to keep bed/door interactions visible; movement remains restricted to room bounds.
- `src/art/Atmosphere.js`: water/fountain, butterflies, one-pixel leaf shifts, dust, interaction flash, proximity-responsive doors, coin transaction feedback. Tree crowns soften when overlapping the player. Presentation only; no game-state changes.
- `src/scenes/WorldScene.js`: preload local assets, movement, collision, context, crop groups, night tint and bounded follow camera. Rounded display coordinates and nearest-neighbour rendering.
- `src/ui/{interface,Hud,pixelWidgets}.js`: independent 2× canvas UI. Smaller HUD frames/hotbar, translucent idle directional buttons, contextual prompt, responsive menus and title Credits with source/licence links. Actual external links open only on user clicks.
- `src/main.js`: existing lifecycle, transactions, saving, menus and dialogue, plus visual money-change feedback.

## Save/gameplay contract

Save key remains `simple-life.save.v1`; schema is now **2**. Validation accepts versions 1 and 2, expands old six-cell arrays without reordering crops, validates `starterSeedsClaimed` as a boolean, moves old City saves to Home and recognizes old cutaway-room positions as interior saves. Invalid building/water positions use the area's safe spawn. Money, inventory, crop growth/water, health/energy and day/time survive migration. One-time reward logic lives in `systems/starter.js`. Prices remain deferred source data; City/economy UI is unreachable. Crop growth and two daily waterings are unchanged. Sleeping/midnight place the player safely inside Home.

## Asset pipeline

Primary external environment: Serene Village revamped 1.9, LimeZu, CC BY 4.0. Untouched official ZIP: `public/assets/vendor/limezu/serene-village/`. Licence/source evidence: `docs/assets/licenses/limezu/`. `scripts/process-rpg-assets.py` reads native 16×16 source tiles, extracts selected rectangles, adjusts selected greens, adds original missing farmers/furniture/props, and packs 86 frames into the runtime atlas. Original farmer sheets have 24 frames each. The manifest records source rectangles, aliases, modifications and originals. No pack preview or reference-video art is used.

Older Kenney archive and processing script remain historical sources; their environment tiles are superseded. The original `world` atlas retains crops, bitmap icons and interaction markers; the original font is retained. Runtime `town` frames replace older environment/furniture lookups. `vite.config.js` still emits only eight named runtime art files; no archive, manifest, licence HTML, source script or unused pack file enters the production output. Python/Pillow is needed only for art regeneration; npm builds use committed outputs.

## Verification

Node tests cover rules/save failure handling, camera scale, all interaction/district reachability and unsafe legacy positions. Browser tests use isolated contexts and real keyboard/mouse/CDP touch input. Legacy/exploration suites initialize disposable fixtures. DEV or `?qa` exposes cloned read-only state, control rectangles, camera and animation observations; no mutation hooks. Current acceptance is `tests/browser/stabilization.mjs`; sprite-gallery/pixel checks are in `scripts/verify-character-frames.py` and never enter production. New evidence is under `docs/verification/stabilization/`; prior pass reports are historical.
