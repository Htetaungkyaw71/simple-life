# City shop redesign v2 — source and integration record

Date: 2026-10-18

Two selected 1536×1024 RGBA shop concepts were produced with the built-in OpenAI image-generation tool: `output/art/city-shop-redesign-v2/originals/clothing-shop.png` and `output/art/city-shop-redesign-v2/originals/barber-shop.png`. Each used one initial generation and one cleanup edit. Exact prompt summaries, selected generated-source paths and limitations are retained in `output/art/city-shop-redesign-v2/PROMPTS.md` and `SOURCE_RECORD.md`. The tool exposed no model-version identifier.

Selected SHA-256: clothing `3ff48d1ad1b0f642dce0f439fcb20d87f53159494146852c07996118f46201ee`; barber `0ff1595a4f3b6ca116f53637a8725a26ccefdf8ec1858b4b2bb1e3074e34c432`.

The user's screenshots served as scale/style context only; no screenshot pixels were extracted. These files are disclosed as OpenAI-generated/adapted review art, not hand-drawn, CC0, exclusive or guaranteed competition-eligible.

The user later returned approved Pixel Snapper derivatives for runtime use:

- `shop-clothing-sage-awning.png`, 171×119, SHA-256 `3d36939431221fcc7eaa72b7eb8db015c20b4776926412e5cb56cf1f2fc5b78b`
- `shop-barber-blue-roof.png`, 212×139, SHA-256 `8c5c3af3839444e746c5d5340d7b18adf18bc63857149089300470e0bc916d4d`

Those exact native RGBA canvases are preserved under `output/art/city-building-snapper-v2/sources/` and packed without resampling into the local `city-buildings` atlas. They render at nearest-neighbour integer 2×. The original 1536×1024 review sources remain outside `public/` and `dist`; only the packed native derivatives enter the existing production asset path. Collision, doors, routes and runtime verification are now complete. Existing project/third-party licences and credits remain unchanged.
