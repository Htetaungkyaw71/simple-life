# Milestone 1.1 original pixel art evidence

Date: 2026-10-06. Creator: Simple Life project, authored with OpenAI Codex assistance. Original source URL: none (local project work; no external download).

- `src/ui/statusArt.js`: deterministic nine-by-nine binary masks for leaf, clock, sun, moon, water droplet, warning and harvest basket; integer rotations of cardinal/diagonal arrow masks. Rendered with integer Phaser Graphics rectangles in the existing two-times UI grid.
- `src/art/worldArt.js`, `farmSign`: integer wooden board, grain/highlight, supporting post, existing bitmap FARM text and the same down-arrow mask. World display uses two-times source pixels; collision is the small ground-contact post from mapLayouts.
- Existing original `world/tomato` icon and bitmap font reuse their documented generator provenance.

No copied reference pixels, image-generation output, external font, new asset pack, new licence restriction or runtime dependency. Existing LimeZu CC BY 4.0 evidence remains applicable to the surrounding environment, not claimed as creator of these additions. AI assistance/human review status: docs/AI_USAGE.md. Reproducible source and local commit history are retained; no claim of exclusive copyright in AI-assisted work.
