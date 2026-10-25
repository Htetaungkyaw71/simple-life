# Terracotta City cottage verification

Status: the user-approved cleaned cottage replaces the northern `cottage-b` visual while preserving `house-village-4`, Tomas's home identity, the original parcel, save schema 19, and all shop/service behavior.

Automated checks:

- `node scripts/check_city_cottage.mjs` verifies the 120×112 native pixels at atlas frame `[774,3927,120,112]`, all 1060 earlier frame records, and every pre-existing atlas pixel.
- `node --test tests/city-shops.test.js` verifies the one-instance replacement, visible-door anchor `(2350,438)`, paved walkable approach, route connectivity, stable resident building indices, rooms, services, purchases, saves, and camp layout.
- `npm test` and `npm run build` verify the complete project and production bundle.

Browser check: the isolated production build at `127.0.0.1:43864` was inspected in the desktop Chromium in-app browser. Both northern cottages render together with nearest-pixel filtering, coherent scale and a clear porch-to-road relationship. The player walked to `(2346,449)`, beside the replacement's approach `(2350,464)`, without a collision trap. Tomas remained assigned to `house-village-4`; the fixture did not mutate the normal user save. The browser console reported no warnings or errors.

[Browser proof: terracotta.jpg](terracotta.jpg)

No physical phone or non-Chromium browser was newly tested. No deploy, publication, source push, or normal user-save mutation.
