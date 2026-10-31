#!/usr/bin/env python3
"""Report native and rendered item-icon sizes before/after the repair pass."""

from __future__ import annotations

import io
import json
import subprocess
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
BASELINE = "6e3aa89"
ATLAS_PNG = ROOT / "public/assets/pixel/processed/town.png"
ATLAS_JSON = ROOT / "public/assets/pixel/processed/town.json"
OUTPUT = ROOT / "docs/verification/item-icon-repair-v1/size-audit.json"

PRODUCE = (
    ("tomato", "tomato-item", "round"), ("strawberry", "strawberry-item", "round"),
    ("carrot", "carrot-item", "long"), ("corn", "corn-item", "long"),
    ("chili", "chili-item", "long"), ("eggplant", "eggplant-item", "long"),
    ("cucumber", "cucumber-item", "long"), ("watermelon", "watermelon-item", "round"),
    ("pumpkin", "pumpkin-item", "round"), ("grapes", "grape-item", "round"),
    ("blueberries", "blueberry-item", "round"), ("sweet potato", "sweetPotato-item", "long"),
)
FRUIT = (
    ("grilled meat", "meat-item", "long"), ("wild berries", "wild-berry-item", "round"),
    ("guava / pear art", "guava-item", "round"), ("mango", "mango-item", "round"),
    ("banana", "banana-item", "long"), ("orange", "orange-item", "round"),
    ("papaya / peach art", "papaya-item", "round"), ("coconut", "coconut-item", "round"),
    ("dragon fruit", "dragon-fruit-item", "round"), ("pineapple / melon art", "pineapple-item", "long"),
    ("watermelon", "watermelon-item", "round"), ("grapes", "grape-item", "round"),
)

OLD_SCALES = {
    "bagSlot": 1, "bagTabButton": 1, "shopTradeTab": 1,
    "tradeDetailDesktop": 2, "tradeDetailCompact": 1,
    "cropInfo": .75, "harvestEffect": 2, "toolbar": 1, "worldDrop": 1,
}
NEW_SCALES = {**OLD_SCALES, "tradeDetailDesktop": 1, "cropInfo": 1, "harvestEffect": 1}


def git_bytes(path: str) -> bytes:
    return subprocess.check_output(("git", "show", f"{BASELINE}:{path}"), cwd=ROOT)


def frame_bounds(atlas: Image.Image, metadata: dict, key: str) -> tuple[int, int]:
    frame = metadata["frames"][key]["frame"]
    icon = atlas.crop((frame["x"], frame["y"], frame["x"] + frame["w"], frame["y"] + frame["h"]))
    box = icon.getchannel("A").getbbox()
    if not box:
        return 0, 0
    return box[2] - box[0], box[3] - box[1]


def main() -> None:
    old_atlas = Image.open(io.BytesIO(git_bytes("public/assets/pixel/processed/town.png"))).convert("RGBA")
    old_metadata = json.loads(git_bytes("public/assets/pixel/processed/town.json"))
    new_atlas = Image.open(ATLAS_PNG).convert("RGBA")
    new_metadata = json.loads(ATLAS_JSON.read_text())
    inner = {"bagSlot": 44, "bagTabButton": 22}
    records = []
    for category, entries in (("produce", PRODUCE), ("fruit", FRUIT)):
        for position, (label, key, shape) in enumerate(entries, 1):
            old_native = frame_bounds(old_atlas, old_metadata, key)
            new_native = frame_bounds(new_atlas, new_metadata, key)
            old_long = max(old_native)
            new_long = max(new_native)
            target = inner["bagSlot"] * .40
            upper = target * (1.15 if shape == "long" else 1)
            lower = target * .90
            upper_tolerance = upper * 1.10
            records.append({
                "category": category,
                "position": position,
                "label": label,
                "itemKey": key,
                "shape": shape,
                "oldNativeOpaqueBounds": list(old_native),
                "newNativeOpaqueBounds": list(new_native),
                "oldBagLongestSide": old_long,
                "newBagLongestSide": new_long,
                "oldBagPercentOfInnerWidth": round(old_long * 100 / inner["bagSlot"], 2),
                "newBagPercentOfInnerWidth": round(new_long * 100 / inner["bagSlot"], 2),
                "bagTargetPixels": round(target, 2),
                "bagAcceptedRange": [round(lower, 2), round(upper_tolerance, 2)],
                "bagWithinTolerance": lower <= new_long <= upper_tolerance,
                "oldDisplayScales": OLD_SCALES,
                "newDisplayScales": NEW_SCALES,
            })
    report = {
        "date": "2026-10-26",
        "baselineCommit": BASELINE,
        "slotInnerWidths": inner,
        "bagTarget": "40% of 44px; long icons may reach 1.15x target; about 10% tolerance",
        "tabTarget": "55-60% of 22px (12.1-13.2px)",
        "displayScaleNotes": {
            "bagSlot": "integer 1x",
            "bagTabButton": "integer 1x; source art over target and cannot be fractionally reduced",
            "shopTradeTab": "integer 1x",
            "tradeDetailDesktop": "reduced from integer 2x to integer 1x for produce/market art; packets remain 2x",
            "tradeDetailCompact": "integer 1x",
            "cropInfo": "changed from legacy 0.75x to integer 1x; oversized native sources are flagged for smaller regeneration",
            "harvestEffect": "reduced from integer 2x to integer 1x",
            "toolbar": "integer 1x; toolbar uses seed packets, which were intentionally left unchanged except Cucumber",
            "worldDrop": "integer 1x",
        },
        "tabButtons": [
            {"tab": "produce", "key": "tomato-item", "newPixels": max(frame_bounds(new_atlas, new_metadata, "tomato-item")), "percent": round(max(frame_bounds(new_atlas, new_metadata, "tomato-item")) * 100 / inner["bagTabButton"], 2), "needsRegeneration": True},
            {"tab": "fruit", "key": "wild-berry-item", "newPixels": max(frame_bounds(new_atlas, new_metadata, "wild-berry-item")), "percent": round(max(frame_bounds(new_atlas, new_metadata, "wild-berry-item")) * 100 / inner["bagTabButton"], 2), "needsRegeneration": True},
        ],
        "icons": records,
        "needsSmallerRegeneration": sorted({record["itemKey"] for record in records if not record["bagWithinTolerance"]}),
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"icons": len(records), "needsSmallerRegeneration": report["needsSmallerRegeneration"]}, indent=2))


if __name__ == "__main__":
    main()
