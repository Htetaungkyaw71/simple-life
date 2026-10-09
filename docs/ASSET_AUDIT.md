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
