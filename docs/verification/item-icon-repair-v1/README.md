# Item-icon cleanup and sizing verification — 2026-10-26

## Runtime result

Checkpoint: `6e3aa89` (`checkpoint before icon cleanup and scaling`).

The corrected cleanup is based on recorded background/fringe colors at RGB distance 4 and background connectivity. It replaces the broad hue predicate that removed valid purple fruit interiors. The repaired 2×2 sheet maps as follows:

| Position | Artwork | Runtime key | True bounds | Opaque colors | Opaque pixels |
| --- | --- | --- | ---: | ---: | ---: |
| top-left | Cucumber seed packet | `cucumber-seed-item` | 19×24 | 17 | 452 |
| top-right | Cucumber produce | `cucumber-item` | 18×14 | 10 | 112 |
| bottom-left | filled blue-violet grapes | `grape-item` | 17×19 | 12 | 216 |
| bottom-right | filled plum wild berries | `wild-berry-item` | 18×18 | 10 | 221 |

All four use 24×24 frames, 1× nearest-neighbor runtime display scale, alpha values `{0,255}`, and no palette color matching the magenta rule. `grape-item` is shared by Produce position 10 and Food position 12. `wild-berry-item` is Food position 2 and supplies the existing Food tab button.

## Pixel-retention regression

| Source icon | Old retained | Corrected retained |
| --- | ---: | ---: |
| Produce Grapes | 159/268 (59.33%) | 268/268 (100%) |
| Food Grapes | 158/282 (56.03%) | 282/282 (100%) |
| Wild Berries | 300/360 (83.33%) | 360/360 (100%) |
| Eggplant | — | 266/266 (100%) |
| Blueberries | — | 353/353 (100%) |
| Dragon Fruit | — | 306/306 (100%) |

## Sizing audit

The Bag's 44-pixel inner width gives a 17.6-pixel target. Grapes improve from 24 to 19 pixels (54.55% → 43.18%), Wild Berries from 24 to 18 (54.55% → 40.91%), and the newly drawn Cucumber is 18 pixels (40.91%). Chili, Banana and Coconut already fall inside tolerance. Other audited Produce/Food frames remain native 24 pixels or otherwise outside the permitted tolerance and cannot be reduced exactly because the source is native 1×, not a uniformly divisible enlargement.

Smaller native regeneration is required for: `blueberry-item`, `carrot-item`, `corn-item`, `dragon-fruit-item`, `eggplant-item`, `guava-item`, `mango-item`, `meat-item`, `orange-item`, `papaya-item`, `pineapple-item`, `pumpkin-item`, `strawberry-item`, `sweetPotato-item`, `tomato-item`, and `watermelon-item`. The 22-pixel inner tab buttons also need smaller tab-specific Tomato and Wild Berry art: they currently occupy 109.09% and 81.82%, outside the requested 55–60% target.

Context scale changes are recorded in `size-audit.json`: Bag/shop tabs/toolbar/world drops remain 1×; TradePanel desktop detail and harvest effect change 2× → 1×; compact TradePanel remains 1×; Crop Info changes from the pre-existing 0.75× to integer 1×. Oversized native sources remain flagged for smaller regeneration rather than being blurred or fractionally scaled.

## Automated checks and captures

- `npm run build`: PASS, 196 modules transformed in the current shared worktree.
- Focused icon/crop/shop tests: 11/11 PASS.
- `npm test`: 427/430 PASS. The known `barber-grass-v2` clean-pixel assertion remains. The formerly stale frame-count test now passes after concurrent foliage work. Two new full-suite failures are outside this icon pass in concurrently edited world code: `surface-clearance` reports the Home rock side approach blocked, and `town-polish` reports June's route blocked.
- `browser-results.json`: PASS in the real Phaser canvas at 1280×720 using disposable localStorage fixtures; no user save was read or changed.
- Captures: `bag-seeds.png`, `bag-produce.png`, `bag-fruit.png`, `toolbar.png`, `seed-shop.png`, `market.png`, `harvest-effect.png`.
- `size-audit.json`: per-position native bounds, old/new Bag dimensions, percentages, context scales and regeneration flags.
- `docs/verification/item-icons-runtime-v1/atlas-install.json`: 34 item frames and 88 plant frames refreshed; non-target frame coordinates preserved; zero non-target atlas-pixel changes.

No debug/review page, gameplay logic, item ID, price, count, save field, UI layout or slot size changed.
