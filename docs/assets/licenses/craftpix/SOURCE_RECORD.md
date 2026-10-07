# User-supplied Craftpix packs — 2026-10-07

Official primary sources were checked with the web tool on 2026-10-07:

- Hunt animals: https://craftpix.net/freebies/free-top-down-hunt-animals-pixel-sprite-pack/
- Ruins: https://craftpix.net/freebies/free-top-down-ruins-pixel-art/
- Predator plants: https://craftpix.net/freebies/free-predator-plant-mobs-pixel-art-pack/
- Licence: https://craftpix.net/file-licenses/ , **Freebie Products, section 2**.

Section 2 permits use in personal/commercial projects, adaptation and distribution as part of games. Attribution is optional; Simple Life credits Craftpix voluntarily. Art resale and an application that exports reusable artwork are prohibited. Section 3 prohibits use for AI/ML model training/development; this integration uses native PNG extraction for the local game, not model training or generative-image processing. This is a recorded source check and paraphrase, not a replacement licence. Each archive's supplied License.txt points to the official licence URL; untouched copies are included here. Direct HTML retrieval was unavailable, so no downloaded full-page licence copy is claimed.

The user supplied the three ZIPs in Downloads. Copies under `public/assets/vendor/craftpix` are untouched local source evidence; SHA-256 fingerprints and provenance are in `archives.json`. No archive, source PSD/Aseprite, demo, pack preview or unused standalone PNG is emitted in `dist`.

Reproduction: `scripts/craftpix_art.py`, invoked by `scripts/process-rpg-assets.py`. The processed manifest's `craftpixFrames` records each creator/licence/archive/path/native cell rectangle. 258 selected Craftpix frames: 236 four-direction woodland animation cells (Boar idle/walk/run/attack; Fox, Hare, Deer and Grouse idle/walk), 10 ruins and 12 plant idle cells. PNGs retain native pixels; fixed plant crops remove cell padding, never resample. All fit the same two-world-units-per-source-pixel scale. Four waterfall frames are original Codex-assisted source in the same script and are identified under `originalAdditions`, not as Craftpix art.

Boar replaces existing combat sprites. Deer/Hare/Fox/Grouse are sparse fleeing scenery with their actual identities, no combat/rewards. Three plant variants are animated scenery, with no new enemy mechanics. The other 21 combat species remain original project art because these packs do not supply them. Existing LimeZu art retains its independent CC BY 4.0 attribution. All runtime frames share the allowlisted `town.png/json`; the atlas is now 1024×2048. Build remains eight runtime art files.
