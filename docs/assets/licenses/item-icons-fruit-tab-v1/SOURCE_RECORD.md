# Food-tab item icons — runtime source record

Date: 2026-10-25

The runtime candidate is the already-native 192×144 hard-pixel review export derived from the matching generated `ChatGPT Image 25 Oct 2026, 18_54_12.png` sheet. The specifically requested `ChatGPT_Image_25_Oct_2026__18_54_12-pixel-snapper.png` file was not present in Downloads, attachments, `assets-src`, or `output`; the checked-in review export was therefore used without any further resizing, quantization, interpolation, or repainting. `manifest.json` records the actual input path and hashes.

The mapping follows the first twelve IDs returned by the actual Bag Food-tab order: Grilled Meat, Wild Berry, Guava, Mango, Banana, Orange, Papaya, Coconut, Dragon Fruit, Pineapple, Watermelon, Grape. The pear-shaped source art therefore maps to the existing `guava-item`; the peach/tangerine art maps to `papaya-item`; the tan melon maps to `pineapple-item`. These are code-derived mappings, not inferred renames.

The importer finds artwork by 8-connected components and joins one nearby detached grape fragment. Cleanup now recognizes only the recorded `#FF00FF` sheet background within a maximum four-channel-value RGB distance; this already-snapped sheet has no additional fringe references. The retired broad hue predicate had removed 124 of 282 Grapes pixels and 60 of 360 Wild Berries pixels. The corrected source-derived candidates retain all 282 and 360 respectively. The importer uses the exact plant green-remap constants while protecting the pear and striped-melon bodies. The icons are centered and baseline-aligned in the smallest common 24×24 square, use binary alpha, and contain no exposed recorded-background pixels.

Existing data shares `meat-item` between cooked and raw meat, and shares `watermelon-item`/`grape-item` between Food and Produce. No item IDs or logic were changed; consequently the new cooked drumstick also appears for raw Meat, and the Food-tab Watermelon/Grape pixels appear in Produce. The user-provided/generated source rights and competition eligibility remain the user's responsibility; this is not a claim of human authorship, exclusivity, CC0 status, or independent competition approval.
