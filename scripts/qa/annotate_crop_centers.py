"""Annotate live-game QA captures; never writes runtime assets."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/verification/crop-palette-anchor-v1"


def main() -> None:
    records = json.loads((EVIDENCE / "closeup-centers.json").read_text())["centers"]
    for record in records:
        crop = record["crop"]
        source = EVIDENCE / f"{crop}-ripe-watered-raw.png"
        image = Image.open(source).convert("RGBA")
        draw = ImageDraw.Draw(image)
        x = round(record["cropCenterInClip"]["x"])
        y = round(record["cropCenterInClip"]["y"])
        half_plot = round(24 * 1.5)
        color = (80, 226, 220, 255)
        draw.rectangle((x - half_plot, y - half_plot, x + half_plot, y + half_plot), outline=color, width=1)
        draw.line((x - 7, y, x + 7, y), fill=color, width=1)
        draw.line((x, y - 7, x, y + 7), fill=color, width=1)
        draw.text((4, image.height - 12), "cyan = 48px plot + center", fill=color)
        image.save(EVIDENCE / f"{crop}-ripe-watered-center.png")

    before = Image.open(EVIDENCE / "before-whole-farm.png").convert("RGBA").resize((800, 500), Image.Resampling.NEAREST)
    after = Image.open(EVIDENCE / "after-whole-farm.png").convert("RGBA").resize((800, 500), Image.Resampling.NEAREST)
    comparison = Image.new("RGBA", (1600, 522), (38, 48, 42, 255))
    comparison.alpha_composite(before, (0, 22))
    comparison.alpha_composite(after, (800, 22))
    labels = ImageDraw.Draw(comparison)
    labels.text((6, 5), "BEFORE palette/anchor fix", fill=(245, 238, 207, 255))
    labels.text((806, 5), "AFTER palette/anchor fix + Sweet Potato", fill=(245, 238, 207, 255))
    comparison.save(EVIDENCE / "before-after-whole-farm.png")

    crops = [record["crop"] for record in records]
    stages = Image.new("RGBA", (1200, 1000), (38, 48, 42, 255))
    stage_draw = ImageDraw.Draw(stages)
    for index, crop in enumerate(crops):
        source = Image.open(EVIDENCE / "stages" / f"{crop}-all-stages-dry-watered.png").convert("RGBA")
        source = source.resize((400, 250), Image.Resampling.NEAREST)
        x, y = index % 3 * 400, index // 3 * 250
        stages.alpha_composite(source, (x, y))
        stage_draw.rectangle((x + 3, y + 3, x + 8 + len(crop) * 6, y + 17), fill=(38, 48, 42, 230))
        stage_draw.text((x + 6, y + 5), crop, fill=(245, 238, 207, 255))
    stages.save(EVIDENCE / "all-crops-stages-contact-sheet.png")

    centers = Image.new("RGBA", (880, 840), (38, 48, 42, 255))
    for index, crop in enumerate(crops):
        image = Image.open(EVIDENCE / f"{crop}-ripe-watered-center.png").convert("RGBA")
        centers.alpha_composite(image, (index % 4 * 220, index // 4 * 280))
    centers.save(EVIDENCE / "ripe-watered-centers-contact-sheet.png")
    print(f"annotated {len(records)} live-game crop captures and wrote three contact sheets")


if __name__ == "__main__":
    main()
