# v0.19.1 — Myanmar world text and nameplates

User-requested repair: smaller Burmese UI/world fonts, fitted direction signs, Myanmar Seed Aid caption, no animal/tree names. Existing nameplate render objects are removed; useful health/warning/meter/reward feedback remains. Unicode long-word wrapping preserves graphemes. No gameplay/save/asset change.

Verification is recorded below after all checks. Browser profiles/saves are disposable; no user data touched. Chrome desktop/mobile emulation is not physical iOS/Android or Safari acceptance. No native-speaker certification claimed.

## Completed local checks

302 unit/system tests pass; normal and explicit-playtest builds pass. 16 English/Myanmar startup, onboarding, pause/audio/Journal, language switching and Save/Continue cases pass across Canvas/WebGL at 1280×720, 390×844, 844×390 and 568×256. 20 Myanmar resource/customization/cooking/map cases pass at those sizes, including bounds, full-page access and text intersections. 24 world cases pass: both languages at four sizes in Home/City/Forest; every sign text fits its board, Seed Aid has Myanmar text at size 7, wildlife has no nameplate objects, and the tree meter shows only n/3. The first tree test fixture did not face the tree; actual ArrowUp facing corrected the harness without gameplay changes.

Runtime-only stage has 45 files / 12,009,070 bytes / 27 unchanged WAVs. Prior art, English fonts and Noto font/licence are unchanged. No source/docs/vendor archives/credentials ship. Trading and public checks will be recorded below.
