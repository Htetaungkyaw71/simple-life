# Forest refresh verification — v0.9.0, 2026-10-09

Final automated checks: **182/182 tests**, production build **99 modules**, and `git diff --check` pass. Dist contains **12 files / 2,299,121 bytes**, exactly eight unchanged allowlisted art files and 838 retained atlas frames. No new dependency, downloaded asset or recording. [Runtime audit](runtime-audit.json) compares v0.8.0 commit 2484fba: 4,070 → 3,195 trees, 163 → 323 fruit nodes, 48 → 128 quiet animals, plus the 30 retained boars. Eighty shelf bands contain 970 face segments. Earlier forage/animal IDs, all remaining tree IDs and all 40 discovery/14 cache IDs survive.

## Actual browser inputs

The isolated localhost QA server used native keyboard/pointer input and read-only canvas DOM snapshots. No page evaluation changed gameplay, inventory or storage. The normal preview's save was neither inspected nor reset. [Compact observations](browser-checks.json) and [attack timing samples](attack-timing.json) record checks.

- Desktop 1280×720: selected Axe leaves Water, Bag, Map and Pause controls with no Axe/Attack control. A world click turns and swings; sampled angles show wind-up, cut and recovery, with pending impact resolving after the wind-up. Empty swings retain energy. Idle game hours also retain energy.
- Phone viewport 360×640: a native click on the visible single-boar fixture defeats its remaining 1 HP, awards 2 Meat and changes energy 100 → 99. A later empty swing and several idle game hours keep 99. HUD and all five Pause controls fit the viewport. [Phone attack](phone-attack.png).
- Water selected in Farm: a native ground click creates one wet-ground record and changes energy 100 → 99 after idle hours at 100. This was outside a crop-care window; it verifies wetness/action cost, not successful morning crop care. Forest ambience is inactive outside Forest. [Phone watering](phone-watering.png).
- Final shelf fixture: Down stops at y3835.263 above the face; Space crosses to y3886.107 during the jump. Energy stays 100. Shelf geometry tests retain wider walking gaps, dry footprints, safe resources and the original starter-boar clearing. [Final terrain](terrain-desktop.png).
- Map shows all seven organic habitats, with the original 40 discovery rectangles underneath. The `reveal` fixture supplies those discoveries; this screenshot does not claim gameplay earned them. [Final habitat map](habitat-map-desktop.png).
- Snowy, Meadow, Easy Rainforest and Desert profiles/visuals were observed. Meadow changes to nocturnal insects without birds after dark. Water fixture reports wading/reflection and stronger river noise. Desert uses dry ground/open groves, filtered wind and no insect/bird layer. [Desert](desert-desktop.png).
- Sound toggle mutes activity, stays OFF after an actual reload, and restores after a native unmute click. Profile/context/gain lifecycle was checked; menus mute Forest activity. Final map fixture has no browser warnings/errors.

An initial multi-boar trial was left running while inspecting snapshots and the character was defeated before the planned input. It did not verify a successful attack. The later focused one-boar fixture isolates the requested tap/impact/loot/cost flow; automated tests separately retain boar movement, warning, territory, invulnerability, collision and recovery behavior. Older complete survival, eating and stone browser checks remain in the hunting-resources evidence directory.

## Reproduction and limits

Run `npm test`, `npm run build`, then bundled Python with `scripts/qa/forest-refresh-audit.py`. For isolated fixtures: `QA_PORT=43868 node tests/browser/city-redesign-server.mjs`; visit `http://127.0.0.1:43868/?qa&fixture=shelf`, `fixture=tapHunt`, `fixture=farm`, `fixture=forestWater`, or `fixture=biomes&reveal`, then Continue. Fixture seeds apply only to this isolated origin. Pending attack/swing history is emitted read-only for timing checks.

Physical touch devices, Safari/Firefox/Edge, sustained performance and audible speaker/headphone quality are unverified. Web Audio synthesis was verified through unit fakes and live browser context/profile state; no human listening claim. Early Forest construction remains substantial. No final human visual acceptance, push, publication or competition submission is claimed. Existing mixed-source asset/release qualifications remain in ASSET_LICENSES.md.
