# Cucumber, grapes and wild-berries item-icon repair — 2026-10-26

## Source and rights

One 1254×1254 four-icon source image was created with the OpenAI built-in image-generation tool; the service did not expose a model version. The three previously generated item sheets were supplied to the tool as style references only. This is AI-assisted/generated artwork, not a claim of human-only authorship, exclusivity, CC0 status, or independent competition eligibility. The user remains responsible for supplied-reference rights and competition acceptance.

The exact generated source is retained at `output/art/item-icon-repair-v1/generated-2x2.png` and copied byte-for-byte to `source.png`. `manifest.json` records its SHA-256, the detected logical-grid evidence, native sizes, palettes, mappings and output hashes.

## Prompt

Use case: stylized-concept. Asset type: one source sheet for top-down farming-game pixel item icons. Image 1 was the seed-packet style reference; Images 2 and 3 were the produce/food style, pixel-density, colored-outline and shading references. Generate exactly one square 2×2 image on flat `#FF00FF`, with wide gaps, no text, frames, grid lines, shadows, soil or extra objects; strict hard square pixels, limited palette, no antialiasing, blur, gradients, translucent pixels or black outlines; top-left light. Top left: cucumber seed packet matching the existing dark-olive/olive/cream/tan packet construction, with a long striped cucumber emblem. Top right: a slender glossy cucumber at about 30 degrees, at least 3:1, with a lighter stripe, bumps, dried yellow flower tip and short stem. Bottom left: filled glossy blue-violet grapes using `#5A4AA8`, `#3B2D78` and `#8C7CD6`, dark indigo outline, brown stem and green leaf, with no pink/magenta. Bottom right: filled blackberry-style wild berries using `#2E2238`, `#4D3A5E` and cool blue-gray highlights, dark outline, green calyx/leaf and no bright pink/magenta. The three produce icons should have comparable visual weight to the existing carrot and strawberry.

## Native conversion and mapping

`scripts/process_item_icon_repair.py` identifies the object in each generated quadrant, removes only recorded magenta-background variations connected to the outer background, audits the repeated preview-cell cadence, area-votes whole source regions into native cells, locks each result to a small explicit palette, applies the shared `SATURATION_SCALE=0.78`, `HUE_SHIFT=8` and `LIGHTNESS_SCALE=0.94` foliage transform, and writes binary-alpha 24×24 runtime frames. The Cucumber fruit body is protected as green fruit; packet greens and the grape/berry leaf pixels use the shared transform, while violet, plum and other non-green pixels remain unchanged. It performs no filtered resize, blur, antialiasing or runtime fractional scaling. The resulting true sizes are 19×24 Cucumber packet, 18×14 Cucumber produce, 17×19 Grapes and 18×18 Wild Berries. Cucumber's principal-axis ratio is 3.039. No output palette contains magenta.

Mappings are `cucumber-seed-item`, `cucumber-item`, `grape-item` and `wild-berry-item`. `grape-item` is already shared by the Produce and Food tabs, so the one repaired frame appears in both. The Wild Berries frame also supplies the existing Food tab button through its unchanged item reference. No gameplay item ID, crop rule, price, count, save field, slot size or UI layout changed.

