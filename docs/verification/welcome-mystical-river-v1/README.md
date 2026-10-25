# Mystical Forest River welcome verification

Verified locally on 2026-10-23 against the production `dist/` build served only from `127.0.0.1`.

## Results

- Default desktop viewport: 1440×778. The front-facing forest river fills the canvas, dark side foliage frames the scene, and the title, four menu actions and language controls remain centred and readable.
- Short landscape: 640×360. The established two-column menu remains fully visible over the river without clipping.
- Phone portrait: 390×844. The complete stacked menu and both language controls remain visible without overlap.
- Recording-size desktop: 1990×1118. The old rectangular travelling-line layer is absent; sampled frames show only short, low-alpha wavelet changes inside the conservative source-space river channel, with no strokes on the visible rocks, bridge or shoreline plants.
- Title-clarity follow-up at 1990×1118: the title's eight-direction dark outline and deeper shadow remain crisp over the brightest clearing while the subtitle, ornament, menu, backdrop and animation are unchanged.
- Play and Credits opened successfully from the live title scene.
- Browser console inspection found no game-page warnings or errors. One Chrome-extension-only `removeChild` message was unrelated to the game.
- `node --test tests/welcome.test.js`: 7/7 pass, including exact title-layer checks and wavelet containment at ten layouts.
- `npm test`: 411/413 pass; the two failures are the already-documented unrelated barber-grass provenance and Pixel Snapper frame-count assertions.
- `npm run build`: pass, 190 modules transformed.

## Captures

- `desktop.jpg` — 1440×778
- `landscape-640x360.jpg` — 640×360
- `portrait-390x844.jpg` — 390×844
- `water-wavelets-1990x1118.jpg` — 1990×1118 follow-up at the supplied recording size
- `title-outline-1990x1118.jpg` — 1990×1118 title-only clarity follow-up

The browser captures are review evidence only and are ignored by the production asset pipeline. Physical devices and non-Chromium engines were not newly checked.
