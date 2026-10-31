# Terracotta gemstone Keepsake pendant — 2026-10-30

The user supplied `Terracotta Gemstone Pendant Sprite-pixel-snapper.png` and requested it replace the former code-drawn Keepsake. The 91×92 RGBA source contains one 36×46 visible pendant at alpha bounds `[30,23,66,69]`.

## Runtime processing

`scripts/import_keepsake_pendant.py` copies the original into this evidence folder and crops transparent outer padding only. The resulting `public/assets/pixel/processed/keepsake-pendant.png` is 36×46. Every visible RGBA pixel is byte-identical to the corresponding source pixel; there is no redraw, recolour, resize, interpolation or image-generation step. Phaser loads it locally with nearest-neighbour filtering.

The source SHA-256 is `aa407e00b2f8da586e0fbc0868c0ace864ac56b2ffcf16b072cbb0c4014c30a3`; the runtime SHA-256 is `920a1b18d1754b9805fa4fe735136b87e3ee387bc3366d934ed3a0f05d5ec728`. `record.json` contains the machine-readable geometry and processing record. Reproduce with:

```sh
python3 scripts/import_keepsake_pendant.py "/path/to/Terracotta Gemstone Pendant Sprite-pixel-snapper.png"
```

## AI and rights disclosure

OpenAI Codex assisted with the deterministic importer, runtime wiring, state correction, verification and documentation. No image-generation tool was used in this task. The filename identifies the supplied file as a Pixel Snapper export; its original creation model/tool chain and exclusive-rights status were not independently established. The user's integration request is recorded, but final legal-use and competition-eligibility confirmation remain the user's responsibility. No publication, submission or push was performed.
