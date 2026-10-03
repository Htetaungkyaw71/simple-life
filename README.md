# Simple Life · First Roots
Version **0.1.0 / Milestone 1** — an original tropical farming vertical slice for Digit7 Jam 2026.

## Run locally
Use Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```
Open the local URL printed by Vite (normally http://127.0.0.1:5173).

```sh
npm test
npm run build
npm run preview
```
`dist/` is the browser-compatible static build. Serve it over HTTP/HTTPS; do not double-click index.html. Relative asset paths support static subdirectories. No backend, credentials, runtime CDN, external API, analytics, downloads or tracking. Development uses Vite's local HMR WebSocket; production only loads same-origin bundled files. After loading, gameplay needs no network service.

## Play
Choose New Game and a boy or girl. Follow the doors and paths: Home ↔ Farm ↔ City. Start with 60 coins. Buy a tomato seed for 10 coins, stand beside a farm plot, select Seed and Use. Select Water and water once before 16:00 and once after. The bed lets you rest until evening or sleep until the next morning. Repeat for three successful growing days, then Harvest two tomatoes and sell them in the city for 36 coins.
Missing a watering delays growth. Two completely dry days kill the crop; Use clears it for free. Health stays at 100 in this peaceful slice. Energy is restored by sleep. At midnight you return home and start the next day. Walk for free even when exhausted.

- WASD / arrow keys: move.
- E / Space: interact with the highlighted nearby object or use selected tool.
- 1 / 2 / 3: Seed / Water / Harvest.
- Escape: pause; menus freeze time.
- Mouse/touch: clickable tools, Use button and directional pad on small screens. A nearby plot can also be clicked to target/use it.

Autosaves after actions, transitions, sleeping, every 2.5 seconds and when leaving/hiding the page. Save now is also available. Refresh then Continue. One local save per browser/origin; changing host or port creates a separate save. New Game asks before replacing an existing valid save. Storage failure is reported in the game.

## Devices and compatibility
Landscape-first 16:9 canvas with responsive HTML HUD and controls; mobile portrait supported. Target viewports: 1280×720, 640×360 and 360×640. Narrow portrait may require a little vertical scrolling; no horizontal scrolling is intended. Keyboard/mouse desktop and touch controls provided. System fonts only. Browser test results and unverified platforms are listed in docs/PROJECT_STATUS.md; do not interpret targets (Chrome, Edge, Firefox, Safari, Android/iOS) as a certification of all devices.

## Scope and records
Only Home, Farm, City and one crop are included. No forest, combat, weapons, animals, death, story ending, final music or voice. See docs/GAME_DESIGN.md, docs/ARCHITECTURE.md and docs/PROJECT_STATUS.md.
Phaser and Vite licences and dependency evidence: docs/ASSET_LICENSES.md and docs/licenses/. All procedural graphics, source and documentation were AI-assisted with OpenAI Codex; see docs/AI_USAGE.md. Human review remains to be recorded by the team before competition submission.

Team name/main contact: **to be supplied by the team**. Private repository/reviewer access, submitted commit/tag, official deployment and submission materials: **not yet submitted**. This local milestone is not the final competition entry. See docs/COMPETITION_REQUIREMENTS.md.
