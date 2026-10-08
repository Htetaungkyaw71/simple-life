# v0.5.1 UI repairs

125/125 tests and build logs; exact eight-file runtime art allowlist unchanged from aad0861; read-only HTTP preview/bundle identity audit. The three new tests exercise pinned Phaser Canvas font-image selection/cache colours, fractional clock formatting and actual Forest Map hotbar action/menu creation at seven sizes. No numeric tool badges remain.

42 labelled offline draw-command studies cover fourteen states at desktop/portrait/small landscape sizes; selected shop/HUD/map images were inspected. The adapter now models baked font source colours, rather than assuming Canvas supports BitmapText tint. Pinned renderer tests use stub canvas contexts; these studies are approximate Pillow renders. Neither is a browser screenshot/input check. Actual browser acceptance remains pending under the recorded local-URL security restriction; no bypass or live save access.

Reproduce:
```sh
node scripts/qa/notebook-ui.mjs
python3 scripts/qa/notebook-ui.py docs/verification/ui-fixes # Pillow required
npm test
npm run build
```
