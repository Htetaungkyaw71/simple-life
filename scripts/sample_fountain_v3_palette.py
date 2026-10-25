#!/usr/bin/env python3
"""Sample a locked fountain-v3 palette from the supplied game screenshot."""

from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


TARGETS = {
    "cobblestone": ("#b7a88f", "#a89b86", "#9c9486", "#817d75"),
    "curb": ("#e6dcc4", "#c9c0aa", "#8a7c6a"),
    "lawn": ("#56633a", "#6f7b45", "#8a9552", "#39452c"),
    "wood_copper": ("#8a4a2e", "#a86d45", "#6d432f"),
    "terracotta": ("#9b5138", "#bd7351"),
    "water": ("#718f97", "#9fb8ba", "#d2ded8"),
    "flowers": ("#d7a2a0", "#ead6c2", "#786789"),
    "outline": ("#4a3a2e", "#2f2b25"),
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("screenshot", type=Path)
    parser.add_argument("output", type=Path)
    return parser.parse_args()


def hex_rgb(value: str) -> tuple[int, int, int]:
    value = value.removeprefix("#")
    return tuple(int(value[index : index + 2], 16) for index in (0, 2, 4))


def nearest_real_color(
    target: tuple[int, int, int], colors: np.ndarray, counts: np.ndarray, used: set[tuple[int, int, int]]
) -> tuple[int, int, int]:
    target_array = np.asarray(target, dtype=np.float32)
    delta = colors.astype(np.float32) - target_array
    distance = np.sum(delta * delta * np.asarray((0.30, 0.58, 0.12), dtype=np.float32), axis=1)
    # Prefer recurring screenshot colors, avoiding isolated capture noise.
    score = distance + 20.0 / np.sqrt(np.maximum(counts, 1))
    for index in np.argsort(score):
        color = tuple(map(int, colors[index]))
        if color not in used:
            return color
    raise RuntimeError("could not find a unique sampled color")


def main() -> None:
    args = parse_args()
    image = Image.open(args.screenshot).convert("RGBA")
    array = np.asarray(image, dtype=np.uint8)
    opaque = array[..., 3] >= 250
    pixels = array[opaque, :3]
    frequencies = Counter(map(tuple, pixels.tolist()))
    eligible = [(color, count) for color, count in frequencies.items() if count >= 3]
    colors = np.asarray([color for color, _ in eligible], dtype=np.uint8)
    counts = np.asarray([count for _, count in eligible], dtype=np.int64)

    sampled: dict[str, list[str]] = {}
    used: set[tuple[int, int, int]] = set()
    for category, targets in TARGETS.items():
        sampled[category] = []
        for target in targets:
            color = nearest_real_color(hex_rgb(target), colors, counts, used)
            used.add(color)
            sampled[category].append("#%02x%02x%02x" % color)

    palette = [color for group in sampled.values() for color in group]
    if len(palette) != 24 or len(set(palette)) != 24:
        raise AssertionError("the locked palette must contain exactly 24 sampled colors")

    args.output.mkdir(parents=True, exist_ok=True)
    record = {
        "source": str(args.screenshot),
        "method": "nearest recurring exact screenshot colors to semantic category targets; no invented RGB values",
        "count": len(palette),
        "categories": sampled,
        "palette": palette,
    }
    (args.output / "palette.json").write_text(json.dumps(record, indent=2) + "\n")

    columns, rows, swatch = 6, 4, 24
    preview = Image.new("RGB", (columns * swatch, rows * swatch), "black")
    draw = ImageDraw.Draw(preview)
    for index, value in enumerate(palette):
        x = index % columns * swatch
        y = index // columns * swatch
        draw.rectangle((x, y, x + swatch - 1, y + swatch - 1), fill=hex_rgb(value))
    preview.save(args.output / "palette.png", optimize=False)
    print(json.dumps(record, indent=2))


if __name__ == "__main__":
    main()
