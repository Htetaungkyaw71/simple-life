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
