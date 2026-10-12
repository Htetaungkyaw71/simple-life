# v0.19.2 — direction and alignment

Fix direction 0 being treated as absent, original sign post anchoring, top text padding and integer board/post centering. Preserve English signs, smaller Burmese typography, glyph shaping and all existing gameplay. Disposable Chrome desktop/mobile emulation checks; physical-device/Safari appearance remains user review.

302 tests and both builds pass. Browser checks and release records follow.

12 Burmese world cases pass at desktop 1280×720, portrait 390×844, landscape 844×390 and 568×256 across Home/City/Forest: all directions match authored map data, text/board/arrow/post centers agree, text and arrow rows do not intersect, and text stays inside boards. Four pixel checks pass in Canvas/WebGL at desktop/short landscape: visible horizontal right-arrow stem and absent vertical down-arrow stem, with cropped screenshots visually inspected. No console errors. Runtime-only playtest has 45 files / 12,009,245 bytes / 27 unchanged approved WAVs. No new runtime asset.
