# v0.20.1 — cursed cave removal

The user postpones the v0.20.0 sealed/cursed cave and ghosts. Remove all feature modules, warning/repair/achievement UI, map marker and collision. Previously removed skull objects remain absent. Keep 19:00 NPC/merchant timing and released outdoor Stash Bag compatibility. Existing saves retain their current money, inventory, farms, story and other progress; curse data is dropped on normalization. Source history remains in commits 55fbdbd and 0125255.

Checks: **306 tests pass**, normal and explicit playtest builds pass (**143 modules**). Four isolated native Chrome profiles pass: Canvas English 1280×720, Burmese 568×256 and 390×844, WebGL English 844×390. Each checks a v0.20.0 broken-curse save, continued wallet/inventory, no nighttime ghost damage, one-time Stash Bag recovery, removed cave/clear approach, seven reachable Pause controls, Save/reload, 19:00 NPC/shop return and house entry; no browser errors/warnings. Results: local-checks.json, unit-tests.log and clearing screenshots.

Runtime stage: **45 files / 12,010,253 bytes / 27 WAVs / 43 retained assets byte-identical** to v0.20.0. Manifest: deployment-files.json.

Phone-sized touch emulation uses isolated Chromium; physical phones, Safari/WebKit and other engines remain unverified. User-profile storage is untouched. Public release is in progress and will be verified before completion.
