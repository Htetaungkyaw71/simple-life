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
