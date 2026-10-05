# Milestone 1 craftsmanship asset audit — 2026-10-05

Reviewed before replacement. Backup: Git tag `art-before-craftsmanship-0.1.2`.
The Plant Tales devlog near 4:18 was viewed as a composition reference: connected irregular landforms, varied plant silhouettes, layered shadows and open routes. No pixels or map layouts were extracted.

| Pack / creator / source | Licence and attribution | Scale / perspective / contents | Advantages, gaps and decision |
| --- | --- | --- | --- |
| [Serene Village revamped 1.9 — LimeZu](https://limezu.itch.io/serenevillagerevamped) | CC BY 4.0, explicitly listed by creator. Credit LimeZu, link source/licence and identify changes. | Native 16×16; three-quarter top-down; grass, paths, water, cliffs, detailed trees, shrubs, flowers, fences, houses, doors and props. | **Selected primary environment.** Strong pixel clusters, related colour variants and organic terrain. Free direct official archive, no login. Missing indoor furniture and farmers are original additions. |
| [Ninja Adventure — Pixel-Boy and AAA](https://pixel-boy.itch.io/ninja-adventure-asset-pack) | CC0; attribution optional. | 16×16 top-down; animated characters, terrain, interiors, exteriors, UI and effects. | Broadest free coverage and clear rights; tiny chibi silhouettes and martial theme fit the intended farmer less well. Not used. |
| [Mystic Woods — Game Endeavor](https://game-endeavor.itch.io/mystic-woods) | Free version non-commercial; commercial version paid ($3.99 at review). | 16×16 top-down terrain, buildings/interiors and animated characters. | Cohesive rustic style, but free licence is narrower than desired competition/distribution flexibility. Not used or purchased. |
| [Tiny Town — Kenney](https://kenney.nl/assets/tiny-town) | CC0; attribution optional. | 16×16 top-down terrain, buildings and props. | Existing legal pipeline; simple geometric silhouettes do not meet the replacement craftsmanship target. Retained only as archived source/history, superseded at runtime. |
| [Modern Interiors — LimeZu](https://limezu.itch.io/moderninteriors) | Free v2.2 is non-commercial per [creator's free-version notice](https://limezu.itch.io/moderninteriors/devlog/244045/free-version-overview-18042021-update); full edition paid ($1.50 minimum shown), commercial use/modification allowed with credit, no source redistribution. | Native 16×16 three-quarter top-down; furniture, floors, walls, four animated free characters. | Closest companion stylistically, but free edition licence unsuitable for unrestricted reuse. Excluded. No purchase or login. |

## Integration plan

1. Record the selected pack's source/licence evidence and preserve its untouched ZIP.
2. Define the revised art bible, then draw original 24×32 farmers with four walk frames and directional idle.
3. Extract only selected native-resolution tiles into a reproducible runtime atlas. Compose terrain with irregular edges and intentional vegetation clusters.
4. Recompose the compact home, richer shopfronts and farm edges while preserving six plot indices, interaction rules and save schema.
5. Compact HUD, add Credits and subtle world/transaction animation.
6. Verify collision, old saves, complete farming loop and five requested viewports; run tests/build; update project documentation.
