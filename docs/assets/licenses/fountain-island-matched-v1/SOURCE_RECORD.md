# Fountain island matched v1 — source record

Date: 2026-10-20

Status: review-only; outside `public/`, `dist` and the production runtime allowlist.

## Sources

- Existing transparent fountain source: `/Users/mac/Downloads/ChatGPT Image 19 Oct 2026, 15_24_26-pixel-snapper.png`
- Source SHA-256: `50f91dc3dc840066f0f292efd17ffed20bdb30a2672468a14ebe5876d1cc2e7b`
- User-supplied game screenshot: `/Users/mac/Desktop/Screenshot 2026-10-20 at 7.51.09 PM.png`
- Screenshot SHA-256: `93e0476f4cb69733dc4fe8e9e85ef6fc623ce68a177c6df190a77b3a4fd9e5fe`
- Deterministic editor: `scripts/match_fountain_island.py`

The existing fountain source originated from the previously recorded OpenAI image-generation review asset. This task did not invoke an image-generation model and did not redraw the object. The screenshot was used only to sample local game colors and shadow direction.

## Pixel operations

- Pillow + numpy only; all masks and shapes use integer coordinates.
- A 24-color target palette is sampled from screenshot plaza, foliage/lawn, water and accent groups, then softened and shifted toward olive.
- Every opaque output pixel belongs to that target palette.
- The source is remapped by nearest weighted RGB distance.
- Alpha is hard 0 or 255; there is no blur or anti-aliasing.
- The fuzzy edge is replaced with a stepped hard silhouette and two-pixel cream curb.
- The bottom path is clipped at the curb, small white/pink lawn noise is reduced, and three flat lower-right shadow crescents use the same palette.
- The comparison uses Pillow `Image.Resampling.NEAREST` at exactly 2×.

## Deliverables

| File | Dimensions | SHA-256 |
| --- | --- | --- |
| `output/art/fountain-island-matched-v1/fountain_island_matched.png` | 213×214 RGBA | `63dc0b2b5ff4cea73448e0e08086d6704ef810d398d8e6e031991e0927a1eb75` |
| `output/art/fountain-island-matched-v1/fountain_island_compare.png` | 1328×762 RGBA | `e57c8fd51975263eeda3027ec2318519db48f1a33cc820df420c1fd067913f56` |

No third-party asset, dependency, remote runtime file, deployment or production integration was added.
