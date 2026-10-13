# Farmer girl sprite integration — v0.25.0

318 tests and the production build pass. Source and native packing details: [source record](../../assets/licenses/farmer-girl-v1/SOURCE_RECORD.md).

Run native audit with the bundled Python/Pillow: `python scripts/generated_girl.py` followed by `python docs/verification/farmer-girl/audit-assets.py`. It checks 48 packed cells, 32 distinct running poses, actual arm/foot pixel changes, binary alpha, a shared 32-colour palette, 48 opaque skin-pixel hand grips, unchanged male/legacy/NPC textures and runtime source/export exclusion. Runtime: 46 files, 12,222,179 bytes, 27 WAVs. The source artwork was resampled/palette-adapted; no claim of byte-identical native source art.

Local production preview used http://127.0.0.1:4201/. Disposable Chromium contexts with fixture saves, never the user's live saved farm:

- `appearance/appearance-checks.json`: 1280×720 English Canvas, 844×390 Myanmar Canvas and 390×844 Myanmar WebGL. Native purchases, all catalogue previews, changing looks, tools/jump, owned wardrobe reuse, rotation, reload and fresh Girl selection pass.
- `motion/motion-checks.json`: girl keyboard desktop and Myanmar touch landscape observe every one of the eight run phases in all four directions. Tools stay on the recorded actual hand pixel. Legacy 112 style/NPC direction cycles retain distinct limb pixels; town motion remains.
- `depth/results.json`: three desktop/mobile Canvas/WebGL profiles pass indoors, canopy front/back, crop depth, bridges, jump/ground shadows, water cropping/reflection and save reload.
- `male-motion/motion-checks.json`: the same native keyboard/touch checks for the approved male are recorded as a regression.

Console errors/warnings are checked by each browser suite. Evidence PNGs are in their respective folders. Source, export ZIP, prompts and QA are excluded from dist. No publish/push. Physical phones, Safari/Firefox and human artwork/animation acceptance remain unverified. Jump is the existing arc plus real passing run poses, not a separately generated jump cycle. Native 32×32 idle PNGs, 48×48 running frames, packed sheet, manifest and GIF preview are under output/art/farmer-girl-v1*.
