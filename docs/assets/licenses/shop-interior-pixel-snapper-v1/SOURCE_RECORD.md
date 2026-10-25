# Approved shop-interior Pixel Snapper assets — 2026-10-19

The user supplied eight transparent Pixel Snapper PNGs and explicitly authorized their use in the clothing shop and barber. They are user-processed versions of the previously reviewed OpenAI-generated furniture concepts; no image-generation call, repainting, trimming, resampling, background removal or source-raster edit occurred during this integration.

Each complete source canvas is retained byte-identically under `output/art/shop-interior-pixel-snapper-v1/sources/` and is packed unchanged into the local `pixel-snapper-assets` atlas. Phaser applies nearest-filtered runtime scaling only. The general atlas audit at `output/art/pixel-snapper-assets-v1/art-audit.json` records original paths, dimensions, visible-alpha bounds, SHA-256 values and runtime scales.

| Runtime frame | Native canvas | Phaser scale | SHA-256 |
| --- | ---: | ---: | --- |
| `snapper-clothing-cabinet` | 186×91 | 1.05 | `8e4d7fbeac48c4b8493f7b0e23e03b22001f9f9a796e1df995f11baafd6dc1bc` |
| `snapper-clothing-counter` | 251×125 | 0.82 | `d1c7a0167edf8409736f8085ca2b40bcc4eb873c6c1450529099d526e1979231` |
| `snapper-clothing-fitting-corner` | 149×135 | 0.90 | `3c250d12a12412924dbf8a1b616109fd47958fead96b2710f614959502d30a2f` |
| `snapper-clothing-mirror` | 106×127 | 0.80 | `966935fa29b84a8cf1d966f3e569cc494db56efd2aa36e2daad107948b4143a8` |
| `snapper-clothing-display-table` | 156×106 | 0.95 | `113cafd7d68db46dfe3f3f8f1a64a587d02f7ea8d0a8702754f4243a33dfedff` |
| `snapper-barber-worktop` | 187×91 | 0.86 | `946bed80fe7b0eb8b76c11f7bb17dc256167c42874d725ad1d96b555cc85d440` |
| `snapper-barber-coat-hooks` | 136×88 | 0.70 | `8d018ac6b93e20c9ff587094950233bdb6aeb0041fff43791f880d0a6d11cd2c` |
| `snapper-barber-storage` | 84×129 | 0.82 | `48e438c3884a1d9d9e6d870e4c5e65ed35e7c5b3a92894307f3b54573208afd2` |

The two user-supplied full-room references are retained outside production under `output/art/shop-interior-pixel-snapper-v1/references/`: clothing SHA-256 `4f1c5ad2b4e4c672657c87ccfb6e82c370c35737ee6f10722edf5994689823b8`; bench-free barber SHA-256 `fa7f50704740a85fa7ea41d22360413bfe7c50e46c6c9d72d4547afffce39006`. They guide scale and composition only and are not loaded at runtime.

The existing barber mirror/chair, clothing rack/window and room surfaces remain. The bench stays removed. Muted green floor rugs are small integer Phaser geometry, not new raster assets. The user is responsible for rights to the supplied Pixel Snapper files. No claim of CC0, exclusivity, human-only authorship, legal eligibility or competition acceptance is made.
