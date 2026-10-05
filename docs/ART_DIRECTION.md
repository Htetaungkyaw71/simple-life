# Simple Life art bible — craftsmanship pass

This replaces the previous olive/brown Tiny Town art direction. Milestone 1 only.

## Identity

A bright, lived-in garden settlement: jade and mint foliage, blue water, warm honey plaster, terracotta roofs, indigo shadows and coral flowers. Use the richness and layering of classic 16-bit farming RPGs without copying a commercial game's characters, palette or maps. Plant Tales was a quality/composition reference only.

## Resolution and presentation

- Base terrain: 16×16 source pixels, two world units per source pixel.
- Original farmers: 24×32 frames, feet anchored near the bottom; expressive broad head, separate limbs, farm overalls and distinct hair/clothing.
- Camera zoom: 1, producing two display pixels per source pixel. A 32-pixel sprite frame is 64 pixels (8.9% of 720); visible character ink is slightly shorter.
- Nearest-neighbour textures, rounded camera position, no antialiasing or runtime remote assets.
- Fullscreen Phaser world plus independent canvas UI. No visible DOM interface.

## Sources

Primary environment: Serene Village revamped 1.9 by LimeZu, CC BY 4.0. Native 16×16 source only. No character/UI pack. Original characters, missing home furniture, farming sprites, bitmap font and UI match the environment's perspective and colours. Kenney artwork is superseded, retained as historical vendor evidence only.

## Drawing rules

Three-quarter top-down view with visible upper surfaces and front faces. Light from upper left; dark plum/blue-green pixel shadows below and right. Selective dark outlines around characters and interactable objects; avoid heavy outlines on ground. Use clustered highlights, not random single-pixel noise. Tile variants should have similar contrast. Dense vegetation borders quieter paths and clear plot approaches. Never obscure interaction destinations permanently.

Objects sort by their feet; tree trunks collide while crowns overlap the player. Near-player crowns soften briefly for readability. Lower leaves and flowers stay below feet. Furniture, roof ridges, windows, porch steps and small props provide scale. Interiors are compact and warm, with a clear bed approach and south doorway.

## Animation

Four walking poses per direction at 8 fps; subtle directional idle breathing/blink. Water 2 fps, leaves gently shift one source pixel, butterflies 5–6 fps. Ripe crops glint. Dust fades quickly; transactions float a coin indicator. Door response is brief. Effects must not change gameplay timing or save data.

## Later work

Preserve source files untouched under vendor, keep derivative outputs under pixel/processed, maintain a reproducible processing script and explicit production allowlist. Credit source creator, licence and adaptations in the game and documentation. Do not mix extra asset families without an audit. All later assets must follow this resolution, lighting, perspective and palette. Keep this pass within existing Home, Farm and City gameplay.
