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
