# One cedar bench verification — 2026-10-15

Story: load Home → local town atlas supplies the one high-angle cedar bench → existing world renderer places it at the old 64×40 footprint with contact shadow → existing collider still blocks passage.

All 358 tests and the production build pass; dist remains 46 local files. Its town PNG equals the reviewed runtime PNG. Pixel audit preserves the complete old atlas RGBA region and all 958 prior frame records, verifies the appended sample pixels, binary alpha, one fixed Home override and the old [960,842,64,18] collider.

Browser: tests/browser/bench-cedar.html on isolated4216, desktop1280×720. Home sample visibly renders; real keyboard input verifies walking through is blocked and walking around stays open. No console errors. Result: browser-checks.txt. Game/default4215 server was stopped when this turn began; both normal4215 and isolated4216 were restarted successfully. No test fixture is seeded into4215.

Visual evidence: game-desktop-full.png includes the test page; game-desktop.png crops only that page header. game-closeup-native.png is a focused unchanged game crop, and game-closeup.png enlarges that crop exactly2× with nearest-neighbor for review. No object is composited or retouched into these screenshots.

Only the Home garden bench at(960,824) is the new candidate. Other benches and direction/catalog art remain unchanged. User visual approval is pending; no wider asset replacement is authorized by this result. This browser pass covers the affected object/rendering/collision on desktop, not a new traversal of every location/device. The initial source needed camera and pixel-shape edits; all three tool outputs and exact prompts remain as evidence.
