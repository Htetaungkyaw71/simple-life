# Simple Life - GPT-6 Master Build Prompt

Build a complete, competition-ready browser game named **Simple Life** in the current workspace. This is an original top-down 2D pixel-art farming, exploration, economy, and light survival game. The developer is a beginner, so keep the architecture understandable, document important systems, and favor a small polished game over a large unfinished one.

## Role and collaboration

Act as the lead game engineer, game designer, UI designer, technical artist, QA engineer, and documentation partner. Make reasonable in-scope decisions without repeatedly asking questions. Explain major decisions in plain language, but spend most of the task producing and verifying the playable game.

If the workspace is empty, scaffold the project. If it already contains code, inspect it first and preserve useful work. Do not stop after writing a plan. Implement a playable vertical slice, verify it, and continue expanding it toward the completion criteria below.

The user authorizes local project creation, dependency installation, code edits, asset creation inside the workspace, non-destructive testing, browser testing, production builds, and meaningful local Git commits. Ask before purchases, external publishing, pushing to a remote repository, deleting material user data, or materially expanding the agreed scope.

## Goal

Deliver a polished HTML5 game that opens in a browser without installation and demonstrates this complete loop:

1. Choose a boy or girl character.
2. Start at the homestead with a small amount of money and basic tools.
3. Buy seeds in the city.
4. Plant seeds on the farm and water them during morning and evening periods.
5. Advance through day and night, sleep to restore energy, and harvest mature crops after three in-game days.
6. Sell harvested produce in the city for money.
7. Explore the forest for free fruit and valuable resources.
8. Avoid or fight hostile wild animals using weapons purchased in the city.
9. Lose carried money at the death location, revive in bed, and return to recover the dropped money bag.
10. Reinvest earnings in better seeds, tools, weapons, and farm progress.

The main story goal is to earn enough money to repair the farm's broken water pump before the rainy season. Completing the goal shows an ending and score/rank, then allows continued play in endless mode.

## Technology

Use this stack unless the existing workspace already has a compatible equivalent:

- Phaser 3.90.0
- JavaScript ES modules
- Vite
- HTML and CSS for the page shell
- LocalStorage for saves, settings, and high scores
- Vitest or small deterministic unit tests for pure gameplay systems where useful
- All runtime assets bundled locally

Do not add React, a backend, authentication, analytics, advertising, remote leaderboards, external APIs, or runtime CDN dependencies. The core game must continue working without third-party services.

Pin dependencies with a lockfile. Provide `npm run dev`, `npm run build`, `npm run preview`, and `npm test` where tests are included.

## Competition constraints

The game is for an HTML arcade competition and must satisfy these requirements:

- Browser-playable HTML5/WebGL game with no separate installation.
- Runs from an HTTPS-compatible static deployment.
- Supports current Chrome, Edge, Firefox, and Safari as far as practical.
- Must pass at minimum on one desktop browser and one mobile browser.
- Desktop controls and mobile touch controls must both work.
- Responsive at a 1280x720 desktop viewport and a small mobile viewport; use a landscape-first 16:9 game area with responsive scaling, safe-area padding, readable UI, and no horizontal page scrolling.
- Keep the production ZIP well below 200 MB.
- Target initial loading within 10 seconds on a stable connection; show a loading indicator when needed.
- No crashes, repeated freezes, severe persistent lag, hidden tracking, personal-data collection, cryptocurrency code, automatic downloads, forced redirects, or undeclared network requests.
- All assets, fonts, sounds, tools, libraries, and AI use must be documented with source and license evidence.
- The hosted build, ZIP build, repository commit/tag, README, screenshots, and demo must describe the same version.

## Product identity and originality

Create an original game. The linked game Plant Tales and games such as Stardew Valley may be general genre references only. Do not copy their sprites, maps, layouts, UI, characters, dialogue, source code, progression tables, sound, music, or distinctive visual designs.

Give Simple Life its own identity:

- Fictional tropical rural setting with monsoon atmosphere.
- Warm, hopeful tone with gentle survival tension in the forest.
- Original map layouts and original characters.
- Clear visual contrast between cozy homestead, lively city market, and dangerous forest.
- Non-graphic combat. Defeated animals flee or disappear without blood or gore.
- Do not use real brands, logos, copyrighted characters, or recognizable real people.

## Scope

Create exactly three connected areas:

### 1. Homestead

- Farm plots, small house, bed, storage chest, water source, and broken irrigation pump.
- Home and farm are one map to control scope.
- Bed interaction advances to the next day and restores energy.
- Storage chest protects deposited money and stores items.

### 2. Forest

- Trees, paths, free fruit, common resources, two hostile animal types, and one deeper high-risk area.
- Common fruit appears near the entrance; rarer fruit appears deeper in the forest.
- Animals use simple readable states: idle, wander, alert, chase, attack, hurt, and retreat/defeat.
- Include clear warning feedback before attacks.

### 3. City

- Seed shop, produce market, and weapon/tool shop.
- The MVP may use shop counters and menus rather than many walking NPCs.
- Include a few short text-dialogue characters only if they improve clarity or story.

Transitions between areas must be clear, quick, and stable. Preserve player state when changing areas.

## Player

- Character selection: boy or girl.
- Use one shared animation rig where possible, with original hair/clothing variations to reduce asset work.
- Player stats: 100 health and 100 energy.
- Show health and energy clearly without covering gameplay.
- Walking costs no energy.
- Farming actions, harvesting, attacks, and dodge actions cost energy.
- When energy reaches zero, energy-consuming actions are disabled and a helpful message explains that the player should eat or sleep.
- Food may restore a small amount of health or energy.

Desktop controls:

- WASD and arrow keys: move
- E: interact/use selected item
- Space: attack or contextual primary action
- Shift: dodge
- 1-8 or mouse wheel: select hotbar slot
- Escape: pause/settings

Mobile controls:

- Virtual movement joystick or directional pad
- Large contextual Use/Attack button
- Dodge button
- Touch-friendly hotbar
- Buttons must respect mobile safe areas and remain readable

## Day, night, energy, and sleeping

- One in-game day should last approximately 4 minutes during development and remain configurable.
- Show day number, clock/phase, weather indicator, money, health, and energy.
- Use morning, afternoon, evening, and night visual states.
- Plants have morning and evening watering opportunities.
- At night, encourage the player to return home. Sleeping is the normal way to restore energy and start the next day.
- If the player stays out too late, fade out and return them home with a small consequence that is explained clearly.
- Save automatically after sleeping and on important transitions.

## Farming

Use a data-driven crop system so balancing does not require changing scene code. Each crop definition should include:

- id and display name
- seed price
- sell price
- growth days
- harvest yield
- watering state
- growth-stage sprite keys
- regrow behavior if applicable
- unlock requirement

Support these ten crops in the data model:

1. Tomato
2. Chili
3. Eggplant
4. Cucumber
5. Strawberry
6. Watermelon
7. Papaya
8. Banana
9. Orange
10. Mango

Implementation priority:

- Fully finish and balance the first four crops before expanding visual assets and balancing to all ten.
- All crops should be selectable through data, not hard-coded branches.
- Standard crops mature after three successful in-game days.
- The player can plant only on valid tilled plots.
- Show distinct states: empty, planted, sprout, growing, mature, wilted, and dead.
- A plant should receive morning and evening water. Missing one watering lowers quality or delays growth. Missing a full day makes it wilt. A second consecutive fully dry day kills it.
- Give immediate visual and sound feedback for tilling, planting, watering, harvesting, wilting, and maturity.
- Prevent accidental duplicate planting or watering exploits.

## Inventory, tools, and items

- Provide an eight-slot hotbar and a simple inventory panel.
- Stack identical items.
- Include clear tooltips with item name, quantity, use, and sell value.
- Required tools: hoe, watering can, gathering action, and one starter self-defense weapon.
- Required purchasable weapons: wooden staff and iron sword.
- The watering can may have a simple water capacity if it remains understandable and fun; otherwise use unlimited water for the competition build.
- Protect against item duplication, negative quantities, and purchases without sufficient money.

## Economy and shops

- Start the player with enough money to buy a few basic seeds.
- Seed prices progress from cheap to expensive across the ten crops.
- Higher-cost crops provide better absolute returns without making early crops useless.
- Produce and forest fruit can be sold at the city market.
- Weapons and tool upgrades are purchased in the city.
- Keep prices and yields in editable data files.
- Add clear buy/sell confirmation, quantity control, insufficient-funds feedback, and inventory-full feedback.
- The city visit should make the progression loop obvious: sell, upgrade, buy seeds, return to farm.

## Forest, animals, and combat

- Forest fruit can be collected for free and respawns on a controlled schedule.
- Implement two animal types for the finished MVP, with room for more through data definitions.
- Combat includes attack, short cooldown, hit feedback, knockback, damage, brief invulnerability, and dodge.
- Player attacks require energy.
- Make enemy telegraphs fair on desktop and mobile.
- Prevent attacks through blocking map collision.
- Avoid complex combo trees, crafting trees, armor systems, ranged combat, boss fights, or procedural map generation in the MVP.

## Death and money recovery

- At zero health, the player faints and wakes in the home bed with restored health and energy on the next morning.
- Money stored in the home chest is safe.
- Carried money drops in one visible bag at the death position.
- Returning to that location lets the player recover the bag.
- If the player dies again before recovering it, the previous bag is lost and replaced by the new one.
- Persist the dropped-bag location, area, and amount in the save data.
- Prevent the bag from spawning inside walls, water, or unreachable tiles.
- Explain the system the first time the player dies.

## Story and ending

- Use a short original opening that explains the broken farm pump and approaching rainy season.
- Set a configurable repair cost and target day.
- The city contains the repair interaction or repair vendor.
- When the player pays the repair cost, show a short ending scene and performance rank based on days taken, money remaining, crops discovered, and forest exploration.
- Allow the player to continue in endless mode afterward.
- Keep dialogue brief and easy to localize. Store dialogue in data rather than embedding long text in scene code.

## UI and accessibility

- Title screen: New Game, Continue, How to Play, Credits.
- Character-selection screen with boy and girl preview.
- HUD: health, energy, money, time/day, selected item, contextual interaction hint.
- Pause screen: Resume, Controls, Audio, Restart Day if safe, Return to Title.
- Settings: music volume, sound volume, reduced screen shake, and control help.
- Use strong contrast, large mobile-readable text, and color plus shape/icon cues.
- Do not communicate crop health or danger using color alone.
- Pause simulation when menus are open.
- Include a short interactive tutorial or contextual tutorial messages that can be dismissed and do not repeat unnecessarily.

## Visual and audio strategy

Do not block implementation while waiting for final art. Start with original placeholder graphics drawn using Phaser Graphics or clearly licensed CC0 placeholders. Replace them gradually.

Target a cohesive original 32x32 pixel-art look with nearest-neighbor scaling and no texture smoothing. Keep the palette warm at home/city and cooler/darker in the forest/night. Avoid imitating the exact palette or sprites of any reference game.

For final assets:

- Use original human-edited art, AI-assisted art that has been reviewed and substantially integrated, or assets with verified CC0/CC BY/OFL-compatible licenses.
- Never use assets with unknown terms or non-commercial restrictions.
- Save a local copy of each applicable license or source record.
- Prefer a small consistent asset set over many mismatched packs.
- Use text dialogue and simple nonverbal character sounds for the MVP. Full voice acting is out of scope.
- Use one daytime music loop, one forest/night loop, and a small set of action/UI effects.
- Audio must begin only after user interaction to respect browser autoplay rules.

## Code architecture

Keep systems modular and readable. A suitable structure is:

```text
src/
  main.js
  config.js
  scenes/
  systems/
  entities/
  ui/
  data/
  utils/
assets/
  images/
  audio/
  fonts/
docs/
  licenses/
```

Recommended scenes:

- BootScene
- PreloadScene
- TitleScene
- CharacterSelectScene
- HomesteadScene
- ForestScene
- CityScene
- UIScene
- EndingScene

Recommended pure systems/data services:

- SaveService with versioned schema and safe defaults
- TimeSystem
- FarmingSystem
- InventorySystem
- EconomySystem
- CombatSystem
- AudioService
- Input abstraction for keyboard and touch

Avoid giant scene files. Keep state transitions explicit. Do not create abstractions that add complexity without helping this game.

## Saving

- Use a versioned LocalStorage save schema.
- Save character choice, area, safe position, day/time, health, energy, inventory, hotbar, money carried, protected money, crop plots, unlocks, purchased tools, settings, pump objective, and dropped-money bag.
- Validate loaded data and recover gracefully from missing or old fields.
- Provide a New Game confirmation before overwriting an existing save.
- Include a developer-only reset-save control that is not prominent in the final player UI.

## Asset, license, and AI documentation

Create and maintain these files from the beginning:

- `docs/ASSET_CREDITS.md`
- `docs/AI_USE_DECLARATION.md`
- `docs/ORIGINALITY_DECLARATION.md`
- `docs/TECHNICAL_NOTES.md`
- `docs/licenses/`

For every external asset record the asset name, local file, creator, source URL, license, download date, and modifications. For every material AI-assisted asset or code area record the tool/model, date, purpose, affected files, prompt or prompt summary, and human review/modification.

Credit Phaser, Vite, fonts, tools, plugins, music, sounds, and art. Do not falsely claim that AI-generated work was manually drawn. Do not commit secrets, API keys, private credentials, or personal data.

## Development sequence

Work in playable milestones:

1. Scaffold, page shell, responsive canvas, loading, title, character selection, and documentation files.
2. Create a vertical slice with movement, Homestead, one crop, time, watering, sleeping, harvesting, inventory, city shop, selling, saving, and desktop/mobile controls.
3. Add the Forest, fruit collection, two animals, combat, health, energy, death, dropped money, and recovery.
4. Expand crop data and assets, add progression, weapons, protected storage money, story objective, ending, and endless continuation.
5. Polish art, sound, feedback, tutorial, accessibility, performance, compatibility, and submission materials.

After each milestone, keep the game runnable and fix blocking regressions before expanding scope. If Git is initialized and identity is configured, create a small meaningful local commit for each stable milestone. Never push or publish without explicit approval.

## Validation

Before calling the game complete:

- Run the production build successfully.
- Run the most relevant unit tests or deterministic system tests.
- Launch and play the built game through a local HTTP server.
- Inspect browser console errors.
- Test a full loop: new game, character select, buy seed, plant, water, advance days, harvest, sell, explore forest, take damage, attack, die, revive, recover money, save, reload, and continue.
- Test keyboard controls and touch controls.
- Test responsive layouts at approximately 1280x720, 640x360, and a narrow mobile viewport.
- Test or clearly document limitations for Chrome, Firefox, Safari, and mobile browsers.
- Verify menus pause gameplay and UI does not clip or overlap.
- Verify the final build uses only local declared runtime assets and makes no undeclared network calls.
- Check the production build size and loading behavior.
- Reopen the save after refresh and confirm important state persists.

If a full test cannot be run, perform the best available substitute and document the remaining verification clearly.

## Submission outputs

Produce these final artifacts:

- A production build whose root contains `index.html` and all runtime files.
- A clean playable-build ZIP containing runtime files only.
- `README.md` with setup, controls, browser/device support, viewport/orientation, gameplay, build steps, known issues, repository commit/tag placeholder, version, and testing instructions.
- `docs/ASSET_CREDITS.md`
- `docs/AI_USE_DECLARATION.md`
- `docs/ORIGINALITY_DECLARATION.md`
- `docs/TECHNICAL_NOTES.md`
- `docs/DEMO_VIDEO_SCRIPT.md` for a 1-3 minute demo.
- `docs/SCREENSHOT_PLAN.md` covering title, farming gameplay, forest/combat, city/shop, and result/ending screens.
- A release checklist that ensures the playable URL, ZIP, repository version, README, screenshots, and demo all match.

Do not place source code, screenshots, demo videos, or documentation inside the playable-build ZIP.

## Completion criteria

The task is complete only when:

- A new user can start and understand the game without developer assistance.
- The core farming-to-selling loop works.
- The forest risk/reward loop works.
- Health, energy, time, sleeping, combat, death, dropped money, recovery, and saving work together.
- At least four crops are fully polished and the ten-crop data architecture exists.
- The game is playable with keyboard and mobile touch controls.
- The production build succeeds and has no known blocking console error.
- Required documentation and licensing records exist.
- Remaining stretch features are clearly separated from required competition scope.

## Scope control

When time or complexity threatens completion, protect these features first: movement, character choice, three areas, four polished crops, watering and growth, inventory, shops, health/energy, day/night, forest collection, two animal types, simple combat, death/money recovery, saving, responsive controls, story goal, and required documentation.

Cut or postpone these first: additional NPC schedules, romance, multiplayer, crafting trees, weather simulation beyond simple visuals, procedural generation, pets, vehicles, fishing, cooking depth, armor, skill trees, complex quests, boss battles, online features, full voice acting, and decorative building customization.

## Communication and stopping rules

Before the first major tool action, briefly state the first implementation milestone. During work, report only meaningful progress, a finding that changes the plan, or a real blocker.

Ask a question only when missing information would materially change the game or create legal, destructive, external, or paid consequences. Otherwise choose a sensible default, document it, and proceed.

Do not declare completion because files were created. Completion requires a working production build, browser verification, core-loop testing, and the required documentation. Lead the final response with what is playable, then list validation performed, material limitations, and the next highest-value action.
