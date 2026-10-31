# Simple Life

**Simple Life** is a fullscreen browser farming, exploration, economy and narrative adventure created for Digit7 Jam 2026. Choose a farmer, grow and sell crops, explore the Forest, meet residents in the City, uncover the Last Lantern story and build a calmer life across the Homestead, Forest and City.

## Technology

- JavaScript ES modules
- Phaser 3.90.0
- Vite 6.4.3
- Local bundled assets and audio
- LocalStorage saves with schema-21 migration support
- Keyboard, mouse and touch controls

The production game has no backend, runtime CDN, analytics, advertising, authentication or cloud save.

## Clone and install

Install Node.js 20 or newer, then clone the repository and install its pinned dependencies:

```bash
git clone https://github.com/Htetaungkyaw71/simple-life.git
cd simple-life
npm ci
```

## Run the game

```bash
npm run dev
```

Open the local URL shown by Vite, normally <http://127.0.0.1:5173/>.

To create and preview the production build:

```bash
npm run build
npm run preview
```

The production build is written to `dist/` and must be served over HTTP(S). Run the tests with `npm test`.

The normal production build starts a new game with **60 coins**; the separate historical playtest-only 100,000-coin grant is disabled. The user-supplied competition cover is stored at `submission/simple-life-cover.png`, and the supplied `public/favicon.svg` is used as the browser tab and PWA icon. Their source hashes and provenance limitations are recorded in `docs/assets/licenses/submission-branding-v1/SOURCE_RECORD.md`.

---

# 2026-10-23 — Mystical Forest River welcome view

The welcome screen now uses an original front-facing Mystical Forest River composition: a luminous deep-forest clearing, tall layered trunks, dark tropical foliage framing both sides, a calm foreground river, distant waterfall and rustic bridge. The generated background contains no baked title, buttons or characters; Phaser keeps the Simple Life wordmark, save-aware menu, English/မြန်မာ selector, focus feedback and responsive hit targets live above it. The title alone now has a complete dark pixel outline, deeper offset shadow and warm-cream face for clarity against the bright clearing. Short reference-style water wavelets pulse only inside a conservative source-space river channel; the previous lower-screen travelling-line layer is removed so rocks, roots, bridge and shoreline foliage remain dry. Birds and drifting leaves remain subtle, and reduced-motion still freezes scenery motion.

The asset is local and explicitly allowlisted; no runtime AI, remote image, backend or new dependency was added. Generation, reference roles, exact prompt, hash and limitations are recorded under [the source record](docs/assets/licenses/welcome-mystical-river-v1/SOURCE_RECORD.md). Verification is recorded in [project status](docs/PROJECT_STATUS.md). No deployment, publication or push.

---

# 2026-10-23 — silent tool toggles and visible Meat cooking loop

Seed and Harvest toolbar toggles now change only their selected icon state: no temporary selection text, nearby-world prompt or first-farm guide appears. Hunted Meat is a raw ingredient on the first **Bag → Gear** page. Choose **Cook** to see the Home-hearth recipe; at the hearth, a built stove converts **1 Meat + 1 Wood** into **1 Grilled Meat**. Grilled Meat is first in **Bag → Food**, and eating it restores **50 health / 35 energy**, capped at 100. Raw Meat is no longer edible directly.

The focused Node regressions pass, the production build succeeds, and real Chrome canvas checks pass the toolbar flow at 1280×720 and the complete cook/eat flow at 640×360. The full repository suite is **408/410**: two unrelated pre-existing art-manifest checks remain red in the dirty art worktree (`barber-grass-v2` runtime reference and Pixel Snapper frame-count drift). No asset, dependency, save schema, backend, deployment, publication or push changed.

---

# v0.43.5 — focused Home design and wardrobe menu (2026-10-23)

Home + Garden now exposes only **House designs** and **Wardrobe**. Craft/materials, garden/tree shopping and room-furniture shopping are temporarily hidden from this menu while their existing data and save records remain intact for a future return.

House designs now contains exactly two existing City residences: the free Green Bay cottage and the 2,000-coin Blue Slate cottage. No new artwork was generated. The selected City façade is used for the actual Home exterior, its collision follows that façade, and the furnished walk-in room changes between the established warm green treatment and a clearly cool-blue treatment. Continue maps any previously owned paid retired house to Blue Slate so a paid entitlement is not lost.

All **409 tests pass**, `npm run build` succeeds, and local Chromium acceptance passes fresh desktop, portrait phone, short-landscape, Blue Slate exterior/interior and legacy-save cases with no captured console/page errors. [Screenshots, browser record and limitations](docs/verification/home-menu-v0435/README.md). No deployment, publication or push.

---

# City building redesign concepts — review only (2026-10-18)

Created nine distinct residential façade concepts plus new café, clothing-shop and barber façades after inspecting the running City. The approved Pixel Snapper cottage anchors pixel density, palette and perspective without being duplicated. All twelve RGBA PNGs remain outside runtime under [the review folder](output/art/city-building-redesign-v1/README.md); the playable game is unchanged while the user reviews/processes them. Manifest validation, all 385 tests and the production build pass. [Prompts](output/art/city-building-redesign-v1/PROMPTS.md) and [source disclosure](docs/assets/licenses/city-building-redesign-v1/SOURCE_RECORD.md). No deployment or push.

---

# v0.42.2 — native Pixel Snapper cottage in City (2026-10-17)

The user-supplied 167×110 Pixel Snapper cottage now replaces the same northern City residence for review. Only the exact-white backdrop becomes transparent; every non-white source pixel and the original canvas dimensions remain exact. Phaser renders it at integer 2× with nearest-neighbour filtering. The visible door stays at the existing entry, and Tomas's home identity, parcel, save data, routes, shops, services and all other gameplay remain unchanged.

[Source, hashes and terms](docs/assets/licenses/city-cottage-snapper-v2/SOURCE_RECORD.md) and [checks/limits](docs/verification/city-cottage-snapper-v2/README.md). No deployment or push.

---

# v0.42.1 — cleaned terracotta cottage in City (2026-10-17)

The approved cleaned terracotta cottage now replaces one northern City residence. It uses the same 120×112 native cell and integer 2× world scale as the neighboring cottage, with a centered visible door, traced collision, connected paved approach, and preserved resident/home/save identity. Shops, services, other houses, layouts and gameplay are unchanged.

The selected generated original, native derivative, prompt summary, output terms, hashes and preservation audit are recorded under [source evidence](docs/assets/licenses/city-cottage-terracotta-v1/SOURCE_RECORD.md). Full tests/build and local browser verification are recorded in [checks and limits](docs/verification/city-cottage-terracotta-v1/README.md). No deployment or push.

---

# v0.42.0 — living welcome screen (2026-10-17)

The welcome screen now opens directly with persistent English/မြန်မာ controls. A layered Phaser farm scene replaces the static title composition: flowing river reflections, flying birds, wind-blown leaves and independently swaying tree crowns. The two title characters are removed; farmer selection remains. The Simple Life wordmark has a warm cream shadow and leaf ornament, and spaced buttons use a short entrance fade, hover response and animated focus leaf. Reduced-motion preferences are respected.

New-game confirmation, Continue, help, credits, local saves and the fullscreen canvas architecture remain. See [checks and release](docs/verification/welcome-v042/README.md) and [art/source record](docs/assets/licenses/welcome-v042/SOURCE_RECORD.md).

---

# v0.41.0 — approved City garden and shops integrated (2026-10-17)

The café occupies the requested southern cottage site with two tables in front. The riverside clothing shop and nearby barber have enterable interiors with Nell and Sol's existing services. The camp is on the eastern green plot without its fixed planter bench; northern cottages retain the relocated residents' home identities. Fountain planting is fuller, and the current green-ground style and public seating terrace remain.

[Play locally](http://127.0.0.1:4215/) — refresh and Continue.380 tests and production build pass. [Browser views, checks and limits](docs/verification/city-shops-v1/README.md). Approved artwork, both previous proposals and original generated files are preserved. Café currently provides outdoor seating. No deployment or push.

---

# v0.40.0 — approved City streets and terrace integrated (2026-10-16)

The approved compact three-bench terrace, connected warm-grey streets, cream sidewalks with shallow raised curbs/lowered crossings, and shaped planted fountain island are now playable. **The existing game's green-ground palette, noise and grass texture are retained**, replacing the proposal's flat olive/sage fields. Approved furniture, fountain, lamps, character art and scales stay unchanged.

[Play locally](http://127.0.0.1:4215/) — refresh and Continue.375 tests and production build pass. [Live screenshots, access/save checks and limits](docs/verification/city-layout-v1/README.md). The three historical proposals and earlier artwork remain preserved. No deployment or push.

---

# v0.39.0 — refreshed outdoor details and night lamps (2026-10-16)

Refreshed notice/route boards, wheelbarrow, ground wildflowers, fountain and tents. The same approved well is50% larger; older planted benches reuse the accepted planter. Lamps light at night and stay unlit by day. City lamp bases clear roads and tree roots sit on green ground, retaining saved chopping IDs.

[Play locally](http://127.0.0.1:4215/) — refresh and Continue.371 tests/build and source/runtime audits pass. [Day/night views, checks and limits](docs/verification/outdoor-followup-v1/README.md); [source evidence](docs/assets/licenses/outdoor-followup-v1/SOURCE_RECORD.md). Originals and backups remain. No publication.

---

# v0.38.0 — reviewed outdoor collection integrated (2026-10-16)

The approved unlit lamp and fourteen reviewed outdoor objects now replace matching art across the world. Inspect Home/Farm/City for walnut benches, blank signs, mailbox, crates/barrels, joined fences, a closed City boundary gate, wells, foliage, rocks, trees, flowerpots and empty market stalls. The approved home and planter remain.

[Play locally](http://127.0.0.1:4215/) — refresh and Continue.367 tests and production build pass; actual Home/City walking and art checks passed. [Screenshots, checks and limits](docs/verification/outdoor-collection-v1/README.md), [originals/prompts/provenance](docs/assets/licenses/outdoor-collection-v1/SOURCE_RECORD.md). Previous art is backed up. No publication.

---

# v0.37.2 — muted City planter-bench (2026-10-16)

The approved walnut/sage revision now replaces the orange planter-bench below the City seed stall, left of the fountain. Placement, scale and footprint stay the same. Reload [the local game](http://127.0.0.1:4215/) to inspect it. Original and previous artwork remain preserved.

365 tests and production build pass. Actual in-app browser reload/City visual check passed. [Screenshot, checks and limits](docs/verification/planter-bench-muted-v2/README.md); [source evidence](docs/assets/licenses/planter-bench-muted-v2/SOURCE_RECORD.md). No publication.

---

# v0.37.1 — one vertical planter-bench in City (2026-10-16)

The approved north–south planter with two long side seats is now the planted bench below the City seed stall, left of the central fountain. Refresh [the local game](http://127.0.0.1:4215/) and Continue to inspect it. One instance changes; other benches and the approved home remain. Original artwork is preserved; no glow or surrounding shadow is added.

365 tests and production build pass. [Checks/limits](docs/verification/planter-bench-v1/README.md), [original/prompt/export evidence](docs/assets/licenses/planter-bench-v1/SOURCE_RECORD.md). Actual browser verification remains blocked by the app's URL security policy. No publication.

---

# v0.37.0 — approved home interior (2026-10-16)

The accepted home collection and structural preview are integrated: taller cream wall, mounted windows/shelf, continuous side boundaries, quieter terracotta tiles, grounded back-row furniture and a clear flush threshold. The approved table remains in the furniture family. The storage pot is removed and firewood sits closer to the wall. Original artwork and previous runtime art are preserved.

[Play locally](http://127.0.0.1:4215/) — refresh, Continue and enter the house. [Offline layout render](docs/verification/home-interior-v1/integrated-layout-offline.png), [checks and browser limitation](docs/verification/home-interior-v1/README.md), [source evidence](docs/assets/licenses/home-interior-v1/SOURCE_RECORD.md). 363 tests and the normal production build pass. Browser automation is blocked by the app's URL security policy, so the offline render is not claimed as a browser screenshot. No push or publication.

---

# v0.36.3 — one 32×24 table trial (2026-10-15)

One fixed dining table inside the house now uses an original32×24 transparent sprite: broad oval walnut top, thin rim, short front legs, one cream jug and two terracotta cups. It renders at2× native scale, sharing the character pixel grid. Its smaller collider matches its visible size. Other objects/catalog art remain at their preceding designs; earlier candidate sources and atlas frames are preserved.

[Play locally](http://127.0.0.1:4215/) — refresh, Continue and enter the house. [Native PNG](output/art/table-native-v1/native.png), [exact prompts/source record](docs/assets/licenses/table-native-v1/SOURCE_RECORD.md), [actual game view/checks](docs/verification/table-native-v1/README.md). This is one candidate awaiting human review before further object changes.

---

# v0.36.0 — approved cedar style across props (2026-10-15)

The approved high-angle bench now guides furniture, garden/street props, market fixtures and wilderness utility objects. Broad top surfaces, muted cedar, sage/pastel planting, shaded stone/ceramics and crisp native pixels share one view. Catalogs, rotated previews and placed pieces use the same artwork. Tables remain indoors.

[Play locally](http://127.0.0.1:4215/) — refresh and Continue. [Native sprite gallery](output/art/cedar-props-v1/review.html), [exact prompts/source evidence](docs/assets/licenses/cedar-props-v1/SOURCE_RECORD.md), [game screenshots/checks](docs/verification/cedar-props-v1/README.md). Existing footprints, prices, saved purchases and gameplay remain; 359 tests and production build pass.

---

# v0.35.3 — one high-angle cedar bench for review (2026-10-15)

One Home garden bench at(960,824) now shows the requested high-angle 3/4 top-down cedar sample, with muted earthy wood, sage foliage, pastel flowers and the existing subtle contact shadow. The broad seat/armrest tops are visible. All other object designs and bench variants remain unchanged pending the user's review. [Sample, prompts and export evidence](docs/assets/licenses/bench-cedar-v1/SOURCE_RECORD.md).

---

# v0.35.2 — coherent prop views and indoor dining (2026-10-15)

Refined 41 existing object frames from 28 new original sources: consistent overhead tops/fronts, warm stepped material shading, proper seating views and clearer wood, ceramic, stone and canvas forms. Indoor back-row feet align, and the hearth/logs clear the dining seat. Outdoor tables are removed; dining tables place indoors, and former outdoor tables return to Bag on Continue. Existing owned indoor decor affected by the spacing change is also packed safely.

Checks: all 358 tests and production build pass. Art audit preserves all frame metadata and 917 non-target atlas cells. Production remains 46 local files. [Art/provenance](docs/assets/licenses/props-v3/SOURCE_RECORD.md); [verification evidence](docs/verification/props-v3/README.md).

---

# v0.35.1 — cleaner pixel props and consistent overhead views (2026-10-15)

The user's quality correction replaces grainy furniture with broad pixel clusters, stronger edges, quieter rug motifs and a shared view from above. Thirteen new selected source sprites define the main furniture set; other recent props share the native palette treatment. Rugs fill their existing floor area, keeping seats visually on the carpet. Room layout, furniture solids, farmers and saved pieces remain.

[Play locally](http://127.0.0.1:4215/) — refresh and Continue. [Updated native gallery](output/art/props-v2/index.html), [prompts/source record](docs/assets/licenses/props-v2/SOURCE_RECORD.md), [checks and room preview](docs/verification/props-v2/README.md).

---

# v0.35.0 — layered pixel props and clearer snow trees (2026-10-15)

The latest user reference guides crisp overhead pixel objects with visible top surfaces, shaded fronts and material texture. Refreshed village furniture, garden decorations, public planted seating, tents, home furnishings and older woodland props. The snowy pine now separates bright caps from dark needles and warm bark. Existing character art, placement footprints and saved purchases stay intact.

[Play locally](http://127.0.0.1:4215/) — refresh and Continue. [Native art gallery](output/art/props-v1/index.html), [exact prompts and source evidence](docs/assets/licenses/props-v1/SOURCE_RECORD.md), [verification](docs/verification/props-v1/README.md).

---

# v0.34.0 — more foliage, water footsteps and solid bridge sides (2026-10-15)

Removed the two rejected spiky plant designs from rendering. Added small birch-style trees, young-fruit forms and leafy/berry/flower bush looks, with varied heights among existing trees. Existing saved tree/ground-cover IDs, crops and clearing progress remain.

Running through water now produces alternating foot splashes, expanding wake rings, droplets and entry/exit splashes, clipped to the water surface. Bridge sides now block walking/jumping through railings; enter from the open ends. The deck stays dry and nearby water remains traversable. [Play locally](http://127.0.0.1:4215/) — refresh and Continue. [Art/prompts](output/art/nature-v2/README.md), [verification](docs/verification/nature-water/README.md).

---

# v0.33.0 — natural layered trees and grass (2026-10-15)

Original broadleaf crowns, warm branching trunks, feathered palms, textured pines and botanical grass now replace the simpler common tree/grass art. Home, Farm, City and Forest share the olive foliage treatment; existing Forest habitat colors remain. Grass bends while walking, canopy fades keep the farmer visible and small ground marks/flowers are calmer. Native transparent pixels stay sharp.

Farm layout, restored grass, saved crops, cut-tree IDs, gathering, collisions and inventory remain. [Play locally](http://127.0.0.1:4215/) — refresh and Continue. [Artwork and prompts](output/art/nature-v1/README.md), [verification](docs/verification/nature-v1/README.md).

---

# v0.32.0 — five-row Farm and restore grass (2026-10-15)

The starter is **8 × 5 / 40 spaces**, with a grass gap from the narrower entrance road. The Farm board moves onto existing main-lane ground farther from the field. All four growing-area clearances match; undug ground stays grassy.

To undo digging, select the **Shovel**, target an **empty bed**, press **E / Use** (or tap it), then choose **Restore grass**. Cancel keeps the bed. Restored grass stays after Continue and can be dug again; planted crops must be harvested/cleared first. Existing six-row saves lose only empty sixth-row soil, preserving crops and saved indices. [Play locally](http://127.0.0.1:4215/) — refresh and Continue. [Verification](docs/verification/farm-restore/README.md).

---

# v0.31.1 — taller farm, dig on clear ground (2026-10-15)

The starter is now **8 columns × 6 rows**, with 48 prepared spaces. All four cleared growing areas are 384 × 288. Undug areas show natural grass; removed the large light-brown fallow rectangles. The shovel can prepare clear ground anywhere on your Farm without the Copper Can or a coin payment. Roads, water, buildings and placed furniture still need clearance.

Existing crop coordinates, saved custom beds, inventory and coins remain. Missing starter rows are added safely on Continue, preserving existing crops and owned scenery. [Play locally](http://127.0.0.1:4215/) — refresh, then Continue. [Checks and limitations](docs/verification/farm-free-dig/README.md).

---

# v0.31.0 — wider fields and simpler farm lanes (2026-10-15)

The starter bed is now8columns×4rows /32prepared spaces. All four growing areas share a384×192footprint: the other three show lighter fallow earth, ready for shovel digging. Digging inside these areas needs no Copper Can or coin payment; the upgrade still gates digging outside them. The road network is reduced from12to6segments, retaining the entrance/main lane without putting new roads over old planted ground.

Existing64reserved crop slots per farm stay at their original positions/IDs. Sixteen starter extensions use existing custom-bed storage; migration appends empty spaces while preserving old custom crops, furniture and planted grass. Existing wallet/inventory/progression remain. [Play locally](http://127.0.0.1:4215/) — refresh and Continue. [Verification and limits](docs/verification/farm-layout/README.md).

---

# v0.30.1 — clearer farm beds and transparent crops (2026-10-15)

Simplified the Farm: removed repeated scarecrows, field/ornamental fences, barrels, crates, wheelbarrow, central shed and standalone ornamental flower clusters. Useful house/trees/well/board/signs and player-owned decorations remain. Connected soil now has shallow pixel turf edges, warmer earth and softer dry/watered transitions. Removed painted soil bases from40crop frames; all remaining plant pixels and898other atlas frames stay unchanged. Existing crops, ownership, plot coordinates, progress, prices and saves remain.

[Play locally](http://127.0.0.1:4215/) — refresh, then Continue. All337tests and production build pass; desktop/phone farming interactions were checked. No new image generation was needed. [Before/after crop art](output/art/farm-refresh-v1/), [source record](docs/assets/licenses/farm-refresh-v1/SOURCE_RECORD.md), [verification](docs/verification/farm-refresh/README.md). This improves the existing crop art; fuller botanical plant designs remain a separate optional art pass. No publication.

---

# v0.30.0 — matching town merchants (2026-10-14)

Nell and Sol now use the approved farmer-matching designs, with directional idle and six-pose walking cycles. Visit Nell for **Outfits / Extras** and Sol for **Hair only**. Hair previews hide accessories so the hair is visible; your equipped items stay equipped. Home Wardrobe retains all categories. Their homes, service hours, dialogue and evening return remain.

[Play locally](http://127.0.0.1:4205/) — refresh, then Continue.336tests/build and desktop/phone interaction checks pass. [Checks and art limitations](docs/verification/npc-integration/README.md). [Nell/Sol animation sources/prompts](docs/assets/licenses/npc-matching-animated-v1/SOURCE_RECORD.md). The next NPC, Clara the seed seller, has a [four-view standing design](http://127.0.0.1:4215/output/art/npc-clara-v1/) for appearance review, outside the playable build. [Clara source/prompt](docs/assets/licenses/npc-clara-v1/SOURCE_RECORD.md). No publication.

---

# New NPC designs · Nell and Sol (2026-10-14)

The first two matching NPC standing designs are ready for appearance review: Nell in a rose blouse/apron and Sol in a teal vest with grey temple streak. Both have four transparent64×64views,40native-pixel visible height and equal small eyes, matching the approved farmer style. [Review beside the farmers](http://127.0.0.1:4213/output/art/npc-matching-v1/) while the development server runs. [Source/prompts/rights](docs/assets/licenses/npc-matching-v1/SOURCE_RECORD.md), [verification](docs/verification/npc-matching/README.md).

As proposed, appearance approval comes before walking animations and game integration. Playable game remains0.29.0with existing NPCs, shops, schedules and saves.333tests and build pass; the new review art stays outside production. No publication.

---

# v0.29.0 — keep your farmer, choose clothes and extras (2026-10-14)

Clothing purchases now keep the chosen male/female farmer, face and complete animations. Five workwear colour options and hair colours replace the old NPC-preset swapping. New matching extras: straw hat55c, round glasses40c and canvas backpack75c, worn independently or together. Buy new clothes/extras from Nell in the City7am–7pm; change owned items for free through Home & garden → Wardrobe → Extras. Sol still handles hair colour. Turn the preview to inspect all four views.

[Play locally](http://127.0.0.1:4205/) — refresh after this update, then Continue. Old saves and purchased clothes remain.333tests/build, native pixel audit and desktop/phone-size interaction checks pass. [Verification and limitations](docs/verification/farmer-cosmetics/README.md), [artwork/prompts/rights record](docs/assets/licenses/farmer-cosmetics-v1/SOURCE_RECORD.md). Clothing variants currently change fabric colour; new garment shapes are future artwork. No publication.

---

# v0.28.1 — matching female farmer, corrected size and eyes (2026-10-14)

The female farmer now has the same complete action set as the approved male: four-direction blink idle, running, harvesting, digging, chopping, watering, axe attack and authored jumping. Shared carried tools use her own frame-specific hands and angles, hiding during combined actions. Your follow-up is fixed: her standing height now matches the boy closely, and both front idle eyes have identical narrow pupils.

[Play locally](http://127.0.0.1:4205/) — refresh to load the corrected artwork. Choose Play as Girl or Garden outfit / Autumn look. [Complete female sprite pack](output/art/farmer-girl-v2.zip), [source/prompts](docs/assets/licenses/farmer-girl-v2/SOURCE_RECORD.md), [verification](docs/verification/farmer-girl-v2/README.md). Existing male art and saved progress remain; no publication.

---

# v0.27.0 — male jump and matching carried tools (2026-10-14)

The approved male farmer now has a six-pose jump in all four directions and separate matching axe, shovel and watering-can views. Carried tools follow the actual hand/angle in each idle, running and jump frame, and disappear during the existing combined tool actions. All168original approved frames and the accepted smaller display size remain.

[Play locally](http://127.0.0.1:4205/) after refreshing the local build; [complete updated sprite ZIP](output/art/farmer-boy-complete-v3.zip), [prompts/source](docs/assets/licenses/farmer-boy-extension-v1/SOURCE_RECORD.md), [verification](docs/verification/farmer-boy-extension/README.md). No publication was requested.

---

# v0.26.2 — smaller display, original face detail (2026-10-14)

Restored the original male sprite pixels after automatic native resizing removed a narrow eye. The farmer keeps the accepted smaller size: original 64×64 frames display at 1.5× instead of 2×, giving the same approximately 60-world-unit body height as v0.26.1. Both front eyes remain in the original frames; nearest filtering keeps the rendering sharp. All animations/tool alignment and saved gameplay remain.

[Local game](http://127.0.0.1:4205/) — refresh to load the restored artwork. [Verification](docs/verification/farmer-eyes/README.md). All 320 tests, build and desktop/phone checks pass.

---

# v0.26.1 — smaller male farmer (2026-10-14)

The male farmer is 25% smaller, matching the existing girl’s approximately 30-pixel body height. All seven actions retain their supplied timing. Native 48×48 game frames use sharp nearest sampling and integer 2× rendering; the original 64×64 source pack remains intact. Carried tools stay separate during idle/running, and the existing combined action poses hide the separate tool.

[Local game](http://127.0.0.1:4205/), [verification](docs/verification/farmer-scale/README.md). Refresh the local game to load the smaller sprite. All 320 tests, the production build and desktop/phone browser checks pass.

---

# v0.26.0 — revised male farmer (2026-10-14)

Your supplied revised boy is now in the local game: four-direction idle/running, harvesting, digging, chopping, watering and axe attacks. Original native pixels and per-frame timings are preserved. Choose Play as Boy, or use Worker outfit / Classic look; existing girl, other outfits, NPCs and saved progress remain.

[Play locally](http://127.0.0.1:4205/) while the server runs. [Verification](docs/verification/farmer-boy-runtime/README.md), [source/rights evidence](docs/assets/licenses/farmer-boy-revised-v2/SOURCE_RECORD.md). 320 tests/build and desktop/phone browser checks pass. This local update has not been published.

---

# Revised farmer v2 · approved full sprite export (2026-10-14)

The user approved the revised farmer and requested the full set for game import. [Download the complete ZIP](output/art/farmer-boy-revised-v2.zip):168 transparent64×64 frames, seven sheets,28directional clips,48optional48×48idle/running crops, exact timings, import notes and original sources. [Import guide](output/art/farmer-boy-revised-v2/README.md), [verification](docs/verification/farmer-boy-revised-v2/README.md). This supersedes the earlier rejected boy exports for delivery. The playable v0.25.0 runtime remains unchanged.

---

# Approved farmer · full animation review pack (2026-10-14)

The farmer approved in this chat now has156 transparent48×48 frames: four-direction idle, eight-frame running, and six-frame harvesting, digging, chopping, watering and existing-axe attack. The approved south idle is preserved byte for byte. [Review all animations locally](http://127.0.0.1:4203/farmer-boy-approved-v1/) while the server runs; [download pack](output/art/farmer-boy-approved-v1.zip). [Source/prompts](docs/assets/licenses/farmer-boy-approved-v1/SOURCE_RECORD.md), [verification](docs/verification/farmer-boy-approved/README.md). This new olive-overall pack awaits appearance/motion review and integration; existing v0.25.0 runtime art remains.

---

# New farmer boy action art · review export (2026-10-13)

[Preview all animations locally](http://127.0.0.1:4202/farmer-boy-actions-v1/) while the local server runs. [Download project export](output/art/farmer-boy-actions-v1.zip):156 transparent native frames across idle, running, harvesting, digging, chopping, watering and existing-axe attack, in four directions. [Prompts/provenance](docs/assets/licenses/farmer-boy-actions-v1/SOURCE_RECORD.md), [checks and limits](docs/verification/farmer-boy-actions/README.md). This export awaits motion polish and runtime integration; the playable v0.25.0 game below retains its approved sprites.

---

# v0.25.0 — farmer girl sprites (2026-10-13)

The new brown-ponytail farmer girl is playable in the local project. Choose Play as Girl, or equip the free Garden outfit / Autumn look in the wardrobe. Four directional idle poses and eight-frame running cycles use native pixels, the same padded 48×48 rig and 16 fps cadence as the approved male farmer. Front idle art is 30 pixels tall; source art is generated with OpenAI imagegen and adapted to a shared 32-colour palette. Tools follow each real hand pixel. Other complete looks and town NPCs retain their established art.

[Local preview](http://127.0.0.1:4201/) while its preview server runs. [Sprites and animation export](output/art/farmer-girl-v1.zip), [generation/source record](docs/assets/licenses/farmer-girl-v1/SOURCE_RECORD.md) and [verification](docs/verification/farmer-girl/README.md). Build/saves remain local; this version has not been published.

---

# v0.24.0 — approved PixelLab farmer (2026-10-13)

The user-approved PixelLab farmer replaces the existing free Worker outfit / Classic look. All four native running directions use eight unique exported frames at 16 fps. Original RGBA pixels and slim proportions remain unchanged, rendered at integer 2× with nearest filtering. Static idle frames are padded into the larger 48×48 run canvas; shared ground row 40 keeps feet, shadows, tools and shallow-water cropping aligned. Title, character choice and wardrobe previews show the same approved farmer.

Other complete looks and all eight town NPCs retain the existing Szadiart artwork and motion. Appearance IDs, prices, ownership, schema-19 saves, controls and movement speed remain. Jump uses genuine passing run poses with the existing arc; no authored jump/tool cycle was supplied. Source records disclose user-generated PixelLab AI art and public output-use terms. Runtime allowlist stays unchanged; no remote assets/services or source archives ship.

[Play the updated game](https://simple-life-playtest.vercel.app/). Refresh and Continue. Equip Worker outfit / Classic look to use the approved farmer. [Verification](docs/verification/pixellab-farmer/README.md).

---

# v0.23.0 — original Szadiart people (2026-10-13)

Player and eight town NPCs now use original Szadiart 3 Direction NPC Characters artwork. Native proportions, faces, colours and all opaque source pixels are preserved. Only baked alpha-77 ground shadows are removed; a fixed 24×40 crop and mirrored side view support the existing four directions. World scale is integer 2× with nearest filtering. Players use four authored idle poses at 6 fps and four walk poses at 10 fps; NPCs use four walk slots at the existing 120 ms cadence. Movement speed and controls remain. The pack has no authored running, jumping or tool-action animations; existing jump/tool effects use unchanged source poses and world motion.

Five outfits and four complete looks replace independently layered hair/clothes. Original complete source presets are never redrawn or recoloured. The wardrobe and Town stylist menus describe Outfits / Looks; their English/Myanmar text remains localized. Existing appearance IDs, purchase prices, ownership, balance and schema-19 saves remain, so a saved appearance maps to its corresponding complete preset. The default brown-haired teal worker differs from the town cast. Depth, grounded shadows, collision footprints and water/reflection integration remain.

[Playtest](https://simple-life-playtest.vercel.app/). Refresh and Continue to keep progress. [Checks](docs/verification/szadiart-people/README.md).

---

# v0.22.1 — human proportions and clearer character artwork (2026-10-13)

Revised player and all eight NPC designs after the user accepted movement but rejected the squat appearance. Smaller original pixel heads have warm faces, small dark eyes and asymmetric hair; longer torso/legs and defined ivory sleeves, overall straps, vest/jacket seams, dress hems and boots make people easier to read. Every CraftPix source body pose uses the same fixed vertical row mapping (1.8 offline), with no independent limb displacement or invented gait. Run remains eight phases at 12 fps, NPC walking six phases at 8.33 fps, and idle retains its supplied phase counts. Native 24×36 cells render at integer 2× world scale; standing boy ink is 62 world pixels instead of 66. Source-derived tool grips use native pixel centres. Appearance IDs, prices, saved ownership, schema 19, movement speed, collision footprints, shadows and depth remain.

[Playtest](https://simple-life-playtest.vercel.app/). Refresh and Continue to retain progress. [Checks](docs/verification/character-proportions/README.md).

---

# v0.22.0 — native run and walk animations (2026-10-13)

Player movement uses the complete eight-pose CraftPix unarmed run cycle at 12 fps. NPCs keep the six-pose walk cycle at 8.33 fps. Idle uses all twelve supplied front/side poses and four back poses at 8 fps. The previous cut-and-warp animation is retired. Clothing and hair are drawn on the original poses; arms, feet and head positions are never mechanically deformed. Native 24×26 frames render at integer 3× world scale (66-pixel standing ink height, 78-pixel padded cell). All 20 outfit/hair combinations and eight town variants retain their identities, prices and schema-19 appearance saves. Jump selects three tucked poses from the actual run sheet; it is an adaptation, not a supplied jump animation.

[Playtest](https://simple-life-playtest.vercel.app/). Refresh and Continue to keep progress. [Checks](docs/verification/craftpix-motion/README.md).

---

# v0.21.3 — joined walking sprites and slimmer characters (2026-10-13)

The passing torso previously rose one pixel above the legs, exposing a transparent waist row. The animation now overlaps two native hip rows and restores the side garment behind moving forearms. Softer knee lift and closer foot placement reduce the exaggerated gait; the added dark far-leg tint is removed. Native artwork is about 10% narrower, with unchanged 40×72 cells, 64-pixel standing height and integer 1× world scale.

[Playtest](https://simple-life-playtest.vercel.app/). Refresh and Continue to retain progress. [Checks](docs/verification/character-seams/README.md).

---

# v0.21.2 — smaller people and visible walk cycles (2026-10-13)

Characters now use 40×72 native cells at integer 1× world scale, with a 64-pixel visible height instead of 76 (about 16% smaller). A stable 32-colour identity palette simplifies shading; the far leg receives a small additional shade. Faces, hair, clothes and boots retain the approved source art. Four walking poses use contact/passing steps, opposing arms, bent recovering knees and a one-pixel passing bob. Both player and NPC sprites share the poses; held tools follow the animated grip. Standing, jump, feet anchors, depth and local appearance/saves remain.

[Playtest](https://simple-life-playtest.vercel.app/). Source and animation details: docs/assets/licenses/characters-v2/SOURCE_RECORD.md. 317 tests, both builds and desktop/mobile browser checks pass locally and on the published game. [Verification](docs/verification/character-motion/README.md). Refresh and Continue to keep your progress.

---

# v0.21.1 — characters match the approved guide (2026-10-13)

Active people now use original OpenAI-generated artwork based on the user-approved guide, packed into 48×80 nearest-filtered native sprites. Fuller hair, visible eyes, layered clothing and boots replace the rejected thin 24×40 adaptations. Player world scale 1× retains approximate previous physical height. Five outfits/four hairs and eight town variants retain frame indexes, schema-19 saves, paid clothing/barber services and free owned outfits. The cave remains postponed and NPC curfew remains 19:00.

Source and exact image-generation prompts: [character record](docs/assets/licenses/characters-v2/SOURCE_RECORD.md). [Public playtest](https://simple-life-playtest.vercel.app/). 316 tests, both builds and local/public desktop/mobile checks pass. [Verification](docs/verification/character-fix/README.md). Refresh and Continue to retain your progress.

---

# v0.21.0 — taller characters, clothes and haircuts (2026-10-13)

The player and eight town character variants now use taller 24×40 native pixel frames adapted from diamonddmgirl/Cabbit CC0 bases. Smaller heads, long trousers and distinct overalls, vest, dress and jacket designs retain the existing top-down view, feet depth, shadows and native pixel filtering.

Approach Nell (shirt icon, east City commons) to buy clothes, or Sol (scissors icon, west City lane) for a paid haircut, between 7 am and 7 pm. Five outfits and four hairstyles combine independently; the two starter outfits are free and new clothes cost 90/120/150 coins. Hair changes cost 30/45/50/60 coins. Owned outfits can be switched free through Home & garden → Wardrobe. Preview before buying; the current style and unavailable purchases are disabled. Appearance and owned clothes survive Continue; schemas 1–18 migrate to schema 19 with existing progress intact. English/Myanmar canvas UI and phone rotation remain supported.

Published on [Simple Life](https://simple-life-playtest.vercel.app/): refresh and Continue. 316 tests, both builds, six local style profiles, three depth profiles and published desktop/phone checks pass.

Source/licence and AI design guide: [character evidence](docs/assets/licenses/characters/SOURCE_RECORD.md). Verification: [appearance checks](docs/verification/appearance/README.md).

---

# v0.20.2 — clearer 2.5D depth (2026-10-13)

Keep the current three-quarter top-down view and native pixel art. Grounded pixel shadows now follow the player, residents and wildlife; jumping raises the sprite while its shadow stays on the ground. Plants sort at their visible feet, and raised bridge rails sort independently of their flat deck. Tall trees reveal the player behind their full silhouette and stay opaque in front. Maps, collisions, saves, gameplay and mobile camera framing retain their established behavior.

Published on [Simple Life](https://simple-life-playtest.vercel.app/): refresh and Continue. 310 tests, both builds and desktop/phone browser checks pass. Checks and release: [2.5D depth verification](docs/verification/pseudo-depth/README.md).

---

# v0.20.1 — cursed cave postponed (2026-10-13)

The sealed/cursed cave, spirits, warning, map marker, repair quest and Curse Breaker achievement are removed at the user’s request. The previously removed skull caves remain absent. Existing saves continue with current coins, inventory, farms, story and Stash Bags; retired curse records are ignored and omitted on the next save. NPCs and merchants still return home by 7 pm. Implementation history is retained in Git for a later feature request.

Published on [Simple Life](https://simple-life-playtest.vercel.app/): refresh and Continue. 306 tests, both builds, desktop/phone browser checks and public runtime hashes pass. Checks and release: [cave removal verification](docs/verification/curse-removal/README.md).

---

# v0.20.0 — optional cursed cave (2026-10-12)

The two skull caves are removed. One sealed cave in eastern Dark Forest is marked on the Forest map. Visiting it is harmless. Inspect it to read a pictured English/Myanmar warning, then explicitly choose Break seal. An untouched seal never causes attacks.

Breaking grants a one-time 200c cache and releases up to three spirits outdoors each night from 7 pm to 6 am. Use the existing Axe; dispersed spirits return after five active seconds. The house interior is safe. NPCs and merchants reach home by 7 pm. Repair the cave with 600c, 48 Wood, 32 Stone and 20 Meat (an offering), contributed in stages. Contributions save; completing them permanently ends the curse and records Curse Breaker. Pause > Cursed cave shows the quest and saved progress. Normal farming, Journal, equipment, sleep and saves remain.

Published on the existing [playtest](https://simple-life-playtest.vercel.app/): refresh and Continue. Checks and release: [cursed cave verification](docs/verification/cursed-cave/README.md).

---

# v0.19.3 — centered clock and coin rows (2026-10-12)

Clock/day rows now center as one measured block, and coins center inside their own panel. Both languages retain their native font sizes and whole-pixel positions, with clear row spacing and internal padding. Published on the existing [playtest](https://simple-life-playtest.vercel.app/). Refresh and Continue. Verification and release status: [clock alignment](docs/verification/clock-alignment/README.md).

---

# v0.19.2 — correct sign direction and centered alignment (2026-10-12)

Published on [Simple Life](https://simple-life-playtest.vercel.app/): refresh and Continue. Burmese City signs preserve right direction 0. Text, arrows and boards center on the original post; extra top spacing keeps text off the bevel. Even native board widths keep posts/arrows on whole pixels. Existing saves, English signs and other game systems are preserved.

---

# v0.19.1 — smaller Burmese text and clean world labels (2026-10-12)

Published on [Simple Life](https://simple-life-playtest.vercel.app/): refresh and Continue. Burmese body text is smaller, world road/Farm signs size their boards from shaped text, and the Seed Aid caption is translated. Wildlife has no nameplates; tree work shows only hit progress and its Wood reward. Menus keep full Unicode shaping, integer sizes/scale, leading, padding and paginated copy. Save data, gameplay, audio and English styling are preserved.

---

# v0.19.0 — English / Myanmar and a clear first start (2026-10-12)

The fullscreen canvas opens with English / မြန်မာ choices. Menus, dialogue, farming/shop labels, Journal chapters, first-job directions and world labels use the selected language. The preference is separate from farm progress and can be changed through Language on the title or pause menu.

New players receive four short, paginated cards covering the goal (grow, sell, help the town, recover Grandfather's Keepsake), actual keyboard/touch controls, the daily farming loop and the free seed crate beside Home. A contextual reminder follows seed collection, planting and watering. Replay the guide through title Controls; existing Journal directions remain. No reward, balance, save-schema or gameplay rule changes.

Burmese uses a bundled, original Noto Sans Myanmar UI Unicode font with browser OpenType shaping. English retains Thaleah/m5x7. All runtime files remain local and allowlisted; source/licence evidence is under docs/assets/licenses/myanmar-font. Phone layouts reserve taller Burmese rows and paginate long copy rather than clipping it. Verification and device limits: [Myanmar onboarding](docs/verification/myanmar-onboarding/README.md). Published on [Simple Life](https://simple-life-playtest.vercel.app/): refresh, choose English or မြန်မာ, and Continue your existing farm.

---

# v0.18.6 — silent doors and playtest release (2026-10-12)

House entry and exit are silent. The unused door sample is excluded from runtime. This release includes the responsive mobile trade panels, icon-only Jump/Use/Map controls, native Thaleah/m5x7 fonts, mobile rotation/startup fixes and larger phone interior from the preceding local updates. The established public playtest keeps its once-per-save test coins and browser-local progress.

Release checks and publishing status: [silent doors verification](docs/verification/silent-doors/README.md). Playtest URL: [Simple Life](https://simple-life-playtest.vercel.app/). Published v0.18.6: refresh and Continue at the same URL.

---

# v0.18.5 — mobile trading and icon controls (2026-10-12)

Entering your house is silent. Buy Seeds and Market panels keep their heading, crop tabs, item details, quantity buttons and transaction quote in separate bounds; short landscape screens use two columns and safe-area centering. Jump/Use captions are removed, with centered arrow/star icons. The Forest toolbar uses the existing folded-map icon. Native fonts and whole text scaling are retained.

Refresh and Continue at [phone preview](http://192.168.100.7:4198/) on the same Wi-Fi, keeping the Mac/server running. Mac preview: http://127.0.0.1:4196/. This is a local update. Evidence and device limits: [mobile trade verification](docs/verification/mobile-trade/README.md).

---

# v0.18.4 — clearer UI text and mobile panels (2026-10-12)

UI headers use Thaleah; small labels, counters and clocks use m5x7. Local bitmap fonts have binary alpha, nearest filtering and native integer size multiples, with extra leading and text padding. Mobile menus reserve separate content/footer bands; the home customization footer overlap is removed. Compact resource pages show costs side by side, and long Journal/ending text can be paged. Landscape phone interiors use zoom 1 instead of .75; outdoors retain the wider .75 framing. House entry waits for the wooden-door recording and plays it at a clearer level.

Refresh and Continue at **http://192.168.100.7:4198/** from a phone on the same Wi-Fi, keeping the Mac/server running. The local Mac URL remains http://127.0.0.1:4196/. Font sources, licence evidence and conversion hashes are under docs/assets/licenses/ui-fonts, with attribution in Credits / More art / Fonts. Verification: [UI typography](docs/verification/ui-typography/README.md). This is a local update.

---

# v0.18.3 — compact phone HUD and wider landscape view (2026-10-12)

The mobile status bars/clock, toolbar, joystick and Jump/Use controls now occupy less screen space. Toolbar/action targets are up to 48 CSS pixels (at least 44 in verified layouts), with a 96px joystick. Landscape phone zoom is 0.75 instead of 1, showing one-third more world in each direction; portrait and desktop camera framing retain their previous values. Safe-area positioning, rotation, farming, house entry and saved progression remain usable.

Refresh the running Wi-Fi preview and Continue to try the revised proportions. The Mac/server must stay running on the same Wi-Fi. Local checks: 292 tests, both builds and 33 native browser cases pass. See [mobile proportions verification](docs/verification/mobile-proportions/README.md). Physical-phone acceptance of the revised layout remains with the user; this update is local only.

---

# v0.18.2 — green-screen startup fix (2026-10-12)

The rotation touch-cancel wrapper now checks that Phaser created a TouchManager before installing its listener. Browsers without touch input can start normally again. Refresh the existing local preview to load the fix; saved games remain intact.

For phone testing, run `npm run build`, then `npm run preview -- --host 0.0.0.0 --port 4198 --strictPort`. Open Vite's displayed Network URL on a phone using the same Wi-Fi, keeping the Mac/server running. The existing public deployment is unchanged. Checks: 292 tests, both builds, and eight fresh Canvas/WebGL desktop/touch startup, movement and save/reload cases pass. See [startup verification](docs/verification/startup-lan/README.md).

---

# v0.18.1 — silent travel and mobile rotation (2026-10-12)

Home/Farm/City/Forest crossings no longer play a gate sound. Rotate the phone freely: cancelled touches are released, canvas touch bounds are refreshed after rotation/browser-bar movement, and short landscape menus retain reachable controls. Landscape Bag pages use wider rows; very short Journal pages show the current step and its directions. All tools remain available in Bag / Gear. Refresh the local preview and Continue to retain progress. This update is local only; the public deployment is unchanged.

---

# v0.18.0 — local judge polish (2026-10-11)

The default production build is the real 60-coin game. Only `VITE_PLAYTEST=true` enables the clearly labeled once-per-save +100,000c testing gift; localhost, developer mode and query parameters cannot grant it. Existing saved balances remain intact.

```sh
npm install
npm test
npm run dev
npm run build
npm run preview
# Separate testing artifact; never use this for competition:
npm run build:playtest -- --outDir /tmp/simple-life-playtest --emptyOutDir
```

A day from 06:00 to midnight lasts 7½ active minutes. Journal, Bag, shops, Customize, dialogue, story and Pause stop time. Claim three seeds beside Home's front steps; follow the south Farm sign, plant and water once each day. Visit City, meet a neighbour, collect 12 Wood / 6 Stone, read the board and try one fruit while crops grow. After your errands, rest using the actual bed; after three watered midnights, harvest and sell. Help Commons at the City board; its 240c reward unlocks the Farm board's Copper Can (180c / 6 Wood / 4 Stone). Select Water and face the row: up to three gold-preview beds cost 2 EP. New expansion requires the can. Existing expanded farms remain usable.

The Forest chapter reveals a gold sun destination on the map. Dodge a boar's `!` warning, recover the Keepsake and return it to the right-hand shelf inside Home. Expensive houses and deep exploration remain optional. See [balance report](docs/BALANCE_REPORT.md), [current checks](docs/verification/judge-polish/README.md) and [project status](docs/PROJECT_STATUS.md). This version is local only: the public playtest remains its prior deployed version. No push, deployment or submission is performed.

---

# v0.17.4 — outdoor birds and gatherable default plants

Daytime birds now play around Home, Farm and City; Forest, rivers, fountains and night ambience retain their existing behavior. Inside the house stays quiet, with action and sleep/wake effects preserved. Default wildflowers, ferns, grass, mushrooms, low shrubs and bamboo can be gathered with empty hands: click nearby plants on desktop, or face them and press **Use** on mobile. Each patch gives one Grass, plays a pickup sound and stays removed after saving/reloading; Grass can be replanted using the existing tool. Paid decorations retain Remove/Readjust choices. [Public playtest](https://simple-life-playtest.vercel.app/) — refresh and Continue. [Verification](docs/verification/outdoor-plants/README.md).

---

# v0.17.3 — quiet indoor background

Inside every house, the continuous wind-like background is removed. Other action sounds, sleep/wake and morning rooster effects, outdoor nature audio, houses, crafting and saved progress are preserved. The unused fireplace/background WAV is excluded from production. [Current playtest](https://simple-life-playtest.vercel.app/) — refresh and Continue. [Checks and limitations](docs/verification/quiet-interior/README.md).

---

# v0.17.2 — Customize shortcut and material crafting

Open the **house icon beside Menu** to customize Home, Farm or the room. Customize is removed from Pause; the Farm board now handles farming only.

**Craft decorations / Wood & Stone** contains the seven existing recipes: bench, planter, fence, path, picnic table, barrel and lantern. Build spends only the displayed materials. **Trees & garden** and **Furniture & room decor** sell the nine other objects for coins; the eight house designs retain their different coin prices and furnished interiors. Existing owned pieces, placements and house purchases stay saved. Clear-screen Add and Remove/Readjust remain available.

Every house design now reuses the original cottage’s exact roof, walls, windows, door, flowerboxes and steps at the same position. Different palettes, roof/wall materials and interior themes retain each design’s appearance. No runtime atlas file changes.

[Playtest](https://simple-life-playtest.vercel.app/) — refresh, Continue, then use the house icon. [Verification and device limitations](docs/verification/customize-access/README.md). Earlier release notes below describe their versions; this section supersedes their menu and shop instructions.

---

# v0.17.1 — screen placement and decoration choices

Tap or drag the preview to **any clear spot on the visible screen**, then press the clearly labeled **Add** button. The farmer does not need to be nearby or have an unobstructed route to it. Clear path ground can be decorated; occupied pieces, structures, crop beds, water, the farmer’s feet and essential door/bed/cooking/travel approaches remain protected. Drawn direction icons include a visible up arrow. A disabled Add label stays dark and readable; the panel explains an invalid spot.

Click or touch a placed decoration to choose **Remove** or **Readjust**. Remove returns the same reusable piece to Bag/Gear. Readjust previews moving/turning that piece at no coin or item cost; Add commits it. Cancel or reload keeps its original saved position. The nearby Use button also opens these choices. Mobile decoration touches open this menu; ordinary farming, gathering and attacks still use Use/Hit. Local saves, eight house designs, the once-per-save 100,000 playtest gift and the stable public game origin are retained.

Current evidence and device limitations: [decoration editing verification](docs/verification/decoration-editing/README.md).

---

# v0.17.0 — house designs and paid customization

The public **[playtest](https://simple-life-playtest.vercel.app/)** awards **100,000 extra coins once per save** on Play/Continue (a fresh game has 100,060 including its usual 60). Existing progress is retained; refresh does not repeat the gift. Normal `npm run build` keeps the 60-coin starter economy; `npm run build:playtest` explicitly enables this testing gift, also on local preview.

Open **Menu → Customize** at Home/Farm. **House designs** offers eight purchasable exteriors with themed decorations and furnished interiors, priced 2,000 / 5,000 / 10,000 / 18,000 / 30,000 / 45,000 / 65,000 / 90,000 coins. Preview Outside/Inside, buy with confirmation, and switch owned designs for free. The original cottage stays owned. All houses retain the same usable door, bed, cooking and Keepsake positions.

**Trees & garden** sells fences, paving, oak/palm/blossom trees, hedges, flowers and birdbaths. **Furniture & room decor** sells benches, planters, tables, barrels, lanterns, rugs, bookcases and ceramic flowers. Every purchase charges its displayed coin price and puts one reusable piece in Bag/Gear. Place outdoors at Home/Farm; furniture also fits indoors. Preview, adjust/turn, then Place; Cancel keeps the item. Put tools away and Use beside a piece to pack it. Roads, crops, structures, water and key indoor approaches stay clear. Purchased trees are scenery and cannot be chopped. Each Farm keeps its own layout. Rotation to a smaller indoor floor may safely pack pieces into Bag.

Schema **18** accepts existing saves. The seven material workshop recipes remain available. Music-free gameplay, no wind and prior nature/action/sleep/rooster sounds are preserved. Details and verification: [customization report](docs/verification/customization/README.md).

---

# v0.16.6 — plain public playtest, no wind and morning rooster

Play on Mac or phone at **[simple-life-playtest.vercel.app](https://simple-life-playtest.vercel.app/)**. No Vercel login or share query is needed. This stable testing link has no tester-token expiry, and browser-local progress on it survives future updates. Earlier preview/local saves remain on their original URLs.

Dedicated wind is removed everywhere. Confirming sleep plays a soft effect, then morning waking plays one natural rooster/hen call; evening waking uses a short rustle. Cancelling sleep stays silent. Nature ambience, successful pickups/real tree/animal hits/farming/trades remain; gameplay music and earlier quiet UI/movement actions stay off. Existing schema-17 saves/volume settings and sleep rules are preserved.

**256 tests pass**, production build succeeds; Mac/phone-size browser audio, credits and public access/hosted hashes pass. [Verification and source/deployment details](docs/verification/sleep-wakeup/README.md). Local [Mac](http://localhost:4176/) / [same-Wi-Fi phone](http://192.168.100.7:4176/) remain available.

---

# v0.16.5 — nature-only gameplay and pickup sounds

Playing uses natural ambience without music, including at story completion. Title-screen music stops immediately on Play/Continue. Successful food, stone, starter-seed, treasure, Stash Bag, Keepsake and recovered-object pickups now sound; Wood/grass pickup, real tree/animal hits, farming and trades retain their effects. Failed pickups, empty swings, falling trees, UI/Bag/tool selection, Jump, doors and travel stay silent. Existing saves and audio preferences remain.

The authorized Vercel friend playtest is updated; use the new seven-day link supplied in chat. Local [Mac](http://localhost:4176/) and [phone on the same Wi-Fi](http://192.168.100.7:4176/) remain available. Each browser/origin has its own save, so earlier preview progress stays on its earlier URL. [Checks and deployment record](docs/verification/nature-pickups/README.md).

---

# v0.16.4 — landed hits and friend playtesting

Empty Axe swings are silent. Tree impacts play only on actual hits; when the tree finishes cutting, its falling sound is removed and the Wood pickup sound remains. Animal hit/defeat and farming/buy/sell effects remain. Menus, Bag/tool selection, Jump, doors and travel stay silent. Existing local progress and audio preferences are preserved.

A Vercel testing deployment is ready in the free Hobby `simple-life-playtest` project. Use the seven-day friend share link supplied in chat; direct deployment URLs remain protected. Each browser/device has its own local save. This is a testing build, not multiplayer or a competition submission. Local Mac/phone port 4176 also remains available. [Checks and deployment record](docs/verification/hit-feedback/README.md).

---

# v0.16.3 — farming and hit effects restored

Tree/animal swings and hits, falling trees, planting, watering, digging, harvest/clearing/growth and grass work have their sound effects again. Buying/selling, background music, Nature ambience and the ending cue remain. Clicks, menus, Bag/tool selection, Jump, doors and location travel stay silent. Volume/mute preferences and local progress are preserved.

Refresh [Mac](http://localhost:4176/) or [phone on the same Wi-Fi](http://192.168.100.7:4176/). Current checks: [restored-effects verification](docs/verification/restored-effects/README.md).

---

# v0.16.2 — quiet actions

Clicks, menus, Bag/tool selection, jumping, hits, farming, pickups, doors and travel now have no sound effects. Only successful buying and selling play transaction sounds. Background music, Forest/location ambience and the original ending cue remain; existing Audio volume/mute preferences and local saves are preserved. Unused effects are excluded from preloading and the production build.

Refresh [Mac](http://localhost:4176/) or [phone on the same Wi-Fi](http://192.168.100.7:4176/). Checks and device limitations: [quiet-action verification](docs/verification/quiet-actions/README.md).

---

# v0.16.1 — supplied cozy audio and mobile Use

The supplied **Cozy Farm SFX / Cozy Nature Ambience by Spaceyyy (formerly Bramble & Byte)** and **Cozy SFX Volume 1 by HuntSounds** permit personal/commercial game use. Creator pages and embedded terms were checked before selecting assets; exact source/archive/runtime hashes and licence evidence are in [the source record](docs/assets/licenses/cozy-audio/SOURCE_RECORD.md).

The selected HuntSounds bonus music loop replaces the five earlier background arrangements. All 49 gameplay/UI events use matched Farm effects, with 32 distinct samples. Seven selected Nature loops provide Forest birds/leaves, meadow wind, night crickets/owl, nearby streams, snowy wind, the City fountain and the Home fireplace. Forest ambience is clearly mixed above the quieter music. The original ending cue remains. Only 40 selected converted samples plus that cue ship; unused weather/ocean/campfire packs and source ZIPs stay outside production. WAV conversion keeps runtime decoding independent of Ogg support. **Pause → Audio** retains all existing volume/mute preferences.

Mobile: move with the circle, use **star / Use** for the nearby highlighted action, **Hit** for Axe chopping/hunting or an empty swing, and **arrow / Jump** to leap. Ordinary world touches perform no actions; placement still has its own tap/drag preview and Place confirmation. Use works indoors for doors, bed and cooking; Jump stays disabled indoors. Desktop mouse and E/K/Space shortcuts remain, including mouse actions in compact Mac windows.

Hand is the invisible default. It has no Bag or hotbar item. Choose a tool in Bag / Gear; **Put away** returns to empty hands. Tap an equipped Seed/Water/Harvest hotbar slot to put it away; keyboard 1–5/7 still equips that tool, and 6 puts it away. Empty hands collect grass/stone and pack furniture. Nearby fruit, caches and Stash recovery take priority over incidental grass. Existing valid saved tool selections and schema-17 progress are retained.

Local Mac: http://localhost:4176/ ; phone on the Mac's Wi-Fi: http://192.168.100.7:4176/ . Refresh after this update; keep the Mac awake. Each browser/origin has its own local save. Current checks and hardware limitations: [verification report](docs/verification/cozy-audio/README.md). No push, publication or submission.

---

# v0.16.0 — Grandfather's last request

A four-panel New Game introduction and **Pause → JOURNAL** guide five chapters: your first crop, City sale/resident, fixed Commons seating (24 Wood / 12 Stone), Forest fruit/boar/Keepsake, and returning it to the Home pottery shelf. The existing snake-cache at **4122 / 4376**, west/north of the southern Forest entrance, holds the original sun medallion after its guard is defeated. It stays safe through sleep, saves and death, and cannot be sold/eaten/dropped. Completion presents a letter, statistics, Credits and Continue Playing; the sandbox remains playable.

Original local music now covers Title (64 s), Home/Farm/interior (96 s shared), City (80 s), Forest (96 s), night (96 s) and completion (11 s once). **Pause → Audio** controls Master/Music/Ambience/Effects in 25-point steps plus Mute; Tab/Up/Down/Enter and Left/Right, mouse and touch work. A first click/tap/key unlocks audio. Preferences use `simple-life.audio.v2`, independently of gameplay; legacy Forest mute is retained. Quiet shared ambience replaces the former noise bed. No remote audio, voices or new dependency. [Complete audio inventory and waveform checks](docs/AUDIO_SOURCES.md). **Final human listening approval is required**, including a two-minute Title listen, every location, rapid actions, combat and ending.

Night Home/Farm/City keep minimum moonlight; Forest keeps dark distance and readable nearby ground. The heading is **BAG**. JUMP/ATTACK stay inside short landscape screens. Production disables the testing gift even on localhost and with query parameters; a fresh game still starts at 60 coins. Existing balances remain unchanged. Gameplay save **schema 17** accepts schemas 1–16; older saves skip introduction and gain only evidence-backed Journal flags, never completion from money.

Eight uncertain ToffeeCraft cells are replaced by original project art in their existing atlas rectangles. Other 850 cells, metadata and seven other art files are unchanged. Retained LimeZu CC BY 4.0, Channeechan/Eris Esra, Pipoya and CraftPix terms and source links remain credited. [Current complete asset/permission record](docs/assets/licenses/story-audio/SOURCE_RECORD.md). Eight art files plus six explicit WAV files are allowlisted; source archives and unused packs are excluded. No blanket legal certification or signed human declaration is claimed.

Verification and the measured natural story time are recorded in [the milestone report](docs/verification/story-audio/README.md). Local QA uses disposable storage on 4186; the normal 4175 save was not touched. Recommended landscape desktop 1280×720; portrait and landscape touch layouts down to 360×640/640×360 are supported. Physical Android/iOS, Safari/Firefox/Edge, device audio and final human visual/listening acceptance remain pending. No push, publication, deployment or submission.

---

# v0.15.0 — adjust, turn and recover Farm furniture

Choose Place in the workshop or Bag / Gear to see a ghost before spending the item. Tap or drag nearby ground; arrows or the small arrow buttons adjust by eight world pixels. **R / Turn** changes direction; **E / Place** confirms; **Escape / Cancel** keeps the item. Green means the spot is clear; red explains blocked or distant ground. The farmer stays still while positioning. Cancel to walk elsewhere. After placing, Hand is selected: tap the object or press E beside it to pack the whole item into Bag, then place it again.

The workshop’s **More** page adds a **Picnic table (12 Wood / 4 Stone)**, **Garden barrel (5 Wood)** and **Lantern post (6 Wood / 4 Stone)**. These are movable scenery, alongside benches, flower planters, fences and paving. Side/back furniture art and collision footprints match the preview. Confirmed direction survives reloads and each farm keeps its own furniture. Earlier saves retain their items and progress.

**220 tests pass; production build succeeds (120 modules).** Actual desktop, portrait and landscape browser controls passed; eight runtime art files remain unchanged. Evidence: docs/verification/placement. Local game: http://127.0.0.1:4175/.

---

# v0.14.0 — tree progress and visual crafting

Trees now take **three Axe hits**: one energy per hit, **3 Wood on the third hit**. A cream three-segment meter shows progress, which survives travel, new days and reloads. Previously cut trees stay cut. Pressing toward a blocked trunk now turns the farmer correctly.

The interface has original readable lowercase pixel letters and stronger headings. Farm workshop pages show the actual **bench, flower planter, fence and stone paving**, with labelled picture tabs, material needs/current stock, and Build/Place actions. Bag/Gear shows matching object pictures. Daily requests show their intended object and pictured rewards; Town projects preview the finished arrangement; Home cooking shows the stove and healing benefit. Eat / Bag opens directly on Grilled Meat. Phone landscape keeps compact picture/material rows; bag pagination no longer covers category tabs.

**215 tests pass; production build succeeds.** Desktop 1280×720, portrait 360×640 and landscape 640×360 native browser checks pass. Save schema **15** retains earlier progress. No new art file, remote runtime asset or dependency. Evidence: docs/verification/chopping-ui. Local game: http://127.0.0.1:4175/.

---

# v0.13.0 update

New crops take **3–6 watered days**: Tomato/Carrot/Chili/Cucumber/Sweet Potato 3; Strawberry/Corn/Eggplant/Blueberry 4; Watermelon/Grape 5; Pumpkin 6. Water once daily; growth settles at midnight. Existing ripe saves remain ripe, and the 2-day survival / 3-day Recovering / 4-day death rule remains.

Wood/Stone now have four uses: **City town board** for daily NPC requests and three visible communal projects; **Farm board / Build decorations** for benches, flower planters, fences and paving; **Home hearth** to build a stove and cook Meat using Wood fuel. **Bag / Gear / Wood or Stone / Uses** opens the relevant page. Place a built piece on nearby clear Farm grass; Hand packs it up. Grilled Meat in Bag / Food restores **50 health / 35 energy**. Schema 14 retains existing progress and saves projects, requests, furniture and stove. No new art file or runtime remote asset.

---

# Simple Life — Leaf and parchment UI

An original tropical farming and forest survival game for Digit7 Jam. Phaser 3 + Vite, fullscreen pixel canvas, keyboard/mouse/touch, local saves. Version **0.15.0**, schema **16**.

The City is now **2560×1792**, four times its previous area, with a fountain market square, cream curbs and stone streets, a canal/two wooden bridges, cottage lanes, planted seating, garden commons and a tent/picnic corner. Home is now 360×288 world units with a pitched roof cap and a door taller than the farmer; other cottages retain their size with corrected roof caps and taller doors. Thirteen distinct houses now use larger original warm plaster/brick/timber designs with varied terracotta roofs, ivy and flowerboxes; shared collisions follow their new silhouettes. Eight City residents, two Home visitors and both sellers and Rowan emerge from house doors at 06:00, walk to work, then return to their doors by 20:00. All NPCs/sellers now share the farmer’s native body style, scale and walking animation, with adapted Channeechan hair/clothing palettes. Short conversations remain. Fountain/river flow is animated and wading reflects the farmer. Cottages and sunflower pots sit fully off paved roads. Energy has a yellow lightning icon. Health and energy share round cream badges and grey/cream beveled frames; direct screen taps replace the USE button. Existing shops, farming, house entry and saves remain. All houses share the reference’s broad roof, raised central gable, flat facade and double door, with thirteen different finishes. Home has original patterned tiles, arched windows, fireplace/logs, pottery shelves, dining rugs/table and bed. Sleep/exit remain accessible. Sources/evidence: docs/assets/licenses/home-mobile and docs/verification/home-mobile.

The farm now has connected mottled red-soil beds with soft irregular turf edges, olive crop foliage, water-drop/red !/harvest markers, a proper can held in the farmer’s hand, pouring droplets and temporary wet ground. Dig free planting spaces with Shovel; City shops and the bag offer twelve crop seeds. Existing crops and purchased farms migrate without resetting progress. Shovel and Axe stay in hand. Axe grips at the native farmer hand without an added hand, points outward and layers behind the up-facing body/in front otherwise; three hits cut any authored tree for 3 wood; Hand gathers grass, which can be planted back on dry ground. Cuts and planted grass persist. Larger cream seed packets show the crop fruit, and new plants mature after three to six watered days. Evidence: docs/verification/garden-tools. The repaired readable UI text, whole-minute clock, Forest Map and badge-free tools remain.

Forest now has seven organic habitats: Snowy west, Dark Forest north, central Rainforest, southwest Meadow, southern Easy Rainforest, southeast Shrubland and Desert east. It keeps 40 saved discovery regions and 14 caches, with 2,832 trees, 323 daily fruit spots and 158 animals. Taller stepped cliffs have fine stone/earth strata, grassy lips, walking gaps and can be jumped. Walk into the central Return Gate to return to the open Forest entrance. Nine rocky Dark Forest landmarks use eight selected supplied CraftPix sprites. Desktop outdoor framing is closer; compact screens retain the wider view. Select Axe through Bag / Gear or key 5, then tap/click the world to swing; The Axe selector stays in Bag / Gear; mobile now includes an Attack button. The staged swing keeps the tool at the native hand and applies its hit after a short wind-up. Empty swings cost no energy; ordinary work/Axe hits cost 1 EP. Elapsed time never drains energy. Soft locally synthesized ambience changes by habitat, night and nearby water; Pause / Forest sound saves your mute preference. No remote audio or extra asset files. Evidence: docs/verification/forest-refresh.

The current interface uses original cream/olive pixel frames, a scenic forest title, matching health/energy meters, a compact clock/coin badge and a bottom icon hotbar. Bag, shops, pause, help, farming and confirmation screens share this theme. The bag has seed/produce/food/gear icon grids. The forest-only parchment map reveals explored terrain and rivers with a player-facing arrow; details are optional. Supplied screenshots guide style only.

The expanded Forest doubles the earlier wilderness area to **10240×5120**, with **40 connected regions**. The current habitat refresh opens clustered clearings with about **30% fewer trees** than v0.8.0. Thirteen connected variable-width river channels form diagonal, horizontal and vertical branches with rounded joins and irregular banks. Nine grass-free wooden bridges connect their banks in both directions. Water remains walkable.

**323 daily fruit spots** (nine existing fruit types) and **158 animals** now fill the forest: 30 saved Wild Boars and 128 quiet Deer/Hare/Fox/Grouse. New animals appear in small pairs using the approved Craftpix sprites. Existing treasure rewards, original animal IDs/health, discovery, fruit collection, farming, City, sleep and recovery progress remain. Fruit spots covered by widened water move to nearby dry banks with their saved IDs intact. Existing olive trees/palms/palmettos, responsive grass and moss/red-soil art remain. No roads, waterfalls, teal ferns or artificial river banks return; the latest requested dry stepped shelves sit inland. Source/evidence: docs/assets/licenses/forest-expansion.md and docs/verification/forest-expansion.

## Run locally

Node.js 22.12+ recommended. All runtime art is committed; Python is only needed to regenerate art.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Open the URL printed by Vite. Serve `dist/` over HTTP(S); relative paths support subdirectories. No backend, account, tracking, external API, remote runtime asset or CDN.

## Play

Choose boy/girl. Start with 60 coins, collect three Tomato seeds from the Home crate, and walk south through Home's map edge to Farm. Plant/water/harvest the starter beds, or select Shovel (4) and E/tap nearby clear Farm grass to dig another free bed. Adjacent beds join into connected soil; roads, water, bridges and structures cannot be dug. Water (2) pours on outdoor open ground and leaves a wet patch that dries after three active minutes or sleep; cosmetic wetness does not replace plant care. Farming costs are gentler: planting/digging/harvesting/watering 1 energy each. Water **once per calendar day, at any time**. Repeated crop watering costs no extra energy. One or two missed days pause growth without killing the crop; three missed days show Recovering and can still be rescued with water; four missed days kill it. Three watered days yield two Tomatoes. Manual bed sleep at 06:00–20:00 wakes at 20:00; nighttime sleep wakes at 06:00, including the same morning after midnight. The clock rolls over continuously; crops/daily prices settle once at midnight. Elapsed time never drains energy. Zero energy still permits walking.

Twelve crops: Tomato / Strawberry / Carrot / Corn / Chili / Eggplant / Cucumber / Watermelon / Pumpkin / Grape / Blueberry / Sweet Potato. The four original crops keep seed prices **10 / 18 / 28 / 40**, growth **3 / 4 / 3 / 4** watered days, yield **2 / 2 / 1 / 3**. The paged City seed shop supplies all twelve; values are in src/data/crops.js. Home's east edge leads to City. Clara sells seeds; Niko buys crops, forest fruit and Wild Hide; Rowan is a resident with an Axe tip; the Wooden Club and its shop have been removed. Merchants serve while at work during **07:00–20:00**. They leave early enough to reach their house doors by 20:00, and emerge at 06:00 to walk back. Shops pause simulation, use icon tabs, exact quotes and 1/5/Max or All quantities. City seed aid retains one free Tomato seed/day for eligible broke farmers.

Follow Home's north road to a **10240×5120 wilderness**, exactly **twice v0.4.8 and 40 times the original forest area** at the same camera/character scale. Forty connected regions include Homewood, jungle groves, savanna, bamboo, pine woods, marsh/river, basalt caves, ruins, highlands and a stylized snowy lake. Timber bridges cross the river; natural shores, walkable stone chambers, camp, shrine and ice landmarks reward exploring. The map icon / M opens the Forest-only parchment map, with explored terrain, rivers, player position and current facing. The ? control offers broad cache clues; exact treasure positions stay hidden. The open entrance and Home exit are at the bottom centre of the full Forest map. The central Return Gate brings you back to this entrance; the map marks Home at its southern edge.

**323 daily forage nodes** provide nine fruits: Wild Berry (+12 energy / 6 base coins), Guava (+20 / 12), Mango (+30 / 20), Banana (+18 / 10), Orange (+22 / 14), Papaya (+32 / 22), Coconut (+35 / 24), Dragon Fruit (+42 / 36), Pineapple (+38 / 28). E/tap collects; Bag → food tab also offers farm-grown Watermelon (+35), Grape (+20) and Blueberry (+16), for thirteen foods including hunted Meat. Every food restores health as well as energy; the bag shows both gains. Meat restores 25 health / 20 energy and has a 16-coin base sale value. Eating consumes one, independently caps both stats at 100, and only refuses consumption when both are full (or health is zero). Market pages buy every fruit and Wild Hide with the retained 85–120% daily multiplier. Original crop/fruit/hide price salts stay unchanged. Nodes refresh once per day, never on scene reentry/reload.

**Only Craftpix animals remain:** 30 saved Wild Boars (two in Homewood, one per existing cache and seven new pairs), plus 128 quiet Deer/Hare/Fox/Grouse. Select Axe (5), then K or E / tap a nearby animal to hunt. Axe hits cost 1 energy with a 500ms cooldown; empty swings are free; boars and deer need three hits, foxes two, hares/grouse one. Boars/deer give two Meat; foxes/hares/grouse one. Boars also retain their Wild Hide drop. Defeated quiet animals stay removed across travel/reload and return on a later day. Boars need three Axe hits, deal 15 damage and charge at 280 units/second. They warn before charging, respect solids/territory and share player damage invulnerability.  One Wild Hide and two Meat drop per defeated boar. Saved partial health/dead states survive travel; defeated boars return on a later day. Night awareness/movement increase slightly; distant areas remain dark.

**14 rare ancient caches** hide beyond the grassy passages in dangerous regions, including the Stone Hollow chamber. Approach to spot a chest; nearby living animals within 240 units block its recovery. Drive those guards away, then E / tap to recover 313–462 coins depending on the cache. Each cache pays once per save; sleep, reentry and reload cannot reroll it. MAP supplies broad clues after discovering the region, without revealing exact chest positions.

At zero health, fall/fade and wake beside the home bed at **06:00 next day**, with health/energy restored. Drop **floor(25% of carried coins)** into one saved Stash Bag at the safe forest defeat position. Return and E / tap it to recover the coins. A second defeat permanently replaces the old bag. Zero loss creates no empty bag. Crops, inventory, equipment and paid farms remain. First-visit and first-defeat messages explain the rules and pause safely.

- WASD/arrows: move; E: interact. Space: free outdoor jump; K: Forest directional attack. Legacy J/Shift jump keys remain available.
- 1/2/3/4/5/6/7: Seed / Water / Harvest / Shovel / Axe / Hand / Grass; Q: cycle planting crop. E / tap or a nearby ground click applies the selected tool.
- B / bag icon: seeds, produce, food and gear. Bag → Gear selects Shovel, Axe, Hand or Grass. The utility selector is hidden while Axe is selected. M / map icon: Forest-only map. Arrows/Tab/Enter navigate menus; Escape closes/pauses.
- Touch: circular analog joystick with Jump and Attack buttons, tools and direct screen taps. Select Axe in Bag → Gear, then Attack to swing; Attack also chops a nearby tree. Jump is free outdoors; indoor action buttons are disabled. Menu/rotation/release/background reset movement. Double tap open Forest ground still jumps.
- Pause → Save, Forest sound ON/OFF, Controls, Resume or Return to title. Refresh → Continue.

Planting land is free: Shovel costs 1 energy per cell, with no coin purchase. Starter beds and previously purchased fields/farms remain. New beds can extend them across clear Farm grass; all planted beds receive the established care/growth rules. The Farm board offers Buy / visit farms: Farm 2 costs 600 coins and Farm 3 costs 1,200 coins. No field-unlock prerequisite; new purchases stop at three total farms. Each farm starts with sixteen beds, and Shovel digs additional beds for free. Previous purchased fields/farms and planted custom beds remain. The board also retains the shovel guide and Tomato convenience trade.

Shovel and Axe are free tools available in Bag → Gear. Approach a tree, select Axe (5), then E/tap or click it: each hit costs 1 energy; three hits give 3 wood. Hand (6) gathers a nearby grass clump for 1 energy; Grass (7) places one collected clump on clear dry ground for 1 energy. Water, bridges, roads, solids and planted beds reject grass placement. Digging clears overlapping grass; gather it first to keep it. Tree roots/crowns disappear together, cuts stay removed across days/reloads and cut fruit trees stop producing fruit. Wood is stored in Gear. Forest now has 240 loose-stone piles, six per region. Select Hand (6) and E / tap a nearby pile: each costs 1 energy and gives 2 Stone. Collected piles stay removed across travel/reload and refresh on the next day. Stone is stored in Gear; the resource uses above are now available.

## Saves and sources

`simple-life.save.v1` remains the storage key; schemas 1–15 migrate to 16 without deleting progress. Either old watering window counts as the current day’s watering; already dead crops stay dead. Earlier owned clubs return 45 coins once and their equipment flags are retired. Farms bought beyond the new cap are preserved for existing saves. Earned growth at or beyond the shorter crop duration becomes ripe. Autosave follows actions/travel/sleep/defeat, every 2.5 seconds and pagehide. Invalid positions repair to nearby safe ground. Save scope is browser/origin. New Game confirms replacement; unavailable storage is reported. No offline simulation. See docs/SAVE_SCHEMA.md.

Rules stay under `src/systems`, definitions under `src/data`, world rendering in WorldScene/ForestView and UI in a separate Phaser scene. Farmer and furnishings share 2× native world pixels indoors and outdoors, with 1.5 desktop / 1 compact camera zoom and 96px / 64px displayed farmer frames. Primary environment: **Serene Village revamped 1.9 by LimeZu, CC BY 4.0**, adapted palette/atlas and fruit trees. Playable farmers now use Channeechan’s supplied native character pixels with adapted jump poses; original NPC/forest/crop/item/effect art, font and UI are code-authored with Codex assistance. Forest includes selected ToffeeCraft FreeEnvironment scenery at the user’s noncommercial request. Both creators and the Eris Esra template are credited. Evidence: docs/ASSET_LICENSES.md, docs/assets/licenses and docs/AI_USAGE.md; title → Credits links creator/license. No commercial-game assets, downloaded audio or external font. Forest ambience uses original local Web Audio synthesis, with no downloaded recording. Its mute preference uses simple-life.audio-muted.v1 separately from the game save.

The explicit local testing gift is available only on loopback with `?testingCoins=100000`: title → Add 100,000 test coins. It applies once per saved life and retains other progress; normal URLs/remote hosts hide it. New games still start with 60. The requested gift was applied to the current normal save; balance 100,003.

The build emits only eight allowlisted runtime art files. Vendor archives, manifests, scripts and QA images never enter `dist/`. Optional art regeneration: `python3 scripts/process-rpg-assets.py` with Pillow. Historical process-town-assets.py is not the active pipeline.

## Verification and limits

Current entrance results: docs/verification/forest-entrance/README.md, with 199 passing tests, production build and native browser travel/teleport/map/save checks. Earlier daily-care/farm results: docs/verification/daily-farms/README.md. This pass has 198 passing tests, a production build and native Chromium browser checks at desktop, 360×640 and 640×360. Daily watering/repeat/save/midnight growth, third-day rescue, coin purchases/cap, mobile menu bounds and club removal passed. Earlier Home results/reproduction: docs/VERIFICATION.md and docs/verification/home-proportions/. That pass has 192 passing tests, a production build, an eight-file native/runtime audit and actual browser inputs at 1280×720 and 390×844. This correction checks house entry, full roof/door, matching indoor/outdoor actor scale, bed dialog, mobile screen-attack suppression, Attack-button loot/energy, desktop click attack and the normal-save gift/reload. Earlier v0.11.0 diagonal/joystick, Jump, release/menu/rotation, cliff and saved-landing checks are recorded under home-mobile. Earlier river/gate/terrain checks remain in docs/verification/scene-depth/. Earlier hunting/eating/stone checks remain in docs/verification/hunting-resources/. Compact 640×360 controls also pass automated layout checks. Earlier planting and matched-person verification remains in docs/verification/character-fixes/. Earlier town/water verification remains documented separately. Older verification records are historical. Automated tests retain farming, city, expansion, migration and time regressions and cover the complete survival rules. Browser checks use isolated Chromium saves, native keyboard/mouse inputs at desktop/phone viewport sizes and read-only `?qa` snapshots. Required viewports: **1440×900,1280×720,1024×768,844×390,390×844**. Default renderer is Canvas; `?renderer=webgl` supports local comparison of pixel lighting. Development-only `?collisions` shows solids.

Physical phones/notches, Safari/WebKit, Firefox and Edge remain unverified; phone-size results use native pointer input in Chromium, not a physical touch device. Combat/economy values are initial balance requiring human play review. Ambient sound is synthesized locally; water is unlimited, additional farms reuse the same map. No final team acceptance or competition submission is claimed. Team profile/contact, private reviewer repository, official hosting, matching ZIP/screenshots/demo and signed declarations remain separate submission work.

This user-authorized follow-up expands the completed Milestone 3 wilderness. The earlier one-small-map/one-enemy limit is superseded. The free Axe chops trees and hunts animals; the Wooden Club is retired. No armor/weather/relationships/backend or unrelated progression. Nothing was pushed, published or deployed.

## Historical forest growth and jumping — 0.4.2
The forest has 787 trees and 33 bamboo stands, 3,880 responsive grass clumps and 20 stepped terraces with stair openings. Touching grass bends it; it springs upright after departure. Nearby grass is rendered on demand. Forest jumps have a 600ms arc and 850ms cooldown, cost no energy and cross only low ledges; trees, rocks and structures stay solid. Animal hits interrupt the jump. Use/attack wait until landing. Pausing freezes the arc; saving during it stores the grounded take-off point. Water walking remains, with the ankle line hidden while airborne.

The v0.4.3 follow-up integrates **FreeEnvironment** and **Cute Farmer Character by Channeechan**, version 0.4.3. Boy/girl selection and every location use the new native character cells, including adapted jump poses. Forest has sample conifers, boulders, ice and dry plants with correctly anchored trunks and fading crowns. Fruit broadleaf trees/acacias/bamboo, responsive grass and terraces remain. Source records and compact in-game credits identify Channeechan, Eris Esra and ToffeeCraft. Mana Seed is not used.

FreeEnvironment's Standard Free licence permits personal game development. The user explicitly requests this noncommercial local integration; **public prize-competition coverage remains unconfirmed**. Neither intent nor integration establishes additional creator permission; no commercial release, push, publication or competition submission occurred. The earlier blanket assertion that competitions require commercial rights is corrected. See docs/assets/licenses/supplied-farmer-environment/SOURCE_RECORD.md. New source archives/original PNGs stay with the user and are excluded from repository/build; optional regeneration accepts SIMPLE_LIFE_FARMER_RAR and SIMPLE_LIFE_ENV_ZIP paths. Builds use the committed processed art.
