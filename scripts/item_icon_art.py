"""Load the verified native item-icon candidates into the mixed-source atlas."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
FRAME = 24

SHEETS = (
    (
        "item-icons-seed-packets-v1",
        ("tomato-seed-item", "strawberry-seed-item", "carrot-seed-item", "corn-seed-item", "chili-seed-item", "eggplant-seed-item", None, "watermelon-seed-item", "pumpkin-seed-item", "grape-seed-item", "blueberry-seed-item", "sweetPotato-seed-item"),
    ),
    (
        "item-icons-crop-produce-v1",
        ("tomato-item", "strawberry-item", "carrot-item", "corn-item", "chili-item", "eggplant-item", None, "watermelon-item", "pumpkin-item", "grape-item", "blueberry-item", "sweetPotato-item"),
    ),
    # Food-tab art intentionally loads last. Watermelon and grape use shared
    # existing keys, so their Food-tab choices also appear in Produce.
    (
        "item-icons-fruit-tab-v1",
        ("meat-item", "wild-berry-item", "guava-item", "mango-item", "banana-item", "orange-item", "papaya-item", "coconut-item", "dragon-fruit-item", "pineapple-item", "watermelon-item", "grape-item"),
    ),
)

ITEM_KEYS = tuple(dict.fromkeys(key for _, keys in SHEETS for key in keys if key))


def add_item_icon_art(assets):
    for directory, keys in SHEETS:
        sheet = Image.open(ROOT / "docs/assets/licenses" / directory / "candidate.png").convert("RGBA")
        if sheet.size != (FRAME * 12, FRAME):
            raise ValueError(f"unexpected item icon candidate size: {directory} {sheet.size}")
        for index, key in enumerate(keys):
            if key:
                assets[key] = sheet.crop((index * FRAME, 0, (index + 1) * FRAME, FRAME))
