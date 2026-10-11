# Cozy audio and mobile/default-tool verification — v0.16.1

Outcome: all requested audio/control/default-Hand changes are implemented and the local Mac/phone production preview is running. Supplied packs are reviewed under their creator-specific game-use permissions; no standalone asset redistribution or new runtime library.

| Boundary | Result / evidence |
| --- | --- |
| Source permission → selected local assets | Embedded licence/README, four primary creator-page snapshots, archive/member/runtime SHA256s: ../../assets/licenses/cozy-audio/SOURCE_RECORD.md and manifest.json. |
| Build → local asset response | runtime-audit.json: exact 41 WAV/eight art allowlist, source bytes/hashes, unchanged art, retained MIT notices; 53 files / 16,136,998 bytes. Mac and LAN port 4176 return HTTP 200. |
| Gesture → real audio decoder/output | browser-checks.json: locked until gesture, all 40 selected files decode, nonzero Forest day/night bus RMS, day loop >31 seconds, one context on focus resume, local-only requests/no errors. |
| Touch/desktop UI → gameplay/save/render | browser-checks.json/world-actions.json: plant/water/harvest, indoor/outdoor Use, sleep, Stone, fruit/Stash and three tree hits; world touch blocked, fine mouse preserved, hidden default/equipment put-away persisted. PNGs show rendered controls and affected scenes. |
| Pause/Title/focus/settings → bounded graph | audio-lifecycle.json: Canvas/WebGL one AudioContext, twelve Pause and twelve Title/Continue cycles each, preference reload, clean failures/console, 120-second Canvas Title transport. |
| Credits → readable creator/source UI | credits.json and seven screenshots: both audio creators displayed; all controls/menu bounds fit at seven sizes. |

250 Node tests pass; final npm run build passes (130 modules). New regressions cover default/fallback/legacy selection, equipment toggles without inventory changes, absent Hand, action routing indoors/outside, primary context over grass and decoded sample routing. Historical farming tests explicitly equip Seed via a planting fixture. git diff --check passes.

Browser: Chrome 154, actual Canvas/WebGL; seven sizes 1440x900, 1280x720, 1024x768, 844x390, 640x360, 390x844, 360x640. Disposable contexts on 4190; user saves on 4175/4176 never injected/edited. Targeted interaction fixtures are disclosed in JSON. The previous full natural story benchmark remains in ../story-audio; no new natural-time claim.

Reproduce: npm test; npm run build; bundled Python scripts/qa/cozy-audio-audit.py; node tests/browser/cozy-controls-audio.mjs; node tests/browser/cozy-world-actions.mjs; node tests/browser/cozy-credits.mjs; GAME_URL=http://127.0.0.1:4190/ AUDIO_QA_OUT=docs/verification/cozy-audio node tests/browser/audio-lifecycle.mjs. Serve the built game on 4190 first. Optional asset regeneration: scripts/import-cozy-audio.py with bundled Python/NumPy, ffmpeg 8.0 and the user's unchanged Downloads archives. Original synthesized source audit now writes its historical inventory separately.

Limits: browser bus measurement is technical output evidence, not human listening or proof of phone speakers/headphones. Physical Android/iOS, Safari/Firefox/Edge, interruption policies, low-powered-device/slow-network behavior, comfort and final competition rights/eligibility declarations remain unverified. Existing user mute and zero-volume choices are preserved. No push, publication or submission.
