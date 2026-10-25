# 2026-10-23 — current hunted-food flow

Animal drops create raw Meat, which appears on the first Bag → Gear page as a cooking ingredient and cannot be eaten directly. Its Cook action explains and opens the established Home-hearth route. After the stone stove is built once for 20 Wood + 16 Stone, each 1 Meat + 1 Wood produces 1 Grilled Meat. Grilled Meat is the first Bag → Food item and restores 50 health / 35 energy, independently capped at 100. This supersedes the older direct raw-Meat eating description below; Meat and Grilled Meat remain separate City market goods.

Seed and Harvest clicks may select or put away the tool. For 1.8 seconds after the click, nearby-world prompts and the first-farm guide remain suppressed. Tool selection itself displays no text; the highlighted toolbar icon is the only visual selection state.

---

# v0.43.5 — current Home customization scope (2026-10-23)

Home + Garden currently offers only House designs and Wardrobe. House designs contains the free Green Bay cottage and the 2,000-coin Blue Slate cottage, both reused from the approved City set. Each design changes the outdoor façade and the furnished room's colour treatment; owned designs switch for free. Craft/materials, garden/tree shopping and room-furniture shopping are intentionally hidden until their artwork is ready, without removing owned or placed items from saves. This supersedes the visible eight-house/catalog scope described in v0.17.x below.

---

# v0.21.0 — optional personal style

Nell sells three paid outfits at east City commons (90/120/150c); Sol changes hair at west City lane (30/45/50/60c). Open 07:00–19:00, requiring the same close approach as talking to residents. The two starter outfits are already owned. Clothing purchases are permanent and free to re-equip through Home & garden → Wardrobe; each different haircut is a new paid service. Players can preview all combinations before committing. Current styles cannot charge twice, unavailable purchases disable their action, and coins/style/ownership save together. Cosmetics do not change damage, movement, farming yields, Journal achievement or progression. Existing main goals, NPC curfew and postponed cave remain.

---

# v0.20.2 — current view with stronger depth

The design stays 2D with a three-quarter top-down pixel-art view. Depth comes from native shaded sprites, ground contact, feet-based sorting, raised bridge layers and player visibility behind trees. The user explicitly chooses this direction over changing projection. Walking, collisions, jumping distance/height, farm care, day/night, NPC curfew, trade, story and local saves remain unchanged. The cursed cave stays removed.

---

# v0.20.1 — cursed cave deferred

The user postpones the optional cursed cave. Remove its object, warning/confirmation, nighttime spirits, repair contributions, map marker and achievement. Do not restore the previously removed skull caves. Keep the established farming, exploration, animal combat and five Journal chapters. NPCs and shops retain 19:00 return/closure; lighting and sleep retain established timing.

---

# v0.20.0 — optional curse choice and repair achievement

One sealed cave lies in eastern Dark Forest, marked on the Forest map. No curse occurs without an explicit pictured, paged warning and deliberate Break seal. The one-time 200c cache is the temptation. From 19:00 to 06:00 while broken, up to three tattered spirits pursue outdoors; the existing Axe disperses them with three hits, with no loot, and they re-form after five active seconds. They use solid-ground movement, arrival/attack telegraphs, 12 damage and shared 750ms invulnerability. The farmer can outrun them; the interior and daytime are safe. NPCs reach actual home doors by 19:00. Sleep/night lighting retain established 20:00 rules.

Repair at the same cave entrance through staged saved contributions: 600c / 48 Wood / 32 Stone / 20 Meat. The warning explains Meat is an offering. A tap gives available stock only up to the outstanding requirement. Completing all four permanently restores the seal and records Curse Breaker, visible in Pause > Cursed cave and the cave itself. This adds a finite optional challenge with a meaningful consequence and achievable recovery, without changing the five main Journal chapters or adding weapons/XP/backend systems.

---

# v0.18.0 — focused judge progression

Five existing Journal chapters now reveal starter farming and City/resident first, modest wood/stone/board/foraging/eating errands during growth, then harvest/sale/Commons, Forest combat/Keepsake, and the return home. Landmark directions replace coordinate instructions. The destination marker only appears after the first three chapters are complete; the exact cache stays hidden earlier. Existing progress can complete steps out of order without losing earned flags. A few resident lines respond to sale, Commons and Keepsake progress; no relationship system is added.

The 06:00–24:00 active period lasts 450 seconds. Real bed rests let the guided first farming loop finish sooner than three full awake days; midnight still settles care once. Three watered midnights remain required for Tomato. No elapsed-time energy drain is introduced. Farming uses 1 EP per basic plant/water/harvest/dig action. All twelve crops trade cost, days, revenue, yield and food value; see BALANCE_REPORT.md and balance/v0.18.0.json. Daily market range is 75–130%, deterministic by existing seed/day/salts. Requests remain optional materials, and no crop/house/expanded farm blocks the ending.

Exactly one new upgrade: Copper Watering Can, 180c + 6 Wood + 4 Stone after Commons (12 Wood + 6 Stone, reward 240c and two Grape seeds). Select the existing Water tool; a stopped facing ray previews up to three fixed/custom beds on the current farm. Only thirsty living unripe crops change; successful use costs at most 2 EP once (1 EP for a single thirsty edge crop), failures are atomic. Missing beds/obstacles stop the ray. New beds beyond 16 and all new farms/fields require ownership; old farms remain.

Forest fruit has reduced EP and modest HP; all crops are edible through the existing Bag. The Bag previews actual capped HP/EP before consuming; every meal has a 12-second active-world cooldown. Boars warn for 850ms, lock their charge heading, retain warnings/charges through impacts, and cannot have their recovery endlessly extended. The first landed impact can stagger wandering for 150ms. Axe, 15-damage boars, 25% coin Stash loss/replacement, protected Keepsake and local saves remain. Human combat/balance review is still needed.

Original textured introduction illustrations and restrained soil/seed/splash/plant bounce/produce/coin/tree-fall feedback improve action contact. Only successful real hits get 45/55ms world hit-stop. Quiet, rate-limited UI/door/transition cues and short Journal/project/ending stingers reuse approved audio. Indoors retain zero ambience and gameplay has no continuous music. Ending letter, statistics and Continue remain available without buying houses or exploring every region.

---

# v0.17.2 — crafting and buying in Customize

Use the house icon beside Menu. Craft bench (8 Wood + 2 Stone), planter (4 + 2), fence (3 Wood), path (2 Stone), picnic table (12 + 4), barrel (5 Wood) or lantern (6 + 4) from gathered materials at Home/Farm/inside. These recipes no longer cost coins. Other garden/furniture objects and eight houses retain their coin prices. Farm board focuses on farming. Crafting a fence/path indoors is allowed; place it outdoors. Inventory, Add, Remove/Readjust and owned-house switches keep their prior rules.

Upgraded houses use the starter cottage’s exact architectural structure/positions while keeping distinct palettes/materials/interiors. Essential doors, paths, bed, cooking and Keepsake positions stay usable.

---

# v0.17.1 — free visible placement and deliberate editing

Purchased/crafted pieces can be previewed anywhere on the visible screen, including clear paths, without walking closer. Add commits only clear geometry; overlap, crops, water, structures, farmer feet and essential approaches remain protected. Click/touch existing decor (or nearby Use) opens Remove / Readjust / Cancel. Remove returns one item to Bag, Readjust costs nothing and commits only on Add, and Cancel/reload retains the original location. This user follow-up supersedes the former nearby-only and direct-pack interaction.

---

# v0.17.0 — earn coins for your Home and Farm

Eight Home upgrades cost 2,000–90,000 coins: Rose cottage, Orchard lodge, Seabreeze villa, Bamboo retreat, Lantern townhouse, Garden conservatory, Moonwood chalet and Suncrest manor. Each includes a different exterior finish/architectural details, room theme, floor/rug/curtain/bed treatments and decorative furnishings. Original cottage remains free and owned; paid designs remain owned and can be switched without another charge. No house changes door/bed/stove/Keepsake gameplay or grants economy/combat advantages.

Menu → Customize supplies a coin catalogue for all sixteen scenery/furniture types, priced 70–1,600 coins. Nine new types add cosmetic oak/palm/blossom trees, hedge, flower patch, birdbath, rug, bookcase and vase. Existing seven material recipes remain. Outdoor scenery goes on Home or the selected Farm; furniture also goes indoors. Use established preview/turn/confirm/cancel/pack controls, including phone touch controls. Pieces remain reusable; no selling/refund/material/harvest loop is added. Paid trees cannot produce Wood/fruit. Decoration footprints keep roads/crops/water/structures and key indoor interactions clear. Ninety-six total placed pieces is the existing save cap.

Public/local playtest grants each save 100,000 extra coins once; ordinary builds/newState still start at 60. Existing earnings and achievements are not reset. Coin balances never complete Journal chapters on their own.

---

# v0.16.6 — quieter ambience and morning wakeup

Remove dedicated wind everywhere, including snowy/desert wind. Keep Forest birds/night insects and nearby water/fire/fountain; Home/Farm daytime is quiet. Confirming bed sleep plays its soft effect followed by a rooster/hen call if waking at 06:00, or a short rustle when waking at 20:00. Cancelling remains silent. No wake music/jingle. Existing sleep times, energy restoration, daily rollover/care, story and save behavior remain.

---

# v0.16.5 — natural audio during play

Gameplay uses nature ambience with no music or musical ending cue. Title music remains on Title only. Successful food/stone/seeds/treasure/Stash/Keepsake/recovered-object pickups give short feedback, alongside retained Wood/grass, actual tree/animal hits, crop farming and trades. Empty/failed actions, falling trees, UI/Bag/tool selection, Jump, doors and location travel stay silent. Current audio behavior supersedes earlier descriptions below; gameplay and local progress are unchanged.

---

# v0.16.1 — audio and empty-hand controls

The user requests suitable sounds from five supplied archives after licence review, audible Forest atmosphere, button-based mobile actions with friendly icons/captions, and automatic hidden Hand. Use the star/Use action for the nearby prompt; its Hit caption describes Axe work/hunting/empty swings. The arrow/Jump action retains free outdoor jumping. Ground touches act only during placement previews on mobile; desktop clicks/E/K/Space remain. Put away selected equipment to gather grass/stone or reclaim furniture without an inventory Hand item. Preserve existing saved equipment/progress and give primary nearby fruit/cache/recovery actions priority over incidental grass.

Supplied game-permitted loops/effects replace background arrangements and gameplay tones; the original completion cue stays. Forest birds/leaves, changing crickets, nearby streams and snowy wind contrast with meadow, fountain and fireplace ambience. No weather, ocean, new combat/economy system or remote runtime asset is introduced.

---

# v0.16.0 — finite story over the existing sandbox

Grandfather's last request connects existing farming, sale/conversation, fixed Commons seating, Forest fruit/three-hit Axe boar and guarded cache to a Home ending. No new crop, map, animal, weapon, furniture, project, weather or unrelated system. Journal has five chapter pages/checkmarks, active objective/hint and optional intro replay. Success notifications are brief; no permanent quest panel. The Keepsake is a durable key item and never part of selling/eating/dropping/coin recovery. Place it by the Home pottery shelf only when all pre-ending steps are complete. One-time cue, letter, frozen statistics and continued play follow.

Fresh progression is three Tomato seeds/60 coins, three watered midnights, 24 Wood/12 Stone for the smallest fixed Town project, fruit/eating and a normal nearby boar guard. Ordinary bed sleep remains available; no balance change to established farming. The benchmark report explicitly distinguishes wall-clock and active time and records its natural awake-calendar method; completion duration varies with sleep and exploration.

---

# v0.15.0 — furniture placement and recovery

Craft seven movable Farm pieces: existing bench, flower planter, fence and stone path, plus picnic table (12 Wood/4 Stone), barrel (5 Wood) and lantern post (6 Wood/4 Stone). New pieces are decorative; they do not add storage, food or upgrades. The illustrated workshop has a More page. Build consumes the shown materials once; position/turn/cancel is free. Confirm consumes one built item only on valid nearby dry Farm ground, protecting roads, beds, structures and the farmer. Maximum 96 placed pieces across owned farms remains.

A ghost shows the exact footprint and four-facing arrow. Tap/drag repositions; small buttons/arrows nudge by eight pixels; R/Turn changes facing; E/Place confirms; Escape/Cancel keeps the item. Cancel to walk. Hand packs the complete placed item into Gear for reuse, with no material loss or duplicate item. Placement automatically selects Hand afterward. Each farm and confirmed orientation survive reload. Current farming, wood/stone economy, cooking, NPC/projects and Forest survival remain.

---

# v0.14.0 — chopping feedback and clear resource choices

Each authored tree requires three valid Axe hits. Hits one and two show saved progress without Wood/removal; hit three gives 3 Wood and clears the tree. Each hit costs 1 energy, empty/invalid work costs none, and elapsed time never drains energy. Damage persists across areas/farms/days/reloads. Earlier fully cut trees remain cut. Desktop uses tree clicks/E; mobile uses Attack and its circular movement control.

The existing resource loop now presents finished-object previews and ingredient/reward pictures: craft and place Farm furniture, deliver daily City material requests, complete communal garden projects, and cook/eat Grilled Meat at Home. This is presentation/accessibility polish of authorized systems, not additional recipes or progression. Hand still packs furniture for moving. Other farming, species, coins, care, three-farm cap, recovery and save rules remain.

---

# v0.13.0 — care over several days and uses for materials

Water once per calendar day. New crops need 3–6 watered days, earning one stage at midnight after each cared-for day; repeated same-day watering never accelerates growth or spends more energy. Three days: Tomato, Carrot, Chili, Cucumber, Sweet Potato. Four: Strawberry, Corn, Eggplant, Blueberry. Five: Watermelon, Grape. Six: Pumpkin. Existing yield/prices remain. Missing one/two days pauses growth; the third missed day offers Recovering and rescue; the fourth kills the crop. Already-ripe old crops remain harvestable on migration.

Town board (Garden noticeboard) offers three deterministic requests per day from six residents. Deliver 8–16 Wood/Stone or mixed bundles for 80–150 coins and 2–3 seeds. Only active requests complete, once each day. Requesting residents also expose a Daily request conversation choice. The three one-time communal projects cost Wood/Stone, add benches/flower planters visibly in existing gardens, and grant 180–250 coins plus two seeds. Roads and NPC routes remain open.

Farm board / Build decorations or Bag / Gear / Wood or Stone / Uses opens four recipes: bench 8 Wood+2 Stone; flower planter 4 Wood+2 Stone; fence 3 Wood; stone paving 2 Stone. Build -> Place -> tap clear Farm grass nearby (E places in front). Bag / Gear also selects a built decoration. Buildings, roads, water, beds and existing furniture are protected. Hand packs up furniture/paving for free moving, retaining the item in the bag. Up to 96 placed pieces across owned farms. Construction and placement consume no elapsed energy; ordinary farming costs remain 1 EP.

Home hearth / E or tap opens cooking. Build a stove for 20 Wood+16 Stone once. Each Grilled Meat uses 1 Meat+1 Wood. Eat through Bag / Food: +50 HP, +35 EP capped at 100 independently, consume only when something can restore. Cooked food can also sell through the existing City market. This creates a loop from forest materials -> useful rewards/furniture -> food for longer exploration without adding unrelated systems.

---

# v0.12.0 — daily crop care, three farms and Axe-only combat

Water a growing plant once at any hour of each calendar day. One watering earns its growth at midnight, and repeated watering of the same plant that day consumes neither energy nor additional care. Empty ground can still be wetted for 1 EP; cosmetic moisture remains separate and dries after three active minutes or sleep. One or two fully missed days leave a dry, living plant with paused growth. Three missed days show Recovering and a water-to-recover warning. Water resets the missed-day streak immediately and permits growth at the next midnight. Four consecutive missed days kill the crop; clear it with Harvest. Ripe crops retain the established harvest-waiting exemption.

Farm Board → Buy / visit farms sells Farm 2 for 600 coins, Farm 3 for 1,200, with no field-unlock prerequisite. Three total farms is the new purchase limit. Each begins with its original first field; free shovel beds and old bought fields remain. Previously bought farms beyond the cap survive migration and cannot expand further. Crop care settles across every owned farm and custom bed.

Wooden Club purchase, equipment, bag slot, combat and City stall are removed. Rowan remains a daily commuting resident, offering the free Axe tip. Existing club ownership migrates to a one-time 45-coin refund (purse cap retained). Axe hunting, tree cutting, food, stone, sleep and 25% Stash recovery retain their rules. This explicit request supersedes historical two-window/club/100-farm policies below.

---

# v0.11.0 — Home and mobile movement update

All cottages share the user's front-facing roof/gable/double-door structure with different finishes. Home is a cozy furnished room with tiled floor, dining area, pottery/fireplace and working bed/exit. Eight-way movement retains equal diagonal speed and stable native facing. On mobile use the circular analog joystick, Jump and Attack; separate touches can move and act. Jump is free in every outdoor location, using existing collision/path/cooldown checks; interior jumping/attacking is disabled. Desktop retains WASD/arrows, outdoor Space/J/Shift jump and direct world tool/axe taps. K/M remain Forest-only. No new crafting, relationships, house upgrades or economy rules.

---

# v0.8.0 — gathering, hunting and eating

Select Axe to cut trees or hunt Forest animals; K attacks in facing direction, E uses nearby context and direct animal taps face/attack the selected target. Meat drops directly into the bag once on defeat. Hand can gather loose stones or grass; nearby stones take priority. Every region has six daily stone piles. Meat can be eaten or sold at the existing City Market; Stone and Wood are stored in Gear.

Bag → Food → Eat restores health and energy separately, including healing while energy is full. The menu pauses simulation so choosing a meal is safe. Existing fruit energy values remain; Meat provides 25 health / 20 energy. Full stats do not consume food. Defeat still invokes the established Home/25%-coin Stash Bag recovery.

Future ideas only: wood fences, stone paths and a campfire that uses wood/stone to cook higher-value meat meals. No crafting added in this pass.

---

# v0.6.2 — garden utility loop and faster harvests

User-authorized Shovel/Axe/Hand/Grass are free and selectable in Gear or keys 4/5/6/7. Shovel remains free Farm-bed creation (2 energy); it now shows in hand and clears cover. Axe is a utility, not a combat weapon: approach an authored tree and E/USE/click to remove it permanently for 2 energy and +3 wood. Roots/crowns and tree fruit disappear. Wood is collected inventory only; no crafting, sale or progression is introduced. The existing Wooden Club remains separate.

Hand gathers a grass clump for 1 energy and +1 grass. Grass places one collected clump on dry clear ground for 1 energy; no placement on water/bridge/path/solid/crop bed or another nearby clump. Planted clumps can be gathered again and bend on contact. Digging destroys overlapping grass unless gathered first. Removed vegetation persists across days/reloads, independently per owned farm. Axe cannot cut bamboo/palmetto scenery. Rewards and energy changes are atomic; repeated/unsafe/full-bag actions do not duplicate resources.

Tomato, Chili, Cucumber and Sweet Potato mature after one fully cared-for night; Strawberry, Carrot, Corn, Eggplant, Watermelon, Pumpkin, Grape and Blueberry after two. Care at AM 06–12 and PM 16–22 remains necessary; missed-care wilt/death rules remain. Prices/yields stay unchanged. Old earned growth reaches the new ripe cap on load. Cream packets and larger fruit pictures make planting identity readable without extra UI copy. Existing farming/watering energy and passive fatigue costs remain.

---

# v0.6.1 — comfortable work energy

Current farming costs: plant 2, dig 2, water 1, harvest 2. Passive awake energy drain is one per 60 game minutes; walking remains free. Watering the same ground again still costs 1 energy and cannot add extra care/growth. A full 16-cell starter bed takes 32 energy to plant and 16 to water, leaving 52 from a full bar. Combat remains 5 energy per club swing; food/sleep restoration and all watering windows are unchanged. Water tool stays visible in hand and pours from the spout. Soil retains safe grid planting while presenting organic edges and varied red earth. Balance awaits human play review.

---

# v0.6.0 — free beds, watering and twelve crops

The current user request supersedes paid land expansion: clear Farm ground becomes a planting bed when dug with the free Shovel. Starter cells remain; old purchased fields/farms and plants remain available. Soil connects naturally across adjoining tiles, with turf only on exposed edges. Shovel costs 4 energy; planting/watering/harvesting retain 5/3/4 energy. Roads, river/bridge footprints and structures remain protected. Farm board provides a short shovel guide, legacy farm travel and retained Tomato convenience trade.

Water can be poured on outdoor land, whether planted or empty. A can tilt and falling droplets accompany dark wet soil, which dries after three active minutes or sleep. Crop care still requires one morning and one evening watering per day; repeat pours and cosmetic wetness do not grant growth. A cream blue-drop bubble marks a plant needing water, a red ! marks missed care/death, and a basket marks harvest readiness. Plant selection remains Seed/Water/Harvest; Shovel adds ground creation.

City shop/bag pages offer Tomato, Strawberry, Carrot, Corn, Chili, Eggplant, Cucumber, Watermelon, Pumpkin, Grape, Blueberry and Sweet Potato. Values live in src/data/crops.js. Watermelon/Grape/Blueberry restore 35/20/16 energy through Food. The original crop/forest market multipliers and sale salts remain. No crafting, new weapon, weather, relationship or unrelated system. New crop balance awaits human play review.

---

# v0.5.0 interface and controls
Current theme: cream/olive leafy pixel panels, wooden parchment map and bottom icon hotbar. Space jumps in Forest; K attacks; B opens the four-tab bag; M opens the Forest-only map. Touch retains directional pad, tool slots, USE and club icon, with nearby ground double taps for Forest jumping. Upper action controls and the separate Jump button are removed. No map in Home, Farm, City or the interior. Map includes facing, discovered terrain/rivers and optional broad clues; no exact treasure coordinates. Bag grids show seed/produce/food/gear counts and reuse existing selection/eating/equipment rules. All gameplay values, world content, save key/schema and progression remain. Historical controls below are superseded by this entry.

---

# v0.4.9 user-authorized forest extension
Twice the v0.4.8 area is implemented by extending east: 10240×5120, forty connected 1280×1024 regions. Original bounds/IDs and Homewood entrance remain. Reduce western tree density about 16.7%; retain responsive grass and cleared passages. Four long rivers, one tributary, one short pool channel, three additional ponds and twenty-two bridges use traversable shared water surfaces. Daily fruit increases from 63 to 163 collection points, retaining nine types and prices/energy values. Animals increase from 24 to 78 using only approved Craftpix Boar/Deer/Hare/Fox/Grouse: thirty saved boars and forty-eight transient quiet animals. New regions have quiet pairs and seven small boar pairs; unchanged 3-hit/15-damage charge/club/drop/day rules. Keep fourteen finite guarded caches/rewards. Stable save IDs preserve collected fruit, old boar health/discovery/cache/farm/City/time/sleep and recovery progress; new areas start unexplored.

---

# v0.4.8 animal roster and forest style
Latest user request supersedes the 22-species roster. Only Craftpix Boar, Deer, Hare, Fox and Grouse remain. Sixteen saved boars use the unchanged 3-hit/15-damage survival rules: the original Homewood pair and one sparse guard per existing cache. Eight quiet animals retain transient wandering/flee behaviour, no combat or rewards. All 20 region IDs, 63 forage IDs and 14 cache IDs/rewards survive; displayed animal-specific place names become Deepwood Thicket, Oldgrowth Grove, Sunlit Meadows, High Canopy and Stone Hollow. Danger is 1/5 where boars live, 0/5 in quiet regions. Dense forest clearings are reserved around fruit, guards, landmarks and connected passages rather than removed animal arenas. Farm/City/day/sleep/club and 25%-coin recovery remain. Older entries below are historical.

---

# v0.4.7 animal visual upgrade
Fifteen existing species receive external asset-based art, with recognisable coats and actual source animation capabilities. Existing Craftpix Boar remains; six combat species still use original art. This is presentation only: unchanged animal species/counts, territories, health/damage/awareness, attack warning/charge/recovery, club energy/cooldown, Hide reward and daily revival/saved defeat. See assets/licenses/wildlife-sprites/SOURCE_RECORD.md.

---

# v0.4.6 Forest cleanup
Latest user removes all artificial raised earth banks and teal fern scenery, replacing no objects. Natural textured shores, water walking and free jumping remain. Horizontal timber bridges meet both banks and render cleanly at night. Forest foliage shares a muted olive palette and small scattered wave clusters. Wilderness scale, species/forage/cache rules, farming/City/sleep, schema 9 and coin recovery remain.

---

# v0.4.5 forest scenery adjustment
Latest user instruction removes Forest dirt roads, waterfalls and old stone/stair terrace assemblies. Traversable grassy passages retain connected exploration. Low river-adjacent earth banks have walkable slope openings and use the existing free jump across their fronts. Habitat tree mixtures add palms, willows and broadleaf variants; grass avoids bridge decks and trunks avoid water. Ripples scatter and animate independently. All wilderness scale, species/forage/cache rules and farming/City/sleep/save/recovery contracts remain unchanged.

---

# Forest growth and jumping — v0.4.2
The latest request authorizes thick vegetation, responsive grass, raised ground and jumping. Forest remains exactly 5120² / 20-fold area and retains all habitats/species/fruit/treasure. It now contains 787 trees and 33 bamboo stands, 3,880 grass clumps and 20 low terraces with stair gaps. J/Shift or canvas JUMP makes a 600ms directional leap of up to 128 units, with an 850ms cooldown. It crosses low ledges, not trunks/rocks/structures/bounds; blocked destinations shorten the leap. Walking and jump cost no energy, and animal attacks still hurt during flight. Hits cancel the leap safely. Interacting and attacking resume at landing. Paused menus freeze the arc; saves/reloads during flight use grounded take-off coordinates.

Grass bends on grounded foot contact, including stationary overlap, and springs upright after leaving; airborne players pass above it. Dense trees preserve clear trails/species territories/forage/cache approaches. Textured raised ground has steps and low rims; no new falling damage, swimming cost, weapons, weather or crafting. Supplied character/environment pixel replacements remain blocked by their current licences; existing original farmers gain jump poses and licensed existing cliffs are reused.

---

# Wilderness expansion — 2026-10-07

The user's follow-up explicitly authorizes a 20-fold forest area, many grouped animal species with different difficulty, more fruit and rare dangerous treasure. This supersedes the prior compact forest/one species restriction. Camera scale and all farming/City/sleep/Stash Bag rules remain.

World dimensions are **5120×5120**, exactly 20 × 1280 × 1024. Twenty connected 1280×1024 regions form a stylized wilderness: snowy lake, highlands, basalt caves, lion savanna; bamboo, leopard glade, tiger jungle, cheetah plain; guava/chimp valley, rhino basin, elephant grove, giraffe and separate zebra clearings; jaguar falls, wolf pines, hyena ruins, kangaroo brush; original Homewood, crocodile river with separate hippo bank, monkey canopy and snake chamber. Each has a distinct palette, irregular vegetation, trail bends, grove and landmark. River sections have five timber crossings; waterfalls animate with crisp pixel strips. Cave mouths have open centers and solid side pillars, and stone floors extend into walkable chambers. No new interior scene or backend.

The original forest is retained in the southwest with +4096 Y translation, preserving its collected node IDs and safe geometry. Home arrives at (640,4848); Forest's south return remains the whole 96-unit path at y5088. MAP/M pauses and shows discovered regions, current position, regional danger, species hit/damage values and broad clues. Discovery persists; exact cache positions are not marked. Home signs direct west/south toward Homewood. Night darkness covers the camera wherever it travels, including the far north.

There are **68 saved individuals / 22 species**, in groups of 2–4 with separate territories. Species values are game balance, not biological rankings. Low tiers: Monkey 2 hits/8 damage, Snake 2/12, Boar 3/15, Kangaroo 4/14, Zebra 4/12, Giraffe 5/16, Panda 5/14, Chimpanzee 4/14. Mid: Wolf 4/18, Hyena 4/17. High: Rhino 7/24, Elephant 9/26, Gorilla 7/24, Hippo 7/25, Crocodile 6/24, Komodo 6/22, Cheetah 4/20, Leopard 5/22. Most dangerous: Jaguar 6/26, Tiger 7/27, Lion 7/26, Polar Bear 9/28. Speed 210–400, awareness 110–245; heavy defensive animals have longer 950–1200ms warnings and shorter personal awareness. Every charge locks a direction, stays inside habitat/solids, pauses afterward and gives shared 750ms player invulnerability. One directional swing targets the nearest reachable animal in front, costs 5 energy and has 450ms cooldown. Species-sized foot masks are 16–28 units. No random drops: one hide per animal driven away. Dead animals respawn on a later day; partial health and position persist. Distant animals outside 960 units sleep their transient simulation; no offline advancement.

Nine forest fruits now include Banana (+18 /10 base), Orange (+22 /14), Papaya (+32 /22), Coconut (+35 /24), Dragon Fruit (+42 /36), Pineapple (+38 /28) alongside the original Berry/Guava/Mango. There are 63 once-daily nodes. FOOD has three icon tabs per page plus previous/next; keyboard arrows cycle all nine. Market pages cover all items. Original crop/fruit/hide hash indices are preserved so migration cannot change today's price.

Fourteen finite caches lie off the safe main roads in tier-3+ regions; the snake cache sits inside the walkable stone chamber. Chests become visible only within 200 units. USE within 64 requires line of sight and no live animal within 240 of the chest. Fixed coin rewards pay once per save and flags persist across midnight, sleep, travel and reload. No repeat treasure farming, keys, puzzles, crafting, additional equipment or quest system is added. Existing 25%-coin death loss and recoverable single Stash Bag apply to treasure earnings too.

---

# Milestone 3 — Forest, Foraging & Survival V1 (2026-10-07)

The current playable scope extends Milestone 2 with one complete forest survival loop. The older design-only and closure notes below are historical and superseded for the features explicitly described here. Farming, all four crops, city trading, paid farms, boy/girl controls, midnight growth and manual sleep remain.

Home's north road at x=672–768 leads to the forest across its full width. A wooden FOREST/up-arrow sign marks the road. Forest's south path returns Home. Both use 140ms fades, safe inward spawns and a shared 700ms cooldown. The 1280×1024 forest has a safe berry clearing, winding route, guava grove, still-water shrine pond, fallen logs and deeper boar clearing. Trees/rocks/water/log/stone footprints share rendering, player collision, enemy movement and save repair; canopies sort by feet and soften near the farmer.

| Item | Energy per fruit | Base sale | Location |
| --- | ---: | ---: | --- |
| Wild Berry | 12 | 6 | Three common entrance/path bushes |
| Guava | 20 | 12 | Two fruit trees beside the middle route |
| Mango | 30 | 20 | One tree in the deeper clearing |
| Wild Hide | — | 18 | One guaranteed boar defeat reward; sell at City Market |

Six authored nodes yield one item each per game day. Collect with E/USE, within 64 units and with a clear line past solids. The bag caps at 9999 per item. Collected node IDs and their day persist; leaving/reloading cannot reroll them. Every crossed midnight restores forage availability, including sleep and defeat. Food remains separate from field crops: no fruit seeds or orchard cultivation. Produce Market has crops/fruit pages and buys all fruit/hide with the existing 85–120% deterministic daily pricing; original crop price salts stay unchanged.

BAG → FOOD shows icon/name/count, energy and today's sale value. EAT 1 consumes exactly one item and caps energy at 100; full energy consumes nothing and explains why. Left/right and Enter, mouse and touch work. BAG → FOOD → GEAR shows permanent club ownership/equipped state and hide count/sale destination. Seeds retain their existing BAG selector. Panels pause movement, fatigue, clock and combat.

The compact City Outfitter is beside the southwest path, with one original farmer-derived keeper. It follows 07:00–20:00 hours, hiding the keeper when closed. Wooden Club costs 45 coins once and auto-equips permanently; EQUIP is available in Gear. No switching tiers/upgrades are added. Space/K and the separate visible ATTACK canvas button swing in the current facing direction; E and USE remain normal interactions. Each accepted swing costs 5 energy with a 450ms cooldown; insufficient energy says Too tired. The club has a directional rectangle hitbox, solid-object line check, stepped swing, impact pixels, flash and subtle shake.

One Wild Boar lives in the deeper clearing. It wanders in a bounded territory, sees the player within 190 units with clear sight, warns for 650ms, locks its charge direction, charges for up to 650ms and rests for 1000ms after a charge. Charges stop at solids/territory edges and cannot tunnel; escape returns it to wandering. Three club hits make it flee without gore and add one Wild Hide. Partial health/position and defeated day persist. It respawns on a later day, never on reentry/reload that day. Each build/reentry grants an 800ms awareness grace; paused menus freeze its timers. At 20:00–06:00 movement is 15% faster and awareness grows to 228, retaining the warning.

Boar contact during a charge deals 15 health with 750ms player invulnerability and collision-safe knockback. At zero health input stops, a brief fall/fade plays, and the farmer wakes beside the home bed with 100 health/energy at 06:00 on the next day—even if defeated after midnight. The shared time skip evaluates watering and crop growth at each crossed midnight once. Inventory, equipment, crops and farm ownership stay intact.

Defeat drops exactly **floor(current coins × .25)** into one forest Stash Bag, retaining the other coins. There is no minimum loss. Zero loss creates no empty bag. A second defeat replaces the old bag permanently, including replacement by no bag when no coins drop. The safe forest position/value saves atomically with respawn progress before the fade; refresh during the animation cannot apply loss twice. E/USE within 64 units recovers the stored integer coins once. The bag survives travel, sleep, day rollover and refresh; invalid saved coordinates repair to safe ground. First-defeat guidance explains replacement.

Three short first-visit canvas messages pause simulation; completing all three sets the saved tutorial flag. Night shows one saved warning about animal activity. The forest keeps the global cool night overlay, with 16-unit pixel bands at stepped lower opacity within roughly 208 units of the player; distant areas remain dark. The implementation uses Graphics rectangles for both Canvas and WebGL, with no shader/blur.

Schema **8** retains `simple-life.save.v1` and migrates schemas 1–7 independently without clearing valid progress. See SAVE_SCHEMA.md. Original source-authored pixel additions and LimeZu tree adaptations are recorded in ASSET_LICENSES.md. Audio remains silent because no suitable licensed effect assets exist in the project. This milestone stops before Milestone 4.

---

# Simple Life — playable foundation and approved future direction

## Implemented now: foundation

Home exterior, a compact furnished interior and Farm are playable. City and Economy V1 are now playable as explicitly authorized in the Milestone 2 brief. The player chooses boy or girl, begins with 60 coins and claims three tomato seeds once from the crate beside Home. Keyboard/touch controls, health/energy, day/night, sleeping, pause, saving and Credits remain.

The south Home road leads through an open fence to the map edge. Only crossing the edge travels to Farm; decorative route signs have been removed. Farm’s north edge returns Home. Short fades and inward spawns prevent immediate return loops. The small green-roof shed/greenhouse is closed: solid supports/foundation collide at ground level; its roof overhang is not a full-sprite collider. Feet bodies and depth sorting remain independent.

The primary field is one **192×192 world-unit bed**, sixteen contiguous **48×48 cells**, at (352,224). Subtle seams and a targeting outline identify individual cells. Surrounding paths, flowers, fence, scarecrow and utility props stay outside its tiles. Save indices are retained. Former resting areas are **overgrown expansion land**, with weeds/stones and a nearby compact sign. There is no soil fatigue. Three independently purchased fields now unlock the same 4×4 design; ownership is saved per farm. The old `expansionUnlocked` flag remains only for compatibility.

Tomatoes have original seed mound, sprout, young, flowering, ripe-red-fruit, dry, wilted and dead art. Dry soil is lighter than watered soil. The configuration owns identity/category, prices, growth duration/stages, watering requirements, harvest yield, future food energy, regrowth and sprite keys. Tomato, Strawberry, Carrot and Corn are playable. `energyRestored` is future food data, not an implemented eating action.

Plant/water/harvest show short pixel effects and compact feedback above the hotbar. Named farming events and silent sound-request hooks are ready for later reviewed audio. No placeholder sounds are added.

## Milestone 2: City and Economy V1

Home’s existing east road reaches x=2240; a boundary zone at x=2208 leads to City (64,488), facing east. City’s west boundary returns to Home (2176,640), facing west. Both use the retained fade and cooldown; no decorative route-sign sprites remain. City is 1280×896 with a compact stone plaza, fountain, benches, lamps, tree borders, flower planters, noticeboard, two staffed awning stalls and five future-use decorative buildings. Clear roads connect the entrance, adjacent shop row, plaza and return.

Clara sells four seeds at 07:00–20:00; Niko buys only harvested produce at 07:00–20:00. Compact canvas cards use four crop-icon tabs, name/icon, bag count and unit price. Select quantity, then use one Buy/Sell button displaying quantity and exact total; ? reveals optional growth/yield/care, shop hours and price information. Buy 1/5/Max and Sell 1/5/All are atomic integer transactions. Disabled choices explain affordability/stock limits. World/time pause while a panel is open; keyboard arrows/Tab/Enter, mouse, touch and Escape work. Q cycles planting crops; BAG provides a pointer/touch selector. Farming, crop information and eight visual care/growth states use the selected crop’s definition. No regrowth or eating mechanic.

| Crop | Seed | Base sale/item | Cared-for nights | Yield | Base net/plot | Worst-day net/plot | Earned stages | Future food energy |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tomato | 10 | 18 | 3 | 2 | 26 | 20 | 4 | 12 |
| Strawberry | 18 | 28 | 4 | 2 | 38 | 30 | 5 | 8 |
| Carrot | 28 | 70 | 4 | 1 | 42 | 32 | 5 | 22 |
| Corn | 40 | 36 | 5 | 3 | 68 | 53 | 6 | 14 |

Profit assumes a fully cared-for single planting; base yield value minus seed cost. Worst-day sale rounds 85% of base to an integer per item. Tomato gives quickest/cheapest cash flow; Strawberry gives a modest investment and two items; Carrot has higher capital/net per plot; Corn commits the most money and time for the largest plot return. Day-specific prices and different cash/time constraints keep alternatives useful. This is initial balance, not a long-term player study.

Each new save has a random persisted unsigned 32-bit marketSeed. Prices hash that seed, the day and crop index through deterministic integer mixing, then choose an inclusive integer percentage from 85 through 120. Sale price is max(1, round(base × percentage / 100)). Below 95% is Low; above 105% is High; otherwise Normal. Fixed seed prices never reroll. Midnight advances the day and hence the prices, whether crossed awake or during sleep; reload derives the identical prices. Schema 7 migration supplies seed 1 for old saves, adds all new seed/produce keys and first-harvest/city/buy/sell flags, and preserves original tomato indices, all paid farms/fields, money, time and care history. Shop panels are transient and resume safely closed after reload.

First harvest briefly expands “Sell your harvest in the city.” / “Follow the east road from Home.” The saved city visit clears the temporary waypoint. First city entry has one nonblocking merchant greeting. The city noticeboard offers one free Tomato seed per day only if money <10, all seed/produce stock is zero and no living crop remains. Seed aid cannot duplicate within the same day and persists across reload, allowing recovery without money grants or automatic sleeping.

Existing manual bedtime, three starter seeds, bought fields/farms and shared care on unvisited farms remain. No forest, other crops, animals, combat, weather, relationships or festival. Sound events are prepared for entry/open/buy/sell/failure/close; no unreviewed placeholder audio.

## Current watering and growth rules

- Morning window: **06:00 ≤ time < 12:00**. Evening: **16:00 ≤ time < 22:00**. The HUD shows the active or next window.
- Watering marks each window separately and costs energy once. Between windows, watering reports the next schedule without spending energy.
- Each expired window is evaluated once using a saved cursor. One miss wilts the crop and pauses growth. Watering in the next available window recovers it. **Two consecutive missed windows kill it**; a single miss never kills a healthy plant.
- A crop planted after a closed window is not retroactively penalized for it. That first partial day does not count as a fully cared-for growing night.
- Both waterings in one day earn one growth night. **Three cared-for nights yield two tomatoes**. Mature plants remain harvestable; dead crops clear for free.
- All time skips evaluate crossed watering windows. The clock advances through midnight without stopping or moving the player. Midnight settles care and growth exactly once across every farm. Sleep at 06:00–20:00 wakes at 20:00 that day; sleep at 20:00–24:00 wakes at 06:00 next day; sleep at 00:00–06:00 wakes at 06:00 the same day. The bed shows the wake time before confirmation and restores energy. Awake time drains one energy per 30 game minutes, with the remainder saved; zero energy still permits movement.
- Unlimited water and shoreline refill feedback remain. Sprinklers/weather are not implemented. Harvests are sold at the City produce market at deterministic daily prices; seeds have fixed prices at the City seed shop. Farm board retains its original Tomato seed/all-produce convenience trade using the same daily sale price, plus land/farm ownership. The other three seeds are sold in City.

Schema 7 preserves money, inventory, days, reward status and original crop indices from v1–v6 and stores all farm/field ownership and crops. Legacy dry states migrate into missed-window state without applying old closed windows again. Indoor coordinates are normalized to the compact responsive room; any invalid position moves to nearby safe ground. No offline time progression is added.

## Milestone 1.1: crop information and first-time navigation

One compact Phaser UI panel inspects the standing/facing or explicitly targeted planted cell within the existing interaction radius. It hides on empty cells or away from the field. Tomato has **four earned stages** (Seed / sprout, Young plant, Flowering, Ripe); sprout artwork responds to water within stage 1. Four filled segments show stages reached, rather than inventing a fifth growing night.

`cropStatus` projects the authoritative watering evaluator onto a clone and reads growth, care flags, missed-window streak and recovery cursor. Remaining duration is `growthDays - growth` **cared-for nights**, never a live countdown. Both waterings today permit the next stage at midnight (or harvest after the final night). An eligible unfinished day says “Next stage tomorrow if watered”; a skipped/expired morning says “Next stage after a full care day.” Wilted crops replace the duration with “Growth paused - water this crop.” Dead crops say “Dead crop - clear the plot”; mature crops say “Ready to harvest.” Recovery remains visible for the window in which watering repaired the crop. New planting day/minute and recovery-window evidence are saved; old unknown planting times remain unknown and do not invent an ETA.

AM/PM icons each have explicit Watered, Needs water, Due later, Missed, Done or Closed text. Between watering windows the main condition can be Growing; the panel also handles Newly planted, Watered for this window, Fully watered today, Wilted, Recovering, Ready and Dead. Original pixel leaf/clock/sun/moon/drop/warning/basket/arrow art and the existing tomato item icon use the retained bitmap font/palette. Panel placement avoids the selected soil/crop and farmer. On short landscape displays its narrower side placement keeps touch controls/hotbar clear; the selected-tool label sits below the hotbar. Informational toast rendering waits while the crop panel is displayed; farming feedback remains in the compact action prompt.

The decorative FARM boards are removed; only the map edge travels. Claiming starter seeds expands “Take the starter seeds to the farm” / “Follow the south road” for seven seconds, then retains a small leaf objective icon. An eight-direction pixel arrow follows a ray from the farmer to the real transition-zone centre, stays inside the gameplay safe area and hides once the exit enters the camera view. Home interior does not display this exterior guide.

Schema **4** retains the same storage key and accepts versions 1–4. `hasVisitedFarm` starts false, becomes true on Farm entry and persists through home/sleep/reload. Migration also infers a visit from old Farm/City location, planted/dead crops, tomatoes in the bag or sold produce. Claimed seeds alone are not evidence of a visit. Older saves with no remaining evidence cannot reveal an otherwise forgotten visit; those retain the guide until entry. Genuine New Game resets the guide. No new quest system or City feature is introduced.

## Milestone 1.2: paid expansion and local trade
The user explicitly selected implementation now. Fields 2/3/4 cost 120/180/240 coins and each provides sixteen planting cells. Their soil, unified border, fence and surrounding utility composition match field 1. One northern road moves below field 2 to keep all cells clear. Locked land shows its field number and price and opens a purchase dialog on Use; the farm board also lists individual purchases.

The board retains 10-coin Tomato seeds and sale of all Tomatoes; Milestone 2 routes its sale through the same daily City price. Other crop seeds are available in City. It also provides Previous/Next farm navigation. After every field of the newest farm is owned, another farm costs 600 × current farm count and opens with field 1 owned, fields 2–4 locked. Earlier farm crops/ownership remain intact. All farms share day/time/energy/inventory; care expiry and growth settle across all planted plots. A 100-farm validation limit bounds browser save size. Prices are provisional balance, not playtested long-term.

## Interior presentation

The authored envelope is 800×480, approximately 40% smaller in each dimension than the prior 1344×800 room. A responsive desktop layout fits within that envelope at integer zoom **2**, adjusting furniture positions without resampling artwork. At 1280×720 the actual room is 624×304; at 1440×900 it is 704×400; at 1024×768 it is 496×336. These additional reductions keep the whole room visible on those displays. Narrow mobile layouts use a minimum width of 480 and limited bounded following.

Furnishings and floor tiles use whole source-pixel scaling; the indoor farmer uses native sprite scale with zoom 2, retaining the outdoor **64px** displayed frame height. Sleeping/rug/storage, kitchen/cabinet, dining and entrance areas share clear circulation space. The matching wall border fills unusual viewport proportions without green voids or CSS stretching.

## Future premise — design only

“Tired of the noise and stress of the capital city, the player inherits an overgrown patch of land and a rustic wooden house at the edge of the Wild Woods from their grandfather. With a handful of coins and a worn watering can, they begin a new Simple Life, unaware that the surrounding forest holds valuable treasures and dangerous animals.”

Narrative goal: transform a dangerous, overgrown frontier into a thriving and safe homestead. Later progression improves the farm/house, builds town reputation, unlocks land and deeper forest regions, and reveals the grandfather’s connection to the forest. Plan a short, skippable arrival/inheritance introduction with a clear Skip control; do not gate repeat play behind it. No introduction, quest or NPC story is implemented now.

## Future death and Stash Bag — design only

Animal defeat drops **25% of carried money** into one visible Stash Bag at the defeat location. Proposed minimum loss: 5 coins, capped by carried money (`min(carried, max(5, ceil(carried × .25)))`); zero carried money loses zero. Respawn in bed with health restored. Recover the bag by returning and interacting. A second defeat before recovery permanently replaces the previous bag with the new loss. Never remove inventory, crop/farm progress or permanent upgrades. Persist one bag’s location/value. Implement alongside forest/combat, not in this foundation.

## Future food and energy — design only

Common forest fruit restores modest energy, farm produce a moderate amount, and later prepared meals more. Consuming produce sacrifices its selling value; scarce harvests, collection time and preparation inputs prevent free unlimited energy. Display the energy return and item cost before use. Different price/energy ratios create a choice between eating and selling. No eating/cooking action is implemented now.

## Future progression — design only

Early: inexpensive field crops, limited energy, safe-edge foraging and selling in town. Mid: better seeds, expansion-field purchase, tool upgrades, basic weapons/armor and deeper forest trips. Late: sprinklers, valuable regrowing orchard plants, new map zones, farmhouse improvements, town reputation and the forest mystery. Order delivery as City/economy first, then farming upgrades/food and forest/combat with recovery; house/story/reputation follow after those foundations.

## Crop roadmap — four active field crops, six future crops

Values below are design starting points to tune in a later farming milestone. Selling values are per item; durations are game days with proper care. The four field rows below use the final Milestone 2 balance; other rows remain future design only.

| Crop | Category | Seed/sapling price | Base sale | First growth | Harvest | Regrowth | Energy/item | Stage |
| --- | --- | ---: | ---: | ---: | ---: | --- | ---: | --- |
| Tomato | Field | 10 | 18 | 3 | 2 | None | 12 | Early; playable |
| Carrot | Field | 28 | 70 | 4 | 1 | None | 22 | Playable |
| Strawberry | Field | 18 | 28 | 4 | 2 | None | 8 | Playable |
| Corn | Field | 40 | 36 | 5 | 3 | None | 14 | Playable |
| Pumpkin | Field | 60 | 95 | 7 | 1 | None | 24 | Mid |
| Pineapple | Field | 70 | 110 | 8 | 1 | None | 22 | Late field |
| Banana | Orchard | 180 | 20 | 12 | 4 | Every 3 days after maturity | 8 | Mid/late |
| Mango | Orchard | 260 | 36 | 16 | 3 | Every 4 days after maturity | 12 | Late |
| Papaya | Orchard | 220 | 30 | 14 | 3 | Every 4 days after maturity | 12 | Mid/late |
| Coconut | Orchard | 320 | 40 | 18 | 3 | Every 5 days after maturity | 10 | Late |

Orchard plants are expensive saplings with longer establishment and repeated production, never three-day field crops. Later balance must consider land occupied, energy/water costs, first-harvest payback, regrowth lifetime and market floors. No seeds, saplings or playable definitions for the six remaining future crops are registered now.

## Future weather — design only

Clear/rainy days are saved with the day. Rain automatically satisfies both required watering windows for living crops, freeing time to explore. Show rain on the world and HUD, reduce forest visibility moderately, and allow selected animals to become more aggressive. Coordinate rain with the same window evaluator so water credit is not duplicated. No weather implementation now.

## Later economy ideas — deferred

City shops and controlled 85–120% daily prices are implemented above. Fruit Festival/category bonuses remain deferred. Later economy tuning must preserve positive cared-for profit, visible exact sale prices, reload determinism and seed-aid recovery. No special market days or category modifier is implemented.


## Future equipment — design only

Tools: Rusty Watering Can → Copper Watering Can → Improved Sprinkler → Golden Sprinkler. Upgrades reduce repeated actions through coverage, capacity or scheduled watering; preserve an economic cost and clear affected-cell preview. Weapons: Wooden Club → Iron Sword → Hunter’s Spear. Distinct reach/speed/defense tradeoffs should make deeper forest trips safer without removing risk. Weapons, armor, sprinklers and tool purchases are not implemented now.

## Current day/night and future urgency

Progressively warmer afternoon light, orange evening and readable darker nights; later music/ambient changes signal time. Stronger animals may appear at night, creating a choice between exploration and returning home. The authorized 2026-10-07 day/night follow-up is now implemented: gradual daylight/sunset/dawn, dark moonlight, continuous midnight, saved awake fatigue and day/night-dependent manual sleep. Both shopkeepers leave at 20:00. Consider any later late-night consequence during the relevant survival milestone; never instantly kill or teleport the player merely because it is late. No night monsters, new damage system or final audio is added now.
