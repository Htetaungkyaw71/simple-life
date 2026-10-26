# Cucumber supplied-sheet runtime verification

The live Phaser farm was exercised in headless Google Chrome with disposable localStorage fixtures. `before-whole-farm.png` records the legacy Cucumber; `after-whole-farm.png` records the supplied sheet in the same 12-crop, three-row farm layout. `before-after-whole-farm.png` provides a nearest-neighbour side-by-side comparison.

`cucumber-ripe-watered-center.png` marks the exact 48×48 soil-square centre and confirms that the shared Cucumber base anchor lands on it. The basket sign clears the ripe plant. `stages/cucumber-all-stages-dry-watered.png` renders seed, sprout, young, flowering, ripe, dry, wilted and dead across dry and watered soil, with the real water/basket/warning signs, crop info and `E / Water` prompt. `stages/cucumber-harvest-flight.png` and `stages/results.json` cover the real harvest action, yield and fly-to-player path.

The browser run captured no page or console errors and no remote runtime request. Visual inspection found no clipping, magenta fringe, sign overlap, row-depth problem or low-contrast green fruit. This check covers desktop Google Chrome; physical devices and non-Chromium browsers were not newly tested.
