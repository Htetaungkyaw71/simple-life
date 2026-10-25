# Revised farmer v2 verification — 2026-10-14

User approved the revised appearance and requested complete sprites. The independent byte audit in audit.json passes:168native64×64frames,48exact48×48crops, seven packed sheets,28clips,32shared opaque colours, binary alpha, no ink on cell edges, pixel-identical sheet cells/crops, west-run mirror and ten unchanged source hashes. ZIP CRC and file-count checks pass (266files). Reproduce with node scripts/package_farmer_boy_v2.mjs; this packages existing art without changing frame pixels.

The interactive reviewer was checked in the in-app browser: west-running phases advance through all8poses while paused, half-speed playback and previous-version comparison work. The user visually accepted the revision. This does not certify engine collision, stride/movement matching or action contact events. Those remain integration decisions; no game runtime replacement was requested.

Project regression results and production-isolation check are recorded in checks.json after the final packaging changes.

Final checks:318/318tests pass; npm run build passes. All225tracked runtime/config files remain byte-identical to HEAD. The46-file production build excludes this export. The self-contained reviewer displays south idle and the bundled comparison, with no browser console errors. Browser ZIP download succeeds and SHA-256 matches the project archive; a copy is now in the user Downloads folder.
