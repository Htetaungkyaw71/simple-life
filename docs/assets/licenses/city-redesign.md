# Reference-inspired City and houses — v0.7.0

The seven user-supplied Plant Tales images are composition/style references only. No screenshot pixels, logo, characters, exact streets or buildings were extracted or copied.

## Buildings

Free **Serene Village revamped 1.9 / LimeZu**, https://limezu.itch.io/serenevillagerevamped, **CC BY 4.0**, https://creativecommons.org/licenses/by/4.0/. Official page and existing source/CC evidence were rechecked 2026-10-09. The licence permits commercial use and adaptations with attribution, licence link and change notice. Existing source evidence remains `limezu/serene-village-source.html`, `limezu/CC-BY-4.0.txt`; original archive SHA-256 `22f5b68d950fd8eeafe65690daa1723c74b68ccbc3db7240c3bd4935915e9041`. Do not extract Modern Interiors characters from the Serene Village previews; that separate pack is not used.

Native 16px source rectangles from `SERENE_VILLAGE_REVAMPED/Serene_Village_16x16.png`: house/produce-shop `[160,336,240,400]`, house-blue `[160,592,240,656]`, house-green/seed-shop `[160,464,240,528]`, shed `[0,464,48,528]`. Existing project chimney/awning alpha additions are retained. `scripts/city_art.py` adapts roof colours to muted terracotta and adds original cream plaster, timber divisions, arched doors, framed windows, flower boxes and ivy. All six old sprite sizes, coordinates and alpha silhouettes are preserved. Other retained LimeZu cells are unchanged. The existing in-game LimeZu attribution/source/licence pages continue to apply, with the adaptation notice updated.

## Residents and originals

Pipoya custom terms/source/hash/selected files are documented in `pipoya/README.md` and `pipoya/source.html`. Ninety-six human frames are embedded in the game atlas; archive/source sheets excluded. They are not CC0. Original fountain (two animated frames), street lamp, planted bench, flower pot and tent are deterministic native pixels in `city_art.py`, created with Codex assistance, not taken from the reference game. Original stepped masonry/curbs, garden soil, vertical timber crossings and restrained City lamp pools are source-code rendering. City foliage reuses the existing original olive Forest canopy art, retaining its recorded origins; no extra plant pack.

`extend-city-art.py` updates six existing cells in place and appends 102 game cells (662 total). The established full atlas generator calls the same addition function. Only `town.png` and `town.json` change among eight runtime art files; all unused/vendor archives and source evidence stay outside production via `copyPublicDir:false` and the allowlist. Runtime audit: `../../verification/city-redesign/runtime-audit.json`. No new dependency, backend or remote runtime asset.
