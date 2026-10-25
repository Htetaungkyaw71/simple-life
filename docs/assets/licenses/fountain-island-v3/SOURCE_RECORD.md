# Fountain island v3 — source record

Date: 2026-10-20

Status: review-only; outside `public/`, `dist` and the production runtime allowlist.

## Provenance

- Style/color reference: `/Users/mac/Desktop/Screenshot 2026-10-15 at 3.03.00 PM.png`
- Reference SHA-256: `3a9820f63bb7168700b067974a3f84513d843d85c77f00b81593cb55dcd7c4d4`
- Generator: OpenAI built-in image generation, explicitly requested by the user.
- Selected result: second generation/edit pass.
- Backend model identifier: not exposed by the built-in tool.
- Selected magenta source SHA-256: `1dd2db9c0486d7ac77c442678add0c6fe1059487b785b4e938030c8ebf1e0afd`
- Nearest-neighbor normalized 1024² source SHA-256: `e3029502b12c51dff2565c4f5bc4752f7dfa0cdb49ddc79f59d3de33b56bba29`
- Complete prompt record: `output/art/fountain-island-v3/PROMPT.md`

The screenshot informed palette, camera angle, pixel density, curb treatment and shadow direction only. No reference pixels were copied into the generated composition. The fountain geometry, notched island silhouette and asymmetric five-group planting layout are new.

## Deterministic processing

- `scripts/sample_fountain_v3_palette.py` selects 24 recurring exact RGB colors from the supplied screenshot and writes `palette.png` and `palette.json`.
- `scripts/process_fountain_v3.py` uses Pillow + numpy only: nearest-neighbor scaling, hard magenta extraction, 0/255 alpha, nearest locked-palette mapping without dithering, fit-check compositing, water-mask extraction and six-frame pixel animation.
- Every opaque native sprite/frame pixel belongs to the locked 24-color palette.
- All pixels outside `water_mask.png` remain byte-identical in all six frames.
- The two ripple phases, two falling stream highlights and small water shimmer use only existing palette colors.

## Main deliverable hashes

| File | Dimensions | SHA-256 |
| --- | --- | --- |
| `palette.png` | 144×96 | `eac0e2bed62d07dd400b328c52a3c6a0094b34d9788deab386f89e2bc1fc9cfe` |
| `fountain_island_v3_1x.png` | 192×160 | `e927b6fa17113e31cb5637c0c30754996b97d6d8ba30211c4b64b6ca8cc50fc8` |
| `fountain_island_v3_4x.png` | 768×640 | `2b6b1ca1138ac4d1760dfbe5c70fbc534d8ecbdfa33a8b221ed7edbe95b9675a` |
| `fit_check.png` | 800×600 | `f06fffe7ccd990ad6f6c0e813a3b47600ce3172289d6082921d199e256681358` |
| `water_mask.png` | 192×160 | `6f7eb2b9d6f6968c0fc8573cf6566860dad0adfbfe371d703063bc9023bf85a4` |
| `fountain_v3_sheet.png` | 1152×160 | `5c0e0955647e9945886af4fb50a83f06b3f2057a5ce835dd409fd37e8363c8ff` |
| `fountain_v3_preview.gif` | 768×640, 6 frames | `95185e3d2543864f18e5cfdcd0259b042b8aa1845428832a821c3234f837b681` |
| `fountain_v3_fit.gif` | 800×600, 6 frames | `79aa1668c96ae7c4d99a19b79caa29e9abc7e6df3452b0691012f979ffa288fb` |

This is AI-generated and AI-assisted review art. It is not represented as hand-drawn, CC0, exclusive, or guaranteed to meet competition eligibility. No third-party pack, new dependency, remote runtime asset, deployment or production integration was added.
