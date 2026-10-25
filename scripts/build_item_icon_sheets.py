#!/usr/bin/env python3
"""Convert generated 4x3 icon boards into native, hard-edged pixel sheets."""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter
from pathlib import Path

from PIL import Image


MAGENTA = (255, 0, 255)
COLS = 4
ROWS = 3
CELL = 48
SHEET_SIZE = (COLS * CELL, ROWS * CELL)


def is_generated_background(rgb: tuple[int, int, int]) -> bool:
    r, g, b = rgb
    return r >= 205 and b >= 200 and g <= 90 and abs(r - b) <= 72


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def bounds(mask: Image.Image) -> tuple[int, int, int, int]:
    result = mask.getbbox()
    if result is None:
        raise ValueError("Cell did not contain a detectable icon")
    return result


def quantize_foreground(icon: Image.Image, colors: int) -> Image.Image:
    pixels = list(icon.get_flattened_data())
    foreground = [pixel[:3] for pixel in pixels if pixel[3]]
    strip = Image.new("RGB", (len(foreground), 1))
    strip.putdata(foreground)
    mapped = strip.quantize(
        colors=max(2, min(colors, len(set(foreground)))),
        method=Image.Quantize.MEDIANCUT,
        dither=Image.Dither.NONE,
    ).convert("RGB")
    reduced = list(mapped.get_flattened_data())

    palette = sorted(set(reduced))
    dark_colored = [
        color
        for color in palette
        if max(color) >= 28 and max(color) - min(color) >= 8
    ]
    replacement = min(dark_colored, key=lambda color: sum(color), default=(55, 38, 34))
    reduced = [replacement if max(color) < 28 else color for color in reduced]

    output = Image.new("RGBA", icon.size, MAGENTA + (0,))
    result = []
    foreground_index = 0
    for pixel in pixels:
        if not pixel[3]:
            result.append(MAGENTA + (0,))
            continue
        result.append(reduced[foreground_index] + (255,))
        foreground_index += 1
    output.putdata(result)
    return output


def extract_icon(cell: Image.Image, target: tuple[int, int], colors: int) -> Image.Image:
    rgb = cell.convert("RGB")
    source_pixels = list(rgb.get_flattened_data())
    mask = Image.new("L", rgb.size)
    mask.putdata([0 if is_generated_background(pixel) else 255 for pixel in source_pixels])
    crop_box = bounds(mask)
    crop = rgb.crop(crop_box)
    crop_mask = mask.crop(crop_box)

    target_w, target_h = target
    scale = min(target_w / crop.width, target_h / crop.height)
    resized_size = (
        max(1, round(crop.width * scale)),
        max(1, round(crop.height * scale)),
    )
    crop = crop.resize(resized_size, Image.Resampling.NEAREST)
    crop_mask = crop_mask.resize(resized_size, Image.Resampling.NEAREST)

    rgba = Image.new("RGBA", resized_size, MAGENTA + (0,))
    rgba.paste(crop, (0, 0), crop_mask)
    return quantize_foreground(rgba, colors)


def build_sheet(source: Path, destination: Path, packet_sheet: bool) -> dict:
    image = Image.open(source).convert("RGB")
    if image.width % COLS or image.height % ROWS:
        raise ValueError(f"{source} is not evenly divisible into a 4x3 grid")
    source_cell_w = image.width // COLS
    source_cell_h = image.height // ROWS

    result = Image.new("RGB", SHEET_SIZE, MAGENTA)
    icons = []
    for index in range(COLS * ROWS):
        col = index % COLS
        row = index // COLS
        cell_box = (
            col * source_cell_w,
            row * source_cell_h,
            (col + 1) * source_cell_w,
            (row + 1) * source_cell_h,
        )
        cell_image = image.crop(cell_box)
        icon = extract_icon(
            cell_image,
            target=(20, 24) if packet_sheet else (24, 24),
            colors=18 if packet_sheet else 14,
        )
        x = col * CELL + (CELL - icon.width) // 2
        y = row * CELL + (CELL - icon.height) // 2
        result.paste(icon.convert("RGB"), (x, y), icon.getchannel("A"))
        icons.append(
            {
                "index": index + 1,
                "cell": [col, row],
                "bounds": [x, y, x + icon.width, y + icon.height],
                "size": [icon.width, icon.height],
                "colors": len(
                    set(pixel[:3] for pixel in icon.get_flattened_data() if pixel[3])
                ),
            }
        )

    destination.parent.mkdir(parents=True, exist_ok=True)
    result.save(destination, optimize=True)
    colors = Counter(result.get_flattened_data())
    return {
        "source": str(source),
        "sourceSize": list(image.size),
        "output": str(destination),
        "outputSize": list(result.size),
        "sha256": sha256(destination),
        "background": "#FF00FF",
        "backgroundPixels": colors[MAGENTA],
        "uniqueColors": len(colors),
        "pureBlackPixels": colors[(0, 0, 0)],
        "nearBlackPixels": sum(count for color, count in colors.items() if max(color) < 28),
        "icons": icons,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    output_dir = args.output_dir
    jobs = [
        (
            output_dir / "image-1-seed-packets-generated.png",
            output_dir / "image-1-seed-packets.png",
            True,
        ),
        (
            output_dir / "image-2-harvested-produce-generated.png",
            output_dir / "image-2-harvested-produce.png",
            False,
        ),
        (
            output_dir / "image-3-fruit-food-generated.png",
            output_dir / "image-3-fruit-food.png",
            False,
        ),
    ]
    report = {"sheetSize": list(SHEET_SIZE), "cellSize": CELL, "sheets": []}
    for source, destination, packet_sheet in jobs:
        report["sheets"].append(build_sheet(source, destination, packet_sheet))
    (output_dir / "validation.json").write_text(
        json.dumps(report, indent=2) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
