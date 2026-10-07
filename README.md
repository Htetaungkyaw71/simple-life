# Simple Life — Milestone 2
**City and Economy V1: four crops, local city shops and daily prices, with paid farm expansion and manual bedtime preserved.** Original tropical farming slice for Digit7 Jam. The entire world, title screen, character selection, HUD, shops, bed, help and pause menus are inside the Phaser canvas. No webpage masthead, footer, external panels or document scrolling.

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
Production preview normally uses http://127.0.0.1:4173/ . Reload a previously open tab to see the repaired build. `dist/` is the static browser build; serve it with HTTP/HTTPS rather than opening index.html from disk. Relative paths support subdirectory deployment. There is no backend, runtime CDN, tracking, external API or account requirement.

## Play
Choose a boy or girl. Start outside Home with 60 coins. Collect 3 tomato seeds once from the crate beside the house. Approach the porch and press E/Use to enter; the furnished interior has the bed. Exit through its south doorway, then follow the south path to the bottom map edge; crossing it automatically enters the north edge of Farm. Walk north out of Farm to return Home. The compact tilled field immediately east of the farm entrance has 16 usable cells. Select Seed and Use on the outlined cell; select Water and water during 06:00–12:00 and 16:00–22:00. Choose Sleep at the bed: sleep during 06:00–20:00 wakes at 20:00; sleep at night wakes at 06:00 (the same morning if already past midnight). Three fully watered nights produce two tomatoes per crop. After harvesting, return Home and follow the CITY signs along the east road to its edge. Lantern Square has Clara's seed stall (07:00–20:00) and Niko's produce market (07:00–20:00). Buy 1, 5 or maximum; sell 1, 5 or all. Panels pause time and movement. Choose one of four crop icons, select 1/5/Max or All, then press the single Buy/Sell button showing quantity and exact total. The ? button opens optional crop-care/shop information. Tomato / Strawberry / Carrot / Corn seeds cost 10 / 18 / 28 / 40 coins and take 3 / 4 / 4 / 5 cared-for nights; yields are 2 / 2 / 1 / 3. Daily produce prices range 85–120% of base, persist on reload and change at midnight. Seed aid at the city noticeboard offers one Tomato seed per day when broke with no seeds, produce or living crops. Farm board retains its Tomato convenience trade at the same daily price and manages land/farm purchases; other seeds and quantity-based trading are in City.
Target a planted cell to see its name, earned growth stage, segmented progress, AM/PM care and remaining cared-for nights. Growth advances once at midnight, awake or asleep; the panel never counts real seconds. It moves clear of the inspected crop, farmer and controls. After collecting seeds, a seven-second objective and a temporary pixel arrow guide you toward the actual south Farm exit. One permanent wooden FARM sign at the first Home junction remains after arrival; the saved first visit permanently removes the guide.

Approach a pond with the watering can selected for “Refill watering can.” Water is unlimited in this milestone; this interaction provides refill feedback without consuming resources.
One missed watering window wilts a crop and pauses growth; watering in the next window recovers it. Two consecutive missed windows kill a crop; Use clears it for free. Awake time costs one energy every 30 game minutes, in addition to farming actions. The minute clock runs continuously through midnight and advances the day, growth and daily prices. Daylight fades through sunset into dark blue moonlight; dawn brightens gradually. Both merchants leave at 20:00 and return at 07:00. There are no lamp halos or player lights. Choose Sleep at the bed to restore energy; zero energy never prevents walking home. Health is visible and saved, with no damage mechanics in this peaceful slice.

- WASD / arrows: move; the camera follows.
- E / Space: use nearby highlighted object / selected tool.
- 1 / 2 / 3: Seed / Watering Can / Harvest Tool. Q cycles the seed crop; BAG opens the seed selector on mouse/touch.
- Escape: pause. Enter and arrows navigate canvas menus; pointer/touch also works.
- Touch: on-canvas directional pad, tool hotbar and Use.
- Pause → Save, Controls, Resume, or Return to title.
- Temporary notifications can be dismissed with their X.

The existing localStorage key is preserved. Schema 7 stores each farm’s four field unlocks, selected farm and independent crops, plus farm-visit state, planting/recovery timestamps, the one-time reward, room dimensions and per-window crop history and fractional awake-fatigue progress; times before 06:00 persist; version-1/2/3/4/5/6 saves migrate with the original six crop indices preserved. City saves repair to safe town ground, and old cutaway-room saves become interior saves. Safe existing coordinates load unchanged; a position made unsafe by new scenery moves to the nearest safe point on a two-unit search grid (safe spawn is the fallback) while keeping normal progress. Autosave occurs after transactions, transitions, sleeping, every 2.5 seconds and pagehide/visibility change. Refresh → Continue restores progress. New Game confirms before replacement. Saves remain specific to browser and origin; disabled storage is reported.

## Paid expansion
The first field is yours. Buy fields 2, 3 and 4 for **120 / 180 / 240 coins**, either by approaching locked land and using it or via Farm board → Buy planting land. Each becomes the same joined 4×4 bed, border, north fence, scarecrow and utility-prop design as the original. Four fields give 64 planting cells.

After unlocking all four fields on the newest farm, Farm board → Visit / buy farms offers another farm for **600 × farms already owned** coins (600 for farm 2, 1,200 for farm 3). A new farm repeats the same map and starts with its first field unlocked. Previous / Next farm at the board switches between owned farms. Ownership and crops remain separate; the shared clock, watering windows and sleep apply to every farm, including those not currently visited. Budget energy and care before planting more crops. Purchases require sufficient coins and confirmation; duplicates do not spend money. Prices are editable in src/data/farms.js.

## Scale and exploration
Outdoors use zoom 1 with 2× source pixels. Indoors use integer zoom 2, a native-size farmer and larger furniture: the farmer stays 64 display pixels high in both locations. The responsive compact room is 624×304 logical units at 1280×720, with the full room visible on desktop. Its authored envelope is 800×480 (about 40% smaller than the previous 1344×800); small screens use limited following. Home and Farm remain 2240×1152 outdoors. Context prompts stay compact. Locked land cannot be planted until purchased. City is a compact 1280×896 scene with a central plaza, two staffed outdoor shops and a matching west exit back Home.

## Verification and limitations
Production tested in Chromium at **1440×900, 1280×720, 1024×768, 390×844, 844×390, 360×640 and 640×360**: full viewport, no scrolling/external page UI, accessible canvas hit targets, movement, bounded follow camera and integer-scaled pixels. Stabilization checks cover house sides/porch/doors, one-time seeds, pond navigation, crop growth, touch input, animation and save/reload. No page errors or console warnings were recorded. `npm test` passes all 56 tests; the production build is about 1.68 MB uncompressed. The full new-game Tomato → City sell → Strawberry purchase/growth → City sell → saved reload loop passed, with empty browser errors/warnings and no remote runtime requests.
These are desktop/Chromium mobile-emulation results. Actual phones, mobile browser chrome/notches, Safari/WebKit, Firefox and Edge still need real-device/browser checks; no pass is claimed for them. See docs/VERIFICATION.md for scripts and evidence; Current shop/day-night/full-loop evidence is under docs/verification/day-night/; previous City evidence is under docs/verification/city/; expansion evidence remains under docs/verification/expansion/.

## Source and assets
Game rules remain under src/systems and data under src/data. Rendering uses WorldScene, PlayerView, a separate UI Scene, Hud and pixelWidgets. Original crop/UI art and bitmap font remain under public/assets/pixel. The primary environment is Serene Village revamped v1.9 by LimeZu (CC BY 4.0), adapted into public/assets/pixel/processed. Original 24x32 farmers have two idle and four walking frames in each direction; original missing furniture and props complete the family. Optional regeneration uses Python + Pillow: `python3 scripts/generate-pixel-assets.py` (retained world/font) and `python3 scripts/process-rpg-assets.py` (current atlas/farmers). Do not run the historical process-town-assets.py for the current art direction. Vendor archives and unused source files are excluded from production.
Credits/licences: docs/ASSET_LICENSES.md and title → Credits. Asset audit: docs/ASSET_CANDIDATES.md. Original additions and adaptations were Codex-assisted; see docs/AI_USAGE.md. No reference-game pixels, music, voice or external fonts were copied.

Milestone 2 stops at City/economy and these four crops: no forest, combat, weapons, animals, death systems, weather, orchard crops, festival or large story system. Team name/contact, private repository/reviewer access, official hosting and final submission materials remain to be supplied/approved by the team. No deployment or repository push was performed.

## Development checks
`npm run dev -- --port 5174`; add `?collisions` to display collision rectangles. The debug overlay is disabled by the production build even with that query. `python3 scripts/verify-character-frames.py` (Pillow) checks all 48 frames and writes a nearest-neighbour gallery under docs/verification, never runtime assets. Current acceptance: tests/browser/city-economy.mjs and tests/browser/farming-information.mjs; expansion.mjs records prior expansion acceptance; its fixed 18-coin sale assumptions predate daily prices. Earlier stabilization/City browser suites retain historical coordinates.
