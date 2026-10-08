# v0.6.1 farm polish evidence

144/144 tests and npm run build pass. tests.txt/build.txt retain logs. Five new meaningful regressions cover 16-cell work energy, hourly fatigue/save compatibility, actual held-can frame/directions/jump/pause/hide, pour origin/target with no spawned second can, and coherent soil overlap/variation/transparent corners. Established farming/City/forest/UI/engine/save tests remain.

Three offline studies from real FarmView/HeldWateringCan commands are retained: growing-study.png, watered-study.png, hand-can-study.png. The first two approximate Farm layers; the third shows both retained farmers with four facing poses. growing-detail.png and watered-detail.png are marked close-up crops of those studies. All images are labelled offline and were inspected. They omit some world layers and do not certify native browser render/input/animation. The adapter now records flips and approximates nearest pivot rotation.

runtime-audit.json compares against d8ec546: one original can cell appended, all 555 retained cells/coordinates pixel-identical, six other art files unchanged, eight-art-file allowlist intact, source/dist equality, production file count/bytes and current preview HTTP bundle identity. No source archive, QA image or unused pack enters dist.

Live browser interactions, animation/touch/mobile/Canvas/WebGL/performance remain unverified under the existing local-URL tool rejection; no alternate browser/raw-CDP/OS bypass or user storage access. HTTP checks verify files only. Reproduce: npm test; npm run build; node scripts/qa/free-farm-study.mjs; python3 scripts/qa/free-farm-study.py docs/verification/farm-polish (Pillow). Human art/balance/competition acceptance remains pending.
