# Reference forest / roster cleanup — 2026-10-08, v0.4.8

The latest user asks to remove every animal except the supplied Craftpix Hunt pack and make grass/trees/colour/texture/land/ground resemble five attached images. Those images are style references, not licensed sprite sources. They informed general olive highlights/shadows, layered vegetation, rough pixel contours, grass/flower density and warm exposed soil. No screenshot pixels, assets, exact tree shapes or map layouts are extracted or shipped.

References inspected: ss_5006912bdbbb73b55972a83234f2446b47420bf2.1920x1080.jpg; 73f47972b808de052d6a1976f4668846.jpg; Screenshot 2026-10-08 at 10.14.06 AM.png; Screenshot 2026-10-08 at 10.14.48 AM.png; Screenshot 2026-10-07 at 4.38.20 PM.png. The farming/cliff examples guide texture and palette only; forest farming/raised banks are not introduced.

## Retained external sources
Craftpix Boar, Deer, Hare, Fox and Black Grouse remain from the user's craftpix-net-789196-free-top-down-hunt-animals-pixel-sprite-pack.zip. The existing Freebie licence/source fingerprints and extraction rectangles are under craftpix/SOURCE_RECORD.md and processed/manifest.json. All 258 retained Craftpix atlas cells, including existing selected ruin/plant frames, are pixel-identical to da94557. Existing LimeZu CC BY 4.0 environment/fruit trees, ToffeeCraft personal-use sample scenery and Channeechan/Eris Esra farmers retain their licences/credits/evidence. Previously documented ToffeeCraft public prize-entry uncertainty remains unresolved; local user-authorized noncommercial integration continues, with no publication/submission.

All 419 wa-* frames, 24 remaining six-species placeholder cells and four unused procedural Boar cells are removed. Previous animal licence evidence/source archives stay as development history outside production; their former in-game credit pages/data are removed with the sprites. Historical records do not describe current runtime usage.

## Original AI-assisted project art
scripts/forest_canopy_art.py defines seven original deterministic native pixel cells: three 80×112 olive broadleaf crowns, two 96×128 palms and two 40×40 low palmettos. scripts/forest_growth_art.py updates 27 native 24×24 grass pose/theme cells. Ground materials in src/art/groundSurface.js create original coherent moss shade islands, red-brown soil pockets, a narrow flat turf edge and retained short vegetation/flower marks. The new trees/palmettos are code-generated with Codex assistance, not human hand-drawn work or image-model output. Tree silhouettes are original polygons/clusters, rather than edits of reference pixels. Existing licensed source cells remain unchanged; forest-only render colours include olive ink on formerly purple outline pixels.

No new dependency, pack download, image-generation service, font, audio, external runtime request, commercial-game asset or subagent. No purchase, creator message, push or publication. Human final visual/code/rights acceptance is not claimed.

## Checks
106 tests and production build pass. Atlas audit: 474 total frames, seven new frames, 447 removed, 27 modified grass cells, 440 pixel-identical retained cells; six other runtime art files including both farmers are byte-identical. Production has 12 files / eight art files / 2,004,320 bytes. Evidence: verification/forest-reference/build-art-audit.json. Offline studies are approximate compositions, labelled explicitly and not browser acceptance. Browser URL policy blocks native interaction checks; no alternate browser/CDP workaround was attempted.
