# 2026-10-24 — Strawberry snapped-sheet review source

The 361×121 source is a user-supplied AI-assisted Pixel Snapper PNG. Deterministic cleanup and its 48×38-frame candidate remain outside `public/`, `dist` and the runtime allowlist pending approval. The candidate uses 14 source-exact opaque colours with binary alpha; only two exact magenta-family colours, repeated baked ground/base pixels outside the seed stage and two isolated pixels were removed. The user is responsible for rights to the supplied source; no CC0, exclusivity, human-only authorship or competition-eligibility claim is made. [Exact source hash, measurements, transformations and reproduction command](assets/licenses/strawberry-import-v1/SOURCE_RECORD.md).

---

# 2026-10-24 — approved Tomato snapped icons in runtime

The approved 24×24 `tomato-item` and `tomato-seed-item` frames are now stored in `public/assets/pixel/processed/town.png` under their existing keys. They retain the exact non-magenta pixels from the user-supplied AI-assisted Pixel Snapper source; Phaser applies nearest-filtered Tomato-only display scaling. All rights and competition-eligibility qualifications from the review record remain unchanged. [Exact source, hashes, measurements, transformations, and runtime status](assets/licenses/tomato-icons-v1/SOURCE_RECORD.md).

---

# 2026-10-24 — Tomato snapped icon review candidates

The 108×74 source is a user-supplied AI-assisted Pixel Snapper PNG. Deterministic review processing removes only the magenta background and pads the three retained sprites into 24×24 transparent frames without changing their colors or shapes. These candidates remain outside the production atlas and runtime allowlist pending approval. The user is responsible for source rights; no CC0, exclusivity, human-only authorship, or competition-eligibility claim is made. [Exact source, hashes, measurements, and transformations](assets/licenses/tomato-icons-v1/SOURCE_RECORD.md).

---

# 2026-10-24 — Tomato snapped-sheet review candidate

The 379×123 source is a user-supplied AI-assisted Pixel Snapper PNG. Deterministic cleanup and Candidate B remain outside `public/`, `dist` and the runtime asset allowlist pending user approval. The retained plant pixels keep their exact source RGB values; only keyed background/fringe, the repeated baked ground mask and one isolated pixel were removed. Candidate A was not generated because the sheet is not a uniform 2× enlargement. The user is responsible for rights to the supplied source; no CC0, exclusivity, human-only authorship or competition-eligibility claim is made. [Exact source hash, measurements, transformations and reproduction command](assets/licenses/tomato-import-v1/SOURCE_RECORD.md).

---

# 2026-10-24 — Tomato runtime refinement v3

The same eight existing 24×32 Tomato plant cells and two existing 16×16 Tomato icon cells were refined again as original deterministic Pillow art. The five user-supplied screenshots informed broad style qualities only; no screenshot pixels, individual sprite layout, watermark, UI or downloadable pack asset was copied or shipped. The screenshot material is not treated as a licensed source. The prior v2 strip is retained only as development evidence outside `public/` and `dist`.

No new third-party licence, image generator, external download, font, audio, dependency or runtime file applies. The current atlas keeps the same ten keys, rectangles and byte-identical metadata, and no other crop cell changes relative to v2. [Exact scope, reference role, hashes and reproduction record](assets/licenses/tomato-redesign-v3/SOURCE_RECORD.md).

---

# 2026-10-24 — Tomato runtime refinement v2

The same eight 24×32 Tomato plant cells and two 16×16 Tomato icon cells were refined as original Codex-assisted deterministic Pillow art. No other crop output differs from the preserved preceding generator. The current atlas retains the same ten frame names, rectangles and metadata; the targeted paste changes pixels only inside those cells. The previous eight-frame Tomato strip is retained under `docs/assets/licenses/tomato-redesign-v2/` solely for development comparison and is excluded from the production build.

No new third-party licence, image generator, download, font, audio or dependency applies. Existing mixed-atlas qualifications and the production allowlist remain unchanged. [Exact scope, hashes and reproduction record](assets/licenses/tomato-redesign-v2/SOURCE_RECORD.md).

---

# 2026-10-24 — Tomato runtime redraw

The eight existing 24×32 Tomato plant cells and two existing 16×16 Tomato icon cells were redrawn as original Codex-assisted, deterministic Pillow art. Source: `scripts/crop_art.py`; runtime pack: `public/assets/pixel/processed/town.png`. No other crop, frame name, atlas rectangle, metadata entry, source pack or third-party pixel was changed by the targeted repack. The seed packet retains the established original project packet shell and replaces only its inner emblem with the new Tomato icon. The Carrot comparison shown by the development review page is read-only and remains unchanged.

No new third-party licence, image generator, download, font, audio or dependency applies. The two review studies are derived in memory and are not production assets. Existing mixed-atlas creator qualifications and the production allowlist remain unchanged. [Exact keys, coordinates, hashes and regeneration note](assets/licenses/tomato-redesign-v1/SOURCE_RECORD.md).

---

# 2026-10-23 — Mystical Forest River welcome background

`public/assets/pixel/processed/welcome-mystical-river.png` is an OpenAI built-in image-generation output created for this project from two user-supplied style/composition references. It is preserved unchanged at 1672×941 and loaded locally as `welcomeMysticalRiver`; responsive scaling and animation overlays are Phaser code, not raster edits. The asset is disclosed generated artwork and is not represented as hand-drawn, CC0, exclusive or guaranteed competition-eligible. [Exact prompt, SHA-256, source roles, output-use reference and limitations](assets/licenses/welcome-mystical-river-v1/SOURCE_RECORD.md). No third-party download, remote runtime asset or new dependency was added.

---

# 2026-10-21 — generated ground-grass review candidates

Three original 128×128 lawn candidates are OpenAI built-in image-generation outputs, corrected once each and deterministically converted with Pillow/NumPy to a locked palette and seamless hard-pixel edges. The user's project screenshots supplied scale/palette context; three third-party screenshots supplied general mood/density reference only. The candidates remain outside `public/`, `dist` and the production allowlist pending approval. They are not represented as CC0, exclusive, human-only artwork or guaranteed competition-eligible. [Source, prompt, transformation and checks](assets/licenses/ground-grass-review-v1/SOURCE_RECORD.md).

---

# 2026-10-21 — user-supplied barber chair and grass v2

The active barber chair and small ground-grass tuft derive from two AI-assisted Pixel Snapper PNGs supplied directly by the user with an explicit integration request. A deterministic local Pillow/numpy importer removes magenta, nearest-scales the chair/grass into their exact preceding frame bounds, and derives two same-size grass bend frames by integer row shifts. No antialiasing, remote asset, new runtime file or dependency is introduced. Source copies, hashes, processing, runtime hashes and competition-use limitations are recorded in [the source record](assets/licenses/barber-grass-v2/SOURCE_RECORD.md). Final rights/eligibility acceptance remains the human team's responsibility.

# v0.43.4 — user-supplied fountain animation derivatives

The source is the user's 213×214 AI-assisted Pixel Snapper fountain PNG. The six PNG frames, mask, sprite sheet, preview GIF and byte-identical static copy are deterministic local derivatives made with Pillow/NumPy; no image-generation tool or external source was used. Every frame retains the source palette and alpha, and all pixels outside the reviewed water mask are byte-identical. The assets remain outside the runtime allowlist pending mask/animation approval. Exact provenance, transformation and hashes are in [the source record](assets/licenses/fountain-animation-v1/SOURCE_RECORD.md); build-tool dependency evidence is in [the dependency record](licenses/fountain-animation-v1/DEPENDENCIES.md).

The user is responsible for source rights. No CC0, exclusivity, human-only authorship, legal-eligibility or competition-acceptance claim is made.

---

# v0.43.3 — original fountain-island v2 review asset

`output/art/fountain-island-v2/fountain_island_v2.png` is a 1024×1024 transparent RGBA OpenAI built-in image-generation output created at the user's request. The supplied screenshot was a style-density reference only; the actual island layout, octagonal fountain, asymmetrical planting and palette are newly generated. The file remains outside `public/`, `dist` and the runtime allowlist pending approval. Generation sources, prompt, nearest-neighbour resize, alpha validation, hashes and limitations are documented in [the source record](assets/licenses/fountain-island-v2/SOURCE_RECORD.md). It is not represented as hand-drawn, CC0, exclusive or guaranteed competition-eligible.

---

# v0.43.2 — generated fountain-island review assets

The 512×512 plaza-backed and transparent fountain-island PNGs are OpenAI built-in image-generation outputs created at the user's request from the supplied style/composition reference. They remain outside `public/`, `dist` and the runtime allowlist pending user approval. Their generation source, nearest-neighbour resize, dimensions, alpha status, hashes and AI-art limitations are documented in [the source record](assets/licenses/fountain-island-v1/SOURCE_RECORD.md). They are not represented as hand-drawn, CC0, exclusive or guaranteed competition-eligible.

---

# v0.43.1 — clothing rack runtime source and barber-chair review

The 183×124 `snapper-clothing-rack-v3` runtime frame is the user's AI-assisted Pixel Snapper PNG, packed byte-identically and scaled only by Phaser. [Exact source/hash/runtime record](assets/licenses/clothing-rack-v3/SOURCE_RECORD.md). The 1193×1319 barber-chair candidate is an OpenAI built-in image-generation output and remains outside production pending user approval. [Generation/reference/hash record](assets/licenses/barber-chair-review-v2/SOURCE_RECORD.md). The fountain reshape and placement are code/data changes using existing credited sprites; removed Home benches and road signs add no licence. No third-party pack, dependency or remote runtime asset was added.

---

# v0.43.0 — approved shop-interior Pixel Snapper objects

Eight user-supplied transparent Pixel Snapper PNGs extend the local atlas from 38 to 46 complete native canvases. They are user-processed versions of the previously disclosed OpenAI-generated clothing/barber review concepts. Packing preserves native canvas dimensions and RGBA pixels; Phaser applies nearest-filtered scale and placement only. The two full-room images are composition references outside production. The green floor rugs are code-native Phaser rectangles and add no raster licence.

Exact hashes, native dimensions, runtime names/scales, reference hashes and inherited AI-art limitations are in [the source record](assets/licenses/shop-interior-pixel-snapper-v1/SOURCE_RECORD.md). The user is responsible for rights to the supplied files. No CC0, exclusivity, human-only authorship, legal-eligibility or competition-acceptance claim is made. No third-party pack, font, dependency or remote runtime asset was added.

---

# v0.42.9 — wood replacement and shop review sources

The user-supplied 133×101 Pixel Snapper log bundle is preserved byte-identically in evidence and in the local runtime atlas. It replaces the logical wood resource at the preceding approximate display size and inherits user-provided AI-assisted terms. [Source/hash/transformation record](assets/licenses/pixel-snapper-wood-v1/SOURCE_RECORD.md).

Eight transparent clothing/barber furniture sources and one bench-free barber-room review image are new OpenAI built-in image-generation outputs. They remain outside the runtime allowlist, are not represented as hand-drawn, CC0 or exclusive, and require human approval/native-pixel preparation before integration. [Prompts, hashes and limitations](assets/licenses/shop-interior-assets-review-v1/SOURCE_RECORD.md). Fountain/pot placement and barber-bench removal add no licence.

---

# v0.42.8 — exact exports of existing non-Pixel-Snapper frames

Nineteen review PNGs in `output/deliverables/existing-non-pixel-snapper-assets/` are exact native-size crops from the already present `town` and `world` atlases. They include the earlier café table/chair and existing wood, grass, stone, logs, mushroom, resource and terrain frames. The exporter performs no generation, repainting, scaling, filtering or palette conversion. These review files add no new source or licence and inherit each source frame's existing project/third-party terms and attribution; they are outside the runtime allowlist. Source frame names, atlas paths, dimensions and hashes are recorded in [the export record](assets/licenses/existing-non-snapper-export-v1/SOURCE_RECORD.md) and the deliverable `manifest.json`.

The City removals and positioning changes add no asset or licence. The small fire moved into Home is the same user-supplied Pixel Snapper source already recorded under `pixel-snapper-assets-v1`; its existing user-provided AI-assisted terms remain unchanged.

---

# v0.42.7 — 37 user-supplied Pixel Snapper objects and vegetation

Seven additional user-supplied Pixel Snapper PNGs—broadleaf tree, tall tree, palm, grass, bush, sparse tree and snow pine—extend the existing atlas to 37 complete native RGBA canvases. They replace matching logical vegetation at runtime while retaining the preceding approximate world heights and unchanged collision/root anchors. Atlas generation copies every full source canvas byte-identically into evidence and performs no trimming, resampling, recolouring or background compositing; Phaser supplies nearest-filtered display transforms. Exact local source paths, evidence copies, dimensions, visible-alpha bounds, SHA-256 hashes and scales are recorded in `output/art/pixel-snapper-assets-v1/art-audit.json` and [the source record](assets/licenses/pixel-snapper-assets-v1/SOURCE_RECORD.md).

These remain user-provided AI-assisted Pixel Snapper outputs. The user is responsible for rights to the supplied files. No CC0, exclusivity, human-only authorship, legal-eligibility or competition-acceptance claim is made. Placement-only removals and moves add no licence. No third-party pack, font, dependency or remote runtime asset was added.

---

# v0.42.6 — 30 user-supplied Pixel Snapper objects

The 30 latest user-supplied PNGs are packed into `pixel-snapper-assets.png` with each complete native RGBA canvas unchanged. Runtime scaling is a Phaser transform with nearest filtering; atlas generation performs no trimming, resampling, recolouring or background compositing. Every source contains transparent pixels and none has an opaque white rectangular background. Exact original paths, source copies, dimensions, visible-alpha bounds, SHA-256 hashes and display scales are recorded in `output/art/pixel-snapper-assets-v1/art-audit.json` and summarized in [the source record](assets/licenses/pixel-snapper-assets-v1/SOURCE_RECORD.md).

These are user-provided AI-assisted Pixel Snapper outputs. The user is responsible for rights to the supplied files. No CC0, exclusivity, human-only authorship, legal-eligibility or competition-acceptance claim is made. The new atlas PNG/JSON are the only added runtime files; no third-party pack, font, dependency or remote runtime asset was added.

---

# v0.42.5 — twelve native City Pixel Snapper assets

The runtime City-building atlas now includes the ten previously supplied house/café derivatives plus the user's two approved Pixel Snapper shop derivatives. Clothing SHA-256 is `3d36939431221fcc7eaa72b7eb8db015c20b4776926412e5cb56cf1f2fc5b78b`; barber SHA-256 is `8c5c3af3839444e746c5d5340d7b18adf18bc63857149089300470e0bc916d4d`. All twelve retain their native RGBA canvases; packing adds only transparent atlas space and metadata. The requested intermediate facade sizes use nearest-filtered runtime display transforms, not raster modifications.

The two shops inherit the reviewed OpenAI generated/adapted-art disclosure and terms of their recorded source concepts. Existing house/café terms remain unchanged. No CC0, exclusivity, human-only authorship, legal-eligibility or competition-acceptance claim is made. The removed Home placement deletes no source asset and adds no licence. [Complete source, transformation and runtime-hash record](assets/licenses/city-building-snapper-v2/SOURCE_RECORD.md).

---

# v0.42.4 — City house reuse and shop review sources

The City/Home/Farm runtime changes reuse existing local Pixel Snapper house frames under their previously recorded AI-generated/user-adapted terms; no runtime raster was added or resampled. Three City canvases now render at integer 1×, the remainder at integer 2×. Existing creator credits, third-party terms and competition eligibility limitations are unchanged.

The two new shop PNGs are review-only OpenAI-generated/adapted project artwork. They are not represented as hand-drawn, CC0, exclusive or guaranteed competition-eligible, and they remain outside the production asset allowlist pending approval and native preparation. [Prompt/source/terms record](assets/licenses/city-shop-redesign-v2/SOURCE_RECORD.md). No third-party download, new font, dependency or remote runtime asset.

---

# v0.42.3 — user Pixel Snapper City-building derivatives

Ten user-supplied transparent Pixel Snapper PNGs—nine residences and one café—are packed byte-for-byte at their native canvas dimensions into the local `city-buildings` atlas. Atlas packing adds transparent padding/metadata only; it does not resize, resample, recolour or redraw the source pixels. Residences render with nearest filtering at integer 2× to match the accepted terracotta cottage's pixel grid; the café renders at integer 1×. Clothing and barber replacements from the same concept batch were explicitly excluded by the user.

These files inherit the reviewed OpenAI output-use terms and AI disclosure of their generated source artwork. No CC0, exclusive-rights, human-only authorship, legal-eligibility or competition-acceptance claim is made. Exact source filenames, dimensions, SHA-256 hashes, alpha audit, runtime hashes and transformations are recorded in [city-building-snapper-v2/SOURCE_RECORD.md](assets/licenses/city-building-snapper-v2/SOURCE_RECORD.md). No third-party pack, font, dependency or remote runtime asset was added.

---

# City building redesign review sources — 2026-10-18

Twelve built-in image-generation outputs are disclosed as AI-generated review sources under [city-building-redesign-v1](assets/licenses/city-building-redesign-v1/SOURCE_RECORD.md), with prompts, dimensions, hashes and reviewed service terms. References guide style/proportion only; no reference pixels were extracted. No CC0, exclusivity, human-only authorship, legal-eligibility or competition-acceptance claim is made. These files remain outside `public/` and the production allowlist pending user review and native processing.

---

# v0.42.2 — user Pixel Snapper cottage derivative

The user's 167×110 Pixel Snapper derivative and exact-white alpha conversion are recorded at [city-cottage-snapper-v2](assets/licenses/city-cottage-snapper-v2/SOURCE_RECORD.md). It inherits the reviewed OpenAI output-use terms from the source artwork. No third-party art/dependency was added, and no CC0, exclusivity, human-only authorship, legal-eligibility or competition-acceptance claim is made.

---

# v0.42.1 — terracotta City cottage

The selected generated original and native derivative are recorded at [city-cottage-terracotta-v1](assets/licenses/city-cottage-terracotta-v1/SOURCE_RECORD.md), with reviewed OpenAI output-use terms, prompt summary, hashes, modifications and human review. This record does not claim CC0, exclusivity, legal eligibility or competition acceptance. No screenshot pixel was copied and no third-party asset was added.

---

# v0.42.0 — code-native title scenery, unchanged licensed sprites

WelcomeView reuses existing town cottage/crop/tree/bush/fence frames, Thaleah/m5x7, Noto Sans Myanmar UI and title music under their established recorded terms and in-game credits. New meadow/river/bridge/bird/leaf drawing is disclosed Codex-assisted source code, not downloaded or generated raster art. User screenshots inform the requested behavior; no screenshot pixels are extracted. No new runtime asset path or licence/dependency; the production allowlist remains 48 files. [Source/frame/hash record](assets/licenses/welcome-v042/SOURCE_RECORD.md).

---

# v0.41.0 — approved City artwork integrated unchanged (2026-10-17)

Nine already approved native City shop/cottage/flowerpot/furniture PNGs are appended unchanged inside the allowlisted town atlas. Source generated originals, native exports, prompts, prior terms and both proposals are preserved; existing1051frame records/old RGBA pixels and74other public files are exact. No new licence/dependency/runtime asset path. [Integration source record/manifest](assets/licenses/city-shops-v1/SOURCE_RECORD.md), [inherited art terms](assets/licenses/city-garden-shops-proposal-v1/OUTPUT_TERMS.md). Screenshot references guide placement only; no foreign pixels extracted. Production remains48files; source/backup/evidence files stay excluded. No exclusivity or human-only authorship claim.

---

# City location proposal 02 — unchanged approved art reused (2026-10-16)

No new image generation, source art, external download or dependency. Nine native review PNGs and thirteen original generated sources remain byte-exact to proposal01 with inherited per-source terms and AI disclosures. Four new screenshots identify locations only; no screenshot-pixel extraction. Offline placement and cream/green-parcel surface edits are code-authored; no runtime art is replaced. Existing PNGJS/Pillow evidence applies; system font is flattened into review labels only.

[Source record and hash manifest](assets/licenses/city-garden-shops-proposal-v2/SOURCE_RECORD.md). Original proposal, artwork and playable sources remain exact; review files/ZIP stay outside the48-file production allowlist. No publish/deploy/push.

---

# City garden and shops proposal — generated/adapted review art (2026-10-16)

Thirteen original built-in imagegen outputs are preserved; nine selected transparent native derivatives form the review collection. Disclosed AI-generated/Codex-adapted artwork, with exact prompts, original paths, actual dimensions, export transformations and SHA256 evidence. No CC0, exclusive-rights or human-only authorship claim. Existing approved sprites retain their previously recorded source terms; the supplied references inform perspective/atmosphere without extracting foreign pixels/layouts. No new third-party asset or dependency.

[Source record and manifest](assets/licenses/city-garden-shops-proposal-v1/SOURCE_RECORD.md), [review files/dimensions](../output/previews/city-garden-shops-v1/README.md). PNGJS/Pillow evidence is inherited from existing docs/licenses records. System font is used only in local flattened review labels; no font binary is bundled. All new objects/originals/ZIP/previews remain outside public and the 48-file runtime allowlist; playable art and source are byte-exact. No integration, publication or deployment.

---

# v0.40.0 — original City surfaces, approved sprites reused unchanged (2026-10-16)

Runtime integration of approved proposal03 uses original code-native contours/masonry/curbs and existing local art under its recorded per-source terms. No new PNG, third-party download, font, dependency, image-generation call, or foreign reference-pixel extraction. The green ground retains the existing original procedural material. Approved sprite PNGs/atlas metadata remain byte-exact. Existing AI disclosures and third-party licences remain applicable; this record makes no exclusive-copyright claim.

[Source evidence, hashes and export method](assets/licenses/city-layout-v1/SOURCE_RECORD.md). Historical previews and baseline files stay outside production; the explicit48-file allowlist is unchanged. User authorized local game integration; no deployment/publication.

---

# City proposal 03 — review-only original surfaces and reused artwork (2026-10-16)

Original procedural terrace/curb/lawn/soil composition reuses approved bench, fountain, lamp, character and planting PNGs without changing source pixels, proportions, orientation or established scales. No image generation, new external asset, font binary or runtime dependency. Existing source-specific terms/AI disclosures remain. Supplied screenshots guide design relationships only; no pixel or exact foreign layout extraction. [Source record/hashes](assets/licenses/city-road-layout-proposal-v3/SOURCE_RECORD.md). Previous proposals remain preserved. All 249 runtime files and the 48-file production allowlist are unchanged; approval pending, no integration/publication.

---

# City proposal 02 — review-only surfaces (2026-10-16)

Original code-native curb/paver/border refinements reuse approved art at unchanged scales and positions. No new image generation, third-party download or runtime dependency. Source-specific terms from the previous proposal and original asset records remain. No reference pixel/layout extraction. [Source record/hashes](assets/licenses/city-road-layout-proposal-v2/SOURCE_RECORD.md). Review outputs stay outside the unchanged 48-file production allowlist; all 249 runtime files remain exact. Approval pending; no integration/publication.

---

# City road layout proposal 01 — offline reuse (2026-10-16)

Review-only original code-native paving/curb/island composition reuses existing approved outdoor, house, nature and farmer atlas pixels without recolouring/replacing sources. No new image generation, third-party download or runtime asset. Inherited source terms and AI disclosures remain; supplied screenshots inform general construction/circulation, without copying pixels or exact map geometry.

[Source record and input/output hashes](assets/licenses/city-road-layout-proposal-v1/SOURCE_RECORD.md). Files stay under `output/previews/city-road-layout-v1`;48-file production allowlist excludes them.249 runtime files remain exact. Await user approval before integration.

---

# v0.39.0 — original outdoor detail replacements

Six original built-in imagegen sources, disclosed as generated/adapted art; approved well/planter/lamp sources reused unchanged. [Prompts, raw hashes, transformations, output terms and night-light authorship](assets/licenses/outdoor-followup-v1/SOURCE_RECORD.md). Existing PNGJS MIT/Pillow evidence and all prior creator credits remain. No dependency or CC0/exclusivity claim. Originals and previous runtime ZIP backups stay outside the48-file production allowlist.

---

# v0.38.0 — original outdoor collection

Fourteen original built-in imagegen outputs plus the approved original lamp are disclosed as generated/adapted project artwork. [Exact prompts, source SHA256s, full originals, native transformations and retained output terms](assets/licenses/outdoor-collection-v1/SOURCE_RECORD.md). Existing PNGJS MIT/Pillow evidence applies; no new dependency or CC0/exclusivity claim. All prior creator/audio/font credits remain. Sources, backups, original PNGs, ZIPs, contact sheets and QA are excluded from the unchanged48-file runtime allowlist.

---

# v0.37.2 — muted generated planter-bench

Original built-in imagegen edit, disclosed as generated/adapted project art. [Exact prompt/input roles, original SHA256, conversion and retained output terms](assets/licenses/planter-bench-muted-v2/SOURCE_RECORD.md). Existing PNGJS MIT/Pillow evidence and all preceding creator credits remain. No new dependency or CC0/exclusivity claim. Full original and previous source/atlas remain preserved outside the unchanged48-file runtime allowlist.

---

# v0.37.1 — approved original planter-bench

One original OpenAI imagegen planter-bench with disclosed Codex-assisted native adaptation. [Exact prompts, two original outputs, selected SHA256, transformations and retained output-use evidence](assets/licenses/planter-bench-v1/SOURCE_RECORD.md). Reference town is visual guidance only, with no sprite/scene extraction. Full original PNGs and preceding runtime art ZIP remain preserved. Existing PNGJS MIT/Pillow evidence applies; no new dependency. Generated sources/backups/QA are excluded from the unchanged48-file runtime allowlist. Prior family attributions remain; no exclusive/CC0/human-created or eligibility claim.

---

# v0.37.0 — original approved home collection (2026-10-16)

Original built-in imagegen home furniture/decor sources, with disclosed Codex-assisted native adaptation; no reference-game pixel extraction. [Exact prompts, original paths, source SHA256s, unchanged approved table, export/approval and output-use evidence](assets/licenses/home-interior-v1/SOURCE_RECORD.md). All full-resolution generated originals are retained. Integer-pixel wall/floor/threshold architecture is original project code. The user's existing character crop appears in offline QA only; current licensed/generated character families retain their prior provenance and runtime files.

Existing PNGJS MIT and Pillow evidence remains applicable; no dependency is added. The separate512×512 home atlas PNG/JSON join the explicit production allowlist; raw sources, rejected designs, archives, prompts, reference screenshots, script/tests and QA remain excluded. The storage jar/U-threshold sources are preserved but not instantiated. Existing art/font/audio credits remain. No CC0/exclusive/human-generated claim or submission-rights certification is made; retained OUTPUT_TERMS.md keeps its original review date.

---

# v0.36.3 — one original native table (2026-10-15)

Original built-in imagegen table with two targeted readability edits; disclosed AI-generated/adapted, not CC0 or guaranteed exclusive/human-authored. [Exact prompts, input roles, returned paths, selected hash, output-use evidence and native conversion](assets/licenses/table-native-v1/SOURCE_RECORD.md). Reference screenshot supplies camera/construction guidance only, with no pixel extraction. Existing licences remain applicable. Earlier interrupted [chunky bench](assets/licenses/chunky-bench-v1/SOURCE_RECORD.md) and [larger walnut table](assets/licenses/walnut-table-v1/SOURCE_RECORD.md) sources/frames remain preserved. Existing PNGJS/Pillow evidence applies; no new dependency. Sources/ZIPs/evidence/test pages stay outside the unchanged46-file allowlist.

---

# v0.36.0 — original cedar prop set (2026-10-15)

48 selected original built-in OpenAI imagegen sources plus exact reuse of the approved generated bench supply the prop rollout. Disclosed as AI-generated/adapted artwork; not CC0 or guaranteed exclusive. [Exact prompts, selected hashes, returned paths, output-use terms and conversion evidence](assets/licenses/cedar-props-v1/SOURCE_RECORD.md). No Plant Tales sprite/text/layout is extracted. Protected earlier licensed families retain their existing credits. Existing PNGJS MIT/Pillow evidence remains; no new dependency. Raw sources, backups, galleries, scripts and verification do not enter the unchanged 46-file runtime allowlist.

---

# v0.35.3 — original cedar bench candidate (2026-10-15)

One original built-in imagegen bench plus two targeted edits supplies one selected sample, disclosed as AI-generated/adapted. [Source/hash/prompts and retained output-use terms](assets/licenses/bench-cedar-v1/SOURCE_RECORD.md). No reference pixels are extracted. Existing artwork/licences remain. No new dependency; PNGJS/Pillow evidence is retained. Sources/backups stay outside the unchanged 46-file production allowlist.

---

# v0.35.2 prop refinement — 2026-10-15

Twenty-eight original built-in imagegen prop sources plus one fireplace corrective edit replace 41 existing town cells. They use user-supplied Plant Tales imagery only as a style/projection reference, with no extracted reference sprite, text, character or layout. [Prompts, selected SHA256 hashes, adaptations and existing output-use evidence](assets/licenses/props-v3/SOURCE_RECORD.md). Outputs are disclosed generated/adapted assets, not CC0 or human-authored artwork. Original licensed families keep their existing credits and terms. PNGJS/Pillow evidence remains as documented; no dependency is added. Raw/rejected outputs and backups stay outside the 46-file runtime allowlist.

---

# v0.35.1 — cleaner furniture source set (2026-10-15)

13 selected original built-in imagegen sources plus one discarded bookcase variant/corrective edit; other refreshed objects adapt their previously documented props-v1 original sources. [Exact prompts, source hashes, terms and native processing](assets/licenses/props-v2/SOURCE_RECORD.md). No screenshot pixels are extracted. Generated output is disclosed as generated/adapted, not CC0, human-drawn or guaranteed exclusive. Existing pack attribution and bundled pngjs/Pillow licence evidence remain. The same 46-file runtime allowlist excludes sources, backups, galleries and QA.

---

# v0.35.0 — original layered scenery (2026-10-15)

36 selected original built-in OpenAI imagegen outputs replace 42 existing atlas cells and add 12 decoration views. [Exact prompts, raw hashes, service-output terms and native adaptations](assets/licenses/props-v1/SOURCE_RECORD.md). Generated art is disclosed as generated/adapted, not CC0, human-drawn or guaranteed exclusive. The user's screenshots supply general style guidance only; no reference pixels are extracted. Remaining licensed families retain their attribution. Existing bundled pngjs 7.0.0 MIT and review-only Pillow evidence remain; no dependency addition. Runtime remains 46 allowlisted files, excluding raw outputs, backups, gallery, QA and vendor archives.

---

# v0.34.0 — small trees and bush variations (2026-10-15)

Two original built-in OpenAI imagegen outputs and Codex-assisted native resizing, cleanup and deterministic fruit/flower overlays supply six appended frames. [Prompts/raw hashes/terms/adaptations](assets/licenses/nature-v2/SOURCE_RECORD.md). Existing offline pngjs7.0.0MITevidence remains under licenses/farmer-approved-export; no dependency addition. Input is the project's own generated nature review. Generated output is not CC0 or an exclusive-rights/eligibility guarantee. All previous frame pixels remain; legacy fern/palmetto designs are not drawn. Water effects and bridge masks are original project code. Runtime remains46allowlisted files.

---

# v0.33.0 — generated nature artwork (2026-10-15)

Four original built-in OpenAI imagegen outputs, with Codex-assisted native conversion and disclosed mirror/palette/bend/fruit adaptations. [Prompts, source hashes, processing and retained output-use evidence](assets/licenses/nature-v1/SOURCE_RECORD.md). Generated output is not CC0 or an exclusive-rights/eligibility guarantee. The user's screenshots are style references; no screenshot tile/pixel extraction. Existing offline pngjs7.0.0MITevidence stays under docs/licenses/farmer-approved-export; no runtime dependency addition. Existing bush/fern/environment credits remain applicable; fern color treatment is a runtime adaptation. Only town.png/town.json change in the allowlisted build; sources/backups/previews do not ship.

---

# v0.32.0 — Farm spacing and soil restoration (2026-10-15)

Code-only changes reuse existing licensed terrain, notice-board sprite and original procedural soil. No new artwork, third-party source, generated bitmap or dependency. [Source record](assets/licenses/farm-layout-v1/SOURCE_RECORD.md). Existing licences and runtime asset allowlist remain.

---

# v0.31.1 — natural farm ground (2026-10-15)

Code-only presentation change removes the four procedural fallow canvases. Reuses existing terrain and original prepared-bed soil. No new art, dependency or licence; existing PNG/JSON assets and their credits remain unchanged. [Source record](assets/licenses/farm-layout-v1/SOURCE_RECORD.md).

---

# v0.31.0 — procedural fallow growing areas (2026-10-15)

No new raster asset, downloaded pack, image generation or licence. Four fallow-site canvases reuse original project soilPixels and a muted earth/grass blend. Existing PNG/JSON assets remain unchanged; native pixel-source evidence is [recorded here](assets/licenses/farm-layout-v1/SOURCE_RECORD.md). User screenshot informs general composition/depth advice only, with no external-game pixel sampling. Existing attribution/allowlist remains.

---

# v0.30.1 — existing code-native crop cleanup (2026-10-15)

No newly sourced/generated image or licence. Removed painted soil pixels from existing original code-authored crop/seed art and adjusted code-native farm materials, using existing bundled offline Pillow12.3.0. [Source, conversion, hashes and dependency evidence](assets/licenses/farm-refresh-v1/SOURCE_RECORD.md). The supplied screenshots are composition/material references only; no Plant Tales pixels enter the game. Existing environment/NPC/farmer licences remain, as do898untouched atlas cells. Runtime asset allowlist unchanged; source/audit images stay outside production.

---

# v0.30.0 — matching NPC animations and Clara review (2026-10-14)

Runtime town atlas now includes80slots adapted from six OpenAI built-in imagegen sheets plus approved own-project neutral standing images. [Exact prompts, original hashes, retained output terms, conversion and mirrored-side limitations](assets/licenses/npc-matching-animated-v1/SOURCE_RECORD.md). Four Clara standing review frames from one further generated sheet remain outside production; [Clara prompt/source/output-use evidence](assets/licenses/npc-clara-v1/SOURCE_RECORD.md). Neither package is CC0 or asserted exclusive copyright. No external-game art was used as input. Existing offline Pillow12.3.0licence/evidence remains under docs/licenses/Pillow-LICENSE.txt and farmer-extension-export. Original legacy NPC/farmer/world pixels and their attribution remain; production URL allowlist unchanged.

---

# Nell/Sol standing-design review — 2026-10-14

Two original OpenAI built-in imagegen sheets, adapted with Codex-assisted native sampling and packing, supply eight pending-review standing views. [Prompts, raw outputs, hashes, conversions and retained output-use evidence](assets/licenses/npc-matching-v1/SOURCE_RECORD.md). Input is the approved original generated farmer comparison, used only for style/proportions. No external-game or third-party NPC pixels were used. These assets are generated output under the recorded service terms, not CC0 or an exclusive-rights guarantee. Existing bundled offline Pillow12.3.0licence/evidence remains under docs/licenses/Pillow-LICENSE.txt and farmer-extension-export. All new sources/review images remain outside production; original runtime NPC/farmer/world source and licences remain unchanged. Walking and runtime adoption await appearance approval.

---

# v0.29.0 — modular farmer accessories (2026-10-14)

Straw hat, round glasses and brown canvas backpack are original OpenAI built-in imagegen outputs, adapted with Codex-assisted native sampling, palette reduction and per-frame registration. [Source record, exact prompts, hashes and output-use evidence](assets/licenses/farmer-cosmetics-v1/SOURCE_RECORD.md). The user-approved farmer pair supplied style/proportion reference; no third-party game art was copied. Clothing/hair variants selectively recolour those already documented generated farmer sources. This is generated output under the recorded service terms, not CC0 or an exclusive-rights guarantee. Original source PNGs, the two farmer atlases, NPC atlas and original sprite ZIPs remain unchanged. Native accessory bitmap data is bundled in JS; the existing runtime asset path allowlist is unchanged. Offline NumPy2.3.5 licence and existing Pillow/pngjs evidence are recorded under `docs/licenses/farmer-cosmetic-export`; none are runtime dependencies.

---

# v0.28.1 — matching female farmer, corrected size and eyes (2026-10-14)

Female v2 identity and192body/action poses are original OpenAI built-in imagegen output, adapted with Codex assistance. [Exact prompts, hashes, conversion, size/eye corrections and previously reviewed service output-use evidence](assets/licenses/farmer-girl-v2/SOURCE_RECORD.md). Male original generated poses supplied style/motion references; prior female supplied identity cues. No external game sprite pixels were copied. The twelve approved carried-tool views are reused unchanged with their existing farmer-boy-extension-v1 evidence. Existing bundled offline Pillow12.3.0and pngjs7.0.0evidence remains under docs/licenses/Pillow-LICENSE.txt, farmer-extension-export and farmer-approved-export. No new runtime dependency or art path; only girl.png changes. Generated service output is not CC0 or a guarantee of exclusive copyright. Raw sources, ZIPs and previews remain outside production.

---

# Male farmer extension — 2026-10-14

New jump and carried axe/shovel/watering-can views are original OpenAI built-in imagegen output, adapted to native pixels with Codex assistance. Current approved original action sheets supplied shape/material references. [Exact prompts, source hashes, conversion and previously reviewed output terms](assets/licenses/farmer-boy-extension-v1/SOURCE_RECORD.md). No third-party game pixels were copied. This is generated output under applicable service terms, not CC0 or an exclusive-copyright guarantee. Existing bundled Pillow12.3.0is used offline only (docs/licenses/Pillow-LICENSE.txt); pngjs7.0.0audit evidence remains under docs/licenses/farmer-approved-export. No new runtime dependency. Only the existingboy.pngproduction path changes; raw sources/export archives/previews remain excluded. Existing female/NPC/environment licences remain.

---

# v0.26.2 — original male pixels restored at smaller display scale (2026-10-14)

The same approved v2 source now again supplies byte-identical original 64×64 runtime cells; native downsampling is retired after it removed eye pixels. Smaller stature uses game-object display scale 1.5 only. runtime-record.json stores restored native/source RGBA hashes and current grip/display metadata. Existing [source/service output-use evidence](assets/licenses/farmer-boy-revised-v2/SOURCE_RECORD.md) and offline Pillow licence apply; no new art, licence, dependency or runtime asset path. Earlier size-adaptation records remain historical. Raw sources/ZIPs remain excluded from the runtime allowlist.

---

# v0.26.1 — smaller male runtime adaptation (2026-10-14)

The same approved generated v2 farmer is now adapted at 0.75 native size using whole-frame nearest sampling in scripts/revised_farmer.py. The original seven source sheets/ZIP are unchanged; runtime-record.json records both source cell hashes and adapted cell hashes. This supersedes the preceding byte-preserving runtime description only for the smaller derivative. Existing [source/output-use evidence](assets/licenses/farmer-boy-revised-v2/SOURCE_RECORD.md) and offline docs/licenses/Pillow-LICENSE.txt apply. No new asset/licence/dependency or raw source in the unchanged runtime allowlist.

---

# v0.26.0 — revised male farmer used in-game (2026-10-14)

The user-supplied approved revised v2 now replaces the runtime Worker/Classic male. Existing [generation/source and service output-use evidence](assets/licenses/farmer-boy-revised-v2/SOURCE_RECORD.md) applies. [Import record](assets/licenses/farmer-boy-revised-v2/user-import.json) identifies the supplied ZIP hash; seven untouched native sheets and clip metadata are retained in runtime-source, with per-frame/runtime hashes in runtime-record.json. scripts/revised_farmer.py copies source RGBA pixels without resizing, recolouring or warping. This is disclosed original AI-generated/adapted output under the previously reviewed service terms, not CC0 or an exclusive-copyright claim. Girl, Szadiart other looks/NPCs and all environment/font/audio art retain their established rights. The source ZIP, raw generation images, prompts and review/export files remain outside the unchanged runtime allowlist. Existing offline Pillow licence evidence is under docs/licenses/Pillow-LICENSE.txt; no new dependency.

---

# Revised farmer v2 · approved sprite export — 2026-10-14

Original OpenAI built-in imagegen output, adapted to native pixels with Codex assistance. [Exact prompts, references, conversion and output-use evidence](assets/licenses/farmer-boy-revised-v2/SOURCE_RECORD.md). The user supplied screenshots as style/proportion references; no Plant Tales game pixels are packaged. Running motion guidance uses the existing user-generated PixelLab poses with their retained source/use evidence. West running mirrors the newly authored east sequence. Previously reviewed OpenAI service output terms apply; this is not CC0 or an exclusive-copyright claim. Existing offline pngjs7.0.0(MIT)/sharp0.35.5(Apache-2.0) evidence remains under licenses/farmer-approved-export. [Complete export](../output/art/farmer-boy-revised-v2.zip) stays outside production assets. Existing runtime artwork/licences remain.

---

# Approved male farmer animation review assets — 2026-10-14

Original OpenAI imagegen artwork extends the idle approved in this chat into156 native48×48 frames. The approved south idle is byte-identical; nearest conversion, generated alpha threshold, connected attack-silhouette extraction and mirrored west attack are disclosed. Raw sources remain byte-identical and original sampled RGB colours are retained. [Exact prompts/source hashes/output-use evidence](assets/licenses/farmer-boy-approved-v1/SOURCE_RECORD.md). This is generated output under the previously reviewed OpenAI service terms, not CC0 or an exclusive-copyright guarantee. Existing bundled offline pngjs7.0.0(MIT)/sharp0.35.5(Apache-2.0) package/licence evidence is under licenses/farmer-approved-export; no npm dependency or production runtime addition. [Review ZIP](../output/art/farmer-boy-approved-v1.zip) stays outside the runtime allowlist. Current male/female/NPC/environment art and their licences remain unchanged.

---

# Original boy action review assets — 2026-10-13

Original OpenAI imagegen output for the user-authorized boy-first character prompt, adapted to156 native48×48 frames with Codex assistance. Source PNGs remain byte-identical; native conversion and mirrored west digging/attack are disclosed. Output uses the OpenAI service terms previously reviewed today, not a CC0 claim. [Exact prompts, source hashes and output-use evidence](assets/licenses/farmer-boy-actions-v1/SOURCE_RECORD.md). [Review/export ZIP](../output/art/farmer-boy-actions-v1.zip). Assets remain outside runtime/production; previous male/female/NPC/environment licences and dependency evidence remain applicable. No new download, pack, dependency or runtime API.

---

# v0.25.0 — farmer girl runtime art (2026-10-13)

The girl starter texture and four running directions use original OpenAI-generated output, adapted to native pixels with Codex assistance. [Source/terms record](assets/licenses/farmer-girl-v1/SOURCE_RECORD.md) retains the exact prompt, original generated sheet, conversion script details and hashes. OpenAI service output terms apply; this is not CC0 or a guarantee of exclusive copyright. Style references are the authorized girl design and user's approved PixelLab male. Existing PixelLab male and Szadiart people/scenery licences remain. Source art, PNG export pack, ZIP, prompts and QA previews never enter the production build.

---

# Farmer girl idle design candidate — 2026-10-13

The farmer girl candidate is original AI-generated output from OpenAI built-in image generation, using the user-approved PixelLab male farmer as a style/proportion reference. Service output terms apply; it is not CC0, commissioned human art or a claim of exclusive copyright. Exact prompts/hashes are in output/art/farmer-girl-idle-v1-prompts.txt and farmer-girl-idle-v1-record.json. It remains outside runtime and does not replace any currently licensed player/NPC textures.

Art provenance evidence is also retained under [farmer-girl-idle-v1](assets/licenses/farmer-girl-idle-v1/record.json), alongside the exact prompt set.

---

# v0.24.0 — approved PixelLab farmer (2026-10-13)

Worker/Classic player art is now user-generated PixelLab output. PixelLab Terms of Service sections 1.3/3.3 permit game use and output modification/distribution, subject to applicable laws and the linked Open RAIL-M terms; training other models requires permission. Public terms/licence, exact PNGs/metadata, archive/file hashes and packing details are in [source record](assets/licenses/characters-pixellab/SOURCE_RECORD.md). These are custom output-use terms, not CC0. Other looks and eight NPCs retain their existing Szadiart licences. Source archives, unused diagonals and evidence never enter the unchanged runtime asset allowlist.

---

# v0.23.0 — original Szadiart people (2026-10-13)

Current people are third-party art by Szadi art. under the included custom License for Everyone, not CC0 or original project artwork. It permits personal/commercial game use and modification, with standalone art resale and logo/trademark use excluded; credit is optional and provided. Untouched licence, six selected PNG sheets, archive/file hashes and integration evidence are in [source record](assets/licenses/characters-szadiart/SOURCE_RECORD.md). Source ZIP/PSD and unused files remain excluded from runtime. Previous CraftPix and generated-art evidence remains historical provenance.

---

# v0.22.1 — human proportions and clearer character artwork (2026-10-13)

Character body poses remain adapted user-supplied CraftPix male/female four-direction unarmed bases under custom Freebie Products licence section 2. The fixed offline body-row retarget and original small heads/hair/garment details are Codex-assisted native pixel code. This revision uses no image generation or model training. Source/rights evidence remains under assets/licenses/characters-craftpix; runtime allowlist is unchanged and excludes all raw parts/archives/previews. Other 698 town cells retain their established pixels/licences.

---

# v0.22.0 — native run and walk animations (2026-10-13)

Active player and town people use user-supplied CraftPix free male/female four-direction bases under CraftPix Freebie Products section 2, adapted with original native clothing/hair/hat pixels. This custom licence permits game use, modification and game distribution; it is not CC0. Standalone art resale/export and AI model training/development are excluded. This integration is local game sprite processing, with no generative-image/model-training use. Credits identify CraftPix and Codex-assisted additions. Selected native PNGs, untouched licence pointers, archive hashes and path/frame evidence: [source record](assets/licenses/characters-craftpix/SOURCE_RECORD.md). Vendor ZIPs, sword/death/hurt assets, PSD/Aseprite, reference previews and unused packs are excluded from the unchanged runtime allowlist. The 698 other town cells preserve their established pixels/licences.

---

# v0.21.3 — joined walking sprites and slimmer characters (2026-10-13)

The passing torso previously rose one pixel above the legs, exposing a transparent waist row. The animation now overlaps two native hip rows and restores the side garment behind moving forearms. Softer knee lift and closer foot placement reduce the exaggerated gait; the added dark far-leg tint is removed. Native artwork is about 10% narrower, with unchanged 40×72 cells, 64-pixel standing height and integer 1× world scale. The six original generated source sheets, prompt record and SHA-256 evidence remain unchanged: [character source record](assets/licenses/characters-v2/SOURCE_RECORD.md). Updated processed people remain original generated project artwork; 698 other town cells retain their separate established licences. No new asset/dependency/licence or screenshot sampling. Source sheets and QA previews remain excluded from the runtime allowlist.

---

# v0.21.2 — character scale and walking refinement (2026-10-13)

Characters now use 40×72 native cells at integer 1× world scale, with a 64-pixel visible height instead of 76 (about 16% smaller). A stable 32-colour identity palette simplifies shading; the far leg receives a small additional shade. Faces, hair, clothes and boots retain the approved source art. Four walking poses use contact/passing steps, opposing arms, bent recovering knees and a one-pixel passing bob. Both player and NPC sprites share the poses; held tools follow the animated grip. Standing, jump, feet anchors, depth and local appearance/saves remain.

Codex assisted with the editable native-sprite packing/animation code, joint offsets, palette simplification, hand synchronization, tests and documentation. The six previously disclosed original generated source sheets are retained; no new generation or third-party asset. Source/prompt/hash record: assets/licenses/characters-v2/SOURCE_RECORD.md. No new dependency, runtime asset path, economy rule, save schema, source push or competition submission. AI assistance and established mixed-atlas licences remain disclosed; no exclusive-copyright claim.

---

# v0.21.1 — original generated character replacement

Active people now use original OpenAI-generated artwork based on the user-approved guide, packed into 48×80 nearest-filtered native sprites. Fuller hair, visible eyes, layered clothing and boots replace the rejected thin 24×40 adaptations. Player world scale 1× retains approximate previous physical height. Five outfits/four hairs and eight town variants retain frame indexes, schema-19 saves, paid clothing/barber services and free owned outfits. The cave remains postponed and NPC curfew remains 19:00.

Active bodies no longer derive from the retired CC0 bases. Original generated project art and exact prompts/hashes are documented in [source record](assets/licenses/characters-v2/SOURCE_RECORD.md). No claim of exclusive copyright for generated imagery. Older licence entries describe historical releases. All 698 other atlas cells retain their pixels/licences; fonts/audio/dependencies remain unchanged. In-game credits identify current people as original generated artwork. Source sheets, guide and prompts stay outside the runtime allowlist.

---

# v0.21.0 — CC0 taller character bases

Active people derive from diamonddmgirl **24x32 Bases** (https://opengameart.org/content/24x32-bases-0), based on Cabbit CC0 bases (https://opengameart.org/content/24x32-bases). Both pages explicitly grant CC0. Local original PNG, both page captures, CC0 text, hashes, modifications and AI guide record: [character source evidence](assets/licenses/characters/SOURCE_RECORD.md). Native 24×40 adaptations replace boy/girl and 160 town-person cells; one appearance PNG contains 20 combinations. Original AI-assisted hair/clothes/eye/jump details add no third-party pack restriction. The generated guide and unused source portraits are excluded from production. Both creators are voluntarily credited in-game. All 698 other atlas cells are byte-identical after repacking, retaining their established licences, including legacy mixed-atlas cells. Mana Seed is excluded due to its GenAI restriction. Fonts/audio/dependency licences remain unchanged.

---

# v0.20.2 — original pixel shadows and bridge rail source

Original procedural contact-shadow pixels and raised bridge rails are authored in GroundShadow.js and BridgeView.js with disclosed Codex assistance. These generated local textures/graphics add no runtime files, copied pixels, outside image, npm dependency or new licence. Existing art/font/audio licences and Credits remain. Creation/source record: assets/licenses/pseudo-depth.md.

---

# v0.20.1 — cave artwork removed from active source

CurseArt.js and CurseView.js are removed, so their generated cave/spirit textures are absent from runtime. Historical provenance remains at assets/licenses/cursed-cave.md and in commits 55fbdbd/0125255. No new art/audio/font/dependency or licence is introduced; existing runtime assets and Credits remain.

---

# v0.20.0 — cave/ghost source record

Original code-authored native pixels in src/art/CurseArt.js generate three 48×52 cave states and two 20×26 spirit poses in memory. Simple Life project work with disclosed Codex assistance; no external image/source URL, copied screenshot, image-model output or exclusive ownership claim. The warning uses those same textures. Source/Git evidence: docs/assets/licenses/cursed-cave.md. Previously licensed skull frame remains in the existing approved atlas/source evidence but is no longer rendered. Existing approved fonts/art/audio/dependency evidence and visible Credits remain. No new downloaded file, npm package or runtime allowlist entry.

---

# v0.19.3 — existing clock assets retained

Clock layout uses the unchanged local Thaleah/m5x7/Noto fonts and original cream/olive procedural panel artwork. All approved runtime media and licence notices remain byte-identical to v0.19.2. No new asset, dependency, licence or remote runtime source.

---

# v0.19.2 — unchanged sign/font assets

Sign geometry and arrow selection reuse existing procedural art and the unchanged licensed Noto font. No asset, dependency or licence addition; source evidence remains unchanged.

---

# v0.19.1 — unchanged licensed runtime assets

Text/layout/nameplate changes reuse the byte-identical local Noto Sans Myanmar UI font and previous art/audio. No new asset, licence, dependency or remote runtime request. Font/source/OFL evidence remains assets/licenses/myanmar-font/SOURCE_RECORD.md.

---

# v0.19.0 — bundled Myanmar Unicode font

Noto Sans Myanmar UI Regular 2.103, The Noto Project Authors / Google, SIL Open Font License 1.1. The 199,680-byte official TTF is byte-identical and only renamed to fonts/noto-myanmar.ttf. Its embedded copyright (2021 Google), exact source URL, hash and complete licence evidence are under [Myanmar font](assets/licenses/myanmar-font/SOURCE_RECORD.md). The build includes a font-specific JSON notice with full OFL text. In-game Credits / More art / Fonts / Myanmar font provides attribution/source/licence links. No remote runtime fetch, new dependency or modification to previous fonts/art/audio.

---

# v0.18.6 — retired door sample

The approved sfx-door-wood-open.wav is excluded from runtime after the user requested silent house entry and exit. Historical creator/source/licence/hash evidence is retained; no source asset is deleted or edited. The 27 remaining approved WAVs, eight prior art files, four approved font files and dependency notices retain their existing bytes and evidence. No new asset or dependency.

---

# v0.18.5 — original icons reused

Existing code-drawn map/jump/use glyphs, approved Thaleah/m5x7 fonts, art and audio are reused. No new asset, modified media bytes, third-party download or dependency. The phone screenshot guides layout only. The wood-door sample remains selected for house exit; house entry is silent. Source/licence evidence and the exact runtime allowlist remain intact.

---

# v0.18.4 — requested UI fonts

Thaleah Fat by Rick Hoppmann / Tiny Worlds is CC BY 4.0; m5x7 by Daniel Linssen is CC0. Direct official source links, acquired source TTFs, conversion details and SHA-256 evidence are recorded in [UI fonts](assets/licenses/ui-fonts/SOURCE_RECORD.md). Attribution/source/licence links are accessible in-game under Credits / More art / Fonts. The Thaleah conversion removes empty top rows and recolours native monochrome glyphs; no replacement glyph shapes are authored.

Four generated bitmap PNG/XML files join the exact runtime allowlist. Source TTFs, archives, source evidence and unused fonts stay outside production. Existing eight art files, 28 approved WAVs and dependency notices retain their established bytes/licences. The phone screenshots are references only.

---

# v0.18.3 — mobile HUD proportions

Existing original code-drawn meters/frames/glyphs and the licensed font/art are reused with smaller mobile rendering dimensions. The supplied phone screenshot is a layout reference only; no reference pixels enter runtime. No new asset, dependency or licence change. The runtime audit retains 28 unchanged approved WAVs, eight byte-identical allowed art files and existing dependency notices; captures/test saves stay outside source/build.

---

# v0.18.1 — mobile rotation and silent travel

No new asset or dependency. The previously reviewed sfx-gate.wav is removed from production after the user rejected the location-change sound; 28 approved WAVs and eight unchanged allowlisted art files remain, with their existing source records and dependency notices. UI changes are original project code; no atlas/raster/audio bytes are edited. Generated mobile QA screenshots/test saves remain outside the commit.

---

# v0.18.0 — source evidence and unchanged approved assets

No new third-party art/audio/dependency or source terms. Eight runtime art files retain their baseline hashes. The 29 selected WAVs are byte-identical to previously reviewed local assets under assets/licenses/cozy-audio and morning-audio; seven approved Farm effects are newly reselected. Introduction art is original Codex-assisted source code, with no protected game/reference pixels copied and no exclusive authorship claim. Runtime preserves full Phaser/EventEmitter3/Vite notices, copyPublicDir:false and exact art/audio allowlists; vendor/source archives, unused packs, wind/fireplace and historical generated scores stay outside dist. Source record: assets/licenses/judge-polish/SOURCE_RECORD.md; current production audit summary: verification/judge-polish/README.md. Human legal/team/organizer declarations remain unsigned and separate from technical checks.

---

# v0.17.4 — existing audio/art reuse only

Existing reviewed `forest-day.wav` supplies gentle outdoor birds around Home/Farm/City. No new audio file or changed WAV bytes: runtime remains 22 selected samples, with wind/fireplace/vendor archives excluded. Default plant sprites are existing approved local atlas frames; gathering changes behavior, not artwork or licence terms. Eight runtime art files and dependency notices remain unchanged. Provenance: assets/licenses/cozy-audio/SOURCE_RECORD.md and existing art records. Audit: verification/outdoor-plants/runtime-audit.json.

---

# v0.17.3 — retire indoor background sample

`assets/audio/cozy/fireplace.wav` (previously the `room` loop) is removed from runtime selection/production after the user's indoor-wind request. Its source/manifest/licence evidence is retained; no WAV bytes or external rights change. The other 22 selected WAVs keep their exact reviewed hashes/permissions. Eight runtime art files and dependency notices remain unchanged. Evidence: verification/quiet-interior/runtime-audit.json; assets/licenses/cozy-audio/SOURCE_RECORD.md.

---

# v0.17.2 — reused original cottage structure

Eight house themes now derive at runtime from the original `house-village-0` frame authored in `scripts/large_houses_art.py` (earlier original-home evidence in assets/licenses/home-proportions). `src/art/homePalette.js` changes palette/material pixels without altering alpha or steps; HomeArt caches local textures. This frame is original project artwork, not a newly downloaded licensed house. The Customize house glyph is original code art. Existing separately credited environment/furniture/audio and dependency rights remain applicable. No new external licence/dependency/runtime file; all eight processed art files remain unchanged. Updated evidence: assets/licenses/customization/SOURCE_RECORD.md; verification/customize-access/runtime-audit.json.

---

# v0.17.1 — unchanged placement assets

Placement/editor changes use existing licensed local art and original code-native pixel UI. No new third-party art/audio/dependency, runtime remote request or imported archive. Existing source evidence and attribution remain; the runtime allowlist is re-audited in verification/decoration-editing/runtime-audit.json.

---

# v0.17.0 — original houses and customization art, 2026-10-11

No new external asset or dependency. Eight house exteriors, themed floor/curtain/rug/bed/wall/table decorations, blossom/hedge/flowers/birdbath/rug/bookcase/vase graphics and shop UI are original Codex-assisted JavaScript drawings. Oak/palm and existing furniture/room previews reuse the already credited local runtime atlas cells; their original creator/licence evidence remains applicable. Eight runtime art files are unchanged; source packs and unused files remain excluded. Source record and exact inventory: docs/assets/licenses/customization/SOURCE_RECORD.md and docs/verification/customization/runtime-audit.json. AI assistance is disclosed; human subjective art review remains pending.

---

# v0.16.6 — public-domain morning rooster, 2026-10-11

The supplied five packs contain no chicken/rooster sample. Selected **Medium rooster crowing** by **alys**, whose [Wikimedia file/permission page](https://commons.wikimedia.org/wiki/File:Medium_rooster_crowing.ogg) records the author's public-domain dedication and unrestricted-use permission where dedication is unavailable. This is a natural recording, not Codex-authored audio. Source page snapshot, original Ogg, media URL, source/runtime SHA256s, conversion and attribution are retained under assets/licenses/morning-audio. The runtime ships only the adapted local PCM16 WAV. Credits → Audio identifies alys/public domain and links the source; the recording has no mandatory attribution condition, but credit is provided.

Sleep and evening wake use already licensed Farm sleep/bush-rustle samples with unchanged hashes. No musical wake jingle or new rights claim for prior assets; both wind loops are excluded. Current runtime selection: AUDIO_SOURCES.md; audit: verification/sleep-wakeup/runtime-audit.json. Public hosting is explicitly user-requested for this test build; licence evidence/source archives are not deployed.

---

# v0.16.5 — previously licensed pickup effects

The user's requested collection feedback restores three deduplicated Farm SFX files to the prior twelve-file selection: pickup-rare, rock-break and chest-open; pickup-item was already retained for Wood. All fifteen SFX, seven Nature loops and HuntSounds title music keep the existing embedded/creator game-use permissions, credits and manifest hashes. No new asset, licence claim or WAV processing. Original completion music no longer ships. Current source selection/audit: AUDIO_SOURCES.md and verification/nature-pickups/runtime-audit.json. The authorized Vercel preview is a runtime-only testing host.

---

# v0.16.4 — reduced effects and authorized testing host

The user authorized hosting this testing version for a friend. The deployed build includes only twelve existing licensed Farm SFX, seven Nature loops, HuntSounds music, the original ending cue and the established eight art files. Existing creator/game-use terms and source hashes apply unchanged; no new asset or rights claim. Runtime-only Vercel hosting is a testing deployment, not a standalone pack or competition submission. Current selection/audit: AUDIO_SOURCES.md and verification/hit-feedback/runtime-audit.json.

---

# v0.16.3 — previously licensed farming/combat effects restored

The user's clarification restores fourteen already converted Farm SFX samples for crop work, tree/animal hits and transactions. Seven Nature loops, HuntSounds music and the original ending cue remain. Existing creator licence snapshots and manifest hashes apply unchanged. No new asset/licence claim; eighteen unused SFX stay outside production. Current inventory: AUDIO_SOURCES.md; audit: verification/restored-effects/runtime-audit.json.

---

# v0.16.2 — reduced audio selection

Current runtime selects only the two Farm transaction sounds, seven Nature loops and HuntSounds bonus music, plus the original completion cue. Earlier creator permissions and file hashes remain applicable; no asset modification or new rights claim. Thirty withdrawn effects remain historical source evidence and do not ship. Current selection: AUDIO_SOURCES.md; evidence: verification/quiet-actions/runtime-audit.json and assets/licenses/cozy-audio/SOURCE_RECORD.md.

---

# v0.16.1 — supplied audio review, 2026-10-11

All five supplied ZIPs were inspected before integration. The three Cozy Farm archives and Cozy Nature archive contain custom terms allowing personal and commercial game/app/video use and modification, while prohibiting standalone asset redistribution and claiming original authorship. Their creator pages confirm game use; Spaceyyy confirms the former Bramble & Byte name. HuntSounds' archive has no embedded licence; its [matching official product page](https://huntsounds.itch.io/cosy-sfx-volume-1) grants royalty-free personal/commercial project use without required attribution. No purchase or creator contact is needed for the selected supplied free-download files. Source-specific game-use permission is the basis for integration, not a claim that these packs are CC0 or that all project assets/competition eligibility are certified.

Selected: 32 Farm SFX files, seven Nature ambience files and HuntSounds' bonus music loop. Only modified game-runtime PCM WAVs are allowlisted, with creator credits and exact hashes. The two Farm ambience ZIPs are permitted but unused because the Nature loops better match the current scenes; all other files in the packs remain unused. Evidence/embedded terms/dated creator-page snapshots: [cozy-audio source record](assets/licenses/cozy-audio/SOURCE_RECORD.md). No source ZIP or standalone sound-pack release. Existing ending cue/original synthesis fallback and artwork retain prior attribution. Full runtime inventory: AUDIO_SOURCES.md.

---

# v0.16.0 — current production permissions

[Complete filename/use/creator/source/licence/attribution/modification/AI/competition inventory](assets/licenses/story-audio/SOURCE_RECORD.md) supersedes historical runtime rights qualifications below. All eight ToffeeCraft FreeEnvironment cells are replaced by independently authored project art; the known prize-entry ambiguity is removed from runtime. Atlas metadata and other 850 cells remain unchanged. Retained LimeZu CC BY 4.0, Channeechan/Eris Esra and Pipoya game-use terms, and CraftPix Freebie Products terms remain source-specific and credited. No source pack is offered as an asset library. No new external download/dependency.

Six original WAV scores, 49 gameplay effects/six sparse environmental calls/three textures, original intro/Keepsake/source glyphs are Codex-assisted project work without external samples or recordings. [Audio inventory](AUDIO_SOURCES.md), [pixel proof](assets/licenses/story-audio/original-cells.json), [runtime allowlist proof](verification/story-audio/runtime-audit.json). Competition references permit disclosed AI work subject to human review/responsibility. Final signed team rights/originality confirmation remains pending; this is not complete legal certification. Earlier version-specific uncertainties below are historical.

---

# v0.15.0 — reused furniture and original directional graphics

No new asset, font, dependency or download. Existing bench/barrel/lamp cells are original project art from scripts/process-rpg-assets.py. Original native side/back furniture, vertical fence interpretation, picnic table, paving, placement footprint/arrow and controls are generated by ES modules with Codex assistance; reused planter/fence/flowers retain LimeZu CC BY 4.0 attribution. Runtime art hashes remain unchanged. Source evidence: assets/licenses/placement.md; audit: verification/placement/runtime-audit.json. Existing broader creator/submission qualifications are unchanged.

---

# v0.14.0 — original reading glyphs and resource previews

No external asset/font/dependency is added. New lowercase pixel glyph patterns, nearest-neighbour stronger headings, tree meter, recipe layout and paving/pan previews are original Codex-assisted code in readingGlyphs.js, coloredFont.js, TreeProgressView.js, ResourceView.js and resourcePreviews.js. Existing bench/home-fireplace/material cells are original project art; planter/fence/flowers retain LimeZu Serene Village CC BY 4.0 attribution. The Plant Tales screenshot supplies style guidance only, with no extracted pixels or font. All eight runtime art files remain byte-identical. Source record: docs/assets/licenses/chopping-ui.md; runtime proof: docs/verification/chopping-ui/runtime-audit.json. Existing broader creator/submission qualifications remain unchanged.

---

# v0.13.0 — reused local resource art and original pixel graphics

Town/Farm furniture and flowers reuse the current credited local town atlas (bench, planter, fence, post, flowers2). Grilled Meat reuses the existing original meat-item icon; stove pan and paving are original Phaser pixel graphics in src/art/SettlementView.js. No download, image generation, dependency or atlas change. The existing eight-file runtime asset allowlist is unchanged; archives/QA evidence remain excluded. Existing creator terms and competition/publication qualifications remain unchanged. Evidence: [resource source record](assets/licenses/resource-projects.md).

---

# v0.12.0 — no new assets

Daily-care/farm/club changes use original gameplay/UI code and existing credited sprites. No download, asset regeneration, sprite transformation or new dependency. Club/stall cells remain unused in the existing atlas for source reproducibility; no club or club stall is rendered or selectable. The eight-file runtime allowlist remains unchanged; vendor archives and QA images are excluded from dist. Existing creator/licence evidence and publication limitations remain.

---

# v0.11.1 — original Home roof/proportion and energy correction

Thirteen house cells are independently redrawn by scripts/large_houses_art.py, with a pitched roof cap and taller doors. Home is authored directly at 180×144; other cottages remain 120×96. The yellow bolt is original src/ui/statusArt.js / vitalMeter.js pixel code. No screenshot pixels, external image generation/download or sprite resampling. Indoor furnishings, Channeechan farmer/NPC sheets, font, world and other atlas cells preserve their existing source licences. Evidence and hashes: docs/assets/licenses/home-proportions. Runtime packaging remains the eight-file allowlist. No additional rights/publication claim.

---

# v0.11.0 — original front-facing houses and cozy interior

Thirteen original 120×96 house cells are redrawn in-place with identical front-facing alpha/structure and different finishes. Twelve original native interior cells append to the existing town atlas. Original generator code and native RGBA hashes: [home/mobile provenance](assets/licenses/home-mobile/SOURCE_RECORD.md), [original cell records](assets/licenses/home-mobile/original-cells.json). Pixel joystick circles/buttons are original procedural HUD code. User screenshots guide structure and style; no pixels are copied or third-party assets added. These original additions do not change creator licences for the mixed-source atlas.

Against 4db7b4a, all 846 earlier frame rectangles remain, 833 non-house cells (including supplied rocky art) and six other runtime art files are unchanged. Only thirteen original house cells change; twelve home cells append (858 total). Eight runtime art paths/twelve production files remain. No new dependency/vendor/archive/runtime remote asset. Earlier licence/submission qualifications remain; [audit](verification/home-mobile/runtime-audit.json).

---

# v0.10.0 — supplied rocky objects and original depth art

Eight selected native CraftPix Free Rocky Area Objects cells are integrated into the allowlisted town atlas and used in Dark Forest. Official freebie game-use/modification/distribution terms checked 2026-10-09; exact supplied archive License.txt, archive/member hashes, native crops/sizes and reviewed terms: [source record](assets/licenses/rocky-depth/SOURCE_RECORD.md), [selected cells](assets/licenses/rocky-depth/selected-assets.json). Existing CraftPix credit remains. Source ZIP/PSD/unused pack files are excluded; no artwork export feature or AI/ML dataset use. Earlier unrelated public prize-entry/submission limitations remain.

Thirteen existing native house cells are independently redrawn by original Python code for three-quarter roof/wall depth; shared alpha collisions regenerate. River/portal/cliff/shadow art is original procedural project work. User screenshots/Plant Tales guide style only, without copied pixels/layouts. Eight runtime file paths remain; 825 old non-house cells, all earlier frame rectangles and six other art files are unchanged against ba601de. Audit: verification/scene-depth/runtime-audit.json. No new dependency/remote runtime asset.

---

# v0.9.0 — unchanged art, retained cliff cell and original local synthesis

All eight runtime art files / 838 atlas cells are byte-identical to v0.8.0 (2484fba). New shelves display the already credited LimeZu Serene Village Revamped cliff-face cell, CC BY 4.0, with original placement/grass lips, opaque earth backing and cached face-earth/foliage palette adaptations. Habitat ground/maps and ambient sound are original code; no recording/download/remote asset or new dependency. All existing creator-specific licences and release qualifications remain. [Source evidence](assets/licenses/forest-refresh.md); [runtime/progress audit](verification/forest-refresh/runtime-audit.json).

---

# v0.8.0 — original meat and stone cells

The meat-item, stone-item and loose-stones cells are original deterministic project artwork authored in scripts/hunting_resources_art.py with Codex assistance. No external source, downloaded asset, image generation or screenshot pixels were used. This addition does not change the licences of the mixed-source atlas. All 835 earlier cells/metadata, both farmer sheets and the six other runtime files remain unchanged. Three cells append (838 total) within the existing town atlas; production retains the eight-file allowlist. Existing source credits, terms and competition-submission limitations remain. [Provenance](assets/licenses/hunting-resources.md); [audit](verification/hunting-resources/runtime-audit.json).

---

# v0.7.3 — unchanged art and original procedural meters

All eight runtime art files, including the 835-frame mixed-source atlas and both farmer sheets, are byte-identical to ef08d42. This pass changes placements/transforms and adds original code-authored meter shapes in src/ui/vitalMeter.js. No new pack, screenshot pixels, dependency or runtime asset. Source-specific creator credits/terms and existing submission limitations remain. [Source evidence](assets/licenses/street-hud.md); [runtime audit](verification/street-hud/runtime-audit.json).

---

# v0.7.2 — farmer-derived NPCs and original planted grains

Active NPCs and sellers now use 160 selected/adapted 24×32 Channeechan farmer cells (eight palettes × four directions × idle/four walk cells), from the already integrated licensed farmer sheets. Faces and native body alpha are retained; only hair/clothing colours change. Channeechan permits game use/modifications under the recorded terms, with underlying Eris Esra template credit retained. No source archive redistribution/new external download. In-game Town Residents credits identify this adaptation; old Pipoya atlas cells retain their legacy source attribution. See [source evidence](assets/licenses/matched-characters.md) and [existing supplied-art terms](assets/licenses/supplied-farmer-environment/SOURCE_RECORD.md).

Twelve original planted-seed cells replace packet stakes with soil-level grains. Inventory packets and all 663 other older cells remain unchanged; 835 atlas cells total. Existing player sheets and six other runtime art files remain unchanged. Eight-file allowlist retained. This does not relicense the mixed atlas or resolve earlier other-pack submission limitations.

---

# v0.7.1 — original large houses and reused actors

Thirteen distinct 120×96 native house cells are original deterministic project artwork authored in scripts/large_houses_art.py with Codex assistance. They replace active house presentation without altering the 662 existing mixed-source atlas frames. No new download, image generation or screenshot pixel extraction. Merchant walking uses already integrated Pipoya directional cells under the recorded creator terms. Existing LimeZu/Pipoya/other attribution and source-specific restrictions remain. The mixed atlas is not offered as a standalone asset pack.

Fountain/ripple/reflection/HUD changes are original rendering code, not additional external assets. Production retains the eight-file allowlist and excludes vendor archives, source packs and unused files. [Provenance](assets/licenses/town-polish.md); [retained-frame/runtime audit](verification/town-polish/runtime-audit.json).

---

# v0.7.0 — City houses and licensed residents

Free Serene Village revamped 1.9 by LimeZu (CC BY 4.0) provides the existing native building sources, adapted to terracotta/cream/timber with original windows/flowerboxes/ivy. Creator page and licence rechecked 2026-10-09; attribution/source/licence/change notice remain in the game. Six old cells change; all their alpha/positions/sizes and 554 other old frames are unchanged. Original fountain, street lamp, planted bench, pot and tent add six cells.

Eight human PNG sheets from Pipoya's Free RPG Character Sprites 32x32 add 96 selected directional cells. Its **custom terms**, not CC0, allow commercial/personal games and editing while forbidding standalone pack redistribution/resale. Original pack and source sheets stay outside the repository and build. Separate in-game credit links to its source/terms. Source/hash/file/cell evidence and regeneration instructions: [City provenance](assets/licenses/city-redesign.md) and [Pipoya evidence](assets/licenses/pipoya/README.md). References supply style only. Existing third-party terms remain source-specific; no claim that the mixed atlas is an asset-library licence.

Production still uses eight allowlisted art files and no runtime remote artwork/new dependency. Only town.png/json change; both supplied farmer sheets and six other runtime files remain byte-identical. Atlas has 662 cells; [runtime audit](verification/city-redesign/runtime-audit.json). Earlier prize-entry/other-pack rights limitations remain unchanged.

---

# v0.6.2 — original seed and utility pixels

Four new original 16×16 icons (axe-item, hand-item, wood-item, grass-item) and twenty-four improved original seed cells (twelve inventory packets and twelve planted markers) are deterministic project source pixels with Codex assistance. Fruit emblems reuse the project's existing original crop-item art. No screenshot pixels, commercial-game art or new external pack is used. scripts/garden_tools_art.py is called by the established atlas generator. Among the 556 prior frames, 532 remain byte-identical with unchanged coordinates; the atlas now has 560 frames. Six other runtime art files, including both supplied farmers, remain byte-identical. Retained creator/licence obligations below are unchanged. Evidence: assets/licenses/garden-tools.md and verification/garden-tools/runtime-audit.json.

---

# v0.6.1 — original watering can and soil source

One original 16×16 watering-can-item is appended to town; all 555 previous cells and their coordinates are unchanged. The new can, soft soil material/fringes and held/pouring geometry are deterministic project source with Codex assistance. Six other runtime art files, supplied farmer sheets and licensed atlas cells remain unchanged. No new external asset, font, dependency or licence. Existing creator credits and previous public-entry rights limitations remain. Source/evidence: assets/licenses/farm-polish.md and verification/farm-polish/runtime-audit.json.

---

# v0.6.0 — original farm additions

81 original code-authored frames (eight crops × eight states plus produce/seed icons, and one shovel icon) are appended to the existing town atlas. 32 prior original crop frames receive olive palette edits; 442 other retained frames are pixel-identical and every old frame coordinate remains. Soil/marker/pouring render geometry is original project source using the retained can sprite. Existing creator licences and credits remain; no new third-party artwork or dependency. Six other runtime art files are byte-identical; the allowlist remains eight files.

The supplied A_2D_pixel_art_sprite.zip was inspected and contains a lion sprite with AI prompt metadata; no pixels are integrated or packaged and no new rights claim is made. User screenshots guide style only. Original art assistance and reproducible sources are recorded in [free-farming provenance](assets/licenses/free-farming.md) and AI_USAGE.md; runtime/pixel audit in verification/free-farming. Previously recorded public prize-entry rights uncertainty remains unchanged.

---

# v0.5.2 font recovery provenance
Only source lookup changes: the existing original font sheet is copied whole into cached in-memory colour variants. All eight allowlisted art files remain byte-identical to db8f98f; no new pack/font/dependency or licence. Source evidence: assets/licenses/font-recovery.md; audit: verification/font-recovery/runtime-audit.json.

---

# v0.5.1 cached font colours
Original local font pixels are recoloured into in-memory UI textures using their alpha mask and unchanged metrics. No new font/pack/file/dependency is downloaded or packaged; all eight allowlisted runtime art files remain byte-identical to aad0861. Original project art/code attribution and existing licensed title/world assets remain. Evidence: assets/licenses/ui-readability.md and verification/ui-fixes/runtime-audit.json.

---

# v0.5.0 interface provenance
No new external asset, font, dependency or pack enters runtime. Original code-authored stepped frames, leaf/heart/bag/map/menu glyphs, notebook terrain and warm title geometry use the project licence; the title also composes retained licensed tree/farmer sprites with their unchanged author/terms. All eight runtime art files are byte-identical to v0.4.9. Five supplied screenshots are reference-only, with no extracted pixels or redistribution. Evidence: `assets/licenses/notebook-ui.md` and `verification/notebook-ui/runtime-audit.json`. Existing creator licences and previously recorded publication limitations remain unchanged.

---

# v0.4.9 unchanged art and original river geometry
All eight runtime art files are byte-identical to baseline 8275b7f (474 town atlas frames). Craftpix/LimeZu/ToffeeCraft/Channeechan/Eris Esra licences and credits remain; no new art pack or pixel extraction. River bank/shore/material/placement/texture-cache code is original Codex-assisted project source. The supplied screenshot guides general appearance only. [Source and licence evidence](assets/licenses/forest-expansion.md). Existing public prize-entry rights uncertainty remains unresolved; no publication/submission.

---

# v0.4.8 current art sources — 2026-10-08
Only the five supplied Craftpix Hunt animal species remain. Former extra-animal packs/placeholders are excluded from the runtime atlas; old licence records remain historical evidence. Seven new original code-authored canopy/palmetto cells and 27 revised grass cells are AI-assisted project work; five screenshots guide style without pixel/layout extraction. Existing Craftpix/LimeZu/ToffeeCraft/Channeechan/Eris Esra terms remain. [Source/modification/audit record](assets/licenses/forest-reference.md). No new download or publication; previous public prize-entry rights limitations remain unresolved.

---

# v0.4.7 selected animal source licences — 2026-10-08
Fifteen more combat species use selected licensed animal pixels: tapatilorenzo CC0 exception (non-Sevarihk lion/bears), ScratchIO CC0 wolf, lawnjelly + AntumDeluge CC BY 3.0 elephant, bleutailfly OGA-BY 3.0 crocodile, Ilaria Lazzarotto creator-permitted game/modification Florida panther poses, and Stojkea creator-permitted game/edit animal poses. Native versus adapted species, licence text/pages, fingerprints, rectangles and source restrictions: [full animal record](assets/licenses/wildlife-sprites/SOURCE_RECORD.md). In-game linked credits added. The creator-restricted standalone originals remain outside the repository; unrestricted vendor archives are excluded from production. The supplied basic vermin ZIP is unused. Existing asset/dependency records remain independently applicable.

---

# v0.4.6 Forest colour treatment and bridge art — 2026-10-07
Forest olive variants are local render adaptations of the retained LimeZu/ToffeeCraft/original tree and bamboo atlas cells. Shapes/alpha/native size are preserved, green foliage is remapped, bark/fruit/neutral snow retained. Existing creator attribution and legal/source records remain; no new pack or art-file redistribution. All eight runtime art files are byte-identical to v0.4.5. New bridge planks/rails, merged night rendering and broken ripple motifs are original Codex-assisted project code. Source/adaptation evidence: [forest-theme.md](assets/licenses/forest-theme.md). Original shaderless palette source: src/art/forestPalette.js. Dependencies/tool licences unchanged. No reference-image sampling or external image-model generation.

---

# v0.4.5 original forest shore additions — 2026-10-07
| Asset | Source / provenance | Use |
| --- | --- | --- |
| palm-tree 64×96, willow-tree 72×96 | Original Simple Life native-pixel source in scripts/forest_trees_art.py, authored with OpenAI Codex assistance; no external source URL or exclusive-copyright claim | Two new atlas cells, displayed at 2× with dry trunk anchors |
| Grassy earth banks and scattered water ripple motifs | Original project code in src/art/bankTerrain.js and waterRipples.js / WaterView.js | Native soil strata/turf/slope geometry and independently phased waves; no reference pixels |
| Broadleaf tree0/tree1/tree-tall/tree-wide | Existing LimeZu Serene Village revamped 1.9; CC BY 4.0, existing legal/source evidence under assets/licenses/limezu | Existing unchanged native atlas pixels, newly mixed into Forest habitats; existing attribution retained |

Creation/art evidence: [forest-shore.md](assets/licenses/forest-shore.md); AI disclosure: AI_USAGE.md. Previous 553 atlas frame pixels and both Channeechan player sheets remain unchanged. Existing FreeEnvironment/Craftpix/LimeZu provenance remains applicable. No new downloaded pack, runtime asset file, audio, font or dependency. Same eight-file art allowlist. Historical waterfall/stone cells stay in the existing atlas but are not rendered as Forest terraces/falls; original archives and unused pack files are excluded from builds.

---

# v0.4.4 original ground/river materials — 2026-10-07
Original deterministic native-pixel materials are authored in `src/art/groundSurface.js`, composed by `Terrain.js`, with camera-local currents/wading marks in `WaterView.js`. Source URLs: none; local project code and Git history with disclosed Codex assistance. No claim of exclusive copyright for AI-assisted work. The supplied screenshots inform material style only; no pixels/layouts were sampled. CC0 terrain candidates were surveyed but neither downloaded nor used. No new art pack, image-generation model, font, audio, runtime file, dependency or licensing obligation. Existing licensed LimeZu cliffs and supplied trees/player art remain independently credited; all eight allowlisted processed runtime art files are unchanged. [Creation and survey evidence](assets/licenses/ground-river-materials.md).

---

# Supplied character / forest art — 2026-10-07, v0.4.3 / schema 9
The latest user explicitly authorizes FreeEnvironment for their noncommercial game and Channeechan's Cute Farmer Character instead of Mana Seed. Both supplied boy/girl characters now replace the original player in every location and selection preview; 24×32 cells/animation keys/feet/scale remain. All idle/walk pixels are native source pixels; three jump poses adapt the supplied body. New conifers, boulders, ice and dry plants update Forest scenery, while fruit broadleaf trees/acacias/bamboo preserve distinct habitats. Tree bases align with existing solids and larger crowns fade/sway correctly. Existing 820 tree/bamboo props, 3,880 responsive grass clumps, 20 terraces, walkable water, 20 habitats/22 species, forage/guarded treasure, farming/City/sleep/save/recovery remain. No gameplay/save schema change, dependency, backend or remote runtime asset.

Licences/source/selected rectangles: [SOURCE_RECORD.md](assets/licenses/supplied-farmer-environment/SOURCE_RECORD.md). Channeechan allows commercial/noncommercial game use and modifications; underlying Eris Esra template also permits game use. Both credited. FreeEnvironment's Standard Free licence allows personal game development; user's noncommercial instruction authorizes local integration but **public prize-competition coverage remains unconfirmed**, and no additional creator permission is claimed. Mana Seed stays excluded. Original source archives/PNGs remain outside the repository; eight allowlisted processed runtime art files only. Nothing pushed, published or submitted.


---

## Forest growth audit — 2026-10-07, v0.4.2
The supplied Mana Seed farmer sample and ToffeeCraft FreeEnvironment are **excluded** pending compatible rights. Mana Seed's full User License prohibits use alongside AI-generated code/art; this project has documented AI assistance. ToffeeCraft's free licence is personal-use only, with commercial use reserved for its paid licence. Primary licence HTML, supplied ZIP hashes, findings and exact current asset provenance: [SOURCE_RECORD.md](assets/licenses/forest-growth/SOURCE_RECORD.md). No purchase/creator contact/source redistribution. User informed; no separate permission supplied.

Actual additions reuse credited LimeZu Serene Village CC BY 4.0: four native cliff rectangles, plus 27 original Codex-assisted tall-grass straight/bend frames and 24 original farmer crouch/air/landing poses. Original farmer idle/walk/face pixels remain; sheets now 216×128, 9×4 native 24×32 cells. Source files: scripts/forest_growth_art.py and process-rpg-assets.py; manifest records licensed rectangles separately. Atlas 545 frames / 1024×2048. Same eight-file allowlist excludes archives/unused assets/QA/licence records/guides. Dependencies/font/audio unchanged; existing docs/licenses evidence applies.

## Current user-supplied asset integration — 2026-10-07, v0.4.1
Craftpix Free Top-Down Hunt Animals Pixel Sprite Pack, Free Top-Down Ruins Pixel Art, and Free Predator Plant Mobs Pixel Art Pack were supplied by the user and verified against their official product pages and the Craftpix Freebie Products §2 licence (https://craftpix.net/file-licenses/). Creator: Craftpix. Received/integrated: 2026-10-07. The 258 selected native PNG frames, source paths/rectangles and modifications are in processed/manifest.json `craftpixFrames`; licences, SHA-256/provenance and official source record: assets/licenses/craftpix/SOURCE_RECORD.md and archives.json. Extraction/repacking only; no recolouring/resampling. Runtime use: Boar animation replacement, four quiet woodland species, ruins and plant scenery. Four original waterfall frames are separately identified. Town atlas 514 frames / 1024×2048; unchanged eight-file production allowlist excludes untouched source ZIPs and unused files. Craftpix is credited in game, alongside LimeZu. The other 21 combat species retain original art. Earlier no-new-pack statements below describe previous releases.

# Assets, licences and creation sources
## Pass 2 selected external environment — recorded before integration, 2026-10-04
| Asset / pack | Creator | Original page | Direct download | Licence | Attribution | Downloaded | Files used | Modifications | In-game use |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tiny Town 1.1 | Kenney | https://kenney.nl/assets/tiny-town (also https://opengameart.org/content/tiny-town) | https://kenney.nl/media/pages/assets/tiny-town/a415fbeb49-1735736916/kenney_tiny-town.zip | CC0 1.0 Universal | Tiny Town by Kenney (www.kenney.nl), CC0; credit voluntary | 2026-10-04 | Selected Tiles/tile_*.png; exact tile IDs recorded in processed/manifest.json | Palette normalization, tile composition, atlas packing; no smoothing | Primary terrain, paths, vegetation, buildings, fences, props in Home/Farm/City |

Untouched archive: public/assets/vendor/kenney/tiny-town/kenney_tiny-town.zip. Licence, official-page copy, URL and archive SHA256: docs/assets/licenses/. Runtime adapted assets: public/assets/pixel/processed/. Build excludes the source archive and all unused pack files. No marketplace preview image is used. No additional external character pack: retained original characters are redrawn to a compatible smaller pixel grid.

The original-only statements below describe the previous 0.1.1 release. Pass 2 uses the CC0 environment above alongside retained original furniture, crop, UI and character work.
## Current original pixel assets — 2026-10-03–04
All files below were newly authored with Codex assistance for Simple Life using deterministic integer-pixel drawing in `scripts/generate-pixel-assets.py`. They are original temporary game assets, not downloaded art or copied reference assets. PNGs are rasterized by Pillow without smoothing, then loaded locally by Phaser. There are no externally licensed art packs. Team usage-rights/human-review confirmation remains required before the final competition declaration; this file is not a signed legal opinion.

| Runtime file / atlas frames | Purpose | Creator/source |
| --- | --- | --- |
| `public/assets/pixel/world.png`, `world.json` | Packed source atlas and named frames | Original Codex-assisted project code, generator above |
| `grass0`–`grass3`, `path0`–`path1` | 16×16 tropical terrain and paths | Same generator, seeded pixel variations |
| `soil`, `watered-soil`, `crop0`–`crop5` | Individual farm plots, seed/sprout/growing/mature/wilt/dead crop artwork | Same generator; tomato only |
| `floor0`–`floor1`, `stone`, `wall`, `water0`–`water1` | House interior, masonry, walls and pond | Same generator |
| `tree0`–`tree1`, `palm`, `bush`, `flowers`, `rock` | Layered vegetation and ground decoration | Same generator |
| `fence`, `sign`, `house`, `window`, `door` | Farm structures and navigation | Same generator |
| `bed`, `table`, `dresser`, `counter`, `pot` | Interior furniture and market fixtures | Same generator |
| `seed-shop`, `produce-shop` | Original city stalls and shopkeepers | Same generator |
| `seed`, `can`, `sickle`, `tomato` | Actual item/tool inventory icons | Same generator; no emoji |
| `coin`, `heart`, `energy`, `marker`, `sun`, `moon`, `pause` | Currency, HUD and interaction art | Same generator |
| `public/assets/pixel/boy.png`, `girl.png` | 24×32 frames, idle + 2 walk frames per direction, 12 frames each | Same generator, original silhouettes |
| `public/assets/pixel/font.png`, `font.xml` | Original 5×7 bitmap glyphs; ASCII lowercase reuses uppercase forms | Same generator; no bundled third-party font |
| `src/art/worldArt.js`, `src/ui/pixelWidgets.js` | Pixel rug/borders, atlas composition and UI frames | Original Codex-assisted integer-coordinate source |

The previous runtime Graphics scenery and DOM/CSS character/icon approximations were replaced. No music, sound effects, voice, external images or font files have been added. Public asset README and generation source retain reproducible creation evidence. The Plant Tales YouTube reference is visual inspiration only; none of its media/assets/code is redistributed.

## Libraries and development tools
- Phaser 3.90.0, Phaser Studio, https://github.com/phaserjs/phaser — MIT; runtime engine. Licence copied under docs/licenses.
- Vite 6.4.3, Vite contributors, https://github.com/vitejs/vite — MIT; local build/dev tool. Exact transitive versions, registry sources and integrity hashes are in package-lock.json. Local evidence in docs/licenses/DEPENDENCIES.md and accompanying files.
- Pillow, Python Pillow contributors, https://github.com/python-pillow/Pillow — HPND (PIL Software License). Used only to rasterize project-authored pixel geometry; not distributed with runtime. Licence evidence copied under docs/licenses/Pillow-LICENSE.txt.
- Node.js/npm: local build/tests. Python: optional asset regeneration only. Playwright/agent-browser: development QA only, not runtime dependencies. OpenAI Codex: disclosed AI coding/art assistance; details in AI_USAGE.md.

## Pass 2 integration manifest and retained original work
The final environment atlas contains **45 named frames**, assembled from **49 selected Kenney PNG tiles plus original additions**. Exact IDs and named frame inventory: public/assets/pixel/processed/manifest.json. Palette adaptation and composition source: scripts/process-town-assets.py. Every source tile ID in the manifest corresponds to Tiles/tile_NNNN.png in the untouched archive. No source PSD/Aseprite/project file is used or shipped.

| Files / frames | Creator and source | Modifications / use | Rights evidence |
| --- | --- | --- | --- |
| processed/town.png + town.json: grass, grass-detail, flowers, bush, mushroom, fence, post, fence-v, crate, sign, well, wheelbarrow, barrel, path + eight path edges/corners, tree, three roof parts, house, house-blue, shed | Kenney, Tiny Town 1.1; official URL/download in table above | Palette lookup; grass base made transparent for overlay; modular composition and atlas packing. Home/Farm/City primary environment | CC0 1.0; creator License.txt and official page in docs/assets/licenses/ |
| Same processed atlas: plaza, bench, lamp, mailbox, scarecrow, notice, fountain0/1, butterfly0/1, dust, bed, table, npc0/1/2 | Original project art authored with Codex assistance in process-town-assets.py, 2026-10-04 | Original integer pixel geometry; NPCs are palette variants of original farmer frames. Furniture, civic/farm landmarks, ambient effects and optional dialogue characters | Original project work; AI_USAGE.md. Not represented as Kenney art |
| processed/boy.png and girl.png | Original Codex-assisted project characters, 2026-10-04 | Redrawn as 16x24 frames, retaining hats, farm clothes, boy/girl identity and independent four-direction animation; no resampling or external character pack | Same original-project provenance |
| world.png/world.json and font.png/font.xml | Retained original pass-1 code-native pixel assets | Crop stages, soil/water, floor/walls/windows/dresser, market stalls, plants/stones, item/HUD icons, interaction marker and bitmap text. Some environment entries are superseded; no new licence claim | Original inventory/source above; AI_USAGE.md |

No externally generated AI imagery or PixelLab output was used. No audio pack was added. The production asset list contains only eight runtime PNG/JSON/XML files, with no vendor ZIP or unused pack files. Voluntary credit: **Tiny Town by Kenney (www.kenney.nl), CC0 1.0; palette/composition adapted for Simple Life.**

## Current replacement — Serene Village craftsmanship pass (2026-10-05)

This entry supersedes Tiny Town as the active environment family; the Kenney archive and its evidence remain historical. No Kenney-derived tile is in the current `town` runtime atlas.

- **Name / creator:** Serene Village revamped v1.9, LimeZu.
- **Official source:** https://limezu.itch.io/serenevillagerevamped
- **Licence:** Creative Commons Attribution 4.0 International, https://creativecommons.org/licenses/by/4.0/ . Allows sharing/adaptation including commercial games, subject to attribution, licence link, change identification, and no additional restrictions on licensed material.
- **Credit:** “Serene Village revamped by LimeZu — CC BY 4.0. Adapted palette and atlas for Simple Life.” In-game Credits includes clickable source/licence links. Original missing game art is identified separately.
- **Downloaded:** 2026-10-05, official free itch.io flow, no account/payment.
- **Untouched source:** `public/assets/vendor/limezu/serene-village/Serene_Village_revamped_v1.9.zip`, SHA-256 `22f5b68d950fd8eeafe65690daa1723c74b68ccbc3db7240c3bd4935915e9041`.
- **Original files used:** `SERENE_VILLAGE_REVAMPED/Serene_Village_16x16.png`; `SERENE_VILLAGE_REVAMPED/Animated stuff/door_16x16.png`. No higher-resolution duplicates, demos or previews used.
- **Modifications:** native-resolution extraction/repacking, selected green hues moved toward jade, original chimney/market-awning additions. Exact source rectangles in `public/assets/pixel/processed/manifest.json`; reproducible `scripts/process-rpg-assets.py`.
- **Locations:** Home, Farm, City and title-world backdrop; trees, bushes/flowers, paths, houses, shed, shop fronts, fences, rocks and doors.
- **Evidence:** `docs/assets/licenses/limezu/serene-village-source.html` (creator page declares CC BY 4.0), `CC-BY-4.0.txt` (full legal text), this attribution/change record. Archive has no standalone licence; the creator's explicit page declaration is preserved.
- **Original additions:** boy/girl 24×32 sheets, NPC variants, missing kitchen/bed/storage/table/chair/rug/window/indoor tiles, fountain, utility props, water overlays, farming soil and effects. Created in the project pipeline, not from Modern Interiors or another pack. Existing original crop atlas, bitmap font, UI icons and markers remain. AI assistance recorded in AI_USAGE.md; no claim of exclusive copyright is made for AI-assisted originals.
- **Rejected companion:** Modern Interiors Free v2.2 is non-commercial only and was not integrated. No purchased, login-only, GPL or ShareAlike assets were introduced.
- **Distribution:** eight allowlisted runtime files only. Untouched ZIP and unused files never ship in `dist/`.

## Stabilization sprite correction — 2026-10-05
Original boy/girl sheets retain their 24×32 grid and 24-frame structure. Side eyes moved onto visible face pixels (x=9 left, x=15 right) in process-rpg-assets.py; related original NPC variants regenerate. No third-party art was redrawn or replaced. Offline frame gallery and pixel checks live under docs/verification/stabilization, outside the runtime allowlist. LimeZu attribution/licence unchanged; City source art is retained but City travel is disabled.

## Foundation repair — 2026-10-06
No runtime asset files changed or were added. Existing house atlas alpha runs inform collision only; existing floor/wall/furniture/door tiles are reused without stretching. Art licences, attribution, source evidence and eight-file production allowlist remain unchanged.

## Farming presentation — 2026-10-06
The town atlas now has 96 frames. Ten new original project frames (two 24×24 soil tiles and eight 24×32 tomato states) are generated by scripts/crop_art.py and packed by process-rpg-assets.py. This source and processed/manifest.json record their origin; they are not LimeZu or commercial-game crop artwork. AI assistance is disclosed in AI_USAGE.md. No new third-party download/licence, font or audio. Existing CC BY 4.0 attribution/evidence and eight-file production allowlist remain intact. Historical “no asset changes” statements apply only to their named earlier pass.

## Milestone 1.1 original UI and navigation art — 2026-10-06
Original Codex-assisted Simple Life pixel masks: leaf, game clock, morning sun, evening moon, water drop, warning, harvest basket and eight-direction arrows (`src/ui/statusArt.js`). Original wooden FARM board/post geometry and bitmap label (`src/art/worldArt.js`). Source URL: none; created locally for this project, with reproducible source and Git history. The existing original tomato icon and font are reused. No new third-party asset/licence or runtime image file. Art evidence: `docs/assets/licenses/milestone-1.1-original-ui.md`; AI disclosure: AI_USAGE.md. LimeZu attribution and the runtime asset allowlist remain intact.

## Milestone 1.2 reuse — 2026-10-06
No runtime raster/atlas/font file or external asset changed. The existing original soil/crop art and licensed LimeZu environment/props are reused for matching purchased fields/farms. FARM board geometry is retained with a smaller centered original bitmap label; its southern duplicate is removed. No new licence or dependency. Source-authored labels and canvas menus remain original Codex-assisted project work. Evidence: assets/licenses/milestone-1.1-original-ui.md and original-farming-art.md; existing LimeZu legal/source records and eight-file build allowlist remain unchanged.

## Milestone 2 original City/crop additions — 2026-10-06
39 original Codex-assisted frames extend the town atlas from 96 to 135: three new crops × eight states (24×32), four produce icons and four seed packets (16×16), two awning stalls (80×64), four merchant idle/blink frames derived from the existing original project NPCs (24×32), and one stone paving tile (16×16). Reproducible source: scripts/crop_art.py, packed by scripts/process-rpg-assets.py; manifest records original/addition provenance. CITY/HOME wooden signs and market arrows are original source geometry/glyphs in worldArt/statusArt. LimeZu environment props/tiles remain credited CC BY 4.0 with existing licence evidence. No new pack/download, image service, dependency, font or audio. Art evidence: assets/licenses/milestone-2-original-city.md. Runtime allowlist still contains eight files.

## 2026-10-07 reuse and presentation
Compact shop cards and day/night tint are original Codex-assisted Phaser canvas geometry/code. Original crop/packet/coin icons, font and sun/moon masks are reused; no runtime art file or external asset/licence/dependency changed. Existing LimeZu CC BY 4.0 credits remain. Creation evidence: assets/licenses/day-night-ui.md; AI disclosure: AI_USAGE.md. Eight-file production art allowlist is preserved.

## Milestone 3 forest assets — 2026-10-07

| Asset / local frame | Creator/source | License/provenance | Modifications/use |
| --- | --- | --- | --- |
| wild-berry-item, guava-item, mango-item, wild-hide-item, wooden-club-item, stash-bag, boar0–3, forest-log, shrine-stone | Simple Life original project work, authored with OpenAI Codex assistance in scripts/forest_art.py | Original integer-pixel source and Git history; no third-party source URL; no exclusive-copyright claim for AI-assisted work | 16×16 items, 24×24 bag, 32×26 boar poses, 32×18 log and 24×28 stone; native outline/shadow/highlight palette |
| guava-tree, mango-tree | LimeZu Serene Village revamped 1.9 tree0; source https://limezu.itch.io/serenevillagerevamped | CC BY 4.0, https://creativecommons.org/licenses/by/4.0/ ; existing creator-page/legal evidence under assets/licenses/limezu | Retains the native tree pixels/palette adaptation; original fruit clusters added by forest_art.py. Explicit derivedAdditions in manifest |
| outfitter-stall | Original Simple Life seed-stall from crop_art.py, adapted by forest_art.py | Original Codex-assisted source; no external pack | Cloth recolour and original Wooden Club display; existing original npc1 keeper reused |
| Forest route, wooden direction boards, stepped night bands, swing/impact/energy effects and canvas panels | Original project source in forest.js, worldArt.js, ForestView.js, SurvivalPanel.js | Codex assistance disclosed in AI_USAGE.md | Integer-pixel geometry and retained bitmap font; no reference-game artwork |

Current town atlas: **150 frames** (15 added). Existing licensed environment and character attribution stay visible in Credits. No new downloaded art, sound, music, font, runtime dependency or image-generation service. The existing eight-file art allowlist is unchanged; no vendor archive/source file enters production. Forest asset evidence: assets/licenses/milestone-3-forest.md. Existing library/tool license evidence under docs/licenses remains applicable, with package versions unchanged. Audio hooks stay silent because there are no suitable license-safe effects already supplied.


## Wilderness expansion — 2026-10-07

| Asset | Creator/source | License/evidence | Modifications |
|---|---|---|---|
| 84 wildlife frames, six fruit icons, grass details, bamboo, cave mouth, ruin pillar, ice crystal, camp tent, waterfall stone, ancient chest | Original Simple Life project work with OpenAI Codex assistance; scripts/wilderness_art.py; no external source URL | Original source/Git evidence; disclosed AI assistance, no exclusivity claim | Native 16×16 item pixels and species-specific silhouettes/markings/four poses; consistent shadow and highlight clusters |
| snow-pine, acacia-tree | LimeZu Serene Village tree0; https://limezu.itch.io/serenevillagerevamped | CC BY 4.0; https://creativecommons.org/licenses/by/4.0/ ; existing assets/licenses/limezu evidence | Recolored native foliage clusters with luminance retained; explicit derivedAdditions, excluded from originalAdditions |
| River, timber bridges, animated stepped waterfalls, cave floors, habitat palettes, exploration map | Original project data/Graphics/Canvas source | Codex assistance recorded in AI_USAGE.md | Uses the established bitmap font and licensed grass/tree palette family; no new downloaded asset or smooth filter |

Detailed creation record: assets/licenses/wilderness-expansion.md. Atlas now **252 frames at 1024²**, adding 100 original and two derived frames. Existing farmer sheets and original boar remain; same eight-file runtime allowlist. No new npm dependency, font, audio, external image service or remote runtime asset. Existing dependency/license evidence under docs/licenses remains unchanged.
## 2026-10-20 UI refactor — no new asset licence

The cozy interface pass adds source-authored Phaser/CSS geometry and reuses the project's already licensed local bitmap fonts and existing icons. It adds no raster asset, downloaded font, remote runtime asset, package or third-party artwork. The supplied UI screenshots are style references only and are not copied or distributed. Existing licence evidence and the production runtime asset allowlist are unchanged.

## Fountain island palette match — 2026-10-20

The review-only `output/art/fountain-island-matched-v1/fountain_island_matched.png` is a deterministic Pillow/numpy pixel edit of the already recorded OpenAI-generated fountain review source. The user-supplied gameplay screenshot supplies only sampled palette and shadow-direction evidence. No new generated or third-party pixels were introduced. Source hashes, exact operations and deliverable hashes are recorded in `docs/assets/licenses/fountain-island-matched-v1/SOURCE_RECORD.md`. The result remains outside the runtime allowlist and is not integrated into the game.

## Original fountain island v3 — 2026-10-20

The review-only `output/art/fountain-island-v3/` set is a newly composed OpenAI image-generation sprite requested by the user, followed by deterministic Pillow/numpy palette locking and water animation. The supplied screenshot is a style/color reference only; no layout or pixels were copied. Exact source, prompt, processing, hashes and limitations are recorded in `docs/assets/licenses/fountain-island-v3/SOURCE_RECORD.md`. The set remains outside the runtime allowlist and is not integrated into the game.

## User-supplied City fountain island — 2026-10-21

The active `public/assets/pixel/processed/fountain-island.png` sheet derives from two ChatGPT-generated PNGs supplied by the user with an explicit request to integrate them. The complete flowing image supplies all visible runtime object pixels; the calm image is retained as evidence only. A deterministic Pillow/numpy import removes magenta, and the current v5 processor animates only existing blue/teal source colors across eight frames. No third-party pack, remote asset or new dependency was introduced. Source provenance is recorded in `docs/assets/licenses/fountain-island-user-v2/SOURCE_RECORD.md`; current eroded mask, processing, hashes, automatic checks and competition-use limitation are recorded in `docs/assets/licenses/fountain-island-water-v5/SOURCE_RECORD.md`. This local runtime image remains on the production allowlist; human rights/eligibility acceptance is still required.

## Approved generated ground grass — 2026-10-21

The local runtime files `public/assets/pixel/processed/grass-ground-a.png`, `grass-ground-b.png` and `grass-ground-c.png` derive from the user-approved OpenAI-generated/adapted review textures in `output/art/ground-grass-review-v1/`. After the first integration was rejected for rectangular brightness blocks, a deterministic pixel-only correction warmed the six lawn tones, removed repeating cream specks and installed the corrected files recorded in `output/art/ground-grass-v2/` and `docs/assets/licenses/ground-grass-v2/`. The attached game and commercial-game screenshots were used only for palette, pixel-density and mood guidance; no source pixels or layouts were copied. The three corrected PNGs remain explicit production-allowlist entries. Human competition-rights and visual acceptance remain required.

## Review-only generated tall-grass clumps — 2026-10-21

Three original wide/tall/small source images were created with separate OpenAI built-in image-generation calls at the user's request. The current clump was a problem reference and the attached commercial-game screenshots were used only for general warm-olive mood, density and pixel-size guidance; no source pixels, plant shapes or layouts were copied. Deterministic nearest-neighbor processing removed magenta, kept one connected sprite, filled enclosed pinholes and quantized to the approved five-color clump palette. Final candidates and checks are under `output/art/tall-grass-clump-review-v2/`; prompt/provenance notes are under `docs/assets/licenses/tall-grass-clump-review-v2/`. These files are not copied into `public/`, are not in the runtime allowlist and are not integrated pending human approval.

The rejected v2 review is superseded for visual review by `output/art/tall-grass-clump-review-v3/`. Three new final selected sources were created in separate built-in OpenAI image-generation calls; one unused wide attempt was discarded. Deterministic offline processing detects each large preview's logical-pixel cadence and assigns the most common locked color per logical cell instead of point sampling. Source/output hashes, detected 19/20px cell sizes, native logical sizes, palette/alpha/connectivity/noise checks and prompt summary are recorded in `docs/assets/licenses/tall-grass-clump-review-v3/`. The attached gameplay screenshot informed only color, pixel density and mood. These candidates remain outside `public/` and the production allowlist pending human approval.

The corrected `output/art/ground-grass-v3/` files supersede v2 at runtime. They are deterministic palette-only edits of the already recorded generated lawn assets: no new image-generation call or third-party pixel source. A/B/C hashes, changed-pixel counts, exact-edge checks, lightness and world-mask alignment evidence are recorded in `docs/assets/licenses/ground-grass-v3/`. The three production allowlist paths are unchanged.

The v3 wide/tall/small clumps are now user-approved runtime assets. `public/assets/pixel/processed/grass-clumps.png` is a 144×48 local sheet with three 48×48 scale-1 cells. The selected wide is the second generated candidate with fewer/broader blades. Source/final hashes, detected-grid majority-vote checks and the runtime-install manifest are under `docs/assets/licenses/tall-grass-clump-review-v3/`. This integration adds no third-party source or remote runtime dependency; final human competition-rights acceptance remains required.

## Review-only modular tree feasibility — 2026-10-23

Six original review components were created in six separate OpenAI built-in image-generation calls at the user's request: three leaf-cluster sizes, one warm branching trunk, one pale trunk and one warm root flare. Screenshots were mood/pixel-density references only. Local processing removes the magenta matte, reconstructs the logical grid by majority vote and quantizes without dithering to the locked foliage/trunk palettes. Source hashes, detected logical sizes, final sizes, connectivity/alpha/palette checks and fixed-seed placements are under `docs/assets/licenses/modular-tree-feasibility-v1/`. The assembled 175×225 tree and all modules remain outside `public/` and the runtime allowlist pending approval; no bush or production tree/palm asset was created.
