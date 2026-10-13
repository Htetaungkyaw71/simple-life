# v0.21.2 native scale and articulated walking update

Characters now use 40×72 native cells at integer 1× world scale, with a 64-pixel visible height instead of 76 (about 16% smaller). A stable 32-colour identity palette simplifies shading; the far leg receives a small additional shade. Faces, hair, clothes and boots retain the approved source art. Four walking poses use contact/passing steps, opposing arms, bent recovering knees and a one-pixel passing bob. Both player and NPC sprites share the poses; held tools follow the animated grip. Standing, jump, feet anchors, depth and local appearance/saves remain.

The existing source PNGs/hashes/prompts below are unchanged. `scripts/people_art.py` now reduces poses to at most 36×64 within 40×72 frames, quantizes each identity using one 32-colour palette shared by all facings, preserves alpha and applies nearest native joint/row deformation. Arm/leg extraction keeps shoulders/hips attached; side forearms uncover restored garment pixels; dress hems stay intact while visible feet step. Contact faces remain identical to standing. Four moving frames are distinct in both arm and foot regions for all 20 styles and eight town variants. The 720-frame appearance PNG is now 720×2880. Far-leg shading aids side-view separation. Source artwork remains original generated project art. No new image generation, proprietary screenshot sampling or external asset. This is a compact four-pose pixel walk cycle, with separate standing and tucked-leg jump poses.

---

# v0.21.1 original reference-matched characters — 2026-10-13

User approved the generated eight-person guide and requested fixing the thin in-game result. Built-in OpenAI `image_gen.imagegen` generated six original transparent source sheets from that approved guide. The exact six prompts are in [prompts.json](prompts.json); retained local outputs are in source/. No commercial-game screenshot pixels or third-party CC0 body pixels are in the active replacement people. The older CC0 adaptation is retired and its evidence remains historical. Established environment/legacy atlas licences remain independently applicable. These generated project assets carry no new third-party pack restriction; AI use is disclosed, with no claim of exclusive copyright or certification of competition eligibility.

`scripts/people_art.py` extracts four alpha-separated directional poses per column, reduces with nearest-neighbour, thresholds alpha and centers feet in 48×80 native cells. Source face, hair, garments and boots supply the artwork; bodies are not redrawn as thin polygons. Five outfits × four hairs produce 720 frames. Eighteen cells per physical row keep all 36-frame style indexes intact in an 864×3200 PNG, below 4096 texture dimensions. Player world scale is 1×, keeping about the previous 80-world-pixel height. Full UI previews are 2× native, short phone previews 1× after the 2× UI-root transform. Nearest filtering, transparent alpha and grounded feet remain. Walking mechanically shifts the lower legs at stride extremes, jump frames tuck legs; idle holds the standing artwork. These are modest game animations, not 720 independently illustrated poses. Eight town variants produce 160 native cells, including sage-shirt, straw-hat and older-apron identities. Other 698 atlas cells are preserved byte-for-byte.

Source tool output provenance: worker exec-42ec8d76-7590-4221-8dd5-24697378ecd4; gardener exec-7093fb31-3703-4186-8bd0-52455471f76a; copper exec-3550361c-9281-4bfb-bbbe-b9bdc8a933ee; plum exec-ec9f557d-4a34-4a4b-b0cc-0665567f7c92; forest exec-f781af4a-77df-42b6-b488-870483487c8a; extras exec-e722fff2-2104-43f4-8333-b420534bf108. Approved reference: exec-eb5bb72b-425a-497f-8b03-54390f6ee667.png. Sources/prompts/docs and generated guide are excluded from runtime; only processed PNGs/atlas metadata are allowlisted. No runtime image generation, remote assets or new dependency.

| Source | Dimensions | SHA-256 |
|---|---|---|
| copper.png | 1024×1536 | 67f5d70fb09ade44f21c8147cfc484e93357578a1c9dcac557dcc577f7337edb |
| extras.png | 1024×1536 | 78665a26b6605b5469abe5ed7e09857af8acc5f5be151dbc79ffece250abf243 |
| forest.png | 1024×1536 | a8d33cb34b6344d452b5a0d453c66ca16aabab25048fcd1c0f525b84a07e6d15 |
| gardener.png | 1024×1536 | 38aee66360ccfeee0a21fb2071443562c3d44981348584ab917f47016bab11a4 |
| plum.png | 1024×1536 | b08f99c01061fdce33a374802d18fdd8ba77392f056e66b40680b3ada101d8a2 |
| worker.png | 1024×1536 | 76daaf4308653423cfd9a9c8f4b46d9265a7407395db88a669a05307c25ed1b3 |
