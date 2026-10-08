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

The south Home road leads past a wooden Farm sign and through an open fence to the map edge. Only crossing the edge travels to Farm; signs never transition. Farm’s north edge returns Home. Short fades and inward spawns prevent immediate return loops. The small green-roof shed/greenhouse is closed: solid supports/foundation collide at ground level; its roof overhang is not a full-sprite collider. Feet bodies and depth sorting remain independent.

The primary field is one **192×192 world-unit bed**, sixteen contiguous **48×48 cells**, at (352,224). Subtle seams and a targeting outline identify individual cells. Surrounding paths, flowers, fence, scarecrow and utility props stay outside its tiles. Save indices are retained. Former resting areas are **overgrown expansion land**, with weeds/stones and a nearby compact sign. There is no soil fatigue. Three independently purchased fields now unlock the same 4×4 design; ownership is saved per farm. The old `expansionUnlocked` flag remains only for compatibility.

Tomatoes have original seed mound, sprout, young, flowering, ripe-red-fruit, dry, wilted and dead art. Dry soil is lighter than watered soil. The configuration owns identity/category, prices, growth duration/stages, watering requirements, harvest yield, future food energy, regrowth and sprite keys. Tomato, Strawberry, Carrot and Corn are playable. `energyRestored` is future food data, not an implemented eating action.

Plant/water/harvest show short pixel effects and compact feedback above the hotbar. Named farming events and silent sound-request hooks are ready for later reviewed audio. No placeholder sounds are added.

## Milestone 2: City and Economy V1

Home’s existing east road reaches x=2240; a boundary zone at x=2208 leads to City (64,488), facing east. CITY arrow signs stand beside the road. City’s west boundary returns to Home (2176,640), facing west. Both use the retained fade and cooldown. City is 1280×896 with a compact stone plaza, fountain, benches, lamps, tree borders, flower planters, noticeboard, two staffed awning stalls and five future-use decorative buildings. Clear roads connect the entrance, adjacent shop row, plaza and return.

Clara sells four seeds at 07:00–20:00; Niko buys only harvested produce at 07:00–20:00. Compact canvas cards use four crop-icon tabs, name/icon, bag count and unit price. Select quantity, then use one Buy/Sell button displaying quantity and exact total; ? reveals optional growth/yield/care, shop hours and price information. Buy 1/5/Max and Sell 1/5/All are atomic integer transactions. Disabled choices explain affordability/stock limits. World/time pause while a panel is open; keyboard arrows/Tab/Enter, mouse, touch and Escape work. Q cycles planting crops; BAG provides a pointer/touch selector. Farming, crop information and eight visual care/growth states use the selected crop’s definition. No regrowth or eating mechanic.

| Crop | Seed | Base sale/item | Cared-for nights | Yield | Base net/plot | Worst-day net/plot | Earned stages | Future food energy |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Tomato | 10 | 18 | 3 | 2 | 26 | 20 | 4 | 12 |
| Strawberry | 18 | 28 | 4 | 2 | 38 | 30 | 5 | 8 |
| Carrot | 28 | 70 | 4 | 1 | 42 | 32 | 5 | 22 |
| Corn | 40 | 36 | 5 | 3 | 68 | 53 | 6 | 14 |

Profit assumes a fully cared-for single planting; base yield value minus seed cost. Worst-day sale rounds 85% of base to an integer per item. Tomato gives quickest/cheapest cash flow; Strawberry gives a modest investment and two items; Carrot has higher capital/net per plot; Corn commits the most money and time for the largest plot return. Day-specific prices and different cash/time constraints keep alternatives useful. This is initial balance, not a long-term player study.

Each new save has a random persisted unsigned 32-bit marketSeed. Prices hash that seed, the day and crop index through deterministic integer mixing, then choose an inclusive integer percentage from 85 through 120. Sale price is max(1, round(base × percentage / 100)). Below 95% is Low; above 105% is High; otherwise Normal. Fixed seed prices never reroll. Midnight advances the day and hence the prices, whether crossed awake or during sleep; reload derives the identical prices. Schema 7 migration supplies seed 1 for old saves, adds all new seed/produce keys and first-harvest/city/buy/sell flags, and preserves original tomato indices, all paid farms/fields, money, time and care history. Shop panels are transient and resume safely closed after reload.

First harvest briefly expands “Sell your harvest in the city.” / “Follow CITY signs east.” The saved city visit clears the temporary waypoint; permanent signs remain. First city entry has one nonblocking merchant greeting. The city noticeboard offers one free Tomato seed per day only if money <10, all seed/produce stock is zero and no living crop remains. Seed aid cannot duplicate within the same day and persists across reload, allowing recovery without money grants or automatic sleeping.

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

A wooden FARM board stands west of the first Home path junction, with an eight-by-sixteen world-unit post collider and centered smaller lettering. The duplicate south-exit board is removed. The remaining board points south and remains a hint; only the map edge travels. Claiming starter seeds expands “Take the starter seeds to the farm” / “Follow the FARM sign south” for seven seconds, then retains a small leaf objective icon. An eight-direction pixel arrow follows a ray from the farmer to the real transition-zone centre, stays inside the gameplay safe area and hides once the exit enters the camera view. Home interior does not display this exterior guide.

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
