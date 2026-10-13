# v0.21.0 — optional appearance coin sink

Two starter outfits are free. Paid clothes cost 90c (Copper vest), 120c (Plum dress), 150c (Forest jacket), owned permanently. Haircuts cost 30c/45c/50c/60c per different selected style. Previewing is free; insufficient coins, closed/distant/wrong service and repeated selected-style actions leave balance unchanged. Cosmetics grant no combat/farming advantage and add no main quest requirement. Existing progression economics remain. Long-term price comfort remains human playtesting.

---

# v0.20.1 — optional curse economy retired

No new cave cache rewards, repair costs or respawning spirit damage apply. Existing saved wallet and inventory values remain; removal neither refunds prior contributions nor reverses previously earned coins. Existing farming, wildlife drops, food, 25% Stash Bag recovery, normal 60c starting balance and explicit once-per-save playtest gift remain.

---

# v0.20.0 — provisional optional curse balance

The default game remains harmless until explicit warning confirmation. A finite 200c cache offsets one-third of a 600c repair; Wood 48 / Stone 32 / Meat 20 add a deliberate resource challenge. Paid resources persist independently of inventory and deaths, so players can progress in small contributions. Spirits never drop loot, avoiding an infinite respawn-farming reward exploit. Cap three / three Axe hits / one energy per hit / five active seconds between defeats; 86 speed versus farmer 260 allows retreat, with 1200ms arrival and 700ms attack telegraphs, 12 damage and shared invulnerability. Daytime and house interior are safe. Existing 25% coin-bag recovery applies outdoors, including correct farm identity. Full restoration is permanent, with a saved achievement rather than repeatable rewards. These are implementation defaults, not a claim of human-tested long-term difficulty. The public test gift affects coins only; the normal build stays at 60c.

---

# Crop economy audit before changes — 2026-10-11

Baseline v0.17.4. Profit/day = (yield × normal sell − seed cost) / watered growth days. Work energy = plant + daily water + harvest; eating produce has a revenue opportunity cost. Market averages below are nominal 100%; the deterministic 85–120% discrete distribution averages 102.5% before rounding. Current requests only consume Wood/Stone, then reward crop seeds; no crop is required for the story.

| Crop | Seed | Sell | Yield | Days | Profit/day | Work EP | Min / normal / max | Food EP |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| Tomato | 10 | 18 | 2 | 3 | 8.67 | 5 | 15 / 18 / 22 | 12 |
| Strawberry | 18 | 28 | 2 | 4 | 9.50 | 6 | 24 / 28 / 34 | 8 |
| Carrot | 28 | 70 | 1 | 3 | 14.00 | 5 | 60 / 70 / 84 | 22 |
| Corn | 40 | 36 | 3 | 4 | 17.00 | 6 | 31 / 36 / 43 | 14 |
| Chili | 22 | 24 | 3 | 3 | 16.67 | 5 | 20 / 24 / 29 | 10 |
| Eggplant | 32 | 46 | 2 | 4 | 15.00 | 6 | 39 / 46 / 55 | 18 |
| Cucumber | 26 | 30 | 3 | 3 | 21.33 | 5 | 26 / 30 / 36 | 16 |
| Watermelon | 55 | 85 | 2 | 5 | 23.00 | 7 | 72 / 85 / 102 | 35 |
| Pumpkin | 48 | 74 | 2 | 6 | 16.67 | 8 | 63 / 74 / 89 | 28 |
| Grape | 36 | 42 | 3 | 5 | 18.00 | 7 | 36 / 42 / 50 | 20 |
| Blueberry | 30 | 38 | 3 | 4 | 21.00 | 6 | 32 / 38 / 46 | 16 |
| Sweet Potato | 24 | 38 | 2 | 3 | 17.33 | 5 | 32 / 38 / 46 | 24 |

Findings: Tomato has the lowest entry cost, but high-yield three-day Cucumber and Chili overtake most beginner choices. Pumpkin earns only 16.67c/day over six days while Cucumber earns 21.33 over three. The food catalogue exposes only three farm crops. Fruit provides up to 42 energy with no eating cooldown; pausing Bag permits healing through every encounter. Farm expansion has no labor-saving prerequisite.

Chosen approach: preserve twelve identities and the three-watered-day Tomato rule; use cost, duration, yield, profit and food tradeoffs rather than new crop minigames. Broaden existing food use to all crops, cap forest-fruit healing, use an active-time meal cooldown, widen daily market range while retaining its hash/salts, and add exactly one two-energy three-plot watering upgrade. Keep premium houses optional. Final values and checks follow after implementation.

## Final v0.18.0 values

All money columns are coins per item except profit/day. Market mean enumerates all 56 integer percentages (75–130 inclusive), then averages rounded prices; a finite saved daily sequence is deterministic rather than guaranteed uniform. Work EP uses the basic can: plant + each watered day + harvest. Copper waters up to three valid aligned beds for 2 EP, reducing a three-bed water cost from 3 to 2. A single thirsty edge bed costs only 1 EP; a fully planted 4×4 field needs 12 EP instead of 16. Crop food HP is 40% of EP, rounded; the Bag shows actual capped recovery.

| Crop | Seed | Sell | Yield | Days | Profit/day | Work EP | Market min / mean / max | Food HP / EP | Purpose |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| Tomato | 10 | 18 | 2 | 3 | 8.67 | 5 | 14 / 18.46 / 23 | 5 / 12 | Low-cost first crop |
| Strawberry | 18 | 51 | 2 | 4 | 21.00 | 6 | 38 / 52.27 / 66 | 7 / 18 | Rich return on a small seed budget |
| Carrot | 28 | 70 | 1 | 3 | 14.00 | 5 | 53 / 71.80 / 91 | 11 / 28 | Fast single root / travel food |
| Corn | 40 | 30 | 4 | 4 | 20.00 | 6 | 23 / 30.80 / 39 | 4 / 10 | Four ears / market volume |
| Chili | 22 | 24 | 3 | 3 | 16.67 | 5 | 18 / 24.59 / 31 | 2 / 6 | Fast cash / light food |
| Eggplant | 32 | 52 | 2 | 4 | 18.00 | 6 | 39 / 53.32 / 68 | 10 / 24 | Balanced meal and market crop |
| Cucumber | 26 | 33 | 3 | 4 | 18.25 | 6 | 25 / 33.84 / 43 | 6 / 16 | Three fruits / strong market days |
| Watermelon | 55 | 90 | 2 | 5 | 25.00 | 7 | 68 / 92.29 / 117 | 14 / 35 | Premium melons / long journey food |
| Pumpkin | 48 | 72 | 3 | 6 | 28.00 | 8 | 54 / 73.80 / 94 | 15 / 38 | Patient harvest / hearty food |
| Grape | 36 | 46 | 4 | 5 | 29.60 | 7 | 35 / 47.16 / 60 | 8 / 20 | Four clusters / high market volume |
| Blueberry | 30 | 33 | 3 | 4 | 17.25 | 6 | 25 / 33.84 / 43 | 8 / 20 | Three berries / better food than cucumber |
| Sweet Potato | 24 | 42 | 2 | 4 | 15.00 | 6 | 32 / 43.07 / 55 | 13 / 32 | Affordable hearty exploration food |

Town requests remain material requests, preventing an unavailable crop from blocking the story. Existing rewards favor Tomato (Rowan), Strawberry (Bea), Carrot (June), Cucumber (Tomas), Chili (Ira) and Blueberry (Sol); Commons rewards two Grape seeds, Flower Court two Watermelon seeds, and Picnic two Pumpkin seeds. Corn, Eggplant and Sweet Potato rely on their yield/food/cost roles. No regrowth rule or extra catalogue is added.

Commons now costs 12 Wood + 6 Stone and pays 240c (was 24/12 and 180c). Copper costs 180c + 6 Wood + 4 Stone, after Commons. Thus the project alone funds its coin price; starting seeds and normal first sales remain useful. New expansion beyond 16 currently visible beds and all new farms/fields requires Copper; existing large farms remain usable. Upgrade ownership is additive to schema 18. The first 2,000c house remains optional: 16 normal-market Corn beds earn 1,280c net over four watered days after seed investment, or 16 Strawberry beds earn 1,344c; two full harvest investments put the house within reach. This is a planning illustration, not a measured novice income claim. 30,000–90,000c homes remain optional post-story goals.

Food is useful with an opportunity cost. Forest fruit restores about 60% of its former EP and 2–6 HP, and every meal imposes a 12-second active-world cooldown, preserved on reload and frozen in modals. Grilled meat retains 50 HP / 35 EP and requires existing fuel/cooking resources. Eating never consumes an item at full HP/EP.

Verification: all twelve crops are profitable at the lowest market; none dominates another in watered days, profit/day, harvest yield and food energy. Existing independent tests guard atomic purchases/sales, inventory caps, integer coins and duplicate rewards. Market salts, saved seed and day remain deterministic; new price range intentionally changes actual prices. Old already-ripe crops remain ripe when Cucumber/Sweet Potato move from three to four days; partial earned care remains.
