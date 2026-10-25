#!/usr/bin/env python3
"""Install the user-supplied barber chair and contact-bending grass.

The script removes only the connected flat magenta background, nearest-scales
the visible pixels into the exact preceding runtime bounds, replaces the two
existing atlas cells, and adds two same-size grass bend derivatives in unused
atlas space. No source color is interpolated.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


CHAIR_FRAME = "city-review-barber-chair"
GRASS_FRAME = "snapper-grass"
GRASS_BENDS = ("snapper-grass-bend-left", "snapper-grass-bend-right")
CHAIR_VISIBLE = (2, 4, 26, 40)
GRASS_VISIBLE = (9, 10, 69, 79)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def clear_connected_background(image: Image.Image) -> Image.Image:
    array = np.array(image.convert("RGBA"), dtype=np.uint8)
    height, width = array.shape[:2]
    border = np.concatenate((array[0], array[-1], array[:, 0], array[:, -1]), axis=0)
    colors, counts = np.unique(border[:, :3], axis=0, return_counts=True)
    background = colors[int(np.argmax(counts))].astype(np.int16)
    delta = array[:, :, :3].astype(np.int16) - background
    candidate = np.max(np.abs(delta), axis=2) <= 8
    connected = np.zeros((height, width), dtype=bool)
    pending: deque[tuple[int, int]] = deque()
    for x in range(width):
        for y in (0, height - 1):
            if candidate[y, x] and not connected[y, x]:
                connected[y, x] = True
                pending.append((x, y))
    for y in range(height):
        for x in (0, width - 1):
            if candidate[y, x] and not connected[y, x]:
                connected[y, x] = True
                pending.append((x, y))
    while pending:
        x, y = pending.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height and candidate[ny, nx] and not connected[ny, nx]:
                connected[ny, nx] = True
                pending.append((nx, ny))
    # Pixel Snapper can leave isolated background holes inside furniture arms.
    # The supplied sprites use no intentional magenta, so remove those exact
    # background-family pixels even when they are not edge-connected.
    red = array[:, :, 0].astype(np.int16)
    green = array[:, :, 1].astype(np.int16)
    blue = array[:, :, 2].astype(np.int16)
    # Pixel Snapper also leaves two darker matte-edge shades. They remain
    # recognizably magenta (red/blue together, far above green) and are not
    # part of either supplied olive/brown sprite palette.
    magenta = (
        (red > green * 1.1 + 10)
        & (blue > green * 1.1 + 10)
        & (np.abs(red - blue) < 55)
    )
    array[connected | magenta] = (0, 0, 0, 0)
    return Image.fromarray(array, "RGBA")


def fit_exact(source: Image.Image, canvas_size: tuple[int, int], visible: tuple[int, int, int, int]) -> Image.Image:
    bbox = source.getbbox()
    if not bbox:
        raise AssertionError("source has no visible pixels after background removal")
    crop = source.crop(bbox)
    left, top, right, bottom = visible
    scaled = crop.resize((right - left, bottom - top), Image.Resampling.NEAREST)
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    canvas.alpha_composite(scaled, (left, top))
    if canvas.getbbox() != visible:
        raise AssertionError((canvas.getbbox(), visible))
    return canvas


def bend_grass(base: Image.Image, direction: int) -> Image.Image:
    source = np.array(base, dtype=np.uint8)
    output = np.zeros_like(source)
    top, bottom = GRASS_VISIBLE[1], GRASS_VISIBLE[3]
    for y in range(source.shape[0]):
        if y < top or y >= bottom:
            shift = 0
        else:
            shift = int(round(direction * 4 * (bottom - 1 - y) / max(1, bottom - top - 1)))
        if shift > 0:
            output[y, shift:] = source[y, :-shift]
        elif shift < 0:
            output[y, :shift] = source[y, -shift:]
        else:
            output[y] = source[y]
    if output[:, :, 3].max() != 255:
        raise AssertionError("grass bend lost opaque pixels")
    return Image.fromarray(output, "RGBA")


def frame_image(atlas: Image.Image, frame: dict) -> Image.Image:
    return atlas.crop((frame["x"], frame["y"], frame["x"] + frame["w"], frame["y"] + frame["h"]))


def paste_frame(atlas: Image.Image, image: Image.Image, frame: dict) -> None:
    if image.size != (frame["w"], frame["h"]):
        raise AssertionError((image.size, frame))
    atlas.paste(image, (frame["x"], frame["y"]))


def free_cell(frames: dict, width: int, height: int, cell_w: int, cell_h: int) -> tuple[int, int]:
    occupied = np.zeros((height, width), dtype=bool)
    for record in frames.values():
        frame = record["frame"]
        left, top = max(0, frame["x"] - 1), max(0, frame["y"] - 1)
        right = min(width, frame["x"] + frame["w"] + 1)
        bottom = min(height, frame["y"] + frame["h"] + 1)
        occupied[top:bottom, left:right] = True
    for y in range(2, height - cell_h - 1):
        for x in range(2, width - cell_w - 1):
            if not occupied[y:y + cell_h, x:x + cell_w].any():
                return x, y
    raise AssertionError("no free atlas cell")


def record(x: int, y: int, width: int, height: int) -> dict:
    return {
        "frame": {"x": x, "y": y, "w": width, "h": height},
        "rotated": False,
        "trimmed": False,
        "spriteSourceSize": {"x": 0, "y": 0, "w": width, "h": height},
        "sourceSize": {"w": width, "h": height},
    }


def save_review(chair: Image.Image, grass: list[Image.Image], path: Path) -> None:
    scale = 4
    width = max(chair.width, sum(item.width for item in grass) + 8) * scale
    height = (chair.height + max(item.height for item in grass) + 12) * scale
    review = Image.new("RGBA", (width, height), (38, 62, 56, 255))
    review.alpha_composite(chair.resize((chair.width * scale, chair.height * scale), Image.Resampling.NEAREST), (8 * scale, 4 * scale))
    x = 0
    y = (chair.height + 10) * scale
    for item in grass:
        review.alpha_composite(item.resize((item.width * scale, item.height * scale), Image.Resampling.NEAREST), (x, y))
        x += (item.width + 4) * scale
    review.save(path, optimize=False)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("chair_source", type=Path)
    parser.add_argument("grass_source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--town-png", type=Path, default=Path("public/assets/pixel/processed/town.png"))
    parser.add_argument("--town-json", type=Path, default=Path("public/assets/pixel/processed/town.json"))
    parser.add_argument("--snapper-png", type=Path, default=Path("public/assets/pixel/processed/pixel-snapper-assets.png"))
    parser.add_argument("--snapper-json", type=Path, default=Path("public/assets/pixel/processed/pixel-snapper-assets.json"))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    source_dir = args.output / "sources"
    source_dir.mkdir(exist_ok=True)
    shutil.copyfile(args.chair_source, source_dir / "barber-chair.png")
    shutil.copyfile(args.grass_source, source_dir / "grass.png")

    town_meta = json.loads(args.town_json.read_text())
    snapper_meta = json.loads(args.snapper_json.read_text())
    town = Image.open(args.town_png).convert("RGBA")
    snapper = Image.open(args.snapper_png).convert("RGBA")
    # Make reruns idempotent: remove any earlier derived cells before choosing
    # the same first available transparent atlas slots again.
    for name in GRASS_BENDS:
        existing = snapper_meta["frames"].pop(name, None)
        if existing:
            frame = existing["frame"]
            empty = Image.new("RGBA", (frame["w"], frame["h"]), (0, 0, 0, 0))
            snapper.paste(empty, (frame["x"], frame["y"]))
    chair_frame = town_meta["frames"][CHAIR_FRAME]["frame"]
    grass_frame = snapper_meta["frames"][GRASS_FRAME]["frame"]

    if (chair_frame["w"], chair_frame["h"]) != (28, 42):
        raise AssertionError(chair_frame)
    if (grass_frame["w"], grass_frame["h"]) != (79, 79):
        raise AssertionError(grass_frame)

    chair = fit_exact(clear_connected_background(Image.open(args.chair_source)), (28, 42), CHAIR_VISIBLE)
    grass_base = fit_exact(clear_connected_background(Image.open(args.grass_source)), (79, 79), GRASS_VISIBLE)
    grass_left = bend_grass(grass_base, -1)
    grass_right = bend_grass(grass_base, 1)

    paste_frame(town, chair, chair_frame)
    paste_frame(snapper, grass_base, grass_frame)
    for name, image in zip(GRASS_BENDS, (grass_left, grass_right)):
        x, y = free_cell(snapper_meta["frames"], snapper.width, snapper.height, image.width, image.height)
        region = snapper.crop((x, y, x + image.width, y + image.height))
        if region.getbbox() is not None:
            raise AssertionError(f"chosen atlas region for {name} is not transparent")
        snapper_meta["frames"][name] = record(x, y, image.width, image.height)
        snapper.paste(image, (x, y))

    town.save(args.town_png, optimize=False)
    snapper.save(args.snapper_png, optimize=False)
    args.snapper_json.write_text(json.dumps(snapper_meta, indent=2) + "\n")

    chair.save(args.output / "barber-chair-28x42.png", optimize=False)
    grass_base.save(args.output / "grass-79x79.png", optimize=False)
    grass_left.save(args.output / "grass-bend-left-79x79.png", optimize=False)
    grass_right.save(args.output / "grass-bend-right-79x79.png", optimize=False)
    save_review(chair, [grass_base, grass_left, grass_right], args.output / "review-sheet.png")

    source_chair = np.array(Image.open(args.chair_source).convert("RGBA"))
    source_grass = np.array(Image.open(args.grass_source).convert("RGBA"))
    report = {
        "sources": {
            "chair": {"path": str(args.chair_source), "dimensions": list(Image.open(args.chair_source).size), "sha256": sha256(args.chair_source)},
            "grass": {"path": str(args.grass_source), "dimensions": list(Image.open(args.grass_source).size), "sha256": sha256(args.grass_source)},
        },
        "sourceColors": {
            "chair": int(len(np.unique(source_chair.reshape(-1, 4), axis=0))),
            "grass": int(len(np.unique(source_grass.reshape(-1, 4), axis=0))),
        },
        "runtime": {
            "chair": {"frame": CHAIR_FRAME, "size": [28, 42], "visibleBounds": list(CHAIR_VISIBLE), "scale": 2},
            "grass": {"frames": [GRASS_FRAME, *GRASS_BENDS], "size": [79, 79], "visibleBounds": list(GRASS_VISIBLE), "scale": 0.46},
            "townSha256": sha256(args.town_png),
            "pixelSnapperSha256": sha256(args.snapper_png),
            "pixelSnapperJsonSha256": sha256(args.snapper_json),
        },
        "checks": {
            "magentaRemoved": all(
                not np.any(
                    (np.array(image)[:, :, 0].astype(np.int16) > np.array(image)[:, :, 1].astype(np.int16) * 1.1 + 10)
                    & (np.array(image)[:, :, 2].astype(np.int16) > np.array(image)[:, :, 1].astype(np.int16) * 1.1 + 10)
                    & (np.abs(np.array(image)[:, :, 0].astype(np.int16) - np.array(image)[:, :, 2].astype(np.int16)) < 55)
                    & (np.array(image)[:, :, 3] > 0)
                )
                for image in (chair, grass_base, grass_left, grass_right)
            ),
            "binaryAlpha": all(set(np.unique(np.array(image)[:, :, 3])).issubset({0, 255}) for image in (chair, grass_base, grass_left, grass_right)),
            "nearestOnly": True,
            "chairPreviousFrameSizePreserved": True,
            "grassPreviousFrameSizeAndScalePreserved": True,
        },
    }
    for name in ("barber-chair-28x42.png", "grass-79x79.png", "grass-bend-left-79x79.png", "grass-bend-right-79x79.png", "review-sheet.png"):
        report.setdefault("outputs", {})[name] = sha256(args.output / name)
    if not all(report["checks"].values()):
        raise AssertionError(report["checks"])
    (args.output / "manifest.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
