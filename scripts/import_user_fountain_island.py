#!/usr/bin/env python3
"""Import the user fountain and build a simple four-frame water-only loop.

The flowing image owns every visible object pixel. Animation changes only its
three existing blue/teal palette colours, so the island, rim and plants remain
pixel-identical and the streams can never turn into dark outlines.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from pathlib import Path

import numpy as np
from PIL import Image


FRAME_SIZE = (207, 214)
WATER_BOUNDS = (66, 58, 141, 141)


def transparent_source(path: Path) -> np.ndarray:
    image = Image.open(path).convert("RGBA")
    canvas = Image.new("RGBA", FRAME_SIZE, (0, 0, 0, 0))
    canvas.paste(image, (0, 0))
    array = np.array(canvas, dtype=np.uint8)
    magenta = (
        (array[..., 0] >= 230)
        & (array[..., 1] <= 20)
        & (array[..., 2] >= 230)
    )
    array[magenta] = (0, 0, 0, 0)
    return array


def opaque_palette(array: np.ndarray) -> np.ndarray:
    return np.unique(array[array[..., 3] > 0, :3].reshape(-1, 3), axis=0)


def water_colour(rgb: np.ndarray) -> np.ndarray:
    red, green, blue = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    return (blue > green) & (green > red) & ((blue.astype(int) - red) >= 12)


def water_frames(base: np.ndarray) -> tuple[list[np.ndarray], np.ndarray]:
    left, top, right, bottom = WATER_BOUNDS
    yy, xx = np.indices(base.shape[:2])
    inside = (xx >= left) & (xx < right) & (yy >= top) & (yy < bottom)
    mask = inside & (base[..., 3] > 0) & water_colour(base[..., :3])
    colours = opaque_palette(base)
    water_palette = colours[water_colour(colours)]
    water_palette = water_palette[np.argsort(water_palette.astype(int).sum(axis=1))]
    dark, mid, light = water_palette[0], water_palette[len(water_palette) // 2], water_palette[-1]

    stream_specs = [
        ((xx >= 100) & (xx <= 103) & (yy >= 73) & (yy <= 90), 0),
        ((xx >= 79) & (xx <= 82) & (yy >= 87) & (yy <= 109), 2),
        ((xx >= 124) & (xx <= 127) & (yy >= 87) & (yy <= 109), 4),
    ]
    frames: list[np.ndarray] = []
    for index in range(4):
        frame = base.copy()
        for stream, offset in stream_specs:
            stream &= mask
            # Keep a constant pale stream body. Only this short highlight
            # travels, so the flow reads without flashing or disappearing.
            frame[stream, :3] = mid
            highlight = stream & (((yy - index * 2 + offset) % 8) < 2)
            frame[highlight, :3] = light

        # Four tiny landing-ripple dashes alternate with the stream phase.
        # They never expand, reset abruptly, or recolour the wider basin.
        for cx, cy, offset in [(81, 109, 0), (124, 109, 1)]:
            for dx, dy in [(-5, 0), (-4, 1), (4, 1), (5, 0)]:
                ripple = mask & (xx == cx + dx) & (yy == cy + dy)
                frame[ripple, :3] = light if (index + offset) % 2 == 0 else mid
        frames.append(frame)
    return frames, mask


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("flowing", type=Path)
    parser.add_argument("calm", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("evidence", type=Path)
    args = parser.parse_args()

    flowing = transparent_source(args.flowing)
    calm_source = transparent_source(args.calm)
    frames, water_mask = water_frames(flowing)
    sheet = np.concatenate(frames, axis=1)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(sheet, "RGBA").save(args.output, optimize=False)

    args.evidence.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(args.flowing, args.evidence / "user-source-flowing.png")
    shutil.copyfile(args.calm, args.evidence / "user-source-calm.png")
    Image.fromarray(flowing, "RGBA").save(args.evidence / "processed-flowing.png")
    Image.fromarray(calm_source, "RGBA").save(args.evidence / "processed-calm.png")
    mask_image = np.zeros((*water_mask.shape, 4), dtype=np.uint8)
    mask_image[water_mask] = (255, 255, 255, 255)
    Image.fromarray(mask_image, "RGBA").save(args.evidence / "water-mask.png")

    visible = np.any(flowing[..., 3] > 0, axis=0) if flowing.ndim == 4 else flowing[..., 3] > 0
    ys, xs = np.nonzero(visible)
    report = {
        "frameSize": list(FRAME_SIZE),
        "frames": 4,
        "fps": 6,
        "sheetSize": [FRAME_SIZE[0] * 4, FRAME_SIZE[1]],
        "visibleBounds": [int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1)],
        "waterMaskPixels": int(np.count_nonzero(water_mask)),
        "changedPixelsByFrame": [int(np.count_nonzero(np.any(flowing != frame, axis=2))) for frame in frames],
        "nonWaterChanges": [int(np.count_nonzero(np.any(flowing[~water_mask] != frame[~water_mask], axis=1))) for frame in frames],
        "sourceUse": "The flowing source owns all runtime object pixels; the calm source is retained as user-supplied evidence only.",
        "runtimeSha256": sha256(args.output),
        "sourceSha256": {"flowing": sha256(args.flowing), "calm": sha256(args.calm)},
    }
    (args.evidence / "import-report.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
