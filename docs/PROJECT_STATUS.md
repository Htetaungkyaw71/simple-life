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
