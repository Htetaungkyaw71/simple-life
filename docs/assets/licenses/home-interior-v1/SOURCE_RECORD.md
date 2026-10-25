# Approved home-interior collection — 2026-10-16

The user approved the separate 16-object review collection, then approved the standalone structural preview. The final instruction removes the freestanding terracotta storage jar, moves the firewood a little back toward the wall, and explicitly authorizes game integration. Earlier review-only gates are superseded for this accepted work. No new furniture or character was generated during integration.

## Sources and exact transformations

The collection used 22 built-in imagegen calls including corrections. All 22 generated originals remain in `output/art/home-interior-v1/originals`; the 16 selected full-resolution PNGs plus the separately approved table source remain in `output/art/home-interior-v1/sources`. No original is overwritten or reduced. Exact prompts, returned paths and source SHA256 records are alongside this record in prompts.json, generation-paths.json, the correction JSONs and runtime-export.json. The already approved table source has SHA256 d913edbc9fd6b7634ca98b6e0644c913386058b98b6623eabf71a3b3d96f735f; its design is reused, with no new table generation. The old 32×24 trial remains untouched in the preceding town atlas.

scripts/export_home_interior.mjs creates separate runtime derivatives: alpha-bound fitting, uniform aspect-preserving native sampling, a nine-sample material-area vote that chooses existing source RGB, binary alpha and two native pixels of transparent padding. It applies no material recolour or new painted detail. The dining rug has a larger runtime floor extent to encompass both bench footprints. Source canvases are preserved independently. The fire and fireplace use the same source crop and native canvas, so their frame origins match exactly. Export dimensions and original source hashes are in runtime-export.json. Visible alpha bounds are recorded in src/data/homeInteriorArt.js for placement.

The 17-frame,512×512 local home-interior PNG/JSON atlas is separate from town. The jar and earlier U-threshold remain preserved in the source/native/atlas files but have no room instance or collider. Floor-standing plants and tabletop cups/jug remain. No unchanged town/world/farmer art is repacked. The previous complete runtime art is archived in output/art/home-interior-v1/before-runtime.zip.

## Architecture and approval

approved-structure-placement.json records the user-approved standalone placement. Original integer-pixel architecture in src/art/homeInteriorSurface.js reconstructs the accepted cream plaster, restrained peach trim, continuous cutaway sides, quiet terracotta tiles and flush wooden threshold. No reference-game floor, wall, sprite, decorative motif, character, text or layout is extracted. The reference is visual guidance; the original Simple Life arrangement retains left dining, right sleeping, back storage/hearth and bottom exit. Art remains at its approved scale and camera; collision masks, bed/hearth approach points and the reserved door opening share the new geometry.

The QA-only offline layout includes the user's existing Simple Life character crop to compare scale with the accepted screenshot. That crop is never loaded by the playable game. Runtime character PNGs, animation, rig and camera remain unchanged.

## Rights and dependency evidence

This is disclosed AI-generated/adapted project artwork, not CC0 or guaranteed exclusive/human-created artwork. OUTPUT_TERMS.md retains the existing service-output-use evidence reviewed on 2026-10-13; no fresh legal eligibility certification is made. Existing PNGJS MIT evidence under docs/licenses/farmer-approved-export and previous Pillow/tool evidence apply. No npm/runtime dependency is added. Original licensed art/character/font/audio families retain all earlier credits. Source PNGs, originals, archives, prompts, screenshot crops, scripts and review pages remain outside the explicit production allowlist. Only the separate home-interior atlas PNG/JSON are added to its existing local paths. No runtime remote artwork, push, deployment or publication.
