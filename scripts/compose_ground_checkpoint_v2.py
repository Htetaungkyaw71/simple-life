#!/usr/bin/env python3
"""Compose the corrected fixed-camera lawn beside the approved style crop."""

import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/verification/ground-grass-review-v1"
OUT = ROOT / "docs/verification/ground-grass-v2"
REFERENCE = Path("/Users/mac/Desktop/Screenshot 2026-10-16 at 4.18.15\u202fPM.png")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    game_path = SOURCE / "home-integrated-1460x1062.png"
    game = Image.open(game_path).convert("RGB")
    reference = Image.open(REFERENCE).convert("RGB")
    shutil.copyfile(game_path, OUT / "home-integrated-fixed-camera.png")
    if (SOURCE / "browser-check.json").exists():
        shutil.copyfile(SOURCE / "browser-check.json", OUT / "browser-check.json")

    side = 760
    game_crop = game.crop((350, 120, 1110, 880))
    ref_crop = reference.crop((380, 40, 1060, 720)).resize((side, side), Image.Resampling.NEAREST)
    canvas = Image.new("RGB", (side * 2 + 24, side + 52), "#263E38")
    canvas.paste(game_crop, (0, 52)); canvas.paste(ref_crop, (side + 24, 52))
    draw = ImageDraw.Draw(canvas)
    draw.text((12, 15), "CORRECTED HOME LAWN - FIXED CAMERA", fill="#FFF6DC")
    draw.text((side + 36, 15), "REFERENCE LAWN - COLOR / DENSITY ONLY", fill="#FFF6DC")
    canvas.save(OUT / "home-vs-reference-lawn.png", optimize=False)

    repeat = ROOT / "output/art/ground-grass-v2/grass_ground_12x12_2x.png"
    shutil.copyfile(repeat, OUT / "grass-ground-12x12-2x.png")
    report = json.loads((ROOT / "output/art/ground-grass-v2/ground-v2-report.json").read_text())
    (OUT / "checkpoint.json").write_text(json.dumps(report, indent=2) + "\n")


if __name__ == "__main__":
    main()
