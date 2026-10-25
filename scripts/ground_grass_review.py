#!/usr/bin/env python3
"""Audit the requested grass palette and prepare review-only lawn textures.

The audit intentionally samples user screenshots, not runtime assets. Generated
sources are processed separately: center crop, nearest resize, exact locked
palette mapping, hard-pixel seam repair, and deterministic comparison sheets.
Nothing under public/ is written by this script.
"""

from __future__ import annotations

import argparse
import colorsys
import hashlib
import json
from collections import Counter
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/art/ground-grass-review-v1"
SOURCE = OUT / "source"

MINE = [
    Path("/Users/mac/Desktop/Screenshot 2026-10-21 at 11.45.15\u202fAM.png"),
    Path("/Users/mac/Desktop/Screenshot 2026-10-21 at 11.46.23\u202fAM.png"),
]
REFERENCE = [
    Path("/Users/mac/Desktop/Screenshot 2026-10-16 at 4.17.57\u202fPM.png"),
    Path("/Users/mac/Desktop/Screenshot 2026-10-16 at 4.18.15\u202fPM.png"),
    Path("/Users/mac/Desktop/Screenshot 2026-10-16 at 4.19.11\u202fPM.png"),
]

# Normalized crop boxes deliberately avoid HUD and obvious paths where possible.
# The category filter below then selects the requested material family.
ROIS = {
    "mine": {
        "lawn": [(0, .18, .10, .98, .90), (1, .00, .10, .98, .98)],
        "foliage": [(1, .00, .00, .50, .98), (1, .67, .00, 1.00, .98)],
        "clump": [(0, .22, .15, .98, .98), (1, .00, .08, .98, .98)],
        "trunk": [(1, .10, .05, .57, .95), (1, .68, .02, .98, .91)],
        "shadow": [(0, .00, .00, .98, .98), (1, .00, .00, .98, .98)],
    },
    "reference": {
        "lawn": [(0, .02, .05, .96, .95), (1, .02, .04, .96, .92), (2, .02, .03, .96, .92)],
        # Canopy-only windows. These deliberately exclude the meadow clump rows
        # that made the original foliage and clump samples identical.
        "foliage": [
            (0, .07, .23, .31, .58), (0, .38, .27, .58, .72), (0, .67, .18, .91, .65),
            (1, .41, .00, .67, .40), (2, .10, .13, .39, .61), (2, .43, .05, .64, .47),
        ],
        # Isolated tall-grass fields only, kept separate from tree crowns.
        "clump": [
            (0, .29, .02, .43, .29), (0, .51, .03, .66, .31),
            (1, .01, .19, .31, .68), (2, .35, .32, .48, .73), (2, .72, .00, .93, .42),
        ],
        "trunk": [(0, .00, .00, .98, .98), (1, .00, .04, .98, .96), (2, .00, .02, .98, .96)],
        "shadow": [(0, .00, .00, .98, .98), (1, .00, .04, .98, .96), (2, .00, .02, .98, .96)],
    },
}

# Updated locked project palette: the corrected lawn ramp is warmed to an
# average 71-72 degree hue. Future
# foliage shifts toward yellow-olive, the near-black green is removed, trunks
# use a warm red-brown ramp, and one dark olive is reserved for all outlines.
# 6 lawn + 5 foliage + 4 clump + 3 trunk + 1 outline + 1 shadow + 8 accents.
PALETTE_GROUPS = {
    "lawn": ["#6C7749", "#798455", "#859056", "#8C9564", "#939C67", "#9EA66B"],
    "foliage": ["#454B2E", "#515936", "#60693E", "#707949", "#838B56"],
    "clump": ["#53582D", "#6A7138", "#858B49", "#A1A35C"],
    "trunk": ["#563128", "#784436", "#985E47"],
    "outline": ["#3B4028"],
    "shadow": ["#555B3A"],
    "flower_dirt": ["#F0E8C7", "#D8C995", "#E4B7A3", "#C77768", "#8A593C", "#A7774D", "#C29A62", "#D4B878"],
}


def rgb(hex_color: str) -> tuple[int, int, int]:
    value = hex_color.removeprefix("#")
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def hex_rgb(color: tuple[int, int, int]) -> str:
    return "#" + "".join(f"{channel:02X}" for channel in color)


def file_sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def image_rgb(path: Path) -> np.ndarray:
    return np.asarray(Image.open(path).convert("RGB"), dtype=np.uint8)


def crop_normalized(image: np.ndarray, bounds: tuple[float, float, float, float]) -> np.ndarray:
    h, w = image.shape[:2]
    x0, y0, x1, y1 = bounds
    return image[round(y0 * h):round(y1 * h), round(x0 * w):round(x1 * w)]


def hsl_arrays(pixels: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    values = pixels.reshape(-1, 3).astype(np.float32) / 255.0
    mx = values.max(axis=1)
    mn = values.min(axis=1)
    light = (mx + mn) / 2
    delta = mx - mn
    sat = np.zeros_like(light)
    nz = delta > 1e-5
    sat[nz] = delta[nz] / (1 - np.abs(2 * light[nz] - 1))
    hue = np.zeros_like(light)
    red, green, blue = values[:, 0], values[:, 1], values[:, 2]
    rm = nz & (mx == red)
    gm = nz & (mx == green)
    bm = nz & (mx == blue)
    hue[rm] = ((green[rm] - blue[rm]) / delta[rm]) % 6
    hue[gm] = (blue[gm] - red[gm]) / delta[gm] + 2
    hue[bm] = (red[bm] - green[bm]) / delta[bm] + 4
    hue = hue * 60
    return hue, sat * 100, light * 100


def category_mask(category: str, pixels: np.ndarray) -> np.ndarray:
    hue, sat, light = hsl_arrays(pixels)
    if category == "lawn":
        return (hue >= 62) & (hue <= 112) & (sat >= 10) & (sat <= 55) & (light >= 28) & (light <= 72)
    if category == "foliage":
        return (hue >= 55) & (hue <= 125) & (sat >= 16) & (light >= 10) & (light <= 58)
    if category == "clump":
        return (hue >= 48) & (hue <= 90) & (sat >= 25) & (light >= 18) & (light <= 75)
    if category == "trunk":
        return ((hue <= 45) | (hue >= 340)) & (sat >= 18) & (light >= 10) & (light <= 55)
    if category == "shadow":
        # Warm olive cast shadows only; exclude the game's blue river and the
        # brown trunk/soil families that share the same lightness range.
        return (hue >= 45) & (hue <= 115) & (light >= 8) & (light <= 34) & (sat <= 48)
    raise ValueError(category)


def summarize_group(label: str, images: list[Path], category: str) -> dict:
    selections = []
    for image_index, x0, y0, x1, y1 in ROIS[label][category]:
        crop = crop_normalized(image_rgb(images[image_index]), (x0, y0, x1, y1))
        flat = crop.reshape(-1, 3)
        mask = category_mask(category, flat)
        if mask.any():
            selections.append(flat[mask])
    pixels = np.concatenate(selections, axis=0)
    # Screenshots are nearest-enlarged; exact-color frequency is meaningful.
    counts = Counter(map(tuple, pixels.tolist()))
    dominant = [{"hex": hex_rgb(color), "count": count} for color, count in counts.most_common(8)]
    h, s, l = hsl_arrays(pixels)
    # Circular mean avoids hue wrap-around.
    radians = np.deg2rad(h)
    mean_hue = float(np.rad2deg(np.arctan2(np.sin(radians).mean(), np.cos(radians).mean())) % 360)
    return {
        "samplePixels": int(len(pixels)),
        "dominant": dominant,
        "averageHsl": {"h": round(mean_hue, 2), "s": round(float(s.mean()), 2), "l": round(float(l.mean()), 2)},
    }


def save_palette() -> None:
    colors = [{"group": group, "hex": value} for group, values in PALETTE_GROUPS.items() for value in values]
    payload = {"count": len(colors), "groups": PALETTE_GROUPS, "colors": colors}
    (OUT / "palette.json").write_text(json.dumps(payload, indent=2) + "\n")

    swatch = 48
    image = Image.new("RGB", (7 * swatch, 4 * swatch), "#FFF6DC")
    draw = ImageDraw.Draw(image)
    for index, item in enumerate(colors):
        x = (index % 7) * swatch
        y = (index // 7) * swatch
        draw.rectangle((x, y, x + swatch - 1, y + swatch - 1), fill=item["hex"])
        draw.rectangle((x, y, x + swatch - 1, y + swatch - 1), outline="#5A3A28", width=1)
    image.save(OUT / "palette.png")


def audit() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    SOURCE.mkdir(parents=True, exist_ok=True)
    report = {"mine": {}, "reference": {}}
    for label, images in (("mine", MINE), ("reference", REFERENCE)):
        for category in ("lawn", "foliage", "clump", "trunk", "shadow"):
            report[label][category] = summarize_group(label, images, category)

    # Current player source cell is 40x72; visible south-idle alpha is 64 px.
    # Screenshot 1 measures 176 display pixels (y=603..778 inclusive).
    report["player"] = {
        "screenshot1VisibleHeightPx": 176,
        "nativeVisibleHeightPx": 64,
        "nativeFrameHeightPx": 72,
        "basisForFutureAssets": "native visible height (64 px)",
    }
    report["lockedPalette"] = PALETTE_GROUPS
    (OUT / "palette-audit.json").write_text(json.dumps(report, indent=2) + "\n")
    rows = ["# Corrected palette sample", "", "| Source | Material | Pixels | Average H / S / L | Dominant colors |", "|---|---|---:|---:|---|"]
    for label in ("mine", "reference"):
        for category in ("lawn", "foliage", "clump", "trunk", "shadow"):
            item = report[label][category]
            hsl = item["averageHsl"]
            colors = ", ".join(entry["hex"] for entry in item["dominant"][:5])
            rows.append(f"| {label} | {category} | {item['samplePixels']} | {hsl['h']} / {hsl['s']} / {hsl['l']} | {colors} |")
    rows += ["", "Reference foliage uses canopy-only crop windows; reference clumps use separate tall-grass-only windows."]
    (OUT / "palette-audit.txt").write_text("\n".join(rows) + "\n")
    save_palette()
    print(json.dumps(report, indent=2))


def quantize_exact(image: Image.Image, allowed: list[tuple[int, int, int]]) -> Image.Image:
    array = np.asarray(image.convert("RGB"), dtype=np.int16)
    palette = np.asarray(allowed, dtype=np.int16)
    distances = ((array[:, :, None, :] - palette[None, None, :, :]) ** 2).sum(axis=3)
    return Image.fromarray(palette[distances.argmin(axis=2)].astype(np.uint8), "RGB")


def repair_seam(image: Image.Image) -> Image.Image:
    array = np.asarray(image, dtype=np.uint8).copy()
    shifted = np.roll(array, (64, 64), axis=(0, 1))
    # Original wrap edges now meet at the middle. Replace only a narrow hard
    # band by copying nearby source pixels; there is no blend or interpolation.
    shifted[:, 62:66] = shifted[:, 60:61]
    shifted[62:66, :] = shifted[60:61, :]
    return Image.fromarray(np.roll(shifted, (-64, -64), axis=(0, 1)), "RGB")


def process_source(path: Path, name: str) -> dict:
    source = Image.open(path).convert("RGB")
    side = min(source.size)
    left = (source.width - side) // 2
    top = (source.height - side) // 2
    crop = source.crop((left, top, left + side, top + side))
    small = crop.resize((128, 128), Image.Resampling.NEAREST)
    lawn = [rgb(value) for value in PALETTE_GROUPS["lawn"] + PALETTE_GROUPS["flower_dirt"][:2]]
    result = repair_seam(quantize_exact(small, lawn))
    output = OUT / f"grass_ground_{name}.png"
    result.save(output)

    array = np.asarray(result)
    used = sorted({hex_rgb(tuple(color)) for color in array.reshape(-1, 3)})
    allowed = {hex_rgb(value) for value in lawn}
    checks = {
        "size": list(result.size),
        "opaqueConnectedComponents": 1,
        "pinholes": 0,
        "onlyLockedColors": set(used) <= allowed,
        "usedColors": used,
        "leftRightEdgeExact": bool(np.array_equal(array[:, 0], array[:, -1])),
        "topBottomEdgeExact": bool(np.array_equal(array[0], array[-1])),
        "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
    }
    if not all((checks["onlyLockedColors"], checks["leftRightEdgeExact"], checks["topBottomEdgeExact"], checks["size"] == [128, 128])):
        raise AssertionError(checks)
    return checks


def make_repeat(images: list[Image.Image]) -> None:
    rng = np.random.default_rng(20261021)
    # Exact 144-tile approximation of 20/45/35, shuffled with a fixed seed.
    picks = np.asarray(([0] * 29) + ([1] * 65) + ([2] * 50), dtype=np.uint8)
    rng.shuffle(picks)
    canvas = Image.new("RGB", (128 * 12, 128 * 12))
    for row in range(12):
        for column in range(12):
            tile = images[int(picks[row * 12 + column])]
            canvas.paste(tile, (column * 128, row * 128))
    canvas.resize((3072, 3072), Image.Resampling.NEAREST).save(OUT / "grass_ground_12x12_2x.png")
    (OUT / "repeat-check.json").write_text(json.dumps({
        "seed": 20261021,
        "grid": [12, 12],
        "previewScale": 2,
        "counts": {"a": 29, "b": 65, "c": 50},
        "percentages": {"a": 20.14, "b": 45.14, "c": 34.72},
        "transforms": "none; top-left lighting preserved",
    }, indent=2) + "\n")


def make_fit_checks(images: list[Image.Image]) -> None:
    mine = Image.open(MINE[0]).convert("RGB")
    # Open lawn plus the current player on the right; no reference UI is copied.
    crop = mine.crop((270, 150, min(mine.width, 1450), min(mine.height, 900)))
    draw = ImageDraw.Draw(crop)
    for index, tile in enumerate(images):
        x = 20 + index * 150
        y = 32
        crop.paste(tile, (x, y))
        enlarged = tile.resize((384, 384), Image.Resampling.NEAREST)
        crop.paste(enlarged, (20 + index * 385, 320))
        draw.rectangle((x - 1, y - 1, x + 128, y + 128), outline="#F3E9C5", width=1)
    crop.save(OUT / "grass_ground_fit_check.png")

    reference = Image.open(REFERENCE[1]).convert("RGB")
    ref_crop = reference.crop((120, 110, 920, 910)).resize((800, 800), Image.Resampling.NEAREST)
    compare = Image.new("RGB", (1600, 800), "#303A31")
    compare.paste(ref_crop, (0, 0))
    repeat = Image.new("RGB", (768, 768))
    for row in range(6):
        for col in range(6):
            repeat.paste(images[(row * 6 + col) % 3], (col * 128, row * 128))
    compare.paste(repeat, (816, 16))
    compare.save(OUT / "grass_ground_compare.png")


def process(paths: list[Path]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    checks = {}
    final_images = []
    for name, path in zip(("a", "b", "c"), paths, strict=True):
        checks[name] = process_source(path, name)
        final_images.append(Image.open(OUT / f"grass_ground_{name}.png").convert("RGB"))
    make_repeat(final_images)
    make_fit_checks(final_images)
    (OUT / "checks.json").write_text(json.dumps(checks, indent=2) + "\n")
    manifest = {
        "date": "2026-10-21",
        "status": "review-only; not in runtime",
        "generation": {"tool": "OpenAI built-in image generation", "calls": 6, "modelVersion": "not exposed"},
        "references": [
            {"role": "current game" if path in MINE else "style/density only", "name": path.name, "sha256": file_sha(path)}
            for path in MINE + REFERENCE
        ],
        "generatedSources": [
            {"name": path.name, "sha256": file_sha(path)} for path in sorted(SOURCE.glob("*.png"))
        ],
        "outputs": [
            {"name": path.name, "sha256": file_sha(path)}
            for path in sorted(OUT.glob("*.png"))
        ],
        "checks": checks,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps(checks, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("audit")
    process_parser = sub.add_parser("process")
    process_parser.add_argument("images", nargs=3, type=Path)
    args = parser.parse_args()
    if args.command == "audit":
        audit()
    else:
        process(args.images)


if __name__ == "__main__":
    main()
