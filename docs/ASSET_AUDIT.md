# v0.22.0 — native run and walk animations (2026-10-13)

The character source audit checks all 1,920 appearance cells and 224 NPC cells against the exact supplied unarmed silhouettes: every original anatomy pixel is retained. Integer 3× world rendering uses native 24×26 source cells. Appearance is 960×1248; town is 1024×1910 with 922 cells. All 698 unrelated town cells are byte-exact against baseline 35303c0. Runtime allowlist and final file hashes are recorded in verification/craftpix-motion; no source archives/unused packs enter production.

---

# v0.21.2 — smaller articulated character atlas

Normal and explicit playtest builds pass with 150 modules. Runtime has 46 files / 12,678,948 bytes / 27 WAVs. The appearance texture is 720×2880; all 858 atlas cells fit 1024×2284. All 698 non-person atlas cells preserve their exact RGBA pixels. No new runtime path, dependency, font or audio. Source sheets, art/motion previews and prompts remain excluded. Fingerprints: verification/character-motion/deployment-files.json.

---

# v0.21.1 — original detailed people runtime audit

Normal and explicit playtest builds pass (150 modules). Runtime is 46 files / 13,007,818 bytes / 27 WAVs. 858 town frames occupy 1024×2414; the appearance texture is 864×3200, within 4096 dimensions. All 698 non-person atlas cells are byte-identical to v0.21.0. New source sheets/prompts and documents stay excluded from runtime; no dependency/font/audio changes or remote assets. Evidence: verification/character-fix/asset-audit.json and deployment-files.json.

---

# v0.21.0 — CC0 character runtime audit

Normal and explicit playtest builds contain exactly **46 files / 12,069,484 bytes / 27 WAVs** (playtest byte count). Only processed/appearance.png is added; boy/girl and 160 town-person cells change. All 698 other atlas cells are byte-identical, and 38 retained runtime files outside the application/atlas/character/HTML change set match the prior release. Town atlas has 858 named cells at 1024×1966. Runtime allowlist excludes the CC0 source PNG/unused portraits, source captures, generated design guide, PDFs, vendor archives and verification screenshots. No new dependency/font/audio or remote asset. Checks/hashes: verification/appearance/asset-audit.json and deployment-files.json. Provenance: assets/licenses/characters/SOURCE_RECORD.md.

---

# v0.20.2 — depth rendering runtime audit

Normal and explicit playtest builds transform 145 modules. The stage contains 45 files / 12,012,852 bytes / 27 approved WAVs. All 43 retained non-HTML/application-JS assets are byte-identical to v0.20.1. Pixel shadows are cached local generated textures and rails are native Graphics; they add no distributed asset files. No source, docs, QA screenshots, unused pack/vendor files or credentials enter runtime. Manifest: verification/pseudo-depth/deployment-files.json.

---

# v0.20.1 — cave removal runtime audit

The feature’s generated textures are removed from source/runtime. Normal and explicit playtest builds each transform 143 modules. The staged playtest has 45 files / 12,010,253 bytes / 27 WAVs; all 43 retained non-HTML/application-JS files are byte-identical to v0.20.0, including fonts, licensed art, audio and notices. No source, documents, vendor archives or credentials enter the stage. Fingerprints: verification/curse-removal/deployment-files.json.

---

# v0.20.0 — generated cave/spirit pixels

The cave and spirits are original in-memory generated textures; no runtime file/allowlist entry is added. Normal/explicit-playtest builds retain 45 runtime files, 27 approved WAVs and byte-identical existing art/fonts/audio/licence notices. Runtime stage excludes source, documents, QA captures, vendor archives, unused packs and credentials. Fingerprints/counts: verification/cursed-cave/deployment-files.json. Full release checks and limits: verification/cursed-cave/README.md.

---

# v0.19.0 — exact Unicode-font allowlist

The original Noto Myanmar TTF and its full runtime OFL notice add exactly two files: assets/pixel/fonts/noto-myanmar.ttf and assets/pixel/fonts/myanmar-license.json. The runtime inventory is 45 files with 27 unchanged approved WAVs, eight unchanged prior art files and four unchanged Latin bitmap-font files. The extended cosy-audio audit verifies the new manifest hash, exact deployed font bytes, copyright and full OFL text. Source/license documents, unused vendor packs, archives, tests, QA captures and credentials remain excluded. Final build fingerprints/counts: verification/myanmar-onboarding.

---

# v0.18.6 — silent-door runtime selection

Retiring the door effect removes its unused WAV from preloading and production. Normal/playtest runtime inventories have 43 files and 27 approved WAVs; eight prior art files, four fonts and notices remain unchanged. Runtime-only deployment excludes source, documents, vendor/unused files, credentials and QA captures. Evidence: verification/silent-doors/README.md.

---

# v0.18.5 — unchanged asset selection

Mobile trade and icon controls change source rendering only. Four approved bitmap font files, eight previous art files and 28 selected WAVs retain their hashes, with full dependency notices. Vendor/source archives, unused packs/fonts, docs and QA captures stay excluded. Current audit evidence: verification/mobile-trade/README.md.

---

# v0.18.4 — font allowlist addition

Only fonts/thaleah.png, fonts/thaleah.xml, fonts/m5x7.png and fonts/m5x7.xml are added to production. Glyph sheets have binary alpha and manifest-verified bytes. Original eight allowed art files and 28 approved WAVs remain unchanged. Source TTFs, vendor archives, documents, QA captures and unused packs stay excluded. The updated cosy-audio runtime audit verifies font hashes/alpha, prior art/audio hashes and dependency notices; see verification/ui-typography/README.md.

---

# v0.17.4 — unchanged runtime asset selection

Outdoor birds reuse existing forest-day WAV; default plants reuse existing atlas bytes. No additions to the 22-WAV/eight-art-file allowlist. Wind and fireplace remain excluded. Existing licences and full dependency notices retained; verification/outdoor-plants/runtime-audit.json validates hashes/format/seams/production exclusions.

---

# v0.17.3 — indoor loop retired

Runtime selection is now 22 WAVs and 34 files total / 11,543,935 bytes. The unused fireplace/room loop is excluded; remaining sample hashes, all eight art files and full dependency notices are unchanged. No new external asset/dependency or archive/unused/source file enters production. Current manifest/audit: verification/quiet-interior.

---

# v0.17.2 — runtime-only material derivatives

No production asset additions. All house variants reuse the original native house frame in memory; source atlas stays unchanged. Seven existing decoration recipe frames and nine coin pieces reuse existing assets/code. New house glyph uses original 9×9 code pixels. Current manifest and selected audio/art/dependency-notice allowlist audit: verification/customize-access. Vendor archives, unused pack files, source/docs/QA and credentials remain excluded.

---

# v0.17.1 — unchanged assets, final static audit

Final runtime audit passes: **35 files / 12,862,528 bytes**, **23 approved local WAVs**, **eight unchanged art files**, full runtime dependency notices. The Add label and direction controls use the existing original bitmap font/pixel-arrow code; no new raster/audio/dependency. Vendor archives, unused pack files, docs/source and credentials are excluded from the staged runtime. Every hosted byte count/SHA256 matches the local final manifest. Evidence: verification/decoration-editing/runtime-audit.json, deployment-files.json and hosted-checks.json; existing asset rights/source records remain.

---

# v0.17.0 runtime inventory

35 explicit runtime files / 12,860,205 bytes, 23 approved WAVs, eight unchanged art files and complete runtime notices. Original house/prop graphics are code-drawn; existing oak/palm/furniture cells retain credits. No external download, new dependency, vendor/unused pack or credential enters production. All staged and public hosted files match exact final SHA256/bytes. Evidence: verification/customization/runtime-audit.json and deployment-files.json; source/AI record: assets/licenses/customization/SOURCE_RECORD.md.

---

# v0.16.6 — removed wind and licensed rooster

Production: **35 files / 12,841,863 bytes**, exactly **23 WAVs** (16 Farm effects, one public-domain rooster, five Nature loops and one title-only music), eight unchanged art files and four app/page/style files. Both wind WAVs, all original scores, unused jingles, source Ogg/archives/HTML/docs stay outside dist. Original sample hashes and art bytes remain unchanged; the new rooster is converted offline from retained public-domain evidence. PCM/peak/DC/seam checks and full runtime MIT notices pass.

Source evidence: assets/licenses/morning-audio and assets/licenses/cozy-audio; current audit and runtime-only deployment SHA256 inventory: verification/sleep-wakeup. Only audited static Build Output files are staged for the existing free playtest project; source/credentials/evidence are excluded.

---

# v0.16.5 — nature ambience and pickup selection

Production: **35 files / 14,980,993 bytes**, exactly **23 supplied WAVs** (15 effects, seven Nature loops, one title-only music track) and eight unchanged art files. Original completion/music WAVs and seventeen unused supplied effects are excluded. All selected PCM/peak/DC/seam/hash checks and full runtime MIT notices pass; no source audio/art bytes or dependencies changed. Evidence: verification/nature-pickups/runtime-audit.json.

Only the exact audited runtime files are staged into Vercel static Build Output. The SHA256 inventory is verification/nature-pickups/deployment-files.json; private access links, credentials, source archives, repository and documentation stay outside the uploaded output.

---

# v0.16.4 — hit policy and hosted runtime-only build

Runtime: **33 files / 15,377,884 bytes**, exactly twenty-one WAVs and eight unchanged art files. Twenty selected supplied files (twelve effects/seven Nature loops/one music) plus the original ending cue. Unused swing/falling sounds are removed from the production allowlist along with other excluded effects. Source hashes/PCM/peak/DC/seams, art identity and full MIT notices pass.

Only these runtime files and Vercel's static Build Output configuration are deployed, with no source archives, source repository, licence/QA documents, credentials, new server functions or dependency. A SHA256 inventory is in verification/hit-feedback/deployment-files.json; hosted-checks.json compares every remote file with this exact build. The isolated staging folder is under /private/tmp; the source checkout was never linked to Vercel and no Git push occurred.

---

# v0.16.3 — restored action effects within the allowlist

Production: **35 files / 15,454,318 bytes**, exactly **23 WAVs** and eight unchanged art files. Twenty-two supplied files (fourteen effects, seven Nature loops, one music loop) plus the original completion cue. Eighteen unused effects remain outside dist. Hash/byte/PCM/peak/DC/seam checks, full runtime MIT notices and art identity pass: verification/restored-effects/runtime-audit.json. No audio/art bytes or dependencies changed.

---

# v0.16.2 — silent interaction effects excluded

Production includes **23 files / 15,172,480 bytes**, with exactly **11 WAVs** and eight unchanged art files. The two successful transaction effects, seven Nature loops, shared music and original ending cue remain allowlisted. Thirty now-unused converted SFX are excluded from dist and preloading; their earlier provenance stays in source. WAV hashes/bytes, PCM limits/seams, retained MIT notices and art identity all pass. Evidence: verification/quiet-actions/runtime-audit.json. Reproduce after building: `AUDIO_QA_OUT=docs/verification/quiet-actions python scripts/qa/cozy-audio-audit.py` with the bundled Python/NumPy runtime.

---

# v0.16.1 — forty selected audio files and retained ending cue

Vite emits exactly 41 local WAVs: 32 selected effect files, seven nature loops, one HuntSounds music loop and the original ending cue. All eight art files remain byte-identical to 0cf62d9. Old five background WAVs, source archives, unused sounds, licence documents and QA evidence do not enter dist. Exact source/runtime hashes, durations, RMS/peaks and loop edge checks: assets/licenses/cozy-audio/manifest.json and verification/cozy-audio/runtime-audit.json. Reproduce with scripts/import-cozy-audio.py (user archives / ffmpeg / NumPy) then npm run build and scripts/qa/cozy-audio-audit.py. No runtime dependency changes.

---

# v0.16.0 — eight targeted replacements and six explicit WAVs

Audit against ce6903a: 858 atlas cells, exactly eight original scenery replacements, 850 untouched cells, unchanged town metadata and seven other art files; pixels outside replaced rectangles unchanged. Eighteen production files, only eight established art paths/six WAV paths plus four shell/bundle files; no archive, source pack, unused file or QA evidence. Reproduce with scripts/qa/story-audio-audit.py; hashes/bytes: verification/story-audio/runtime-audit.json. Audio source and waveform inventory: AUDIO_SOURCES.md. Source-specific permission review: assets/licenses/story-audio/SOURCE_RECORD.md.

---

# v0.15.0 — unchanged runtime art, 2026-10-10

All eight allowlisted art files are byte-identical to local baseline 5681815. New native directional furniture/table/preview graphics are drawn from original source in memory; no atlas, archive or unused file is added. Production contains twelve files / 2,386,453 bytes. Evidence: verification/placement/runtime-audit.json; provenance: assets/licenses/placement.md.

---

# v0.14.0 — unchanged runtime art, 2026-10-10

All eight allowlisted art files are byte-identical to baseline 585ae48. Original lowercase glyphs, heading variants and progress/preview graphics are generated in memory; no new art file or vendor pack enters production. The build contains twelve files / 2,378,165 bytes. Audit and screenshots: verification/chopping-ui; provenance: assets/licenses/chopping-ui.md.

---

# v0.11.0 — Home native cells and production allowlist

scripts/qa/home-mobile-audit.py compares against 4db7b4a: 833 unchanged non-house cells, thirteen modified original houses, twelve appended original home frames (858 total); all earlier frame rectangles and six other runtime art files unchanged. All house alpha footprints are identical while thirteen pixel finishes differ. New cells match original generator output. Production contains exactly eight allowlisted art files and twelve total files, excluding source art, vendor archives, docs and QA. Evidence: verification/home-mobile/runtime-audit.json and assets/licenses/home-mobile/original-cells.json.

---

# v0.10.0 — selected rocky cells, house changes and runtime audit

Exactly eight runtime art files remain allowlisted; town PNG/JSON add eight used native rocky cells and change thirteen original house cells. All 825 other earlier cells/frame rectangles and six other runtime files remain unchanged against ba601de. The atlas has 846 cells. Twelve dist files contain no archive/PSD/unused pack, QA/docs or remote runtime dependency. Provenance: assets/licenses/rocky-depth. Reproduce: scripts/qa/scene-depth-audit.py; report: verification/scene-depth/runtime-audit.json.

All 323 forage, 158 animal, forty discovery and fourteen cache identities survive unchanged. Water/landmark clearings change scenery/tree placement; surviving coordinate identities preserve cuts. 2,846 trees, 75 inland cliff bands/825 faces and nine rocky landmarks remain. No new dependency or schema fields.

---

# v0.9.0 — runtime and progress audit

Eight byte-identical allowlisted art files, 838 retained atlas cells; no new asset/dependency. Seven procedural habitats and 80 dry shelf bands add no raster file. Original Web Audio synthesis adds no recording/network request. Comparison against 2484fba verifies all remaining cut-tree identities, earlier fruit/quiet-animal IDs and unchanged discovery/cache IDs. Trees: 4,070 → 3,195; fruit: 163 → 323; quiet wildlife: 48 → 128 (plus 30 retained boars). Evidence: verification/forest-refresh/runtime-audit.json; reproduction: scripts/qa/forest-refresh-audit.py. Vendor archives/unused packs/QA artifacts remain excluded from dist.

---

# v0.4.9 art allowlist audit
All eight allowlisted production art files match baseline 8275b7f byte for byte; town atlas remains 474 entries. Production is twelve files / 2,008,179 bytes with no vendor archives, source manifests, QA images/scripts or unused packs. Evidence/fingerprints/paths: verification/forest-expansion/build-art-audit.json. No dependency or artwork licence change.

---

# v0.4.7 animal audit
Fifteen newly curated combat species / 419 named animal frames; removed 60 superseded placeholders; total 914 atlas entries. Pixel comparison against c1efdfe verifies all 495 retained frame pixels and other six art files unchanged. Source hashes and exact cell provenance retained. Production: 12 files / 2,258,286 bytes with eight allowlisted art files; no source archives, manifest, generator, licence HTML or QA tooling. Supplied vermin ZIP and unused candidate art excluded. Audit tool: scripts/audit-wildlife-assets.py; result/contact sheets: verification/wildlife-sprites; licence evidence: assets/licenses/wildlife-sprites.

---

# v0.4.6 render-only Forest colour audit
All eight allowlisted runtime art files match v0.4.5 byte for byte. Local cached olive render variants preserve native cell size/alpha and existing source attribution; no new image download, atlas cell, source archive or dependency. Original bridge/ripple/night-rendering code is recorded separately. Production: 12 files / 2,031,148 bytes. Evidence: verification/forest-theme/build-audit.json and assets/licenses/forest-theme.md.

---

# v0.4.5 forest shore audit
Only original palm-tree/willow-tree cells are added (555 atlas frames). All 553 previous frame pixels and both farmer files match baseline 32ea2a3. Same eight runtime art files; production has 12 files / 2,031,270 bytes. Existing pack provenance/credits unchanged; no new download or dependency. Evidence: verification/forest-shore/art-build-audit.json and assets/licenses/forest-shore.md.

---

# v0.4.4 terrain audit
Original code-native ground/river materials; no newly downloaded pack, runtime art file or dependency. [Creation and primary-source candidate survey](assets/licenses/ground-river-materials.md). Existing eight processed art files are byte-identical to v0.4.3; build audit: verification/terrain/build-audit.json. Screenshot references provide style only; no reference pixels/layouts sampled.

---

## v0.4.3 current audit
User-requested Channeechan farmer and local noncommercial FreeEnvironment integration completed; [current source and licence evidence](assets/licenses/supplied-farmer-environment/SOURCE_RECORD.md). Both creators and underlying Eris Esra template credited. Public prize-entry scope for ToffeeCraft remains unconfirmed; historical blocked FreeEnvironment conclusions below are superseded by the user’s clarified scope. Mana Seed remains excluded. Only selected game textures enter production.

# Pass 2 asset audit — 2026-10-04
Only official pack files covered by a clear licence were integrated. No login, purchase, subscription, marketplace preview extraction or image-generation service was used.

| Source / candidate | Evidence | Decision |
| --- | --- | --- |
| OpenGameArt: Kenney Tiny Town | https://opengameart.org/content/tiny-town — creator-uploaded, CC0; optional Kenney credit; official current 1.1 download at https://kenney.nl/assets/tiny-town | Selected single primary environment. Native 16x16 terrain and modular architecture; clear CC0 1.0, downloadable without account. |
| itch.io: Cup Nooble Sprout Lands | https://cupnooble.itch.io/sprout-lands-asset-pack — free version explicitly limited to non-commercial use; commercial licence is premium | Not selected. Avoid a payment or licence decision for this submission. No files downloaded. |
| CraftPix: Free Village Pixel Tileset for Top-Down Defense | https://craftpix.net/freebies/free-village-pixel-tileset-for-top-down-defense/ — PNG/PSD top-down village, royalty-free usage link and download | Evaluated official page; not selected. More detailed defense-game architecture and marketplace terms add unnecessary normalization/redistribution work. No download/login attempted; no claim made that account access is required. |
| GameArt2D Freebies | https://www.gameart2d.com/freebies.html — inspected catalogue | Not selected: offered free terrain packs are primarily side-view platformer art rather than the required 16px top-down town. No files downloaded. |
| PixelLab | https://www.pixellab.ai/ — AI asset generation service with sign-in/trial | Not used: selected pack and original code-authored additions cover this pass. No account created, output generated, or usage-rights assumption made. |
| Kitbitz | https://kitbitz.art/ — hand-drawn illustration library | Not selected: illustration direction conflicts with the source-pixel RPG grid. No individual asset licence relied on and no files downloaded. |

Kenney's Tiny Town artwork is adapted through a documented palette lookup, composite buildings/trees, and atlas packing. Original additions use the same tile grid and palette. Retain the untouched official archive under public/assets/vendor/kenney/tiny-town; only the selected processed atlas is included in production. See ASSET_LICENSES.md and assets/licenses/DOWNLOAD.txt for provenance and hash.
