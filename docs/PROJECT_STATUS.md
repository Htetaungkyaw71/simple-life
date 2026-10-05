# Project status

**Milestone 1 — replacement craftsmanship pass, 2026-10-05.** Phaser 3 / JavaScript / Vite retained. Milestone 2 has not started. Prior working art is preserved by Git tag `art-before-craftsmanship-0.1.2`.

## Completed

- Audited five packs; selected **Serene Village revamped v1.9 by LimeZu, CC BY 4.0**. Detailed environment family replaces Tiny Town. Untouched official ZIP, source-page evidence, full licence, source rectangles, adaptation manifest and title Credits are included.
- Original expressive **24×32 boy/girl sheets: 24 frames each**, four directions with four walking frames and two idle poses. Walking 8 fps, breathing/blink idle, feet collision, interaction facing and depth retained. Original related NPC variants.
- Camera **zoom 1**, nearest-neighbour **2× source pixels**; 64px farmer frame at 1280×720 (**8.9%**). World view 40×22.5 base tiles. Each location remains 2240×1152, bounded and fullscreen.
- Baked terrain with subtle grass variants, irregular connected path edges, rounded variable pond shores, ripples and shared shore/collision geometry. Flowers/grass are excluded from water. Denser layered tree clusters, fern undergrowth, varied foliage colour, shadows and readable crown occlusion.
- Home floor reduced from 608×352 to **352×352 world units**, furnished with kitchen/sink/stove, bed, dresser, shelf, table/chair, rug, windows and plants. Clear south doorway and bed approach. Detailed exterior roofs, windows, porch steps, chimneys and storage sheds.
- Distinct green seed/red produce shopfronts with awnings; planters, market props, lamps, fountain/cobbles, NPCs and existing explorable districts. Active crop beds retain their indices, watered soil and three-day growth. Other fields remain decorative.
- Water/fountain animation, ripe glint, tiny leaf motion, butterflies, walking dust, proximity door frames and floating transaction coins.
- HUD information panel reduced 102×51 → 88×43 UI units; coin panel 70×24 → 60×21; tool slots 34×34 → 28×28 (roughly 15–20% smaller linear dimensions). Readable independent 2× UI; idle directional button backgrounds translucent. Context prompts only near objects. Title Credits has source/licence links.

## Gameplay and saving

Pure gameplay systems and crop data unchanged. New Game, Continue, both characters, Home/Farm/City travel, desktop/touch movement, collisions, shops, planting/watering/harvest, health/energy, time/sleep, pause and autosave remain playable. Start 60 coins; seed costs 10; two waterings per day across three nights produce two tomatoes; sell for 36. Version-1 key/schema unchanged. Unsafe old positions relocate to the same area's safe spawn without discarding progress.

## Controls / commands

WASD/arrows: move. E/Space: use. 1/2/3: Seed/Water/Harvest. Escape: pause. Menu arrows/Enter or pointer/touch. Touch pad, tools and USE. Pause → Save or Return to title. Title → Credits.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Production preview: http://127.0.0.1:4173/ . Refresh an existing tab. Development check used port 5174. All runtime assets are committed; optional regeneration is `python3 scripts/process-rpg-assets.py` with Pillow. Older `process-town-assets.py` is historical and must not overwrite the current art.

## Verification

- `npm test`: **10/10 pass**. Rules, malformed/denied saves, collision/spawns, map connectivity, camera scale and legacy unsafe-position preservation.
- Development and production full real-input loop: choose → explore → buy → plant → morning/evening watering and sleep over three days → harvest → sell → Save → refresh → Continue. **Day 4, 86 coins**, correct inventory/crop/stats preservation; **zero page errors or console warnings**.
- **1440×900, 1280×720, 1024×768, 844×390, 390×844**: fullscreen, no scrolling/DOM HUD, accessible controls, movement and bounded camera. Real CDP touch input verified.
- Production legacy fixture retains character, money/day, inventory, crop growth/water, health/energy and selected tool. Four distinct walking frames plus idle verified in all directions. Credits/title/help/confirmation/selection fit both compact orientations.
- Production exploration checks 16 landmarks and NPC/sign conversations. Final pond/vegetation polish passed renewed route/legacy verification with zero page errors; results are recorded under `docs/verification/craftsmanship/`.
- Production build succeeds. Eight explicit runtime art files only; vendor ZIP, licence/source HTML, manifest and unused pack files excluded. No new runtime dependencies.

## Files / systems

Added `src/art/Terrain.js`, `scripts/process-rpg-assets.py`, `docs/ASSET_CANDIDATES.md`, LimeZu vendor/licence evidence and craftsmanship verification evidence. Updated atlas/manifest/farmer sheets, map footprints/composition, world rendering, PlayerView, camera, atmosphere, HUD/menu/Credits, transaction feedback, browser tests, scale tests, README and permanent design/architecture/licence/AI/status records. Existing crop/economy/time/save modules are preserved.

## Known limits / next milestone

The visual style is richer but remains a small reusable pixel-art set: some ground/roof patterns repeat, supplemental furniture/effects are simpler than the licensed vegetation, and the farm's remote reserve fields stay sparse. The home uses a cutaway rather than a separate enterable exterior scene. Canopy transparency is a simple proximity treatment. At 844×390, a 64px frame occupies about 16% of the short screen; desktop 720px target remains 8.9%. Physical Android/iOS/notches, Safari/WebKit, Firefox and Edge are unverified; mobile results are Chromium emulation. Final human aesthetic review remains open.

Recommended next step: review this art pass and check physical devices before authorizing any Milestone 2 work. No forest, animals, combat, weapons, death, money recovery, extra crops, large story or final audio implemented. No publishing or push.
