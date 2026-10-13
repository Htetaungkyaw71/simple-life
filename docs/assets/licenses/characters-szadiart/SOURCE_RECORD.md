# Szadiart original character pack — v0.23.0

Artist: Szadi art. Official page: https://szadiart.itch.io/3-direction-npc-characters. Local supplied archive: NPC_Characters_v1.0.zip from the user’s Downloads; ZIP CRC check passed. SHA-256 and selected paths are in sources.json. Six original 256×576 PNG sheets, untouched _INFO.txt and _license.txt are retained here. PSDs and raw vendor archive are not runtime assets.

The custom included License for Everyone permits personal/commercial game use, modification and distribution of game works; standalone original/modified asset resale and logo/trademark/service-mark use are excluded. Credit is optional and provided in the game. This is not CC0. Read the original _license.txt for exact terms.

Each sheet has four complete variants. A variant has left/front/back rows, each with four idle and four walk frames in native 32×48 cells. Fixed crop [4,2,28,42] produces 24×40 cells without losing opaque pixels. The side row alone is mirrored for right facing. Only source black alpha-77 baked shadow pixels are removed because the game already renders grounded shadows. Transparent RGB is irrelevant; every opaque RGBA pixel remains exact. No body resampling, head redraw, clothing tint, limb warp, image generation or animation synthesis.

Player outfit mappings: worker→Male4, gardener→Female2, copper→Male2, plum→Female1, forest→Male1. Legacy saved hair IDs midnight/copper/chestnut/golden map to complete variants 0/1/2/3, now shown as Classic/Coastal/Autumn/Evening looks. Twenty finished preset combinations preserve saved purchases and prices. Default boy: Male4 variant0; default girl: Female2 variant2.

NPCs 0–7: Female2/0, Female2/2, Female1/0, Male2/1, Male3/0, Male1/0, Female1/2, Female1/3. Rowan’s source back walk repeats one image: four slots, three unique pictures. All other active direction cycles have four unique walk images. No invented extra pose.

Player frame layout per direction: idle0–3, walk4–7, jump compatibility8–10 selects original walk5/7/5; reserve11 selects idle0. The jump arc and tool swing effects are existing runtime motion, not authored jump/action art. Original hand skin pixel centres are extracted for each of 20 complete presets × four facings × twelve slots. NPC stand uses source0 and walk uses source4–7. Pixel audit covers 960 player and 160 NPC cells, plus all 698 nonperson town cells retained exactly from ffaa375.

Packing: scripts/people_art.py. Native audit and rendered contact sheets: docs/verification/szadiart-people/. Runtime allowlist remains processed boy/girl/appearance/town PNG and metadata only; source PNG sheets, licence documents, ZIP and PSD never enter production builds. Original artist art is third-party licensed work; Codex assistance covers integration/code/QA, not creation of these pixels. Earlier character provenance remains historical.
