# One vertical planter-bench integration — v0.37.1, 2026-10-16

Refresh127.0.0.1:4215, Continue, travel to City and inspect the planted seating directly below the seed stall, left of the central fountain. One existing City planted bench uses the approved vertical design; the other five keep their previous art. The game does not teleport the user's save or require buying the prop.

- Selected original1536×1024 preserved unchanged; separate68×87 native derivative, nearest1.5× world rendering, vertical long axis and parallel side seats, no added shadow/glow.
- One town frame appends; all1040 preceding records and complete old RGBA remain exact. The18 other runtime art files, including the home/farmers, match baseline. Sources/backups remain in output/art/planter-bench-v1.
- One96×94 ground footprint replaces the old broad mask. Unit tests confirm blocked wood, clear side/front/back approaches, dry placement and both market lanes. Character size/camera, merchants, economy, purchased decoration and save schema remain.

365 tests and normal production build pass. art-audit.json checks source/native/installed pixels and prior-frame preservation. build-audit.json verifies the48-file runtime allowlist, exact emitted town PNG/JSON and source/archive/review exclusion. native-inspection.png is an offline nearest enlargement, **not an in-game screenshot**.

Actual browser visual/keyboard/touch interaction is unverified: the browser tool previously rejected localhost under its URL security policy and explicitly prohibited alternate-browser/CDP workarounds. No workaround or user-save fixture was used. Prior local HTTP checks were also sandbox-blocked; the4215 server listener is present, but no new response check is claimed. Human in-game scale/perspective acceptance and physical-device testing remain open. No publish/push/deploy.
