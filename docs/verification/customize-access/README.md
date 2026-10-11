# Customize access, crafting and original house structure — v0.17.2

The user requested a Customize icon beside Menu, the old house structure/position for upgraded designs, and moving material crafting from the Farm board into Customize. This supersedes earlier menu/shop directions.

## Implemented behavior

- Native house glyph immediately before Menu on the canvas HUD. Pause retains Save and six actions; Customize is absent there. Farm board retains farming/seed/harvest/land/visit actions and no decoration crafting entry.
- Four Customize categories: Craft / Wood & Stone, eight house designs, garden scenery, furniture. All seven original recipes charge exactly their wood/stone cost; nine other objects and eight houses cost coins. Coin transactions reject material recipes; crafting cannot create coin-only pieces. Costs/stock update immediately; failure and total Bag/placed-cap guards preserve inventory and money.
- Craft at Home, Farm or indoors. Outdoor-only fence/path can be crafted indoors but placed outside. Build/Place/Back are bounded and readable on portrait/short screens. Previously purchased/crafted pieces remain owned.
- Every themed exterior derives from the original native 180×144 house frame. Exact alpha mask, transparent pixels, steps, position, scale and depth are retained; material/colors vary. Original roof planes/gable and doorway/window/flowerbox positions match the starter. Interiors stay themed at established interaction positions.
- No schema/gift-stamp change. 100,000 playtest gift stays once per save; normal build remains 60 coins. Existing Add anywhere clear, Remove/Readjust/Cancel, reload/room-resize safety, music-free/nature gameplay and quiet UI rules remain.

## Evidence

`tests.txt`: npm test, 272 pass. `build.txt` and `playtest-build.txt`: both builds pass, 136 modules. `house-structure.json`: actual original atlas frame compared through all nine material outputs; every alpha/transparent pixel and step pixel identical, every design distinct. No source atlas editing.

`houses-and-shop/browser-checks.json`: 23 native canvas flows (fresh games, eight confirmed purchases and room entry, owned switches, Home/Farm/interior coin purchase/place/collision/edit/reload, legacy migration and phone rotation). `crafting/browser-checks.json`: twelve full material flows (three areas × four sizes), each crafts all seven recipes, checks actual costs and separates shops, places a crafted bench and reloads. `final/browser-checks.json`: four final label/furniture-page checks. `editing/browser-checks.json`: four Add/Remove/Readjust regressions using the new shortcut/material path page. Screenshots were visually reviewed for house structure, readable labels and adjacent icon.

`normal/hosted-checks.json`: fresh Mac/phone normal-release games start at 60 coins and all 35 local served files match. `runtime-audit.json`: 35 production files / 12,862,615 bytes; 23 approved WAVs, eight unchanged art files and full dependency notices. No archives, unused pack/source/docs/QA, credentials, backend or remote runtime assets.

## Reproduction

```
npm test
npm run build
npm run build:playtest
CUSTOM_QA_OUT=docs/verification/customize-access/houses-and-shop node tests/browser/customization.mjs
ACCESS_QA_OUT=docs/verification/customize-access/crafting node tests/browser/customize-access.mjs
ACCESS_CASE_FILTER='home-640|interior-390|farm-1280|home-360' ACCESS_QA_OUT=docs/verification/customize-access/final node tests/browser/customize-access.mjs
EDIT_CASE_FILTER='home-1280|farm-390|interior-390|farm-640' EDIT_QA_OUT=docs/verification/customize-access/editing node tests/browser/decoration-editing.mjs
AUDIO_QA_OUT=docs/verification/customize-access /Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/qa/cozy-audio-audit.py
```

Browsers use disposable localStorage fixtures at isolated 4190; actual native mouse/touch controls, read-only QA snapshots and one fullscreen canvas. User saves on 4175/4176/public remain untouched by automation. Viewports: 1280×720, 390×844, 640×360, 360×640. Physical phones/friend hardware and Safari/other engines remain untested; no subjective art/listening or long-term balance approval inferred.

## Publication

Authorized update targets the existing free `simple-life-playtest` project in `htetaungkyaw71s-projects`, source baseline 0cf62d95072f1bb95e1beff03d14eedf89175061 plus authorized uncommitted work. Runtime-only prebuilt production is staged without changing the public alias; host checks precede promotion. Generated deployment/preview protection remains `prod_deployment_urls_and_all_previews`. Promoted READY deployment **dpl_B9iA3EyK7aQDs5uyXXde144yj9mQ**, metadata in deployment.json. `staged/hosted-checks.json` verifies two protected Mac/touch games and all 35 uploaded hashes before promotion. `hosted-checks.json` verifies two public fresh games/reload and plain URL 200 without login/query; all 35 public hashes match. `public/browser-checks.json` repeats four affected crafting/shop/placement/reload flows on the live origin. No share tokens enter this evidence. Stable public origin: https://simple-life-playtest.vercel.app/. No Git push/commit.
