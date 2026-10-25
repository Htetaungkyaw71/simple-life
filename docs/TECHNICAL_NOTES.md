# v0.43.5 — simplified Home menu and City-house reuse (2026-10-23)

Home + Garden registers only `customize-houses` and `customize-wardrobe`. The retained decoration/resource methods are intentionally not reachable from this menu, which keeps future restoration and current save data separate from the visible scope. The two design previews and world sprites resolve existing `cityBuildings` frame metadata; no canvas recolour/export or new runtime image is produced.

Different City frames have different transparent canvases and foundation scanlines. Home placement aligns their visible bottom and horizontal centre to the original building anchor, while Home collision replaces only the original house's generated foundation rows. Blue Slate room textures use design-and-room-size cache keys and a cool slate palette; the starter cache keeps the approved warm room bytes.

The browser QA script closes the post-introduction guide before opening customization and waits for an enabled Continue control plus restored state after reload. This avoids treating title-loader controls as a completed reload.

---

# v0.42.2 — Pixel Snapper native export

The supplied 167×110 RGBA source is already on its final pixel grid and is never resized. All source alpha values are 255; export maps only exact `(255,255,255,255)` backdrop pixels to `(0,0,0,0)`, retaining all non-white channels exactly. The frame uses `(774,3927,167,110)` in the unchanged 1024×4041 atlas. Runtime `artScale:2`, Phaser nearest filtering and the existing disabled smoothing preserve square pixels. Origin offset `(-40,22)` accounts for transparent canvas margins while door offset `(166,200)` keeps the world entry `(2350,438)`.

The asset audit preserves all 1,060 prior frames and their pixels. All 385 tests and the production build pass. Isolated desktop Chromium inspection confirms transparent/crisp rendering, walkable access around the hull and to the doorway, and no console warnings/errors; physical phones and non-Chromium browsers were not newly tested.

---

# v0.42.1 — terracotta cottage export

The selected 1347×1167 RGBA source is reduced by the existing nine-sample bounded area vote into a 120×112 binary-alpha sprite with two native pixels of padding and conservative cleanup. It occupies unused atlas space at `(774,3927)` without changing the 1024×4041 dimensions. Preservation checks compare all 1060 earlier metadata records and every RGBA pixel outside the new rectangle, then compare the installed rectangle to the native derivative. Runtime rendering remains nearest-filtered at integer 2×; no new runtime file, dependency or URL is added. The full suite passes with 385 tests, the production build succeeds, and isolated browser inspection confirms player access with no console warnings/errors; physical phones and non-Chromium browsers were not newly tested.

---

# v0.41.0 — City shop integration verification (2026-10-17)

380tests and normal production build pass. Static tests cover new entrances/rooms/commutes/services/saves and old City identity/connectivity; production-browser fixtures verify both door round trips, purchases, barber reload, outdoor views/night lighting and completed-project scenery. Allowlist48files, old1051atlas frames/pixels plus nine approved native PNGs exact. Isolated43864fixture origin avoids normal4215saves. Café is outdoor seating; mobile/physical devices were not newly browser-tested. [Detailed evidence](verification/city-shops-v1/README.md). No deploy/push.

---

# v0.37.0 — shared home surface and visible-bound placement

homeInteriorSurface.js produces binary-alpha back/foreground RGBA layers using integer rectangles, diamond fills and Bresenham lines. HomeArt caches nearest-filtered CanvasTextures by design/room size. Back surface stays below floor textiles/actors; continuous side/front cutaway faces draw above them. Existing house palettes retain distinct finishes with the approved geometry; old tiled wall/floor overlays and U-rail animation are omitted.

homeInteriorArt.js records source-native visible bounds and1.5 world scale; interior.js derives canvas origins, solids, hearth/bed points and72-unit door opening from shared room data. Fire shares the fireplace frame origin. The jar instance/collider is absent; logs use base138 instead of154. ROOM.bounds begins at112. Existing save validation and room-decor resizing handle displaced positions/paid pieces without a schema change. Camera/character and catalog/placed furniture remain.

The separate home atlas is512×512 with17 preserved frames; town/world/farmers remain byte-exact. Production uses48 local allowlisted files. Unit/path/context/save/build and offline-render evidence are in [verification](verification/home-interior-v1/README.md); browser UI checks are explicitly blocked/unverified, not replaced by the offline composition.

---

# v0.36.3 — one fixed native table override (2026-10-15)

DINING_TABLE_ART in data/interior.js selects table-native-review at2× only for the one fixed home-table. FURNITURE centres its new64×48 world extent inside the previous128×80 extent; its solid is60×28. worldArt uses the trial frame's actual height for ground sorting. Other fixed furniture and catalog/placed-table paths keep their previous art, names and rules. HomeArt omits the extra themed tabletop vase because this sprite already includes the requested three pottery pieces. No save schema or purchase rule changes.

scripts/table_native_sample.mjs appends one32×24 frame from its preserved1039-frame baseline, with12 available material colours (9 used), area-voted native conversion, binary alpha and transparent padding. Its audit verifies every old record/RGBA row, installed pixels, one fixed table and collider. Atlas1024×3602/1040 frames stays below4096;46 runtime files. Native/source/gallery/ZIP/test evidence stays outside dist. Historical chunky/walnut/cedar exporters must not be installed over the current atlas.

---

# v0.36.0 — shared cedar prop frame/scale routing (2026-10-15)

src/data/propArt.js maps 80 legacy names to approved/new atlas frames; propFrame/propScale and art/PropArt.js share logical scaling across static rendering, UI icons, City project previews and wilderness utility sprites. DecorationArt resolves the same frames for catalog, placement and saved pieces, using separately authored upright direction views. Legacy atlas cells remain intact for existing physical size/depth calculations. New native cells are twice legacy dimensions; their render scale is halved. Approved bench artFrame override remains exact. Paths use the shared sprite and stay at ground depth without contact shadow.

Themed rugs/quilt derivatives sample the new native frames with nearest rendering and matching scale/masks; wall ornaments/centre vase and stove pan also use new sprites. Door frame changes resolve through propFrame. Fountain frame aliases share a static basin while moving highlights/rings follow three authored cascades. Sign backing uses a generated frame with compressed upper rail/expanded blank board; text/arrow geometry is unchanged and arrow Graphics sorts above the backing. Generic prop shadows centre on physical width. No saved object ID, collider, map coordinate, cost, schema19, architecture or runtime URL changes.

scripts/cedar_pixels.mjs extends the exact approved bench ramp for other materials and reduces area-voted 2× staging with dark-edge tie preference. scripts/export_cedar_props.mjs stages from the v0.35.3 baseline; --install replaces only the atlas pair, --audit verifies every old record/RGBA row and new installed pixels. scripts/check_cedar_props.mjs verifies source/protected hashes and the 46-file build. Sources and review artifacts stay outside dist. Atlas 1024×3486 remains below 4096. Historical exporters should not be installed over this rollout.

---

# v0.35.3 — one-instance art override (2026-10-15)

A fixed Home bench retains name bench and its existing collision, with data artFrame=bench-cedar-review and artScale=1. The world prop renderer uses that optional frame/scale, bottom sorting and centred existing contact shadow. Existing prop paths stay unchanged. The appended 64×40 frame preserves the old 64×40 world extent; all 958 prior frame metadata records and the complete old atlas pixel region remain exact. Atlas height grows44px to2608; production still emits46 files.

scripts/bench_cedar_sample.mjs stages from the v0.35.2 baseline, records the selected source SHA256, exports a 32-colour muted material palette, and audits old RGBA/metadata, one sample instance, original collider and binary sprite alpha. The 128×80 staging reduction favours dark plank-edge ties. No shared prop conversion changes. Catalog/placed bench variants stay on approved previous artwork until user review; there is no sample shop or new item/save field.

---

# v0.35.2 — shared prop projection, spacing and table domains (2026-10-15)

scripts/export_props_v3.mjs stages from the v0.35.1 atlas. Twenty-eight selected local sources map to 41 existing cells; native area-vote sampling accepts an optional material palette (the old default remains unchanged). The 47-colour new palette preserves more form-shading steps; binary alpha and conservative isolated-speck cleanup retain silhouettes. No atlas dimensions, frame positions or names change. scripts/check_props_v3.mjs verifies 917 protected cells, exact metadata, source hashes, binary alpha and the approved farmer/world PNG hashes.

The centre window shifts 48 world units right to clear the mantel, and the east City tent shifts 80 world units right to clear public seating. ROOM.hearth is the shared cooking anchor. Hearth/logs shift 24 world units right; sideboard/pottery/log feet align to the rear baseline. Physical boxes and cooking overlay follow these placements. Fixed outdoor Home/City tables are removed from the data-driven maps and their derived solids. DECORATIONS.table.indoors gates placement everywhere; crafting still works at Home/Farm/interior. Save validation packs saved outdoor tables once and known indoor decor displaced by updated room geometry, retaining Bag ownership under the established 9999 cap. No schema version change. Bag and crafting hints explain indoor placement.

The City project renderer now braces its completion branch correctly: incomplete projects draw one marker, completed projects draw seats/planters without duplicate flower overlays or markers. Regression tests cover both states. Full suite: 358 passing; production build: 46 files. Isolated port4216 browser fixture uses the same responsive room dimensions and bed/door/hearth interaction anchors as its iframe when choosing legal points, avoiding a false phone failure from desktop geometry.

---

# v0.35.1 — area-voted native prop export (2026-10-15)

prop_pixels.mjs votes over nine sub-samples per native pixel rather than point-sampling a large raster. This prevents small source variations from becoming isolated bright/dark pixels. A 33-colour base material ramp and conservative cleanup apply to reused textured props; new simple-shape sources preserve their broad fills. Only rug surfaces fit both dimensions of their existing ground rectangle, removing vertical letterboxing. Upright artwork keeps proportional fitting and original anchors. Market awning colour variants remain.

export_props_v2.mjs stages an atlas and only installs with --install. No frame is appended, resized or moved: 50 replacements and 908 exact protected cells in the same 958-frame/1024×2564 atlas. Snowy pine and approved small-foliage frames remain exact. check_props_v2.mjs verifies hashes, metadata, binary alpha, protected pixels, an area-vote noise regression and rug coverage/quiet centres. No runtime source/architecture/save/room geometry or dependency change.

---

# v0.35.0 — shared prop sprites and snow material preservation (2026-10-15)

DecorationArt now routes all upright decorations through shared local frames. Shop previews, placement ghosts and saved pieces use the same pixels; bench/table/fence side views are authored upright, with a separate rear bench. Planter art can extend above its unchanged solid footprint, with preview bounds fitted accordingly. Finished public-project planters use the same sprite and suppress the superseded duplicate flower overlay. Paid house accent colours preserve the generated rug/quilt detail.

Snow pine bypasses habitat recolouring and uses a cached exact native canvas, avoiding the former double whitening. Generic snow foliage keeps dark olive undersides. Existing snowy tree root registration is remeasured without changing collision positions. Offline export changes 42 cells in place, appends 12 frames and proves 904 non-target cells exact; atlas 1024×2564, 958 frames. No new runtime file/dependency or save schema/price/placement-rule change.

---

# v0.34.0 — foliage aliases, water motion and bridge rails (2026-10-15)

export_nature_more.mjs appends six native frames to town.png/town.json; all940previous frames and pixels stay exact. Atlas1024 ×2500 /946frames. natureExtras holds measured root origins; treeVisual selects two smaller forms by stable map coordinates. groundPlantVisual replaces fern/palmetto/bush visuals while retaining their old vegetation IDs, anchors and clearing rules. No world layout, crop position, species difficulty or save-schema change.

waterFootsteps is a pure transient model: distance/elapsed-gated alternating contacts, wet/dry edge bursts, expanding wake/drop poses,820mslifetime and a24burst cap. WaterView draws separate wake/droplet graphics with native2unit alignment and four-corner water clipping; existing reflection/crop/current logic remains. Only actual movement emits steps. Motion counters are read-only development snapshot data, never saved.

bridgeRails derives two8unit side boxes from each bridge orientation; both ends stay open. walkable uses the same boxes for Forest movement, jump sweeps, line queries and save-safe positions. CollisionWorld also instantiates these boxes for Phaser-driven Home/Farm/City collision. This fixes lateral water-to-deck traversal without blocking ordinary water or center approaches. Existing bridge tests now sample the clear center corridor rather than the rail strip. Old saves placed in a newly solid rail normalize to nearby safe ground, preserving inventory/progress.

---

# v0.33.0 — native nature atlas and shared tree rendering (2026-10-15)

scripts/export_nature.mjs converts four selected built-in imagegen PNGs with existing offline pngjs into native binary-alpha palette art. Replaces40old cells in place and appends two80 ×112fruit crowns below the original atlas. All898other old frame is byte-identical. New atlas1024 ×2424 /940frames; existing frame coordinates and runtime paths remain. No generic atlas rebuild, new runtime dependency or URL.

treeVisual chooses local tree frames independently of vegetation IDs. natureArt stores root origins measured from opaque native pixels, including asymmetric palm feet. worldArt renders all recognized outdoor trees with common olive textures, grounded shadows, foot depth and full canopy bounds at unchanged map x/y+32/90anchors. Rocks retain their prior replacement behavior. Existing GrassView consumes the same27green/dry/snow bend keys. Atlas/frame count tests and root routing regressions cover the change. Canopy occlusion retains its geometric rule and lowers overlapping crown opacity to.28. Ground surface changes only small leaf/flower brushwork; roads/water/shore masks and all map data remain.

---

# v0.32.0 — restore empty soil and space the Farm (2026-10-15)

FIELDS is 8 × 5 / 384 × 240; starter extension has24cells. Roads[0:2]narrow inside their old footprints; notice moves from736,384to800,532and its service point to828,576. New board collision is entirely on existing undiggable road ground, preserving previously valid custom crop locations. Original plot positions remain.

Shovel groundContext returns `restoreGround` for empty visible beds. Application opens a localized canvas confirmation, then pure restoreGround validates Farm/range/sight/empty crop and stores a grass override, removes that cell's wet patch and refreshes rendering/save. Cancel changes nothing. Existing planted beds remain protected. Saved indices/records remain; visiblePlots/plotOwned filter overrides, prepareStarterBeds skips them and groundPoint can find hidden custom records for re-digging. No new tool, DOM HUD or remote runtime.

---

# v0.31.1 — taller cleared sites and unrestricted Farm digging (2026-10-15)

FIELDS is now 384 × 288 / 8 × 6; FIELD/PLOTS and 64 reserved FARM_PLOTS per farm retain original coordinates/indices. STARTER_EXTENSION appends two full rows after the prior right-side extension. Existing prepareStarterBeds provides additive safe migration. Removed drawFarmSites and its world-render hook; only drawFarmBeds creates soil for actual beds. Removed the Copper check from digGround and the unused inGrowingArea predicate. Farm-only, reach, clear terrain, water/road/building/furniture protection, overlap, energy and capacity checks remain. No PNG/JSON asset or dependency changes.

---

# v0.31.0 — growing-area geometry separate from legacy plot storage (2026-10-15)

FIELDS now describes384×192 /8×4growing areas. FIELD/PLOTS/FARM_PLOTS still describe original4×4reserved slots for compatibility. STARTER_EXTENSION supplies16right-side positions. State creates them as custom beds; prepareStarterBeds appends safe missing cells on migration/new-farm purchase without reordering/replacing saved entries. MAX_CUSTOM_BEDS is shared from data/farms and re-exported by farmGround. Existing plotAt/allPlots/watering/harvest handle the extensions normally.

FarmView.drawFarmSites bakes four light-fallow canvases from original soilPixels using existing world-coordinate texture/material logic, below darker prepared beds. They identify equal shovel-ready sites; fallow earth alone is not a planted/dug state. Ground targeting first respects reserved and saved beds, then uses the area's own48-unit lattice throughout all8columns. In-zone digging bypasses Copper gating; outside-zone progression remains. Farm bed work takes priority over nearby board interaction while retaining explicit pointed-bed priority and hand-based board use. Road data has6segments, each contained in an old road rectangle; shared rendering/collision and road-based dig checks stay coherent. No raster asset change or external runtime.

---

# v0.30.1 — Farm materials and crop export (2026-10-15)

MAPS.farm props/buildings/fences remain the source for both rendering and collision. Removed the central shed and repeated display props, plus separate fence images and the two matching explicit obstacle boxes. Home/City/Forest map definitions remain. Farm plot/ownership coordinates, custom beds, prices, save schema19 and gameplay are unchanged.

FarmView.soilPixels accepts an optional wet-neighbour mask. Watered cells feather against dry beds only; outer turf and connected wet boundaries stay coherent. The texture cache key includes both masks and world coordinates. Actual wet patch lifetime/energy/crop care rules remain in pure systems.

`scripts/refresh_farm_crops.py` runs existing crop_art/farm_crop_art/garden_tools_art sources and overwrites only the96named crop candidate cells in existing atlas positions;40differ by removed soil,56stay unchanged. No whole-atlas repack. `scripts/check_farm_refresh.py` verifies hashes, binary alpha, crop dimensions and unchanged protected sources. When temporary pre-edit atlas exists it also proves pixel removal only and all898other frames byte-identical; persisted manifest/hash evidence remains afterward. The exporter manifest describes its most recent invocation, so retain the recorded first-change evidence for history.

---

# v0.30.0 — resident-specific visuals and scoped shops (2026-10-14)

`src/data/matchingNpcs.js` maps only city-nell/city-sol to64pxatlas frames,1.5scale and56/64origin. `residentFrame` selects transient clocked idle/walking phases; legacy lookup remains unchanged for all other resident IDs, even shared art indices. ResidentView uses actual visual height for service markers. Pure resident/commute data and schedules are unchanged. WorldScene stops resident updates during menus/hidden documents. No saved animation fields or schema bump.

`AppearancePanel.openShop` sets hair/clothes scope. `appearanceTabs` constrains tabs; internal tab/navigation/purchase rebuilds preserve scope; ordinary home open defaults to full wardrobe. Hair preview clones and clears only preview accessory slots. No actual equip state is changed by previewing. Prices, ownership and service checks stay in pure appearance systems.

`scripts/npc_matching_animated.py` exports native frames and idempotently updates80town atlas slots; people_art includes them in full repacks. Original858cells remain at original coordinates during append. Full repack removes stale base-height metadata. Native audit checks binary alpha, boot baseline, neutral pixel identity, runtime equality, unchanged older cells and protected sources. Clara export remains developer-only. Runtime allowlist stays46files.

---

# v0.29.0 — farmer cosmetics (2026-10-14)

Player body identity comes exclusively from `state.character`; legacy `appearanceIndex`/`appearanceFrame` remain for legacy/NPC metadata, never choose the player rig. Pure shop/ownership operations remain in `systems/appearance.js`. Additive schema19 appearance fields default missing accessories to empty slots; no save key change or balance compensation. Old purchased outfit IDs/ownership and hair IDs remain.

`farmerCosmeticPixels` composes source-backed native clothing/hair palettes and generated accessory pixels for all384body cells. Per-frame semantic head and fabric shoulder registration is exported offline. Original PNGs/tool cells remain immutable. `art/farmerTexture.js` maintains at most four reusable canvas buffers (boy/girl × world/preview), refreshed only when the appearance signature changes. Reflections, source hand crops and shallow-water rendering use the same composed frame. Both Canvas/WebGL use actual pixels with nearest filtering. Tool profiles select by base identity, never derived texture key.

---

# v0.28.1 — matching female farmer, corrected size and eyes (2026-10-14)

GIRL_FARMER resolves the existing girl texture to64×64cells,256slots/eight columns, origin56/64, scale1.45and eight timed clips. scripts/revised_girl.py exports192new body poses, preserves raw imagegen outputs and generates independent female skin-pixel hand/wrist data. scripts/people_art.py invokes this packer on future art rebuilds; older female v1 assets/evidence remain archived.

PlayerView supplies a per-character carryProfile to farmerCarryPose. Tools still use existing boy atlas slots256–267; the hand overlay now takes its texture from the active body, preventing male hand pixels on the female. Both rigs retain exact clip timings; the action nozzle scales with the actual rig. No new runtime asset path, dependency, save schema, combat reward/timing or jump-physics change. The corrected female size propagates through title, selection, wardrobe, world, hand grips and effects.

---

# v0.27.0 — jump clip and carried-tool registration

The existing boy.png now has27264×64slots in eight columns: original action blocks0–223unchanged, jump224–255, tools256–267and four trailing padding slots. No runtime path/dependency is added. scripts/farmer_extension.py converts the four new built-in-imagegen outputs offline; scripts/revised_farmer.py preserves approved pixels and packs the extension, hand points and wrist-derived angle table. characterFrame selects jumping directly from jumpPose.elapsed; jump physics/duration/range/cooldown remain. farmerCarryPose uses the same body phase for hand, angle and tool view, sharing jump height. HeldWateringCan uses the new male layer branch and restores actual hand pixels with a crop; other rigs retain their preceding behavior. All combined actions hide both carried tool and hand overlay immediately.

---

# v0.26.2 — source pixels plus display scale

BOY_FARMER uses width/height 64, originY 56/64 and scale 1.5, retaining v0.26.1’s displayWidth/displayHeight 96 and ground offset 84. scripts/revised_farmer.py copies every original native frame; no resize. BOY_HANDS converts original skin-pixel centres to rounded world offsets at 1.5×. Nearest texture filtering remains. All clip indices/durations and baked-tool suppression remain; girl/legacy rigs keep their previous scale. This addresses loss of the single-column left eye caused by offline nearest resizing, without changing accepted stature or gameplay/save behavior.

---

# v0.26.1 — compact revised boy rig

BOY_FARMER now uses 48×48 cells and originY=42/48 at integer 2× world scale. scripts/revised_farmer.py adapts the whole original 64×64 frame with one fixed 0.75 nearest transform, retaining the seven-action/eight-column indexing and exact durations. BOY_HANDS is re-extracted from adapted native skin pixels; baked watering-spout offsets use the same reduction. The original source pack is preserved and records retain source/adapted hashes. No gameplay timing, collision, save or rendering architecture change. Carried tool layers remain separate; existing tool-use artwork remains combined.

---

# v0.26.0 — revised boy runtime rig

BOY_FARMER resolves only the existing Worker/Classic appearance to 64×64 cells with an eight-column, seven-action sheet, while FARMER retains the girl rig and PEOPLE retains other looks/NPCs. scripts/revised_farmer.py copies native source RGBA cells into the existing boy.png path, generates exact clip timing/grips and is called by people_art.py. Source sheets/metadata and archive hash remain under assets/licenses/farmer-boy-revised-v2. characterAnimation.js selects phases from exact per-frame durations; PlayerView advances visual time only during active simulation, returns to idle/run after one-shot work, and cancels work on movement/tool switch/jump. Save schema, rewards, damage/cooldowns, movement speed, collision bodies and tree/crop systems remain. Existing interactions trigger the new visual clips; gameplay mutations retain their preceding timing. Held utility art is hidden during built-in tool poses. No new runtime asset path or dependency.

---

# v0.25.0 — girl farmer rig (2026-10-13)

Starter appearance index 6 (Garden outfit/Autumn look) resolves to the girl texture with the shared FARMER rig; index 0 still resolves to the approved male. Both preload as 48×48 sprites, and title/selection/wardrobe previews use the same feet anchor. GIRL_HANDS supplies each pose's actual opaque skin-pixel centres. Existing rig-aware water cropping/reflection, depth and grounded jump arc require no new system. scripts/generated_girl.py reproduces native conversion/packing and the reusable PNG/ZIP/GIF exports. people_art.py calls both approved farmer packers when rebuilding legacy assets. Source, archives and previews stay outside the runtime allowlist. No dependency, gameplay speed, collision, economy or save-schema change.

---

# v0.24.0 — per-player visual rig

`playerVisual` resolves the approved farmer to the existing boy texture for Worker/Classic, with 48×48 cells and originY=40/48. Legacy appearances/NPCs keep their 24×40 rig. A shared rig drives actual player frames and UI previews; source hand coordinates are injected into held tools. Water cropping uses the native ground row, and flipped reflection origin accounts for transparent padding. Save schema/physics remain unchanged. Native RGBA packing never resamples source art. Repacking Szadiart assets also calls the farmer packer to preserve the approved boy texture.

---

# v0.20.2 — depth rendering

Two small rendering modules add cached nearest-filtered pixel shadows and pure crown overlap. Rails are short foot-sorted Graphics sections; decks remain opaque. No asset files, geometry/collision or save format changes. Tests and browser/device limits: verification/pseudo-depth/README.md.

---

# v0.20.1 — cave retirement

Five feature modules are removed and the normal/playtest build returns to 143 modules. Save normalization drops legacy curse data while preserving established gameplay fields. Generated cave textures and the specific cave collider/map marker are gone. NPC curfew and recoverable outdoor bags remain. Full checks/device limits: verification/curse-removal/README.md.

---

# v0.20.0 — optional cave implementation

Data/pure systems own cave guards, repair spends, timer bounds and nightly pursuit. Saved ghost timers are active milliseconds, clamped per simulation step consistently with existing combat; menus/hidden tabs do not advance them. Midnight retains the current night; dawn/new nights clear/reset ghosts. Scene changes relocate outdoor spirits with an arrival telegraph; the interior clears visible ghosts. Axe targeting prefers a valid close spirit before nearby cave/vegetation, preserving contextual mobile Hit. Repair/cache mutations happen before saves, preventing repeat-click rewards. Legacy records default sealed; restored records require full paid costs. Reuse existing stash recovery for all outdoor areas; validate farm domain.

CavePanel measures actual font bounds, paginates every warning paragraph, guards final confirmation by proximity/stage and restarts warning reading after resize/language changes. Remote repair cards show paid totals and disable contributions away from the entrance. The same original cave texture is used in world and UI; new ghost warning uses native m5x7 at integer 2× scale. Normal/public runtime inventories remain separate, and only the audited static playtest stage is deployed to the existing target.

---

# v0.19.0 — Unicode shaping and bounded mobile text

Local FontFace loads the allowlisted original Noto Sans Myanmar UI TTF before boot (8-second failure limit). Whole-run Phaser Text preserves Myanmar ligatures/stacked marks; Intl.Segmenter(my, word) wraps at language word boundaries, with a punctuation/space fallback. Integer font sizes/resolution/scales and nearest filtering remain; numeric controls and Latin brand retain their original bitmap font. Glyph rasterization is handled by Canvas, while game texture antialias remains disabled.

Empty dynamic labels use Myanmar-capable Text; explicitly numeric counters retain Latin bitmap rendering. Landscape crop cards reserve the action column, and prompts clear joystick/Jump hit areas. Language switching rebuilds scene labels from existing state, then restores the calling title/pause menu. Original IDs and actions remain stable. Language preference is independent of save data. Text-only guide/description pages pause time, use measured line budgets, and preserve full copy through navigation/details. Compact shop feedback shares the stock row only when needed, avoiding the shortest-landscape overlap. Font failures keep English playable; native-speaker/Safari/physical-phone validation remains pending.

---

# v0.18.5 — bounded trade layout and silent house entry

TradePanel replaces the subtractive lift calculation with fixed header/tab bands and a compact two-column body below 190 logical pixels of available height. Compact panels may expand to 336 logical pixels wide while respecting side/bottom safe insets; tall panels cap at 252×225. Below 160 logical pixels of panel width, the info button moves to the header and the balance moves above the quantity row (hidden in details mode). Selected names/counts/price and measured detail rows wrap at native font size. Quote controls retain full count/total labels. Safe-area centering uses the remaining usable rectangle. Catalogue, gates, prices, quantity behavior and transaction/save systems are unchanged.

Application.travel only requests the existing door effect when leaving the interior; entry is silent. MobileControls stops constructing captions, centers glyphs and retains semantic Use/Hit labels and actions. Hud uses its existing map glyph instead of rendered Map text. Font size/parent scale, filtering and fullscreen separate canvas architecture are preserved.

---

# v0.18.4 — native bitmap UI text

WorldScene loads thaleah/m5x7 PNG/XML bitmap fonts alongside the original world font and applies NEAREST. pixelWidgets.text selects the font by semantic heading/body role, translates legacy requested sizes into whole 16px native multiples, reduces headings by whole steps when needed, and adds two logical pixels of leading. Buttons use native body text, measured vertical centering, 6 CSS pixels of side padding and bounded abbreviated display labels; control labels/IDs remain intact. coloredFont copies the whole __BASE sheet, disables smoothing and applies source-in colour; Canvas and WebGL share those glyphs/metrics. Renderer antialias/antialiasGL are disabled. UI root remains scale 2 and clock text has no fractional ancestor. The .75 vitals container contains graphics only.

ResourceView reserves bands and switches to two material columns without a redundant main preview below 160 logical panel pixels. Journal/completion text wraps at native size and paginates against the footer. Large stock counts abbreviate on slots while Bag selection shows the exact count. Caption controls remain at least 44 CSS pixels in tested mobile layouts; Jump/Use return to 56px to fit the requested font/padding. Read-only QA snapshots expose visible UI text bounds/font/native size/ancestor scales. The offline recorder loads actual XML metrics and preserves the original world-font metrics separately.

House camera zoom is 1 on mobile (outdoor compact framing remains .75). No map, collision, furniture or save-schema changes. Cold door playback queues the actual recording for up to 1.5 audio-clock seconds; there is no synth door fallback. Outdoor travel remains outside effect/preload mappings. Normal/playtest builds preserve their existing balance isolation.

---

# v0.18.3 — compact gameplay HUD and landscape camera

The UI scene remains at 2× logical pixels. Only noninteractive mobile vitals/clock containers use an additional .75 presentation scale; hit-tested toolbar/action controls are redrawn at 24 logical units, and the joystick uses a 24-unit radius. Touch coordinate conversion and read-only snapshots remain consistent with the existing 2× scene. Portrait toolbar and landscape joystick/action reservations move inward/down to release gameplay space; navigation/crop-panel floors track these positions. Menus retain their previous readable sizing.

displayZoom accepts optional coarse-pointer capability. Compact landscape views (width below 1000, or coarse pointer with height below 600) use .75; other views retain the existing 1/1.5 rules. WorldScene supplies the actual media capability outdoors/indoors and uses existing follow/bounds/room handling. At 844px width this exposes about 1125 world units versus the prior 844; a 1440px desktop at 1.5 exposes 960. Actual phone dimensions differ, so this is a landscape framing choice rather than a universal phone/desktop coverage guarantee.

---

# v0.18.2 — optional TouchManager at startup

Phaser InputManager leaves `touch` null on devices without touch capability. The ready handler guards `touch?.target` before accessing/replacing onTouchCancel, allowing non-touch scene startup to continue. The scoped cancellation wrapper remains active on touch devices. Native startup checks explicitly set hasTouch/isMobile false for desktop and true for portrait/landscape phone profiles in both renderers, and use ordinary inputs with fresh saves.

Phone preview: `npm run preview -- --host 0.0.0.0 --port 4198 --strictPort` exposes the existing static dist on LAN. Vite prints the current Network URL; the Mac and phone must share a reachable local network. This does not deploy the game or add a backend.

---

# v0.18.1 — rotation input lifecycle

UI layouts remember their physical viewport dimensions and call Phaser InputPlugin.resetPointers on a changed size, reclaiming touches whose release was cancelled during rotation. The orientation handler also resets movement/pointers, then schedules canvas fitting immediately and after 250ms. Fitting compares real canvas bounds as well as logical size and refreshes Phaser's displayScale when the canvas moves without resizing. Window resize, orientationchange/screen.orientation change and visualViewport resize/scroll supplement an optional host ResizeObserver; all listeners/frames/timers are removed on destruction. A scoped wrapper of the pinned TouchManager.onTouchCancel preserves its processing/capture behavior while checking event.cancelable before preventDefault. Vendor source is untouched.

Short landscape menus keep the established 2× pixel UI rather than squeezing the entire game. Bag pagination derives its page size from the six-column one/two-row layout, and keyboard row movement uses the actual column count. Audio controls use two columns; tiny Journal panels show the active step/directions. New narrow-HUD tool access remains through the existing Bag / Gear. Current verification is under verification/mobile-rotation.

---

# v0.18.0 — additive judge polish

Architecture remains ES modules, pure gameplay systems, one fullscreen Phaser game canvas with separate World/UI scenes, same-origin allowlisted assets and localStorage. No new dependency, backend or runtime remote service. `npm run build` explicitly sets `VITE_PLAYTEST=false`; only the explicit flag authorizes credit, independent of host/query/DEV. Existing gifted saves are not debited.

`wateringCan.js` shares a single stopped ray between rendering and mutation, using current-farm visiblePlots, plotAt, openGround and shared collision lineClear. The whole action checks energy before touching plots. Basic usePlot accepts an internal waterCost override only for this batch. Ownership and active-time foodCooldown are optional schema-18 additions with validation; balanceRevision makes the crop-duration migration idempotent. Previously ripe Cucumber/Sweet Potato remain ripe; partial growth/care, old owned farms, paid decor, saves and story completion persist. Restored completed stories receive the newly introduced board flag.

A ResizeObserver on the fullscreen host plus visualViewport resize schedules a layout-frame ScaleManager.resize with actual parent dimensions. This fixes mobile rotation retaining the previous viewport dimensions; existing World/UI resize handlers and room-safe furniture relocation remain.

`simulationActive` gates time, combat and movement while paused/transitioning/hidden or successful-impact hit-stop. Clock tick clamps delta to 100ms and advances 1080/450 minutes per active second; food cooldown uses that same active delta. No elapsed-time EP drain. `IntroArt.js` draws deterministic integer-pixel tableaux without external files. Copper uses a cached warm palette variant of the existing native can in both Canvas and WebGL, preserving alpha and dark outlines, shared pour/bounce and previews. Audio uses the same central lifecycle, allowlist, six-voice/two-per-frame limits and preferences; quiet UI/doors/transitions scale .18 vs .85 for action samples, with cooldowns and no continuous world music.

Native test scripts use isolated contexts and read-only snapshots; only explicitly identified late-game fixtures are injected before loading in targeted tests. Fresh timing paths use ordinary inputs and real sleeps, with no gift, fixture, teleport or growth injection. Generated captures and reports belong in temporary directories and are excluded from source checkpoints. See verification/judge-polish/README.md for exact scope and results.

---

# v0.17.2 — customization access and house structure

HUD `customize` house glyph precedes `pause`; no DOM controls. Four bounded Customize categories include seven Wood/Stone recipes and a separate nine-item coin catalog plus eight paid houses. Material and coin transactions are mutually exclusive, retaining atomic failure/stock guards. Crafting supports Home/Farm/interior with outdoor placement restrictions. Save schema stays 18; no second gift.

Native 180×144 house textures are generated in memory from the original house atlas frame, using pure palette/material processing with identical alpha and steps. Cached designs are reused for thumbnails/world. Atlas file allowlist, structural collision, source positions and room interactions stay unchanged.

---

# v0.17.1 — screen placement

Version 0.17.1, schema 18, unchanged dependencies and runtime asset allowlist. Add is a dark bold label even on a disabled button; direction controls reuse native pixel-arrow masks. Pure gameplay guards preserve occupied/function areas; the controller checks camera visibility. Readjust keeps original save/collision data until its atomic confirmation; it does not borrow an inventory item. Mobile pointer selection of placed decor opens choices while ordinary touch actions retain Use/Hit. Local/public test builds retain the v0.17 once-only coin stamp.

---

# v0.17.0 — customization testing

Normal build: `npm run build` (60 starting coins). Friend/local testing build: `npm run build:playtest` (once-per-save +100,000 on Play/Continue). Static runtime and localStorage only; the same public origin preserves progress. Home/interior upgrades and furniture stay in schema 18; old saves migrate without resetting currency/farms/Forest/story. Adaptive indoor room resizing can return obstructed furniture to Bag; gardens keep world coordinates and per-Farm separation. Refer to verification/customization/README.md for actual checks and hosting/build inventory. Physical phones, Safari/Firefox/Edge and human art/listening/balance approval remain unverified.

---

# v0.16.6 — plain public playtest and sleep feedback

Version 0.16.6, schema 17 and runtime dependencies unchanged. Dedicated wind/Winter files and profile keys are removed. Sleep/wake effects use bounded Web Audio source scheduling and existing cleanup rather than timers or save fields. Morning gets one natural public-domain rooster recording; evening uses existing short rustle. All effects respect saved Master/Effects/Mute settings, and gameplay has no music. Audio credits/source submenu retains short-screen fit.

The same verified free Vercel project publishes the tested static build at a stable plain game URL using standard deployment protection: production game domain public; preview/generated domains protected. Each browser/origin owns a separate local save. Earlier preview progress stays at its original URL; stable-domain saves survive later updates on that same origin. No query token or tester-link expiration is needed for the stable public game URL. Current evidence: verification/sleep-wakeup/README.md.

---

# v0.16.5 — music stops at gameplay entry

Version 0.16.5, schema 17 and dependencies unchanged. Gameplay music is disabled by profile and source cleanup, preserving the saved Music volume for Title. The original completion cue is disabled/excluded. Selected sounds follow successful food/stone/seeds/cache/Stash/Keepsake/furniture mutations. Failed actions and earlier quiet controls remain silent. No save migration or new asset bytes.

The existing protected free Hobby playtest project receives an audited preview of 35 static files. Each new preview URL is a separate localStorage origin: earlier preview/local saves stay on their original URL and are not automatically transferred. Current checks/expiry/limitations: verification/nature-pickups/README.md.

---

# v0.16.4 — silent empty swings and Vercel playtest

Version 0.16.4, schema 17 and Phaser/Vite dependencies unchanged. Excluding combat:swing/tree:fall from SAMPLE_EFFECTS keeps the established action animations/events while preventing sample/synth playback and preloading. Actual tree/animal result events and Wood pickup remain; farming/trade and background transport are unchanged.

The current tested dist is staged into Vercel Build Output API v3 static files under /private/tmp. The dedicated free Hobby project has no Git integration/backend and all deployments require Vercel protection; a seven-day share cookie link lets testers access it without login. X-Robots-Tag blocks indexing and hosting feedback overlays are disabled. The first upload was automatically marked production in the new project; a subsequent verified preview is the supplied test target. Vercel CLI 63.1.2 used its existing login. Local saves belong to each browser/origin; local saves do not automatically move to HTTPS. Current verification/deployment details: verification/hit-feedback/README.md.

---

# v0.16.3 — audible farming/hits, silent UI/travel

Version 0.16.3, save schema 17 and dependencies unchanged. Expanded the existing playback/preload/build allowlist to sixteen events / fourteen sample files, preserving aliases for chopping and grass work. Click/menu/Bag/tool/Jump/door/travel events remain rejected; transaction effects and background transport/preferences remain. No gameplay event wiring was rewritten. Current audit and affected-interaction checks: verification/restored-effects/README.md.

---

# v0.16.2 — transaction-only action sounds

Version 0.16.2, save schema 17, unchanged dependencies. The existing AudioManager rejects any event absent from `SAMPLE_EFFECTS` before sample loading or synthesis; that same two-event map supplies preloading and Vite asset selection. Successful buy/sell feedback retains cooldowns, six-voice/two-per-frame limits and bounded expiry/deduplication for deferred transactions. Music/ambience/ending transport and existing preference values are unchanged. Current tests/evidence: verification/quiet-actions/README.md.

---

# v0.16.1 — local licensed PCM audio and touch controls

Version 0.16.1, schema 17, unchanged Phaser 3.90.0/Vite 6.4.3. Forty selected converted PCM16/22050 mono files plus the original ending cue use the existing lazy Web Audio graph. No runtime Ogg decoding, remote assets, audio library or server API. Offline conversion uses ffmpeg 8.0 and bundled Python/NumPy; neither ships with the game. Source/archive/runtime hashes and commands are in assets/licenses/cozy-audio.

Default Hand is saved under the existing tool ID but has no Bag/HUD slot. Fine mouse input remains available even in compact Mac windows; touch/coarse-pointer ordinary world actions route through Use/Hit. Placement retains separate drag/confirmation. Existing preferences and valid selections persist. Targeted checks/limits: verification/cozy-audio/README.md. Production build remains served locally on LAN port 4176; QA uses isolated port 4190. No push/publication.

---

# v0.16.0 — audio and story verification scope

Production is a local static bundle with eight art files and six explicit local WAVs; initial loading does not fetch audio. Web Audio unlocks after a user gesture; unavailable audio/storage fail safely. Phaser Canvas default and ?renderer=webgl share the audio owner. No runtime external API/network, authentication, analytics, backend or new dependency. Credit links open only on deliberate user activation. Run offline using a local static server and bundled assets; this is not a service-worker installation or file:// support claim.

Testing gift is DEV-only at both boundaries, including on loopback production. QA uses independent disposable contexts on port 4186 and ?qa read-only snapshots; normal 4175 save untouched. All seven requested sizes are checked. Actual hardware latency/output, headphone comfort, Safari/iOS interruption policies, Firefox/Edge and Android/iOS gameplay still require human/device checks. Automated waveform checks cannot certify pleasantness. Milestone results: verification/story-audio/README.md.

---

# v0.8.0 — hunting/resources details

Axe: 2 energy / 500ms / one damage; Club remains 5 / 450ms. Wild Boar and Deer give 2 Meat; Fox/Hare/Grouse give 1, with Boar's existing Hide retained. Quiet animals remain nonhostile and do not guard caches. Dead animals/picked stones return on a later day, never reentry/reload. Stone piles: 240 (six in each of 40 regions), +2 Stone / 1 energy, dry/walkable footprints, unchanged scenery/collision map. Meat: +25 HP / +20 EP / base sale 16; existing fruit EP and market salts remain. Fruit HP is rounded 40% of its EP value.

The context regression includes Hand-versus-grass priority following a real browser failure. Existing 167 regressions remain; eight new tests cover hunting, caps/cooldowns/blockers, pure motion, resources, healing, schema migration and responsive controls. Runtime retains exactly eight art files with three original atlas cells appended. Forest first construction remains relatively heavy; no performance benchmark or physical-device result is claimed.

---

# v0.6.1 — watering object fix and soil polish

The previous effect requested town/can, although can existed only in world; the tool now uses an original town/watering-can-item everywhere. The held can uses directional native hand anchors, flipped handle origin, depth/scale/jump offsets and a 650ms tilt; its timer pauses with gameplay. The stream starts at its nozzle. Tool switching/transition hides it. Original player sheets are unchanged. Pinned Phaser Canvas flip/origin source was inspected; tests and offline mirrored/rotated studies supplement browser acceptance only.

Farming costs are 2/1/2/2 for plant/water/harvest/dig; fatigue one energy per game hour. Existing save fields/schema 10 remain; fatigue cap expands to the new interval. Soil textures use deterministic global native coordinates, smooth material patches, scattered clods and transparent rounded turf boundaries, cached per coordinate/mask/wetness. Runtime allowlist stays eight files. Native browser/Canvas/WebGL/touch/performance verification remains blocked by the existing local-URL policy; no workaround used.

---

# v0.6.0 — free farming implementation and limits

A dig costs 4 energy and no coins; plant/water/harvest costs remain 5/3/4. A 48px square bed must have a clear footprint and line of approach within 72 world pixels. Nearby additions use the existing bed lattice; roads, solids, water and bridge footprints reject digging. The shovel is available on Farm/Home/City HUDs, with a Farm-only digging hint. Water works on outdoor clear ground within the same reach; valid crop-window care uses the established pure farming action. Repeated/out-of-window pours are cosmetic and still cost 3 energy. Runtime ground use is gated to 450ms. Dead crops require Harvest to clear.

Wet patches expire at 180,000 active milliseconds, pause with simulation, survive reload with remaining duration and clear on sleep/long time jumps. At most 2,048 custom beds and 256 recent wet patches are stored; validation bounds coordinates, farm IDs, footprints and overlaps. Original 64-cell farm indexing is retained. Cosmetic wet shade is independent of daily care and morning/evening growth.

Twelve crop definitions supply seeds, sale items, eight native crop-state sprites and item icons. Existing daily sale salts retain their order; the new sale items append after the old four crops/forest fruit/hide. Watermelon, Grape and Blueberry add edible bag entries without changing the nine forest forage species. Schema 10 is accepted alongside 1–9. Production: 12 files, 2,058,100 bytes, eight art files. Native browser input/rendering/performance remains unverified under the existing URL-policy restriction; offline studies are supplemental.

---

# v0.5.2 missing-glyph regression
Pinned Phaser 3.90 BitmapFontFile passes its texture into ParseXMLBitmapFont, which calls Texture.add for each glyph. Texture.add changes firstFrame from __BASE to SPACE; Texture.get(null) then selects SPACE. A new colour texture must copy the explicit base sheet. The strengthened existing test invokes the actual XML parser, Texture.add/get and Canvas renderer, asserting the full 128×64 copy and all five UI colours. It fails before the fix and passes after it. The earlier adapter always returned the full sheet and masked this bug; it now models the transparent SPACE default. Stub engine tests and offline pixel studies do not certify a live browser.

---

# v0.5.1 renderer regression
Phaser 3.90's `BitmapTextCanvasRenderer.js` samples the font image without applying tint. Do not rely on BitmapText.setTint for Canvas UI contrast. Shared labels now select cached coloured font images with unchanged alpha/metrics; WebGL uses neutral white tint on the same coloured sources. A Node regression executes the pinned Canvas renderer with stub transforms/context and checks that it draws the coloured cached image. This supplements tests; actual browser acceptance remains pending. Clock formatting floors fractional gameplay minutes before modulo/12-hour conversion. Tool numeric overlays are removed while shortcuts/counts remain; Forest Map now has a text label.

---

# v0.5.0 interface verification notes
The UI root remains integer scale 2. Original graphics/glyphs use native integer coordinates; dynamic notebook textures use Phaser's pinned NEAREST filter value (1). Shared Graphics buttons provide explicit local hit rectangles and preserve selected fills/glyphs across hover. Disabled actions stay noninteractive. Mobile layouts retain ≥44-display-pixel action targets in tested sizes. Space and K are separate forest actions; B works in playable areas and M is Forest-only; paused/repeated/transitioning events do not dispatch. Touch double taps require <320ms and <28 display pixels; UI controls stop propagation. Browser-engine/input-dispatch verification is pending because the local-preview URL was rejected by browser policy; Node layout/input tests and offline Pillow studies are supplemental evidence only. Dependencies and the runtime art allowlist remain unchanged.

---

# v0.4.9 technical update
10240×5120 forest; forty regions, 163 forage points, thirty saved boars and forty-eight transient quiet animals. Six river definitions and twenty-two bridges use shared integer-native water geometry; other locations retain their materials. Six cached forest ground textures cap individual native dimensions at 2048×2048, preserving coherent borders on the wider map. Schema 9/local-only canvas architecture and all eight art files remain. Production 12 files / 2,008,179 bytes; 112 tests/build pass. A local offline CPU terrain bake took 1,263ms; current native browser loading/Canvas/WebGL/memory/frame timing/mobile/interaction checks remain unverified due browser URL policy. Offline studies are not browser captures. Preview: http://127.0.0.1:4175/.

---

# v0.4.8 technical update
Five Craftpix animal identities only; 16 boar records and eight transient quiet animals. Schema 9 remains, removed animal records ignored and progress preserved. Forest adds original layered canopy art, 7,945 camera-local responsive grass clumps and cached deterministic moss/soil materials. 106 tests/build and unchanged eight-file art allowlist pass. Native browser/responsive/interaction/device performance checks for this denser version remain unverified because browser URL policy blocks access. Offline art studies are not browser tests; earlier timings/results below are historical. Local preview remains on 4175.

---

# v0.4.7 wildlife assets
914 named town frames (419 new animal keys, 60 superseded placeholders removed); shared wildlife images deduplicated within the retained 1024×2048 atlas. 495 retained frame pixels and six other art files remain unchanged. Native integer 2× display, source-order direction mapping and per-direction foot anchors prevent mirroring errors/ground drift. Sprite bounds do not alter authoritative combat body radii, hitboxes, territory, difficulty or save state. The user sheet and Stojkea originals remain external regeneration inputs; override paths through SIMPLE_LIFE_ENDANGERED_PNG / SIMPLE_LIFE_ANIMALS_ZIP. Runtime build/play requires only committed local assets. Same eight-art-file allowlist; 12 files / 2,258,286 bytes. 103 tests and affected browser checks pass; evidence: verification/wildlife-sprites.

---

# v0.4.6 bridge and Forest theme
Five bridges now span both banks at 272×72. Opaque timber decks suppress wading consistently with their actual bounds. Night equal-alpha rectangles merge to eliminate transparency-grid seams while retaining near/far visibility. Olive foliage variants generate once per used native atlas frame and stay cached; no per-frame recolouring or disk asset rewrite. All eight art files remain byte-identical to v0.4.5 (555 atlas cells), with unchanged dependency licences. Forest has 844 trees + 41 bamboo stands / 4,201 grass clumps, no terrace/ledge objects or teal ferns. Natural shores and jumping remain.

Build: 12 files / 2,031,148 bytes; 99 tests pass. Details/evidence: verification/forest-theme. No schema/runtime backend/remote asset/new dependency change.

---

# v0.4.5 forest shore follow-up
Forest: 796 trees + 41 bamboo stands, 4,033 grass clumps, ten earth banks, no rendered dirt roads/falls. Geometry/placement are deterministic and established 5120² terrain caching/collision indexing remain. New original palm/willow cells bring the atlas to 555 frames; all old frame pixels/player files are unchanged. Ripples independently appear/fade at 2-pixel positions without aligned wave rows. Vegetation footprints check water/bridges every four world units.

No gameplay-system rewrite, schema change, dependency or new runtime file. Production: 12 files / eight allowlisted art files / 2,031,270 bytes. `tests/browser/forest-shore-server.mjs` serves isolated prepared saves from built dist on 4176 and exports copied read-only QA state into a canvas attribute; it is local test tooling, never runtime production code. Browser verification uses native CUA controls and DOM-only telemetry. See verification/forest-shore/VERIFICATION.md.

---

# v0.4.4 ground/river update — schema 9
Original Canvas/ImageData materials replace repeating ground/soil and flat water bands. The old tile selector used multiples of 16 modulo four and therefore always chose grass0; native coordinate hash fields remove that aliasing. Surface arrays are temporary during the static bake; Forest retains its established cached canvas texture. The shared water geometry remains authoritative for banks, currents and wading; only colour and native material marks change. Camera-local currents use six 240ms phases and pause with simulation. No per-frame full-map pixel work, new dependency, remote runtime asset, atlas change or save migration. See verification/terrain for affected-flow checks and observed local loading times; device performance is not inferred from emulation.

---

# v0.4.3 art update
Channeechan native 64×64 source padding trims into the retained 24×32 / 9×4 player-sheet contract; the game loads no additional files. Eight native ToffeeCraft cells join the atlas. Forest tree footpoints/solids and all gameplay/save rules remain. New canopy dimensions guide fade/sway. Optional regeneration: Pillow + bsdtar, `SIMPLE_LIFE_FARMER_RAR` and `SIMPLE_LIFE_ENV_ZIP` point to user-provided archives; originals stay outside repository/build. `npm run build` needs only committed processed assets. No new dependency/runtime network request. Licence scope and non-Chromium/physical-device limits are in PROJECT_STATUS.md.

---

# Forest growth / jumping — v0.4.2, schema 9
787 forest trees + 33 bamboo stands / 3,880 grass clumps / 20 terraces. Native atlas 545 frames / 1024×2048; boy/girl rigs 216×128 with 9×4 cells of 24×32, existing first six directional frames plus three jump poses. Same eight runtime art files, no dependency/remote asset/backend change. Camera-local grass uses 256-unit spatial buckets and pooled visible sprites; transient bending freezes when paused. Indexed collision remains authoritative, with separate low ledges crossable only by a swept jump. Saves store grounded take-off during flight, and player art offsets from a stable feet camera anchor. Water crop/dust suppress during flight. Supplied Mana Seed/FreeEnvironment pixels are excluded pending rights; primary source/licence evidence and hashes are recorded under assets/licenses/forest-growth.

---

# Asset/water follow-up — v0.4.1 / schema 9

Town atlas: 514 frames, 1024×2048 native pixels. 258 Craftpix frames and four original waterfall frames extend the previous 252-frame atlas. Same eight runtime art files and unchanged dependencies; source ZIPs and provenance stay outside production. Forest remains 5120² / 20 times its original area. Water geometry is shared by the baked ground and wading visuals; continuous channel rows are cached, and animated currents are camera bounded. Physical obstacles retain trees/rocks/structures and fall side banks, omitting all water surfaces. Safe wet positions/bags save without a schema change. New ambient woodland animals have transient display state, no drops/difficulty/save changes. See PROJECT_STATUS.md and verification/asset-water/results.json for actual browser checks and limitations.

---

# Wilderness expansion technical notes

Version 0.4.0 / schema 9. 5120² world area is exactly 20 times the previous 1280×1024. Default Canvas plus optional WebGL remains; local-only runtime and eight-file allowlist are unchanged. Atlas grows from 150 to 252 frames at 1024² source pixels, with original farmers unchanged. No runtime dependency changes.

The enlarged map required indexed collision, cached terrain and nearby-only animal simulation. Static world objects remain Phaser-rendered; the renderer culls offscreen sprites. Forest night draws the viewport only and stays above every world foot depth. The wilderness map and food/market paging remain paused canvas UI. Regional discovery and finite guarded-cache records save alongside each known animal; v8 forest positions translate rather than losing progress. No backend, remote assets, extra equipment or publishing.

---

# Current Milestone 3 extension — 2026-10-07

Version 0.3.0, schema 8; the historical sections below describe earlier foundations. `data/forest.js` owns authored forest nodes/map/boar territory/guidance, `data/items.js` owns food and club values. `systems/forest.js` owns collection/eating/equipment/recovery/daily refresh and shared sight checks. `systems/combat.js` owns deterministic collision-safe boar movement, telegraphs, melee/cooldowns/damage/invulnerability; transient timers advance only with unpaused simulation. `systems/defeat.js` performs atomic loss/next-morning respawn through the established time/crop rules. Save validation preserves older progress and repairs forest coordinates; SAVE_SCHEMA.md specifies new fields.

WorldScene retains Phaser world rendering/collision/camera. ForestView composes local sprites, pixel feedback and stepped night bands with Canvas/WebGL-compatible Graphics. The independent canvas UI scene adds SurvivalPanel for food/gear/Outfitter; TradePanel pages eight sale items without modifying four-seed selection. Space/K attack; E/USE interaction. No backend, new dependency, remote asset or DOM HUD. The eight runtime art files remain allowlisted; forest sprites fit the existing 512×512 town atlas. Reproduce art with process-rpg-assets.py plus forest_art.py. Licensed tree adaptations retain LimeZu credit; original additions are separately identified in the manifest.

---

# Technical notes — farming presentation
Phaser 3.90.0 / Vite 6.4.3 / JavaScript ES modules; HTML5 Canvas, fullscreen RESIZE, nearest filtering, rounded pixels. No backend, DOM HUD, remote runtime resources or new dependency. Eight runtime art files remain allowlisted. Production is approximately 1.6 MB uncompressed, mostly Phaser.

Outdoor zoom 1 / farmer scale 2; indoor zoom 2 / farmer scale 1 gives the same 64px frame. Furniture remains scale 2 for a cozy readable room. Responsive layout fits desktop; mobile camera follows a minimum 480-unit-wide room. Indoor movement halves world speed, preserving displayed speed. Shared feet probes are 24×12 outside and 12×6 inside; house-specific visual clearance is retained. Shed collision uses ground geometry, not projected roof pixels.

Schema 7 keeps the existing localStorage key and migrates versions 1/2/3/4/5/6 individually. Crop window cursors prevent repeated missed-water evaluation on reload/rest/sleep. Room size accompanies indoor saves for responsive remapping; shared nearest-safe geometry repairs invalid coordinates. See ARCHITECTURE.md for contracts. City is now active. Pure quantity-based economy and deterministic daily prices feed paused paged canvas shops; seed/produce keys remain separate. Shops resume closed after reload.

Current acceptance scripts and evidence: VERIFICATION.md. Read-only QA snapshots are exposed by development or ?qa; collision outlines only in development. No galleries/scripts/vendor files ship in dist. Mobile checks use Chromium emulation; physical phones and non-Chromium browsers remain unverified.

Optional Python/Pillow regeneration: scripts/process-rpg-assets.py imports crop_art.py for four crops, seed/produce icons, original stalls/merchants/paving and two soil frames. Original bitmap font/UI remain in generate-pixel-assets.py. npm builds use committed assets and need no Python. Serve dist over HTTP(S). No publishing or push in this task.

Milestone 1.1 adds pure crop information, saved first-Farm-visit migration and contextual Phaser UI only. No runtime dependency or art-file change. New original glyph masks and road-board geometry are source-authored in statusArt.js/worldArt.js; the production eight-file asset allowlist remains unchanged.

Milestone 1.2 uses 64 plot slots per farm and independently saved field ownership/currentFarm. Additional farms reuse the authored map and scene, with independent crops and shared time/care. The 100-farm limit bounds validation/storage; typical saves are far smaller. No new dependency, image asset or remote service. Field/new-farm costs are configurable in data/farms.js. The continuous 00:00–23:59 clock advances days at midnight without forced sleep. Saved fatigue costs one energy per 30 game minutes; day/night bed sleep wakes at 20:00/06:00. Autosave/refresh preserves after-midnight time and fatigue. Expanded crop panels use context coordinates rather than first-field indices.

Milestone 2 City bounds are 1280×896; Home/Farm retain 2240×1152. Ground texture dimensions follow location data. A grass backdrop fills any small camera margin on larger viewports without exposing empty canvas. Paused shops have 240ms transaction gates and a transition guard. Integer inventory is capped at 9999 per item, money at 9,999,999. New-save market seed is generated locally with crypto.getRandomValues; unsigned integer hashing reproduces prices without remote services or stored rerollable daily arrays. Legacy seed defaults to 1. New key fields and tutorial flags migrate independently; paid farms and crop indices stay intact. No shop transaction can save partially.

2026-10-07: compact icon-tab shops with quantity selection and one exact-total action replace text-heavy pages; optional details preserve crop/shop guidance. World overlay gives gradual dusk/dawn and faint moonlight with no artificial illumination. Both merchants hide/close at 20:00 and return at 07:00. See day-night verification evidence.
