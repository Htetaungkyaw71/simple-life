# Preserve both eyes at the accepted size — 2026-10-14

Diagnosis: original south-facing idle phases 0, 1 and 3 contain dark eye pixels at (29,27) and (34,27). Nearest native reduction from 64×64 to 48×48 skipped the x29 column. Phase 2 is the authored blink.

Fix: copy every original 64×64 cell unchanged, origin (32,56), and display at 1.5× with nearest filtering. The padded world frame stays 96×96, ground offset 84 and body approximately 60 world units, matching the preceding resized-at-2× version. Recalculated rounded hand offsets preserve carried tools; baked spout offsets keep the same physical scale. No new generation, pixel painting, gameplay timing, collision or save change.

- `npm test`: 320/320 pass. `npm run build`: pass.
- Native audit: all 168 runtime cells match original RGBA bytes and hashes. Both open-eye front pixel columns remain. `native-audit.json` is local evidence; source hashes and packing details are in ../../assets/licenses/farmer-boy-revised-v2/runtime-record.json.
- Browser: tests/browser/revised-farmer.mjs with QA_OUT set to this directory. Native keyboard and touch checks at 1280×720 and 390×844 observe all eight run phases in four directions and all six phases in every work/combat action, correct gameplay outcomes, no doubled tool, pause/resume, jump, girl/paid-look compatibility and coin/save reload. Additional 1440×900, 1024×768 and 844×390 title/selection/gameplay pass, English/Myanmar, no browser errors/remote requests.
- Visual inspection of desktop/portrait idle captures confirms both eyes and the accepted smaller stature. Captures and browser.json are local ignored evidence.

Limits: noninteger nearest rendering can produce unequal screen-pixel widths. This is a narrow exception to the earlier integer-only boy display recommendation, justified by preserving original face details at the accepted size. Other characters/camera/world remain. No physical-device/non-Chromium verification, public deployment or Git push.

[Local preview](http://127.0.0.1:4205/) while its server runs.
