# Pixel Snapper City cottage verification

Status: the user-supplied 167×110 Pixel Snapper cottage replaces only northern `cottage-b` for playable review. `house-village-4`, Tomas's home identity, the original parcel, save schema 19 and all shop/service behavior remain.

Automated checks:

- `node scripts/check_city_cottage_snapper.mjs` verifies the unchanged 167×110 canvas, exact retention of all 9,025 non-white source pixels, removal of only 9,345 exact-white backdrop pixels, binary alpha, the installed atlas rectangle, all 1,060 earlier frame records and every pre-existing atlas pixel.
- `node --test tests/city-shops.test.js` verifies the one-instance replacement, integer 2× route, stable entry `(2350,438)`, paved walkable approach, route connectivity, resident building indices, rooms, services, purchases, saves and camp layout.
- `npm test` and `npm run build` verify the complete project and production bundle.

Browser check: isolated production inspection in desktop Chromium confirms that both northern cottages render together, the replacement has no white backdrop, and its native square-pixel grid remains crisp at integer 2×. The player walked from the eastern side around the traced cottage hull, reached the doorway at approximately `(2355,453)`, and returned to the road without a collision trap. No console warnings or errors were observed. See [snapper.jpg](snapper.jpg).

No physical phone or non-Chromium browser was newly tested. No deploy, publication, source push or normal user-save mutation.
