# v0.16.0 — story, original audio and competition audit

Baseline ce6903a: 220 tests/build passed before edits. Final: **245 passing tests, zero failures**, **128 build modules**, **18 production files / 21,930,569 bytes**, git diff --check. Only eight uncertain atlas cells changed; 850 others, outside pixels, metadata and seven other art files are unchanged. Runtime MIT notices, eight art files and six local WAVs are audited; no archive/unused source pack/remote media enters production.

Six scores, 55 synthesized effects/calls and three shared textures pass source waveform/DC/peak/RMS/frequency/silence/boundary checks; zero clipping. Canvas and WebGL retain one actual AudioContext through repeated Pause/Title/Continue, focus suspend/resume and settings reload. Canvas Title transport ran 120 seconds with one loop/no ambience. Actual touch Jump/Attack and audio controls passed. Separate denied-storage/unavailable-audio and both legacy mute fixtures survive without console errors. This is technical transport verification, not human listening.

Chrome 154 at all seven required sizes (1440×900, 1280×720, 1024×768, 844×390, 640×360, 390×844, 360×640): intro, Journal, Audio, BAG, Pause and ending/statistics/Credits/Continue controls fit. Native screenshot review covers small landscape, portrait and night City/Forest. Production localhost/query cannot enable the gift; fresh starts with 60 coins. A schema-16 fixture retains 100,060 coins without inferring completion. All contexts are isolated on 4186; normal 4175 save untouched.

Fresh natural story passed in **1,211.727 seconds / 20:12 wall time**, **1,197 seconds / 19:57 active**, day 4, one harvest/two Tomatoes sold/Commons/one boar/one key/zero deaths. Keyboard/mouse only with read-only observations; no injected/edited save, fixture, grant, teleport or growth skip. Three daily waterings used natural awake midnights; standard bed sleep can finish sooner. Placement, ending, continued world and reload persisted. Failed driver attempts are excluded; the successful run needed no recovery. Errors/warnings: none.

Evidence/reproduction/limits: [verification/story-audio](verification/story-audio/README.md), including source waveform plots, runtime hashes, exact checks, browser records and final isolated natural save. Human two-minute Title/all-location/rapid-action/combat/ending listening and visual acceptance, physical mobile audio/touch/interruptions, other browser engines, slow-network load and final competition/rights/language review remain pending. No subjective audio approval or blanket eligibility certification is claimed.

---

# v0.15.0 — adjustable placement and furniture recovery

220 tests pass; production build succeeds (120 modules, twelve files, eight unchanged art files). New regressions exercise all seven pieces in four directions, preview purity/no early stock spend, exact geometry, invalid/stale/cross-farm atomicity, cancellation, oriented collision/save restoration, legacy inventory/furniture, full-bag recovery and second workshop page/action sizes in seven viewports.

Actual native Chromium at 1280×720, 360×640 and 640×360: Bag/workshop selection opens a ghost; click/tap/drag, Turn/R and nudges adjust without consumption; E/Place commits the shown coordinate/direction; fixture-free reload/Continue retains it; Hand world taps recover the full item. Invalid E and disabled Place retain stock; Cancel retains stock; new recipes spend 12+5+6 Wood and 4+0+4 Stone; the thirteenth Gear item remains selectable. Screenshots/JSON: verification/placement. No warning/error logs. Normal origin/save preserved. Phone-size pointer checks are not physical touch or other-engine acceptance.

---

# v0.14.0 — three-hit trees and illustrated resources

215 tests pass; production build succeeds (115 modules, twelve files, eight unchanged art files). Pure regressions verify no early Wood/removal, per-farm partial damage, reload/day retention, invalid/full-bag atomicity, known bounded schema-15 restoration, older cuts/crops, blocked-facing swing guards, recipe preview/count/actions, seven viewport text/control bounds, direct cooked-food eating and nonoverlapping bag pagination.

Native Chromium inputs at desktop 1280×720, portrait 360×640 and landscape 640×360 verify trees' 1/2/3 progress and final loot, desktop clicks/E, partial fixture-free reload/new day, phone joystick/Attack with world taps suppressed, all recipes, placing/Hand packing, once-only orders/projects, stove/cooking/meal shortcut/healing and visible cards. No isolated warning/error logs. See verification/chopping-ui/README.md, browser-checks.json and screenshots. Phone-sized Chromium pointer input is not physical touch/Safari/Firefox acceptance. Normal 4175 save is preserved; no publication/submission.

---

# v0.13.0 — crop care and resource progression

npm test: **208 passed**. npm run build: success. Native Chromium desktop/portrait/landscape verified controls -> gameplay -> local save -> visible scene/stat/inventory response, using an isolated fixture origin and read-only QA DOM attributes. Orders/projects reject repeat rewards and show saved changes; Farm decorations craft/place/block/pack, stone paving reloads; hearth build/cook/food eat yields capped gains and persists. First watering leaves Tomato unripe next day; third care midnight ripens it; world harvest yields two fruit; Pumpkin shows six-day duration. Existing daily/drought/farm/save/forest/movement rules remain covered by regression. No browser warnings/errors. Evidence/actual checks and screenshots: docs/verification/resource-projects. Normal save was refreshed/continued/paused, QA origin/tab/server removed, viewport reset. Physical mobile/non-Chromium not tested.

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

# v0.11.0 — Home and mobile movement, 2026-10-09

**189/189 tests and production build (104 modules) pass.** Focused regressions cover normalized diagonals/analog strength/stable facing, joystick pointer ownership plus separate actions, release/reset, shared house masks, six-size room BFS to bed/exit and outdoor jump collision/energy/interior gates. Native browser checks at desktop/portrait/landscape verify house entry/sleep/exit, keyboard/joystick diagonals, mobile Attack (+2 Meat/-1 EP), Jump across a Forest ledge, Pause/rotation reset and saved landing on Continue. Browser warnings/errors empty. Runtime native audit keeps eight art paths/twelve dist files, 833 unchanged old non-house cells, thirteen original house redraws and twelve original additions; see [evidence/limits](verification/home-mobile/README.md). Physical multi-touch is not claimed; independent pointer behavior is unit-tested.

---

# v0.10.0 — depth, rivers and return gate, 2026-10-09

**184/184 tests and production build pass (102 modules).** Native input checks at 1280×720 and 360×640 cover revised Home door entry, closer/wider camera, dry vertical fork crossing, wading reflection, branching map, rocky landmark, cliff collision/free jump, keyboard/touch central gate entry, preserved coins/inventory/energy and arrival persistence on Continue. No browser warnings/errors. Eight runtime art paths/twelve dist files, 825 unchanged old non-house cells, thirteen original redraws and eight native licensed additions are audited against ba601de. See [scene depth evidence](verification/scene-depth/README.md), browser-checks.json/runtime-audit.json and source record assets/licenses/rocky-depth. Reproduce: npm test; npm run build; bundled Python scripts/qa/scene-depth-audit.py.

Updated normal preview opened without reading/resetting saved storage; temporary QA/tab/viewport cleaned up. Physical devices, other engines, sustained performance/human acceptance remain unverified. Cliffs are visual height/blocking faces, not full elevation; rocky objects are scenery. Earlier unrelated licence/submission limitations remain; no push/publication.

---

# v0.9.0 — Forest update verification, 2026-10-09

**182/182 tests and production build pass (99 modules).** Regressions cover seven independent climate fields, dry shelf geometry, walking gaps/jump crossing, old resource/cut/animal/cache/discovery IDs, free misses/cooldowns, reduced work costs, awake midnight without fatigue, food/crop/sleep/City rules, and synthesized sound profiles/muting/local preference/storage failures. Existing complete-region/resource reachability and all farming/economy/save tests remain green.

Native browser checks use isolated port 43868, actual input and read-only DOM snapshots. Desktop/phone-size rendering, screen attacks/impact timing, idle/action EP, ledge stop/jump, habitat map/profiles, watering and Pause sound persistence are documented with screenshots. Runtime: 12 files, exactly eight unchanged art files, 838 retained atlas frames; no source packs/QA/audio downloads. Reproduce: npm test; npm run build; bundled Python scripts/qa/forest-refresh-audit.py; QA_PORT=43868 node tests/browser/city-redesign-server.mjs. [Evidence and limits](verification/forest-refresh/README.md). Physical devices, other engines, sustained load and audible sound quality remain unverified; no push/publication.

---

# v0.8.0 — hunting, stones and healing, 2026-10-09

**175/175 tests and production build pass.** New regressions cover free-axe/retained-club damage/cooldown/energy, all quiet species and one-time loot, saved animal death/daily revival, collision/target rejection/full-loot atomicity, pure movement, 240 dry stone nodes in 40 regions, daily collection/reload, health/energy caps and no wasted food, schemas1–11 migration, preserved sale ordering and phone/compact UI. Axe tests require blade above/outside native grip throughout swing and no added hand.

Actual desktop/phone inputs verify axe pose, keyboard/tap hunting, Meat page 2/eating, fruit healing at full energy, stone pickup and fixture-free reload persistence. A discovered grass-priority bug was fixed and retested. Empty warnings/errors. Normal preview refreshed without resetting storage; QA cleaned up. **96 modules, 12 files / 2,287,312 bytes**, eight-file art allowlist; 835 retained cells and three original appended cells. [Evidence/limits](verification/hunting-resources/README.md). Reproduce: npm test; npm run build; python3 scripts/qa/hunting-resources-audit.py. Physical devices, other engines and sustained performance are unverified; no push/publication.

---

# v0.7.3 — axe/road/HUD repairs, 2026-10-09

**167/167 tests and production build pass.** Road regression checks every enlarged City house silhouette and all twenty sunflower pots against all paved circulation. Axe regressions check native-hand grip, hidden extra hand, outward blade at idle/half/full swing, all four facings and behind-up/front-other depth. Existing matched people, dry commuting, farming, commerce, saves, water and compact HUD regressions remain green.

Native in-app browser checks on isolated origin 43866 use actual key 5 and WASD: four axe facings, clear walkable cottage lane, matching round meters at 1280×720, 360×640 and 640×360. Empty warning/error logs. Normal preview 4175 refreshed without resetting its save. **94 build modules, 12 files / 2,280,176 bytes**, exactly eight byte-identical art files and 835 atlas frames. Reproduce: npm test; npm run build; python3 scripts/qa/street-hud-audit.py. [Evidence and limitations](verification/street-hud/README.md). Physical phones/other engines/sustained performance/human acceptance remain unverified. No push/publication.

---

# v0.7.2 — character/planting repairs, 2026-10-09

166/166 tests/build pass. Native size/face/alpha audit confirms eight adapted farmer NPC palettes with identical native body proportions; twelve planted seed frames are the only changed old cells. Existing axe regressions now assert vertical inversion, front depth, outside-body idle position and blade clearance throughout the swing. Prior utility pause/switch, schedules and complete gameplay regressions stay green.

Actual in-app browser inputs on isolated QA origin 43865: first planting consumes one seed (3→2) and renders grains rather than a packet; four axe facings show clear hand/torso separation; City/Home actors share farmer style/scale; 360×640 direct Mara tap opens the conversation. Errors/warnings empty. The same eight art-file allowlist remains, 12 production files / 2,278,525 bytes. Evidence/reproduction: [character repair record](verification/character-fixes/README.md). Physical phones/other engines/sustained performance remain unverified; no normal-origin reset, push or publication.

---

# v0.7.1 — town polish, 2026-10-09

**166/166 tests and production build pass.** Six added regressions cover every resident/seller dry commute and doorstep timing, pause/reload poses, 13 unique larger house/collision silhouettes, axe grip/facings, matching HUD geometry/no USE control across six viewports, and broad bridge-safe City water motion. Existing 160 checks retain commerce/farming/Forest/time/saves/UI. Compact 640×360 crop guidance also passes the retained placement regression.

Native browser verification: City/Forest wading reflection and moving water; dry bridges; axe in four directions; dawn/return/hidden night residents and sellers; nearby conversation taps, portrait seed purchase (60→50 coins), Home door tap, produce selling (60→81 coins), crop watering with evening care, and readable desktop/portrait/compact HUD. Errors/warnings empty. Eight runtime art files; 675 atlas cells with every prior 662 cell/metadata unchanged. See [full record](verification/town-polish/README.md) and browser screenshots/read-only snapshots. Chromium viewport emulation only; physical devices, other engines and sustained performance remain unverified. No normal-origin save reset, push or publication.

---

# v0.6.2 — garden tools, 2026-10-08

Evidence: verification/garden-tools. npm test passes 157/157; npm run build passes. Added regressions cover every authored tree registry/tree silhouette, one-time wood/collision removal and reload, independent farms/free digging, grass conservation/legal placement/cleanup, atomic energy/full-stock/forged-ID rejection, wall reach, cut-tree fruit refresh, schema migration, all twelve full-care harvest loops, actual held view pause/directions/switching, cleanup/buckets and Gear bounds at seven sizes. Existing economy/time/farming/forest/recovery tests remain.

Native CUA in-app browser QA at 1280×720 and 390×844 used actual keyboard/pointer input on a fresh test origin at port 43862: held shovel/axe, tree cut/+3 wood, hand gather/+1 grass, replant, reload persistence, walk through cleared roots, twelve distinct packets, starter/travel/planting and one-night Tomato guidance. Gear/equip fits the phone viewport. Final production reload/Continue and warning/error log checks pass. These are browser viewport checks, not physical mobile certification. Full care-to-harvest for all twelve is automated; browser evidence documents only interactions actually observed.

Reproduce: npm test; npm run build; Python with Pillow: python3 scripts/qa/garden-tools-audit.py. Audit compares f87c2cf, asserts stable old frame positions, 532 unchanged cells, only 24 original seed changes, four new icons, six byte-identical other art files and eight-file runtime allowlist. atlas-study.png is explicitly an offline source-pixel gallery; JPEG files are native browser captures. No user-origin storage mutation/reset, push or publication. Physical phones, Safari/Firefox/Edge, sustained performance and human acceptance remain unverified.

---

# v0.6.1 — watering and ground repairs

144/144 npm tests pass; production build succeeds. Five new tests verify enough energy to plant/water all starter cells, one-hour fatigue/reload/old remainder, actual HeldWateringCan local frame and four directions/jump/pause/hide, Atmosphere pour droplets starting at the held spout without a second object, and coordinate-overlap equality plus rounded transparent/mottled soil. Prior full farming/save/window/economy/forest/UI regressions remain.

Three labelled offline Farm/held-can command studies generated and reviewed, with two marked close-up crops. Boy/girl hand positions and both directions of flipping were inspected; wet/dry soil/care markers retain correct appearance. These are approximate Pillow rendering, not browser screenshots or keyboard/pointer acceptance. Pixel audit verifies all 555 previous atlas cells/coordinates unchanged and one original can frame appended; six other art files unchanged. Production/HTTP identity: verification/farm-polish/runtime-audit.json. Browser interaction/animation/touch/renderer/performance checks remain unverified under the existing browser-tool URL rejection, with no bypass/live user storage access.

---

# v0.6.0 — free farming verification

139/139 tests pass and npm run build succeeds. Fourteen new regressions cover free/repeated/unsafe/far/exhausted digging, individually dug locked-field planting, custom-bed care/growth/reload/harvest, old paid-farm migration, malformed/overlapping/unsafe ground records, outdoor wet-ground expiry/reload/sleep, care-window/repeated-water behavior, pointer/facing/nearby-door context, connected soil/markers, all twelve crop purchases and bag pages at seven sizes, edible farm fruit, extending existing beds, and actual FarmView draw commands. Existing farming, survival, City, night, font/Canvas-engine, saves and UI tests remain green.

Two labelled FarmView studies and 51 labelled UI studies generated; six selected images reviewed and retained in verification/free-farming. Final shop/bag portrait pages, Farm HUD/shovel, joined dry/wet soil, new crop sprites and drop/red ! markers were inspected. The offline recorder's new shop-last/produce-last routing error was fixed before final image retention. These are approximations from real draw commands, not native browser captures or input acceptance.

Runtime/pixel audits confirm eight allowlisted art files, 12 production files / 2,058,100 bytes, all old atlas coordinates unchanged, 81 appended original frames, 32 original crop frames recoloured, 442 other old frames pixel-identical, and six other art files byte-identical. The restarted preview serves the current index and byte-identical index-BhCnPkEd.js bundle over HTTP. Logs, hashes, images and commands: verification/free-farming/README.md. Native browser interaction/rendering, watering animation/input/touch, physical-device performance and human acceptance remain unverified because the browser tool previously rejected localhost access. No workaround or live user-save access.

---

# v0.5.2 font recovery
125/125 tests and production build pass. The pinned-loader/texture/Canvas regression reproduces the previous invisible-text failure, then verifies the full sheet is copied. Original alpha audit: zero visible pixels in the former 3×7 SPACE crop, 1,024 in the complete 128×64 sheet. Eight runtime art files are unchanged; HTTP serves the current build. Logs, hashes, pixel audit and five selected labelled offline studies: verification/font-recovery. Forty-two studies generated; shop and portrait bag inspected. Browser acceptance remains unverified because of the existing local-URL policy rejection; no bypass or user save access.

---

# v0.5.1 UI repairs
125/125 tests pass; build succeeds. New coverage: real pinned Canvas BitmapText renderer source selection for four UI colours and font-cache reuse; fractional clock boundaries across the day; actual Forest HUD Map action/menu generation at all seven viewports. Numeric tool overlays are absent. Existing gameplay, bag, discovery, bounds and save tests remain green.

The offline adapter now uses baked font colours and no longer pretends Canvas text tint works. Updated 42 labelled studies under verification/ui-fixes are supplemental; selected shop/HUD/map layouts were inspected. The earlier v0.5.0 study tint assumption was wrong, as confirmed by the user's screenshots. Actual browser interactions still cannot be verified under the recorded local-URL policy. Evidence includes test/build logs, byte/allowlist audit and read-only preview HTTP checks; no live storage was used.

---

# v0.5.0 — notebook UI, 2026-10-08
`npm test`: 122/122; `npm run build`: succeeds. Ten new tests exercise key gates/Space versus K, paired touch taps, seven-viewport bounds, actual HUD control placement/map restrictions, four bag categories and guarded actions, hidden/revealed notebook terrain/player projection, generic menu controls, Graphics hit/hover/disabled behavior and compact crop inspection/text bounds. Existing 112 gameplay/art/save tests remain green.

Reproduce supplemental offline studies with `node scripts/qa/notebook-ui.mjs`, then Pillow Python `scripts/qa/notebook-ui.py`. The Node adapter records actual component draw commands without starting Phaser, a browser or live storage; Python renders them over a retained offline world-study background. Forty-two outputs cover fourteen states × 1280×720, 390×844 and 640×360; selected outputs were visually inspected. Every image is labelled OFFLINE UI STUDY / NOT A BROWSER CAPTURE. Bounds tests additionally cover 1440×900, 1024×768, 844×390 and 360×640. This does not exercise browser renderer/input dispatch or real touch gestures.

Local-preview URL security was rejected earlier by the browser tool. No alternate browser/CDP/OS route was used to bypass it. Browser acceptance for this version remains unverified; historical browser evidence below does not validate this redesign. Test/build/runtime-byte audit and read-only local HTTP health evidence: `verification/notebook-ui/`. No live save was changed. No publication or push.

---

# v0.4.9 expanded forest validation — 2026-10-08
112/112 automated tests and production build pass. New checks cover exactly twofold area/original region coordinates, moderate western thinning, native wavy-bank geometry, GPU-safe complete terrain tile coverage, all-dry fruit/new homes, small native animal groups and schema-9 old-progress/new-region initialization. Existing BFS reaches all forty regions/163 fruit spots/fourteen caches; water/bridge/grass/root/boar/combat/day/club/25%-coin recovery/farming/City/sleep/save regressions pass. Existing water tests now select actual channel centres instead of assuming the previous straight bank/bridge centre.

All eight art files match baseline 8275b7f; twelve production files / 2,008,179 bytes. Local preview serves the current index-BIKc8sEC.js. Three visibly labelled offline art studies were inspected; native browser/responsive/interaction/Canvas/WebGL/device performance checks remain **unverified** due browser URL policy. No indirect browser workaround or live user-save mutation. Detailed commands/evidence: [verification/forest-expansion/VERIFICATION.md](verification/forest-expansion/VERIFICATION.md). Older browser results below are historical.

---

# v0.4.8 reference forest validation — 2026-10-08
**106/106 tests**, production build, pixel/source/runtime allowlist and whitespace audits pass. Connected routes/guards/saves/removal/material checks retain farming/City/day/sleep/jump/water/recovery rules. Offline Homewood/Deepwood/riverbank art studies were inspected and are explicitly labelled. Native browser interaction/responsive/performance QA is blocked by browser URL policy and remains unverified; previous browser results below are historical. Local 4175 responds with the updated production build. [Checks, reproduction and limits](verification/forest-reference/VERIFICATION.md). No live-save QA edits, push, publication or submission.

---

# v0.4.7 animal validation — 2026-10-08
103/103 npm tests, production build and pixel/source allowlist audit pass. Added tests cover all 22 species across actions/directions/time, side/four-direction facing and real warning fallback, stable native-pixel foot origins, complete provenance/removal of placeholders and creator/licence credits. Native CUA Continue checks render all fifteen new species in their habitats. Native Right/Space hits an isolated prepared one-health wolf, awards one Hide and hides its art/shadow; reload/Continue retains defeat/reward. Five artist credit pages and the Craftpix entry fit desktop, short landscape and portrait screens. WebGL wolf idle/walk/warning/run frames and frozen pause timing are verified; portrait Monkey labels and controls fit. Evidence/logs: verification/wildlife-sprites; full source/limits: assets/licenses/wildlife-sprites/SOURCE_RECORD.md. No full farming replay, physical-device or final human acceptance claim.

---

# v0.4.6 Forest theme/bridge — 2026-10-07
**99/99 tests and production build pass.** New checks cover palette preservation, every bridge's bank coverage/traversability and merged night-shade coverage. Isolated CUA browser checks verify bridge day/night, native bank-to-bank crossing without wading, portrait controls, pause/save/reload, jumping and palette/river appearance. All eight art files are unchanged; 12 production files / 2,031,148 bytes. Current evidence: verification/forest-theme. User save untouched; physical devices/other engines/final human acceptance remain unverified. No publishing/push.

---

# v0.4.5 forest shore cleanup — 2026-10-07
**96/96 tests and production build pass.** Isolated CUA browser checks verify actual canvas-controlled water walking, dry bridge deck, bank collision/jump/landing, pause/Save/reload, mixed trees, old stone structure removal and waterfall-free WebGL night water. Desktop/portrait/short landscape inspected; no observed browser errors/warnings. The eight-file art allowlist remains; previous 553 atlas frames and both farmer sheets are pixel-identical. [Evidence, reproduction and limits](verification/forest-shore/VERIFICATION.md). No live-save changes, push or publication.

---

# v0.4.4 ground/river materials — 2026-10-07
**92/92 unit tests and production build pass.** Final isolated Chromium growth/water/material suites verify affected interactions at seven sizes, Canvas/WebGL day/night, all nine habitat palettes and water animation pause/resume. Empty error/warning/failed/foreign-request arrays. Same eight byte-identical art files; 12 production files / 2,024,149 bytes. [Commands, evidence, visual review and limitations](verification/terrain/VERIFICATION.md). No user live-save edits, push or publication.

---

# v0.4.3 supplied art — 2026-10-07
88/88 tests and production build pass; 72 native player cells audited (48 idle/walk exactly source-identical), 553-frame atlas, same eight runtime art files. Full forest jump/grass/water/save regression passes; final both-character/five-area/four-direction/seven-habitat/seven-viewport selection/credit/crown checks, two-finger jump/repeat and actual new-game/water/save flows pass in isolated Chromium. Empty browser errors/warnings/failed/foreign requests in main/final art reports. Production: 12 files / 2,021,045 bytes, no source packs or unused/evidence assets. [Detailed commands, corrections, timing and limitations](verification/supplied-art/VERIFICATION.md). Physical devices/non-Chromium/human acceptance and ToffeeCraft public prize-entry rights remain unconfirmed. Nothing pushed or published.

---

# Forest growth and jumping — v0.4.2, 2026-10-07

Evidence: **verification/forest-growth/**. Baseline clean **8fc977a**, 83 tests/build (`baseline-tests.txt`, `baseline-build.txt`). Final **88/88 tests**, production build (`tests.txt`, `build.txt`), whitespace and runtime allowlist audit pass. `build-audit.json`: **1,978,827 bytes / 12 files / eight art files**, no vendor/archive/guide/unused-pack/QA/evidence files. `art-audit.json`: all 48 previous idle/walk/face cells pixel-identical, 24 new distinct jump poses, 27 grass frames, four licensed cliff cells, 545-frame atlas; neither supplied pack integrated. `boy-all-frames.png` / `girl-all-frames.png` inspect all 72 cells.

`tests/forest-growth.test.js` adds five meaningful checks: ledge walking/stairs and jump crossing/cooldown/grounded reload, swept tree/cave/boundary blocking and invalid-origin refusal, safe zero-energy interruption, density/route preservation, actual animal damage during a leap. The retained 83 crop/economy/time/ownership/survival/cache/migration/shared-water checks pass, including BFS reachability for all fruits/caches and every species' safe group home.

`tests/browser/forest-growth.mjs` → `results.json`: real keyboard walk stops at ledge; J leaps and lands above it, airborne attack spends nothing; Shift/pause freezes elapsed arc, Save/reload/Continue stores take-off and resumes standing; girl/boy directions; grass bends under the farmer and springs back after leaving; distant grass remains uninstantiated; water wading/crop hides during flight and restores after landing/reload. Zero-energy touch JUMP and help/control bounds pass **1440×900,1280×720,1024×768,844×390,390×844,360×640,640×360**. Canvas and WebGL night grass/jump render. Native/cliff/grass/jump/phone/short-help/renderer screenshots inspected.

`tests/browser/asset-water.mjs` → `water-regression/results.json`: PASS for retained actual direct river crossing away from bridges, waterfall centre, Home/Farm ponds, wet Save/refresh/Continue, native Boar hit/flee/hide/reload, four woodland species, ruins/plants, held touch, both linked Credits panels/seven sizes and Canvas/WebGL night water.

`tests/browser/forest-growth-final.mjs` → `final/results.json`: final production PASS for simultaneous touch direction+jump, correct horizontal destination, continued movement after releasing the jump finger, and no extra jumps from held/repeated J events. An initial fixture stopped at a real tree; the test now uses a verified collision-free trail, without weakening input/collision assertions. Full growth/water runs preceded only the final crouch-versus-landing leg spread and non-gameplay debug/snapshot/record changes; final smoke, all unit/build and pixel/source audits follow them. No newly grown full farming loop is claimed for these art/jump changes; previous full-loop evidence is historical.

All completed reports have empty error/warning/failed-request/foreign-request arrays. QA uses disposable isolated Chromium localStorage, prepared starting fixtures, actual keyboard/mouse/CDP touch and read-only snapshots. User-origin saves remain untouched. Supplied archive/licence audit is in assets/licenses/forest-growth/SOURCE_RECORD.md. No purchase, creator contact, subagent, runtime dependency or image-generation service.

Reproduce with production preview on 4175 and an isolated Chromium CDP endpoint:

```sh
npm test
npm run build
npm run preview -- --port 4175
# Supply CDP_URL and PLAYWRIGHT_MODULE if using bundled QA tooling.
node tests/browser/forest-growth.mjs
node tests/browser/forest-growth-final.mjs
QA_OUTPUT=docs/verification/forest-growth/water-regression node tests/browser/asset-water.mjs
```

Physical phones/non-Chromium engines and prolonged human balance/performance/visual acceptance remain unverified. Exact supplied player/environment replacement is pending compatible rights. No push, publishing or deployment.

---

# Supplied assets / water acceptance — v0.4.1, 2026-10-07

`npm test`: **83/83 passed**. `npm run build`: success. Five new tests check whole-river continuity/bridge coverage, direct water traversal with solid fall rock banks and river refill context, wet player/bag save integrity, shared render/wading geometry, actual licensed animation keys and atlas bounds. Existing crop/economy/time/expansion/survival/treasure/migration/reachability tests still pass; former blocked-pond expectations were updated to the user's new walkability requirement. Final build/runtime art/source archive audit: asset-water/build-audit.json.

`tests/browser/asset-water.mjs` passed against local production on port 4175 using disposable localStorage and read-only snapshots. Real keyboard input crosses the river away from all bridges, saves/refreshes/Continues inside water, exits onto land, walks into/out of Home/Farm ponds and through the waterfall centre. A real club swing drives the new Boar sprite away, gives exactly one hide, and preserves defeat after reload. Four ambient woodland species, textured ruin/animated flora and both waterfalls render without missing frames. Held real touch moves while wading. Both Credits panels and gameplay controls fit 1440×900, 1280×720, 1024×768, 844×390, 390×844, 360×640 and 640×360; Canvas and WebGL night water both load. Browser console errors, warnings, failed asset requests and foreign runtime requests are empty. Results and screenshots: verification/asset-water/.

The final idle-animation correction gates zero-speed woodland movement; targeted final production smoke confirms visible idle frames and repeats direct river traversal with no console/resource errors (final-smoke.json). No gameplay contract changed after the seven-viewport pass. Credits' short landscape text was shortened after a clipped panel was detected; final minimum-size checks pass. Timing-based river movement in an early browser attempt was replaced by measured keyboard endpoints; no collision failure is hidden by a fixture teleport during the crossing.

Repeat: start `npm run preview -- --port 4175`, connect an isolated Chromium CDP session, set CDP_URL and PLAYWRIGHT_MODULE if Playwright is external, then run `node tests/browser/asset-water.mjs`. Screenshots and results stay outside production. Pack identities are limited to Boar/Fox/Hare/Deer/Grouse; remaining combat species keep original sprites. Browser coverage is Chromium desktop/touch emulation, not certification of physical devices or other engines. Existing complete farming/treasure loop evidence remains historical; this pass adds focused affected-flow verification. No remote publishing or user-save edits.

---

# Verification — large wilderness, 2026-10-07

Current evidence: **docs/verification/wilderness/**; version **0.4.0 / schema 9**. Isolated Chromium, disposable localStorage, real keyboard/mouse/touch and copied read-only QA snapshots. The user's live save is untouched. Browser fixture setup prepares explicit starting saves; it is separate from real-input interactions and is not claimed as a New Game farming loop.

- Clean baseline **38aacac**: **71 tests**, production build passed before edits. Final **78/78 tests pass** (`tests.txt`). Seven new tests cover 20-fold area, all 22 species/safe groups and species-sized bodies, route connectivity to every region/fruit/cache, species melee/damage/shared group immunity, territory and later-day respawn, guarded finite treasure and reload, v8 player/boar/bag translation with unchanged prices/progress, malformed v9 records. Retained farming/City/expansion/day-night/food/boar/death/bag tests pass.
- Production build passes (`build.txt`, `build-files.json`): **12 files / eight allowlisted art files / 1,784,795 bytes**. Atlas has 252 frames; boy/girl sheets remain unchanged. No vendor archives, source manifest/generator, QA images, unused pack or new dependency ships. No whitespace errors.
- `tests/browser/wilderness.mjs` full run (`results.json`): PASS for Home north edge → actual walk to a newly discovered region → gather fruit → pause/read/keyboard map → return Home/save/reload. All 20 regions and all 22 species load at their own habitats. The snake cave initially blocks its chest; actual directional attacks drive all three snakes away, then USE pays 424 coins once (60 → 484); saved collection survives refresh/Continue. Species/region/cave/collection screenshots are under this folder. Cave test uses a prepared equipped-character save; no health/animal/treasure mutations occur during combat.
- Final focused run (`final/results.json`): PASS for **1440×900,1280×720,1024×768,844×390,390×844**. Map fits, discovered/unknown regions and species hit/damage data show, touch/keyboard region navigation works, paged nine-fruit FOOD fits including navigation controls and touch eating, four market pages fit. Actual bridge traversal and animated waterfall inspection pass. At the far north, Canvas and WebGL night both retain distant .78 darkness and stepped nearby light. Local 60-frame median 16.7ms is only a desktop sample.
- Retained `forest-survival.mjs` focused run (`forest/results.json`): PASS for first-visit pause/completion, closed Outfitter keeper, zero-energy food/attack, full-energy non-consumption, touch attack, simultaneous two-finger movement, second bag replacement and reload during defeat fade, Canvas/WebGL night and all five sizes.
- Retained `city-economy.mjs` focused run (`city/results.json`): PASS for exact quantities/repetition gates/hours, repeated travel, keyboard/touch purchases and planting, aid, four crop panels, city collisions, unchanged saved prices, old-save migration, signs and Farm-board trading.
- All completed reports have **zero page/console errors, warnings, failed HTTP requests or foreign runtime requests**. Visual QA inspected region/group sprites, native snow/dry tree detail, cave and treasure, map/food short and portrait layouts, bridge/falls and far-north darkness.

Corrections: final map clue/footer spacing and portrait food arrow positions were repaired after screenshot review and repeated at all sizes. The first cave navigation test tried to maintain an exact coordinate during knockback; its real-input combat driver now approaches and aims while animals move. A denser vegetation pass briefly covered a hippo spawn; species clearing exclusions repair it, with every body's safe spawn and all destinations validated afterward. Larger-world night depth/masks, terrain caching and collision indexing are covered by route/rules and actual renderer/browser checks. Development collision outlines are retained.

The full exploration/cave playthrough precedes only final UI spacing/species-value text and a development-only debug fix. Its relevant layout/renderer cases were repeated on the final production build. Current farming rules and focused City/Farm/forest regressions pass; the previous complete New Game crop/survival playthrough remains historical, not another full-loop claim for this extension.

Reproduce with an isolated Chromium CDP endpoint; set CDP_URL and optional bundled PLAYWRIGHT_MODULE:

```sh
npm test
npm run build
npm run preview -- --port 4175
GAME_URL=http://127.0.0.1:4175/ node tests/browser/wilderness.mjs
QA_OUTPUT=docs/verification/wilderness/final SKIP_LOOP=1 GAME_URL=http://127.0.0.1:4175/ node tests/browser/wilderness.mjs
QA_OUTPUT=docs/verification/wilderness/forest SKIP_LOOP=1 GAME_URL=http://127.0.0.1:4175/ node tests/browser/forest-survival.mjs
QA_OUTPUT=docs/verification/wilderness/city SKIP_LOOP=1 GAME_URL=http://127.0.0.1:4175/ node tests/browser/city-economy.mjs
```

Physical phones/browser chrome/notches and non-Chromium engines remain unverified. Audio is silent; prolonged balance and human acceptance are pending. No push, publish, deploy or unrelated progression.


---

# Verification — Milestone 3, 2026-10-07

Current evidence: **docs/verification/forest/**. Production preview on local port 4175, isolated Chromium and disposable saves. Actual keyboard/mouse/touch drives gameplay; `?qa` provides copied read-only state/UI/combat snapshots. No user save or gameplay mutation hook was used. Supplemental fixtures initialize isolated localStorage deliberately; the complete playthrough starts with New Game.

- Baseline `878d155`: clean repository, **56/56 tests**, production build successful before edits. Final `npm test`: **71/71 pass**; 15 added survival tests cover routes/cooldown/collision, collection/day/reentry, eating/selling, permanent club/hours, directional attacks/cooldown/cost, boar warning/charge/solids/damage/invulnerability/defeat/night behavior, next-morning care settlement and coin rounding, bag recovery/replacement/persistence, schemas 1–7 migration and malformed schema-8 repair. Existing farming, city, expansion and day/night suites pass. Log: `tests.txt`.
- `npm run build`: PASS, 12 files, eight allowlisted art files, **1,711,341 bytes**. Inventory: `build-files.json`; log: `build.txt`. No new runtime dependency, vendor/source archive, unused pack, QA artifact or remote runtime asset enters dist. Whitespace check passes.
- `tests/browser/forest-survival.mjs` complete run: PASS. New girl/starter → AM+PM Tomato care over three real sleeps → harvest/sell → buy club → first forest visit → berry/guava → eat → boar hurt/defeat/hide → mango → leave/reenter without refresh → fruit/hide market sales → bed/new-day boar → die → first-death guidance → save/reload preserved bag → return/recover → Home/save/reload. Evidence: `natural-loop.json`, `results.json`, `natural-*.png`. Final day 6 / 101 coins / saved equipped club / tutorial and defeat flags / no stash. Numerical inventory, damage, prices and floor-25%-loss assertions pass.
- Final focused run on the final production build: `final/results.json` PASS. **1440×900, 1280×720, 1024×768, 844×390, 390×844**: FOOD/GEAR/Outfitter/fruit market fit, controls stay in viewport, touch eat/attack, paused state, tutorials shown once, closed keeper hidden, zero-energy eating-to-attack, full energy prevents consumption. Two-finger touch keeps movement held when the attack finger lifts. Second defeat replaces a prior 50-coin bag with the new 24-coin bag; refreshing during the fade preserves day 2 / 75 coins / full health. Night matches in default Canvas and explicit `?renderer=webgl` with the .78 distant overlay intact. Screenshots: `final/`.
- Existing `tests/browser/city-economy.mjs` focused regression: `city/results.json` PASS at all five sizes. Buy/sell quantities, rapid repetition, hours, repeated gates, touch/keyboard, aid, crop panels, city geometry, stable prices/reload, legacy migration, wooden signs and retained Farm-board trade. The real farming/sales loop is also exercised by the new full survival playthrough.
- All completed browser reports have **zero errors, warnings, failed HTTP requests and foreign runtime requests**. Visually inspected day forest, shrine/path/fruit, boar damage/defeat, death/recovery, compact/portrait FOOD/GEAR/shops, final inward arrival, two-finger combat and pixel night bands. Default Canvas and WebGL use the same stepped Graphics geometry. Atlas retains both original farmer sheets and their facial pixels; original frame verification from prior milestone remains applicable.

The full playthrough preceded the final safe inward-arrival and independent pointer-release corrections. The affected routes, five-size layouts, touch combat and interrupted defeat cases were repeated afterward; this is recorded separately rather than claiming another full farming playthrough on unchanged rules. A preliminary two-finger test used an invalid CDP partial `touchEnd`; the driver now changes the active-point set with `touchMove`, then ends all points with an empty `touchEnd`. The corrected real-input test passes. During implementation, defeat initially let the old forest view see the new interior state during the fade; the WorldScene transition guard fixes this, and complete-loop plus final interrupted-fade checks pass.

Reproduction (bundled Playwright may be supplied through PLAYWRIGHT_MODULE; no test package becomes a runtime dependency):

```sh
npm test
npm run build
npm run preview -- --port 4175
# Launch a disposable Chromium profile with a local remote-debugging endpoint.
# Set CDP_URL to that endpoint and PLAYWRIGHT_MODULE if needed.
GAME_URL=http://127.0.0.1:4175/ node tests/browser/forest-survival.mjs
QA_OUTPUT=docs/verification/forest/final SKIP_LOOP=1 GAME_URL=http://127.0.0.1:4175/ node tests/browser/forest-survival.mjs
QA_OUTPUT=docs/verification/forest/city SKIP_LOOP=1 GAME_URL=http://127.0.0.1:4175/ node tests/browser/city-economy.mjs
```

Physical devices, notches/browser chrome and non-Chromium engines remain unverified. This is automated/visual QA, not human acceptance or a prolonged balance study. Audio hooks are silent because no suitable licensed sound assets exist. No push, publish, deploy or Milestone 4.

---

# Current verification — clean shops/day-night, 2026-10-07

Version 0.2.1, schema 7. `npm test`: **56/56 pass**. `npm run build`: succeeds with 12 runtime files and eight allowlisted art files; inventory is verification/day-night/build-files.json. No dependency/raster art changes or remote runtime requests.

`tests/browser/day-night.mjs` exercises real-input bed sleep (daytime, evening, before/after midnight), continuous awake midnight with single cared-for crop growth and new prices, energy drain/zero-energy movement, before-dawn save/reload, shopkeeper close/hide and closed interactions, compact shop quotes/optional information, keyboard crop cycling/purchase and touch selection. Seven viewports: **1440×900,1280×720,1024×768,844×390,390×844,360×640,640×360**; shop/detail/BAG text and controls stay in bounds and paused state remains frozen. Evidence: verification/day-night/results.json and screenshots. Final production run follows the coin-header spacing and smooth lighting-colour correction.

The adapted City acceptance suite selects quantity then confirms, uses crop-icon tabs, and uses daytime sleep to 20:00/evening sleep to 06:00 for farming. The real new-game Tomato → City sale → Strawberry buy/grow → second sale → save/reload loop passes (natural-loop.json), ending day 8 with 138 coins and four sold items. Reload compares persistent progress and saved fatigue plus elapsed awake time, rather than assuming energy freezes after Continue. Full results.json and focused final/results.json pass quantity/repeat/closed/touch/keyboard/price/migration/collision/sign/Farm-trade checks; browser errors/warnings/HTTP failures/foreign requests are empty. Evidence: verification/day-night/city/. Historical suites expecting the retired Rest-until-evening or Sleep-next-day UI and 23:50 cap belong to previous versions; their old reports are retained. Current continuous-clock rules are covered by the new suite and updated Node tests.

All browser evidence uses isolated Chromium/disposable saves and real keyboard/mouse/touch with read-only snapshots. Physical devices and non-Chromium engines remain unverified. No final human acceptance or publish/push is claimed. Reproduce with PLAYWRIGHT_MODULE, CDP_URL and GAME_URL and run the two current browser scripts against a production preview.

---

# Historical verification — Milestone 2 City and Economy V1, 2026-10-06

Version 0.2.0. Isolated Chrome CDP profile and Playwright contexts, disposable localStorage, real keyboard/mouse/touch, no state mutation hooks or user-save edits. The bundled Playwright fallback is used because agent-browser CLI is unavailable.

- Baseline c3142d4: 39 tests/build, Home/interior/Farm geometry/bed/doors and five sizes passed before editing. Baseline screenshots stayed in /tmp/simple-life-city-baseline.
- Final `npm test`: **50/50 pass**. Eleven added tests cover four crop growth/status/configuration, integer buy/sell quantities/caps/atomicity, inventory separation and empty-stock messages, daily price bounds and determinism across 100 days, hours/context, safe routes/tutorials, schemas 1–5 migration with paid farms, input gates and seed aid.
- `npm run build`: **PASS**, **1,679,409 bytes**, twelve output files and exactly eight allowlisted runtime art files. No new dependency or remote runtime resource; no source/vendor/archive/QA assets. Inventory: city/build-files.json. `git diff --check`: clean.
- Full `tests/browser/city-economy.mjs`: natural New Game girl with 60 coins / three starter seeds / three fully watered Tomato nights / first-harvest City objective / Home east travel / sell / buy Strawberry / Home/Farm return / four fully watered nights / harvest / City sale / Save/refresh/Continue. All sale and persistence assertions pass; recorded seed 446008489 produces final day-8 **138 coins**, two starter seeds left, zero harvested stock, four total sold and four saved tutorial flags. Report: city/natural-loop.json; visible evidence: completed-two-crop-city-loop.png and intermediate growth/market/objective shots. No growth/time/inventory injection in this natural run; evening rest and sleep were selected at the actual bed.
- Full suite `city/results.json` and final focused `city/final/results.json`: Buy 1/5/Max, Sell 1/5/All, empty/insufficient states, rapid buy/sell bursts, closed-hours interaction and paused finish near closing, three City round trips, keyboard purchase, touch buy/select/Corn plant+water, all four crop panels, daily rendered-price label on reload, legacy City migration, counter/post/back/fountain collision, wooden sign text containment and retained Farm-board trade at matching daily prices.
- **1440×900, 1280×720, 1024×768, 844×390, 390×844**: City and all eight seed/produce crop pages fit; UI button and actual rendered text bounds stay inside the panel. No DOM HUD or document scrolling. Large portrait quantities keep exact coin totals and a readable quantity summary. Gallery checks confirm 32 nonempty 24×32 crop frames and eight unique art states for each crop (city/art-results.json / crop-gallery.png).
- Reports have **zero page errors, console errors/warnings, failed HTTP requests or foreign runtime requests**. Images inspected: city/plaza/shops, short Corn panel/disabled reason, portrait shop/large quantities/empty market, objective and completed loop. Final stock-message check distinguishes missing selected Corn from a truly empty bag, and opens the market on available produce.

Browser helper navigation now includes extra margin below obstacles so compressed paths do not brush prop corners. A focused closing-hours fixture was moved earlier because its loading/input setup advances the normal clock. These were test-driver timing/path corrections; gameplay collision and manual-time contracts remained. Art review found identical Carrot dry/wilt pixels; the original generator now gives them distinct droop geometry, confirmed by all-eight-state hash checks.

These are Chromium desktop and touch-emulation checks. Real phones/notches and Safari/WebKit/Firefox/Edge remain unverified; initial balance and silent audio still need later review. Outdoor shops intentionally have no separate interiors. No final human acceptance, push, publication or competition submission is claimed.

To reproduce, build and preview, launch an isolated Chrome CDP endpoint, then set PLAYWRIGHT_MODULE, CDP_URL and GAME_URL and run `node tests/browser/city-economy.mjs`. `SKIP_LOOP=1 QA_OUTPUT=docs/verification/city/final` repeats focused checks without regrowing the already verified crops. Historical expansion scripts contain fixed-sale assumptions predating daily prices; their previous evidence remains tied to the earlier commit.

---

# Historical verification — Milestone 1.2, 2026-10-06

Evidence: `docs/verification/expansion/`, plus `regression/` for the complete farm loop. Chromium/Google Chrome, bundled Playwright fallback (agent-browser CLI unavailable), isolated profiles/contexts, disposable localStorage and real keyboard/mouse/touch. User saves untouched.

- `npm test`: **39/39 pass**. Production build succeeds, **1,648,968 bytes** uncompressed; eight unchanged allowlisted runtime art files, no source/vendor/QA assets or new dependencies. Whitespace diff check passes.
- `tests/browser/expansion.mjs`: sign lettering containment/removal, insufficient funds, farm-board seed/produce trade, all three field purchases, confirmed new-farm purchase/gating/switching and reload, independent farm crop indices, all 64 original-farm targets, late-night movement/persistence and manual bed Sleep. Forty mobile crop targets verify panel boundaries and non-overlap across expanded fields/farm 2. Six viewports: 1440×900,1280×720,1024×768,844×390,390×844,640×360; every farm-board/trade/land/confirmation/farm page fits. Touch purchases at all small sizes. Report `results.json`; errors/warnings empty; requests same-origin/data/local blob only.
- `tests/browser/farming-information.mjs` with `QA_OUTPUT=docs/verification/expansion/regression`: full starter → Farm → plant → AM water → bed rest → PM water → three sleeps → harvest → saved reload, old field cell targeting, shed/road/sign/locked-field/interior regressions and five sizes. Report `regression/results.json`; errors/warnings empty.

The first focused run found the 640×360 board menu bottom four pixels outside the viewport. Button-row spacing below 400 display pixels was adjusted; the complete final focused suite passed afterward. Sign, field, crop and menu screenshots were visually inspected. Physical phones and non-Chromium browsers remain unverified. No publishing/push.

Run production preview and an isolated Chrome CDP endpoint, then set PLAYWRIGHT_MODULE, CDP_URL and GAME_URL. Current full regression supports QA_OUTPUT to keep older reports intact. Historical browser suites use older scene coordinates/rules; their previous reports do not claim current acceptance.

---

# Historical verification — Milestone 1.1, 2026-10-06


Evidence: `docs/verification/farming-information/`. Google Chrome/Chromium, isolated profiles/contexts and disposable localStorage, real keyboard/mouse/CDP touch. Bundled Playwright was used because the agent-browser CLI was unavailable. User saves were untouched.

`npm test`: **35/35 pass** (29 existing, six additional crop-status/navigation/migration tests). Production build passes with the same eight runtime art files and no vendor/QA assets or new dependencies. Source diff passes whitespace checks.

- `farming-information.mjs`: complete starter → Farm → plant → AM water → bed rest → PM water → sleep, three nights → harvest → save/reload; visits stay saved; all sixteen targets; shed/gates/sign/expansion/interior regressions; five sizes. Report: results.json.
- `farming-information-layout.mjs`: four care states at five sizes, explicit panel non-overlap with farmer, inspected tile, controls and prompt; objective/waypoint/physical sign screenshots; touch plant/water/move/save at both mobile sizes; real expiry, recovery and dead/clear; old save and fresh game. Report: layout-results.json.
- `farming-information-targets.mjs`: all sixteen planted cells at both mobile sizes, objective minimizes after seven seconds, arrow hides at visible exit and pause/title works. Report: targets-results.json.
- Existing `farming-care-touch.mjs` rerun with QA_OUTPUT pointing here: care/death/reload/v2/unsafe position, bed/kitchen/table/shelf/wall collision, original eight visual states, real touch. Report: care-touch-results.json.

All reports have empty browser error/warning arrays. The full loop passed before a final landscape-only panel-width adjustment; final layout/all-target checks were repeated after it, followed by a passing complete final-build rerun for matching screenshots. The final added “Newly planted / water AM/PM” wording preserves these placements.

Sizes: **1440×900, 1280×720, 1024×768, 844×390, 390×844**. Panels/crop/controls inspected at each. Desktop without coarse-pointer emulation was also smoke-tested; touch emulation deliberately covers hybrid desktop and mobile layouts. Physical phones and non-Chromium engines remain unverified.

Run preview, launch an isolated Chrome CDP endpoint, then set PLAYWRIGHT_MODULE, CDP_URL and GAME_URL to run the three scripts. Supplemental accepts QA_OUTPUT; no browser package becomes a runtime dependency. No publishing or push.

---

# Historical verification — final foundation and farming presentation

2026-10-06. Evidence: `docs/verification/farming-presentation/`. Isolated Chromium contexts with disposable saves; real keyboard/mouse/CDP touch input and read-only QA snapshots. User saves untouched.

- Development at port 5174: title canvas/no Vite overlay, new boy game and keyboard movement pass without console errors (`development-smoke.json`, `development-title.png`).
- `npm test`: **29/29 pass**. `npm run build`: succeeds, eight runtime art files; regenerated town atlas has 96 frames, no vendor/test files shipped.
- `tests/browser/farming-presentation.mjs`: full starter/edge-travel/sixteen-target/plant/AM+PM water/rest/three-night/sleep/harvest/save-refresh loop, locked expansion, eight greenhouse approaches, road gate/closed fence, Farm sign, bed/exit and HUD at five sizes. Report `results.json`.
- `tests/browser/farming-care-touch.mjs`: real window expiry, one-miss wilt, recovery, two-miss death/clear, repeated persistence, v2 migration, unsafe shed save, bed/kitchen/table/shelf/wall collision; real touch planting/watering/movement at 844×390 and 390×844. Report `care-touch-results.json`.
- Sizes: **1440×900, 1280×720, 1024×768, 844×390, 390×844**. Outdoor zoom 1; indoor integer zoom 2; displayed farmer frame 64px throughout. Desktop room fully visible; mobile follows. See PROJECT_STATUS.md for logical dimensions.
- Visually inspected eight-state crop gallery and in-world crop fixture, dry/wet/wilt/dead appearance, compact field, all room aspect ratios, greenhouse foundation approaches and Farm direction hint. Zero browser page errors/console warnings.

Run with `PLAYWRIGHT_MODULE` (optional module path), `CDP_URL` (isolated Chromium endpoint), optional `GAME_URL` (default preview 4173). Main suite `SKIP_LOOP=1` is a focused geometry/layout rerun, not a full-loop pass; use the default for complete acceptance. Supplemental fixtures intentionally initialize isolated localStorage; gameplay actions use real inputs.

Physical devices and non-Chromium browsers are unverified. Historical results below do not assert current room/plot coordinates or watering rules.

---

# Historical verification — Playable Foundation repair

2026-10-06. Evidence: `docs/verification/foundation-repair/`. Disposable Chromium contexts, real keyboard/mouse/touch input; user save untouched.

- `npm test`: **19/19 pass**. `npm run build`: succeeds, eight unchanged runtime art files.
- `tests/browser/foundation-repair.mjs`: eight house approaches, separate door entry/exit, save refresh, old middle trigger absent, automatic edge travel round trip/no bounce, furniture and wall collision, sleeping, five viewport sizes. `results.json`, zero errors/warnings.
- `tests/browser/foundation-repair-touch.mjs`: final rebuilt production exact two-tile inward spawns and real touch round trip, door Use, prompt hiding and unsafe-save recovery. `final-touch-results.json`. Both suites were rerun against the final house-clearance and two-tile-spawn build.
- Screenshots: house approaches, safe exit, south path, Farm arrival, entrance/bed/exit at 1440×900, 1280×720, 1024×768, 844×390 and 390×844. Visually inspected. Compact prompt height 28px, zoom 1, no sprite or tile resampling.

Run with `PLAYWRIGHT_MODULE` (optional module path), `CDP_URL` (isolated Chromium endpoint), optional `GAME_URL` (default preview 4173). The suites initialize disposable fixtures, navigate with real inputs and inspect read-only QA snapshots. Physical devices and non-Chromium engines remain unverified. Historical suites below retain old transition/interior coordinates and are not current acceptance claims.

---

# Historical verification — final Milestone 1 stabilization

2026-10-05. Evidence: `docs/verification/stabilization/`. Tests use disposable Chromium contexts and leave the user’s live save untouched.

- `npm test`: 16/16 pass. `npm run build`: succeeds, eight runtime art files, no development galleries/vendor archives.
- `tests/browser/stabilization.mjs`: production full real-input starter/house/field/pond/three-day crop/harvest/save/refresh/Continue loop, closed City, five viewport sizes; zero errors/warnings. `production-results.json`.
- `tests/browser/stabilization-fixtures.mjs`: both characters’ four walking frames and idle in every direction, sixteen saved crop variants, development-only collision outlines, real touch selection/movement/Use/starter uniqueness/tools. `fixtures.json`.
- `tests/browser/stabilization-interior.mjs`: final rebuilt production bed/exit visibility and actual interactions at 844×390 and 390×844. `interior.json`. This focused test follows the final short-interior camera correction; the full loop passed before that correction.
- `scripts/verify-character-frames.py`: all 48 original boy/girl frames checked; nearest-neighbour galleries inspected. Crop-state, mobile and compact-interior screenshots also inspected.

Browser scripts use `PLAYWRIGHT_MODULE` (optional module path), `CDP_URL` (isolated Chromium endpoint), and the main suite accepts `GAME_URL`. Fixture/interior suites use local preview 4173 and development 5174. Current camera zoom remains 1. Physical devices and non-Chromium engines are unverified.

Earlier scripts `canvas-acceptance.mjs`, `canvas-legacy-menus.mjs` and `world-exploration.mjs` retain historical City/six-plot assumptions. Their results below belong to earlier commits and are not current-scope acceptance claims.

---

# Historical verification — replacement craftsmanship pass

2026-10-05, Chromium 154.0.8037.93, isolated contexts. Current evidence: `docs/verification/craftsmanship/`.

- Development and production real-input full farming loop: PASS, day 4 / 86 coins after sell, Save/reload/Continue, zero page errors/warnings. `development-results.json` and `results.json`.
- Five requested sizes: 1440×900, 1280×720, 1024×768, 844×390, 390×844. Canvas, controls, touch movement, camera and menus checked.
- Current zoom 1; source pixels 2×. Farmer frame 64px (8.9% at 720px height). Four walking frames per direction plus directional idle.
- Legacy/menu suite: PASS; v1 progress preserved, Credits links present, compact layouts fit, all four walking poses observed. `legacy-menus.json`.
- 16-landmark exploration: actual keyboard paths, pond-area navigation, NPC/sign dialogs and bounded camera. `exploration.json`. Repeated after final pond shoreline/underplant correction.
- 10/10 Node tests; production build succeeds; explicit eight-file art allowlist inspected. No vendor or unused source-pack files in dist.

Visual corrections included removing a grass edge from the path-interior texture, preventing decoration over pond water, sharing rounded shoreline geometry with collisions, and updating old test assumptions for compact home/camera scale. The full game loop passed before the final pond/fern-only polish; affected exploration and legacy checks were rerun after rebuilding.

Physical mobile devices and non-Chromium engines remain unverified. No human visual acceptance is claimed. Commands in the historical record below still name the same browser suites; their current output folder is craftsmanship.

---

## Historical pass 2 record (superseded art/scale)

# Verification — Milestone 1 visual improvement pass 2
Completed 2026-10-05, version 0.1.2. Browser engine: Chromium 154.0.8037.93. Tests use isolated browser contexts, not the user's live farm.

## Production acceptance
`tests/browser/canvas-acceptance.mjs` passes at http://127.0.0.1:4173/, after the development loop passed at port 5174. Real keyboard, pointer and CDP touch events drive the canvas. Read-only snapshots supply assertions and control rectangles; no gameplay methods or progress fields are mutated in the full loop.
- New Game → girl → leave home through the yard → Farm → City → buy seed → plant → morning/evening water and sleep across three growing days → day 4 → harvest two → sell → 86 coins → Save → refresh → Continue. Character, area, stats, money, inventory, crop state and sold count compare successfully.
- Both character choices, directional idle transitions, pause freezes time, touch movement, local-only runtime resource requests.
- Viewports **1440x900, 1280x720, 1024x768, 390x844, 844x390**: canvas matches viewport, document does not scroll, no external DOM headings/buttons/header/footer, dark fallback, controls within bounds, keyboard movement and valid camera extents.
- At 1280x720: zoom 1.5, ~853x480 world units / ~26.7x15 tiles. Player frame 72px tall (10%). Compact zoom 1 yields a 48px farmer; the largest height proportion is ~12.3% at 844x390. Source pixels display at integral 3x/2x scales, with nearest filtering.
- Final production loop: **zero page errors and zero console warnings**. Evidence: docs/verification/pass2/results.json and named screenshots.

## Legacy saves, dialogue and exploration
`canvas-legacy-menus.mjs` passes against production. Version-1 fixture retains money/day/inventory/crop watering/growth/health/energy/selection and character. Both walking frames and idle observed in every direction. Boundary collision and camera bounds pass. 390x844 and 844x390 title/help/confirmation/character menus fit. Evidence: legacy-menus.json.
`world-exploration.mjs` passes against production through **16 landmarks**, using initial disposable test fixtures and actual keyboard navigation: homestead gate/shed/cottage/pond/picnic; farm board/four fields/orchard/irrigation/east boundary; city Mira/fountain/Ko/closed shop/Nell/east boundary. All three NPC dialogues and contextual signs open/close correctly. New eastern/southern districts remain reachable; camera reveals no out-of-map space. Zero page errors. Evidence: exploration.json and landmark/dialog screenshots.
Screenshots were inspected for scale, scene composition, mobile HUD/control placement, readable paths and object layering. Prior screenshots under docs/verification/redesign and root verification folder are historical releases, not current acceptance evidence.

## Rules, build and asset packaging
`npm test`: **10/10 passed**. Seven established farming/save/economy/clock/collision tests plus responsive scale, map reachability, and legacy unsafe-position fallback without progress loss. No changes to src/systems/* or src/data/crops.js. `npm run build` passes without important warnings.
The full gameplay pass preceded a final tree/house tile-only correction; JS/collision output was unchanged and the expanded-world traversal was repeated after rebuilding those assets.
Build output inspected: only the explicit eight PNG/JSON/XML runtime art files plus HTML/CSS/JS. No vendor archive, source pack preview, unused individual pack files, original superseded character sheets or generation tools in dist. The official vendor ZIP stays untouched in source. No new npm dependency.

## Corrections found during this pass
Opened an active-field fence gate that blocked the old direct route. Put the homestead return spawn on its clear path. Replaced unsuitable forest-border tiles with the pack's standalone tree composition and corrected house window/gable tiles and removed opaque grass squares from resting fields; simplified fountain paving. The old browser test's harvest coordinate lay within one pixel of the nearest-bed midpoint, so timing variance could select the empty neighboring bed. It now stands clearly beside the mature crop and asserts the highlighted index before harvesting; no crop-selection/rule rewrite was needed. An expired isolated browser session was restarted; this was a test environment issue, not a runtime game failure.

## Repeat browser checks
Optional QA tooling, not runtime dependencies:
```sh
npm run preview
agent-browser --session pass2 open 'http://127.0.0.1:4173/?qa'
agent-browser --session pass2 get cdp-url
# Export CDP_URL using that returned WebSocket URL.
# Export PLAYWRIGHT_MODULE if Playwright is outside normal node resolution.
GAME_URL=http://127.0.0.1:4173/ node tests/browser/canvas-acceptance.mjs
GAME_URL=http://127.0.0.1:4173/ node tests/browser/canvas-legacy-menus.mjs
GAME_URL=http://127.0.0.1:4173/ node tests/browser/world-exploration.mjs
```

## Limits
Mobile viewports/touch are Chromium emulation, not physical phones. Android/iOS, real notches/browser chrome, Safari/WebKit, Firefox, Edge and throttled-network timing remain unverified. No success is claimed for those. User visual review and competition declarations remain human work. No Milestone 2 or publishing actions.

Final craftsmanship sign-placement review: `final-city.png` confirms both shop labels remain above the artwork. Final production page had zero errors; a short 60-frame local sample had median requestAnimationFrame interval 16.7 ms. This is not a physical-device performance claim. Final `npm test` and `npm run build` passed after that label-only correction.

Final development smoke: desktop keyboard movement, schema 4, first-time waypoint, pause freeze, fullscreen/no scroll pass with empty errors/warnings. Fresh Chrome identified the initial-origin 404 as `/favicon.ico`; the shell now declares an empty inline favicon, preventing that browser request without adding a runtime asset or visible DOM UI. Fresh-process dev/production resource checks pass.

Fresh-origin resource check is reproducible with `tests/browser/farming-information-resources.mjs` (PLAYWRIGHT_MODULE, optional CHROME_EXECUTABLE, DEV_URL and GAME_URL). It launches a new isolated browser; only same-origin files and locally generated data/blob images are accepted.
