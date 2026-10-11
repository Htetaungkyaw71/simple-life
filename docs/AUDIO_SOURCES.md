# v0.17.4 — gentle birds outdoors

Reuse existing reviewed `forestDay` / `forest-day.wav` at `.6*(1-night)` outside Home, Farm and City to address reported daytime silence. Forest profile, night crickets, river/fountain proximity and all successful gameplay effect mappings stay intact; no wind/music is restored. Every interior remains free of looping ambience. Plant gathering uses the existing pickup alias. Runtime stays 22 WAVs with unchanged hashes. Evidence: verification/outdoor-plants/README.md.

---

# v0.17.3 — quiet house interior

The indoor `room` loop sourced from `fireplace.wav` was the reported wind-like background. Interior layers are now empty at every time/design. The loop is neither fetched nor included in production. All 22 other selected samples, action/sleep/wake/rooster mappings, outdoor profiles, volumes and preferences remain unchanged. Evidence: verification/quiet-interior. Prior entries below describe their versions.

---

# v0.16.6 — no wind, sleep and natural wake feedback

Removed meadow wind and winter wind from both audioProfile and the runtime/preload allowlist. Home/Farm daytime is quiet; Forest day/night, nearby river, interior fire and City fountain retain their nature loops. No gameplay music or musical sleep/wake jingle. Title music stays on Title and saved audio preferences remain.

sleep:begin uses the previously converted/licensed Farm sleep sample. morning:wake uses alys's public-domain **Medium rooster crowing** recording (crow with nearby hen clucking); evening:wake uses the existing short bush-rustle sample. The bed branch chooses the wake effect from its actual resulting morning/evening time. AudioManager schedules it after the sleep buffer duration/playback rate plus 80ms, using the AudioContext clock without timers. Another sleep cancels previous rest voices; Title/new world cleanup cancels scheduled wake nodes. Opening/cancelling the bed menu stays silent.

Current allowlist: **24 audible event IDs / 17 distinct SFX** (16 supplied Farm, one public-domain rooster), five Nature loops and one title track = **23 runtime WAVs**. Original score WAVs, both wind files, unused jingles and sixteen previously selected unused SFX stay outside production. Existing sample hashes remain; new rooster conversion/rights/credit/hashes are under assets/licenses/morning-audio. Current audit: verification/sleep-wakeup/runtime-audit.json.

---

# v0.16.5 — natural gameplay ambience and successful pickups

Gameplay audioProfile has an empty music map at every location/time and during Pause. Title music remains, and its source is stopped/disconnected immediately on entering a world. Completion retains its existing API but starts no musical cue. Original six scores remain reproducible historical source; AUDIO_FILES is empty and none of their WAVs ship.

Successful forest:collect/item:pickup/furniture:recover use pickup-item; stone:collect uses rock-break; cache:open uses chest-open; stash:recover/keepsake:collect use pickup-rare. Each established call follows a confirmed gameplay mutation; the starter crate gains the same success check. Existing Wood/grass, actual tree/animal hit, crop farming and buy/sell feedback remain. Failed pickups, empty swings/felling and UI/Jump/doors/travel stay rejected before synthesis/loading.

Current allowlist: **21 audible event IDs / 15 distinct Farm SFX**, seven Nature loops and one **title-only** HuntSounds track: **23 runtime WAVs**. Seventeen previously selected unused SFX and all original scores stay outside production. Exact source hashes/licences remain unchanged. Current audit: verification/nature-pickups/runtime-audit.json. Volume/mute settings are preserved; Music still controls title audio.

---

# v0.16.4 — landed-hit feedback only

Removed combat:swing and tree:fall from the central playback/preload/build allowlist. Empty swings create no audio. Existing successful tree work emits an impact for unfinished cuts; a finished cut's tree:fall event is silent and wood:pickup still plays. Animal hit/defeat effects already emit only after a landed hit. Farming and transactions retain their effects; UI/Jump/doors/travel remain silent.

Fourteen audible event IDs use twelve supplied SFX files. With seven Nature loops, one supplied music loop and the original ending cue, exactly **21 WAVs** ship. Twenty selected supplied files retain their licence evidence and exact hashes; twenty unused SFX stay outside production. Current audit: verification/hit-feedback/runtime-audit.json. No source WAV, preferences or audio transport changes.

---

# v0.16.3 — farming and tree/animal hit effects restored

The user's clarification restores all seven crop farming event IDs, swing/tree hit/fall/Wood pickup, animal hit/defeat and grass placement effects, alongside successful buy/sell. Farming chop/gatherGrass/placeGrass aliases are restored through their established mappings. UI clicks/menus/tool selection, Jump, doors/travel and other excluded effects still reject before loading or synthesis. Background music, seven Nature loops and the original ending cue are unchanged.

Current: sixteen audible effect event IDs map to fourteen distinct supplied SFX; eight supplied music/ambience files plus the original cue yield **23 runtime WAVs**. The same map gates playback, preloading and build selection. Source bytes/permissions/hashes remain in assets/licenses/cozy-audio/manifest.json; eighteen unused SFX are excluded from production. Current audit: verification/restored-effects/runtime-audit.json. Earlier version inventories below are historical.

---

# v0.16.2 — current runtime audio inventory

The user requested silent actions/UI/travel while retaining buying and selling. `SAMPLE_EFFECTS` now permits only `shop:buy` → `sfx-buy` and `shop:sell` → `sfx-sell-coins`. All other effects, aliases and synthetic ambient calls reject before loading, synthesis, cooldown bookkeeping or queuing. The existing synthetic fallback is reachable only for these two transaction effects. Background music, seven Nature loops and the original ending cue remain unchanged.

Current runtime: **11 WAVs** (two transaction samples, seven Nature loops, one shared music loop, original completion cue). Ten supplied files retain the exact hashes and permissions in assets/licenses/cozy-audio/manifest.json. Its earlier forty-file selection and the v0.16.1 inventory below are historical provenance; thirty withdrawn SFX remain outside dist and are never fetched. Current measurements: verification/quiet-actions/runtime-audit.json. Four volume/mute preferences remain unchanged.

---

# v0.16.1 — current runtime audio inventory

32 Farm SFX samples map all 49 gameplay/UI events; seven Nature loops and one HuntSounds bonus music loop replace the earlier generated background audio. The original 11-second ending cue remains. Original effects are used only if a sample has not loaded or failed. All creator permissions, transformations and exact hashes: [source record](assets/licenses/cozy-audio/SOURCE_RECORD.md) / manifest.json. Current numerical/production audit: scripts/qa/cozy-audio-audit.py. The earlier generated-source audit below is historical; scripts/audit-audio.py now writes its separate original-audio-inventory under verification/story-audio rather than overwriting this current inventory.

Existing four volume/mute preferences are preserved. Forest day/night and water proximity adjust layer gains; meadow/snow/fountain/fireplace remain location/habitat-specific. One shared quieter music source avoids duplicate identical tracks. Loop checks compare the seam against ordinary adjacent-sample variation, appropriate for broadband nature textures. Numerical checks and browser output measurements do not establish subjective comfort or physical-device playback.

| ID | Runtime path | Seconds | Peak | RMS | Loop | Creator |
| --- | --- | ---: | ---: | ---: | --- | --- |
| sfx-ui-hover | assets/audio/cozy/sfx-ui-hover.wav | 0.06 | 0.3747 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-ui-click | assets/audio/cozy/sfx-ui-click.wav | 0.07 | 0.3873 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-ui-back | assets/audio/cozy/sfx-ui-back.wav | 0.36 | 0.4714 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-ui-error | assets/audio/cozy/sfx-ui-error.wav | 0.39 | 0.4879 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-menu-open | assets/audio/cozy/sfx-menu-open.wav | 0.41 | 0.4228 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-menu-close | assets/audio/cozy/sfx-menu-close.wav | 0.41 | 0.4618 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-notification | assets/audio/cozy/sfx-notification.wav | 0.58 | 0.5000 | 0.0859 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-hoe-dig | assets/audio/cozy/sfx-hoe-dig.wav | 0.24 | 0.5000 | 0.0868 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-seed-plant | assets/audio/cozy/sfx-seed-plant.wav | 0.20 | 0.4725 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-watering | assets/audio/cozy/sfx-watering.wav | 1.32 | 0.5000 | 0.0881 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-harvest-pop | assets/audio/cozy/sfx-harvest-pop.wav | 0.59 | 0.3928 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-bush-rustle | assets/audio/cozy/sfx-bush-rustle.wav | 0.41 | 0.4618 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-buy | assets/audio/cozy/sfx-buy.wav | 0.78 | 0.4750 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-sell-coins | assets/audio/cozy/sfx-sell-coins.wav | 0.65 | 0.4958 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-not-enough-money | assets/audio/cozy/sfx-not-enough-money.wav | 0.37 | 0.5000 | 0.0820 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-jingle-quest-complete | assets/audio/cozy/sfx-jingle-quest-complete.wav | 1.55 | 0.4536 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-jingle-level-up | assets/audio/cozy/sfx-jingle-level-up.wav | 1.47 | 0.4805 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-pickup-item | assets/audio/cozy/sfx-pickup-item.wav | 0.47 | 0.5000 | 0.0985 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-scythe-swish | assets/audio/cozy/sfx-scythe-swish.wav | 0.37 | 0.5000 | 0.0970 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-axe-chop | assets/audio/cozy/sfx-axe-chop.wav | 0.22 | 0.5000 | 0.0780 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-tree-fall | assets/audio/cozy/sfx-tree-fall.wav | 1.36 | 0.5000 | 0.0825 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-rock-break | assets/audio/cozy/sfx-rock-break.wav | 0.28 | 0.5000 | 0.0849 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-craft | assets/audio/cozy/sfx-craft.wav | 0.76 | 0.5000 | 0.0944 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-place-item | assets/audio/cozy/sfx-place-item.wav | 0.22 | 0.5000 | 0.0815 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-gate | assets/audio/cozy/sfx-gate.wav | 1.02 | 0.5000 | 0.0699 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-eat | assets/audio/cozy/sfx-eat.wav | 0.50 | 0.5000 | 0.0578 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-pickup-rare | assets/audio/cozy/sfx-pickup-rare.wav | 0.82 | 0.5000 | 0.0651 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-chest-open | assets/audio/cozy/sfx-chest-open.wav | 0.90 | 0.5000 | 0.0683 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-jingle-fail | assets/audio/cozy/sfx-jingle-fail.wav | 1.18 | 0.2516 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-door-wood-open | assets/audio/cozy/sfx-door-wood-open.wav | 0.77 | 0.5000 | 0.0922 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-sleep | assets/audio/cozy/sfx-sleep.wav | 2.97 | 0.5000 | 0.0813 | no | Spaceyyy (formerly Bramble & Byte) |
| sfx-jingle-new-day | assets/audio/cozy/sfx-jingle-new-day.wav | 1.55 | 0.4797 | 0.1000 | no | Spaceyyy (formerly Bramble & Byte) |
| cozyMusic | assets/audio/cozy/music.wav | 68.00 | 0.4000 | 0.0661 | yes | HuntSounds |
| wind | assets/audio/cozy/meadow.wav | 29.90 | 0.4000 | 0.0568 | yes | Spaceyyy (formerly Bramble & Byte) |
| forestDay | assets/audio/cozy/forest-day.wav | 29.90 | 0.4000 | 0.0450 | yes | Spaceyyy (formerly Bramble & Byte) |
| night | assets/audio/cozy/night.wav | 29.90 | 0.4000 | 0.0462 | yes | Spaceyyy (formerly Bramble & Byte) |
| water | assets/audio/cozy/river.wav | 29.90 | 0.4000 | 0.0691 | yes | Spaceyyy (formerly Bramble & Byte) |
| room | assets/audio/cozy/fireplace.wav | 29.90 | 0.4000 | 0.0495 | yes | Spaceyyy (formerly Bramble & Byte) |
| fountain | assets/audio/cozy/fountain.wav | 29.90 | 0.4000 | 0.0748 | yes | Spaceyyy (formerly Bramble & Byte) |
| winter | assets/audio/cozy/winter.wav | 29.90 | 0.4000 | 0.0617 | yes | Spaceyyy (formerly Bramble & Byte) |
| completion | assets/audio/completion.wav | 11.00 | 0.1822 | 0.0371 | no | Original Simple Life / Codex-assisted |

---

# Historical v0.16.0 generated-source inventory (five old background scores and original ambience no longer used)

# Original audio inventory and waveform audit

All six scores are newly authored in src/audio/score.js and rendered to mono 16-bit PCM by scripts/generate-audio.mjs. No external recording, commercial-game melody, preset sample, generative audio service or remote asset was used. Bass is a finite triangle-like harmonic sum; gentle pulse and bell voices use sine harmonics. Sparse low-frequency taps replace noise percussion. Music starts/ends with rounded envelopes. Effects and three ambience textures are synthesized once and cached after unlock.

Human listening approval remains required. Numeric checks cannot establish that a melody is pleasant, non-tiring or subjectively seamless. Physical-device audio output is unverified.

| Name / event | Seconds | Peak | RMS | DC offset | Loop boundary | Above 6 kHz | Loop | Runtime / source |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| A letter at dawn | 64.00 | 0.1050 | 0.0272 | 0.000000 | 0.000000 | 0.000004% | yes | public/assets/audio/title.wav |
| Rows in the sunlight | 96.00 | 0.1095 | 0.0270 | 0.000000 | 0.000000 | 0.000004% | yes | public/assets/audio/farm.wav |
| Lantern Square | 80.00 | 0.1010 | 0.0267 | 0.000001 | 0.000000 | 0.000004% | yes | public/assets/audio/city.wav |
| Under the leaves | 96.00 | 0.1100 | 0.0266 | -0.000000 | 0.000000 | 0.000004% | yes | public/assets/audio/forest.wav |
| The way home | 96.00 | 0.1068 | 0.0267 | -0.000000 | 0.000000 | 0.000004% | yes | public/assets/audio/night.wav |
| Home again | 11.00 | 0.1822 | 0.0371 | -0.000000 | 0.000000 | 0.000002% | no | public/assets/audio/completion.wav |
| ui:move | 0.09 | 0.0393 | 0.0143 | -0.000002 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| ui:confirm | 0.16 | 0.0921 | 0.0297 | -0.000001 | 0.000004 | 0.000000% | no | src/audio/score.js / renderEffect |
| ui:cancel | 0.13 | 0.0712 | 0.0232 | 0.000002 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| ui:disabled | 0.13 | 0.1036 | 0.0423 | -0.000005 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| ui:open | 0.20 | 0.0863 | 0.0273 | 0.000001 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| ui:close | 0.18 | 0.0765 | 0.0243 | 0.000001 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| journal:update | 0.50 | 0.1544 | 0.0450 | -0.000001 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| farming:dig | 0.16 | 0.1957 | 0.0891 | -0.000067 | 0.000043 | 0.000000% | no | src/audio/score.js / renderEffect |
| farming:plant | 0.18 | 0.1104 | 0.0353 | -0.000003 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| farming:water | 0.28 | 0.1369 | 0.0416 | -0.000004 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| farming:empty | 0.13 | 0.1151 | 0.0470 | -0.000008 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| farming:growth | 0.50 | 0.1637 | 0.0477 | 0.000001 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| farming:harvest | 0.28 | 0.1610 | 0.0489 | 0.000001 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| farming:clear | 0.15 | 0.1612 | 0.0713 | 0.000057 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| shop:buy | 0.23 | 0.1369 | 0.0423 | -0.000002 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| shop:sell | 0.26 | 0.1421 | 0.0434 | -0.000001 | 0.000005 | 0.000000% | no | src/audio/score.js / renderEffect |
| shop:failure | 0.13 | 0.1036 | 0.0423 | -0.000005 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| project:complete | 0.65 | 0.2245 | 0.0651 | 0.000001 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| request:complete | 0.45 | 0.1967 | 0.0576 | 0.000001 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| coin:reward | 0.20 | 0.1083 | 0.0341 | 0.000000 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| combat:swing | 0.15 | 0.1842 | 0.0815 | 0.000041 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| tree:hit | 0.16 | 0.2302 | 0.1048 | -0.000073 | 0.000109 | 0.000000% | no | src/audio/score.js / renderEffect |
| tree:fall | 0.50 | 0.2532 | 0.1447 | 0.000008 | 0.000002 | 0.000000% | no | src/audio/score.js / renderEffect |
| wood:pickup | 0.17 | 0.1003 | 0.0325 | 0.000000 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| stone:collect | 0.18 | 0.1111 | 0.0353 | -0.000003 | 0.000003 | 0.000000% | no | src/audio/score.js / renderEffect |
| craft:complete | 0.32 | 0.1496 | 0.0451 | -0.000002 | 0.000002 | 0.000000% | no | src/audio/score.js / renderEffect |
| furniture:place | 0.20 | 0.1957 | 0.0963 | 0.000016 | 0.000001 | 0.000000% | no | src/audio/score.js / renderEffect |
| furniture:rotate | 0.12 | 0.0678 | 0.0220 | 0.000001 | 0.000001 | 0.000000% | no | src/audio/score.js / renderEffect |
| furniture:invalid | 0.13 | 0.1036 | 0.0423 | -0.000005 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| furniture:recover | 0.20 | 0.1089 | 0.0341 | 0.000004 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| stove:open | 0.20 | 0.1496 | 0.0737 | 0.000008 | 0.000001 | 0.000000% | no | src/audio/score.js / renderEffect |
| food:cook | 0.40 | 0.1574 | 0.0465 | -0.000004 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| food:eat | 0.25 | 0.1330 | 0.0407 | 0.000005 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| food:health | 0.30 | 0.1387 | 0.0421 | 0.000001 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| food:energy | 0.30 | 0.1395 | 0.0421 | 0.000002 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| forest:collect | 0.24 | 0.1382 | 0.0427 | 0.000002 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| animal:warning | 0.32 | 0.1842 | 0.1000 | 0.000012 | 0.000086 | 0.000000% | no | src/audio/score.js / renderEffect |
| combat:hit | 0.16 | 0.2532 | 0.1153 | 0.000064 | 0.000058 | 0.000000% | no | src/audio/score.js / renderEffect |
| combat:hurt | 0.25 | 0.2763 | 0.1436 | -0.000000 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| animal:defeat | 0.42 | 0.1942 | 0.0572 | 0.000002 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| cache:open | 0.50 | 0.1988 | 0.0583 | 0.000001 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| stash:drop | 0.30 | 0.1707 | 0.0520 | 0.000004 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| stash:recover | 0.48 | 0.2077 | 0.0607 | 0.000001 | 0.000001 | 0.000000% | no | src/audio/score.js / renderEffect |
| keepsake:collect | 0.80 | 0.2299 | 0.0660 | -0.000001 | 0.000001 | 0.000000% | no | src/audio/score.js / renderEffect |
| door:open | 0.25 | 0.1612 | 0.0838 | 0.000011 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| travel:enter | 0.35 | 0.1272 | 0.0381 | -0.000001 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| bed:open | 0.22 | 0.0973 | 0.0303 | -0.000002 | 0.000003 | 0.000000% | no | src/audio/score.js / renderEffect |
| sleep:begin | 0.80 | 0.1726 | 0.0495 | -0.000001 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| morning:wake | 0.70 | 0.1894 | 0.0545 | 0.000001 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| ambient:bird | 0.38 | 0.0474 | 0.0141 | 0.000000 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| ambient:cricket | 0.28 | 0.0282 | 0.0086 | 0.000000 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| ambient:wood | 0.13 | 0.0576 | 0.0235 | 0.000005 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| ambient:fire | 0.12 | 0.0575 | 0.0222 | 0.000023 | 0.000027 | 0.000000% | no | src/audio/score.js / renderEffect |
| ambient:animal | 0.48 | 0.0518 | 0.0295 | 0.000000 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| ambient:step | 0.12 | 0.0518 | 0.0200 | 0.000046 | 0.000000 | 0.000000% | no | src/audio/score.js / renderEffect |
| wind | 24.00 | 0.0113 | 0.0028 | -0.000000 | 0.000000 | 0.000000% | yes | src/audio/score.js / renderAmbience |
| water | 24.00 | 0.0158 | 0.0041 | 0.000000 | 0.000000 | 0.000000% | yes | src/audio/score.js / renderAmbience |
| room | 24.00 | 0.0028 | 0.0010 | 0.000000 | 0.000000 | 0.000000% | yes | src/audio/score.js / renderAmbience |

64 entries checked. Zero clipped samples. Six WAV files total 19,536,564 bytes. Effects have finite duration, softly varied pitch/level and a six-voice cap; the completion cue has one separate bounded music voice. No oscillator, interval or audio timer survives scene rebuilds.

Source rights: original Simple Life work authored with OpenAI Codex assistance, within the user-authorized competition project. This is not a claim of exclusive copyright, human composition or completed human review. Retained external artwork keeps its separate creator licences.

Reproduce: node scripts/generate-audio.mjs; node scripts/audit-audio.mjs. Debug effects use temporary raw samples outside production. Production ships only the six named WAVs under the explicit allowlist.

The removed ForestAmbience used a shared two-second random-noise buffer continuously through low-pass wind, high-pass river and a 4.2 kHz insect band, with occasional 1.8–3.4 kHz oscillator chirps and no music. That tonal absence, short noise repetition and emphasized upper frequencies plausibly explain the reported static-like character; this is an inference from source, not a human listening diagnosis. The replacement uses no white-noise buffer or random high-frequency melody. Quiet low-frequency textures, sparse bounded calls and authored tonal phrases supply the foundation.

Important project/request/key/pickup/restoration feedback can wait at most 250 ms in a bounded four-entry queue if a UI frame is busy. It still obeys the two-starts-per-frame/six-voice limit and is discarded on expiry, New Game/Continue reset, Title or destruction. Rapid input cannot accumulate an unbounded queue.
