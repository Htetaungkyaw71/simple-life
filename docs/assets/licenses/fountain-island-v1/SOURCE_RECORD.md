# Fountain island v1 — source record

Date: 2026-10-19

Status: review-only; outside `public/`, `dist` and the production runtime allowlist.

## Source and generation

- Style/composition reference: `/Users/mac/Desktop/Screenshot 2026-10-16 at 9.30.31 PM.png`
- Reference SHA-256: `db0f40db9ab4373f7056d52a9573bb770f2234fa33ad5aacb589176b0a3c6b33`
- Generator: OpenAI built-in image generation, explicitly requested by the user.
- Backend model identifier: not exposed by the built-in tool.
- Plaza source output: 1254×1254 RGB PNG.
- Transparent source output: 1254×1254 RGBA PNG produced as a background-extraction edit of the plaza source.
- Complete prompt record: [`output/art/fountain-island-v1/PROMPT.md`](../../../../output/art/fountain-island-v1/PROMPT.md).

The reference guided general style, palette, density and composition. No reference pixel was copied directly into the deliverables.

## Delivered files

| File | Dimensions | Alpha | SHA-256 |
| --- | --- | --- | --- |
| `output/art/fountain-island-v1/fountain_island.png` | 512×512 | no | `95740341d87bc8c31bc3517788b249ae14bcf7091cf05a41fd439787167a2758` |
| `output/art/fountain-island-v1/fountain_island_transparent.png` | 512×512 | yes, RGBA | `c6ad1e93bcc32a36b8a5c45cc48314960620eca425c5798521497c73594d6a97` |

Both deliverables were resized from their generated 1254×1254 sources with FFmpeg nearest-neighbour scaling (`scale=512:512:flags=neighbor`). No repainting, palette conversion or compositing was applied after generation.

## Rights and limitations

These are AI-generated review assets. They are not represented as hand-drawn, CC0, exclusive, or guaranteed to satisfy any competition's eligibility rules. The user must approve them before any runtime integration. No third-party pack, font, dependency or remote runtime asset was added.
