# Outdoor follow-up — v0.39.0

371 tests and normal build pass. Coverage checks all City lamp bases off road surfaces, tree roots on green ground, canal/garden exclusion, saved moved-tree IDs, day/night emission/material masks and enlarged well dimensions/footprint. The through-well utility regression now derives its approach from the larger well's shared bounds. Existing map flood/merchant/house/save tests pass.

Art audit:1050 old frame records exact;14 old cells replaced;1036 old cells/non-target RGBA exact; one appended well frame;15 native exports. Town1024×3925/1051 frames remains below4096. Six full originals/18 other runtime art files and previous collection/lamp/planter pixels are exact. Build audit verifies48 runtime files and exact emitted atlas. Reproduce: node scripts/export_outdoor_followup.mjs --install; node scripts/check_outdoor_followup.mjs; npm test; npm run build.

Actual browser Continue retained880c. Daytime City view shows new fountain, boards and planted benches; nighttime view shows warm glass light and restrained pixel pools. Native movement below the plaza and new fountain highlights were checked. No save injection, teleport, purchase or clock fixture; normal time advanced. Daylight-off behavior also passes pure tests. well-size-comparison.png is an offline native comparison, not an in-game well screenshot. Direct in-game well, full per-object/touch/physical-device and other-browser checks remain unverified.

placements.json records seven moved trees/twelve lamps and stable old IDs. Six planted benches use accepted art; first accepted placement is unchanged, other footprints align from the old rear ground line. Originals and preceding runtime-art ZIP are retained in output/art/outdoor-followup-v1. No publication.
