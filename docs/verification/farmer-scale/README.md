# Male farmer size correction — 2026-10-14

Request: reduce the accepted male farmer to fit the game; explain separate carried tools versus combined tool-use sprites.

The original 64×64 source remains untouched. scripts/revised_farmer.py converts all 168 complete frames to 48×48 with one fixed nearest-neighbour 0.75 resize. Shared origin is (24,42), world scale 2×. All front/side idle frames have 30 pixels of ink height; north has 31. BOY_HANDS uses adapted opaque hand pixels, and watering-spout offsets shrink with the body. No independent limb shift, recolour, new generated art or gameplay/save change.

Checks completed:

- `npm test`: 320/320 pass. `npm run build`: pass.
- `native-audit.json`: 168 exact whole-frame nearest conversions; unchanged original source RGBA hashes; binary alpha; 384×1344 runtime sheet; 16 other tracked art/font/JSON files unchanged; 46 production files with source archives excluded.
- `tests/browser/revised-farmer.mjs`, with QA_OUT set to this directory: all eight run phases in four directions and all six phases of each work/combat clip observed at 1280×720 and 390×844. Native keyboard/touch joystick, actual water/harvest/dig/chop/attack outcomes, no double tool, pause/resume, jump, girl/paid appearances and coins/reload pass. Title/choice/gameplay additionally pass at 1440×900, 1024×768 and 844×390, English/Myanmar, no console/page errors or remote runtime requests. Captures and browser.json are local ignored evidence.
- Visual inspection: desktop and portrait captures show the smaller farmer on the existing world pixel grid with grounded feet.

Existing combined action poses continue to include their tools; the idle/run carried object layer is separate. No new tool/body layer extraction or asset generation. Single supplied can design, generated pose variation and unverified physical devices/non-Chromium remain. Public deployment and Git push were not performed.

[Local preview](http://127.0.0.1:4205/) while the server runs.
