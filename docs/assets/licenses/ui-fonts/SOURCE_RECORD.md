# UI font source record — 2026-10-12

Requested by the user: Thaleah headers and m5x7 small UI text, without smoothing or fractional scaling.

| Font | Creator | Official source | Terms |
| --- | --- | --- | --- |
| Thaleah Fat | Rick Hoppmann / Tiny Worlds | https://tinyworlds.itch.io/free-pixel-font-thaleah | CC BY 4.0: https://creativecommons.org/licenses/by/4.0/ |
| m5x7 | Daniel Linssen | https://managore.itch.io/m5x7 | CC0: https://creativecommons.org/publicdomain/zero/1.0/ |

Downloaded the free font files directly from their creators' itch.io pages on 2026-10-12. Thaleah creator's licence statement: “License is CC-BY 4.0”. m5x7 creator identifies the font as CC0 and specifies native TTF sizes 16, 32, 48 and so on. Retained original TTFs under source/, with byte lengths and SHA-256 evidence in manifest.json.

Converted native 16px monochrome glyphs to ASCII PNG/XML bitmap sheets using scripts/build-ui-fonts.py. Empty top rows are removed; the glyph silhouettes are preserved. Binary alpha prevents antialiasing; runtime colour variants recolour existing opaque pixels. Added leading and nearest filtering at runtime. No generated replacement letter shapes, archive, TTF, source page or unused font file enters dist. Four exact runtime font files are allowlisted.

Attribution and source/licence links are accessible in-game under Credits / More art / Fonts. Existing original world lettering remains world artwork; all canvas UI lettering uses these new assets. The user screenshots are layout references; no screenshot pixels enter runtime.
