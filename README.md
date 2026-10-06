# Simple Life — Milestone 1
**Milestone 1 stabilization: approved retro art, door-only Home, 4×4 active field and starter seeds.** Original tropical farming slice for Digit7 Jam. The entire world, title screen, character selection, HUD, shops, bed, help and pause menus are inside the Phaser canvas. No webpage masthead, footer, external panels or document scrolling.

## Review locally
Node.js 22.12+ recommended. All pixel assets are committed; Python is not needed to play or build.

```sh
npm ci
npm run dev
```
Open the URL Vite prints, normally http://127.0.0.1:5173/ . If a port is already occupied, use the printed port. To review the production output:

```sh
npm test
npm run build
npm run preview
```
Production preview normally uses http://127.0.0.1:4173/ . Reload a previously open tab to see the redesigned build. `dist/` is the static browser build; serve it with HTTP/HTTPS rather than opening index.html from disk. Relative paths support subdirectory deployment. There is no backend, runtime CDN, tracking, external API or account requirement.

## Play
Choose a boy or girl. Start outside Home with 60 coins. Collect 3 tomato seeds once from the crate beside the house. Approach the porch and press E/Use to enter; the furnished interior has the bed. Exit through its south doorway, then follow the path to the east farm gate. The labelled ACTIVE FIELD immediately east of the farm entrance has 16 usable cells. Select Seed and Use on the outlined cell; select Water and water before 16:00 and again afterward. The bed offers rest until evening and sleep to the next morning. Three fully watered nights produce two tomatoes per crop. Harvests stay in your bag. City travel and trading are closed until the next milestone.
Approach a pond with the watering can selected for “Refill watering can.” Water is unlimited in this milestone; this interaction provides refill feedback without consuming resources.
Missed watering delays growth. Two fully dry days kill a crop; Use clears it for free. Walking costs no energy. Sleep restores energy; at midnight the player returns home for a new day. Health is visible and saved, with no damage mechanics in this peaceful slice.

- WASD / arrows: move; the camera follows.
- E / Space: use nearby highlighted object / selected tool.
- 1 / 2 / 3: Seed / Watering Can / Harvest Tool.
- Escape: pause. Enter and arrows navigate canvas menus; pointer/touch also works.
- Touch: on-canvas directional pad, tool hotbar and Use.
- Pause → Save, Controls, Resume, or Return to title.
- Temporary notifications can be dismissed with their X.

The existing localStorage key is preserved. Schema 2 stores the one-time reward and 16 plots; version-1 saves migrate with the original six crop indices preserved. Older City saves return safely to Home, and old cutaway-room saves become interior saves. Safe existing coordinates load unchanged; a position made unsafe by new scenery falls back to the same area's safe spawn while keeping normal progress. Autosave occurs after transactions, transitions, sleeping, every 2.5 seconds and pagehide/visibility change. Refresh → Continue restores progress. New Game confirms before replacement. Saves remain specific to browser and origin; disabled storage is reported.

## Scale and exploration
Camera zoom is 1 with crisp 2x source pixels at all tested sizes. At 1280x720 you see 40x22.5 tiles and a 64px farmer frame (8.9% of viewport height). Home exterior and Farm each retain their 2240×1152 worlds. Home's existing furnished room is now a separate door-only interior. Outdoor following-camera behaviour is unchanged; the room is centred at the same zoom, following the farmer on screens shorter than 600px to keep bed/door interactions visible. Other farm fields remain decorative; the city road is marked opening soon.

## Verification and limitations
Production tested in Chromium at **1440×900, 1280×720, 1024×768, 390×844 and 844×390**: full viewport, no scrolling/external page UI, accessible canvas hit targets, movement, bounded follow camera and integer-scaled pixels. Stabilization checks cover house sides/porch/doors, one-time seeds, pond navigation, crop growth, touch input, animation and save/reload. No page errors or console warnings were recorded. `npm test` and production build pass.
These are desktop/Chromium mobile-emulation results. Actual phones, mobile browser chrome/notches, Safari/WebKit, Firefox and Edge still need real-device/browser checks; no pass is claimed for them. See docs/VERIFICATION.md for scripts and evidence; Current evidence is under docs/verification/stabilization/.

## Source and assets
Game rules remain under src/systems and data under src/data. Rendering uses WorldScene, PlayerView, a separate UI Scene, Hud and pixelWidgets. Original crop/UI art and bitmap font remain under public/assets/pixel. The primary environment is Serene Village revamped v1.9 by LimeZu (CC BY 4.0), adapted into public/assets/pixel/processed. Original 24x32 farmers have two idle and four walking frames in each direction; original missing furniture and props complete the family. Optional regeneration uses Python + Pillow: `python3 scripts/generate-pixel-assets.py` (retained world/font) and `python3 scripts/process-rpg-assets.py` (current atlas/farmers). Do not run the historical process-town-assets.py for the current art direction. Vendor archives and unused source files are excluded from production.
Credits/licences: docs/ASSET_LICENSES.md and title → Credits. Asset audit: docs/ASSET_CANDIDATES.md. Original additions and adaptations were Codex-assisted; see docs/AI_USAGE.md. No reference-game pixels, music, voice or external fonts were copied.

This is still Milestone 1: no forest, combat, weapons, animals, death/recovery, extra crops or large story system. Team name/contact, private repository/reviewer access, official hosting and final submission materials remain to be supplied/approved by the team. No deployment or repository push was performed.

## Development checks
`npm run dev -- --port 5174`; add `?collisions` to display collision rectangles. The debug overlay is disabled by the production build even with that query. `python3 scripts/verify-character-frames.py` (Pillow) checks all 48 frames and writes a nearest-neighbour gallery under docs/verification, never runtime assets. Current browser acceptance: tests/browser/stabilization.mjs; earlier City-based suites are historical.
