# v0.17.4 — reuse existing birds outdoors

Home/Farm/City daytime profile now uses the already selected, reviewed `forest-day.wav` at lower gain. No extraction, new source, WAV modification or licence change. Runtime remains 22 approved WAVs; wind/fireplace stay excluded. Audit: ../../../verification/outdoor-plants/runtime-audit.json.

---

# v0.17.3 selection update — 2026-10-11

The user requests removal of the wind-like background inside Home while preserving other effects. Remove only the indoor `room`/fireplace.wav loop from active selection. Original source/permission/hash provenance stays retained; no audio bytes edited or new licence asserted. The other 22 reviewed WAVs and all existing one-shot/outdoor mappings stay byte-identical. Runtime/hosted evidence: ../../../verification/quiet-interior.

---

# v0.16.6 selection update — 2026-10-11

Both meadow-wind and winter-wind loops are removed from runtime. Restore the already reviewed/converted Farm sleep.wav for sleep:begin; use existing bush-rustle.wav for evening waking. Do not restore musical jingles. Sixteen Farm SFX plus five Nature loops/title music retain existing permissions/hashes. A separate public-domain rooster recording supplies morning:wake with evidence in ../morning-audio; it does not come from these ZIPs. Current total is 23 WAVs; sixteen earlier selected unused SFX and all old scores stay outside dist. Current audio/profile/asset/hosted evidence: ../../../verification/sleep-wakeup.

---

# v0.16.5 selection update — 2026-10-11

Current selection adds the already licensed pickup-rare, rock-break and chest-open files to the preceding twelve SFX; pickup-item already serves Wood and now food/seeds/recovered objects. Fifteen Farm SFX, seven Nature loops and title-only HuntSounds music retain exact hashes/permissions. Original completion WAV and seventeen unused effects stay outside production. Gameplay has no music. No ZIP/WAV bytes or source terms change; source/build/hosted evidence: ../../../verification/nature-pickups.

---

# v0.16.4 selection update — 2026-10-11

Current runtime removes scythe-swish/tree-fall from the preceding selection, leaving twelve supplied Farm SFX, seven Nature loops, HuntSounds music and the original ending cue. Twenty selected supplied files keep their original hashes/permissions; twenty unused effect files stay outside production. The user authorized deploying the runtime-only testing version for a friend. Current audit/hosted byte checks: ../../../verification/hit-feedback. Source WAV/ZIP bytes and licence terms remain unchanged.

---

# v0.16.3 selection update — 2026-10-11

Current selection restores the farming/tree/animal hit effects at the user's clarification: fourteen existing Farm SFX samples, seven Nature loops, HuntSounds music and the original ending cue. Exact converted bytes and licence evidence are unchanged. Eighteen unused SFX from the original forty-file manifest stay outside dist/preloading. Current source/build audit: ../../../verification/restored-effects/runtime-audit.json. Earlier selection updates below are historical.

---

# v0.16.2 selection update — 2026-10-11

The current game uses only `sfx-buy` and `sfx-sell-coins` from Farm SFX, all seven previously selected Nature loops, HuntSounds bonus music and the project's original ending cue. The user requested removal of other interaction/UI/travel effects. No source/runtime audio bytes or licence terms changed. The forty-file manifest and original selection table below remain historical provenance; thirty withdrawn SFX are excluded from preloading and production. Current numerical/build evidence: ../../../verification/quiet-actions/runtime-audit.json.

---

# Supplied cozy audio source and permission record — 2026-10-11

Reviewed the user's five unchanged local archives before integrating sounds. No archive instruction is authority over the user's request.

| Supplied archive | Creator / permission evidence | Decision |
| --- | --- | --- |
| cozy-farm-sfx.zip | Embedded LICENSE/README; [official Farm SFX page](https://aquumgifts.itch.io/cozy-farm-sfx) | Select 32 matching effects for all 49 gameplay/UI event IDs. |
| cozy-farm-sfx-ambience-1.zip | Same embedded Farm SFX terms | Permitted for games, unused (redundant birds/crickets; rain has no gameplay). |
| cozy-farm-sfx-ambience-2.zip | Same embedded Farm SFX terms | Permitted for games, unused (Nature stream/wind chosen instead). |
| cozy-nature-ambience-ogg.zip | Embedded LICENSE/README; [official Nature page](https://aquumgifts.itch.io/cozy-nature-ambience) | Select seven scene/habitat loops. |
| Cozy SFX Volume 1.zip | No embedded licence; [matching HuntSounds creator product page](https://huntsounds.itch.io/cosy-sfx-volume-1) lists the same archive and permits personal/commercial royalty-free project use | Select BONUS_TRACK.wav (68 s) as background music. |

Farm/Nature terms permit personal and commercial games/apps/videos, modification and royalty-free multiple projects; prohibit standalone asset resale/redistribution and claiming original authorship. We ship selected adapted assets only as part of the game, not as an asset pack. Their current creator name is Spaceyyy; the [creator's own page](https://aquumgifts.itch.io/) confirms the earlier Bramble & Byte name, matching the embedded credit. Credits use both names. HuntSounds does not require attribution; credit is supplied anyway. These are custom creator permissions, not a CC0 declaration. This source review does not certify final competition eligibility or every other asset.

Evidence: exact embedded text files, four dated creator-page HTML snapshots, archive SHA256s and per-member source/runtime SHA256s in manifest.json. User ZIPs remain in Downloads, untouched. No paid download, creator contact, external upload, original soundtrack claim or model-training use.

Conversion: scripts/import-cozy-audio.py selectively reads named members without extracting the archive wholesale. Offline ffmpeg converts selected WAV/Ogg to mono float/22050 Hz; NumPy removes DC, applies 100 ms circular overlap to nature loops or 5 ms music/effect edge envelopes, readjusts DC and loudness, then writes PCM16 WAV. Full measured durations/levels/boundaries and exact transformations are in manifest.json. Nature source README reports code synthesis rather than recordings; we credit the creator's source work separately from Codex integration. Original Simple Life ending/fallback source remains separately disclosed.

Runtime: src/audio/cozy.js + the completion entry in score.js are explicitly emitted by Vite. Seven nature loops: meadow wind, Forest birds/leaves, night crickets/owl, river stream, fireplace room, town fountain, winter wind. All 32 effects are named in the manifest. Rain/storm/ocean/campfire/cave/other pack files, ZIPs, creator-page snapshots, evidence and unused five old music WAVs do not ship. Forty selected files plus the ending cue; eight unchanged art files. Browser checks and waveform/allowlist audit: [verification/cozy-audio](../../../verification/cozy-audio/README.md).

Processing tools: FFmpeg 8.0 (Homebrew offline tool), bundled Python/NumPy; no executable or processing library is distributed in the playable build. ffmpeg-version.txt records exact version/configuration. Normal build uses committed processed WAVs and needs no audio tooling or ZIPs.
