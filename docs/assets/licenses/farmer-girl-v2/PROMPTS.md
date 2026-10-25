# Female farmer v2 — exact imagegen prompts

Built-in imagegen; model-version metadata was not exposed. Ten initial outputs plus one targeted idle-eye edit.

## base

```text
Use case: style-transfer
Asset type: ORIGINAL female farmer identity reference for Simple Life, matching the approved male farmer precisely in body size, proportions, square-pixel density, clothing materials and muted palette.
INPUT1 is STYLE/PROPORTION reference, the current approved male: small head, slim adult body, long trousers, ivory rolled sleeves, olive overalls, brown belt and brown short boots. INPUT2 is FEMALE IDENTITY cue only: warm brown hair gathered into a modest low ponytail, tan skin. Redesign that female cue to match INPUT1's much clearer pixel clusters and restrained proportions. Do not copy its old tiny resolution or large hair/head.
Draw exactly FOUR full-body neutral views in ONE HORIZONTAL ROW in equal padded square cells: SOUTH direct front, NORTH direct back, WEST left profile, EAST right profile. Both feet planted at same ground line, arms relaxed beside hips, empty hands. Front has TWO tiny separated dark ONE-logical-pixel eyes with skin between them on the SAME row, no white sclera, no anime eyes or large pupils. The small face and brown hair cap must not be wider than shoulders. Slim ADULT woman, practical worker, not chibi/child, no skirt or exaggerated anatomy. Keep female identity by the short low ponytail and understated side part, not a giant head.
Same exact costume as male: ivory rolled sleeves, muted olive green overalls/trousers, small dark brown belt and buckle, simple brown work boots. Brown ponytail about4-5logicalpixels long, behind neck, safely separated from arm silhouette. Hair head cap about8-9logicalrows, overall neutral standing body40logicalpixels tall including hair and boots, shoulders14-16logicalpixels wide. Four64x64logical padded frames, root x32, boot ground row56. Ponytail must not change body size.
Render logical pixel art enlarged NEAREST NEIGHBOUR with ONE UNIFORM square pixel grid.24-32flat muted colours, broad contiguous2-3tone clusters per material, warm dark edge pixels. No detailed painted microtexture, gradients, anti-aliasing, glossy lighting or smooth high-res render.
Genuine transparent alpha throughout empty space/gutters and between legs. No background, ground, shadow, hat, scarf, props, tools, weapons, labels, text, gridlines, UI or extra poses. Exactly4views in1row.
```

## idle

```text
Use case: style-transfer
Asset type: female farmer game animation, matching the approved Simple Life male farmer style and movement.
INPUT1 is the EDIT TARGET and EXACT WHOLE-BODY POSE/TIMING GUIDE. INPUT2 is the NEW FEMALE IDENTITY reference. Replace the male in every target pose with this same slim adult woman: warm brown side-parted hair tied into a modest low ponytail, small tan face with tiny dark-dot eyes, ivory rolled sleeves, muted olive overalls/trousers, brown belt/buckle and brown short boots. Keep her identity/pony tail/costume/palette consistent in every phase. Preserve input1's joint angles, planted/airborne boots, lean/reach, phase ordering and tool geometry. Do not make a new gait. Female body height and shoulder/head size match the male guide, not a larger doll head. No white sclera or large eyes. Front shows BOTH separated tiny dark eyes; north never shows a face. Hair doesn't obscure either front eye.
Same body scale in every frame: about40native standing pixels inside64x64logical padded cells, ground56, rootx32. Preserve natural shortened crouched poses; never resize each frame to equal ink height. Coherent square-pixel grid, simple flat2-3tone contiguous clusters/material,24-32muted colours, warm dark edges, enlarged NEAREST NEIGHBOUR. No smooth gradients, painterly texture, micro-shades, gloss or antialiasing. True alpha transparency around every sprite and all row/column gutters, no overlapping cells. No floor, shadows, background, labels, text, gridlines or UI.
Create EXACTLY16sprites in4columns x4rows. Rows SOUTH,NORTH,WEST,EAST. Columns neutral open eyes, subtle inhale/open eyes, brief blink, exhale/open eyes. Both boots planted on the same groundline in all4, unchanged head/hair registration; only1pixel breathing at most. Empty hands, no tool/prop. Preserve all4male guide poses and only change the identity. Modest ponytail remains stable.
```

## run_east

```text
Use case: style-transfer
Asset type: female farmer game animation, matching the approved Simple Life male farmer style and movement.
INPUT1 is the EDIT TARGET and EXACT WHOLE-BODY POSE/TIMING GUIDE. INPUT2 is the NEW FEMALE IDENTITY reference. Replace the male in every target pose with this same slim adult woman: warm brown side-parted hair tied into a modest low ponytail, small tan face with tiny dark-dot eyes, ivory rolled sleeves, muted olive overalls/trousers, brown belt/buckle and brown short boots. Keep her identity/pony tail/costume/palette consistent in every phase. Preserve input1's joint angles, planted/airborne boots, lean/reach, phase ordering and tool geometry. Do not make a new gait. Female body height and shoulder/head size match the male guide, not a larger doll head. No white sclera or large eyes. Front shows BOTH separated tiny dark eyes; north never shows a face. Hair doesn't obscure either front eye.
Same body scale in every frame: about40native standing pixels inside64x64logical padded cells, ground56, rootx32. Preserve natural shortened crouched poses; never resize each frame to equal ink height. Coherent square-pixel grid, simple flat2-3tone contiguous clusters/material,24-32muted colours, warm dark edges, enlarged NEAREST NEIGHBOUR. No smooth gradients, painterly texture, micro-shades, gloss or antialiasing. True alpha transparency around every sprite and all row/column gutters, no overlapping cells. No floor, shadows, background, labels, text, gridlines or UI.
Create EXACTLY8sprites in ONE HORIZONTAL ROW, all EAST/RIGHT-facing. The eight male running guide poses are the exact target. Same compact recovery/passing legs, bent knees, boot exchange, opposed arms, modest forward lean and grounded support phases. Do not repeat8wide-stride scissors, no straight stiff ski shuffle. Keep same phase order. Ponytail may trail1pixel with motion; no giant flapping hair. Empty hands; no tools, extra rows/poses or props.
```

## run_frontback

```text
Use case: style-transfer
Asset type: female farmer game animation, matching the approved Simple Life male farmer style and movement.
INPUT1 is the EDIT TARGET and EXACT WHOLE-BODY POSE/TIMING GUIDE. INPUT2 is the NEW FEMALE IDENTITY reference. Replace the male in every target pose with this same slim adult woman: warm brown side-parted hair tied into a modest low ponytail, small tan face with tiny dark-dot eyes, ivory rolled sleeves, muted olive overalls/trousers, brown belt/buckle and brown short boots. Keep her identity/pony tail/costume/palette consistent in every phase. Preserve input1's joint angles, planted/airborne boots, lean/reach, phase ordering and tool geometry. Do not make a new gait. Female body height and shoulder/head size match the male guide, not a larger doll head. No white sclera or large eyes. Front shows BOTH separated tiny dark eyes; north never shows a face. Hair doesn't obscure either front eye.
Same body scale in every frame: about40native standing pixels inside64x64logical padded cells, ground56, rootx32. Preserve natural shortened crouched poses; never resize each frame to equal ink height. Coherent square-pixel grid, simple flat2-3tone contiguous clusters/material,24-32muted colours, warm dark edges, enlarged NEAREST NEIGHBOUR. No smooth gradients, painterly texture, micro-shades, gloss or antialiasing. True alpha transparency around every sprite and all row/column gutters, no overlapping cells. No floor, shadows, background, labels, text, gridlines or UI.
Create EXACTLY16sprites in8columns x2rows: top SOUTH/front, bottom NORTH/back. Preserve all8guide run phases and their alternating leg/arm exchanges; natural compact passing, compression and recovery. Same scale without stretching passing poses. Front has two tiny dark-dot eyes and front bib, back only ponytail/back straps no face. Empty hands, no tool/prop or extra poses.
```

## harvesting

```text
Use case: style-transfer
Asset type: female farmer game animation, matching the approved Simple Life male farmer style and movement.
INPUT1 is the EDIT TARGET and EXACT WHOLE-BODY POSE/TIMING GUIDE. INPUT2 is the NEW FEMALE IDENTITY reference. Replace the male in every target pose with this same slim adult woman: warm brown side-parted hair tied into a modest low ponytail, small tan face with tiny dark-dot eyes, ivory rolled sleeves, muted olive overalls/trousers, brown belt/buckle and brown short boots. Keep her identity/pony tail/costume/palette consistent in every phase. Preserve input1's joint angles, planted/airborne boots, lean/reach, phase ordering and tool geometry. Do not make a new gait. Female body height and shoulder/head size match the male guide, not a larger doll head. No white sclera or large eyes. Front shows BOTH separated tiny dark eyes; north never shows a face. Hair doesn't obscure either front eye.
Same body scale in every frame: about40native standing pixels inside64x64logical padded cells, ground56, rootx32. Preserve natural shortened crouched poses; never resize each frame to equal ink height. Coherent square-pixel grid, simple flat2-3tone contiguous clusters/material,24-32muted colours, warm dark edges, enlarged NEAREST NEIGHBOUR. No smooth gradients, painterly texture, micro-shades, gloss or antialiasing. True alpha transparency around every sprite and all row/column gutters, no overlapping cells. No floor, shadows, background, labels, text, gridlines or UI.
Create EXACTLY24sprites in6columns x4rows. Rows SOUTH/front,NORTH/back,WEST/left,EAST/right. HARVESTING: six phases ready, lean, low crouched empty-handed reach, pull, rise, recover. Keep hands EMPTY. No crop, basket, produce or invented prop. Preserve all24 guide poses and directions; do not omit or repeat a phase. Low ponytail safely clears tools and limb silhouettes.
```

## digging

```text
Use case: style-transfer
Asset type: female farmer game animation, matching the approved Simple Life male farmer style and movement.
INPUT1 is the EDIT TARGET and EXACT WHOLE-BODY POSE/TIMING GUIDE. INPUT2 is the NEW FEMALE IDENTITY reference. Replace the male in every target pose with this same slim adult woman: warm brown side-parted hair tied into a modest low ponytail, small tan face with tiny dark-dot eyes, ivory rolled sleeves, muted olive overalls/trousers, brown belt/buckle and brown short boots. Keep her identity/pony tail/costume/palette consistent in every phase. Preserve input1's joint angles, planted/airborne boots, lean/reach, phase ordering and tool geometry. Do not make a new gait. Female body height and shoulder/head size match the male guide, not a larger doll head. No white sclera or large eyes. Front shows BOTH separated tiny dark eyes; north never shows a face. Hair doesn't obscure either front eye.
Same body scale in every frame: about40native standing pixels inside64x64logical padded cells, ground56, rootx32. Preserve natural shortened crouched poses; never resize each frame to equal ink height. Coherent square-pixel grid, simple flat2-3tone contiguous clusters/material,24-32muted colours, warm dark edges, enlarged NEAREST NEIGHBOUR. No smooth gradients, painterly texture, micro-shades, gloss or antialiasing. True alpha transparency around every sprite and all row/column gutters, no overlapping cells. No floor, shadows, background, labels, text, gridlines or UI.
Create EXACTLY24sprites in6columns x4rows. Rows SOUTH/front,NORTH/back,WEST/left,EAST/right. DIGGING: six phases ready, grip/lift, drive shovel blade down with bent knees, lever/lift, rise, recover. Preserve the existing warm-brown shaft and muted grey pointed steel spade IN THE FRAME, held continuously in the hands; no new shovel design. Preserve all24 guide poses and directions; do not omit or repeat a phase. Low ponytail safely clears tools and limb silhouettes.
```

## chopping

```text
Use case: style-transfer
Asset type: female farmer game animation, matching the approved Simple Life male farmer style and movement.
INPUT1 is the EDIT TARGET and EXACT WHOLE-BODY POSE/TIMING GUIDE. INPUT2 is the NEW FEMALE IDENTITY reference. Replace the male in every target pose with this same slim adult woman: warm brown side-parted hair tied into a modest low ponytail, small tan face with tiny dark-dot eyes, ivory rolled sleeves, muted olive overalls/trousers, brown belt/buckle and brown short boots. Keep her identity/pony tail/costume/palette consistent in every phase. Preserve input1's joint angles, planted/airborne boots, lean/reach, phase ordering and tool geometry. Do not make a new gait. Female body height and shoulder/head size match the male guide, not a larger doll head. No white sclera or large eyes. Front shows BOTH separated tiny dark eyes; north never shows a face. Hair doesn't obscure either front eye.
Same body scale in every frame: about40native standing pixels inside64x64logical padded cells, ground56, rootx32. Preserve natural shortened crouched poses; never resize each frame to equal ink height. Coherent square-pixel grid, simple flat2-3tone contiguous clusters/material,24-32muted colours, warm dark edges, enlarged NEAREST NEIGHBOUR. No smooth gradients, painterly texture, micro-shades, gloss or antialiasing. True alpha transparency around every sprite and all row/column gutters, no overlapping cells. No floor, shadows, background, labels, text, gridlines or UI.
Create EXACTLY24sprites in6columns x4rows. Rows SOUTH/front,NORTH/back,WEST/left,EAST/right. CHOPPING: six phases ready, windup, axe raised above head, downward cut with connected hands/arms, low follow-through, recovery. Preserve the existing warm-brown handle and small subdued steel axe blade IN EVERY applicable guide frame. Exactly one axe per character, no detached floating blade/duplicate shaft. Preserve all24 guide poses and directions; do not omit or repeat a phase. Low ponytail safely clears tools and limb silhouettes.
```

## watering

```text
Use case: style-transfer
Asset type: female farmer game animation, matching the approved Simple Life male farmer style and movement.
INPUT1 is the EDIT TARGET and EXACT WHOLE-BODY POSE/TIMING GUIDE. INPUT2 is the NEW FEMALE IDENTITY reference. Replace the male in every target pose with this same slim adult woman: warm brown side-parted hair tied into a modest low ponytail, small tan face with tiny dark-dot eyes, ivory rolled sleeves, muted olive overalls/trousers, brown belt/buckle and brown short boots. Keep her identity/pony tail/costume/palette consistent in every phase. Preserve input1's joint angles, planted/airborne boots, lean/reach, phase ordering and tool geometry. Do not make a new gait. Female body height and shoulder/head size match the male guide, not a larger doll head. No white sclera or large eyes. Front shows BOTH separated tiny dark eyes; north never shows a face. Hair doesn't obscure either front eye.
Same body scale in every frame: about40native standing pixels inside64x64logical padded cells, ground56, rootx32. Preserve natural shortened crouched poses; never resize each frame to equal ink height. Coherent square-pixel grid, simple flat2-3tone contiguous clusters/material,24-32muted colours, warm dark edges, enlarged NEAREST NEIGHBOUR. No smooth gradients, painterly texture, micro-shades, gloss or antialiasing. True alpha transparency around every sprite and all row/column gutters, no overlapping cells. No floor, shadows, background, labels, text, gridlines or UI.
Create EXACTLY24sprites in6columns x4rows. Rows SOUTH/front,NORTH/back,WEST/left,EAST/right. WATERING: six phases ready, grip/lift can, tilt/pour, hold/finish pour, lower, recover. Preserve the existing muted grey-green metal can and short spout IN THE FRAME, connected to the gripping hands. No droplets, water effects or ground; game draws them. Preserve all24 guide poses and directions; do not omit or repeat a phase. Low ponytail safely clears tools and limb silhouettes.
```

## attack

```text
Use case: style-transfer
Asset type: female farmer game animation, matching the approved Simple Life male farmer style and movement.
INPUT1 is the EDIT TARGET and EXACT WHOLE-BODY POSE/TIMING GUIDE. INPUT2 is the NEW FEMALE IDENTITY reference. Replace the male in every target pose with this same slim adult woman: warm brown side-parted hair tied into a modest low ponytail, small tan face with tiny dark-dot eyes, ivory rolled sleeves, muted olive overalls/trousers, brown belt/buckle and brown short boots. Keep her identity/pony tail/costume/palette consistent in every phase. Preserve input1's joint angles, planted/airborne boots, lean/reach, phase ordering and tool geometry. Do not make a new gait. Female body height and shoulder/head size match the male guide, not a larger doll head. No white sclera or large eyes. Front shows BOTH separated tiny dark eyes; north never shows a face. Hair doesn't obscure either front eye.
Same body scale in every frame: about40native standing pixels inside64x64logical padded cells, ground56, rootx32. Preserve natural shortened crouched poses; never resize each frame to equal ink height. Coherent square-pixel grid, simple flat2-3tone contiguous clusters/material,24-32muted colours, warm dark edges, enlarged NEAREST NEIGHBOUR. No smooth gradients, painterly texture, micro-shades, gloss or antialiasing. True alpha transparency around every sprite and all row/column gutters, no overlapping cells. No floor, shadows, background, labels, text, gridlines or UI.
Create EXACTLY24sprites in6columns x4rows. Rows SOUTH/front,NORTH/back,WEST/left,EAST/right. AXE ATTACK: six phases ready, backswing, raised windup, fast forward cut, follow-through, recovery. Preserve existing subdued steel blade/brown handle and whole-body/hand motion. Exactly one axe, same tool as chopping; no other weapon or effects. Preserve all24 guide poses and directions; do not omit or repeat a phase. Low ponytail safely clears tools and limb silhouettes.
```

## jumping

```text
Use case: style-transfer
Asset type: female farmer game animation, matching the approved Simple Life male farmer style and movement.
INPUT1 is the EDIT TARGET and EXACT WHOLE-BODY POSE/TIMING GUIDE. INPUT2 is the NEW FEMALE IDENTITY reference. Replace the male in every target pose with this same slim adult woman: warm brown side-parted hair tied into a modest low ponytail, small tan face with tiny dark-dot eyes, ivory rolled sleeves, muted olive overalls/trousers, brown belt/buckle and brown short boots. Keep her identity/pony tail/costume/palette consistent in every phase. Preserve input1's joint angles, planted/airborne boots, lean/reach, phase ordering and tool geometry. Do not make a new gait. Female body height and shoulder/head size match the male guide, not a larger doll head. No white sclera or large eyes. Front shows BOTH separated tiny dark eyes; north never shows a face. Hair doesn't obscure either front eye.
Same body scale in every frame: about40native standing pixels inside64x64logical padded cells, ground56, rootx32. Preserve natural shortened crouched poses; never resize each frame to equal ink height. Coherent square-pixel grid, simple flat2-3tone contiguous clusters/material,24-32muted colours, warm dark edges, enlarged NEAREST NEIGHBOUR. No smooth gradients, painterly texture, micro-shades, gloss or antialiasing. True alpha transparency around every sprite and all row/column gutters, no overlapping cells. No floor, shadows, background, labels, text, gridlines or UI.
Create EXACTLY24sprites in6columns x4rows. Rows SOUTH/front,NORTH/back,WEST/left,EAST/right. JUMPING: six phases anticipation bend, takeoff, bent-knee airborne, compact tuck/apex, leg extension, landing compression. Match guide poses. IMPORTANT keep each lowest boot registered to the SAME ground56 baseline without painting an arc into the sheet; game supplies the vertical world arc. Keep shorter bent/tucked poses naturally shorter; do not scale them to standing height. Empty hands, no tool/prop. Preserve all24 guide poses and directions; do not omit or repeat a phase. Low ponytail safely clears tools and limb silhouettes.
```

## idle_eye_fix

```text
Use case: precise-object-edit
EDIT TARGET: the existing female farmer idle sheet, image1. Image2 is the male reference ONLY for eye size. Keep the entire female character's identity, brown low ponytail, hair silhouette, face/skin, ivory sleeves, olive overalls, belt, boots, all16poses, directions, exact4columns x4rows layout, scale, transparency, shadows absence and pixel clusters UNCHANGED.
Correct ONLY uneven front eye widths: in SOUTH row1 columns1,2,4, the screen-right eye is too thick/wide. Make BOTH eyes identical tiny narrow dark dots, each ONE logical pixel COLUMN wide and TWO logical pixel ROWS tall at the intended40nativepixel character scale, matching the male's eyes. Repaint the extra width of the screen-right eye with adjacent matching tan FACE SKIN, without shifting its centre substantially, moving eyes or enlarging head. Both eyes have same width and height, on same row, separated by skin. No white sclera, lashes, eyebrows, nose/mouth detail or new pixels outside this small eye correction. SOUTH column3 is the brief blink: keep both eyes as consistent short closed marks; do not change its body. All north and side views stay as supplied, no new face on the back.
Keep original source-level square pixel grid and same very simple muted palette. The front face must remain truly SOUTH-facing. No redesign, body/pose changes, extra rows/columns, background, glow, grid, text, tools or props. Preserve genuine transparent alpha. The ONLY correction is making the eyes equally small.
```
