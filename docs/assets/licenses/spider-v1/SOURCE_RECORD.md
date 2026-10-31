# Forest Spider sprite source — 2026-10-27

## Scope and source roles

The user requested a new spider because hostile Forest wildlife currently used only Wild Boars. The two supplied screenshots are visual references only: the first establishes a squat gray-purple spider silhouette; the second establishes Simple Life's top-down forest scale and muted natural palette. No pixels were copied from either screenshot.

OpenAI's built-in image-generation tool created the source sheet. Codex then made a deterministic native-pixel derivative with `scripts/integrate_spider_sprites.mjs`: 24 transparent 32×32 cells, four directions × six crawl phases. The runtime atlas exposes 76 names because idle, run and warning/attack actions intentionally alias selected crawl cells. No generated backdrop enters the game. The source, derivative and review sheet remain outside the production allowlist; only the existing `processed/town.png` and `processed/town.json` runtime paths changed.

## Generation prompts

Primary prompt:

> Use case: stylized-concept. Asset type: production source sprite sheet for the Simple Life browser game's Forest wildlife atlas. Create a transparent-background pixel-art sprite sheet of one squat forest spider, inspired by the attached reference spider silhouette but not copying its pixels or exact design. Natural and readable rather than cute; charcoal and muted plum-brown abdomen, lighter segmented legs and two tiny dull red eyes. Crisp native pixel art, hard square pixels, limited earthy palette, dark outline, subtle highlights, no antialiasing, gradients or blur. Four direction rows—down, up, left, right—with six evenly spaced 32×32 crawl cells per row and a consistent ground anchor. Exactly one complete eight-legged spider per cell. No shadows, labels, guides, grid, scenery, UI, watermark or extra objects.

Targeted alpha follow-up:

> Remove only the entire dark maroon/black background and replace it with genuine transparent alpha. Preserve all 24 poses, positions, scale, pixel shapes, colors, spacing and canvas. No added shadow, grid, text, scenery, outline or object.

The second generation still returned an opaque backdrop. It is retained as evidence but rejected for runtime. The deterministic 32×32 redraw supplies genuine transparency and matches the approved silhouette/palette.

## Files and hashes

| File | Purpose | SHA-256 |
| --- | --- | --- |
| `output/art/spider-v1/source/generated-spider-sheet.png` | First generated source | `a5986e3b63322288e21c1a56d3fe43dc1b766d0a6dfa1b0a72ff1a90f7489445` |
| `output/art/spider-v1/source/generated-spider-sheet-alpha-attempt.png` | Rejected alpha follow-up | `1e719f0c2bed6927cfed412a0986e4c5d37bf9ce32c84d67bae4f79abb449c81` |
| `output/art/spider-v1/spider-frames.png` | Final transparent 192×128 native sheet | `1bfbac8446f371a109923f9a55a4af0880d8afb3d7f89da07c63b6b336377a1d` |
| `output/art/spider-v1/spider-frames-review.png` | Nearest-neighbour 4× review sheet | `818ece464191b2694142e3cf4a838111131e3c83458bb1a685869cde718c4bb0` |

The project makes no exclusive-copyright claim for AI-generated or AI-assisted pixels. No third-party pack, paid asset, remote runtime file, new dependency or new runtime asset path was added.
