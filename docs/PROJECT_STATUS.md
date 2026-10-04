# Project status
**Version 0.1.1 — Milestone 1 fullscreen visual correction complete, 2026-10-04.** Milestone 2 has not started.

## Presentation replaced
- Removed the visible webpage masthead, footer, cream page surround, DOM information panels, CSS character stand-ins, serif typography and text-symbol inventory icons.
- Replaced the page shell with a full-viewport Phaser Canvas (100vw / 100dvh, no scrolling), using RESIZE, nearest-neighbour filtering, pixelArt, antialias false, roundPixels and integer camera zoom.
- Rebuilt Home, Farm and City from an original reusable pixel atlas: tiles, paths, distinct soil plots, vegetation, fences/signs, buildings/interior, bed/furniture and market stalls. Depth ordering lets vegetation/furniture overlap the player appropriately.
- Added bounded player-follow camera. The 960×640 drawn world always covers the camera; map/collision coordinates remain compatible with existing saves.
- Added readable boy/girl sheets: idle and two walking frames per direction, independent up/down/left/right drawings and explicit facing toward interactions.
- Canvas-only title, character selection, compact HUD/hotbar, touch controls, contextual prompts, bed/shop screens, pause/Save/Controls/Return-to-title and short dismissible notifications.

## Gameplay preserved
No changes to src/systems/*, src/data/* or src/config.js in this redesign. Starting money 60; one data-driven tomato; buy, plant, water before/after 16:00, sleep/grow for three successful days, harvest two, sell for 36 coins. Day/night, energy, health display, walking/collision, transitions and localStorage behavior retained. Version-1 schema and key unchanged; no migration, progress wipe or coordinate remapping.

## Controls and review commands
WASD/arrows move; E/Space use; 1/2/3 select Seed/Water/Harvest; Escape pause. Canvas menus support pointer/touch and arrows/Enter. Touch pad/hotbar/Use appear on small/coarse-pointer screens. Pause contains Resume, Save, Controls and Return to title. Notifications have an X.

`npm ci` installs; `npm run dev` serves development. `npm test` runs pure rules tests. `npm run build` creates dist/. `npm run preview` serves production, normally http://127.0.0.1:4173/ . Refresh an older open tab; use the printed port if one is already occupied. Node 22.12+ recommended.

## Verified
- 7/7 deterministic rules/save/collision tests pass.
- Full canvas-controlled loop passes on development and production: girl → travel → buy → plant → both waterings/sleep on three days → day 4 maturity → harvest 2 → sell → 86 coins → Save → refresh → Continue. Both character selections checked. Pause freezes time.
- Production viewports: **1440×900, 1280×720, 1024×768, 390×844, 844×390**. Canvas equals viewport, no scrolling/header/footer, controls within screen boundaries, movement and camera bounds pass.
- Real Chromium CDP touch events move the player; touch-mode canvas controls work. Mobile help/character/confirmation/pause menus fit portrait and landscape.
- Legacy v1 save fixture preserves money, day, crop growth/watering, inventory, selection, health, energy and character. All four direction animations show both walk frames and return to idle; world boundary collision/camera checked.
- Production build succeeds without important warnings. Browser reports **no page errors or console warnings**. Read-only QA reports and screenshots: docs/verification/redesign/.

## Files and systems changed
Replaced: index.html; src/ui/styles.css; src/ui/interface.js (DOM controller → Phaser UI Scene); src/art/worldArt.js (smooth Graphics → atlas composition); src/scenes/WorldScene.js (sprite/camera rendering); src/main.js (canvas lifecycle/dialogs).
Added: src/entities/PlayerView.js; src/ui/Hud.js; src/ui/pixelWidgets.js; scripts/generate-pixel-assets.py; public/assets/pixel/{world.png,world.json,boy.png,girl.png,font.png,font.xml,README.md}; canvas acceptance/legacy-menu browser scripts and evidence. Architecture, asset/AI records, README and AGENTS agreement updated. Superseded DOM browser scripts removed; prior milestone history remains in Git.

## Known limitations / remaining release checks
No known blocking issue in the tested Milestone 1 loop. Art is original temporary pixel art, not final production illustration. Very tall/narrow screens naturally show less of the map; the camera follows rather than stretching or shrinking the world. Physical Android/iOS and real notched-browser UI, Safari/WebKit, Firefox and Edge remain unverified. Existing WebKit runtime mismatch prevents claiming Safari coverage. No final music/voice, damage/combat, extra crops or story ending. Browser storage can be cleared/disabled externally. Team human review of the redesign and final competition declarations are still outstanding.

## Recommended next work — not started
Human visual/gameplay review and actual phone/Safari/Firefox testing first. Keep this foundation intact. Forest/risk/combat and any further gameplay belong to a separately authorized Milestone 2. Official hosting, submission ZIP/demo/screenshots, team profile, private reviewer repository and final declarations remain release work.
