# Technical notes — stabilization
Phaser 3.90.0 / Vite 6.4.3 / JavaScript ES modules. HTML5 Canvas renderer, fullscreen RESIZE, pixelArt, antialias false, rounded pixels and nearest filtering. Source pixels display at 2× with zoom 1; UI is independently 2×. Outdoor maps remain 2240×1152 with bounded follow camera. Separate existing Home interior centres on taller screens and follows the farmer below 600px height. No visible DOM game panels.

Same-origin HTML/CSS/JS/PNG/JSON/XML only; no backend, accounts, analytics, tracking or runtime remote assets. Eight runtime art files are allowlisted; vendor archives and unused pack files are excluded. Dev uses Vite HMR. Production is about 1.6 MB uncompressed, mainly Phaser.

The `simple-life.save.v1` key now stores schema version 2. Validation migrates v1 crops without reordering the first six indices, expands to sixteen plots, validates starter reward status and repairs unsafe positions. Old City saves return to Home; old cutaway-room coordinates migrate to the interior. Economy data remains dormant; City has no active connection. Growth, two daily waterings and energy rules remain unchanged.

Shared building masks and pixel-accurate pond rows drive both validation and Phaser static collision bodies. Movement tests the same 24×24 feet footprint. Development `?collisions` displays outlines; production compiles that path out. Read-only `?qa` snapshots support isolated browser tests. No development galleries ship in dist.

Current verification: sixteen Node tests, full production farming/starter/house/pond/save loop, both character animations, touch and five viewport sizes. Separate compact-interior tests cover the final camera correction. Physical devices and non-Chromium browsers remain untested. See VERIFICATION.md for current versus historical suites.

Optional art regeneration requires Python/Pillow: scripts/generate-pixel-assets.py (original atlas/font), scripts/process-rpg-assets.py (licensed environment adaptation and original sprites). scripts/verify-character-frames.py checks all 48 farmer frames and writes evidence galleries. npm install/build does not require Python. Serve dist over HTTP/HTTPS; relative paths support subdirectory hosting. No publishing/submission in this task.
