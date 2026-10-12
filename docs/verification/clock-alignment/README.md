# v0.19.3 — measured clock alignment

Reproduced the old Burmese time row touching the top frame (failed vertical-padding assertion). The corrected layout centers the complete padded time/day block, keeps four CSS pixels between rows, and centers the money text in its own frame. Font sizes and panel dimensions stay unchanged. Whole logical positions and 2× text transforms preserve shaping and sharp native scaling.

302 tests and both 143-module builds pass. The runtime-only playtest is 45 files / 12,009,545 bytes / 27 approved WAVs. All files other than HTML/application entry files match v0.19.2 exactly, including fonts/art/audio/licence notices. deployment-files.json records hashes. No new curse gameplay, dependency or asset.

Browser evidence and publishing result follow. Disposable Chrome contexts use fixture saves rather than the user's profile. Physical phones, Safari/WebKit and native-speaker appearance acceptance remain human checks.

32 clock checks pass: English/Myanmar × Canvas/WebGL × 1280×720, 390×844, 844×390 and 568×256 × ordinary/max save values. Assertions use actual rendered bounds for horizontal/vertical padding, centered rows, four-CSS-pixel separation, integer text scale and control clearance. Actual fixtures retain day 99999 / 9999999c on Continue; fixture injection is on the title so pagehide autosave cannot replace it. Phone screenshots were visually inspected. Two additional Burmese portrait/short-landscape crop-HUD checks and all five Journal chapters pass without text/control overlap or console errors.

## Published release

READY dpl_AawcNLEHbtrXJ9Vabargp4hsur3D, source 6a89eeb, promoted to https://simple-life-playtest.vercel.app/ in the verified existing project/team. Protected staged bundle and public HTML match the runtime-only stage exactly. Public 200/no login and existing noindex/protection remain. All 45 runtime hashes match. Two fresh public desktop/phone cases pass for 100060c once-per-save gift, equip/put-away, phone Jump, reload/Continue and clean console. Eight public Burmese portrait/landscape clock checks pass across both renderers and normal/maximum values.

The first upload failed temporarily with fetch failed; a metadata query confirmed no deployment before the same-target retry succeeded. A public browser's first navigation hit ERR_CONNECTION_RESET; repeating the check passed. Failure reporting now retains the original error even if startup never produced a QA snapshot. No game assertion was relaxed. No Git push, new service, protection change, user-profile save editing or organizer submission. The current local Mac/LAN previews continue serving the latest normal build.
