# v0.6.2 garden tools verification — 2026-10-08

Run npm test and npm run build. Full reports: tests.txt (157 passed, zero failed) and build.txt. Run python3 scripts/qa/garden-tools-audit.py with Pillow to reproduce runtime-audit.json and atlas-study.png. The audit compares committed v0.6.1 f87c2cf and checks all old atlas positions, 532 unchanged frames, exactly twenty-four improved original seed frames, four added icons, six unchanged other art files and the eight-file production allowlist. The offline atlas gallery is labelled and is not browser evidence.

## Native browser checks

Supported CUA in-app browser, original desktop viewport 1280×720 and explicit 390×844 phone viewport. Actual keyboard and pointer actions; no app method/state injection, localStorage writes or alternate browser-control mechanism. Original user tab on 4175 was observed then refreshed. Candidate QA origin 4176 had a prior save: replacement was cancelled with Keep my farm and the temporary tab closed. Testing continued on fresh origin 43862 with a new disposable Boy game.

1. Shovel 4 visibly attaches to farmer; Axe 5 visibly attaches. Move beside a Home tree, E: crown/shadow disappear, +3 Wood feedback, Gear shows 3 Wood. See shovel-held.jpg, axe-before-cut.jpg, tree-cut.jpg, wood-in-bag.jpg.
2. Hand 6, E beside grass: +1 Grass and clump disappears. Grass 7, E on nearby clear ground: tall grass appears. Reload and Continue: tree remains gone, planted grass remains, farmer can move through the cleared tree root. See grass-gathered.jpg, grass-planted.jpg, reload-persistence.jpg.
3. Bag shows twelve distinct crop-fruit packets; collect starter seeds, move Home → Farm, plant Tomato. Crop panel identifies Tomato and one cared-for night; the world marker uses matching fruit. Phone bag/utility equip also fits. See seed-bag.jpg, seed-bag-phone.jpg, tomato-planted-phone.jpg, axe-bag-phone.jpg, axe-held-phone.jpg.
4. Production rebuild then reload/Continue restores the QA game and tool/crop. Final browser warning/error log is saved separately. Final user tab refresh serves the rebuilt title without resetting its existing save. Viewport override reset; temporary QA tabs/servers cleaned up.

The earlier fresh crop was left running while documentation was written, missed care and showed the expected red warning/death marker (crop-care-expired.jpg). It was cleared/replanted for the phone planting capture. These images do not prove a complete browser crop-growth cycle. All twelve AM+PM care-to-harvest cycles pass in the pure-system tests. Viewports are browser emulation, not physical phone validation; other engines, sustained performance and final human balance/art/rights acceptance remain unverified.

## Regression coverage

Tree registry/all silhouettes, one-time wood rewards, removal/root collision, immutable maps, multiple farms/cleared-bed digging, grass collection/replant/regather conservation, water/bridge/path/solid/bed/overlap rejection, dig cover cleanup, zero-energy/full-bag/forged-ID/wall-reach atomicity, schema 10→11/unsafe save validation, tree fruit stopping after cut/day/reload, every crop's faster care loop, actual held view anchors/swing/switch/pause, display cleanup/pooled grass buckets, Gear selection and control bounds at seven sizes. Existing farming, City, local-save, time, forest survival/recovery/economy checks remain.

No new external dependency/art, user save reset, push, publication or competition submission.
