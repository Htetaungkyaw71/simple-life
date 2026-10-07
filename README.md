# Simple Life — Wilderness expansion

An original tropical farming and forest survival game for Digit7 Jam. Phaser 3 + Vite, fullscreen pixel canvas, keyboard/mouse/touch, local saves. Version **0.4.6**, schema **9**.

The 2026-10-07 asset/water follow-up uses the user-supplied Craftpix packs: animated Boar replacement, quiet Deer/Hare/Fox/Grouse, textured ruin fragments and animated plant scenery. All water is walkable with ankle ripples and continuous river banks. Existing 22 combat species, habitats, treasure and progress remain. Pack coverage is five woodland animals; the other 21 combat species still use original project art. Craftpix licence evidence and exact selected frame rectangles are documented locally, with in-game Credits.

The latest ground/river pass adds original moss and short-grass textures, small flower clusters, varied soil/pebbles, blended habitat colours and shaded sandy banks, submerged stones and dark water channels. Current trees, moving tall grass, jumping and water walking remain. Source and checks: docs/assets/licenses/ground-river-materials.md and docs/verification/terrain.

The v0.4.6 theme follow-up uses horizontal timber bridges that reach both banks, removes every raised earth assembly and teal fern from Forest, and brings forest foliage into a shared muted olive palette. River reflections are small scattered clusters. Night shading no longer draws cell-grid seams across bridges. Forest has **844 trees + 41 bamboo stands / 4,201 responsive grass clumps**. Grass stays off bridges, roots stay out of water, and jumping remains available. Current source/checks: docs/assets/licenses/forest-theme.md and docs/verification/forest-theme.

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

Follow Home's wooden **FOREST ↑** sign to a **5120×5120 wilderness**, exactly **20 times the previous forest area** at the same camera/character scale. Twenty connected regions include Homewood, jungle groves, savanna, bamboo, pine woods, marsh/river, basalt caves, ruins, highlands and a stylized snowy lake. Timber bridges cross the river; natural shores, walkable stone chambers, camp, shrine and ice landmarks reward exploring. MAP / M shows discovered regions, the player, danger, species combat values and broad treasure clues. Head southwest to Homewood, then south to Home.

**63 daily forage nodes** provide nine fruits: Wild Berry (+12 energy / 6 base coins), Guava (+20 / 12), Mango (+30 / 20), Banana (+18 / 10), Orange (+22 / 14), Papaya (+32 / 22), Coconut (+35 / 24), Dragon Fruit (+42 / 36), Pineapple (+38 / 28). E/USE collects; BAG → FOOD pages through icon tabs and EAT 1 consumes one, caps energy at 100 and refuses consumption when full. Market pages buy every fruit and Wild Hide with the retained 85–120% daily multiplier. Original crop/fruit/hide price salts stay unchanged. Nodes refresh once per day, never on scene reentry/reload.

**68 animals across 22 species** live in their own territories in groups of 2–4: boar, lion, tiger, cheetah, leopard, jaguar, wolf, hyena, elephant, giraffe, hippo, zebra, rhino, kangaroo, panda, chimpanzee, gorilla, monkey, crocodile, Komodo dragon, polar bear and snake. This is a stylized game wilderness, not a recreation of real animal geography. Species vary from 2–9 club hits, 8–28 damage and 210–400 charge speed. Herbivores have shorter defensive awareness; predators notice from farther away. All warn before a locked charge, respect solids/territory, recover after hit/miss and share player damage invulnerability across the group. Club cost/cooldown stays 5 energy / 450ms. One Wild Hide drops per animal driven away. Saved partial health/dead states survive travel and dead animals return on a later day. Night awareness/movement increase slightly; stepped local visibility keeps distant areas dark.

**14 rare ancient caches** hide beyond the grassy passages in dangerous regions, including the Serpent Hollow chamber. Approach to spot a chest; nearby living animals within 240 units block its recovery. Drive those guards away, then USE to recover 313–462 coins depending on the cache. Each cache pays once per save; sleep, reentry and reload cannot reroll it. MAP supplies broad clues after discovering the region, without revealing exact chest positions.

At zero health, fall/fade and wake beside the home bed at **06:00 next day**, with health/energy restored. Drop **floor(25% of carried coins)** into one saved Stash Bag at the safe forest defeat position. Return and USE it to recover the coins. A second defeat permanently replaces the old bag. Zero loss creates no empty bag. Crops, inventory, equipment and paid farms remain. First-visit and first-defeat messages explain the rules and pause safely.

- WASD/arrows: move; E: USE. Space/K: directional ATTACK. J/Shift or JUMP: leap across low forest ledges.
- 1/2/3: Seed / Water / Harvest; Q: cycle planting crop.
- M / MAP: wilderness discovery map. BAG: seeds, paged FOOD and GEAR. Arrows/Tab/Enter navigate menus; Escape closes/pauses.
- Touch: directional pad, tools, USE and a separate ATTACK button with an equipped club.
- Pause → Save, Controls, Resume or Return to title. Refresh → Continue.

Fields 2/3/4 still cost **120/180/240** coins. After buying all four fields on the newest farm, another independent farm costs **600 × farms owned**. Each farm has up to 64 cells; time/care apply across every owned farm. Use Farm board to manage land/farms and its retained Tomato convenience trade.

## Saves and sources

`simple-life.save.v1` remains the storage key; schemas 1–8 migrate to 9 without deleting progress. Autosave follows actions/travel/sleep/defeat, every 2.5 seconds and pagehide. Invalid positions repair to nearby safe ground. Save scope is browser/origin. New Game confirms replacement; unavailable storage is reported. No offline simulation. See docs/SAVE_SCHEMA.md.

Rules stay under `src/systems`, definitions under `src/data`, world rendering in WorldScene/ForestView and UI in a separate Phaser scene. Outdoor source pixels render at 2×; indoors retain integer zoom 2 and 64px farmer frames. Primary environment: **Serene Village revamped 1.9 by LimeZu, CC BY 4.0**, adapted palette/atlas and fruit trees. Playable farmers now use Channeechan’s supplied native character pixels with adapted jump poses; original NPC/forest/crop/item/effect art, font and UI are code-authored with Codex assistance. Forest includes selected ToffeeCraft FreeEnvironment scenery at the user’s noncommercial request. Both creators and the Eris Esra template are credited. Evidence: docs/ASSET_LICENSES.md, docs/assets/licenses and docs/AI_USAGE.md; title → Credits links creator/license. No commercial-game assets, downloaded audio or external font. Silent sound hooks remain; no suitable licensed sounds exist yet.

The build emits only eight allowlisted runtime art files. Vendor archives, manifests, scripts and QA images never enter `dist/`. Optional art regeneration: `python3 scripts/process-rpg-assets.py` with Pillow. Historical process-town-assets.py is not the active pipeline.

## Verification and limits

Current results and reproduction commands: docs/VERIFICATION.md and docs/verification/wilderness/. Automated tests retain farming, city, expansion, migration and time regressions and cover the complete survival rules. Browser checks use isolated Chromium saves, real keyboard/mouse/touch and read-only `?qa` snapshots. Required viewports: **1440×900,1280×720,1024×768,844×390,390×844**. Default renderer is Canvas; `?renderer=webgl` supports local comparison of pixel lighting. Development-only `?collisions` shows solids.

Physical phones/notches, Safari/WebKit, Firefox and Edge remain unverified; touch results use Chromium emulation. Combat/economy values are initial balance requiring human play review. Audio is silent, water is unlimited, additional farms reuse the same map. No final team acceptance or competition submission is claimed. Team profile/contact, private reviewer repository, official hosting, matching ZIP/screenshots/demo and signed declarations remain separate submission work.

This user-authorized follow-up expands the completed Milestone 3 wilderness. The earlier one-small-map/one-enemy limit is superseded. No additional weapons/armor/crafting/weather/relationships/backend or unrelated progression. Nothing was pushed, published or deployed.

## Historical forest growth and jumping — 0.4.2
The forest has 787 trees and 33 bamboo stands, 3,880 responsive grass clumps and 20 stepped terraces with stair openings. Touching grass bends it; it springs upright after departure. Nearby grass is rendered on demand. Forest jumps have a 600ms arc and 850ms cooldown, cost no energy and cross only low ledges; trees, rocks and structures stay solid. Animal hits interrupt the jump. Use/attack wait until landing. Pausing freezes the arc; saving during it stores the grounded take-off point. Water walking remains, with the ankle line hidden while airborne.

The v0.4.3 follow-up integrates **FreeEnvironment** and **Cute Farmer Character by Channeechan**, version 0.4.3. Boy/girl selection and every location use the new native character cells, including adapted jump poses. Forest has sample conifers, boulders, ice and dry plants with correctly anchored trunks and fading crowns. Fruit broadleaf trees/acacias/bamboo, responsive grass and terraces remain. Source records and compact in-game credits identify Channeechan, Eris Esra and ToffeeCraft. Mana Seed is not used.

FreeEnvironment's Standard Free licence permits personal game development. The user explicitly requests this noncommercial local integration; **public prize-competition coverage remains unconfirmed**. Neither intent nor integration establishes additional creator permission; no commercial release, push, publication or competition submission occurred. The earlier blanket assertion that competitions require commercial rights is corrected. See docs/assets/licenses/supplied-farmer-environment/SOURCE_RECORD.md. New source archives/original PNGs stay with the user and are excluded from repository/build; optional regeneration accepts SIMPLE_LIFE_FARMER_RAR and SIMPLE_LIFE_ENV_ZIP paths. Builds use the committed processed art.
