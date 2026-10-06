# Simple Life — playable foundation and approved future direction

## Implemented now: foundation

Home exterior, a compact furnished interior and Farm are playable. City remains a separate future milestone. The player chooses boy or girl, begins with 60 coins and claims three tomato seeds once from the crate beside Home. Keyboard/touch controls, health/energy, day/night, sleeping, pause, saving and Credits remain.

The south Home road leads past a wooden Farm sign and through an open fence to the map edge. Only crossing the edge travels to Farm; signs never transition. Farm’s north edge returns Home. Short fades and inward spawns prevent immediate return loops. The small green-roof shed/greenhouse is closed: solid supports/foundation collide at ground level; its roof overhang is not a full-sprite collider. Feet bodies and depth sorting remain independent.

The primary field is one **192×192 world-unit bed**, sixteen contiguous **48×48 cells**, at (352,224). Subtle seams and a targeting outline identify individual cells. Surrounding paths, flowers, fence, scarecrow and utility props stay outside its tiles. Save indices are retained. Former resting areas are **overgrown expansion land**, with weeds/stones and a nearby compact sign. There is no soil fatigue. `expansionUnlocked` defaults false; no unlock transaction or extra playable plots exist yet.

Tomatoes have original seed mound, sprout, young, flowering, ripe-red-fruit, dry, wilted and dead art. Dry soil is lighter than watered soil. The configuration owns identity/category, prices, growth duration/stages, watering requirements, harvest yield, future food energy, regrowth and sprite keys. Only tomato is playable. `energyRestored` is future food data, not an implemented eating action.

Plant/water/harvest show short pixel effects and compact feedback above the hotbar. Named farming events and silent sound-request hooks are ready for later reviewed audio. No placeholder sounds are added.

## Current watering and growth rules

- Morning window: **06:00 ≤ time < 12:00**. Evening: **16:00 ≤ time < 22:00**. The HUD shows the active or next window.
- Watering marks each window separately and costs energy once. Between windows, watering reports the next schedule without spending energy.
- Each expired window is evaluated once using a saved cursor. One miss wilts the crop and pauses growth. Watering in the next available window recovers it. **Two consecutive missed windows kill it**; a single miss never kills a healthy plant.
- A crop planted after a closed window is not retroactively penalized for it. That first partial day does not count as a fully cared-for growing night.
- Both waterings in one day earn one growth night. **Three cared-for nights yield two tomatoes**. Mature plants remain harvestable; dead crops clear for free.
- Rest until evening evaluates the morning window. Sleeping evaluates all remaining windows for that day, grows cared-for crops and starts the next morning with restored energy. The existing midnight return-to-bed remains a foundation behavior; its later replacement is described below.
- Unlimited water and shoreline refill feedback remain. Sprinklers/weather are not implemented. Harvests remain in the bag until City trading is built.

Schema 3 preserves money, inventory, days, reward status and crop indices from v1/v2. Legacy dry states migrate into missed-window state without applying old closed windows again. Indoor coordinates are normalized to the compact responsive room; any invalid position moves to nearby safe ground. No offline time progression is added.

## Milestone 1.1: crop information and first-time navigation

One compact Phaser UI panel inspects the standing/facing or explicitly targeted planted cell within the existing interaction radius. It hides on empty cells or away from the field. Tomato has **four earned stages** (Seed / sprout, Young plant, Flowering, Ripe); sprout artwork responds to water within stage 1. Four filled segments show stages reached, rather than inventing a fifth growing night.

`cropStatus` projects the authoritative watering evaluator onto a clone and reads growth, care flags, missed-window streak and recovery cursor. Remaining duration is `growthDays - growth` **cared-for nights**, never a live countdown. Both waterings today permit the next stage after sleeping (or harvest after the final night). An eligible unfinished day says “Next stage tomorrow if watered”; a skipped/expired morning says “Next stage after a full care day.” Wilted crops replace the duration with “Growth paused - water this crop.” Dead crops say “Dead crop - clear the plot”; mature crops say “Ready to harvest.” Recovery remains visible for the window in which watering repaired the crop. New planting day/minute and recovery-window evidence are saved; old unknown planting times remain unknown and do not invent an ETA.

AM/PM icons each have explicit Watered, Needs water, Due later, Missed, Done or Closed text. Between watering windows the main condition can be Growing; the panel also handles Newly planted, Watered for this window, Fully watered today, Wilted, Recovering, Ready and Dead. Original pixel leaf/clock/sun/moon/drop/warning/basket/arrow art and the existing tomato item icon use the retained bitmap font/palette. Panel placement avoids the selected soil/crop and farmer. On short landscape displays its narrower side placement keeps touch controls/hotbar clear; the selected-tool label sits below the hotbar. Informational toast rendering waits while the crop panel is displayed; farming feedback remains in the compact action prompt.

Wooden FARM boards stand west of the first Home path junction and near the south exit, with eight-by-sixteen world-unit post colliders. Both point south and remain hints; only the map edge travels. Claiming starter seeds expands “Take the starter seeds to the farm” / “Follow the FARM signs south” for seven seconds, then retains a small leaf objective icon. An eight-direction pixel arrow follows a ray from the farmer to the real transition-zone centre, stays inside the gameplay safe area and hides once the exit enters the camera view. Home interior does not display this exterior guide.

Schema **4** retains the same storage key and accepts versions 1–4. `hasVisitedFarm` starts false, becomes true on Farm entry and persists through home/sleep/reload. Migration also infers a visit from old Farm/City location, planted/dead crops, tomatoes in the bag or sold produce. Claimed seeds alone are not evidence of a visit. Older saves with no remaining evidence cannot reveal an otherwise forgotten visit; those retain the guide until entry. Genuine New Game resets the guide. No new quest system or City feature is introduced.

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

## Ten-crop plan — provisional balance, not implemented

Values below are design starting points to tune in a later farming milestone. Selling values are per item; durations are game days with proper care. Only the tomato row is current gameplay.

| Crop | Category | Seed/sapling price | Base sale | First growth | Harvest | Regrowth | Energy/item | Stage |
| --- | --- | ---: | ---: | ---: | ---: | --- | ---: | --- |
| Tomato | Field | 10 | 18 | 3 | 2 | None | 12 | Early; playable |
| Carrot | Field | 8 | 14 | 2 | 1 | None | 10 | Early |
| Strawberry | Field | 30 | 16 | 5 | 3 | Every 3 days, 3 further harvests | 8 | Mid |
| Corn | Field | 35 | 22 | 5 | 2 | Every 3 days, 3 further harvests | 14 | Mid |
| Pumpkin | Field | 60 | 95 | 7 | 1 | None | 24 | Mid |
| Pineapple | Field | 70 | 110 | 8 | 1 | None | 22 | Late field |
| Banana | Orchard | 180 | 20 | 12 | 4 | Every 3 days after maturity | 8 | Mid/late |
| Mango | Orchard | 260 | 36 | 16 | 3 | Every 4 days after maturity | 12 | Late |
| Papaya | Orchard | 220 | 30 | 14 | 3 | Every 4 days after maturity | 12 | Mid/late |
| Coconut | Orchard | 320 | 40 | 18 | 3 | Every 5 days after maturity | 10 | Late |

Orchard plants are expensive saplings with longer establishment and repeated production, never three-day field crops. Later balance must consider land occupied, energy/water costs, first-harvest payback, regrowth lifetime and market floors. No seeds, saplings or playable definitions for these nine future crops are registered now.

## Future weather — design only

Clear/rainy days are saved with the day. Rain automatically satisfies both required watering windows for living crops, freeing time to explore. Show rain on the world and HUD, reduce forest visibility moderately, and allow selected animals to become more aggressive. Coordinate rain with the same window evaluator so water credit is not duplicated. No weather implementation now.

## Future City and dynamic economy — next milestone

Implement shops, visible daily prices and the expansion-field purchase in City. Proposed controlled market range: 85–115% of crop base value, with a profitability floor validated against seed cost/yield. Show today’s exact price before confirming a sale. Publish category bonuses for special market days; a Fruit Festival temporarily boosts fruit categories. Prefer scheduled/seeded daily changes that support planning rather than punitive random swings. Save day/market modifiers so reload cannot reroll prices. Current slice has no active shop or market fluctuations.

## Future equipment — design only

Tools: Rusty Watering Can → Copper Watering Can → Improved Sprinkler → Golden Sprinkler. Upgrades reduce repeated actions through coverage, capacity or scheduled watering; preserve an economic cost and clear affected-cell preview. Weapons: Wooden Club → Iron Sword → Hunter’s Spear. Distinct reach/speed/defense tradeoffs should make deeper forest trips safer without removing risk. Weapons, armor, sprinklers and tool purchases are not implemented now.

## Future day/night urgency — design only

Progressively warmer afternoon light, orange evening and readable darker nights; later music/ambient changes signal time. Stronger animals may appear at night, creating a choice between exploration and returning home. Sleep restores energy and begins the next day. Replace the foundation’s automatic midnight return with a balanced late-night consequence during the relevant survival milestone; never instantly kill or teleport the player merely because it is late. No night monsters, new damage system or final audio is added now.
