# Project status

**Milestone 1 — final stabilization pass, 2026-10-05.** Approved retro pixel art, Phaser 3, JavaScript, Vite and fullscreen Canvas retained. City access is closed by the latest user instruction. Milestone 2 has not started.

## Completed

- House collision fixed using multiple Phaser static bodies matching the visible roof/walls/foundation. Porch remains usable. Only E/Use at the doorway enters the existing furnished interior; exiting places the farmer safely in front. Unsafe saved positions are repaired.
- Both original 24×32 character sheets corrected at source: side eyes moved clear of dark hair edges. All 48 frames inspected at nearest-neighbour scale; front/side eyes remain aligned, back frames remain natural. Four walking frames per direction plus idle verified in the running production game. Galleries are development evidence only.
- Clearly labelled **4×4 ACTIVE FIELD**, immediately east of the Farm entrance, connected by dirt path. Sixteen 64×64 usable cells with 8-unit gaps, centres x370–586/y245–461. Other fields remain decorative. Subtle target outline and state/tool-specific planting, watering, harvesting and empty-seed feedback.
- Starter crate beside Home gives **3 tomato seeds once per save**. Claimed status survives refresh/Continue; a new game starts fresh.
- Pond collision follows the rendered shoreline in two-world-unit rows. Full perimeter remains navigable. Select Water on the bank for **Refill watering can**, animation and feedback. Water remains unlimited.
- Three-day tomato growth, two daily waterings, dry/dead crop states, harvest, health/energy, day/night, sleep, pause, credits, keyboard and touch controls preserved. Start with 60 coins; harvest stays in the bag while trading is deferred.
- Save schema 2 retains the existing localStorage key, migrates the old six crop indices into sixteen cells, preserves progress and redirects old City saves safely to Home. Old room saves load in the interior.
- Zoom remains 1 with 2× source pixels. Outdoors retain the established follow camera. Interior is centred on taller screens and follows the player on short landscape screens so bed/exit remain accessible.

## Controls and commands

WASD/arrows move; E/Space uses the nearby target; 1/2/3 selects Seed/Water/Harvest; Escape pauses. Pointer/touch menus, directional pad, tool buttons and USE are available. Pause → Save or Return to title. Title → Continue or Credits.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Current production preview: http://127.0.0.1:4173/ . Development verification used port 5174. Refresh to load this build. Production assets are local; optional Pillow regeneration is `python3 scripts/process-rpg-assets.py`.

## Verification completed

- **16/16 Node tests pass**, covering rules, malformed/denied saves, legacy migration, all active spawns, house/pond geometry, sixteen crop states, starter uniqueness, field contexts and map reachability.
- Production real-input acceptance: boy → starter reward → left/right/rear/both front-corner house collisions → window rejection → porch/door entry and exit → field planting → pond collision/refill/full perimeter → morning/evening watering and sleeping across three nights → harvest two tomatoes → Save/refresh/Continue. House position, claimed reward and crop progress persisted. City closure verified. **Zero page errors or console warnings.**
- **1440×900, 1280×720, 1024×768, 844×390, 390×844** viewport checks pass; movement/tool controls and fullscreen layout retained.
- Companion production fixtures verify both characters' complete directional walk/idle sequences, sixteen restored crop states, debug disabled, and real CDP touch New Game/girl/movement/Use/reward/tool selection. Development collision debug verified separately.
- Final focused rebuilt-production tests confirm bed/exit visibility and interactions at **844×390 and 390×844** after the short-interior camera correction. Crop pointer reach was aligned with the same 60-unit context limit.
- All **48 sprite frames** pass the source-pixel verifier; nearest-neighbour galleries visually inspected. Screenshots of field states, touch layout and compact interiors inspected.
- `npm run build` succeeds. Eight allowlisted runtime art files; archives, licences, galleries and unused pack files excluded. No new runtime dependencies.

Current evidence and JSON results: `docs/verification/stabilization/`. Current browser suites: `tests/browser/stabilization.mjs`, `stabilization-fixtures.mjs`, `stabilization-interior.mjs`. Earlier City/economy browser suites and craftsmanship evidence describe the previous scope, not current acceptance.

## Files and systems

Added shared `src/data/geometry.js`, Phaser `src/physics/CollisionWorld.js`, pure context/starter systems, stabilization unit/browser tests, sprite-frame verifier and stabilization plan/evidence. Updated location/map definitions, sixteen-cell crop data, save/state/time handling, WorldScene, world art/atmosphere, HUD/help, original boy/girl PNG generation and permanent documentation. Existing economy source remains dormant for the next milestone; City has no active location or transition.

## Known limits and next milestone

No known blocking issue in the tested Chromium flows. Physical Android/iOS devices, notches and Safari/Firefox/Edge remain unverified; mobile evidence uses Chromium emulation. Water is intentionally unlimited; a limited-water system is deferred. The starter reward is finite and trading is intentionally unavailable, so this slice ends with harvested produce in the bag. Remote Farm fields remain decorative. Existing art licences and credits are preserved.

**Next milestone: City and economy.** Implement the city seed shop and produce selling only after new authorization. No forest, animals, combat, weapons, death, recovery, additional crops or final audio added. No publishing or push.
