# Simple Life — Milestone 3

An original tropical farming and forest survival game for Digit7 Jam. Phaser 3 + Vite, fullscreen pixel canvas, keyboard/mouse/touch, local saves. Version **0.3.0**, schema **8**.

## Run locally

Node.js 22.12+ recommended. All runtime art is committed; Python is only needed to regenerate art.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Open the URL printed by Vite. Serve `dist/` over HTTP(S); relative paths support subdirectories. No backend, account, tracking, external API, remote runtime asset or CDN.

## Play

Choose boy/girl. Start with 60 coins, collect three Tomato seeds from the Home crate, and walk south through Home's map edge to Farm. Plant/water/harvest the outlined cells. Water at **06:00–12:00 and 16:00–22:00**; one missed window wilts, two consecutive misses kill. Three fully cared-for nights yield two Tomatoes. Manual bed sleep at 06:00–20:00 wakes at 20:00; nighttime sleep wakes at 06:00, including the same morning after midnight. The clock rolls over continuously; crops/daily prices settle once at midnight. Awake fatigue costs one energy per 30 game minutes. Zero energy still permits walking.

Four crops remain: Tomato / Strawberry / Carrot / Corn. Seed prices **10 / 18 / 28 / 40**, growth **3 / 4 / 4 / 5** cared-for nights, yield **2 / 2 / 1 / 3**. Home's east edge leads to City. Clara sells seeds; Niko buys crops, forest fruit and Wild Hide; Rowan's southwest **OUTFITTER** sells one permanent auto-equipped **Wooden Club for 45 coins**. All merchants operate **07:00–20:00**, disappearing when closed. Shops pause simulation, use icon tabs, exact quotes and 1/5/Max or All quantities. City seed aid retains one free Tomato seed/day for eligible broke farmers.

Follow Home's wooden **FOREST ↑** sign and north road to the full-width edge. The south forest path returns Home. Six free daily nodes offer **Wild Berry (+12 energy, 6 base coins), Guava (+20, 12), Mango (+30, 20)**. Collect with E/USE; BAG → FOOD shows count, energy and today's sale price. EAT 1 consumes one fruit, caps energy at 100 and refuses consumption when full. Sell fruit at the City Market's fruit page. Daily prices stay at 85–120% of base, fixed for the day/save. Reentering/reloading never refreshes fruit early.

The deeper clearing has one Wild Boar. Its `!` warning precedes a locked charge; move aside, then swing toward it. Three hits make it flee and give one **Wild Hide (18 base coins; sell at City Market)**. Club attacks cost 5 energy with a 450ms cooldown. Charges deal 15 health; 750ms invulnerability and small collision-safe knockback keep hits distinct. Boars stop at solids and respawn on a later day. Night movement/awareness increase slightly; stepped nearby visibility keeps paths readable while distant woodland remains dark.

At zero health, fall/fade and wake beside the home bed at **06:00 next day**, with health/energy restored. Drop **floor(25% of carried coins)** into one saved Stash Bag at the safe forest defeat position. Return and USE it to recover the coins. A second defeat permanently replaces the old bag. Zero loss creates no empty bag. Crops, inventory, equipment and paid farms remain. First-visit and first-defeat messages explain the rules and pause safely.

- WASD/arrows: move; E: USE. Space/K: directional ATTACK.
- 1/2/3: Seed / Water / Harvest; Q: cycle planting crop.
- BAG: seeds, FOOD and GEAR. Arrows/Tab/Enter navigate menus; Escape closes/pauses.
- Touch: directional pad, tools, USE and a separate ATTACK button with an equipped club.
- Pause → Save, Controls, Resume or Return to title. Refresh → Continue.

Fields 2/3/4 still cost **120/180/240** coins. After buying all four fields on the newest farm, another independent farm costs **600 × farms owned**. Each farm has up to 64 cells; time/care apply across every owned farm. Use Farm board to manage land/farms and its retained Tomato convenience trade.

## Saves and sources

`simple-life.save.v1` remains the storage key; schemas 1–7 migrate to 8 without deleting progress. Autosave follows actions/travel/sleep/defeat, every 2.5 seconds and pagehide. Invalid positions repair to nearby safe ground. Save scope is browser/origin. New Game confirms replacement; unavailable storage is reported. No offline simulation. See docs/SAVE_SCHEMA.md.

Rules stay under `src/systems`, definitions under `src/data`, world rendering in WorldScene/ForestView and UI in a separate Phaser scene. Outdoor source pixels render at 2×; indoors retain integer zoom 2 and 64px farmer frames. Primary environment: **Serene Village revamped 1.9 by LimeZu, CC BY 4.0**, adapted palette/atlas and fruit trees. Original farmers, forest/crop/item/effect art, font and UI are code-authored with Codex assistance. Evidence: docs/ASSET_LICENSES.md, docs/assets/licenses and docs/AI_USAGE.md; title → Credits links creator/license. No commercial-game assets, downloaded audio or external font. Silent sound hooks remain; no suitable licensed sounds exist yet.

The build emits only eight allowlisted runtime art files. Vendor archives, manifests, scripts and QA images never enter `dist/`. Optional art regeneration: `python3 scripts/process-rpg-assets.py` with Pillow. Historical process-town-assets.py is not the active pipeline.

## Verification and limits

Current results and reproduction commands: docs/VERIFICATION.md and docs/verification/forest/. Automated tests retain farming, city, expansion, migration and time regressions and cover the complete survival rules. Browser checks use isolated Chromium saves, real keyboard/mouse/touch and read-only `?qa` snapshots. Required viewports: **1440×900,1280×720,1024×768,844×390,390×844**. Default renderer is Canvas; `?renderer=webgl` supports local comparison of pixel lighting. Development-only `?collisions` shows solids.

Physical phones/notches, Safari/WebKit, Firefox and Edge remain unverified; touch results use Chromium emulation. Combat/economy values are initial balance requiring human play review. Audio is silent, water is unlimited, additional farms reuse the same map. No final team acceptance or competition submission is claimed. Team profile/contact, private reviewer repository, official hosting, matching ZIP/screenshots/demo and signed declarations remain separate submission work.

This task stops at Milestone 3: one forest, three foods, one weapon/enemy and Stash Bag recovery. No Milestone 4, other enemies/weapons/armor/crafting/weather/relationships/backend. Nothing was pushed, published or deployed.
