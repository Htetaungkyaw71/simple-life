# v0.19.2 — direction and alignment

Fix direction 0 being treated as absent, original sign post anchoring, top text padding and integer board/post centering. Preserve English signs, smaller Burmese typography, glyph shaping and all existing gameplay. Disposable Chrome desktop/mobile emulation checks; physical-device/Safari appearance remains user review.

302 tests and both builds pass. Browser checks and release records follow.

12 Burmese world cases pass at desktop 1280×720, portrait 390×844, landscape 844×390 and 568×256 across Home/City/Forest: all directions match authored map data, text/board/arrow/post centers agree, text and arrow rows do not intersect, and text stays inside boards. Four pixel checks pass in Canvas/WebGL at desktop/short landscape: visible horizontal right-arrow stem and absent vertical down-arrow stem, with cropped screenshots visually inspected. No console errors. Runtime-only playtest has 45 files / 12,009,245 bytes / 27 unchanged approved WAVs. No new runtime asset.

## Published release

READY dpl_G6PfY3JjWRrEQhfZt532R1jJcgzC, source b5507e4, promoted to https://simple-life-playtest.vercel.app/ in the existing project/team. Protected staged bundle and plain public HTML are byte-identical to the verified runtime-only stage. Public 200/no login, existing noindex/nofollow/noarchive headers and protection preserved. Vercel promotion took about one minute; initial public probes saw the previous release/connection resets and were repeated after confirming the updated index. Four public rendered-pixel cases pass in Canvas/WebGL desktop/short landscape. Three public landscape Home/City/Forest cases pass for all authored sign directions, bounds, centered text/arrow/post and separated rows. Physical-phone/Safari comfort remains human acceptance. No source push, new resource/backend, account protection change or organizer submission.

Two fresh public desktop/phone cases pass: all 45 exact runtime hashes, once-per-save 100060c test balance, Axe equip/put-away, phone Jump, reload/Continue and clean console. The HTTP QA client now retries ECONNRESET at most twice without relaxing status/hash assertions.
