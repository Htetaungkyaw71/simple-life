# Taller Farm and free digging — 2026-10-15

User story: Continue → taller starter → plant/water in bottom-right cell → Continue; walk to clear grass between fields → shovel → seed → water → Continue without Copper or coins. Undug areas show grass rather than pale rectangles.

All **340 tests pass**, as does `npm run build`. Geometry checks cover all 192 cells across the four 8 × 6 cleared areas, safe road/building clearance and unchanged reserved crop IDs. Migration checks retain old custom crops, coins, position and purchased furniture and verify repeated normalization is idempotent. Free digging regression covers ground outside the defined sites. Existing energy, range, duplicate, road, water, exhaustion and save sanitation tests pass.

Desktop 1280 × 720 English and phone-size 390 × 844 Myanmar browser flows pass through actual keyboard/canvas controls. An initial fixture issued watering before the existing 450ms tool cooldown; corrected fixture timing, with both final runs passing. No game runtime warning/error found; historical assertion remains identified in checks.json. Production preview4205loads `index-Dcdo7IdF.js` with clean console. User4215and4205saves were not replaced; disposable test saves are confined to4216.

[Checks](checks.json), [unchanged asset hashes](art-hashes.json), [taller starter with disposable test crops](desktop-taller-field.jpg), [undug natural grass](undug-grass.jpg), [phone test](phone-taller-field.jpg). Build remains 46 allowlisted files, without QA pages, source archives or new runtime dependencies. No image generation or publication.

Limits: digging remains restricted to safe clear Farm ground, with normal reach, energy and capacity checks. Roads, water, buildings and placed furniture remain protected. The starter uses 16 original slots plus32custom cells. Existing crops, furniture and planted grass take priority over filling new starter spaces; the2048custom-bed cap may limit additions on full/very large legacy saves. Physical phone touch and other engines are not tested. Separate farm purchase/watering upgrade progression is unchanged.
