#!/usr/bin/env python3
"""Create the restrained v5 fountain-water loop from the untouched sprite.

This implementation intentionally starts from the static source and defines
new native-pixel stream, jet, ripple and glint behavior. It does not read or
derive any animation geometry from the superseded sprite sheets.
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


FRAME_COUNT = 8
FRAME_RATE = 8
CHANGE_LIMIT = 0.03
LANDINGS = ((82, 109), (102, 85), (124, 109))
RIPPLE_OFFSETS = (0, 3, 5)
TOP_JET_TIP = (102, 73)


def file_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def palette_of(image: np.ndarray) -> set[tuple[int, int, int, int]]:
    return {tuple(map(int, pixel)) for pixel in image.reshape(-1, 4)}


def select_water_colours(image: np.ndarray) -> list[tuple[int, int, int, int]]:
    selected = [
        colour for colour in palette_of(image)
        if colour[3] == 255
        and colour[2] > colour[1] > colour[0]
        and colour[2] - colour[0] >= 12
    ]
    selected.sort(key=lambda colour: sum(colour[:3]))
    if len(selected) != 3:
        raise AssertionError(f"expected three existing water colours, found {selected}")
    return selected


def fill_component(allowed: np.ndarray, seed: tuple[int, int]) -> np.ndarray:
    height, width = allowed.shape
    sx, sy = seed
    if not allowed[sy, sx]:
        raise AssertionError(f"flood-fill seed {seed} is not source water")
    filled = np.zeros_like(allowed)
    filled[sy, sx] = True
    pending: deque[tuple[int, int]] = deque([(sx, sy)])
    while pending:
        x, y = pending.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height and allowed[ny, nx] and not filled[ny, nx]:
                filled[ny, nx] = True
                pending.append((nx, ny))
    return filled


def erode_one(mask: np.ndarray) -> np.ndarray:
    padded = np.pad(mask, 1, constant_values=False)
    result = mask.copy()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dx or dy:
                result &= padded[1 + dy:1 + dy + mask.shape[0], 1 + dx:1 + dx + mask.shape[1]]
    return result


def make_masks(image: np.ndarray, colours: list[tuple[int, int, int, int]]) -> dict[str, np.ndarray]:
    source_water = np.zeros(image.shape[:2], dtype=bool)
    for colour in colours:
        source_water |= np.all(image == colour, axis=2)
    yy, xx = np.indices(source_water.shape)

    basin_candidates = source_water & (xx >= 70) & (xx <= 134) & (yy >= 92) & (yy <= 125)
    surface_raw = fill_component(basin_candidates, (102, 116))
    surface_safe = erode_one(surface_raw)
    rim_guard = surface_raw & ~surface_safe

    bowl_candidates = source_water & (xx >= 88) & (xx <= 116) & (yy >= 74) & (yy <= 91)
    bowl = fill_component(bowl_candidates, (102, 86))

    left_stream = source_water & (xx >= 76) & (xx <= 86) & (yy >= 82) & (yy <= 110)
    right_stream = source_water & (xx >= 119) & (xx <= 130) & (yy >= 82) & (yy <= 110)
    jet = source_water & (xx >= 98) & (xx <= 106) & (yy >= 73) & (yy <= 90)
    animation = (surface_safe | bowl | left_stream | right_stream | jet) & ~rim_guard

    if np.any(animation & ~source_water):
        raise AssertionError("animation mask selected a non-water source pixel")
    return {
        "source_water": source_water,
        "surface_raw": surface_raw,
        "surface_safe": surface_safe,
        "rim_guard": rim_guard,
        "bowl": bowl,
        "left_stream": left_stream,
        "right_stream": right_stream,
        "jet": jet,
        "animation": animation,
    }


def ellipse_outline(center: tuple[int, int], radius: int, shape: tuple[int, int]) -> np.ndarray:
    """Return a one-pixel pixel-art ellipse no wider than 2*radius pixels."""
    cx, cy = center
    half_height = max(1, radius // 2)
    yy, xx = np.indices(shape)
    px = xx - (cx - 0.5)
    py = yy - (cy - 0.5)
    outer = (px / radius) ** 2 + (py / half_height) ** 2 <= 1.0
    inner_x = max(0.5, radius - 1)
    inner_y = max(0.5, half_height - 1)
    inner = (px / inner_x) ** 2 + (py / inner_y) ** 2 < 1.0
    return outer & ~inner


def next_lighter(frame: np.ndarray, x: int, y: int, mask: np.ndarray, colours: list[tuple[int, int, int, int]]) -> None:
    if not (0 <= y < mask.shape[0] and 0 <= x < mask.shape[1] and mask[y, x]):
        return
    current = tuple(map(int, frame[y, x]))
    if current not in colours:
        raise AssertionError(f"animation point {(x, y)} is not source water")
    frame[y, x] = colours[min(colours.index(current) + 1, len(colours) - 1)]


def animate(source: np.ndarray, masks: dict[str, np.ndarray], colours: list[tuple[int, int, int, int]]) -> list[np.ndarray]:
    allowed = masks["animation"]
    mid, pale = colours[1], colours[2]
    stream_lines = ((80, 88, 109), (102, 76, 89), (125, 88, 109))
    glints = ((91, 103, 0), (111, 104, 1), (98, 116, 2),
              (88, 119, 3), (114, 117, 4), (75, 105, 6))
    bowl_shimmer = ((97, 86), (102, 88), (107, 86))

    frames: list[np.ndarray] = []
    for tick in range(FRAME_COUNT):
        frame = source.copy()

        # Three straight, one-pixel columns. Two-pixel dashes move down by one
        # native row per frame and repeat on the eight-frame boundary.
        for x, top, bottom in stream_lines:
            for y in range(top, bottom + 1):
                if (y - top - tick) % 8 in (0, 1):
                    next_lighter(frame, x, y, allowed, colours)

        # The central source-water tip alternates between its two native rows.
        # No stone pixel above the jet is ever replaced.
        for y in (73, 74):
            if allowed[y, TOP_JET_TIP[0]]:
                frame[y, TOP_JET_TIP[0]] = mid
        tip_y = (73, 74, 74, 73)[tick % 4]
        frame[tip_y, TOP_JET_TIP[0]] = pale
        rising_y = 83 - tick
        next_lighter(frame, 101, rising_y, allowed, colours)

        # One ripple event per landing and per second. The 2/4/6-radius shapes
        # are newly defined compact ellipses; there are no sweeping basin arcs.
        for center, start in zip(LANDINGS, RIPPLE_OFFSETS):
            age = (tick - start) % FRAME_COUNT
            if age < 3:
                radius = (2, 4, 6)[age]
                ring = ellipse_outline(center, radius, allowed.shape)
                if np.any(ring & ~allowed):
                    raise AssertionError(f"radius-{radius} ring at {center} leaves the eroded water mask")
                ys, xs = np.nonzero(ring)
                for x, y in zip(xs, ys):
                    next_lighter(frame, int(x), int(y), allowed, colours)

        # Six fixed one-pixel glints, each visible for two staggered frames.
        for x, y, start in glints:
            if (tick - start) % FRAME_COUNT in (0, 1):
                next_lighter(frame, x, y, allowed, colours)

        # Three fixed bowl pixels shimmer on a four-frame cycle.
        for index, (x, y) in enumerate(bowl_shimmer):
            if (tick + index) % 4 in (0, 1):
                next_lighter(frame, x, y, allowed, colours)

        frames.append(frame)
    return frames


def count_changes(left: np.ndarray, right: np.ndarray) -> int:
    return int(np.count_nonzero(np.any(left != right, axis=2)))


def connected_changed_pale_bounds(frame: np.ndarray, source: np.ndarray, pale: tuple[int, int, int, int]) -> list[tuple[int, int]]:
    changed = np.any(frame != source, axis=2)
    selected = changed & np.all(frame == pale, axis=2)
    height, width = selected.shape
    seen = np.zeros_like(selected)
    bounds: list[tuple[int, int]] = []
    for sy, sx in zip(*np.nonzero(selected)):
        if seen[sy, sx]:
            continue
        seen[sy, sx] = True
        stack = [(int(sx), int(sy))]
        xs: list[int] = []
        ys: list[int] = []
        while stack:
            x, y = stack.pop()
            xs.append(x)
            ys.append(y)
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    nx, ny = x + dx, y + dy
                    if (dx or dy) and 0 <= nx < width and 0 <= ny < height and selected[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        stack.append((nx, ny))
        bounds.append((max(xs) - min(xs) + 1, max(ys) - min(ys) + 1))
    return bounds


def save_preview(frames: list[np.ndarray], path: Path) -> None:
    images = [
        Image.fromarray(frame, "RGBA").resize(
            (frame.shape[1] * 4, frame.shape[0] * 4), Image.Resampling.NEAREST
        )
        for frame in frames
    ]
    images[0].save(path, save_all=True, append_images=images[1:], duration=125, loop=0, disposal=2, optimize=False)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--runtime-sheet", type=Path)
    args = parser.parse_args()

    source = np.array(Image.open(args.source).convert("RGBA"), dtype=np.uint8)
    height, width = source.shape[:2]
    colours = select_water_colours(source)
    masks = make_masks(source, colours)
    frames = animate(source, masks, colours)
    allowed = masks["animation"]
    water_count = int(np.count_nonzero(allowed))
    original_palette = palette_of(source)

    changed_from_base = [count_changes(source, frame) for frame in frames]
    changed_percent = [100 * value / water_count for value in changed_from_base]
    outside = [int(np.count_nonzero(np.any(frame[~allowed] != source[~allowed], axis=1))) for frame in frames]
    rim_changes = [int(np.count_nonzero(np.any(frame[masks["rim_guard"]] != source[masks["rim_guard"]], axis=1))) for frame in frames]
    new_colours = [len(palette_of(frame) - original_palette) for frame in frames]
    transitions = [count_changes(frames[index], frames[(index + 1) % FRAME_COUNT]) for index in range(FRAME_COUNT)]
    transition_mean = sum(transitions) / len(transitions)
    transition_deviation = max(abs(value - transition_mean) for value in transitions)
    seam_delta = abs(transitions[-1] - transitions[0])
    pale_bounds = [connected_changed_pale_bounds(frame, source, colours[2]) for frame in frames]
    max_pale_width = max((width for frame_bounds in pale_bounds for width, _ in frame_bounds), default=0)
    max_pale_height = max((height for frame_bounds in pale_bounds for _, height in frame_bounds), default=0)

    assert all(value == 0 for value in outside), outside
    assert all(value == 0 for value in rim_changes), rim_changes
    assert all(value == 0 for value in new_colours), new_colours
    assert all(value <= CHANGE_LIMIT * water_count for value in changed_from_base), changed_percent
    assert max_pale_width <= 12 and max_pale_height <= 12, (max_pale_width, max_pale_height)
    assert seam_delta <= max(4, round(transitions[0] * 0.25)), transitions
    assert transition_deviation <= max(6, transition_mean * 0.36), transitions
    assert max(transitions) <= 2 * min(transitions), transitions

    args.output.mkdir(parents=True, exist_ok=True)
    for index, frame in enumerate(frames, 1):
        Image.fromarray(frame, "RGBA").save(args.output / f"fountain_f{index}.png", optimize=False)
    sheet = np.concatenate(frames, axis=1)
    sheet_path = args.output / "fountain_sheet.png"
    Image.fromarray(sheet, "RGBA").save(sheet_path, optimize=False)
    Image.fromarray(source, "RGBA").save(args.output / "fountain_base.png", optimize=False)

    mask_image = np.zeros_like(source)
    mask_image[allowed] = (255, 255, 255, 255)
    Image.fromarray(mask_image, "RGBA").save(args.output / "water_mask.png", optimize=False)
    overlay = source.copy()
    overlay[allowed, :3] = np.clip(
        overlay[allowed, :3].astype(np.uint16) // 2 + np.array([127, 0, 0], dtype=np.uint16), 0, 255
    ).astype(np.uint8)
    Image.fromarray(overlay, "RGBA").save(args.output / "mask_overlay.png", optimize=False)

    changed_ever = np.any(np.stack([np.any(frame != source, axis=2) for frame in frames]), axis=0)
    heatmap = np.zeros_like(source)
    heatmap[changed_ever] = (255, 64, 32, 255)
    Image.fromarray(heatmap, "RGBA").save(args.output / "diff_heatmap.png", optimize=False)
    save_preview(frames, args.output / "fountain_preview.gif")

    if args.runtime_sheet:
        args.runtime_sheet.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(sheet_path, args.runtime_sheet)

    report = {
        "frameSize": [width, height],
        "sheetSize": [width * FRAME_COUNT, height],
        "frames": FRAME_COUNT,
        "fps": FRAME_RATE,
        "waterMaskPixels": water_count,
        "waterColours": [list(colour) for colour in colours],
        "landingPoints": [list(point) for point in LANDINGS],
        "topJetTip": list(TOP_JET_TIP),
        "ringRadii": [2, 4, 6],
        "rippleOffsets": list(RIPPLE_OFFSETS),
        "changedPixelsFromBase": changed_from_base,
        "changedPercentFromBase": [round(value, 3) for value in changed_percent],
        "maximumAllowedChangedPixels": int(np.floor(water_count * CHANGE_LIMIT)),
        "transitionChangedPixels": transitions,
        "transitionMean": round(transition_mean, 3),
        "maximumTransitionDeviation": round(transition_deviation, 3),
        "frameEightToOneVsOneToTwoDelta": seam_delta,
        "outsideMaskChanges": outside,
        "rimGuardChanges": rim_changes,
        "newPaletteColours": new_colours,
        "maximumChangedPaleComponent": [max_pale_width, max_pale_height],
        "maskTouchesExcludedPixels": False,
        "checks": {
            "outsideMaskIdentical": True,
            "rimGuardUnchanged": True,
            "sourcePaletteOnly": True,
            "underThreePercentBudget": True,
            "ringRadiusAtMostSeven": True,
            "paleComponentsAtMostTwelvePixels": True,
            "loopSeamSimilar": True,
            "transitionsSimilar": True,
        },
        "sourceSha256": file_hash(args.source),
        "sheetSha256": file_hash(sheet_path),
    }
    (args.output / "animation_report.json").write_text(json.dumps(report, indent=2) + "\n")
    print("LANDING POINTS (x, y):", LANDINGS)
    print("TOP JET TIP (x, y):", TOP_JET_TIP)
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
