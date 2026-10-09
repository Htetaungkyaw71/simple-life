# v0.11.1 — Home proportions, roof and mobile attack correction, 2026-10-09

The indoor farmer and furniture now share 2× native world scale; indoor camera framing matches outdoors (1.5 desktop, 1 compact), so the farmer is 96px / 64px tall in both locations. Existing room sizing, furniture, bed, exit, saved room mapping and collision rules remain. The Home exterior is drawn directly on a 180×144 native canvas (360×288 world), centred at the existing door/porch. Twelve other houses retain 120×96 cells. All thirteen share the broad roof/central raised gable/front facade structure, with a pitched rear cap and taller double doors; unique finishes remain. Source-generated exact collision rows, Home resident doorstep, clear porch and centred grounding shadows follow the new art. No 3D engine, reference-pixel extraction, resampling or external asset.

Energy uses an original yellow lightning glyph and brighter gold fill in the same badge/frame dimensions as health. On layouts with the mobile Attack button, direct animal/ground/tree taps cannot hunt or swing/chop; use Attack. Desktop clicks and ordinary mobile ground/people/door interactions remain.

The user explicitly requested a one-time 100,000-coin test gift. The local-only `?testingCoins=100000` title action writes the existing raw save atomically, changing only money plus a claim marker, preserving all other stored fields. The marker survives validation/normal saves; reloads cannot duplicate it. Normal URLs/remote hosts hide the action and new lives still start with 60. The user's existing normal 4175-origin save received 100,000 once, and its 100,003 balance was confirmed after fixture-free normal reload/Continue; game left paused. Other browser QA used the separate 43863 origin.

Checks: **192/192 tests passed**; `npm run build` passed (106 modules). Native browser checks at 1280×720 and 390×844 verified Home entry, indoor scale, reachable bed dialog, complete roof/door, mobile screen attack suppression, mobile Attack loot (2 Meat, 1 EP), retained desktop click attack, normal save gift/reload, and clean QA console. Source/runtime audit: 858 atlas frames, only thirteen original house cells changed, Home cell relocated, 845 cells/six other art files unchanged; eight allowlisted runtime art files, twelve total dist files, 2,356,735 bytes. Evidence: docs/verification/home-proportions; original-cell hashes: docs/assets/licenses/home-proportions.

Limits: phone viewport/native pointer emulation, not physical iOS/Android; other browser engines remain unverified. No new dependency, default economy change, remote service, push, publication or submission. Earlier verification records remain historical.

---

