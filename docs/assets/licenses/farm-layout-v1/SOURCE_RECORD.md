# v0.32.0 follow-up — 2026-10-15

Original code-only Farm geometry/restoration interaction, assisted by Codex. Five-row starter, narrower existing roads and relocated existing notice sprite. Restoration reveals existing grass terrain and reuses existing procedural bed material on re-dig. No new art/dependency or image generation. Existing PNG/JSON hashes/credits remain. Current evidence: docs/verification/farm-restore.

---

# v0.31.1 follow-up — 2026-10-15

Removed procedural fallow-site canvases; existing terrain remains until actual digging. Enlarged cleared areas/starter to 8 × 6 and removed the Copper digging restriction. Code changes only, assisted by Codex. All existing raster assets/metadata and dependency licences remain unchanged. No image generation, third-party pixel extraction or new dependency. See docs/verification/farm-free-dig for current evidence. The v0.31.0 account below records the superseded light-fallow presentation.

---

# Eight-column farm layout — 2026-10-15

No new raster artwork or external source is introduced. `src/art/FarmView.js` uses existing original procedural soilPixels to bake light fallow-site textures with a muted grass/earth blend. Dark prepared beds retain existing materials. Map road/growing-area geometry and additive custom-bed migration are code changes, assisted by Codex. The user's supplied reference informs broad composition/depth advice only; no reference pixels sampled, no image generation call.

Existing Town/World/Farmer PNG/JSON hashes are retained in `docs/verification/farm-layout/art-hashes.json`; they remain unchanged. All source code, preview screenshots and browser fixtures stay outside the existing production allowlist. No new tool dependency, runtime remote asset or licence. Existing third-party credits apply to unchanged environment/character assets. No source push/publication/submission.
