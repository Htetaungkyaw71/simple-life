# Muted City planter-bench — v0.37.2

Reload the local game and inspect the planted seating below the City seed stall, left of the fountain. The accepted muted walnut/sage revision replaces the earlier orange trial at the same position, scale and footprint. Other five planted benches remain as before.

365 tests and normal npm run build pass. node scripts/check_planter_bench.mjs --muted verifies all1041 frame records unchanged, every pixel outside the target cell exact,18 other runtime art files exact, binary-alpha68×87 derivative, and unchanged source originals. Atlas remains1024×3693. build-audit.json verifies the same48-file allowlist and exact emitted atlas. tests.txt/build.txt retain results.

The existing in-app browser was accessible this turn. Reload succeeded and the muted bench was visually confirmed in City at dusk; in-game.jpg is an actual browser capture. This supersedes the preceding browser-block limitation for this visual check only. Full keyboard/collision/touch and physical-device acceptance remain unverified. Existing pure footprint/approach regression tests pass. No save injection, teleport or publication.

Original PNG, preceding atlas and native derivative are preserved separately in output/art/planter-bench-muted-v2. The earlier orange source remains in planter-bench-v1.
