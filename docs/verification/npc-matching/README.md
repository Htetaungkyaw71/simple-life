# Matching NPC appearance review — 2026-10-14

Scope: first standing-design approval step for Nell and Sol, following the user-accepted gradual NPC update. Eight new transparent64×64standing cells, four directions per NPC. No walking animation or runtime integration yet. Playable version stays0.29.0.

- Native audit (`scripts/check_npc_matching.py`) passes: all eight bodies40native pixels tall, common ground(32,56), binary alpha, at most32opaque colours per view, transparent frame margins, and two identical1×2front pupils on each NPC. Source/crop/hash metadata is in `output/art/npc-matching-v1/manifest.json`.
- Original boy/girl/town/appearance/world PNGs, processed metadata and resident data/view/system code match the saved baseline hashes. [Baseline](baseline-hashes.json), [native audit](asset-audit.json).
- `npm test`:333passed,0failed. `npm run build`:passes with the same `index-c9qW1NNd.js` bundle and46runtime files. No review asset or source file enters production; allowlist and runtime dependency list are unchanged.
- In-app Chromium review at1280×720: South/North/West/East buttons and Game size/Enlarged selector work; every view renders beside approved male/female references without console warnings/errors. Screenshots: [south](south-review.png), [north](north-review.png), [west](west-review.png), [east](east-review.png), [game size](game-size-review.png).

The two character sources were generated using built-in imagegen, then sampled/packed with existing offline Pillow. [Prompts/rights/provenance](../../assets/licenses/npc-matching-v1/SOURCE_RECORD.md). New dependencies, subagents, external-game pixels and synthetic limb animation were not used.

Remaining: user appearance review, actual idle/walking cycles, in-game art integration and related movement/shop/curfew checks. Physical devices/other browser engines were not screened for this standalone developer review. The user's normal4205save was not read or modified. No publication or push.
