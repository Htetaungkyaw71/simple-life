# Simple Life — stabilized Milestone 1

The approved retro pixel-art direction, Phaser canvas and camera zoom are unchanged. Current active locations: Home exterior → door-only furnished interior, and Farm. City road is closed; City and economy are the next milestone. Earlier City material below is historical.

Start as boy or girl outside Home with 60 coins, health/energy 100, unlimited watering can and harvest tool. The crate beside the house awards **3 tomato seeds once per save**. The claimed flag persists across refresh/Continue; new games start unclaimed.

The farm entrance leads directly to a labelled **4×4 ACTIVE FIELD**. Sixteen 64×64 tilled cells have 8px walking gaps; cell centres are spaced 72 world units. The original six crop indices remain first in save order. A subtle corner outline identifies the target. Prompts reflect available seeds, watering period, crop maturity and dead crops. No planting on grass/paths/decorative fields.

Tomatoes take three successful growing nights and yield two fruit. Water once before 16:00 and once after; both waterings earn one growth day. A missed watering delays growth; one fully dry day wilts, two kills the crop. Mature crops persist; dead crops clear for free. Harvests stay in inventory until future trading. Actions consume energy; walking/refill/clearing do not. The bed restores energy overnight or rests until evening without growth. Midnight safely returns the player to the interior.

Water is non-walkable. Refill contexts are on valid shoreline ground, shown only with the can selected. Use plays a short splash and confirms the can is full; capacity remains unlimited. Limited water is deferred.

House entry requires E/Use at the porch. Windows, side walls, foundations and rear have solid collision; no automatic entry or alternate wall entrances. Exiting places the player on safe ground in front. Existing saves migrate without losing inventory/money/crop progress; unsafe positions are repaired.

Controls: WASD/arrows, E/Space use, 1/2/3 tools, Escape pause, pointer/touch menus and on-screen pad/Use. Fullscreen HUD, health/energy, time/day, saving and Credits remain.

No city access, forest, animals, combat, weapons, death/recovery, extra crop types, expanded story or final audio.

## Foundation repair — 2026-10-06
Home’s south path now reaches a fence opening at the map boundary. Crossing the final edge zone automatically travels to Farm’s north edge; the reverse path returns Home. Destination spawns are two 32-unit tiles inward, face away from the edge, and have a short cooldown. Decorative signs never trigger travel. A brief fade masks map rebuilding.

The furnished interior is an actual 1344×800 tile layout. It fills desktop gameplay space; narrow screens scroll at unchanged zoom 1. Matching wall tiles replace empty green margins. Furniture keeps clear routes to the bed and south exit. House exit lands at (480,528), well clear of its foundation. The house uses atlas-derived roof/chimney/wall solids, a feet-aligned body, house-only visual clearance and normal front/behind Y sorting.

Context prompts are 28 display pixels high, sized to their text and placed above the hotbar, shifting upward when necessary to avoid the farmer. Longer menus such as sleep/pause retain their established design.
