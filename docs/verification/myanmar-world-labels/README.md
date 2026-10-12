# v0.19.1 — Myanmar world text and nameplates

User-requested repair: smaller Burmese UI/world fonts, fitted direction signs, Myanmar Seed Aid caption, no animal/tree names. Existing nameplate render objects are removed; useful health/warning/meter/reward feedback remains. Unicode long-word wrapping preserves graphemes. No gameplay/save/asset change.

Verification is recorded below. Browser profiles/saves are disposable; no user data touched. Chrome desktop/mobile emulation is not physical iOS/Android or Safari acceptance. No native-speaker certification claimed.

## Completed local checks

302 unit/system tests pass; normal and explicit-playtest builds pass. 16 English/Myanmar startup, onboarding, pause/audio/Journal, language switching and Save/Continue cases pass across Canvas/WebGL at 1280×720, 390×844, 844×390 and 568×256. 20 Myanmar resource/customization/cooking/map cases pass at those sizes, including bounds, full-page access and text intersections. 24 world cases pass: both languages at four sizes in Home/City/Forest; every sign text fits its board, Seed Aid has Myanmar text at size 7, wildlife has no nameplate objects, and the tree meter shows only n/3. The first tree test fixture did not face the tree; actual ArrowUp facing corrected the harness without gameplay changes.

Runtime-only stage has 45 files / 12,009,070 bytes / 27 unchanged WAVs. Prior art, English fonts and Noto font/licence are unchanged. No source/docs/vendor archives/credentials ship. Trading and public checks are recorded below.

Four focused Myanmar trading cases pass: Canvas 844×390 and WebGL 568×256, Buy Seeds and Market. All 12 seeds / 24 sale items retain full paginated descriptions; quantity controls/quotes, real inventory/coin transactions, pause, rotation and Save/Continue pass. Earlier diagnostic cases also passed Canvas desktop and 320/390 portrait; that broader run was stopped after six cases to keep verification scoped to this font/layout repair.

Two exact-playtest fresh desktop/phone cases pass: all 45 runtime hashes, 100060c once-per-save testing credit, Axe equip/put-away, phone Jump, Save/Continue and clean errors/requests. The release was subsequently published and checked below.

## Published release

READY deployment dpl_9XUS34MWsb2F89voeHzX1P4gdXRR, source checkpoint a35fca7, promoted to https://simple-life-playtest.vercel.app/ in the same prj_yAUSg3ycEwhd7xCyR5izuTPSUnRh / team_N7fzv8ro0kcyz4cs9Pt3Mnm2 project. First upload had a transient fetch failure; retry of the same prebuilt artifact succeeded. Protected hosted bundle is byte-identical. Protected HTML requests encountered connection resets; public root after promotion returns 200, keeps noindex/nofollow/noarchive, and exactly matches the staged index. No protection setting changed.

Two fresh public Mac/phone cases pass, including all 45 exact file hashes, one-time credit, tools/Jump and reload. Two public Burmese startup/guide/pause/Bag/Audio/Journal/language/save cases pass (Canvas 568×256, WebGL 390×844). World-label checks are recorded in public-world-checks.json. Local Mac 4196 and Wi-Fi phone 4198 previews continue to serve the normal updated build. No source push, new project, paid service/backend or organizer submission.

Six public Myanmar world cases pass at 390×844 and 844×390 in Home/City/Forest: sign text stays in its boards, Seed Aid is translated, wildlife nameplates are absent, tree progress contains only n/3, and console errors are absent.
