# 2026-10-23 — front-facing Mystical Forest River welcome

The user's approved first screenshot now governs welcome-screen viewpoint and supersedes the v0.42 top-down farm-vignette direction for this screen only. Use an original eye-level riverbank view into a luminous forest clearing: tall faded trunks establish distance, layered middle bushes create depth, broad natural water fills the lower foreground, and dark tropical trees/leaves crop into both sides as a frame. Keep the central 45% calm enough for the live wordmark and stacked menu. Retain Simple Life's deep forest green, muted olive/moss, warm cream/peach light, reddish walnut and subdued sage-turquoise water.

The runtime background must contain no baked text, controls, characters, logos or watermark. It must not reproduce the reference's exact plants, river contours, logo or layout. Preserve natural shores, dry roots, a grass-free bridge deck and the explicit ban on teal ferns/artificial raised earth banks. The Phaser UI remains separate, responsive and interactive. The `SIMPLE LIFE` title uses its established block font with a one-native-pixel eight-direction dark-green outline, a deeper dark offset shadow and a warm-cream face; do not alter the subtitle, ornament, menu or backdrop when adjusting title contrast. Welcome-water motion uses short broken warm/cool highlight clusters at four stepped poses per second, mapped through the raster's source coordinates and restricted to a conservative central river channel. Never use a rectangular lower-screen band, long travelling lines, full-width wrapping or any ripple that crosses rocks, roots, bridge parts or shoreline foliage. Birds, edge leaves and river wavelets stop under reduced motion. [Source and prompt](assets/licenses/welcome-mystical-river-v1/SOURCE_RECORD.md).

---

# 2026-10-21 — corrected lawn and nature review checkpoint

Ordinary Home, Farm and unpaved City lawns use corrected B as the continuous base. Corrected C may appear only through irregular world-coordinate masks; A is restricted to the Forest's irregular outer-edge shade band. The six lawn tones are `#6C7749`, `#798455`, `#859056`, `#8C9564`, `#939C67`, `#9EA66B` (average hue 71.52°). Fixed-seed stepped dark pockets cover 15–20% below all objects, and sparse light V marks occur in loose world-space clusters. Never select complete lawn variants per rectangular chunk.

The user-approved majority-vote wide, tall and small clumps from `output/art/tall-grass-clump-review-v3/` are active at 48×34, 30×48 and 38×38 inside three 48×48 cells, always runtime scale 1. The selected wide source is the second, fewer/broader-blade candidate. Each saved grass identity expands visually into a fixed-seed group of two to five overlapping sprites with at least 11px between feet, mixed sizes, horizontal flips, Y sorting and a small 25%-alpha contact shadow; harvesting, contact, placement, collision and save data retain their original interaction point and identity.

Tree work remains at feasibility review only. A reliable single image-generation call produced at most about 49–50 clean logical pixels on one axis, so a 175×225 tree or 176×256 palm must be built from scale-1 modules. The review proposal uses three chunky leaf-cluster sizes, two trunk types and one root flare, assembled with a fixed seed. No modular tree, palm or bush is registered in Phaser pending user approval. Camera zoom stays 1.5.

---

# v0.43.1 — compact fountain garden and returned clothing rack

The City fountain garden is a compact rounded square centred at `(704,438)`, with the fountain aligned by its perceived central jet rather than transparent-canvas bounds. Follow the supplied reference's balanced floral border: four modest terracotta pots, symmetric low flowers/grass and a clear basin silhouette. Avoid the rejected wide empty oval, oversized corner pots, top-heavy shrubs or off-axis basin.

The clothing shop uses the user's returned rack at `0.7` scale with its complete transparent canvas. The barber shop uses the user-approved 2026-10-21 olive chair in the exact preceding 28×42 frame and 2× room scale. Small ground grass uses the approved olive/yellow tuft in the exact preceding 79×79 frame and 0.46 scale; player-foot contact selects a crisp left/right row-sheared phase and springs back to the base frame. Keep all three grass phases the same size and grounded at the same foot point.

---

# v0.42.2 — native snapped cottage (2026-10-17)

Use the user-supplied 167×110 Pixel Snapper canvas unchanged at integer 2× with nearest filtering. Preserve its exact terracotta, cream, walnut, stone and flower pixels; only pure-white backdrop pixels may be transparent. Transparent canvas margins do not determine visual alignment: retain the visible door/porch anchor. Do not resample, palette-reduce, antialias, blur, add a ground shadow or mix non-integer scales.

---

# v0.42.1 — terracotta cottage replacement (2026-10-17)

The selected cottage uses the established 120×112 native City-house cell and integer 2× world scale. Retain its warm terracotta roof, cream plaster, walnut trim, upper-left light, dark material-colour outlines, broad clusters, binary transparency and clear centered entrance. Do not add the rejected hanging lamp, loose scenery, glow, antialiasing, mixed pixel grids or baked ground shadow. Only northern `cottage-b` uses this frame; the neighboring cottage remains a distinct cool-roof silhouette.

---

# v0.42.0 — animated farm welcome

Keep Simple Life's muted olive meadow, sage-blue river, warm cream lettering and reddish timber. Use the existing cottage, crops, trees, bushes and approved fence artwork unchanged in a layered, room-aligned top-down farm vignette. Remove giant title characters. Show restrained horizontal water motion, tiny distant flapping bird silhouettes, drifting leaves and one/two-native-pixel canopy sway with roots stationary. Preserve crisp pixel clusters; avoid a flattened full-screen background illustration, photorealistic overlays, blur or glossy lighting. Give menu actions clear gaps, fixed touch targets, a short staggered fade and a gentle focus leaf; disable motion when the system requests reduced motion.

---

# v0.41.0 — approved City shops and garden (2026-10-17)

Use the nine selected proposal02native images exactly at their approved2×world scale with nearest-neighbour filtering, original palette/alpha and upper-left shading. Reuse existing approved café tables/chairs, camp, fountain, planter benches and NPCs without regeneration. New fixed shop rooms reuse approved wall/floor treatment and proposed furniture positions. Current outdoor grass/noise remains. Native hulls and explicit porch/door anchors determine placement; transparent canvas edges do not. Only append frames to the existing atlas; keep old pixels exact. [Source record](assets/licenses/city-shops-v1/SOURCE_RECORD.md).

---

# v0.40.0 — approved raised City surfaces with current grass

Use connected, quiet cream sidewalks/terraces and staggered muted warm-grey roads. A restrained top lip, three-native-pixel south-facing stone curb and one-pixel road contact shade communicate shallow elevation. North/side edges keep selective upper-left highlights, with softened binary corners and lowered crossing mouths. These are visual curbs, not jump barriers.

The accepted560×192 terrace keeps three vertical planter benches at their established1.5scale with88world-unit visible gaps and a continuous front walking strip. Preserve approved furniture/lamp/fountain/character source pixels and proportions. Keep the existing green ground's colours, texture, noise and flecks; do not substitute the flat lawn fields from proposal03. Group low planting/soil pockets around selected island edges while leaving the basin clear. Cottage feet and flowerpots belong on cream door aprons, tree roots on green ground, lamps off the grey road. Preserve future building parcels.

---

# v0.39.0 — outdoor details and runtime night light

The six replacements match the accepted walnut/cream/olive family. Boards support readable runtime labels; flowers have distinct cream/purple clusters; tents use muted canvas; the fountain uses quiet stone and contained blue-sage water. Approved well design is enlarged50% through a separate native derivative; old planted benches reuse accepted art.

Daytime lamp PNGs remain unlit and halo-free. User-requested warm nighttime lighting is a separate glass-only emission layer with stepped pixel pools and dusk/dawn fading. City lamp bases stay off roads; tree roots stay on green ground outside sidewalks, plazas, garden soil and water. Moved trees keep old saved IDs.

---

# v0.38.0 — approved outdoor family

Use the accepted planter and unlit lamp as material/detail anchors: muted reddish walnut, restrained warm highlights, dark brown selective outlines, upper-left daylight, olive/sage foliage, cream flowers, subdued grey stone and cream/sage canopy. Keep room-aligned angled top-down construction, broad upper planes and shorter front faces. All source/background alpha is clean; no baked glow/haze or ground shadows. Source canvases remain intact; native derivatives preserve logical game scale. Closed fence gate stays separate from open travel gateways. Other bench directions keep their existing authored views; approved indoor furniture and accepted planter remain unchanged.

---

# v0.37.2 — muted planter-bench palette

The accepted revision keeps the vertical planter, side seats, projection, proportions and flower placement. Use moderately desaturated reddish walnut, restrained brown highlights/shadows, sage/olive leaves and softer purple/cream flowers with intentional pixel clusters. No orange/peach glow or surrounding shadow. Same native size and world placement; other furniture remains. [Source evidence](assets/licenses/planter-bench-muted-v2/SOURCE_RECORD.md).

---

# v0.37.1 — one accepted vertical planted seat

The human-approved outdoor review asset has a long north–south rectangular planter, parallel seats on its two long sides, broad visible soil/rim/seat tops, shorter shaded fronts, room-aligned orthographic projection and no diagonal rotation. Preserve warm reddish wood, square posts, restrained grain, sage/olive clusters, upright purple spikes and cream flowers. Alpha outside the source-derived runtime silhouette is zero; do not add glow or surrounding shadow. Integrate one City planted bench for inspection; other furniture designs and existing character/camera remain.

---

# v0.37.0 — human-approved warm home interior (2026-10-16)

The accepted collection and room preview supersede the earlier one-native-table gate for the fixed home interior. Preserve original warm walnut/cream/terracotta furniture, upper-left light, orthographic angled top-down view and existing character/camera. Use a taller cream plaster face, thin peach/brown lower panel trim, a separate quieter tiled floor, continuous cutaway side boundaries and a broad flush wooden threshold. Windows/shelf fit inside the upper face; visible bounds and projected feet align floor-standing furniture with the wall–floor seam. Keep the fireplace and fire at one registration. Rugs remain floor layers and both benches retain their opposing views.

Keep dining left, sleeping right, storage/hearth at the back and entrance at the bottom. The final approval removes the freestanding storage jar and moves the wood16 world units back from the review. Do not redraw/recolour accepted furniture or the character to compensate for architecture. Whole-set originals and prior runtime art remain preserved; native rendering exports are separate. [Approval/source evidence](assets/licenses/home-interior-v1/SOURCE_RECORD.md).

---

# v0.36.3 — single native table direction (2026-10-15)

The user rejects the bulk cedar mood and now requests one original32×24 prop for review. This supersedes a steep overhead/finely textured treatment for this candidate. Use the interior reference's orthographic angled top-down view: dominant oval upper plane with substantial depth, thin front rim, short attached front legs, naturally hidden rear legs and upright pottery with visible openings. Keep axes horizontal/vertical, with no isometric turn or perspective convergence.

Simple readable silhouette, selective one-pixel dark-brown outline, minimal two-tone material shading, upper-left light, warm walnut/cream/terracotta, deliberate clusters and almost no grain. One jug/two cups are included per the later explicit instruction. Native32×24, transparent padding,16×16 ground-tile anchor and2× world rendering beside the existing farmer. One interior table only; preserve other objects until visual review. [Prompts/export/provenance](assets/licenses/table-native-v1/SOURCE_RECORD.md). Previous directions below are historical.

---

# v0.36.0 — accepted cedar prop direction (2026-10-15)

The user approved the v0.35.3 bench and explicitly authorized the full prop rollout, superseding the earlier one-object review gate. Use its steep high-angle 3/4 top-down camera, horizontal width edges, broad visible top surfaces, short foreshortened fronts, thin warm-dark outlines and crisp grid-aligned native pixels. Muted dark cedar/timber, sage foliage and pastel wildflowers unify the props; stone, water, metal, ceramics and fabric retain distinct desaturated material ramps. No low/profile camera, neon, blur or anti-aliasing.

The approved bench is reused exactly. Separate upright rotated furniture sprites retain this camera convention. New sprites render at half the preceding logical scale to preserve world extents. Catalog/placement/world share pixels, subtle existing contact shadows ground upright pieces, and rugs/paving stay on the floor. Signs reserve clear label/arrow space; fountain highlights align to its three cascades. Tables remain indoors. Main approved nature/people/crops and architecture retain their art. [Source/export evidence](assets/licenses/cedar-props-v1/SOURCE_RECORD.md). Prior sections below describe historical iterations.

---

# v0.35.3 — user-directed one-object trial (2026-10-15)

The user rejects the prior object style and supplies the new direction: high-angle 3/4 top-down, detailed visible top surfaces, dark warm cedar/rustic timber, soft desaturated foliage, pastel wildflowers, warm muted earthy palette, clean grid-aligned outlines, nearest rendering and subtle contact shadow. Avoid low/front/side views, neon, blur and anti-aliasing. Test ONE object first and wait for user review before extending this direction.

The Home garden bench at(960,824) is the sole trial. It retains its existing world footprint/collision and receives one additional 64×40 native atlas frame at 1× world scale. All existing artwork is preserved, including other benches and direction views. [Exact prompt/edit/export evidence](assets/licenses/bench-cedar-v1/SOURCE_RECORD.md). This is a candidate, not an accepted whole-game art direction.

---

# v0.35.2 — consistent overhead forms and grounded placement (2026-10-15)

The latest user asks for more reference-level craft, consistent viewing sides and object positions, other prop updates, and no tables outdoors. Use one orthographic camera-facing convention: verticals upright, width axis horizontal, broad visible upper planes, shorter front faces and a narrow shaded right side. Upper-left light, dark brown/plum contour, controlled clusters and a 47-colour material ramp give visible rims, joinery, round ceramics, masonry, canvas seams and planted seat volumes. This is original pixel artwork guided by the supplied reference, not a copied scene or claim of identical quality.

The centre window shifts 48 world units right to clear the mantel, and the east City tent shifts 80 world units right to clear public seating. Front/rear/side benches and the side dining table are separately authored upright views. The back row shares a ground baseline; the hearth and logs sit 24 world units farther right, with matching solids and cooking anchor, leaving eight world units beside the north seat. Rugs retain their full ground rectangle and textile art. The approved camera/player scale stays. Remove static outdoor tables and allow table placement indoors only. Preserve ownership by packing former outdoor tables and displaced indoor pieces into Bag.

Forty-one existing frames change; 917 other town frames, all frame coordinates, farmers, foliage and terrain retain their pixels. [Art/source evidence](assets/licenses/props-v3/SOURCE_RECORD.md).

---

# v0.35.1 — clean native shapes and coherent furniture view (2026-10-15)

The latest user correction rejects grainy miniature-render detail and uneven viewpoints. Use a consistent south-facing overhead view, visible tabletop/seat upper planes, shorter upright front faces, a thin dark plum/brown contour and broad contiguous colour clusters. Keep wood panels and textile centres quiet. Pattern scale must remain readable beside the approved farmer. Three principal shades per material plus outline/accent colours guide a 33-colour native base palette; discrete market-awning adaptations remain.

Core furniture uses newly generated simple shapes; native area voting avoids single-point downsampling speckles. Shared material treatment cleans up other recent props. Rugs cover their whole existing ground rectangle, while upright props retain proportions and foot anchors. Preserve the room layout, all physical footprints and approved character/foliage pixels. [Prompt/source evidence](assets/licenses/props-v2/SOURCE_RECORD.md).

---

# v0.35.0 — restrained layered prop artwork (2026-10-15)

The user's latest Plant Tales examples clarify the object direction: orthographic overhead view from the south, horizontal edges, readable tops/fronts, narrow dark contours, restrained discrete material shades and square pixel clusters. Original generated objects use a shared 57-colour earthy material palette, with native nearest-neighbour sampling and binary alpha. Visible wood grain, bevelled rims, shaded ceramic curvature, masonry and woven patterns replace simple large rectangles. Tiny contact shadows ground purchased pieces. Keep existing source sizes and placement footprints; separately authored upright side views replace rotated or flat rectangle approximations.

Snow caps, dark olive needles and warm bark are separate authored ramps; never apply a second snow tint to the snowy pine. Paid house rug/quilt accents preserve texture. Shop thumbnails and placed pieces share the same sprites and fit their preview boxes. Existing approved farmers, NPCs, crops, trees and grass remain. [Sources/prompts](assets/licenses/props-v1/SOURCE_RECORD.md).

---

# v0.34.0 — young trees, leafy shrubs and water contact (2026-10-15)

Retire the spiky forest-palmetto and thin fern designs from all outdoor rendering. Existing placements show low leafy bushes at their original ground anchors, preserving saved gathering IDs. Common tree groves mix in smaller pale-trunk saplings and young-fruit forms. Plain/berry/flower bushes share the muted olive palette and botanical clusters; larger approved broadleaf/palm/pine art remains.

Water footsteps use crisp2world-unit pixel blocks: short ballistic droplets, expanding broken elliptical rings and trailing wakes. Alternate contact points and generate edge splashes on wet/dry transitions. Every block clips to real water so banks/bridge decks stay dry. Stationary or collision-blocked movement emits no endless footsteps. Preserve reflections, ankle crop, ambient currents, shared shore geometry and grounded shadows. Bridge rail artwork now has matching physical side barriers and open ends. [Original art/prompts/conversion](assets/licenses/nature-v2/SOURCE_RECORD.md).

---

# v0.33.0 — natural olive foliage (2026-10-15)

Use original generated broadleaf crowns with open branching, warm bark/root flares and layered olive leaf clusters; palms have broad feathered fronds. Native80 ×112,96 ×128and52 ×114tree frames render at2× with nearest filtering. Root-origin registration keeps existing trunk positions, collision and grounded shadows. The compact24 ×24grass tuft has irregular blade groups, transparent gaps and existing three-phase bending. Small resting grass details reuse reduced native tufts.

Use shared olive foliage across outdoor locations, retaining distinct Forest habitat treatments. Existing fern silhouettes receive olive color treatment. Calmer short ground-leaf marks replace repeated U-shapes; sparse flower groups remain. Tree crowns overlapping the farmer fade to28%to keep the farmer readable through several layers. Conifers now use the new layered pine with a snow adaptation; bushes remain; willow is currently a smaller broadleaf adaptation. Reference screenshots guide general botanical volume, perspective and palette, with original generated silhouettes. [Sources/prompts/adaptations](assets/licenses/nature-v1/SOURCE_RECORD.md).

---

# v0.32.0 — five-row Farm with breathing room (2026-10-15)

Use an 8 × 5 prepared starter and equal 384 × 240 growing-area clearances. Entrance path narrows within its former footprint, leaving at least32world units between roads and starter earth. Board moves to existing main-lane ground, at least64world units beyond the field on both axes. Undug/restored ground shows existing grass terrain; no new overlays or raster art. Existing crops in an old sixth row remain until the player harvests/clears them.

---

# v0.31.1 — natural undug farm ground (2026-10-15)

Remove the pre-painted light-brown growing-site rectangles. The existing grass terrain continues across undug areas; actual prepared/saved beds alone draw connected earth. Growing-area clearance is eight columns by six rows; the other three sites stay grassy until the player digs. Retain existing warm soil, transparent plants, shadows, native pixels and simpler lanes. No new bitmap generation.

---

# v0.31.0 — clear farming composition and depth priorities (2026-10-15)

Four equal8×4growing areas use lighter fallow earth, with darker prepared soil and existing wet/dry transitions. Simplify road composition to an entrance and main lane, leaving rectangular planting areas uninterrupted. Keep saved crops/furniture and native pixels. Fallow sites reuse the project's procedural soil; no reference pixels copied.

The supplied reference's apparent depth can be pursued with2Dart: consistent low top-down angles, visible shaded side planes on houses/trees, taller species-specific crop silhouettes, foliage overlapping actors with feet-based sorting and one common light direction. Existing shadows/jumping/tree occlusion already provide the rendering foundations. Prioritize a reviewed fuller crop sample and coherent environment palette before producing a large replacement set. This task does not generate that art or change the engine/projection.

---

# v0.30.1 — uncluttered Farm and one shared soil surface (2026-10-15)

Use the supplied Plant Tales screenshot only as a general reference for warm earth, shallow grassy edges and crops grounded directly on a shared bed. Preserve native art/style and saved grid geometry. Avoid per-plant soil pads, pale root underlines, deep/scalloped turf borders and repeated static field ornaments. Keep functional landmarks and owned decorations. Watered soil stays brown with soft pixel transitions to dry neighbouring cells; adjacent wet cells merge without a grid edge. Current plant silhouettes remain the original24×32sprites with soil pixels removed; fuller species-specific foliage can be considered after this cleanup is reviewed, within the submission budget.

---

# v0.30.0 — approved merchant motion and next design (2026-10-14)

Nell/Sol approved neutral silhouettes are now runtime art:64×64cells, ground(32,56),40native-pixel standing bodies at1.5×scale. Four idle phases last1500/1200/120/1500ms; six walking poses last150ms each. Do not replace approved neutral pixels during future regeneration. Retain relaxed NPC gait rather than farmer running. Source-backed native walking height varies39–42pixels; boots stay grounded. Side idle holds the approved profile to avoid generated camera turns; west walking mirrors east, including side details. Nell's short blink slot holds neutral because generated face marks were unreadable; Sol's blink remains.

Next standing review: Clara, seed merchant, copper-brown single braid, sage apron over ivory rolled blouse, charcoal trousers, brown boots and ochre seed pockets. Match40native-pixel height/small head; review four standing views before animation/runtime adoption. Shop previews remain the player's same farmer. Hair preview shows hair unobstructed while actual accessories remain equipped.

---

# Nell and Sol — first matching NPC designs (2026-10-14)

Follow the accepted gradual replacement workflow: review standing appearances before animated motion and runtime replacement. Match approved farmers with slim adult40-native-pixel bodies in64×64transparent frames, ground(32,56), suggested1.5display scale and small equal1×2eyes. Preserve sparse pixel clusters, low top-down perspective, restrained brown outlines and muted colours. Maintain each NPC's own silhouette and clothes through four directions. Nell: dark wavy bob/ochre clip, rose blouse/ivory cuffs, terracotta apron, charcoal trousers and brown boots. Sol: short dark side part/grey temple streak, teal vest/ivory sleeves, charcoal trousers, brown boots and small leather belt pouch. Native standing export uses at most32opaque colours per view.

Existing villagers remain in-game during review. Later idle/walking frames should retain approved head/body proportions, foot grounding, clothing details and colour relationships; NPCs need their own relaxed walking motion. Preserve resident IDs, shops, homes, dialogue, schedules and curfew when replacing art. Do not route NPC appearances through the player's wardrobe.

---

# v0.29.0 — clothes retain the farmer (2026-10-14)

The user's customization request supersedes the historical complete-player-preset wardrobe. Saved boy/girl identity always selects the approved64×64 farmer rig. Never swap a player to an NPC or change body proportions, face, eyes, hair silhouette, gait or timings when buying clothes. Preserve the two starter combinations exactly; other existing outfit IDs apply muted fabric colour ramps to the same body, and hair choices dye connected source hair, including the girl's ponytail. These are colour variants of the approved workwear, not new garment silhouettes. NPC presets remain for residents only.

First extras: warm straw hat, fine brown round glasses with open lenses, and small brown canvas backpack. Keep native pixel density and transparent backgrounds. Register each view to the actual head/shoulder in all192poses per farmer, including bent/turned heads, jumping and work. Glasses are absent on the back of the head; preserve original eye pixels. Backpack straps follow fabric, side bags sit behind the body. Compose native layers before rendering so water crops, reflections and hand-over-tool crops share the dressed farmer. Keep cosmetic items free of stat bonuses. Avoid a large accessory catalogue until this small set has been player-reviewed.

---

# v0.28.1 — matching female farmer, corrected size and eyes (2026-10-14)

The complete female counterpart uses a brown low ponytail, tan dot-eye face, ivory rolled sleeves, olive overalls/belt and brown boots, matching the accepted male style. Eight authored actions share64×64cells and origin(32,56). User follow-up supersedes the initial1.5female display scale: use1.45for the41-native-pixel standing silhouette (59.45world units), matching the boy’s40at1.5(60). Preserve native pixels instead of downsampling to48×48. Her front open-eye idle phases0/1/3have matching1-column×2-row pupils at stable positions after a targeted imagegen idle edit and whole-frame sampling-grid registration. Keep the brief blink.

Reuse the approved male axe/shovel/can art unchanged, with the female’s own hand centres and wrist-angle table. Original female hand pixels draw over each carry grip; separate tools hide during the existing combined actions. Jump uses the same600msworld arc with six new female poses. Male/NPC/environment pixels, camera, rules and saves remain.

---

# v0.27.0 — authored male jump and matching carried tools (2026-10-14)

Extend the approved v2 male with24new jump poses (six per direction) and12separate axe/shovel/can views. Preserve all168approved body/action frames, original eye detail,64×64padding/ground(32,56), accepted1.5display scale and restrained32-colour palette. The generated jump uses anticipation, takeoff, tuck, extension and landing; normalize boots to row56 and apply the existing600ms world arc once. This supersedes the running-pose jump fallback for this male only. Each carried tool uses a registered grip, per-frame real skin-pixel hand and small angle change from the sleeve/hand axis. Repaint the original hand crop above the grip. Hide separate tools/hands during existing combined actions. The Copper upgrade keeps its existing effects with the matching grey-green can. Female/NPC/other appearances remain.

---

# v0.26.2 — preserve original eyes at the accepted smaller size (2026-10-14)

The user reports a missing front eye after accepting the smaller stature. Verified 0.75 native downsampling skipped the original left-eye column. Restore every original 64×64 RGBA frame, ground origin (32,56), and use 1.5× display scale with nearest filtering and rounded world positions. The displayed cell remains 96 units and ground offset 84, matching the preceding 48×48 / 2× derivative; standing body remains about 60 world units. This narrowly supersedes integer-only boy display/native-resize guidance to retain the accepted size and original face details. Fractional scale can give source pixels unequal displayed widths; no smoothing is introduced. Girl, other looks, NPCs, camera/world, collisions and action timing remain. Hand grips use original skin-pixel centres converted/rounded to the current display scale; built-in spout offsets retain the same physical size.

---

# v0.26.1 — male farmer matches the game scale (2026-10-14)

At the user’s request, supersede the preceding 40-pixel male body with one fixed 0.75 nearest-neighbour reduction of every full padded frame. Runtime cells are 48×48, ground origin (24,42), integer 2× world scale; front/side idle ink is 30 pixels / 60 world units, back is 31 pixels. This matches the girl’s approximate body height and the environment’s native pixel grid. Do not trim, stretch or independently shift limbs. Original 64×64 source frames/palette/timings remain; no new art generation. Held tools use hand coordinates extracted from the adapted frames; watering spout offsets scale with the body. Existing action tools shrink with their complete poses. The girl/NPCs/world/camera/collision bodies and carried tool icon artwork remain.

---

# v0.26.0 — user-approved revised male farmer (2026-10-14)

Use the supplied revised v2 identity for Worker/Classic, preserving all native RGBA pixels. The 64×64 padded cells share ground origin (32,56) and integer 2× world scale: about 40 native pixels / 80 world units of standing body, consistent with the tall 80-unit town people. Do not stretch, trim or independently warp limbs. The girl retains her approved 48×48 / 30-pixel body. Idle uses the supplied long holds/blink, running eight phases at approximately 12 fps, and five work/axe-attack actions retain six authored phases. Tool-bearing poses contain the farmer and tool together; suppress the separate utility sprite during them. Other complete outfits/NPCs retain their existing pixels. Jump adapts real running poses to the existing arc, not an authored jump cycle. Copper Can effects/coverage remain gameplay-driven; this pack has one built-in can design.

---

# v0.25.0 — generated farmer girl (2026-10-13)

Use the user-requested brown ponytail, tan skin, ivory rolled sleeves, olive overalls and brown boots for the girl starter look (Garden/Autumn). Four generated directional idles and 32 generated running poses are adapted to native 48×48 cells with a 30-pixel front-facing ink height, shared ground row 40, 32-colour palette and integer 2× rendering. Source sheet and prompt are retained; nearest sampling/palette adaptation is disclosed. Body geometry is not cut into independently shifted parts; source arm/leg changes supply the cycle at 16 fps. Original male, other complete presets, NPCs, camera/depth and physics remain. Three passing run frames support the existing jump arc; no new authored jump/tool-use cycle is claimed.

---

# v0.24.0 — approved PixelLab farmer (2026-10-13)

The user-approved PixelLab farmer replaces the existing free Worker outfit / Classic look. All four native running directions use eight unique exported frames at 16 fps. Original RGBA pixels and slim proportions remain unchanged, rendered at integer 2× with nearest filtering. Static idle frames are padded into the larger 48×48 run canvas; shared ground row 40 keeps feet, shadows, tools and shallow-water cropping aligned. Title, character choice and wardrobe previews show the same approved farmer.

Other complete looks and all eight town NPCs retain the existing Szadiart artwork and motion. Appearance IDs, prices, ownership, schema-19 saves, controls and movement speed remain. Jump uses genuine passing run poses with the existing arc; no authored jump/tool cycle was supplied. Source records disclose user-generated PixelLab AI art and public output-use terms. Runtime allowlist stays unchanged; no remote assets/services or source archives ship.

---

# v0.23.0 — original Szadiart people (2026-10-13)

Player and eight town NPCs now use original Szadiart 3 Direction NPC Characters artwork. Native proportions, faces, colours and all opaque source pixels are preserved. Only baked alpha-77 ground shadows are removed; a fixed 24×40 crop and mirrored side view support the existing four directions. World scale is integer 2× with nearest filtering. Players use four authored idle poses at 6 fps and four walk poses at 10 fps; NPCs use four walk slots at the existing 120 ms cadence. Movement speed and controls remain. The pack has no authored running, jumping or tool-action animations; existing jump/tool effects use unchanged source poses and world motion.

Five outfits and four complete looks replace independently layered hair/clothes. Original complete source presets are never redrawn or recoloured. The wardrobe and Town stylist menus describe Outfits / Looks; their English/Myanmar text remains localized. Existing appearance IDs, purchase prices, ownership, balance and schema-19 saves remain, so a saved appearance maps to its corresponding complete preset. The default brown-haired teal worker differs from the town cast. Depth, grounded shadows, collision footprints and water/reflection integration remain.

Preserve the source faces, proportions, clothing and palette. Do not retarget body geometry, redraw heads, tint source clothing or invent limb warps. Repeated source poses are valid: Rowan’s back walk has four slots and three unique images.

---

# v0.22.1 — human proportions and clearer character artwork (2026-10-13)

Revised player and all eight NPC designs after the user accepted movement but rejected the squat appearance. Smaller original pixel heads have warm faces, small dark eyes and asymmetric hair; longer torso/legs and defined ivory sleeves, overall straps, vest/jacket seams, dress hems and boots make people easier to read. Every CraftPix source body pose uses the same fixed vertical row mapping (1.8 offline), with no independent limb displacement or invented gait. Run remains eight phases at 12 fps, NPC walking six phases at 8.33 fps, and idle retains its supplied phase counts. Native 24×36 cells render at integer 2× world scale; standing boy ink is 62 world pixels instead of 66. Source-derived tool grips use native pixel centres. Appearance IDs, prices, saved ownership, schema 19, movement speed, collision footprints, shadows and depth remain. Smaller heads and restrained warm outlines replace the rejected giant-iris/cap appearance. Source body silhouette is retargeted consistently; do not claim unchanged source geometry or original-head pixels. Final textures and world/UI rendering retain sharp nearest-filtered pixels. No screenshot pixels or image-generation input.

---

# v0.22.0 — native run and walk animations (2026-10-13)

Player movement uses the complete eight-pose CraftPix unarmed run cycle at 12 fps. NPCs keep the six-pose walk cycle at 8.33 fps. Idle uses all twelve supplied front/side poses and four back poses at 8 fps. The previous cut-and-warp animation is retired. Clothing and hair are drawn on the original poses; arms, feet and head positions are never mechanically deformed. Native 24×26 frames render at integer 3× world scale (66-pixel standing ink height, 78-pixel padded cell). All 20 outfit/hair combinations and eight town variants retain their identities, prices and schema-19 appearance saves. Jump selects three tucked poses from the actual run sheet; it is an adaptation, not a supplied jump animation. The user selected the free CraftPix bases for full authored animation. Retain original skin/eye pixels and source silhouettes; native clothes/hair/hat additions match the warm olive/cream palette. Source crop stays fixed for every frame. Nearest filtering, feet depth, grounded shadows and separate canvas UI remain. No image generation or reference-screenshot sampling.

---

# v0.21.3 — joined walking sprites and slimmer characters (2026-10-13)

The passing torso previously rose one pixel above the legs, exposing a transparent waist row. The animation now overlaps two native hip rows and restores the side garment behind moving forearms. Softer knee lift and closer foot placement reduce the exaggerated gait; the added dark far-leg tint is removed. Native artwork is about 10% narrower, with unchanged 40×72 cells, 64-pixel standing height and integer 1× world scale. Original approved hair, face, clothing and boots remain. Preserve natural gaps between feet; repair disconnected joints with source garment pixels rather than dark patches. Nearest filtering and native whole-pixel rendering remain.

---

# v0.21.2 — character scale and walking refinement (2026-10-13)

Characters now use 40×72 native cells at integer 1× world scale, with a 64-pixel visible height instead of 76 (about 16% smaller). A stable 32-colour identity palette simplifies shading; the far leg receives a small additional shade. Faces, hair, clothes and boots retain the approved source art. Four walking poses use contact/passing steps, opposing arms, bent recovering knees and a one-pixel passing bob. Both player and NPC sprites share the poses; held tools follow the animated grip. Standing, jump, feet anchors, depth and local appearance/saves remain.

Codex assisted with the editable native-sprite packing/animation code, joint offsets, palette simplification, hand synchronization, tests and documentation. The six previously disclosed original generated source sheets are retained; no new generation or third-party asset. Source/prompt/hash record: assets/licenses/characters-v2/SOURCE_RECORD.md. No new dependency, runtime asset path, economy rule, save schema, source push or competition submission. AI assistance and established mixed-atlas licences remain disclosed; no exclusive-copyright claim.

---

# v0.21.1 — approved character detail

Active people now use original OpenAI-generated artwork based on the user-approved guide, packed into 48×80 nearest-filtered native sprites. Fuller hair, visible eyes, layered clothing and boots replace the rejected thin 24×40 adaptations. Player world scale 1× retains approximate previous physical height. Five outfits/four hairs and eight town variants retain frame indexes, schema-19 saves, paid clothing/barber services and free owned outfits. The cave remains postponed and NPC curfew remains 19:00. Use transparent silhouettes, native integer world scale, 1×/2× effective UI previews and grounded feet. Source images provide actual artwork; no procedural stick-body replacement. Source record: assets/licenses/characters-v2/SOURCE_RECORD.md.

---

# v0.21.0 — reference-inspired tall native people

The user authorizes adapting free CC0 character bases with taller proportions and coin-paid appearance choices. Use 24×40 cells at fixed world 2× scale, smaller heads, visible native eyes, restrained warm outlines, long legs and different clothing/hair silhouettes. Retain the current three-quarter map view, ground anchors, shadows, canopy occlusion and nearest filtering. Source body poses are CC0 diamonddmgirl/Cabbit; original native clothing/hair masks and jump poses are AI-assisted project art. The generated design guide is provenance/reference only, never runtime imagery. Five outfits × four haircuts and eight matching town variants share the rig. No pixels from the supplied screenshots are copied. SOURCE_RECORD: assets/licenses/characters/SOURCE_RECORD.md.

---

# v0.20.2 — user-selected 2.5D depth polish

The user chooses the existing view with improved shadows, layers and walking behind objects. Retain three-quarter pixel sprites, map axes, palette, existing house architecture and camera zoom. Original cached native contact-shadow pixels use fixed 2× scale and nearest filtering, with no smoothed ellipse. Keep shadows on the ground above soil/rugs, dim them while airborne, hide them while wading and retain water reflection. Upright plants sort at registered feet. Bridge decks stay opaque and at ground depth; original raised rails/posts sort at their foot, using short side sections. Tree occlusion tests full sprite bounds behind the trunk and restores opacity in front. No isometric projection, 3D engine, perspective skew or new external art.

---

# v0.20.1 — cave/spirit visuals retired

No sealed/broken/restored cave or spirit textures are generated or rendered. The former cave clearing remains open without a skull replacement or hidden collider. Existing trees, habitats, camera, font sizes, nearest filtering and licensed atlases remain. Historical original-art evidence is retained for provenance and later recovery from Git.

---

# v0.20.0 — original sealed cave and restless spirits

The user requests removal of the skull cave. Retain its clearing/tree identities, omit both skull silhouettes and render one original 48×52 native stone arch with an amber seal, broken embers/rubble and restored green/gold details. World scale is 3×; the warning reuses the actual cave texture at 1× or 2×. Spirits use two original 20×26 tattered robe poses, cream/sage palette and amber eyes at 2×. Whole pixel coordinates, nearest filtering and existing action warning/health marks remain. No animal/tree nameplates or downloaded art are added. Responsive warning content and repair cards paginate at existing native font sizes, without clipping into footer actions. Creation record: assets/licenses/cursed-cave.md.

---

# v0.19.2 — balanced Burmese direction signs

Keep the smaller Burmese font. Center sign text and arrow rows above their original world post, reserve visible top padding, and use even native board widths so the stem and arrow have integer coordinates. Preserve all eight authored directions including right (0). English sign styling remains unchanged.

---

# v0.19.1 — restrained Burmese scale and world signs

Supersedes v0.19.0 sizes: Burmese body 8 logical pixels, headings 12/24, world captions 7/8. Keep integer texture resolution and scale, full-run Noto shaping, existing padding/leading and nearest sampling. World signs fit measured text and separate directional arrows. No animal nameplate or Tree word; retain useful combat warnings/health and tree hit segments. Seed Aid uses Myanmar copy when selected. English/art/audio unchanged.

---

# v0.19.0 — correctly shaped Myanmar text

Retain Thaleah/m5x7 and native integer bitmap sizes for English, the Latin Simple Life brand and numeric/symbol-only UI controls. Burmese requires an actual Myanmar Unicode font: Noto Sans Myanmar UI, complete-run OpenType shaping rather than bitmap code-point drawing. Body text is 10 logical pixels, headings 14/28, with integer resolution 2, UI root scale 2, nearest texture filtering, 3 logical pixels of leading and 2 logical pixels of padding per edge. Renderer antialias settings remain off; browser Canvas glyph rasterization supports proper stacked marks and is distinct from the binary Latin bitmap sheets. No fractional text transform or improvised Myanmar glyph shape. Keep warm cream/olive panels, measured row bands, concise buttons and paginated long copy. World art/audio/camera remain approved existing assets/settings.

---

# v0.18.5 — clear mobile trade bands and icon actions

Buy/Sell sections keep separate space at native font sizes. Short landscape uses an item column and an action column; details replace that content with measured rows. Headings and header actions no longer overlap. Reuse the original folded-map, upward-arrow and star glyphs. Center Jump/Use glyphs without captions, retaining 56 CSS pixel touch targets. This supersedes the previous caption requirement. Existing world art, mobile camera and approved font/filter rules remain.

---

# v0.18.4 — typography and phone spacing

Use creator-supplied Thaleah Fat for UI headings and m5x7 for small labels, counts and clock. Keep native binary glyph silhouettes, nearest filtering and integer size multiples; no smoothing, fractional UI text parent scales or artificial bold widening. Retain warm cream/olive panels and measured text spacing, with 4 CSS pixels of extra leading and 6 CSS pixels of button side padding. Compact panels reserve separate content/footer bands; short panels use concise labels and paginated text. The supplied screenshots inform layout only.

The phone interior is one-third larger in landscape, keeping the established artwork/room. Retain the compact outdoor HUD and wider outdoor view. Jump/Use captions require 56px targets. This supersedes v0.18.3's fractional clock scale and matched mobile interior/outdoor zoom. No Forest foliage, shore, bridge or other world-art change.

---

# v0.18.3 — phone proportions from the supplied gameplay screenshot

Reduce mobile gameplay HUD coverage while retaining warm cream/olive frames and readable labels: shorter/scaled status bars, smaller clock, 48px toolbar/action targets and a 96px joystick. Keep the fullscreen separate canvas UI and existing menu proportions. Landscape phones use .75 world zoom with nearest-neighbour rendering and matched indoor/outdoor actor scale, leaving more surroundings visible; desktop/portrait framing stays consistent with the prior version. Existing original glyphs/font/atlas pixels are reused, without importing screenshot art. This supersedes earlier fixed gameplay HUD dimensions for mobile.

---

# v0.18.1 — usable short landscape

Retain 2× native cream/olive pixel UI and world art. Compact start menus use two columns; Bag uses wider rows with pagination; Audio uses two columns; tiny Journal panels prioritize the active objective/directions. Compact right badges move clear of Jump/Use, and narrow hotbars keep tools accessible through Bag / Gear. Touch targets retain at least 44 physical pixels in the recorded cases, rather than shrinking the full UI. No new raster, atlas/palette change or DOM HUD.

---

# v0.18.0 — restrained judge polish

Introduction tableaux now use deterministic integer-pixel textures, layered olive foliage, warm cottage shingles/planks/windows, wood grain/paper/keepsake, and a muted crowded city. They are original project code art; no outside bitmap/sample. Copper preview uses restrained gold corners, its existing can receives a warm copper tint, and soil/seed/pour/leaf/produce/coin/tree-fall effects remain short, world-local and crisp. Approved atlas bytes, quiet interiors, fullscreen canvas UI, current Forest natural shores/grass passages/bridges/dry roots and path/gate clearance remain. No new floating-label catalogue or wholesale map redraw. Human visual acceptance remains required.

---

# v0.17.4 — gather default ground plants

Keep all existing default ground foliage artwork, colors, scale and placements until gathered. Register flower/fern/mushroom/snow-grass/low shrub/bamboo silhouettes at their visible feet, using native atlas dimensions. Gathering removes the complete plant and shadow without changing unrelated tree/crop/purchased-decoration art. Animated plants leave the animation list when removed. No new art, recoloring, teal ferns or raised banks. Evidence: verification/outdoor-plants/README.md.

---

# v0.17.2 — original cottage structure across house designs

Follow the user’s old-house screenshot for structure and position. All eight themes now use the original native `house-village-0` pixels: pitched roof planes/ridge, front gable, taller centered double door, asymmetrical right windows, wall envelope, flowerboxes and steps align exactly. Colors/material details differentiate the designs: terracotta/rose, green timber, seafoam, woven bamboo, brick/dark trim, glass/vines palette, moonwood and ivory/gold. Interior themes remain distinct. No imported screenshot pixels or new atlas raster. The HUD uses an original drawn house glyph beside the Menu glyph.

---

# v0.17.1 — readable placement feedback

The canvas confirmation button reads Add with dark bold pixels even when disabled. Drawn pixel direction arrows replace unsupported font characters. Green/red original placement ghost and directional arrow remain, with concise clear-spot/screen feedback. Readjust hides the original drawing while keeping its saved record until confirm/cancel. Placed decor opens the existing cream canvas choice dialog. No new art bytes, palette changes, DOM HUD or Forest changes.

---

# v0.17.0 — warm homes and gardens

Eight original native-pixel exteriors share the established walkable porch/envelope while varying timber, brick, glass, ivory columns, balconies, shutters, vines and rose boxes. Premium homes have more elaborate accents. Interiors use distinct wood/bamboo/checker/mosaic floors, floral/woven rugs, curtains, bed covers, wall displays and themed tabletop flowers/books/shells/tea/ledger/greenery/map/candelabra. Retain existing licensed room anchors and natural warm cream/olive language. Garden previews reuse the exact placed artwork; decorative trees have dry roots and depth at their feet. Phone pages use short distinct labels and enlarged portrait house previews. No external image/reference pixels imported or atlas modified.

---

# v0.16.1 — readable mobile action icons

Original nine-pixel upward-arrow and star masks share the cream/olive canvas buttons with short Jump and Use/Hit captions inside 56-pixel touch targets. Retain native integer drawing and fullscreen world/canvas UI. Hand has no inventory or hotbar icon. Existing eight runtime art files are unchanged. Caption/glyphs are original source code; no external UI/font/art sample is introduced.

---

# v0.16.0 — restrained original story art and readable night

Retain native pixel art, cream/olive canvas panels and fullscreen world. Four small original geometric intro illustrations and a 16-pixel sun medallion match the established palette; no reference-game pixels/font extraction. Night settlement overlay caps at 0.52 while Forest retains 0.78 distance darkness and existing local bands. Uppercase BAG avoids the g/9 ambiguity; original lowercase g/q/y patterns now have clear stems/descenders. Short landscape action captions sit inside the viewport with hotbar spacing. Eight uncertain environment cells are independently redrawn in their existing dimensions/anchors, with no map/collision redesign. Source/hashes: assets/licenses/story-audio.

---

# v0.15.0 — honest furniture previews and directional views

The cream/olive placement strip has readable object/facing labels, arrow adjustments, Turn, Place and Cancel, replacing ordinary controls only while positioning. A translucent actual-object ghost uses green/red native footprint strokes and a cream facing arrow above foliage/night. Every control remains at least 44 physical pixels in tested layouts; compact portrait uses two action rows.

Share preview/world pixels through DecorationArt. Existing original front bench, barrel and lamp frames are reused; original side/back bench, vertical fence and two-axis picnic table are drawn with native warm wood/plum outline pixels. Retain planter/fence/flowers creator provenance. Never rotate a front-view sprite onto its side. Round/symmetric props naturally have less visible facing difference. Existing lantern yellow glass remains; no new halo or lighting system. No external asset or raster allowlist change.

---

# v0.14.0 — readable pixel text and illustrated resource pages

Use the supplied Pending Orders image as style guidance for dark olive readable mixed-case pixel text, stronger headings, cream/olive frames, pictured rows and clear action buttons. Original lowercase glyph patterns stay in the existing 8px font cells; heading widening preserves counters rather than overprinting them. Actual colored raster glyphs support both Canvas and WebGL; no external font or reference pixels are used.

Recipe cards show finished bench/flower planter/fence/paving art, labelled picture tabs, material need/stock and clear Build/Place. Town requests picture the object being helped and coin/seed rewards; projects show the actual completed arrangement. Home hearth shows its original stove and meal benefits. Match Bag/Gear thumbnails to the recipe image. Use a compact two-column landscape layout and stacked portrait card with at least 44px action targets. Tree chopping uses a modest cream/olive three-segment world meter above foliage/night shading and a short Tree n/3 label, then +3 Wood. Reuse existing licensed local cells; preserve eight runtime art paths and the fullscreen separate canvas UI.

---

# v0.13.0 — resource scenery

Reuse existing local pixel benches, fence pieces, flower planters, post markers and native flower frames for communal projects/Farm furniture. Stone paving uses original warm-grey 3x3 pixel stones with light top rims and darker seams; the installed hearth receives an original dark pan and warm cooked-meat pixels. The original source is src/art/SettlementView.js. Keep native nearest-neighbour scaling, foot-based depth and open streets. Suppress underlying grass where new scenery sits. The cooked food reuses the existing meat icon with a clear Grilled Meat label and restoration details in the bag. No screenshot pixels, new vendor download, new texture file or runtime remote media.

---

# v0.12.0 — daily care UI and retired item

Retain the cream/olive canvas theme, native scale and existing crop art. Care information has one Daily row, water-drop markers for uncared living crops, red warnings for third-day Recovering/dead crops and harvest markers for ripe plants. Compact layouts retain readable contextual recovery/water labels; the larger crop detail card hides when it would overlap the farmer/plant. Gear uses the existing Axe icon and omits the club. Remove the club stall from City composition; Rowan and his home remain. No new or regenerated artwork is introduced.

---

# v0.11.1 — matched indoor scale, larger Home and yellow energy bolt

The latest user correction requires indoor farmer/furniture at the same 2× world scale and camera framing consistent with outdoors. Home is 180×144 native pixels, its original doorway/porch retained; twelve other cottages are 120×96. Preserve the shared broad roof/raised central gable/flat facade/double door design. Replace the flat roof cap with a pitched ridge; doors must exceed native farmer height. Grounding shadows and exact alpha collision rows follow the larger house. Native cells are drawn directly, not resampled or copied from screenshots.

Energy now has an original yellow lightning icon and bright gold fill, retaining equal health/energy frame dimensions. Mobile world taps do not attack; Attack owns hunting/chopping. Keep desktop screen attacks and ordinary mobile interactions.

---

# v0.11.0 — front-facing houses, cozy Home and mobile controls

The latest explicit user reference supersedes v0.10.0's three-quarter side-wall structure. Every original 120×96 house uses the same broad roof, longitudinal raised central gable, attic lattice window, flat facade, centred double door, three front windows and flanking planter boxes. Thirteen warm roof/plaster/timber/brick/floral finishes differ without changing alpha/structure or door anchors. Remove house perspective cast polygons; retain restrained grounding shadows. No 3D scene/engine or copied screenshot pixels.

Home uses original native cream/terracotta diamond tiles, framed arched windows, fireplace/log stack, pottery shelves/counter, patterned rugs, dining table/benches, bed and potted plants. Room sizing/cutaway walls remain; clear central passage connects spawn, bed and exit. Use supplied interior for mood, materials and furniture types, without copying commercial pixels or exact room layout.

Mobile replaces arrows with a cream/olive circular analog joystick and lower Jump/Attack buttons. Portrait actions sit beside the joystick; landscape actions stack on the right outside the hotbar. Preserve separate fullscreen canvas UI and native farmer/NPC art. Outdoor jumping uses existing free arc/collision/cooldown; interior action buttons are disabled. Desktop has keyboard/direct world use without extra action controls.

---

# v0.10.0 — three-quarter depth and branching natural channels

The latest explicit user request supersedes the old house silhouette/framing/parallel-river presentation. Independently author thirteen original native cottage cells with visible receding roof planes and side walls, detailed shingles/ridges, recessed windows/doors, varied warm materials, foundations/steps and cast shadows. Regenerate exact collision masks while retaining door anchors and clear roads. Use closer desktop outdoor camera framing at integer 3× source pixels; compact screens retain 2×. This remains the established two-dimensional pixel world, using the screenshots/Plant Tales only as style references without copying pixels or exact layouts.

Forest rivers form a deterministic irregular branching network with round joins/caps, crisp varying banks, mixed-axis bridges, shared animated reflection surface and map contours. Taller dry inland cliffs use independently authored rose/brown pixel strata, fine crevices, broken local grass lips and shallow shadows; avoid old artificial river banks and preserve walking/jump gaps. The central return ring has understated stone, inner light and rising motes with a cleared silhouette/approach. Selected native supplied CraftPix rocky objects enrich Dark Forest; preserve original source pixels and creator terms. No new road, weather, 3D engine, cave interior or DOM HUD.

---

# v0.9.0 — broad habitats, dry shelves and staged axe motion

Use the latest references for seven organic climate areas: Snowy west, Dark Forest north, Rainforest centre, Meadow southwest, Easy Rainforest south/entrance, Shrubland southeast and Desert east. Keep 40 discovery/cache identities beneath the visible climate boundaries. Coherent world-coordinate texture and restrained local foliage shifts replace rectangular climate seams. Open grassy clearings in Meadow and tree clusters in dry habitats; retain denser forests, native silhouettes, crisp pixels, dry roots and grass-free bridges.

The latest explicit terrain request supersedes v0.4.6's no-terrace rule. Low brown earth shelves use retained native LimeZu face art and original stepped placement, an opaque earth backing, restrained brown face palette, local grass lips and shadows. Overlapping segments form continuous ridges rather than pale boulder rows. Keep wide walking breaks, dry footprints, protected resources/animal homes and free jumps. Old artificial river banks, teal ferns and waterfalls stay removed.

Remove all on-screen Axe/Attack buttons. Select Axe in Bag / Gear or key 5; tap the world to face/swing, with a slow wind-up, rapid cut, impact and recovery. Keep the reference idle blade slope, native hand attachment and no added skin rectangle; render behind up-facing/in front otherwise. Local synthesized habitat ambience is soft, reacts to day/night/water, and mutes in menus/background; Pause supplies a persistent sound switch. No new raster/audio asset or reference extraction.

---

# v0.8.0 — reference axe and readable resources

The new user reference supersedes v0.7.3's axe slope. Place the blade above/outside the native hand and slope the wooden handle downward/inward; mirror with facing. The original item is rotated by half a turn around its wooden endpoint (origin Y 2/16), keeping it off the torso, behind the up-facing farmer and in front otherwise. Axe has no added hand rectangle. Water/Shovel keep their established poses.

Three original local pixel cells depict a stylized meat meal with a cream bone, a stone inventory pile and irregular grey loose Forest stones. Use existing warm outlines/cream highlights; retain all 835 earlier atlas cells and all other runtime art. Hunting uses restrained flash/particles and fade without blood. Bag food details show short HP/EP gains; no new DOM HUD or USE button.

---

# v0.7.3 — outward axe, garden parcels and round vital meters

This user follow-up supersedes the v0.7.2 axe pose. Grip the native lower wood handle with the farmer's existing hand; remove the added skin rectangle for Axe. Mirror/rotate the blade outward, behind the up-facing body and in front for down/left/right. Keep Water/Shovel poses. Place enlarged cottages and sunflower pots fully off paved roads, with a clear central doorway and garden flanks.

Both vital meters use the supplied reference's broad structure: round cream badge, grey/cream beveled track, dark outline and highlighted fill. Retain red heart for health and gold leaf for energy, equal dimensions and current responsive placement. Shapes are independently authored procedural pixel graphics; do not copy reference pixels. All existing source art remains unchanged.

---

# v0.7.2 — consistent human proportions and ground seeds

The user's latest follow-up supersedes Pipoya's active NPC presentation and the planted packet stake. All active human NPCs/sellers share the Channeechan farmer's native body/face silhouette and scale, adapted only in hair/clothing palettes. Preserve 24×32 cells, 2× world scale, .94 foot origin and the farmer's four authored walk poses. Retain creator/template credit; legacy Pipoya cells remain credited in the atlas but are not active actors.

Planted seed art belongs at soil level: small grains and a low mound, with no giant inventory packet/sign. Inventory packets still show fruit emblems, and crop inspection identifies the planting. Existing water/warning labels and growing foliage remain. Axe vertically flips the item art to put the grip above its blade, extends beside the hand clear of the body, draws in front in every facing and swings outward. Water/Shovel poses remain unchanged.

---

# v0.7.1 — larger houses and living water

The latest user request supersedes the old fixed house silhouette requirement. Every active house uses a distinct original 120×96 native cell at 2× world scale, with warm shaded plaster/timber/brick, different tiled roof/gable/chimney combinations, arched door/window details, porch stones, ivy and flowerboxes. Shared collision follows each new alpha silhouette. Retain clear road/door approaches and the approved town palette. No screenshot pixels or exact building layouts are reused.

Hold Axe at its lower handle, blade outward, mirroring hand anchors naturally. Fountain streams fall with foam/spray and spreading stepped basin ripples; river highlights drift in independently phased clusters. Wading reflections remain subdued, inverted and fragmented by the water surface, clipped to water and absent on dry bridge decks or airborne poses. Health and energy use the same cream/olive dimensions and badge design, retaining red/gold fill identities. Direct taps replace the USE control; keep readable sparse hints and crop details clear of the taller meters.

---

# v0.7.0 — reference-inspired garden town

The 2026-10-09 user request authorizes a larger City, redesigned houses and residents at City/Home. Use the seven supplied images for cream stepped sidewalks, muted stone streets, warm plaster/timber cottages with terracotta roofs/arched doors/flowerboxes/ivy, olive canopy borders, a tiered fountain, planted seating, street lamps, garden commons and a small tent/picnic corner. Layout and all original additions are independently authored; never copy screenshots, commercial-game pixels, logo or exact building plans.

Preserve 2× native pixels, useful walking space, clear shop approaches and the original house alpha/collision geometry. Change every existing house alias and shed to the warm building family; City canopy presentation uses existing original olive trees. Eight selected native Pipoya characters provide human residents, modestly muted to fit the palette while preserving their faces and direction cells. Original farmers remain unchanged. Short conversations stay in the shared canvas theme. Restrained stepped warm City lamp filaments/pools at night supersede the earlier no-lamp-halo rule for City only; other locations and Forest lighting are unchanged. This is visual town content, not house upgrades or a relationship system.

---

# v0.6.2 — readable seeds and hand tools

Keep the approved forest, olive foliage, connected mottled soil and cream UI. Inventory seeds use larger cream packets with bold crop-fruit pictures; planted seeds use a short stake with the same emblem, then established growing plant poses. All twelve crop identities stay distinct. Original utility icons use restrained metal/wood/olive pixels. Water/Shovel/Axe attach to the existing four farmer hand anchors, behind the body when facing up, with pivoted pouring/swinging and integer source scale. Farmer sheets remain unchanged.

Tree removal must remove crown, shadow, canopy motion and root mask together. Hand gathering removes the exact clump; planted grass uses the existing responsive native clump renderer and cannot cover water/bridges/roads/solid roots/crop beds. The utility hotbar icon opens themed Gear rather than adding a row of text buttons. See assets/licenses/garden-tools.md for original source provenance.

---

# v0.6.1 — natural soil and a recognizable held tool

Original metal watering-can pixels show an open handle, shaded tank, long spout and perforated rose in the olive/grey palette. HeldWateringCan anchors its handle to the supplied farmer's hand in four facings, with depth behind the up-facing body, scale matching the character and a tilted pouring pose. The HUD uses the same can. Character sheets remain untouched.

Farm soil has broad coordinate-continuous red/brown patches, small clods/pebbles and a soft broken turf fringe; transparent rounded outer corners expose real grass underneath. Neighbouring interiors do not repeat flat tiles or acquire turf seams. Wet soil preserves the same pattern at darker values. Original source in FarmView.js and farm_crop_art.py; user image is material guidance without copying pixels or arrangement. Labelled offline studies: verification/farm-polish; live browser and human acceptance remain pending.

---

# v0.6.0 — connected farm beds and care glyphs

The two supplied Plant Tales screenshots inform red-brown soil, olive crop foliage, connected grass-rimmed beds and cream status bubbles. No screenshot pixels, exact map arrangement or external crop artwork are copied. Original 24×24 soil textures expose jagged turf only on the outer edges; native 24×32 crop poses retain integer 2× display. Wet beds use deeper brown. A blue water drop, red ! and olive basket replace verbose per-cell text. The retained local can sprite tilts above the target while droplets fall.

Eight new original crops and the shovel join the existing local atlas. Original four crop leaf palettes are recoloured to olive; existing licensed scenery/player/animal/font pixels retain provenance and coordinates. No new atlas file, external model or runtime asset family. FarmView draw studies and six selected UI/Farm studies are supplemental, explicitly labelled offline approximations; browser/human acceptance remains pending. Evidence: assets/licenses/free-farming.md and verification/free-farming/README.md.

---

# v0.5.1 readability correction
Cream panels must use actual dark/olive/gold font pixels, with high contrast independent of renderer tint. Intentional cream title/world text remains. Remove 1/2/3 tool-corner badges; preserve small stock counts and selected fills. The Forest-only Map action has a clear short label in the lower hotbar. Clock shows two whole-minute digits; no decimals. Existing shared theme/world art remains.

---

# v0.5.0 shared leaf/parchment interface
Use a restrained cream, muted olive, warm wood and parchment family throughout the canvas interface. Original stepped corners, bevels, small leaf stitches and bitmap glyphs frame compact icon actions. A heart badge/red meter and gold energy meter sit opposite a 12-hour clock/day and coin badge. No upper action row or on-screen Jump button. Bag uses a roomy item grid; map uses a wooden notebook border, discovery hatching, broad grove/soil shapes and actual river silhouettes with a facing arrow. Keep reference-inspired composition without copying reference pixels, UI art, logos, characters or exact layouts. Existing world/farmer pixels retain their separate creators and licences. Text stays brief except necessary care, transaction, confirmation and attribution information. Gameplay/world art is unchanged.

---

# v0.4.9 larger approved forest
Retain the accepted olive canopy/palm/palmetto/grass and moss/red-soil pixels. Slightly thin tree placement (about 16.7% in the old half) while extending twenty connected habitats east at the existing scale. The river reference dated 2026-10-07 18:47:40 guides independently uneven banks, changing channel widths, jagged turf/earth edges and variable sandy pockets. Screenshots supply general style only, not pixels/shapes/layouts. Keep restrained scattered animated reflections, dry roots, clear grass-free decks and water walking. No new pack/pixel asset, road, waterfall, fern or artificial raised bank. Fruit and animal homes stay on dry banks; native Craftpix species only.

---

# v0.4.8 reference forest
Use the five supplied images as visual reference for dense layered olive crowns, fuller palms, olive ink, irregular responsive grass clumps, crisp moss islands, small flowers and warm bare earth. Original native code-authored canopy/palmetto frames supplement retained licensed environment art. Reference assets/pixels/layouts are not extracted. Keep dry roots, clear grassy passages, walkable shores, free jumps and grass-free bridges. No raised banks, roads, waterfalls or teal ferns. Only the five Craftpix animal identities remain. Earlier entries below are historical.

---

# v0.4.7 recognisable asset-based wildlife
Use selected licensed animal silhouettes with integer 2× display, native alpha and per-direction source-pixel ground anchors. Preserve actual pack capabilities: orthogonal walks where supplied; horizontal mirroring and remembered facing for side-only packs; idle loops where no authored walks exist. Retain species warning/health readability and add restrained ground shadows. Match coat identity through orange tiger stripes, ivory/charcoal panda and zebra, spotted tawny hyena, differing big-cat spots/rosettes and readable olive snake/crocodile scales. These are adaptations of credited animal art, not wholly original species illustrations. No change to approved forest/farmer pixels. Fifteen new replacements plus retained Craftpix Boar; six original species remain. Evidence: assets/licenses/wildlife-sprites/SOURCE_RECORD.md and verification/wildlife-sprites.

---

# v0.4.6 unified Forest palette and simpler shores
Remove all raised earth assemblies and teal fern sprites from Forest, as shown in the user's second/third images. Keep natural textured shores, flowers and approved moving grass. Preserve tree species silhouettes while converting Forest foliage to one muted olive family with dark green shadows and yellow-green highlights; bark, fruit and neutral snow retain their original colours. Do not recolour other locations. Reference dated 22:59:17 guides general foliage hue and small broken river reflections, without pixel/asset/layout extraction.

Bridges cross horizontally between dry banks with an opaque short deck, individual native planks, top/bottom rails and end posts. Night shading merges equal-opacity regions to avoid a visible grid on the deck. Retain independent scattered wave timing, quiet small reflection clusters and water walking. Latest request supersedes v0.4.5 artificial earth banks; no replacement raised object is added.

---

# v0.4.5 natural forest shores
The latest user request removes visible Forest dirt roads, waterfalls and the old stone pillars/stairs. Preserve textured moss/flowers and dense moving grass. Keep grassy exploration passages and wooden HOME signs. Add native olive palms and drooping willows, mixed with retained LimeZu broadleaf variants, FreeEnvironment conifers, fruit trees, acacias and bamboo according to habitat. Tree trunks stay on dry land; natural crown overhang is allowed. Entire grass footprints clear bridge decks and water.

River waves scatter across the channel with independent delays, periods and appearances. Ten original low earth banks beside the river have irregular grassy tops, exposed warm soil strata and grassy slope openings. These use source pixel geometry instead of the earlier incorrectly selected stone/wood terrace cells. Jump/collision uses the same stepped front profile. User screenshots guide general material/vegetation density only; no pixels or map layout are copied. Existing external art keeps its separate credits.

---

# v0.4.4 ground and river materials — 2026-10-07
The user approves current trees/tall grass and requests richer ground and a natural river based on three supplied screenshots. Use original code-native pixel materials: coherent moss/shade patches, clustered short blades, low leaf/clover marks, cream flowers, irregular soil grain and scattered path pebbles. Keep low contrast below characters and interaction props. Blend adjoining habitat palettes instead of hard seams. Water uses exposed earth/sand/turf shores, muted submerged stones, shaded shallows, dark blue-green channels and restrained moving reflections. Native 1-pixel marks display at 2× with no blur. References inform material density and depth only; no screenshot pixels, tiles or layouts are extracted. Existing tree/grass packs, stepped cliffs, walkable water and gameplay remain.

---

# v0.4.3 user-authorized farmer/environment replacement
This latest request supersedes the original player-face and blocked-new-pack constraints below. Both playable farmers use Channeechan's native red-haired characters, with source-identical idle/walk poses, native 24×32 trimmed cells and adapted body jump poses. Four-direction keys and displayed scale stay established. Keep original NPCs. Forest uses ToffeeCraft sample conifers with native trunk-aligned bases and broad crowns fading by their actual size; broad firs are occasional. Native-scale boulders, ice and occasional dry plants extend the sample. Preserve broadleaf fruit trees/acacias/bamboo, quiet trails, wildlife identity, responsive original tall grass and jumpable LimeZu terraces. Credits/licence evidence distinguish every family. No source-pack original redistribution; eight-file production allowlist remains.

---

## Current forest growth — 2026-10-07, v0.4.2
Latest user authorizes new farmer/environment assets, dense trees/grass, raised ground and jumping. Supplied replacements cannot be integrated under their current terms (SOURCE_RECORD.md); existing licensed environment and original farmer faces remain. Extend original farmers with native crouch/tucked-knee/landing poses. Use credited native LimeZu cliff faces, stair gaps and stepped low terraces, textured grassy tops, varied tree clusters and original green/dry/snow tall grass. Grass bends locally on contact and springs back after departure. Source scale stays integer; camera tracks ground feet while sprite follows a crisp vertical arc. Waterline hides during flight. Preserve habitat identity, clear trails, fruit/cache/animal routes and quiet UI; no screenshot pixels/layout copied.

## Current asset and water follow-up — 2026-10-07
The user explicitly authorizes the three supplied Craftpix packs, improving river/waterfall art and walkable water; this supersedes earlier no-new-pack and blocked-water restrictions. Audit: native four-direction 32×32 hunt cells at scale 2, selected natural-colour ruins, fixed native plant crops; unchanged farmer faces, pixel font, local-only Phaser canvas shell. Preserve actual species identities and missing-species original art. Colourful plants are scenery. Water has connected bending banks, layered shallow/deep blue, quiet animated currents and original crisp waterfall frames/foam/rock faces. Ankles crop beneath a small pixel ripple while wading; bridge decks suppress the waterline. Water has no new stamina/drowning/swimming rules. Solid scenery and waterfall side rocks remain blocked. Licensing/source evidence is recorded separately; no image-model generation.

# Simple Life art bible — craftsmanship pass

This replaces the previous olive/brown Tiny Town art direction. Milestone 1 only.

## Identity

A bright, lived-in garden settlement: jade and mint foliage, blue water, warm honey plaster, terracotta roofs, indigo shadows and coral flowers. Use the richness and layering of classic 16-bit farming RPGs without copying a commercial game's characters, palette or maps. Plant Tales was a quality/composition reference only.

## Resolution and presentation

- Base terrain: 16×16 source pixels, two world units per source pixel.
- Original farmers: 24×32 frames, feet anchored near the bottom; expressive broad head, separate limbs, farm overalls and distinct hair/clothing.
- Outdoor camera zoom: 1, producing two display pixels per source pixel. A 32-pixel sprite frame is 64 pixels (8.9% of 720); visible character ink is slightly shorter.
- Nearest-neighbour textures, rounded camera position, no antialiasing or runtime remote assets.
- Fullscreen Phaser world plus independent canvas UI. No visible DOM interface.

## Sources

Primary environment: Serene Village revamped 1.9 by LimeZu, CC BY 4.0. Native 16×16 source only. No character/UI pack. Original characters, missing home furniture, farming sprites, bitmap font and UI match the environment's perspective and colours. Kenney artwork is superseded, retained as historical vendor evidence only.

## Drawing rules

Three-quarter top-down view with visible upper surfaces and front faces. Light from upper left; dark plum/blue-green pixel shadows below and right. Selective dark outlines around characters and interactable objects; avoid heavy outlines on ground. Use clustered highlights, not random single-pixel noise. Tile variants should have similar contrast. Dense vegetation borders quieter paths and clear plot approaches. Never obscure interaction destinations permanently.

Objects sort by their feet; tree trunks collide while crowns overlap the player. Near-player crowns soften briefly for readability. Lower leaves and flowers stay below feet. Furniture, roof ridges, windows, porch steps and small props provide scale. Interiors are compact and warm, with a clear bed approach and south doorway.

## Animation

Four walking poses per direction at 8 fps; subtle directional idle breathing/blink. Water 2 fps, leaves gently shift one source pixel, butterflies 5–6 fps. Ripe crops glint. Dust fades quickly; transactions float a coin indicator. Door response is brief. Effects must not change gameplay timing or save data.

## Later work

Preserve source files untouched under vendor, keep derivative outputs under pixel/processed, maintain a reproducible processing script and explicit production allowlist. Credit source creator, licence and adaptations in the game and documentation. Do not mix extra asset families without an audit. All later assets must follow this resolution, lighting, perspective and palette. Keep this pass within existing Home, Farm and City gameplay.

## Stabilization approval
The user approved this style in the final stabilization brief. Do not redesign it. Only facial-pixel corrections were made. Active Milestone 1 locations are Home exterior/interior and Farm; City/economy are deferred by the newer brief.

## Historical foundation repair layout
The 2026-10-06 brief authorizes expanding the furnished interior and adjusting edge paths while preserving art. Interior layout is now 1344×800, with integer-scale tiles and a matching wall border; compact screens scroll instead of shrinking sprites. Context prompts are small strips above the hotbar. No asset-family changes.

## Current compact interior and farm pass — 2026-10-06
The latest brief supersedes the expanded interior. Use a responsive compact room within an 800×480 logical envelope, integer zoom 2, native-scale farmer and scale-2 furniture. Farmer remains 64 display pixels tall indoors and outdoors. Larger furniture and small floor gaps create recognizable sleeping/kitchen/storage groups; desktop sees the room, mobile follows without fractional scaling.

The active field is one joined 4×4 tilled bed, 48 world units per cell with subtle seams and a unified edge. Props stay outside cells. Expansion land is grassy/overgrown, with a nearby contextual wooden sign and no permanent debug labels. Eight original tomato states share outline, lighting and 24×32 source bounds; red ripe fruit contrasts with the olive drooping dry/wilted stages and bare brown dead stalks. Soil darkens when watered. Short soil/water/pickup particles supplement compact action feedback. Silent audio hooks only.

## Paid expansion follow-up — 2026-10-06
The user requested four planting fields matching the original. Each unlocked field repeats its joined 192×192 soil bed, border, northern fence, scarecrow and nearby barrel/flowers/pebble composition. Locked fields remain grassy and carry a compact number/coin label. Additional farms reuse the same authored Farm composition. Existing atlas/lighting/scale/palette remain intact. The first Home junction FARM label is smaller and centered inside its board; the duplicate southern board is removed. No new image/pack/dependency.

## Milestone 2 approved extension — 2026-10-06
City is now authorized. Extend the same native pixel family/palette with original jade/coral awning stalls, readable existing original farmer-derived merchants, quiet stone paving and three distinct crops: low strawberry rosettes with red berries, feathery carrot tops/orange roots and tall corn stalks/yellow cobs. All care states remain distinct. CITY/HOME signs use wood boards, small fitted font and original arrows. Do not redesign Home, the compact interior, fields or existing characters. No new external asset family.

## Shop and day/night follow-up — 2026-10-07
User requested less text and a stronger game presentation. Reuse the original frames/font: compact crop-icon tabs, larger item icon, restrained name/bag/unit-price information, quantity selection and one exact-total action. Move care/description/shop details behind ?. Keep pixel edges and the world visible around the card. World daylight fades through warm sunset and dawn into dark cool moonlight (22% scene remains visible at full night). No artificial lamp/window/player halo or new raster art. Sun/moon HUD masks and daytime-only butterflies reuse original assets. Hide both merchants outside 07:00–20:00.

## Milestone 3 extension — 2026-10-07
One authored woodland with irregular tree clusters, safe quiet entrance, winding path, fruit grove, shrine pond/log landmarks and deeper boar clearing. Reuse the approved native pixel family. Original berry/guava/mango/club/hide/bag/boar/log/stone pixels extend the same atlas; guava/mango trees adapt licensed LimeZu trees with original fruit clusters. Keep 2× source pixels, foot layering and existing farmer eyes. Forest night uses stepped pixel opacity bands around the player while retaining distant darkness; this explicitly supersedes the earlier no-player-halo restriction for Forest only. No new asset pack/font/audio or modern blurred gradient.


2026-10-07 user-authorized large-wilderness follow-up supersedes the one-small-map/one-enemy cap: exactly 20-fold area, distinct stylized habitats with all listed species plus snakes in groups, more fruit, river/bridges/pixel waterfalls, walkable cave chambers and finite guarded treasure. Preserve crisp native pixels, existing farmer faces/canvas shell, local-only runtime, license/AI disclosures, farming/City/sleep/recovery and no-publication obligations. No real-world ecosystem accuracy is claimed for the mixed-climate game map.

## City fountain island follow-up — 2026-10-21

The user-supplied 207×214 island is an approved City exception to the source-art family. Render it at exact 1.35 scale, centered at `(704, 420)` in the main road plaza, with nearest-neighbor filtering and stepped silhouette collision. Its eight-frame 8-fps loop must keep all non-water and the one-pixel stone-rim guard identical and change no more than 3% of the 1,247-pixel animation mask from the source in any frame. Fixed one-pixel stream columns move highlights downward one source row per frame. Landing ripples are compact flattened ellipses with radii 2, 4 and 6 only; large basin arcs/crescents are prohibited. Six fixed glints and bowl/jet shimmer use only the three source water colors. Never alternate the two supplied full sprites as animation frames because their plant, stone and water palettes differ visibly.

## Surface and wardrobe follow-up — 2026-10-23

Road surfaces, ponds, rivers and bridge decks are negative space: do not place tree trunks, rocks, grass clumps, flowers, mushrooms or other scenery on them. Test the visible lower tree trunk and full ground-decoration silhouette rather than relying only on the smaller collision root. Functional roadside signs and services remain reachable, while City uses identity-preserving relocation for saved plants. Placed storage props need visible breathing room; tall grass must not grow through barrels, crates or wells.

Round glasses are no longer part of the clothing-shop or Wardrobe visual catalogue. The remaining Extras are the straw hat and canvas backpack. The temporary startup screen uses the established dark olive, cream and warm-gold pixel palette, then fully disappears before the title becomes interactive.
