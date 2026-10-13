# Taller people and town appearance services — 2026-10-13

The user authorizes reference-inspired taller people plus coin-paid clothing and haircuts. The supplied screenshots describe proportions/style only; their pixels, characters and layouts are not copied or shipped.

## Licensed source

- Creator: diamonddmgirl, **24x32 Bases**, https://opengameart.org/content/24x32-bases-0 — explicitly CC0.
- Upstream: Cabbit, https://opengameart.org/content/24x32-bases — explicitly CC0.
- Exact source image: https://opengameart.org/sites/default/files/base%20light%20thin_0.png . Retrieved 2026-10-13; original 153×128 PNG preserved under source/base-light-thin.png.
- Source-page HTML, upstream-page HTML and full CC0-1.0 text retained here. No attribution is required by CC0; both creators are nevertheless credited in-game and in documentation.
- Only the left 72×128 region (three 24×32 poses × four directions) is used. Background removed, face/outline palette adapted, torso/legs extended through whole pixel rows to 24×40. Nine animation slots per direction retain idle/blink, two walking extremes with neutral steps, and three original jump/crouch stages. Physics continues to own jump height.
- Five original clothing designs and four original hair silhouettes produce 20 combinations. Eight town variants include three skin palettes. Original eye, clothing and hair details are deterministic native pixels. No interpolated scaling, source portraits, unused source-pack files or remote assets enter production.

## AI design assistance

OpenAI Codex assisted with design, Python sprite adaptation, gameplay/UI, translation, tests and documentation. The built-in image_gen tool created **design-reference.png** as an original guide; it is not a runtime sprite sheet.

Prompt summary: an original cozy tropical farming-game character design guide; eight adults shown in front/back/left/right views, taller slim 24×40 proportions, smaller heads, crisp pixel outlines and a restrained warm palette, overalls/vest/dress/jackets, transparent background, no text or copied commercial-game designs. Native runtime frames are generated from the CC0 base and original pixel masks in scripts/people_art.py, rather than cutting the generated guide into animation frames. No claim of exclusive copyright is made for AI-assisted imagery.

## Reproduction and scope

Run the project Pillow Python runtime with scripts/people_art.py from the repository. It regenerates boy/girl/appearance PNGs and replaces town-person-* frames while preserving all 698 other atlas cells byte-for-byte. scripts/process-rpg-assets.py calls the same current character generator; scripts/extend-character-art.py retains the seed update and delegates current people to the repacker. The runtime allowlist adds only processed/appearance.png. English/Myanmar fonts, environment source licences and all 27 selected WAVs remain unchanged. Mana Seed assets were excluded because its stated terms conflict with this AI-assisted project; none was downloaded or used.

## Evidence hashes

- `design-reference.png`: `d047492487aa15f9bbcd555acb08ba74bbce6127db0577ea189e4d9bbbc8c983`
- `CC0-1.0.txt`: `a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499`
- `upstream-page.html`: `41bb9b3c125dc7ef5a9ba22babb4f672a879c9fa9994a93ad7d3a7eadab56c11`
- `source-page.html`: `836d55caf2f35c761f50f054ed69026e145dc262a793159a059263974bb6f241`
- `source/base-light-thin.png`: `128245e24355972da82461f11040f2bde294dce8659a991d7ebbc298e3e0c473`
