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
