# Clara seed-seller sprite sheet — 2026-10-28

The user supplied `seed_seller_3x6_sprite_sheet_fixed.png` and explicitly requested a transparent background and runtime integration as the seed seller. The source is a 1200×720 RGB sheet: three directional rows (down, up, right) by six 200×240 cells (standing, four walk frames, seated). It depicts Clara's approved straw hat, brown hair, ivory blouse, sage apron, seed pockets, trousers and boots.

## Runtime processing

`scripts/import_seed_seller.py` performs a deterministic import:

- removes the exact magenta matte and its bounded magenta antialias spill;
- samples the 4× presentation to 50×60 logical cells with nearest-neighbour filtering;
- centres each logical cell inside a transparent 64×64 frame;
- packs 18 frames into `public/assets/pixel/processed/seed-seller.png`;
- requires binary alpha and rejects any remaining opaque key-colour pixels.

The runtime uses the source sheet's own sampled character pixels. There is no redrawing, recolouring, interpolation, pose synthesis or third-party game artwork. Left-facing presentation mirrors the authored right-facing row at runtime. `record.json` contains source/runtime SHA-256 hashes, per-frame bounds and the complete conversion description. Reproduce with:

```sh
python3 scripts/import_seed_seller.py /path/to/seed_seller_3x6_sprite_sheet_fixed.png
```

Pillow is already bundled for offline project tooling; retained dependency evidence is `docs/licenses/Pillow-LICENSE.txt`. No new package, backend, remote runtime load or vendor archive is added.

## AI and rights disclosure

OpenAI Codex assisted with the importer, runtime wiring, tests and documentation. One OpenAI built-in image-generation background-extraction attempt was made using the exact prompt in `PROMPT.md`; it changed the canvas to 1619×971 and was rejected. `rejected-imagegen-extraction.png` is evidence only and never enters the playable build.

The production character source was supplied by the user. Its original creation tool/model and exclusive-rights status were not independently established in this task. The user's integration request is recorded, but final competition eligibility and legal-use confirmation remain a human responsibility. No publication, submission or push was performed.
