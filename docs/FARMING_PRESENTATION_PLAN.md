# Final foundation and farming-presentation plan — 2026-10-06

1. Baseline: read status, inspect recent commits and current geometry/camera/farming/time/save/UI. Existing 19 tests and production build pass.
2. Replace shed/greenhouse collision with ground-contact rectangles, correct foundation depth and safe-load repair. Cut real collision-free openings wherever fences meet roads; add a small non-transition Farm sign.
3. Recompose a compact indoor tile layout, integer zoom 2 and native-size indoor farmer sprites and larger furniture so the visible farmer remains 64px. Fit full room on desktop with responsive layout; small mobile views follow within bounds. Migrate older indoor positions safely.
4. Join sixteen plots into a compact coherent 4×4 field, keep save indices, replace resting areas with distinct overgrown expansion land and persisted locked flag.
5. Add original deterministic tomato sprites for eight visual states; data-driven definitions and action particles/events with silent sound hooks. Retain the existing art family and runtime allowlist.
6. Implement explicit 06–12 / 16–22 watering windows, saved per-window evaluation, recoverable wilting, death after two consecutive missed windows, and three fully cared-for nights to harvest. Handle rest/sleep and old-save migration without duplicate evaluation.
7. Document the approved future premise, ten-crop plan, progression, food, stash recovery, weather, market and tool/weapon tiers without implementing them.
8. Run unit/migration tests and production build, visually inspect crop gallery and five sizes, play the complete farming loop with real browser inputs, test shed/gates/indoors/touch/saves, update status and create a local commit. No push or publishing.
