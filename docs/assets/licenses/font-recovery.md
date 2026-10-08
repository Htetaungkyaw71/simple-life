# Font recovery — v0.5.2, 2026-10-08

The user reports all text invisible. This repair changes only font-sheet lookup and verification code. Original project font.png/font.xml and seven other allowlisted art files remain unchanged from db8f98f. Runtime colour variants reuse the original alpha/metrics. No additional external artwork, font, dependency, screenshot pixels or licence obligation.

Pinned Phaser 3.90.0 BitmapFontFile, ParseXMLBitmapFont, Texture.add/get and BitmapTextCanvasRenderer source establish the default SPACE-frame behaviour. The test executes the engine parser/texture/renderer with an XML attribute adapter and stub image/context; no engine code is copied into runtime. MIT dependency evidence remains docs/licenses/phaser-LICENSE.md. Offline images/pixel checks are supplemental, not browser captures. No publication or push.
