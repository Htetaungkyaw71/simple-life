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
