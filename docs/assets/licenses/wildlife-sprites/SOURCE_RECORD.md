# Selected animal sprites — 2026-10-08, v0.4.7

The user requested replacing crude Forest animals with supplied/free art. All runtime pixels are local, selected animation cells in the game's combined town atlas; no remote images, source archives or preview graphics ship. The existing Craftpix Boar remains. Fifteen more combat species now use external asset silhouettes: lion, polar bear, tiger, panda, wolf, hyena, elephant, cheetah, leopard, jaguar, monkey, kangaroo, snake, zebra and crocodile. Six retain original project art: giraffe, hippopotamus, rhinoceros, chimpanzee, gorilla, Komodo dragon. No new species, balance changes or wildlife counts.

## Sources and rights

| Selected creator / source | Permission evidence | Selected source files / use |
| --- | --- | --- |
| [tapatilorenzo — LPC bears, deer, lions and more](https://opengameart.org/content/lpc-bears-deer-lions-and-more) | `lpc-source.html`, creator explicitly permits non-Sevarihk work under CC0. The page's general CC BY 4.0 notice concerns its mixed contents; Sevarihk dog/shark/rat/mushroom/tiles are excluded. Credit retained voluntarily. | `lpc_animals_2022_v1.1.zip`, individual creature spritesheets `lion.png`, `lioness.png`, `bear, polar.png`, `bear, black.png`. Lion/polar bear native; lioness adapted to tiger; black bear adapted to panda. |
| [ScratchIO / Scratchlo — Animated Wild Animals](https://opengameart.org/content/animated-wild-animals) | `wolf-source.html`, CC0. Voluntary creator credit. | `Wolf_2.zip`: Wolf_Walk / Wolf_Run / Wolf_Howl. Native wolf; tawny/spot coat adaptation for hyena. |
| [lawnjelly and Jordan Irwin / AntumDeluge — Elephant Rework](https://opengameart.org/content/elephant-rework) | `elephant-source.html`, archive `elephant-LICENSE.txt`, README and sources.md; CC BY 3.0, based on lawnjelly's Jungle Creatures. In-game creator/source/licence credit. | `elephant-1.1.zip`: `PNG/96x96/elephant-NESW.png`; native directional pixels, trimmed/repacked. |
| [Ilaria Lazzarotto / hello_tazzina — Endangered species](https://hello-tazzina.itch.io/animals) | `endangered-source.html`: game use and modification allowed; creator confirms commercial use with credit; redistribution/resale restricted except as part of a game/application. Credited in-game. | User's exact listed file `endangered_animals_ilaria_lazzartotto.png`. Only five Florida panther poses, adapted coats for cheetah/leopard/jaguar, blue guide line removed. No claim that these are original supplied cheetah/leopard/jaguar species. Original standalone sheet stays outside repository. |
| [Stojkea — Pixelart Animal Pack](https://stojkea.itch.io/pixel-art-animal) | `stojkea-source.html`: personal/commercial projects and edits allowed, no resale or ownership claim; credit appreciated and provided. Downloaded official free `Animals v1.0.zip` using public itch.io free flow; no account/payment. | Monkey1–9, kangaroo1–9, snake1–12 and Horse1–10. Native monkey/kangaroo, brighter muted snake coat, horse adapted to striped zebra. Original archive stays outside repository. |
| [bleutailfly — crocodile](https://opengameart.org/content/crocodile-1) | `croc-source.html`, [OGA-BY 3.0 text](https://static.opengameart.org/OGA-BY-3.0.txt) saved locally. Creator/source/licence and modification credit in-game. | `crocodile.png`, three 128×96 cells in each of four directions; exact 2:1 nearest conversion before integer 2× game display; olive recolour, teeth and eyes retained. |

Rights belong to these creators; no exclusive ownership claim. This record concerns asset selection and creator permission, not final competition eligibility or publication approval. Existing ToffeeCraft/Channeechan/Craftpix/LimeZu records remain independently applicable.

HTML evidence preserves visible public licence/credit statements; scripts, anonymous CSRF metadata and hidden form fields are removed; trailing whitespace is normalized in licence evidence. No account/session credentials are retained.

## Reproduction and boundaries

`scripts/wildlife_sprites.py` is called by the established `scripts/process-rpg-assets.py`. Unrestricted source archives are under `public/assets/vendor/wildlife`, excluded by Vite's eight-file allowlist. It reads the two creator-restricted originals from Downloads, or `SIMPLE_LIFE_ANIMALS_ZIP` and `SIMPLE_LIFE_ENDANGERED_PNG`. Their absence affects regeneration only; playing/building needs no Python or external pack.

`fingerprints.json` records SHA-256/bytes of every input, including the excluded user ZIP. `processed/manifest.json` records creator, licence, source URL, exact input file, selected source rectangle, common trim and modifications per `wa-*` frame. Crocodile rectangle is pre-conversion; common trim is post-conversion. Panther rectangles refer to the user sheet; cuts are placed in a common 72×36 cell before trim. Animation file names in each record identify wolf action sheets and Stojkea single-frame inputs.

Four-direction source order is checked visually: lion/lioness N-W-E-S, bears N-E-W-S, elephant and crocodile N-E-S-W. Common cell dimensions and per-direction ground origins prevent feet drifting when changing direction. Side-only poses mirror horizontally and keep the last horizontal direction when moving vertically. Wolf has genuine walk/run/howl cycles. The four Stojkea species provide idle loops, reused during movement; no authored walk/run or four-direction poses are claimed. Missing warning animation uses idle art while the existing warning marker and combat timing remain authoritative. Shared idle/walk/run image bytes are packed once with named aliases. Native lion/polar/elephant/wolf pixels remain; coat adaptations are original Codex-assisted edits to credited assets, not wholly original animal art.

## Excluded assets

`basic asset pack.zip` is DeepDiveGameStudio's Basic Vermin Animations: small insects, rodents and vermin do not cover the requested existing large species. It is not integrated; no unrelated enemies are added. Its original stays unchanged in Downloads. Stendhal BY-SA candidate animals and rougeress giraffe art were inspected but unused; all other web candidate previews remain unused. No paid purchase, preview extraction, third-party message or AI image generation.

## Validation

103 tests cover all 22 species/directions/combat phases, source-linked credits, integer source-pixel ground origins and removal of the 60 superseded placeholder cells. The atlas has 914 named frames, including 419 new animal keys; 495 retained frame pixels and both farmer sheets/other six art files are unchanged from c1efdfe. Production remains 12 files with eight allowlisted art files, excluding manifests, packs and QA scripts. Pixel/directional proof, browser screenshots, counts and logs: `docs/verification/wildlife-sprites`.
