# Shop interior asset review sources — 2026-10-19

## Request and scope

The user supplied approved clothing and barber room concepts and asked for assets that do not already exist in the game. Existing frames were inventoried first. Eight missing transparent furniture sources were generated, one per requested asset, and a separate precise edit removed the bench from the barber room concept. The barber bench was deliberately excluded from the generated set. All outputs remain outside `public/` pending human approval.

## References

- Clothing concept: `/Users/mac/Downloads/ChatGPT Image 19 Oct 2026, 10_06_54.png`, SHA-256 `4f1c5ad2b4e4c672657c87ccfb6e82c370c35737ee6f10722edf5994689823b8`.
- Barber concept: `/Users/mac/Downloads/ChatGPT Image 19 Oct 2026, 10_07_15.png`, SHA-256 `348a8a40c42c56629677895283776e35db5681d581b555860be8b74550b50d8c`.

The concepts were used as style, palette, material and viewpoint references. No screenshot crop was placed directly into runtime.

## Built-in image generation

OpenAI built-in image generation was used in nine calls. The exact backend model identifier is unavailable. Each furniture prompt requested a single isolated transparent cutout in the concept's warm cedar/cream/sage pixel-art language, hard pixel edges, generous padding, no room/people/text/UI/logo/watermark and no extra furniture. The per-asset requests were:

1. Wide folded-clothes cabinet with eight open garment cubbies and lower drawers.
2. Clothing service counter with ledger, pencils, twine and wrapping rolls.
3. Curtained fitting corner with hook, bag and compact stool.
4. Leaning full-length cedar mirror.
5. Display table with cream, sage and blue folded garments plus a plum scarf.
6. Barber worktop with scissors, combs, bottles and folded towels; no mirror/chair/bench.
7. Tall barber storage cabinet with bottles, towels and lower doors.
8. Wall coat-hook rail with sage cape and tan hat; no bench.
9. Precise room edit: remove only the lower-left barber bench, reconstruct floor tiles and preserve the rug and every other room element.

## Output hashes

| File | Dimensions | SHA-256 |
| --- | ---: | --- |
| `clothing/folded-clothes-cabinet.png` | 1774×887 | `5450615d66959fdc3b1f587387990236f1040cc62cdebd40d057b58060289ccb` |
| `clothing/wrapping-service-counter.png` | 1774×887 | `476708f9282da2bafcb535472812b82c8fe747c0492ddc3f998e551e29d8e885` |
| `clothing/curtained-fitting-corner.png` | 1333×1180 | `8df20eefdae324007d0000eeb37bb676a3be96ec0b23370a3cd42f34cbcb91e5` |
| `clothing/full-length-mirror.png` | 1145×1374 | `c037f679c66a4374cab452baf8ec32f4ba115e8b32c376bf33c898e84839ce33` |
| `clothing/clothing-display-table.png` | 1536×1024 | `01e4d7dcae8b5b089fc604a4192837e5007c71a1d80b19ab88a5b1e3c863b386` |
| `barber/barber-worktop.png` | 1774×887 | `f8a42aaf027b0800f4b9a06989c2935be31aff485bd6e650f96d8d1ff4cc79a8` |
| `barber/barber-storage-cabinet.png` | 1024×1536 | `d99ef49ff75012d94f69f0a420973c13b5468c17a5fca2207c479907e6ba90e9` |
| `barber/barber-coat-hooks.png` | 1536×1024 | `930aa673309a1f0c441b6082264f8d0124b8fd9ca16a58200b9a6cc53f99159d` |
| `barber/barber-room-no-bench.png` | 1402×1122 | `fa7f50704740a85fa7ea41d22360413bfe7c50e46c6c9d72d4547afffce39006` |

## Terms and limitations

These are AI-generated review sources, not claimed as hand-drawn, CC0, exclusive or guaranteed competition-eligible. They are not runtime-ready native sprites: several contain partial-alpha edge treatment and all require user approval plus a later deterministic native-pixel export. No new third-party pack, font, dependency or remote runtime asset was added.
