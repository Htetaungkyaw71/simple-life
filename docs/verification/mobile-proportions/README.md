# v0.18.3 mobile HUD and landscape camera — 2026-10-12

User reference: `/Users/mac/Downloads/2026-10-12 10.17.21 AM.jpg`. It shows responsive landscape gameplay on the user's phone, with large health/energy bars, toolbar, joystick and clock. Changes reduce gameplay HUD coverage, retain usable touch targets, and show more surrounding world. The reference is not imported as an asset.

## Changes

Mobile vitals/clock containers render at .75 of the previous size; health/energy meter width also drops from up to 140 to 120 logical units. Mobile toolbar/Jump/Use controls are 24 logical units (48 CSS pixels), with narrow toolbar cells no smaller than 22 in recorded cases. The joystick diameter drops from 120 to 96 CSS pixels. Toolbar position, reserved action space and guide/crop-panel floors follow these changes. Menus retain their current sizes. Desktop HUD retains its existing dimensions.

Compact landscape camera zoom drops from 1 to .75, giving 33⅓% more world width/height at the same viewport. A 844px phone view shows about 1125 world units, compared with 960 at 1440px desktop/1.5 zoom. Actual coverage depends on device dimensions; portrait retains zoom 1. Short coarse-pointer landscape phones wider than 1000px also receive .75. Indoor/outdoor scaling stays matched, with existing room resizing/collision/follow logic.

## Reproduction and evidence

```sh
npm test
npm run build
npm run build:playtest -- --outDir /tmp/simple-life-v0183-playtest --emptyOutDir
# Existing Wi-Fi preview serves the rebuilt dist, or start it:
npm run preview -- --host 0.0.0.0 --port 4198 --strictPort
GAME_URL=http://192.168.100.7:4198/ QA_OUT=/tmp/simple-life-v0183-rotation node tests/browser/mobile-rotation.mjs
GAME_URL=http://192.168.100.7:4198/ QA_OUT=/tmp/simple-life-v0183-startup node tests/browser/startup.mjs
AUDIO_QA_OUT=/tmp/simple-life-v0183-audit python3 scripts/qa/cozy-audio-audit.py
git diff --check
```

- **292 tests pass**, including the updated existing framing regression for desktop/portrait/landscape and coarse-pointer capability. Both builds pass with **138 modules**.
- **21 native rotation/travel cases pass** in Canvas/WebGL: actual planting/watering, held/cancelled joystick, tool taps, Bag pagination, Pause/Audio/Journal, jump, translated canvas input and save/reload. Seven successive phone dimensions include portrait, 844×390, 640×360, 844×300 with safe insets and 568×256. Six actual outdoor crossings stay silent. The fresh short-landscape introduction still enters the 60c game.
- **Eight native fresh startup cases pass**: Canvas/WebGL at non-touch 1280×720/1440×900 and touch 390×844/844×390, using real mouse/keyboard/touch movement, touch cancellation, Save and Continue. No fixture saves or user-save editing.
- **Four supplementary native safe-area cases pass**, run from `/tmp/simple-life-v0183-safe-phone.mjs`: Canvas/WebGL at 844×335 with 59px side/21px bottom insets, and coarse-pointer 1080×390 with 44px side/21px bottom insets. Targeted Home saves isolate door interaction. All HUD controls remain inside safe bounds; buttons measure 44–48px and the joystick 96px; camera zoom is .75 with the expected world coverage. Native Use enters the house, indoor Jump is disabled, and Save/Continue preserves area, inventory and money. These margin/save fixtures are explicit; no runtime mutation hooks or user browser save are used.
- Desktop/portrait/landscape Home/Farm/interior captures were visually inspected. All native consoles remain clean, without failed requests. Existing LAN endpoint serves the corrected build.
- Runtime audit passes: **40 files / 11,719,637 bytes**, 28 byte-identical approved WAVs, eight unchanged allowed art files and full notices. No new dependency, runtime remote assets, unused packs or source archives. Whitespace passes.

Generated evidence lives under `/tmp/simple-life-v0183-rotation`, `/tmp/simple-life-v0183-startup`, `/tmp/simple-life-v0183-safe-phone` and `/tmp/simple-life-v0183-audit`; suite output is `/tmp/simple-life-v0183-tests.txt`. These captures/reports/saves stay outside tracked source.

## Limits

The supplied screenshot verifies prior physical-phone responsiveness. New proportions are verified through native Chrome emulation; physical touch comfort, revised actual-phone appearance, Safari/WebKit and other engines remain user checks. The preview requires a running Mac/server and the same Wi-Fi; use Vite's current Network URL if the IP changes. No public deployment, Git push, backend or new asset.
