#!/usr/bin/env python3
"""Rebuild the supplied fountain's water as a deterministic eight-frame loop.

Pillow and numpy are the only image dependencies. Every animation operation is
restricted to a flood-filled source-water mask and uses source palette colours.
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


FPS = 8
FRAMES = 8
MAX_CHANGED_RATIO = 0.08
DARK_PREVIEW_BG = (38, 62, 56, 255)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def flood_fill(allowed: np.ndarray, seeds: list[tuple[int, int]]) -> np.ndarray:
    height, width = allowed.shape
    result = np.zeros_like(allowed)
    queue: deque[tuple[int, int]] = deque()
    for x, y in seeds:
        if 0 <= x < width and 0 <= y < height and allowed[y, x]:
            result[y, x] = True
            queue.append((x, y))
    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height and allowed[ny, nx] and not result[ny, nx]:
                result[ny, nx] = True
                queue.append((nx, ny))
    return result


def source_palette(array: np.ndarray) -> set[tuple[int, int, int, int]]:
    return {tuple(int(v) for v in pixel) for pixel in array.reshape(-1, 4)}


def water_palette(array: np.ndarray) -> list[tuple[int, int, int, int]]:
    palette = source_palette(array)
    colours = [
        colour for colour in palette
        if colour[3] > 0 and colour[2] > colour[1] > colour[0] and colour[2] - colour[0] >= 12
    ]
    return sorted(colours, key=lambda colour: sum(colour[:3]))


def build_water_mask(base: np.ndarray) -> tuple[np.ndarray, list[tuple[int, int, int, int]]]:
    colours = water_palette(base)
    if len(colours) != 3:
        raise AssertionError(f"expected exactly three source water colours, found {colours}")
    allowed = np.zeros(base.shape[:2], dtype=bool)
    for colour in colours:
        allowed |= np.all(base == colour, axis=2)

    # The basin and bowl are one four-connected water component bounded by the
    # stone. The narrow source streams are diagonal/discontinuous at native
    # resolution, so their three tight corridors are added from source-water
    # pixels only. This still cannot select stone, plants, grass, curb or shadow.
    mask = flood_fill(allowed, [(102, 112), (102, 82)])
    yy, xx = np.indices(mask.shape)
    stream_corridors = (
        ((xx >= 99) & (xx <= 105) & (yy >= 72) & (yy <= 94))
        | ((xx >= 72) & (xx <= 87) & (yy >= 80) & (yy <= 111))
        | ((xx >= 117) & (xx <= 132) & (yy >= 80) & (yy <= 111))
    )
    mask |= allowed & stream_corridors

    if np.any(mask & ~allowed):
        raise AssertionError("water mask touched a non-water source colour")
    return mask, colours


def ellipse_ring(cx: int, cy: int, rx: int, ry: int, shape: tuple[int, int]) -> np.ndarray:
    yy, xx = np.indices(shape)
    outer = ((xx - cx) / max(rx, 1)) ** 2 + ((yy - cy) / max(ry, 1)) ** 2 <= 1.12
    inner_rx, inner_ry = max(0.5, rx - 1), max(0.5, ry - 1)
    inner = ((xx - cx) / inner_rx) ** 2 + ((yy - cy) / inner_ry) ** 2 < 0.78
    return outer & ~inner


def lighten_pixel(frame: np.ndarray, x: int, y: int, mask: np.ndarray, colours: list[tuple[int, int, int, int]]) -> None:
    if not (0 <= y < mask.shape[0] and 0 <= x < mask.shape[1] and mask[y, x]):
        return
    current = tuple(int(v) for v in frame[y, x])
    index = colours.index(current) if current in colours else 0
    frame[y, x] = colours[min(index + 1, len(colours) - 1)]


def animate(base: np.ndarray, mask: np.ndarray, colours: list[tuple[int, int, int, int]]) -> list[np.ndarray]:
    _, mid, light = colours
    # Constant x coordinates keep all highlight motion vertical. Only the
    # highlight dash changes; the source stream body beneath stays untouched.
    streams = [(102, 73, 90), (80, 88, 109), (125, 88, 109)]
    ripples = [(102, 91, 0), (81, 110, 3), (124, 110, 5)]
    glints = [(92, 103, 0), (111, 104, 1), (99, 116, 2), (89, 119, 3),
              (114, 117, 4), (74, 105, 5), (131, 106, 6)]
    bowl = [(98, 82), (102, 80), (106, 82)]
    splash = [(102, 91), (81, 109), (124, 109), (82, 110), (123, 110)]

    frames: list[np.ndarray] = []
    for frame_index in range(FRAMES):
        frame = base.copy()

        # One-pixel-wide, two-pixel-long dashes move down exactly one source
        # pixel per frame. Period eight makes frame 8 -> frame 1 continuous.
        for x, top, bottom in streams:
            for y in range(top, bottom + 1):
                if (y - top - frame_index) % 8 in (0, 1) and mask[y, x]:
                    frame[y, x] = light

        # Each landing event has three visible sizes followed by a blank phase,
        # then remains at rest until its next once-per-second event.
        for cx, cy, offset in ripples:
            age = (frame_index - offset) % FRAMES
            if age < 3:
                rx, ry = ((2, 1), (17, 8), (18, 9))[age]
                ring = ellipse_ring(cx, cy, rx, ry, mask.shape) & mask
                frame[ring] = light if age in (1, 2) else mid

        # Seven fixed surface locations; each is on for two staggered frames.
        for x, y, start in glints:
            if (frame_index - start) % FRAMES in (0, 1):
                lighten_pixel(frame, x, y, mask, colours)

        # Three bowl pixels shimmer on a four-frame cycle.
        for point_index, (x, y) in enumerate(bowl):
            if (frame_index + point_index) % 4 in (0, 1):
                lighten_pixel(frame, x, y, mask, colours)

        # Requested 1-indexed frames 1, 3 and 5 only.
        if frame_index in (0, 2, 4):
            for x, y in splash:
                if mask[y, x]:
                    frame[y, x] = light

        frames.append(frame)
    return frames


def changed_pixels(left: np.ndarray, right: np.ndarray) -> int:
    return int(np.count_nonzero(np.any(left != right, axis=2)))


def diagnose_old(sheet_path: Path, base: np.ndarray, mask: np.ndarray) -> dict:
    sheet = np.array(Image.open(sheet_path).convert("RGBA"), dtype=np.uint8)
    height, frame_width = base.shape[:2]
    if sheet.shape[0] != height or sheet.shape[1] % frame_width:
        return {
            "sheetSize": [int(sheet.shape[1]), int(sheet.shape[0])],
            "frameSizesDiffer": True,
            "cause": "Old sheet cannot be split into source-size frames.",
        }
    count = sheet.shape[1] // frame_width
    frames = [sheet[:, index * frame_width:(index + 1) * frame_width] for index in range(count)]
    transitions = [changed_pixels(frames[index - 1], frames[index]) for index in range(1, count)]
    loop = changed_pixels(frames[-1], frames[0])
    outside = [
        int(np.count_nonzero(np.any(frame[~mask] != base[~mask], axis=1)))
        for frame in frames
    ]
    changed_from_base = [changed_pixels(base, frame) for frame in frames]
    colour_counts = [len(source_palette(frame)) for frame in frames]
    first_transition = transitions[0] if transitions else 0
    return {
        "sheetSize": [int(sheet.shape[1]), int(sheet.shape[0])],
        "frameCount": count,
        "frameSizes": [[frame_width, height] for _ in frames],
        "frameSizesDiffer": False,
        "changedFromBase": changed_from_base,
        "changedBetweenConsecutiveFrames": transitions,
        "outsideMaskChangesFromBase": outside,
        "coloursPerFrame": colour_counts,
        "lastToFirstChangedPixels": loop,
        "firstToSecondChangedPixels": first_transition,
        "loopDeltaVsFirstTransition": abs(loop - first_transition),
        "cause": (
            "The old loop recolours broad stream rectangles and changes roughly ten percent of the "
            "water from the source in every frame. Its highlight phase advances two pixels per frame, "
            "while basin dashes also alternate, making the motion busy instead of a simple one-pixel flow."
        ),
    }


def save_gif(frames: list[np.ndarray], path: Path, dark: bool = False) -> None:
    rendered: list[Image.Image] = []
    for array in frames:
        image = Image.fromarray(array, "RGBA")
        if dark:
            rgba = np.array(image, dtype=np.uint8)
            tinted = rgba.copy()
            tinted[..., :3] = np.clip(
                rgba[..., :3].astype(np.float32) * np.array([0.48, 0.56, 0.66]), 0, 255
            ).astype(np.uint8)
            foreground = Image.fromarray(tinted, "RGBA")
            image = Image.new("RGBA", image.size, DARK_PREVIEW_BG)
            image.alpha_composite(foreground)
        rendered.append(image.resize((image.width * 4, image.height * 4), Image.Resampling.NEAREST))
    rendered[0].save(
        path,
        save_all=True,
        append_images=rendered[1:],
        duration=125,
        loop=0,
        disposal=2,
        optimize=False,
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("base", type=Path)
    parser.add_argument("old_sheet", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--runtime-sheet", type=Path)
    args = parser.parse_args()

    base = np.array(Image.open(args.base).convert("RGBA"), dtype=np.uint8)
    height, width = base.shape[:2]
    mask, colours = build_water_mask(base)
    water_pixels = int(np.count_nonzero(mask))
    if water_pixels == 0:
        raise AssertionError("empty water mask")

    old_diagnosis = diagnose_old(args.old_sheet, base, mask)
    print("OLD ANIMATION DIAGNOSIS")
    print(json.dumps(old_diagnosis, indent=2))

    frames = animate(base, mask, colours)
    palette = source_palette(base)
    changed_from_base = [changed_pixels(base, frame) for frame in frames]
    changed_ratio = [count / water_pixels for count in changed_from_base]
    outside_changes = [
        int(np.count_nonzero(np.any(frame[~mask] != base[~mask], axis=1)))
        for frame in frames
    ]
    palette_violations = [len(source_palette(frame) - palette) for frame in frames]
    transitions = [changed_pixels(frames[index], frames[(index + 1) % FRAMES]) for index in range(FRAMES)]
    seam_tolerance = max(6, round(transitions[0] * 0.35))

    assert all(count == 0 for count in outside_changes), outside_changes
    assert all(count == 0 for count in palette_violations), palette_violations
    assert all(ratio <= MAX_CHANGED_RATIO for ratio in changed_ratio), changed_ratio
    assert abs(transitions[-1] - transitions[0]) <= seam_tolerance, transitions

    args.output_dir.mkdir(parents=True, exist_ok=True)
    for index, frame in enumerate(frames, start=1):
        Image.fromarray(frame, "RGBA").save(args.output_dir / f"fountain_f{index}.png", optimize=False)
    sheet = np.concatenate(frames, axis=1)
    sheet_path = args.output_dir / "fountain_sheet.png"
    Image.fromarray(sheet, "RGBA").save(sheet_path, optimize=False)
    Image.fromarray(frames[0], "RGBA").save(args.output_dir / "fountain_base.png", optimize=False)

    mask_image = np.zeros_like(base)
    mask_image[mask] = (255, 255, 255, 255)
    Image.fromarray(mask_image, "RGBA").save(args.output_dir / "water_mask.png", optimize=False)
    overlay = base.copy()
    overlay[mask, :3] = (
        overlay[mask, :3].astype(np.uint16) // 2 + np.array([127, 0, 0], dtype=np.uint16)
    ).astype(np.uint8)
    Image.fromarray(overlay, "RGBA").save(args.output_dir / "mask_overlay.png", optimize=False)

    ever_changed = np.any(np.stack([np.any(frame != base, axis=2) for frame in frames]), axis=0)
    heatmap = np.zeros_like(base)
    heatmap[ever_changed] = (255, 64, 32, 255)
    Image.fromarray(heatmap, "RGBA").save(args.output_dir / "diff_heatmap.png", optimize=False)
    save_gif(frames, args.output_dir / "fountain_preview.gif")
    save_gif(frames, args.output_dir / "fountain_preview_dark.gif", dark=True)

    if args.runtime_sheet:
        args.runtime_sheet.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(sheet_path, args.runtime_sheet)

    report = {
        "frameSize": [width, height],
        "frames": FRAMES,
        "fps": FPS,
        "sheetSize": [width * FRAMES, height],
        "waterPalette": [list(colour) for colour in colours],
        "waterMaskPixels": water_pixels,
        "maskTouchesExcludedPixels": False,
        "changedWaterPixelsFromBase": changed_from_base,
        "changedWaterPercentFromBase": [round(ratio * 100, 3) for ratio in changed_ratio],
        "maximumAllowedChangedPixels": int(np.floor(water_pixels * MAX_CHANGED_RATIO)),
        "outsideMaskChanges": outside_changes,
        "paletteViolations": palette_violations,
        "transitionChangedPixels": transitions,
        "lastToFirstVsFirstToSecondDelta": abs(transitions[-1] - transitions[0]),
        "seamTolerance": seam_tolerance,
        "checks": {
            "outsideMaskIdentical": True,
            "originalPaletteOnly": True,
            "underEightPercentBudget": True,
            "seamSimilar": True,
        },
        "baseSha256": sha256(args.base),
        "sheetSha256": sha256(sheet_path),
        "oldAnimationDiagnosis": old_diagnosis,
    }
    (args.output_dir / "animation_report.json").write_text(json.dumps(report, indent=2) + "\n")
    print("NEW ANIMATION CHECKS")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
