# Nell and Sol matching NPC standing designs — 2026-10-14

The user accepted the proposed gradual NPC-art update: start with Nell and Sol, review standing appearances first, then create directional idle/walking animation and integrate approved artwork. This package completes the first appearance-review step. These new frames are not yet used by the playable game.

Two original transparent sheets were generated with OpenAI's built-in imagegen tool; model version was not exposed. The approved paired farmer image (`output/art/farmer-girl-v2/previews/paired-idle-8x.png`) supplied style and proportion reference only. No existing third-party NPC sheet or external game's artwork was used as a generation input. Nell is a clothes merchant with dark wavy bob, ochre clip, rose blouse, terracotta apron and charcoal trousers. Sol is a hair stylist with short dark hair/grey streak, muted teal vest, ivory sleeves, charcoal trousers and small leather belt pouch.

Exact final prompts:

- `output/art/npc-matching-v1/nell-prompt.txt`
- `output/art/npc-matching-v1/sol-prompt.txt`

Original outputs are retained byte-for-byte in `output/art/npc-matching-v1/source/{nell,sol}.png`; source hashes and crop/registration metadata are in [record.json](record.json). `scripts/npc_matching.py` performs alpha128 conversion, whole-character proportional nearest sampling to40visible native pixels,32-colour-per-view palette reduction and64×64transparent padding with ground(32,56). No isolated eye/body/limb pixel is painted or displaced. Both front pupils remain exactly1×2native pixels. Four standing directions per NPC are supplied; no animated motion is claimed.

Original farmer/NPC/runtime PNGs and resident code remain unchanged. The review comparison and HTML page are offline/local developer artefacts, excluded by the existing production allowlist. Existing bundled offline Pillow12.3.0is used; its licence is `docs/licenses/Pillow-LICENSE.txt`, with existing export evidence under `docs/licenses/farmer-extension-export/record.json`. No new dependency, runtime asset path, remote service call from the game, publication or submission.

[Previously reviewed OpenAI output-use source record](OUTPUT_TERMS.md) is retained with this package. Generated output is disclosed as AI-assisted; it is not CC0 or a guarantee of exclusive copyright, competition acceptance or human authorship. User appearance review remains pending before animation/integration.
