# Revised farmer — exact imagegen prompt set

Built-in imagegen; model-version metadata was not exposed. Source outputs were generated before the user approved delivery.

## base

Source: source/base.png

```text
Use case: stylized-concept
Asset type: ORIGINAL Simple Life male farmer, SOUTH idle base, authentic farming-game pixel art inspired broadly by Plant Tales.
Input1 is a proportion/pixel-language reference only: study the narrow adult silhouette, dark small eyes, restrained tiny facial features, simple broad flat clusters. Input2 is muted farming-game palette and low top-down reference only. Create a different original character, not either reference identity. No screenshot pixels, costume or character copied.
Draw ONE slim ADULT male farmer full body looking south in a low top-down / three-quarter farming-game view. Short compact near-black brown hair, NOT large fluffy hair; small modest warm-tan face with two simple tiny dark DOT eyes, no white sclera, no large pupils, no smiley/cute cartoon face. Ivory sleeves rolled to elbows, olive green work trousers/overalls with simple straps, understated dark leather belt detail, brown short work boots. Natural relaxed arms, narrow torso and long trousers, grounded adult stance. Mature quiet appearance, no chibi or child.
Readable at actual game size: 40 logical pixels of visible height, about13–15 logical pixels across shoulders, head including hair ONLY8–9logical rows tall and7–8wide, remaining body31–32rows. Head no wider than shoulders, no giant hair. Anatomical adult body rather than a toy. Hair is one dark mass plus2small highlights, face2skin tones, clothes2–3tones, warm dark edge pixels only where needed.
Render the logical pixel artwork enlarged with NEAREST NEIGHBOUR only. Every pixel is a clearly uniform square on ONE coherent grid. Limit24–32flat muted colours. NO smooth gradients, gloss, painterly noise, many micro-shades, anti-aliasing or high-resolution decoration that disappears at native size. Clean contiguous sprite clusters, expressive silhouette with sparse material detail.
One transparent48×48 logical frame, feet on row44 and hair top row5. True alpha in all empty space including legs. No hat, neckerchief, tool, props, ground, shadow, background, text, labels, grid overlay, multiple views or alternate poses.
```

## front

Source: source/front.png

```text
Use case: identity-preserve
Edit target: the original olive-overall male farmer in the supplied image.
Change ONLY his stance and facial orientation to a TRUE SOUTH / DIRECT FRONT idle. Keep his slim adult body, ivory rolled sleeves, muted olive overalls/belt, short near-black brown hair, tan skin, brown boots and restrained flat pixel clusters.
CRITICAL: both eyes must sit on the FRONT face with equal room from the face edges: two clearly separated dark ONE-LOGICAL-PIXEL dots on the SAME horizontal row, with two skin pixels between them. NO white in eyes. The face must not turn right or left. Show both cheeks symmetrically and chest facing viewer. Hair is compact with fewer chunks, does not cover either eye. Do not enlarge head or eyes.
Both feet are planted side by side at the SAME ground row, no crossed legs, no one boot forward, no walking stance. Both relaxed hands hang beside hips. Same slim ADULT proportions.
Design for40nativepixels visible height inside48×48cell with one consistent square pixel grid; head8–9logicalpixels, torso/legs31–32. Crisp large contiguous pixel clusters,24–32flat muted colours, no smooth gradient or tiny painted texture.
One single full-body front idle. Genuine transparent alpha. No alternate poses, hat, props, tool, shadow, background, grid, frame, text or UI.
```

## idle

Source: source/idle.png

```text
Use case: identity-preserve
Asset type: 4-direction subtle FOUR-FRAME IDLE animation sheet for Simple Life.
Reference image is the revised original male farmer. Preserve his compact near-black brown hair, small dot-eye face, slim adult body, ivory rolled sleeves, olive overalls, small brown belt/buckle and brown boots. Exact same clothes, palette and proportions in EVERY frame. This is original broadly Plant Tales-inspired farming pixel art, not that game's character.
EXACTLY16 full-body sprites in4columns×4rows. TOP row SOUTH directly front with both dark dot eyes; row2 NORTH directly back, no face; row3 WEST profile facesleft; row4 EAST profile facesright. No direction changes within rows.
Four subtle idle phases left to right: 1 relaxed neutral with eyes open; 2 gentle inhale, torso/sleeves shift only ONE logical pixel at most, eyes open; 3 very brief blink (south/profile only) with same body and feet; 4 gentle exhale back toward neutral with eyes open. Head/hair shape and location must stay IDENTICAL through the row. Both boots planted at exact same ground line; no whole-body bouncing, walking feet, wave, dramatic arm motion or facial redesign. Back-row frame3 can keep eyes hidden naturally, never add face.
Logical artwork40visible native pixels tall inside padded64×64cells, body/head scale exactly matching reference, head only8–9native rows, narrow14–16px shoulders, long adult trousers. Feet groundrow52, torso x32. Extra transparent padding is for editing/tool compatibility, not a smaller character. Actual simple coherent square-pixel grid, sparse24–32flat muted colours, clean2–3tone clusters, tiny readable face, no gradient/noise.
True alpha transparency around sprites, between legs and ALL row/column gutters. All16 sprites same exact size. NO background, floor, shadow, hat, neckerchief, tools, props, labels, text, borders, gridlines or UI.
```

## run_east

Source: source/run_east.png

```text
Use case: style-transfer
Asset type: one EIGHT-FRAME EAST-facing running strip for Simple Life.
INPUT1 is the EDIT TARGET and motion guide: eight native game-sprite running poses enlarged with nearest neighbour, arranged left to right in equal cells. Preserve their sequence, full-body joint angles, planted/airborne boot placements, leg exchanges, knee bends and opposed-arm phases. Do NOT replace them with eight similar stretched-stride poses.
INPUT2 is APPEARANCE reference: the revised original olive-overall farmer. Apply THIS identity and clothing to all8 poses: compact near-black brown hair, tiny dark dot-eye face, tan skin, ivory rolled sleeves, muted olive overalls, small brown belt/buckle, brown boots, slim adult body. No red scarf, hat, old teal clothes or redesign. All8 images must match this identity.
Create exactly8poses in ONE horizontal row, all head/body/boots face EAST / RIGHT. Time progresses LEFT to RIGHT. This is an actual loop with alternating near and far legs; one leg must pass UNDER the pelvis, support leg compresses, pushes off, then feet exchange and opposite contact occurs. Distinguish near/far trouser leg with ONE darker shade. Keep knees naturally bent during recovery, no rigid straight-leg scissors and no two-foot ski shuffle.
MATCH the reference motion, including its compact passing and tucked recovery phases. Preserve changing boot silhouettes rather than repeating one wide lunge. Arms oppose the actual forward leg. Mild torso forward lean, natural vertical bob, no jumping high or full-body rotation.
Same body scale every pose,40native-pixel standing equivalent inside64×64padded logicalcells, groundrow52, root x32. Do not enlarge crouched/passing frames to match height. Native artwork uses uniform square grid with readable simple clusters,24–32exact muted flat colours, NO high-res texture, blur, micro-shades or anti-aliasing.
Genuine transparent alpha everywhere outside the sprites. Clear empty gutters separate all8 cells; no overlapping feet or hands between cells. NO motion blur, floor, shadow, labels, text, gridlines, props, tool, weapon, extra rows or extra poses.
```

## run_frontback

Source: source/run_frontback.png

```text
Use case: style-transfer
Asset type: SOUTH/NORTH eight-frame running rows for revised Simple Life farmer.
INPUT1: EDIT TARGET/MOTION GUIDE, two rows of8native poses. Preserve the exact phase ordering, compact passing phases, alternating knees and boots, weight changes and opposed arms. INPUT2: identity reference, revised original farmer.
Create exactly16sprites in8columns×2rows. TOP entire row SOUTH directly front with2tiny dark-dot eyes, front olive bib/brown belt visible. BOTTOM entire row NORTH directly back with no eyes and back of olive straps/belt. Never turn side-facing in either row.
Change the target guide's old appearance to the revised identity: compact near-black brown hair, small tan face, slim adult body, ivory rolled sleeves, muted olive overalls, small brown belt/buckle, short brown boots. No hat, red scarf, old teal clothing or chibi body.
Use the8guide poses, not8variations of one knee-up stance. Both legs exchange roles across the loop: contact, compression, drive/passing, compact recovery/flight, opposite contact, opposite compression, opposite drive/passing, opposite recovery. Keep one darker far-leg shade so leg exchange reads. Arms oppose the forward leg, feet/body move in place with one modest pixel of bob. No identical leg pixels held through whole row, no duplicated single-foot-running loop.
All sprites same scale,40native-pixel standing equivalent inside64×64logical padded cells; rootcentre x32, groundrow52. Do not stretch shorter passing poses. Coherent flat square pixel clusters, matching reference's clear eyes/sleeves/belt/boots, sparse24–32mutedcolours, no gradients/microtexture/anti-alias.
TRUE transparency around every sprite and in ALL gutters. No backdrop, floor, shadow, tool, prop, text, labels, gridline or UI. Exactly8cols2rows.
```

## harvesting

Source: source/harvesting.png

```text
Use case: style-transfer
Asset type: revised farmer HARVESTING animation,24sprites.
INPUT1 is EDIT TARGET and pose guide: preserve its6columns×4rows, every actual whole-body bend/reach/pull/rise motion and feet registration. INPUT2 is the NEW original farmer identity; replace every old farmer with THIS revised identity: compact dark near-black brown hair, tiny dark dot eyes, clear tan face, slim adult body, ivory rolled sleeves, muted olive overalls with brown belt/buckle, brown boots. Same proportions, colours and costume across all24sprites.
Rows exactlySOUTH,NORTH,WEST,EAST. Every west pose facesleft, east facesright; north has no face/eyes. Six phases in eachrow remain ready, lean, crouched reach, pull, rise, recover. Empty hands, no plant/basket/produce painted into frames. Preserve coherent bent knees, continuous connected shoulders/elbows/wrists, planted boots and direction. Do not stretch crouched bodies to standing height.
Same body scale as newidentity:40nativepixels in neutral stand, head8–9pixels, roomy64×64logical frames/rootx32/groundrow52; all body ink safely inside each cell, clear transparent gutters. Genuine simple uniform-grid pixel-art with24–32flat muted colours, crisp contiguous clusters, no gradient/texture/soft anti-aliasing. Human slim proportions, not chibi.
True transparent alpha. No floor, shadows, background, particles, tools, props, target, labels, text, gridlines, UI or extra poses. EXACTLY6columns4rows,24same-farmer poses.
```

## digging

Source: source/digging.png

```text
Use case: style-transfer
Asset type: revised farmer SHOVEL DIGGING animation,24sprites.
INPUT1 EDIT TARGET/pose guide: keep its exact6columns×4rows, ready/raise/press/lever/lift/recover motion, directional facing, boots registration and one consistent shovel. INPUT2 NEW farmer identity: replace ALL old people with this exact revised original farmer: compact near-black brown hair, tiny dark-dot eyes, tan face, slim adult proportions, ivory rolled sleeves, muted olive overalls, visible small brown belt/buckle, brown boots. SAME new proportions and costume across all24frames.
Rows top to bottom SOUTH,NORTH,WEST,EAST. West alwaysfacesleft,east alwaysright,northnever showsface. Preserve continuous hands gripping ONE brown shovel shaft with ONE dull-grey spade blade. No blade changing into axe/hoe, detached tools or extra hands. Preserve the existing actual whole-body lean/press/lever poses and planted feet.
One consistent body scale,40native-pixel standing equivalent, head8–9pixels, inside64×64logical cells/rootx32/groundrow52. Bending shortens the body naturally, not rescaling. Clear transparent gutters and no clipped blade/hand/boot. Coherent square-pixel clusters,24–32flat muted colours, no high-res texture, gradients, blur or anti-aliasing. Readable clear face/sleeves/belt/boots at native scale.
Genuine transparentalpha. No dirt piles, floor, shadows, ground, backdrop, extra tools, plants, particles, labels, text, grid orUI. Exactly6cols4rows,24same-farmer digging poses.
```

## chopping

Source: source/chopping.png

```text
Use case: style-transfer
Asset type: revised farmer AXE CHOPPING sheet,24sprites.
INPUT1 EDIT TARGET/pose guide: preserve exact6columns×4rows and ready/lift/backswing/downwardstrike/follow-through/recover whole-body poses, continuous axe grip and boot ground. INPUT2 NEW farmer identity: replace ALL old characters with this same revised original farmer: compact near-black brown hair, tiny dark-dot eyes, tan face, slim adult body, ivory rolled sleeves, muted olive overalls with small brown belt/buckle, brown boots. No hat/scarf/armour or other weapon.
Rows SOUTH,NORTH,WEST,EAST top to bottom. West facesleft throughout,east facesright,northbackviewnevereyes. Preserve one single wooden-handled dull iron axe and believable two-hand grip throughout6phases. The axe strikes down toward an unseen stump in actual facing direction. No changing blade/duplicateaxe/brokenjoint. Body bends genuinely during strike, no independently displaced arms or stretched bodies.
SAME body scale throughout:40nativepixelstanding equivalent in padded64×64frames, rootx32/groundrow52, compact head8–9pixels. Clear transparent gutters; raised axe and extended blade/boots INSIDE their cells. Crisp coherent square-pixel clusters,24–32flat mutedcolours, clear face/sleeves/belt/boots, no painterly shading/gradients/fuzzy outlines.
Truealpha outside body/tool. No actual tree/stump/target/wood, no dirt/floor/shadow/background, no effects/swingarc/particles, no labels/text/grid/UI. Exactly6cols4rows.
```

## watering

Source: source/watering.png

```text
Use case: style-transfer
Asset type: revised farmer WATERING-CAN sheet,24sprites.
INPUT1 EDIT TARGET/pose guide: keep6columns×4rows and every ready/lift/tilt/pourhold/upright/lower pose, boots grounded and a single wateringcan in continuous hands. INPUT2 is the NEW identity to apply consistently to ALL24poses: compact near-black brown hair, tiny dark doteyes, tan face, slim adult, ivory rolled sleeves, muted olive overalls, small brown belt/buckle, brownboots. No scarf/hat.
Rows SOUTH,NORTH,WEST,EAST. West alwaysfacesleft and spout pointsleft; eastfacesright/spoutright. South facesviewer withboth tiny eyes; north onlybackhead, can correctly partly hidden. Keep one same muted galvanised grey-green can with one body, top handle and narrow side spout. Hands neverdetach; no changing tool/duplicatecan/extra hands. No drops or stream painted into sheet.
One body scale,40nativepixelstanding equivalent, smallhead8–9pixels, padded64×64logical cells/rootx32/groundrow52. No perpose stretching; clear transparent margins and gutters, no clipped hand/can/foot. Clean simple coherent squarepixelclusters with24–32flat mutedcolours, no microtexture/gradient/softantialias. Readable native face, ivory sleeves, belt and boots.
Truealpha outside body/can. No plant, target, ground, floor, shadow, scenery, particles, label,text,gridline,UI or additional poses. Exactly6columns4rows.
```

## attack

Source: source/attack.png

```text
Use case: style-transfer
Asset type: revised original farmer EXISTING-AXE ATTACK sheet,24sprites.
INPUT1 EDIT TARGET: native6columns×4rows axeattack sheet, preserve exact pose order, direction and continuous axe grip. INPUT2 NEW farmer identity to apply to every pose: compact near-black brown hair, tiny darkdot eyes, clear tan face, slim adult, ivory rolled sleeves, muted olive overalls with small brown belt/buckle, brown boots. Same newidentity proportions/colours/clothes in ALL24sprites. Repaint pixel artwork to the new identity; do not leave old farmer faces or costumes.
Rows top to bottom SOUTH,NORTH,WEST,EAST. SOUTH all6poses face directly towardviewer/both eyes visible. NORTH all6 show onlyBACK of hair/overalls, NOface. WEST all6 faceleft and strikeleft, EAST all6 faceright and strikeright. DO NOT turn or reverse directions during a row.
Six phases left to right: ready, shoulder draw-back, windup, torso-height forward strike, follow-through, recover. Preserve actual full-body stance/arms/axe angles from target guide, no swapping direction. One small brown wooden handle and dull-grey ironaxehead; joined continuous handgrip, no duplicate axe, sword or new weapon. No actual target/animal/blood.
One body scale matching newidentity:40nativepixelstanding equivalent, head8–9pixels, roomy64×64logicalcells/rootx32/groundrow52. No perframe enlargement, bodies never squash. Entire raised/extended axe safely inside owncell; clear transparent gutters. Simple coherent squarepixelclusters,24–32flat mutedcolours, no highresolution texture/gradients/blur/antialias.
Genuinealpha around allbody/toolpixels. No shadows, floor, background, arcs, effects, text, labels, grid,UI or extra poses. Exactly6columns4rows.
```
