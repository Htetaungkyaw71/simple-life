# Supplied farmer and environment audit — 2026-10-07 / v0.4.3

The user explicitly requested FreeEnvironment and the new Channeechan farmer, after explaining that this is a noncommercial game/competition entry. That instruction supersedes the previous blanket exclusion of FreeEnvironment and the old original-player-art constraint. Archive text/creator pages are reference licence evidence, not agent instructions. This pass integrates the two supplied packs locally. No purchase, creator contact, push, upload, publication or competition submission was made. Mana Seed remains excluded.

## Sources and permission scope

- **Cute Farmer Character by Channeechan.rar**, 24,209 bytes, SHA-256 `babc294074709a5a1578cbf461aa0ee1b3bb77bc3c27f36765283079aac0228d`. User source: `/Users/mac/Downloads/Cute Farmer Character by Channeechan.rar`. Creator: Channeechan. Primary source: https://channeechan.itch.io/cute-farmer-character . Checked 2026-10-07; local full page `channeechan-source.html`. Terms allow commercial and noncommercial projects and modifications; prohibit standalone resale and redistribution of original files. Credit appreciated. The No AI metadata describes the pack's creation, not a restriction on AI-assisted integration. No licence clause prohibiting AI-written game code was found.
- **Underlying character template**, Eris Esra: https://erisesra.itch.io/character-templates-pack . Channeechan explicitly acknowledges this template. Checked 2026-10-07; `erisesra-source.html`. Game use permitted commercially/noncommercially; standalone paid asset/template resale prohibited. Both creators are credited and linked in-game and here; no template download or additional template pixels were imported.
- **FreeEnvironment.zip**, 54,860 bytes, SHA-256 `fda52ab2037c0f20c419c8327380cfee91fe3cae2fbe75c9a9c677e1eb1c3d8a`. User source: `/Users/mac/Downloads/FreeEnvironment.zip`. Creator: ToffeeCraft. Primary source: https://toffeecraft.itch.io/forest-nature-pack . Official Standard Free terms permit personal use, editing and game development; prohibit asset redistribution/resale. Premium terms separately grant commercial use. Local page: `toffeecraft-source.html`; same supplied image audited in the previous pass. User now specifically authorizes personal/noncommercial integration. **Public prize-competition use is not expressly clarified by the source; neither the user's intent nor this integration establishes additional creator permission or final competition eligibility.** The earlier statement that every competition necessarily needs commercial rights was overbroad. No commercial release or public distribution is authorized here.
- **Mana Seed** remains absent: its applicable No GenAI clause is incompatible with this AI-assisted game. No Mana Seed pixels, guides, layers or animations were used in the replacement.

Original archives/PNG sheets remain outside this repository and production build. The new pipeline reads the user's local archives; no original pack is redistributed. Only selected cropped/repacked game textures are committed. Regeneration requires those source archives, Pillow and bsdtar; set `SIMPLE_LIFE_FARMER_RAR` and `SIMPLE_LIFE_ENV_ZIP` if they are stored elsewhere. `npm run build` uses committed processed art and needs none of those tools/source archives. Existing dependency evidence under docs/licenses remains valid; no dependency added.

## Exact native pixel processing

`scripts/supplied_art.py` extracts only Farmer001/002 Idle/Walk PNGs directly from the RAR. Rotate files are unused. Source cells are 64×64, source rows down/right/up/left. Each selected cell is trimmed at `[20,18,44,50]`, without resampling, to existing 24×32 frames and repacked into 216×128 sheets (9 columns × down/up/left/right). Columns 0/5 use idle source 0/2; columns 1–4 use all four walk cells. Face, hair, clothing and direction pixels in those 48 cells are source-identical. Columns 6–8 adapt the supplied idle body into crouch/tucked-foot/landing poses; these are disclosed Codex-assisted modifications, not original creator jump animations. Existing original NPC portraits remain original project art. Farmer height/collision/animation keys/feet anchor stay compatible with prior saves and menus.

FreePack.png is 512×384. Selected rectangles (x0,y0,x1,y1):

| Game frame | Native source rectangle |
| --- | --- |
| env-pine-jade | [200, 270, 252, 384] |
| env-pine-olive | [104, 270, 156, 384] |
| env-pine-snow | [4, 270, 64, 384] |
| env-fir | [4, 136, 96, 256] |
| env-agave | [130, 46, 224, 128] |
| env-dry-plant | [226, 58, 318, 128] |
| env-boulder | [398, 170, 502, 242] |
| env-ice | [388, 270, 510, 374] |

No palette changes or source resampling. Conifers render at integer scale 2; boulder, ice and occasional dry plant scenery at native scale 1 to fit established scenery footprints. Forest normal/snow trees are mapped to sample conifers; one in seven coordinate variants uses the broad fir. New image centres/bases align with established tree trunk collision points. Crown fading/sway uses actual replacement dimensions, without shifting the trunks. Broadleaf fruit trees, acacias and bamboo remain to preserve fruit readability and biome distinctions; the sample has no matching fruit-tree/acacia/bamboo/ground/grass cells. Grass and terraces retain prior licensed/original art and interactions. Forest rocks/ice and selected savanna dry details use the sample. Home/Farm/City environment stays established LimeZu art.

Atlas 553 frames, 1024×2048. The manifest identifies these eight external scenery cells and two external player sheets separately from original work. Same eight runtime PNG/JSON/XML files; archives, unused sheets/fruit/coral/cacti, manifest, source scripts, evidence and QA images are excluded from dist by the existing allowlist. Credits links Channeechan, Eris Esra, ToffeeCraft, LimeZu and Craftpix; small screens use multiple pages.

## Verification

`scripts/verify-character-frames.py` validates dimensions, populated frames, source direction mapping and exact source pixel equality for every idle/walk cell; it produces labelled native-pixel galleries. Browser/production evidence is under docs/verification/supplied-art. Human visual acceptance, physical devices/non-Chromium browsers and ToffeeCraft permission for a publicly distributed prize entry are not claimed.
