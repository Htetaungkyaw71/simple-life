# Fountain animation v1 — source and transformation record

Date: 2026-10-19

Status: review-only; outside `public/`, `dist` and the production runtime allowlist.

## User-supplied source

- Original path: `/Users/mac/Downloads/ChatGPT Image 19 Oct 2026, 15_24_26-pixel-snapper.png`
- Dimensions: 213×214 RGBA PNG
- SHA-256: `50f91dc3dc840066f0f292efd17ffed20bdb30a2672468a14ebe5876d1cc2e7b`
- Rights: user-supplied AI-assisted Pixel Snapper artwork; the user is responsible for source rights and competition eligibility.
- `output/art/fountain-animation-v1/fountain_static.png` is byte-identical to this source and has the same hash.

No image-generation tool, external download, repainting, blur, antialiasing or new palette color was used.

## Deterministic transformation

[`scripts/animate_fountain_water.py`](../../../scripts/animate_fountain_water.py) uses Pillow and NumPy to:

1. select the exact teal connected pool component, the isolated top-tier water, existing water-effect pixels in three narrow stream corridors, and three landing-ring zones;
2. export the 2,012-pixel review mask;
3. animate offset six-phase rings, wrapped stream highlights, five surface-shimmer pixels and three top-tier shimmer pixels;
4. assert every RGBA pixel outside the mask is identical to the source;
5. assert every visible RGB color belongs to the source's 16-color palette;
6. preserve the complete source alpha channel in every PNG frame; and
7. export the full frames, horizontal sheet, exact static copy and nearest-neighbour 4× GIF.

The optional lily-pad motion is deliberately omitted. GIF frame delays alternate 120/130 ms because GIF stores centiseconds; the six-frame average is exactly 125 ms, or 8 fps.

## Key output hashes

| File | SHA-256 |
| --- | --- |
| `water_mask.png` | `2a5a05e33fe6ff1126aa2b41f0af68d1f8b578972564a88b725904b28eee3b6b` |
| `fountain_f1.png` | `e784bf0a23f35caed24f76378ee2225f8d2a97b43327c5c80382451368f084f8` |
| `fountain_f2.png` | `dc931f2978aa6745b23ef6fc14eb6e114cd722a57b9203dbfdc9c20ebe622a72` |
| `fountain_f3.png` | `3c21fddadb483703b3ac98eff82c60dc33419f0039f054060f5f0dbf99d2bd2a` |
| `fountain_f4.png` | `3f82fa10841ce03bdc00ce2c4e9c30d1278ea735e2626fbdd2fdc4ba0826acb1` |
| `fountain_f5.png` | `270f8e79483b009626f873ca96a60932042a56c7d62c492930b48b41db9553ac` |
| `fountain_f6.png` | `d0d84a2fce0a7377f4898d3bf48832f0bfcd19b281ae98b146b1887afa6101ff` |
| `fountain_sheet.png` | `af8b5b8a98a77178ad94040dbced730074cf9bb357aacc975e8d250f5d2990d4` |
| `fountain_preview.gif` | `e30eff0c9770f84c6dc94b55c770ff1f19824bdf82a77c2017c250342c7243bc` |

## Limitations

The animation and source remain disclosed AI-assisted art and are not represented as hand-drawn, CC0, exclusive or guaranteed competition-eligible. Human review of `water_mask.png` remains required before runtime integration.
