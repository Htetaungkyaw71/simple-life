# Simple Life — Milestone 1
**Version 0.1.1: fullscreen pixel-art correction.** Original tropical farming slice for Digit7 Jam. The entire world, title screen, character selection, HUD, shops, bed, help and pause menus are inside the Phaser canvas. No webpage masthead, footer, external panels or document scrolling.

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
Choose a boy or girl. Start with 60 coins at Home. Follow the door to Farm and the east lane to City. Buy a tomato seed for 10 coins. Stand beside an empty plot, select Seed, then Use. Select Water and water before 16:00 and again afterward. The bed offers rest until evening and sleep to the next morning. After three fully watered growing days, Harvest two tomatoes and sell them for 36 coins in City.
Missed watering delays growth. Two fully dry days kill a crop; Use clears it for free. Walking costs no energy. Sleep restores energy; at midnight the player returns home for a new day. Health is visible and saved, with no damage mechanics in this peaceful slice.

- WASD / arrows: move; the camera follows.
- E / Space: use nearby highlighted object / selected tool.
- 1 / 2 / 3: Seed / Watering Can / Harvest Tool.
- Escape: pause. Enter and arrows navigate canvas menus; pointer/touch also works.
- Touch: on-canvas directional pad, tool hotbar and Use.
- Pause → Save, Controls, Resume, or Return to title.
- Temporary notifications can be dismissed with their X.

The version-1 localStorage save key/schema and gameplay coordinates are preserved. Autosave occurs after transactions, transitions, sleeping, every 2.5 seconds and pagehide/visibility change. Refresh → Continue restores progress. New Game confirms before replacement. Saves remain specific to browser and origin; disabled storage is reported.

## Verification and limitations
Production tested in Chromium at **1440×900, 1280×720, 1024×768, 390×844 and 844×390**: full viewport, no scrolling/external page UI, accessible canvas hit targets, movement, bounded follow camera and integer-scaled pixels. Full three-day crop loop, touch input, animations, old-save compatibility and save/reload passed. No page errors or console warnings were recorded. `npm test` and production build pass.
These are desktop/Chromium mobile-emulation results. Actual phones, mobile browser chrome/notches, Safari/WebKit, Firefox and Edge still need real-device/browser checks; no pass is claimed for them. See docs/VERIFICATION.md for scripts and evidence.

## Source and assets
Game rules remain under src/systems and data under src/data. Rendering uses WorldScene, PlayerView, a separate UI Scene, Hud and pixelWidgets. Original PNG atlas, directional sheets and bitmap font are under public/assets/pixel. Recreate them optionally with Python + Pillow: `python3 scripts/generate-pixel-assets.py`.
Credits/licences: docs/ASSET_LICENSES.md. All new pixel art/code was Codex-assisted; docs/AI_USAGE.md records the user's visual review and the team's outstanding human review. No copied reference assets, music, voice or external fonts.

This is still Milestone 1: no forest, combat, weapons, animals, death/recovery, extra crops or large story system. Team name/contact, private repository/reviewer access, official hosting and final submission materials remain to be supplied/approved by the team. No deployment or repository push was performed.
