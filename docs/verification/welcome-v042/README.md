# Welcome v0.42.0 — verification and release

385 automated tests pass; normal production build passes. Five new regressions cover ten viewport sizes in English/Myanmar, separated bounded fixed targets, language persistence/save bytes, fallback font handling, independent bounded animation, reduced motion, repeated disposal/texture reuse and direct-title startup. The existing new-game, economy, City and save tests remain.

Local browser checks used the production build on isolated origin 127.0.0.1:43910, without changing normal port4215 saves. Verified direct title, EN/MM switching and refresh persistence, unchanged saved-game bytes during switching/cancel, disabled Continue with no save, farmer selection, 60c new farm, intro/help, credits/back, pause/return, protected new-game confirmation and Continue back into the same boy/Home/60c farm. No warning/error console entries observed.

Responsive game viewports: 390x844 portrait and 640x360 landscape rendered in isolated test iframes, because the browser viewport override did not apply to existing/new tabs. Unit layouts additionally cover 568x256, 667x280, 844x390 and desktop sizes up to2072x1546. No physical touch-device or performance certification is claimed. Screenshots are browser captures; their outer test page may include blank space around the exact-size game frame. Reduced-motion behavior is automated; physical OS preference toggling was not newly exercised.

The normal build remains a 60c game. The explicitly named existing public playtest retains its established once-per-save +100000c testing gift. Only48 runtime files (13,475,658bytes) are staged; source, vendor archives, documents, screenshots and QA fixtures are excluded. The release is the current dirty working-tree artifact based on15a0655, not a claim that current changes were committed. No Git push.

Deployment: production staging and final public verification pending. Target is existing htetaungkyaw71s-projects/simple-life-playtest, project prj_yAUSg3ycEwhd7xCyR5izuTPSUnRh. Existing public alias: https://simple-life-playtest.vercel.app/. Protection settings must remain unchanged.
