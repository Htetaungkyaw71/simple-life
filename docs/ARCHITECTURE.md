# Architecture
Vite serves ES modules; Phaser 3 uses HTML5 Canvas for the world. Responsive HTML/CSS handles readable menus, HUD, hotbar and touch controls, independent of canvas scaling. No framework, backend, analytics or runtime external requests.
- src/data: crop definitions and location geometry/transitions.
- src/systems: serializable state, save validation, farming/economy and clock. Pure functions are independently testable.
- src/art: original procedural pixel-style environment/character drawing.
- src/scenes: WorldScene owns rendering, collision, movement and context discovery.
- src/ui: DOM interface and input adapter.
- src/main.js: application lifecycle and transactions connecting systems to scene/UI.
State is authoritative, scene is presentation. Every transaction saves; movement/clock autosave periodically and on pagehide. SaveService uses a versioned key, validates finite numeric ranges, allowed enum values, fixed plot count, crop IDs and counts, and recovers invalid positions to a location spawn. Failed storage is surfaced without crashing.
Map bounds and obstacle rectangles use a shared circle/AABB collision function. Transitions are explicit nearby interactions with fixed safe destination spawns; never immediate edge retriggers. Future areas can be added through location data and art, without changing save/inventory architecture.
