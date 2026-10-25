#!/usr/bin/env python3
"""Compose the fixed-camera runtime lawn beside a clean reference lawn crop."""

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs/verification/ground-grass-review-v1"
REFERENCE = Path("/Users/mac/Desktop/Screenshot 2026-10-16 at 4.18.15\u202fPM.png")


def main() -> None:
    game = Image.open(OUT / "home-integrated-1460x1062.png").convert("RGB")
    reference = Image.open(REFERENCE).convert("RGB")
    # Open reference meadow away from HUD, trees and the lavender bed.
    ref_crop = reference.crop((380, 40, 1060, 720))
    side = 760
    game_crop = game.crop((350, 120, 1110, 880))
    ref_crop = ref_crop.resize((side, side), Image.Resampling.NEAREST)
    canvas = Image.new("RGB", (side * 2 + 24, side + 52), "#263E38")
    canvas.paste(game_crop, (0, 52));canvas.paste(ref_crop, (side + 24, 52))
    draw = ImageDraw.Draw(canvas)
    draw.text((12, 15), "INTEGRATED HOME - FIXED CAMERA", fill="#FFF6DC")
    draw.text((side + 36, 15), "REFERENCE LAWN CROP - COLOR/MOOD ONLY", fill="#FFF6DC")
    canvas.save(OUT / "home-vs-reference-lawn.png", optimize=False)


if __name__ == "__main__":
    main()
