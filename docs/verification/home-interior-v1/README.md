# Approved home structure integration — 2026-10-16, v0.37.0

The human approved the standalone structure preview and requested two final changes: remove the storage pot and move the firewood back toward the wall. The new room renderer is now integrated into the normal local game. No new generated furniture or character is created.

## What changed

- Cream upper wall face and separate lower panel trim meet the floor at y112. Two existing window instances and the shelf fit inside the wall face. Cabinet, sideboard and fireplace use visible alpha bounds and separate foot anchors.
- Continuous 16-unit side boundaries replace striped wall tiling. The 72-unit bottom opening has flush timber on the floor plane and no U-shaped railing or post colliders.
- The approved left dining group is centered over its separate rug; sleeping stays on the right. Furniture pixels, artwork proportions, character rig/camera, fireplace/fire registration and tabletop pottery are preserved.
- The freestanding storage jar instance/collider is removed. Its PNG is preserved. The firewood moves exactly16 world units back from the approved preview, from visible base154 to138. Remaining placements match the review, accounting for responsive room width.
- The shared native home atlas remains unchanged. Architecture is locally rasterized with binary alpha and nearest filtering. Existing paid house palettes retain their finishes under the same corrected geometry. Save schema19, money, ownership, stove/cooking, day/time and game rules remain. Existing safe-position/decor recovery repairs obsolete wall/furniture placements without deleting ownership.

## Evidence

363 tests pass, including four new home-interior tests. Five viewports are covered:1440×900,1280×720,1024×768,844×390,390×844. A four-unit walking search reaches the bed, cooking anchor, exit and both dining-table sides in each room profile using the same pure walkability masks as save validation. Context tests confirm bed/cooking/travel actions. Existing gameplay regression tests also pass.

`art-audit.json` verifies all20 preceding runtime art files and all17 installed native frames unchanged. It checks the pot removal,16-unit wood change, exact accepted placement and unchanged source table. `integrated-layout-offline.png` is a1242×842 offline composition from the actual runtime pixel raster and native assets, with the user's existing character for size comparison. It is **not a screenshot of a running browser**. `approved-review.png` is the preceding accepted preview.

Normal production build passes. Local HTTP response checks are also unverified: the tool sandbox rejected the connection with EPERM; the4215 server listener remains present. Build/artifact audit and local HTTP limitation are recorded in build-http-audit.json. The explicit allowlist emits48 local files; original/reference/vendor art archives, sources, review/evidence pages and scripts are excluded. No dependency/backend/remote asset is added.

## Browser limitation

The browser tool rejected access to the local game under its URL security policy during the preceding integration attempt in this conversation. Its response explicitly prohibits alternate-browser/raw-CDP workarounds. No bypass was attempted. Consequently, actual interactive browser rendering, sleep/cooking UI clicks and touch movement remain unverified for this change. The offline composition, walking/context/save tests, production compilation and disk artifact checks do not replace a browser playtest. Physical phone and other-engine testing are also not claimed. Refresh127.0.0.1:4215 and enter the house for human visual acceptance.

No fixture is written to the user's localStorage save. No push, deployment, publication or competition submission.
