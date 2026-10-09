# v0.7.1 town polish verification — 2026-10-09

## Checks

npm test: **166 passed, zero failed**. npm run build: **93 modules, 12 files / 2,196,525 bytes**. Git whitespace and Python source compilation pass. Six new tests in tests/town-polish.test.js cover all 13 scheduled residents/sellers, dry collision-safe commuting, current-patrol departure, exact home door at 20:00, dawn at 06:00, pause/reload clock poses, distinct larger houses/exact silhouettes, four axe facings, equal HUD geometry/no USE button across sizes, and broad bridge-safe flow. The retained compact CropInfo test fits 640×360. Schema remains 11; previous farming/commerce/Forest/sleep/recovery tests stay green.

## End-to-end browser record

Native CUA inputs on an isolated QA origin (43864), serving the final production build. Fixture writes affect only that origin. Read-only canvas telemetry is stored in browser-checks.json; JPEGs are actual browser screenshots, not offline mockups. The normal 4175 save was not reset. No backend/API/env dependency exists in this app: the verified story is input → guarded pure state/clock → Phaser world/UI → existing localStorage autosave.

- Axe left/right/up/down keyboard movement checked the hand pivot and outward blade (axe-*.jpg).
- City canal and actual Forest river walking showed animated highlights, ankle ripples and faint fragmented reflected farmer; dry bridge walking disabled both wading/reflection (river-reflection.jpg, forest-water.jpg). Fountain streams/foam/rings animate with active scene time and pause with menus.
- 06:00 fixtures showed all residents/sellers visible and walking from assigned doors; 19:50 fixtures showed returning actors; night showed all eleven City actors hidden at home. Routes use dry crossings, shared house clearance and porch-to-door legs. Returning patrols do not snap to work (dawn-emergence.jpg, returning-home.jpg, night-empty.jpg).
- Direct June tap opened conversation after approaching. At 360×640, D-pad movement and Clara tap opened Seed shop; Buy reduced 60→50 coins and increased Tomato seed 0→1. Home's actual door tap entered the existing room (phone-shop.jpg, phone-home.jpg). No USE control is present.
- Niko produce shop sold one of two Tomatoes for 21 coins, 60→81. Farm watering created wet ground and set evening care true; the active test clock was already at 19:27, so this records evening care rather than a morning test (farm-watered.jpg).
- Final 640×360 Farm screenshot shows crop details between both meters and movement controls; portrait/desktop dialogs and HUD remain readable (compact-farm.jpg). Final houses/roads/meters: residential-day.jpg.
- Browser error/warning log empty. Normal local preview remains 4175; isolated QA tab/server cleaned up after evidence collection.

## Art/runtime

Reproduce the pixel/allowlist audit after building: `python3 scripts/qa/town-polish-audit.py` (Pillow required).

runtime-audit.json compares baseline 51701a6. All 662 existing frames/metadata/pixels retained; 13 distinct original houses appended, 675 cells. Eight allowlisted art files only; six other art files byte-identical. Thirteen active houses at 240×192 world pixels replace 160×128 houses. New alpha masks and existing Home door coordinates are checked. Evidence/source: ../../assets/licenses/town-polish.md.

## Limits

NPC schedules are transient clock-derived presentation, without new interiors/relationships/progression/save fields. Sellers leave before 20:00 to arrive home by 20:00; they only serve at work during the retained 07:00–20:00 window. Bridge/water reflections are stylized pixel effects, not a fluid simulation. Chromium viewport emulation does not certify physical phones, Safari/Firefox/Edge or sustained performance. Existing mixed-source licence/submission limits remain; no push/publication/submission or final human acceptance is claimed.
