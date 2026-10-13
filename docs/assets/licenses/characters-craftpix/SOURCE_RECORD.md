# Retired active people artwork — v0.23.0

Original Szadiart finished presets now supply player/NPC textures. This CraftPix record remains historical provenance and does not describe the current people. See ../characters-szadiart/SOURCE_RECORD.md.

---

# v0.22.1 — human proportions and clearer character artwork (2026-10-13)

This revision supersedes the v0.22.0 geometry below. Original PNGs/archive hashes/licence evidence are unchanged. Each supplied body pose uses one global source-y mapping: output y = 35 - round((44 - source y) × 1.8); each source row occupies its mapped interval. Source x uses fixed offset 20. Original small heads, faces, hair and garment accents follow the source neck/torso position. This is offline nearest pixel retargeting, not unchanged source anatomy/head retention and not synthetic independent limb animation. Every run/walk phase remains supplied. Native 24×36 cells render at integer 2×; standing boy ink 62px. Appearance 960×1728, town 1024×1970, boy/girl 576×144. Native-centred source grips are generated in world units. All 20 combinations, eight residents, frame layout, timings, identity/price/save IDs remain. Body-alpha, nonperson preservation, runtime previews and browser evidence: ../../../verification/character-proportions/README.md.

---

# CraftPix character bases — supplied 2026-10-13

Official sources:
- [Male base](https://craftpix.net/freebies/free-base-4-direction-male-character-pixel-art/)
- [Female base](https://craftpix.net/freebies/free-base-4-direction-female-character-pixel-art/)
- [CraftPix file licence](https://craftpix.net/file-licenses/), section 2, checked 2026-10-13.

The user supplied the complete ZIPs after the automated archive downloads failed. ZIP CRC checks passed. `sources.json` records original archive names/SHA-256 and the exact selected PNG paths/hashes. Both untouched License.txt files point to the official licence page. The custom freebie licence allows personal/commercial game use, modifications and game distribution; attribution is optional and provided. Standalone art resale/export and AI model training/development are excluded. Assets are processed as local game sprites, not through image generation or model training. This record paraphrases the terms, not a replacement licence.

Selection: only unarmed Idle, Run and Walk. Each uses the supplied body/head part sheets and its without-shadow comparison PNG. All cells are 64×64. Source directions are front/right/left/back. Run has eight visible poses in every direction; Walk has six. Idle has twelve front/side poses but only four back poses (the remaining back columns are transparent). No empty source column is played. Source shadows, swords, attack/hurt/death, PSD/Aseprite, pack previews and archives stay out of runtime.

Reproduce: bundled Python/Pillow or compatible Python + Pillow, `python3 scripts/people_art.py`. Native source pixels use fixed crop [20,18,44,44], source direction rows [0,3,2,1], 24×26 frames and nearest integer 3× world scale. Garments recolour source body pixels; native dress hem, hair/braid/waves and Rowan's hat are original Codex-assisted additions. Head/limb positions remain source-authored; no resampling, waist cutting, limb warping or independently centered frames. Jump uses existing run poses 1/3/5 with the established world jump arc and is clearly an adaptation. Source-derived hand grips retain current local tool size.

Appearance: five outfits × four hair choices, 96 linear frames per style. Direction stride 24: idle 0–11 (back 0–3), run 12–19, jump 20–22; reserved 23 contains a real run pose. All local save style IDs, prices and ownership remain. NPCs: eight identities, four directions, stand 0 and six walk frames 1–6. Runtime appearance 960×1248; town 1024×1910; individual boy/girl 576×104. No new runtime path/dependency.

The source audit checks all 2,144 processed people cells against the supplied silhouettes, retains every original anatomy pixel and preserves all 698 unrelated town cells. Credits in game identify CraftPix and original clothing/hair adaptation. Previous CC0/generated sheets are retired historical evidence, not current base art. Checks and actual runtime animation preview: ../../../verification/craftpix-motion/README.md.
