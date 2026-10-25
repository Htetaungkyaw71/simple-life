# One approved outdoor planter-bench — 2026-10-16

The user approved the revised vertical planter-bench and explicitly asked to add it to the game for inspection. This integration changes one fixed City planted bench, below the seed stall and left of the fountain. The five other planted benches, catalogs, purchased/saved pieces and the approved home remain unchanged. No new generated variation, gameplay interaction or purchase requirement is introduced.

## Original artwork and prompts

Two earlier built-in imagegen calls produced the initial horizontal design and the human-directed vertical-footprint/camera edit. Both full-resolution originals are preserved in output/art/planter-bench-v1. The selected vertical original is1536×1024, SHA256 cdea9eba1cb56522dc3a240a59c2a45e461eeadeb95bfe140e4a44d17064fb48. prompt.json and vertical-edit-prompt.json retain exact prompts and input roles; vertical-edit-record.json retains the original generated-output path. The town reference guides projection/materials only. No reference scene, exact prop pixels, character, interface, text or layout is extracted.

## Runtime derivative

scripts/export_planter_bench.mjs fits visible alpha bounds410,36–1126,964 into64×83 native artwork with two pixels of transparent padding, for a68×87 frame. Nine source samples per native pixel vote by nearby colour; the selected RGB is copied from the source. No palette recolour, redraw, nonuniform squashing, diagonal image rotation or original-file shrinking is performed. Alpha becomes binary and the derivative renders nearest at1.5×:102×130.5 world canvas. This preserves readable north–south seats/planting beside the existing adult rig. It is a separate runtime derivative; the original1536×1024 PNG remains untouched.

One frame appends to town. All1040 preceding frame records and the entire preceding RGBA region are exact. The atlas becomes1024×3693, below4096. The one City instance at433,516 uses this frame with a shared96×94 ground mask at436,548. Both market lanes/side approaches stay clear; old128×62 mask is removed. The renderer omits its ordinary shadow for this object, so no glow, halo or surrounding shading is added. Existing character/camera and UI remain.

Original sources, native derivative, preceding town PNG/JSON and before-runtime-art.zip remain under output/art/planter-bench-v1. Build only emits the existing local runtime atlas URLs. No source archive, review image, prompt, test, vendor pack or unused source file enters production.

## Source terms and disclosures

Disclosed AI-generated/adapted project art, not CC0 or guaranteed exclusive/human-created work. OUTPUT_TERMS.md is the retained original service-output evidence reviewed2026-10-13. Existing PNGJS MIT and Pillow/export tool evidence applies; no new dependency. Previous character, nature, font, audio and licensed pack credits remain. No backend, runtime remote asset, push, deployment or publication. Browser playtesting remains unverified because the existing browser URL security policy in this conversation rejected localhost automation and prohibited workarounds; no bypass was attempted.
