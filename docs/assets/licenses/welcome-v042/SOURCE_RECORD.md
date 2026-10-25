# Animated welcome v0.42.0 — source and reuse record

User authorization: remove the standalone startup language modal, put language switching on the welcome screen, remove its two character figures, replace its still composition with moving water/birds/wind/leaves, improve the name/button treatment, and deploy the current version to the existing Vercel project.

Implementation: `src/ui/WelcomeView.js` is original Codex-assisted ES-module source. It paints local native meadow and river textures, draws a simple aligned wooden bridge and tiny pixel bird/leaf silhouettes, composes existing atlas images and animates the layers independently. It is not imagegen output and uses no external pixel extraction. Existing world systems and approved source PNGs are unchanged. Palette/overall camera follow the established art direction. No claim of exclusive copyright or human-only authorship.

Reused frames: house-village-3; tomato-ripe; corn-ripe; outdoor-fence-h-rail; forest-oak-0; forest-oak-1; forest-palm-0; nature-bush-small. The cottage retains the established LimeZu/Serene Village CC BY 4.0 adaptation disclosure. Crops/trees/fence/bush retain their existing generated/native source records elsewhere in this directory; no new licence is assigned. Existing bitmap/Noto fonts and cozy title music retain in-game credit links and source terms. No new third-party dependency or raster file is introduced.

The title is rendered locally in the existing Phaser UI scene with integer pixel positions, nearest filtering and a 2x UI root. Reduced-motion preferences stop scenery and fade motion. The world camera, people, simulation, local save schema and runtime allowlist remain unchanged. QA fixture pages and screenshots are local evidence only, never production files.

See manifest.json for exact source and reused runtime texture hashes. Release files are separately hashed under docs/verification/welcome-v042/runtime-manifest.json.
