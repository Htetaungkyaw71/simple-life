# UI readability repair — v0.5.1, 2026-10-08

User screenshots dated 15:35:41, 15:36:22, 15:36:47 and 15:41:22 are bug evidence only; no screenshot pixels are extracted or redistributed. User authorizes readable text, visible Forest map access and removal of numeric tool overlays.

Original code in coloredFont.js derives cached runtime colour variants from the project's original font.png alpha mask. The same local font.xml metrics are retained. This changes presentation without adding a font asset, pack, download or runtime dependency. All eight allowlisted art files are unchanged from aad0861; verification/ui-fixes/runtime-audit.json records hashes. Existing art/licence evidence remains.

Phaser 3.90.0 source BitmapTextCanvasRenderer.js was inspected to establish Canvas ignores tint and reads the source image. The test invokes that pinned MIT engine code with stub context/transforms; dependency evidence remains in docs/licenses/phaser-LICENSE.md and DEPENDENCIES.md. No engine code is copied into production. No browser-policy bypass, external service, image generation, publication or push.

The v0.5.0 offline adapter assumed text tint worked in Canvas. This was incorrect and is explicitly corrected: the new adapter records actual coloured font keys/pixels, not tint. Updated offline studies remain labelled and do not certify live browser rendering/interactions.
