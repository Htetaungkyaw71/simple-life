# v0.41.0 — City garden and shop integration

User-approved proposal02 is now integrated locally. Café at the requested former southern cottage, set back with two existing tables/chairs; clothing at the former riverside cottage; barber beside it; relocated camp on eastern green ground without its fixed planter bench. Clara/Tomas keep home indices3/1 at the northern replacement cottages. Current grass shader/material and original three-bench public terrace remain unchanged. Café provides outdoor seating and a contextual sign; only the two approved retail interiors are enterable.

## Verification

- `npm test`:380/380 pass. New tests check exact approved placements, camp removal/moves, atlas append metadata, connected shop door/client/exit paths with the actual12×6 indoor body and24-unit resident clearance, purchases/closed guards, saved appearance/coins/position/schema19, completed project compatibility and camp approaches. Existing24×12 City route test still reaches all13building approaches, market/board/bridge links and both sides of three terrace benches. Original227grass/tree save identities survive.
- `npm run build`: passes;48production files, about13MB. Nine new frames appended inside the existing atlas pair, no new allowlist paths. Runtime source archives, proposals, backups, screenshot evidence and native original files are excluded.
- `scripts/check_city_shops.py`: all1051old frame records, old atlas RGBA, all9approved native PNGs and74other public files are exact. `groundSurface.js` preservation remains covered by the prior baseline regression. No dependency changes.
- Production-browser acceptance through CUA on isolated origin127.0.0.1:43864 at1280×720: Continue; actual keyboard entry/exit for both shops; normal foot movement to Sol and Nell; Sol hair-only menu; chestnut purchase1000→950; reload restores barber position/hair/coins; Nell outfits/extras menu, copper purchase1000→910 and owned flag; both return doors land correctly in City. Café table-gap walk reaches the front door. Approved fountain/water registration, terrace and night lamp emission inspected. Sol is absent with no service prompt at22:00, room remains readable. Northern cottages and camp inspected, including completed Flower Court scenery. No console errors observed.
- Tests use a separate fixture-only origin and synthetic state. Normal port4215local save was not seeded or edited. Save schema19 and free equip/ownership/prices are preserved. Household route anchors are updated in data; existing daytime patrols and19:00curfew remain.

## Integration adjustment and limits

The completed Flower Court bench would intersect the moved left tent. It moves80units east into the central gap; all project IDs, costs/rewards/completion and remaining project props stay unchanged. The old fixed camp planter remains removed. Completed quest flowerpots are pre-existing unlockable project scenery, not another fixed planter-bench asset.

Shop rooms use the existing interior wall/floor renderer, approved fixed furniture and existing NPC art. No café interior or food-service economy was included in the approved proposal. Mobile/touch and physical devices were not newly browser-tested; existing phone UI bounds tests pass. No deployment, publication, push or organizer submission.

## Browser screenshots

[Gameplay café](cafe.jpg) · [clothing frontage](clothing.jpg) · [camp with completed project](camp.jpg) · [fountain/terrace](fountain.jpg) · [night lamps](night.jpg) · [northern cottages](northern.jpg).

Both earlier proposals remain unchanged in output/previews/city-garden-shops-v1 and-v2. [Source record](../../assets/licenses/city-shops-v1/SOURCE_RECORD.md). Test/build logs and preservation JSON are alongside this record.
