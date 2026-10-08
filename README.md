# Simple Life — Leaf and parchment UI

An original tropical farming and forest survival game for Digit7 Jam. Phaser 3 + Vite, fullscreen pixel canvas, keyboard/mouse/touch, local saves. Version **0.6.0**, schema **10**.

The farm now has connected red-soil beds, olive crop foliage, water-drop/red !/harvest markers, a pouring-can effect and temporary wet ground. Dig free planting spaces with Shovel; City shops and the bag offer twelve crop seeds. Existing crops and purchased farms migrate without resetting progress. Evidence: docs/verification/free-farming. The repaired readable UI text, whole-minute clock, Forest Map and badge-free tools remain.

The current interface uses original cream/olive pixel frames, a scenic forest title, a heart meter, a compact clock/coin badge and a bottom icon hotbar. Bag, shops, pause, help, farming and confirmation screens share this theme. The bag has seed/produce/food/gear icon grids. The forest-only parchment map reveals explored terrain and rivers with a player-facing arrow; details are optional. Supplied screenshots guide style only.

The latest forest extension doubles the approved wilderness area to **10240×5120**, with **40 connected regions**. The original western half has about **16% fewer trees**; the eastern half adds new groves, clearings and river habitats at the same character/camera scale. Four full-length rivers, a tributary and a short pool channel have independently scalloped banks, changing widths and sandy pockets inspired by the supplied reference. Twenty-two grass-free wooden bridges connect their banks. Water remains walkable.

**163 daily fruit spots** (nine existing fruit types) and **78 animals** now fill the forest: 30 saved Wild Boars and 48 quiet Deer/Hare/Fox/Grouse. New animals appear in small pairs using the approved Craftpix sprites. Existing treasure rewards, original animal IDs/health, discovery, fruit collection, farming, City, sleep and recovery progress remain. Fruit spots covered by widened water move to nearby dry banks with their saved IDs intact. Existing olive trees/palms/palmettos, responsive grass and moss/red-soil art remain. No roads, waterfalls, teal ferns or raised banks return. Source/evidence: docs/assets/licenses/forest-expansion.md and docs/verification/forest-expansion.

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

Choose boy/girl. Start with 60 coins, collect three Tomato seeds from the Home crate, and walk south through Home's map edge to Farm. Plant/water/harvest the starter beds, or select Shovel (4) and USE/click nearby clear Farm grass to dig another free bed. Adjacent beds join into connected soil; roads, water, bridges and structures cannot be dug. Water (2) pours on outdoor open ground and leaves a wet patch that dries after three active minutes or sleep; cosmetic wetness does not replace plant care. Water at **06:00–12:00 and 16:00–22:00**; one missed window wilts, two consecutive misses kill. Three fully cared-for nights yield two Tomatoes. Manual bed sleep at 06:00–20:00 wakes at 20:00; nighttime sleep wakes at 06:00, including the same morning after midnight. The clock rolls over continuously; crops/daily prices settle once at midnight. Awake fatigue costs one energy per 30 game minutes. Zero energy still permits walking.

Twelve crops: Tomato / Strawberry / Carrot / Corn / Chili / Eggplant / Cucumber / Watermelon / Pumpkin / Grape / Blueberry / Sweet Potato. Original four values remain: seed prices **10 / 18 / 28 / 40**, growth **3 / 4 / 4 / 5** cared-for nights, yield **2 / 2 / 1 / 3**. The paged City seed shop supplies all twelve; values are in src/data/crops.js. Home's east edge leads to City. Clara sells seeds; Niko buys crops, forest fruit and Wild Hide; Rowan's southwest **OUTFITTER** sells one permanent auto-equipped **Wooden Club for 45 coins**. All merchants operate **07:00–20:00**, disappearing when closed. Shops pause simulation, use icon tabs, exact quotes and 1/5/Max or All quantities. City seed aid retains one free Tomato seed/day for eligible broke farmers.

Follow Home's wooden **FOREST ↑** sign to a **10240×5120 wilderness**, exactly **twice v0.4.8 and 40 times the original forest area** at the same camera/character scale. Forty connected regions include Homewood, jungle groves, savanna, bamboo, pine woods, marsh/river, basalt caves, ruins, highlands and a stylized snowy lake. Timber bridges cross the river; natural shores, walkable stone chambers, camp, shrine and ice landmarks reward exploring. The map icon / M opens the Forest-only parchment map, with explored terrain, rivers, player position and current facing. The ? control offers broad cache clues; exact treasure positions stay hidden. Head southwest to Homewood, then south to Home.

**163 daily forage nodes** provide nine fruits: Wild Berry (+12 energy / 6 base coins), Guava (+20 / 12), Mango (+30 / 20), Banana (+18 / 10), Orange (+22 / 14), Papaya (+32 / 22), Coconut (+35 / 24), Dragon Fruit (+42 / 36), Pineapple (+38 / 28). E/USE collects; Bag → food tab also offers farm-grown Watermelon (+35), Grape (+20) and Blueberry (+16), for twelve foods total. Eat consumes one, caps energy at 100 and refuses consumption when full. Market pages buy every fruit and Wild Hide with the retained 85–120% daily multiplier. Original crop/fruit/hide price salts stay unchanged. Nodes refresh once per day, never on scene reentry/reload.

**Only Craftpix animals remain:** 30 saved Wild Boars (two in Homewood, one per existing cache and seven new pairs), plus 48 quiet Deer/Hare/Fox/Grouse. Boars need three club hits, deal 15 damage and charge at 280 units/second. They warn before charging, respect solids/territory and share player damage invulnerability. Club cost/cooldown stays 5 energy / 450ms. One Wild Hide drops per boar driven away. Saved partial health/dead states survive travel; defeated boars return on a later day. Night awareness/movement increase slightly; distant areas remain dark.

**14 rare ancient caches** hide beyond the grassy passages in dangerous regions, including the Stone Hollow chamber. Approach to spot a chest; nearby living animals within 240 units block its recovery. Drive those guards away, then USE to recover 313–462 coins depending on the cache. Each cache pays once per save; sleep, reentry and reload cannot reroll it. MAP supplies broad clues after discovering the region, without revealing exact chest positions.

At zero health, fall/fade and wake beside the home bed at **06:00 next day**, with health/energy restored. Drop **floor(25% of carried coins)** into one saved Stash Bag at the safe forest defeat position. Return and USE it to recover the coins. A second defeat permanently replaces the old bag. Zero loss creates no empty bag. Crops, inventory, equipment and paid farms remain. First-visit and first-defeat messages explain the rules and pause safely.

- WASD/arrows: move; E: USE. Space: forest jump; K: directional attack. Legacy J/Shift jump keys remain available.
- 1/2/3/4: Seed / Water / Harvest / Shovel; Q: cycle planting crop. E / USE or a nearby ground click applies the selected tool.
- B / bag icon: seeds, produce, food and gear. M / map icon: Forest-only map. Arrows/Tab/Enter navigate menus; Escape closes/pauses.
- Touch: directional pad, tools, USE and the club icon with an equipped club. Double tap open Forest ground to jump. No upper action row or on-screen Jump button.
- Pause → Save, Controls, Resume or Return to title. Refresh → Continue.

Planting land is free: Shovel costs 4 energy per cell, with no coin purchase. Starter beds and previously purchased fields/farms remain. New beds can extend them across clear Farm grass; all planted beds receive the established care/growth rules. The Farm board offers a shovel guide, travel between previously owned farms and retained Tomato convenience trade.

## Saves and sources

`simple-life.save.v1` remains the storage key; schemas 1–9 migrate to 10 without deleting progress. Autosave follows actions/travel/sleep/defeat, every 2.5 seconds and pagehide. Invalid positions repair to nearby safe ground. Save scope is browser/origin. New Game confirms replacement; unavailable storage is reported. No offline simulation. See docs/SAVE_SCHEMA.md.

Rules stay under `src/systems`, definitions under `src/data`, world rendering in WorldScene/ForestView and UI in a separate Phaser scene. Outdoor source pixels render at 2×; indoors retain integer zoom 2 and 64px farmer frames. Primary environment: **Serene Village revamped 1.9 by LimeZu, CC BY 4.0**, adapted palette/atlas and fruit trees. Playable farmers now use Channeechan’s supplied native character pixels with adapted jump poses; original NPC/forest/crop/item/effect art, font and UI are code-authored with Codex assistance. Forest includes selected ToffeeCraft FreeEnvironment scenery at the user’s noncommercial request. Both creators and the Eris Esra template are credited. Evidence: docs/ASSET_LICENSES.md, docs/assets/licenses and docs/AI_USAGE.md; title → Credits links creator/license. No commercial-game assets, downloaded audio or external font. Silent sound hooks remain; no suitable licensed sounds exist yet.

The build emits only eight allowlisted runtime art files. Vendor archives, manifests, scripts and QA images never enter `dist/`. Optional art regeneration: `python3 scripts/process-rpg-assets.py` with Pillow. Historical process-town-assets.py is not the active pipeline.

## Verification and limits

Current results and reproduction commands: docs/VERIFICATION.md and docs/verification/free-farming/. This pass has 139 passing tests, a production build, asset/HTTP audits and labelled offline Farm/UI studies; native browser interaction checks are blocked by the browser tool URL policy. Earlier browser results below are historical. Automated tests retain farming, city, expansion, migration and time regressions and cover the complete survival rules. Browser checks use isolated Chromium saves, real keyboard/mouse/touch and read-only `?qa` snapshots. Required viewports: **1440×900,1280×720,1024×768,844×390,390×844**. Default renderer is Canvas; `?renderer=webgl` supports local comparison of pixel lighting. Development-only `?collisions` shows solids.

Physical phones/notches, Safari/WebKit, Firefox and Edge remain unverified; touch results use Chromium emulation. Combat/economy values are initial balance requiring human play review. Audio is silent, water is unlimited, additional farms reuse the same map. No final team acceptance or competition submission is claimed. Team profile/contact, private reviewer repository, official hosting, matching ZIP/screenshots/demo and signed declarations remain separate submission work.

This user-authorized follow-up expands the completed Milestone 3 wilderness. The earlier one-small-map/one-enemy limit is superseded. No additional weapons/armor/crafting/weather/relationships/backend or unrelated progression. Nothing was pushed, published or deployed.

## Historical forest growth and jumping — 0.4.2
The forest has 787 trees and 33 bamboo stands, 3,880 responsive grass clumps and 20 stepped terraces with stair openings. Touching grass bends it; it springs upright after departure. Nearby grass is rendered on demand. Forest jumps have a 600ms arc and 850ms cooldown, cost no energy and cross only low ledges; trees, rocks and structures stay solid. Animal hits interrupt the jump. Use/attack wait until landing. Pausing freezes the arc; saving during it stores the grounded take-off point. Water walking remains, with the ankle line hidden while airborne.

The v0.4.3 follow-up integrates **FreeEnvironment** and **Cute Farmer Character by Channeechan**, version 0.4.3. Boy/girl selection and every location use the new native character cells, including adapted jump poses. Forest has sample conifers, boulders, ice and dry plants with correctly anchored trunks and fading crowns. Fruit broadleaf trees/acacias/bamboo, responsive grass and terraces remain. Source records and compact in-game credits identify Channeechan, Eris Esra and ToffeeCraft. Mana Seed is not used.

FreeEnvironment's Standard Free licence permits personal game development. The user explicitly requests this noncommercial local integration; **public prize-competition coverage remains unconfirmed**. Neither intent nor integration establishes additional creator permission; no commercial release, push, publication or competition submission occurred. The earlier blanket assertion that competitions require commercial rights is corrected. See docs/assets/licenses/supplied-farmer-environment/SOURCE_RECORD.md. New source archives/original PNGs stay with the user and are excluded from repository/build; optional regeneration accepts SIMPLE_LIFE_FARMER_RAR and SIMPLE_LIFE_ENV_ZIP paths. Builds use the committed processed art.
