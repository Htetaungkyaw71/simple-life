# v0.5.2 font recovery evidence

125/125 tests and build pass. The strengthened existing font regression uses actual pinned Phaser XML parser, Texture.add/get and Canvas renderer functions. Before the fix it failed: copied rectangle 3×7, expected 128×64. After the fix it passes for all five UI colours and cache reuse. Images/canvas contexts remain stubbed; this is not native browser QA.

The previous UI adapter returned the full font for every frame request. It now models null selecting the transparent SPACE glyph, records the copy rectangle and suppresses blank source text. Forty-two labelled offline draw-command studies generated; five retained here. Shop and portrait bag inspected. font-pixels.json audits original font alpha/composite pixels independently with Pillow. runtime-audit.json records eight unchanged art files, 12 output files and HTTP bundle identity.

Browser interactions/rendering remain unverified under the existing local-URL security restriction. No alternate-browser bypass or live save access.

Reproduce: npm test; npm run build; node scripts/qa/notebook-ui.mjs; python3 scripts/qa/notebook-ui.py /tmp/simplelife-font-studies (Pillow required). The offline images use the retained background art study, not the corresponding live world area.
