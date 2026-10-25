# Approved farmer — animation prompts

Built-in OpenAI imagegen, 2026-10-14. Source identity is the farmer approved in this chat. Each action was generated separately with that identity and the three-direction idle guide as references. A chopping connection failure was retried with the same prompt. The first running sheet already had alpha; its brown appearance in the tool preview led to a redundant transparency revision. The revised PNG is selected and disclosed. Attack front/back was regenerated, and west attack is a mirrored authored east strip because the first west strip turned east.

## idle3

Use case: identity-preserve
Asset type: directional idle sprite sheet for Simple Life.
Input image 1: the APPROVED male farmer identity and pixel-art style. Keep his exact small-head slim adult proportions, short dark brown hair, warm tan skin, muted ivory rolled sleeves, olive overalls with simple straps and brown boots. No neckerchief, no hat, no redesign.
Primary request: create the THREE remaining idle directions, one pose each, as a single row with exactly THREE equal cells: column 1 NORTH (back of head and back of overalls only), column 2 WEST (entire body faces left), column 3 EAST (entire body faces right). All are the same farmer at the same height, relaxed arms, both boots planted.
Composition: a wide transparent sheet with 3 equal square cells. Logical cell size 48×48, approximately 30 logical pixels of visible standing character height, small head about 7–8 pixels tall, feet at logical row40 and torso centred x24. Clear transparent gutters around every cell and at least six logical pixels around the character. A coherent square pixel grid with simple contiguous clusters and sparse muted shading. Low top-down game perspective.
Constraints: actual alpha transparency. No south pose, extra poses, animation, shadows, ground, text, labels, grid lines, scenery, props, weapons or UI. Keep front-view identity unchanged when rotating; the north pose cannot show eyes or front bib pocket. Render an enlarged nearest-neighbour view of authentic low-resolution pixel art, no high-resolution painted texture, no anti-aliasing, no oversized head.

Generated source: `/Users/mac/.codex/generated_images/01a13658-7915-78f2-9b49-92222fd48878/exec-bd1660f3-3860-448e-a840-3bc99a860269.png`

## running

Use case: identity-preserve
Asset type: complete four-direction running sprite sheet for Simple Life.
References: image1 is approved male farmer identity; image2 is his approved-style north/west/east idle reference. Preserve slim adult anatomy, small head, short brown hair, tan skin, ivory rolled sleeves, muted olive overalls and dark brown boots. No hat, neckerchief, redesign or added accessories.
Create EXACTLY 32 full-body running poses on a transparent regular grid of 8 columns ×4 rows. ROW1 SOUTH (face and front bib visible), ROW2 NORTH (back of head and back overalls only), ROW3 WEST (head, torso and feet face left in ALL eight cells), ROW4 EAST (face right in ALL eight cells). Time progresses left to right; directions never turn during a row.
Author a clean looping eight-frame RUN cycle, distinct actual arm and leg poses: 1 left foot forward/right foot back contact; 2 weight absorbs onto left leg; 3 legs pass under hips and opposite arm swings; 4 left leg pushes off/right knee advances; 5 opposite right-foot contact; 6 right-leg weight absorption; 7 opposite passing pose; 8 right-leg push-off/left knee advances to frame1. Slight forward lean and modest one-pixel bob, natural opposed arms, readable boot separation. The last pose transitions smoothly to first. No walking-only repetition, sliding unchanged legs, duplicated poses, limb cutouts or frame-by-frame size drift.
Logical cell48×48, standing body about30 native pixels tall, head7–8pixels. Keep same body scale in every cell; stable torso x24 and feet ground row40, movement in place without translation. Clear transparent gutters between ALL cells. Body and boots are not clipped. Large simple contiguous square pixel clusters, restrained 2–3tone shading and low top-down game perspective, intended native low-resolution game sprites.
Constraints: true alpha transparency, no shadows, floor, labels, text, grid lines, scenery, tools, weapons, props, effects or UI. Exactly8poses per row and4rows. Show genuine running limb changes using the same farmer's identity.

Generated source: `/Users/mac/.codex/generated_images/01a13658-7915-78f2-9b49-92222fd48878/exec-2474f582-6a8d-4632-910a-28f1d98eeadc.png`

## running_alpha

Use case: background-extraction
Edit target: the supplied 8-column ×4-row farmer running sprite sheet.
Remove ONLY the entire brown painted background behind and between every character, making all empty pixels genuine fully transparent alpha. Preserve every pixel of all32 farmer poses, their small dark outlines, hair, skin, ivory shirts, olive overalls, brown boots, pose geometry and exact existing sheet layout. Transparent holes between hands and torso and between legs too. Do not repaint the farmer, change poses, simplify or add shadows. The output must have actual PNG transparency, not a brown or checkerboard background. Keep32poses on exactly8columns4rows, with clear transparent gutters. No text or UI.

Generated source: `/Users/mac/.codex/generated_images/01a13658-7915-78f2-9b49-92222fd48878/exec-cfbb4b10-a5af-441c-b3e8-cea4faed8df3.png`

## harvesting

Use case: identity-preserve
Asset type: four-direction bare-hand harvesting sprite sheet for Simple Life.
References: image1 approved farmer front identity; image2 same farmer's directional idle guide. Preserve this exact slim adult, small head, short dark brown hair, tan skin, ivory rolled sleeves, MUTED OLIVE overalls, brown boots. No redesign, hat, neckerchief or added accessories.
Create EXACTLY24 full-body poses on a regular grid6columns×4rows. Rows top to bottom: SOUTH, NORTH, WEST, EAST. All six poses in a row KEEP the same body facing, west left and east right; north back-of-head with no eyes. Time advances left to right.
Six-frame HARVESTING action: 1 standing ready arms relaxed; 2 knees soften and torso leans toward a low crop in front of the feet; 3 crouched reach with both hands down/forward; 4 hands close and pull upward toward waist; 5 rising with hands near torso; 6 return to neutral standing. Real bent knees, joined joints and arm changes, no broken elbows or stretched hands. Hands are EMPTY: do not paint a plant, produce, basket, dirt or target into the sprite. The harvested item will be separate game art.
Every logical cell48×48. Neutral body approximately30native pixels tall, head7–8px. SAME shared body scale throughout; bent poses genuinely shorten rather than being enlarged. Stable torso centre x24 and planted boots ground row40. Keep all ink safely inside each cell with transparent gutters. Low top-down perspective and simple large crisp pixel clusters, muted 2–3shade materials, matching identity reference.
TRUE transparent alpha across all empty sheet area. No text, labels, gridlines, background, ground, shadows, particles, tools, props, UI or extra pose. Exactly6cols4rows, one consistent character.

Generated source: `/Users/mac/.codex/generated_images/01a13658-7915-78f2-9b49-92222fd48878/exec-2f9f66dc-760f-4b4a-aa90-daffe59ac8a7.png`

## digging

Use case: identity-preserve
Asset type: four-direction shovel digging animation sprite sheet.
References: image1 approved farmer front; image2 directional guide. Preserve exact short brown hair, small adult head, slim body, tan skin, ivory rolled-sleeve shirt, muted olive overalls, brown boots. No neckerchief or hat.
Create EXACTLY24 full-body poses in6columns×4rows. Row1SOUTH; row2NORTH; row3WEST faces LEFT in all6poses; row4EAST facesRIGHT in all6poses. Do not turn the body within a row. Same low top-down perspective.
Six-phase digging action, left to right: 1 ready holding a SMALL brown-handled iron shovel upright in front; 2 both hands lift/reposition handle; 3 body leans forward as shovel blade presses down just in front of boots; 4 knees bend slightly and hands lever handle; 5 lift/recover shovel with empty blade; 6 upright ready again. Both hands must maintain one continuous grip on the SAME shovel: straight brown shaft and one small dull grey spade blade. No hoe, second tool, extra shaft, changing blade, weapon or disconnected grip. West/east tool extends toward actual facing direction; north tool is beyond torso and can be partly occluded correctly.
Each logical cell48×48. Standing body approx30logical pixels high, head7–8px, stable torso centrex24 and feet groundrow40. Use ONE body scale per whole sheet; bending shortens the silhouette. Tool and hands must remain entirely inside their own cell, with6logical-pixel empty outer gutters. Clear transparent row/column gutters. Original simple contiguous square pixel clusters and muted2–3tone shading matching reference.
TRUE alpha transparency everywhere outside sprites and tools, no scenery, ground, dirt mound, soil, shadow, labels, text, grid, particles or UI. Exactly6cols4rows, no extra character or alternate identity.

Generated source: `/Users/mac/.codex/generated_images/01a13658-7915-78f2-9b49-92222fd48878/exec-7150f67e-2dd1-44a8-8f92-b024dba341e9.png`

## chopping

Use case: identity-preserve
Asset type: four-direction wood-chopping axe sprite sheet for Simple Life.
References image1 approved farmer identity; image2 directional idle guide. Preserve short brown hair, small head, slim adult proportions, tan skin, ivory rolled sleeves, muted olive overalls, brown boots. No redesign, hat or neckerchief.
EXACTLY24 full-body chopping poses in6equalcolumns×4equalrows. Row1SOUTH, row2NORTH, row3WEST all facesLEFT, row4EAST all facesRIGHT. No body turns to other directions. Same low top-down game angle, time progresses left to right.
Six-frame controlled CHOPPING action: 1 ready holding one small axe with both hands near waist; 2 lift axe above shoulder while remaining grounded; 3 apex of backswing; 4 powerful diagonal downward strike toward an unseen low stump IN FRONT of the farmer; 5 low follow-through with bent torso; 6 recovery to ready. Clear different arm, torso and axe angle in every phase. Feet planted throughout, small weight shift. A single consistent axe: one brown wooden handle and one small dull grey iron head; continuous joined hand grip. West strike reaches left, east strike right, north strike forward away from viewer.
Logical cells48×48, standing body30px tall/head7–8px at one consistent scale. Stable torso x24 and boots on groundrow40; crouching lowers head. Raised axe must fit with ample transparent top gutter; all ink fits inside each cell. Crisp square pixel clusters with muted sparse2–3tone shading, not detailed painting.
Genuine transparent alpha outside every body/tool, empty clear gutters between ALL cells. NO tree, stump, wood, target, ground, shadow, swing arc, sparks, text, labels, grid, extra tool, other weapon or UI. Exactly6cols4rows.

Generated source: `/Users/mac/.codex/generated_images/01a13658-7915-78f2-9b49-92222fd48878/exec-0bac693b-3fdc-4258-b9d0-a454544009fc.png`

## watering

Use case: identity-preserve
Asset type: four-direction watering-can action sprite sheet for Simple Life.
References image1 approved farmer identity; image2 his directional idle guide. Preserve small head, slim adult body, short dark brown hair, warm tan skin, muted ivory rolled sleeves, olive overalls and brown boots. No hat, neckerchief or redesign.
Create EXACTLY24 whole-body poses in6equalcolumns×4equalrows. ROW1SOUTH, ROW2NORTH, ROW3WEST alwaysfacesLEFT, ROW4EAST alwaysfacesRIGHT. Direction fixed throughout each row. All poses same low top-down perspective, time left to right.
Six-phase WATERING action: 1 ready holding ONE small muted galvanized grey-green watering can low by top handle; 2 raise can toward a target immediately ahead; 3 tilt can's spout forward/down; 4 hold a stronger pour tilt with both hands supporting handle/body; 5 bring can back upright; 6 lower can to ready. Keep feet planted, modest forward lean, distinct believable arm/hand changes. The SAME single can in each frame has one rounded rectangular body, one continuous top handle and one small narrow side spout. Spout points toward facing direction: LEFT for west, RIGHT for east, DOWN toward viewer for south, UP/away for north. North head/body remain back-facing and can may be correctly partly occluded by body. Hands remain joined to can, no floating handle, duplicates or tool substitutions. NO water drops/stream; those are separate game effects.
Every logical cell48×48, neutral standing bodyapprox30pixels tall, head7–8pixels, SAME scale throughout. Stable torso centrex24 and boots groundrow40, can entirely inside cell with transparent outer margin. Clear gutters separating all cells. Crisp SIMPLE contiguous square pixel clusters, muted2–3tone shading per material, no high-res texture.
Genuine transparent alpha around bodies/tools, no floor, shadow, crops, target, text, labels, gridlines, particles, UI or other props. Exactly6columns4rows.

Generated source: `/Users/mac/.codex/generated_images/01a13658-7915-78f2-9b49-92222fd48878/exec-b5eef17d-91b9-4503-a3d3-be0dc1e0f9dd.png`

## attack

Use case: identity-preserve
Asset type: four-direction existing-axe attack animation sprite sheet for Simple Life.
References image1 approved male farmer identity; image2 his directional guide. Preserve exact slim adult body, small head, short dark brown hair, tan skin, ivory rolled sleeves, muted olive overalls and brown boots. No redesign, hat, neckerchief or armour.
Create EXACTLY24 full-body poses in6equalcolumns×4equalrows. Row1SOUTH, row2NORTH (back view), row3WEST all body/face/boots faceLEFT, row4EAST all faceRIGHT. Do not reverse or turn direction mid-row. Same low top-down perspective. Time progresses left to right.
Six-phase AXE ATTACK toward an unseen animal/target at torso height: 1 ready grip axe near waist; 2 draw one small axe back beside shoulder; 3 windup with slight torso twist while head remains facing target; 4 fast diagonal forward/outward strike at chest/waist height, arm extended; 5 follow-through with a small forward weight shift; 6 recover to ready. This is a forward torso-height combat swing, distinct from downward wood chopping. Feet stay grounded, no leap or full spin. One consistent brown wooden handle with a small dull-grey iron head, joined grip with believable hand anatomy, no second axe or detached blade.
Each logical frame48×48. Samebody scale throughout: standing30nativepixels, head7–8pixels. Torso centredx24, boots groundrow40. Extended axe/hands and raised blade entirely INSIDE each cell, sixlogicalpixel transparent margin and clear row/column gutters. Simple crisp square pixel clusters and restrained muted2–3tone materials matching approved identity.
Genuine transparent alpha. NO visible animal, blood, target, impact effects, swing arcs, sparks, shadows, floor, background, labels, text, gridlines, UI, sword, other weapons or armour. Exactly6cols4rows.

Generated source: `/Users/mac/.codex/generated_images/01a13658-7915-78f2-9b49-92222fd48878/exec-b503f914-f80f-48a5-82bf-943d834fc7e6.png`

## attack_frontback

Use case: identity-preserve
Asset type: corrected SOUTH and NORTH farmer axe-attack sprite strips, ONLY two rows.
Reference image1: approved farmer front identity. Reference image2: previous attack sheet for axe shape/action only; its front/back turn sideways during strike and MUST be corrected.
Create EXACTLY12poses in6columns×2rows, genuine transparent background. TOP ROW ALL SIX poses face SOUTH directly toward viewer: face has BOTH eyes, front bib and chest remain visible even during contact. BOTTOM ROW ALL SIX poses face NORTH directly away from viewer: only BACK of brown head and back overalls, NO face, NO visible eyes, NO side profile, including frames4and5. No side view whatsoever.
The same slim adult male farmer, small head, short brown hair, tan skin, ivory rolled sleeves, muted olive overalls and brown boots as approved. Stable full body and exact same scale across all twelve poses.
Six-phase single small axe attack at waist/torso height: ready near waist, backswing by one shoulder, stronger windup, forward strike toward camera for SOUTH/away from camera for NORTH, follow-through, recovery. Keep torso/face forward or back throughout, only arms and slight weight shift move. Axe can foreshorten toward viewer/away; DO NOT rotate the whole body sideways to show the axe. Both feet grounded.
Logical frames48×48, standing body30pixels, head7–8pixels, boots groundrow40, centrex24. Clear transparent gutters; all body and axe ink inside each cell. SAME single brown wooden-handled grey iron axe, joined continuous hand grip; no sword, new weapon, two axes, extra hands. Simple crisp muted square pixel clusters matching original, no painted texture.
No target, creature, blood, arcs, particles, shadow, ground, backdrop, labels, text, grid, UI, third row or extra poses. EXACTLY6columns2rows, only directly front and directly back directions.

Generated source: `/Users/mac/.codex/generated_images/01a13658-7915-78f2-9b49-92222fd48878/exec-72054459-19eb-40b1-b84c-9e7885cc1246.png`

