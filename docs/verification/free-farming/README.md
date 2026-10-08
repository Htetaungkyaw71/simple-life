# v0.6.0 free farming evidence

- tests.txt: 139/139 npm tests pass, including fourteen new meaningful farming/save/care/UI regressions and the retained gameplay/font regressions.
- build.txt: npm run build succeeds. runtime-audit.json: 12 production files / 2,058,100 bytes, eight allowlisted art files, source/dist hash equality and HTTP bundle identity at http://127.0.0.1:4175/.
- pixel-audit.json: 81 appended original crop/shovel frames, 32 original crop palette edits, 442 other retained frames pixel-identical and all prior atlas coordinates unchanged. Only town PNG/JSON change; six other runtime art files are identical.
- growing-study.png / watered-study.png: actual FarmView commands rendered approximately with Pillow. Connected soil/olive crops, blue-drop/red !/basket markers and wet shade inspected. These omit road/building/fence layers and are not exact native frames.
- shop-last-390x844.png / produce-last-390x844.png / farm-hud-640x360.png / bag-1280x720.png: four selected UI studies from 51 generated command states, with all twelve crops reachable. Last-page QA routing was corrected before final retention. Background is a retained Forest art study rather than each live world area.

All six images were reviewed and explicitly label OFFLINE / NOT A BROWSER CAPTURE. They supplement pure/layout/pinned-engine tests; they do not prove browser loading, pointer/key dispatch, can animation, touch/mobile play, Canvas/WebGL fidelity or performance. Native browser acceptance remains unverified because of the existing local-URL browser-tool rejection; no alternate browser/raw-CDP/OS bypass was attempted. HTTP checks only verify served file identity. No live user save was accessed. The preview was restarted after detecting it had stopped.

Reproduce with npm test; npm run build; node scripts/qa/free-farm-study.mjs; python3 scripts/qa/free-farm-study.py (Pillow); node scripts/qa/notebook-ui.mjs; python3 scripts/qa/notebook-ui.py /tmp/simplelife-farm-ui-studies. Study adapters are development-only and excluded from dist. Current production build bundle: assets/index-BhCnPkEd.js. Human art/balance/competition acceptance remains pending.
