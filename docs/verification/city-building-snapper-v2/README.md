# City building Pixel Snapper v2 verification

Date: 2026-10-18

## Result

PASS. Nine user-supplied residences, the café and the two approved user-supplied shop derivatives load from the local `city-buildings` atlas. The three wide residences and café each measure exactly 190 world pixels from visible top to foundation, matching the accepted reference cottages and sitting between the rejected 1× and 2× sizes. Clothing and barber each measure exactly 198 world pixels in visible height. Every source keeps its native pixels, residences occupy green lawn parcels, porches/foundation collisions and resident routes remain valid, and exactly three planter benches remain. The Home map contains only its player home plus the plum and grey reused City houses; the screenshot-identified fourth house is absent.

## Automated checks

- `npm test`: 387 passed, 0 failed.
- `npm run build`: passed with Vite 6.4.3; 186 modules transformed.
- Targeted City/atlas/layout/planter/resident suite: 16 passed, 0 failed.
- Source audit: twelve native canvases retain their dimensions and RGBA pixels; atlas is 1024×512 with twelve frames.
- Surface/path audit: all residential lots clear non-road cream/walk masks to grass; roads remain; every porch and resident commute is walkable with the real foot body.
- Planter audit: exact retained coordinates are `(469,580)`, `(653,580)` and `(837,580)`.

## Browser checks

The local production-shaped game was inspected in Chromium at 1280×720. City views confirmed the reference-height café, similarly sized clothing/barber facades, nearest filtering and no console/page errors. Automated map/route regressions additionally verify the other three reference-height facades, Home removal and collision cleanup. The earlier seven-view machine-readable run remains at [browser-checks.json](browser-checks.json); its screenshots predate the final shop/scale follow-up and are retained as historical evidence rather than current visual claims.

Screenshots:

- [north cottage comparison](north.png)
- [exact three-planter terrace](planters.png)
- [café](cafe.png)
- [west residences](west.png)
- [southwest residences](southwest.png)
- [east residence](east.png)
- [southern district](south.png)

## Limitations

The verification used local Chromium at 1280×720. A physical phone, touch-only traversal and non-Chromium browser were not newly tested in this pass. Human aesthetic approval remains with the user. No deployment, publication or push was performed.
