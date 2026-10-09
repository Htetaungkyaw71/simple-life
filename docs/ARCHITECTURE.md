# v0.8.0 — resource and hunting flow

forestResources.js lazily resolves 240 stable candidates against shared collision/water geometry after module initialization. resources.js owns pure availability, target selection, bounded collection and daily-persistence rules. contextFor prioritizes a selected Hand's stone pickup over nearby grass, while Axe prioritizes animals before tree work; targeted ground taps can choose a stone directly. WorldScene translates pointer animal bounds into exact IDs and native facing; main routes pure attack/collection, renderer feedback and local save.

combat.js reuses directional hitboxes/line-of-sight/cooldown with selected free AXE or existing permanent CLUB. Quiet woodland motion moved from WoodlandView into pure stepWoodland; WoodlandView projects saved position/health and hides defeated actors. Existing hostile-boar motion and guards remain. Atomic lethal loot checks protect bounded inventory. BagPanel displays Meat on Food page two and Stone in Gear. eatFood independently caps health/energy and refuses waste; UI emits both effects. No backend, runtime remote assets, crafting or new scene architecture.

---

# v0.7.3 — presentation repairs without saved-state changes

HeldWateringCan anchors Axe at the existing directional farmer hand, grips native wood-end row 13, rotates/mirrors the blade outward, chooses behind/front depth by facing and hides its supplemental hand rectangle for Axe. Water/Shovel retain their existing transforms and hand rendering. Pure harvesting and saved utility state remain unchanged.

City data relocates four cottages, shortens two north circulation spurs and places sunflower props inside each front parcel. Shared house silhouette geometry still drives collision; resident routes derive from current house indices and positions. The road regression uses exact house masks and complete pot footprints. No tree identities change.

Separate canvas UI composes original procedural vitalMeter frames/badges/glyphs with health/energy fill rectangles and highlight strips. Meter dimensions and responsive layout remain shared; fill/shine widths update together. No DOM HUD, saved fields, schema change, backend or runtime-art addition.

---

# v0.7.2 — matched character and seed presentation

matched_residents_art.py reads the existing processed farmer sheets and adapts eight hair/clothing palettes into town-person-* cells. The full atlas pipeline and idempotent extend-character-art.py integrate these cells without modifying the player sheets or previous frame rectangles. ResidentView selects idle/1–4 walk frames at the same 125ms cadence, 2× scale and .94 foot origin as PlayerView. Pure resident schedules/movement/commerce are unchanged.

garden_tools_art.py authors planted seed grains/mounds separately from inventory packet art. FarmView continues choosing cropVisual/markers through established systems. HeldWateringCan vertically flips only Axe, uses an upper grip with outward side anchors and front depth in all facings, and extends the visible hand to that grip. Other tools keep established transforms. No persistent state/schema/backend/UI architecture changes.

---

# v0.7.1 — commuting and presentation

`systems/commute.js` owns pure 16-unit dry-grid path search using existing walkability, full house clearance and bridge-aware water queries. Bounded cached routes and clock-derived poses give dawn departure and doorstep arrival by 20:00. `systems/residents.js` builds door/porch/work routes from data-driven house indices, preserves midday patrols, starts returning from the current patrol point, and reconstructs commuting on entry/reload. `ResidentView` now also renders the three merchant identities from the existing Pipoya sheets; WorldScene gates commerce on staff availability plus the existing shop hours. No saved fields/schema change or backend.

`large_houses_art.py` independently authors native house cells and exports exact solid alpha runs to `data/largeHouseGeometry.js`; map definitions pass frame names into the shared geometry query. Legacy masks remain for legacy cells. `FountainView` and `WaterView` provide transient, pause-safe fountain flow and camera-local water/reflection presentation. Canvas mask alpha matches reflection alpha because the pinned Canvas geometry mask resets global alpha. Reflections are clipped to water and hidden over bridges/while jumping.

WorldScene validates direct pointer targets for residents, sellers and existing location contexts before selected tool ground actions; distant people give a proximity hint. Application keeps pure action/state/save handling and existing restrictions. Separate Phaser UI owns matching meters, direct-touch hints and responsive crop placement; no DOM HUD or new runtime asset file.

---

# v0.7.0 — City layout and ambient residents

`data/city.js` supplies a fourfold 2560×1792 City, authored paths/sidewalks/squares/gardens, connected canal and two vertical timber crossings. `citySurface.js` bakes stepped curbs and quiet staggered masonry into the existing native terrain canvas; `cityBridge.js` draws opaque crossings from the shared water/bridge definitions. Existing Home/Farm geometry, City shop/gate coordinates, pure commerce and schema 11 remain. House atlas alpha masks stay byte-identical to the shared collision silhouettes. City tree rendering reuses existing original olive Forest canopies; Home/Farm/Forest foliage are unchanged. `CityLights` adds restrained stepped pools/filaments for City lamps only.

`data/residents.js` authors eight City and two Home residents and short safe routes. Pure `systems/residents.js` owns transient walking/waits, facing, nearby conversation and soft player spacing; it does not add saved fields, schedules, relationships or rewards. `ResidentView` selects native Pipoya frames and foot depths; WorldScene gates movement/update while paused and routes E through existing canvas dialogs. Utilities/shops keep their context priority. Staffed merchants retain their established open/closed rules. QA snapshots add read-only resident positions/frame/facing. `city_art.py` extends the existing atlas pipeline; no new runtime file, backend, visible DOM HUD or dependency.

---

# v0.6.2 — state-aware vegetation

src/data/vegetation.js registers authored tree props/root masks and original grass under stable coordinate identities with spatial buckets. src/systems/vegetation.js owns pure nearby cutting/gathering/placement validation and atomic energy/inventory/removal updates. State stores removals/placed clumps separately from immutable map data, with farm-specific keys. Shared walkability/line-clear/save/jump/combat queries consume removed roots. Outside Forest, the existing static collision group is rebuilt only after cutting; Forest keeps shared pure queries.

worldArt records exact sprites/shadows; VegetationView destroys removed visuals and filters canopy motion. GrassView refreshes data buckets while retaining its camera-local pool. Existing ForestView checks fruit availability against cut fruit trees. The prior HeldWateringCan hand attachment also hosts shovel/axe to preserve hand/pivot/direction contracts. WorldScene routes nearby pointer/keyboard use; Application applies pure results, feedback, effects and saves. Gear/hotbar remains in the separate Phaser UI canvas scene. No DOM HUD, architecture replacement, backend or runtime remote asset.

---

# v0.6.1 — held tool rendering and energy data

PlayerView owns a HeldWateringCan instance; its update follows foot position/facing/character scale/jump height and selected Water state. Held tool pause/pose is transient. Atmosphere.pour reuses it and animates droplets from its nozzle to the existing action target. New local watering-can-item resolves in town for both HUD and world. data/energy.js supplies farming costs and fatigue interval to pure systems/save validation. Existing plot/ground/time architecture and schema-10 fields remain.

FarmView soilPixels takes world native coordinates so broad noise patches are coherent across cells. Cached textures key exposed-side mask, wetness and native coordinate; grass fringe is restricted to exposed sides with rounded transparent corners. No new runtime file, backend, renderer or DOM HUD.

---

# v0.6.0 — dynamic planting ground

Pure farmGround.js resolves safe nearby ground, free shovel digging, energy costs, cosmetic wet patches and expiry. plots.js provides base/custom plot access and replacement; existing farming/watering/recovery systems consume allPlots so custom beds receive the same daily care and growth. Original paid-field indices remain stable. Additional beds are independent {farm,x,y,plot} records, with individually dug original cells in dugPlots. Existing pure purchase functions remain for old progress compatibility, but no player-facing purchase flow remains.

WorldScene routes a nearby pointer ground target or facing context to Application.use; tools retain Seed/Water/Harvest and add Shovel. FarmView.js draws connected cached native soil, crop sprites and status markers; Atmosphere.pour renders the can and droplet tweens. Wet-ground drawing refreshes only when patch positions change, while AM/PM/day/action updates redraw crop care. Separate canvas UI, local saves and the eight-file allowlist remain. TradePanel pages four crops; BagPanel pages twelve entries. No new backend or renderer.

---

# v0.5.2 full font-frame selection
The local bitmap-font cache has frame:null after XML loading. Glyph frames change the texture's firstFrame to SPACE, so getFrame(texture,null) cannot identify the full sheet. colouredFont now substitutes the explicit __BASE frame for null/undefined, retaining named-frame support, original metrics and cached nearest-filtered colour variants. No new rendering system or persistent state.

---

# v0.5.1 Canvas font colour repair
`coloredFont.js` creates one nearest-filtered 128×64 local canvas texture/cache entry per UI colour, compositing the original font mask with source-in. It shares the original BitmapFont metrics, draws the coloured texture directly and avoids Canvas's ignored tint property. `pixelWidgets.text` selects that font key; no renderer switch, font download or saved field is needed. Whole-minute clock formatting and a labelled Forest Map action remove the remaining HUD ambiguity; numeric tool badges are gone.

---

# v0.5.0 canvas interface
`pixelWidgets.js` shares stepped Graphics frames/buttons and bitmap text; explicit hit-area callbacks preserve the canvas input contract under the UI root's 2× scale. `MenuView.js` composes generic screens/title with retained sprites. `layouts.js` supplies pure responsive bag/HUD/map geometry. `BagPanel.js` presents existing inventory definitions and calls established food/equipment/save/input-gate systems; old seed/food/gear entry points route into it. `controls.js` owns keyboard gating and nearby double-tap recognition; WorldScene dispatches Space jump/K attack/B bag/M Forest map. The HUD rebuilds after location, club-equipment or selected-crop changes. `forestMapArt.js` creates an original local terrain miniature from existing region/water data; WildernessMap caches nearest-filtered canvas textures by viewport and discovery list and draws the player's current facing. No new persistent state, DOM HUD, backend or runtime network art.

---

# v0.4.9 eastern extension and terrain cache
forestExpansion.js defines twenty eastern region bounds and seven boar pairs; woodlandWildlife.js holds the transient native-species roster independently of forest.js to avoid import cycles. Existing data-driven map/growth/combat/save contracts remain. The shared riverRow function supplies separately scalloped left/right native-pixel banks to terrain masks, waterAt, waves, vegetation and the aspect-correct forty-region canvas map. Fruit IDs stay stable while wet points move to nearby clear dry banks before growth reservation.

Terrain.js bakes one coherent source material/mask/distance field, then terrainTiles.js slices it into six cached textures, each at most 2048×2048 native pixels. Global fields preserve tile seams; the temporary canvas is never attached as a visible DOM surface or uploaded whole to WebGL. Original Home/Farm/City caching remains. No backend, runtime remote art, new dependency or schema bump.

---

# v0.4.8 roster/rendering follow-up
Preserved pure systems, data-driven locations, Phaser world and separate fullscreen canvas UI. Only boars participate in saved combat; supplied quiet animals remain transient woodland views. Cache guards use existing territory/combat rules and saved stable boar IDs. Superseded extra animal rigs/credit data leave runtime. Original atlas canopy/palmetto/grass cells and cached deterministic forest-only soil/moss material extend existing rendering; no new backend/dependency or runtime source file. Schema 9 validation retains known progress and discards removed animal IDs. Historical architecture entries follow.

---

# v0.4.7 selected wildlife animation rigs
The established Python atlas pipeline calls wildlife_sprites.py, curates only selected local cells and emits data-driven wildlifeSprites.js. Identical wildlife cell bytes share physical atlas rectangles with separate named aliases. Per-frame provenance remains in the source-only manifest. wildlifeArt.combatAnimalVisual is a pure selector for real frame counts/directions, source facing, idle fallback and per-direction origins. ForestView keeps existing combat/runtime/save inputs, rendering sprites/shadows and health/warning labels without changing gameplay systems. Flee art copies the current pose/origin. animalCredits.js supplies five linked Phaser UI pages; no DOM HUD or runtime asset request. Isolated tests/browser/wildlife-server.mjs prepares QA saves and read-only canvas telemetry, excluded from builds.

---

# v0.4.6 Forest rendering corrections
`BridgeView.js` renders opaque horizontal decks from the same data used by `bridgeAt` and dry vegetation placement. `nightBands.js` merges neighbouring equal-opacity cells in both axes; `ForestView` paints those rectangles with unchanged light levels. `forestPalette.js` derives cached native-size local Canvas textures for Forest trees/bamboo from retained town atlas cells. It maps foliage to shared olive shades while retaining non-foliage colours/alpha; canopy metadata retains source frame identity alongside the generated texture key. No shader, remote image or new production art file.

Forest terraces/ledges are empty and `bankTerrain.js` is removed; teal ferns are filtered before rendering. Existing jump/collision systems remain. Small native wave clusters reuse independent ripple seeds/timing. Fullscreen world/UI scene split, cached ground, saves and pure gameplay systems remain.

---

# v0.4.5 forest shore rendering
`forestGrowth.js` composes ten river-adjacent banks and a shared front profile for low ledges; `bankTerrain.js` renders original continuous earth faces and grassy slopes from that profile. No old stone/stair sprites are rendered. `finishForest` applies habitat tree varieties and full-footprint dry placement after generation, then clears path data while preserving reserved grassy passages. `water.js` centralizes bridge detection and dry footprint checks.

`waterRipples.js` creates deterministic scattered seeds with independent lifetimes/delays; `WaterView` caches them and redraws camera-local waves at bounded intervals. Paused WorldScene skips atmosphere updates. Existing wet ankle crop, bridge suppression, jumping and saves remain. Original palm/willow pixels join the retained atlas through `forest_trees_art.py`; broadleaf rendering reuses existing credited frames. No save schema or world/UI scene contract change. The disposable QA fixture server is development tooling, excluded from production.

---

# v0.4.4 native ground surfaces
`art/groundSurface.js` supplies pure deterministic pixel materials, hash fields and a two-sweep shore-distance transform. `Terrain.js` builds the existing path mask and shared `waterRows` union, paints ground/soil/banks/channels into native ImageData, then stamps original short vegetation/flowers and the retained licensed cliff faces. Regional colours blend across shared boundaries. Static Forest terrain still bakes once into a 2560² texture and is cached across reentry. `WaterView` redraws only camera-local reflection motifs as its simulation phase/camera changes, retaining ankle cropping, bridge coverage and jump suppression. No additional asset file, saved field, geometry, collision, game-system or UI contract changes.

---

# v0.4.3 artwork integration
`scripts/supplied_art.py` reads the user-owned RAR/ZIP without copying source files to the repository, crops/reorders native Channeechan cells into the established 9×4 character contract and adds eight named ToffeeCraft atlas cells. `process-rpg-assets.py` retains original NPC generation before replacing the two player sheets; manifest provenance separates source families. `worldArt.js` maps forest-only scenery at render time, aligns its base with existing map solids and passes actual crown dimensions to `Atmosphere.js`. Gameplay/map coordinates/systems/save schema remain unchanged. Credits are separate compact canvas pages. Read-only QA snapshots expose canopy frames/anchors for visual verification. Regeneration source paths are overridable; builds use committed game textures, never source archives.

---

# Forest growth / jump follow-up — v0.4.2, schema 9
`forestGrowth.js` enriches existing map data with trees, grass, terraces and low-ledge masks, preserving routes/species clearings. Shared `walkable` checks low ledges in addition to indexed ordinary solids; only jump path checks explicitly omit ledges. `jump.js` owns pure transient origin/destination/elapsed/cooldown and 4-unit swept planning, a 600ms arc / 850ms cooldown / at most 128 units. Invalid/blocked landings shorten the leap; solid trunks/structures/bounds never get bypassed. No energy cost or extra invulnerability. Animal hits cancel to the safe origin; existing combat damage stays authoritative. Use/attack wait until landing.

WorldScene integrates actual J/Shift and separate canvas JUMP control, paused simulation and ground-only edge travel. PlayerView's camera anchor follows ground feet, with the sprite offset/three original poses. WaterView hides the ankle crop while airborne. Saves project the grounded origin during flight; pause freezes timers, reload resumes on ground. No saved jump keys/schema change. GrassView creates/pools only camera-local sprites from 256-unit data buckets and eases local contact bending; new frames fit the retained atlas/allowlist. DEV collision outlines include ledges. No backend/dependency/DOM HUD change. Supplied pack replacement is pending rights; see asset audit.

---

# Asset/water follow-up — v0.4.1 / schema 9

`data/water.js` supplies shared pond/river/fall surface geometry and bridge coverage. Terrain bakes the union of those surfaces; `WaterView` draws camera-local currents and the ankle waterline. Water is omitted from physical obstacle masks; waterfall rock banks remain solid. Save validation accepts safe water positions without migration. `wildlifeArt.js` owns direction/frame selection and eight quiet woodland placements. `WoodlandView` uses collision-safe transient wandering/fleeing with no new saved gameplay state. `ForestView` uses native Craftpix direction/action cells for Boar, preserving the established combat system and original remaining species. Craftpix PNG extraction adds named frames to the existing atlas through `craftpix_art.py`; no runtime dependency or remote requests. Credits is a separate page in the canvas UI. Existing world/UI scene division and eight-file runtime allowlist remain.

---

# Wilderness expansion architecture

Data: forest.js composes the preserved starterForest.js entrance, 20 habitats, 63 nodes, bridges/waterfalls, broad clues and 14 caches; wildlife.js defines 22 species and 68 stable spawn IDs. Rules: forest.js manages daily availability, fruit/equipment/bag/cache transactions; combat.js keeps transient per-animal modes under one shared attack clock/damage immunity. Save schema 9 bounds records and migrates the original forest coordinates.

WorldScene retains Phaser world/camera; ForestView renders native animals, nearby hit bars/warnings, hidden caches and pixel waterfalls. Separate UI scene owns WildernessMap, paged food/equipment and existing shop pages. No DOM HUD. Terrain bakes the 2560×2560 source-pixel world once and caches it for forest reentry; the extra giant fallback tile canvas is omitted for this bounded map. Only nearby animals simulate. Forest collision queries index the same rectangle masks in 128-unit cells, avoiding a full obstacle scan per sight/charge step; CollisionWorld delegates forest movement to those pure masks. Other areas keep their established Arcade queries. Night graphics paint only the visible camera bounds and use depth 10000 so southern tree feet cannot render over darkness.

---

# Current Milestone 3 extension — 2026-10-07

Version 0.3.0, schema 8; the historical sections below describe earlier foundations. `data/forest.js` owns authored forest nodes/map/boar territory/guidance, `data/items.js` owns food and club values. `systems/forest.js` owns collection/eating/equipment/recovery/daily refresh and shared sight checks. `systems/combat.js` owns deterministic collision-safe boar movement, telegraphs, melee/cooldowns/damage/invulnerability; transient timers advance only with unpaused simulation. `systems/defeat.js` performs atomic loss/next-morning respawn through the established time/crop rules. Save validation preserves older progress and repairs forest coordinates; SAVE_SCHEMA.md specifies new fields.

WorldScene retains Phaser world rendering/collision/camera. ForestView composes local sprites, pixel feedback and stepped night bands with Canvas/WebGL-compatible Graphics. The independent canvas UI scene adds SurvivalPanel for food/gear/Outfitter; TradePanel pages eight sale items without modifying four-seed selection. Space/K attack; E/USE interaction. No backend, new dependency, remote asset or DOM HUD. The eight runtime art files remain allowlisted; forest sprites fit the existing 512×512 town atlas. Reproduce art with process-rpg-assets.py plus forest_art.py. Licensed tree adaptations retain LimeZu credit; original additions are separately identified in the manifest.

---

# Architecture — City and Economy V1

Phaser 3.90 / Vite 6.4 / JavaScript ES modules / HTML5 Canvas. Fullscreen canvas host, separate Phaser UI scene, localStorage, no backend or remote runtime assets. Gameplay remains in the established pure systems.

## World and presentation

- `src/data/mapLayouts.js`: 2240×1152 Home/Farm and 1280×896 City worlds; authored routes, buildings, props, ponds, fences, fields and townspeople. Footprints share the layout source. The south Home path connects to the north Farm boundary. Pond shore inset is shared with collision rows. Low decorative plants have no collision; trunks do.
- `src/data/locations.js`: safe spawns, connections and functional bed/shop/dialogue contexts. Home exterior, interior, Farm and compact City are active. Separate porch/door approach rectangles gate entry/exit. EDGE_TRAVEL defines automatic edge zones, destination coordinates and inward facing; Application.travel supplies a 140ms fade and 700ms movement-transition cooldown. The northwest active field has 16 cells; first six indices preserve old saves. Three more identical 16-cell fields unlock independently for coins on each owned farm.
- `src/data/geometry.js`: source-pixel house silhouette and shed ground-footprint rectangles and exact two-world-pixel pond rows shared by rendering, physics and save checks. Zero-width shore rows are excluded.
- `src/physics/CollisionWorld.js`: Phaser Arcade static bodies from those rectangles; a 24×12 outdoor / 12×6 indoor feet probe anchored at (x, y−6), with its bottom aligned to the sprite feet, queries occupancy for normalized movement. Bounds and pure save-validation geometry agree. House-only visual clearance checks the visible farmer silhouette against the same opaque house runs; it prevents front-wall/roof overlap without enlarging the feet body for other objects. The independent approach at (480,492) stays reachable. `?collisions` outlines solids only under `import.meta.env.DEV`; production cannot enable it.
- `src/systems/context.js`: approach-gated doors, state-aware crop prompts, claimed crate feedback and land-only shoreline interactions.
- `src/art/Terrain.js`: bakes static ground to a local canvas texture at native pixel resolution. Connected path masks have rounded, perturbed boundaries; original native soil materials fill their interiors. Shared water rows provide the shoreline mask; original groundSurface materials paint banks/channels. One baked ground image replaces thousands of terrain display objects. Rebuild removes the preceding cached texture.
- `src/art/worldArt.js`: native 16-pixel terrain, original 24×32 characters, atlas scenery at two world units per source pixel; object foot depth, interior composition, shadows and crop rendering. Ripe crops pulse a glint.
- `src/entities/PlayerView.js`: two idle frames and four walking frames for each direction. Six columns, four rows in down/up/left/right order; walking 8 fps. Indoor native scale with camera zoom 2 preserves the same 64px displayed farmer and 24×12 displayed feet as outdoors.
- `src/scenes/displayScale.js`: outdoor zoom 1, 2× source pixels. `data/interior.js` configures a compact responsive room within an 800×480 envelope (624×304 at 1280×720). Interior zoom 2; farmer native scale, furniture scale 2. Desktop shows the full room; mobile follows within bounds. Resize remaps position proportionally and repairs collision before rebuilding. Shared mutable furniture/solid arrays keep the physics and save checks synchronized.
- `src/art/Atmosphere.js`: water/fountain, butterflies, one-pixel leaf shifts, dust, interaction flash, proximity-responsive doors, coin transaction feedback. Tree crowns soften when overlapping the player. Presentation only; no game-state changes.
- `src/scenes/WorldScene.js`: preload local assets, movement, collision, context, crop groups, night tint and bounded follow camera. Rounded display coordinates and nearest-neighbour rendering.
- `src/ui/{interface,Hud,pixelWidgets}.js`: independent 2× canvas UI. Smaller HUD frames/hotbar, translucent idle directional buttons, contextual prompt, responsive menus and title Credits with source/licence links. Actual external links open only on user clicks.
- `src/main.js`: existing lifecycle, transactions, saving, menus and dialogue, plus visual money-change feedback.

## Save/gameplay contract

Save key remains `simple-life.save.v1`; schema is **7**, accepting 1/2/3/4/5/6/7. Original six plot indices remain stable inside field 1. Each farm reserves 64 flat plot slots, with index = currentFarm × 64 + field × 16 + original cell index; ownership and currentFarm are stored separately. Migration preserves money/inventory/day/reward/health/energy and crop progress. Added `expansionUnlocked` (false by default), `roomSize`, `missedWindows` and `lastEvaluatedWindow`. `dryDays` remains a compatibility mirror of missed windows, not elapsed days. Older indoor coordinates remap from 1344×800; current saves remap using their saved room size, then shared nearest-safe collision repair runs. Invalid individual fields reset without discarding valid progress. City saves repair to the nearest safe point in the authored town.

`systems/watering.js` owns explicit [06:00,12:00) / [16:00,22:00) windows and an absolute per-window evaluation cursor. Ticks, rest and sleep share idempotent expiry; one miss wilts, two consecutive misses kill, timely watering resets the streak. Legacy saves initialize the cursor at their current completed window to avoid retroactive penalties. `farming.js` owns actions/growth; `time.js` settles both windows before advancing the day. Three fully watered nights mature tomatoes. No offline catch-up.

`data/crops.js` owns category, prices, duration, stage/sprite keys, watering, yield, future food-energy and regrowth metadata. Four field crops are playable. `FIELD` defines a contiguous 192×192 field with sixteen 48-unit cells; target outline/hit testing use those same cells. `cropVisual` selects eight named states. Original art lives in `scripts/crop_art.py`. `Atmosphere.farming` provides restrained particles/pickup; successful actions emit scene `farming:plant/water/harvest` and game `sound:request` events. Audio remains disabled until suitable assets exist. UI feedback is a short-lived compact HUD strip.

Fence props intersecting road collision space are filtered before static bodies are built. Shed walls/supports/base/step share `shedSolids`; roof projection remains non-solid. Sign contexts are hints, not travel zones. Locked plots reject actions before any energy/inventory changes. Field/farm purchases are pure coin transactions; soil fatigue remains absent. The old expansionUnlocked flag is a compatibility field only.

## Asset pipeline

Primary external environment: Serene Village revamped 1.9, LimeZu, CC BY 4.0. Untouched official ZIP: `public/assets/vendor/limezu/serene-village/`. Licence/source evidence: `docs/assets/licenses/limezu/`. `scripts/process-rpg-assets.py` reads native 16×16 source tiles, extracts selected rectangles, adjusts selected greens, adds original missing farmers/furniture/props, and packs 135 frames into the runtime atlas. Original farmer sheets have 24 frames each. The manifest records source rectangles, aliases, modifications and originals. No pack preview or reference-video art is used.

Older Kenney archive and processing script remain historical sources; their environment tiles are superseded. The original `world` atlas retains crops, bitmap icons and interaction markers; the original font is retained. Runtime `town` frames replace older environment/furniture lookups. `vite.config.js` still emits only eight named runtime art files; no archive, manifest, licence HTML, source script or unused pack file enters the production output. Python/Pillow is needed only for art regeneration; npm builds use committed outputs.

## Verification

Node tests cover rules/save failure handling, camera scale, all interaction/district reachability and unsafe legacy positions. Browser tests use isolated contexts and real keyboard/mouse/CDP touch input. Legacy/exploration suites initialize disposable fixtures. DEV or `?qa` exposes cloned read-only state, control rectangles, camera and animation observations; no mutation hooks. Current repair acceptance is `tests/browser/farming-presentation.mjs` and `farming-care-touch.mjs`; sprite-gallery/pixel checks are in `scripts/verify-character-frames.py` and never enter production. Current evidence is under `docs/verification/farming-presentation/`; prior pass reports are historical.

## Milestone 1.1 information layer
`systems/cropStatus.js` derives a pure projection of care/stages/remaining nights from the existing crop/window contract. `systems/navigation.js` owns tutorial eligibility, migration evidence and waypoint target/direction. Optional plantedDay/plantedMinute/recoveredWindow preserve meaningful crop history without offline progression. `ui/CropInfo.js` and `ui/FarmGuide.js` compose into Hud in the separate 2× UI scene. `ui/statusArt.js` stores original integer-pixel glyph masks, reused for wooden Farm boards in worldArt. Read-only QA snapshots expose panel bounds/status and guide state for browser assertions. Runtime asset files, Phaser world/canvas UI division and data-driven map collisions remain.

## Milestone 1.2 expansion and manual time
`data/farms.js` defines four identical 192×192/4×4 field footprints, cell positions, field prices, escalating farm price and a bounded 100-farm save limit. `systems/expansion.js` owns independent field purchases, new-farm gating on the newest farm’s four unlocks, non-duplicating purchases, selection of owned farms and visible/global plot indices. Every farm reuses the authored Farm map and shared collision geometry; field 2’s crossing road moves south of its tiles. Repeated border/fence/scarecrow/barrel/flowers mirror the first field’s composition. Only owned fields render soil/crops; locked ones remain overgrown with a price hint.

`ui/FarmOffice.js` composes small paused canvas menu pages through the existing Interface. The board retains its original Tomato convenience trade, now with the same daily sale price and an input gate; four-crop quantity trading uses TradePanel in City. Purchases and farm switches save immediately and rebuild the existing WorldScene. CropInfo placement uses the interaction’s actual coordinates, so indices beyond the first field/farm remain valid. Shared watering/growth loops settle every owned farm’s plots, including unvisited farms. Migration accepts old saves into one farm/first-field ownership and preserves original crop order/history; locked slots reject forged crops.

`time.tick` keeps the established speed (4.5 game minutes per real second), caps background deltas, crosses midnight continuously and settles each day once through `growOvernight`. Awake fatigue drains one energy per 30 game minutes; `fatigueMinutes` preserves the fractional remainder across saves. Zero energy leaves movement available. Bed `sleep` advances to 20:00 during daytime or 06:00 at night; after-midnight sleep targets the same morning and cannot grant another growth day. Only explicit sleep restores energy and moves to the bed. No offline catch-up or forced sleep. `daylight` projects gradual dusk/dawn and a 0.78-opacity cool night overlay; HUD reuses the original sun/moon masks and displays minute precision. Both shopkeepers are hidden outside 07:00–20:00. Existing lamp art emits no light/halo.

`TradePanel` uses four icon tabs, bag count/unit price, a quantity selector and one gated transaction button with an exact quote. Details are optional on ?. BAG uses the same crop icons with a Select button. Cards are up to 181 source pixels high and at most 252 wide; the existing separate 2× canvas scene retains pointer/touch/Tab/arrows/Enter/Escape. Focus defaults to the primary action. Read-only QA adds lighting, merchant visibility and selected quantity/details; no mutation hooks.

## Milestone 2 City / economy
`data/crops.js` registers four crop definitions and separate seed/produce inventory keys. Existing farming/watering/status systems read each definition. `market.js` derives bounded deterministic day/seed/crop prices and hours. `economy.js` supplies quotes and atomic bounded integer purchases/sales. `recovery.js` gates one free Tomato seed each day for otherwise bankrupt/no-stock/no-living-crop farmers. `inputGate.js` supplies a monotonic UI transaction cooldown. `ui/TradePanel.js` pages one crop at a time in the existing paused UI Scene, shows per-button quantity/total/disabled reason, and supports planting selection. It rejects actions during transition and gates repeat purchases/sales. Shop state is transient; save progress includes marketSeed, selectedCrop, tutorial flags and lastRecoveryDay. No remote service or additional dependency.

Map data shares stall shelf/post/counter, merchant, fountain and sign solids with rendering/validation. Home east and City west zones use existing fade/cooldown travel. worldArt/Atmosphere draw staffed awnings with subtle blinking and closed-hour labels; sound-request events are clean hooks. HUD BAG and Q select planting seeds. navigation/FarmGuide prioritize the city objective after first harvest and remove it after persisted first visit. `tests/browser/city-economy.mjs` uses a natural new-game two-crop loop and disposable edge/transaction/layout fixtures.
