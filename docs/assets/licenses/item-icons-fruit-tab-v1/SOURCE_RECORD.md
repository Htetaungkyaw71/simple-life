# Food-tab item icons — runtime source record

Date: 2026-10-25

The runtime candidate is the already-native 192×144 hard-pixel review export derived from the matching generated `ChatGPT Image 25 Oct 2026, 18_54_12.png` sheet. The specifically requested `ChatGPT_Image_25_Oct_2026__18_54_12-pixel-snapper.png` file was not present in Downloads, attachments, `assets-src`, or `output`; the checked-in review export was therefore used without any further resizing, quantization, interpolation, or repainting. `manifest.json` records the actual input path and hashes.

The mapping follows the first twelve IDs returned by the actual Bag Food-tab order: Grilled Meat, Wild Berry, Guava, Mango, Banana, Orange, Papaya, Coconut, Dragon Fruit, Pineapple, Watermelon, Grape. The pear-shaped source art therefore maps to the existing `guava-item`; the peach/tangerine art maps to `papaya-item`; the tan melon maps to `pineapple-item`. These are code-derived mappings, not inferred renames.

The importer finds artwork by 8-connected components and joins one nearby detached grape fragment. It uses the shared boundary-magenta cleanup and exact plant green-remap constants while protecting the pear and striped-melon bodies. The icons are centered and baseline-aligned in the smallest common 24×24 square, use binary alpha, and contain no detected magenta.

Existing data shares `meat-item` between cooked and raw meat, and shares `watermelon-item`/`grape-item` between Food and Produce. No item IDs or logic were changed; consequently the new cooked drumstick also appears for raw Meat, and the Food-tab Watermelon/Grape pixels appear in Produce. The user-provided/generated source rights and competition eligibility remain the user's responsibility; this is not a claim of human authorship, exclusivity, CC0 status, or independent competition approval.
