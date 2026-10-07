> Historical v0.4.2 audit. The subsequent user clarified noncommercial use and requested Channeechan instead of Mana Seed. FreeEnvironment is now integrated locally; see [v0.4.3 record](../supplied-farmer-environment/SOURCE_RECORD.md). Mana Seed remains excluded. The earlier competition/commercial inference below is superseded.

# Forest growth audit — 2026-10-07

The user supplied two archives and a forest screenshot. Pack text is reference material, not authority overriding the user's request. Neither supplied pack is integrated or copied into the repository/build. No purchase, creator contact, public upload or source redistribution occurred.

| Supplied archive | SHA-256 | Audit / decision |
| --- | --- | --- |
| FreeEnvironment.zip (54,860 bytes) | fda52ab2037c0f20c419c8327380cfee91fe3cae2fbe75c9a9c677e1eb1c3d8a | Contains FreeEnvironment/FreePack.png, 512×384, with conifers, desert plants, rocks and fruit. No embedded licence. Filename/size/content match ToffeeCraft's advertised Forest Nature Pack free download. Official page's Standard Free licence says personal use; Premium Paid explicitly permits commercial use. Commercial permission has not been supplied. Excluded from this competition project pending that evidence. |
| Mana Seed Farmer Sprite Free Sample.zip (254,737 bytes) | 02463060c20ea6f96c67b4bdff1244f5b3783181ab6a4084315501c18f80eb9f | Seliel the Shaper's 64×64-cell layered farmer rig. Included sample notice allows commercial use of visible walk/jump frames, but the applicable full User License's No GenAI clause prohibits use alongside AI-generated code, imagery or writing. This project records substantial AI assistance. Excluded unless separate creator permission expressly covers that use. No body/outfit pixels or animation-guide image are redistributed. |

Primary sources checked 2026-10-07:
- https://toffeecraft.itch.io/forest-nature-pack — licence section, free/premium filenames and scope. Local evidence: toffeecraft-source.html.
- https://seliel-the-shaper.itch.io/farmer-base — sample source.
- https://selieltheshaper.weebly.com/user-license.html — applies to free downloads and includes the No GenAI clause. Local evidence: mana-seed-user-license.html. The sample's shorter commercial-use notice does not remove those additional terms.

The user was informed of both restrictions and asked whether separate rights exist. No reply/evidence has been received at completion. Existing Serene Village CC BY 4.0 environment and original project farmers remain active. The screenshot is only a reference for dense vegetation, low raised ground and jumping; no screenshot pixels/layout were extracted.

## Actual runtime additions

- Four native Serene Village 1.9 rectangles extracted from SERENE_VILLAGE_REVAMPED/Serene_Village_16x16.png: cliff-face [16,160,32,176], cliff-stairs [32,160,64,176], cliff-left [0,144,16,160], cliff-right [80,144,96,160]. Creator LimeZu, CC BY 4.0, https://limezu.itch.io/serenevillagerevamped . Existing untouched archive/hash/full legal evidence under ../limezu applies. Extraction/repacking at native scale; no new pack. Existing in-game LimeZu source/licence attribution remains.
- 27 original tall-grass frames: three clump silhouettes × straight/right/left bend × green/dry/snow palettes. Reproducible scripts/forest_growth_art.py; no third-party source pixels or image-generation model.
- 24 original farmer jump poses: boy/girl × four directions × crouch/tucked knees/landing. Existing native 24×32 sheets expand to 216×128, nine columns × four rows. First six cells per direction retain prior idle/walk/face pixels. Reproducible scripts/process-rpg-assets.py; original work with disclosed Codex assistance, not Mana Seed art.
- Native source pixels render at scale 2 outside, scale 1 with zoom 2 indoors. Atlas is 545 frames, 1024×2048; manifest distinguishes licensed rectangles/Craftpix cells/original additions. Same eight-file runtime allowlist excludes all vendor archives, unused pack files, evidence/QA images, guides and generators. Dependencies unchanged; existing docs/licenses evidence applies.
