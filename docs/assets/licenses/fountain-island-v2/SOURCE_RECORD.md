# Fountain island v2 — source record

Date: 2026-10-19

Status: review-only; outside `public/`, `dist` and the production runtime allowlist.

## Source and generation

- Style-only reference: `/Users/mac/Desktop/Screenshot 2026-10-16 at 9.30.31 PM.png`
- Reference SHA-256: `db0f40db9ab4373f7056d52a9573bb770f2234fa33ad5aacb589176b0a3c6b33`
- Generator: OpenAI built-in image generation, explicitly requested by the user.
- Backend model identifier: not exposed by the built-in tool.
- Magenta-backed generated source: 1254×1254 RGB PNG, SHA-256 `1786a3521ba56ebe83f4045af80b1c6027906976293b140c1522756690fba42c`.
- Transparent extraction source: 1254×1254 RGBA PNG, SHA-256 `a3726103a7875bb149721510a80895921eae2eb83cb673591266a57629693287`.
- Complete prompt record: [`output/art/fountain-island-v2/PROMPT.md`](../../../../output/art/fountain-island-v2/PROMPT.md).

The reference was used only for general pixel density, outline thickness and cozy mood. The requested silhouette, fountain geometry, plants, palette and asymmetrical composition are original and intentionally different. No reference pixels were copied directly into the deliverable.

## Delivered file

| File | Dimensions | Pixel format | SHA-256 |
| --- | --- | --- | --- |
| `output/art/fountain-island-v2/fountain_island_v2.png` | 1024×1024 | RGBA, transparent | `d0140d6dae834aaf0203db28373e52fd105ccea984d77e5b6cbccb79fa6f20ce` |

The final deliverable was resized from its generated transparent 1254×1254 source using FFmpeg nearest-neighbour scaling (`scale=1024:1024:flags=neighbor`). Alpha-channel analysis confirms values from 0 through 255. No repainting, palette conversion or compositing was applied after generation.

## Rights and limitations

This is AI-generated review art. It is not represented as hand-drawn, CC0, exclusive, or guaranteed to satisfy any competition's eligibility rules. The user must approve it before runtime integration. No third-party pack, font, dependency or remote runtime asset was added.
