# Item icon sheets v1 — source and AI record

Date: 2026-10-25

## Scope and status

The user requested three separate 4×3 pixel-art review sheets: seed packets, harvested crop produce, and fruit/food. The final PNGs are stored under `output/art/item-icon-sheets-v1/` and copied here as compact evidence. They remain outside `public/`, `dist`, the Phaser atlas, and the production allowlist pending explicit human approval. No gameplay, save, UI, atlas, dependency, backend, deployment, publication, or push changed.

## Inputs and reference roles

- `ChatGPT Image 24 Oct 2026, 16_12_15-pixel-snapper.png`, 379×123 RGBA, SHA-256 `828677bcbb662832447e22d05ac5c7a16ef11d1c8d40776e6414b61f4cd4fc3e`: user-supplied plant sheet used as the exact style anchor for native pixel density, colored outlines, top-left light, and stepped warm shading. It was not an edit target.
- `ChatGPT Image 24 Oct 2026, 21_08_37-pixel-snapper.png`, 108×74 RGBA, SHA-256 `f43666f17eddf3f26c988d018ed167a393269aba58cad6a80672db8a66308c33`: user-supplied bag crop used only for the packet construction/layout. The old Tomato packet/icon was explicitly excluded and replaced. It was not an edit target.

The user supplied both references and remains responsible for the rights to provide and use them.

## Generation

OpenAI built-in image generation was called exactly three times, once per requested image and in the requested order. The service did not expose a model identifier. The exact normalized prompt set is preserved in `output/art/item-icon-sheets-v1/PROMPTS.md`. Each call requested a 4×3 grid on `#FF00FF`, the specified object order, a strict low-resolution square-pixel look, colored outlines, top-left light, 3-4 stepped tones, no text or watermark, and wide gaps.

Preserved generated sources:

- `source-image-1.png`, 1448×1086, SHA-256 `6b67c1d52010dda6ca01bd98b6cb231bab8d673c63026dfbbd87f8ce8d167105`
- `source-image-2.png`, 1448×1086, SHA-256 `8c7085e5aeb05d67d0f1e3e61e6a59d1728696be6568308b78ba7ef4de41d68a`
- `source-image-3.png`, 1448×1086, SHA-256 `c0406bb957c2f2b35962d8547a83507dc784c69ab8c3612dbdd7f43d941349fc`

## Deterministic native-pixel processing

`scripts/build_item_icon_sheets.py` uses Pillow only. It divides each source into twelve equal 362×362 cells, detects the near-magenta generated backdrop, crops each icon, nearest-neighbour reduces it to a maximum 20×24 packet footprint or 24×24 object footprint, reduces each icon without dithering, replaces any near-black quantized color with the darkest locally colored palette entry, and centers it in a 48×48 cell. The result is an RGB 192×144 sheet with exact `#FF00FF` outside the sprites. No interpolation, blur, alpha feather, or remote processing is used. Build-tool evidence is recorded in `docs/licenses/item-icon-sheets-v1/DEPENDENCIES.md`.

Finals:

- `final-image-1.png`, SHA-256 `74d53cef0604338ac791dbeb2614e23d82afa1a7df8e8ac290df4f2adfb13f5a`
- `final-image-2.png`, SHA-256 `9af632d0d17a3ceb58c7d9c9bd6471051ce5c2f34f5e0b746a44f553a1e8a47f`
- `final-image-3.png`, SHA-256 `23f6ff0dda8288d0f20bf1355013c24216b1d073186aef4b4ff2d5e9ddaeece1`

`validation.json` records every final cell's bounds and palette count and confirms: 192×144 output; 48×48 cells; exact magenta background; zero pure-black pixels; zero pixels whose maximum RGB channel is below 28; and no cell overlap.

## Rights and limitations

This is AI-generated and deterministically adapted artwork. It is not represented as hand-drawn, CC0, exclusive, or guaranteed to qualify for competition use. OpenAI's current Terms of Use state that, as between the user and OpenAI and to the extent permitted by law, the user owns output, while the user remains responsible for inputs and output use; output may not be unique. The terms URL and qualification are retained in `OUTPUT_TERMS.md`. Human review remains responsible for final appearance, originality, third-party rights, and competition acceptance before runtime integration.

