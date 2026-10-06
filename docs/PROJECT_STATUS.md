# Project status

**Milestone 1 — focused Playable Foundation repair, 2026-10-06.** Existing Phaser 3/Vite engine, approved retro assets, farming, localStorage saves and fullscreen canvas HUD preserved. City remains closed and is the next separate milestone.

## Changes completed

- Exterior house static collision now follows the atlas silhouette, including the previously missed chimney, roof steps, windows and foundation. The front porch interaction approach remains accessible; a separate narrow front approach triggers E/Use entry. House-specific clearance keeps visible farmer pixels off the opaque walls/roof; the feet body remains small for other scenery. Foundation-based Y sorting handles front/behind ordering.
- Player collision is **24×12 at the visible feet**, with the body bottom anchored at the saved player position. Runtime physics and save validation use the same footprint. Exiting places the player at **(480,528)**, more than a safe tile beyond the foundation. Unsafe old positions move to nearby safe ground on a two-unit search grid; remote/invalid coordinates use the safe-spawn fallback.
- Removed the middle-of-Home Farm transition. The extended south dirt path reaches a fence opening at the bottom boundary. Crossing the final edge zone automatically enters Farm’s north path. Returning through Farm’s north edge works in reverse. Both arrival positions are **64 world units / two tiles inside**, face inward, use a 700ms transition cooldown and a 140ms fade each way. Decorative signs do not trigger travel.
- Expanded the actual interior from its old 352×352 floor to a **1344×800 furnished room layout**. Existing bed, windows, kitchen, dresser, shelf, table/chair, rug and plants are rearranged with clear routes. Bounded follow camera and a matching pixel wall border replace empty green margins. Native 2× pixels and zoom 1 remain unchanged; mobile screens explore by scrolling rather than shrinking the room.
- Context prompts are **28 display pixels high**, fitted to their text and positioned above the hotbar. They shift upward if the farmer would overlap them, appear only in interaction range and disappear on leaving. Sleep/pause menus retain their established presentation.

## Preserved foundation

Boy/girl selection, movement, keyboard/touch controls, health/energy, day/night, rest/sleep, 60 starting coins, one-time three-seed crate, 4×4 active tomato field, two daily waterings, three growing nights, dry/dead states, harvesting, unlimited watering can/refill feedback, save/Continue, Credits and asset licences. Harvest remains in inventory while City/trading is deferred. Schema 2 and the existing localStorage key remain unchanged; old six-plot/City migrations remain supported.

## Controls and commands

WASD/arrows move; E/Space interacts; 1/2/3 select tools; Escape pauses. Touch pad/tool buttons/USE are available. Walk through Home’s south edge or Farm’s north edge to travel automatically. Pause → Save / Return to title. Title → Continue / Credits.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Production preview: http://127.0.0.1:4173/ . Refresh to load the repair. Development server uses port 5174 in this workspace. `?collisions` outlines static collision only in development.

## Verification

- **19/19 automated tests pass**, including existing crop/economy/save regressions, malformed/denied storage, map connectivity, all spawns, nearest-safe relocation, house/chimney mask, edge-only travel and interior furniture/bounds.
- `npm run build` succeeds. Same eight allowlisted runtime art files, no new runtime dependency, no vendor archives or verification galleries in dist.
- Production browser acceptance checks all four house sides and four corners, door entry/exit, safe exit/save/refresh/Continue, old middle-trigger removal, physical edge round trip with inward facing/no bounce, all solid furniture, room walls, sleeping and exiting.
- Interior entrance, bed and exit checked at **1440×900, 1280×720, 1024×768, 844×390, 390×844**. Canvas/HUD controls remain on screen, integer zoom is retained, player is visible and prompt/player rectangles do not overlap. Screenshots visually inspected for house layering, room framing and compact prompts.
- Final focused touch suite verifies edge round trip, exact two-tile spawns, touch Use at the door, prompt disappearance and unsafe-save repair/reload after the final spawn-distance adjustment.
- Current evidence: `docs/verification/foundation-repair/`; current scripts: `tests/browser/foundation-repair.mjs` and `foundation-repair-touch.mjs`. Browser console errors/warnings: **zero**. Prior stabilization scripts/evidence retain historical room/transition coordinates.

## Changed files and systems

Added `src/data/interior.js`, `tests/foundation-repair.test.js`, two browser acceptance scripts and `docs/FOUNDATION_REPAIR_PLAN.md`. Updated geometry, locations/map layout, CollisionWorld, WorldScene, worldArt, Application travel, save recovery, sleeping coordinates, Hud prompts and existing affected tests. Updated README/design/architecture/status/technical/verification/art/licence/AI records. No runtime PNG/atlas files changed.

## Remaining limitations / next milestone

Physical phones, safe-area notches and non-Chromium engines remain untested; mobile checks use Chromium touch emulation. At narrow/short aspect ratios the interior scrolls, so all furniture is reachable but not simultaneously visible. Water remains unlimited. The brief mentioned three screenshots, but the attachment folder provided only text; existing project and live-game screenshots supplied visual evidence.

**Next milestone: City and economy**, only after separate authorization. No city, forest, animals, combat, weapons, extra crops, NPCs, quests or major new systems added. No publishing or push.
