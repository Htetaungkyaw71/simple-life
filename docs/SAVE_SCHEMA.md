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
