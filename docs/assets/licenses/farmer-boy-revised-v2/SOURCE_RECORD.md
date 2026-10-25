# Original pixels restored at smaller display scale — 2026-10-14

The user accepted the smaller size but reported one missing eye. Original south idle frames 0, 1, 3 contain both dark eye columns at x29/x34, y27; automatic 0.75 nearest resizing skipped x29. Runtime now again copies original 64×64 cells byte for byte and uses 1.5× nearest display scale, matching the preceding 48×48-at-2× physical dimensions. Source PNG/ZIP bytes and clip timing remain. runtime-record.json records original cell hashes and display-scale hand coordinates. No new generation, pixel repaint, resize, recolour or limb warp. The v0.26.1 derivative below is retained as historical evidence of the diagnosed regression.

---

# Requested size adaptation — 2026-10-14

The user accepted the character and asked for a smaller in-game size. scripts/revised_farmer.py uniformly resizes each complete padded 64×64 source cell to 48×48 using nearest sampling (0.75). World scale stays integer 2×, ground(24,42); front/side idle ink is 30 native pixels and back is31. Source PNG/ZIP bytes and clip timing remain unchanged; runtime-record.json stores both original and adapted RGBA hashes. Source palette and binary alpha remain; no recolour, trim, independent limb warp or new generation. Original source-pixel-preservation assertions below describe v0.26.0, before this user-requested size change.

---

# Runtime integration — 2026-10-14

The user supplied /Users/mac/Desktop/farmer-boy-revised-v2.zip and requested in-game use. It matches the existing local approved export byte for byte. user-import.json stores its SHA-256. runtime-source retains seven exact native sheets plus animations.json; scripts/revised_farmer.py packs 168 cells unchanged into the existing boy.png runtime path and generates clip timing/source-hand coordinates. runtime-record.json stores decoded frame and PNG hashes. Original native 64×64 padding, origin(32,56), palette and alpha are retained. World display uses integer 2×, about 80 units of standing body; existing character appearance IDs/saves and other assets remain. No new art generation or publishing. The earlier generation records below remain applicable.

---

# Revised farmer v2 source record

2026-10-14: user approved the revised appearance and requested the complete sprite export. OpenAI built-in imagegen produced ten selected source PNGs. Model version was not exposed. Exact prompts are in PROMPTS.md; record.json stores source paths and SHA-256 hashes. Byte-identical raw PNGs accompany the export under source/.

References: the user's two Desktop screenshots dated 2026-10-13 supplied proportion/pixel language. Plant Tales official Steam screenshots were inspected for broad visual style; no screenshot or Plant Tales sprite pixels enter this export. Existing user-generated PixelLab run poses guided the new run phases; their source/use evidence remains in ../characters-pixellab/. Older generated work-action poses guided the revised action sheets.

Native conversion: Imagegen-authored poses; alpha gutters or connected chopping silhouettes (opaque core250 for fringe separation); whole-frame nearest sampling; shared per-action body scale/upper-torso registration; threshold128 alpha; one shared weighted32-colour palette. West running mirrors authored east. No independently displaced body parts or synthetic limb warps.

All seven actions were regenerated for the revised identity. 168 native64×64 frames plus48 exact idle/run48×48 crops; original30-pixel revision is retained separately. West running is explicitly mirrored. No procedural limb motion, runtime replacement or deployment. AI generation/adaptation is disclosed.

Output-use evidence is copied unchanged from the previously reviewed OpenAI terms record (2026-10-13). Offline dependency evidence remains in docs/licenses/farmer-approved-export. These are service output terms, not CC0 or a claim of exclusive copyright.
