# v0.25.0 — girl farmer rig (2026-10-13)

Starter appearance index 6 (Garden outfit/Autumn look) resolves to the girl texture with the shared FARMER rig; index 0 still resolves to the approved male. Both preload as 48×48 sprites, and title/selection/wardrobe previews use the same feet anchor. GIRL_HANDS supplies each pose's actual opaque skin-pixel centres. Existing rig-aware water cropping/reflection, depth and grounded jump arc require no new system. scripts/generated_girl.py reproduces native conversion/packing and the reusable PNG/ZIP/GIF exports. people_art.py calls both approved farmer packers when rebuilding legacy assets. Source, archives and previews stay outside the runtime allowlist. No dependency, gameplay speed, collision, economy or save-schema change.

---

# v0.24.0 — per-player visual rig

`playerVisual` resolves the approved farmer to the existing boy texture for Worker/Classic, with 48×48 cells and originY=40/48. Legacy appearances/NPCs keep their 24×40 rig. A shared rig drives actual player frames and UI previews; source hand coordinates are injected into held tools. Water cropping uses the native ground row, and flipped reflection origin accounts for transparent padding. Save schema/physics remain unchanged. Native RGBA packing never resamples source art. Repacking Szadiart assets also calls the farmer packer to preserve the approved boy texture.

---

# v0.20.2 — depth rendering

Two small rendering modules add cached nearest-filtered pixel shadows and pure crown overlap. Rails are short foot-sorted Graphics sections; decks remain opaque. No asset files, geometry/collision or save format changes. Tests and browser/device limits: verification/pseudo-depth/README.md.

---

# v0.20.1 — cave retirement

Five feature modules are removed and the normal/playtest build returns to 143 modules. Save normalization drops legacy curse data while preserving established gameplay fields. Generated cave textures and the specific cave collider/map marker are gone. NPC curfew and recoverable outdoor bags remain. Full checks/device limits: verification/curse-removal/README.md.

---

# v0.20.0 — optional cave implementation

Data/pure systems own cave guards, repair spends, timer bounds and nightly pursuit. Saved ghost timers are active milliseconds, clamped per simulation step consistently with existing combat; menus/hidden tabs do not advance them. Midnight retains the current night; dawn/new nights clear/reset ghosts. Scene changes relocate outdoor spirits with an arrival telegraph; the interior clears visible ghosts. Axe targeting prefers a valid close spirit before nearby cave/vegetation, preserving contextual mobile Hit. Repair/cache mutations happen before saves, preventing repeat-click rewards. Legacy records default sealed; restored records require full paid costs. Reuse existing stash recovery for all outdoor areas; validate farm domain.

CavePanel measures actual font bounds, paginates every warning paragraph, guards final confirmation by proximity/stage and restarts warning reading after resize/language changes. Remote repair cards show paid totals and disable contributions away from the entrance. The same original cave texture is used in world and UI; new ghost warning uses native m5x7 at integer 2× scale. Normal/public runtime inventories remain separate, and only the audited static playtest stage is deployed to the existing target.

---

# v0.19.0 — Unicode shaping and bounded mobile text

Local FontFace loads the allowlisted original Noto Sans Myanmar UI TTF before boot (8-second failure limit). Whole-run Phaser Text preserves Myanmar ligatures/stacked marks; Intl.Segmenter(my, word) wraps at language word boundaries, with a punctuation/space fallback. Integer font sizes/resolution/scales and nearest filtering remain; numeric controls and Latin brand retain their original bitmap font. Glyph rasterization is handled by Canvas, while game texture antialias remains disabled.

Empty dynamic labels use Myanmar-capable Text; explicitly numeric counters retain Latin bitmap rendering. Landscape crop cards reserve the action column, and prompts clear joystick/Jump hit areas. Language switching rebuilds scene labels from existing state, then restores the calling title/pause menu. Original IDs and actions remain stable. Language preference is independent of save data. Text-only guide/description pages pause time, use measured line budgets, and preserve full copy through navigation/details. Compact shop feedback shares the stock row only when needed, avoiding the shortest-landscape overlap. Font failures keep English playable; native-speaker/Safari/physical-phone validation remains pending.

---

# v0.18.5 — bounded trade layout and silent house entry

TradePanel replaces the subtractive lift calculation with fixed header/tab bands and a compact two-column body below 190 logical pixels of available height. Compact panels may expand to 336 logical pixels wide while respecting side/bottom safe insets; tall panels cap at 252×225. Below 160 logical pixels of panel width, the info button moves to the header and the balance moves above the quantity row (hidden in details mode). Selected names/counts/price and measured detail rows wrap at native font size. Quote controls retain full count/total labels. Safe-area centering uses the remaining usable rectangle. Catalogue, gates, prices, quantity behavior and transaction/save systems are unchanged.

Application.travel only requests the existing door effect when leaving the interior; entry is silent. MobileControls stops constructing captions, centers glyphs and retains semantic Use/Hit labels and actions. Hud uses its existing map glyph instead of rendered Map text. Font size/parent scale, filtering and fullscreen separate canvas architecture are preserved.

---

# v0.18.4 — native bitmap UI text

WorldScene loads thaleah/m5x7 PNG/XML bitmap fonts alongside the original world font and applies NEAREST. pixelWidgets.text selects the font by semantic heading/body role, translates legacy requested sizes into whole 16px native multiples, reduces headings by whole steps when needed, and adds two logical pixels of leading. Buttons use native body text, measured vertical centering, 6 CSS pixels of side padding and bounded abbreviated display labels; control labels/IDs remain intact. coloredFont copies the whole __BASE sheet, disables smoothing and applies source-in colour; Canvas and WebGL share those glyphs/metrics. Renderer antialias/antialiasGL are disabled. UI root remains scale 2 and clock text has no fractional ancestor. The .75 vitals container contains graphics only.

ResourceView reserves bands and switches to two material columns without a redundant main preview below 160 logical panel pixels. Journal/completion text wraps at native size and paginates against the footer. Large stock counts abbreviate on slots while Bag selection shows the exact count. Caption controls remain at least 44 CSS pixels in tested mobile layouts; Jump/Use return to 56px to fit the requested font/padding. Read-only QA snapshots expose visible UI text bounds/font/native size/ancestor scales. The offline recorder loads actual XML metrics and preserves the original world-font metrics separately.

House camera zoom is 1 on mobile (outdoor compact framing remains .75). No map, collision, furniture or save-schema changes. Cold door playback queues the actual recording for up to 1.5 audio-clock seconds; there is no synth door fallback. Outdoor travel remains outside effect/preload mappings. Normal/playtest builds preserve their existing balance isolation.

---

# v0.18.3 — compact gameplay HUD and landscape camera

The UI scene remains at 2× logical pixels. Only noninteractive mobile vitals/clock containers use an additional .75 presentation scale; hit-tested toolbar/action controls are redrawn at 24 logical units, and the joystick uses a 24-unit radius. Touch coordinate conversion and read-only snapshots remain consistent with the existing 2× scene. Portrait toolbar and landscape joystick/action reservations move inward/down to release gameplay space; navigation/crop-panel floors track these positions. Menus retain their previous readable sizing.

displayZoom accepts optional coarse-pointer capability. Compact landscape views (width below 1000, or coarse pointer with height below 600) use .75; other views retain the existing 1/1.5 rules. WorldScene supplies the actual media capability outdoors/indoors and uses existing follow/bounds/room handling. At 844px width this exposes about 1125 world units versus the prior 844; a 1440px desktop at 1.5 exposes 960. Actual phone dimensions differ, so this is a landscape framing choice rather than a universal phone/desktop coverage guarantee.

---

# v0.18.2 — optional TouchManager at startup

Phaser InputManager leaves `touch` null on devices without touch capability. The ready handler guards `touch?.target` before accessing/replacing onTouchCancel, allowing non-touch scene startup to continue. The scoped cancellation wrapper remains active on touch devices. Native startup checks explicitly set hasTouch/isMobile false for desktop and true for portrait/landscape phone profiles in both renderers, and use ordinary inputs with fresh saves.

Phone preview: `npm run preview -- --host 0.0.0.0 --port 4198 --strictPort` exposes the existing static dist on LAN. Vite prints the current Network URL; the Mac and phone must share a reachable local network. This does not deploy the game or add a backend.

---

# v0.18.1 — rotation input lifecycle

UI layouts remember their physical viewport dimensions and call Phaser InputPlugin.resetPointers on a changed size, reclaiming touches whose release was cancelled during rotation. The orientation handler also resets movement/pointers, then schedules canvas fitting immediately and after 250ms. Fitting compares real canvas bounds as well as logical size and refreshes Phaser's displayScale when the canvas moves without resizing. Window resize, orientationchange/screen.orientation change and visualViewport resize/scroll supplement an optional host ResizeObserver; all listeners/frames/timers are removed on destruction. A scoped wrapper of the pinned TouchManager.onTouchCancel preserves its processing/capture behavior while checking event.cancelable before preventDefault. Vendor source is untouched.

Short landscape menus keep the established 2× pixel UI rather than squeezing the entire game. Bag pagination derives its page size from the six-column one/two-row layout, and keyboard row movement uses the actual column count. Audio controls use two columns; tiny Journal panels show the active step/directions. New narrow-HUD tool access remains through the existing Bag / Gear. Current verification is under verification/mobile-rotation.

---

# v0.18.0 — additive judge polish

Architecture remains ES modules, pure gameplay systems, one fullscreen Phaser game canvas with separate World/UI scenes, same-origin allowlisted assets and localStorage. No new dependency, backend or runtime remote service. `npm run build` explicitly sets `VITE_PLAYTEST=false`; only the explicit flag authorizes credit, independent of host/query/DEV. Existing gifted saves are not debited.

`wateringCan.js` shares a single stopped ray between rendering and mutation, using current-farm visiblePlots, plotAt, openGround and shared collision lineClear. The whole action checks energy before touching plots. Basic usePlot accepts an internal waterCost override only for this batch. Ownership and active-time foodCooldown are optional schema-18 additions with validation; balanceRevision makes the crop-duration migration idempotent. Previously ripe Cucumber/Sweet Potato remain ripe; partial growth/care, old owned farms, paid decor, saves and story completion persist. Restored completed stories receive the newly introduced board flag.

A ResizeObserver on the fullscreen host plus visualViewport resize schedules a layout-frame ScaleManager.resize with actual parent dimensions. This fixes mobile rotation retaining the previous viewport dimensions; existing World/UI resize handlers and room-safe furniture relocation remain.

`simulationActive` gates time, combat and movement while paused/transitioning/hidden or successful-impact hit-stop. Clock tick clamps delta to 100ms and advances 1080/450 minutes per active second; food cooldown uses that same active delta. No elapsed-time EP drain. `IntroArt.js` draws deterministic integer-pixel tableaux without external files. Copper uses a cached warm palette variant of the existing native can in both Canvas and WebGL, preserving alpha and dark outlines, shared pour/bounce and previews. Audio uses the same central lifecycle, allowlist, six-voice/two-per-frame limits and preferences; quiet UI/doors/transitions scale .18 vs .85 for action samples, with cooldowns and no continuous world music.

Native test scripts use isolated contexts and read-only snapshots; only explicitly identified late-game fixtures are injected before loading in targeted tests. Fresh timing paths use ordinary inputs and real sleeps, with no gift, fixture, teleport or growth injection. Generated captures and reports belong in temporary directories and are excluded from source checkpoints. See verification/judge-polish/README.md for exact scope and results.

---

# v0.17.2 — customization access and house structure

HUD `customize` house glyph precedes `pause`; no DOM controls. Four bounded Customize categories include seven Wood/Stone recipes and a separate nine-item coin catalog plus eight paid houses. Material and coin transactions are mutually exclusive, retaining atomic failure/stock guards. Crafting supports Home/Farm/interior with outdoor placement restrictions. Save schema stays 18; no second gift.

Native 180×144 house textures are generated in memory from the original house atlas frame, using pure palette/material processing with identical alpha and steps. Cached designs are reused for thumbnails/world. Atlas file allowlist, structural collision, source positions and room interactions stay unchanged.

---

# v0.17.1 — screen placement

Version 0.17.1, schema 18, unchanged dependencies and runtime asset allowlist. Add is a dark bold label even on a disabled button; direction controls reuse native pixel-arrow masks. Pure gameplay guards preserve occupied/function areas; the controller checks camera visibility. Readjust keeps original save/collision data until its atomic confirmation; it does not borrow an inventory item. Mobile pointer selection of placed decor opens choices while ordinary touch actions retain Use/Hit. Local/public test builds retain the v0.17 once-only coin stamp.

---

# v0.17.0 — customization testing

Normal build: `npm run build` (60 starting coins). Friend/local testing build: `npm run build:playtest` (once-per-save +100,000 on Play/Continue). Static runtime and localStorage only; the same public origin preserves progress. Home/interior upgrades and furniture stay in schema 18; old saves migrate without resetting currency/farms/Forest/story. Adaptive indoor room resizing can return obstructed furniture to Bag; gardens keep world coordinates and per-Farm separation. Refer to verification/customization/README.md for actual checks and hosting/build inventory. Physical phones, Safari/Firefox/Edge and human art/listening/balance approval remain unverified.

---

# v0.16.6 — plain public playtest and sleep feedback

Version 0.16.6, schema 17 and runtime dependencies unchanged. Dedicated wind/Winter files and profile keys are removed. Sleep/wake effects use bounded Web Audio source scheduling and existing cleanup rather than timers or save fields. Morning gets one natural public-domain rooster recording; evening uses existing short rustle. All effects respect saved Master/Effects/Mute settings, and gameplay has no music. Audio credits/source submenu retains short-screen fit.

The same verified free Vercel project publishes the tested static build at a stable plain game URL using standard deployment protection: production game domain public; preview/generated domains protected. Each browser/origin owns a separate local save. Earlier preview progress stays at its original URL; stable-domain saves survive later updates on that same origin. No query token or tester-link expiration is needed for the stable public game URL. Current evidence: verification/sleep-wakeup/README.md.

---

# v0.16.5 — music stops at gameplay entry

Version 0.16.5, schema 17 and dependencies unchanged. Gameplay music is disabled by profile and source cleanup, preserving the saved Music volume for Title. The original completion cue is disabled/excluded. Selected sounds follow successful food/stone/seeds/cache/Stash/Keepsake/furniture mutations. Failed actions and earlier quiet controls remain silent. No save migration or new asset bytes.

The existing protected free Hobby playtest project receives an audited preview of 35 static files. Each new preview URL is a separate localStorage origin: earlier preview/local saves stay on their original URL and are not automatically transferred. Current checks/expiry/limitations: verification/nature-pickups/README.md.

---

# v0.16.4 — silent empty swings and Vercel playtest

Version 0.16.4, schema 17 and Phaser/Vite dependencies unchanged. Excluding combat:swing/tree:fall from SAMPLE_EFFECTS keeps the established action animations/events while preventing sample/synth playback and preloading. Actual tree/animal result events and Wood pickup remain; farming/trade and background transport are unchanged.

The current tested dist is staged into Vercel Build Output API v3 static files under /private/tmp. The dedicated free Hobby project has no Git integration/backend and all deployments require Vercel protection; a seven-day share cookie link lets testers access it without login. X-Robots-Tag blocks indexing and hosting feedback overlays are disabled. The first upload was automatically marked production in the new project; a subsequent verified preview is the supplied test target. Vercel CLI 63.1.2 used its existing login. Local saves belong to each browser/origin; local saves do not automatically move to HTTPS. Current verification/deployment details: verification/hit-feedback/README.md.

---

# v0.16.3 — audible farming/hits, silent UI/travel

Version 0.16.3, save schema 17 and dependencies unchanged. Expanded the existing playback/preload/build allowlist to sixteen events / fourteen sample files, preserving aliases for chopping and grass work. Click/menu/Bag/tool/Jump/door/travel events remain rejected; transaction effects and background transport/preferences remain. No gameplay event wiring was rewritten. Current audit and affected-interaction checks: verification/restored-effects/README.md.

---

# v0.16.2 — transaction-only action sounds

Version 0.16.2, save schema 17, unchanged dependencies. The existing AudioManager rejects any event absent from `SAMPLE_EFFECTS` before sample loading or synthesis; that same two-event map supplies preloading and Vite asset selection. Successful buy/sell feedback retains cooldowns, six-voice/two-per-frame limits and bounded expiry/deduplication for deferred transactions. Music/ambience/ending transport and existing preference values are unchanged. Current tests/evidence: verification/quiet-actions/README.md.

---

# v0.16.1 — local licensed PCM audio and touch controls

Version 0.16.1, schema 17, unchanged Phaser 3.90.0/Vite 6.4.3. Forty selected converted PCM16/22050 mono files plus the original ending cue use the existing lazy Web Audio graph. No runtime Ogg decoding, remote assets, audio library or server API. Offline conversion uses ffmpeg 8.0 and bundled Python/NumPy; neither ships with the game. Source/archive/runtime hashes and commands are in assets/licenses/cozy-audio.

Default Hand is saved under the existing tool ID but has no Bag/HUD slot. Fine mouse input remains available even in compact Mac windows; touch/coarse-pointer ordinary world actions route through Use/Hit. Placement retains separate drag/confirmation. Existing preferences and valid selections persist. Targeted checks/limits: verification/cozy-audio/README.md. Production build remains served locally on LAN port 4176; QA uses isolated port 4190. No push/publication.

---

# v0.16.0 — audio and story verification scope

Production is a local static bundle with eight art files and six explicit local WAVs; initial loading does not fetch audio. Web Audio unlocks after a user gesture; unavailable audio/storage fail safely. Phaser Canvas default and ?renderer=webgl share the audio owner. No runtime external API/network, authentication, analytics, backend or new dependency. Credit links open only on deliberate user activation. Run offline using a local static server and bundled assets; this is not a service-worker installation or file:// support claim.

Testing gift is DEV-only at both boundaries, including on loopback production. QA uses independent disposable contexts on port 4186 and ?qa read-only snapshots; normal 4175 save untouched. All seven requested sizes are checked. Actual hardware latency/output, headphone comfort, Safari/iOS interruption policies, Firefox/Edge and Android/iOS gameplay still require human/device checks. Automated waveform checks cannot certify pleasantness. Milestone results: verification/story-audio/README.md.

---

# v0.8.0 — hunting/resources details

Axe: 2 energy / 500ms / one damage; Club remains 5 / 450ms. Wild Boar and Deer give 2 Meat; Fox/Hare/Grouse give 1, with Boar's existing Hide retained. Quiet animals remain nonhostile and do not guard caches. Dead animals/picked stones return on a later day, never reentry/reload. Stone piles: 240 (six in each of 40 regions), +2 Stone / 1 energy, dry/walkable footprints, unchanged scenery/collision map. Meat: +25 HP / +20 EP / base sale 16; existing fruit EP and market salts remain. Fruit HP is rounded 40% of its EP value.

The context regression includes Hand-versus-grass priority following a real browser failure. Existing 167 regressions remain; eight new tests cover hunting, caps/cooldowns/blockers, pure motion, resources, healing, schema migration and responsive controls. Runtime retains exactly eight art files with three original atlas cells appended. Forest first construction remains relatively heavy; no performance benchmark or physical-device result is claimed.

---

# v0.6.1 — watering object fix and soil polish

The previous effect requested town/can, although can existed only in world; the tool now uses an original town/watering-can-item everywhere. The held can uses directional native hand anchors, flipped handle origin, depth/scale/jump offsets and a 650ms tilt; its timer pauses with gameplay. The stream starts at its nozzle. Tool switching/transition hides it. Original player sheets are unchanged. Pinned Phaser Canvas flip/origin source was inspected; tests and offline mirrored/rotated studies supplement browser acceptance only.

Farming costs are 2/1/2/2 for plant/water/harvest/dig; fatigue one energy per game hour. Existing save fields/schema 10 remain; fatigue cap expands to the new interval. Soil textures use deterministic global native coordinates, smooth material patches, scattered clods and transparent rounded turf boundaries, cached per coordinate/mask/wetness. Runtime allowlist stays eight files. Native browser/Canvas/WebGL/touch/performance verification remains blocked by the existing local-URL policy; no workaround used.

---

# v0.6.0 — free farming implementation and limits

A dig costs 4 energy and no coins; plant/water/harvest costs remain 5/3/4. A 48px square bed must have a clear footprint and line of approach within 72 world pixels. Nearby additions use the existing bed lattice; roads, solids, water and bridge footprints reject digging. The shovel is available on Farm/Home/City HUDs, with a Farm-only digging hint. Water works on outdoor clear ground within the same reach; valid crop-window care uses the established pure farming action. Repeated/out-of-window pours are cosmetic and still cost 3 energy. Runtime ground use is gated to 450ms. Dead crops require Harvest to clear.

Wet patches expire at 180,000 active milliseconds, pause with simulation, survive reload with remaining duration and clear on sleep/long time jumps. At most 2,048 custom beds and 256 recent wet patches are stored; validation bounds coordinates, farm IDs, footprints and overlaps. Original 64-cell farm indexing is retained. Cosmetic wet shade is independent of daily care and morning/evening growth.

Twelve crop definitions supply seeds, sale items, eight native crop-state sprites and item icons. Existing daily sale salts retain their order; the new sale items append after the old four crops/forest fruit/hide. Watermelon, Grape and Blueberry add edible bag entries without changing the nine forest forage species. Schema 10 is accepted alongside 1–9. Production: 12 files, 2,058,100 bytes, eight art files. Native browser input/rendering/performance remains unverified under the existing URL-policy restriction; offline studies are supplemental.

---

# v0.5.2 missing-glyph regression
Pinned Phaser 3.90 BitmapFontFile passes its texture into ParseXMLBitmapFont, which calls Texture.add for each glyph. Texture.add changes firstFrame from __BASE to SPACE; Texture.get(null) then selects SPACE. A new colour texture must copy the explicit base sheet. The strengthened existing test invokes the actual XML parser, Texture.add/get and Canvas renderer, asserting the full 128×64 copy and all five UI colours. It fails before the fix and passes after it. The earlier adapter always returned the full sheet and masked this bug; it now models the transparent SPACE default. Stub engine tests and offline pixel studies do not certify a live browser.

---

# v0.5.1 renderer regression
Phaser 3.90's `BitmapTextCanvasRenderer.js` samples the font image without applying tint. Do not rely on BitmapText.setTint for Canvas UI contrast. Shared labels now select cached coloured font images with unchanged alpha/metrics; WebGL uses neutral white tint on the same coloured sources. A Node regression executes the pinned Canvas renderer with stub transforms/context and checks that it draws the coloured cached image. This supplements tests; actual browser acceptance remains pending. Clock formatting floors fractional gameplay minutes before modulo/12-hour conversion. Tool numeric overlays are removed while shortcuts/counts remain; Forest Map now has a text label.

---

# v0.5.0 interface verification notes
The UI root remains integer scale 2. Original graphics/glyphs use native integer coordinates; dynamic notebook textures use Phaser's pinned NEAREST filter value (1). Shared Graphics buttons provide explicit local hit rectangles and preserve selected fills/glyphs across hover. Disabled actions stay noninteractive. Mobile layouts retain ≥44-display-pixel action targets in tested sizes. Space and K are separate forest actions; B works in playable areas and M is Forest-only; paused/repeated/transitioning events do not dispatch. Touch double taps require <320ms and <28 display pixels; UI controls stop propagation. Browser-engine/input-dispatch verification is pending because the local-preview URL was rejected by browser policy; Node layout/input tests and offline Pillow studies are supplemental evidence only. Dependencies and the runtime art allowlist remain unchanged.

---

# v0.4.9 technical update
10240×5120 forest; forty regions, 163 forage points, thirty saved boars and forty-eight transient quiet animals. Six river definitions and twenty-two bridges use shared integer-native water geometry; other locations retain their materials. Six cached forest ground textures cap individual native dimensions at 2048×2048, preserving coherent borders on the wider map. Schema 9/local-only canvas architecture and all eight art files remain. Production 12 files / 2,008,179 bytes; 112 tests/build pass. A local offline CPU terrain bake took 1,263ms; current native browser loading/Canvas/WebGL/memory/frame timing/mobile/interaction checks remain unverified due browser URL policy. Offline studies are not browser captures. Preview: http://127.0.0.1:4175/.

---

# v0.4.8 technical update
Five Craftpix animal identities only; 16 boar records and eight transient quiet animals. Schema 9 remains, removed animal records ignored and progress preserved. Forest adds original layered canopy art, 7,945 camera-local responsive grass clumps and cached deterministic moss/soil materials. 106 tests/build and unchanged eight-file art allowlist pass. Native browser/responsive/interaction/device performance checks for this denser version remain unverified because browser URL policy blocks access. Offline art studies are not browser tests; earlier timings/results below are historical. Local preview remains on 4175.

---

# v0.4.7 wildlife assets
914 named town frames (419 new animal keys, 60 superseded placeholders removed); shared wildlife images deduplicated within the retained 1024×2048 atlas. 495 retained frame pixels and six other art files remain unchanged. Native integer 2× display, source-order direction mapping and per-direction foot anchors prevent mirroring errors/ground drift. Sprite bounds do not alter authoritative combat body radii, hitboxes, territory, difficulty or save state. The user sheet and Stojkea originals remain external regeneration inputs; override paths through SIMPLE_LIFE_ENDANGERED_PNG / SIMPLE_LIFE_ANIMALS_ZIP. Runtime build/play requires only committed local assets. Same eight-art-file allowlist; 12 files / 2,258,286 bytes. 103 tests and affected browser checks pass; evidence: verification/wildlife-sprites.

---

# v0.4.6 bridge and Forest theme
Five bridges now span both banks at 272×72. Opaque timber decks suppress wading consistently with their actual bounds. Night equal-alpha rectangles merge to eliminate transparency-grid seams while retaining near/far visibility. Olive foliage variants generate once per used native atlas frame and stay cached; no per-frame recolouring or disk asset rewrite. All eight art files remain byte-identical to v0.4.5 (555 atlas cells), with unchanged dependency licences. Forest has 844 trees + 41 bamboo stands / 4,201 grass clumps, no terrace/ledge objects or teal ferns. Natural shores and jumping remain.

Build: 12 files / 2,031,148 bytes; 99 tests pass. Details/evidence: verification/forest-theme. No schema/runtime backend/remote asset/new dependency change.

---

# v0.4.5 forest shore follow-up
Forest: 796 trees + 41 bamboo stands, 4,033 grass clumps, ten earth banks, no rendered dirt roads/falls. Geometry/placement are deterministic and established 5120² terrain caching/collision indexing remain. New original palm/willow cells bring the atlas to 555 frames; all old frame pixels/player files are unchanged. Ripples independently appear/fade at 2-pixel positions without aligned wave rows. Vegetation footprints check water/bridges every four world units.

No gameplay-system rewrite, schema change, dependency or new runtime file. Production: 12 files / eight allowlisted art files / 2,031,270 bytes. `tests/browser/forest-shore-server.mjs` serves isolated prepared saves from built dist on 4176 and exports copied read-only QA state into a canvas attribute; it is local test tooling, never runtime production code. Browser verification uses native CUA controls and DOM-only telemetry. See verification/forest-shore/VERIFICATION.md.

---

# v0.4.4 ground/river update — schema 9
Original Canvas/ImageData materials replace repeating ground/soil and flat water bands. The old tile selector used multiples of 16 modulo four and therefore always chose grass0; native coordinate hash fields remove that aliasing. Surface arrays are temporary during the static bake; Forest retains its established cached canvas texture. The shared water geometry remains authoritative for banks, currents and wading; only colour and native material marks change. Camera-local currents use six 240ms phases and pause with simulation. No per-frame full-map pixel work, new dependency, remote runtime asset, atlas change or save migration. See verification/terrain for affected-flow checks and observed local loading times; device performance is not inferred from emulation.

---

# v0.4.3 art update
Channeechan native 64×64 source padding trims into the retained 24×32 / 9×4 player-sheet contract; the game loads no additional files. Eight native ToffeeCraft cells join the atlas. Forest tree footpoints/solids and all gameplay/save rules remain. New canopy dimensions guide fade/sway. Optional regeneration: Pillow + bsdtar, `SIMPLE_LIFE_FARMER_RAR` and `SIMPLE_LIFE_ENV_ZIP` point to user-provided archives; originals stay outside repository/build. `npm run build` needs only committed processed assets. No new dependency/runtime network request. Licence scope and non-Chromium/physical-device limits are in PROJECT_STATUS.md.

---

# Forest growth / jumping — v0.4.2, schema 9
787 forest trees + 33 bamboo stands / 3,880 grass clumps / 20 terraces. Native atlas 545 frames / 1024×2048; boy/girl rigs 216×128 with 9×4 cells of 24×32, existing first six directional frames plus three jump poses. Same eight runtime art files, no dependency/remote asset/backend change. Camera-local grass uses 256-unit spatial buckets and pooled visible sprites; transient bending freezes when paused. Indexed collision remains authoritative, with separate low ledges crossable only by a swept jump. Saves store grounded take-off during flight, and player art offsets from a stable feet camera anchor. Water crop/dust suppress during flight. Supplied Mana Seed/FreeEnvironment pixels are excluded pending rights; primary source/licence evidence and hashes are recorded under assets/licenses/forest-growth.

---

# Asset/water follow-up — v0.4.1 / schema 9

Town atlas: 514 frames, 1024×2048 native pixels. 258 Craftpix frames and four original waterfall frames extend the previous 252-frame atlas. Same eight runtime art files and unchanged dependencies; source ZIPs and provenance stay outside production. Forest remains 5120² / 20 times its original area. Water geometry is shared by the baked ground and wading visuals; continuous channel rows are cached, and animated currents are camera bounded. Physical obstacles retain trees/rocks/structures and fall side banks, omitting all water surfaces. Safe wet positions/bags save without a schema change. New ambient woodland animals have transient display state, no drops/difficulty/save changes. See PROJECT_STATUS.md and verification/asset-water/results.json for actual browser checks and limitations.

---

# Wilderness expansion technical notes

Version 0.4.0 / schema 9. 5120² world area is exactly 20 times the previous 1280×1024. Default Canvas plus optional WebGL remains; local-only runtime and eight-file allowlist are unchanged. Atlas grows from 150 to 252 frames at 1024² source pixels, with original farmers unchanged. No runtime dependency changes.

The enlarged map required indexed collision, cached terrain and nearby-only animal simulation. Static world objects remain Phaser-rendered; the renderer culls offscreen sprites. Forest night draws the viewport only and stays above every world foot depth. The wilderness map and food/market paging remain paused canvas UI. Regional discovery and finite guarded-cache records save alongside each known animal; v8 forest positions translate rather than losing progress. No backend, remote assets, extra equipment or publishing.

---

# Current Milestone 3 extension — 2026-10-07

Version 0.3.0, schema 8; the historical sections below describe earlier foundations. `data/forest.js` owns authored forest nodes/map/boar territory/guidance, `data/items.js` owns food and club values. `systems/forest.js` owns collection/eating/equipment/recovery/daily refresh and shared sight checks. `systems/combat.js` owns deterministic collision-safe boar movement, telegraphs, melee/cooldowns/damage/invulnerability; transient timers advance only with unpaused simulation. `systems/defeat.js` performs atomic loss/next-morning respawn through the established time/crop rules. Save validation preserves older progress and repairs forest coordinates; SAVE_SCHEMA.md specifies new fields.

WorldScene retains Phaser world rendering/collision/camera. ForestView composes local sprites, pixel feedback and stepped night bands with Canvas/WebGL-compatible Graphics. The independent canvas UI scene adds SurvivalPanel for food/gear/Outfitter; TradePanel pages eight sale items without modifying four-seed selection. Space/K attack; E/USE interaction. No backend, new dependency, remote asset or DOM HUD. The eight runtime art files remain allowlisted; forest sprites fit the existing 512×512 town atlas. Reproduce art with process-rpg-assets.py plus forest_art.py. Licensed tree adaptations retain LimeZu credit; original additions are separately identified in the manifest.

---

# Technical notes — farming presentation
Phaser 3.90.0 / Vite 6.4.3 / JavaScript ES modules; HTML5 Canvas, fullscreen RESIZE, nearest filtering, rounded pixels. No backend, DOM HUD, remote runtime resources or new dependency. Eight runtime art files remain allowlisted. Production is approximately 1.6 MB uncompressed, mostly Phaser.

Outdoor zoom 1 / farmer scale 2; indoor zoom 2 / farmer scale 1 gives the same 64px frame. Furniture remains scale 2 for a cozy readable room. Responsive layout fits desktop; mobile camera follows a minimum 480-unit-wide room. Indoor movement halves world speed, preserving displayed speed. Shared feet probes are 24×12 outside and 12×6 inside; house-specific visual clearance is retained. Shed collision uses ground geometry, not projected roof pixels.

Schema 7 keeps the existing localStorage key and migrates versions 1/2/3/4/5/6 individually. Crop window cursors prevent repeated missed-water evaluation on reload/rest/sleep. Room size accompanies indoor saves for responsive remapping; shared nearest-safe geometry repairs invalid coordinates. See ARCHITECTURE.md for contracts. City is now active. Pure quantity-based economy and deterministic daily prices feed paused paged canvas shops; seed/produce keys remain separate. Shops resume closed after reload.

Current acceptance scripts and evidence: VERIFICATION.md. Read-only QA snapshots are exposed by development or ?qa; collision outlines only in development. No galleries/scripts/vendor files ship in dist. Mobile checks use Chromium emulation; physical phones and non-Chromium browsers remain unverified.

Optional Python/Pillow regeneration: scripts/process-rpg-assets.py imports crop_art.py for four crops, seed/produce icons, original stalls/merchants/paving and two soil frames. Original bitmap font/UI remain in generate-pixel-assets.py. npm builds use committed assets and need no Python. Serve dist over HTTP(S). No publishing or push in this task.

Milestone 1.1 adds pure crop information, saved first-Farm-visit migration and contextual Phaser UI only. No runtime dependency or art-file change. New original glyph masks and road-board geometry are source-authored in statusArt.js/worldArt.js; the production eight-file asset allowlist remains unchanged.

Milestone 1.2 uses 64 plot slots per farm and independently saved field ownership/currentFarm. Additional farms reuse the authored map and scene, with independent crops and shared time/care. The 100-farm limit bounds validation/storage; typical saves are far smaller. No new dependency, image asset or remote service. Field/new-farm costs are configurable in data/farms.js. The continuous 00:00–23:59 clock advances days at midnight without forced sleep. Saved fatigue costs one energy per 30 game minutes; day/night bed sleep wakes at 20:00/06:00. Autosave/refresh preserves after-midnight time and fatigue. Expanded crop panels use context coordinates rather than first-field indices.

Milestone 2 City bounds are 1280×896; Home/Farm retain 2240×1152. Ground texture dimensions follow location data. A grass backdrop fills any small camera margin on larger viewports without exposing empty canvas. Paused shops have 240ms transaction gates and a transition guard. Integer inventory is capped at 9999 per item, money at 9,999,999. New-save market seed is generated locally with crypto.getRandomValues; unsigned integer hashing reproduces prices without remote services or stored rerollable daily arrays. Legacy seed defaults to 1. New key fields and tutorial flags migrate independently; paid farms and crop indices stay intact. No shop transaction can save partially.

2026-10-07: compact icon-tab shops with quantity selection and one exact-total action replace text-heavy pages; optional details preserve crop/shop guidance. World overlay gives gradual dusk/dawn and faint moonlight with no artificial illumination. Both merchants hide/close at 20:00 and return at 07:00. See day-night verification evidence.
