# v0.18.2 startup and phone preview — 2026-10-12

The reported green screen was reproduced against the v0.18.1 production preview with a fresh native Chrome context at 1280×720 and hasTouch/isMobile false. The ready callback threw `TypeError: Cannot read properties of null (reading 'onTouchCancel')`; the read-only snapshot showed no controls. The identical touch-capable profile showed the title without error. The minimal fix checks `touch?.target` before installing the cancellation wrapper. Desktop startup proceeds and touch processing remains enabled.

## Reproduction and checks

```sh
npm test
npm run build
npm run build:playtest -- --outDir /tmp/simple-life-v0182-playtest --emptyOutDir
npm run preview -- --host 0.0.0.0 --port 4198 --strictPort
GAME_URL=http://192.168.100.7:4198/ node tests/browser/startup.mjs
AUDIO_QA_OUT=/tmp/simple-life-v0182-audit python3 scripts/qa/cozy-audio-audit.py
git diff --check
```

Use Vite's current Network URL if the Wi-Fi address changes. The existing Mac preview is http://127.0.0.1:4196/. Keep the Mac/server running and connect the phone to the same Wi-Fi. This is a local preview; the public playtest was not updated.

- **292 tests pass**, no failures. Normal and separate explicit playtest builds pass with 138 modules; normal dist retains the 60-coin release behavior.
- **Eight fresh native Chrome cases pass** through the actual LAN URL. Canvas and WebGL each cover non-touch 1280×720/1440×900 and touch 390×844/844×390. navigator.maxTouchPoints confirms the intended capability. Real mouse/keyboard/touch inputs open Controls, start a new life, skip the introduction, move the farmer, cancel a mobile touch, Pause/Save and Continue after reload. Normal money, position and skipped intro survive. All consoles are clean, with no failed or external requests.
- Gameplay captures were visually inspected at 1280×720 and 844×390; the world, farmer and controls render normally. Local and Wi-Fi URLs both return HTTP 200.
- Runtime audit passes: **40 files / 11,719,438 bytes**, 28 unchanged approved WAVs, eight unchanged allowed art files, full dependency notices, no source archives or unused packs. No licence/dependency/asset changes were required.

The browser script creates disposable contexts with no fixture saves or gameplay mutation hooks. Generated evidence stays in /tmp/simple-life-startup and /tmp/simple-life-v0182-audit, outside tracked source. Tests do not open or change the user's existing browser save. The original reproduction remains in /tmp/simple-life-startup-false.png and the probe script.

## Limits

Mobile profiles are native Chrome touch emulation, not a physical phone or Safari/WebKit certification. No deployment, push, backend or remote asset. Earlier mobile-rotation evidence is historical: its standard fresh cases ran before the last v0.18.1 wrapper change, and the final touch-only cases missed non-touch startup. The explicit capability matrix here prevents that coverage gap.
