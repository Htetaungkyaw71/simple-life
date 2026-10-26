# 2026-10-25 — item-icon runtime integration

Checkpoint commit `9c9aff7` remains available before the current Cucumber/item-icon working changes. The three reviewed item sheets now replace 32 existing atlas keys with 24×24 native frames. Detection is component-based rather than grid slicing; source geometry is not resampled. Cleanup shares the plant importer’s boundary-magenta rule, output alpha is strictly 0/255, all installed frames pass the no-magenta predicate, and only dominant greens are palette-shifted. Spatial masks keep Green Pepper, Watermelon, pear and striped-melon bodies source-colored while remapping their leaves/stems. Integer 1× is the closest permitted positive scale to the prior 16×16 icons; it preserves every source pixel but renders these finer icons at 24 logical pixels.

Green Pepper has no runtime ID and stays evidence-only; it is not guessed as Cucumber. No separate Cucumber packet/produce sheet was found, so Cucumber keeps its existing item icons. Food order was read directly from `FOOD_IDS`: Grilled Meat, Wild Berry, Guava, Mango, Banana, Orange, Papaya, Coconut, Dragon Fruit, Pineapple, Watermelon and Grape. Shared existing keys mean the Food-tab Watermelon/Grape win for both Food and Produce, and `meat-item` shows the cooked drumstick for both grilled and raw Meat. No gameplay, ID, price, count, inventory/save, slot size or panel layout changed.

The full mixed-source regeneration was attempted and stopped before atlas output at the intentionally external Pipoya archive. The established targeted fallback then installed the 32 frames in one row while preserving every non-target atlas byte and coordinate. `npm run build` passes (195 modules). After updating the historical City-art guard for the intentional item frames, the complete suite is **422/424 passing**; the only failures are the two documented pre-existing barber/grass and stale Pixel Snapper frame-count assertions. Headless Chrome passed local-only runtime checks and produced the requested Toolbar, Bag Seeds, Bag Produce, Bag Food, Seed Shop and harvest-effect captures under `docs/verification/item-icons-runtime-v1/`; no console errors or warnings occurred. Physical devices and non-Chromium browsers remain unverified. No push, publication or deployment was performed.

---

# 2026-10-25 — supplied Cucumber sheet integrated

Checkpoint commit `9c9aff7` preserves the workspace immediately before this pass. The existing Cucumber crop now uses the supplied eight-stage native sheet under unchanged `cucumber-seed` through `cucumber-dead` keys. The deterministic importer verified a 16-color hard-pixel grid, removed the three boundary-confirmed magenta/fringe colors (including enclosed background pockets), found no qualifying baked ground region, preserved the connected dead silhouette and strict 0/255 alpha, applied the shared olive-green lookup, and packed one 36×73 bottom-aligned frame. Runtime presentation is scale 1 with shared `anchorX: 17`, `baseOffsetY: 0` and ripe-height-derived `signOffsetY: -109`.

The atlas pipeline ran once for Cucumber and preserved every non-target frame coordinate. Gameplay, crop IDs, keys, watering state selection, growth timing, saves, plot spacing/footprints, soil, item icons and `tomato-debug.html` are unchanged. `npm run build` passes with 195 modules in the current concurrent workspace. Focused source/atlas/metadata/City tests pass 8/8. The complete suite is 421/424: the two documented barber/grass and stale frame-count failures remain, and an unrelated concurrently added item-icon test currently expects 24×24 Strawberry seed-item art while its concurrent runtime integration is incomplete. No Cucumber test failed.

Live Google Chrome checks pass for the 12-crop, three-row whole farm; Cucumber's eight stages on dry and watered soil; the exact plot-centre anchor; water/basket/warning signs; crop info; `E / Water`; harvest yield/action/fly-to-player; and local-only loading. Visual inspection found no clipping, background fringe, sign overlap, row-depth issue or low fruit/leaf contrast. [Screenshots and machine-readable results](verification/cucumber-import-v1/README.md). Physical devices and non-Chromium browsers were not newly tested. No push, publication or deployment was performed.

---

# 2026-10-25 — three item-icon sheets ready for review

Created three separate review-only 4×3 icon sheets in the user's requested order: seed packets, harvested crop produce, and fruit/food. Each final is a native 192×144 RGB PNG with twelve 48×48 cells, exact `#FF00FF` background, centered 17–24×21–24 or 19×24 sprites, nearest-neighbour pixels, no pure/near black, and no text, frame, shadow, soil or ground. The three generated originals, exact prompt set, deterministic processor, source copies, final copies, hashes and per-cell validation are preserved under `output/art/item-icon-sheets-v1/` and `docs/assets/licenses/item-icon-sheets-v1/`.

The work is intentionally not integrated: `public/`, the Phaser atlas, gameplay, UI, saves, dependencies and production asset allowlist are unchanged pending user approval. `npm run build` passes with 194 modules. The full suite remains 420/422; the only failures are the same documented pre-existing barber/grass provenance assertion and stale Pixel Snapper 49-versus-50 frame-count assertion. Browser verification loaded the review page plus all three separate PNGs with HTTP 200 and visually inspected each sheet at native and nearest-neighbour enlarged scale; the browser's automatic favicon request was the only 404. No deployment, publication or push was performed.

---

# 2026-10-25 — Sweet Potato and crop palette/anchor correction

Checkpoint commit `525e668` preserves the workspace immediately before this pass. Sweet Potato is now imported from the supplied native 8-stage strip under the existing `sweetPotato-*` keys. Tomato plus the ten supplied imports use unchanged frame geometry, binary alpha and sprite keys, with deterministic world-matched living greens and one shared per-crop base-column anchor. Plant bases now land at the plot center through data-driven `baseOffsetY`; low/wide crops use only small 2–4px visual nudges. Cucumber is explicitly pinned to its established scale/offset so this visual-only pass does not move the non-imported crop. Green pepper remains skipped because the crop registry has no matching ID.

The atlas was rewritten once after all candidates passed validation. Gameplay, watering state selection, growth timing, save data, plot spacing/footprints, soil rendering, crop info behavior, harvest behavior, item icons and sprite keys are unchanged. Signs are ripe-height-derived and receive enough visual depth to remain readable across crop rows. `tomato-debug.html` was not changed.

Verification: `npm run build` passes with 194 modules. The full suite is 420/422; the only failures are the two documented pre-existing barber/grass provenance and stale Pixel Snapper 49-versus-50 frame-count assertions. The new 88-frame atlas/alpha/palette/anchor regression passes. Live Google Chrome checks pass for all 11 crop families across eight stages on dry and watered soil, water/basket/warning signs, crop info, `E / Water`, harvest yield/animation/fly-to-player, the mixed whole-farm comparison and isolated watered ripe plots. Evidence and the Chromium-only limitation are recorded in [crop-palette-anchor-v1](verification/crop-palette-anchor-v1/README.md). No push, publication or deployment was performed.

---

# 2026-10-25 — supplied crop sheets integrated

Checkpoint commit `cd6e69f` preserves the complete pre-import workspace. Nine clean native sheets are now active in the existing Strawberry, Carrot, Corn, Chili, Eggplant, Watermelon, Pumpkin, Grape and Blueberry frame families. All 72 atlas keys retain their names, use strict binary alpha and share one bottom-centred frame per crop. All nine render at scale 1; ripe-height-derived sign offsets keep the 36-world-pixel water/basket/warning sign immediately above the plant. Tomato is unchanged. Green pepper was skipped because the codebase has no matching crop ID/key prefix.

The deterministic importer and crop atlas source functions now preserve these supplied candidates on future crop regeneration. No gameplay, watering-state selection, growth duration, save schema, plot footprint, item icon, crop ID or sprite key changed, and `tomato-debug.html` was not modified. The old 24×32 assumptions in farm-refresh checks and the unrelated City-shop atlas-preservation test were updated to defer to atlas metadata or exclude the newly authorized crop rectangles.

Verification:

- Python source compilation passed for the importer and crop atlas helpers.
- Focused crop/atlas/City preservation tests pass 9/9.
- Full suite is 420/422. The only failures are the two documented pre-existing assertions: barber/grass provenance drift and the Pixel Snapper manifest's stale 49-frame expectation versus 50 actual frames. There are no new failures.
- `npm run build` passes with 194 modules; the production runtime remains local-only.
- Live Google Chrome canvas checks pass for all nine crops: all eight stages on dry and watered soil, crop info, `E / Water`, water/basket/warning markers, harvesting, yield and fly-to-player effects. Representative tall Corn, wide Watermelon/Pumpkin and declining-stage screenshots were visually inspected. Evidence: [screenshots and results](verification/crop-sheets-v1/README.md).

Limitations: physical devices and non-Chromium browsers were not tested in this pass. Final source-rights and competition-eligibility acceptance remains with the human team. No push, publication or deployment was performed.

---

# 2026-10-24 — approved Tomato snapped icons integrated

Imported only the approved `tomato-item` and `tomato-seed-item` candidates into the runtime town atlas as native 24×24 binary-alpha frames. The retained source pixels are exact and unscaled. Tomato-only visual metadata applies a `2/3` display factor so toolbar, Bag, trade panels, crop info, planting, and harvest-flight effects keep their established visual footprint; every other crop remains at scale 1. The atlas installer verified that every non-target frame retained its existing metadata and pixels. Gameplay, saves, crop timing, sprite keys, and all other icons are unchanged. Per the user's instruction, no test suite or production build was run.

Evidence and source hashes: [Tomato icon source record](assets/licenses/tomato-icons-v1/SOURCE_RECORD.md).

---

# 2026-10-24 — user-supplied Strawberry sheet staged for approval

Audited the user-supplied 361×121 Strawberry growth strip without redrawing or repainting it. The sheet contains exactly eight separated stages and 16 source RGBA colours. Its best 2×2 grid score is 98/1,778 homogeneous touched blocks, confirming native 1-pixel art rather than a uniform 2× enlargement.

The reusable `scripts/import_sheet.py` pass removed the two exact magenta-family background/fringe colours, the repeated baked ground/base mask from stages 2–8 and two isolated pixels. All 14 retained opaque colours remain exact source RGBA values, and output alpha is strictly 0/255. The common bottom-centred frame is 48×38; cleaned stage sizes are 30×15, 19×11, 38×27, 41×36, 46×38, 40×35, 41×25 and 38×18.

The development-only `/tomato-debug.html` now includes Strawberry at 1×/3×/6× on actual dry and watered soil plus a real 48-pixel-spacing row beside current Tomato at scale 1 and Carrot at scale 2. Proposed Strawberry scale is 1. Its current `signOffsetY: -54` remains geometrically correct: the 36-world-pixel sign ends exactly at the 38-pixel ripe plant top, so water, basket and warning signs stay above the foliage. Runtime Strawberry frames, crop metadata, gameplay, saves and every other crop remain unchanged pending explicit approval. Evidence: [Strawberry snapped-sheet source record](assets/licenses/strawberry-import-v1/SOURCE_RECORD.md).

The focused Strawberry regression passes. The full suite is **419/421**, with only the same two unrelated pre-existing dirty-worktree failures: `tests/barber-grass-v2.test.js` runtime-reference drift and `tests/pixel-snapper-assets.test.js` expecting 49 frames while the existing manifest contains 50. `npm run build` succeeds (194 modules), and the review source/candidate/debug page remain absent from `dist`. Live Chrome inspection passed the complete Strawberry section and real-scale crop row with no console warnings or errors.

---

# 2026-10-24 — Tomato snapped icons audited for review

Audited the user-supplied 108×74 Tomato icon sheet without redrawing or repainting it. It is native hard-edged 1-pixel art with 15 exact colors and three connected sprites measuring 21×21, 19×19, and 19×22 pixels. Deterministic cleanup removes only 6,994 exact magenta background pixels, preserves every retained RGBA value, and produces strict binary alpha. The first, more detailed Tomato is selected as the review candidate; the second is retained as an unused alternate. All candidates are padded into 24×24 frames with no resampling.

The existing icon consumers were audited. A 24×24 runtime frame can be stored safely, but the shared UI currently assumes a 16×16 icon footprint. Approval-stage integration should therefore add visual-only per-icon scale metadata of `2/3` for the two Tomato icon keys. This preserves toolbar, Bag, seed-shop, market, TradePanel, CropInfo, reward-row, planting, and harvest-flight display sizes without modifying the stored pixels.

The development-only `/tomato-debug.html` now compares the selected Tomato and packet with Carrot at 1×, 2×, and 8× and includes real-scale toolbar/Bag slot mockups. The runtime atlas, sprite keys, other icons, gameplay, saves, and UI code remain unchanged. Per the user's instruction, no test suite or production build was run for this review-only step. Evidence: [Tomato icon source record](assets/licenses/tomato-icons-v1/SOURCE_RECORD.md).

---

# 2026-10-24 — user-supplied Tomato sheet audit and review candidates

Audited the user-supplied 379×123 Tomato strip without redrawing or repainting it. The source is hard-edged native 1-pixel art with 16 exact RGBA colours and no partial alpha. It is not a uniform 2× enlargement: only 289/2,265 non-background-touched 2×2 blocks are homogeneous at the best offset, so the requested 2:1 Candidate A was correctly rejected instead of destructively resampling the art.

Added reusable `scripts/import_sheet.py` and generated review-only evidence outside `public/`. The deterministic pass removed the hard-pixel magenta background/fringe, repeated purple ground/base mask from stages 2–8, and one isolated non-magenta pixel; it preserved the source RGB values of all retained plant pixels and produced strict binary alpha. Candidate B is bottom-centred in eight 48×70 frames: 48 pixels matches the current 24-pixel crop width at 2×, and 70 pixels is the largest cleaned stage height.

The development-only `/tomato-debug.html` now shows Candidate A's audit rejection, Candidate B at 1×/3×/6× on actual dry and watered procedural soil, and an eight-stage row at the real 48-pixel plot spacing beside the current Carrot. Browser inspection passed with no console warnings/errors. `npm run build` succeeds (193 modules), and neither the debug page nor candidate/evidence images enter `dist`. `npm test` remains **417/419** with only the same unrelated dirty-worktree assertions in `tests/barber-grass-v2.test.js` and `tests/pixel-snapper-assets.test.js`.

No runtime atlas image/metadata, crop definition, gameplay logic, timing, save data, state selection, sprite key, UI, or other crop changed. Runtime integration is intentionally paused for the user's candidate choice. Evidence: [Tomato snapped-sheet source record](assets/licenses/tomato-import-v1/SOURCE_RECORD.md).

---

# 2026-10-24 — tomato-only reference-led pixel refinement v3 (awaiting visual approval)

Refined only the existing eight 24×32 Tomato stages and two 16×16 Tomato icons after the user rejected the more diagrammatic v2 look. The supplied screenshots were used only to identify broad in-game style qualities. The v3 plant uses connected serrated compound-leaf masses, irregular top-left-lit shading, colored outlines, thinner staked vine structure, clear gaps around three saturated ripe fruit, and more organic dry/wilted/dead silhouettes. The produce icon has a fuller shaded body; the packet keeps the existing canvas and packet language. No screenshot pixels or third-party pack asset entered the runtime.

The development-only `/tomato-debug.html` now compares the preserved v2 runtime strip with v3 and continues to show all real runtime cells at 1×, 3× and 6× on live dry/watered soil, the two non-runtime studies, a 2× farm row and Tomato/Carrot icon comparisons. Source comparison proves exactly ten Tomato outputs changed; all eight alpha silhouettes are unique. Atlas comparison reports 1,276 changed pixels and zero outside those ten cells, with byte-identical `town.json`. The page/evidence remain excluded from `dist`.

`npm run build` succeeds (193 modules). `npm test` remains **417/419** with only the two pre-existing unrelated dirty-worktree assertions in `tests/barber-grass-v2.test.js` and `tests/pixel-snapper-assets.test.js`. Browser inspection passed for the complete Tomato review page. A new isolated game instance remained at the existing loading screen during this follow-up; however, the shared farm-rendering, soil/status-marker, prompt and interaction tests pass, the preceding v2 browser acceptance already covered the water/basket/warning overlays, and v3 changes no rendering/gameplay/UI code or atlas metadata. No gameplay, save, timing, state selection, sprite key, atlas frame name, other crop, dependency, backend, deployment, publication or push changed.

Evidence: [Tomato v3 source record](assets/licenses/tomato-redesign-v3/SOURCE_RECORD.md).

---

# 2026-10-24 — tomato-only pixel refinement v2 (awaiting visual approval)

Refined only the ten existing Tomato cells. The eight 24×32 runtime stages now use larger, well-separated three-leaflet clusters, more negative space, colored green/maroon/brown outlines, top-left highlights, thin staked S-curves and two small ties. The living stages have a two-tone contact shadow. Ripe emphasizes three staggered 5×5 red fruit plus two smaller green fruit; dry, wilted and dead use separate declining silhouettes. The 16×16 produce icon is a squashed three-tone Tomato with a 2×2 highlight, and the Tomato packet now has a dark frame, cream body, green header and small red emblem. Carrot and every other crop remain byte-identical to the preserved preceding generator.

The development-only `/tomato-debug.html` now shows the real runtime frames and matching in-memory vegetative/green-fruit studies at 1×, 3× and 6× on both live dry and watered soil. It also includes an eight-stage row at the game's 2× scale with 48-pixel spacing, a previous/current strip, and Tomato/Carrot icon comparisons. The previous runtime frames are retained only as review evidence outside `public/` and are not in `dist`.

Automated authoring checks confirm all ten and only the Tomato outputs changed, all eight 24×32 flattened alpha silhouettes are unique, atlas changes remain confined to the ten existing Tomato rectangles, and atlas metadata is byte-preserved. `npm run build` succeeds (193 modules) with the debug page/evidence excluded. The full suite remains **417/419** with the same unrelated dirty-worktree art assertions in `tests/barber-grass-v2.test.js` and `tests/pixel-snapper-assets.test.js`. Browser review passed for the expanded debug page and the isolated real farm scene; the existing water, basket and warning signs remain visible and the shared prompt/UI path is unchanged. No gameplay, save, crop timing, state selection, sprite key, atlas frame name, other crop, dependency, backend, deployment, publication or push changed.

Evidence: [Tomato v2 source record](assets/licenses/tomato-redesign-v2/SOURCE_RECORD.md).

---

# 2026-10-24 — tomato-only pixel redesign (awaiting visual approval)

Redrew only the existing Tomato art: all eight 24×32 runtime plant frames plus the 16×16 produce and seed-packet icons. The frame keys, atlas rectangles, transparent canvas sizes, bottom-centred anchors, crop timing, growth/state selection, save data and UI code remain unchanged. The mature stages now read as a staked, slightly sprawling vine with serrated compound leaves, yellow flowers, green buds and clustered fruit; dry, wilted and dead retain distinct silhouettes. No other crop generator was edited relative to the pre-work backup.

Added a development-only `/tomato-debug.html` review page. It reads the ten real cells from the current atlas, places the eight runtime stages on the live 24×24 dry-soil pixels at 1×, 4× and 8×, derives non-runtime vegetative and green-fruit studies in memory, and compares both Tomato icons with Carrot at 1× and 8×. Integer canvas sizes and `image-rendering: pixelated`/`crisp-edges` are used; the page is absent from `dist`.

The full asset pipeline was invoked but stopped at its documented external Pipoya dependency because `/tmp/pipoya-characters.zip` is not present. To avoid changing unrelated dirty-worktree art, the same `add_crop_art`/`add_city_crop_art` source functions were then used to replace exactly the ten existing Tomato atlas rectangles in place. Pixel comparison against the pre-repack atlas found changes only inside those ten rectangles; `town.json` was byte-preserved by this operation. The full regeneration command remains `SIMPLE_LIFE_PIPOYA_ZIP=/absolute/path/to/pipoya-characters.zip python3 scripts/process-rpg-assets.py` (with Pillow available).

`npm run build` succeeds (193 modules) and does not emit `tomato-debug.html`. The full Node suite is **417/419**; the only failures are the same unrelated dirty-worktree art assertions in `tests/barber-grass-v2.test.js` and `tests/pixel-snapper-assets.test.js`. Browser review passed for the debug page and the isolated in-game farm gallery: all Tomato stages render with nearest-neighbour pixels, while the existing drop, basket and warning signs remain visible above the new plants. The shared `E / Water` path and HUD code are unchanged and their farming tests pass. Physical devices and non-Chromium engines were not newly checked. No gameplay, save, dependency, backend, remote asset, deployment, publication or push changed.

Evidence: [Tomato source record](assets/licenses/tomato-redesign-v1/SOURCE_RECORD.md).

---

# 2026-10-23 — Mystical Forest River welcome view

Implemented the user-approved reference-like viewpoint as an original front-facing title background. The responsive scene now looks from a foreground river toward a warm misty forest clearing, waterfall and bridge, with dark tropical foliage framing the sides. The generated PNG contains no title, controls, people or copied reference pixels; the existing Phaser wordmark, Play/Continue/Controls/Credits actions, English/မြန်မာ chips, focus/hover behavior and save logic remain live and separate. The title-only clarity follow-up adds a complete one-native-pixel dark outline, deeper offset shadow and warm-cream face to `SIMPLE LIFE`; the subtitle, ornament, menu, backdrop and motion remain unchanged. A follow-up recording exposed that the initial moving-glint layer treated the lower screen as one rectangle, allowing cyan strokes to cross rocks and plants. That layer is removed. The replacement follows the recording's restrained style with short broken highlight clusters, four stepped poses per second and an explicit backdrop-source river channel that excludes rocks, roots, bridge and shoreline foliage. Birds, leaves and river motion stop when reduced motion is requested.

Focused welcome tests pass **7/7**, including exact title-layer checks and source-space shoreline containment across all ten supported layouts. The full suite is **411/413**: the only failures are the same unrelated pre-existing art-worktree assertions in `tests/barber-grass-v2.test.js` (runtime barber/grass provenance) and `tests/pixel-snapper-assets.test.js` (50 actual atlas frames versus the older expectation of 49). `npm run build` succeeds (190 modules), includes the existing local PNG and makes no remote request.

Local Chromium visual acceptance passes at the default 1440×778 desktop viewport, the recording's exact 1990×1118 size, 640×360 short landscape and 390×844 phone portrait. At 1990×1118, the outlined title remains crisp and readable over both the bright central light and darker trunks without changing surrounding elements. The replacement wavelets change between sampled frames while the visible rock/plant banks remain clean. The title, all four menu actions and both language controls remain visible; the landscape layout uses the established compact two-column arrangement and portrait retains the full stacked menu. Play and Credits were opened successfully from the title scene. No game-page warning or error was captured; one Chrome-extension-only `removeChild` message was excluded from the game result. Physical devices and non-Chromium engines were not newly checked. Evidence: [browser checks and screenshots](verification/welcome-mystical-river-v1/README.md).

New runtime art is one local 1672×941 PNG (2,415,970 bytes), explicitly allowlisted and documented at [the source record](assets/licenses/welcome-mystical-river-v1/SOURCE_RECORD.md). No gameplay, save schema, backend, runtime AI, remote asset, dependency, deployment, publication or push changed.

---

# 2026-10-23 — tool-toggle flash and Meat cook/eat flow

Fixed both reported interaction problems. Screen-recording review showed that the attempted stable `Seed / Selected` and `Harvest tool / Selected` feedback was itself one visible message, so tool-toggle text was removed. A second follow-up then found the true single-frame path: changing between Hand and Seed/Harvest rebuilds the HUD, and the new `FarmGuide` objective was visible at its default position before its first update. Both FarmGuide branches now start hidden and become visible only after a positioned update. The same rebuild also created health/energy fills at full width before correcting them one frame later; both meter fills and highlights now initialize from the current saved values, eliminating the small bar movement. Seed and Harvest selection/unselection changes only the highlighted toolbar icon while nearby-world prompts and the first-farm guide remain suppressed. Hunted Meat now appears on the first Bag → Gear page with a Cook action and is no longer directly edible. The action routes to the established Home hearth: build the stove once, convert 1 Meat + 1 Wood to Grilled Meat, then eat Grilled Meat from the first Bag → Food slot for +50 HP / +35 EP. Animal-defeat feedback also names Bag → Gear and the Home hearth.

Focused Node tests pass **47/47**. Real local Chrome canvas acceptance passes the toolbar flow at 1280×720, samples unchanged partial health/energy widths across 12 animation frames around every Seed/Harvest click, and passes the complete Gear → Cook → Food → Eat flow at 640×360 with isolated disposable saves and no captured console/page errors. `npm run build` succeeds (190 modules). The full suite is **409/411**: the only failures are unrelated pre-existing art-worktree assertions in `tests/barber-grass-v2.test.js` (runtime barber prop reference) and `tests/pixel-snapper-assets.test.js` (50 actual atlas frames versus the older expectation of 49). Physical devices and non-Chromium browsers were not newly checked. No asset, licence, dependency, save schema, backend, deployment, publication or push changed.

---

# 2026-10-22 — HUD prompt first-frame flash repair

The remaining Seed/Harvest flash was caused by the HUD prompt container being visible at its default `(0, 0)` position during the first render after HUD creation. The prompt now starts hidden and is revealed only after its positioned update completes. Validation: 408 tests pass and the production build succeeds.

# 2026-10-22 — HUD prompt flash and tool-toggle hint repair

Follow-up testing found two visible effects around Seed/Harvest unselection: the prompt could briefly render at its default top-left position before placement, and the delayed context could show `Follow the south road` above the toolbar. HUD prompts now remain hidden until their final position is computed, and tool toggles suppress nearby world-context prompts for 1.8 seconds. **407 tests pass** and `npm run build` succeeds. No save, dependency, asset, backend, or gameplay-rule changes.

# 2026-10-22 — tool-toggle prompt suppression

Follow-up fixed the remaining brief `Starter seeds / Farm south` message when Seed or Harvest is unselected. The toggle correctly returns to Hand, but the nearby starter interaction became the HUD context for one or two frames. Tool selection now suppresses only the transient HUD world prompt for 500 ms; world interactions remain available and the selection/save behavior is unchanged. **407 tests pass** and `npm run build` succeeds. No save, dependency, asset, backend, or gameplay-rule changes.

# 2026-10-22 — toolbar prompt leak repair

Fixed a second part of the reported Seed/Harvest HUD issue: clicks on bottom toolbar controls were also reaching `WorldScene`, where the current world context could display an unrelated prompt such as `Starter seeds / Farm south`. World pointer handling now ignores coordinates occupied by UI controls. Added a regression test for UI hit testing. **406 tests pass**; the production build passed for the preceding implementation and the pointer-guard change is source-only. No save, dependency, asset, backend, or gameplay-rule changes.

# 2026-10-22 — crop panel positioning flash repair

Fixed a one-frame HUD artifact reported when selecting the Seed or Harvest tools. The crop-status panel was becoming visible before its collision-aware screen position was calculated, so it could briefly render at the canvas origin in the upper-left corner. [`src/ui/CropInfo.js`](../src/ui/CropInfo.js) now keeps the panel hidden until the current plot information is positioned safely. **405 tests pass** and `npm run build` succeeds. No save, dependency, asset, backend, or gameplay-rule changes.

# 2026-10-22 — keyboard focus regression repair

The fresh-save browser smoke test found a runtime error when keyboard focus advanced through controls containing the mobile movement stick: `c.box.setStrokeStyle is not a function`. Focus highlighting now safely skips controls without button stroke styling through the shared helper in `src/ui/focus.js`. Added a regression test covering mixed button and joystick controls. **405 tests pass** and `npm run build` succeeds. Browser smoke verification reached the gameplay/help UI after reload without reproducing the error. Full farming, travel, Forest, combat, save/reload and physical-device coverage remains pending. No dependency, save-schema, backend, remote-asset, deployment or publication change.

# v0.43.5 — focused Home design and wardrobe menu (2026-10-23)

The Home + Garden canvas panel now contains only House designs and Wardrobe. Craft/materials, Trees & garden and Room furniture are temporarily removed from that entry point; their underlying systems, owned inventory and placed-decoration save data are retained rather than deleted.

The active Home catalogue contains exactly two already-integrated City façades: Green Bay (free/default) and Blue Slate (2,000 coins). Preview and world rendering use those exact local `cityBuildings` atlas frames. Home placement preserves the established door/ground anchor while collision swaps to each façade's authored foundation rows. The existing furnished room layout remains, with Green Bay using its warm cream/terracotta surface and Blue Slate using a distinct pale-blue/slate surface. Wardrobe behavior is unchanged and remains reachable from the simplified menu.

Schema 19 remains. Continue preserves starter ownership and converts any ownership or selection of the eight retired paid designs into Blue Slate ownership/selection. Unknown forged IDs are still discarded, and farming, City, Forest, appearance, furniture, inventory, coins and progression remain untouched.

All **409 tests pass** and `npm run build` succeeds. Local Chromium acceptance passes six cases: fresh desktop 1280×720, portrait phone 390×844, short landscape 640×360, the Blue Slate exterior/interior flow, and schema-17 continuation at desktop and phone sizes. The captured browser record reports zero console/page errors. Visual inspection confirmed the two-card menu, both existing City façade previews, the applied Blue Slate world house, the cool-blue furnished interior and the retained Wardrobe. Physical devices and non-Chromium engines were not newly checked. No image generation, new asset, dependency, backend, remote runtime request, deployment, publication or push.

Evidence: [browser checks and screenshots](verification/home-menu-v0435/README.md).

---

# v0.43.4 — deterministic fountain water animation (2026-10-19)

Created the requested reviewable Pillow/NumPy water animation from the supplied 213×214 fountain without image generation. `water_mask.png` selects 2,012 pixels covering the connected teal pool, three thin streams, three offset landing ripples and the small top-tier pool while excluding the rim, moss, urn body, lily pads, water flowers, grass and plants. The optional lily-pad movement was omitted.

Delivered six 213×214 RGBA frames, a 1278×214 horizontal sheet, a six-frame 4× preview GIF averaging 8 fps and a byte-identical static PNG. Script assertions confirm every outside-mask RGBA pixel and every frame's alpha channel match the source, all visible colors come from the original 16-color palette, and the loop includes comparable frame-six-to-frame-one motion. These remain review-only outside runtime.

Evidence: [output README](../output/art/fountain-animation-v1/README.md), [source/transformation record](assets/licenses/fountain-animation-v1/SOURCE_RECORD.md) and [build-tool dependency record](licenses/fountain-animation-v1/DEPENDENCIES.md).

---

# v0.43.3 — original fountain-island v2 review asset (2026-10-19)

Generated the requested original top-down 3/4 fountain island using the supplied screenshot only for pixel density, outline thickness and mood. The new asset has an oval grass island and bottom cobblestone path, a chunky octagonal mossy basin with teal lily-pad water, a small tiered urn, asymmetrical pink/cream/green planting and exactly two wooden tulip planters. It avoids the reference's round basin, corner symmetry, sunflowers, lavender and terracotta pots.

Delivered `fountain_island_v2.png` as a 1024×1024 RGBA PNG with genuine transparency after generating against solid `#FF00FF`. Dimension, pixel-format, alpha-range and hash checks pass. It remains review-only outside runtime; no gameplay, source, save, dependency or production asset changed.

Evidence: [source record](assets/licenses/fountain-island-v2/SOURCE_RECORD.md) and [review directory](../output/art/fountain-island-v2/README.md).

---

# v0.43.2 — fountain-island review pair (2026-10-19)

Generated the requested top-down 3/4 pixel-art fountain island closely following the supplied compact, flower-heavy reference. Delivered a plaza-backed 512×512 PNG and a matching 512×512 RGBA island-only cutout with genuine transparency. Both retain crisp nearest-neighbour pixels and remain review-only outside the game until the user approves integration.

Validated both dimensions, the transparent file's RGBA pixel format and SHA-256 hashes. No runtime source, gameplay, save data, dependency, production asset or local server state changed in this review-only pass.

Evidence: [source record](assets/licenses/fountain-island-v1/SOURCE_RECORD.md) and [review directory](../output/art/fountain-island-v1/README.md).

---

# v0.43.1 — clothing rack, compact fountain garden and Home cleanup (2026-10-19)

Replaced the clothing shop's old rack with the user's new 183×124 Pixel Snapper shirt display. Its native RGBA canvas is packed byte-identically as `snapper-clothing-rack-v3`; Phaser applies only nearest-filtered `0.7` display scale. The rack footprint was refitted, and the central display table keeps its physical foot-line depth so a farmer below it renders in front instead of under the furniture.

Rebuilt the fountain green as a compact 224×216 rounded-square island around world centre `(704,438)`, following the supplied flower-heavy reference rather than retaining the rejected wide oval. The fountain uses its perceived vertical axis, not asymmetric transparent bounds, to align to the island centre. Four smaller `0.38` pots and twelve symmetric flower/grass placements reuse existing saved vegetation identities. Released oval pixels become plaza paving; City routes and service approaches remain connected. All three fixed outdoor Home benches shown by the last reference are removed. Home uses the supplied wood pile, and the separate fire sprite now sorts above the fireplace opening. Directional road-sign sprites remain absent from Home, Farm, City and Forest.

Generated one new barber-chair PNG for review only. It remains outside `public/` and the barber room pending approval. The earlier generated clothing-rack candidate also remains review-only; the game uses the user's returned Pixel Snapper rack.

All **392 tests pass** and `npm run build` succeeds. Isolated Chromium visual QA confirmed the Home fire/wood, removed outdoor Home bench placement, new rack scale, front-of-table character sorting and final compact centred fountain composition. The local development game is available at `http://127.0.0.1:5173/`. Physical phones, non-Chromium engines and console capture were not newly checked. No dependency, backend, remote runtime asset, save/economy change, deployment, publication or push.

Evidence: [clothing-rack source](assets/licenses/clothing-rack-v3/SOURCE_RECORD.md), [barber-chair review](assets/licenses/barber-chair-review-v2/SOURCE_RECORD.md), [Home wood](assets/licenses/home-wood-pile-v2/SOURCE_RECORD.md) and `output/art/pixel-snapper-assets-v1/art-audit.json`.

---

# v0.43.0 — approved clothing and barber interiors (2026-10-19)

Integrated all eight user-supplied Pixel Snapper shop objects at sizes measured from the two supplied room references. Clothing now uses one hanging rack plus the folded-clothes cabinet, wrapping counter, fitting corner, full-length mirror and central display table. Barber keeps its existing chair/mirror, adds the stocked worktop, coat hooks and storage cabinet, and retains no waiting bench. Both layouts use a muted green floor rug; the barber rug is centered immediately beside the bottom doorway as requested.

Every supplied PNG keeps its complete native transparent canvas and byte identity. The local Pixel Snapper atlas grows from 38 to 46 frames; Phaser alone applies nearest-filtered display scale. Full-room references and named source copies remain outside production with hashes and terms in the [source record](assets/licenses/shop-interior-pixel-snapper-v1/SOURCE_RECORD.md). Collision and service anchors were refitted to the visible furniture so both entrances, clerks, purchase interactions and exits remain connected.

All **392 tests pass** and `npm run build` succeeds. Isolated local Chromium fixtures verified the final clothing and barber compositions, green rugs, absent bench and zero console warnings/errors. The development game is running at `http://127.0.0.1:5173/`. No dependency, backend, remote runtime asset, save/economy change, deployment, publication or push.

---

# v0.42.9 — centred fountain, new wood and shop review assets (2026-10-19)

The fountain's visible Pixel Snapper silhouette is now centered on both axes of the 256×168 green island at world center `(704,438)`, rather than only horizontally. The four island pots move to clear corner positions and render at `0.5` scale. The user-supplied 133×101 log bundle is packed unchanged as `snapper-wood-item` and replaces the old wood resource image at the same approximate display size. The barber waiting bench and its stale collision are removed from the live room.

Generated eight missing clothing/barber furniture cutouts plus a bench-free barber room image for review. Existing window, clothing rack, rug, plant, barber mirror and barber chair are reused and were not regenerated. All new shop furniture remains outside `public/` pending user approval and native-pixel preparation; no new interior art was installed.

All **392 tests pass** and `npm run build` succeeds. Focused tests verify exact alpha-aware fountain X/Y centering, smaller pot positions/scales, 38 unchanged native Pixel Snapper sources, wood override resolution, barber bench removal, open walking area and preserved shop routes. Local browser capture was attempted, but the desktop browser URL-policy gate rejected the already-running loopback QA tab; browser acceptance of this final revision remains a human check. No backend, dependency, remote runtime asset, save/economy change, deployment, publication or push.

Evidence: [wood source record](assets/licenses/pixel-snapper-wood-v1/SOURCE_RECORD.md), [shop review source record](assets/licenses/shop-interior-assets-review-v1/SOURCE_RECORD.md) and [review files](../output/art/shop-interior-assets-review-v1/README.md).

---

# v0.42.8 — City frontage cleanup, Home hearth and existing-sprite exports (2026-10-19)

Applied the latest screenshot review without adding or generating artwork. The City camp flame and all four Pixel Snapper café tables/chairs are removed, leaving both lawns open. The identical small supplied flame is now centered in the existing Home fireplace. All repeated small house-front City flowerpots and the four older tiny plaza planters are removed. The four fountain-island pots render at the reduced `0.65` scale and are balanced around the island centre; the fountain's visible alpha silhouette remains mathematically centered at world X `704`.

Exported 19 exact native-size crops from the game's existing local atlases to `output/deliverables/existing-non-pixel-snapper-assets/`. These include the previous café table/chair plus existing wood, grass, stone, logs, mushroom, resource and terrain sprites. They are review files only: no image generation, repainting, resampling, filtering or runtime placement was performed. `manifest.json` records every source atlas/frame, dimensions and output SHA-256.

All **391 tests pass**, `npm run build` succeeds, and `git diff --check` is clean. Focused City, Home, atlas, route and layout checks cover the removals, fireplace reassignment, exact scale/positions and fountain-centre calculation. Local Chromium inspection confirmed the clear café and camp lawns, removed tiny City pots, smaller balanced island pots, centered fountain and the small flame inside the Home fireplace; the browser console had no warnings or errors. The development game remains available at `http://127.0.0.1:5173/`. Physical phones and non-Chromium browsers were not newly checked. No dependency, backend, remote runtime asset, save/economy change, deployment, publication or push.

Evidence: [existing-sprite export record](assets/licenses/existing-non-snapper-export-v1/SOURCE_RECORD.md) and [Pixel Snapper source record](assets/licenses/pixel-snapper-assets-v1/SOURCE_RECORD.md).

---

# v0.42.7 — placement cleanup and Pixel Snapper vegetation swap (2026-10-18)

Applied the latest screenshot review without changing gameplay systems. All directional road-sign props are removed from Home, City and Forest. Seed Aid and its interaction moved from the City road to the small grass verge immediately west of it; its existing recovery rule is unchanged and the relocated board was opened successfully in the live local game. The project-lawn barrel and the reviewed lamp-side barrel are removed. Home's barrel and paired closed crate moved away from the plum-house doorway to a separate garden storage position. The fountain's visible silhouette is horizontally centred within its existing island; its four pots are larger and arranged symmetrically inward. Ordinary wooden benches and the three retained planter benches are slightly larger while their established routes remain open.

Added the seven newly supplied Pixel Snapper broadleaf, tall tree, palm, grass, bush, sparse tree and snow-pine PNGs to the existing local atlas, bringing it to 37 byte-identical native RGBA sources. Matching logical vegetation frames now resolve to these images. Alpha-aware foot anchoring keeps the existing trunk/root coordinates, collision data and approximate display heights: mature broadleaf/tall trees remain about 224 world pixels high, palms 256 and snow pine 228. The complete source canvases are not trimmed, resampled, recoloured or baked against a background; Phaser applies nearest-filtered runtime scales.

All **391 tests pass** and `npm run build` succeeds. Focused placement tests verify zero directional road-sign props, the exact retained/removed barrel set, Home storage positions, reachable Seed Aid grass approach, fountain/pot alignment, furniture scales and all vegetation mappings. Local Chromium visual QA confirmed the City plaza, project lawn, replacement trees and Seed Aid board; the actual Seed Aid dialog opened and the console stayed free of warnings/errors. Physical phones and non-Chromium browsers were not newly tested. No deployment, publication or push.

Evidence: [native source record](assets/licenses/pixel-snapper-assets-v1/SOURCE_RECORD.md) and `output/art/pixel-snapper-assets-v1/art-audit.json`.

---

# v0.42.6 — native Pixel Snapper object replacement and upper-house sizing (2026-10-18)

Integrated all 30 PNGs supplied in the latest review into a dedicated local `pixel-snapper-assets` atlas. Every complete native canvas and RGBA byte is preserved; the source audit confirms transparent alpha in every file and no opaque white rectangular background. Phaser applies the authored fractional display scales with nearest filtering, so no source image is resized in an editor. Outdoor notice/sign, fountain, chair, tent, flowers, mailbox, bench, bush, market stall, flowerpot, gate, barrel, café furniture, City campfire and three planter benches now resolve to the supplied artwork. The supplied home table, benches, rug, bed, shelves, counter, fireplace/fire, window, pots, storage jar and doorway threshold are all installed and visible; active shop fixtures use the same new texture.

Only the two screenshot-identified upper City residences (`house-04-balcony-vine` and `house-07-alpine-timber`) were enlarged, from 190 to 225 visible world pixels. Their source PNGs remain unchanged, and their visible foundations retain the prior ground line. The lower reference houses are unchanged. Clothing and barber remain matched at the same 198-world-pixel visible height.

All **388 tests pass** and `npm run build` succeeds with the new atlas explicitly allowlisted. Responsive interior collision, shop routes, City approaches, decoration previews and old-save behavior remain valid. A local canvas smoke pass confirmed the replaced Home-side board/sign artwork, preserved pixelated rendering and zero browser console warnings/errors; focused automated map/atlas/route tests cover the City and interiors. Physical phones and non-Chromium browsers were not newly tested. No deployment, publication or push.

Evidence: [native source record](assets/licenses/pixel-snapper-assets-v1/SOURCE_RECORD.md) and `output/art/pixel-snapper-assets-v1/art-audit.json`.

---

# v0.42.5 — compact City facades, approved shops and Home cleanup (2026-10-18)

Applied the latest screenshot review. The four previously oversized City facades—`house-01-terracotta-gable`, `house-04-balcony-vine`, `house-07-alpine-timber` and `cafe-terracotta-awning`—now use per-facade nearest-filtered display scales that make each visible building exactly 190 world pixels tall, matching the accepted green-bay and terracotta reference cottages. This is an intermediate size between the rejected 2× and 1× versions. No supplied PNG was resized or resampled; alpha-aware foundations, porch points, depth and collisions regenerate at each placement scale. City homes remain on grass and exactly three planter benches remain.

Integrated the two user-returned Pixel Snapper shop PNGs. Clothing uses the simplified sage awning/mannequin facade and barber uses the light blue-roof/mirror facade; both retain their native transparent canvases, local nearest filtering, existing interiors, merchants, service hours and save behavior. The barber is scaled to the clothing shop's exact 198-world-pixel visible height, with its full canvas dimensions within four percent of the clothing facade. The City atlas contains twelve native frames in a 1024×512 transparent sheet.

The outdoor Home now contains only the player home plus the existing plum-townhouse and grey-hipped City assets. The screenshot-identified lower-right green house was removed, including its art placement and collision, without generating replacement art. The Farm's existing blue-slate reuse remains unchanged.

All 387 tests pass and `npm run build` succeeds. Focused City/Home/Farm scale, collision, route, shop and atlas checks pass. Local Chromium smoke inspection confirmed the reference-height café, similarly sized clothing/barber facades, retained nearest filtering and no console/page errors. Home removal was additionally verified from the generated map data and collision regressions; physical phones and non-Chromium engines were not newly tested. No deployment, publication or push.

---

# v0.42.4 — City house scale, grounding and depth follow-up (2026-10-18)

Corrected the latest City review at the source-data level. The three unusually large residential canvases (`house-01`, `house-04`, `house-07`) now use native integer 1× placement while all other residences keep integer 2×; no PNG was resampled. Their lawns, foundation collisions, doors, porches and resident routes are regenerated from the selected scale. The north-east green-bay house now shares the accepted terracotta cottage's exact visible foundation line. Building draw depth follows the visible alpha bottom rather than transparent canvas padding, so the farmer sorts in front of a façade instead of appearing inside it. Exactly three City planter benches remain, and residences stay on green grass.

The outdoor Home now reuses the existing green-bay house and the Farm reuses the existing blue-slate house. Both retain the original gameplay identities, Home entry, save/customization systems and local atlas; no new Home/Farm art was generated. A small Farm foundation lip preserves legacy unsafe-position repair.

New clothing-shop and barber-shop review sources were generated but are not integrated. The clothing design has two large mannequin silhouettes, four broad sage/cream awning panels and a large shirt sign; the barber has one oval mirror, a lighter slate roof/base, four broad awning panels, a large scissors sign and a simplified three-colour pole. Both remain outside `public/` pending user approval, Pixel Snapper/native-grid preparation and final alpha cleanup.

The full `npm test` suite and production `npm run build` pass. Focused City/Home/Farm route, depth, baseline, legacy-save and three-planter regressions pass. The live local game was checked in Chromium: the paired north-east houses visibly share one foundation line, retain grass parcels, and the farmer renders in front of the buildings without console warnings/errors. Other physical devices/non-Chromium engines were not newly tested. No deployment, publication or push.

---

# v0.42.3 — Pixel Snapper City houses resized and grounded (2026-10-18)

Integrated the ten user-supplied Pixel Snapper files selected for the City: nine distinct residences and the terracotta-awning café. Every supplied native canvas/RGBA pixel is preserved in a separate local `city-buildings` atlas with nearest filtering. The nine residences render at integer 2×, matching the accepted right-hand terracotta cottage's pixel scale; the café retains its compact integer 1× storefront scale. Clothing and barber art remain the previously accepted versions, as requested.

All ten residential lots now expose green grass beneath and around the buildings instead of cream platform fill, without erasing road pixels. Visible house anchors were refitted to road-free parcels; only the lower 24 native rows form the physical foundation, so roofs no longer create invisible walls. Porch points, entries, resident commutes, tree relocations and gathered-vegetation identities remain safe. The public planter terrace now contains exactly three benches at its existing compact spacing; all extra planter instances are filtered out.

All 387 tests pass and the production build succeeds. Seven isolated 1280×720 production-browser views confirm crisp `pixelated` rendering, successful local atlas requests, green residential lawns, comparable cottage scale, three planters and no console/page errors. Evidence is in [city-building-snapper-v2 verification](verification/city-building-snapper-v2/README.md); source hashes and inherited AI-art terms are in [the source record](assets/licenses/city-building-snapper-v2/SOURCE_RECORD.md). A physical phone and non-Chromium browser were not newly tested. No backend, remote runtime asset, save-schema/economy change, deployment, publication or push.

---

# City building redesign concepts — review only (2026-10-18)

Started the current game and inspected the live City before creating nine distinct residential façades and new café, clothing-shop and barber façades. The approved Pixel Snapper cottage guides pixel density, camera, outlines and palette; architecture varies through rooflines, materials, porches, balconies, bay windows, masonry and storefront treatments. All twelve high-resolution RGBA sources remain outside `public/` in [city-building-redesign-v1](../output/art/city-building-redesign-v1/README.md). No runtime atlas, map, collision, entry, NPC, service, save, economy or gameplay code changed.

The user will review/process the images and return updated native files before integration. Source hashes, dimensions, prompts and AI disclosure are recorded in [the source record](assets/licenses/city-building-redesign-v1/SOURCE_RECORD.md). Manifest validation passes for all twelve files; all 385 tests pass and the production build succeeds without emitting the review PNGs into `dist/`. Results and limitations are recorded in [verification](verification/city-building-redesign-v1/README.md). No deployment, publication or push.

---

# v0.42.2 — user-supplied Pixel Snapper City cottage (2026-10-17)

Replaced the v0.42.1 generated native derivative with the user's supplied 167×110 Pixel Snapper PNG. The fully opaque source is preserved unchanged. Runtime preparation removes only 9,345 exact-white backdrop pixels; all 9,025 non-white RGBA pixels and the native canvas dimensions remain exact. It renders at integer 2× with nearest filtering. A transparent-margin placement offset retains the established visible entry `(2350,438)`, walkable approach, `house-village-4`, Tomas's assignment, parcel, schema and commute.

The new 167×110 frame occupies unused space in the unchanged 1024×4041 atlas. All 1,060 baseline frame records and every pre-existing pixel remain exact. All 385 tests and the production build pass. Isolated production-browser inspection confirms both cottages, transparent backdrop, crisp integer-scaled rendering, actual player doorway access and no console warnings/errors. No physical phone or non-Chromium browser was newly tested. Full evidence is recorded in [verification](verification/city-cottage-snapper-v2/README.md); [source evidence](assets/licenses/city-cottage-snapper-v2/SOURCE_RECORD.md) records hashes, exact transformation and inherited terms. No new generation, dependency, runtime path, backend, gameplay/economy change, deployment, publication or push.

---

# v0.42.1 — user-approved terracotta City cottage (2026-10-17)

Replaced northern `cottage-b` with the user's selected cleaned terracotta cottage. The 1347×1167 generated source is preserved outside production and exported to the established 120×112 native cell, binary alpha, shared material palette and 2× world scale. The new frame occupies unused space in the existing 1024×4041 town atlas; all 1060 earlier frame records and every pre-existing pixel remain exact. `house-village-4`, Tomas's resident/home identity, parcel, building index, save schema and commute are preserved. The interaction anchor follows the new visible door at `(2350,438)` and its paved approach remains walkable/connected.

Atlas preservation and targeted City checks pass; the full suite passes with 385 tests and the production build succeeds. Isolated production-browser inspection confirms both cottages, nearest-pixel rendering, the new porch approach, actual player access and no console warnings/errors. No physical phone or non-Chromium browser was newly tested. Full evidence and limitations are recorded in [verification](verification/city-cottage-terracotta-v1/README.md). Source/prompt summary, terms, hashes and human review are in [provenance](assets/licenses/city-cottage-terracotta-v1/SOURCE_RECORD.md). No new dependency, runtime path, remote asset, backend, gameplay/economy change, deployment, publication or push.

---

# v0.41.0 — approved City garden, shop sites and interiors integrated (2026-10-17)

Integrated approved location proposal02 after the user's "now do it". Café is set back at the first cottage plot with two existing tables/chairs in front; clothing replaces the riverside cottage; barber is adjacent; two tents, two benches and barrel move together to the eastern green parcel; fixed camp planter is removed. Clara/Tomas retain home indices3/1 with exact northern cottage art. New facade footprints derive from opaque native scanline hulls; door aprons, approaches and home routes are connected. Current green shader, public three-bench arrangement, fountain artwork/scale and character artwork remain.

Barber/clothing are fixed indoor areas with approved furniture and existing room renderer. Sol/Nell use their original prices, appearance ownership and7am–7pm service guards, including their home commute; work sprites appear indoors only. New areas retain schema19 saves/nearest-safe validation; no normal local save is rewritten. The café has outdoor seating/context signage, with no unapproved indoor scene or new economy. Four pots/twelve low planting groups refine the island while reusing all existing gatherable identities. Completed Flower Court's bench moves80units east to avoid a tent; project IDs/costs/rewards/completion remain.

380tests/build pass. All1051prior atlas records/pixels, nine native approved PNGs and74other public asset files are exact; atlas1024×4041, allowlist48files. Browser acceptance covers keyboard door round trips, Sol purchase/reload, Nell purchase/ownership, café aisle, fountain/day/night lamps, camp/completed project and northern homes. No browser console errors observed. Mobile/physical devices were not newly exercised. [Evidence/limits](verification/city-shops-v1/README.md), [provenance](assets/licenses/city-shops-v1/SOURCE_RECORD.md). Both historical proposals remain separately unchanged. No deploy, publish or push.

---

# City location proposal 02 — requested café, clothing and camp sites (2026-10-16)

Revised only the separate [City proposal](../output/previews/city-garden-shops-v2/README.md). Café occupies the supplied first screenshot's cottage plot, set back about48 world units with two existing tables/chairs in front. Clothing moves to the second riverside plot, with a lamp moved off its entrance. Two tents, two ordinary benches and one barrel move together to the last screenshot's eastern green parcel; the camp planter is removed. Its shallow parcel edge expands across the vacated clothing plot, with current green material retained. Original resident home indices3/1 are proposed to map to northern cottages A/B; no live home/schedule change.

All prior proposal files, nine native art PNGs and thirteen originals are preserved byte-exact. All251 source/public/config baseline files remain exact.375 tests/build and the48-file production boundary pass. Static current-foot checks pass requested shop/café/camp approaches and authored patrols; the local viewer and café/camp images were inspected in the browser. Final shop doors/collisions, indoor service guards, home commutes, saved decor/projects, night/mobile and Cottage A/Ada visibility require integration acceptance after approval. No runtime map/asset/collision/route/service/save/gameplay changes, deployment, publication or push. [Source record](assets/licenses/city-garden-shops-proposal-v2/SOURCE_RECORD.md).

---

# City fountain garden and shops — review proposal only (2026-10-16)

Completed a separate full batch under [city-garden-shops-v1](../output/previews/city-garden-shops-v1/README.md): day/night fountain garden, complete footprint/entrance plan, three shop exteriors, two cottage infill designs, barber/clothing interiors with existing Sol/Nell, contact sheet, nine transparent native object PNGs and thirteen untouched generated originals. The garden retains approved fountain art/origin/scale, current stone edge, roads, compact terrace and natural ground material; four modest golden-flower pots and grouped approved lower foliage replace sparse island planting. No playable integration.

All 375 tests/build pass; 48-file production allowlist excludes the review. All 251 source/public/config baseline hashes remain exact. Static actual 24×12 foot-body checks pass all tested public/door/service/bench approaches and current authored patrol samples; conservative indoor approaches fit within the existing 58-unit service range. No hard-footprint conflicts found. Current live City was inspected; proposal images were visually inspected separately. No normal save edits.

Approval remains pending. New room/door transitions, final facade/door collision tracing, NPC work/home schedules and area guards are required before indoor services can function. Cottage A is close behind Ada's patrol; existing boundary canopies cover portions of the cafe/clothing edges. Live visibility, dynamic project/decor/save/commute checks and fountain-animation registration remain integration acceptance work. One lamp's proposed 64-unit eastward move and three cafe-border ground-cover moves are preview-only. [Static checks and limits](../output/previews/city-garden-shops-v1/checks.json), [source evidence](assets/licenses/city-garden-shops-proposal-v1/SOURCE_RECORD.md). Earlier proposals/artwork preserved. No deployment, publication or push.

---

# v0.40.0 — City layout approved and integrated, existing green ground retained (2026-10-16)

User approved proposal 03 for integration with the current game's green land. Added the 560×192 compact terrace with three unchanged-scale vertical planter benches (88-unit visible gaps), connected cream/grey surface network, six-world-unit projected curb faces, highlighted stone lips, restrained road contact shade, lowered crossings, and shaped fountain island/grouped planting. Current `groundSurface.js` grass colours/noise/material flecks remain byte-exact; no flat proposal lawn repaint. All existing public asset files are byte-exact, including all approved outdoor/house/character PNGs. Night lamp emission remains registered at the new positions.

Acceptance corrections: cream cottage aprons override the broad proposal road under existing house feet/flowerpots. Two market lamps and two tree roots shift eight world units to clear curb edges; their artwork and tree identities stay fixed. No new curb collision banks. Actual approved furniture footprints and the fountain's registered column collision move with the art. Buildings, Home edge, bridges, service anchors and authored NPC patrols remain. Café/barber/clothes parcels stay reserved.

All 227 City ground-plant identities and all tree identities survive Continue, including removed nodes. Ninety approved planting positions reuse existing gatherable nodes; remaining original cover stays on clear green ground with stable IDs rather than being deleted or respawned. Existing project scenery remains and covered grass follows existing project visibility rules. Save schema19 is unchanged; no normal user save was edited.

375 tests pass: actual24×12 foot-body surface connectivity covers markets, boards, two bridges, all10porches and both sides of all3benches; actor commutes instantiate safely and completed-project approaches stay open. Production build/48-file allowlist pass. Browser production-fixture checks at1280×720 include Continue, bench-gap walking without jumping, all four fountain sides, night lamps, completed Commons/Flower Court visuals and opening the town board. Browser save isolation uses port43865; main4215 save untouched. Mobile/touch was not newly exercised. [Evidence and limits](verification/city-layout-v1/README.md), [source record](assets/licenses/city-layout-v1/SOURCE_RECORD.md). Previous proposals remain separately; no publication, deploy or push.

---

# City proposal 03 — compact terrace and landscaping, review only (2026-10-16)

Created a separate revision: visible bench gaps 125→88 world units (−29.6%); terrace 704×216→560×192 (−29.3% area). Approved furniture/character scales and artwork remain. Three benches and two corner lamps move; planted green pockets replace the broad ends, and the front apron is trimmed around a small connected grey forecourt. Continuous stone lips, visible front curb faces, narrow road contact shade, smaller quiet pavers, broad olive/sage lawns and grouped existing planting refine the terrace, gardens and shaped fountain island. Future frontage reservations remain exact; no buildings created.

[Local proposal](http://127.0.0.1:4220/), [overview/close-ups/comparison/checks](../output/previews/city-road-layout-v3/README.md), [provenance](assets/licenses/city-road-layout-proposal-v3/SOURCE_RECORD.md). Previous proposals preserved; five prior PNG hashes exact. All 249 runtime files exact, playable v0.39.0 unchanged.371 tests/build and 48-file allowlist pass.

The new static check uses the actual 24×12 City foot body, asymmetric feet anchor, 40×60 house clearance, all prop feet/posts/bridge rails and proposed planting. It finds no remaining access failures, including all ten porches, services, bench-side approaches and 663 resident-route samples. A missing southwest porch link is added in the proposal; board access is verified from a legal point 16 units south of its own post. Live NPC commutes, completed projects, saves/owned decor/vegetation IDs, night/mobile acceptance and future building fitting remain deferred until approval. No integration/deploy/publish/push.

---

# City layout proposal 02 — raised paving, review only (2026-10-16)

Revised the separate preview with highlighted stone lips, consistently projected shallow curb faces, restrained road contact shade, softened connected corners and lowered crossings. Smaller quieter paving joints and grouped planting refine the shaped low fountain island. Same close-up crops/dimensions. All previous prop frames, scales and positions remain exact, including the approved bench arrangement. Proposal 01 is preserved.

[Review locally](http://127.0.0.1:4219/), [files/checks/limits](../output/previews/city-road-layout-v2/README.md), [source evidence](assets/licenses/city-road-layout-proposal-v2/SOURCE_RECORD.md). All 249 runtime baseline files are exact; playable v0.39.0, maps, collisions, routes, services, saves and assets remain unchanged. All 371 tests/build, 48-file production allowlist and static geometry checks pass; browser viewer inspected. Live collision/NPC/project/save/night/mobile acceptance remains deferred until explicit integration approval. No deploy/publish/push.

---

# City road layout proposal 01 — review only (2026-10-16)

Created a separate City street/sidewalk/island/three-bench terrace proposal under `output/previews/city-road-layout-v1`, served locally at <http://127.0.0.1:4218/>. Includes annotated and clean complete overviews, full-resolution PNG and two 1146×804 gameplay-size close-ups. Existing approved object art/scales, buildings, bridges, market anchors and Commons beds are reused. Café/barber/clothing parcels are diagram reservations only.

All 249 runtime baseline source/public/config files are byte-exact; playable v0.39.0, maps, collisions, NPC routes, services and save code remain.371 tests/build pass;48-file production allowlist excludes the proposal. Offline geometry connects Home, both bridges, ten porches, markets, boards and resident/service anchors; three benches have equal spacing,125 world-unit foot gaps and48 front clearance. Browser viewer controls/images checked.

Approval is pending. Actual proposed walking/collision, NPC commutes/completed project scenery, saved vegetation identities and night/mobile behavior are not verified because the layout is deliberately not integrated. Final future shop dimensions need fitting. [Proposal and limits](../output/previews/city-road-layout-v1/README.md), [art evidence](assets/licenses/city-road-layout-proposal-v1/SOURCE_RECORD.md). No deploy/push/publish.

---

# v0.39.0 — outdoor follow-up complete (2026-10-16)

Six new sources replace attached notice/route boards, wheelbarrow, ground flowers, fountain and tents. Functional labels remain; fountain highlights follow its new cascades. The approved well source is reused at72×96,50% larger than48×64, with bottom/centre retained and shared basin footprint updated. Five older City planted benches reuse the approved planter; its first accepted placement remains. Other approved collection art is exact.

Glass-only lamp emission and stepped pixel pools fade with dusk/dawn. Twelve City lamps clear roads; seven trees move to green ground outside sidewalks, roads, plazas, garden soil and canal. Moved trees retain original saved IDs/removals. Save schema/progress, prices, people, home and water/bridge rules remain.

371 tests/build pass. Audit:1050 old metadata records exact,14 replaced cells,1036 protected old cells/non-target RGBA exact, one new well frame,1051 total,1024×3925. Six full originals/18 other runtime files and prior collection/lamp/planter pixels exact; same48-file allowlist and prior-runtime ZIP. Actual daytime/nighttime City views and movement checked. Direct in-game well/full-object/touch/device/other-browser checks remain open; well comparison is offline. [Checks](verification/outdoor-followup-v1/README.md), [provenance](assets/licenses/outdoor-followup-v1/SOURCE_RECORD.md). No push/deploy/publish.

---

# v0.38.0 — outdoor collection integrated (2026-10-16)

Installed the fourteen reviewed objects and approved unlit lamp through existing prop/frame routing. Existing logical dimensions, map positions, catalog ownership/prices and save schema remain. The Home trial bench now uses the reviewed south-facing design. Functional route labels remain; decorative sign art is blank. Static fences join into continuous runs with preserved path gaps/collision cells. One closed gate replaces an already closed City boundary span; the walkable Forest gateway remains. New mature common-tree/bush origins are measured, preserving saved vegetation IDs and trunk anchors. The small rock cluster fits the existing ground footprint. Approved home/characters and accepted planter stay exact.

367 tests and normal build pass. Art audit:25 old cells replaced,1016 untouched,1041 preceding metadata records/non-target RGBA exact, nine appended frames,1050 total,1024×3825. All18 other runtime art files and full original sources/references remain exact. Same48-file build allowlist. Existing-source ZIP and preceding runtime-art ZIP are preserved. No new image generation during integration, dependency, backend, remote art, save fixture or publication.

Actual browser Continue/house exit/Home-to-City walking and outdoor visual checks pass. The atlas-tiling issue found during inspection was corrected using cropped Images, then rechecked. Market's existing7pm closure remains. Full per-object/rotation/touch/physical-device acceptance remains open. [Checks/screenshots](verification/outdoor-collection-v1/README.md), [provenance](assets/licenses/outdoor-collection-v1/SOURCE_RECORD.md). No push/deploy/publish.

---

# v0.37.2 — accepted muted planter-bench integrated (2026-10-16)

Replaced only the existing City sample with the accepted muted reddish walnut timber, sage/olive foliage and softer flowers. The original1536×1024 PNG is preserved separately; previous orange sources/native artwork and pre-update atlas remain backed up. Same68×87 native frame,1.5× rendering,433/516 placement,96×94 ground footprint and shadow omission. Camera, character, other benches, home and saves remain.

365 tests and normal build pass. Pixel audit confirms all1041 metadata records exact, all pixels outside the target cell exact and18 other runtime art files unchanged. Same48-file runtime allowlist; no source/archive/review leakage. Existing in-app browser reload and City visual check succeeded, with an actual dusk screenshot. Full collision/touch/physical-device checks remain unverified; pure approach tests pass. [Checks](verification/planter-bench-muted-v2/README.md), [provenance](assets/licenses/planter-bench-muted-v2/SOURCE_RECORD.md). No push/deploy/publish.

---

# v0.37.1 — one approved City planter-bench sample integrated (2026-10-16)

The human approved the vertical planter-bench and asked to inspect it in the game. One fixed City planted bench below the seed stall/left of the fountain now uses the original accepted design: vertical long axis, long side seats, higher orthographic camera, warm timber, sage/olive foliage, purple spikes and cream flowers. Full1536×1024 original and earlier source remain preserved. A separate68×87 native derivative renders at1.5×, with no added shadow/glow. Other five planted benches, catalog/saved pieces and the approved home retain their art.

One frame appends to town:1040 old records/full old RGBA exact,1041 frames total,1024×3693. All18 other runtime art files are byte-exact. Explicit allowlist stays48 local files; no source/archive/review leakage, dependency/backend/remote asset, save/economy change or user-save fixture. Rendering and physics/save validation share the new per-object footprint, preserving dry approaches and both market lanes.

365 tests and normal build pass; source/native/preservation/build audits pass. [Verification/limits](verification/planter-bench-v1/README.md); [provenance](assets/licenses/planter-bench-v1/SOURCE_RECORD.md). Browser automation remains URL-policy blocked, so actual in-game visual/keyboard/touch acceptance is unverified.4215 listener is present. No push/deploy/publish/submit.

---

# v0.37.0 — approved home collection and architecture integrated (2026-10-16)

The latest human approval supersedes the review-only gate for the accepted collection/room. Integrated the cream upper wall and peach panel trim, separate floor plane at y112, two mounted windows/shelf, continuous side walls, quiet40×32 tile spacing,72-unit front opening and flush wooden threshold. Visible-bound/foot placement grounds back storage and hearth, centers left dining and retains right sleeping. Removed the storage jar instance/collider and moved firewood16 world units back; its artwork remains preserved. All other approved room placements match the standalone review. The table uses its already approved original design, not a new generation; the old32×24 trial remains in town unchanged.

Separate17-frame home atlas; existing town/world/farmer PNGs and every preceding runtime art file remain exact. Original generated canvases/native sources/backups remain locally available. Character size, animation, camera, catalog prices and save schema19 are unchanged. Floor/solids/approaches now share corrected geometry; existing recovery safely repairs outdated positions and returns obstructed paid decor once. House palettes retain their finishes. No backend/dependency/remote art or outdoor table change.

Checks:363 tests pass and production build passes with48 explicitly allowlisted files. New five-viewport walking/context/save tests and pixel/source/placement audits pass. Runtime composition was inspected offline. Actual browser interaction/rendering is unverified because the browser tool's URL security policy rejected localhost and explicitly prohibited workarounds. No bypass or user-save fixture was used. [Evidence, reproduction and limits](verification/home-interior-v1/README.md); [original sources/prompts/export evidence](assets/licenses/home-interior-v1/SOURCE_RECORD.md). No push/deploy/publish/submit.

---

# v0.36.3 — one native table, awaiting visual review (2026-10-15)

Latest scope is ONE standalone32×24 table, replacing the interrupted larger walnut candidate. The user specifies the interior reference's orthographic angled top-down construction, dominant deep oval top, thin front rim, short front legs and upright jug/cups with overhead openings. One new table-native-review frame renders at2× inside the house. A12-colour available ramp uses9 opaque colours in the selected native output, binary alpha and transparent padding; no ground shadow. Main characters and all other prop art remain as before. Catalog/purchased table art is unchanged. The fixed table keeps its prior centre while shrinking to64×48 world units, and its collider shrinks to60×28 with matching depth sorting. The extra themed vase overlay is suppressed for this table's exact one-jug/two-cup design.

All1039 preceding atlas frame records and the full old RGBA region remain exact, including interrupted64×40 walnut and chunky-bench candidates. One appended frame yields1040 frames in1024×3602, below4096. Existing native/source art and ZIP archives are preserved; no deletion, new dependency, runtime remote asset, schema/cost/save-ownership change, push or publication. Earlier whole-set cedar approval is superseded by the subsequent mood rejection and one-object review gate.

Checks:359 tests and production build pass,46 local allowlisted files, old-pixel/source/native/alpha audits pass. Desktop English1280×720 and phone Myanmar390×844 browser checks load the table and verify blocked passage/open ground beside it. Test fixtures stay on4216; normal4215 save is untouched. Actual screenshot and known limitations are in [verification](verification/table-native-v1/README.md); [exact prompts/provenance](assets/licenses/table-native-v1/SOURCE_RECORD.md). Native pottery is symbolic at32×24. Artistic acceptance is pending; no new all-object rollout is performed.

---

# v0.36.0 — approved cedar prop rollout (2026-10-15)

User approval of the one-bench trial explicitly authorizes the remaining prop set. Completed with 48 selected original built-in imagegen sources, 78 appended frames serving 80 logical prop names and exact reuse of the approved bench. Interior furniture, themed rug/quilt derivatives, windows/doors/wall ornament, garden decorations, public seating, street utilities, signs, stalls, tents, rock/log/shrine/chest/cave/ice/Stash Bag props share the high-angle view and muted material palette. Catalog/ghost/placed direction views share local sprites. Fountain highlights follow the new three cascades; sign labels/arrows retain their layout and remain above the new board. Tables remain removed outdoors and place indoors only.

All 959 preceding frame records and the complete old atlas RGBA region remain exact. Atlas 1024×3486, 1037 frames, unchanged 46-file production allowlist. Logical scales preserve world extents, positions, colliders, prices, saved IDs/ownership and schema19. Main characters, NPCs, crops, main trees/grass, wildlife, architecture, terrain and already detailed licensed landmarks remain. No backend, runtime remote asset, dependency, push or publication.

Checks: 359 tests pass; production build passes; native audit verifies binary alpha, installed pixels, 48 source hashes, protected farmer/world hashes and runtime exclusions. Desktop English1280×720 and phone Myanmar390×844 browser flows pass craft/rotate/place/purchase/Continue and indoor-table recovery/placement. Additional label-fit, bench passage and water checks plus actual scene screenshots are [recorded here](verification/cedar-props-v1/README.md). Browser fixtures write only isolated4216. Physical phones, all engines, every Forest landmark and performance benchmarks are not covered; artistic judgement remains subjective. [Prompts/provenance](assets/licenses/cedar-props-v1/SOURCE_RECORD.md).

---

# v0.35.3 — one cedar bench trial, awaiting user review (2026-10-15)

Completed the explicit one-object scope: one Home garden bench at(960,824) uses a new high-angle 3/4 top-down cedar sample, with broad visible seat/arm tops, muted warm wood, soft olive foliage, pastel flowers, crisp native pixels and an existing subtle contact shadow. Built-in imagegen made one source plus two targeted edits. All other object designs and bench direction/catalog views remain unchanged until user feedback.

The appended64×40 frame renders at1× while retaining the previous64×40 world extent and collider. All958 pre-existing atlas records and the full old RGBA region stay exact. No item/save/gameplay rule is added. Checks:358 tests pass, production build passes with46 local allowlisted files, source/native/one-instance audit passes. Desktop browser confirms actual rendering, blocked passage through the bench and open passage around it, with no console errors. Normal4215 and test4216 were restarted. [Screenshot/checks and limitations](verification/bench-cedar-v1/README.md); [exact prompts/provenance](assets/licenses/bench-cedar-v1/SOURCE_RECORD.md). Artistic acceptance remains with the user; no bulk rollout, push or publication.

---

# v0.35.2 — prop projection, quality and outdoor-table cleanup (2026-10-15)

Completed the latest requested art refinement: 28 selected original imagegen sources plus one fireplace correction update 41 existing frames. Furniture, cabinets, shelves, beds, windows, wells, lanterns, crates/barrels, planters, seating, tents, market stalls and other utilities share an overhead camera-facing view, broad top planes, shorter fronts, controlled material shading and proper upright seating directions. Rear furniture feet align; hearth/log solids and cooking anchor move together, central window clears the mantel and a City tent clears planted seating. Existing rugs, approved farmers/foliage and camera scale remain.

Removed fixed outdoor tables. Dining table placement is indoor-only; crafting remains available and Bag/crafting hints explain the location. Continue packs former outdoor tables and indoor pieces displaced by revised furniture geometry, preserving ownership. Fixed completed City projects showing incorrect markers/duplicate flower overlays. No unrelated systems or schema fields added.

Verification: all 358 tests pass; production build passes with 46 local allowlisted files. Native audit preserves 917 non-target frames and all 958 frame records, approved boy/girl/world hashes, source hashes and binary alpha. Desktop English1280×720 and phone Myanmar390×844 browser flows pass crafting, four bench views, placement, purchases, table recovery, indoor placement and Save/Continue. Final scene screenshots and production rendering are recorded; port4215 responds200. Fixture writes stay on4216. [Checks and limitations](verification/props-v3/README.md); [art evidence](assets/licenses/props-v3/SOURCE_RECORD.md). No publish/push. Artistic quality remains subject to user review; no claim of identical Plant Tales artwork or full traversal of every view/location.

---

# v0.35.1 — clean pixel shapes and coherent overhead props (2026-10-15)

Completed the user's quality/viewpoint correction. Thirteen selected new built-in imagegen sources define simple coherent table/seat, rug, fireplace, logs, cupboard/shelf, window, bed and vase artwork. Stronger contours, broad material clusters, quiet textile centres and consistent visible upper/front planes replace the grainy miniature-render look. One bookcase source was corrected from jars to actual books. Native export uses nine-sample colour voting and a 33-colour base ramp, with conservative cleanup for reused recent props. Rugs now occupy their full established floor rectangle, keeping north seating visually on the carpet.

50 cells replaced; all 958 frame metadata/coordinates and 908 non-target RGBA cells remain exact in the same 1024×2564 atlas. Approved farmers/NPCs/crops/foliage/snow remain. Existing physical furniture positions/solids, room geometry, prices, character scale, saves and ownership are unchanged. Same 46 runtime files and no new dependency/backend/remote asset.

All 354 tests, production build and native audit pass. Actual starter/Rose interiors reviewed beside the farmer. Desktop English and phone-size Myanmar browser flows pass crafting, four turns, placement, purchase and save/Continue with clean console. Production 4205 serves index-DZSj2X0j.js; game 4215 is running. Fixtures remain isolated on 4216; normal saves are untouched. [Checks/screenshots/limits](verification/props-v2/README.md), [native gallery](../output/art/props-v2/index.html), [exact prompts/hashes/terms](assets/licenses/props-v2/SOURCE_RECORD.md). Physical touch/other engines and performance benchmarks are not covered; visual-reference acceptance is subjective. No push, publication or submission.

---

# Local game server restored — 2026-10-15

The reported 4215 URL had no listening process. Restarted the existing Vite development server on 127.0.0.1:4215 with strict port selection. Browser verification shows the game language screen and a clean console. All 354 tests and the production build also pass. No game code, assets, settings or saved progress changed. The local server must remain running for this localhost URL to work; no publication or remote hosting was performed.

---

# v0.35.0 — layered pixel props and snow material fix (2026-10-15)

Completed the latest art request and style correction using the user's two newer Plant Tales examples as perspective/material references. Refreshed benches/tables, wells/lamps/notices/crates/barrels, mailbox/wheelbarrow, public planted seating/tents/sunflowers, garden/furniture catalog pieces, home furnishings and selected older woodland rock/log/marker/chest/scarecrow/window assets. Thirty-six selected original built-in imagegen sources, native shared-palette adaptation and disclosed original direction views. Shop/ghost/placed objects share artwork; thumbnails fit. Snow pine keeps separately authored caps/needles/bark instead of double tinting. Paid rug/quilt accents retain pixel detail; purchased upright pieces have small contact shadows.

42 atlas cells change in place and 12 frames append. All old coordinates and 904 non-target cell pixels stay exact, including approved farmer/NPC/crop art. Atlas 1024×2564, 958 frames. Existing roads/fields, solid footprints, farming, prices, ownership, local save schema 19/key and progression remain. Same 46-file runtime allowlist and no new dependency/remote asset.

All 354 tests and production build pass. Desktop English and phone-size Myanmar browser checks pass crafting, four-direction turns, placement, purchase and save/Continue, plus City/interior/snow rendering with clean console. Production 4205 loads index-DZSj2X0j.js. Fixtures remain on 4216; no normal user-save replacement. [Verification, screenshots and limitations](verification/props-v1/README.md), [exact prompts/source hashes/terms](assets/licenses/props-v1/SOURCE_RECORD.md), [native gallery](../output/art/props-v1/index.html). Physical phone touch/other engines and performance benchmarks are not covered. No source push, publication or competition submission.

---

# v0.34.0 — more nature variety and physical water contact (2026-10-15)

Latest request completed: retired the spiky palmetto and thin fern designs from rendering, replacing their placements with leafy bushes while preserving saved ground-cover IDs. Added pale-trunk saplings, young-fruit forms and leafy/berry/flower/small shrub variants among existing anchors. Six appended frames from two selected original built-in imagegen sources; all940old atlas frames/coordinates/pixels remain exact, including approved farmers/crops/NPCs. Same46file runtime allowlist, no new dependency/URL.

Running in water now makes alternating foot splashes, expanding broken wake rings, short ballistic droplets and wet/dry entry/exit bursts. Effects use a bounded transient model, clip to water and expire; blocked/idle movement creates no endless steps. Existing reflections, crop/shore masks and currents remain. Bridge rails now have physical side boxes shared by Forest pure movement/jump/save queries and City Phaser collision. Both ends/center corridor remain open; water remains walkable. Saved positions in new rail masks normalize nearby without progress loss. No schema19/key, farm layout, crop/economy, original tree IDs or species-rule change.

All351tests and production build pass. Desktop English and phone-size Myanmar checks verify plant aliases, active water footsteps/reflection, Forest bridges in both orientations and City bridge side/end/dry-deck behavior. Final production4205entry confirmed clean; fixtures stay on4216and normal saves were not replaced. [Checks/pixel audit/previews/limitations](verification/nature-water/README.md), [exact prompts/source terms/adaptations](assets/licenses/nature-v2/SOURCE_RECORD.md). Cosmetic fruit/flower variants add no harvest system. Physical phone touch/other engines and performance benchmarks not covered. No source push, publication or competition submission.

---

# v0.33.0 — original natural foliage (2026-10-15)

User's screenshot request implemented with original built-in imagegen broadleaf, palm, pine and tall-grass assets, adapted to native transparent pixels. Warm branching trunks, fuller irregular olive leaf clusters, feathered fronds, textured evergreen boughs and irregular blade groups replace simpler common art. Shared outdoor tree rendering registers actual roots at unchanged trunk/collision positions, with full canopy bounds and grounded shadows. Existing fern silhouettes now use olive color treatment; ground leaf marks/flowers are calmer. Crowns covering the farmer fade to28%for readability through overlapping layers.

Forty existing tree/grass/detail atlas cells replaced in place; two generated-crown/original-fruit adaptations append for guava/mango. All898other old cells and every original frame coordinate remain exact. Existing boy/girl/world files remain unchanged. Map data/roads/fields, free digging/restore grass, vegetation IDs, crop records, collision, economy, local save schema19and world scope remain. No new runtime URL/dependency; same46file allowlist.

All346tests and production build pass. Desktop English and phone-size Myanmar browser checks pass for new crowns, three-hit chopping/wood, saved cut IDs, grass bending and Forest palm bounds. Final production4205entry has clean console; isolated4216fixtures preserve normal user saves. [Checks/pixel audit/screenshots/limits](verification/nature-v1/README.md), [exact prompts/raw hashes/rights/conversion record](assets/licenses/nature-v1/SOURCE_RECORD.md). Derived mirror/tone/bend variants are disclosed; willow reuses a smaller broadleaf design. Physical phone touch/other engines and performance benchmarks were not covered. No push, publication or submission.

---

# v0.32.0 — spaced five-row Farm and restore grass (2026-10-15)

Applied the latest correction: starter8 ×5 /40spaces, other growing areas384 ×240. Narrowed entrance/house branch within old road footprints, leaving at least32world units between starter soil and roads. Moved the existing board to800,532/service828,576, away from the field and entirely over previously undiggable road ground; no valid old crop bed becomes blocked.

Shovel on an empty bed now offers a localized canvas Restore grass confirmation. Cancel preserves soil; Confirm hides the empty bed, removes its wet patch and saves. Planted crops are protected, and grass can be dug again using the same reserved/custom index. Saved grass overrides prevent automatic starter preparation from recreating removed soil. Existing six-row saves restore only empty sixth-row starter soil once; planted crops and custom records remain. Schema19/storage key, coins, inventory, other farms and progression remain. Record slots are retained under the existing2048cap; filling does not refund items or digging energy.

All344tests, production build and desktop English/phone-size Myanmar browser flows pass, including Cancel/Confirm, Continue and re-dig. Confirmation layout fits phone. Production4205entry checked with clean console; test fixtures confined to4216. Existing raster/metadata hashes remain;46allowlisted build files. [Checks/screenshots/limits](verification/farm-restore/README.md). No new art/dependency, user-save replacement, push or publication. Physical phone touch/other engines not checked.

---

# v0.31.1 — taller Farm and free choice of digging ground (2026-10-15)

User correction implemented: width remains eight columns; height grows from four to six rows (384 × 288), with48starter spaces. All four growing-area clearances match. Removed the large pale fallow rectangles: undug areas remain natural grass. Removed the Copper Can gate from digGround, including clear ground outside the defined growing sites. The pictured message was this old upgrade restriction. Farm-only/range/energy/capacity, road/water/building/furniture and overlap checks remain. Separate additional-farm purchases and watering upgrade are unchanged.

The original64reserved slots/coordinates remain. STARTER_EXTENSION preserves its first16right-side cells and appends16bottom-row cells. Existing load logic restores old custom crops/paid furniture/planted grass before safe additions. Coins, inventory and saved progress remain; schema19and storage key stay. Full/large legacy saves can receive fewer additions under the existing2048custom-bed cap; old content takes priority.

All340tests and production build pass. Desktop English and phone-size Myanmar browser checks pass for bottom-right planting/watering, all three other sites, free digging/planting/watering/Continue between fields and former-road traversal. Production4205entry confirmed with clean console. [Evidence, screenshots and limitations](verification/farm-free-dig/README.md). Raster/metadata hashes unchanged;46allowlisted production files. No image generation, new dependency, user-save replacement, push or publication. Physical touch/other browser engines not checked.

---

# v0.31.0 — eight-column starter and matching growing areas (2026-10-15)

User follow-up asks for fewer roads, a wider initial farm, three matching blank growing areas and advice about a2.5Dlook. Farm roads drop from12segments to6connected entrance/main-lane pieces, each a subset of previous road ground so earlier dug beds are not paved over. Four clear384×192areas have8×4cells. The starter has32prepared beds; other areas use lighter fallow earth and accept manual digging without Copper/coins. One decorative rock intruding into the enlarged southwest area is removed. Useful landmarks/owned scenery remain. No other-map road redesign or depth/art-system replacement.

Preserve64legacy save crop slots and every original coordinate. New starter columns append16empty custom beds per farm, including on new-farm purchase. Load first restores existing custom crops, furniture and planted grass, then fills safe missing starter positions, bounded by the existing2048custom-bed cap. Overlapping old crops/scenery win; full legacy saves may have fewer added beds. No new schema/key or crop/yield/price change. Field-local snapping now works across all8columns while respecting saved custom beds. Working a bed with seeds/water/harvest takes priority over the nearby Farm board; pointed beds and empty-hand board access remain.

All340tests and production build pass; desktop English and phone Myanmar far-edge planting/digging/Continue checks pass. [Checks/screenshots/limitations](verification/farm-layout/README.md). Existing raster assets are unchanged; fallow earth reuses original procedural soil pixels. [Source/AI evidence](assets/licenses/farm-layout-v1/SOURCE_RECORD.md). No image generation/new dependency/runtime URLs, push or publication. Existing game stays2D; recommended next depth work is consistent sprite angle/light, fuller shaded crops and canopy overlap, using existing shadow/feet-sorting systems.

---

# v0.30.1 — Farm presentation cleanup (2026-10-15)

Applied the user's four-image reference request: clean connected earth beds, simpler Farm scenery, plants without baked grey/brown soil pads. MAPS.farm removes repeated scarecrows/barrels/crates/wheelbarrow/pebbles/standalone ornamental flower props/details, ornamental fences and the central shed. Removed two hardcoded fence drawings/colliders too. Shared collision data now frees former prop footprints. Farm house, useful well/board/signs/bench, trees, pond and purchased decorations remain; Home/City/Forest scenery is unchanged.

Code-native soil has a shallower stepped perimeter, warm terracotta patches, reduced grain and brown watering patches feathered only against dry neighbours. All joined wet cells retain a continuous material. Existing crop source functions now omit soil discs/underlines, including all12seed sprites.40native24×32frames lose1,786soil pixels; every remaining plant pixel,898other atlas frames, metadata coordinates, boy/girl/world PNGs and farming/watering/save rules remain. Farm data changes only its explanatory comment; saved beds and field indices remain.

All337tests and the production build pass; desktop English and phone Myanmar input checks pass. [Verification/checks/screenshots](verification/farm-refresh/README.md), [crop export/source evidence](assets/licenses/farm-refresh-v1/SOURCE_RECORD.md). No imagegen calls/new dependency/runtime URLs, source push or publication. This is a presentation fix with existing plant silhouettes, not a newly generated crop set or an exact copy of the reference game.

---

# v0.30.0 — Nell/Sol integration and merchant categories (2026-10-14)

Integrated approved Nell/Sol art by resident ID, preserving shared legacy art used by Clara/Eli.80transparent64×64slots provide four directional idle timings and six authored walking poses per direction. Neutral standing images remain byte-identical,40native-pixel bodies at1.5×scale, ground(32,56). Walking native height ranges39–42pixels with stable boot baseline. Markers use the new60-unit standing height. Menu/hidden-tab pause freezes resident animation. Existing shops, homes, routes, dialogue, curfew, collision and schema19 remain. Sol opens only Hair; Nell only Outfits/Extras, with scope retained through purchase/navigation. Home Wardrobe shows all categories; hair preview suppresses accessories temporarily without unequipping them.

336tests and production build pass; desktop English, phone Myanmar and compact landscape end-to-end checks verify both rigs, purchases, tab scope, pause, full idle/walking timing cycles, evening return,7pm closure and Continue. Native audit confirms80packed images,16unchanged neutral slots, all858legacy frame coordinates/pixels and original farmer/world textures. Production allowlist remains46files. [Verification/screenshots and limitations](verification/npc-integration/README.md), [generated artwork/prompts/rights](assets/licenses/npc-matching-animated-v1/SOURCE_RECORD.md).

Created the next appearance-review design after integration: Clara, existing seed merchant, with copper braid, sage apron and seed pockets. Four transparent standing views match40native-pixel height; no new resident/mechanics/runtime replacement. [Preview](../output/art/npc-clara-v1/comparison.png), [source/prompt/rights](assets/licenses/npc-clara-v1/SOURCE_RECORD.md). Preserve staged appearance approval before her animations. Existing4205save was not modified or replaced. No push, publication, backend, remote runtime assets or new dependency.

---

# NPC design review — Nell and Sol (2026-10-14)

Completed the first standing-design review step of the user-accepted gradual NPC refresh. Nell has a short wavy bob, rose blouse and terracotta apron; Sol has a grey temple streak, teal vest and leather belt pouch. Both match the approved farmers' slim pixel style. Eight transparent64×64directional standing frames use40native-pixel visible height, ground(32,56),32colours per view and equal1×2front pupils. [Review page](http://127.0.0.1:4213/output/art/npc-matching-v1/), [source/prompts/rights](assets/licenses/npc-matching-v1/SOURCE_RECORD.md), [checks](verification/npc-matching/README.md).

Native audit,333tests and production build pass. All four review directions and both size settings were checked in the in-app browser without errors. Original game NPC/farmer/world assets and resident logic remain byte-identical to this step's baseline; playable version remains0.29.0and the46-file production allowlist is unchanged. These are appearance-review assets, not yet animated or integrated. Next: user appearance approval, then idle/walking animation and game replacement while retaining shop roles, dialogue, homes, schedules and curfew. No source push, publication, save access or gameplay change.

---

# v0.29.0 — same farmer, modular clothes and extras (2026-10-14)

Fixed the reported shop bug: clothes/hair choices now keep the saved male/female farmer instead of choosing an NPC preset. Existing five outfit IDs provide muted workwear colour variants, and hair choices dye the same hair silhouette. Added a matching straw hat55c, round glasses40c and canvas backpack75c as independently purchasable/equippable slots. Buy from Nell7am–7pm; owned items switch/remove freely through Home & garden → Wardrobe → Extras. Wardrobe previews turn through four directions. All384body poses retain their original proportions, face/eyes, timings and carry profiles; default starters retain original colours/pixels. Original source PNGs, NPCs, movement, farming and combat remain. Additive schema19 accessory defaults preserve old progress, ownership and wallet.

All333tests and production build pass. Native audit covers40style combinations,384body cells, eye preservation,43,253,760alpha comparisons, unchanged base/tool PNGs and the unchanged46-file production allowlist. Desktop1280×720English and phone390×844Myanmar end-to-end checks pass for both farmers: purchases, free toggles, hair services, all run/jump phases, five work actions and Continue. Final phone/compact-landscape menus received visual review. [Checks/screenshots/limits](verification/farmer-cosmetics/README.md), [new artwork/prompts/rights evidence](assets/licenses/farmer-cosmetics-v1/SOURCE_RECORD.md). Physical touch/other browser engines remain untested. The local4205build is updated; no publication/push.

---

# v0.28.1 — matching female farmer, corrected size and eyes (2026-10-14)

Completed the female counterpart and the user’s size/uneven-eye follow-up. The new female has192authored body frames across eight actions/four directions; shared carried axe/shovel/can art follows her own hand/angle data and hides during combined actions. Garden/Autumn and Play as Girl route to the new rig. Female display scale1.45keeps the41-pixel standing silhouette at59.45world units, matching male60; both front open-eye idle pupils are exactly1×2native pixels. All original male, NPC and environment textures remain byte-identical to the task baseline. Existing save IDs/schema, coins, progression, jump physics and gameplay rules remain.

[Complete corrected sprite export](../output/art/farmer-girl-v2.zip), [source record](assets/licenses/farmer-girl-v2/SOURCE_RECORD.md), [verification](verification/farmer-girl-v2/README.md). Native audit passes192frames,32clips, twelve reused tool views, binary alpha, shared palette, frame/sheet/runtime equality, skin-pixel grips, equal-eye dimensions and matching standing heights. All327tests and production build pass; final desktop1280×720English and phone390×844Myanmar checks pass for every run direction/tool, jumps, all five work/combat actions, tool switching, pause, male regression and female Continue. The restarted4205production preview shows matched title-screen stature and narrow eyes without console errors. Earlier uncommitted work and female v1 remain. No source push, publication, backend, remote runtime, new dependency or new game system.

---

# v0.27.0 — male jump and matching carried tools (2026-10-14)

Completed the user-requested extension of the already integrated approved male farmer:24authored jump poses and12carried axe/shovel/watering-can views, all four directions. Idle/run/jump share real phase-specific hand registration and wrist-based angle data; the tool and hand overlay hide during existing combined actions and restore on movement. Preserve original168frames, original eyes and accepted1.5display scale. Existing600msjump arc, range, cooldown, collision, local saves, combat/rewards, Copper effects and female/other rigs remain.

[Complete updated export](../output/art/farmer-boy-complete-v3.zip) contains192body frames,12tool views, metadata, prompts/sources and the packed runtime atlas. [Source record](assets/licenses/farmer-boy-extension-v1/SOURCE_RECORD.md), [verification](verification/farmer-boy-extension/README.md). Native audit confirms the original168frames byte-for-byte,36new frames, binary alpha, original palette, safe frame edges, atlas equality and ZIP CRC. All324tests and production build pass. Desktop1280×720English and phone-size390×844Myanmar browser checks pass for every run direction/tool, all six jump phases, chopping/digging/watering/axe transitions, switching, pause and Continue. Final game preview has no console errors; physical touch devices/other engines were not tested. Earlier uncommitted work is preserved. No push, publishing, backend, remote runtime, new dependency, save schema or female artwork.

---

# v0.26.2 — original eyes at the accepted smaller size (2026-10-14)

The reported single-eye regression came from v0.26.1’s automatic 64→48 nearest resize, which skipped the narrow left-eye column. Restored all 168 original native RGBA cells and display them at 1.5×, retaining the accepted 96-unit padded frame, 84-unit ground offset and approximately 60-unit standing body. Both eyes remain in front-facing open-eye frames; the supplied short blink remains. Nearest filtering and rounded world positions remain. Original hand centres are converted/rounded for the current scale; carried tools and baked-action spout offsets retain their physical alignment. Native downsampling is removed; source images and gameplay/save behavior remain.

Checks: 320 tests and production build pass. Native audit confirms 168 original cells byte for byte and both eye pixels in front idle phases 0, 1 and 3. Desktop/phone visual inspection shows both eyes at unchanged stature. Browser checks pass at 1280×720 and 390×844 for all four run directions, all five work/combat phases, real action outcomes, no duplicate tools, pause/resume, jump, other looks and coin/save reload. Additional title/choice/gameplay pass at 1440×900, 1024×768 and 844×390, with English/Myanmar, same-origin requests and no browser errors. [Verification](verification/farmer-eyes/README.md).

[Local preview](http://127.0.0.1:4205/) — refresh to load the original pixels at the smaller display size. Fractional nearest display scaling can make source pixels appear with unequal screen widths, but preserves the face at the tested views; a purpose-drawn target-resolution version is the longer-term alternative. Physical devices/non-Chromium and human motion acceptance remain unverified. No new art generation, publication or push.

---

# v0.26.1 — smaller male farmer (2026-10-14)

The accepted male farmer is reduced by 25% to match the existing girl/environment scale. All 168 complete padded poses use one fixed 0.75 nearest-neighbour transform: 64×64 source → 48×48 runtime, ground (24,42), integer 2× display. Front/side idle body is 30 native pixels / 60 world units; back is 31 pixels. Original pack/source sheets are unchanged, palette and binary alpha are retained, and exact idle/run/work timings remain. Hand coordinates are re-extracted from the adapted frames; built-in watering-spout offsets follow the same reduction. Carried axe/shovel/can remain separate during idle/running; existing combined work poses retain their tools and suppress the separate drawing. Girl, paid looks, NPCs, world, camera, collision, speed, gameplay timing and schema-19 progress remain.

Checks: 320 tests pass, production build passes. Native audit confirms every runtime cell equals its original whole frame resized with the documented transform, source hashes remain unchanged, and all 16 other tracked art/font/JSON files are identical. The same 46-file build excludes source/archive assets. Native keyboard and touch-browser checks pass at 1280×720 and 390×844 for all four run directions, every work/combat phase, duplicate-tool suppression, real action outcomes, pause/resume, jump, girl/paid looks and saved coins/reload. Additional title/choice/gameplay checks pass at 1440×900, 1024×768 and 844×390; English/Myanmar, no browser errors, same-origin requests. [Verification](verification/farmer-scale/README.md).

[Local game](http://127.0.0.1:4205/) — refresh to load the smaller texture. No publication or push. Generated pose variation and existing combined tool designs remain. Physical devices/non-Chromium remain unverified. No new art generation or conversion to modular tool-use layers was requested/performed.

---

# v0.26.0 — revised male farmer integrated (2026-10-14)

The supplied farmer-boy-revised-v2.zip is now playable locally through Play as Boy or the existing free Worker outfit / Classic look. All 168 native frames are preserved: four idle phases, eight running phases and six phases each for harvesting, digging, tree chopping, watering and existing-axe animal attack, in four directions. Native 64×64 cells, ground(32,56), nearest filtering and integer 2×world scale preserve the approved proportions/pixels; standing body is about 80 world units. Running retains the supplied approximately 12 fps timing; idle retains its long holds/blink. World and title/selection/wardrobe share the new rig. Work poses contain their tools and hide the separate utility drawing. Work cancels when moving/changing tools/jumping; animation time pauses with gameplay. Girl/other outfits/NPC pixels, existing speeds/collision bodies, crops, damage/rewards/cooldowns and schema 19 saves remain.

Checks: 320 tests pass, production build passes, all 168runtimeRGBAcells equal supplied native cells. Sixteen other tracked runtime pixel/font/JSON files remain byte-identical; the unchanged 46-file runtime allowlist excludes raw sources/ZIPs. Desktop 1280×720 and phone 390×844 verify all four running directions/all five work-combat clips, exact phase counts, no duplicate tools, successful gameplay outcomes, pause/resume, jump, girl/paid-look rigs and reload. Title/selection/gameplay checked additionally at 1440×900, 1024×768 and 844×390; English/Myanmar canvas UI and same-origin asset requests pass with no browser errors. [Verification](verification/farmer-boy-runtime/README.md), [source record](assets/licenses/farmer-boy-revised-v2/SOURCE_RECORD.md).

[Local preview](http://127.0.0.1:4205/) while its server runs. No publish, push or organizer submission. Existing tool-action gameplay mutations retain their preceding timing; this import adds visual cycles rather than changing rewards or delaying gameplay. Jump is adapted from supplied run poses, not an authored jump clip. Copper Can retains its gameplay coverage/effects but the supplied watering animation contains one can design. Generated per-frame shape variation remains. Physical phones/non-Chromium browsers and final human animation acceptance remain unverified.

---

# Revised farmer v2 · approved sprite delivery — 2026-10-14

Delivery checks:318/318tests and production build pass; all225tracked runtime/config files unchanged. Browser preview/comparison and ZIP download pass; downloaded ZIP matches the audited archive.

User accepted the revised Plant Tales-inspired original farmer appearance and requested all sprites. Completed output/art/farmer-boy-revised-v2.zip with168 native64×64 frames, seven sheets, four directions, idle4/run8/work6 poses,28clips in animations.json,48exact48×48idle/run crops, source PNGs, prompts, previews and import notes. All seven actions use the revised identity; about40pixels of standing body height, shared32-colour palette, binary alpha and ground anchor(32,56). West running mirrors the authored east sequence. The interactive reviewer now carries its own previous-version comparison images. [Source record](assets/licenses/farmer-boy-revised-v2/SOURCE_RECORD.md); [verification and limitations](verification/farmer-boy-revised-v2/README.md).

Native audit verifies frame/sheet equality, dimensions, palette, alpha, edge clearance, crop equality, source hashes, clip indices/timing and archive integrity. Engine-specific collision bodies, movement speed and tool-contact events still need integration by the receiving game. Existing src/public/gameplay/local saves, package version, dependencies and runtime asset allowlist remain unchanged. Earlier exports and other uncommitted work are preserved. No push or publication.

---

# Approved farmer full animation review — 2026-10-14

Completed the user's approved-farmer follow-up and selected full set:156 native48×48 transparent frames across idle, eight-phase running and six-phase harvesting/digging/chopping/watering/existing-axe attack, in four directions. All four idles are30pixels tall; the approved south idle PNG is byte-identical. Seven sheets/GIFs, contacts, original sources, prompts, manifest, local review and ZIP are under output/art/farmer-boy-approved-v1. [Review](http://127.0.0.1:4203/farmer-boy-approved-v1/) while its server runs; [source record](assets/licenses/farmer-boy-approved-v1/SOURCE_RECORD.md), [checks](verification/farmer-boy-approved/README.md).

318tests pass; production build passes. Native frame/source audits and isolated desktop/phone-size Chrome checks pass, covering every phase, pause/resume/speed and overflow/errors. The review's initial negative frame delta was corrected. Native extraction separates complete source silhouettes; west attack is a disclosed mirror of east. Generated head/body clusters, tool details and transition rhythm remain appearance/motion review points, and gameplay hand/contact integration is pending. Runtime src/public/art, local saves, game version0.25.0 and production allowlist remain. Prior uncommitted farmer-boy-actions-v1 work is preserved. No new runtime dependency, other weapon, jump cycle, backend, source push, publication or competition submission.

---

# Farmer boy full action export — 2026-10-13

Completed the user's boy-first imagegen request as a project-local review pack: four-direction idle, eight-frame running and six-frame harvesting, digging, chopping, watering and existing-axe attack. 156 native48×48 transparent frames, exact30-pixel visible idles, seven sheets, GIFs, source PNGs, prompts, metadata and ZIP are in output/art/farmer-boy-actions-v1. [Preview](http://127.0.0.1:4202/farmer-boy-actions-v1/) while the local server runs. [Source/provenance](assets/licenses/farmer-boy-actions-v1/SOURCE_RECORD.md), [verification](verification/farmer-boy-actions/README.md).

318 tests and production build pass; native export/source/ZIP audit passes; desktop/phone Chrome review checks cover every action phase and pause/resume/speed. Existing runtime art and v0.25.0 game behavior remain. Generated tool geometry and body/head pixel clusters vary slightly between actions and need polishing plus hand/event alignment before game integration. No new girl generation, runtime replacement, public deployment, push or competition submission in this asset-only request.

---

# v0.25.0 — farmer girl integrated locally (2026-10-13)

The generated brown-ponytail girl is now the free Garden/Autumn starter look, shown in title, girl selection, wardrobe and gameplay. Four directional idles and eight running frames per direction use the shared 48×48 padded FARMER rig at 16 fps and integer 2× world scale; front idle ink height is 30 pixels. Native alpha/palette conversion, source poses and exact prompt are disclosed. Each frame's actual hand pixels drive held tools. Jump uses passing run poses with the existing arc. Other looks, approved male, NPCs, physics, prices/ownership and schema-19 progress remain.

318 tests and production build pass. Girl keyboard/touch motion passes both English desktop and Myanmar landscape, observing all eight phases and source hand/tool alignment. Three appearance profiles pass purchases, girl selection, previews, orientation and reload; three depth profiles pass indoors, occlusion, crops, bridges, jumps, water/reflections and saves. Native audit verifies 48 cells, 32 unique run poses, binary alpha, 32-colour palette and unchanged male/NPC assets. Runtime remains 46 files / 12,222,179 bytes / 27 WAVs, with raw source/export/evidence excluded. [Verification](verification/farmer-girl/README.md).

Local preview: http://127.0.0.1:4201/ while running. Public v0.24.0 remains the previously published build; no new deployment or source push. Physical devices, Safari/Firefox and human animation/artwork acceptance remain unverified. A separately authored jump/tool animation was not generated. Current exports are under output/art/farmer-girl-v1.zip and related PNG/GIF files.

---

# Farmer girl idle design candidate — 2026-10-13

Generated the requested single south-facing female farmer idle design with brown ponytail, tan skin, ivory sleeves, olive overalls and boots. Selected large RGBA PNG, prompt set and validation record are under output/art/farmer-girl-idle-v1*. Original generated bytes/alpha are preserved. This is a design candidate, not yet a native 32x32 sprite: pixel-grid cleanup, scale matching, other directions and running animation remain. Runtime character selection, existing sprites and the published v0.24.0 game remain unchanged.

Checks: all 317 tests pass; production build passes. The preview and prompt/metadata files are excluded from dist. Browser interaction checks are not applicable to this art-only candidate because runtime code and assets were not changed.

---

# v0.24.0 — approved PixelLab farmer (2026-10-13)

The user-approved PixelLab farmer replaces the existing free Worker outfit / Classic look. All four native running directions use eight unique exported frames at 16 fps. Original RGBA pixels and slim proportions remain unchanged, rendered at integer 2× with nearest filtering. Static idle frames are padded into the larger 48×48 run canvas; shared ground row 40 keeps feet, shadows, tools and shallow-water cropping aligned. Title, character choice and wardrobe previews show the same approved farmer.

Other complete looks and all eight town NPCs retain the existing Szadiart artwork and motion. Appearance IDs, prices, ownership, schema-19 saves, controls and movement speed remain. Jump uses genuine passing run poses with the existing arc; no authored jump/tool cycle was supplied. Source records disclose user-generated PixelLab AI art and public output-use terms. Runtime allowlist stays unchanged; no remote assets/services or source archives ship.

317 tests and both 152-module normal/explicit playtest builds pass. Native audit verifies 41 source hashes, 48 byte-exact cells, 32 original run frames and 48 skin-pixel tool grips. Other looks, girl and NPC assets match v0.23.0 byte-for-byte. Three appearance profiles, two keyboard/touch motion profiles and three depth profiles pass with clean consoles. Runtime allowlist stays 46 files / 12,199,891 bytes / 27 unchanged WAVs; dependency notices and archive exclusion pass. See [verification](verification/pixellab-farmer/README.md). Physical phones/Safari and human artwork acceptance remain unverified.

Published READY dpl_7KpeRdwfQmMdWWAy2VUdS8HBXwj4 from source f93b48d to https://simple-life-playtest.vercel.app/. Protected HTML/application/farmer texture and public HTML/all 46 runtime files match the tested stage. Two fresh public profiles pass start, gear, Jump, Save/Continue and audio; two live movement profiles observe all eight running phases with native hand/tool alignment and clean consoles. Deployment error query found no logs. Initial upload authorization failure resolved by the explicit verified team ID. No source push or competition submission.

---

# v0.23.0 — original Szadiart people (2026-10-13)

Player and eight town NPCs now use original Szadiart 3 Direction NPC Characters artwork. Native proportions, faces, colours and all opaque source pixels are preserved. Only baked alpha-77 ground shadows are removed; a fixed 24×40 crop and mirrored side view support the existing four directions. World scale is integer 2× with nearest filtering. Players use four authored idle poses at 6 fps and four walk poses at 10 fps; NPCs use four walk slots at the existing 120 ms cadence. Movement speed and controls remain. The pack has no authored running, jumping or tool-action animations; existing jump/tool effects use unchanged source poses and world motion.

Five outfits and four complete looks replace independently layered hair/clothes. Original complete source presets are never redrawn or recoloured. The wardrobe and Town stylist menus describe Outfits / Looks; their English/Myanmar text remains localized. Existing appearance IDs, purchase prices, ownership, balance and schema-19 saves remain, so a saved appearance maps to its corresponding complete preset. The default brown-haired teal worker differs from the town cast. Depth, grounded shadows, collision footprints and water/reflection integration remain.

317 tests and both 151-module normal/explicit playtest builds pass. Three appearance profiles (English desktop, Myanmar landscape and Myanmar portrait WebGL) pass purchases, complete preset selection, four facings, tools, jumping, rotation and reload. Two motion profiles pass all 112 native direction cycles and actual keyboard/touch/NPC movement. Three depth profiles pass indoors, occlusion, crops, bridges, shadows, water/reflections and save reload. Browser consoles are clean. Runtime audit: 46 files / 12,190,638 bytes / 27 unchanged WAVs, source archives excluded and dependency notices verified.

Native asset audit verifies 1,120 cells / 384,711 opaque source pixels, 960 skin-pixel tool grips and all 698 unchanged nonperson town cells. Browser and publication checks are recorded in [verification](verification/szadiart-people/README.md). Physical phones/Safari and human artwork acceptance remain unverified.

Published READY dpl_9ZWASx5s2seBpijuWaneZ9yiATni from source 2f4173e to https://simple-life-playtest.vercel.app/. Protected HTML/application/character texture and public HTML/all 46 runtime files match the tested stage. Public fresh desktop/phone-sized flows pass gear, Jump and Save/Continue; two live motion profiles observe all four walk slots and clean consoles. Deployment error query found no logs. No source push or competition submission. Physical phones/Safari and human visual acceptance remain unverified.

---

# v0.22.1 — human proportions and clearer character artwork (2026-10-13)

Revised player and all eight NPC designs after the user accepted movement but rejected the squat appearance. Smaller original pixel heads have warm faces, small dark eyes and asymmetric hair; longer torso/legs and defined ivory sleeves, overall straps, vest/jacket seams, dress hems and boots make people easier to read. Every CraftPix source body pose uses the same fixed vertical row mapping (1.8 offline), with no independent limb displacement or invented gait. Run remains eight phases at 12 fps, NPC walking six phases at 8.33 fps, and idle retains its supplied phase counts. Native 24×36 cells render at integer 2× world scale; standing boy ink is 62 world pixels instead of 66. Source-derived tool grips use native pixel centres. Appearance IDs, prices, saved ownership, schema 19, movement speed, collision footprints, shadows and depth remain.

317 tests and both 151-module normal/explicit playtest builds pass. Three appearance profiles (English desktop, Myanmar landscape and portrait WebGL) pass purchases, free owned clothing, haircuts, four facings, held tools, jumping, rotation and save reload. Two motion profiles pass all 112 style/NPC direction cycles and actual keyboard/touch input; three depth profiles pass indoors, trees, crops, bridges, water/reflections and save reload. All browser consoles are clean. The asset audit verifies 2,144 cells / 388,519 mapped body pixels and preserves all 698 nonperson town cells. Runtime: 46 files / 12,269,907 bytes / 27 unchanged WAVs, with notices and allowlist verified. Published READY dpl_BJfoFNobXrMM1GRyuCod8VkEQPVn from source 21e79cd to https://simple-life-playtest.vercel.app/. Protected HTML/application/character texture and public HTML/all 46 runtime files match the tested stage. Public fresh desktop/phone-sized flows pass gear, Jump and Save/Continue; two live motion profiles observe all eight run and six walk phases with clean consoles. Deployment error query found no logs. No source push or competition submission. Physical phones/Safari and human artwork acceptance remain unverified.

---

# v0.22.0 — native run and walk animations (2026-10-13)

Player movement uses the complete eight-pose CraftPix unarmed run cycle at 12 fps. NPCs keep the six-pose walk cycle at 8.33 fps. Idle uses all twelve supplied front/side poses and four back poses at 8 fps. The previous cut-and-warp animation is retired. Clothing and hair are drawn on the original poses; arms, feet and head positions are never mechanically deformed. Native 24×26 frames render at integer 3× world scale (66-pixel standing ink height, 78-pixel padded cell). All 20 outfit/hair combinations and eight town variants retain their identities, prices and schema-19 appearance saves. Jump selects three tucked poses from the actual run sheet; it is an adaptation, not a supplied jump animation.

317 tests and both 151-module normal/explicit playtest builds pass. Three final appearance profiles (English desktop, Myanmar landscape, Myanmar portrait WebGL) pass purchases, free owned outfits, four facings, held tools, jumping, rotation and saved appearance. Two motion profiles verify all 20 styles/eight NPC variants, eight distinct run poses, six distinct walk poses and actual keyboard/touch movement with clean consoles. Three depth profiles pass house entry, trees/crops/bridges, grounded jump shadows, water/reflection and save reload. Source audit preserves every anatomy pixel across 2,144 people cells and all 698 other town cells. Runtime: 46 files, 12,288,192 bytes, 27 WAVs; no source archives/unused packs. Published READY dpl_CEyRycmZsLp4No1q8xGGP8MqWNuy (source 7ef1e0b) to https://simple-life-playtest.vercel.app/. Protected HTML/application/appearance and public HTML/all 46 runtime files match the tested stage. Public desktop/phone startup, audio, gear, Jump and Save/Continue pass; live English desktop/Myanmar phone checks observe all eight run and six walk poses, with clean consoles. Static deployment error query found no logs. Release evidence: verification/craftpix-motion/release.json, hosted-checks.json and public-motion-checks.json. Physical phones/Safari and human visual acceptance remain unverified. No source push or competition submission.

---

# v0.21.3 — joined walking sprites and slimmer characters (2026-10-13)

The passing torso previously rose one pixel above the legs, exposing a transparent waist row. The animation now overlaps two native hip rows and restores the side garment behind moving forearms. Softer knee lift and closer foot placement reduce the exaggerated gait; the added dark far-leg tint is removed. Native artwork is about 10% narrower, with unchanged 40×72 cells, 64-pixel standing height and integer 1× world scale.

317 tests and normal/explicit playtest builds pass. Three local style profiles pass purchases, four facings, rotation, held tools and saved appearance. Two native motion profiles (English desktop and Burmese phone landscape) pass: all 20 styles and eight town variants have four distinct arm/foot poses, no transparent central waist pixels and one connected silhouette in each standing/walking frame. Actual keyboard/touch movement and town walking cycle all four frames with clean consoles. Three depth profiles pass house, trees, crops, bridges, jump/shadow, water/reflection and saves with clean consoles. Published READY dpl_B5RBrpnB1Cjyo2jpMVcmE9CaKhyN, source 8f2c36d, to https://simple-life-playtest.vercel.app/. The protected application, public HTML and all 46 public runtime files match the tested stage. Fresh public desktop/phone startup, audio, gear, Jump and Save/Continue pass; public English desktop/Burmese phone motion and waist/silhouette checks pass with clean consoles. Static error query found no logs. Runtime 46 files / 12,626,804 bytes / 27 WAVs, all 698 non-person cells preserved. Evidence: release.json, asset-audit.json, public-root.json, hosted-checks.json and public-motion-checks.json. Physical-phone/Safari comfort and human art acceptance remain checks. No source push or competition submission.

---

# v0.21.2 — smaller characters and active limbs (2026-10-13)

Characters now use 40×72 native cells at integer 1× world scale, with a 64-pixel visible height instead of 76 (about 16% smaller). A stable 32-colour identity palette simplifies shading; the far leg receives a small additional shade. Faces, hair, clothes and boots retain the approved source art. Four walking poses use contact/passing steps, opposing arms, bent recovering knees and a one-pixel passing bob. Both player and NPC sprites share the poses; held tools follow the animated grip. Standing, jump, feet anchors, depth and local appearance/saves remain.

317 tests and both 150-module builds pass. Four style profiles and three depth profiles pass. Final English desktop/Burmese mobile native motion checks pass: every style/NPC has distinct arm/foot pixels, all four player walk frames appear, stopped player uses standing, and a moving town resident cycles all four poses. Consoles are clean. Runtime 46 files / 12,678,948 bytes / 27 WAVs; all 698 non-person cells preserved. Evidence: verification/character-motion. Published READY dpl_EzqtBYorjEp3EnWDpZzyBCdKojsv, source d3d0c7f, to https://simple-life-playtest.vercel.app/. Protected application/public HTML and all 46 public files match. Fresh public desktop/phone startup/audio/gear/Jump/Save/Continue and public English desktop/Burmese mobile arm/foot/player/NPC motion checks pass with clean consoles. Static error query found no logs. No source push or competition submission. Physical phones/Safari comfort and native-speaker review remain human checks.

---

# v0.21.1 — approved character correction (2026-10-13)

Active people now use original OpenAI-generated artwork based on the user-approved guide, packed into 48×80 nearest-filtered native sprites. Fuller hair, visible eyes, layered clothing and boots replace the rejected thin 24×40 adaptations. Player world scale 1× retains approximate previous physical height. Five outfits/four hairs and eight town variants retain frame indexes, schema-19 saves, paid clothing/barber services and free owned outfits. The cave remains postponed and NPC curfew remains 19:00.

316 unit tests and both 150-module builds pass. Four local desktop/phone style profiles and three depth profiles pass with clean consoles. Published READY dpl_H2fDuqmGSdsY8sN9ygEYBA3tuEn7, source 5b9038a, on https://simple-life-playtest.vercel.app/. Protected application/public HTML and all 46 public runtime files match the tested stage. Fresh public desktop/phone startup, audio, gear, Jump and Save/Continue pass. Public English desktop/Burmese landscape outfit/hair purchases, four facings, reload, free owned outfits, rotation and fresh Girl startup pass with clean consoles. Static error query found no logs. Runtime 46 files / 13,007,818 bytes / 27 WAVs; all 698 non-person atlas cells preserved. Source art/prompts: assets/licenses/characters-v2/SOURCE_RECORD.md. Evidence: verification/character-fix/README.md. Physical phones/Safari, native-speaker review and long-term cosmetic pricing remain human checks. No source push or competition submission.

---

# v0.21.0 — taller people and town appearance services (2026-10-13)

Implemented user-authorized taller 24×40 CC0-derived player/NPC sprites, five outfit/four haircut combinations, paid town stylists, free owned-clothing changes through Home & garden → Wardrobe, English/Myanmar responsive previews and schema-19 saves/migrations. Existing depth, grounded tools/jump/water, silent doors, 19:00 curfew and postponed cave remain. Nell/Sol use their existing work locations/homes; purchases require coins, proximity, service hours and the stylist still being at work.

316 tests and the normal build pass. Six initial desktop/phone profiles passed purchases/save/rotation; three depth profiles pass house, trees, crops, bridges, water/reflection and saves. Final six-profile enlarged-preview/text-bound/four-direction/fresh-girl checks pass with clean consoles. The exact staged playtest also passes fresh desktop/phone gameplay, audio, save/Continue and all 46 runtime hashes. Published READY dpl_F6rmbXePZXuyRzHqZxRdaPHENrur, source 6668138, to https://simple-life-playtest.vercel.app/. Protected staged bundle/public HTML and all 46 public runtime hashes match. Fresh public desktop/phone startup, audio, gear, Jump, Save/Continue and English desktop/Burmese landscape style/rotation/fresh-Girl cases pass with no browser warnings/errors. Static error query found no logs. No source push or competition submission. Physical phones, other engines, native-speaker phrasing and long-term prices remain human checks. Character source/AI guide record: assets/licenses/characters/SOURCE_RECORD.md. Final evidence: verification/appearance/README.md.

---

# v0.20.2 — user-selected 2.5D depth refinement (2026-10-13)

Preserve the current three-quarter view and native assets; improve ground shadows for the player/residents/wildlife, ground-vs-jump separation, plant feet sorting, raised bridge rail layers and full-height tree occlusion. Water reflection/wading remains. Maps, geometry/collision, camera framing, farming/economy/story/audio/saves and silent doors are unchanged. The cursed cave remains removed; NPCs still return at 19:00. Original generated graphics and AI assistance are documented without new runtime assets/dependencies.

310 tests and both 145-module builds pass. Three desktop/touch Canvas/WebGL profiles pass shadows/jump, tree/crop depth, City and horizontal Forest bridges, wading/reflection including paused-water shadow, native movement and Save/reload/Continue, with clean consoles. Runtime audit passes: 45 files / 12,012,852 bytes / 27 WAVs / all 43 retained assets byte-identical. Final Burmese phone house-entry/interior-shadow and upright plant checks pass. Published on https://simple-life-playtest.vercel.app/ — READY dpl_5BeLeEWrW2jwwVrzWrpvy9nuAE35, source 4546bb3. Staged application/public HTML and all 45 public runtime file hashes match the tested build. Fresh public Mac/phone gameplay and Continue pass. Published English desktop/Burmese phone depth cases pass, including native joystick movement, house entry, plants, both bridge axes, shadow/reflection and saves, with empty browser warnings/errors. Physical phones, other engines and sustained performance remain human checks. Static error-log query found no logs. Evidence/limits: verification/pseudo-depth/README.md. No source push or competition submission.

---

# v0.20.1 — cursed cave postponed at user request (2026-10-13)

Removed the sealed/cursed cave, ghosts, warning, repair/contribution quest, map marker and Curse Breaker achievement. Removed the specific cave collider; previously removed skull objects stay absent. The separately requested 19:00 NPC/merchant schedule remains. Existing save normalization ignores retired curse data and preserves current wallet, inventory, crops, farms, home, story and Forest progress. Existing outdoor Stash Bags remain recoverable. Prior implementation and asset provenance remain in local Git/history for a later request.

Checks so far: 306 tests pass, normal and explicit playtest builds pass (143 modules), runtime allowlist audit passes (45 files / 12,010,253 bytes / 27 unchanged WAVs / 43 retained files identical). Four desktop/touch Canvas/WebGL profiles pass legacy save/nighttime/recovery/cave/menu/reload/curfew/house checks in English and Burmese, with clean consoles. Evidence: verification/curse-removal/README.md. Physical phones and other engines remain unverified. Published and verified on https://simple-life-playtest.vercel.app/ (READY dpl_G6zHvPZahQKWaQTkLncsxUZYM165, source 78e16ca). Exact staged bundle/public HTML and all 45 public file hashes match the tested artifact. Fresh public desktop/phone gameplay and Continue pass, as do public English desktop/Burmese landscape old-curse save, night, recovery, cleared cave, menu, curfew and house-entry checks. No browser errors/warnings; static runtime log query found no logs. Release/evidence: verification/curse-removal/release.json and README.md. No source push or competition submission.

---

# v0.20.0 — user-authorized cursed cave (2026-10-12)

Replaced both rendered Dark Forest skull caves with one original sealed stone arch at the eastern clearing. A native cave image accompanies paged English/Myanmar information, an explicit pictured warning and a guarded Break seal choice. Visiting, inspecting, swinging and canceling are harmless. The final warning repeats that breaking releases the curse; every warning page precedes confirmation, and viewport/language changes reset reading. The Forest map marks its location. Pause > Cursed cave provides remote information and repair progress; contributions require proximity to the entrance.

Break once for up to 200c, then at most three spirits pursue outdoors from 19:00 to 06:00. Existing Axe hits and combat invulnerability apply; no ghost loot is granted. Telegraphs precede arrival/attacks, colliders block motion and hits, and each defeated spirit returns after five active seconds with a fresh arrival warning. Menus/hidden tabs stop simulation; midnight retains the same night. The interior is safe, dawn clears spirits, and staged 600c/48 Wood/32 Stone/20 Meat contributions save atomically. Full repairs permanently end the curse and persist Curse Breaker through the restored quest record. Meat is explicitly an offering. The daytime cache/cost and limit keep this optional challenge finite and reversible through rebuilding.

The exact Home doorway approach takes priority over a point-blank spirit even with the Axe equipped, preserving one-tap escape. This was reproduced during final review and covered by a regression/native-entry fixture.

NPCs and all merchants commute to their actual doors by 19:00; shop hours now read 07:00–19:00. General 20:00 night/sleep thresholds, existing animals, farming, five Journal chapters, equipment, local saves and once-per-save playtest credit are retained. New outdoor ghost defeats retain 25% coin loss and recoverable bags at Home/Farm/City as well as Forest, including the correct farm domain. Additive schema-18 validation defaults old saves to sealed, clamps repair/ghost records, and safely moves saves inside the new collider. No new weapon, dependency, external/runtime image, backend or remote save.

312 tests and both 148-module builds pass. Sixteen pictured warning/repair/achievement cases, four native combat/home/NPC cases, two final phone combat/restoration cases, two rotation/remote-progress cases, three startup/pause/language/save cases and two farming/all-five-Journal cases pass. The exact runtime-only playtest has 45 files / 12,030,831 bytes / 27 approved WAVs; all 43 retained assets are byte-identical to the previous release. Published READY **dpl_6vYE8qSFAUogVEKqSxT7raRQptad**, source **0125255**, to the existing [public playtest](https://simple-life-playtest.vercel.app/). Protected final bundle and public HTML match the tested stage; all 45 public runtime hashes match. Two final fresh desktop/phone cases and two final phone combat/point-blank-house/NPC/restoration cases pass. Two public Burmese warning/repair/achievement cases also passed before the isolated doorway correction, with identical CavePanel code. Public 200/no login, noindex and deployment protection remain. No source push, backend, new service or organizer submission. Evidence: [verification](verification/cursed-cave/README.md). Phone/Safari touch comfort, native-speaker phrasing and long-term difficulty remain human review.

---

# v0.19.3 — clock alignment (2026-10-12)

The smaller Burmese font still used the earlier fixed clock offsets: time touched the upper edge and coins touched their panel's top edge. Hud now vertically centers measured padded time/day bounds as one block with two logical pixels of leading, and independently centers the coin row. Positions remain whole logical pixels; existing panel sizes, fonts, glyph shaping and gameplay remain. English uses the same measured alignment.

302 tests and normal/explicit-playtest 143-module builds pass. The runtime-only playtest has 45 files / 12,009,545 bytes / 27 unchanged approved WAVs; every non-entry/non-application asset is byte-identical to v0.19.2. 32 measured clock checks, two affected Burmese farming/Journal cases, eight public clock checks and two fresh public startup/save/control cases pass. All 45 public hashes match. Published READY **dpl_AawcNLEHbtrXJ9Vabargp4hsur3D**, source **6a89eeb**, to the existing [playtest](https://simple-life-playtest.vercel.app/), with public 200/no login and unchanged protection/noindex. Browser and release evidence: [clock alignment](verification/clock-alignment/README.md). Physical-phone/Safari appearance remains human review. The user's cursed-cave concept is discussed as a possible optional challenge; no curse, enemy, resource cost, achievement or save change is implemented in this fix.

---

# v0.19.2 — City sign arrow and alignment repair (2026-10-12)

The user reports City pointing down and poorly aligned Burmese signs. Replaced the erroneous direction || 2 fallback with direction ?? 2, preserving right (0), and centered boards/text/arrows on the original Farm/Road post anchors. Even native board widths prevent half-pixel post geometry; text moves down four world pixels for top-bevel breathing room while staying separate from the arrow row. No gameplay/save/collision/font/asset/audio changes. 302 tests and normal/explicit-playtest builds pass. 12 local sign-direction/alignment cases and four rendered-arrow pixel cases pass. Published READY dpl_G6PfY3JjWRrEQhfZt532R1jJcgzC (source b5507e4) to the same public playtest origin; exact staged bundle/public index verified. Four public Canvas/WebGL arrow-pixel cases and three public landscape world-alignment cases pass. Release evidence: verification/sign-alignment/README.md.

---

# v0.19.1 — Burmese readability and removed nature nameplates (2026-10-12)

User follow-up: remove animal/tree names; reduce Burmese font size; fix world-sign overflow and translate Seed Aid. Removed hostile and woodland nameplate objects while preserving health bars and attack warning. Tree meter displays only n/3 and the existing Wood reward. Burmese UI uses 8px body / 12px headings / 24px large headings, world text 7/8px, integer scale/resolution with unchanged local Noto shaping/nearest sampling. Burmese signs measure shaped text and reserve a separate direction-arrow row. Oversized words wrap at Unicode grapheme boundaries. Standalone Seed Aid maps to မျိုးစေ့အကူအညီ. No save/economy/audio/asset/dependency change.

The user's question about levels/achievements is advisory. Existing five story chapters and recorded milestones provide the best foundation for progression and optional badges; no XP/achievement system is added in this repair. Reviewed supplied judging reference and official https://digit7s.com/game-jam : engagement, clear progression, replay value and polish matter; neither provides guaranteed points for adding a feature name.

302 tests and both builds pass. Local browser checks pass for 16 startup/language/save cases, 20 Burmese resource pages, 24 world-label cases, four focused short-landscape trading cases and two exact-playtest fresh starts. Published READY dpl_9XUS34MWsb2F89voeHzX1P4gdXRR (source a35fca7) on the existing https://simple-life-playtest.vercel.app/ : plain HTTP 200, all 45 runtime hashes match, two fresh public starts and two Burmese startup/language/save cases pass. Six public portrait/landscape world-label cases also pass. Full release record: verification/myanmar-world-labels/README.md. Physical-phone/Safari rendering and native-speaker acceptance remain human review.

---

# v0.19.0 — user-requested Myanmar language and onboarding (2026-10-12)

Implemented English / မြန်မာ selection on cold startup, title/pause switching and a separate validated local language preference. Local dictionaries cover the main gameplay/menu/dialogue/Journal/feedback/asset-credit paths; IDs, catalogue values, system return strings and schema 18 remain unchanged. Bundled Noto Sans Myanmar UI 2.103 renders complete Unicode runs through Phaser Text; native Latin bitmap fonts remain for English and pure numeric controls. Font failure disables the Myanmar option and preserves English startup; an eight-second timeout prevents an indefinitely blocked boot.

A four-card guide now follows the introduction (including Skip), explains the overall Keepsake goal and farming/controls, and directs the player to three free Tomato seeds and the south Farm route. Title Controls replays it. A first-job reminder follows actual starter/plant/water flags. Menus pause gameplay; reading does not grant rewards or modify balance. The recovery-aid sentence now correctly says once-daily watering; the irrigation sign correctly states three watered Tomato nights and growth pausing after a missed day.

Myanmar-specific measured layouts cover Bag, shops/details, resources/recipes/projects/decor, Journal, map, HUD and crop status. Long copy is available through pages or a details button on the shortest landscape. Credits preserve creator/font/product names and provide the new OFL source links. Art/audio/silent doors, camera, economy and gameplay are preserved. 301 tests, both 143-module builds and the allowlist audit pass (45 files / 12,008,116 bytes / 27 approved WAVs / preserved prior art/fonts / complete notices). Checks and release evidence: [verification](verification/myanmar-onboarding/README.md). Physical phones, Safari/WebKit and native-speaker phrasing acceptance remain human checks.

Published READY **dpl_2GEokkKhHHqvHHMx496oQjoKBBG2**, source **c41d57e**, on the existing [public playtest](https://simple-life-playtest.vercel.app/). Public 200/no login, preserved protection/noindex, and all 45 file hashes verified. Fresh English desktop/phone (two), Myanmar portrait/landscape startup/save in both renderers (four), landscape crop-state/Journal/control cases (eight) and complete landscape Buy Seeds/Market transaction cases (two) pass. Stable save origin and once-per-save test gift remain. No Git push, new paid resource/backend or user-profile save editing. Local previews serve the latest normal build.

---

# v0.18.6 — silent doors and requested playtest deployment (2026-10-12)

House exit now follows entry's silent travel behavior. The door event is removed from the shared playback/preload/production allowlist, excluding its unused WAV while retaining source/licence evidence. The new regression verifies no fallback, queue, load or voice for the retired event while approved actions remain audible. No camera, gameplay, economy, save or UI-layout changes in this follow-up.

The user explicitly authorizes deploying the accumulated local changes to the existing free Vercel Simple Life playtest. This supersedes the prior task's no-deployment instruction for that update. The target project/team/protection are verified through the existing CLI login; runtime-only static playtest output is prepared separately. Normal build retains 60 coins; hosted playtest preserves its established once-per-save +100,000c gift. No push, new service/backend, unrelated resource or user-save editing.

296 tests and both 137-module builds pass. Audit: 43 runtime files / 11,712,035 bytes, 27 approved WAVs, unchanged art/fonts and full notices. Native exit/re-entry/save and fresh hosted-build checks use disposable Chrome desktop/touch contexts. Final release evidence and device limits: [silent doors verification](verification/silent-doors/README.md).

Published **READY dpl_DM5fxxja4RkwSqMgP2Troo3GppU3**, source checkpoint **3a4bb0e**, to **[Simple Life](https://simple-life-playtest.vercel.app/)**. Public 200 without login, preserved noindex/protection, all 43 runtime hashes verified. Public fresh desktop/phone **two cases**, silent house desktop/portrait/landscape **three cases**, and responsive landscape buy/sell **two cases** pass, including Save/Continue, native controls and transactions. Local silent-house **eight cases** pass across both renderers. No Git push; original save origin remains. Physical-phone/Safari touch comfort and subjective acceptance remain user checks.

---

# v0.18.5 — silent house entry, responsive mobile trading and icon controls (2026-10-12)

Entering the house no longer requests an effect; the previous house-exit sound remains. Buy Seeds and Market keep headings, navigation, tabs, selected-item details, quantity choices and complete transaction quotes in separate bands. Short landscape uses two columns within safe margins. On the narrowest phones, the info button moves to the header and coins move above quantities; measured item/detail text remains at native font size. Sale feedback keeps the complete coin amount while dropping the optional HIGH-market suffix if it would exceed its row. Existing prices/catalogue/gates, transactions, paused shop time and save schema are preserved.

Jump/Use buttons have centered arrow/star icons and no visible captions. The Forest hotbar displays its existing folded-map glyph. Semantic control labels, actions and 56px touch targets remain. Requested Thaleah/m5x7 fonts, integer text scaling, nearest filtering, fullscreen separate canvas UI, camera, approved world art and gameplay scope remain.

Checks: **296 tests**, normal/playtest **137-module builds**, **28 main trade browser cases**, **four silent-entry typography cases** and **six icon cases** pass. **12 final-build narrow/landscape cases** pass as well, giving **32 distinct trade cases** including 320px phones. Evidence and check chronology are recorded in [mobile trade verification](verification/mobile-trade/README.md). Real native taps/clicks check all 12 seeds/24 sale items, details/page changes, 1/5/MAX/ALL quotes, exact stock/coin changes, paused time, rotation and Save/reload/Continue, with disposable saves only. Final runtime audit passes: **44 files / 11,746,118 bytes / 28 approved WAVs / eight unchanged previous art files / four unchanged approved font files / full notices**. No new asset/dependency/backend, user-save editing, push or deployment. Physical-phone Safari/WebKit appearance and touch comfort remain human checks.

Phone preview: **http://192.168.100.7:4198/**; Mac: **http://127.0.0.1:4196/**. Both return HTTP 200 and serve the rebuilt local dist. Refresh/Continue on the same Wi-Fi, with the Mac/server running.

---

# v0.18.4 — requested fonts, responsive panels and house entry (2026-10-12)

Replaced the UI's original customized lettering with actual creator-supplied Thaleah Fat headers/title/quest headings and m5x7 small text/counters/clock. Native 16px TTF glyphs are converted to monochrome bitmap PNG/XML, with unchanged silhouettes. Every UI text node uses 16/32/48 font sizes and integer ancestor scales; the clock's fractional parent scale is removed. Antialias and antialiasGL are explicitly false, pixelArt/roundPixels remain true, font textures and recoloured sheets use nearest filtering. Two logical pixels of extra leading produce 4 CSS pixels of row separation; button text gets 3 logical pixels/6 CSS pixels of internal side padding.

Home customization no longer draws its note across the fourth row. Resource panels reserve header/content/reward/action bands; the shortest landscape panels retain tab previews while omitting a redundant large preview and showing costs in two columns. Portrait previews leave more room for wrapped descriptions. Button labels, Bag counts, prompt height, compact crop care/status, help, credits, Journal and ending text accommodate the new font metrics. Long Journal hints and ending letter/statistics use next-page buttons rather than smaller text. Mobile Jump/Use are 56px to fit native captions and padding, while compact toolbar and joystick remain. Landscape mobile interiors use camera zoom 1 instead of .75, enlarging the room/actor by one-third; wider outdoor framing stays .75. Gameplay/collision/save/room sizing rules are preserved.

House entry queues the existing approved wooden-door-open sample while it loads, avoiding the synthetic fallback chirp. It plays at the recording's natural rate and a clearer effects gain. Outdoor location travel remains silent; interiors retain quiet ambience.

Checks: 295 tests, both 137-module builds, 30 typography browser cases and six supplementary credit/ending/high-stock phone cases pass; earlier eight fresh startup and 21 rotation/action/travel cases also pass. Final audit: 44 files / 11,745,847 bytes, four new verified font files, unchanged approved art/audio and full notices. Checks and limits: see [UI typography verification](verification/ui-typography/README.md). Native Chrome checks use isolated contexts and disposable fixtures; user's saves are untouched. Physical-phone comfort, Safari/WebKit and other engines remain human checks. The current local LAN URL is http://192.168.100.7:4198/; refresh/Continue on the same Wi-Fi. No push/deployment, new dependency/backend, remote runtime asset or change to established farming/Forest scope.

---

# v0.18.3 — user-requested smaller mobile HUD and wider camera (2026-10-12)

The supplied physical-phone screenshot confirms responsive landscape gameplay but shows oversized controls. Mobile vitals/clock now render at 75% of their prior dimensions, with shorter health/energy bars; toolbar/Jump/Use targets are 48 CSS pixels where space permits and stay at least 44 in verified layouts; joystick diameter is 96 instead of 120. Portrait toolbar and landscape reserved space/guide/crop-panel placement follow the smaller controls. The separate fullscreen canvas UI, menu sizes and original art remain.

Landscape compact phones use camera zoom **0.75 instead of 1**, showing **33⅓% more world width/height** at the same viewport. Short coarse-pointer landscape devices wider than 1000px also receive this framing. Desktop and portrait zoom values retain their existing behavior. Indoor/outdoor farmer scale remains matched, and room/collision/save logic is preserved.

Checks: **292 tests**, both **138-module builds**, **21 rotation/farming/menu/travel cases + eight fresh desktop/touch startup/save cases + four supplemental safe-area/house cases** pass in native Chrome. Supplementary cases use 844×335 with 59px side/21px bottom margins and coarse-pointer 1080×390 with 44px side/21px bottom margins, in Canvas/WebGL; native taps verify compact targets, camera coverage, house entry and indoor save/reload. Inspected desktop, portrait, landscape Farm/Home and indoor captures. Audit: **40 files / 11,719,637 bytes / 28 unchanged approved WAVs / eight unchanged art files / full notices**, clean whitespace. Evidence: [mobile proportions verification](verification/mobile-proportions/README.md).

Updated local LAN preview remains **http://192.168.100.7:4198/**, with Mac preview **http://127.0.0.1:4196/**. Refresh/Continue retains each origin's save. The supplied image verifies prior responsiveness on the user's phone; revised physical-phone appearance/comfort and other engines remain human checks. No deployment/push, new asset/dependency/backend or user-save editing.

---

# v0.18.2 — blank startup fixed and Wi-Fi preview ready (2026-10-12)

Reproduced the user's green screen in fresh native desktop Chrome: the v0.18.1 ready handler dereferenced `game.input.touch.onTouchCancel` when TouchManager was null, throwing before scenes started. A guard skips the touch-only wrapper when no touch target exists. The previous standard fresh checks preceded that last wrapper change; final touch-only rotation checks missed this desktop regression. No gameplay/save/asset changes.

Checks: **292 tests / 0 fail**, normal and separate playtest **138-module builds**, and **eight fresh native browser cases** through **http://192.168.100.7:4198/**. Canvas/WebGL each pass explicit non-touch 1280×720/1440×900 and touch 390×844/844×390 profiles: title, Controls, new game, intro skip, real movement, touch cancellation, Pause/Save and Continue/reload, with no console warnings/errors or failed/external requests. Runtime audit: **40 files / 11,719,438 bytes / 28 unchanged approved WAVs / eight unchanged art files / full notices**. Gameplay screenshots inspected at desktop and landscape phone sizes. Both the existing Mac preview and Wi-Fi preview return HTTP 200. Evidence: [startup verification](verification/startup-lan/README.md).

LAN preview binds all local interfaces on port 4198 for the user's requested phone test, while the Mac preview remains at http://127.0.0.1:4196/. Phone access requires the same Wi-Fi and the running Mac/server. Physical phones/other engines remain unverified; no public deployment, push, dependency, backend or asset added. Historical v0.18.1 results below do not certify its final non-touch startup.

---

# v0.18.1 — user-requested silent travel and mobile landscape (2026-10-12)

Removed the outdoor travel gate cue from the gameplay call and central playback/preload/build allowlist. Door, action, sleep/wake, progression and nature audio retain their current behavior. Rotation resets cancelled Phaser touch pointers and movement, and refreshes the actual canvas hit-test bounds after browser layout settles, even when its logical size is unchanged. Explicit window/orientation/visual-viewport resize/scroll listeners supplement the parent ResizeObserver, with cleanup and a fallback for unavailable observers. The pinned Phaser touchcancel callback is guarded against preventDefault on non-cancelable events without changing vendor files or disabling other touch capture.

Verified a separate short-landscape issue before fixing it: Credits/Back and, at 568×256, other start buttons extended below the viewport. Short menus now use two columns and a compact title/character preview; Bag uses six columns and fewer rows with all items paginated; Audio uses two columns; a very short Journal keeps the current objective/directions; compact HUD badges avoid the action column. Narrow landscape tools remain in Bag / Gear. No orientation is forced and no save/economy/story rules change.

Checks: **292 tests**, normal/playtest **138-module builds**, runtime audit **40 files / 11,719,411 bytes / 28 approved WAVs / eight unchanged art files**, four standard fresh cases and 21 native rotation/travel cases, with safe-area/shifted-canvas checks and clean consoles/whitespace. Checks and limitations: see [rotation verification](verification/mobile-rotation/README.md). Native Chrome emulates touch and browser-bar/safe-area changes; the user's exact physical phone/browser was not supplied and has not been tested. No new assets/dependency, public-save mutation, push or deployment.

---

# v0.18.0 — local judge progression, farming feel and balance (completed 2026-10-12)

The default production build starts at 60c and cannot receive the testing gift through host/query/developer mode. Only explicit `VITE_PLAYTEST=true` enables the visibly labeled once-per-save +100,000c playtest. Existing saved balances are preserved. The reviewed v0.17.4 source is protected by local checkpoint `3ececed`; this pass is local only, with no push, deployment or submission. The public playtest and user browser save were not changed.

06:00–24:00 now lasts 450 active seconds, with modal/transition/hidden-page pause. Journal reveals farming, town, material and fruit errands before market day, then a gated gold-sun Forest destination and the return-home ending. Directions use landmarks; signs retain their individual text and residents have four concise progress reactions. Original four-panel code pixel art, a brief approved ending stinger and continued farming preserve the established story.

Twelve crop tradeoffs and final market/food values are recorded in [BALANCE_REPORT.md](BALANCE_REPORT.md). Market range is 75–130%; abundant fruit healing is reduced and meals have a saved 12-second active cooldown with exact HP/EP previews. Commons costs 12 Wood / 6 Stone and pays 240c. Exactly one Copper Can costs 180c / 6 Wood / 4 Stone after Commons, previews a stopped three-bed facing ray and costs 2 EP for two/three thirsty beds or 1 EP for one. Fixed/custom/current-farm beds, obstacles, ownership, duplicate purchase and legacy expansion are protected; new large expansion requires the can. Previously ripe Cucumber/Sweet Potato remain ripe after additive schema-18 migration.

Soil depression/seed drop/short hand motion, immediate wet soil/leaf bounce, ripe bob/produce pickup, coin arcs, tree shake/fall/wood pickup and landed-hit freeze improve feedback. Tree fall handles textured art separately from its untextured shadow. Failed water and empty impact stay quiet. Boar warning is 850ms and repeated attacks cannot cancel warning/charge or extend recovery forever. Existing 25% Stash loss/replacement/recovery and protected Keepsake/inventory remain. Quiet UI/door/travel, outdoor nature, muted interiors and persisted audio settings use reviewed local assets only.

Checks completed: **290 tests / 0 fail**, both **138-module production builds**, runtime allowlist **41 files / 11,762,498 bytes**, **29 approved WAVs / eight unchanged art files / full notices**, clean whitespace. Native Chrome **41 normal + four playtest cases, plus ten final Canvas/WebGL Copper cases** pass across 1280×720, 1440×900, 390×844 and 640×360, with clean consoles/audio and full-size rotation. Fresh guided first harvest/sale pass at **6.72/7.26 minutes**; main ending/continued farming/reload pass on a fresh path plus unchanged-save continuation totaling approximately **24.23 minutes** (not an uninterrupted fresh or novice-human benchmark); see [verification/judge-polish/README.md](verification/judge-polish/README.md). No new dependency, asset download, backend, remote runtime or catalogue expansion. Human subjective art/audio acceptance, physical phones/other engines, blind novice pacing and legal/submission declarations remain pending.

---

# v0.17.4 — outdoor nature restored and default plants gatherable, published

Home/Farm/City daytime birds now play using the existing approved nature sample at gentler gain. Forest, river/fountain and night ambience retain their established behavior. Every house interior remains free of background loops; action, farming, real hits, pickups, transactions and sleep/wake effects remain. No wind or gameplay music is added.

Default grass, all wildflower variants (including the user's screenshot), ferns, mushrooms, low shrubs, animated plants and bamboo can be gathered by empty hands. Desktop clicks/E and mobile **Use** work; ordinary phone world taps remain inactive. Each plant yields one Grass with a pickup sound, disappears completely and stays removed after reload. Per-farm removals are separate; full bags, tired players, blocked/distant/wrong-tool actions and duplicate rewards are guarded. Bamboo removes its own small collision mask; animated plant cleanup is safe. Crops, axe trees and paid decoration Remove/Readjust choices remain. Existing Grass planting, schema 18 and once-per-save test gift are preserved.

Checks: **276 tests**, normal/playtest **136-module builds**, **14 local plant/audio/save cases**, **nine local sleep/nature audio cases**, **six live affected cases**, two staged/two public fresh/reload cases and all **34 public file hashes** pass. Measured outdoor nature/pickup audio is positive and indoor ambience is zero; clean console/audio failures, no wind/fireplace fetch or gameplay music. Plain public URL **200** without login/query. Runtime audit: **11,544,720 bytes / 22 approved WAVs / eight unchanged art files / full notices**, no unused archives/source. `git diff --check` passes. Evidence/commands: [verification/outdoor-plants/README.md](verification/outdoor-plants/README.md).

Published READY deployment **dpl_7nvBNxA22GFybwBYQ85J3qDAP5dZ** to the existing authorized free project/team. Same **[public playtest](https://simple-life-playtest.vercel.app/)** and save origin: refresh and Continue. Preview/generated protection remains unchanged. Source baseline **0cf62d95072f1bb95e1beff03d14eedf89175061 plus authorized uncommitted work**; no commit/push/new asset/dependency/backend/paid service. Disposable Chromium Mac and phone layouts verified; physical devices, other browser engines and subjective listening remain unverified. No user-profile saves touched by automation.

---

# v0.17.3 — indoor wind-like background removed, published

The continuous background inside every house is now silent. The retired `room` / fireplace WAV caused the reported wind-like sound; only that loop is removed from indoor profiles and the production allowlist. Other effects, sleep/wake/rooster timing, outdoor nature, volume preferences, house/crafting/placement, local saves and once-per-save playtest gift remain unchanged. Refresh and Continue at the same **[public playtest](https://simple-life-playtest.vercel.app/)**.

Checks: **273 tests**, normal/playtest **136-module builds**, nine local and nine public native audio cases pass. Actual indoor ambience peak is **zero** on Mac and native-touch phone layouts, no indoor background loop/file request, preserved audible sleep/wake/rooster output and outdoor Forest nature. Two staged/two public fresh/save cases pass; all **34 public file hashes** match; plain URL **200** without login/query. Audit: **11,543,935 bytes / 22 approved WAVs / eight unchanged art files / full notices**; unused fireplace, wind, archives/source excluded. `git diff --check` passes. Commands/evidence and limits: [verification/quiet-interior/README.md](verification/quiet-interior/README.md).

READY promoted deployment **dpl_DLcL23nQQK4vS3AJnQ1N5bvafpnp**, existing free Vercel project/team; source baseline **0cf62d9 plus authorized uncommitted work**. Preview/generated protection remains unchanged. No new asset/dependency/backend/paid service or Git push/commit. Physical phones, other browser engines and subjective listening remain untested; actual Web Audio output is measured in disposable Chromium Mac/touch contexts, with user saves untouched by automation.

---

# v0.17.2 — Customize icon, original house structure and material crafting complete

Published to the same public **[Simple Life playtest](https://simple-life-playtest.vercel.app/)**. Refresh and Continue preserves the browser’s progress. A native house icon beside Menu opens Customize; Pause no longer lists it, and the Farm board no longer exposes decoration crafting.

Customize contains seven Wood/Stone recipes, nine separate coin decoration purchases and eight differently priced houses. Crafting spends only materials; coin purchases reject these recipes. Craft at Home/Farm/inside, with outdoor placement restrictions and existing Add/Remove/Readjust/save rules retained. Previously owned stock, placed pieces and house ownership stay intact. Houses now preserve the original 180×144 cottage’s exact roof, walls, door/window/flowerbox/step structure and position while retaining distinct material palettes and furnished interiors. Native atlas bytes, collision/interaction coordinates, schema 18, once-per-save gift and audio policy remain unchanged.

Checks: **272 tests**, normal/playtest **136-module builds**, actual native-house alpha/transparent/step equality for all nine designs, 23 house/shop browser cases, twelve seven-recipe crafting flows across three areas/four viewports, four final-label/shop cases and four placement-editing regressions pass. Normal-release fresh Mac/touch builds retain **60 coins**. Two staged and two public hosted fresh/save cases pass; all **35 public file hashes** match, plain URL **200** without login or share query. Four live affected Customize/craft/shop/place/reload cases are recorded under verification/customize-access/public. Audit: **12,862,615 bytes / 23 approved WAVs / eight unchanged art files / full dependency notices**, no unused/source archives. `git diff --check` passes. Evidence/commands: [verification/customize-access/README.md](verification/customize-access/README.md).

READY promoted deployment **dpl_B9iA3EyK7aQDs5uyXXde144yj9mQ**, existing free Vercel project/team. Source baseline **0cf62d9 plus authorized uncommitted work**; no Git push/commit, backend, paid service or new external asset/dependency. Preview/generated protection stays unchanged. Physical phones/friend hardware, other engines, subjective art/listening and long-term balance remain unverified; native touch browser checks cover layouts/flows. Earlier release notes below are historical and superseded by this section for menu/shop/house structure.

---

# v0.17.1 — decoration placement and choices complete

Published to the same public **https://simple-life-playtest.vercel.app/**. Refresh and Continue retains this browser’s save. Add text is dark/bold in enabled and disabled states; four drawn direction arrows include the formerly blank Up button. Tap/drag previews anywhere clear on the visible screen without moving the farmer closer. Clear paths are usable, with occupied footprints, crops, water, structures, feet and essential approaches protected.

Click/touch placed decor (any tool), or nearby Hand/Use, opens Remove / Readjust / Cancel. Remove returns one item to Bag. Readjust moves/turns the original for free on Add, with no spare inventory/placement-slot requirement. Cancel, crop/tool change, Bag/modal entry and unfinished reload preserve it; original data remain saved until atomic confirmation. Responsive room resizing retains its existing safe relocation/repacking behavior. The eight house designs, schema 18, once-per-save playtest gift, farming/Forest and audio policies remain.

Checks: **269 tests**, normal/playtest **135-module builds**, twelve core editing browser cases across three areas/four sizes, five nearby-use/collision/rotation regressions, four final drawn-arrow editing cases, two staged/two public fresh Mac/touch hosted cases, and four live public editing cases pass. The plain public domain returns **200** without login/token and all **35 remote file hashes** match the tested runtime. Audit: **12,862,528 bytes / 23 approved WAVs / eight unchanged art files / full dependency notices**, no archives/unused/source files. git diff --check passes. Evidence, commands and deployment metadata: [verification/decoration-editing/README.md](verification/decoration-editing/README.md).

Final deployment **dpl_6aXSoPn567vyWDxE3uh8VJ6sTr8g**, existing free Vercel project/team; source baseline **0cf62d9 plus authorized uncommitted work**. Preview/generated protection remains unchanged; the public stable URL needs no share query. No Git push/commit, backend, paid service or new external asset/dependency. Physical phones/friend hardware, other browser engines, human art/listening approval and long-term balance remain unverified. Browser emulation verifies layouts/interactions; separate browser/origin saves remain separate.

---

# v0.17.0 — owned homes, paid gardens and testing coins, 2026-10-11

Completed and published the user-authorized update at **https://simple-life-playtest.vercel.app/**. Refresh/Continue gives **100,000 extra test coins once per save**, preserving prior balances/progress. Fresh test games have 100,060. Normal release builds retain the 60-coin starting economy; explicit build:playtest enables the grant. The same plain public origin preserves saves and requires no login/share query.

Menu → Customize at Home/Farm offers **eight differently priced house designs (2,000–90,000 coins)** with distinct original exteriors/decor/furnished room themes, Outside/Inside preview, confirmed purchase, owned persistence and free switching. Original cottage stays owned; doors/bed/hearth/Keepsake/exit remain usable. **Sixteen paid scenery/furniture pieces (nine new)** add oak/palm/blossom trees, hedges, flowers, birdbath, rugs, books and vases. Existing seven material recipes remain. Home, each Farm and indoor furniture use the existing preview/turn/place/cancel/pack workflow with shared collision masks; safe phone room changes pack pieces into Bag. Decorative trees yield no Wood/fruit. Schema 18 migrates old saves. Retained Save control, fullscreen separate canvas UI, no wind/gameplay music and prior nature/hit/farm/trade/sleep/rooster feedback.

Checks: **265 tests pass**, both **135-module normal/playtest builds**, **23 comprehensive customization + 12 final UI/art browser cases**, **14 action/audio + nine sleep/nature regressions**, **two staged + two public hosted smoke cases** with **35 exact asset hashes**, and **four public customization cases**. Desktop/touch purchases, saves/gift-once, migration, collision, packing and rotation pass with clean consoles. Runtime audit: **35 files / 12,860,205 bytes / 23 approved WAVs / eight unchanged art files**; no new dependency/external asset/source pack/credential in production. Local 4176 HTTP 200; git diff --check passes.

Existing free Hobby Vercel project only, staged static runtime output verified and promoted, protection for generated/previews unchanged; no Git commit/push/backend/paid resource/external message/organizer submission. New original code art/source/AI disclosure recorded. Detailed commands, final deployment ID, screenshots and evidence: [customization report](verification/customization/README.md). Physical phones/friends, other browser engines, subjective art/listening and long-term economy balance remain unverified. Normal user browser saves were not touched by test fixtures.

---

# v0.16.6 — public test URL, no wind, sleep/wake effects, 2026-10-11

Completed the latest request. **https://simple-life-playtest.vercel.app/** opens directly on Mac/phone without Vercel login, query token or token expiry. User-authorized public stable game domain uses standard Vercel protection for previews/generated URLs. Earlier preview/local saves remain at their own origins; this stable domain retains its browser-local progress across future updates.

Dedicated meadow/winter wind is removed from profiles/preloading/production. Retain other nature, gameplay music disabled, successful pickup/real-hit/farming/trade feedback and earlier quiet controls. Confirmed sleep plays its licensed effect, followed after the actual buffer by a public-domain rooster/hen recording for 06:00 waking or short rustle for 20:00 waking. New rest/Title/world cleanup cancels prior scheduled wake voices; cancelled bed menu stays silent. Schema-17 saves, preferences, energy/time/daily rollover unchanged. Credits/evidence updated for alys and the new converted local WAV.

Checks: **256 passing tests / 130-module build / nine affected audio browser cases / fourteen existing interaction cases / seven credits viewport cases / two staged plus two public hosted fresh-game cases**. Zero gameplay Music output, no wind file requests, correctly ordered successful sleep/wake effects and quiet cancellation; source/inventory/coin mutations, one fullscreen canvas, clean consoles/audio. All **35 public hosted file bytes/SHA256s** match tested local dist. Runtime audit: **35 files / 12,841,863 bytes**, **23 licensed/PD WAVs**, eight unchanged art files/full MIT notices; no source packs/unused wind/jingles/evidence/credentials in production. git diff --check passes. Local 4176 HTTP 200.

Free Hobby existing project, pinned authenticated CLI, static runtime-only staged and verified build promoted, no Git commit/push/backend/paid resource/external messages/organizer submission. Current IDs/public target and detailed commands/evidence/limits: [sleep-wakeup report](verification/sleep-wakeup/README.md). Physical phone/friend hardware, other browser engines and human listening remain unverified. User save origins are untouched.

---

# v0.16.5 — nature-only gameplay and pickup effects, 2026-10-11

Completed the user's request: gameplay has no music, including its ending; title music stops immediately on Play/Continue. Natural ambience remains. Successful food, stone, starter seed, treasure, Stash Bag, Keepsake and recovered-object pickups sound. Existing Wood/grass, actual tree/animal hit, farming and buy/sell feedback remain; failed/empty actions, felling and UI/Bag/tool selection/Jump/doors/travel stay silent. Existing schema-17 saves and audio preferences are preserved.

Checks: **253 tests pass**, **130-module production build**, **15 dedicated collection/nature browser cases** and **14 prior hit/farming/quiet-action cases**. Native Web Audio reports exactly zero gameplay Music output and audible nature; successful pickups start one source, failed full-Bag pickups start none. Clean local console/audio failures; git diff --check passes. Runtime: **35 files / 14,980,993 bytes**, exactly **23 supplied WAVs**, eight unchanged art files, matching hashes/PCM limits/full MIT notices. Original score/completion WAVs and seventeen unused effects are excluded.

The already authorized free Vercel Hobby friend preview is updated to this tested static build. Seven-day share access expires **October 18, 2026 at 15:16:21 Myanmar**; link is supplied in chat and kept outside repository evidence. All deployments remain protected; only audited static runtime output uploads, no Git push/commit, backend, paid resource or competition submission. Local port 4176 remains available; each browser/origin has its own save, and the earlier hosted preview's progress remains on its earlier URL.

Evidence, hosted checks, target/expiry, runtime SHA256 inventory and commands: [nature-pickups report](verification/nature-pickups/README.md). Physical phone/friend hardware, Safari/other engines and subjective listening remain unverified; browser fixtures never modify user origins.

Hosted verification also passes in two fresh Mac/touch browser cases: protected direct access, account-free tester link, music-free world profiles, selection/Jump/reload/save persistence, clean consoles/one canvas, and all **35 remote file bytes/SHA256s** matching the audited local build.

---

# v0.16.4 — landed-hit audio and Vercel friend testing, 2026-10-11

Completed the requested hit policy: empty swings and tree felling are silent; unfinished actual tree hits retain impact, completed cutting retains Wood pickup; actual animal hit/defeat, farming/trades and background ambience/music remain. Menus/Bag/tool selection/Jump/doors/travel stay silent. Existing action animations/events, schema-17 saves and volume/mute preferences are preserved.

Checks: **252 tests pass**, **130-module production build**, **fourteen local interaction browser cases** and **two hosted fresh-game browser cases**, clean consoles/audio failures/git diff --check. Runtime: **33 files / 15,377,884 bytes**, exactly **21 WAVs** and eight unchanged art files; full MIT notices/hashes/PCM limits pass. All 33 hosted responses match the tested build's exact bytes/SHA256s. Silent empty animation, two tree impacts/final Wood pickup, landed animal feedback, retained farming and transactions are verified.

User-authorized friend testing is deployed to the free Vercel Hobby simple-life-playtest project. The separate protected preview is READY; seven-day friend link is supplied in chat and expires October 18 at 14:50:45 Myanmar. All deployments are protected; hosting overlays disabled; noindex header configured. Connector permissions were insufficient; the existing Vercel CLI login succeeded in the verified team. Only runtime/static Build Output files uploaded. No source push/commit, backend, Git integration, paid resource or competition submission. Each browser has an independent save; local user origins are untouched. Local port 4176 remains available.

Evidence, target/IDs/expiry, SHA256 deployment inventory, setup corrections, commands and limitations: [hit-feedback report](verification/hit-feedback/README.md). Physical phones/friend hardware, other browser engines and subjective listening remain unverified.

---

# v0.16.3 — farming and tree/animal hit sounds restored, 2026-10-11

Applied the user's clarification: restored planting, watering, digging, harvest/clear/growth, grass work, tree swings/hits/fall/Wood pickup and animal hit/defeat. Clicking menus/Bag/tool selection, Jump, doors and travel remain silent. Successful transactions, music/Nature ambience/ending and existing volume/mute preferences remain. Sixteen audible event IDs use fourteen previously licensed SFX through the established central allowlist; no gameplay wiring, source asset bytes, dependencies or schema-17 progress changed.

Checks: **252 passing tests**, **130-module build**, **thirteen passing desktop/touch browser cases** showing actual restored farming/tree/animal source starts and silent selection/UI/Jump/travel; correct gameplay mutations and retained buy/sell sounds. No console/audio failures; git diff --check passes. Production audit: **35 files / 15,454,318 bytes**, exactly **23 WAVs** and eight unchanged art files, full MIT notices, unchanged source hashes and excluded unused effects. Existing Mac preview returns HTTP 200.

Evidence/reproduction/limits: [restored-effects verification](verification/restored-effects/README.md). Disposable targeted QA on 4190 preserves user origins/preferences. Physical phone hardware, other engines and subjective listening remain unverified; historical full layout/background checks are not claimed as rerun. No commit, push or publication.

---

# v0.16.2 — silent actions/UI/travel, 2026-10-11

Completed the user's follow-up: clicks, menus, Bag/tool selection, jumping, hits, farming/pickups, doors and location travel produce no sound effects. Only successful buying/selling retain transaction effects. Music, seven Nature ambience loops and the original ending cue remain, with all existing mute/volume preferences and schema-17 local progress preserved. Playback, preloading and production use the same two-event allowlist, preventing synthetic fallback sounds for removed events. Thirty unused SFX are excluded from production.

Validation: **251 tests pass**, **npm run build succeeds (130 modules)**, **23 production files / 15,172,480 bytes**, exactly **11 WAVs** and eight unchanged art files. Nine native-browser action/transaction checks and fifteen desktop/touch layout/gameplay/background-audio cases pass. UI/Jump/tree hits/doors/Home → Farm/City/Forest create zero non-loop sources; successful buy/sell each create exactly one. Watering Effects bus peak is zero; Forest day/night output stays nonzero; all ten supplied runtime files decode. Clean console/audio failures and git diff --check. Mac localhost:4176 and Wi-Fi 192.168.100.7:4176 return HTTP 200.

Evidence: [quiet-action verification](verification/quiet-actions/README.md). Disposable QA on 4190 preserves user origins 4175/4176. Physical phones, other browser engines and subjective listening remain unverified. No new dependency, asset bytes, schema change, commit, push or publication.

---

# v0.16.1 — licensed cozy audio, mobile Use and hidden default Hand (2026-10-11)

Implemented the user's supplied-audio/control follow-up. All five archives have reviewed game-use permission evidence; selected 32 Farm SFX files, seven Nature loops and one HuntSounds bonus music loop. All 49 gameplay/UI events map to selected samples; original synthesis remains initial-load/failure fallback. Forest has audible birds/leaves, proximity-based streams, nighttime crickets/owl and snowy wind; Farm/Home meadow, City fountain and Home fireplace suit their scenes. Background music is quieter in Forest/night; the original ending cue remains. Preserve existing volume/mute preferences. Credits identify Spaceyyy (formerly Bramble & Byte) and HuntSounds; exact licence snapshots/embedded terms, hashes and processing details are under assets/licenses/cozy-audio.

Mobile ordinary world touches no longer trigger actions. Star/Use reads the highlighted nearby context, with Hit for Axe work/hunting/empty swings; arrow/Jump retains outdoor jumping. Use works indoors. Placement retains tap/drag previews and explicit confirmation. Fine-pointer mouse/E/K/Space behavior remains, even in compact Mac windows. Hand is the existing invisible default, removed from Bag/HUD; Put away and equipped hotbar taps return to it. Desktop numeric tool shortcuts remain idempotent. Default Hand prioritizes fruit/cache/Stash recovery over incidental grass, while explicit desktop grass targeting remains.

Schema 17 and valid existing selections/progress remain. No new runtime dependency, art asset change, weather/gameplay expansion, remote runtime asset, commit, push, publication or submission. Local Mac/phone production preview stays on port 4176; QA uses disposable contexts on 4190 without touching user saves.

Validation: **250 tests pass**, **production build succeeds (130 modules)**, **53 production files / 16,136,998 bytes**. Only eight unchanged art files and 41 explicit WAVs ship; full MIT notices remain. Forty selected files pass PCM/peak/DC/clipping/loop-edge and byte/hash checks. Chrome actual decoder loads all forty; measured Forest bus output is nonzero for day/night. Seven viewport fresh-game/equip/put-away/reload/Jump checks, touch planting/watering/harvest/doors/bed/sleep/stone/fruit/Stash recovery/three-hit chopping, desktop small-window world actions, keyboard selection and audio credits fit pass without warnings/errors. Canvas/WebGL each retain one actual AudioContext through twelve Pause and twelve Title/Continue cycles, focus suspend/resume and preference reload; Canvas Title runs 120 seconds. git diff --check passes. HTTP 200 on localhost:4176 and 192.168.100.7:4176; LAN IP verified.

Evidence/reproduction: [verification/cozy-audio](verification/cozy-audio/README.md). Phone-size Chromium checks are not physical phone/Safari/Firefox/Edge tests or subjective listening approval. Old preset mute/zero-volume remains respected; hardware audio/comfort and final competition screening remain for the team. Full natural story benchmark from v0.16.0 is historical; this follow-up tests the affected interactions rather than repeating that benchmark.

---

# v0.16.0 — Grandfather's last request and original audio, 2026-10-10

Implemented the authorized story/audio milestone: four original introduction panels; five persistent Journal chapters using existing farming, market/resident, fixed Commons seating, Forest fruit/boar/cache and Home shelf; durable original Keepsake; placement animation, final letter, frozen statistics, once-only cue, Credits and Continue Playing. No extra crops, locations, animals, equipment, furniture, projects, relationships, weather, backend or cloud saves.

One gesture-unlocked AudioManager manages Master/Music/Ambience/Effects, local original scores (64/96/80/96/96 seconds and an 11-second ending), quiet shared textures/calls and 49 gameplay effects. Home/Farm transport is shared; region/water, night, Pause and focus transitions are smooth and bounded. Settings persist separately, retain legacy mute, and survive denied storage/audio. Retired Forest noise nodes/timers are removed. Missing scores fail once per session. Settlements have minimum night moonlight; Forest distance remains dark; BAG/glyphs and short-landscape Jump/Attack are clarified. Production gift activation is DEV-only.

Schema 17 retains valid schema 1–16 world progress and coin balances, skips legacy intros and derives only supported Journal evidence; money never completes the story. Guarded one-time key recovery remains available for old looted caches, and death/sleep/save cannot remove the key. Normal 4175 storage was untouched; all QA used disposable contexts on 4186.

Eight uncertain ToffeeCraft cells were replaced independently, preserving 850 other cells, atlas metadata, collision/anchors and seven other art files. Runtime: 18 files / 21,930,569 bytes; explicit eight-art/six-WAV allowlist excludes archives and unused packs. Retained creator licences, dependency evidence and original/AI assistance are documented; full runtime MIT notices are preserved. No blanket rights certification or signed human declaration.

Checks: **245/245 tests**, successful **128-module production build**, git diff --check, all 64 source-audio measurements unclipped and within documented DC/frequency/boundary limits. Seven required Chrome desktop/phone-size layouts, Canvas/WebGL audio lifecycle, actual keyboard/mouse/touch, schema-16 migration, storage denial, legacy mute, one context, bounded sources, settings reload and clean consoles pass. Fresh ordinary-input awake-calendar story: **20:12 wall time**, **19:57 active**, day 4, one harvest/two produce sold/one boar/zero deaths; ending/Continue/reload passed. Bed sleep can produce a faster route. [Complete report](verification/story-audio/README.md), [inventory](AUDIO_SOURCES.md), [provenance](assets/licenses/story-audio/SOURCE_RECORD.md).

Remaining: final human listening and visual approval; physical Android/iOS touch/audio/interruption/latency; Safari/Firefox/Edge/other engines; slow-network load; original-language competition/ownership declarations and organizer review. Headless transport/waveforms do not prove pleasant or non-tiring audio. No push, publication, deployment or submission; one local milestone commit only.

---

# v0.15.0 — adjustable placement and recoverable furniture, 2026-10-10

Complete: placement is a transient world ghost, with ground click/tap/drag, eight-pixel nudges, four directions, explicit confirm/cancel, green/red footprint and arrow. No stock is spent before a valid confirmation. Movement/jumping are suspended while positioning; Cancel keeps stock and restores walking. Desktop arrows/R/E/Escape and mobile controls work. Hand is automatically selected after confirmation and retrieves the whole piece into Bag. Targeting follows the full turned silhouette; approach checks ignore the piece’s own solid while retaining other blockers and inventory capacity.

Added Picnic table (12 Wood/4 Stone), Garden barrel (5 Wood), Lantern post (6 Wood/4 Stone), pictured on a second workshop page and available in Bag/Gear. Shared DecorationArt draws previews and placed pieces with native side/back bench/fence/table views; axis-aware geometry drives placement/collision/cover/save validation. No sprite sheet is rotated sideways. Round/symmetric objects may look the same from opposite directions. These remain decorative scenery, without storage, dining or new light simulation.

Schema 16 adds bounded optional left/up/right directions (missing/down retains the original south-facing shape), with three new inventory keys. Old furniture, tree damage, crops/care, projects/orders/stove, farms, money, gift marker and Forest/Stash progress stay intact. Draft position is intentionally transient; reload opens a fresh preview from the farmer for a saved decoration selection. Invalid paths/water/beds/solids/feet, stale farms/items, no stock/full farm and malformed directions reject without loss.

Checks: npm test **220/220**, npm run build **120 modules**, git diff --check. Native Chromium 1280×720, 360×640, 640×360 verified selection → unspent preview → turn/nudge/drag → exact confirmation → saved orientation/Continue → Hand recovery; blocked E/disabled Place, Cancel, new recipe costs and second Gear page. No browser warning/error logs. Runtime twelve files / 2,386,453 bytes, eight byte-identical art files. Evidence: verification/placement; provenance: assets/licenses/placement.md. Normal 4175 save refreshed/continued/paused without fixtures or repeated gift. Physical phones and other engines remain unverified. No new dependency/download, backend, remote asset, publication or push.

---

# v0.14.0 — three-hit trees and illustrated resource UI, 2026-10-10

Complete: every authored tree takes three valid Axe hits, costing 1 EP each; Wood/crown/root removal happen only on hit three and cannot repeat. The cream world meter shows Tree 0/3, 1/3, 2/3 and +3 Wood, above foliage/night shading. Schema 15 saves bounded known treeHits (1–2) per outdoor area/owned farm. Days/travel/reload preserve partial damage; earlier completed cuts and all crop/economy/farm/Forest/Stash/testing-gift records remain. Full inventory, invalid range/approach/tool/ID or no energy leaves the action atomic. Blocked movement now turns from input intent without interrupting an active swing.

Original lowercase pixel glyphs and widened headings improve the shared canvas text. Rich resource pages show real finished-object previews, labelled tabs, pictured materials/current stock/rewards, clear disabled states and Build/Place/Deliver/Cook actions. Farm decorations and Bag/Gear share matching pictures; projects show their actual furniture arrangement. Cooking shows stove/meal benefits and selects Grilled Meat directly in Food. Inline refreshed stock/completion information avoids popups over phone titles; bag pagination is separate from category tabs. Enter focuses an available action before Close. Existing native keyboard, desktop world click and mobile Attack-only chopping remain.

Checks: npm test **215/215**; npm run build succeeds (**115 modules**); git diff --check clean. Native Chromium at 1280×720, 360×640 and 640×360 verified first/second/third hits, partial reload/new-day persistence, keyboard and desktop clicks, mobile joystick/Attack and world-tap suppression, all four recipes, placement/Hand packing, once-only request/project rewards, stove/cooking/direct food selection and +50 HP/+35 EP. No isolated browser warn/error logs. Eight runtime art files are byte-identical to baseline; build has twelve files / 2,378,165 bytes. Evidence: docs/verification/chopping-ui; provenance: docs/assets/licenses/chopping-ui.md.

Normal 4175 game refreshed with its existing save, continued and paused; QA stays on an isolated origin. Physical phones/notches and other browser engines remain unverified; current licence/submission qualifications remain. No dependency/download, backend, remote runtime asset, push/publication/submission or save reset.

---

# v0.13.0 — longer crop care and resource proposals completed, 2026-10-10

New planting requires 3–6 watered calendar days; repeated same-day watering earns no extra growth/EP cost. Tomato/Carrot/Chili/Cucumber/Sweet Potato 3; Strawberry/Corn/Eggplant/Blueberry 4; Watermelon/Grape 5; Pumpkin 6. Existing missed-day/recovery/death rules stay; old ripe saves remain harvestable, still-growing plants retain care earned. Schema 14 preserves previous economy/farms/Forest/vegetation/testing gift and adds bounded project/order/stove/decor progress.

Completed the four user-authorized proposals: three rotating daily resident material requests with coin/seed rewards; three permanent visible Town projects; four movable Farm decorations crafted from Wood/Stone; Home stove plus Wood-fuelled Grilled Meat (+50 HP/+35 EP). Entry points: City Garden town board/NPC Daily request; Farm board / Build decorations; Bag / Gear / Wood or Stone / Uses; Home hearth. Existing local-only canvas architecture, three-farm cap, retired club, input/commutes/energy/forest entrance/recovery and eight-art allowlist remain. Original code/graphics plus reused credited sprites; no new image, dependency or remote runtime.

Checks: npm test **208 passed**; npm run build succeeded; desktop 1280x720, portrait 360x640 and landscape 640x360 native-browser flows passed, including reward idempotence, visible scenery, crafting/placement/collision/packing, stove/cooking/eating, maturity/harvest and fixture-free persistence. Runtime 12 files/8 art files. Evidence: docs/verification/resource-projects. Normal localhost4175 refreshed and existing save continued/paused without fixture replacement. Physical phones/non-Chromium are unverified; projects complete in one build rather than partial donations. Existing licensing/submission qualifications remain. No push/publication/submission.

---

# v0.12.1 — bottom-centre Forest entrance, 2026-10-10

Complete: Home's north edge enters Forest at (5120, 4848), the full 10240-wide map's centre. The Home exit occupies x=5072–5168 on the bottom boundary. The central Return Gate shares the new spawn instead of a separate southwest coordinate. Natural grassy approach masks join the eastern crossway, and full tree canopies/scenery/cliff faces stay clear. The old southwest edge no longer travels. HOME signs/clues point toward the new southern centre, and the Forest map labels its Home exit even before full exploration. The phone label sits below the map to avoid habitat text.

Checks: npm test 199/199; npm run build (106 modules); git diff --check clean. Native Chromium at 1280×720: Home → centre-bottom Forest, south exit → Home, central Return Gate → new entrance, full/explored map marker, fixture-free save/Continue after returning Home. At 360×640: map bounds/buttons and Home label remain visible. No isolated browser warning/error logs. Eight allowlisted art files and twelve total dist files; no new art/dependencies/downloads. The final local game on 4175 was refreshed and the user's existing save continued, then paused; no fixtures or repeated test gift touched that origin.

Evidence/reproduction: docs/verification/forest-entrance/README.md. Version 0.12.1 keeps schema 13, legacy safe positions, discovery/resource/cache IDs, farming/time/loot/recovery and local saves. There are now 2,832 trees after opening the approach; 240 stone piles remain. Wood/stone uses are proposals only, with no crafting/projects/upgrades implemented. Physical phones and other browser engines remain unverified. No push/publication/submission.

---

# v0.12.0 — daily watering, three farms and club removal, 2026-10-10

Complete: one watering at any hour per calendar day, repeat watering without extra EP, daily midnight growth across farms/custom beds, alive after two misses, Recovering after three (revivable), dead after four. Farm Board → Buy / visit farms buys second/third farms for 600/1,200 coins without field prerequisites and stops at three. Wooden Club bag/shop/combat/stall are removed; Rowan stays a resident. Schema 13 accepts schemas 1–12, translates old watering, preserves purchased land/crops and returns old club value once. Prior owned farms beyond three are retained, with no further purchases. Existing gift marker, Forest species/loot/resources, food, sleep, local saves and Stash recovery remain.

Checks: npm test 198/198; npm run build (105 modules); git diff --check clean. Native Chromium browser at 1280×720, 360×640 and 640×360: midday daily care, no repeat EP, fixture-free save/Continue, natural midnight corn growth, third-day recovery prompt/rescue, board purchases/cap/travel, phone purchases/recovery, compact menu bounds, gear without club and Rowan conversation/two merchants. No warn/error entries in isolated checks. Eight art files, twelve total dist files; no archives or QA screenshots in production. Local preview remains on http://127.0.0.1:4175/.

Evidence/reproduction: docs/verification/daily-farms/README.md. Isolated origin 43863 keeps fixtures away from the normal 4175 save. Normal progress is preserved; optional testing gift is not reapplied. Mobile refers to viewport/native pointer emulation, not a physical phone. The larger crop card may intentionally hide on a crowded phone layout, with the correct contextual care/recovery prompt retained. Earlier records below are historical. No push/publication/submission or rights certification.


---

# v0.11.1 — Home proportions, roof and mobile attack correction, 2026-10-09

The indoor farmer and furniture now share 2× native world scale; indoor camera framing matches outdoors (1.5 desktop, 1 compact), so the farmer is 96px / 64px tall in both locations. Existing room sizing, furniture, bed, exit, saved room mapping and collision rules remain. The Home exterior is drawn directly on a 180×144 native canvas (360×288 world), centred at the existing door/porch. Twelve other houses retain 120×96 cells. All thirteen share the broad roof/central raised gable/front facade structure, with a pitched rear cap and taller double doors; unique finishes remain. Source-generated exact collision rows, Home resident doorstep, clear porch and centred grounding shadows follow the new art. No 3D engine, reference-pixel extraction, resampling or external asset.

Energy uses an original yellow lightning glyph and brighter gold fill in the same badge/frame dimensions as health. On layouts with the mobile Attack button, direct animal/ground/tree taps cannot hunt or swing/chop; use Attack. Desktop clicks and ordinary mobile ground/people/door interactions remain.

The user explicitly requested a one-time 100,000-coin test gift. The local-only `?testingCoins=100000` title action writes the existing raw save atomically, changing only money plus a claim marker, preserving all other stored fields. The marker survives validation/normal saves; reloads cannot duplicate it. Normal URLs/remote hosts hide the action and new lives still start with 60. The user's existing normal 4175-origin save received 100,000 once, and its 100,003 balance was confirmed after fixture-free normal reload/Continue; game left paused. Other browser QA used the separate 43863 origin.

Checks: **192/192 tests passed**; `npm run build` passed (106 modules). Native browser checks at 1280×720 and 390×844 verified Home entry, indoor scale, reachable bed dialog, complete roof/door, mobile screen attack suppression, mobile Attack loot (2 Meat, 1 EP), retained desktop click attack, normal save gift/reload, and clean QA console. Source/runtime audit: 858 atlas frames, only thirteen original house cells changed, Home cell relocated, 845 cells/six other art files unchanged; eight allowlisted runtime art files, twelve total dist files, 2,356,735 bytes. Evidence: docs/verification/home-proportions; original-cell hashes: docs/assets/licenses/home-proportions.

Limits: phone viewport/native pointer emulation, not physical iOS/Android; other browser engines remain unverified. No new dependency, default economy change, remote service, push, publication or submission. Earlier verification records remain historical.

---

# v0.11.0 — front-facing Home and mobile movement, 2026-10-09

Completed the latest request. All thirteen houses now share the reference's broad roof, raised central gable, flat facade, lattice windows, double door and planter flanks; only finishes differ. Shared collision alpha/door anchors remain consistent and City routes stay clear. Home now has original cream/terracotta patterned tiles, arched windows, fireplace/logs, pottery shelves/counter, rugs, dining table/benches, bed and plants. Spawn/bed/exit connect at all supported room sizes; sleep/entry/exit remain working.

Movement now uses bounded analog/keyboard vectors with stable native facing on diagonals; collision sliding retains intended facing. Mobile arrows are replaced by a circular joystick and Jump/Attack controls, fitting portrait/landscape without hotbar overlap. A joystick finger cannot be stolen/released by another action finger. Release/cancel outside, menus, layout/rotation, blur/background reset movement. Jump is free outdoors using the existing swept arc/cooldown/grounded-save rules; indoor actions are disabled. Mobile Attack reuses axe/club combat and nearby axe tree use. Desktop retains direct taps/keyboard.

Checks: **189/189 tests**, production build (104 modules), whitespace, native art and eight-file runtime allowlist pass. Native browser inputs at 1280×720, 360×640 and 640×360 verify entry, walk to bed, sleep, exit, stable keyboard/joystick diagonals, release reset, mobile boar defeat (+2 Meat, -1 EP), Forest cliff Jump, Pause/rotation and saved landing on Continue. Browser warnings/errors are empty. Evidence: verification/home-mobile; source records: assets/licenses/home-mobile. Normal preview 4175 is restored/opened without resetting its save. QA tab/server and temporary viewport are cleaned up.

Limits: Chromium viewport emulation; physical devices, other engines, sustained performance and human visual acceptance unverified. Simultaneous physical fingers are covered by pointer-event unit tests, not a real-device claim. Native character sheets remain four-facing sprites with stable animation during eight-way movement. Furnishings are decorative apart from bed/exit; no pottery/crafting system. Schema 12, Forest/city/farming/NPC schedules/economy/food/energy/club/time/recovery remain. No new external asset/dependency/backend, push or publication; earlier submission/licence qualifications remain.

---

# v0.10.0 — scene depth, branching Forest rivers and return gate, 2026-10-09

Completed the latest Plant Tales-inspired follow-up. All thirteen original houses now show a receding tiled roof plane, side wall/window, recessed facade, foundations/steps and cast shadows. Shared collision masks derive from the revised opaque pixels; Home door/roads/commutes remain accessible. Outdoor desktop framing is closer (1.5 camera zoom, 3× native pixels at 1280×720); compact screens retain zoom 1 / 2× native pixels. This remains three-quarter two-dimensional pixel art.

The Forest now has thirteen connected irregular channels with diagonal/horizontal/vertical stretches, forks, rounded joins and changing widths, plus nine dry wooden crossings (four horizontal/five vertical). Shared crisp water spans drive ground paint, currents, reflection, shoreline refill and map. The network is deterministic across saves. Seventy-five inland shelf bands / 825 taller 48-world-pixel cliff faces have organic stepped contours, original mottled stone/earth strata, grassy lips and shadows, walking gaps and free jumps. 2,846 trees, 323 fruit spots, 128 quiet animals and 30 boars remain. All earlier forage/animal/discovery/cache IDs are unchanged; wet animal homes move within their territory, and changed terrain scenery retains cuts on surviving coordinate identities.

An original animated central Return Gate at (5120,2704) triggers on ground entry, returning to the open Forest entrance (640,4848) through the established fade/save/cooldown route. Map label appears after discovery. The gate approach and full overlapping canopies are cleared. Eight selected native CraftPix rocky sprites form nine dry Dark Forest landmarks: caves, dragon skeleton, deer/fox statues, oval rock, mushrooms and cairns. All selected cells are actually used; no full pack/PSD/unused objects enter dist. Official freebie terms/source/archive/cell fingerprints are recorded in assets/licenses/rocky-depth.

Checks: **184/184 tests**, production build (**102 modules**), whitespace, native cell/progress comparison and eight-file runtime allowlist pass. Runtime audit: verification/scene-depth/runtime-audit.json. Native browser inputs at desktop/phone verify door entry, river fork/bridge/wading reflection, map, rocky landmark, cliff collision/jump, gate walking/touch entry, unchanged economy/inventory/energy on return and saved arrival on Continue. No browser warnings/errors. Evidence: verification/scene-depth. Updated normal preview 4175 opened without storage reset; isolated QA cleaned up.

Limits: viewport emulation only; physical devices/other engines/sustained performance/human acceptance unverified. Cliffs provide visual height and blocking faces, not a full elevation simulation. Rocky caves/statues/bones are scenery, without new interiors/resources. Schema 12, farming, City, Home, NPC schedules, permanent club, time/sleep/local saves and 25% Stash recovery remain. Earlier unrelated licence/submission limitations remain. No new dependency/backend, push or publication.

---

# v0.9.0 — Forest habitats, direct attacks and lighter energy, 2026-10-09

Completed the latest user follow-up. Both dedicated Attack and selected-Axe hotbar controls are removed; select Axe in Bag / Gear or key 5 and click/tap the world to face/swing. Trunk taps still award wood; animal taps target that animal. A 120ms wind-up precedes gameplay impact, followed by a 420ms total cut/recovery pose with native-hand grip and no added skin rectangle. Cooldowns, line-of-sight, loot caps, jump/pause gates and the permanent club remain. Empty swings are free; Axe hits and all ordinary farm/vegetation/stone work cost 1 EP, club hits 2 EP. Time never drains EP; sleep/food/crop care/daily rollover remain.

The 10240×5120 Forest has seven broad, organic habitats arranged from the supplied concept, retaining the 40 underlying discovery IDs and 14 caches. Meadow/dry habitats gain clustered clearings; 3,195 trees remain (about 22% fewer than 4,070), with 323 daily fruit spots and 158 animals (30 boars + 128 quiet animals from the existing four species). All older resource/animal IDs and every remaining cut-tree ID survive. Eighty low stepped shelf bands / 970 face segments have grassy walking gaps, dry surfaces and jump crossing; old river banks/ferns/waterfalls remain removed.

Original local ambient wind, bird tones, insects and nearby-water noise respond to habitat/day/night and crossfade. Autoplay unlocks on user input; menus/background/non-Forest play are silent. Pause has a local persistent sound preference, independent of schema-12 game saves. No new asset/dependency or backend. This request supersedes older no-terrace/no-audio/passive-fatigue constraints.

Checks: 182 tests, production build (99 modules), eight-file/838-cell byte comparison and resource-ID audit. Native browser inputs at desktop and phone-sized viewports cover screen attacks, energy, ledge walking/jumping, habitat map/rendering, watering and sound mute/reload; detailed evidence/limits in verification/forest-refresh. Normal preview 4175 refreshed with its saved Continue option intact; QA tab/server closed and viewport override reset. Physical devices, other engines, long sessions and audible output quality are not claimed. No push/publication.

---

# v0.8.0 — reference axe, hunting, stones and healing, 2026-10-09

Completed the user's requested axe orientation and gameplay additions. Blade sits above/outside the native grip with wood sloping down, mirrors by facing, behind up/in front otherwise, without an extra hand. Selected free Axe can hunt existing Forest animals with K/E/direct tap for 2 energy per swing and a 500ms cooldown. Boars/deer give 2 Meat, foxes/hares/grouse 1; boars retain their Hide. Quiet wildlife remains nonhostile but now saves partial health/death and pure movement. Defeated animals return only on a later day. Full loot stock rejects lethal attacks atomically.

Added **240 daily stone piles**, six per 40 regions, dry/walkable and without altering map collisions. Hand/E/direct taps gather 2 Stone for 1 energy; collected IDs persist through travel/reload and reset next day. Hand stone pickup takes priority over grass after a browser-discovered conflict. Stone appears in Gear; Meat in Produce/Food page 2 and existing City Market, appended to preserve old prices. Food restores both health and energy: Meat 25 HP / 20 EP, fruit HP rounded 40% of retained EP. Eating works at full energy while hurt and refuses waste when both stats are full. Health/energy cap 100, zero-health recovery remains established.

Schema **12** migrates 1–11, preserving farms/crops/economy/vegetation/club/time/discovery/recovery. Added bounded known stone/quiet-animal records and zero-default stone/meat inventory. Three original local cells append to existing atlas; all 835 old cells/metadata and six other art files remain unchanged. No new asset pack/dependency/backend/crafting system. Suggested later wood fences, stone paths and campfire meals remain proposals.

Checks: **175/175 tests**, production build (**96 modules, 12 files / 2,287,312 bytes**), whitespace and eight-file runtime-art audit pass. Native browser inputs at 1280×720/360×640 verify four axe facings, hunting/drop/eating, healing at full EP, Hand/E and direct stone pickup, and saved removal after fixture-free reload. Compact 640×360 layout tests pass. Empty warning/error logs. Evidence: [hunting/resources](verification/hunting-resources/README.md); [provenance](assets/licenses/hunting-resources.md). Normal preview 4175 refreshed without resetting its save; QA tab/server closed and viewport restored.

Limits: isolated fixtures/current browser and emulated sizes; physical devices, other engines, sustained performance and human visual acceptance unverified. Initial Forest construction remains heavy; recorded QA input timeout handled by observing state before continuing. Existing source/licence/submission limitations remain. No push/publication.

---

# v0.7.3 — axe facing, clear cottage roads and reference meters, 2026-10-09

Completed the user's three repairs. Axe now grips the lower wooden end at the farmer's native hand, rotates the blade outward and mirrors with facing. It renders behind the up-facing farmer and in front for the other facings; the added hand rectangle is hidden for Axe. Water/Shovel keep their established poses. Four enlarged cottages move onto dry parcels; two northern road spurs stop below the cottages. All twenty sunflower pots sit within front gardens beside clear doorways. Every City house silhouette and complete sunflower footprint is clear of all paved roads.

Health and energy share original round cream badges, grey/cream beveled tracks, outlined heart/leaf glyphs and highlighted red/gold fills inspired by the supplied reference. Their dimensions remain equal and fit the established responsive HUD. Farming, tools, commerce, commuting, Home entry, Forest, time and schema-11 local saves remain.

Checks: **167/167 tests**, production build (**94 modules, 12 files / 2,280,176 bytes**), whitespace and runtime-art audit pass. Regressions cover all roads/house silhouettes/pots and all axe directions at idle/half/full swing, native grip, no extra hand and front/back depth. Native browser checks verify four axe facings, walking the corrected lane and desktop/360×640/640×360 meters; no warnings/errors. All eight art files are byte-identical to ef08d42; 835 atlas frames remain. Evidence: [street/HUD verification](verification/street-hud/README.md), [source record](assets/licenses/street-hud.md). Normal preview refreshed at http://127.0.0.1:4175/ without resetting its save; isolated QA tab/server cleaned up.

Limits: viewport emulation only; physical devices, other engines, sustained performance and human visual acceptance remain unverified. Existing licence/submission limitations remain. No new dependency, download, runtime art, saved fields, push or publication.

---

# v0.7.2 — planted seeds, matching people and axe grip, 2026-10-09

Completed the user's three visual repairs. Newly planted crops show small seed grains in a soil mound, replacing the oversized inventory-packet stake in all twelve crops. Inventory/shop packets retain their crop pictures; crop inspection and established water/warning/harvest labels remain. Growing crop stages, care and yields are unchanged.

All City/Home residents and sellers now use adapted native Channeechan farmer bodies instead of the larger Pipoya proportions. Eight hair/clothing palettes distinguish people; native 24×32 silhouettes, facial pixels, 2× scale, .94 foot origin and four walking poses match PlayerView. Commutes, conversations and commerce remain. Axe is vertically flipped, grips above the blade, sits outside the torso with an extended hand, and renders in front for all four facings. Swing tilts outward; Water/Shovel retain their existing poses.

Checks: **166/166 tests**, production build, whitespace and Python source compilation pass. Updated regressions check matched native cell sizes, all axe facings and blade clearance at idle/half/full swing. Browser checks used actual planting (seed count 3→2), four-direction axe movement, Home/City NPC comparison and direct phone NPC conversation; no console errors/warnings. Audit confirms 663 unchanged old cells, only twelve original planted-seed cells changed, 160 adapted farmer cells appended (835 total), unchanged farmer sheets/six other art files, and the same eight-file runtime allowlist. Build: **12 files / 2,278,525 bytes**. Evidence: [character repairs](verification/character-fixes/README.md); [source/licence record](assets/licenses/matched-characters.md). Preview refreshed at http://127.0.0.1:4175/; user-origin save retained.

Limits: browser viewport emulation only; physical devices/other engines/human visual acceptance remain unverified. Earlier licence/submission limitations remain. No new dependency/backend, progression/save fields, push or publication.

---

# v0.7.1 — town, water and touch polish, 2026-10-09

Completed the user's axe/fountain/houses/NPC/HUD/water/touch follow-up. All thirteen active houses now have distinct original 120×96 source art (240×192 world pixels), 50% larger in both dimensions, with varied roof/gable/chimney forms, shaded plaster/brick/timber, door/window details, flowerboxes and ivy. Shared collision masks derive from their exact alpha rows; Home entry stays at its established approach. Decorative cottages remain exterior scenery. The axe grips its lower handle with the blade pointing outward in all four facings.

Residents and all three sellers emerge from actual home doors at 06:00 and follow shared dry, collision-safe paths to their daily places. They begin returning early enough to reach their doors by 20:00, then hide until dawn. Departing patrols start from their current position. Sellers serve only while at work and within the retained 07:00–20:00 business window. Home visitors share the schedule; no relationship/progression/save fields are added. Existing commerce, farming, permanent club, Forest, sleep and recovery remain.

Fountains have moving falling streams, spray and spreading basin rings. City/Forest water has denser independently phased flow; wading draws a subtle inverted, water-clipped farmer reflection and ankle ripples. Bridges/dry ground/jumping suppress it. Health/energy have matching panel, fill and badge geometry. The touch USE control is removed: tap nearby people/shops/doors/ground directly. E remains available. Crop guidance fits below the enlarged meters, including 640×360.

Checks: **166/166 tests**, production build, Python source compilation and git whitespace pass. Native browser inputs verify four axe facings, City/Forest wading and dry bridges, dawn/return/night NPC states, direct conversation/seed purchase/Home entry taps, crop watering, produce selling, and desktop/portrait/compact landscape UI. No browser warnings/errors. Preview: http://127.0.0.1:4175/. Evidence: [town verification](verification/town-polish/README.md). Production: **12 files / 2,196,525 bytes**, unchanged eight-file art allowlist; all 662 old atlas cells/metadata remain unchanged, with 13 original houses appended (675 total). Sources: [town art evidence](assets/licenses/town-polish.md).

Limits: browser checks use Chromium viewport emulation; physical phones, other engines and sustained performance remain unverified. Decorative cottages add no interiors; schedules are cosmetic clock-derived runtime poses. Existing third-party terms and submission limits remain. User-origin saved game was not reset; no push/publication/submission.

---

# v0.7.0 — larger reference-inspired City, 2026-10-09

Completed the user's City/houses/NPC request. City is **2560×1792**, exactly four times 1280×896, with a market fountain square, connected cream-curbed stone avenues, a canal/two opaque wooden crossings, cottage streets, planted seating/lamps, three ornamental community beds and a tent/picnic corner. City foliage reuses original olive Forest canopies. Every old house variant/shop alias and shed uses muted terracotta roofs and cream/timber details, arched doors/windows, ivy/flowerboxes. Native source dimensions and alpha/collision masks are unchanged. Home/Farm/Forest routes, farming, utilities, permanent club, shop interactions/hours/prices, daily time/sleep, local saves and Stash Bag remain; no persistent NPC progression or unrelated system.

Eight human City residents plus two at Home use selected free **Pipoya** directional PNG cells, with short E conversations, collision-safe local walking, facing and player spacing. Movement is transient/reset on entry and paused by menus. Existing three merchants keep their established commerce. **LimeZu CC BY 4.0** building art is adapted/credited; Pipoya's **custom commercial/personal game-use terms** are separately documented and linked in Credits. Full pack/source sheets stay outside repository/build. Reference screenshots guide appearance only. No new dependencies, backend, DOM HUD or runtime remote assets.

Checks: **160/160 tests**, production build, git diff check and Python source compile pass. Native browser checks at 1280×720 and 360×640 verify buying/selling, City/Home conversations, bridge dry walking, new districts, City exit after its existing cooldown, Home entry, readable touch HUD/dialog and night lamps; no console errors/warnings. Preview refreshed at http://127.0.0.1:4175/. Evidence: [City verification](verification/city-redesign/README.md). Production: **12 files / 2,158,177 bytes**, same eight art-file allowlist. Atlas 560→662 cells: 554 prior cells/coordinates and six other art files unchanged; six altered building cells retain exact alpha silhouettes. Licence evidence: [City sources](assets/licenses/city-redesign.md), [Pipoya terms](assets/licenses/pipoya/README.md).

Limitations: decorative town cottages/gardens/camp add no new interiors/progression. City bridge north bank is within City, not a new destination. Retired City vegetation coordinates/unsafe legacy positions are normalized through existing save validation while known currency/inventory/farming progress persists. Physical devices/multiple engines/sustained performance and team human art/balance/legal acceptance remain unverified. Existing other-pack prize-entry rights limits still apply. No push, publication or submission.

---

# v0.6.2 — held tools, wood and replantable grass, 2026-10-08

Completed the user's follow-up. Shovel and Axe use the existing directional hand attachment and swing when used. Axe removes any authored tree in Home/Farm/City/Forest, its shadow/crown and root collision for 2 energy, awarding 3 wood once. Cutting a fruit tree also stops that tree's fruit. Gather grass with Hand for 1 energy; place collected grass on dry, clear ground for 1 energy. Original removals and new responsive clumps persist; farms keep separate vegetation records. Digging clears overlapping cover without awarding grass. Bamboo/large palmetto stands remain scenery rather than trees.

The twelve crops now take one or two fully cared-for nights: Tomato, Chili, Cucumber and Sweet Potato take one; the others take two. AM/PM care, missed-care warnings/death, seed prices, yields and sales remain. Bigger original cream/olive packets show distinct fruit emblems in the bag, shop, hotbar and planted marker. Free utility tools live in Bag → Gear; keys 4/5/6/7 select Shovel/Axe/Hand/Grass, E/USE or a nearby click applies them. The compact utility slot previews the selected tool and opens Gear. Forest retains its map and separate club action.

Schema 11 preserves versions 1–10, paid farms, crop care, inventory, currency, equipment, forest progress and Stash Bag. Known bounded cut/grass IDs and validated planted patches restore before position/collision/bed repair. Earned crop growth beyond the shorter duration becomes ripe. No new crafting/combat weapon, dependency or external art.

Checks: 157/157 tests and production build pass. Native in-app browser inputs verified held tools, tree removal/+3 wood, hand gather/+1 grass, placement, reload persistence and traversing a cleared root, twelve seed packets, planting and one-night Tomato guidance at desktop 1280×720 and phone viewport 390×844. Final build reload/Continue and console checks are recorded in verification/garden-tools. Automated care-to-harvest covers all twelve crops; physical phones, other browser engines and final human balance/visual acceptance remain unverified. Eight runtime art files only; 560 atlas frames, 532 prior cells unchanged, 24 original seed cells improved and four original material/tool icons added. All six other art files are byte-identical. Current preview: http://127.0.0.1:4175/. No push/publication/submission.

---

# v0.6.1 — held watering can, gentler energy and natural soil, 2026-10-08

Fixed the user-reported watering object: Atmosphere previously requested 'can' from the town atlas, where that frame does not exist. A new original 16×16 metal watering-can frame is used by the HUD and HeldWateringCan. It stays in the farmer's hand while Water is selected, follows four facings/movement/jumping/indoor scale, hides on tool change/transition and tilts during a pour. Droplets start at the held spout and land on the selected ground; no floating target can is spawned. Both supplied boy/girl sheets are unchanged.

Farming is gentler: planting 5→2, digging 4→2, watering 3→1, harvesting 4→2 energy; passive fatigue 30→60 game minutes per energy. A full starter bed can be planted and watered with 52 energy left. Shared data/energy.js centralizes costs; combat, food, sleep, zero-energy gating and watering-window growth remain. Schema stays 10 with the same saved fields; fatigue validation now preserves partial hours up to 60 minutes and older progress still loads.

Connected soil now uses world-coordinate earth/mottle/pebble variation, soft irregular grass fringes and rounded transparent corners rather than flat repeated square panels. Dry/wet material patterns stay aligned across neighbouring cells. Saved bed geometry and crop care labels remain. The user's screenshot guides broad material appearance only; no reference pixels extracted.

Checks: 144/144 tests and production build pass, five new regressions for full-bed energy, saved fatigue, real held-can state/direction/pause/hide, pour origin and continuous organic soil; asset/runtime/HTTP audit and labelled offline farm/held-can studies reviewed. Production has 12 files / 2,061,066 bytes and the same eight art files, with all 555 previous atlas cells unchanged and one original can appended. Evidence: verification/farm-polish/README.md. Native browser interactions/rendering/animation/touch/performance remain unverified under the existing local-URL browser-tool rejection; no bypass or user save access. Existing preview serves the rebuilt game at http://127.0.0.1:4175/. No new dependency, external art, push or publication.

---

# v0.6.0 — free shovel beds and crop care, 2026-10-08

Completed the user's farm follow-up: connected red-soil beds with olive turf edges, larger leafy crop sprites, cream water-drop/red !/harvest markers, a tilted-can pour and falling water, and wet ground that dries after three minutes of active play. Select Shovel (4) and USE or click nearby clear Farm grass to dig a free 48px planting cell; adjoining cells join existing beds. Roads, water, bridges and solid footprints cannot be dug. Land/farm purchase screens are replaced by a shovel guide; previously purchased farms and their crops remain visitable and saved. Starter beds remain available.

Twelve crops are available through paged City seed tabs and the bag: the original four plus Chili, Eggplant, Cucumber, Watermelon, Pumpkin, Grape, Blueberry and Sweet Potato. Watermelon/Grape/Blueberry also appear in Food. Outdoor Home/Farm/City/Forest open ground can be watered; plant care still uses AM 06–12 and PM 16–22. Cosmetic wetness neither grants extra growth nor bypasses care windows. Repeated watering costs energy, and menus/hidden tabs pause wet-time decay. Sleep/time skips dry patches. Schema 10 migrates versions 1–9 without resetting existing progress.

Checks: 139/139 tests, production build, eight-file runtime art allowlist, 12 output files / 2,058,100 bytes, atlas/retained-pixel audit, HTTP identity of the current preview bundle. Two FarmView and 51 UI offline studies generated; six selected images retained and reviewed. These are labelled offline approximations. Native browser rendering, pouring/input/touch and device performance remain unverified because the browser tool previously rejected the local URL; no bypass or live user storage access. The preview was restarted at http://127.0.0.1:4175/. Evidence: verification/free-farming/README.md.

The supplied A_2D_pixel_art_sprite.zip contains a lion sprite and was inspected but not integrated. All new crop/shovel/soil/marker art is original code-authored project work with Codex assistance; assets/licenses/free-farming.md records provenance and unchanged licensed cells. No dependency, runtime remote asset, push, publication or competition submission.

---

# v0.5.2 — Missing font recovery, 2026-10-08

Corrected the disappearing UI text reported after v0.5.1. Phaser's XML bitmap-font loader adds individual glyph frames to the source texture, making SPACE the first frame. Passing the cached null frame to getFrame selected that transparent 3×7 glyph. The colour helper now explicitly selects __BASE for a null font frame, copying the complete 128×64 sheet and retaining all original glyph metrics/alpha and theme colours.

The strengthened regression executes the actual pinned XML parser and Texture.add/get before the Canvas renderer. It failed on the previous code (3×7 instead of 128×64) and passes after the correction. The offline adapter now models the blank default frame and rejects blank source text. Checks: 125/125 tests, production build and whitespace pass; eight runtime art files unchanged from db8f98f; 12 production files / 2,016,395 bytes. Read-only HTTP confirms preview 4175 serves index-CO_PAf13.js byte-identically to dist. Evidence: verification/font-recovery. Schema remains 9.

Forty-two labelled offline UI studies were generated; five retained, shop and portrait bag visually inspected. A separate pixel audit confirms the former SPACE crop has zero visible pixels while the full sheet retains 1,024 visible pixels across colour variants. These are supplemental offline/engine checks. Live browser interaction/rendering QA remains blocked by the previously recorded local-URL policy rejection and is unverified. No live save access, publication or push.

---

# v0.5.1 — UI readability repairs, 2026-10-08

Fixed the white UI text shown in the user's screenshots. Phaser 3.90 Canvas BitmapText draws its source texture and ignores tint; the v0.5.0 offline adapter incorrectly assumed tint would affect Canvas text. `coloredFont.js` now caches coloured local font textures using the original alpha mask/metrics. Every shared UI label/button uses those pixels directly, so dark olive, muted and gold text appears on cream panels in Canvas and WebGL. Light title/world labels retain their intentional cream colours.

The live clock receives fractional minutes; displayClock now floors to a whole minute before formatting, removing decimal tails/overflow. The Forest hotbar has a clearly labelled Map control (M also opens it), replacing the ambiguous small glyph. All 1/2/3 tool-corner badges are removed; item counts and keyboard shortcuts remain. Map is still Forest-only, with position/facing, discovery and broad clues.

Checks: 125/125 tests and production build pass; whitespace clean. Three added regressions invoke the pinned Phaser Canvas font renderer against coloured cached sources, exercise fractional clock values, and open the map through the actual HUD action at seven sizes. Existing geometry/input/gameplay tests remain. The corrected offline adapter no longer models BitmapText tint; 42 updated labelled studies were generated, with selected shop/HUD/map studies inspected. Evidence: verification/ui-fixes; art/source: assets/licenses/ui-readability.md. Eight runtime art files are unchanged; schema stays 9.

Limitations: Browser interaction QA remains blocked by the previously recorded local-URL browser policy. Engine unit tests use stub canvas contexts and do not certify browser rendering or input dispatch. Offline images remain supplemental studies, not browser captures. No live user save, publication or push. The reported map symptom cannot be checked in a live browser here; the visible label/contrast and actual action checks address access/readability without changing discovery rules.

---

# v0.5.0 — Leaf and parchment interface, 2026-10-08

Completed the latest user-authorized theme pass. Title, farmer choice, pause, controls, credits, confirmation/dialogs, Farm board, shops, crop information, HUD and bag share original cream/olive stepped frames and small leaf stitches. The title composes retained credited forest/farmer sprites with original warm trunk/light/water graphics; reference screenshots supply inspiration only.

- Top action buttons and the canvas Jump button are removed. The upper HUD contains heart/energy meters, day/time and coins. Lower icon slots contain tools, Bag, Pause and Forest-only Map/club actions. Touch directional movement and USE remain.
- Space jumps in Forest; K attacks. B opens Bag; M opens the Forest map. Legacy J/Shift jump aliases remain. Nearby touch double taps on open Forest ground jump, without another button. Held/paused/transitioning actions are gated.
- Bag uses four icon tabs (seeds, produce, food, gear), a 4×3 grid, counts and one short selected-item detail. Selecting seeds, eating and equipping reuse established rules/save guards; food refuses consumption at full energy. Shop transactions and purchase confirmation remain.
- Parchment map draws actual rivers and a simplified terrain miniature, hatches undiscovered regions, shows player location/current facing and keeps optional region/cache clues. It cannot open outside Forest. It preserves world aspect at every tested viewport; exact cache positions remain hidden.
- Shorter guidance and compact crop inspection retain watering windows, growth/care, ready/wilt/dead information. Small landscape crop information avoids inspected plot/player and keeps text within its panel.

Checks: 122/122 Node tests, including 10 new input/bag/map/control/layout regressions; production build succeeds; whitespace check clean. Bounds checks cover 1440×900, 1280×720, 1024×768, 844×390, 390×844, 640×360 and 360×640. Forty-two labelled offline UI studies cover fourteen screen states at desktop, portrait and small landscape sizes, with selected studies visually inspected. Test/build/art-allowlist/HTTP evidence is in `verification/notebook-ui/`; source/provenance is in `assets/licenses/notebook-ui.md`.

Limits: Browser interaction QA is blocked by the previously recorded browser tool URL-policy rejection for the local preview. Offline draw-command studies use a test adapter and Pillow, not Phaser, actual input dispatch or browser screenshots; they do not certify renderer behaviour, real touch gestures, accessibility, physical phones/notches or browser compatibility. Current browser acceptance remains unverified. No user save was accessed or changed during QA. Prior browser results below are historical.

Version 0.5.0 / schema 9; no world content, gameplay economy or save migration changes. Farming, City, permanent club, continuous day/sleep, discovery, 25%-coin recovery and all eight runtime art files remain. No new dependency, remote runtime resource, source-pack redistribution, publication or push.

---

# Larger forest and wavy shores — 2026-10-08, v0.4.9 / schema 9
Latest user requests slightly fewer trees, twice the current forest area, more rivers with wavy reference shores, more fruits and more animals. Forest extends east to **10240×5120 / 40 connected regions**, exactly twice v0.4.8 and 40 times the original area. Original region IDs/coordinates and southwest entrance remain. The old eastern boundary opens onto twenty new habitats. Forest has **4,070 trees (2,092 western / 1,978 eastern), 110 bamboo stands, 628 palmettos and 15,027 grass clumps**; western tree count is about 16.7% below 2,512. Approved olive art/character scale remains.

Four full-length rivers, a tributary and a short pool channel use separate left/right scallops, variable widths and broader irregular sandy pockets. Three eastern ponds and **22 opaque grass-free bridges** extend exploration. Shared water geometry drives terrain, waves, wading and dry vegetation placement. Forest-only shore changes leave other locations' materials intact. Dry roots/grass-free decks, responsive grass, water walking/free jumping and grassy passages remain; no roads, waterfalls, raised banks or teal ferns return.

**163 daily forage spots / nine retained fruit types** and **78 native Craftpix animals**: original sixteen boars plus fourteen new boars in seven pairs; original eight quiet animals plus forty new Deer/Hare/Fox/Grouse in twenty pairs. New homes and all fruit footprints are dry. Fruit points overtaken by wider water move horizontally to nearby dry banks with stable collected IDs. Existing fourteen cache IDs/rewards/guards, original boar IDs/health, discovery, farming/City/club/day/sleep/local saves and 25%-coin recovery survive. New exploration is not pre-revealed. No save schema bump.

Checks: **112/112 tests**, production build, whitespace, BFS reachability of all forty regions/163 fruits/fourteen caches, shared river geometry/bridge spans, dry footprints, old-save progress and safe texture coverage pass. Forest ground bakes coherently then caches six native tiles of at most 2048×2048 instead of uploading a 5120-pixel-wide texture. Production **12 files / eight art files / 2,008,179 bytes**. All eight art files and 474 atlas entries match baseline 8275b7f byte for byte. Local preview 4175 serves index-BIKc8sEC.js. Evidence: verification/forest-expansion; source/AI record: assets/licenses/forest-expansion.md.

**Limitation:** native browser interaction, responsive Canvas/WebGL and device performance checks remain unverified because browser URL policy blocks access. Three labelled offline art studies were inspected; they do not run Phaser or gameplay. Local CPU terrain bake was 1,263ms, not a browser/device benchmark. Existing supplied-pack rights caveats remain. User-origin save untouched by QA; no push/publication/submission or final human acceptance claim.

---

# Reference forest and supplied-only animals — 2026-10-08, v0.4.8 / schema 9
Latest user scope keeps only Craftpix Boar/Deer/Hare/Fox/Grouse, removing all other animal definitions/spawns/atlas art and former extra-animal credit pages. Sixteen saved boars remain: the original Homewood pair plus one sparse guard per existing cache. Eight quiet animals retain native animation/flee behaviour. Original boar health/IDs, all region/cache/forage IDs/rewards, farming/City/day/sleep/club and 25%-coin recovery survive schema-9 validation; removed species records are ignored.

Five supplied reference images guide denser layered olive crowns, fuller palms, low palmettos, irregular responsive grass, sharp moss islands, small flowers and warm bare soil. Seven original native canopy/palmetto frames and 27 revised grass cells are code-authored with Codex assistance; references are not sampled. Forest has **2,512 trees + 47 bamboo stands / 353 palmettos / 7,945 grass clumps**. Cleared passages/landmarks/fruit/guard homes stay navigable. Natural shores, dry roots, grass-free bridges, walkable water/free jumping remain; no raised banks/teal ferns/roads/waterfalls return. Forest-only olive outlines/colours leave other locations intact.

Checks: **106/106 tests**, production build, whitespace, connected-route/save/material/animal checks and pixel/allowlist audit pass. Atlas: 474 frames, seven new / 447 removed / 27 modified, 440 retained cells and all 258 Craftpix cells pixel-identical; six other art files including farmers byte-identical. Production **12 files / eight art files / 2,004,320 bytes**. Local preview 4175 responds with the current build. Source/AI/evidence: assets/licenses/forest-reference.md and verification/forest-reference.

**Limitation:** browser URL policy still blocks native interaction QA. Labelled offline art studies were inspected; they are not Phaser/browser acceptance. Current grass/jump/water/combat/map/save/responsive/performance checks in a browser, physical devices/other engines and final human acceptance remain unverified. Existing supplied-pack rights limitations remain. User save untouched by QA. No push/publication/submission.

---

# Licensed animal improvement — 2026-10-08, v0.4.7 / schema 9
Fifteen combat species replace their geometric placeholders with licensed asset silhouettes/poses: lion, polar bear, tiger, panda, wolf, hyena, elephant, cheetah, leopard, jaguar, monkey, kangaroo, snake, zebra and crocodile. Existing animated Craftpix Boar remains; **16/22 combat species now use external asset bases**. Giraffe, hippo, rhino, chimpanzee, gorilla and Komodo retain original project art. Coat adaptations are identified honestly; side/idle-only sources are not claimed to contain four-direction walks. The supplied endangered sheet contributes five Florida panther poses; the supplied vermin ZIP is excluded as a poor species match.

Stable native cell sizes and per-direction foot origins, correct source facing, ground shadows and existing warning/health labels improve readability. Missing warning cycles use idle art with the retained warning marker. Five new linked artist credit pages identify creators, licences and modifications; short-screen layout fits. Habitats, 22 species/68 combat animals, difficulty, forage/caches, farming, City, club, day/sleep, schema-9 saves and 25%-coin Stash Bag recovery remain unchanged.

Checks: **103/103 tests**, production build, atlas/source audit and native CUA browser inputs pass. All fifteen new species appear in their habitats. An isolated prepared one-health wolf was hit through native controls, fled for one Hide and remained defeated on Continue/reload. All five new credit pages fit 1280×720, 640×360 and 390×844. WebGL wolf idle/walk/warning/run frames and frozen pause timing are verified; portrait Monkey labels and controls fit. Evidence: verification/wildlife-sprites. Source/licence records: assets/licenses/wildlife-sprites/SOURCE_RECORD.md. Six other art files (including both farmers) and all **495 retained atlas frame pixels** are unchanged. Sixty old placeholder frames are removed; 419 new named frames yield 914 atlas frames. Same eight-file art allowlist; **12 production files / 2,258,286 bytes**, no vendor originals/manifests/QA in dist.

Limits: six species retain original art; several packs offer side/idle poses only. Browser tests use disposable prepared saves on 4176, not a full farming or extended balance playthrough. Physical devices/other engines and final human acceptance remain unverified. Existing environment rights limits still apply. User-origin save untouched; main preview 4175 retained. No push/publication/submission.

---

# Forest theme and bridge correction — 2026-10-07, v0.4.6 / schema 9
Latest user requests supersede the v0.4.5 raised earth banks: **all raised assemblies/low-ledge masks and teal fern scenery are removed from Forest**. Natural textured shores remain. Forest dirt roads/waterfalls remain absent; jumping stays free and respects trunks/structures. Removing bank reservations leaves **844 trees + 41 bamboo stands / 4,201 responsive grass clumps**, with retained species/forage/cache routes.

All five bridges are now **272×72 horizontal timber crossings**, with opaque native planks, rails and end posts extending onto dry land at both banks. Shared bridge/wading/dry-footprint geometry uses these decks. The visible night grid was caused by independently drawn transparency cells; equal-opacity runs now merge into continuous rectangles, preserving the established near/far light levels. Forest tree/bamboo foliage uses cached native-size olive colour variants, preserving bark/fruit/neutral snow, silhouettes, anchors and alpha. Other locations keep their existing colours. River wave motifs are short broken reflection clusters with retained independent timing/scattering, closer to the supplied visual reference.

Validation: **99/99 npm tests**, production build, syntax/whitespace checks pass. Three added tests cover olive foliage versus bark/fruit, full bridge span/dry endpoints/traversability and complete nonoverlapping night shade coverage. Previous terrace tests now verify its removal and retained jumping/save rules. Existing farming/City/time/20-habitat/22-species/68-animal/forage/guarded-cache/migration/25%-Stash recovery tests pass. CUA isolated browser checks verify desktop Canvas day and WebGL night bridge, actual bank-to-bank canvas-control crossing with no ankle waterline, portrait controls, pause/Save/reload, retained JUMP, palette caches and quiet river. Evidence: verification/forest-theme.

All eight runtime art files are byte-identical to v0.4.5; only code changes the Forest render colours. No new pack, dependency, backend, remote asset or save schema. Production: **12 files / 2,031,148 bytes**, allowlist preserved. Art/AI evidence: assets/licenses/forest-theme.md, ASSET_LICENSES.md and AI_USAGE.md.

Limits: browser checks use disposable prepared saves on 4176, not another complete farming playthrough. Physical devices/other engines and final human acceptance remain unverified; prior supplied-pack rights records remain applicable. User-origin save untouched. Main preview on 4175 remains; no push, publication or submission.

---

# Forest shore cleanup — 2026-10-07, v0.4.5 / schema 9
Latest user request supersedes the earlier Forest roads, waterfalls and stone/stair terrace art. River ripples now have scattered positions, different lifetimes/delays and native-pixel movement; submerged stone placement has wider jitter. Forest dirt paths are removed after reserving navigable grassy gaps. Ten low grassy earth banks beside the river replace all twenty old stone/stair assemblies. Slopes allow walking; low faces allow the established jump. Emerald Falls is displayed as Emerald Banks, retaining its saved region ID.

Forest contains **796 trees + 41 bamboo stands / 4,033 grass clumps**: 147 palms, 27 willows, 168 broadleaf trees, plus the retained conifers, acacias and fruit trees. Palms/willows are original code-authored native art; broadleaf variants reuse credited LimeZu pixels. Full grass footprints avoid water and bridge decks; tree root footprints avoid water. Branches may naturally overhang a shore. The 5120² map, 20 habitats, 22 species/68 combat animals, nine fruits/63 forage nodes, 14 guarded caches, farming/City/sleep, permanent club, schema-9 saves and 25%-coin Stash Bag recovery remain.

Validation: **96/96 npm tests**, production build and whitespace audit pass. Four new tests cover removals/riverbank slopes, full dry vegetation footprints, tree variety and independent scattered ripples. Retained tests include route connectivity, jump collisions/interruption and save migration. CUA browser QA on isolated origin 4176 verifies actual canvas-control water movement, dry bridge, bank walk stop/jump/landing, paused clock/water pixels, Save/reload, removed stone assembly, mixed trees and waterfall-free WebGL night pool. Desktop 1280×720, portrait 390×844 and short landscape 640×360 inspected; responsive controls fit. No browser warnings/errors observed. Evidence: [forest-shore/VERIFICATION.md](verification/forest-shore/VERIFICATION.md).

Art audit: all **553 previous atlas frame pixels and both farmer sheets are unchanged**; only original palm/willow frames are added (555 total). Same eight allowlisted art files; **12 production files / 2,031,270 bytes**, excluding source archives/manifest/generators/QA. No new dependency, remote runtime asset or runtime backend. Source/AI records: assets/licenses/forest-shore.md, ASSET_LICENSES.md, AI_USAGE.md.

Limits: prepared browser saves are not a new complete farming playthrough; physical phones/other engines, prolonged performance/balance and final human acceptance remain unverified. Existing supplied-pack licence limits remain recorded in earlier entries. User-origin game/save was not edited during QA. Local preview 4175 remains available; no push, publication or competition submission.

---

# Ground and river realism — 2026-10-07, v0.4.4 / schema 9
The user approves the current trees/tall grass and requests richer ground and river materials using three screenshot references. Original code-native grass/moss shade patches, short vegetation/leaf marks, flower clusters and scattered soil/pebbles replace the repeated flat grass/path fill. The prior grass selector aliased to grass0 at every 16-pixel stamp. Adjacent habitat colours blend; native 2× pixels remain crisp. Rivers/ponds now have shaded earth/sand/turf banks, submerged stone clusters, shallow/deep blue-green channels and restrained moving reflections. Screenshot pixels/assets/layouts are not sampled; surveyed CC0 packs are not downloaded or used.

The existing renderer still bakes/cache-reuses Forest terrain and draws camera-local water motion. Trees, responsive tall grass, terraces/jumps, shared water geometry, bridges, animal groups, forage/treasure, farming/City/sleep, schema-9 saves and 25%-coin Stash Bag recovery remain. No new gameplay system, dependency, atlas file, backend or remote runtime asset. All eight art files are byte-identical to baseline 29f8184 and the allowlist excludes archives/unused/source/evidence files. Production: **12 files / 2,024,149 bytes**. Original source/AI/licence records: [ground-river-materials.md](assets/licenses/ground-river-materials.md), AI_USAGE.md, ASSET_LICENSES.md.

Validation: **92/92 npm tests**, production build and whitespace/allowlist audit pass. Four new pure material tests cover deterministic non-repeating ground, shoreline distance including islands, depth shading/untouched remote land, and habitat-boundary blending. Isolated Chromium browser suites pass real ledge/jump/grass/pause/save and direct river/waterfall/Home/Farm pond crossings, wet Save/refresh/Continue, held touch, combat/woodland regressions and seven viewports. Final material captures check all nine habitat palettes, Home/Farm/City, waterfalls, Canvas/WebGL day/night rivers and minimum portrait. A paused river crop is byte-identical over 750ms and reflections resume after unpause. Browser error/warning/failed/foreign-request arrays are empty. Observed disposable reload → Continue → settled capture: **533–1,145ms** locally, not a device benchmark. Evidence and reproducible commands: [terrain/VERIFICATION.md](verification/terrain/VERIFICATION.md).

Screenshots inspected for native pixel edges, texture density, shoreline layering, path readability and portrait UI. Physical devices/non-Chromium engines, prolonged performance and final human visual acceptance remain unverified. Existing pack rights records still apply. User live saves remain untouched; nothing pushed, published or submitted.

---

# Supplied character / forest art — 2026-10-07, v0.4.3 / schema 9
The latest user explicitly authorizes FreeEnvironment for their noncommercial game and Channeechan's Cute Farmer Character instead of Mana Seed. Both supplied boy/girl characters now replace the original player in every location and selection preview; 24×32 cells/animation keys/feet/scale remain. All idle/walk pixels are native source pixels; three jump poses adapt the supplied body. New conifers, boulders, ice and dry plants update Forest scenery, while fruit broadleaf trees/acacias/bamboo preserve distinct habitats. Tree bases align with existing solids and larger crowns fade/sway correctly. Existing 820 tree/bamboo props, 3,880 responsive grass clumps, 20 terraces, walkable water, 20 habitats/22 species, forage/guarded treasure, farming/City/sleep/save/recovery remain. No gameplay/save schema change, dependency, backend or remote runtime asset.

Licences/source/selected rectangles: [SOURCE_RECORD.md](assets/licenses/supplied-farmer-environment/SOURCE_RECORD.md). Channeechan allows commercial/noncommercial game use and modifications; underlying Eris Esra template also permits game use. Both credited. FreeEnvironment's Standard Free licence allows personal game development; user's noncommercial instruction authorizes local integration but **public prize-competition coverage remains unconfirmed**, and no additional creator permission is claimed. Mana Seed stays excluded. Original source archives/PNGs remain outside the repository; eight allowlisted processed runtime art files only. Nothing pushed, published or submitted.

Checks: native gallery/integrity check passes for 72 player frames (48 idle/walk cells exactly source-identical), npm test 88/88 and production build pass. Existing forest growth browser suite passes real jump/grass/pause/save/combat/water checks at seven sizes in isolated Chromium, Canvas and WebGL. Final art/credits/selection checks pass for both farmers in five areas, all four directions, seven habitats and all seven sizes; final two-finger touch/key-repeat and both new-game/water-walk/jump/save flows pass. No browser errors/warnings/failed or foreign requests in the main/final art checks. Evidence under docs/verification/supplied-art. Production: 12 files, eight art files, 2,021,045 bytes; no archives/original sheets/evidence/QA/manifest shipped. Physical devices/non-Chromium engines, long sessions and human visual/rights acceptance remain unverified.

---

# Forest growth and jumping — 2026-10-07

**Implemented locally, v0.4.2 / schema 9**, with the supplied asset replacements **pending compatible rights**. The user's newest request authorizes dense forest flora, moving grass, raised ground and jumping; prior preserve-farmer/no-new-art restrictions are superseded only within this scope.

- Forest remains exactly **5120×5120 / 20-fold area**, with **787 trees and 33 bamboo stands**, **3,880 tall-grass clumps**, **20 stepped terraces** and walkable stair gaps. Existing animal groups/territories, fruit/cache approaches and connected trails remain reachable. Grass bends on grounded contact and springs back after departure, with green/dry/snow native palettes. Camera-local sprites are pooled from spatial buckets; distant clumps remain data.
- **J / Shift / canvas JUMP** makes a directional leap of at most 128 world units over 600ms, with an 850ms cooldown. The swept feet path can cross low ledges while trees, rocks, cave pillars, fall banks and bounds remain solid. No energy cost, new equipment or combat immunity. Animal hits interrupt/ground the leap; use and attack wait for landing. Camera follows ground feet while the sprite uses original crouch/air/landing poses and a pixel arc/shadow. Water walking remains; the ankle line/dust hide while airborne.
- Pause freezes jump/grass simulation. Autosave/manual Save/pagehide during flight persist the grounded take-off point; reload resumes standing. Schema **9**, all previous inventory/crop/farm/coin/equipment/time/health and migrations remain. Existing nearest-safe repair handles old positions newly inside scenery. No backend, runtime remote assets, dependency/font/audio change.
- **Supplied packs are not integrated:** Seliel the Shaper's Mana Seed User License prohibits use alongside AI-generated code/art, conflicting with this project's recorded AI assistance. ToffeeCraft's FreeEnvironment Standard Free licence grants personal use only; no commercial licence/permission was supplied. Both primary creator pages, licence HTML, source ZIP hashes and audit are recorded in **assets/licenses/forest-growth/SOURCE_RECORD.md**. The user was informed and asked for rights evidence; none received by completion. No purchase, creator contact or source redistribution. The screenshot informed broad vegetation/terrace ideas only, with no pixels/layout extracted.
- Actual art uses four native **LimeZu CC BY 4.0** cliff rectangles and **27 original grass frames / 24 original jump poses**. Original first six idle/walk/face cells remain pixel-identical. Boy/girl sheets are **216×128 / 36 native 24×32 cells each**; atlas **545 frames / 1024×2048**. Existing linked in-game credits remain. Same **eight runtime art files**, excluding all supplied/vendor archives, unused files, guides, QA images, manifests and licence records.

Checks: baseline **83/83** tests/build on clean **8fc977a**; final **88/88 npm tests**, `npm run build`, whitespace check and source/art/runtime allowlist audit pass. Production **1,978,827 bytes / 12 files / eight art files**. New pure checks cover low-ledged walk blocking/stairs/swept jumps/cooldowns, safe saves/reloads, tree/cave/bounds blocking, zero-energy jumps, safe interruption and actual animal damage during flight. Existing wilderness reachability, species/combat/treasure, crop/City/time/sleep/migration/bag rules pass.

Browser evidence: **verification/forest-growth/**. Real keyboard jumping over a blocked ledge and landing, paused arc freeze, Save/refresh/Continue mid-flight, both farmer rigs/directions, grass contact/spring-back/culling, waterline/river save, touch jump at zero energy, help/controls at **1440×900,1280×720,1024×768,844×390,390×844,360×640,640×360**, Canvas/WebGL night grass/jump all pass. Retained `asset-water.mjs` also passes direct river crossing, both Home/Farm ponds, waterfall centre, Boar hit/flee/save, woodland/ruin/plant rendering and seven-size credits/controls. Final smoke passes simultaneous two-finger movement/jump, movement remaining held after releasing jump, and held-key repeat refusing chained jumps. An initial supplemental fixture reached a tree and correctly stopped; it was moved to a verified clear trail to isolate input-release behavior. Every completed report has zero page/console errors, warnings, failed or foreign requests. Native frame galleries and desktop/portrait/short-landscape/night screenshots were inspected. Full growth/water suites precede only a landing-pose spread and non-gameplay final records/debug/snapshot changes; final production touch/repeat smoke and all unit/build/art checks follow them.

Remaining limits: exact supplied asset replacement needs compatible licences/permission; existing original farmer faces and licensed trees remain. Physical devices and Safari/Firefox/Edge, long-session performance and extended human balance/visual/competition acceptance remain unverified. This pass uses isolated disposable Chromium saves; the user's live save is untouched. No push, publish or deployment.

---

# Supplied assets and walkable water — 2026-10-07

**Implemented locally, v0.4.1 / schema 9**, following the user's three supplied ZIPs and request to improve animals/objects/river/waterfall and walk through water. This supersedes earlier no-new-pack and blocked-water restrictions.

- Craftpix Boar replaces the two combat boars with native four-direction idle/walk/run/attack animation. Flee feedback uses its actual displayed frame; established damage, telegraphs, drops, health and saves remain. Eight sparse Deer/Hare/Fox/Grouse use native directional idle/walk, wander/flee and no combat/rewards. The other **21 combat species retain original project art** because the packs do not contain them. All 22 existing combat species / 68 saved animals, 20 habitats, nine foods / 63 nodes, 14 guarded caches and the exactly 20-fold forest area remain.
- Selected textured Brown-gray/Snow/Sand/Water ruin fragments improve regional landmarks/banks. Three animated plant variants add jungle/bamboo/marsh scenery without extra enemy rules. Source PNGs remain native scale; no smoothing, original farmer/font changes or image-generation service. Licence audit/source hashes/native rectangles are under assets/licenses/craftpix and processed/manifest.json. Credits has a linked Craftpix page and both pages fit the minimum portrait/landscape viewports.
- One continuous bending river crosses all five forest rows under timber bridges. Shared surface geometry bakes connected shallow/deep water/banks, with camera-local animated currents. Four original native waterfall frames add textured rock faces, streaks and foam. Channel vegetation is cleared. The waterfall's water centre is traversable; its side rocks stay solid.
- **All water is walkable**, including Home/Farm ponds, forest river/lakes/pools and waterfall centres. Wading uses an ankle crop/pixel waterline and suppresses dust; bridge decks suppress the waterline. No new stamina/swimming/drowning rules. Solid trees/structures/boulders/ruin feet and map bounds remain. River-bank refill approaches remain. Save validation preserves valid wet player/bag positions without a schema change; old crop/farm/inventory/animal/money/migration rules remain.
- Atlas **514 frames / 1024×2048**, including 258 selected Craftpix frames and four original waterfall frames. Unchanged eight-file runtime art allowlist; untouched source ZIPs, unused pack files, PSD/Aseprite, docs and QA images stay outside production. Dependencies unchanged. Source pipeline is reproducible.

Validation: **83/83 npm tests**, production build, archive hash/runtime allowlist audit and real-input local Chromium acceptance. Direct river crossing away from bridges, wet-position Save/refresh/Continue, Home/Farm pond movement, waterfall-centre traversal, native Boar hit/flee/reload, four quiet woodland species, ruins/plants, keyboard/held touch, seven viewports (1440×900, 1280×720, 1024×768, 844×390, 390×844, 360×640, 640×360), both credits pages, Canvas/WebGL night water; zero browser errors/warnings/failed/foreign requests. Final idle animation correction was separately checked with production river traversal. Evidence: verification/asset-water/results.json, final-smoke.json, build-audit.json and screenshots. Production **1953156 bytes / 12 files / eight runtime art files**.

Limitations: mobile is Chromium emulation; physical phones, Safari/WebKit, Firefox/Edge and long-session/device performance remain unverified. The other combat species' art remains a future art pass. User's live save was not modified; only isolated QA saves were used. Final human visual/balance/competition acceptance is not claimed. No push, publish or deployment.

---

# Wilderness expansion — 2026-10-07

**Implemented locally, version 0.4.0 / schema 9**, under the user's explicit follow-up for a much larger forest, grouped species, fruit and dangerous treasure. This supersedes the earlier compact/one-enemy scope. Farming, paid fields/farms, City economy, characters, club, continuous midnight, manual sleep and 25%-coin Stash Bag recovery remain.

- Forest is **5120×5120**, exactly **20 times the former 1280×1024 area**, with the same character/camera scale. Twenty connected regions include jungle, savanna, bamboo, pine, marsh/river, highlands, caves/ruins and a stylized snowy lake. Original Homewood moves with its geometry to the southwest. Broad trails, five timber bridges, two animated pixel waterfalls, cave chambers, shrine/camp/ice landmarks, groves and staggered vegetation provide routes and exploration destinations. Forest's full south road returns Home; safe spawns/cooldown remain.
- **22 species / 68 individuals**, each species with its own territory and group of 2–4. All requested animals, Polar Bear and Snake are included alongside the existing Boar. Difficulty varies by species: 2–9 club hits, 8–28 damage, 210–400 charge speed, different awareness/warning/recovery and 16–28-unit collision bodies. Defensive species notice at shorter distances; predators notice farther away. Warnings precede committed charges, solids/territories constrain movement, and the whole group shares the player's 750ms invulnerability. Dead animals return on a later day; individual partial health/position persists. One hide per animal driven away. No additional weapon, armor or loot table.
- **Nine foods / 63 daily nodes**: original Berry/Guava/Mango plus Banana, Orange, Papaya, Coconut, Dragon Fruit and Pineapple. FOOD has three icon tabs/page with previous/next and keyboard selection; EAT 1/full-energy rules remain. Market pages accept every fruit and Wild Hide. Original crop/fruit/hide daily prices keep their old hash indices.
- **14 rare guarded caches**, with fixed rewards **313–462 coins**, are hidden off the safe roads in danger regions. Chests reveal near the player; live animals within 240 units prevent recovery. The snake chamber cache requires an actual fight. Each pays once per save and remains collected after sleep/midnight/travel/reload. MAP gives broad discovered-region clues, never exact cache markers.
- **M / MAP** opens a paused canvas discovery map, showing explored regions, player position, regional danger and species hit/damage values. Touch region selection, keyboard arrows and compact portrait/landscape layouts work. Return signs direct west/south to Homewood. Far-north night remains dark beyond the stepped visibility radius in Canvas and WebGL.
- Schema **9** accepts **1–9** with no deletion. Schema-8 forest player, injured/dead boar and Stash Bag positions translate by +4096 Y, preserving their old geometry and all stocks/coins/care/farms/price seed. New animal, discovery/cache and fruit fields are bounded independently. Daily forage/animal respawn does not reset cache/discovery. Details: SAVE_SCHEMA.md.
- Original code-authored art adds **100 original frames and two licensed LimeZu tree palette adaptations**, atlas **150 → 252 frames / 1024²**. Existing farmer sheets, facial pixels, original boar, dependency versions, font/audio and eight-file runtime asset allowlist remain. Evidence: assets/licenses/wilderness-expansion.md, ASSET_LICENSES.md, ASSET_CREDITS.md and AI_USAGE.md. No download, image service, runtime remote asset or backend.
- The enlarged world uses cached static terrain, indexed shared collision masks, nearby-only animal simulation and camera-bounded night Graphics. Other maps retain their established collision/rendering architecture. Development collision outlines remain available; fullscreen separate Phaser canvas UI is preserved.

## Verification

Baseline **38aacac** was clean, with **71/71 tests** and successful production build. Final **78/78 tests pass**, including seven new wilderness tests covering exact area/species groups/safe bodies, every region/fruit/cache route, species attacks/damage/shared immunity, territory/day respawn, guarded single-payment treasure, schema-8 translation and stable original prices, malformed schema-9 repair. Existing farming, City, expansion, sleep, boar/death and Stash Bag tests remain.

`npm run build`: PASS. **12 files / eight art files / 1,784,795 bytes** uncompressed; no vendor/source/QA/unused pack shipped. `git diff --check`: clean. Evidence: **verification/wilderness/**.

- `results.json`: complete expansion browser suite PASS. Actual Home-edge entry → walk to Emerald Falls → discover/collect → MAP pause/keyboard → walk back Home/save/reload. All 20 habitats load and all 22 species are photographed in their territories. In a disposable prepared save, the snake chest initially refuses collection, actual directional club attacks defeat the three guards, the cache pays **424 coins (60 → 484)**, and reload preserves collection. No gameplay mutation hooks; fixtures prepare isolated starting saves, while travel/collection/combat/UI/reload use actual inputs.
- `final/results.json`: PASS on final production UI for map/fruit/market pages at **1440×900, 1280×720, 1024×768, 844×390 landscape, 390×844 portrait**. Food controls stay within the viewport and touch consumption works. An actual river-bridge crossing passes; animated waterfall screenshots inspected. Far-north Canvas/WebGL both preserve .78 distant night overlay. Local 60-frame sample median **16.7ms**, not a physical-device performance guarantee.
- `forest/results.json`: retained first-visit/closed Outfitter/full-energy/zero-energy eating, touch attacks, two-finger held movement, second-death bag replacement and refresh during defeat fade PASS across five sizes. `city/results.json`: retained quantities/repetition/hours/gates/aid/crop panels/collisions/prices/migration/signs/Farm trade PASS. Every completed browser report has empty error, warning, failed-request and foreign-request arrays.
- Visually inspected regional art/animal groups, snow/dry tree palette detail, cave recovery, responsive map/food layouts, bridge/falls and far-north night. UI review found a clue/footer overlap and portrait food navigation outside the panel; both were corrected and final five-size checks repeated. The first cave test's exact-position navigator was disrupted by intended knockback; its combat driver now approaches/aims during the encounter and passes.

The full expansion playthrough preceded only final UI spacing/species-stat text and development-debug preservation. Affected map/food/market layouts and renderer checks were rerun on the final production build. The prior complete new-game farming survival loop is historical evidence; this extension reruns current rule and focused City/Farm/forest regressions without claiming another freshly grown full crop loop. The user's live save remains untouched; QA uses disposable isolated Chromium contexts.

## Remaining limits

This mixed-climate map is a stylized game wilderness, not realistic ecology. Species/groups and treasure rewards are initial balance requiring longer human play review. Touch is Chromium emulation; physical phones/notches and Safari/WebKit/Firefox/Edge are unverified. Audio remains silent and existing unlimited water/repeated farm layouts remain. No known blocker in the tested expansion loop. Local commit only; no push, publish, deploy, additional equipment, crafting, weather, relationships or unrelated progression.


---

# Project status

## Milestone 3 — Forest, Foraging & Survival V1, 2026-10-07

**Implemented and verified locally, version 0.3.0 / schema 8**, under the user's explicit Milestone 3 brief. The prior scope closures below are historical. The existing Phaser/Vite architecture, separate canvas UI, boy/girl sprites, Home/interior/Farm/City, four crops, paid fields/farms, daily prices, merchant hours, saved fatigue, continuous midnight and manual sleep remain.

- Home's marked north road reaches the full edge and enters a handcrafted **1280×1024 Forest**. Safe inward arrivals, short fades and the shared 700ms cooldown prevent bounce. The safe entrance, winding path, berry clearing, guava grove, deep boar territory, shrine pond, logs, rocks, flowers and irregular tree groups use shared collision/save geometry. The forest's south edge returns Home.
- Six saved forage nodes offer **Wild Berry (+12 energy / 6 base coins), Guava (+20 / 12), Mango (+30 / 20)**, one collection per node/day with small pixel effects. Midnight refreshes availability; scene reentry/reload does not. BAG has compact FOOD and EQUIPMENT pages. EAT 1 removes exactly one, caps energy at 100 and refuses consumption at full energy. City Market buys all three fruit and **Wild Hide (18 base coins)** with the established saved daily multiplier; crop prices retain their original indices.
- One compact **OUTFITTER** stall sells a permanent **45-coin Wooden Club**, auto-equipping once and blocking duplicate purchases. Its keeper follows **07:00–20:00**, with a concise closed message. Gear shows ownership/equipped state, EQUIP, hide count and where to sell it.
- One **Wild Boar** wanders within a deep territory, checks solids/line of sight, telegraphs for 650ms, commits to its charge and pauses after hit/miss. Three directional club hits defeat it and give one hide. Each swing costs five energy with a 450ms cooldown; boar damage is 15 with 750ms player invulnerability and small collision-safe knockback. Swing/hit/hurt/defeat pixels and subtle shake provide feedback. Space/K and the visible equipped ATTACK button work alongside USE, including two-finger movement/attack. Partial boar health persists; a defeated boar returns on a later day.
- At zero health, input stops, the farmer falls/fades and wakes beside the bed at **06:00 next day**, with health/energy 100. Existing care/growth settles once. Exactly **floor(25% of carried coins)** enters one saved forest Stash Bag; no empty bag is created. USE recovers it once. A second defeat permanently replaces the previous bag. The loss and respawn save atomically before animation, so refreshing during the fade cannot duplicate loss. Bags survive travel, midnight, sleep and reload; unsafe coordinates repair to nearby ground.
- Forest night preserves the cool global overlay but adds stepped 16-unit pixel visibility bands around the player. Distant areas remain dark. After 20:00, boar movement increases 15% and awareness from 190 to 228 units, retaining the warning/grace. One saved night warning, three paused first-visit messages and first-defeat recovery guidance explain the rules.
- Schema **8** retains the storage key and accepts **1–8**, preserving crops, paid farms, currency, character, city progress, daily price seed and time. New forest inventory, collection state, club, boar, guidance flags and stash fields validate independently. Details: SAVE_SCHEMA.md. No new dependency, backend, downloaded asset or runtime remote request.
- Original native pixel art adds items, boar poses, bag, landmark and adapted original stall. Guava/Mango trees derive from the existing **LimeZu CC BY 4.0** tree with original fruit clusters. Atlas now has **150 frames**; the same eight runtime art files remain allowlisted. Creator/license/modification and AI evidence is recorded in ASSET_LICENSES.md, ASSET_CREDITS.md, assets/licenses/milestone-3-forest.md and AI_USAGE.md. Existing dependency license evidence remains applicable. Sounds remain silent because no suitable licensed effects are supplied.

### Checks and evidence

Baseline `878d155` was clean; **56/56 tests** and production build passed before editing. Final **71/71 tests pass**, including 15 forest/survival rule tests and retained farming, city, expansion, migration, collision and day/night regressions. `npm run build` succeeds; **1,711,341 bytes**, **12 files / eight art files**, with no vendor/source/QA/unused pack assets shipped. `git diff --check` passes. Evidence is under **verification/forest/**.

`natural-loop.json` and `results.json`: PASS for a real New Game girl/starter → three cared-for Tomato nights → harvest/sell → buy club → forest guidance → berry/guava collect → eat → boar damage/three-hit defeat/hide → mango collect → reentry preservation → fruit/hide sales → sleep/new-day respawn → player defeat → saved bag reload → return/recovery → Home save/reload. No gameplay mutation hook or injected growth/stock/time was used in this playthrough. It finishes day 6 with **101 coins**, club and saved guidance intact, and no remaining bag.

`final/results.json`: final-build checks pass at **1440×900, 1280×720, 1024×768, 844×390 landscape and 390×844 portrait** for FOOD/GEAR/Outfitter/market bounds, keyboard/mouse/touch eating and attack, pause, tutorials, closed merchant, zero-energy recovery and full-energy rejection. Additional checks cover two-finger movement while attacking, second-death bag replacement, refresh during defeat fade, and **Canvas plus WebGL night rendering**. `city/results.json` passes the existing focused economy suite: quantities/repeat protection, hours, touch/keyboard, seed aid, crop panels, collisions, reload prices, migration, signs and retained Farm board trade. Every completed browser report has empty error, warning, failed-request and foreign-request arrays. Screenshots were visually inspected for night readability, original art/layering and responsive panels; the final inward spawn keeps the farmer clear of the portrait hotbar.

QA uses isolated Chromium contexts and disposable local saves, actual keyboard/mouse/touch and copied read-only snapshots. The user's live save was untouched. Full-loop evidence predates only the final inward-arrival and independent touch-release corrections; the affected navigation, five-size layout, combat touch and interrupted-defeat cases were rerun on the final build. Commands and evidence distinctions are in VERIFICATION.md.

### Remaining limitations

Physical phones/notches and Safari/WebKit/Firefox/Edge are unverified; touch is Chromium emulation. Combat/economy/night values need human play review over longer sessions. Audio remains silent, and existing unlimited water/repeated farm layouts remain. Pixel assets are code-authored with disclosed AI assistance; final competition declarations and visual acceptance remain human work. No known blocker remains in the tested loop. Local Git commit is authorized and created for this milestone; **no push, publish, deploy or Milestone 4 work**.

---

## Clean shops and continuous day/night — 2026-10-07

**Implemented on Milestone 2, version 0.2.1**, following the user's screenshot and explicit request. The text-heavy shop is replaced by a compact pixel card: four crop-icon tabs, item/name, bag count and unit price, 1/5/Max or All selection and one Buy/Sell action with exact quantity/total. The ? button opens optional care/growth/yield/shop/price details. BAG uses the same icon tabs. World remains visible around the smaller card. Keyboard focus starts on the primary action; left/right cycle crops, up/down/Tab navigate and Enter confirms. Mouse/touch and Escape remain.

- Full daylight, warm dusk and dawn fade into dark cool moonlight. Full night starts at **20:00**; only 22% of the scene remains visible beneath the overlay. No lamp/player/window light halo is added. Existing original sun/moon HUD glyphs track the phase; butterflies hide at night.
- Both shops now operate **07:00–20:00**. Shopkeepers disappear outside their opening hours and reappear on reopening, including immediate load/travel. Closed counters show their hours and cannot open trade. Panels continue pausing the world, clock and fatigue.
- The minute-precision clock runs continuously through **23:59 → 00:00**, incrementing the day without teleporting, forcing sleep or restoring energy. Midnight evaluates care/growth once for every farm and derives the new day's market prices. Crops grow when properly cared for even if the player stays awake. Before-dawn watering guidance points to 06:00.
- Awake time drains **one energy per 30 game minutes**, in addition to existing farming costs. The fractional remainder is saved. Energy bottoms at zero; movement and the route home remain available. Sleep is always chosen at the bed: daytime **06:00–20:00** sleep wakes at **20:00** that day; nighttime sleep wakes at **06:00** next day, or the same morning when already past midnight. The bed shows the wake time before confirmation and restores energy to 100. Early-morning sleep cannot grant duplicate growth. Daytime sleep leaves the 20:00–22:00 portion of evening watering available.
- Schema **7** retains the storage key and accepts versions **1–7**, preserving previous crops/coins/farms/care/positions. Saves now permit 00:00–05:59 and include fatigueMinutes. No offline simulation, forced sleep, damage/death, extra crops, weather or audio is introduced. Raster art, dependencies, existing licence evidence and the eight-file runtime art allowlist remain.

### Checks and limitations

`npm test`: **56/56 pass**; `npm run build`: succeeds. Six new meaningful rule tests cover all sleep boundaries, awake/shared-farm midnight and single growth, skipped-window care/death, saved fatigue/zero energy, clock/hours and lighting bounds. Existing regression assertions follow schema 7 and midnight growth text. Build inventory: verification/day-night/build-files.json (12 files, eight art files, 1681390 bytes). Whitespace diff check passes.

Browser evidence is under **docs/verification/day-night/**. `results.json`: PASS for awake midnight/single growth/new prices, saved pre-dawn time/fatigue, all four bed sleep cases, zero-energy movement, merchant closing/hiding, optional details, keyboard crop/purchase and touch seed selection. Shop/detail/BAG bounds pass at **1440×900,1280×720,1024×768,844×390,390×844,360×640,640×360**. The short landscape layout compresses its vertical spacing. Night/day/sunset, phone/short-shop and optional-detail screenshots were visually inspected. Browser error/warning/failed/foreign-request arrays are empty.

`city/natural-loop.json`: complete real New Game starter → three cared-for Tomato nights → City sale → Strawberry purchase → four cared-for nights → second sale → Save/refresh/Continue PASS, finishing day 8 with 138 coins and four total produce sold. The actual bed uses Sleep-to-20:00 for evening care and Sleep-to-06:00 overnight; no growth/time/stock injection. Reload verifies saved stocks/care/progress and exact fatigue accounting for the awake minutes after Continue. The prior energy-only assertion was corrected because resuming near a fatigue boundary legitimately costs another point. `city/results.json` (full suite) and `city/final/results.json` (focused pass): shop quantities/repeat gates/closed hours/price reload/touch/crop panels/collisions/signs/retained Farm trade PASS with empty browser errors/warnings and only local requests. QA uses isolated disposable saves and actual keyboard/mouse/touch; the user's save is untouched. Existing maps/assets/fullscreen architecture and Farm expansion remain.

Limits: Chromium desktop and touch emulation; physical phones/notches and Safari/WebKit/Firefox/Edge are unverified. Fatigue/darkness are initial balance values requiring user play review; night intentionally has limited visibility. Silent audio/unlimited water/repeated farm maps remain. No push, publication, hosting or competition submission.

---

## Historical Milestone 2 — City and Economy V1, 2026-10-06

**Completed on the existing Phaser/Vite foundation**, version 0.2.0. The latest user brief explicitly opens City and four crops. Home/interior/Farm, the original three starter seeds, matching paid fields/additional farms and manual bedtime are preserved. No push, publish or deployment.

- Home’s east road reaches the actual boundary and leads through a 140ms fade to City (64,488), facing inward. Wooden CITY arrow signs fit their boards and have accurate post collision. The matching HOME sign/west road returns to Home (2176,640). Safe inward spawns and the retained 700ms cooldown prevent return loops; Home/Farm travel is unchanged.
- Lantern Square is a compact **1280×896** scene: connected entrance/shop/plaza/return roads, original quiet stone paving, fountain, benches, lamps, flowers/planters, noticeboard, barrel/crate decorations, tree borders, five future-use buildings and two staffed outdoor awning stalls. Outdoor stalls fit the existing scene architecture without introducing shop interiors. Ground dimensions/camera bounds follow the map; backdrop grass fills small viewport margins. Shared solids cover counter shelves/posts, merchants, fountain, buildings, props and signs; foot depth/nearest rendering remain.
- Clara’s Seed Shop (**07:00–20:00**) sells Tomato/Strawberry/Carrot/Corn; Niko’s Produce Market (**07:00–21:00**) buys harvested produce only. Paged canvas panels show icons/name/owned coins, fixed seed or exact daily sale price, growth/yield/description, per-button quantity and total; Buy 1/5/Max and Sell 1/5/All. Disabled controls explain funds/stock/caps, with a precise empty-bag or missing-selected-crop message. Market defaults to an available harvest. Large quantities retain exact totals and a readable quantity summary. Shops pause movement/time and support keyboard, mouse, touch and Escape; closed signs/approach hints show hours. Existing-open panels can finish safely.
- Four playable crop definitions: **Tomato 10 seed / 18 base sale / 3 nights / yield 2; Strawberry 18 / 28 / 4 / 2; Carrot 28 / 70 / 4 / 1; Corn 40 / 36 / 5 / 3**. All share existing AM+PM care, wilt/recovery/dead clearing and manual overnight growth. Original 24×32 art has eight distinct states per crop. Crop panels/timers/stages, item icons and harvest effects are data-driven. Q cycles planting seeds; BAG offers a canvas selector. No regrowth/eating mechanic.
- Pure market hashing combines unsigned save seed, day and crop index, choosing an inclusive 85–120 percent; sale is max(1, round(base × percent / 100)). Low <95 / High >105 / otherwise Normal, with text and appropriate pixel arrows. Fixed seed prices never change. New saves get a local random seed; old saves use seed 1; reload cannot reroll. Cared-for worst-day net per plot is positive: **20 / 30 / 32 / 53 coins**. This is initial balance rather than a long-term player study.
- First harvest briefly expands the city-selling objective and guides toward the real route; the saved first city visit removes the temporary guide and gives one nonblocking merchant greeting. Saved flags cover harvest/visit/buy/sell. Existing Farm board Tomato convenience trade remains, now using the same daily produce price; it still manages matching fields and farms. City sells the other three seeds and offers full quantity controls.
- Atomic bounded integer transactions cap each item at 9999 and coins at 9,999,999. A 240ms input gate and transition guard reject duplicate purchases/sales. City seed aid offers one free Tomato seed per day only with <10 coins, no seeds/produce and no living crop; it persists and cannot duplicate within a day. No money grant or automatic sleep is introduced.
- Schema **6**, same storage key, accepts **1–6**. Migration preserves money, original tomato keys/indices/care/timestamps, day/time/health/energy, starter progress and all schema-5 paid farms/fields. New keys/defaults initialize independently; invalid positions repair to nearby safe ground. Market seed, selected crop, tutorial flags and lastRecoveryDay save atomically. Shop panels are transient and resume closed after reload. No offline advancement.
- Original art extends the atlas from 96 to **135 frames**, with provenance in crop_art.py/manifest and assets/licenses/milestone-2-original-city.md. Existing LimeZu CC BY 4.0 credits/evidence remain; no new download/dependency/font/audio pack. Sound-request hooks cover entry/open/buy/sell/failure/close; floating coins and a brief shop coin-count animation give feedback.

### Checks and evidence

- Baseline c3142d4: clean tree, **39 tests**, production build and isolated Home/interior/Farm bed/doors/geometry/five-size browser checks passed before editing.
- Final `npm test`: **50/50 pass**. Eleven added tests cover all crops/growth/status, buy/sell quantities and bounds, inventory separation, prices across 100 days/reload, hours, tutorial/edge safety, schemas 1–5 with paid farms, input gates and seed-aid recovery. Original tests remain, updated for opened City, schema 6 and daily prices. `git diff --check`: clean.
- Production build passes; **1,679,409 bytes** uncompressed, **12 files total / eight allowlisted art files**. No source/vendor ZIP/manifest/QA image/unused pack enters dist. Inventory: verification/city/build-files.json.
- `tests/browser/city-economy.mjs` real new-game playthrough: girl / 60 coins / starter three seeds / Tomato AM+PM care over three sleeps / first-harvest City objective / Home east route / City sale / buy Strawberry / Home/Farm return / four cared-for sleeps / second City sale / Save/refresh/Continue. Actual acceptance save is day 8 with **138 coins**, two original Tomato seeds retained, four total items sold and all four tutorial flags true. Numeric sale, inventory and save assertions pass; seeded day-8 prices remain stable. Evidence: verification/city/natural-loop.json and completed-two-crop-city-loop.png.
- Full suite and final focused production pass: Buy 1/5/Max, Sell 1/5/All, rapid mouse buy/sell bursts, disabled low-funds/no-produce controls, closed hours and finish-before-close pause, three repeated City round trips, keyboard purchase, touch buy/seed selection/Corn planting+water, all four crop panels, daily-price rendered label reload, legacy City migration, stall counter/post/back/fountain collision, sign text fit and preserved Farm-board trade. Paged shops/scene/controls/text at **1440×900, 1280×720, 1024×768, 844×390, 390×844** stay in the viewport; no scrolling/DOM HUD. Final large-quantity portrait check retains exact amounts. Reports: verification/city/results.json and final/results.json. **Zero browser errors, warnings, failed HTTP requests or foreign runtime requests**.
- Art check: 32 crop frames are nonempty 24×32 with eight unique pixel hashes per crop. Gallery and art-results.json under verification/city; city, short/portrait shop, objective, crop and final loop screenshots visually inspected. QA uses isolated profiles/disposable saves and real inputs; no gameplay mutation hook or user save edits. Chromium emulates touch; no human acceptance is claimed.

### Files and limitations

Main changes: data/{crops,locations,mapLayouts}; systems/{state,save,economy,market,inputGate,recovery,farming,watering,cropStatus,context,navigation}; UI/{TradePanel,interface,Hud,FarmOffice,FarmGuide,CropInfo,pixelWidgets}; WorldScene/main; art/{Terrain,worldArt,Atmosphere}; original-art scripts and committed town atlas/manifest; economy and updated regression tests; browser City suite/evidence; README/AGENTS/design/status/architecture/technical/AI/credits/licence records. Package version changes to 0.2.0; dependencies remain unchanged.

Known limitations: initial balance, silent audio hooks, unlimited water, repeated-map farms and shared unvisited care; no shop interiors (outdoor stalls deliberately chosen). Physical phones/notches, Safari/WebKit, Firefox and Edge are unverified. Future-use buildings remain decorative. No known blocker in the tested City economy loop. Recommended next milestone: deliberate food/energy use and small farming-quality improvements, beginning with real-device and longer balance testing; deferred forest/weather/festival/relationships require new authorization.

---

## Historical Milestone 1.2 — paid farm expansion and manual bedtime, 2026-10-06

**Completed after the user explicitly selected implementation now.** Home/Farm remain the only active outdoor locations; City is closed. Approved art, Phaser/Vite, fullscreen canvas UI and runtime asset allowlist retained. No push or publication.

- Removed the southern Home FARM board/hint/collider shown in screenshot 1. Remaining first-junction lettering is smaller, centered and verified inside its board; guide text now references one sign.
- Three additional fields cost **120 / 180 / 240 coins**. Locked land opens a purchase dialog and cannot consume seeds/energy; Farm board lists purchases. Each bought field repeats the original **192×192, 4×4, 48-unit cells** with matching border/north fence/scarecrow/barrel/flowers/pebble composition. A verified crossing road is moved below field 2. Four owned fields provide 64 cells.
- Farm board provides existing **10-coin tomato seeds / 18-coin produce sales** so harvests fund expansion while City remains closed. After all four fields on the newest farm are owned, buy another farm for **600 × farms already owned**. New farm starts with field 1 unlocked. Previous/Next at the board selects owned farms. Duplicate/insufficient purchases cannot spend coins; purchase confirmation and disabled buttons show affordability/gating.
- Schema **5**, same save key, accepts **1–5**. Old field indices/care/history/inventory/currency persist into farm 1. Each farm has independent ownership/crops, selected farm persists, locked slots cannot restore forged crops. All farms share time/energy/inventory; watering expiry and explicit sleep settle every planted crop. Crop panels use actual interaction coordinates across all farms.
- Automatic sleep/teleport/day rollover removed. Late night waits at minute 1439 (**23:50 clock**) while movement/actions remain available. A nonblocking prompt encourages returning home. Only bed → Sleep advances the day, grows cared-for crops and restores energy. Refresh at late night preserves the same day and location.
- Four-choice canvas menus fit 640×360 after a small row-spacing correction; no DOM HUD/new image/dependency/remote runtime asset. Eight allowlisted art files unchanged.

### Checks and evidence

- `npm test`: **39/39 pass**, including paid purchases, duplicate/insufficient funds, all 64 cell geometry/contexts, farm independence, shared overnight care, v1–v4 migration, malformed ownership and manual-night persistence. `npm run build`: succeeds; **1,648,968 bytes** uncompressed and eight runtime art files. `git diff --check`: clean.
- `tests/browser/expansion.mjs`: remaining sign text bounds/removal; insufficient coin UI; all three field transactions; seed buy/produce sale; new farm confirmation/gate; switching/save/reload; all **64** cell targets; planting/watering independent indices 0/16/32/48/64; late-night movement/save/refresh and explicit bed Sleep. Six-size menus: **1440×900, 1280×720, 1024×768, 844×390, 390×844, 640×360**. Touch purchases at small sizes. **40 mobile crop targets** across four fields and farm 2 retain clear panels/player/crops/controls. All requests local; no page errors, HTTP failures or console warnings. Report: verification/expansion/results.json.
- Updated `farming-information.mjs` full regression: new game/starter/edge travel, sixteen original cell targets, AM+PM water/rest, three cared-for nights/harvest, saved refresh, locked purchase dialog, shed’s eight approaches, road gates, remaining sign, interior bed/exit and five sizes. No errors/warnings. Report: verification/expansion/regression/results.json.
- Screenshots inspected: remaining sign fit, removed south board, repeated field design, expanded crop panels, narrow/short purchase menus. Browser QA used isolated contexts/disposable saves and actual keyboard/mouse/touch. User-origin saves untouched.

### Limitations

Prices are editable initial balance, not a long-term economy/playtest result. Additional farms reuse the same authored map, accessed at the board; they do not extend one continuous world. Care continues on unvisited farms. A 100-farm validation limit bounds browser save size. Unlimited water and silent audio remain. Physical phones/notches, Safari/WebKit, Firefox and Edge remain unverified; mobile tests are Chromium emulation. City and other previously deferred systems remain outside this extension. Final human acceptance is not claimed.

---

## Historical Milestone 1.1 — farming information and new-player navigation, 2026-10-06


**Completed on the existing foundation.** Phaser/Vite, approved retro art, fullscreen canvas, gameplay rules, maps, controls, save key and City closure retained. No push, publication or deployment.

- One contextual crop panel: tomato icon/name, four earned growth stages, segmented progress, remaining cared-for nights, next eligible stage, current condition and explicit AM/PM watering states. It hides on empty targets or away from the field and avoids the inspected crop/farmer. Responsive placement is 368×160 display pixels normally, 352×160 in short landscape. Touch controls remain accessible; short landscape tool text sits below the hotbar. Farm action prompts remain visible; informational toasts defer visually while inspecting.
- Timer is a pure projection of authoritative growth and the existing watering-window evaluator. No real-time countdown, additional crop simulation or offline progression. Three fully watered sleeps still yield two tomatoes. Missed/skipped morning care cannot promise growth that night; wilt/dead/ripe replace the estimate with an action message. Saved planting timestamps are optional; unknown legacy planting times are not invented. Recovery is shown for the repairing window.
- Two original wooden FARM/down-arrow boards: first Home path junction and south exit, both west of the road, with accurate 8×16 post collision. Compact proximity hint; signs never transition. Seed collection shows a seven-second nonblocking objective, then a small leaf icon. An eight-direction pixel waypoint aims at the actual (480,1136) edge-zone centre, clips to the gameplay safe area, updates with movement and hides when the exit is visible.
- Schema **4**, same storage key, versions 1–4 supported. `hasVisitedFarm` starts false and saves true on Farm entry. Legacy inference uses Farm/City location, planted/dead crops, tomatoes or sales; starter seeds alone do not imply a visit. Completed guides remain disabled after return/sleep/reload; New Game resets them. Optional plantedDay/plantedMinute/recoveredWindow preserve crop evidence.
- Original nine-by-nine glyphs: leaf, game clock, sun, moon, drop, warning, basket and cardinal/diagonal arrows; existing tomato item icon and font reused. Board art is deterministic integer Phaser geometry. No new runtime art file, asset family, dependency, external download or licence. Evidence: assets/licenses/milestone-1.1-original-ui.md; AI and Credits/Licences updated.

### Checks and evidence

- Baseline: clean working tree at 54502da, 29/29 tests and build; isolated new-game/movement/browser inspection before editing. Supplied screenshots were inspected as visual references.
- Final `npm test`: **35/35 pass**. Six added tests cover pure crop information, complete growth/care/save loop, paused/recovery/late-plant/dead states, versions 1–4 visit migration, waypoint target/hiding, sign footprint and eight-direction arrow pixels. Existing tests updated only for schema 4.
- `npm run build`: succeeds; eight allowlisted runtime art files, no source/vendor/QA files, no new dependency. `git diff --check`: clean.
- Production `tests/browser/farming-information.mjs`: starter objective, sixteen plot targets, planting, AM/PM water, rest, three nights, harvest, save/reload, Farm round trip, shed/gates/signs/expansion/house bed and doors; read-only snapshots, real keyboard and mouse. Zero page errors/console warnings.
- `farming-information-layout.mjs`: growing/paused/ready/dead panel at **1440×900, 1280×720, 1024×768, 844×390, 390×844**, explicit bounds/crop/player/control/prompt non-overlap; guides/signs, real CDP touch plant/water/move/save, window expiry/recovery/dead clearing, legacy migration and fresh game. Zero errors/warnings.
- `farming-information-targets.mjs`: all sixteen planted cells at both mobile sizes remain inspectable and clear; seven-second objective minimization, visible-exit waypoint hiding and pause/return-to-title. Zero errors/warnings.
- Existing supplemental `farming-care-touch.mjs`: one-miss recovery/two-miss death/clear, persistence/v2/unsafe shed repair, five indoor collision approaches, eight crop visual states and both touch sizes. Zero errors/warnings. Optional QA_OUTPUT preserves prior milestone evidence.
- Reports and inspected screenshots: `docs/verification/farming-information/`. Complete-loop checks passed before the final narrower landscape panel; final targeted layout/all-cell checks passed after that adjustment. The complete final build rerun also passes with matching report/screenshots.

### Changed files

- New: src/systems/cropStatus.js, navigation.js; src/ui/CropInfo.js, FarmGuide.js, statusArt.js; tests/farming-information.test.js; tests/browser/farming-information.mjs, farming-information-layout.mjs, farming-information-targets.mjs, farming-information-resources.mjs; original-art evidence and browser reports/screenshots.
- Updated: src/data/crops.js, mapLayouts.js; src/systems/state.js, save.js, farming.js, context.js; src/scenes/WorldScene.js; src/art/worldArt.js; src/ui/Hud.js, interface.js; src/main.js, index.html; existing schema assertions in farming-presentation/stabilization and farming-care-touch; README, GAME_DESIGN, ARCHITECTURE, TECHNICAL_NOTES, VERIFICATION, AI_USAGE, ASSET_CREDITS, ASSET_LICENSES and this status.

### Limitations and next milestone

No known blocker in the tested Milestone 1.1 loop. Physical phones/notches, Safari/WebKit, Firefox and Edge remain unverified; mobile checks are Chromium emulation. Old saves with no surviving evidence of a past Farm visit cannot infer that history and retain the guide until entry. Unknown old planting timestamps remain unknown. Unlimited water, silent audio hooks, retained midnight return and produce held in the bag remain foundation limitations. Human acceptance of the new UI is not claimed.

**Ready for a separately authorized City and Economy milestone.** This milestone stops here; City, shops, markets, additional crops, quests, weather, forest and combat remain deferred.

---

## Historical foundation status

**Milestone 1 — final foundation repair and farming presentation, 2026-10-06.** Existing Phaser 3/Vite, approved retro asset family, fullscreen canvas HUD, controls and localStorage retained. City remains closed. Approved future systems are design-only in GAME_DESIGN.md.

## Completed

- Greenhouse/shed supports, walls, foundation and step use shared ground-contact collision rectangles; roof projection is not solid. Feet probes align with the visible feet. Foundation depth gives natural front/behind ordering. Nearby Farm barrels/crate moved clear of the right approach. Unsafe saved positions relocate to nearby walkable ground.
- Fence tiles intersecting roads are removed before collision creation. Three-tile gate opening, solid remaining sections, road-centered down arrow. Wooden roadside sign shows a compact **FARM ↓** hint; only the map edge triggers travel.
- Compact responsive farmhouse, integer camera zoom **2**, larger furnishings, clear sleeping/kitchen/storage/entrance groups. Indoor farmer remains **64 display pixels**, matching outdoors. Full room visible on desktop; limited camera following on mobile. Authored envelope 800×480 is approximately 40% smaller than the old 1344×800; actual dimensions fit each viewport below.
- One coherent **192×192 tilled field**, sixteen contiguous **48×48 cells**, subtle seams, individual targeting, props outside plots and accessible surrounding ground. Removed development labels. Overgrown expansion land has weeds/stones and a compact town-unlock hint, no planting or soil fatigue. Saved unlock flag defaults false.
- Eight original tomato states: seed, sprout, young, flowering, ripe, dry, wilted and dead. Dark watered soil contrasts with lighter dry soil. Data-driven crop metadata includes future category/food/regrowth fields without adding new playable crops.
- Plant, water and harvest particles/pickup, compact feedback and silent sound-event hooks. No placeholder audio.
- Explicit **06:00–12:00 / 16:00–22:00** watering windows shown in HUD. One missed window wilts and pauses growth; timely watering recovers. Two consecutive misses kill. Three fully cared-for nights produce two tomatoes. Saved window cursor makes tick/rest/sleep/reload evaluation idempotent.
- Schema **3**, same localStorage key; versions 1/2 migrate while retaining crop indices, money, inventory, day, reward and valid progress. Room-size metadata safely remaps indoor positions across screen sizes. No offline progression.

## Interior sizes verified

| Viewport | Logical room | Camera zoom | Farmer display height |
| --- | --- | --- | --- |
| 1440×900 | 704×400 | 2 | 64px |
| 1280×720 | 624×304 | 2 | 64px |
| 1024×768 | 496×336 | 2 | 64px |
| 844×390 | 480×304 | 2 | 64px |
| 390×844 | 480×368 | 2 | 64px |

## Controls and commands

WASD/arrows move; E/Space uses the nearby target; 1/2/3 select Seed/Water/Harvest; Escape pauses. Touch direction pad, tools and USE are available. Walk through Home’s south map edge or Farm’s north edge to travel. Use the porch to enter Home and the indoor south door to leave. Bed offers rest until 16:00 or next-day sleep. Pause → Save; refresh → Continue.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Current local development port: 5174. Production preview: http://127.0.0.1:4173/ . Refresh to load the latest build. Development-only `?collisions` shows solid geometry; `?qa` provides read-only verification snapshots.

## Verification

- **29/29 Node tests pass**, covering window boundaries, care/growth, energy, legacy migration, repeated save evaluation, responsive position repair, road fences, crop targeting, greenhouse geometry, existing map/house/pond and storage regressions.
- Development smoke passes: title canvas, new boy game, keyboard movement, schema 3 and no console errors (development-smoke.json).
- Production build succeeds. Same eight allowlisted runtime art files; no vendor archives, unused pack files, QA galleries or new runtime dependency.
- Real browser full loop: girl → starter crate → edge travel → all sixteen plot targets → plant → AM water → rest → PM water → sleep for three nights → harvest → Save → refresh → Continue. Locked expansion refuses planting.
- Eight greenhouse approaches, open road gate/solid fence, non-transition sign, indoor bed/door and farm HUD at all five requested sizes. Screenshots inspected.
- Supplemental browser fixtures cover one miss/recovery/two-miss death/clear, old v2 save, unsafe greenhouse save, compact indoor furniture/wall collision and real touch farming/movement at both mobile sizes. Zero browser page errors/console warnings.
- Current scripts: tests/browser/farming-presentation.mjs and farming-care-touch.mjs. Evidence and JSON reports: docs/verification/farming-presentation/. Earlier suites use historical coordinates; see VERIFICATION.md.

## Files and systems

Added systems/watering.js, scripts/crop_art.py, tests/farming-presentation.test.js, two browser scripts and docs/FARMING_PRESENTATION_PLAN.md. Updated crop/interior/geometry/location/map data, farming/time/state/save/context, WorldScene/CollisionWorld/PlayerView, worldArt/Atmosphere, main lifecycle and canvas UI. Regenerated town PNG/JSON/manifest (96 frames). Updated README, design, architecture, technical, art, status, verification, AI and asset credit/licence records.

## Known limitations and next milestone

No known blocker in the verified foundation loop. Physical phones, safe-area notches and non-Chromium engines remain untested; mobile results are Chromium emulation. Small screens scroll through the room. Water is unlimited; sound hooks are silent; harvest stays in inventory while City is closed. Existing automatic midnight return is retained until the future day/night survival redesign. The supplied attachment contained text, not the referenced screenshots, so live game and project evidence guided inspection.

**Recommended next milestone: City and Economy**, under a separate instruction. Future ten-crop/orchard, market, food, weather, forest/combat/recovery, tool/weapon and story designs are documented only. No push or publication.

Final development smoke: desktop keyboard movement, schema 4, first-time waypoint, pause freeze, fullscreen/no scroll pass with empty errors/warnings. Fresh Chrome identified the initial-origin 404 as `/favicon.ico`; the shell now declares an empty inline favicon, preventing that browser request without adding a runtime asset or visible DOM UI. Fresh-process dev/production resource checks pass.

Fresh-origin resource check is reproducible with `tests/browser/farming-information-resources.mjs` (PLAYWRIGHT_MODULE, optional CHROME_EXECUTABLE, DEV_URL and GAME_URL). It launches a new isolated browser; only same-origin files and locally generated data/blob images are accepted.
## 2026-10-20 — previous UI fully restored

The user rejected the experimental UI redesign. All new component, token, cached-frame, border, modal, button, slot, tab, HUD-meter and responsive UI styling was removed. Normal gameplay again uses the established fixed **2×** canvas UI, original palette, original drawn borders, original screen-specific modal overlays and original control states. The newer animated **SIMPLE LIFE** welcome/title presentation is the only retained visual change. Gameplay rules, data, saves, event names, callbacks and button IDs are unchanged.

Verification completed with **393/393 tests passing**, a successful production build, and live local-browser inspection at `http://127.0.0.1:5173/`. The animated title remains intact, while the Controls/Getting Started flow again shows the established cream canvas panel, original stepped border, original buttons and original overlay. Existing automated viewport tests cover the HUD, hotbar, bag, pause/settings, audio, journal, trade/shop, resource/order and dialogue layouts across desktop and phone sizes. Physical devices, safe-area hardware and non-Chromium browsers remain unverified. No deployment, push or publication was performed.

## 2026-10-20 — square layered UI border refinement

The established pixel UI remains in place, including its dark outline, layered bevel, cream fill and hard-edged shadow. Only the four cut/decorated corner treatments and small edge-leaf ornaments were removed. The shared border accent is now **#c6d799** across canvas panels, buttons, slots, HUD vitality frames, mobile controls, journal checkbox and wilderness-map UI outlines. The animated **SIMPLE LIFE** title artwork and all screen layouts, gameplay logic, data, saves, event names, callbacks and button IDs remain unchanged.

Verification covered the shared frame regression test, the full automated suite, a production build and live local-browser inspection of the title, gameplay HUD/hotbar and pause modal. The remaining small green marker beside the focused title action is the existing keyboard-focus cursor, not a border ornament. No deployment, push or publication was performed.

Follow-up: the mobile movement joystick now keeps its default white/cream knob while held or dragged instead of applying the green selected-state fill. Movement input, pointer ownership and release/reset behavior are unchanged and covered by the joystick regression test.

## 2026-10-20 — fountain island palette-match review asset

Created the requested review-only `fountain_island_matched.png` and `fountain_island_compare.png` through deterministic Pillow/numpy pixel editing. The native 213×214 canvas is preserved; all output edges use hard 0/255 alpha, every opaque sprite pixel belongs to the sampled 24-color target palette, and the comparison enlarges the sprite exactly 2× with nearest-neighbor. The edit softens saturation, shifts foliage toward the game's olive lawn, reduces small grass sparkles/petals, retains the mushroom groups, replaces the fuzzy perimeter with a stepped two-pixel cream curb, adds flat lower-right shadows and clips the path at the curb. This is not yet integrated into the game.

## 2026-10-20 — original fountain island v3 review set

Created a new, compositionally distinct fountain island on the second built-in image-generation pass, then normalized and processed it with project-local Pillow/numpy scripts. The 192×160 native sprite has exactly five asymmetric plant groups, a notched stepped curb, an original octagonal basin, two falling streams, two landing ripples, no path/mushrooms/sparkles/loose petals and a locked 24-color palette sampled from the supplied game screenshot. The fit check was corrected from the light lawn to the screenshot's sampled mid-olive. Six 8-fps water-only frames, a 1152×160 sheet, mask, static base and 4×/plaza GIF previews were exported. Automated pixel checks confirm hard alpha, palette membership and byte-identical non-water pixels. This remains a review asset and is not integrated into the game.

## 2026-10-21 — user fountain island integration follow-up

The user-supplied fountain island replaces the central City fountain as an active eight-frame sprite. It is displayed at exactly **135%** native size and centered at `(704, 420)` in the 640×264 main road plaza, with equal visual road clearance above and below. Nine stepped solid rows follow the island silhouette: the entire visible island blocks walking, while its transparent outer corners remain traversable.

The water loop was rebuilt from the stable complete source without reusing the rejected large-arc geometry. A flood-filled basin mask is eroded one source pixel from the rim and combined with source-water-only bowl, jet and stream regions, producing a 1,247-pixel animation mask that touches no stone, plant or shadow. The three landing coordinates are `(82,109)`, `(102,85)` and `(124,109)`; the top-jet tip is `(102,73)`. At 8 fps, fixed one-pixel columns carry two-pixel highlight dashes down one row per frame; compact flattened ripple radii 2/4/6 use 0/3/5 offsets; six fixed glints and three bowl pixels remain deterministic. Every frame uses only the source's three water colors, changes 1.363–2.727% of the mask, changes zero rim-guard/non-water pixels, and keeps the largest changed pale component to 9×3 pixels. The eight-to-one seam and all transition-similarity assertions pass.

Verification: the final full suite passes **396/396** and the production Vite build succeeds. Live Chromium inspection at the City fountain fixture confirmed centering, 135% size, consecutive eight-frame animation and collision at the lower curb. No save shape, gameplay rule, remote runtime dependency, backend, deployment, push or publication changed. Physical-device and non-Chromium review remain limitations.

## 2026-10-21 — barber chair and touch-bending grass replacement

The barber room now uses the newly supplied olive chair while retaining the exact previous 28×42 atlas frame, `[2,4,26,40]` visible bounds, 2× display scale, position and solid footprint. Small ground-grass sprites now use the newly supplied olive/yellow tuft in the exact previous 79×79 frame, `[9,10,69,79]` visible bounds and 0.46 scale. Magenta and two Pixel Snapper matte-edge shades are removed with binary alpha and nearest-neighbor processing.

Two same-size grass phases use a maximum four-source-pixel integer row shear. When the player's grounded feet touch a tuft, it bends away from the player; after departure it eases back to the unchanged base frame. Airborne players do not trigger it. The effect is render-only and does not change vegetation identity, collection, collision, inventory or saves. Evidence and hashes: `assets/licenses/barber-grass-v2/SOURCE_RECORD.md`; review outputs: `output/art/barber-grass-v2/`.

Verification: the final full suite passes **398/398**, the production Vite build succeeds, and `git diff --check` is clean. Live Chromium fixture inspection confirms the olive barber chair renders without its magenta matte at the established station size and the replacement ground-grass renders at the established outdoor size; walking the player into a tuft exercises the directional bend, while the automated interaction test confirms its return to the base frame without state mutation. No gameplay rule, collision, event name, button ID, save shape, remote runtime asset, backend, deployment, push or publication changed. Physical-device and non-Chromium review remain limitations.

## 2026-10-21 — landscape refresh checkpoint 1: ground grass review

Completed only the user-requested first approval checkpoint. Separate current-game/reference sampling records dominant colors and average HSL for lawn, foliage, clumps, trunks and warm shadows. The current lawn averages HSL `76.35° / 22.82% / 44.13%`; the reference lawn averages `71.13° / 25.15% / 43.60%`. The player measures 176 visible pixels in the supplied screenshot and 64 visible pixels in the native 40×72 runtime frame. A locked 28-color olive family is saved as JSON and PNG.

Six one-image built-in generation calls produced initial and corrected A/B/C lawn sources. Local nearest-only processing yields three 128×128 candidates with one opaque component, no pinholes, exact locked-palette membership and byte-equal opposite edges. The first fit check was rejected internally for excessive brightness/noise; corrected A/B/C average 42.31%, 44.17% and 44.60% lightness respectively, versus 44.13% in the current lawn. Repeat, current-game/player fit and reference comparisons are under `output/art/ground-grass-review-v1/`; provenance is under `assets/licenses/ground-grass-review-v1/`.

Runtime integration is deliberately paused for the user's approval. No ground texture, clump, tree, shadow, density, camera grade, gameplay, collision, save, UI, production allowlist, backend, deployment, push or publication changed. Later asset stages have not started.

Verification: all **398/398** tests pass, the 188-module production Vite build succeeds, the review processor compiles, and `git diff --check` is clean. Because this checkpoint does not alter the runtime, browser FPS and before/after viewport captures remain correctly deferred until an approved texture is integrated.

## 2026-10-21 — landscape refresh checkpoint 1 approved ground integration

The approved A/B/C lawn textures are now local runtime assets for Home, Farm and unpaved City grass. A coordinate-stable chunk hash selects A/B/C at approximately **20% / 45% / 35%**; the requested 12×12 review uses exact counts 29/65/50 (**20.14% / 45.14% / 34.72%**) with seed `20261021`. Tiles are never rotated or mirrored because their top-left lighting is directional. The textures are composed into each location's one-time terrain bake before existing paths, water and City paving, so the change adds no persistent display objects or per-frame draw work. The expanded Forest deliberately retains its distinct habitat ground materials.

The reference palette audit was corrected to use tree-canopy-only crop windows, separate from tall-grass crop windows. Reference canopy foliage now averages HSL `65.97° / 28.68% / 36.10%`, versus current foliage `73.89° / 26.15% / 35.17%`. The future nature palette retains the approved lawn ramp, shifts future foliage toward yellow-olive, replaces near-black green with softened dark olive, reserves `#3B4028` as the one outline color and uses a warm red-brown trunk ramp. Exact current clump, bush, broadleaf/round/tall-tree and palm frame/opaque/rendered footprints and unchanged collision/trunk anchors are recorded in `output/art/nature-redesign-v1/existing-footprints.{json,md}`.

Verification: all **400/400** Node tests pass, the 189-module production build succeeds, the three PNGs appear in the explicit build allowlist, and a disposable Chrome fixture at Home `(1100,850)` completed with zero page errors or console warnings. Requested review images are under `output/art/ground-grass-review-v1/` and `docs/verification/ground-grass-review-v1/`. Gameplay, collision, harvesting, saves and UI are unchanged. Clump, bush and tree generation/integration has not started; work is stopped at the requested approval checkpoint. No deployment, push or publication was performed. Physical devices and non-Chromium browsers remain unverified.

## 2026-10-21 — corrected lawn and tall-grass checkpoint

The rejected full-tile A/B/C selector has been removed. Home, Farm and unpaved City lawns now use B continuously, with C appearing only inside irregular world-coordinate alternate masks. Their average HSL lightness differs by **0.417**, so no rectangular brightness step remains. A is used only in a stepped Forest outer-edge shade band. The six-tone lawn ramp now averages **71.52° hue**; deterministic 40–120 rendered-pixel dark pockets cover **17.58%** and move pixels exactly one locked palette step darker. Sparse brighter V marks are generated in loose fixed-seed world clusters. Paths, water and City paving continue to paint over the lawn layer, keeping it below all objects.

The corrected 12×12 2× repeat and the fixed Home `(1100,850)` camera comparison are under `output/art/ground-grass-v2/` and `docs/verification/ground-grass-v2/`. Browser verification records camera zoom **1.5**, position `(1100,850)`, zero page errors and zero console warnings. The ground correction preserves gameplay, collision, harvesting, UI and saves.

Three new clump candidates were generated in separate built-in image calls and processed at their final scale-1 footprints: wide **48×34**, tall **30×48**, small **38×38**. Every candidate has binary alpha, one object, locked five-color membership and nearest-only processing. Existing relevant non-integer scales are bushes **0.45**, broadleaf/round trees **0.7**, tall-thin tree **1.1** and palms **1.66**; old clumps remain integer scale 2. The palm's retained 1.66 scale can look inconsistent beside new scale-1 art under camera zoom 1.5. Review sheets, fit checks and the non-integrated fixed-camera projection are in `output/art/tall-grass-clump-review-v2/`.

The three clumps are **not integrated**: no Phaser preload, atlas, placement, harvesting, contact animation, collision or save behavior changed. Final verification completed with **400/400** Node tests passing, a successful 189-module production build and a clean `git diff --check`. Work is stopped at the requested clump approval checkpoint; bushes and trees have not started. No deployment, publication or push was performed. Physical-device and non-Chromium review remain limitations.

## 2026-10-21 — clump checkpoint v3 and ground-origin audit

The approved v2 ground remains installed. The faint fence-like forms in the earlier fit mockups came from repeated fine motifs inside the B texture: the mockup used the 12×12 repeat directly, not the gameplay capture. A same-coordinate final/no-world-tuft/diff audit proves the forms are not produced by the dark-pocket overlay or sparse V marks. A cleanup experiment exists under `output/art/ground-grass-v3/` but was deliberately not integrated.

The rejected point-sampled clumps are superseded by three review-only majority-vote reconstructions from fresh separate generated sources. Raw canvases are 1491×1055 (wide), 1254×1254 (tall) and 1254×1254 (small). Detected logical cells are 19px, 20px and 20px; native silhouettes are 48×32, 33×49 and 37×37 before fitting to final 48×34, 30×48 and 38×38 scale-1 canvases. Every output has one connected object, binary alpha, no magenta/pink, all five locked colors, no enclosed pinholes and zero isolated interior color pixels. They remain outside runtime pending approval; no bush/tree work started.

At camera zoom 1.5, each scale-1 source pixel maps to 1.5 screen pixels, so nearest rendering alternates one- and two-pixel widths. A zoom-2 option would make scale-1 nature pixels exactly 2×2 on screen, reduce visible world width/height to 75% of the current view and visible area to 56.25%, while the separate UI scene stays viewport-anchored. Existing fractional-scale nature assets would still need replacement. The future tree checkpoint now includes a fourth newly generated final-size scale-1 palm instead of recoloring the old 1.66-scale palm. No camera or scale setting changed.

Verification completed with **400/400** Node tests passing, a successful 189-module production build, clean diff whitespace and live inspection in the existing local Chrome game at 1440×722. A separate headless Chrome process could not start in the desktop sandbox, so that scripted capture was not counted as a pass. No clump, palm, camera or UI setting was integrated.

## 2026-10-23 — ground v3 cleanup, approved clump integration and tree feasibility

The fence-like repeat and the two pale-grey marks were confirmed as baked pixels in the old A/B/C source render, not game objects, clump pixels, world-space tufts or pocket-overlay pixels. A, B and C were repainted using only the locked six-color lawn palette; B is now the clean continuous base, B/C lightness differs by **0.011 L**, and all opposite tile edges match exactly. Same-coordinate before/after evidence outlines the old repeated band. The corrected 12×12 repeat contains no recurring fence row. Dark pockets now use two deterministic world-coordinate noise scales and hard stepped thresholds rather than row-banded ellipses: 128px-boundary columns average **12.364** edge pixels versus **12.712** over all columns, so the mask is not tile/chunk aligned. Coverage remains **17.56%**.

The user-approved clumps are integrated. The selected wide source is the second candidate (`exec-aa76a8dc-7dd2-439d-82e6-1ea41f72b7be.png`), chosen for fewer, broader blade groups. A local 144×48 sheet contains 48×48 wide/tall/small cells at runtime scale **1**. Every existing grass record deterministically expands to a group of **2–5** slightly overlapping sprites with an 11px Poisson-disc foot spacing, mixed variants, seeded horizontal flips and per-foot Y depth. A small flat cached contact shadow uses 25% alpha and a slight right offset. Only display children move on player touch; the original gather/collision point, vegetation ID, inventory behavior and save record remain unchanged.

The isolated daylight Home fixture at player `(1100,850)` confirms the scale-1 clumps beside the player under the unchanged normal camera zoom **1.5**; evidence is `docs/verification/ground-clumps-v3/`. The production build succeeds and the corrected full Node suite passes **409/409**. No camera, UI, gameplay, event, collision or save schema changed; no deployment, publication or push was performed.

Tree feasibility stopped at the requested checkpoint. Measurements from the clean generated clumps show a largest reliable single-call logical axis of **49px**; **50px** is the recommended module ceiling, far below the requested 175×225 tree and 176×256 palm. Six review-only scale-1 modules were therefore generated separately—leaf clusters 32×24, 42×32 and 50×40; trunks 34×50 and 26×50; root flare 52×28—then reconstructed by logical-cell majority vote and palette locking. Fixed seed `20261021` assembles one 175×225 test tree for 1×/3× fit review. All modules have binary alpha, one connected object and locked palette membership. They remain under `output/art/modular-tree-feasibility-v1/`; none is in `public/` or Phaser. Bushes and production trees have not started.

## 2026-10-23 — road, river, storage, wardrobe and reload follow-up

The final composed Home, Farm and Forest maps now run one shared scenery-clearance pass after procedural companions and ground details are added. Natural object bases and full visible lower tree trunks are kept off dirt roads; every prop/detail/grass footprint is kept off ponds, rivers and bridge decks. City retains its specialized identity-preserving roadside relocation, which already keeps tree roots and lamp bases off paved surfaces without invalidating collected-plant save IDs. The reviewed Home road tree is removed. The large Home barrel at `(1432,416)` has all ground growth cleared from its 98×101 visual footprint, and its neighboring crate moved to `(1560,448)` for a 30px gap.

Round glasses are retired from both Nell's clothing-shop Extras and the personal Wardrobe. Existing saves safely discard the retired ownership/equipped value during validation; straw hat and canvas backpack remain as the two Extras, and the glasses slot stays null for schema compatibility.

Reload now immediately shows a centered, pixel-styled **SIMPLE LIFE** loading card and real Phaser asset progress instead of a bare green field. It fades only after the title canvas is ready and never remains as a DOM HUD. The loader and all runtime assets are local.

Verification: focused map/appearance/City tests pass; the production Vite build succeeds; live production-browser checks confirmed the reload loader, cleared Home road, title transition, and Wardrobe Extras `1 / 2` Straw hat plus `2 / 2` Canvas backpack. The complete suite is **414/416 passing**; the only failures are the already-recorded `barber-grass-v2` runtime-reference assertion and Pixel Snapper manifest count drift (`50` actual vs `49` expected), neither introduced by this follow-up. Physical-device and non-Chromium testing remain outstanding. No deployment, publication or push was performed.

## 2026-10-24 — stone collision, first-paint loader and tree prompt follow-up

Ordinary Home/Farm rocks, the wider Forest boulder render and all solid Dark Forest rocky landmarks now have collision matching their complete visible stone silhouette plus 48 world units of lower-body clearance. This prevents the farmer sprite from visually passing through a stone when its foot point is below the art. Rock surface clearance uses the same wider rendered bounds; two procedural boulders that crowded the stable `east-fruitvale-fruit-extra` forage point are omitted so every saved fruit ID and approach remains usable. Roads, water, bridges, portal approaches, all forty Forest regions and existing save data remain connected.

The loading card's critical background, sizing and pixel-panel CSS is now inline in `index.html` before the body, while the normal stylesheet retains the runtime fade. A reload therefore paints the dark green styled loader immediately instead of briefly exposing unstyled serif text on white. Tree interaction and the desktop tree-click path now share an **88-world-unit** reach, allowing the pointer and chop action at the visible front edge of enlarged trees without extending grass interaction reach.

Verification: the focused stone/Forest/vegetation/loader group passes **48/48**. The complete suite is **416/418 passing**; the same two previously recorded unrelated failures remain (`barber-grass-v2` runtime-reference assertion and Pixel Snapper manifest count `50` versus stale expected `49`). The production Vite build succeeds. Live local-browser checks confirmed the inline first-paint dark background, successful title/game load, zero console errors or warnings, and the actual tree-edge pointer with `Hit / Chop tree / 0 of 3 hits`. Stone geometry is covered across Home, Farm, standard Forest boulders and every solid rocky landmark, including route/forage regression coverage. No asset, save schema, backend, deployment, publication or push changed. Physical-device and non-Chromium testing remain outstanding.

## 2026-10-24 — large barrel collision follow-up and playtest release

The authored Home and City barrels now derive their collision from the active Pixel Snapper barrel's alpha-visible bounds at its real runtime scale, rather than retaining the retired 28×30 legacy footprint. The resulting local footprint is `[25,19,47,117]`: 47×69 world units for the visible barrel plus 48 world units of lower-body clearance. This blocks the visible wood from every approach and stops a farmer approaching from below before their upper body can appear inside the barrel. Compact player-crafted garden barrels retain their separate intentional decoration geometry.

The focused collision/map/placement/save checks pass, the complete suite is **417/419 passing**, and both normal and explicit playtest builds succeed. The only failures are the same unrelated pre-existing art checks: `barber-grass-v2` runtime reference and Pixel Snapper count `50` versus stale expected `49`. In an isolated live browser fixture, hundreds of repeated upward inputs left the farmer stationary with their head completely below the barrel.

At the user's explicit request, the exact playtest build was uploaded as runtime-only Vercel Build Output v3 to the existing `htetaungkyaw71s-projects/simple-life-playtest` project. Protected stage **dpl_7FfJFEUTD3RKeHUNyBgx2iMs1wKA** was READY before promotion; its HTML and application bundle matched the local artifact byte-for-byte. The promoted public [Simple Life playtest](https://simple-life-playtest.vercel.app/) returns HTTP 200, retains `noindex, nofollow, noarchive`, and its public HTML and application bundle still match the staged local SHA-256 values exactly. The post-deploy error scan found no runtime logs on this static host. No source commit/push, project/protection change, backend, function, paid resource or competition submission was performed. Physical-device and non-Chromium testing remain outstanding.
