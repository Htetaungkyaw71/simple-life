# v0.18.0 additive schema-18 fields

balanceRevision:1 records the crop-economy duration migration; omitted old values preserve already-ripe Cucumber/Sweet Potato and earned partial growth/care. ownsCopperCan defaults false and is persisted as a boolean, without deleting old large farms/custom beds. foodCooldown defaults zero and clamps to 0–12000ms, advances only in active world time and persists on reload. Existing coin balances/testing-grant stamp, key item, story completion, inventory, farms, houses/decor and localStorage key remain. Newly added board story flag restores from prior help/Commons evidence. No new external save format or cloud service.

---

# v0.17.4 — default plant collection uses existing schema 18

Newly gatherable default plants use existing `vegetation[area or farm:N].grass` coordinate IDs (`grass:name:x:y`), the registered-ID whitelist and `inventory.grass`. Old grass/tree IDs stay unchanged; new known flower/fern/mushroom/shrub/bamboo IDs survive validation and deduplicate. Removal persists per farm. No version bump or playtest gift reset. Purchased decoration ownership/editing remains separate.

---

# v0.17.1 — editing preserves schema 18

No new persisted fields or gift stamp. Preview/readjust references remain transient. Original placed record persists through autosave while adjusting; confirmed movement replaces that record with validated coordinates/direction. Remove returns one item. Reload/Continue discards an unfinished preview and retains the original. Clear path ground now validates as legal placement, preserving new layouts across reload. Cross-Farm/area membership, overlaps and reserved functional footprints remain validated.

---

# Save schema 18 — owned homes and area decoration

Keep `simple-life.save.v1`; accept schemas 1–18. New `home={design,owned}` defaults to starter; ownership is deduplicated against the nine known IDs including the original cottage, and design must be owned. Unknown/forged IDs fall back safely. All old farming, Forest, City, story, clocks, balances, Stash Bag, stove, audio settings and valid furniture remain.

Existing `{type,farm,x,y,direction?}` means Farm and keeps its exact representation. New Home/indoor pieces use `{type,area:'home'|'interior',x,y,direction?}`; Home is shared, Farm records stay per purchased Farm. Sixteen known decoration item keys persist in inventory. Restore only valid, nonoverlapping 8-pixel-grid placements within the cap. Outdoor-only pieces cannot load indoors or in City/Forest. Room positions scale from saved roomSize on phone/desktop changes; paid furniture that cannot fit after legitimate resizing returns to Bag/Gear. `testingCoinGrant='custom-home-playtest-2026-10-11'` records the new one-time gift; old grant balances remain. Migration itself never grants money; Application start grants only when explicitly running a playtest/authorized local test flag.

---

# v0.16.1 — schema 17 retained

No new gameplay fields or save key. New states and missing/invalid selected values default to the existing `hand` ID; valid saved selections remain unchanged. Hand is hidden presentation, not removed functionality. Bag Put away and equipped hotbar taps save `selected: hand`; desktop keyboard tool shortcuts remain idempotent. Audio preferences still use simple-life.audio.v2 separately, preserving Master/Music/Ambience/Effects and mute, including legacy Forest mute. No progress or preference reset.

---

# v0.16.0 — schema 17 story and separate audio preferences

Schema 17 preserves every schema-16 gameplay field and adds `story`: `intro` (pending/seen/skipped), ordered allowlisted flags, `keepsake` (hidden/carried/placed), completed/endingSeen/cuePlayed, activeSeconds, stats (harvests/sales/boars/deaths), and a frozen completion snapshot (day/seconds/stats). Validation bounds values and rejects completion without every chapter flag and a placed key. An interrupted fresh introduction resumes; old saves mark it seen. Migration uses retained starter/living-crop/watering/harvest/sale/resources/cut-tree/Forest evidence and completed Commons project, not money. Missing legacy conversation/eating evidence remains an objective. An already-looted old story chest yields the key after its guard dies, without duplicating coins. The story key is outside inventory and Stash Bag; death and daily resets leave it intact. Saves are migrated on normal write, never deleted.

Audio is stored separately in `simple-life.audio.v2`: independent 0–1 master/music/ambience/effects and muted. `simple-life.audio-muted.v1` migrates mute; malformed preferences and denied storage fail safely. Audio buffers/nodes are transient and never serialized. Production grant code requires DEV at both UI and save-service boundaries; query/localhost cannot enable it. Existing testing balances survive migration.

---

# Schema 16 — placed furniture directions and new objects

Version 0.15.0 accepts schemas 1–16 under the existing localStorage key. Optional settlement.decorations[].direction accepts only left/up/right/down; missing/down restores the original south-facing form and is omitted from normalized storage. Unknown/null/non-string directions in schema 16 are rejected. Earlier schemas preserve their original footprints. Turned widths/heights/solids are shared with placement and rendering; malformed coordinates, overlaps, roads/beds/water/structures still reject. Existing per-farm/max-96 rules and safe player repair remain.

New bounded inventory keys: tableDecor, barrelDecor, lanternDecor, each defaulting to zero for earlier saves. The active preview/draft is not serialized and never spends inventory. Selected decorate/type remains saved; Continue creates a fresh local preview if a piece is available. Partial tree damage still restores for source >=15; ripe-crop legacy threshold remains <14. Existing crops, daily care, farms, economy, projects/orders/stove, gift marker, Forest/Stash and completed tree cuts retain their migration contracts.

---

# Save schema 15 — partial tree chopping, v0.14.0

Storage key stays simple-life.save.v1. Accept versions 1–15. Each existing vegetation record optionally adds treeHits, an object mapping known stable authored tree IDs to integer hit counts 1–2. Only the record's outdoor area/owned farm IDs are accepted; unknown IDs, arrays, nonintegers, counts outside 1–2 and damage on already removed trees are rejected. Empty partial records are omitted. Older schemas initialize with no partial damage; completed trees arrays remain removed. No position translation, refund or crop maturity reinterpretation is introduced. The schema-14 crop-duration boundary remains unchanged: version 14/15 growing crops never receive legacy ripe promotion.

Valid hits deduct 1 EP and increment partial damage; the third deletes its partial entry, records the completed cut and awards 3 Wood once. Capacity/tool/range/line-of-approach/energy checks precede mutation. Existing cut-root collision and canopy removal happen only after completion. Partial damage persists across midnight, sleep, travel and reload. UI meter, swing/facing, feedback timer and keyboard intent remain transient. All earlier project/order/stove/decorations, crop/care/farms, economy, Forest/loot/discovery/Stash and testing gift fields retain migration. No offline simulation or remote storage.

---

# Save schema 14 — longer crop care and resource progression, v0.13.0

Storage key remains simple-life.save.v1. Accept schemas 1–14. New crop durations are 3–6 watered calendar days. A schema 1–13 plot already at its former one/two-day maturity remains ripe at the new duration; a still-growing plot keeps its actually earned care days and now needs the remaining new days. Death/care history remains under schema-13 daily rules. Schema-14 reload never promotes a growing plant early. Old inventory, economy, fields/farms, custom beds, vegetation, Forest/animal/treasure/discovery/Stash Bag progress and testing-gift marker retain established migration. Club refunds remain restricted to source schemas below 13, never replaying in 13/14.

New inventory keys grilledMeat, benchDecor, planterDecor, fenceDecor, pathDecor use the existing 0–9999 integer limits. Grilled Meat appends after all old sale IDs, retaining old market salts. selected accepts decorate; selectedDecoration is a known bench/planter/fence/path ID (default bench).

settlement stores projects (unique known completed IDs), stove (strict boolean), orders {day,completed} (unique known active request IDs for the current day), and decorations [{type,farm,x,y}] (at most 96 total, known type/owned farm, integer grid-8 coordinates, legal full footprint). Midnight resets current daily request completion once; returning/reloading cannot replay current rewards. Old-day/future/unknown requests are dropped. Requests and projects verify materials and reward capacity before any atomic stock/reward mutation; repeated completion is refused.

Decoration restore follows vegetation and beds, checks bounds, dry ground, roads, solids and bed/decoration spacing, and reconstructs only bounded known fields. Physical furniture blocks movement/digging/grass placement; paving stays walkable but cannot be dug or replanted over. Per-farm layout/collision follows currentFarm. Hand packing returns one built item with capacity validation and removes its record atomically. Final safe-position repair avoids restored furniture trapping the farmer. Stove build and cooking use the same immediate local save flow. No offline growth or new remote storage.

---

# Save schema 13 — daily watering and retired Wooden Club, v0.12.0

Storage key remains simple-life.save.v1. Growing plots persist crop/growth plus wateredDay (0 or the last cared-for day), missedDays (0–4), lastEvaluatedDay (the last completed day), optional plantedDay/plantedMinute and recoveredDay. No morning/evening flags, missedWindows, lastEvaluatedWindow or recoveredWindow enter new plot records. New planting sets lastEvaluatedDay=day-1; midnight evaluates the current finishing day before incrementing day. Cursors prevent duplicate missed days and growth. Save validation bounds day tags and never evaluates an unfinished day. No offline simulation.

Schemas 1–12: either strictly true morning/evening flag gives wateredDay=current day; a living credited plot resets its misses. Old missedWindows/dryDays=1 becomes one missed day when unwatered; old value=2 stays dead via missedDays=4. lastEvaluatedDay=day-1 avoids retroactive penalties. Existing earned growth clamps to the current crop duration as before. Old club ownership returns exactly 45 coins, capped at 9,999,999, only when source schema<13. Schema 13 has no ownership/equipment flags, so reload cannot repeat the refund. Character, money beyond this refund, inventories, fields/farms/custom beds, cuts, grass, animals, discoveries, caches, stash and testing-gift marker keep existing migration rules.

New farm purchases cap at 3, independent of fields. Validation still bounds all historical farms at 100 so previously bought farmland/crops do not vanish. The higher legacy validation bound does not enable native purchases past three. Optional testingCoinGrant remains unchanged and does not replay.

---

# v0.11.1 optional local testing marker (schema remains 12)

The explicit user-authorized localhost testing gift adds 100,000 to existing `money` (capped at 9,999,999) and stores optional `testingCoinGrant: "home-proportions-2026-10-09"`. Validation retains only this recognized marker; missing markers do not alter normal state. The grant writes original raw fields plus balance/marker in one localStorage save, rejects unavailable storage/incompatible saves and does not replay after Continue/save/reload. The title action appears only with explicit `?testingCoins=100000` on loopback hosts. New-game initial money remains 60; no migration, default grant, remote debug action or other progress reset.

---

# Save schema 12 — hunting, stone and food healing, v0.8.0

Storage key stays simple-life.save.v1. Schemas 1–12 validate; 1–11 migrate to 12 without resetting existing progression. inventory.stone and inventory.meat are bounded integers 0–9999, defaulting to zero. All existing crop, market, wood/grass, equipment, currency, time, farm, discovery and Stash Bag fields remain. Meat is appended after all existing sale IDs so old daily price salts do not move.

forest.stones contains deduplicated known IDs from 240 deterministic dry-ground piles, at most the known roster length. Unknown IDs are rejected. Availability uses forest.forageDay and resets only on a later game day; reentry/reload do not refresh piles.

forest.woodland contains exactly the 48 known quiet-animal IDs, each with authored id/species, bounded health, defeatedDay and position. Deer have 3 health, Fox 2, Hare/Grouse 1. Positions must be collision-safe within 180 units of authored home; unsafe/distant coordinates repair to their safe homes. Schemas 1–11 initialize these previously transient animals healthy. Same-day partial health/death survives travel/reload; a later day respawns dead animals. Renderer positions now project pure saved movement. Existing 30 boar records/compatibility alias remain unchanged.

Attack cooldown, swing, invulnerability, labels and effects remain transient. Defeat records and loot mutate together, are saved immediately and cannot pay twice. Lethal attacks reject full loot inventory before consuming energy or changing health. Eating consumes one only when a positive capped health or energy gain exists; zero-health states use established defeat/recovery instead. No offline progress.

---

# Save schema 11 — vegetation and shorter crop durations, v0.6.2

Storage key remains simple-life.save.v1. Versions 1–11 are accepted; versions 1–10 migrate to 11 without resetting economy, inventory, care, farm ownership, equipment, discoveries, caches, animal progress or Stash Bag. New inventory.wood and inventory.grass default to zero and validate to 0–9999. selected additionally accepts axe, hand and grass. Earned growth is capped at each crop's new one/two-night duration; already-earned progress at the cap becomes ripe while watering/miss history remains.

vegetation is keyed home/city/forest/farm:N for each owned farm. Each record has trees (stable known cut-tree IDs), grass (stable known removed original-clump IDs), and placed [{id,x,y,variant}]. Known IDs are bounded/deduplicated, unknown area/farm/IDs rejected. Placed patches validate integer grid-8 coordinates, a dry clear footprint, no path/solid/crop bed or clump overlap, up to 2,048 per area/farm. IDs/variants are reconstructed from coordinates. Cutting/root state restores before safe player/animal/Stash Bag and free-bed/wet-ground validation, so cleared positions remain legal after reload. Maps are not mutated. Held sprite/swing/grass bending/selection highlight are transient. No offline progress is added.

---

# v0.6.1 — unchanged schema 10, partial-hour fatigue

No new saved field or version migration. Existing plots/dug beds/wet patches/progress remain. fatigueMinutes now validates a finite remainder in [0,60), following the new 60-minute drain interval. Previous [0,30) values remain valid and are preserved rather than triggering an immediate charge/reset. Held can, pouring duration, hand/nozzle pose and soil caches are transient and reconstructed from existing selected tool/character/position. Regression covers partial-hour roundtrip and old schema-9 fatigue.

---

# Save schema 10 — free planting beds, v0.6.0

Storage key stays simple-life.save.v1; versions 1–10 accepted. Versions 1–9 migrate to 10 with paid field/farm ownership, crop IDs/care, currency, character, daily prices, City flags, forest progress/equipment/treasure/Stash Bag intact. Existing legacy forest position translation still applies only to versions 1–8. New inventory crop seed/produce keys default to zero. selected additionally accepts shovel. The twelve crop definitions retain original inventory/market ordering and old crop values.

Original s.plots remains the stable 64-cell-per-owned-farm array. New dugPlots is a deduplicated list of individually unlocked original-cell indices. New customBeds stores {farm,x,y,plot}; its plot record uses the existing crop/growth/morning/evening/missed-window/planted-time/recovered-window contract. allPlots and plotAt project both collections for growth/care/recovery/UI. Runtime custom indices are base plots length plus custom record offset. Validation rejects invalid farm IDs, noninteger/off-lattice/unsafe coordinates, road/water/solid footprints, overlaps with original/custom beds and unknown crops. At most 2,048 custom records are accepted. Existing farm indices remain stable; no legacy plants relocate.

wetGround stores up to 256 recent {area,farm,x,y,remaining} patches. Outdoors only; known area, safe ground, integer coordinates, valid farm and finite positive remaining capped at 180,000ms. Duplicate patch keys are removed. Remaining time decreases only during active simulation, survives reload without offline progress and clears on sleep/long time skips. Wetness does not alter plant daily watering flags or growth by itself. Pour animation/cooldown, pointer target and soil texture cache are transient. Tests cover old progress plus valid/custom/malformed wet-bed migration. QA uses in-memory fixtures; user-origin storage was not read or edited.

---

# v0.5.0 UI-only compatibility
Schema stays 9 and storage key remains `simple-life.save.v1`. Theme, hotbar, keyboard bindings, bag selection index, notebook canvas and facing indicator add no persistent fields or migration. Seed selection uses existing selectedCrop/selected fields; food and permanent club actions use existing inventory/energy/equipment fields. QA uses isolated in-memory states and never loads live user storage.

---

# v0.4.9 eastward expansion, schema 9 unchanged
Original twenty region IDs/coordinates, old forage/cache IDs, original sixteen boar IDs and all reward/currency/farm/City/day/sleep/recovery fields remain. Twenty new regions, one hundred additional fruit IDs and fourteen boar IDs extend known bounded collections. Missing new animals initialize safely; no eastern regions auto-discover. Forty-eight quiet animals remain transient. Fruit spots covered by wider rivers move to dry banks without changing their saved collection IDs. No schema-9 position translation; schemas 1–8 retain the same legacy +4096 Y migration. Unsafe positions use established nearest-safe repair. No save deletion.

---

## v0.4.2 grounded jumps and added scenery
Schema remains **9**; all prior valid progress migrates unchanged. Jump origin/destination/arc/cooldown and grass bending are transient. During flight, autosave/manual Save/pagehide write the grounded take-off point; pause freezes the same arc in memory, while refresh resumes standing. On ordinary saves, position is the current feet position. Animal damage interrupts flight and grounds safely before existing defeat/bag rules. New tree/ledge masks use the existing nearest-safe repair for legacy positions now inside scenery, preserving stocks/crops/currency/equipment. Water positions remain valid. No height/customisation/extra saved keys.

## v0.4.1 water traversal follow-up
Schema stays **9**. A valid player or Stash Bag location inside water is now preserved by shared walkability validation. Solid structures, waterfall rock banks and map bounds still reject unsafe positions. Existing animal health, crops, inventories, money and legacy migration remain. New quiet woodland sprites are transient display state and add no saved keys.

# Save schema 9 — large wilderness

Storage key remains `simple-life.save.v1`; versions **1–9** are accepted. The previous farming/City/currency/care/fatigue/character fields remain unchanged. Six new fruit inventory keys default to zero. Original sale indices remain stable.

`forest.animals` is a bounded record of the 30 current boar spawn IDs. Every record has known species/id, health clamped to that species' maximum, collision-safe territory position and defeatedDay. Unknown IDs are ignored. `forest.boar` aliases `animals['boar-original']` in memory for compatibility with the established survival API. JSON may contain the compatibility record; schema 9 restoration uses the authoritative animal record and reconstructs the alias. Charge headings/timers/cooldowns stay transient and start with entry grace/warnings.

`forest.explored` contains deduplicated known region IDs, always including entrance. `forest.treasures` contains deduplicated known collected cache IDs. Forage uses the established day/collected fields over 163 known IDs. Daily rollover refreshes forage and dead animals, while keeping discovery and caches.

For **schema 8 and earlier Forest saves**, add **4096 to Y** for player, original boar and forest Stash Bag before safe validation; this moves them with their retained southwest Homewood geometry. Old collected IDs, partial/dead boar health, bag amount, coins, inventory, farm expansion, care, day/time and price seed survive. Home/City/Farm/interior coordinates are not shifted. New boar cache guards initialize at their distinct safe homes. Removed species records are ignored; both original boar IDs and all region/cache/forage IDs stay stable. Invalid positions repair to nearby valid feet positions; an animal outside its territory falls back to its own safe home. No save is deleted to migrate.

Defeat remains atomic before the visual fade. Cache collection saves immediately and pays once. All retained sleep/midnight/crop rules and existing bag persistence remain. Tests include explicit schema-8 forest/bag/boar translation and identical original daily prices, plus schemas 1–7 and malformed schema-9 fields.

---

# Save schema 8 — Milestone 3

Storage key: `simple-life.save.v1` (unchanged). Accepted source versions: 1–8. Migration validates each field and preserves all valid existing character, area/safe position, farm/field ownership, crop indices/care/history, coins, seed/produce inventory, day/minute/fatigue, market seed and City guidance/transaction flags. No save deletion, offline simulation or price reroll. Schema 7 before-dawn times remain valid.

New fields:

- `inventory.wildBerry`, `.guava`, `.mango`, `.wildHide`: bounded integers 0–9999; separate from seed/field-crop keys.
- `ownsClub`, `clubEquipped`: booleans; equipped requires ownership. Migration gives no free weapon.
- `forestTutorialComplete`, `nightWarningSeen`, `deathTutorialSeen`, `hasDied`: saved guidance/progress flags.
- `forest.forageDay`: day associated with node collection. `collected` contains only the six known node IDs, deduplicated. If older than current day, availability resets; reentry does not reset it.
- `forest.boar`: health 0–3, collision-safe territory position, defeatedDay. Dead boars from an earlier day restore at home position. Charge headings/timers are transient and reentry starts with a fair warning/grace; partial health is retained.
- `stash`: null or `{area:'forest', x, y, coins}` with a positive bounded integer amount. Invalid coordinates repair through the established nearest-safe search; invalid area/zero/negative amount becomes null.
- Existing `health` is now authoritative combat health and remains saved.

Defeat applies bag replacement, coin loss, crop/time rollover and restored Home-interior state as one mutation, then immediately saves before the visual fade. A page refresh during defeat sees the completed result. A loaded legacy zero-health save is resolved through the same defeat rules when Continue starts. Save writes still report unavailable storage without silently replacing progress.

Read-only `?qa` exposes copied state, combat timing, node visibility and UI bounds for browser assertions; it cannot mutate gameplay. Tests: forest-survival.test.js, existing migration/farming/expansion/day-night tests and browser forest-survival.mjs.
