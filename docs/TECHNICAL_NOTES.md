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
