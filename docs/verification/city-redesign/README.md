# City redesign verification — 2026-10-09, v0.7.0

Baseline `fe91926`, save schema 11. `npm test`: **160/160 pass**. `npm run build`: pass, 90 modules, **12 files / 2,158,177 bytes**. New regressions cover a dry connected fourfold City, original shop/edge approaches and new districts, both bridge landings, all ten resident routes, real local directional cells, walking/nearby conversations/spacing, transient NPC state and compatible save repair. `git diff --check` and Python source compile pass. Existing farming, vegetation, Forest, City economy, sleep, recovery, responsive UI and save tests remain green.

## Native browser proof

`tests/browser/city-redesign-server.mjs` serves built output on isolated `127.0.0.1:43863`, preparing only named QA fixtures and read-only `data-qa-state` canvas telemetry. No fixture query, storage injection or test telemetry goes into production. Real pointer/keyboard inputs are sent through the Codex in-app browser; no browser-state mutation via evaluation. Normal 4175 storage remains untouched. The prior preview was stopped; it was restarted on 4175 and opened as a deliverable tab at the normal title/Continue screen.

- Day market, residential square, garden commons, picnic/tents, canal/wooden bridge and Home cottage inspected at the default 1280×720 viewport. `market-day.jpg`, `residential-square.jpg`, `garden-commons.jpg`, `picnic-camp.jpg`, `riverside.jpg`, `home-house.jpg`.
- June/Mara conversations opened with E; residents stop/facing follows the nearby player. `conversation.jpg`, `home-conversation.jpg`. No persistent NPC rewards, relationships or schedules.
- Seed purchase: 60→50 coins and 0→1 Tomato seed. Produce sale: 60→81 coins and 2→1 Tomato. Cream panels/dark text remain readable. `seed-shop.jpg`, `produce-shop.jpg`.
- Walked the actual bridge at x1800/y133 with `wading:false`; an initial off-deck movement at x1730 showed the expected wading and was corrected to the deck. `bridge-crossing.jpg`. City bridges/river also pass pure shared-water geometry tests.
- Home E entry reached interior. City west exit reached Home; first quick attempt stayed at the edge during the existing travel cooldown, then holding movement through the cooldown verified travel. Original edge cooldown/gate behavior is preserved. Read-only results: `browser-checks.json`.
- 360×640 browser emulation: readable HUD/camera/hotbar, no City Map button, touch D-pad moved 640→588, USE opened June's readable wrapped dialogue. `phone-city.jpg`, `phone-conversation.jpg`. Restored the viewport override afterwards.
- Night market shows closed merchants, restrained lamp filaments/pools and unchanged separate bright UI. `market-night.jpg`. Browser warning/error log was empty.

These are real browser captures, not offline mockups. Physical devices, other browser engines, sustained performance and final human art/balance/legal review are not claimed. Decorative cottages/gardens/camp do not add new interiors, purchases or progression. North bridges connect to the narrow riverside bank, not a new location. NPC movement resets on location entry and pauses with menus. Existing invalid City positions/retired vegetation coordinates repair through current schema-11 validation; money, crops, wood and other known progress stay intact.

## Art/build audit

`runtime-audit.json`: 560→662 frames; 554 prior cells and every prior coordinate/size preserved. Changed cells are five house aliases plus shed; all six alpha silhouettes stay identical. Both supplied farmer sheets and six non-town runtime art files are byte-identical. Selected Pipoya game cells and six original town props occupy the existing atlas. No vendor archive, raw pack/source sheet, licence evidence, Python/test/QA file or manifest is packaged. Source/licence evidence: `../../assets/licenses/city-redesign.md`, `../../assets/licenses/pipoya/README.md`. No new dependency or runtime remote request. Full source regeneration requires the separately acquired official free Pipoya ZIP via `SIMPLE_LIFE_PIPOYA_ZIP`; the build needs only committed art.
